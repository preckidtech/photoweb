"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function verifyPassword(formData: FormData, galleryId: string) {
  try {
    const supabase = createAdminClient();
    const enteredPasscode = formData.get("password") as string;

    if (!enteredPasscode) {
      return { error: "A passcode is required." };
    }

    if (!galleryId) {
      return { error: "System Error: Vault ID missing." };
    }

    // Attempt to fetch the vault
    const { data: gallery, error } = await supabase
      .from("galleries")
      .select("password, is_active")
      .eq("id", galleryId)
      .single();

    // SENIOR ENGINEERING: Show exact Database errors for debugging
    if (error) {
      console.error("Supabase Error:", error);
      return { error: `Database Error: ${error.message}` }; 
    }

    if (!gallery) {
      return { error: "This vault does not exist." };
    }

    if (!gallery.is_active) {
      return { error: "This vault is locked." };
    }

    // Verify the password
    if (enteredPasscode !== gallery.password) {
      return { error: "Invalid passcode. Access denied." };
    }

    // Issue Secure Cookie
    const cookieStore = await cookies();
    cookieStore.set(`vault_access_${galleryId}`, "granted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: `/gallery/${galleryId}`, 
    });

    return { success: true };
    
  } catch (err: any) {
    return { error: `Server Crash: ${err.message}` };
  }
}