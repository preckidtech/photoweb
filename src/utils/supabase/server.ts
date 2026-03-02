import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Senior Engineering: This function initializes a secure, 
 * server-side Supabase client.
 * * It is required for Admin actions and private gallery viewing.
 */
export async function createClient() {
  // In Next.js 16, cookies() returns a promise and MUST be awaited 
  // to prevent the property 'getAll' does not exist error.
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // This can be safely ignored if called from a Server Component.
          }
        },
      },
    }
  )
}