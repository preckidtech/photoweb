"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as faceapi from "face-api.js";

/**
 * Senior Engineering: Real-Time AI Face Search Engine.
 * Integrates face-api.js for biometric vector comparison (FR-104).
 */
interface FaceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (matchedIds: string[]) => void;
  allPhotos: any[]; // Ensure the gallery passes the full photo list here
}

export default function FaceSearchModal({ isOpen, onClose, onScanComplete, allPhotos }: FaceSearchModalProps) {
  const [scanStatus, setScanStatus] = useState<"idle" | "loading_models" | "scanning" | "success" | "error">("idle");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Neural Network Models on Mount
  useEffect(() => {
    async function loadModels() {
      if (faceapi.nets.ssdMobilenetv1.params) return; // Prevent double loading
      setScanStatus("loading_models");
      try {
        const MODEL_URL = "/models";
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);
        setScanStatus("idle");
      } catch (err) {
        console.error("AI Model Error:", err);
        setScanStatus("error");
      }
    }
    if (isOpen) loadModels();
  }, [isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setScanStatus("scanning");

    try {
      // 1. Process the selfie
      const img = await faceapi.bufferToImage(file);
      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert("No face detected. Please use a clearer portrait.");
        setScanStatus("idle");
        return;
      }

      const referenceDescriptor = detection.descriptor;

      // 2. Perform Biometric Euclidean Distance Comparison
      // Threshold 0.6 is the industry standard for face-api matching
      const matches = allPhotos
        .filter((photo) => photo.face_descriptors) // Only check photos Benedicta has indexed
        .filter((photo) => {
          const photoDescriptor = new Float32Array(Object.values(photo.face_descriptors));
          const distance = faceapi.euclideanDistance(referenceDescriptor, photoDescriptor);
          return distance < 0.6; 
        })
        .map((p) => p.id);

      setScanStatus("success");
      
      // Delay for luxury feel before returning results
      setTimeout(() => {
        onScanComplete(matches);
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Scanning Error:", err);
      setScanStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-[#003366]/40 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
            className="bg-white w-full max-w-lg rounded-[3.5rem] overflow-hidden shadow-2xl border border-white/20"
          >
            <div className="p-10 text-center">
              <h2 className="text-2xl font-light text-[#003366] tracking-tight">AI Visual Search</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-[0.3em] mt-2">Find your moments instantly</p>
            </div>

            <div className="px-10 pb-12">
              <div className="relative aspect-square w-full bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100 flex items-center justify-center overflow-hidden">
                
                {scanStatus === "idle" && (
                  <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-4 group">
                    <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform text-[#003366]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Selfie</span>
                  </button>
                )}

                {previewUrl && (
                  <div className="absolute inset-0 w-full h-full">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    {scanStatus === "scanning" && (
                      <motion.div 
                        initial={{ top: "0%" }} animate={{ top: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 bg-[#003366] shadow-[0_0_15px_rgba(0,51,102,0.8)] z-10"
                      />
                    )}
                  </div>
                )}

                {scanStatus !== "idle" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#003366]/60 backdrop-blur-sm flex items-center justify-center text-white">
                    <div className="text-center space-y-4">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                      <p className="text-xs font-bold uppercase tracking-[0.2em]">
                        {scanStatus === "loading_models" && "Calibrating AI..."}
                        {scanStatus === "scanning" && "Biometric Analysis..."}
                        {scanStatus === "success" && "Identity Confirmed"}
                        {scanStatus === "error" && "System Error"}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

              <button onClick={onClose} className="w-full mt-8 text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em] hover:text-[#003366] transition-colors">
                Cancel Search
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}