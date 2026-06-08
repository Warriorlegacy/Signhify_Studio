import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FolderOpen } from "lucide-react";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
export const Route = createFileRoute("/app/")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [
      { title: "Dashboard — Signhify" },
      {
        name: "description",
        content:
          "Manage your Signhify AI projects, runs, artifacts, deployments, domains, analytics, and secrets.",
      },
      { property: "og:url", content: "https://signhify.online/app" },
      { property: "og:title", content: "Dashboard — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/app" }],
  }),
  component: AppDashboard,
});
const color = (s: string) =>
  s === "complete"
    ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
    : s === "running"
      ? "text-yellow-300 border-yellow-500/40 bg-yellow-500/10"
      : "text-muted-foreground border-border bg-surface";
function AppDashboard() {
  const q = useQuery({
    queryKey: ["user_projects"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await (supabase.from as any)("user_projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Cloud workspace
            </div>
            <h1 className="font-display text-4xl font-black">Dashboard</h1>
          </div>
          <Link
            to="/app/projects/new"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Create your first project
          </Link>
        </div>
        {q.isLoading ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : q.data?.length ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {q.data.map((p: any) => (
              <article key={p.id} className="rounded-2xl border border-border bg-card p-5">
                <span
                  className={`text-[10px] uppercase rounded-full border px-2 py-1 ${color(p.status)}`}
                >
                  {p.status}
                </span>
                <h2 className="mt-4 font-display text-xl font-bold">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString()}
                </p>
                <Link
                  to="/app/projects/$id"
                  params={{ id: p.id }}
                  className="mt-5 inline-flex rounded-md border border-border bg-surface/60 px-4 py-2 text-sm"
                >
                  Open
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-20 grid place-items-center text-center">
            <FolderOpen size={72} className="text-muted-foreground" />
            <h2 className="mt-5 font-display text-2xl font-bold">No projects yet</h2>
            <Link
              to="/app/projects/new"
              className="mt-5 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Create your first project
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
