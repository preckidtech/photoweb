"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Senior Engineering: This component handles the biometric UI (FR-104).
 * It uses Framer Motion for a "High-Tech" luxury aesthetic.
 */
interface FaceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (descriptor: any) => void;
}

export default function FaceSearchModal({ isOpen, onClose, onScanComplete }: FaceSearchModalProps) {
  const [scanStatus, setScanStatus] = useState<"idle" | "uploading" | "scanning" | "success">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setScanStatus("idle");
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      simulateScan();
    }
  };

  const simulateScan = () => {
    setScanStatus("uploading");
    setTimeout(() => {
      setScanStatus("scanning");
      // Simulate the AI processing time (FR-104)
      setTimeout(() => {
        setScanStatus("success");
        // In production, this would pass the actual AI descriptor
        setTimeout(() => onClose(), 1500);
      }, 3000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brandBlue/40 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/20"
          >
            {/* MODAL HEADER */}
            <div className="p-10 text-center">
              <h2 className="text-2xl font-light text-brandBlue tracking-tight">AI Visual Search</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-2">Find your moments instantly</p>
            </div>

            {/* SCANNING AREA */}
            <div className="px-10 pb-12">
              <div className="relative aspect-square w-full bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex items-center justify-center overflow-hidden">
                
                {scanStatus === "idle" && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-4 group"
                  >
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-brandBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Selfie</span>
                  </button>
                )}

                {previewUrl && (
                  <div className="absolute inset-0 w-full h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    
                    {/* SCANNING OVERLAY (Laser Effect) */}
                    {scanStatus === "scanning" && (
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-brandBlue shadow-[0_0_15px_rgba(0,51,102,0.8)] z-10"
                      />
                    )}
                  </div>
                )}

                {/* STATUS OVERLAYS */}
                <AnimatePresence>
                  {scanStatus !== "idle" && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-brandBlue/60 backdrop-blur-sm flex items-center justify-center text-white"
                    >
                      <div className="text-center space-y-4">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">
                          {scanStatus === "uploading" && "Injecting Asset..."}
                          {scanStatus === "scanning" && "Biometric Analysis..."}
                          {scanStatus === "success" && "Identity Confirmed"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />

              <button 
                onClick={onClose}
                className="w-full mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] hover:text-brandBlue transition-colors"
              >
                Cancel Search
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}