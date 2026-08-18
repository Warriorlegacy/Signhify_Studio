import { createServerFn } from "@tanstack/react-start";
import { leadSchema, type Lead } from "./leads-schema";

/**
 * Persist a lead from the Studio contact wizard. Validated server-side
 * with the same Zod schema the client uses.
 */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input: Lead) => leadSchema.parse(input))
  .handler(async ({ data }) => {
    // POST straight to PostgREST with `Prefer: return=minimal` so the
    // INSERT skips RETURNING; the new row fails the SELECT RLS policy
    // (leads_deny_select), which turns any RETURNING insert into a 42501.
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key)
      throw new Error("Could not save your lead. Please email Piyushrajsingh092@gmail.com.");

    const res = await fetch(`${url}/rest/v1/leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
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
      }),
    });
    if (!res.ok) {
      console.error("[leads] insert failed", res.status, await res.text());
      throw new Error("Could not save your lead. Please email Piyushrajsingh092@gmail.com.");
    }
    return { ok: true as const };
  });
