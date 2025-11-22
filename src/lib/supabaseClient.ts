import { createClient } from "@supabase/supabase-js";

// Support both server and client environments
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL as string) || (process.env.SUPABASE_URL as string);
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string) || (process.env.SUPABASE_ANON_KEY as string);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or server equivalents)."
  );
}

export const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");