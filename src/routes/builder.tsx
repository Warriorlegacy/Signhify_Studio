import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { isAdminEmail } from "@/lib/admin";
import { buildProduct, editProduct } from "@/lib/build-product.functions";
import { Loader2, Plus, Trash2, Download, ExternalLink, Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/builder")({
  head: () => ({
    meta: [
      { title: "Builder · Signhify AI" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BuilderPage,
});

type ChatMsg = { role: "user" | "assistant"; text: string; ts: number };
type Version = { html: string; ts: number; note: string };
type Project = {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  chat: ChatMsg[];
  versions: Version[];
};

const LS_KEY = "signhify_builder_projects_v1";
const LS_ACTIVE = "signhify_builder_active_v1";

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

function BuilderPage() {
  const { user, loading } = useUser();
  const admin = isAdminEmail(user?.email);

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ps = loadProjects();
    setProjects(ps);
    const active = window.localStorage.getItem(LS_ACTIVE);
    setActiveId(active && ps.find((p) => p.id === active) ? active : ps[0]?.id ?? null);
  }, []);

  useEffect(() => {
    if (activeId) window.localStorage.setItem(LS_ACTIVE, activeId);
  }, [activeId]);

  const active = useMemo(() => projects.find((p) => p.id === activeId) || null, [projects, activeId]);
  const currentHtml = active?.versions.at(-1)?.html || "";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [active?.chat.length, busy]);

  function persist(next: Project[]) {
    setProjects(next);
    saveProjects(next);
  }

  function newProject() {
    const p: Project = {
      id: uid(),
      name: "Untitled build",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      chat: [],
      versions: [],
    };
    persist([p, ...projects]);
    setActiveId(p.id);
    setInput("");
    setError(null);
  }

  function deleteProject(id: string) {
    const next = projects.filter((p) => p.id !== id);
    persist(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  }

  function renameProject(id: string, name: string) {
    persist(projects.map((p) => (p.id === id ? { ...p, name } : p)));
  }

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setError(null);

    let project = active;
    if (!project) {
      project = {
        id: uid(),
        name: text.slice(0, 40),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        chat: [],
        versions: [],
      };
      const next = [project, ...projects];
      persist(next);
      setActiveId(project.id);
    }

    const userMsg: ChatMsg = { role: "user", text, ts: Date.now() };
    let working: Project = { ...project, chat: [...project.chat, userMsg], updatedAt: Date.now() };
    persist(projects.map((p) => (p.id === working.id ? working : p)).concat(projects.find((p) => p.id === working.id) ? [] : [working]));
    setInput("");
    setBusy(true);

    try {
      const isFirst = working.versions.length === 0;
      const result = isFirst
        ? await buildProduct({ data: { prompt: text } })
        : await editProduct({ data: { currentHtml: working.versions.at(-1)!.html, instruction: text } });

      const version: Version = { html: result.html, ts: Date.now(), note: text.slice(0, 80) };
      const asst: ChatMsg = {
        role: "assistant",
        text: isFirst ? "Built v1 — see preview." : `Updated → v${working.versions.length + 1}.`,
        ts: Date.now(),
      };
      const done: Project = {
        ...working,
        chat: [...working.chat, asst],
        versions: [...working.versions, version],
        name: isFirst ? text.slice(0, 40) : working.name,
        updatedAt: Date.now(),
      };
      persist(projects.map((p) => (p.id === done.id ? done : p)).concat(projects.find((p) => p.id === done.id) ? [] : [done]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Build failed.");
      const asst: ChatMsg = {
        role: "assistant",
        text: `Error: ${e instanceof Error ? e.message : "build failed"}`,
        ts: Date.now(),
      };
      const failed: Project = { ...working, chat: [...working.chat, asst] };
      persist(projects.map((p) => (p.id === failed.id ? failed : p)));
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!currentHtml || !active) return;
    const blob = new Blob([currentHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${active.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase() || "build"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openInTab() {
    if (!currentHtml) return;
    const w = window.open();
    if (w) {
      w.document.open();
      w.document.write(currentHtml);
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

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-white/10 bg-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-[#FF6A00]" />
            Builder
          </div>
          <button
            onClick={newProject}
            className="rounded-md bg-[#FF6A00] px-2 py-1 text-xs font-semibold text-black hover:opacity-90"
            title="New project"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {projects.length === 0 && (
            <p className="px-2 py-4 text-xs text-white/40">No projects yet. Hit + to start.</p>
          )}
          {projects.map((p) => (
            <div
              key={p.id}
              className={`group mb-1 flex items-center gap-1 rounded-md px-2 py-1.5 text-sm ${
                p.id === activeId ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <button
                onClick={() => setActiveId(p.id)}
                className="flex-1 truncate text-left"
                title={p.name}
              >
                {p.name}
              </button>
              <button
                onClick={() => deleteProject(p.id)}
                className="opacity-0 transition group-hover:opacity-100"
                title="Delete"
              >
                <Trash2 className="h-3.5 w-3.5 text-white/50 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 px-3 py-2 text-[10px] text-white/40">
          {user.email}
        </div>
      </aside>

      {/* Chat */}
      <section className="flex w-[420px] flex-col border-r border-white/10">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          {active ? (
            <input
              value={active.name}
              onChange={(e) => renameProject(active.id, e.target.value)}
              className="w-full bg-transparent text-sm font-semibold outline-none"
            />
          ) : (
            <span className="text-sm text-white/40">New build</span>
          )}
          {active && active.versions.length > 0 && (
            <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px]">
              v{active.versions.length}
            </span>
          )}
        </div>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
          {(!active || active.chat.length === 0) && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/60">
              Describe a product. e.g. <em>"A pomodoro timer with todo list, dark glassy UI."</em>
              <br />
              Iterate after: <em>"Add a stats page with a chart."</em>
            </div>
          )}
          {active?.chat.map((m, i) => (
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
              {active && active.versions.length > 0 ? "Editing build…" : "Building product…"}
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
                active && active.versions.length > 0
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

      {/* Preview */}
      <section className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <span className="text-xs text-white/50">Live preview</span>
          <div className="flex gap-2">
            <button
              onClick={openInTab}
              disabled={!currentHtml}
              className="flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-30"
            >
              <ExternalLink className="h-3 w-3" /> Open
            </button>
            <button
              onClick={download}
              disabled={!currentHtml}
              className="flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-30"
            >
              <Download className="h-3 w-3" /> .html
            </button>
          </div>
        </div>
        <div className="flex-1 bg-white/5">
          {currentHtml ? (
            <iframe
              title="preview"
              srcDoc={currentHtml}
              sandbox="allow-scripts allow-forms allow-popups allow-modals"
              className="h-full w-full bg-white"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-white/40">
              No build yet — send your first prompt.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
