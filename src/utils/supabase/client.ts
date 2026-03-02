import { createBrowserClient } from '@supabase/ssr'

/**
 * Senior Engineering: This client is used for non-sensitive data
 * fetching, such as public portfolio images and AI face scanning.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}