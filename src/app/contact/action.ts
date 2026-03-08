"use server";

import { createAdminClient } from "@/utils/supabase/server";

export async function logInquiry(formData: {
  name: string;
  email: string;
  session: string;
  date: string;
  vision: string;
}) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("inquiries")
    .insert([
      {
        client_name: formData.name,
        email: formData.email,
        commission_type: formData.session,
        event_date: formData.date,
        message: formData.vision,
        status: 'pending' 
      }
    ]);

  if (error) throw new Error(error.message);
  return { success: true };
}