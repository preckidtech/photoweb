"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Helper to close mobile menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  // Navigation Links Data Array for easy management
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Client Vaults", path: "/gallery/access" },
  ];

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between relative z-50">
        
        {/* LOGO */}
        <Link href="/" className="flex flex-col relative z-50" onClick={closeMenu}>
          <span className="text-xl md:text-2xl font-bold text-[#003366] tracking-tighter uppercase leading-none">
            BENEDICTA <span className="font-light text-slate-300">OKHUNLUN</span>
          </span>
          <span className="text-[8px] font-bold tracking-[0.6em] text-slate-400 uppercase mt-1">
            Visual Studio
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path} 
              className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:opacity-60 ${
                pathname === link.path ? "text-[#003366]" : "text-slate-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <Link 
            href="/contact" 
            className="px-8 py-3 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl hover:bg-[#002244] hover:scale-105 transition-all block"
          >
            Book Inquiry
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE (HAMBURGER) */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-[#003366] relative z-50 focus:outline-none"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-center">
            <span className={`h-0.5 w-full bg-[#003366] rounded-full transform transition duration-300 ease-in-out ${isOpen ? "rotate-45 translate-y-2.5" : ""}`} />
            <span className={`h-0.5 w-full bg-[#003366] rounded-full transition-opacity duration-300 ease-in-out ${isOpen ? "opacity-0" : "opacity-100"}`} />
            <span className={`h-0.5 w-full bg-[#003366] rounded-full transform transition duration-300 ease-in-out ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-screen bg-white pt-24 px-6 md:hidden flex flex-col z-40"
          >
            <div className="flex flex-col gap-8 mt-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path} 
                  onClick={closeMenu}
                  className={`text-2xl font-light tracking-tight uppercase ${
                    pathname === link.path ? "text-[#003366]" : "text-slate-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="h-px w-full bg-slate-100 my-4" />
              
              <Link 
                href="/contact" 
                onClick={closeMenu}
                className="w-full py-5 bg-[#003366] text-white text-center text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl active:scale-95 transition-transform"
              >
                Book Inquiry
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}