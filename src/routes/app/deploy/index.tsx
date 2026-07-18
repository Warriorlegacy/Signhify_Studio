import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, RefreshCw, Plus, Rocket, Clock, ExternalLink, RotateCcw } from "lucide-react";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/app/deploy/")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [{ title: "Deploy — Signhify" }],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/app/deploy" }],
  }),
  component: DeployDashboard,
});

const badgeColor = (s: string) =>
  s === "deployed" || s === "complete"
    ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
    : s === "deploying" || s === "running"
      ? "text-yellow-300 border-yellow-500/40 bg-yellow-500/10"
      : s === "failed"
        ? "text-red-300 border-red-500/40 bg-red-500/10"
        : "text-muted-foreground border-border bg-surface";

function DeployDashboard() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const projectsQ = useQuery({
    queryKey: ["user_projects_deploy"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];
      const { data } = await (supabase.from as any)("user_projects")
        .select("*, runs:project_runs(*)")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const rollback = useMutation({
    mutationFn: async (projectId: string) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");
      const { data: runs } = await (supabase.from as any)("project_runs")
        .select("*")
        .eq("project_id", projectId)
        .eq("status", "complete")
        .order("created_at", { ascending: false })
        .limit(1);
      if (!runs?.length) throw new Error("No previous deployment found");
      const { error } = await (supabase.from as any)("project_runs").insert([
        {
          project_id: projectId,
          status: "deploying",
          triggered_by: user.user.id,
          rollback_from: runs[0].id,
        },
      ]);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user_projects_deploy"] }),
  });

  const projects = (projectsQ.data ?? []) as any[];
  const totalDeploys = projects.reduce((sum: number, p: any) => sum + (p.runs?.length ?? 0), 0);
  const activeDomains = projects.filter((p: any) =>
    p.runs?.some((r: any) => r.status === "deployed" || r.status === "complete"),
  ).length;
  const lastDeploy = projects
    .flatMap((p: any) => p.runs ?? [])
    .sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Cloud workspace
            </div>
            <h1 className="font-display text-4xl font-black">Deploy</h1>
          </div>
          <Link
            to="/app/projects/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            <Plus size={16} />
            New Deploy
          </Link>
        </div>

        <div className="mt-8 grid sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Rocket size={20} />
              <span className="text-sm">Total Deploys</span>
            </div>
            <p className="mt-3 font-display text-3xl font-black">{totalDeploys}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Globe size={20} />
              <span className="text-sm">Active Domains</span>
            </div>
            <p className="mt-3 font-display text-3xl font-black">{activeDomains}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock size={20} />
              <span className="text-sm">Last Deploy</span>
            </div>
            <p className="mt-3 font-display text-lg font-bold">
              {lastDeploy ? new Date(lastDeploy.created_at).toLocaleDateString() : "—"}
            </p>
          </div>
        </div>

        {projectsQ.isLoading ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : projects.length ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((p: any) => {
              const latestRun = p.runs?.[0];
              const deployUrl = `https://${String(p.title)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")}.signhify.app`;
              return (
                <article key={p.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] uppercase rounded-full border px-2 py-1 ${badgeColor(latestRun?.status ?? "idle")}`}
                    >
                      {latestRun?.status ?? "idle"}
                    </span>
                    {latestRun && (
                      <a
                        href={deployUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                  <h2 className="mt-4 font-display text-xl font-bold">{p.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {latestRun
                      ? new Date(latestRun.created_at).toLocaleDateString()
                      : "Not deployed"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground truncate">{deployUrl}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      to="/app/projects/$id"
                      params={{ id: p.id }}
                      className="rounded-md border border-border bg-surface/60 px-4 py-2 text-sm"
                    >
                      Open
                    </Link>
                    {latestRun && (
                      <button
                        onClick={() => rollback.mutate(p.id)}
                        disabled={rollback.isPending}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-surface/60 px-4 py-2 text-sm disabled:opacity-50"
                      >
                        <RotateCcw size={14} />
                        Rollback
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-20 grid place-items-center text-center">
            <Rocket size={72} className="text-muted-foreground" />
            <h2 className="mt-5 font-display text-2xl font-bold">No deployments yet</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              Create a project and deploy it to Cloudflare Pages with one click.
            </p>
            <Link
              to="/app/projects/new"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Plus size={16} />
              Create your first project
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
