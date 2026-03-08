"use client";

import { useState } from "react";
import { deleteVault } from "./action"; 

export default function DeleteVaultButton({ vaultId, vaultName }: { vaultId: string, vaultName: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // SENIOR ENGINEERING: Stop Event Bubbling & Prevent Double Clicks
    e.stopPropagation();
    e.preventDefault();
    
    if (isDeleting) return; 

    const confirmDelete = window.confirm(`Permanently delete the vault: "${vaultName}"? This action cannot be undone.`);
    if (!confirmDelete) return;

    setIsDeleting(true);
    const result = await deleteVault(vaultId);
    
    if (!result.success) {
      alert(`System Error: ${result.error}`);
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Vault"
      // Increased touch target (min-w-[44px] min-h-[44px]) for mobile responsiveness
      className="flex items-center justify-center w-10 h-10 md:w-11 md:h-11 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isDeleting ? (
        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
          <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  );
}