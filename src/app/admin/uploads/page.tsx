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
    previews.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
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
        await uploadPhotos(singleFormData);
        completedFiles++;
        setProgress(Math.round((completedFiles / totalFiles) * 100));
      } catch (err) {
        console.error("Failed to upload file:", file.name);
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
    <div className="max-w-4xl mx-auto px-4 md:px-0">
      <header className="mb-12">
        <h1 className="text-3xl font-light text-[#003366] tracking-tight italic font-serif">Asset Injection</h1>
      </header>

      <section className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl border border-slate-50 relative overflow-hidden">
        <form onSubmit={handleUpload} id="upload-form" className={`space-y-10 transition-opacity duration-500 ${isUploading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">Target Destination</label>
            <select 
              name="galleryId" 
              onChange={(e) => setIsPublicOnly(e.target.value === "public_only")}
              className="w-full p-5 bg-slate-50 border-none rounded-2xl outline-none text-[#003366] cursor-pointer" 
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
            <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all">
              <input type="checkbox" name="is_public" id="is_public" className="w-5 h-5 accent-[#003366] cursor-pointer" />
              <label htmlFor="is_public" className="text-xs font-bold uppercase tracking-widest text-[#003366] cursor-pointer">
                Sync to Public Portfolio Gallery
              </label>
            </div>
          )}

          <div className="space-y-6">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-[2.5rem] py-20 text-center transition-all duration-300 ${
                isDragging ? "border-[#003366] bg-[#003366]/5 scale-[1.02]" : "border-slate-200 hover:border-[#003366]/30 hover:bg-slate-50/50"
              }`}
            >
              <input type="file" name="files" multiple onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" required={selectedFiles.length === 0} />
              <div className="space-y-2 pointer-events-none">
                <svg className={`w-10 h-10 mx-auto transition-colors duration-300 ${isDragging ? "text-[#003366]" : "text-slate-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <p className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${isDragging ? "text-[#003366]" : "text-slate-400"}`}>
                  {isDragging ? "Drop to stage files" : "Drag & Drop high-res files here"}
                </p>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="flex justify-between items-end mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Staged Assets</p>
                  <p className="text-xs font-bold text-[#003366] bg-white px-3 py-1 rounded-full shadow-sm">{selectedFiles.length} Selected</p>
                </div>
                <div className="flex flex-wrap gap-3 max-h-48 overflow-y-auto custom-scrollbar">
                  {previews.map((src, idx) => (
                    <img key={idx} src={src} className="w-16 h-16 object-cover rounded-2xl shadow-sm border border-slate-200" alt={`Preview ${idx + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={isUploading || selectedFiles.length === 0} className="w-full py-6 bg-[#003366] text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 disabled:bg-slate-100 disabled:text-slate-400 transition-all active:scale-95 hover:bg-[#002244]">
            Initialize Upload
          </button>
        </form>

        <AnimatePresence>
          {isUploading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-12">
              <div className="w-full max-w-md space-y-6">
                {isComplete && (
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <div className="flex justify-between items-end">
                  <p className={`text-xs font-bold uppercase tracking-widest truncate pr-4 ${isComplete ? 'text-green-600' : 'text-[#003366]'}`}>{uploadText}</p>
                  <p className={`text-4xl font-light ${isComplete ? 'text-green-600' : 'text-[#003366]'}`}>{progress}%</p>
                </div>
                <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full transition-all duration-300 ease-out ${isComplete ? 'bg-green-500' : 'bg-[#003366]'}`} style={{ width: `${progress}%` }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}