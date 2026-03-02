"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import FaceSearchModal from "@/components/FaceSearchModal";

/**
 * Senior Engineering: This is the core delivery interface (FR-101).
 * It uses a Masonry Grid and Signed URL generation for maximum security.
 */
export default function ClientGallery({ params }: { params: { id: string } }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchPhotos = async () => {
      // 1. Fetch Media Metadata from PostgreSQL
      const { data: mediaData, error: dbError } = await supabase
        .from("media")
        .select("*")
        .eq("gallery_id", params.id);

      if (dbError) {
        console.error("Database Error:", dbError.message);
        return;
      }

      // 2. Security: Generate Temporary Signed URLs for Private Storage
      // These links expire after 1 hour to prevent unauthorized link sharing.
      const photosWithUrls = await Promise.all(
        mediaData.map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from("client-galleries")
            .createSignedUrl(photo.storage_path, 3600);
          
          return { ...photo, signedUrl: urlData?.signedUrl };
        })
      );

      setPhotos(photosWithUrls);
      setLoading(false);
    };

    fetchPhotos();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-brandWhite pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* VAULT HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-light text-brandBlue tracking-tight">Your Collection</h1>
            <p className="text-slate-400 text-xs mt-2 uppercase tracking-[0.3em] font-bold">
              Securely Delivered Assets
            </p>
          </motion.div>

          <div className="flex gap-4">
            {/* AI Search Trigger (FR-104) */}
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="px-6 py-4 bg-white border border-slate-100 text-brandBlue text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all"
            >
              AI Face Search
            </button>
            <button className="px-8 py-4 bg-brandBlue text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform">
              Download All
            </button>
          </div>
        </header>

        {/* MASONRY PHOTO GRID (FR-101) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          <AnimatePresence>
            {loading ? (
              // Luxury Skeleton Loading State
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[3/4] bg-slate-100 rounded-[2.5rem] animate-pulse" />
              ))
            ) : (
              photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group rounded-[2.5rem] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all break-inside-avoid"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.signedUrl} 
                    alt={photo.original_filename} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  {/* Individual Download Hover Overlay */}
                  <div className="absolute inset-0 bg-brandBlue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <a 
                      href={photo.signedUrl} 
                      download={photo.original_filename}
                      className="p-4 bg-white rounded-full text-brandBlue shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI SEARCH MODAL */}
      <FaceSearchModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)}
        onScanComplete={(descriptor) => console.log("AI Scan Complete", descriptor)}
      />
    </div>
  );
}