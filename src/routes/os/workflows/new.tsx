import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Activity, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/os/workflows/new")({
  head: () => ({
    meta: [
      { title: "New Workflow — Signhify OS" },
      {
        name: "description",
        content:
          "Signhify OS - Create a new orchestration workflow. Configure agents, schedule, and triggers.",
      },
      {
        property: "og:url",
        content: "https://signhify.online/os/workflows/new",
      },
      { property: "og:title", content: "New Workflow — Signhify OS" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/os/workflows/new" }],
  }),
  component: NewWorkflowPage,
});

const SCHEDULES = ["manual", "hourly", "daily", "weekly"] as const;
const TRIGGERS = ["webhook", "schedule", "manual"] as const;

function NewWorkflowPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState<string>(SCHEDULES[0]);
  const [trigger, setTrigger] = useState<string>(TRIGGERS[0]);
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const { data: agents } = useQuery({
    queryKey: ["os_agents_select"],
    queryFn: async () => [
      { id: "agent-1", name: "Research Agent" },
      { id: "agent-2", name: "Code Agent" },
      { id: "agent-3", name: "Design Agent" },
      { id: "agent-4", name: "QA Agent" },
      { id: "agent-5", name: "Deploy Agent" },
      { id: "agent-6", name: "Git Agent" },
    ],
  });

  function toggleAgent(agentId: string) {
    setSelectedAgents((prev) =>
      prev.includes(agentId) ? prev.filter((a) => a !== agentId) : [...prev, agentId],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ to: "/os/workflows" });
  }

  return (
    <section className="pt-20 pb-24 px-6 min-h-screen bg-background">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            to="/os/workflows"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to workflows
          </Link>
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Signhify OS</div>
          <h1 className="font-display text-3xl font-bold text-gradient">New Workflow</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Design a multi-agent orchestration workflow.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-xl border bg-card p-6 space-y-6">
            <h2 className="font-display text-lg font-bold">Basic Info</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Workflow"
                required
                className="w-full rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this workflow do?"
                rows={3}
                className="w-full rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-6">
            <h2 className="font-display text-lg font-bold">Configuration</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5">Schedule</label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              >
                {SCHEDULES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Trigger</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              >
                {TRIGGERS.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h2 className="font-display text-lg font-bold">Agents</h2>
            <p className="text-sm text-muted-foreground">
              Select the agents to include in this workflow.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {agents?.map((agent) => {
                const active = selectedAgents.includes(agent.id);
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => toggleAgent(agent.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-md border px-4 py-3 text-sm text-left transition-all",
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border bg-surface/30 text-muted-foreground hover:border-border/80",
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-4 rounded border flex items-center justify-center text-[10px] transition-all",
                        active
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border",
                      )}
                    >
                      {active ? "✓" : ""}
                    </span>
                    {agent.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              to="/os/workflows"
              className="rounded-md border border-border bg-surface/60 px-5 py-2.5 text-sm hover:bg-surface transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!name}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" /> Create Workflow
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
