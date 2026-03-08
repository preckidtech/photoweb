"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FaceSearchModal from "@/components/FaceSearchModal";
import { getVaultPhotos } from "./action";
// FIXED: Using useParams for Next.js 15 safety
import { useRouter, useParams } from "next/navigation"; 

export default function ClientGallery() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  
  const router = useRouter();
  const params = useParams(); // Safely grabs the ID from the URL

  useEffect(() => {
    const galleryId = params?.id as string;

    // Wait until Next.js has fully mounted the URL before fetching
    if (!galleryId) return;

    async function fetchPhotos() {
      const result = await getVaultPhotos(galleryId);

      // If they don't have the cookie (or if the ID was invalid), kick them out
      if (result.error === "unauthorized") {
        router.push(`/gallery/${galleryId}/login`);
        return;
      }

      if (result.photos) {
        setPhotos(result.photos);
      }
      setLoading(false);
    }

    fetchPhotos();
  }, [params, router]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        
        {/* VIP VAULT HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-light text-[#003366] tracking-tight italic font-serif">
              Your Private Collection
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs mt-4 uppercase tracking-[0.3em] font-bold">
              Securely Delivered Assets
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsAiModalOpen(true)}
              className="flex-1 md:flex-none px-6 py-4 bg-white border border-slate-200 text-[#003366] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              AI Face Search
            </button>
            <button className="flex-1 md:flex-none px-8 py-4 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl hover:bg-[#002244] transition-colors active:scale-95">
              Download Vault
            </button>
          </div>
        </header>

        {/* MASONRY PHOTO GRID */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <AnimatePresence>
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div 
                  key={i} 
                  className="w-full bg-slate-200 rounded-3xl animate-pulse break-inside-avoid"
                  style={{ height: `${Math.floor(Math.random() * (400 - 250 + 1) + 250)}px` }} 
                />
              ))
            ) : photos.length > 0 ? (
              photos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="relative group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 break-inside-avoid"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.signedUrl} 
                    alt={photo.metadata?.original_filename || "Client Asset"} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-[#003366]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <a 
                      href={photo.signedUrl} 
                      download={photo.metadata?.original_filename || "download"}
                      className="p-5 bg-white rounded-full text-[#003366] shadow-2xl hover:scale-110 transition-transform"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-32 text-center">
                <p className="text-slate-400 text-sm font-medium">This vault is currently empty. Benedicta Visual Studio is preparing your assets.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FaceSearchModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)}
        onScanComplete={(descriptor: any) => console.log("AI Scan Complete", descriptor)}
      />
    </div>
  );
}