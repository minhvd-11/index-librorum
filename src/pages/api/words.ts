import type { APIRoute } from "astro";
import { supabase } from "~/lib/supabase";
import type { Word } from "~/types";

export const GET: APIRoute = async () => {
  const { data, error } = await supabase.from("words").select("*");

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(data as Word[]), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
