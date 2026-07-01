import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Code,
  GitBranch,
  ArrowLeft,
  Trash2,
  AlertCircle,
  Info,
  AlertTriangle,
  Terminal,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/os/logs")({
  head: () => ({
    meta: [
      { title: "System Logs — Signhify OS" },
      {
        name: "description",
        content:
          "Signhify OS - View and filter system logs from agents, workflows, and the orchestration runtime.",
      },
      { property: "og:url", content: "https://signhify.online/os/logs" },
      { property: "og:title", content: "System Logs — Signhify OS" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/os/logs" }],
  }),
  component: LogsPage,
});

const LEVELS = ["all", "info", "warn", "error"] as const;

const SOURCE_ICONS: Record<string, typeof Bot> = {
  orchestrator: Terminal,
  "code-gen": Code,
  "git-agent": GitBranch,
  "research-agent": Bot,
  "design-agent": Bot,
  "qa-agent": Bot,
  "deploy-agent": Bot,
};

function LogsPage() {
  const [level, setLevel] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: logs, isLoading } = useQuery({
    queryKey: ["os_logs"],
    queryFn: async () => [
      {
        id: "log-1",
        level: "info",
        source: "orchestrator",
        message: 'Started workflow "Feature Development"',
        timestamp: "2026-07-01T13:17:00Z",
      },
      {
        id: "log-2",
        level: "info",
        source: "code-gen",
        message: 'Generated component "UserProfileCard"',
        timestamp: "2026-07-01T13:15:00Z",
      },
      {
        id: "log-3",
        level: "info",
        source: "git-agent",
        message: "Committed changes to main branch",
        timestamp: "2026-07-01T13:10:00Z",
      },
      {
        id: "log-4",
        level: "warn",
        source: "orchestrator",
        message: "Workflow queue approaching capacity (78%)",
        timestamp: "2026-07-01T13:05:00Z",
      },
      {
        id: "log-5",
        level: "info",
        source: "research-agent",
        message: "Completed web research on topic 'RAG architectures'",
        timestamp: "2026-07-01T12:55:00Z",
      },
      {
        id: "log-6",
        level: "error",
        source: "deploy-agent",
        message: "Deployment failed: connection timeout to registry",
        timestamp: "2026-07-01T12:45:00Z",
      },
      {
        id: "log-7",
        level: "info",
        source: "qa-agent",
        message: "Test suite passed: 142/142 tests",
        timestamp: "2026-07-01T12:30:00Z",
      },
      {
        id: "log-8",
        level: "warn",
        source: "code-gen",
        message: "Deprecated API usage detected in generated code",
        timestamp: "2026-07-01T12:20:00Z",
      },
      {
        id: "log-9",
        level: "info",
        source: "design-agent",
        message: 'Generated design system: "Signhify UI v2"',
        timestamp: "2026-07-01T12:10:00Z",
      },
      {
        id: "log-10",
        level: "error",
        source: "orchestrator",
        message: "Agent 'Design Agent' failed to respond within timeout",
        timestamp: "2026-07-01T11:55:00Z",
      },
      {
        id: "log-11",
        level: "info",
        source: "git-agent",
        message: "Created branch 'feature/dark-mode'",
        timestamp: "2026-07-01T11:40:00Z",
      },
      {
        id: "log-12",
        level: "info",
        source: "orchestrator",
        message: 'Workflow "Bug Fix Sprint" completed successfully',
        timestamp: "2026-07-01T11:25:00Z",
      },
    ],
  });

  const filtered = logs?.filter((log) => level === "all" || log.level === level) ?? [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filtered.length]);

  const levelStyles: Record<string, string> = {
    info: "bg-primary/10 text-primary border-primary/20",
    warn: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const levelIcons: Record<string, typeof Info> = {
    info: Info,
    warn: AlertTriangle,
    error: AlertCircle,
  };

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

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
          <h1 className="font-display text-3xl font-bold text-gradient">System Logs</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-time log stream from agents and the orchestration runtime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
                  level === l
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-border/80",
                )}
              >
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              /* mock clear */
            }}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-4 py-2 text-sm hover:bg-surface transition-colors"
          >
            <Trash2 className="h-4 w-4" /> Clear logs
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-bold mb-2">No logs yet</h2>
            <p className="text-sm text-muted-foreground">
              {level !== "all"
                ? "No logs at this level. Try a different filter."
                : "Logs will appear here as agents and workflows execute."}
            </p>
          </div>
        ) : (
          <div
            ref={scrollRef}
            className="rounded-xl border bg-card overflow-hidden max-h-[600px] overflow-y-auto"
          >
            <div className="divide-y divide-border/50">
              {filtered.map((log) => {
                const LevelIcon = levelIcons[log.level] ?? Info;
                const SourceIcon = SOURCE_ICONS[log.source] ?? Terminal;
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-5 py-3 hover:bg-surface/30 transition-colors"
                  >
                    <div
                      className={cn(
                        "mt-0.5 rounded-md border p-1",
                        levelStyles[log.level] ?? levelStyles.info,
                      )}
                    >
                      <LevelIcon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground min-w-fit">
                          <SourceIcon className="h-3 w-3" />
                          {log.source}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="truncate">{log.message}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground min-w-fit whitespace-nowrap">
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
