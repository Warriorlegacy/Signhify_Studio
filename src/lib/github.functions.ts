import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const exportToGitHub = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ projectId: String((input as any)?.projectId ?? "") }))
  .handler(async ({ data, context }) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("Missing GITHUB_TOKEN.");
    const { supabase, userId } = context as any;
    const { data: project } = await supabase.from("user_projects").select("*").eq("id", data.projectId).eq("user_id", userId).single();
    if (!project) throw new Error("Project not found.");
    const { data: artifacts } = await supabase.from("artifacts").select("type,url").eq("user_id", userId);
    const slug = String(project.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "project";
    const repoName = `signhify-${slug}-export`;
    const repoRes = await fetch("https://api.github.com/user/repos", { method: "POST", headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "content-type": "application/json", "user-agent": "signhify" }, body: JSON.stringify({ name: repoName, private: true, auto_init: false }) });
    const repo = await repoRes.json();
    if (!repoRes.ok) throw new Error(repo?.message ?? "GitHub repo creation failed.");
    const readme = `# ${project.title}\n\n${project.description ?? "Exported from Signhify."}\n\n## Artifacts\n${(artifacts ?? []).map((a: any) => `- ${a.type ?? "artifact"}: ${a.url}`).join("\n") || "No artifacts yet."}\n`;
    const putRes = await fetch(`https://api.github.com/repos/${repo.full_name}/contents/README.md`, { method: "PUT", headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "content-type": "application/json", "user-agent": "signhify" }, body: JSON.stringify({ message: "Export Signhify project", content: btoa(unescape(encodeURIComponent(readme))) }) });
    if (!putRes.ok) throw new Error("README export failed.");
    return { repoUrl: repo.html_url as string };
  });
