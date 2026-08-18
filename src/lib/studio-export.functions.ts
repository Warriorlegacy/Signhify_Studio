import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { deployToCloudflare } from "./cloudflare.server";
import JSZip from "jszip";

type SiteFile = { name: string; content: string };

// ponytail: structural typing against postgrest's chained builders is impractical; repo convention is `supabase: any` in context casts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseLike = any;

function validateInput(input: unknown) {
  const obj = (input ?? {}) as Record<string, unknown>;
  const projectId = typeof obj.projectId === "string" ? obj.projectId.trim() : "";
  if (!projectId) throw new Error("Project ID is required");
  const files = Array.isArray(obj.files)
    ? (obj.files as SiteFile[]).filter(
        (f) => f && typeof f.name === "string" && typeof f.content === "string",
      )
    : undefined;
  return { projectId, files };
}

async function resolveProjectFiles(
  supabase: SupabaseLike,
  userId: string,
  projectId: string,
  files?: SiteFile[],
): Promise<SiteFile[]> {
  if (files && files.length > 0) return files;
  const { data: project, error } = await supabase
    .from("user_projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", userId)
    .single();
  if (error || !project) throw new Error("Project not found or access denied");
  return [
    {
      name: "index.html",
      content: project.current_html || "<!DOCTYPE html>\n<html>\n<body>\n</body>\n</html>",
    },
    { name: "styles.css", content: project.current_css || "/* Styles */" },
    { name: "script.js", content: project.current_js || "// Script" },
  ];
}

export const exportScrollStudioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validateInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const fileList = await resolveProjectFiles(supabase, userId, data.projectId, data.files);

    const zip = new JSZip();
    fileList.forEach((file) => zip.file(file.name, file.content));
    zip.file(
      "README.md",
      "# Signhify Scroll Site\n\nDeploy this folder to any static hosting provider (Vercel, Netlify, Cloudflare Pages).",
    );
    const zipBase64 = await zip.generateAsync({ type: "base64" });

    return {
      success: true,
      downloadUrl: `data:application/zip;base64,${zipBase64}`,
      fileName: `${data.projectId.replace(/[^a-z0-9-]/gi, "") || "scroll-site"}.zip`,
    };
  });

export const deployScrollStudioProject = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validateInput)
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const fileList = await resolveProjectFiles(supabase, userId, data.projectId, data.files);

    const slug = data.projectId.replace(/[^a-z0-9-]/gi, "").slice(0, 24) || "scroll-site";
    const deployment = await deployToCloudflare({
      projectSlug: slug,
      userId,
      files: fileList,
    });

    const { error: updateError } = await supabase
      .from("user_projects")
      .update({ published_url: deployment.deploymentUrl, status: "published" })
      .eq("id", data.projectId)
      .eq("user_id", userId);
    if (updateError) console.warn("[deployScrollStudioProject] failed to record URL:", updateError);

    return { success: true, deploymentUrl: deployment.deploymentUrl };
  });
