import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const addCustomDomain = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({
    projectId: String((input as any)?.projectId ?? ""),
    domain: String((input as any)?.domain ?? "")
      .trim()
      .toLowerCase(),
  }))
  .handler(async ({ data, context }) => {
    const token = process.env.CLOUDFLARE_API_TOKEN;
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    if (!token || !accountId) throw new Error("Missing Cloudflare credentials.");
    const { supabase, userId } = context as any;
    const { data: project } = await supabase
      .from("user_projects")
      .select("title")
      .eq("id", data.projectId)
      .eq("user_id", userId)
      .single();
    if (!project) throw new Error("Project not found.");
    const slug = String(project.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const projectName = `signhify-${slug}`;
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/domains`,
      {
        method: "PATCH",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ name: data.domain }),
      },
    );
    return { dnsRecords: [{ type: "CNAME", name: data.domain, value: `${slug}.signhify.app` }] };
  });
