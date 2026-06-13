import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { PreviewCanvas } from "./PreviewCanvas";
import { TemplateGallery } from "./TemplateGallery";

export function ScrollStudioBuilder() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ html: string; css: string; js: string } | null>(null);

  const combinedHtml = previewData ? `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; font-family: system-ui, sans-serif; }
        ${previewData.css}
      </style>
    </head>
    <body>
      ${previewData.html}
      <script>
        ${previewData.js}
      </script>
    </body>
    </html>
  ` : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar 
        projectId={projectId} 
        onProjectSelect={setProjectId} 
        onUpdatePreview={setPreviewData}
      />
      <main className="flex-1 relative border-l border-border/50 bg-muted/20">
        {!projectId ? (
          <TemplateGallery onSelectProject={setProjectId} />
        ) : (
          <PreviewCanvas 
            projectId={projectId} 
            previewHtml={combinedHtml} 
          />
        )}
      </main>
    </div>
  );
}