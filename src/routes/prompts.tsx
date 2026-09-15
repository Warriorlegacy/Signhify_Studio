import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { History, Plus, Sparkles, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useUser";
import {
  deleteSavedPrompt,
  listPromptVersions,
  listSavedPrompts,
  savePrompt,
  type PromptVersion,
  type SavedPrompt,
} from "@/lib/prompt-library.functions";

export const Route = createFileRoute("/prompts")({
  component: PromptLibraryPage,
  head: () => ({
    meta: [
      { title: "Prompt Library — Reusable Blueprint Prompts | Signhify" },
      {
        name: "description",
        content:
          "Save, reuse and version the prompts that generate your Signhify blueprints. Every run is tracked so you know which prompt built which site.",
      },
      { property: "og:title", content: "Prompt Library — Signhify" },
      {
        property: "og:description",
        content:
          "Browse, save and reuse blueprint prompts, with a full version history of every blueprint they generated.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const STARTERS = [
  {
    title: "Cinematic SaaS landing page",
    category: "saas",
    body: "A cinematic dark landing page for a SaaS product. Full-screen scroll-driven hero, a proof strip of logos, a three-step feature tour, an integrations grid, transparent pricing, a short FAQ and a closing call to action. Bold typography, generous whitespace, ember-orange accents on near-black.",
  },
  {
    title: "Boutique studio / agency site",
    category: "agency",
    body: "A premium agency site with a cinematic hero, a services grid, three case studies with measurable outcomes, a clear process timeline, fixed-price packages, a booking section and a footer. Editorial layout, high-contrast typography, subtle scroll reveals.",
  },
  {
    title: "Product launch / waitlist page",
    category: "launch",
    body: "A single-page product launch site with a hero that states the promise in one line, an animated product preview, three benefit blocks, social proof, a waitlist form and a footer. Fast, minimal, mobile-first.",
  },
  {
    title: "Portfolio with selected work",
    category: "portfolio",
    body: "A personal portfolio with a striking hero, a selected-work gallery with hover detail, one deep-dive project page, a short about section and contact links. Quiet, confident, type-led design.",
  },
];

function PromptLibraryPage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const listFn = useServerFn(listSavedPrompts);
  const saveFn = useServerFn(savePrompt);
  const deleteFn = useServerFn(deleteSavedPrompt);
  const versionsFn = useServerFn(listPromptVersions);

  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<SavedPrompt | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [historyFor, setHistoryFor] = useState<SavedPrompt | null>(null);
  const [versions, setVersions] = useState<PromptVersion[]>([]);

  const reload = useCallback(() => {
    listFn()
      .then(setPrompts)
      .catch(() => toast.error("Could not load your prompt library."));
  }, [listFn]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/prompts" } });
      return;
    }
    reload();
  }, [user, loading, navigate, reload]);

  const resetForm = () => {
    setEditing(null);
    setTitle("");
    setBody("");
    setCategory("general");
  };

  const submit = async () => {
    setBusy(true);
    try {
      await saveFn({
        data: { id: editing?.id ?? null, title, body, category },
      });
      toast.success(editing ? "Prompt updated — a new version was saved." : "Prompt saved.");
      resetForm();
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save the prompt.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (p: SavedPrompt) => {
    if (!confirm(`Delete "${p.title}"? Its history goes too.`)) return;
    try {
      await deleteFn({ data: { id: p.id } });
      toast.success("Prompt deleted.");
      if (historyFor?.id === p.id) setHistoryFor(null);
      reload();
    } catch {
      toast.error("Could not delete the prompt.");
    }
  };

  const openHistory = async (p: SavedPrompt) => {
    setHistoryFor(p);
    setVersions([]);
    try {
      setVersions(await versionsFn({ data: { promptId: p.id } }));
    } catch {
      toast.error("Could not load the history.");
    }
  };

  const useInStudio = (p: SavedPrompt) => {
    try {
      sessionStorage.setItem("scroll-studio:promptId", p.id);
    } catch {
      /* storage unavailable — the prompt still runs, just untracked */
    }
    navigate({ to: "/scroll-studio", search: { prompt: p.body } });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Prompt library</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Save the prompts that work, reuse them in Scroll Studio, and keep a version history
              of every blueprint they generated.
            </p>
          </div>
          <Link
            to="/scroll-studio"
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Open Scroll Studio
          </Link>
        </header>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            {prompts.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                No saved prompts yet. Start from one of the templates on the right, or write your
                own.
              </div>
            )}

            {prompts.map((p) => (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold tracking-tight">{p.title}</h2>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {p.category} · updated {new Date(p.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="shrink-0 bg-[#f97316] font-semibold text-black shadow-lg shadow-[#f97316]/20 hover:bg-[#fb923c]"
                    onClick={() => useInStudio(p)}
                  >
                    <Wand2 className="mr-2 h-4 w-4" /> Use in Studio
                  </Button>
                </div>

                <p className="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-border/60 pt-4">
                  <Button size="sm" variant="ghost" onClick={() => openHistory(p)}>
                    <History className="mr-1.5 h-3.5 w-3.5" />
                    {historyFor?.id === p.id ? "Hide history" : "History"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditing(p);
                      setTitle(p.title);
                      setBody(p.body);
                      setCategory(p.category);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => remove(p)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>

                {historyFor?.id === p.id && (
                  <div className="mt-5 rounded-xl border border-border/60 bg-muted/30 p-5">
                    <h3 className="text-sm font-medium">Version history</h3>
                    {versions.length === 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">No versions recorded yet.</p>
                    )}
                    <ol className="mt-4 space-y-3">
                      {versions.map((v) => (
                        <li
                          key={v.id}
                          className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
                        >
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
                            v{v.version}
                          </span>
                          <span>{new Date(v.created_at).toLocaleString()}</span>
                          {v.project_title && (
                            <span className="text-foreground">
                              → generated “{v.project_title}”
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </article>
            ))}
          </section>

          <aside className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-sm font-medium">
                <Plus className="h-4 w-4" />
                {editing ? "Edit prompt" : "New prompt"}
              </h2>
              <div className="mt-4 space-y-3">
                <Input
                  placeholder="Name it, e.g. Cinematic SaaS landing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  placeholder="Category (saas, agency, portfolio…)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <Textarea
                  placeholder="Describe the site you want generated…"
                  className="min-h-[160px]"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button onClick={submit} disabled={busy || !title.trim() || body.trim().length < 10}>
                    {busy ? "Saving…" : editing ? "Save new version" : "Save prompt"}
                  </Button>
                  {editing && (
                    <Button variant="ghost" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" /> Start from a template
              </h2>
              <ul className="mt-3 space-y-2">
                {STARTERS.map((s) => (
                  <li key={s.title}>
                    <button
                      className="w-full rounded-lg border border-border/60 p-3 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setEditing(null);
                        setTitle(s.title);
                        setCategory(s.category);
                        setBody(s.body);
                      }}
                    >
                      <span className="block font-medium">{s.title}</span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                        {s.body}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
