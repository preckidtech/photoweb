"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Senior Engineering: Vault Creation Engine.
 * Uses Admin Client to bypass database security walls and successfully insert data.
 */
export async function createGallery(formData: FormData) {
  // Use the new Admin Client
  const supabase = createAdminClient(); 
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  // Attempt Database Injection
  const { data, error } = await supabase
    .from("galleries")
    .insert([{ name, password, is_active: true }])
    .select()
    .single();

  if (error) {
    console.error("Database Error:", error.message);
    // Return the EXACT error message so we know if something else is wrong
    return { error: `Database Error: ${error.message}` }; 
  }

  // Clear cache so the new vault appears immediately
  revalidatePath("/gallery/access");
  revalidatePath("/admin/galleries");

  return { success: true };
}