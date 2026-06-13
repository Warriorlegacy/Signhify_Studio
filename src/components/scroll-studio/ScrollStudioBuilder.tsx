import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { PreviewCanvas } from "./PreviewCanvas";
import { TemplateGallery } from "./TemplateGallery";

// We keep a global non-reactive reference to avoid React state lag with massive base64 arrays
(window as any)._signhifyScrollFrames = [];

export function ScrollStudioBuilder() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ html: string; css: string; js: string } | null>(null);
  const [hasFrames, setHasFrames] = useState(false);

  // When frames are extracted, this callback is triggered from SettingsPanel
  const handleFramesExtracted = (frames: string[]) => {
    (window as any)._signhifyScrollFrames = frames;
    setHasFrames(true);
    
    // Auto-inject a payload if we have previewData
    if (previewData) {
      setPreviewData({ ...previewData }); // trigger re-render
    }
  };

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
        // Provide the iframe access to the parent's frame array
        window.getScrollFrames = () => window.parent._signhifyScrollFrames || [];
        
        // Execute the AI-generated logic
        try {
          ${previewData.js}
        } catch (e) {
          console.error("User script error:", e);
        }
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
        onFramesExtracted={handleFramesExtracted}
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
        
        {/* Helper overlay for frame status */}
        {hasFrames && projectId && (
          <div className="absolute bottom-4 right-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-3 py-1.5 rounded-full text-xs font-mono backdrop-blur-md flex items-center shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
            {(window as any)._signhifyScrollFrames?.length} frames ready for canvas
          </div>
        )}
      </main>
    </div>
  );
}