import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ExternalLink,
  Cpu,
  Database,
  LayoutDashboard,
  Rocket,
  Sparkles,
} from "lucide-react";
import { getSavedPlan, type GeneratedPlan } from "@/lib/ai-generate.functions";

export const Route = createFileRoute("/ai/share/$id")({
  loader: async ({ params }) => {
    try {
      const result = await getSavedPlan({ data: { id: params.id } });
      if (!result) throw notFound();
      return { session: result };
    } catch (e) {
      console.error("[ai.share.$id] loader failed:", e);
      throw notFound();
    }
  },
  head: ({ loaderData }) => {
    const s = loaderData?.session;
    if (!s) {
      return { meta: [{ title: "Shared Plan — Signhify AI" }] };
    }
    const title = `${s.plan.productName} — Product Plan by Signhify AI`;
    const description = s.plan.oneLiner;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
      ],
    };
  },
  notFoundComponent: () => (
    <section className="pt-40 pb-24 mx-auto max-w-3xl px-6 text-center">
      <h1 className="font-display text-4xl font-bold">Plan not found</h1>
      <p className="mt-3 text-muted-foreground">
        The shared product plan you are looking for does not exist or has expired.
      </p>
      <Link
        to="/ai"
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        <ArrowLeft size={14} /> Go to Signhify AI
      </Link>
    </section>
  ),
  component: SharedPlanPage,
});

const AGENT_ICONS = [
  Sparkles, // Product Strategist
  Database, // System Architect
  LayoutDashboard, // UI/UX Designer
  Cpu, // Frontend Engineer
  Database, // Backend Engineer
  Rocket, // Deployment Agent
];

function SharedPlanPage() {
  const { session } = Route.useLoaderData();
  const { plan, prompt } = session;

  return (
    <section className="relative isolate min-h-[100svh] pt-32 pb-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-ember)" }}
      />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-40 pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6">
        <Link
          to="/ai"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft size={14} /> Back to Signhify AI
        </Link>

        {/* Hero Area */}
        <div className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles size={14} /> Shared Product Plan
          </div>

          <h1 className="mt-6 font-display text-4xl sm:text-6xl font-black text-foreground tracking-tight leading-[1.05]">
            {plan.productName}
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-muted-foreground">{plan.oneLiner}</p>

          <div className="mt-6 p-4 rounded-xl border border-border bg-card/60 max-w-3xl text-sm">
            <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">
              Original Prompt
            </span>
            <span className="text-foreground italic font-mono">&ldquo;{prompt}&rdquo;</span>
          </div>
        </div>

        {/* Detailed agent plans */}
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          {plan.sections.map((s, i) => {
            const Icon = AGENT_ICONS[i] || Sparkles;
            return (
              <div
                key={s.title + i}
                className="rounded-2xl border border-border bg-card/80 backdrop-blur p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/30 text-primary bg-primary/10">
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
                    Agent {i + 1}
                  </span>
                </div>
                <div className="mt-4 font-display text-lg font-bold">{s.title}</div>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {s.bullets.map((b, j) => (
                    <li key={j} className="flex gap-2">
                      <span className="text-primary mt-1">›</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Stack block */}
        <div className="mt-8 rounded-2xl border border-border bg-card/80 p-6">
          <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-3">
            Recommended stack
          </div>
          <div className="flex flex-wrap gap-2">
            {plan.stack.map((t) => (
              <span
                key={t}
                className="text-xs rounded-full border border-border bg-surface px-3 py-1 text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action block */}
        <div className="mt-8 rounded-2xl border border-primary/40 bg-primary/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold">Ready to build this product?</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Bring this plan to life. Work with Signhify to build, test, and ship your MVP with
              state-of-the-art AI-driven engineering.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition shadow-[0_0_30px_-6px_var(--primary-glow)]"
            >
              Build this with Signhify <ExternalLink size={14} />
            </Link>
            <Link
              to="/ai"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
            >
              Create your own plan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
