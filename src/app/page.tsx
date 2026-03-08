"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { getPublicPortfolio } from "./action";

/**
 * Senior Engineering: FR-101 (Public Portfolio).
 * Utilizes advanced Framer Motion hooks combined with dynamic Supabase data fetching.
 */
export default function LandingPage() {
  const containerRef = useRef(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Sophisticated opacity and scale transforms for the Hero section
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Fetch the public portfolio on load
  useEffect(() => {
    async function loadPortfolio() {
      const publicPhotos = await getPublicPortfolio();
      setPhotos(publicPhotos);
      setIsLoading(false);
    }
    loadPortfolio();
  }, []);

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
          <Link href="/gallery/access" className="group relative py-4 px-8 overflow-hidden rounded-full border border-[#003366]/20 inline-block">
            <span className="relative z-10 text-xs font-bold uppercase tracking-widest text-[#003366] group-hover:text-white transition-colors duration-500">
              Enter Private Vault
            </span>
            <div className="absolute inset-0 bg-[#003366] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </motion.div>
      </motion.section>

      {/* SECTION 2: THE CURATED PORTFOLIO */}
      <section className="relative z-20 bg-white py-40 px-6 rounded-t-[4rem] shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <h2 className="text-3xl md:text-5xl font-light text-[#003366] tracking-tight max-w-xl leading-tight">
              A curated selection of <span className="italic font-serif">moments</span> frozen in time.
            </h2>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Scroll to Explore</p>
          </div>

          {/* DYNAMIC MASONRY GRID */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {isLoading ? (
              // Luxury Skeleton Loader
              [1, 2, 3, 4, 5, 6].map((item) => (
                <div 
                  key={item} 
                  className="w-full bg-slate-100 rounded-[2rem] animate-pulse break-inside-avoid"
                  style={{ height: `${Math.floor(Math.random() * (500 - 300 + 1) + 300)}px` }} 
                />
              ))
            ) : photos.length > 0 ? (
              // Live Database Images
              photos.map((photo, index) => (
                <motion.div 
                  key={photo.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
                  className="group relative overflow-hidden rounded-[2rem] bg-slate-100 break-inside-avoid shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={photo.signedUrl} 
                    alt={photo.metadata?.original_filename || "Benedicta Studio Portfolio"}
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#003366]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                     <p className="text-white text-[10px] font-bold uppercase tracking-[0.3em] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                       View Collection
                     </p>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty State
              <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 italic">Portfolio is currently being curated.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PHILOSOPHY */}
      <section className="bg-[#003366] py-40 px-6 text-white text-center">
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
    </div>
  );
}