import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.PUBLIC_SUPABASE_URL || "").trim();
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase configuration is missing:", {
    supabaseUrl,
    supabaseKey,
  });
  throw new Error("Supabase configuration is missing");
}

try {
  new URL(supabaseUrl);
} catch (err) {
  console.error("Invalid Supabase URL:", supabaseUrl, err);
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseKey);
