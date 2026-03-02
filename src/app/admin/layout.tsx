import Link from "next/link";

/**
 * Senior Engineering: This layout ensures Benedicta has 
 * persistent navigation while managing her galleries.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-brandWhite">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 p-8 flex flex-col gap-10">
        <div className="text-xl font-bold text-brandBlue tracking-tighter">
          BENEDICTA <span className="block text-xs font-light text-slate-400 tracking-widest">ADMIN PANEL</span>
        </div>
        
        <nav className="flex flex-col gap-4">
          <Link 
            href="/admin/galleries" 
            className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-brandBlue transition-colors"
          >
            Galleries
          </Link>
          <Link 
            href="/admin/uploads" 
            className="text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-brandBlue transition-colors"
          >
            Upload Photos
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}