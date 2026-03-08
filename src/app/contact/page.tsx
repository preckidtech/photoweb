"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function BoutiqueInquiry() {
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] antialiased selection:bg-[#003366] selection:text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-24 md:py-48">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-20">
          
          {/* COLUMN 1: EDITORIAL ANCHOR */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:w-[40%] lg:sticky lg:top-48 space-y-10"
          >
            <div className="space-y-6">
              <p className="text-[12px] font-bold tracking-[0.4em] uppercase text-slate-400">
                Inquiry Portal
              </p>
              <h1 className="text-[42px] md:text-[64px] font-semibold leading-[1.05] tracking-[-0.03em]">
                Crafting <br />
                <span className="text-slate-300 font-serif italic font-light">legacies.</span>
              </h1>
            </div>
            
            <p className="text-[19px] leading-relaxed text-slate-500 font-light max-w-sm">
              Currently accepting private commissions for the 2026/27 season.
            </p>

            <div className="pt-12 grid grid-cols-2 gap-8 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1d1d1f]">Digital</p>
                <p className="text-base text-slate-400 mt-2">studio@benedicta.com</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1d1d1f]">Studio</p>
                <p className="text-base text-slate-400 mt-2">United Kingdom</p>
              </div>
            </div>
          </motion.div>

          {/* COLUMN 2: PRECISION INTERFACE */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full lg:w-[50%]"
          >
            <form className="space-y-14" onSubmit={(e) => { e.preventDefault(); setIsPending(true); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                <div className="group relative">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300 group-focus-within:text-[#003366] transition-colors">Client Name</label>
                  <input type="text" placeholder="Precious Isaac" className="w-full bg-transparent border-b border-slate-100 py-4 text-[17px] outline-none focus:border-[#003366] transition-all placeholder:text-slate-100" required />
                </div>
                <div className="group relative">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300 group-focus-within:text-[#003366] transition-colors">Email Address</label>
                  <input type="email" placeholder="johndoe@example.com" className="w-full bg-transparent border-b border-slate-100 py-4 text-[17px] outline-none focus:border-[#003366] transition-all placeholder:text-slate-100" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                <div className="group relative">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300 group-focus-within:text-[#003366] transition-colors">Session</label>
                  <select className="w-full bg-transparent border-b border-slate-100 py-4 text-[17px] outline-none appearance-none cursor-pointer text-slate-400 focus:text-[#1d1d1f]">
                    <option>Editorial</option>
                    <option>Wedding</option>
                    <option>Portrait</option>
                    <option>Personal</option>
                  </select>
                </div>
                <div className="group relative">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300 group-focus-within:text-[#003366] transition-colors">Date</label>
                  <input type="date" className="w-full bg-transparent border-b border-slate-100 py-4 text-[17px] outline-none text-slate-400 focus:text-[#1d1d1f]" required />
                </div>
              </div>

              <div className="group relative">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300 group-focus-within:text-[#003366] transition-colors">The Vision</label>
                <textarea rows={4} placeholder="What story are we telling?" className="w-full bg-transparent border-b border-slate-100 py-4 text-[17px] outline-none resize-none focus:border-[#003366] transition-all placeholder:text-slate-100" required />
              </div>

              <div className="pt-6">
                <button 
                  disabled={isPending}
                  className="px-14 py-5 bg-[#003366] text-white text-[13px] font-bold uppercase tracking-[0.3em] rounded-full shadow-2xl hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center gap-4 disabled:bg-slate-100 disabled:text-slate-300"
                >
                  {isPending ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                  ) : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}