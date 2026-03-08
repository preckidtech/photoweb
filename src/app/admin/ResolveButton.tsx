"use client";

import { useState } from "react";
import { resolveLead } from "./action";

export default function ResolveButton({ leadId }: { leadId: number }) {
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    setLoading(true);
    try {
      await resolveLead(leadId);
    } catch (error) {
      alert("Failed to resolve lead");
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleResolve}
      disabled={loading}
      className="w-10 h-10 rounded-full bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-300 hover:text-green-600 hover:bg-green-50 transition-all disabled:opacity-50"
      title="Mark as Resolved"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-slate-300 border-t-green-600 rounded-full animate-spin" />
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}