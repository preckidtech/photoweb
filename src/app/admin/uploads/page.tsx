"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadPhotos, getActiveVaults } from "./action"; 

export default function AdminUploads() {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isPublicOnly, setIsPublicOnly] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [progress, setProgress] = useState(0);
  const [uploadText, setUploadText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGalleries() {
      const vaults = await getActiveVaults();
      setGalleries(vaults);
    }
    fetchGalleries();
  }, []);

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const handleFiles = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove: number) => {
    URL.revokeObjectURL(previews[indexToRemove]);
    setSelectedFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviews(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setIsComplete(false);
    setProgress(0);
    setErrorMessage(null);
    
    const form = e.currentTarget;
    const galleryId = (form.elements.namedItem("galleryId") as HTMLSelectElement).value;
    const isPublic = isPublicOnly ? "on" : ((form.elements.namedItem("is_public") as HTMLInputElement)?.checked ? "on" : "off");

    const totalFiles = selectedFiles.length;
    let completedFiles = 0;

    for (let i = 0; i < totalFiles; i++) {
      const file = selectedFiles[i];
      setUploadText(`Injecting asset ${i + 1} of ${totalFiles}...`);
      
      const singleFormData = new FormData();
      singleFormData.append("files", file);
      singleFormData.append("galleryId", galleryId);
      if (isPublic === "on") singleFormData.append("is_public", "on");

      try {
        const result = await uploadPhotos(singleFormData);
        
        // SENIOR ENGINEERING: Explicitly catch Database-level rejections
        if (result && result.success === false) {
          throw new Error(result.error || "Storage rejected the asset.");
        }

        completedFiles++;
        setProgress(Math.round((completedFiles / totalFiles) * 100));
      } catch (err: any) {
        console.error("Failed to upload file:", file.name, err);
        // Halt the loop and show the exact error in the UI
        setErrorMessage(`Failed on "${file.name}". Reason: ${err.message}`);
        return; 
      }
    }

    setIsComplete(true);
    setUploadText("Upload Successfully Completed!");
    setProgress(100);

    setTimeout(() => {
      setIsUploading(false);
      setIsComplete(false);
      setSelectedFiles([]);
      setPreviews([]);
      setProgress(0);
      setUploadText("");
      form.reset();
      setIsPublicOnly(false);
    }, 3000); 
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 py-8 md:py-12">
      <header className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-light text-[#003366] tracking-tight italic font-serif">Asset Injection</h1>
      </header>

      <section className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] shadow-xl border border-slate-50 relative overflow-hidden">
        <form onSubmit={handleUpload} id="upload-form" className={`space-y-8 md:space-y-10 transition-opacity duration-500 ${isUploading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          
          <div className="space-y-3">
            <label className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400 ml-2">Target Destination</label>
            <select 
              name="galleryId" 
              onChange={(e) => setIsPublicOnly(e.target.value === "public_only")}
              className="w-full p-4 md:p-5 bg-slate-50 border-none rounded-xl md:rounded-2xl outline-none text-[#003366] cursor-pointer text-sm md:text-base" 
              required
            >
              <option value="">Select Destination...</option>
              <option value="public_only" className="font-bold text-[#003366]">🌟 General Portfolio (Homepage Only)</option>
              <option disabled>────────── Client Vaults ──────────</option>
              {galleries.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {!isPublicOnly && (
            <div className="flex items-center gap-4 p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 transition-all">
              <input type="checkbox" name="is_public" id="is_public" className="w-5 h-5 md:w-6 md:h-6 accent-[#003366] cursor-pointer shrink-0" />
              <label htmlFor="is_public" className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#003366] cursor-pointer">
                Sync to Public Portfolio Gallery
              </label>
            </div>
          )}

          <div className="space-y-6">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-[1.5rem] md:rounded-[2.5rem] py-16 md:py-20 text-center transition-all duration-300 ${
                isDragging ? "border-[#003366] bg-[#003366]/5 scale-[1.02]" : "border-slate-200 hover:border-[#003366]/30 hover:bg-slate-50/50"
              }`}
            >
              <input type="file" name="files" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" required={selectedFiles.length === 0} />
              <div className="space-y-2 pointer-events-none px-4">
                <svg className={`w-8 h-8 md:w-10 md:h-10 mx-auto transition-colors duration-300 ${isDragging ? "text-[#003366]" : "text-slate-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isDragging ? "text-[#003366]" : "text-slate-400"}`}>
                  {isDragging ? "Drop to stage files" : "Drag & Drop high-res files here"}
                </p>
              </div>
            </div>

            {/* STAGED ASSETS: COMPACT & FLUID */}
            {previews.length > 0 && (
              <div className="bg-slate-50 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-400">Staged Assets</p>
                  <p className="text-[10px] md:text-xs font-bold text-[#003366] bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">{selectedFiles.length} Selected</p>
                </div>
                
                <div className="flex flex-wrap gap-4 max-h-48 overflow-y-auto custom-scrollbar p-2">
                  {previews.map((src, idx) => (
                    <div key={idx} className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 group">
                      <img 
                        src={src} 
                        className="w-full h-full object-cover rounded-2xl shadow-sm border border-slate-200" 
                        alt={`Preview ${idx + 1}`} 
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full border-2 border-white shadow-md hover:bg-red-600 hover:scale-110 active:scale-95 transition-all z-10"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={isUploading || selectedFiles.length === 0} className="w-full py-5 md:py-6 bg-[#003366] text-white text-sm md:text-base font-bold rounded-xl md:rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-400 transition-all active:scale-[0.98] hover:bg-[#002244]">
            Initialize Upload
          </button>
        </form>

        <AnimatePresence>
          {isUploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/95 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 md:p-12">
              <div className="w-full max-w-lg space-y-6">
                
                {errorMessage ? (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-white p-8 rounded-3xl shadow-2xl border border-red-50">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <p className="text-[#003366] font-bold text-sm md:text-base mb-2">Upload Interrupted</p>
                    <p className="text-slate-500 text-xs md:text-sm mb-6 max-w-xs mx-auto">{errorMessage}</p>
                    <button 
                      onClick={() => { setIsUploading(false); setErrorMessage(null); }} 
                      className="px-6 py-3 bg-slate-100 text-[#003366] rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-colors"
                    >
                      Dismiss & Try Again
                    </button>
                  </motion.div>
                ) : (
                  <>
                    {isComplete && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-6 h-6 md:w-8 md:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                    
                    <div className="flex justify-between items-end mb-2">
                      <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest truncate pr-4 ${isComplete ? 'text-green-600' : 'text-[#003366]'}`}>{uploadText}</p>
                      <p className={`text-3xl md:text-4xl font-light ${isComplete ? 'text-green-600' : 'text-[#003366]'}`}>{progress}%</p>
                    </div>
                    
                    <div className="w-full h-8 md:h-10 bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
                      <div className={`h-full transition-all duration-300 ease-out ${isComplete ? 'bg-green-500' : 'bg-[#003366]'}`} style={{ width: `${progress}%` }} />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}