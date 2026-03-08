"use server";

import { createAdminClient } from "@/utils/supabase/server";

/**
 * Senior Engineering: Public Portfolio Fetcher.
 * Securely queries ONLY the media flagged as 'is_public: true' 
 * and limits the payload to keep the homepage lightning fast.
 */
export async function getPublicPortfolio() {
  const supabase = createAdminClient();
  
  // Fetch only public photos, order by newest, limit to 12 for speed
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error || !data) {
    console.error("Failed to fetch public portfolio:", error.message);
    return [];
  }

  // Generate secure temporary URLs for the homepage display
  const photosWithUrls = await Promise.all(
    data.map(async (photo) => {
      const { data: urlData } = await supabase.storage
        .from("client-galleries")
        .createSignedUrl(photo.storage_path, 3600); // 1-hour expiration
      
      return { ...photo, signedUrl: urlData?.signedUrl };
    })
  );

  return photosWithUrls;
}