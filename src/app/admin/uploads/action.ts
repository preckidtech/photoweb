"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import * as faceapi from "face-api.js";

/**
 * Senior Engineering: AI-Aware Asset Injection Engine (MVP Final)
 * Extends the standard upload with Biometric Descriptor Extraction.
 */

// 1. Initialize Server-Side Environment for face-api.js
// @ts-ignore
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export async function uploadPhotos(formData: FormData) {
  const supabase = createAdminClient();
  const files = formData.getAll("files") as File[];
  const galleryIdRaw = formData.get("galleryId") as string;
  const isPublic = galleryIdRaw === "public_only" ? true : formData.get("is_public") === "on";
  const finalGalleryId = galleryIdRaw === "public_only" ? null : galleryIdRaw;

  if (!files || files.length === 0) {
    throw new Error("Engineering Error: No files provided.");
  }

  // 2. Load Neural Models (Internal Server Path)
  const MODEL_URL = "./public/models"; // Ensure your 8 files are in /public/models
  await Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL),
  ]);

  const uploadResults = await Promise.all(
    files.map(async (file) => {
      try {
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
        const timestamp = Date.now();
        const folderPath = finalGalleryId ? finalGalleryId : "public-portfolio";
        const storagePath = `${folderPath}/${timestamp}_${cleanFileName}`;

        // A. Extract Biometric Data (Face Scanning)
        const buffer = Buffer.from(await file.arrayBuffer());
        const img = await faceapi.fetchImage(buffer as any);
        
        const detection = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();

        // Convert Float32Array to standard Array for JSON storage
        const faceDescriptors = detection ? Array.from(detection.descriptor) : null;

        // B. Inject into Cloud Storage
        const { error: storageError } = await supabase.storage
          .from("client-galleries")
          .upload(storagePath, file, { cacheControl: "3600", upsert: false });

        if (storageError) throw new Error(storageError.message);

        // C. Catalog in Database with AI Descriptors
        const { error: dbError } = await supabase.from("media").insert([
          {
            gallery_id: finalGalleryId,
            storage_path: storagePath,
            is_public: isPublic,
            face_descriptors: faceDescriptors, // The "Secret Sauce" for AI search
            metadata: {
              original_filename: file.name,
              file_size: file.size,
              mime_type: file.type,
            }
          },
        ]);

        if (dbError) throw new Error(dbError.message);

        return { success: true, fileName: file.name };
      } catch (err: any) {
        console.error(`AI Upload Fail for ${file.name}:`, err.message);
        return { success: false, fileName: file.name, error: err.message };
      }
    })
  );

  revalidatePath("/"); 
  if (finalGalleryId) revalidatePath(`/gallery/${finalGalleryId}`);
  
  return uploadResults;
}

export async function getActiveVaults() {
  const supabase = createAdminClient(); 
  const { data, error } = await supabase
    .from("galleries")
    .select("id, name")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}