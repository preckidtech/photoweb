"use server";

import { createAdminClient } from "@/utils/supabase/server";

/**
 * Senior Engineering: Secure Public Vault Fetcher.
 * Uses the Admin Client to securely bypass RLS and fetch ONLY the safe data
 * (id, name, and date). It strictly excludes the passcodes to prevent hacking.
 */
export async function getPublicVaults() {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("galleries")
    .select("id, name, created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch public vaults:", error.message);
    return [];
  }
  
  return data || [];
}