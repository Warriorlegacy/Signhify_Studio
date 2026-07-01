import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { isAdminEmail } from "@/lib/admin";
import { supabase } from "@/integrations/supabase/client";
import { buildProduct, editProduct, ejectProduct, editFiles } from "@/lib/build-product.functions";
import {
  Loader2,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  Send,
  Sparkles,
  Layers,
  FileCode,
} from "lucide-react";

export const Route = createFileRoute("/builder")({
  head: ({ params }) => ({
    meta: [{ title: `Builder · Signhify AI` }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: BuilderPage,
});

type ChatMsg = { role: "user" | "assistant"; text: string; ts: number };
type FileEntry = { path: string; content: string };
type Version = {
  ts: number;
  note: string;
  mode: "single" | "multi";
  html?: string;
  files?: FileEntry[];
};
type Project = {
  id: string;
  name: string;
  mode: "single" | "multi";
  createdAt: number;
  updatedAt: number;
  chat: ChatMsg[];
  versions: Version[];
};

const LS_KEY = "signhify_builder_projects_v2";
const LS_ACTIVE = "signhify_builder_active_v2";

function loadProjects(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveProjects(p: Project[]) {
  window.localStorage.setItem(LS_KEY, JSON.stringify(p));
}
function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// Assemble multi-file project into a single HTML string for iframe preview.
function assembleMultiHtml(files: FileEntry[]): string {
  const index = files.find((f) => f.path === "index.html");
  if (!index) return "<!doctype html><html><body>No index.html</body></html>";
  let html = index.content;
  for (const f of files) {
    if (f.path === "index.html") continue;
    if (f.path.endsWith(".css")) {
      const re = new RegExp(
        `<link[^>]+href=["']${f.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*>`,
        "gi",
      );
      html = html.replace(re, `<style>\n${f.content}\n</style>`);
    } else if (f.path.endsWith(".js")) {
      const re = new RegExp(
        `<script[^>]+src=["']${f.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["'][^>]*></script>`,
        "gi",
      );
      html = html.replace(re, `<script>\n${f.content}\n</script>`);
    }
  }
  return html;
}

function BuilderPage() {
  const { user, loading } = useUser();
  const admin = isAdminEmail(user?.email);
  const projectId = user?.id;

  // State for the current project data
  const [project, setProject] = useState<Project | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState("Working…");
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [rightTab, setRightTab] = useState<"preview" | "code">("preview");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [presence, setPresence] = useState<any[]>([]); // For tracking other users' presence

  // Realtime channel subscriptions
  const projectChannelRef = useRef<any>(null);
  const presenceChannelRef = useRef<any>(null);

  // Load project data on mount and when projectId changes
  useEffect(() => {
    if (!projectId) return;

    async function loadProject() {
      const { data, error } = await supabase
        .from("builder_projects")
        .select("*")
        .eq("id", projectId!)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 means no rows returned
        console.error("Error loading project:", error);
        setError("Failed to load project");
        return;
      }

      if (data) {
        // Parse the stored project data
        const parsedProject = data.project_data as unknown as Project;
        setProject(parsedProject);
      } else {
        // If project doesn't exist, create a new one
        const newProject: Project = {
          id: projectId!,
          name: "Untitled build",
          mode: "single",
          createdAt: Date.now(),
          updatedAt: Date.now(),
          chat: [],
          versions: [],
        };
        setProject(newProject);
        // Save to database
        await supabase.from("builder_projects").insert({
          id: projectId,
          user_id: projectId!,
          project_data: newProject as any,
          version: 0,
        });
      }
    }

    loadProject();
  }, [projectId]);

  // Set up realtime subscription for project updates
  useEffect(() => {
    if (!projectId) return;

    projectChannelRef.current = supabase
      .channel(`builder-project:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "builder_projects",
          filter: `id=eq.${projectId}`,
        },
        (payload: any) => {
          const newData = payload.new as { project_data: Project; version: number };
          // Only update if the incoming version is newer than our current version
          // We don't store version in state, so we always update (simple last-write-wins)
          // In a more advanced implementation, we would compare versions and merge conflicts.
          setProject(newData.project_data);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectChannelRef.current);
    };
  }, [projectId]);

  // Set up presence channel
  useEffect(() => {
    if (!projectId) return;

    const channel: any = supabase.channel(`builder-presence:${projectId}`);
    presenceChannelRef.current = channel;
    channel
      .on("presence", { event: "join" }, () => {
        setPresence(channel.presenceState?.() ?? []);
      })
      .on("presence", { event: "leave" }, () => {
        setPresence(channel.presenceState?.() ?? []);
      })
      .subscribe(async () => {
        await channel.track?.({ user_id: user?.id, email: user?.email });
      });

    return () => {
      supabase.removeChannel(presenceChannelRef.current);
    };
  }, [projectId, user]);

  // Derive values from project
  const lastVersion = project?.versions.at(-1) || null;
  const currentHtml = lastVersion?.mode === "single" ? lastVersion.html || "" : "";
  const currentFiles = lastVersion?.mode === "multi" ? lastVersion.files || [] : [];
  const previewHtml = lastVersion?.mode === "multi" ? assembleMultiHtml(currentFiles) : currentHtml;

  // Pick a default selected file when switching to a multi project
  useEffect(() => {
    if (lastVersion?.mode === "multi" && currentFiles.length) {
      if (!selectedFile || !currentFiles.find((f) => f.path === selectedFile)) {
        setSelectedFile(currentFiles[0].path);
      }
    } else {
      setSelectedFile(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastVersion?.ts, project]);

  // Scroll to bottom when chat updates or when busy state changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [project?.chat.length, busy]);

  // Persist project updates to database
  const persistProject = async (updatedProject: Project) => {
    setProject(updatedProject);
    try {
      // Fetch current version to avoid overwriting with stale data (optional)
      const { data: currentData } = await supabase
        .from("builder_projects")
        .select("version")
        .eq("id", projectId!)
        .single();

      const newVersion = (currentData?.version ?? 0) + 1;

      await supabase
        .from("builder_projects")
        .update({
          project_data: updatedProject as any,
          version: newVersion,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId!);
    } catch (err) {
      console.error("Error persisting project:", err);
      setError("Failed to save changes");
    }
  };

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setError(null);

    if (!project) return;

    const userMsg: ChatMsg = { role: "user", text, ts: Date.now() };
    const working: Project = {
      ...project,
      chat: [...project.chat, userMsg],
      updatedAt: Date.now(),
    };

    // Optimistically update UI
    setProject(working);
    setInput("");
    setBusy(true);

    try {
      const isFirst = working.versions.length === 0;
      let version: Version;

      if (working.mode === "multi") {
        setBusyLabel("Editing files…");
        const baseFiles =
          working.versions.at(-1)?.files ||
          (working.versions.at(-1)?.html
            ? [{ path: "index.html", content: working.versions.at(-1)!.html! }]
            : []);
        const result = await editFiles({
          data: { files: baseFiles, instruction: text },
        });
        version = {
          ts: Date.now(),
          note: text.slice(0, 80),
          mode: "multi",
          files: result.files,
        };
      } else if (isFirst) {
        setBusyLabel("Building product…");
        const result = await buildProduct({ data: { prompt: text } });
        version = {
          ts: Date.now(),
          note: text.slice(0, 80),
          mode: "single",
          html: result.html,
        };
      } else {
        setBusyLabel("Editing build…");
        const result = await editProduct({
          data: { currentHtml: working.versions.at(-1)!.html!, instruction: text },
        });
        version = {
          ts: Date.now(),
          note: text.slice(0, 80),
          mode: "single",
          html: result.html,
        };
      }

      const asst: ChatMsg = {
        role: "assistant",
        text:
          working.mode === "multi"
            ? `Updated ${version.files!.length} files → v${working.versions.length + 1}.`
            : isFirst
              ? "Built v1 — see preview."
              : `Updated → v${working.versions.length + 1}.`,
        ts: Date.now(),
      };
      const done: Project = {
        ...working,
        chat: [...working.chat, asst],
        versions: [...working.versions, version],
        name: isFirst && working.mode === "single" ? text.slice(0, 40) : working.name,
        updatedAt: Date.now(),
      };

      await persistProject(done);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Build failed.");
      const asst: ChatMsg = {
        role: "assistant",
        text: `Error: ${e instanceof Error ? e.message : "build failed"}`,
        ts: Date.now(),
      };
      await persistProject({ ...working, chat: [...working.chat, asst] });
    } finally {
      setBusy(false);
    }
  }

  async function eject() {
    if (!project || !currentHtml || busy) return;
    setError(null);
    setBusy(true);
    setBusyLabel("Ejecting to multi-file…");
    try {
      const result = await ejectProduct({ data: { currentHtml } });
      const version: Version = {
        ts: Date.now(),
        note: "Ejected to multi-file",
        mode: "multi",
        files: result.files,
      };
      const asst: ChatMsg = {
        role: "assistant",
        text: `Ejected to ${result.files.length} files. You're now in multi-file mode — every edit will update the project.`,
        ts: Date.now(),
      };
      const done: Project = {
        ...project,
        mode: "multi",
        chat: [...project.chat, asst],
        versions: [...project.versions, version],
        updatedAt: Date.now(),
      };

      await persistProject(done);
      setRightTab("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Eject failed.");
    } finally {
      setBusy(false);
    }
  }

  function downloadSingle() {
    if (!previewHtml || !project) return;
    const blob = new Blob([previewHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "build"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadFile(path: string, content: string) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop() || path;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    if (!project) return;
    if (lastVersion?.mode === "multi") {
      for (const f of currentFiles) downloadFile(f.path, f.content);
    } else {
      downloadSingle();
    }
  }

  function openInTab() {
    if (!previewHtml) return;
    const w = window.open();
    if (w) {
      w.document.open();
      w.document.write(previewHtml);
      w.document.close();
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="font-display text-3xl font-bold">Builder</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue.</p>
        <Link
          to="/login"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <h1 className="font-display text-3xl font-bold">Restricted</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          The vibe-coding builder is private. Signed in as{" "}
          <span className="text-foreground">{user.email}</span>.
        </p>
        <Link to="/" className="text-sm text-primary underline">
          Back home
        </Link>
      </div>
    );
  }

  const selected = currentFiles.find((f) => f.path === selectedFile) || null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-white/10 bg-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-[#FF6A00]" />
            Builder
          </div>
          <button
            onClick={() => {
              // Create a new project by generating a new ID and redirecting
              const newId = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
              // We would need to navigate to the new project, but for simplicity, we just reset the current project.
              // In a real app, we would use the router to navigate to /builder/:newId
              alert("New project feature would navigate to a new project ID");
            }}
            className="rounded-md bg-[#FF6A00] px-2 py-1 text-xs font-semibold text-black hover:opacity-90"
            title="New project"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {project ? (
            <div className="mb-1 flex items-center gap-1 rounded-md px-2 py-1.5 text-sm bg-white/10">
              <span className="truncate text-left">{project.name}</span>
              {project.mode === "multi" && (
                <span className="rounded bg-[#FF6A00]/20 px-1 text-[9px] uppercase text-[#FF6A00]">
                  multi
                </span>
              )}
              {project.versions.length > 0 && (
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                  v{project.versions.length}
                </span>
              )}
            </div>
          ) : (
            <p className="px-2 py-4 text-xs text-white/40">Loading project...</p>
          )}
        </div>
        <div className="border-t border-white/10 px-3 py-2 text-[10px] text-white/40">
          <div>You: {user.email}</div>
          {presence.length > 0 && (
            <div className="mt-1">
              <span className="text-xs text-white/60">Online:</span>
              {presence.map((p, idx) => (
                <span key={idx} className="ml-1 text-xs text-white">
                  {p.email}
                  {idx === presence.length - 1 ? "" : ", "}
                </span>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Chat */}
      <section className="flex w-[380px] flex-col border-r border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          {project ? (
            <input
              value={project.name}
              onChange={(e) => {
                // Optimistically update the name
                const updated = { ...project, name: e.target.value };
                setProject(updated);
                persistProject(updated); // Fire and forget
              }}
              className="w-full bg-transparent text-sm font-semibold outline-none"
            />
          ) : (
            <span className="text-sm text-white/40">New build</span>
          )}
          <div className="ml-2 flex items-center gap-1">
            {project && (
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                {project.mode === "multi" ? "multi" : "single"}
              </span>
            )}
            {project && project.versions.length > 0 && (
              <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
                v{project.versions.length}
              </span>
            )}
          </div>
        </div>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
          {(!project || project.chat.length === 0) && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/60">
              Describe a product. e.g. <em>"A pomodoro timer with todo list, dark glassy UI."</em>
              <br />
              Iterate: <em>"Add a stats page with a chart."</em>
              <br />
              Hit <strong>Eject</strong> when you want index.html / styles.css / app.js / README.md.
            </div>
          )}
          {project?.chat.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg p-2.5 text-xs leading-relaxed ${
                m.role === "user"
                  ? "ml-6 bg-[#FF6A00]/15 text-white"
                  : "mr-6 bg-white/5 text-white/90"
              }`}
            >
              {m.text}
            </div>
          ))}
          {busy && (
            <div className="mr-6 flex items-center gap-2 rounded-lg bg-white/5 p-2.5 text-xs text-white/60">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {busyLabel}
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-200">
              {error}
            </div>
          )}
        </div>
        <div className="border-t border-white/10 p-2">
          <div className="flex items-end gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={
                project && project.versions.length > 0
                  ? "Describe what to change…"
                  : "Describe the product to build…"
              }
              rows={2}
              className="flex-1 resize-none bg-transparent text-xs outline-none placeholder:text-white/30"
            />
            <button
              onClick={send}
              disabled={busy || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded bg-[#FF6A00] text-black disabled:opacity-40"
              title="Send (⌘/Ctrl+Enter)"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Right pane: preview + code */}
      <section className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <div className="flex gap-1">
            <button
              onClick={() => setRightTab("preview")}
              className={`rounded px-2 py-1 text-xs ${
                rightTab === "preview" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setRightTab("code")}
              className={`rounded px-2 py-1 text-xs ${
                rightTab === "code" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
              }`}
            >
              Code{lastVersion?.mode === "multi" ? ` (${currentFiles.length})` : ""}
            </button>
          </div>
          <div className="flex gap-2">
            {project && project.mode === "single" && currentHtml && (
              <button
                onClick={eject}
                disabled={busy}
                className="flex items-center gap-1 rounded border border-[#FF6A00]/40 bg-[#FF6A00]/10 px-2 py-1 text-xs text-[#FF6A00] hover:bg-[#FF6A00]/20 disabled:opacity-30"
                title="Convert to multi-file project"
              >
                <Layers className="h-3 w-3" /> Eject
              </button>
            )}
            <button
              onClick={openInTab}
              disabled={!previewHtml}
              className="flex items-center gap-1 rounded border border-white/15 px-2 px-1 text-xs hover:bg-white/10 disabled:opacity-30"
            >
              <ExternalLink className="h-3 w-3" /> Open
            </button>
            <button
              onClick={downloadAll}
              disabled={!previewHtml}
              className="flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-30"
            >
              <Download className="h-3 w-3" />{" "}
              {lastVersion?.mode === "multi" ? "All files" : ".html"}
            </button>
          </div>
        </div>

        {rightTab === "preview" ? (
          <div className="flex-1 bg-white/5">
            {previewHtml ? (
              <iframe
                title="preview"
                srcDoc={previewHtml}
                sandbox="allow-scripts allow-forms allow-popups allow-modals"
                className="h-full w-full bg-white"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-white/40">
                No build yet — send your first prompt.
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {lastVersion?.mode === "multi" ? (
              <>
                <div className="w-52 overflow-y-auto border-r border-white/10 bg-black/30 p-2">
                  {currentFiles.map((f) => (
                    <button
                      key={f.path}
                      onClick={() => setSelectedFile(f.path)}
                      className={`mb-0.5 flex w-full items-center gap-1.5 truncate rounded px-2 py-1 text-left text-xs ${
                        selectedFile === f.path
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5"
                      }`}
                    >
                      <FileCode className="h-3 w-3 shrink-0" />
                      {f.path}
                    </button>
                  ))}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 text-[11px] text-white/50">
                    <span>{selected?.path || "—"}</span>
                    {selected && (
                      <button
                        onClick={() => downloadFile(selected.path, selected.content)}
                        className="text-white/50 hover:text-white"
                      >
                        <Download className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <pre className="flex-1 overflow-auto bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-white/85">
                    {selected?.content || ""}
                  </pre>
                </div>
              </>
            ) : (
              <pre className="flex-1 overflow-auto bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-white/85">
                {currentHtml || "// No build yet."}
              </pre>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
