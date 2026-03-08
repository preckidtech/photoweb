"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

/**
 * Senior Engineering: The Public Showroom (FR-101).
 * Fetches only assets flagged as 'is_public: true' and utilizes
 * short-lived signed URLs for maximum asset protection.
 */
export default function PublicPortfolio() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchPublicGallery() {
      // 1. Fetch only media where is_public is TRUE
      const { data: mediaData, error: dbError } = await supabase
        .from("media")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false });

      if (dbError) {
        console.error("Failed to fetch public assets:", dbError.message);
        setIsLoading(false);
        return;
      }

      // 2. Generate secure, expiring Signed URLs for image rendering
      if (mediaData && mediaData.length > 0) {
        const photosWithUrls = await Promise.all(
          mediaData.map(async (photo) => {
            const { data: urlData } = await supabase.storage
              .from("client-galleries")
              .createSignedUrl(photo.storage_path, 3600); // 1-hour expiration

            return { ...photo, signedUrl: urlData?.signedUrl };
          })
        );
        setPhotos(photosWithUrls);
      }
      
      setIsLoading(false);
    }

    fetchPublicGallery();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* EDITORIAL HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-light text-[#003366] tracking-tight italic font-serif">
              Curated Masterpieces
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs mt-4 uppercase tracking-[0.3em] font-bold">
              Benedicta Visual Studio • Public Portfolio
            </p>
          </motion.div>
        </header>

        {/* MASONRY GRID (Highly Responsive: 1 col mobile, 2 col tablet, 3/4 col desktop) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <AnimatePresence>
            {isLoading ? (
              // Luxury Skeleton Loading State
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="w-full bg-slate-200 rounded-3xl animate-pulse break-inside-avoid"
                  style={{ height: `${Math.floor(Math.random() * (400 - 250 + 1) + 250)}px` }} 
                />
              ))
            ) : photos.length > 0 ? (
              // Live Rendered Photos
              photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="relative group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 break-inside-avoid cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.signedUrl}
                    alt={photo.metadata?.original_filename || "Portfolio Asset"}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay for Premium Feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">
                      Studio Vault
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty State if no public photos exist
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="col-span-full py-32 text-center"
              >
                <p className="text-slate-400 text-sm font-medium">
                  The portfolio is currently being curated. Check back soon.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}