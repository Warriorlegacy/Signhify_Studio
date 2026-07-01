import { createFileRoute, Link } from "@tanstack/react-router";
import { Cpu, Workflow, Bot, ShoppingBag, ScrollText, ArrowRight } from "lucide-react";

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
  component: OsLanding,
});

const tiles = [
  {
    to: "/os/agents",
    icon: Bot,
    title: "Agents",
    desc: "Browse, configure and deploy autonomous AI agents.",
    accent: "from-violet-500/25 to-violet-500/0",
  },
  {
    to: "/os/workflows",
    icon: Workflow,
    title: "Workflows",
    desc: "Compose multi-step pipelines with guardrails and branching.",
    accent: "from-amber-500/25 to-amber-500/0",
  },
  {
    to: "/os/marketplace",
    icon: ShoppingBag,
    title: "Marketplace",
    desc: "Discover community agents and one-click workflow templates.",
    accent: "from-sky-500/25 to-sky-500/0",
  },
  {
    to: "/os/logs",
    icon: ScrollText,
    title: "Logs",
    desc: "Stream real-time execution logs for every agent run.",
    accent: "from-emerald-500/25 to-emerald-500/0",
  },
];

function OsLanding() {
  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-surface">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.22em] text-primary">
            Signhify OS
          </span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tight leading-[1.1]">
          Agent orchestration
          <br />
          <span className="text-muted-foreground">runtime.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-muted-foreground leading-relaxed">
          Deploy agents, chain workflows, browse the community marketplace, and
          tail live execution logs — all from one surface.
        </p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiles.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${t.accent} p-5 flex flex-col justify-between hover:border-primary/40 transition`}
            >
              <div>
                <t.icon className="h-5 w-5 text-foreground/70 mb-3" />
                <h3 className="font-display text-lg font-bold">{t.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {t.desc}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-foreground/70 group-hover:text-foreground transition">
                Open <ArrowRight size={12} className="group-hover:translate-x-0.5 transition" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex gap-3">
          <Link
            to="/os/agents/new"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-4px_var(--primary-glow)] hover:brightness-110 transition"
          >
            New Agent <ArrowRight size={13} />
          </Link>
          <Link
            to="/os/workflows/new"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary/40 transition"
          >
            New Workflow
          </Link>
        </div>
      </div>
    </section>
  );
}
