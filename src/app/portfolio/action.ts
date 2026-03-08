"use server";

import { createAdminClient } from "@/utils/supabase/server";

/**
 * Senior Engineering: Paginated Portfolio Fetcher.
 * Calculates exact database ranges to minimize payload size and maximize speed.
 */
export async function getPaginatedPortfolio(page: number = 1, limit: number = 12) {
  const supabase = createAdminClient();
  
  // Mathematical range calculation for PostgreSQL
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Fetch data AND the exact total count of public photos
  const { data, count, error } = await supabase
    .from("media")
    .select("*", { count: "exact" })
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !data) {
    console.error("Failed to fetch paginated portfolio:", error.message);
    return { photos: [], totalPages: 0 };
  }

  // Generate secure temporary URLs for the current page's display
  const photosWithUrls = await Promise.all(
    data.map(async (photo) => {
      const { data: urlData } = await supabase.storage
        .from("client-galleries")
        .createSignedUrl(photo.storage_path, 3600); 
      
      return { ...photo, signedUrl: urlData?.signedUrl };
    })
  );

  return {
    photos: photosWithUrls,
    totalPages: count ? Math.ceil(count / limit) : 0
  };
}