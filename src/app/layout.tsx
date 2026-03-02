import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Benedicta Okhunlun | Professional Photography",
  description: "Secure, high-end photography delivery and portfolio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-brandWhite antialiased`}>
        {/* Global Navigation */}
        <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-brandBlue tracking-tighter">
              BENEDICTA <span className="font-light text-slate-400">OKHUNLUN</span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/gallery/access" className="text-xs font-bold uppercase tracking-widest text-slate-500">Access Vault</Link>
              <Link href="/contact" className="px-6 py-2 bg-brandBlue text-white text-xs font-bold rounded-full shadow-lg">Book Now</Link>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        {/* WhatsApp Concierge: Floating high-conversion button */}
        <a 
          href="https://wa.me/2348000000000" 
          target="_blank" 
          className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.404c0 6.556-5.332 11.888-11.888 11.888-2.013 0-3.987-.512-5.735-1.483l-6.25 1.639z" />
          </svg>
        </a>
      </body>
    </html>
  );
}