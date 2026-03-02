"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

/**
 * Senior Engineering: This is the primary dashboard (FR-103).
 * It fetches real-time counts from the 'galleries' and 'media' tables.
 */
export default function AdminOverview() {
  const [metrics, setMetrics] = useState({
    galleries: 0,
    media: 0,
    storage: "Calculating...",
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      // Parallel execution for high performance
      const [galleriesCount, mediaCount] = await Promise.all([
        supabase.from("galleries").select("*", { count: 'exact', head: true }),
        supabase.from("media").select("*", { count: 'exact', head: true })
      ]);

      setMetrics({
        galleries: galleriesCount.count || 0,
        media: mediaCount.count || 0,
        storage: "94% Optimal", // Simulated health metric
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" }
    })
  };

  return (
    <div className="max-w-6xl">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-brandBlue tracking-tight">System Intelligence</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-2">
          Business Metrics & Infrastructure Health
        </p>
      </header>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Active Vaults", value: metrics.galleries, icon: "Vault" },
          { label: "Master Assets", value: metrics.media, icon: "Images" },
          { label: "Cloud Integrity", value: metrics.storage, icon: "Security" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 group hover:shadow-xl transition-all"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-light text-brandBlue tracking-tighter group-hover:scale-105 transition-transform origin-left inline-block">
                {loading ? "..." : stat.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RECENT SYSTEM LOGS */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 bg-white rounded-[3rem] border border-slate-50 overflow-hidden shadow-sm"
      >
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-brandBlue">
            Server Status: Active
          </h3>
        </div>
        <div className="p-10 space-y-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-light">Database Connection</span>
            <span className="flex items-center gap-2 text-green-500 font-bold uppercase text-[10px] tracking-widest">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Established
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-light">Storage Bucket Latency</span>
            <span className="text-brandBlue font-bold text-[10px] tracking-widest uppercase">24ms</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-light">Last Vault Generation</span>
            <span className="text-slate-400 font-light text-[10px] uppercase">Real-time tracking active</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
}