import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Activity, Plus, Search, Play, Square, ArrowLeft, Users, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getOSWorkflows, toggleOSWorkflowStatus, deleteOSWorkflow } from "@/lib/os-state";

export const Route = createFileRoute("/os/workflows/")({
  head: () => ({
    meta: [
      { title: "Workflows — Signhify OS" },
      {
        name: "description",
        content:
          "Signhify OS - Orchestrate and manage agent workflows. Monitor progress, run and stop workflows.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/os/workflows" },
      { property: "og:title", content: "Workflows — Signhify OS" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/os/workflows" }],
  }),
  component: WorkflowListPage,
});

function WorkflowListPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: workflows, isLoading } = useQuery({
    queryKey: ["os_workflows_list"],
    queryFn: async () => getOSWorkflows(),
  });

  const handleToggle = (id: string) => {
    toggleOSWorkflowStatus(id);
    queryClient.invalidateQueries({ queryKey: ["os_workflows_list"] });
    queryClient.invalidateQueries({ queryKey: ["os_workflows"] });
    queryClient.invalidateQueries({ queryKey: ["os_logs_dashboard"] });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      deleteOSWorkflow(id);
      queryClient.invalidateQueries({ queryKey: ["os_workflows_list"] });
      queryClient.invalidateQueries({ queryKey: ["os_workflows"] });
      queryClient.invalidateQueries({ queryKey: ["os_logs_dashboard"] });
    }
  };

  const filtered = workflows?.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()));

  const statusStyles: Record<string, string> = {
    active: "text-primary",
    completed: "text-emerald-500",
    queued: "text-yellow-500",
    failed: "text-red-400",
  };

  const statusBg: Record<string, string> = {
    active: "bg-primary/10 text-primary",
    completed: "bg-emerald-500/10 text-emerald-400",
    queued: "bg-yellow-500/10 text-yellow-400",
    failed: "bg-red-500/10 text-red-400",
  };

  return (
    <section className="pt-20 pb-24 px-6 min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            to="/os"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to OS Dashboard
          </Link>
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Signhify OS</div>
          <h1 className="font-display text-3xl font-bold text-gradient">Workflows</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Orchestrate multi-agent workflows and monitor execution progress.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workflows..."
              className="w-full rounded-md border border-border bg-surface/60 pl-9 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <Link
            to="/os/workflows/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Workflow
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">
              {search ? "No workflows found" : "No workflows yet"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {search
                ? "Try a different search term."
                : "Create your first workflow to orchestrate agents."}
            </p>
            {!search && (
              <Link
                to="/os/workflows/new"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" /> Create Workflow
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered?.map((workflow) => (
              <div
                key={workflow.id}
                className="rounded-xl border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        workflow.status === "active"
                          ? "bg-primary/20 text-primary"
                          : workflow.status === "completed"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : workflow.status === "queued"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400",
                      )}
                    >
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{workflow.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {workflow.agents} agents
                        </span>
                        <span>Last run: {workflow.lastRun}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggle(workflow.id)}
                      className={cn(
                        "rounded-md border border-border p-2 transition-colors",
                        workflow.status === "active"
                          ? "hover:border-destructive hover:text-destructive"
                          : "hover:border-primary hover:text-primary",
                      )}
                      title={workflow.status === "active" ? "Stop workflow" : "Start workflow"}
                    >
                      {workflow.status === "active" ? (
                        <Square className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      className="rounded-md border border-border p-2 hover:border-destructive hover:text-destructive transition-colors"
                      title="Delete workflow"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-500 rounded-full",
                          workflow.status === "completed"
                            ? "bg-emerald-500"
                            : workflow.status === "failed"
                              ? "bg-red-400"
                              : "bg-primary",
                        )}
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                      statusBg[workflow.status] ?? "text-muted-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        workflow.status === "active"
                          ? "bg-primary animate-pulse"
                          : workflow.status === "completed"
                            ? "bg-emerald-400"
                            : workflow.status === "queued"
                              ? "bg-yellow-400"
                              : "bg-red-400",
                      )}
                    />
                    {workflow.status}
                  </span>
                  <span className="text-sm text-muted-foreground min-w-[3rem] text-right">
                    {workflow.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
