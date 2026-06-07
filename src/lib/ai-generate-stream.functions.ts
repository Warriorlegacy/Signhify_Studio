import { createServerFn } from "@tanstack/react-start";

export const getGeneratePlanStreamConfig = createServerFn({ method: "POST" }).handler(async () => {
  const base = process.env.SUPABASE_URL;
  const bearer = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!base || !bearer) throw new Error("Missing Supabase Edge Function configuration.");
  return { url: `${base.replace(/\/$/, "")}/functions/v1/generate-plan`, bearer };
});
