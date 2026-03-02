"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Senior Engineering: Vault Creation Engine (FR-103).
 * Explicitly handles the database connection and revalidation.
 */
export async function createGallery(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;

  // Database Injection
  const { data, error } = await supabase
    .from("galleries")
    .insert([{ name, password, is_active: true }])
    .select()
    .single();

  if (error) {
    console.error("Database Error:", error.message);
    return { error: "Failed to create vault. Ensure database connection." };
  }

  // Clear cache so the new vault appears in the search immediately
  revalidatePath("/gallery/access");
  revalidatePath("/admin/galleries");

  // Redirect to the success state or back to the list
  redirect("/admin/galleries");
}