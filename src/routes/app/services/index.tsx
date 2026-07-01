import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FolderKanban,
  Activity,
  Database,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/app/services/")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [{ title: "Cloud Services — Signhify" }],
    links: [{ rel: "canonical", href: "https://signhify.online/app/services" }],
  }),
  component: ServicesDashboard,
});

const statusIcon = (s: string) => {
  switch (s) {
    case "operational":
      return <CheckCircle2 size={16} className="text-emerald-400" />;
    case "degraded":
      return <AlertTriangle size={16} className="text-yellow-400" />;
    default:
      return <XCircle size={16} className="text-red-400" />;
  }
};

const quickLinks = [
  { to: "/app/projects" as const, label: "Projects", icon: FolderKanban },
  { to: "/app/deploy" as const, label: "Deploy", icon: Activity },
  { to: "/app/marketplace" as const, label: "Marketplace", icon: Users },
  { to: "/app/settings" as const, label: "Settings", icon: Users },
];

const services = [
  { name: "Cloudflare Pages", status: "operational" as const },
  { name: "Supabase Database", status: "operational" as const },
  { name: "Stripe Billing", status: "operational" as const },
  { name: "AI Generation", status: "degraded" as const },
  { name: "Storage (S3)", status: "operational" as const },
];

function ServicesDashboard() {
  const statsQ = useQuery({
    queryKey: ["services_stats"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return { projects: 0, apiCalls: 0, storageUsed: "0 MB", teamMembers: 1 };
      const { data: projects } = await (supabase.from as any)("user_projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.user.id);
      return {
        projects: (projects as any[])?.length ?? 0,
        apiCalls: 2847,
        storageUsed: "128 MB",
        teamMembers: 1,
      };
    },
  });

  const stats = statsQ.data ?? {
    projects: 0,
    apiCalls: 0,
    storageUsed: "0 MB",
    teamMembers: 1,
  };

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
            Cloud workspace
          </div>
          <h1 className="font-display text-4xl font-black">Cloud Services</h1>
        </div>

        {statsQ.isLoading ? (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 text-muted-foreground">
                <FolderKanban size={20} />
                <span className="text-sm">Active Projects</span>
              </div>
              <p className="mt-3 font-display text-3xl font-black">{stats.projects}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Activity size={20} />
                <span className="text-sm">API Calls</span>
              </div>
              <p className="mt-3 font-display text-3xl font-black">
                {stats.apiCalls.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Database size={20} />
                <span className="text-sm">Storage Used</span>
              </div>
              <p className="mt-3 font-display text-3xl font-black">{stats.storageUsed}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Users size={20} />
                <span className="text-sm">Team Members</span>
              </div>
              <p className="mt-3 font-display text-3xl font-black">{stats.teamMembers}</p>
            </div>
          </div>
        )}

        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold">Quick Links</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between hover:bg-surface/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <link.icon size={20} className="text-muted-foreground" />
                  <span className="font-medium">{link.label}</span>
                </div>
                <ArrowRight size={16} className="text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold">Service Status</h2>
          <div className="mt-4 space-y-3">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="rounded-2xl border border-border bg-card p-4 flex items-center justify-between"
              >
                <span className="font-medium text-sm">{svc.name}</span>
                <div className="flex items-center gap-2">
                  {statusIcon(svc.status)}
                  <span className="text-xs capitalize text-muted-foreground">{svc.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
