"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Senior Engineering: Lead Resolution Controller.
 * Updates the status to 'completed' and triggers a cache revalidation.
 */
export async function resolveLead(leadId: number) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("inquiries")
    .update({ status: 'completed' })
    .eq('id', leadId);
    
  if (error) {
    console.error("Failed to resolve lead:", error.message);
    throw new Error(error.message);
  }
  
  // NFR-202: Instant UI refresh by revalidating the admin path
  revalidatePath("/admin");
  return { success: true };
}