import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Benedicta Okhunlun | Professional Photography",
  description: "Secure, high-end photography delivery and portfolio.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-brandWhite antialiased`}>
        {/* Main Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-brandBlue tracking-tighter uppercase">
              BENEDICTA <span className="font-light text-slate-400">OKHUNLUN</span>
            </Link>
            
            <div className="flex gap-8 items-center">
              <Link href="/gallery/access" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-brandBlue transition-colors">
                Access Vault
              </Link>
              {/* This is the button that was "white" or invisible */}
              <Link href="/contact" className="px-8 py-3 bg-brandBlue text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl hover:scale-105 transition-transform">
                Contact
              </Link>
            </div>
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  );
}