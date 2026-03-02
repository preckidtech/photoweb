"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Senior Engineering: This Server Action handles Requirement FR-11 (Asset Injection).
 * It processes a "FormData" object containing multiple high-resolution files.
 */
export async function uploadPhotos(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Extraction of Data
  const files = formData.getAll("files") as File[];
  const galleryId = formData.get("galleryId") as string;

  if (!files || files.length === 0 || !galleryId) {
    throw new Error("Engineering Error: Invalid upload payload. Gallery ID and Files are required.");
  }

  // 2. Parallel Processing (NFR-202: Performance)
  // We use Promise.all to trigger multiple uploads at once for speed.
  const uploadResults = await Promise.all(
    files.map(async (file) => {
      // Standardize the filename: Remove special characters that break URLs
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const timestamp = Date.now();
      const storagePath = `${galleryId}/${timestamp}_${cleanFileName}`;

      // A. Inject into Private Cloud Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("client-galleries")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (storageError) {
        console.error(`Upload failed for ${file.name}:`, storageError.message);
        return { success: false, fileName: file.name };
      }

      // B. Catalog in the PostgreSQL 'media' Table
      const { error: dbError } = await supabase.from("media").insert([
        {
          gallery_id: galleryId,
          storage_path: storagePath,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          is_public: false, // Default to private for client vaults
        },
      ]);

      if (dbError) {
        console.error(`Database indexing failed for ${file.name}:`, dbError.message);
        return { success: false, fileName: file.name };
      }

      return { success: true, fileName: file.name };
    })
  );

  // 3. Cache Invalidation (Consistency)
  // Ensures the client's gallery feed shows the new photos immediately.
  revalidatePath(`/gallery/${galleryId}`);
  
  return uploadResults;
}