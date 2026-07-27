import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Bot, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveOSAgent } from "@/lib/os-state";

export const Route = createFileRoute("/os/agents/new")({
  head: () => ({
    meta: [
      { title: "New Agent — Signhify OS" },
      {
        name: "description",
        content:
          "Signhify OS - Create a new AI agent. Configure model, temperature, tools, and system prompt.",
      },
      {
        property: "og:url",
        content: "https://signhify.dpdns.org/os/agents/new",
      },
      { property: "og:title", content: "New Agent — Signhify OS" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/os/agents/new" }],
  }),
  component: NewAgentPage,
});

const MODELS = ["Claude Sonnet", "GPT-4o", "Gemini Pro", "DeepSeek V3"] as const;

const TOOLS = [
  { id: "code-gen", label: "Code Generation" },
  { id: "web-search", label: "Web Search" },
  { id: "file-read", label: "File Read" },
  { id: "git", label: "Git" },
  { id: "deploy", label: "Deploy" },
] as const;

function NewAgentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState<string>(MODELS[0]);
  const [temperature, setTemperature] = useState(0.5);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  function toggleTool(toolId: string) {
    setSelectedTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId],
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveOSAgent({
      name,
      description: description.trim() || undefined,
      model,
      tools: selectedTools,
    });
    queryClient.invalidateQueries({ queryKey: ["os_agents_list"] });
    queryClient.invalidateQueries({ queryKey: ["os_agents"] });
    queryClient.invalidateQueries({ queryKey: ["os_logs_dashboard"] });
    navigate({ to: "/os/agents" });
  }

  return (
    <section className="pt-20 pb-24 px-6 min-h-screen bg-background">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link
            to="/os/agents"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to agents
          </Link>
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Signhify OS</div>
          <h1 className="font-display text-3xl font-bold text-gradient">New Agent</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Configure a new AI agent for your orchestration runtime.
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
                placeholder="My Research Agent"
                required
                className="w-full rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of what this agent does..."
                rows={3}
                className="w-full rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-6">
            <h2 className="font-display text-lg font-bold">Configuration</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
              >
                {MODELS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                Temperature: {temperature.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Precise (0)</span>
                <span>Creative (1)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">System Prompt</label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="You are a helpful AI assistant specialized in..."
                rows={5}
                className="w-full rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none font-mono"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 space-y-4">
            <h2 className="font-display text-lg font-bold">Tools</h2>
            <p className="text-sm text-muted-foreground">Select the tools this agent can use.</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {TOOLS.map((tool) => {
                const active = selectedTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleTool(tool.id)}
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
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link
              to="/os/agents"
              className="rounded-md border border-border bg-surface/60 px-5 py-2.5 text-sm hover:bg-surface transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={!name}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" /> Create Agent
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
