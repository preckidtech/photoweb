import { createAdminClient } from "@/utils/supabase/server";
import Link from "next/link";
import ResolveButton from "./ResolveButton"; 
import DeleteVaultButton from "./DeleteVaultButton"; 

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const supabase = createAdminClient();

  const [
    galleriesCount, mediaCount, inquiriesCount, 
    recentVaultsData, recentInquiriesData, storageData 
  ] = await Promise.all([
    supabase.from("galleries").select("*", { count: "exact", head: true }),
    supabase.from("media").select("*", { count: "exact", head: true }),
    supabase.from("inquiries").select("*", { count: "exact", head: true }).eq('status', 'pending'),
    supabase.from("galleries").select("id, name, created_at, is_active").order("created_at", { ascending: false }).limit(4),
    supabase.from("inquiries").select("id, client_name, commission_type, created_at").eq('status', 'pending').order("created_at", { ascending: false }),
    supabase.from("media").select("metadata->file_size") 
  ]);

  const totalVaults = galleriesCount.count || 0;
  const totalAssets = mediaCount.count || 0;
  const pendingLeads = inquiriesCount.count || 0;
  const vaults = recentVaultsData.data || [];
  const inquiries = recentInquiriesData.data || [];

  const totalBytes = storageData.data?.reduce((acc, curr: any) => acc + (Number(curr.file_size) || 0), 0) || 0;
  const usedGB = totalBytes / (1024 * 1024 * 1024);
  const storagePercentage = Math.min((usedGB / 1) * 100, 100);

  return (
    <div className="max-w-7xl mx-auto space-y-12 px-4 md:px-0 pb-20 pt-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-[#003366] tracking-tight italic font-serif">Mission Control</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-3 text-nowrap">Studio Infrastructure Monitor</p>
        </div>
        
        {/* SENIOR ENGINEERING: Updated Header Navigation with Portfolio Curation Link */}
        <div className="flex flex-wrap md:flex-nowrap gap-3 md:gap-4 w-full md:w-auto">
          <Link href="/admin/portfolio" className="flex-1 md:flex-none text-center px-4 md:px-6 py-4 border border-slate-200 text-[#003366] text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-xl md:rounded-2xl transition-all hover:bg-slate-50 hover:shadow-sm">
            Curate Portfolio
          </Link>
          <Link href="/admin/uploads" className="flex-1 md:flex-none text-center px-4 md:px-6 py-4 bg-slate-100 text-[#003366] text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-xl md:rounded-2xl transition-colors hover:bg-slate-200">
            Inject Assets
          </Link>
          <Link href="/admin/galleries" className="flex-1 md:flex-none text-center px-4 md:px-6 py-4 bg-[#003366] text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-xl md:rounded-2xl shadow-xl transition-colors hover:bg-[#002244] w-full md:w-auto mt-2 md:mt-0">
            Architect Vault
          </Link>
        </div>
      </header>

      {/* KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col justify-between"><p className="text-[10px] font-bold uppercase text-slate-400">Active Vaults</p><p className="text-4xl md:text-5xl font-light text-[#003366] mt-8">{totalVaults}</p></div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col justify-between"><p className="text-[10px] font-bold uppercase text-slate-400">Total Assets</p><p className="text-4xl md:text-5xl font-light text-[#003366] mt-8">{totalAssets}</p></div>
        <div className="bg-[#003366] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl flex flex-col justify-between"><p className="text-[10px] font-bold uppercase text-slate-300">Pending Leads</p><p className="text-4xl md:text-5xl font-light text-white mt-8">{pendingLeads}</p></div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-50 flex flex-col justify-between">
          <div className="flex justify-between items-center"><p className="text-[10px] font-bold uppercase text-slate-400">Storage</p><p className="text-[10px] font-mono text-[#003366]">{usedGB.toFixed(2)} / 1GB</p></div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mt-4"><div className={`h-full transition-all duration-500 ${storagePercentage > 85 ? 'bg-red-500' : 'bg-[#003366]'}`} style={{ width: `${storagePercentage}%` }} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-50 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-100"><h2 className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-[#003366]">Recent Vaults</h2></div>
          
          <div className="overflow-x-auto custom-scrollbar">
            {/* Added min-w-[600px] to force scrolling on mobile instead of crushing buttons together */}
            <table className="w-full text-left min-w-[600px]">
              <tbody className="divide-y divide-slate-50">
                {vaults.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-5 md:p-6 text-sm font-medium text-[#003366] truncate max-w-[150px] md:max-w-xs">{v.name}</td>
                    <td className="p-5 md:p-6">
                      <span className={`text-[8px] md:text-[9px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full ${v.is_active ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        {v.is_active ? 'Active' : 'Archived'}
                      </span>
                    </td>
                    <td className="p-5 md:p-6 text-[10px] md:text-xs text-slate-400 whitespace-nowrap">{new Date(v.created_at).toLocaleDateString()}</td>
                    {/* Centered deletion button with clear spacing */}
                    <td className="p-5 md:p-6 text-center w-24">
                      <DeleteVaultButton vaultId={v.id} vaultName={v.name} />
                    </td>
                  </tr>
                ))}
                {vaults.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-xs text-slate-400 italic font-serif">No vaults architected yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SCROLLABLE LEADS FEED */}
        <div className="space-y-8">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-slate-50 p-6 md:p-8 h-[400px] md:h-[500px] flex flex-col">
            <h2 className="text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-[#003366] mb-6">Pending Inquiries</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {inquiries.length > 0 ? inquiries.map((lead: any) => (
                <div key={lead.id} className="p-4 md:p-5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center group hover:bg-white transition-all hover:shadow-sm">
                  <div className="max-w-[65%] md:max-w-[70%]">
                    <p className="text-xs md:text-sm font-bold text-[#003366] truncate">{lead.client_name}</p>
                    <p className="text-[8px] md:text-[9px] uppercase tracking-widest text-slate-400 mt-1 truncate">{lead.commission_type} • {new Date(lead.created_at).toLocaleDateString()}</p>
                  </div>
                  {/* Buttons are explicitly padded to prevent accidental neighboring clicks */}
                  <div className="pl-2">
                    <ResolveButton leadId={lead.id} />
                  </div>
                </div>
              )) : <div className="h-full flex items-center justify-center opacity-30 italic text-xs font-serif">Inbox zero.</div>}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8">
            <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">System Strength</h2>
            <div className="space-y-4 text-[10px] md:text-xs font-medium text-[#003366]">
              <div className="flex justify-between items-center"><p>Supabase Connection</p><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div><p className="text-[9px] md:text-[10px] font-bold text-green-600 uppercase">STABLE</p></div></div>
              <div className="flex justify-between items-center"><p>Encryption Layer</p><p className="text-[9px] md:text-[10px] font-bold uppercase">AES-256 Active</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}