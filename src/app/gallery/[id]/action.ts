"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * Senior Engineering: Secure Vault Fetcher (FR-101)
 * Validates the HTTP-only cookie before returning any highly sensitive media.
 */
export async function getVaultPhotos(galleryId: string) {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get(`vault_access_${galleryId}`);

  // 1. Strict Security Gate
  if (!accessCookie || accessCookie.value !== "granted") {
    return { error: "unauthorized" };
  }

  // 2. Fetch using Admin Client (Bypasses Database Frontend Blocks)
  const supabase = createAdminClient();
  
  const { data: mediaData, error: dbError } = await supabase
    .from("media")
    .select("*")
    .eq("gallery_id", galleryId)
    .order("created_at", { ascending: false });

  if (dbError || !mediaData) {
    console.error("Database Fetch Error:", dbError?.message);
    return { photos: [] };
  }

  // 3. Generate Expiring Signed URLs for every image
  const photosWithUrls = await Promise.all(
    mediaData.map(async (photo) => {
      const { data } = await supabase.storage
        .from("client-galleries")
        .createSignedUrl(photo.storage_path, 3600); // Links die after 1 hour
      
      return { ...photo, signedUrl: data?.signedUrl };
    })
  );

  return { photos: photosWithUrls };
}