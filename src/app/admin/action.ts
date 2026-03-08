"use server";

import { createAdminClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * SENIOR ENGINEERING: Lead Resolution Controller.
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
  
  // Instant UI refresh by revalidating the admin path
  revalidatePath("/admin");
  return { success: true };
}

/**
 * SENIOR ENGINEERING: Surgical Vault Deletion.
 * Removes a vault and cascades the deletion to associated media records.
 */
export async function deleteVault(vaultId: string) {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase
      .from("galleries")
      .delete()
      .eq("id", vaultId);

    if (error) throw new Error(error.message);

    // Refresh the dashboard to instantly remove the vault from the table
    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("Deletion failed:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * SENIOR ENGINEERING: Surgical Asset Deletion.
 * Wipes the physical file from the storage bucket to prevent memory leaks,
 * then removes the catalog record from the database.
 */
export async function deleteSingleAsset(mediaId: string, storagePath: string) {
  const supabase = createAdminClient();
  
  try {
    // 1. Erase the physical file from the Supabase bucket
    const { error: storageError } = await supabase.storage
      .from("client-galleries")
      .remove([storagePath]);

    if (storageError) throw new Error(`Storage Error: ${storageError.message}`);

    // 2. Erase the database record
    const { error: dbError } = await supabase
      .from("media")
      .delete()
      .eq("id", mediaId);

    if (dbError) throw new Error(`Database Error: ${dbError.message}`);

    // Refresh both the admin dashboard and the public portfolio instantly
    revalidatePath("/admin/portfolio");
    revalidatePath("/portfolio"); 
    
    return { success: true };
  } catch (error: any) {
    console.error("Asset deletion failed:", error.message);
    return { success: false, error: error.message };
  }
}