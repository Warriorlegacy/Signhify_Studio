import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Bot, Plus, Search, Power, PowerOff, Clock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/os/agents/")({
  head: () => ({
    meta: [
      { title: "Agents — Signhify OS" },
      {
        name: "description",
        content:
          "Signhify OS - Manage and monitor your AI agents. View agent status, tasks completed, and control agent lifecycle.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/os/agents" },
      { property: "og:title", content: "Agents — Signhify OS" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/os/agents" }],
  }),
  component: AgentListPage,
});

function AgentListPage() {
  const [search, setSearch] = useState("");

  const { data: agents, isLoading } = useQuery({
    queryKey: ["os_agents_list"],
    queryFn: async () => [
      {
        id: "agent-1",
        name: "Research Agent",
        status: "running",
        lastActive: "30s ago",
        tasksCompleted: 24,
        model: "Claude Sonnet",
      },
      {
        id: "agent-2",
        name: "Code Agent",
        status: "running",
        lastActive: "15s ago",
        tasksCompleted: 42,
        model: "GPT-4o",
      },
      {
        id: "agent-3",
        name: "Design Agent",
        status: "idle",
        lastActive: "5m ago",
        tasksCompleted: 18,
        model: "Gemini Pro",
      },
      {
        id: "agent-4",
        name: "QA Agent",
        status: "pending",
        lastActive: "10m ago",
        tasksCompleted: 31,
        model: "DeepSeek V3",
      },
      {
        id: "agent-5",
        name: "Deploy Agent",
        status: "error",
        lastActive: "1h ago",
        tasksCompleted: 7,
        model: "Claude Sonnet",
      },
      {
        id: "agent-6",
        name: "Git Agent",
        status: "idle",
        lastActive: "2m ago",
        tasksCompleted: 53,
        model: "GPT-4o",
      },
    ],
  });

  const filtered = agents?.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

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
          <h1 className="font-display text-3xl font-bold text-gradient">Agents</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Deploy, monitor, and manage your AI agents.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search agents..."
              className="w-full rounded-md border border-border bg-surface/60 pl-9 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <Link
            to="/os/agents/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> New Agent
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : filtered?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Bot className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">
              {search ? "No agents found" : "No agents yet"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {search ? "Try a different search term." : "Create your first agent to get started."}
            </p>
            {!search && (
              <Link
                to="/os/agents/new"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4" /> Create Agent
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered?.map((agent) => (
              <div
                key={agent.id}
                className="rounded-xl border bg-card p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold",
                        agent.status === "running"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : agent.status === "idle"
                            ? "bg-primary/20 text-primary"
                            : agent.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400",
                      )}
                    >
                      {agent.name[0]}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{agent.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                        <span className="flex items-center gap-1">
                          <Bot className="h-3 w-3" />
                          {agent.model}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {agent.tasksCompleted} tasks
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {agent.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                        agent.status === "running"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : agent.status === "idle"
                            ? "bg-primary/10 text-primary"
                            : agent.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-400"
                              : "bg-red-500/10 text-red-400",
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          agent.status === "running"
                            ? "bg-emerald-400 animate-pulse"
                            : agent.status === "idle"
                              ? "bg-primary"
                              : agent.status === "pending"
                                ? "bg-yellow-400 animate-pulse"
                                : "bg-red-400",
                        )}
                      />
                      {agent.status}
                    </span>
                    <button
                      onClick={() => {
                        // Mock toggle
                      }}
                      className={cn(
                        "rounded-md border p-2 transition-colors",
                        agent.status === "running"
                          ? "border-border hover:border-destructive hover:text-destructive"
                          : "border-border hover:border-primary hover:text-primary",
                      )}
                      title={agent.status === "running" ? "Deactivate agent" : "Activate agent"}
                    >
                      {agent.status === "running" ? (
                        <PowerOff className="h-4 w-4" />
                      ) : (
                        <Power className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
