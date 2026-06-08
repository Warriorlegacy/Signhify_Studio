import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { project_id, path, referrer } = await req.json().catch(() => ({}));
  if (!project_id)
    return new Response(JSON.stringify({ error: "project_id required" }), {
      status: 400,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
  const country = req.headers.get("CF-IPCountry") || "Unknown";
  const { error } = await supabase
    .from("analytics")
    .insert({ project_id, path: path ?? "/", referrer: referrer ?? null, country });
  return new Response(JSON.stringify(error ? { error: error.message } : { ok: true }), {
    status: error ? 500 : 200,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
});
