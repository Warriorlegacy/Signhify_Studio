import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { PreviewCanvas } from "./PreviewCanvas";
import { TemplateGallery } from "./TemplateGallery";
import { useUser } from "@/hooks/useUser";
import {
  createScrollStudioProject,
  getScrollStudioProject,
} from "@/lib/scroll-studio-projects.functions";

// We keep a global non-reactive reference to avoid React state lag with massive base64 arrays.
// Guarded: this module is also evaluated during SSR where `window` is undefined.
if (typeof window !== "undefined") {
  (window as any)._signhifyScrollFrames = (window as any)._signhifyScrollFrames ?? [];
}

const STORAGE_KEY = "sh_studio_project";

export function ScrollStudioBuilder() {
  const { user, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const search = useSearch({ from: "/scroll-studio/" });
  const createFn = useServerFn(createScrollStudioProject);
  const getFn = useServerFn(getScrollStudioProject);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ html: string; css: string; js: string } | null>(
    null,
  );
  const [hasFrames, setHasFrames] = useState(false);
  const [frameCount, setFrameCount] = useState(0);
  const [creating, setCreating] = useState(false);

  const selectProject = useCallback((id: string | null) => {
    setProjectId(id);
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
    setPreviewData(null);
  }, []);

  // Restore the last opened project on revisit
  useEffect(() => {
    if (!user || projectId || search.prompt) return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setProjectId(saved);
  }, [user, projectId, search.prompt]);

  // Auto-create a project from the landing-page prompt (?prompt=)
  useEffect(() => {
    if (!user || !search.prompt || projectId || creating) return;
    let cancelled = false;
    setCreating(true);
    createFn({ data: { title: "New Scroll Site", initialPrompt: search.prompt } })
      .then((project) => {
        if (cancelled) return;
        selectProject(project.id);
        navigate({ to: "/scroll-studio", search: { prompt: undefined }, replace: true });
      })
      .catch(() => {})
      .finally(() => setCreating(false));
    return () => {
      cancelled = true;
    };
  }, [user, search.prompt, projectId, creating, createFn, navigate, selectProject]);

  // Load saved preview content when a project is selected
  useEffect(() => {
    if (!projectId) {
      setPreviewData(null);
      return;
    }
    let cancelled = false;
    getFn({ data: { id: projectId } })
      .then((project) => {
        if (cancelled || !project) return;
        if (project.current_html || project.current_css || project.current_js) {
          setPreviewData({
            html: project.current_html ?? "",
            css: project.current_css ?? "",
            js: project.current_js ?? "",
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [projectId, getFn]);

  // When frames are extracted, this callback is triggered from SettingsPanel
  const handleFramesExtracted = (frames: string[]) => {
    (window as any)._signhifyScrollFrames = frames;
    setHasFrames(true);

    // Auto-inject a payload if we have previewData
    if (previewData) {
      setPreviewData({ ...previewData }); // trigger re-render
    }
  };

  if (authLoading || creating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {creating ? "Creating your project..." : "Loading studio..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="font-display text-3xl font-bold">Scroll Studio</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to build cinematic, scroll-driven websites with AI.
        </p>
        <Link
          to="/login"
          search={{
            redirect: search.prompt
              ? `/scroll-studio?prompt=${encodeURIComponent(search.prompt)}`
              : "/scroll-studio",
          }}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  }

  const combinedHtml = previewData
    ? `
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
  `
    : null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar
        projectId={projectId}
        onProjectSelect={selectProject}
        onUpdatePreview={setPreviewData}
        onFramesExtracted={handleFramesExtracted}
      />
      <main className="flex-1 relative border-l border-border/50 bg-muted/20">
        {!projectId ? (
          <TemplateGallery onSelectProject={selectProject} />
        ) : (
          <PreviewCanvas projectId={projectId} previewHtml={combinedHtml} />
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
