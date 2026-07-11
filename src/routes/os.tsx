import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Cpu, Terminal, Bot, Code, GitBranch, Activity, Clock, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/os")({
  head: () => ({
    meta: [
      { title: "OS — Signhify" },
      {
        name: "description",
        content:
          "Signhify OS - Agent orchestration runtime. Monitor and manage AI agents, workflows, and system performance.",
      },
      { property: "og:url", content: "https://signhify.online/os" },
      { property: "og:title", content: "OS — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/os" }],
  }),
  component: OSDashboard,
});

function OSDashboard() {
  // Query for agent orchestration data
  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ["os_agents"],
    queryFn: async () => {
      // This would typically fetch from a Supabase table or the hermes-agent system
      // For now, we'll return mock data showing what the OS would display
      return [
        {
          id: "agent-1",
          name: "Research Agent",
          status: "idle",
          lastActive: "2m ago",
          tasksCompleted: 24,
        },
        {
          id: "agent-2",
          name: "Code Agent",
          status: "running",
          lastActive: "30s ago",
          tasksCompleted: 42,
        },
        {
          id: "agent-3",
          name: "Design Agent",
          status: "idle",
          lastActive: "5m ago",
          tasksCompleted: 18,
        },
        {
          id: "agent-4",
          name: "QA Agent",
          status: "pending",
          lastActive: "10m ago",
          tasksCompleted: 31,
        },
      ];
    },
  });

  // Query for workflow orchestration data
  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ["os_workflows"],
    queryFn: async () => {
      return [
        { id: "wf-1", name: "Feature Development", status: "active", progress: 65, agents: 3 },
        { id: "wf-2", name: "Bug Fix Sprint", status: "completed", progress: 100, agents: 2 },
        { id: "wf-3", name: "Research Phase", status: "queued", progress: 0, agents: 1 },
      ];
    },
  });

  // Query for system metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["os_metrics"],
    queryFn: async () => {
      return {
        cpuUsage: 45,
        memoryUsage: 62,
        diskUsage: 28,
        networkIn: 1.2,
        networkOut: 0.8,
        uptime: "3 days, 14 hours",
      };
    },
  });

  if (agentsLoading || workflowsLoading || metricsLoading) {
    return (
      <section className="pt-20 pb-24 px-6 min-h-screen bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Signhify OS</div>
            <h1 className="font-display text-3xl font-bold text-gradient">
              Agent Orchestration Runtime
            </h1>
          </div>
          <div className="grid gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20 pb-24 px-6 min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Signhify OS</div>
          <h1 className="font-display text-3xl font-bold text-gradient">
            Agent Orchestration Runtime
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Monitor and manage AI agents, workflows, and system performance in real-time.
          </p>
        </div>

        {/* System Overview */}
        <div className="grid lg:grid-cols-4 gap-6 mb-10">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <Cpu className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">CPU</span>
            </div>
            <p className="text-2xl font-bold">{metrics?.cpuUsage}%</p>
            <p className="text-xs text-muted-foreground">
              Usage{" "}
              <span
                className={cn(
                  metrics?.cpuUsage! > 80
                    ? "text-destructive"
                    : metrics?.cpuUsage! > 60
                      ? "text-warning"
                      : "text-muted-foreground",
                )}
              >
                {metrics?.cpuUsage! > 80 ? "High" : metrics?.cpuUsage! > 60 ? "Medium" : "Normal"}
              </span>
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Memory</span>
            </div>
            <p className="text-2xl font-bold">{metrics?.memoryUsage}%</p>
            <p className="text-xs text-muted-foreground">
              Usage{" "}
              <span
                className={cn(
                  metrics?.memoryUsage! > 80
                    ? "text-destructive"
                    : metrics?.memoryUsage! > 60
                      ? "text-warning"
                      : "text-muted-foreground",
                )}
              >
                {metrics?.memoryUsage! > 80
                  ? "High"
                  : metrics?.memoryUsage! > 60
                    ? "Medium"
                    : "Normal"}
              </span>
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Uptime</span>
            </div>
            <p className="text-2xl font-bold">{metrics?.uptime}</p>
            <p className="text-xs text-muted-foreground">System online</p>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Agents</span>
            </div>
            <p className="text-2xl font-bold">{agents?.length}</p>
            <p className="text-xs text-muted-foreground">Active agents</p>
          </div>
        </div>

        {/* Agent Status */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Agent Status</h2>
            <Link
              to="/os/agents"
              className="rounded-md border border-border bg-surface/60 px-4 py-2 text-sm"
            >
              View all agents
            </Link>
          </div>
          <div className="space-y-4">
            {agents?.map((agent) => (
              <div key={agent.id} className="rounded-lg border bg-card p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center",
                        agent.status === "running"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : agent.status === "idle"
                            ? "bg-primary/20 text-primary"
                            : agent.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-muted/20 text-muted",
                      )}
                    >
                      {agent.status[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">{agent.status}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {agent.tasksCompleted} tasks completed
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span>Last active: {agent.lastActive}</span>
                  <span className="inline-flex h-3 w-3 rounded-full">
                    {agent.status === "running" && <div className="bg-primary animate-pulse" />}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Orchestration */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Workflow Orchestration</h2>
            <Link
              to="/os/workflows"
              className="rounded-md border border-border bg-surface/60 px-4 py-2 text-sm"
            >
              View all workflows
            </Link>
          </div>
          <div className="space-y-4">
            {workflows?.map((workflow) => (
              <div key={workflow.id} className="rounded-lg border bg-card p-5">
                <div className="mb-4">
                  <h3 className="font-display text-lg font-bold">{workflow.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {workflow.agents} agents • {workflow.progress}%
                  </p>
                  <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full bg-primary transition-all duration-500",
                        `width-${workflow.progress}%`,
                      )}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>{workflow.status}</span>
                  <span
                    className={cn(
                      workflow.status === "active"
                        ? "text-primary"
                        : workflow.status === "completed"
                          ? "text-emerald-500"
                          : workflow.status === "queued"
                            ? "text-yellow-500"
                            : "text-muted-foreground",
                    )}
                  >
                    {workflow.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="font-display text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid lg:grid-cols-3 gap-4">
            <Link
              to="/os/agents/new"
              className="group flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Bot className="h-8 w-8 text-primary mb-3" />
              <div className="text-center">
                <div className="font-display text-lg font-bold mb-2">New Agent</div>
                <p className="text-sm text-muted-foreground">Create a custom AI agent</p>
              </div>
            </Link>

            <Link
              to="/os/workflows/new"
              className="group flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Activity className="h-8 w-8 text-primary mb-3" />
              <div className="text-center">
                <div className="font-display text-lg font-bold mb-2">New Workflow</div>
                <p className="text-sm text-muted-foreground">Design an orchestration workflow</p>
              </div>
            </Link>

            <Link
              to="/os/marketplace"
              className="group flex flex-col items-center justify-center rounded-xl border border-border bg-card p-8 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <Search className="h-8 w-8 text-primary mb-3" />
              <div className="text-center">
                <div className="font-display text-lg font-bold mb-2">Agent Marketplace</div>
                <p className="text-sm text-muted-foreground">Discover and deploy AI agents</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Logs */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-bold">System Logs</h2>
            <Link
              to="/os/logs"
              className="rounded-md border border-border bg-surface/60 px-4 py-2 text-sm"
            >
              View all logs
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span>
                <Bot className="h-4 w-4 text-primary mr-2" /> orchestrator: Started workflow
                "Feature Development"
              </span>
              <span className="text-muted-foreground">2m ago</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>
                <Code className="h-4 w-4 text-primary mr-2" /> code-gen: Generated component
                "UserProfileCard"
              </span>
              <span className="text-muted-foreground">5m ago</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>
                <GitBranch className="h-4 w-4 text-primary mr-2" /> git-agent: Committed changes to
                main branch
              </span>
              <span className="text-muted-foreground">10m ago</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
