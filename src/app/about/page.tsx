"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  // WhatsApp Configuration 
  const whatsappNumber = "447918915682"; // IMPORTANT: Update this number
  const whatsappMessage = encodeURIComponent("Hello Benedicta Visual Studio, I was reading your story on the About page and would like to connect.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] selection:bg-[#003366] selection:text-white pb-32">
      
      {/* SECTION 1: THE NEW CENTERED EXHIBITION HERO */}
      <section className="pt-32 md:pt-48 px-6 md:px-12 max-w-5xl mx-auto flex flex-col items-center text-center">
        
        {/* The Title Block */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-slate-400 mb-6">
            The Visionary
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-[#003366] tracking-tight leading-[1.1] mb-16">
            Capturing the <span className="italic font-serif text-slate-400">unspoken.</span>
          </h1>
        </motion.div>

        {/* The Portrait (Strictly Controlled Size) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative group"
        >
          {/* SENIOR ENGINEERING: 
              w-48 on mobile = 192px wide. This guarantees it is a small, elegant inset.
              It scales up beautifully to w-64 (256px) on tablets, and w-80 (320px) on desktops.
          */}
          <div className="w-48 sm:w-64 md:w-80 aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-200 relative shadow-2xl mx-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/benedicta-portrait.jpg" 
              alt="Benedicta Okhunlun - Visual Artist" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop";
              }}
            />
            <div className="absolute inset-0 border border-black/5 rounded-[2rem] pointer-events-none" />
          </div>
          
          {/* Abstract background glow behind the image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#003366]/5 rounded-full blur-3xl -z-10" />
        </motion.div>

        {/* The Introduction Text */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-16 space-y-8 max-w-2xl mx-auto"
        >
          <div className="space-y-6 mt-4 text-base md:text-lg text-slate-500 font-light leading-relaxed">
            <p>
              I am Benedicta Okhunlun, a visual artist and storyteller based in the Stirling Scotland. For me, the camera is not just a tool to record reality; it is an instrument to freeze the fleeting, invisible threads of emotion that connect us all.
            </p>
            <p>
              My approach to photography is rooted in <strong className="font-semibold text-[#003366]">minimalism and intentionality</strong>. Whether it is an intimate wedding, a high-fashion editorial, or a personal branding session, I believe the most powerful images emerge when stripping away the noise to reveal the profound simplicity of the subject.
            </p>
          </div>

          <div className="pt-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Signature_placeholder.svg/1200px-Signature_placeholder.svg.png" 
              alt="Benedicta Signature" 
              className="h-10 md:h-14 opacity-30 grayscale mix-blend-multiply"
              onError={(e) => e.currentTarget.style.display = 'none'}
            />
          </div>
        </motion.div>

      </section>

      {/* SECTION 2: THE STUDIO STANDARDS */}
      <section className="mt-32 md:mt-40 bg-white py-24 md:py-32 border-y border-slate-100">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-center md:text-left"
          >
            <div className="space-y-4 md:pr-8 pt-8 md:pt-0">
              <span className="text-xl md:text-2xl text-[#003366] font-serif italic">01.</span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1d1d1f]">Editorial Aesthetic</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
                Every frame is treated as a piece of fine art, blending cinematic lighting with raw, authentic emotion.
              </p>
            </div>
            <div className="space-y-4 md:px-8 pt-8 md:pt-0">
              <span className="text-xl md:text-2xl text-[#003366] font-serif italic">02.</span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1d1d1f]">Private Cloud Delivery</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
                Assets are delivered through military-grade encrypted client vaults, ensuring zero compression and total privacy.
              </p>
            </div>
            <div className="space-y-4 md:pl-8 pt-8 md:pt-0">
              <span className="text-xl md:text-2xl text-[#003366] font-serif italic">03.</span>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1d1d1f]">Bespoke Experience</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
                I accept a limited number of commissions annually to ensure unparalleled dedication to your specific vision.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: THE CALL TO ACTION */}
      <section className="mt-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto space-y-8"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#003366] tracking-tight">
            Ready to craft your <span className="italic font-serif">legacy?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/portfolio" 
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-[#003366] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm hover:shadow-lg transition-all active:scale-95"
            >
              View Archives
            </Link>
            <Link 
              href="/contact" 
              className="w-full sm:w-auto px-8 py-4 bg-[#003366] text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-xl hover:bg-[#002244] hover:-translate-y-1 transition-all active:scale-95"
            >
              Book an Inquiry
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FLOATING WHATSAPP CTA */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-[0_10px_40px_rgba(37,211,102,0.4)] transition-all active:scale-95 group"
        aria-label="Contact on WhatsApp"
      >
        <svg className="w-7 h-7 md:w-8 md:h-8 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-20 bg-white text-[#1d1d1f] text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap hidden md:block">
          Chat with Benedicta
        </span>
      </motion.a>
    </div>
  );
}