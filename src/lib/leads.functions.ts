import { createServerFn } from "@tanstack/react-start";
import { leadSchema, type Lead } from "./leads-schema";

/**
 * Persist a lead from the Studio contact wizard. Validated server-side
 * with the same Zod schema the client uses. The admin client is imported
 * inside the handler so it never leaks into the client bundle graph.
 */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: Lead) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      type: data.type,
      scope: data.scope,
      budget: data.budget,
      timeline: data.timeline,
      goals: data.goals,
      message: data.message || null,
      source: "studio-wizard",
    });
    if (error) {
      console.error("[leads] insert failed", error);
      throw new Error("Could not save your lead. Please email hello@signhify.online.");
    }
    return { ok: true as const };
  });
