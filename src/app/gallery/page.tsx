"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import FaceSearchModal from "@/components/FaceSearchModal";

export default function GalleryPage({ params }: { params: { id: string } }) {
  const [allMedia, setAllMedia] = useState<any[]>([]);
  const [matchedPhotoIds, setMatchedPhotoIds] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchGalleryAssets() {
      // Fetch assets specific to this vault ID
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .eq("gallery_id", params.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Vault retrieval error:", error.message);
      }

      setAllMedia(data || []);
      setLoading(false);
    }
    fetchGalleryAssets();
  }, [params.id]);

  // If AI filter is active, show only matches. Otherwise, show all.
  const displayMedia = matchedPhotoIds 
    ? allMedia.filter(m => matchedPhotoIds.includes(m.id)) 
    : allMedia;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-serif italic text-[#003366]">
      Opening Vault...
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-serif italic text-[#003366]">Client Vault</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-2">
            Benedicta Visual Studio | Private Collection
          </p>
        </div>

        {/* AI SEARCH MOCKUP */}
        <div className="w-full md:w-80">
          <FaceSearchModal 
            allMedia={allMedia} 
            onResults={(ids) => setMatchedPhotoIds(ids)} 
          />
        </div>
      </header>

      {/* FILTER STATUS */}
      {matchedPhotoIds && (
        <div className="mb-8 flex items-center justify-between bg-[#003366]/5 p-4 rounded-2xl border border-[#003366]/10">
          <p className="text-xs font-bold text-[#003366] uppercase tracking-widest">
            AI Filter Active: {displayMedia.length} Photos Found
          </p>
          <button 
            onClick={() => setMatchedPhotoIds(null)} 
            className="text-[10px] font-bold uppercase text-red-500 hover:underline"
          >
            Show All Assets ×
          </button>
        </div>
      )}

      {/* PHOTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayMedia.map((item) => (
          <div key={item.id} className="group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
            <img 
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/client-galleries/${item.storage_path}`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt="Studio Asset"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {displayMedia.length === 0 && (
        <div className="py-32 text-center">
          <p className="font-serif italic text-slate-300">This vault is currently empty.</p>
        </div>
      )}
    </div>
  );
}