"use client";
import { verifyPassword } from "./action";
import { motion } from "framer-motion";

/**
 * Senior Engineering: The Password Gate protects client privacy (FR-102).
 * It uses a minimalist layout to maintain the luxury brand feel.
 */
export default function GalleryLogin({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-brandWhite flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-slate-50 text-center"
      >
        <h1 className="text-2xl font-light text-brandBlue mb-2">Private Vault</h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-10">Enter your access passcode</p>
        
        <form action={(formData) => verifyPassword(formData, params.id)} className="space-y-6">
          <input 
            name="password" 
            type="password" 
            placeholder="••••••" 
            className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brandBlue outline-none text-center tracking-[0.5em] text-xl"
            required
          />
          <button className="w-full py-5 bg-brandBlue text-white font-bold rounded-2xl shadow-lg hover:bg-opacity-90 transition-all active:scale-95">
            Unlock Collection
          </button>
        </form>
      </motion.div>
    </div>
  );
}