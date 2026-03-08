"use client";

import { useState } from "react";
import { resolveLead } from "./action"; 

export default function ResolveButton({ leadId }: { leadId: number }) {
  const [isResolving, setIsResolving] = useState(false);

  const handleResolve = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // SENIOR ENGINEERING: Stop Event Bubbling
    e.stopPropagation();
    e.preventDefault();
    
    if (isResolving) return;

    setIsResolving(true);
    try {
      await resolveLead(leadId);
      // We don't need to set isResolving to false on success because the row will disappear
    } catch (error) {
      alert("Failed to resolve inquiry. Please check your connection.");
      setIsResolving(false);
    }
  };

  return (
    <button 
      onClick={handleResolve}
      disabled={isResolving}
      title="Mark as Completed"
      className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-green-50 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all active:scale-90 disabled:opacity-50"
    >
      {isResolving ? (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 transition-transform hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  );
}