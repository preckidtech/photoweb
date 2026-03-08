"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { logInquiry } from "./action";

export default function BoutiqueInquiry() {
  const [isPending, setIsPending] = useState(false);

  const handleWhatsAppSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      session: (form.elements.namedItem("session") as HTMLSelectElement).value,
      date: (form.elements.namedItem("date") as HTMLInputElement).value,
      vision: (form.elements.namedItem("vision") as HTMLTextAreaElement).value,
    };

    try {
      // 1. Save to Database for Mission Control Tracking
      await logInquiry(formData);

      // 2. RESTORED: Your Preferred WhatsApp Message Format
      const message = `Hello Benedicta Visual Studio,\n\nI would like to inquire about a private commission.\n\n*Client Name:* ${formData.name}\n*Email:* ${formData.email}\n*Session Type:* ${formData.session}\n*Proposed Date:* ${formData.date}\n\n*The Vision:*\n${formData.vision}`;

      const encodedMessage = encodeURIComponent(message);
      const phoneNumber = "2348141893501"; 
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      // 3. Smooth Redirect
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
        setIsPending(false);
        form.reset(); 
      }, 1000);

    } catch (error) {
      console.error("Submission Error:", error);
      alert("Submission failed. Please check your connection.");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] antialiased selection:bg-[#003366] selection:text-white">
      <div className="max-w-[1200px] mx-auto px-6 py-32 md:py-48">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-16 lg:gap-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full lg:w-[40%] lg:sticky lg:top-48 space-y-10"
          >
            <div className="space-y-6">
              <p className="text-[10px] md:text-[12px] font-bold tracking-[0.4em] uppercase text-slate-400">
                Inquiry Portal
              </p>
              <h1 className="text-5xl md:text-[64px] font-semibold leading-[1.05] tracking-[-0.03em]">
                Crafting <br />
                <span className="text-[#003366] font-serif italic font-light">legacies.</span>
              </h1>
            </div>
            
            <p className="text-lg md:text-[19px] leading-relaxed text-slate-500 font-light max-w-sm">
              Currently accepting private commissions for the 2026/27 season.
            </p>

            <div className="pt-12 grid grid-cols-2 gap-8 border-t border-slate-100">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1d1d1f]">Digital</p>
                <p className="text-sm md:text-base text-slate-400 mt-2">WhatsApp Direct</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#1d1d1f]">Studio</p>
                <p className="text-sm md:text-base text-slate-400 mt-2">Lagos, Nigeria</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full lg:w-[60%]"
          >
            <form className="space-y-12 md:space-y-14" onSubmit={handleWhatsAppSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 md:gap-y-12">
                <div className="group relative">
                  <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#003366] transition-colors">Client Name</label>
                  <input type="text" name="name" placeholder="E.g., Precious Isaac" className="w-full bg-transparent border-b border-slate-200 py-4 text-base md:text-[17px] outline-none focus:border-[#003366] transition-all placeholder:text-slate-200" required />
                </div>
                <div className="group relative">
                  <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#003366] transition-colors">Email Address</label>
                  <input type="email" name="email" placeholder="client@example.com" className="w-full bg-transparent border-b border-slate-200 py-4 text-base md:text-[17px] outline-none focus:border-[#003366] transition-all placeholder:text-slate-200" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 md:gap-y-12">
                <div className="group relative">
                  <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#003366] transition-colors">Session</label>
                  <select name="session" className="w-full bg-transparent border-b border-slate-200 py-4 text-base md:text-[17px] outline-none appearance-none cursor-pointer text-[#1d1d1f] focus:border-[#003366] transition-all">
                    <option value="Editorial">Editorial</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Personal">Personal</option>
                  </select>
                </div>
                <div className="group relative">
                  <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#003366] transition-colors">Proposed Date</label>
                  <input type="date" name="date" className="w-full bg-transparent border-b border-slate-200 py-4 text-base md:text-[17px] outline-none text-[#1d1d1f] focus:border-[#003366] transition-all" required />
                </div>
              </div>

              <div className="group relative">
                <label className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-slate-400 group-focus-within:text-[#003366] transition-colors">The Vision</label>
                <textarea name="vision" rows={4} placeholder="What story are we telling?" className="w-full bg-transparent border-b border-slate-200 py-4 text-base md:text-[17px] outline-none resize-none focus:border-[#003366] transition-all placeholder:text-slate-200" required />
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isPending}
                  className="w-full md:w-auto px-10 md:px-14 py-5 md:py-6 bg-[#003366] text-white text-[11px] md:text-[13px] font-bold uppercase tracking-[0.3em] rounded-full shadow-2xl hover:bg-[#002244] hover:-translate-y-1 transition-all flex items-center justify-center gap-4 disabled:bg-slate-100 disabled:text-slate-400"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-300 border-t-[#003366] rounded-full animate-spin" />
                      <span>Logging Inquiry...</span>
                    </>
                  ) : "Initiate Conversation via WhatsApp"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}