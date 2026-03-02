"use server";

import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

/**
 * Senior Engineering: This Server Action handles the secure handshake (FR-102).
 * It compares the plaintext input with the Bcrypt hash stored in PostgreSQL.
 */
export async function verifyPassword(formData: FormData, galleryId: string) {
  const supabase = await createClient();

  // 1. Data Extraction
  const enteredPasscode = formData.get("password") as string;

  if (!enteredPasscode) {
    throw new Error("Security Alert: A passcode is required to unlock this vault.");
  }

  // 2. Fetch the "Truth" from the Database
  // We only fetch the hash, keeping the rest of the metadata protected.
  const { data: gallery, error } = await supabase
    .from("galleries")
    .select("password_hash, is_active")
    .eq("id", galleryId)
    .single();

  if (error || !gallery) {
    console.error("Access Denied: Gallery ID does not exist or database is unreachable.");
    throw new Error("This vault does not exist or has been decommissioned.");
  }

  // 3. Status Verification
  if (!gallery.is_active) {
    throw new Error("This vault is currently locked by the administrator.");
  }

  // 4. Cryptographic Comparison (FR-102)
  // Bcrypt.compare is computationally expensive by design to prevent brute-force.
  const isMatch = await bcrypt.compare(enteredPasscode, gallery.password_hash);

  if (!isMatch) {
    // We provide a generic error message to prevent "account enumeration"
    throw new Error("Invalid passcode. Access denied.");
  }

  // 5. Authorization Success
  /**
   * Engineering Note: In a full production environment, we would set a 
   * JWT or Session Cookie here. For this architecture, we redirect to 
   * the private dynamic route.
   */
  redirect(`/gallery/${galleryId}`);
}