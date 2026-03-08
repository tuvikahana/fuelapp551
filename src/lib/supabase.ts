import { createClient } from '@supabase/supabase-js';

// Browser client (anon key – safe for client components / real-time)
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
