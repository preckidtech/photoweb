"use client";

import { useState } from "react";
import { createGallery } from "./action";

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
          id="vault-form"
          action={async (formData) => {
            setIsPending(true);
            setStatus(null);
            
            const result = await createGallery(formData);
            
            if (result?.error) {
              setStatus({ type: 'error', msg: result.error });
            } else if (result?.success) {
              setStatus({ type: 'success', msg: "Vault constructed successfully." });
              (document.getElementById('vault-form') as HTMLFormElement).reset();
            }
            
            setIsPending(false);
          }} 
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
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Architecting...</span>
              </>
            ) : "Construct Vault"}
          </button>
        </form>
      </section>
    </div>
  );
}