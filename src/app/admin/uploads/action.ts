"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Senior Engineering: Handles Asset Injection (FR-11)
 * Processes multiple high-res files and updates the database.
 */
export async function uploadPhotos(formData: FormData) {
  const supabase = createAdminClient();
  
  // 1. Extraction of Data
  const files = formData.getAll("files") as File[];
  const galleryId = formData.get("galleryId") as string;
  const isPublic = formData.get("is_public") === "on";

  if (!files || files.length === 0 || !galleryId) {
    throw new Error("Engineering Error: Invalid upload payload. Gallery ID and Files are required.");
  }

  // 2. Parallel Processing (NFR-202: Performance)
  const uploadResults = await Promise.all(
    files.map(async (file) => {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const timestamp = Date.now();
      const storagePath = `${galleryId}/${timestamp}_${cleanFileName}`;

      // A. Inject into Private Cloud Storage
      const { error: storageError } = await supabase.storage
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
          is_public: isPublic,
          metadata: {
            original_filename: file.name,
            file_size: file.size,
            mime_type: file.type,
          }
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
  revalidatePath(`/gallery/${galleryId}`);
  if (isPublic) {
    revalidatePath("/gallery"); 
  }
  
  return uploadResults;
}

/**
 * Senior Engineering: Securely fetches active vaults for the UI dropdown.
 * Uses the Admin Client to bypass RLS restrictions.
 */
export async function getActiveVaults() {
  const supabase = createAdminClient(); 
  
  const { data, error } = await supabase
    .from("galleries")
    .select("id, name")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch vaults:", error.message);
    return [];
  }
  
  return data || [];
}