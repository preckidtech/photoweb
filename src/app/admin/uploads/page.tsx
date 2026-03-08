"use client";

import { useState, useEffect } from "react";
// Senior Engineering: Importing both the upload engine and the secure vault fetcher
import { uploadPhotos, getActiveVaults } from "./action"; 

export default function AdminUploads() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Instantly fetches real vaults bypassing security blocks on component mount
  useEffect(() => {
    async function fetchGalleries() {
      const vaults = await getActiveVaults();
      setGalleries(vaults);
    }
    fetchGalleries();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-[#003366] tracking-tight italic font-serif">Asset Injection</h1>
      </header>

      <section className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-slate-50">
        <form 
          action={async (formData) => {
            setIsUploading(true);
            await uploadPhotos(formData);
            setIsUploading(false);
            setSelectedCount(0);
            alert("Upload Complete.");
            // Reset the form visually after a successful upload
            (document.getElementById('upload-form') as HTMLFormElement).reset();
          }} 
          id="upload-form"
          className="space-y-10"
        >
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Target Vault</label>
            <select name="galleryId" className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none text-[#003366] cursor-pointer" required>
              <option value="">Select Destination...</option>
              {galleries.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <input type="checkbox" name="is_public" id="is_public" className="w-5 h-5 accent-[#003366] cursor-pointer" />
            <label htmlFor="is_public" className="text-xs font-bold uppercase tracking-widest text-[#003366] cursor-pointer">
              Sync to Public Portfolio Gallery
            </label>
          </div>

          <div className="relative border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center group transition-all hover:border-[#003366]/30 hover:bg-slate-50/50">
            <input 
              type="file" 
              name="files" 
              multiple 
              onChange={(e) => setSelectedCount(e.target.files?.length || 0)} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              required 
            />
            <div className="space-y-2 pointer-events-none">
              <svg className="w-8 h-8 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-xs font-bold uppercase tracking-widest text-[#003366]">
                {selectedCount > 0 ? `${selectedCount} Files Staged` : "Drop high-res files here"}
              </p>
            </div>
          </div>

          <button 
            disabled={isUploading} 
            className="w-full py-6 bg-[#003366] text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-400 transition-all active:scale-95 hover:bg-[#002244]"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing Upload...</span>
              </>
            ) : "Initialize Upload"}
          </button>
        </form>
      </section>
    </div>
  );
}