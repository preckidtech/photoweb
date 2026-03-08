import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./global.css";
import Link from "next/link";
import Navbar from "@/components/Navbar"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Benedicta Okhunlun | International Visual Artist",
  description: "Bespoke photography and secure digital asset delivery.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /**
     * SENIOR ENGINEERING: Added suppressHydrationWarning.
     * This prevents build/runtime errors caused by browser extensions (like AdBlock or Password Managers)
     * injecting attributes into the HTML before React hydrates.
     */
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} bg-[#F8F9FA] antialiased font-sans`}>
        
        {/* INJECTING THE INTERACTIVE NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT AREA */}
        <main className="min-h-screen pt-20 md:pt-24">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-white py-16 px-6 border-t border-slate-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                © 2026 Benedicta Okhunlun Studio
              </p>
              <p className="text-[9px] text-slate-300 mt-2 italic font-serif">
                Minimalism in Motion.
              </p>
            </div>

            <Link 
              href="/admin/login" 
              className="text-[10px] text-slate-300 hover:text-[#003366] transition-colors uppercase tracking-[0.3em] font-bold"
            >
              Management Access
            </Link>
          </div>
        </footer>

      </body>
    </html>
  );
}