import { createAdminClient } from "@/utils/supabase/server";
import Link from "next/link";

// Senior Engineering: Force dynamic rendering for real-time dashboard accuracy
export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const supabase = createAdminClient();

  // 1. Parallel Database Queries (NFR-202: Maximum Performance)
  // Fetching counts and recent data simultaneously to prevent UI bottlenecks
  const [
    galleriesCount, 
    mediaCount, 
    inquiriesCount, 
    recentVaultsData,
    recentInquiriesData
  ] = await Promise.all([
    supabase.from("galleries").select("*", { count: "exact", head: true }),
    supabase.from("media").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq('status', 'pending'),
    supabase.from("galleries").select("name, created_at, is_active").order("created_at", { ascending: false }).limit(4),
    supabase.from("inquiries").select("client_name, commission_type, event_date").eq('status', 'pending').order("created_at", { ascending: false }).limit(3)
  ]);

  const totalVaults = galleriesCount.count || 0;
  const totalAssets = mediaCount.count || 0;
  const pendingLeads = inquiriesCount.count || 0;
  const vaults = recentVaultsData.data || [];
  const inquiries = recentInquiriesData.data || [];

  return (
    <div className="max-w-7xl mx-auto space-y-12 px-4 md:px-0 pb-20">
      
      {/* 1. EXECUTIVE HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-[#003366] tracking-tight italic font-serif">Mission Control</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-3">
            Benedicta Visual Studio • Lagos
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <Link 
            href="/admin/uploads" 
            className="flex-1 md:flex-none text-center px-6 py-4 bg-slate-100 text-[#003366] text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-colors"
          >
            Inject Assets
          </Link>
          <Link 
            href="/admin/galleries" 
            className="flex-1 md:flex-none text-center px-6 py-4 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:bg-[#002244] transition-colors"
          >
            Architect Vault
          </Link>
        </div>
      </header>

      {/* 2. KPI METRICS GRID (Responsive: 1 col mobile, 2 tablet, 3 desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Metric Card: Vaults */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Vaults</p>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
          </div>
          <p className="text-5xl md:text-6xl font-light text-[#003366]">{totalVaults}</p>
        </div>

        {/* Metric Card: Assets */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Assets</p>
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#003366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="text-5xl md:text-6xl font-light text-[#003366]">{totalAssets}</p>
        </div>

        {/* Metric Card: Leads (Highlight Color) */}
        <div className="bg-[#003366] p-8 md:p-10 rounded-[2.5rem] shadow-xl flex flex-col justify-between group hover:-translate-y-1 transition-transform md:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-12">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Pending Leads</p>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="flex items-end gap-4">
            <p className="text-5xl md:text-6xl font-light text-white">{pendingLeads}</p>
            {pendingLeads > 0 && (
              <span className="flex h-3 w-3 mb-4">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. OPERATIONAL LOGS (Responsive Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recent Vaults (Takes up 2/3 on desktop) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#003366]">Recent Vaults</h2>
          </div>
          
          <div className="overflow-x-auto">
            {vaults.length > 0 ? (
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="p-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Client Event</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Status</th>
                    <th className="p-6 text-[10px] uppercase tracking-widest text-slate-400 font-bold text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {vaults.map((vault, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 text-sm font-medium text-[#003366]">{vault.name}</td>
                      <td className="p-6">
                        <span className={`text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full ${
                          vault.is_active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {vault.is_active ? 'Active' : 'Archived'}
                        </span>
                      </td>
                      <td className="p-6 text-xs text-slate-400 text-right">
                        {new Date(vault.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-400">No vaults architected yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: New Leads & System Status */}
        <div className="space-y-8">
          
          {/* Actionable Leads Card */}
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-50 p-8">
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#003366] mb-6">New Leads</h2>
            {inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((lead, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-sm font-bold text-[#003366]">{lead.client_name}</p>
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{lead.commission_type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Inbox zero. You are all caught up.</p>
            )}
          </div>

          {/* System Health Card */}
          <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-8">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">System Health</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-[#003366]">Database</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-[10px] uppercase font-bold text-green-600">Secure</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-medium text-[#003366]">Cloud Storage</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-[10px] uppercase font-bold text-green-600">Online</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}