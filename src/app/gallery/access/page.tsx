"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

/**
 * Senior Engineering: This page handles FR-101 (Public Directory).
 * It fetches active galleries and provides a high-end search experience.
 */
export default function GalleryAccess() {
  const [searchQuery, setSearchQuery] = useState("");
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  // Fetch only active, public-facing gallery names
  useEffect(() => {
    const fetchGalleries = async () => {
      const { data, error } = await supabase
        .from("galleries")
        .select("id, name, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data) setGalleries(data);
      setIsLoading(false);
    };
    fetchGalleries();
  }, []);

  // Real-time filter logic for the search bar
  const filteredGalleries = galleries.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brandWhite pt-40 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-light text-brandBlue tracking-tight">Client Access</h1>
          <p className="text-slate-400 mt-4 uppercase tracking-[0.3em] text-[10px] font-bold">
            Locate your private collection
          </p>
        </motion.div>

        {/* SEARCH INTERFACE */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-12"
        >
          <input 
            type="text"
            placeholder="Search by event name (e.g., 'Isaac Wedding')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-100 p-6 rounded-3xl shadow-xl focus:ring-2 focus:ring-brandBlue outline-none text-brandBlue transition-all placeholder:text-slate-300"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* GALLERY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              // Loading Skeleton State
              [1, 2, 4].map((i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-[2rem] animate-pulse" />
              ))
            ) : filteredGalleries.length > 0 ? (
              filteredGalleries.map((gallery) => (
                <motion.div
                  key={gallery.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                >
                  <Link href={`/gallery/${gallery.id}/login`}>
                    <div className="group bg-white p-8 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-xl hover:border-brandBlue/10 transition-all flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-brandBlue group-hover:translate-x-1 transition-transform">{gallery.name}</h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(gallery.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brandBlue group-hover:text-white transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              // Empty State
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center">
                <p className="text-slate-400 italic">No galleries match your search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}