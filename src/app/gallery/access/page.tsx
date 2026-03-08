"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { getPublicVaults } from "./action";

export default function GalleryAccess() {
  const [searchQuery, setSearchQuery] = useState("");
  const [galleries, setGalleries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      const vaults = await getPublicVaults();
      setGalleries(vaults);
      setIsLoading(false);
    };
    fetchGalleries();
  }, []);

  // SENIOR ENGINEERING: Only filter and display if the user has typed at least 2 characters.
  // This keeps the screen clean and protects client privacy.
  const filteredGalleries = searchQuery.length >= 2 
    ? galleries.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-20 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-light text-[#003366] tracking-tight italic font-serif">
            Client Portal
          </h1>
          <p className="text-slate-400 mt-4 uppercase tracking-[0.3em] text-[10px] font-bold">
            Locate your private vault
          </p>
        </motion.div>

        {/* SEARCH INTERFACE */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative mb-16 max-w-2xl mx-auto"
        >
          <input 
            type="text"
            placeholder="Enter your event name (e.g., 'Isaac Wedding')"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-none p-6 md:p-8 rounded-[2rem] shadow-xl focus:ring-4 focus:ring-[#003366]/10 outline-none text-[#003366] transition-all placeholder:text-slate-300 text-sm md:text-base"
          />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        {/* DIRECTORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {isLoading ? (
              // Loading State
              <motion.div key="loading" className="col-span-full flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#003366]"></div>
              </motion.div>
            ) : searchQuery.length < 2 ? (
              // Empty State - Waiting for user to type
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="col-span-full py-12 text-center"
              >
                <p className="text-slate-400 text-sm font-medium italic">
                  Start typing to reveal your collection.
                </p>
              </motion.div>
            ) : filteredGalleries.length > 0 ? (
              // Results State
              filteredGalleries.map((gallery) => (
                <motion.div
                  key={gallery.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="col-span-full"
                >
                  <Link href={`/gallery/${gallery.id}/login`}>
                    <div className="group bg-white p-6 md:p-8 rounded-[2rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:border-[#003366]/10 transition-all flex justify-between items-center cursor-pointer">
                      <div>
                        <h3 className="text-lg font-medium text-[#003366] group-hover:translate-x-2 transition-transform duration-300">
                          {gallery.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-2">
                          {new Date(gallery.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#003366] group-hover:text-white transition-colors duration-300 shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              // No Match State
              <motion.div 
                key="no-match"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="col-span-full py-12 text-center"
              >
                <p className="text-slate-400 text-sm font-medium">
                  No vaults found. Please check the spelling.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}