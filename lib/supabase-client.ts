import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Ensure only a single instance of Supabase is created
const globalForSupabase = globalThis as unknown as { supabase: ReturnType<typeof createClient> }

export const supabase = globalForSupabase.supabase || createClient(supabaseUrl, supabaseKey)

// Assign to globalThis to avoid multiple instances in dev mode
if (process.env.NODE_ENV !== "production") globalForSupabase.supabase = supabase

