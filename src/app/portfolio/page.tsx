"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPaginatedPortfolio } from "./action";

export default function PortfolioPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // SENIOR ENGINEERING: Pagination & Lightbox State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // WhatsApp Configuration
  const whatsappNumber = "447918915682"; // IMPORTANT: Update this number
  const whatsappMessage = encodeURIComponent("Hello Benedicta Visual Studio, I am looking at your portfolio and would like to inquire about a booking.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  // Fetch the data whenever the currentPage changes
  useEffect(() => {
    async function fetchPortfolio() {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: "smooth" }); // Smoothly scroll to top on page change
      
      const result = await getPaginatedPortfolio(currentPage, 12); // Fetch 12 items per page
      setPhotos(result.photos);
      setTotalPages(result.totalPages);
      
      setIsLoading(false);
    }
    fetchPortfolio();
  }, [currentPage]);

  // Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev! + 1));
      if (e.key === "ArrowLeft") setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev! - 1));
      if (e.key === "Escape") setSelectedIndex(null);
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex, photos.length]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-32 px-6 md:px-12 relative">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER SECTION */}
        <header className="mb-20 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-light text-[#003366] tracking-tight italic font-serif">
              The Collection
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs mt-4 uppercase tracking-[0.3em] font-bold">
              Public Archives & Editorials
            </p>
          </motion.div>

          {/* Page Counter Indicator */}
          {!isLoading && totalPages > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#003366] font-mono text-sm tracking-widest bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
              PAGE {currentPage} OF {totalPages}
            </motion.div>
          )}
        </header>

        {/* RESPONSIVE MASONRY GRID */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Transition Skeleton Loaders
              [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <motion.div 
                  key={`skeleton-${item}`}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full bg-slate-200 rounded-3xl animate-pulse break-inside-avoid"
                  style={{ height: `${Math.floor(Math.random() * (500 - 300 + 1) + 300)}px` }} 
                />
              ))
            ) : photos.length > 0 ? (
              // Live Images
              photos.map((photo, index) => (
                <motion.div 
                  key={photo.id}
                  onClick={() => setSelectedIndex(index)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl bg-white break-inside-avoid shadow-sm hover:shadow-2xl transition-all duration-500 cursor-zoom-in border border-slate-50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.signedUrl} 
                    alt={photo.metadata?.original_filename || "Public Asset"}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  
                  <div className="absolute inset-0 bg-[#003366]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                     <p className="text-white text-[10px] font-bold uppercase tracking-[0.3em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                       Expand Canvas
                     </p>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty State
              <div className="col-span-full py-32 text-center">
                <p className="text-slate-400 italic">The archives are currently empty.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* ELEGANT PAGINATION CONTROLS */}
        {!isLoading && totalPages > 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-24 flex items-center justify-center gap-6"
          >
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-slate-200 flex items-center justify-center text-[#003366] hover:bg-[#003366] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#003366] disabled:cursor-not-allowed active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all ${currentPage === i + 1 ? "bg-[#003366] scale-125" : "bg-slate-300 hover:bg-slate-400"}`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-slate-200 flex items-center justify-center text-[#003366] hover:bg-[#003366] hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#003366] disabled:cursor-not-allowed active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </motion.div>
        )}
      </div>

      {/* THE CINEMATIC LIGHTBOX */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pt-24 pb-6 px-4 md:px-12"
          >
            <div className="absolute top-24 right-6 md:right-12 z-50">
              <button onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }} className="w-10 h-10 md:w-12 md:h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="relative w-full h-full flex items-center justify-center">
              <motion.img
                key={selectedIndex}
                src={photos[selectedIndex].signedUrl}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                onClick={(e) => e.stopPropagation()} 
              />
              
              <button onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev! - 1)); }} className="absolute left-0 md:left-4 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md active:scale-95">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <button onClick={(e) => { e.stopPropagation(); setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev! + 1)); }} className="absolute right-0 md:right-4 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md active:scale-95">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[10px] md:text-xs tracking-[0.3em] font-bold">
              {selectedIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP BUTTON (z-[100] to hover over everything except the Lightbox) */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-[0_10px_40px_rgba(37,211,102,0.4)] transition-all active:scale-95 group"
        aria-label="Contact on WhatsApp"
      >
        <svg className="w-7 h-7 md:w-8 md:h-8 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        
        <span className="absolute right-20 bg-white text-[#1d1d1f] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
          Chat with Benedicta
        </span>
      </motion.a>
    </div>
  );
}