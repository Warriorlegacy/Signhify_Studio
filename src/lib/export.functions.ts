import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import JSZip from "jszip";

export const exportProjectZip = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const projectId = (input as Record<string, unknown>)?.projectId;
    if (typeof projectId !== "string" || !projectId.trim())
      throw new Error("Project ID is required");
    return { projectId: projectId.trim() };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { projectId } = data;

    const { data: project, error } = await supabase
      .from("user_projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", userId)
      .single();

    if (error || !project) {
      throw new Error("Project not found or access denied");
    }

    const zip = new JSZip();

    zip.file(
      "index.html",
      project.current_html || "<!DOCTYPE html>\n<html>\n<body>\n</body>\n</html>",
    );
    zip.file("styles.css", project.current_css || "/* Styles */");
    zip.file("script.js", project.current_js || "// Script");
    zip.file(
      "README.md",
      "# Exported Project\n\nDeploy this folder to any static hosting provider like Vercel, Netlify, or AWS S3.",
    );

    const { data: frames } = await supabase
      .from("frames")
      .select("*")
      .eq("project_id", projectId)
      .order("frame_index", { ascending: true });

    if (frames && frames.length > 0) {
      const framesFolder = zip.folder("frames");
      framesFolder?.file("frames.json", JSON.stringify(frames, null, 2));
    }

    const zipBase64 = await zip.generateAsync({ type: "base64" });
    const mockDownloadUrl = `data:application/zip;base64,${zipBase64}`;

    return {
      success: true,
      downloadUrl: mockDownloadUrl,
      fileSizeMb: (zipBase64.length * 0.75) / (1024 * 1024),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  });
