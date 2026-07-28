import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Cpu, Terminal, Bot, Code, GitBranch, Activity, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getOSAgents, getOSWorkflows, getOSLogs } from "@/lib/os-state";

export const Route = createFileRoute("/os/")({
  head: () => ({
    meta: [
      { title: "Signhify OS — Agent Orchestration Runtime" },
      {
        name: "description",
        content:
          "Signhify OS: deploy autonomous agents, chain workflows, browse the agent marketplace, and stream real-time logs.",
      },
      { property: "og:title", content: "Signhify OS" },
      { property: "og:description", content: "Agent orchestration runtime." },
    ],
  }),
  component: OSDashboard,
});

const SOURCE_ICONS: Record<string, typeof Bot> = {
  orchestrator: Terminal,
  "code-gen": Code,
  "git-agent": GitBranch,
  "research-agent": Bot,
  "design-agent": Bot,
  "qa-agent": Bot,
  "deploy-agent": Bot,
};

function OSDashboard() {
  const { data: agents, isLoading: agentsLoading } = useQuery({
    queryKey: ["os_agents"],
    queryFn: async () => getOSAgents(),
  });

  const { data: workflows, isLoading: workflowsLoading } = useQuery({
    queryKey: ["os_workflows"],
    queryFn: async () => getOSWorkflows(),
  });

  const { data: logs, isLoading: logsLoading } = useQuery({
    queryKey: ["os_logs_dashboard"],
    queryFn: async () => getOSLogs(),
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["os_metrics"],
    queryFn: async () => ({
      cpuUsage: 45,
      memoryUsage: 62,
      diskUsage: 28,
      networkIn: 1.2,
      networkOut: 0.8,
      uptime: "3 days, 14 hours",
    }),
  });

  if (agentsLoading || workflowsLoading || metricsLoading || logsLoading) {
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

        <div className="grid lg:grid-cols-4 gap-6 mb-10">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <Cpu className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">CPU</span>
            </div>
            <p className="text-2xl font-bold">{metrics?.cpuUsage}%</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <Terminal className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Memory</span>
            </div>
            <p className="text-2xl font-bold">{metrics?.memoryUsage}%</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <Activity className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Uptime</span>
            </div>
            <p className="text-2xl font-bold">{metrics?.uptime}</p>
          </div>
          <div className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between mb-3">
              <Bot className="h-5 w-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Agents</span>
            </div>
            <p className="text-2xl font-bold">{agents?.length}</p>
          </div>
        </div>

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
                            : "bg-yellow-500/20 text-yellow-400",
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
                <div className="text-xs">Last active: {agent.lastActive}</div>
              </div>
            ))}
          </div>
        </div>

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
                <h3 className="font-display text-lg font-bold">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {workflow.agents} agents • {workflow.progress}%
                </p>
                <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${workflow.progress}%` }}
                  />
                </div>
                <div className="mt-2 text-xs">{workflow.status}</div>
              </div>
            ))}
          </div>
        </div>

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
            {logs?.slice(0, 5).map((log: any) => {
              const Icon = SOURCE_ICONS[log.source] || Bot;
              return (
                <div key={log.id} className="flex items-center gap-2 text-xs">
                  <Icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-mono text-muted-foreground shrink-0">[{log.source}]:</span>
                  <span className="truncate">{log.message}</span>
                  <span className="ml-auto text-muted-foreground text-[10px] shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
            {(!logs || logs.length === 0) && (
              <p className="text-xs text-muted-foreground">No logs available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
