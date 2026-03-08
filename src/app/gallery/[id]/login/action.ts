"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * Senior Engineering: Vault Authentication Engine (FR-102).
 * Securely verifies the client's passcode against the database 
 * and issues an HTTP-only cookie to grant access to the private route.
 */
export async function verifyPassword(formData: FormData, galleryId: string) {
  // 1. Use God Mode to securely read the locked galleries table
  const supabase = createAdminClient();
  const enteredPasscode = formData.get("password") as string;

  if (!enteredPasscode) {
    return { error: "A passcode is required to unlock this vault." };
  }

  // 2. Fetch the true passcode and status from the database
  const { data: gallery, error } = await supabase
    .from("galleries")
    .select("password, is_active")
    .eq("id", galleryId)
    .single();

  if (error || !gallery) {
    console.error("Access Denied: Vault ID missing.");
    return { error: "This vault does not exist or has been decommissioned." };
  }

  // 3. Status Verification
  if (!gallery.is_active) {
    return { error: "This vault is currently locked by Benedicta Visual Studio." };
  }

  // 4. Verification Check
  if (enteredPasscode !== gallery.password) {
    return { error: "Invalid passcode. Access denied." };
  }

  // 5. Authorization Success: Issue a Secure Token (Cookie)
  // This securely "stamps" the user's browser so they can view the photos.
  const cookieStore = await cookies();
  cookieStore.set(`vault_access_${galleryId}`, "granted", {
    httpOnly: true, // Prevents hackers from stealing the cookie via JavaScript
    secure: process.env.NODE_ENV === "production", // Forces HTTPS in production
    maxAge: 60 * 60 * 24 * 7, // Keeps them logged in for 7 days
    path: `/gallery/${galleryId}`, // Locks the cookie ONLY to this specific vault
  });

  return { success: true };
}