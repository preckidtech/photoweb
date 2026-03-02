"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createGallery } from "./action";

/**
 * Senior Engineering: Vault Architect (FR-11).
 * Creates the database entry required for photo assignment.
 */
export default function AdminGalleries() {
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-[#003366] tracking-tight italic font-serif">Vault Architect</h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mt-2">
          Initialize secure client environments
        </p>
      </header>

      <section className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-50 max-w-xl">
        <form 
          action={async (formData) => {
            setIsPending(true);
            setStatus(null);
            const result = await createGallery(formData);
            
            if (result?.error) {
              setStatus({ type: 'error', msg: result.error });
              setIsPending(false);
            } else {
              setStatus({ type: 'success', msg: "Vault constructed successfully." });
              setIsPending(false);
              (document.getElementById('vault-form') as HTMLFormElement).reset();
            }
          }} 
          id="vault-form"
          className="space-y-8"
        >
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Client / Event Name</label>
            <input 
              name="name" 
              placeholder="e.g. Isaac Wedding 2026" 
              className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#003366]/10 outline-none transition-all text-[#003366]"
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Access Passcode</label>
            <input 
              name="password" 
              type="text"
              placeholder="Assign a secure key" 
              className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#003366]/10 outline-none font-mono transition-all text-[#003366]"
              required 
            />
          </div>

          {status && (
            <p className={`text-[10px] font-bold uppercase text-center tracking-widest ${status.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {status.msg}
            </p>
          )}

          <button 
            disabled={isPending}
            className="w-full py-5 bg-[#003366] text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-400 transition-all active:scale-95"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Architecting...
              </>
            ) : "Construct Vault"}
          </button>
        </form>
      </section>
    </div>
  );
}