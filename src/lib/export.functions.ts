import { createServerFn } from "@tanstack/react-start";
import JSZip from "jszip";

export const exportProjectZip = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const projectId = typeof obj?.projectId === "string" ? obj.projectId : "";
    if (!projectId) throw new Error("Project ID is required");
    return { projectId };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Fetch project
    const { data: project, error } = await (supabaseAdmin as any)
      .from("user_projects")
      .select("*")
      .eq("id", data.projectId)
      .single();

    if (error) {
      console.error("[exportProjectZip] Error:", error);
      throw new Error("Failed to fetch project for export");
    }

    // Actual implementation of ZIP building using JSZip
    const zip = new JSZip();
    
    // Add source code files
    zip.file("index.html", project.current_html || "<!DOCTYPE html>\\n<html>\\n<body>\\n</body>\\n</html>");
    zip.file("styles.css", project.current_css || "/* Styles */");
    zip.file("script.js", project.current_js || "// Script");
    zip.file("README.md", "# Exported Project\\n\\nDeploy this folder to any static hosting provider like Vercel, Netlify, or AWS S3.");

    // Fetch frames (if any) and add to a /frames folder
    const { data: frames } = await (supabaseAdmin as any)
      .from("frames")
      .select("*")
      .eq("project_id", data.projectId)
      .order("frame_index", { ascending: true });

    if (frames && frames.length > 0) {
      const framesFolder = zip.folder("frames");
      // In a fully real implementation we would fetch the image blobs here 
      // and attach them to the ZIP. For now, since they might be large and remote, 
      // we'll write a JSON manifest or placeholder text.
      framesFolder?.file("frames.json", JSON.stringify(frames, null, 2));
    }

    // Generate base64 string
    const zipBase64 = await zip.generateAsync({ type: "base64" });
    const mockDownloadUrl = `data:application/zip;base64,${zipBase64}`;

    return {
      success: true,
      downloadUrl: mockDownloadUrl,
      fileSizeMb: (zipBase64.length * 0.75) / (1024 * 1024), // Rough estimate
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  });
