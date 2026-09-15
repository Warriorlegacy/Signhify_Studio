import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/hooks/useUser";
import { getScrollStudioProjects } from "@/lib/scroll-studio-projects.functions";
import { createListingFromProject } from "@/lib/marketplace-creator.functions";
import { PromoVideoPanel } from "@/components/marketplace/PromoVideoPanel";

export const Route = createFileRoute("/creator_/new")({
  head: () => ({
    meta: [
      { title: "Create a Listing — Sell Your Blueprint | Signhify" },
      {
        name: "description",
        content:
          "Turn a blueprint you generated in Scroll Studio into a marketplace listing: set the title, description and price, add a promo video, and submit it for review.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Create a Marketplace Listing — Signhify" },
      {
        property: "og:description",
        content: "List a generated blueprint with a title, description, price and promo video.",
      },
    ],
  }),
  component: NewListingPage,
});

type Project = { id: string; title: string; created_at: string | null };

function NewListingPage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const listProjects = useServerFn(getScrollStudioProjects);
  const createFn = useServerFn(createListingFromProject);

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Template");
  const [price, setPrice] = useState("0");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/creator/new" } as any });
      return;
    }
    listProjects()
      .then((rows) => {
        const list = (rows ?? []) as Project[];
        setProjects(list);
        if (list.length && !projectId) {
          setProjectId(list[0].id);
          setTitle((t) => t || list[0].title || "");
        }
      })
      .catch(() => toast.error("Could not load your blueprints."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      toast.info("Pick a blueprint first.");
      return;
    }
    setBusy(true);
    try {
      const res = await createFn({
        data: {
          projectId,
          title,
          description,
          category,
          price_cents: Math.round(Number(price || 0) * 100),
        },
      });
      toast.success("Listing created — it goes live once approved.");
      navigate({ to: "/creator" });
      return res;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the listing.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <Link
          to="/creator"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
          Create a listing
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Pick a blueprint you built in Scroll Studio, describe it, set a price, and submit it for
          review. You can add a promo video that plays on the listing page.
        </p>

        {projects.length === 0 && !loading && (
          <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            You haven&apos;t saved a blueprint yet.{" "}
            <Link to="/scroll-studio" className="text-primary underline">
              Build one in Scroll Studio
            </Link>{" "}
            first.
          </div>
        )}

        {projects.length > 0 && (
          <form onSubmit={submit} className="mt-8 space-y-7">
            <div>
              <label className="text-sm font-medium">Blueprint</label>
              <select
                value={projectId ?? ""}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  const p = projects.find((x) => x.id === e.target.value);
                  if (p && !title.trim()) setTitle(p.title ?? "");
                }}
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title || "Untitled blueprint"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                className="mt-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Boutique Yoga Studio Landing Page"
                maxLength={120}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                className="mt-2 min-h-[140px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What the blueprint includes, who it suits, and what a buyer gets."
                maxLength={2000}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {description.trim().length}/20 characters minimum
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input
                  className="mt-2"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Template"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price (USD)</label>
                <Input
                  className="mt-2"
                  type="number"
                  min="0"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <p className="mt-1 text-xs text-muted-foreground">Use 0 to give it away free.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-sm font-medium">Promo video</h2>
              <p className="mt-1 mb-3 text-xs text-muted-foreground">
                Optional. Generate it before creating the listing and it gets attached
                automatically.
              </p>
              <PromoVideoPanel projectId={projectId} />
            </div>

            <Button type="submit" size="lg" disabled={busy}>
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Store className="mr-2 h-4 w-4" />
              )}
              Create listing
            </Button>
          </form>
        )}
      </div>
    </main>
  );
}
