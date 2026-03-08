"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { verifyPassword } from "./action";

export default function VaultLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  
  const router = useRouter();
  const params = useParams(); // SENIOR ENGINEERING: Bulletproof ID extraction

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    const galleryId = params.id as string;

    if (!galleryId) {
      setError("System Error: Vault ID is missing from the URL.");
      setIsPending(false);
      return;
    }

    const formData = new FormData();
    formData.append("password", password);

    try {
      const result = await verifyPassword(formData, galleryId);

      if (result?.error) {
        setError(result.error); // Will now show exact errors
        setIsPending(false);
      } else if (result?.success) {
        // Pushes the user into the private vault upon success
        router.push(`/gallery/${galleryId}`);
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-md bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-slate-50 text-center">
        
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-8 h-8 text-[#003366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h1 className="text-3xl font-light text-[#003366] tracking-tight italic font-serif mb-2">
          Secure Access
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-10">
          Authentication Required
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your passcode"
              className="w-full text-center p-5 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-[#003366]/10 outline-none text-[#003366] font-mono tracking-widest placeholder:tracking-normal transition-all"
              required
            />
          </div>

          {error && (
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || !password}
            className="w-full py-5 bg-[#003366] text-white font-bold uppercase text-xs tracking-widest rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-400 transition-all active:scale-95 hover:bg-[#002244]"
          >
            {isPending ? "Verifying..." : "Unlock Vault"}
          </button>
        </form>
      </div>
    </div>
  );
}