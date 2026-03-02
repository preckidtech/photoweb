"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { uploadPhotos } from "./action";

/**
 * Senior Engineering: Responsive Uploader with Visual Feedback (FR-11).
 * Optimized for mobile touch targets and real-time state updates.
 */
export default function AdminUploads() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchGalleries() {
      const { data } = await supabase.from("galleries").select("id, name").eq("is_active", true);
      if (data) setGalleries(data);
    }
    fetchGalleries();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <header className="mb-8 md:mb-12 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-light text-[#003366] tracking-tight italic font-serif">Asset Injection</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-2">
          Sync original assets to private storage
        </p>
      </header>

      <section className="bg-white p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-xl border border-slate-50">
        <form 
          action={async (formData) => {
            setIsUploading(true);
            try {
              await uploadPhotos(formData);
              alert("Injection Complete: Assets are now live.");
              setSelectedCount(0);
            } catch (e) {
              alert("Upload failed. Please check your connection.");
            } finally {
              setIsUploading(false);
            }
          }} 
          className="space-y-8 md:space-y-10"
        >
          {/* TARGET VAULT SELECTION */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Target Vault</label>
            <select 
              name="galleryId"
              className="w-full p-4 md:p-5 bg-slate-50 border-none rounded-2xl outline-none text-[#003366] text-sm focus:ring-2 focus:ring-[#003366]/10 transition-all"
              required
            >
              <option value="">Select a Destination...</option>
              {galleries.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* ADAPTIVE DROP ZONE */}
          <div className="relative group">
            <div className="w-full py-16 md:py-24 bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 transition-all">
              <div className="p-4 bg-white rounded-full shadow-sm text-[#003366]">
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="text-center px-4">
                <p className="text-xs font-bold uppercase tracking-widest text-[#003366]">
                  {selectedCount > 0 ? `${selectedCount} Files Staged` : "Tap to select assets"}
                </p>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-tighter">RAW, JPEG, or PNG supported</p>
              </div>
            </div>
            <input 
              type="file" 
              name="files" 
              multiple 
              onChange={(e) => setSelectedCount(e.target.files?.length || 0)}
              className="absolute inset-0 opacity-0 cursor-pointer"
              required 
            />
          </div>

          {/* DYNAMIC ACTION BUTTON */}
          <button 
            disabled={isUploading}
            className="w-full py-5 md:py-6 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-100 disabled:text-slate-400"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Processing Injection...
              </>
            ) : (
              "Initialize Upload"
            )}
          </button>
        </form>
      </section>
    </div>
  );
}