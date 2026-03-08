"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Senior Engineering: Asset Injection Engine.
 * Upgraded to handle both VIP Vaults and Direct-to-Portfolio uploads.
 */
export async function uploadPhotos(formData: FormData) {
  const supabase = createAdminClient();
  
  const files = formData.getAll("files") as File[];
  const galleryIdRaw = formData.get("galleryId") as string;
  
  // Logical Router: If no vault is selected, it MUST be public. Otherwise, read the checkbox.
  const isPublic = galleryIdRaw === "public_only" ? true : formData.get("is_public") === "on";
  
  // Set the database gallery ID to null if it's a direct public upload
  const finalGalleryId = galleryIdRaw === "public_only" ? null : galleryIdRaw;

  if (!files || files.length === 0) {
    throw new Error("Engineering Error: No files provided.");
  }

  const uploadResults = await Promise.all(
    files.map(async (file) => {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const timestamp = Date.now();
      
      // Store in a "public-portfolio" folder if no vault, otherwise use the vault ID
      const folderPath = finalGalleryId ? finalGalleryId : "public-portfolio";
      const storagePath = `${folderPath}/${timestamp}_${cleanFileName}`;

      // A. Inject into Cloud Storage
      const { error: storageError } = await supabase.storage
        .from("client-galleries")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (storageError) {
        console.error(`Upload failed for ${file.name}:`, storageError.message);
        return { success: false, fileName: file.name };
      }

      // B. Catalog in the PostgreSQL 'media' Table
      const { error: dbError } = await supabase.from("media").insert([
        {
          gallery_id: finalGalleryId,
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

  // Cache Invalidation: Ensure the public homepage instantly updates
  revalidatePath("/"); 
  if (finalGalleryId) revalidatePath(`/gallery/${finalGalleryId}`);
  
  return uploadResults;
}

/**
 * Senior Engineering: Securely fetches active vaults for the UI dropdown.
 */
export async function getActiveVaults() {
  const supabase = createAdminClient(); 
  const { data, error } = await supabase
    .from("galleries")
    .select("id, name")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}