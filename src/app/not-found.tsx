"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Senior Engineering: The custom 404 page ensures the brand experience 
 * remains unbroken. It uses Framer Motion for a "Lost in the Clouds" 
 * aesthetic.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-brandWhite flex flex-col items-center justify-center px-6 text-center">
      
      {/* VISUAL ELEMENT: Animated "Lost" Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="relative mb-12"
      >
        <div className="text-[12rem] md:text-[18rem] font-light text-slate-100 tracking-tighter leading-none select-none">
          404
        </div>
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-brandBlue">
            Moment Not Found
          </p>
        </motion.div>
      </motion.div>

      {/* RECOVERY TEXT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-md space-y-8"
      >
        <h2 className="text-2xl font-light text-brandBlue tracking-tight">
          It seems this perspective <br /> 
          <span className="italic font-serif">doesn't exist yet.</span>
        </h2>
        
        <p className="text-sm text-slate-400 font-light leading-relaxed">
          The page you are looking for might have been moved, renamed, 
          or is part of a private vault that requires a direct link.
        </p>

        {/* RECOVERY ACTIONS */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
          <Link 
            href="/" 
            className="text-xs font-bold uppercase tracking-widest text-brandBlue border-b-2 border-brandBlue/10 hover:border-brandBlue transition-all pb-1"
          >
            Return Home
          </Link>
          <span className="hidden md:block text-slate-200">|</span>
          <Link 
            href="/gallery/access" 
            className="text-xs font-bold uppercase tracking-widest text-brandBlue border-b-2 border-brandBlue/10 hover:border-brandBlue transition-all pb-1"
          >
            Find a Vault
          </Link>
        </div>
      </motion.div>

      {/* DECORATIVE BRAND ELEMENT */}
      <div className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.8em] text-slate-200">
        Benedicta Okhunlun Studio
      </div>
    </div>
  );
}