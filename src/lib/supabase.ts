import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Supabase configuration is missing. Ensure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_KEY are set in .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
