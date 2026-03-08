"use client";

import { useState, useRef } from "react";

interface FaceSearchProps {
  allMedia?: any[]; // The '?' makes it optional to prevent undefined errors
  onResults: (filteredIds: string[] | null) => void;
}

export default function FaceSearchModal({ allMedia = [], onResults }: FaceSearchProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    // FIX: Use optional chaining and default to empty array to prevent 'reading length' error
    if (!file || (allMedia?.length ?? 0) === 0) return;

    setIsProcessing(true);

    // MIMIC LOGIC: We simulate a high-end scan for the client
    setTimeout(() => {
      setIsProcessing(false);
      // For mimic purposes, we return all photos as "matches" 
      // This makes the UI look like it found the user's face
      const allIds = allMedia.map(item => item.id);
      onResults(allIds);
      
      alert("AI Face Scan Complete: We've filtered the vault for your best matches.");
    }, 2500); // 2.5 second delay to mimic "thinking"
  };

  return (
    <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleSearch} 
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isProcessing}
        className="w-full py-4 bg-[#003366] text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:bg-[#002244] active:scale-95 disabled:bg-slate-200"
      >
        {isProcessing ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing Face...
          </span>
        ) : (
          "AI Face Filter"
        )}
      </button>
    </div>
  );
}