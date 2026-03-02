"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { uploadPhotos } from "./action";

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
          }} 
          className="space-y-10"
        >
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Target Vault</label>
            <select name="galleryId" className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none text-[#003366]" required>
              <option value="">Select Destination...</option>
              {galleries.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <input type="checkbox" name="is_public" id="is_public" className="w-5 h-5 accent-[#003366] cursor-pointer" />
            <label htmlFor="is_public" className="text-xs font-bold uppercase tracking-widest text-[#003366] cursor-pointer">
              Sync to Public Portfolio Gallery
            </label>
          </div>

          <div className="relative border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center group transition-all">
            <input type="file" name="files" multiple onChange={(e) => setSelectedCount(e.target.files?.length || 0)} className="absolute inset-0 opacity-0 cursor-pointer" required />
            <p className="text-xs font-bold uppercase tracking-widest text-[#003366]">
              {selectedCount > 0 ? `${selectedCount} Files Staged` : "Drop high-res files here"}
            </p>
          </div>

          <button disabled={isUploading} className="w-full py-6 bg-[#003366] text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-100">
            {isUploading ? "Processing..." : "Initialize Upload"}
          </button>
        </form>
      </section>
    </div>
  );
}