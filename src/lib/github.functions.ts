import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

function b64(s: string) {
  return btoa(unescape(encodeURIComponent(s)));
}

interface GhRequestInit extends RequestInit {
  url: string;
}

async function gh(token: string, init: GhRequestInit) {
  const res = await fetch("https://api.github.com" + init.url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "user-agent": "signhify",
      ...(init as any).headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as any)?.message ?? `GitHub ${res.status}`);
  return data;
}

export const exportToGitHub = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ({ projectId: String((input as any)?.projectId ?? "") }))
  .handler(async ({ data, context }) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("Missing GITHUB_TOKEN.");
    const { supabase, userId } = context as any;
    const { data: project } = await supabase
      .from("user_projects")
      .select("*")
      .eq("id", data.projectId)
      .eq("user_id", userId)
      .single();
    if (!project) throw new Error("Project not found.");
    const { data: artifacts } = await supabase
      .from("artifacts")
      .select("type,url")
      .eq("user_id", userId);
    const slug =
      String(project.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "project";
    const repoName = `signhify-${slug}-export`;
    const repo = await gh(token, {
      url: "/user/repos",
      method: "POST",
      body: JSON.stringify({ name: repoName, private: true, auto_init: false }),
    });
    const readme = `# ${project.title}\n\n${project.description ?? "Exported from Signhify."}\n\n## Artifacts\n${(artifacts ?? []).map((a: any) => `- ${a.type ?? "artifact"}: ${a.url}`).join("\n") || "No artifacts yet."}\n`;
    await gh(token, {
      url: `/repos/${(repo as any).full_name}/contents/README.md`,
      method: "PUT",
      body: JSON.stringify({ message: "Export Signhify project", content: b64(readme) }),
    });
    return { repoUrl: (repo as any).html_url as string };
  });

export type GitHubFile = { path: string; content: string };

export const exportArtifactsToGitHub = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    const files = Array.isArray(obj?.files)
      ? (obj.files as unknown[])
          .map((f) => {
            const fo = f as Record<string, unknown>;
            return { path: String(fo.path ?? ""), content: String(fo.content ?? "") };
          })
          .filter((f) => f.path)
      : [];
    const prompt = typeof obj?.prompt === "string" ? obj.prompt : "";
    if (!projectId) throw new Error("projectId is required");
    if (files.length === 0) throw new Error("files array required");
    return { projectId, files, prompt };
  })
  .handler(async ({ data, context }) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) throw new Error("Missing GITHUB_TOKEN.");
    const { supabase, userId } = context as any;
    const { data: project } = await supabase
      .from("user_projects")
      .select("*")
      .eq("id", data.projectId)
      .eq("user_id", userId)
      .single();
    if (!project) throw new Error("Project not found.");

    const slug =
      String(project.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "project";
    const repoName = `signhify-${slug}-${Date.now().toString(36)}`;
    const repo = await gh(token, {
      url: "/user/repos",
      method: "POST",
      body: JSON.stringify({ name: repoName, private: true, auto_init: true }),
    });

    const shaMap = new Map<string, string>();
    // fetch current tree
    const ref = await gh(token, { url: `/repos/${(repo as any).full_name}/git/refs/heads/main` });
    const commit = await gh(token, {
      url: `/repos/${(repo as any).full_name}/git/commits/${(ref as any).object.sha}`,
    });
    const tree = await gh(token, {
      url: `/repos/${(repo as any).full_name}/git/trees/${(commit as any).tree.sha}?recursive=1`,
    });
    for (const item of (tree as any).tree ?? []) {
      if (item.type === "blob") shaMap.set(item.path, item.sha);
    }

    const createBlob = async (path: string, content: string) => {
      const blob = await gh(token, {
        url: `/repos/${(repo as any).full_name}/git/blobs`,
        method: "POST",
        body: JSON.stringify({ content: b64(content), encoding: "base64" }),
      });
      return (blob as any).sha;
    };

    const newTreeEntries: any[] = [];
    for (const file of data.files) {
      const sha = await createBlob(file.path, file.content);
      newTreeEntries.push({ path: file.path, mode: "100644", type: "blob", sha });
    }

    const newTree = await gh(token, {
      url: `/repos/${(repo as any).full_name}/git/trees`,
      method: "POST",
      body: JSON.stringify({ tree: newTreeEntries, base_tree: (commit as any).tree.sha }),
    });
    const newCommit = await gh(token, {
      url: `/repos/${(repo as any).full_name}/git/commits`,
      method: "POST",
      body: JSON.stringify({
        message: `chore: ${data.prompt || "Signhify generated artifacts"}`,
        tree: (newTree as any).sha,
        parents: [(commit as any).sha],
      }),
    });
    await gh(token, {
      url: `/repos/${(repo as any).full_name}/git/refs/heads/main`,
      method: "PATCH",
      body: JSON.stringify({ sha: (newCommit as any).sha }),
    });

    // Create PR from main -> new branch for review (or just return repo)
    const branchName = `signhify/${Date.now().toString(36)}`;
    const branchRef = await gh(token, {
      url: `/repos/${(repo as any).full_name}/git/refs`,
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: (newCommit as any).sha }),
    });
    const pr = await gh(token, {
      url: `/repos/${(repo as any).full_name}/pulls`,
      method: "POST",
      body: JSON.stringify({
        title: `Signhify: ${data.prompt || "generated artifacts"}`,
        head: branchName,
        base: "main",
        body: "Generated by Signhify AI autonomous build engine.",
      }),
    });

    return {
      repoUrl: (repo as any).html_url as string,
      prUrl: (pr as any).html_url as string,
      branch: branchName,
    };
  });
