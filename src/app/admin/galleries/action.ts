"use server";

import { createClient } from "@/utils/supabase/server";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Senior Engineering: This Server Action handles Requirement FR-102.
 * It ensures that raw passwords never touch the database.
 */
export async function createGallery(formData: FormData) {
  const supabase = await createClient();

  // 1. Extract and Validate Input
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  if (!name || !password) {
    throw new Error("Engineering Alert: Name and Password are required to initialize a vault.");
  }

  // 2. Cryptographic Security (FR-102)
  // We use 12 salt rounds to ensure the hash is resistant to brute-force attacks.
  const password_hash = await bcrypt.hash(password, 12);

  // 3. Database Injection
  const { data, error } = await supabase
    .from("galleries")
    .insert([
      { 
        name, 
        password_hash, 
        is_active: true 
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase Injection Error:", error.message);
    throw new Error("Failed to record vault in the database.");
  }

  // 4. Cache Management (NFR-202)
  // This tells Next.js to clear the old gallery list and show the new one immediately.
  revalidatePath("/admin/galleries");
  revalidatePath("/gallery/access");

  // Optional: Redirect Benedicta to the upload page for the new gallery
  redirect(`/admin/uploads?galleryId=${data.id}`);
}
// setup