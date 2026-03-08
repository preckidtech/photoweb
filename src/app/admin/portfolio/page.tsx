"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";

// Utilizing the absolute path to prevent module errors
import { deleteSingleAsset } from "@/app/admin/action"; 

export default function AdminPortfolioManager() {
  const [publicAssets, setPublicAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchPublicAssets();
  }, []);

  async function fetchPublicAssets() {
    setLoading(true);
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load portfolio:", error.message);
      setLoading(false);
      return;
    }

    // Securely fetch Signed URLs
    if (data && data.length > 0) {
      const photosWithUrls = await Promise.all(
        data.map(async (photo) => {
          const { data: urlData } = await supabase.storage
            .from("client-galleries")
            .createSignedUrl(photo.storage_path, 3600);
            
          return { ...photo, signedUrl: urlData?.signedUrl };
        })
      );
      setPublicAssets(photosWithUrls.filter(p => p.signedUrl));
    } else {
      setPublicAssets([]);
    }
    
    setLoading(false);
  }

  const handleDelete = async (mediaId: string, storagePath: string) => {
    const confirmDelete = window.confirm("Are you sure you want to permanently erase this asset? It will be removed from your public portfolio.");
    if (!confirmDelete) return;

    setDeletingId(mediaId);
    
    const result = await deleteSingleAsset(mediaId, storagePath);
    
    if (result.success) {
      // Instantly remove it from the UI
      setPublicAssets(prev => prev.filter(asset => asset.id !== mediaId));
    } else {
      alert(`Deletion Failed: ${result.error}`);
    }
    
    setDeletingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 py-10 md:py-16">
      <header className="mb-12 border-b border-slate-200 pb-8">
        <h1 className="text-3xl md:text-4xl font-light text-[#003366] tracking-tight italic font-serif">Portfolio Curation</h1>
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 mt-3">Manage Public Assets</p>
      </header>

      <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] shadow-xl border border-slate-50 min-h-[500px]">
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-[#003366]/20 border-t-[#003366] rounded-full animate-spin" />
          </div>
        ) : publicAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-slate-400 text-sm font-medium italic font-serif">Your public portfolio is currently empty.</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-300 font-bold mt-2">Inject assets to build your showroom</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Live Showroom Assets</p>
              <p className="text-[10px] md:text-xs font-bold text-[#003366] bg-slate-50 px-4 py-2 rounded-full border border-slate-100">{publicAssets.length} Published</p>
            </div>

            {/* SENIOR ENGINEERING: Forced flex row with gap */}
            <div className="flex flex-row flex-wrap gap-6 pt-4 pr-4">
              <AnimatePresence>
                {publicAssets.map((asset) => (
                  <motion.div 
                    key={asset.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    // HARD LOCK: Inline styles force the browser to obey these exact dimensions
                    style={{ width: "120px", height: "120px", flexShrink: 0, position: "relative" }}
                    className="group"
                  >
                    
                    {/* HARD LOCK: The image cannot stretch past its 120px parent */}
                    <img 
                      src={asset.signedUrl}
                      alt="Portfolio Asset"
                      style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "16px" }}
                      className={`shadow-sm border border-slate-200 transition-all duration-300 group-hover:scale-105 ${deletingId === asset.id ? 'opacity-30 grayscale' : ''}`}
                    />

                    {/* HARD LOCK: The delete button is forced to the top right with maximum z-index */}
                    <button
                      onClick={() => handleDelete(asset.id, asset.storage_path)}
                      disabled={deletingId === asset.id}
                      style={{ position: "absolute", top: "-10px", right: "-10px", zIndex: 9999 }}
                      className="flex items-center justify-center w-8 h-8 bg-red-600 text-white rounded-full border-2 border-white shadow-xl hover:bg-red-700 hover:scale-110 active:scale-95 transition-all disabled:bg-slate-400 cursor-pointer"
                      title="Erase Asset"
                    >
                      {deletingId === asset.id ? (
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
                          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}