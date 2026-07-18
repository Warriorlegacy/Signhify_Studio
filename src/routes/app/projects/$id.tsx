import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { supabase } from "@/integrations/supabase/client";
import { updateProjectTitle } from "@/lib/projects.functions";
import { createRun } from "@/lib/runs.functions";
import { exportToGitHub } from "@/lib/github.functions";
import { addCustomDomain } from "@/lib/cloudflare-domains.functions";
import { listSecretKeys, createSecret, deleteSecret } from "@/lib/secrets.functions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export const Route = createFileRoute("/app/projects/$id")({
  beforeLoad: requireAppAuth,
  loader: async ({ params }) => ({ id: params.id }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `Project ${loaderData?.id ?? ""} — Signhify` },
      {
        name: "description",
        content:
          "View Signhify project runs, artifacts, domains, settings, and deployment controls.",
      },
      {
        property: "og:url",
        content: `https://signhify.dpdns.org/app/projects/${loaderData?.id ?? ""}`,
      },
      { property: "og:title", content: "Project — Signhify" },
    ],
    links: [
      { rel: "canonical", href: `https://signhify.dpdns.org/app/projects/${loaderData?.id ?? ""}` },
    ],
  }),
  component: ProjectPage,
});
const badge = (s: string) =>
  s === "complete"
    ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
    : s === "running"
      ? "text-yellow-300 border-yellow-500/40 bg-yellow-500/10"
      : s === "budget_exceeded" || s === "failed"
        ? "text-red-300 border-red-500/40 bg-red-500/10"
        : "text-muted-foreground border-border bg-surface";
function ProjectPage() {
  const { id } = Route.useLoaderData();
  const nav = useNavigate();
  const [sheet, setSheet] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [domain, setDomain] = useState("");
  const [dns, setDns] = useState<any[]>([]);
  const [secretKey, setSecretKey] = useState("");
  const [secretValue, setSecretValue] = useState("");
  const update = useServerFn(updateProjectTitle);
  const start = useServerFn(createRun);
  const gh = useServerFn(exportToGitHub);
  const addDomain = useServerFn(addCustomDomain);
  const listSecrets = useServerFn(listSecretKeys);
  const addSecret = useServerFn(createSecret);
  const delSecret = useServerFn(deleteSecret);
  const project = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data } = await (supabase.from as any)("user_projects")
        .select("*")
        .eq("id", id)
        .eq("user_id", user?.id)
        .maybeSingle();
      if (!data) throw redirect({ to: "/app" });
      return data;
    },
  });
  const runs = useQuery({
    queryKey: ["runs", id],
    queryFn: async () => {
      const { data } = await (supabase.from as any)("runs")
        .select("*")
        .eq("project_id", id)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const artifacts = useQuery({
    queryKey: ["artifacts", id],
    queryFn: async () => {
      const { data } = await (supabase.from as any)("artifacts")
        .select("*")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  const secrets = useQuery({
    queryKey: ["secrets", id],
    queryFn: async () => (await listSecrets({ data: { projectId: id } })).secrets,
  });
  useEffect(() => {
    const ch = supabase
      .channel(`runs-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "runs", filter: `project_id=eq.${id}` },
        () => runs.refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [id]);
  if (project.isLoading) return <section className="pt-32 px-6 min-h-screen">Loading…</section>;
  const p = project.data;
  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <input
              defaultValue={p.title}
              onBlur={async (e) => {
                if (e.target.value !== p.title)
                  await update({ data: { projectId: id, title: e.target.value } });
              }}
              className="font-display text-4xl font-black bg-transparent outline-none"
            />
            <div className="mt-3 flex gap-2 text-sm">
              <span className={`rounded-full border px-2 py-1 ${badge(p.status)}`}>{p.status}</span>
              <span className="text-muted-foreground">
                {new Date(p.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSheet(true)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              New Run
            </button>
            <button
              onClick={async () => {
                const r = await gh({ data: { projectId: id } });
                toast.success("Exported to GitHub", { description: r.repoUrl });
              }}
              className="rounded-md border border-border bg-surface/60 px-4 py-2 text-sm"
            >
              Export to GitHub
            </button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="mt-10">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="domains">Domains</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-5">
              <Panel title="Runs">
                {runs.data?.length ? (
                  runs.data.map((r: any) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between border-b border-border py-3"
                    >
                      <span className={`rounded-full border px-2 py-1 text-xs ${badge(r.status)}`}>
                        {r.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </span>
                      <Link
                        to="/app/projects/$id/runs/$runId"
                        params={{ id, runId: r.id }}
                        className="text-primary text-sm"
                      >
                        View
                      </Link>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No runs yet</p>
                )}
              </Panel>
              <Panel title="Artifacts">
                {artifacts.data?.length ? (
                  artifacts.data.map((a: any) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between border-b border-border py-3"
                    >
                      <span className="rounded-full border border-border px-2 py-1 text-xs">
                        {a.type}
                      </span>
                      {a.url && (
                        <a href={a.url} className="text-primary text-sm">
                          Open
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No artifacts yet</p>
                )}
              </Panel>
            </div>
          </TabsContent>
          <TabsContent value="domains">
            <Panel title="Domains">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const r = await addDomain({ data: { projectId: id, domain } });
                  setDns(r.dnsRecords);
                }}
                className="flex gap-2"
              >
                <input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  placeholder="example.com"
                />
                <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                  Add Domain
                </button>
              </form>
              <p className="mt-4 text-sm text-muted-foreground">
                Point these DNS records at your domain registrar, then wait up to 24h for
                propagation.
              </p>
              {dns.map((d, i) => (
                <div key={i} className="mt-3 grid grid-cols-4 gap-2 text-sm">
                  <span>{d.type}</span>
                  <span>{d.name}</span>
                  <span className="col-span-2 font-mono">
                    {d.value}{" "}
                    <button onClick={() => navigator.clipboard.writeText(d.value)}>
                      <Copy size={12} />
                    </button>
                  </span>
                </div>
              ))}
            </Panel>
          </TabsContent>
          <TabsContent value="settings">
            <Panel title="Secrets">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await addSecret({ data: { projectId: id, key: secretKey, value: secretValue } });
                  setSecretKey("");
                  setSecretValue("");
                  secrets.refetch();
                }}
                className="grid sm:grid-cols-[1fr_1fr_auto] gap-2"
              >
                <input
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder="KEY"
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
                <input
                  value={secretValue}
                  onChange={(e) => setSecretValue(e.target.value)}
                  placeholder="Value"
                  type="password"
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
                />
                <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                  Add Secret
                </button>
              </form>
              <div className="mt-4 space-y-2">
                {secrets.data?.map((s: any) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between rounded-md border border-border p-3"
                  >
                    <span className="font-mono text-sm">{s.key}</span>
                    <button
                      onClick={async () => {
                        await delSecret({ data: { secretId: s.id, projectId: id } });
                        secrets.refetch();
                      }}
                      className="text-sm text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </Panel>
          </TabsContent>
        </Tabs>
        <Sheet open={sheet} onOpenChange={setSheet}>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>New Run</SheetTitle>
              <SheetDescription>Prompt the Signhify agent runtime.</SheetDescription>
            </SheetHeader>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-6 min-h-40 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            />
            <button
              onClick={async () => {
                const r = await start({ data: { projectId: id, prompt } });
                setSheet(false);
                await nav({ to: "/app/projects/$id/runs/$runId", params: { id, runId: r.runId } });
              }}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Loader2 className="hidden" size={14} />
              Start Run
            </button>
          </SheetContent>
        </Sheet>
      </div>
    </section>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
