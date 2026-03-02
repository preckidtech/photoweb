"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function handleAdminLogin(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Authentication Failed: Invalid Credentials." };
  }

  // Success: Redirect to the main dashboard
  redirect("/admin");
}