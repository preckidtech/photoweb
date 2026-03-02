import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../global.css"; // FIXED: Correct relative path for Tailwind v4
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studio Admin | Benedicta Okhunlun",
  description: "Secure management portal for high-end visual assets.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Navigation items must match your folder names to avoid 404 errors
  const navItems = [
    { name: "Overview", path: "/admin" },
    { name: "Vaults", path: "/admin/galleries" }, // Matches 'galleries' folder
    { name: "Uploads", path: "/admin/uploads" },  // Matches 'uploads' folder
  ];

  return (
    <div className={`${inter.className} flex min-h-screen bg-slate-50 flex-col md:flex-row`}>
      
      {/* SIDEBAR: Professional, Sticky, and Responsive */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 flex flex-col md:sticky md:top-0 md:h-screen z-50">
        <div className="p-8 border-b border-slate-50">
          <Link href="/admin" className="group">
            <h1 className="text-lg font-bold text-[#003366] tracking-tighter uppercase leading-none">
              STUDIO <span className="font-light text-slate-400">ADMIN</span>
            </h1>
            <p className="text-[8px] font-bold tracking-[0.4em] text-slate-300 uppercase mt-2">
              Management Suite
            </p>
          </Link>
        </div>

        {/* NAVIGATION: Flex-row on mobile, Flex-col on desktop */}
        <nav className="flex flex-row md:flex-col p-4 md:p-6 gap-2 overflow-x-auto md:overflow-visible scrollbar-hide">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.path}
              className="whitespace-nowrap flex items-center px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#003366] hover:bg-slate-50 rounded-xl transition-all"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* EXIT STRATEGY: Return to public brand site */}
        <div className="hidden md:block p-8 mt-auto border-t border-slate-50">
          <Link 
            href="/" 
            className="text-[9px] font-bold text-slate-300 hover:text-red-400 tracking-[0.2em] uppercase transition-colors"
          >
            Exit to Public Site
          </Link>
        </div>
      </aside>

      {/* MAIN VIEWPORT: Adaptive padding for mobile/desktop */}
      <main className="flex-1 min-h-screen p-6 md:p-12 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}