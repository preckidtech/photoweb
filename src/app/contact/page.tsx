"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/**
 * Senior Engineering: This page handles lead generation with a focus on UX.
 * It includes field validation and luxury animations to match the brand.
 */
export default function BoutiqueInquiry() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants for staggered entry of form elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-brandWhite pt-40 pb-20 px-6">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto"
      >
        {/* HEADER SECTION: Establishing Authority */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-light text-brandBlue tracking-tight">
            Start a <span className="italic font-serif">Conversation</span>
          </h1>
          <p className="text-slate-400 mt-4 uppercase tracking-[0.3em] text-[10px] font-bold">
            Currently booking for Q3 & Q4 2026
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* LEFT COLUMN: Brand Info */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brandBlue mb-4">The Studio</h3>
              <p className="text-slate-500 font-light leading-relaxed">
                Based in Lagos, Nigeria.<br />
                Available for international travel and editorial commissions.
              </p>
            </div>
            
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brandBlue mb-4">Direct Contact</h3>
              <p className="text-slate-500 font-light">inquiry@benedicta.com</p>
              <p className="text-slate-500 font-light">+234 (0) 800 000 0000</p>
            </div>

            <div className="pt-8 border-t border-slate-200">
              <p className="text-xs italic font-serif text-slate-400">
                "Every great photograph begins with a shared vision."
              </p>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: The Luxury Form */}
          <motion.div variants={itemVariants} className="lg:col-span-3">
            <form className="space-y-8 bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. Precious Isaac" 
                    className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-brandBlue outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-2">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="hello@example.com" 
                    className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-brandBlue outline-none transition-all" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-2">Session Type</label>
                  <select className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-brandBlue outline-none transition-all appearance-none cursor-pointer">
                    <option>Wedding & Union</option>
                    <option>Editorial & Fashion</option>
                    <option>Lifestyle & Portrait</option>
                    <option>Corporate Branding</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-2">Event Date</label>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-brandBlue outline-none transition-all" 
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-400 ml-2">Your Vision</label>
                <textarea 
                  rows={5} 
                  placeholder="Tell me about the story you want to tell..." 
                  className="w-full bg-slate-50 border-none p-5 rounded-2xl focus:ring-2 focus:ring-brandBlue outline-none transition-all resize-none"
                  required 
                ></textarea>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting}
                className="w-full bg-brandBlue text-white py-6 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs shadow-2xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? "Sending..." : "Submit Inquiry"}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </motion.button>
              
              <p className="text-[10px] text-center text-slate-400 italic">
                Response time is typically within 24-48 business hours.
              </p>
            </form>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}