"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Senior Engineering: This is the primary entry point for Admin management (FR-103).
 * It uses a modular card-based layout for high scannability.
 */
export default function AdminDashboard() {
  // Local state for dashboard metrics (In production, these come from Supabase)
  const [stats, setStats] = useState({
    totalGalleries: 12,
    totalPhotos: 1450,
    storageUsed: "4.2 GB",
    recentInquiries: 5
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="space-y-12">
      {/* WELCOME HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-light text-brandBlue tracking-tight">Executive Overview</h1>
          <p className="text-slate-400 text-xs uppercase tracking-[0.3em] mt-2">Welcome back, Benedicta</p>
        </div>
        <div className="flex gap-4">
          <Link 
            href="/admin/galleries" 
            className="px-6 py-3 bg-brandBlue text-white text-[10px] font-bold uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Create New Vault
          </Link>
        </div>
      </header>

      {/* METRIC GRID */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: "Active Vaults", value: stats.totalGalleries, icon: "Vault" },
          { label: "Master Assets", value: stats.totalPhotos, icon: "Image" },
          { label: "Cloud Storage", value: stats.storageUsed, icon: "Cloud" },
          { label: "New Inquiries", value: stats.recentInquiries, icon: "Mail" }
        ].map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={cardVariants}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-shadow"
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</p>
            <p className="text-3xl font-light text-brandBlue tracking-tighter group-hover:scale-105 transition-transform origin-left">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* SECONDARY MANAGEMENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT ACTIVITY */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-brandBlue uppercase tracking-widest">Recent Vault Activity</h3>
            <Link href="/admin/galleries" className="text-[10px] text-slate-400 hover:text-brandBlue font-bold uppercase tracking-widest">View All</Link>
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Client Name</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Status</th>
                  <th className="p-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: "Isaac Wedding", status: "Active", date: "2 Hours Ago" },
                  { name: "Vogue Editorial", status: "Processing", date: "5 Hours Ago" },
                  { name: "Corporate Headshots", status: "Expired", date: "1 Day Ago" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors cursor-pointer">
                    <td className="p-6 text-sm font-medium text-brandBlue">{row.name}</td>
                    <td className="p-6">
                      <span className={`text-[9px] uppercase font-bold tracking-tighter px-3 py-1 rounded-full ${
                        row.status === 'Active' ? 'bg-green-100 text-green-600' : 
                        row.status === 'Processing' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-6 text-xs text-slate-400">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* SYSTEM STATUS CARD */}
        <motion.div 
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-brandBlue p-10 rounded-[2.5rem] text-white flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Cloud Status</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <p className="text-sm font-light">Supabase Storage</p>
                <p className="text-xs font-bold">94% Healthy</p>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "94%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-white shadow-[0_0_10px_white]"
                />
              </div>
            </div>
          </div>
          <div className="pt-10">
            <p className="text-[10px] leading-relaxed text-slate-400 uppercase tracking-widest">
              Server Region: <span className="text-white ml-2">FRA-1 (EU)</span><br />
              API Latency: <span className="text-white ml-2">24ms</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}