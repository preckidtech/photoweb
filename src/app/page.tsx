"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { getPublicPortfolio } from "./action";

/**
 * Senior Engineering: FR-101 (Public Portfolio Homepage).
 * Features an integrated 12-image teaser, an interactive cinematic lightbox, 
 * parallax effects, and a floating WhatsApp lead generator.
 */
export default function LandingPage() {
  const containerRef = useRef(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // SENIOR ENGINEERING: Lightbox State Management
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const whatsappNumber = "447918915682"; // IMPORTANT: Update this number
  const whatsappMessage = encodeURIComponent("Hello Benedicta Visual Studio, I am on your website and would like to inquire about a booking.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    async function loadPortfolio() {
      const publicPhotos = await getPublicPortfolio();
      setPhotos(publicPhotos);
      setIsLoading(false);
    }
    loadPortfolio();
  }, []);

  // SENIOR ENGINEERING: Keyboard Navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev! + 1));
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev! - 1));
      }
      if (e.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    // Lock body scroll when lightbox is open
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

  // Navigation Handlers
  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === photos.length - 1 ? 0 : prev! + 1));
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIndex((prev) => (prev === 0 ? photos.length - 1 : prev! - 1));
  };

  return (
    <div ref={containerRef} className="relative bg-[#F8F9FA]">
      
      {/* SECTION 1: THE CINEMATIC HERO */}
      <motion.section 
        style={{ opacity, scale }}
        className="h-screen flex flex-col items-center justify-center text-center px-6 sticky top-0"
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-[#003366] mb-6"
        >
          International Visual Artist
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-8xl lg:text-9xl font-light tracking-tighter leading-[0.9] text-[#003366]"
        >
          Minimalism <br /> 
          <span className="font-serif italic text-slate-400">In Motion.</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12"
        >
          <Link href="/gallery/access" className="group relative py-4 px-8 overflow-hidden rounded-full border border-[#003366]/20 inline-block bg-white shadow-sm hover:shadow-xl transition-all">
            <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-[#003366] group-hover:text-white transition-colors duration-500">
              Enter Private Vault
            </span>
            <div className="absolute inset-0 bg-[#003366] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </motion.div>
      </motion.section>

      {/* SECTION 2: THE CURATED PORTFOLIO TEASER */}
      <section className="relative z-20 bg-white py-32 md:py-40 px-6 rounded-t-[3rem] md:rounded-t-[4rem] shadow-[0_-20px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 gap-6">
            <h2 className="text-3xl md:text-5xl font-light text-[#003366] tracking-tight max-w-xl leading-tight">
              A curated selection of <span className="italic font-serif">moments</span> frozen in time.
            </h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Latest Masterpieces</p>
          </div>

          {/* DYNAMIC MASONRY GRID (Max 12 images) */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div 
                  key={item} 
                  className="w-full bg-slate-100 rounded-[2rem] animate-pulse break-inside-avoid"
                  style={{ height: `${Math.floor(Math.random() * (500 - 300 + 1) + 300)}px` }} 
                />
              ))
            ) : photos.length > 0 ? (
              photos.map((photo, index) => (
                <motion.div 
                  key={photo.id}
                  onClick={() => setSelectedIndex(index)} // Opens Lightbox
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
                  className="group relative overflow-hidden rounded-[2rem] bg-slate-100 break-inside-avoid shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-zoom-in"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.signedUrl} 
                    alt={photo.metadata?.original_filename || "Benedicta Studio Portfolio"}
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
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 italic">Portfolio is currently being curated.</p>
              </div>
            )}
          </div>

          {/* THE DEEP DIVE ROUTER */}
          <div className="mt-20 flex justify-center">
            <Link 
              href="/portfolio" 
              className="px-10 py-5 bg-white border border-slate-200 text-[#003366] text-[11px] font-bold uppercase tracking-[0.3em] rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-[#003366]/30 transition-all active:scale-95"
            >
              Explore Full Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PHILOSOPHY */}
      <section className="bg-[#003366] py-32 md:py-40 px-6 text-white text-center relative z-20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-10"
          >
            <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400">The Philosophy</h3>
            <p className="text-2xl md:text-4xl font-light leading-relaxed">
              "I don't just take photos; I capture the invisible threads of <span className="italic font-serif">emotion</span> that connect people to their most precious memories."
            </p>
            <div className="h-px w-20 bg-white/20 mx-auto mt-10" />
            <p className="text-xs font-serif italic text-slate-300">— Benedicta Okhunlun</p>
          </motion.div>
        </div>
      </section>

      {/* FLOATING WHATSAPP BUTTON */}
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

      {/* SENIOR ENGINEERING: THE CINEMATIC LIGHTBOX */}
      {/* z-[90] keeps it perfectly behind the Header which is z-[100] */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedIndex(null)}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center pt-24 pb-6 px-4 md:px-12"
          >
            {/* Top Bar for Close Button */}
            <div className="absolute top-24 right-6 md:right-12 z-50">
              <button 
                onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-md"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Image Display */}
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.img
                key={selectedIndex}
                src={photos[selectedIndex].signedUrl}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the image itself
              />

              {/* Navigation Arrows */}
              <button 
                onClick={showPrev}
                className="absolute left-0 md:left-4 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md active:scale-95"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button 
                onClick={showNext}
                className="absolute right-0 md:right-4 w-12 h-12 md:w-16 md:h-16 bg-white/5 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md active:scale-95"
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.3em] font-bold">
              {selectedIndex + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}