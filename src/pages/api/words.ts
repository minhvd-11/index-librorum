import type { APIRoute } from "astro";
import { supabase } from "~/lib/supabase";

export const GET: APIRoute = async () => {
  const { data, error } = await supabase.from("words").select("*");
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify(data), { status: 200 });
};
