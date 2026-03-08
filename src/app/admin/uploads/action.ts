"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * SENIOR ENGINEERING: Optimized Asset Injection
 * This handles the file upload and the vault list retrieval.
 */

export async function uploadPhotos(formData: FormData) {
  const supabase = createAdminClient();
  const file = formData.get("files") as File;
  const galleryIdRaw = formData.get("galleryId") as string;
  const isPublic = formData.get("is_public") === "on" || galleryIdRaw === "public_only";
  const finalGalleryId = galleryIdRaw === "public_only" ? null : galleryIdRaw;

  if (!file) throw new Error("No file provided.");

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
    const timestamp = Date.now();
    const folderPath = finalGalleryId ? finalGalleryId : "public-portfolio";
    const storagePath = `${folderPath}/${timestamp}_${cleanFileName}`;

    // 1. Upload to Storage
    const { error: storageError } = await supabase.storage
      .from("client-galleries")
      .upload(storagePath, file);

    if (storageError) throw new Error(storageError.message);

    // 2. Insert into Database
    const { error: dbError } = await supabase.from("media").insert([{
      gallery_id: finalGalleryId,
      storage_path: storagePath,
      is_public: isPublic,
      face_descriptors: null, 
      metadata: { original_filename: file.name, file_size: file.size }
    }]);

    if (dbError) throw new Error(dbError.message);

    revalidatePath("/");
    if (finalGalleryId) revalidatePath(`/gallery/${finalGalleryId}`);
    
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * FIX: Fetches ALL vaults to ensure the dropdown isn't empty.
 */
export async function getActiveVaults() {
  const supabase = createAdminClient(); 
  
  // We remove the .eq("is_active", true) filter to troubleshoot the empty list
  const { data, error } = await supabase
    .from("galleries")
    .select("id, name")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Vault Error:", error.message);
    return [];
  }

  return data || [];
}