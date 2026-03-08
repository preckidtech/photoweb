"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FaceSearchModal from "@/components/FaceSearchModal";
import { getVaultPhotos } from "./action";
import { useRouter, useParams } from "next/navigation"; 
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function ClientGallery() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [filteredIds, setFilteredIds] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const galleryId = params?.id as string;
    if (!galleryId) return;

    async function fetchPhotos() {
      const result = await getVaultPhotos(galleryId);
      if (result.error === "unauthorized") {
        router.push(`/gallery/${galleryId}/login`);
        return;
      }
      if (result.photos) setPhotos(result.photos);
      setLoading(false);
    }
    fetchPhotos();
  }, [params, router]);

  // UI LOGIC: Switch between showing all photos or only AI matches
  const displayPhotos = filteredIds 
    ? photos.filter(p => filteredIds.includes(p.id)) 
    : photos;

  /**
   * SENIOR ENGINEERING: Forced Individual Download
   * Bypasses "Open in New Tab" behavior by fetching asset as a Blob.
   */
  const handleIndividualDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch (error) {
      console.error("Individual download failed:", error);
      window.open(url, "_blank");
    }
  };

  /**
   * VIP VAULT ENGINE: Bulk Download (Zip)
   * Bundles the current view into a professional archive.
   */
  const handleDownloadAll = async () => {
    if (displayPhotos.length === 0) return;
    setIsDownloadingAll(true);
    
    const zip = new JSZip();
    const folder = zip.folder("Benedicta_Visual_Studio_Collection");

    try {
      await Promise.all(
        displayPhotos.map(async (photo, index) => {
          const response = await fetch(photo.signedUrl);
          const blob = await response.blob();
          const fileName = photo.metadata?.original_filename || `Asset_${index + 1}.jpg`;
          folder?.file(fileName, blob);
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `Collection_${params?.id || "Vault"}.zip`);
    } catch (error) {
      console.error("Bulk download failed:", error);
      alert("Archive creation failed. Please try individual downloads.");
    } finally {
      setIsDownloadingAll(false);
    }
  };

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
            <button 
              onClick={handleDownloadAll}
              disabled={isDownloadingAll || loading}
              className="flex-1 md:flex-none px-8 py-4 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl hover:bg-[#002244] transition-all active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-3"
            >
              {isDownloadingAll ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Archiving...
                </>
              ) : filteredIds ? "Download Matches" : "Download Vault"}
            </button>
          </div>
        </header>

        {/* AI FILTER INDICATOR */}
        {filteredIds && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10 flex justify-center">
            <button 
              onClick={() => setFilteredIds(null)}
              className="px-6 py-2 bg-[#003366]/5 text-[#003366] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[#003366]/10 transition-all border border-[#003366]/10"
            >
              Showing {displayPhotos.length} Matches • Clear Filter
            </button>
          </motion.div>
        )}

        {/* MASONRY PHOTO GRID */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-full bg-slate-200 rounded-3xl animate-pulse break-inside-avoid" style={{ height: `350px` }} />
              ))
            ) : displayPhotos.length > 0 ? (
              displayPhotos.map((photo, index) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className="relative group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 break-inside-avoid mb-6"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.signedUrl} 
                    alt={photo.metadata?.original_filename || "Client Asset"} 
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-[#003366]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => handleIndividualDownload(photo.signedUrl, photo.metadata?.original_filename || `photo_${index}.jpg`)}
                      className="p-5 bg-white rounded-full text-[#003366] shadow-2xl hover:scale-110 transition-transform active:scale-90"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-32 text-center">
                <p className="text-slate-400 text-sm font-medium italic">No assets matching your search criteria were found.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FIXED AI MODAL BRIDGE */}
      <FaceSearchModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)}
        allPhotos={photos} // REQUIRED: Critical data bridge for the neural network
        onScanComplete={(matchedIds: string[]) => {
          setFilteredIds(matchedIds);
        }}
      />
    </div>
  );
}