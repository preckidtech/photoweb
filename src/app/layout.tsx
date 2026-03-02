import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./global.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Benedicta Okhunlun | International Visual Artist",
  description: "Bespoke photography and secure digital asset delivery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} bg-brandWhite antialiased font-sans`}>
        
        {/* NAVIGATION BAR - FIXED VISIBILITY */}
        <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
            
            {/* LOGO */}
            <Link href="/" className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold text-brandBlue tracking-tighter uppercase leading-none">
                BENEDICTA <span className="font-light text-slate-300">OKHUNLUN</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.6em] text-slate-400 uppercase mt-1">
                Visual Studio
              </span>
            </Link>

            {/* FULL MENU - FIXED CONTRAST */}
            <div className="hidden md:flex items-center gap-10">
              <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandBlue hover:opacity-60 transition-all">
                Home
              </Link>
              <Link href="/gallery/access" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brandBlue hover:opacity-60 transition-all">
                Client Vaults
              </Link>
              
              {/* THE "WHITE STUFF" FIX: Explicitly setting blue background and white text */}
              <Link 
                href="/contact" 
                className="px-8 py-3 bg-brandBlue text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl hover:scale-105 transition-all block"
              >
                Book Inquiry
              </Link>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button className="md:hidden p-2 text-brandBlue">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="min-h-screen pt-24">
          {children}
        </main>

        {/* FOOTER - FIXED 404 LINK */}
        <footer className="bg-white py-16 px-6 border-t border-slate-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                © 2026 Benedicta Okhunlun Studio
              </p>
              <p className="text-[9px] text-slate-300 mt-2 italic font-serif">
                Minimalism in Motion.
              </p>
            </div>

            {/* FIX: Ensure this points exactly to /admin/login to avoid 404 */}
            <Link 
              href="/admin/login" 
              className="text-[10px] text-slate-300 hover:text-brandBlue transition-colors uppercase tracking-[0.3em] font-bold"
            >
              Management Access
            </Link>
          </div>
        </footer>

      </body>
    </html>
  );
}