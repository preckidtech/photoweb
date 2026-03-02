"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { handleAdminLogin } from "./action";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="min-h-screen bg-[#003366] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-12 rounded-[3.5rem] shadow-2xl"
      >
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-[#003366] tracking-tighter uppercase">
            Benedicta <span className="font-light text-slate-400">Admin</span>
          </h1>
        </div>

        <form 
          action={async (formData) => {
            setIsPending(true);
            setError(null);
            const result = await handleAdminLogin(formData);
            if (result?.error) {
              setError(result.error);
              setIsPending(false);
            }
          }} 
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-2">Access ID</label>
            <input name="email" type="email" placeholder="admin@benedicta.com" className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none text-[#003366]" required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-slate-400 ml-2">Secure Passkey</label>
            <input name="password" type="password" placeholder="••••••••" className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none text-[#003366]" required />
          </div>

          {error && <p className="text-red-500 text-[10px] text-center font-bold uppercase tracking-widest">{error}</p>}

          <button 
            disabled={isPending}
            className="w-full py-5 bg-[#003366] text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:bg-slate-300 transition-all"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : "Authenticate Session"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}