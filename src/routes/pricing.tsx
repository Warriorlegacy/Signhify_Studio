import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Signhify" },
      {
        name: "description",
        content:
          "Engagement models for Signhify Studio: fixed-scope sprints, embedded engineering, and platform retainers.",
      },
      { property: "og:title", content: "Pricing — Signhify" },
      {
        property: "og:description",
        content:
          "Sprint, Studio and Platform engagement models. Transparent pricing for AI-first product execution.",
      },
      { property: "og:url", content: "https://signhify.online/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/pricing" }],
  }),
  component: PricingPage,
});

const TIERS = [
  {
    name: "Sprint",
    tag: "Fixed scope",
    price: "From ₹1.5L",
    period: "/ 2-week sprint",
    desc: "One focused outcome. Landing page, MVP slice, or critical feature — designed, built and deployed.",
    features: [
      "Design + build + deploy",
      "1 cinematic landing page or 1 product slice",
      "Async updates, daily Loom",
      "Code on your GitHub from day one",
    ],
    cta: "Start a sprint",
    featured: false,
  },
  {
    name: "Studio",
    tag: "Most chosen",
    price: "From ₹4L",
    period: "/ month",
    desc: "Embedded product team. End-to-end execution from idea to revenue, on a monthly cadence.",
    features: [
      "Dedicated product + design + engineering",
      "Weekly releases on your domain",
      "Full Signhify stack — Auth, AI, payments wired",
      "Architecture, infra, analytics included",
    ],
    cta: "Book the studio",
    featured: true,
  },
  {
    name: "Platform",
    tag: "Retainer",
    price: "Custom",
    period: "",
    desc: "For founders building on the Signhify ecosystem. Custom platform work, AI pipelines, multi-app stacks.",
    features: [
      "Signhify AI / Deploy / Cloud integration",
      "Multi-app monorepo architecture",
      "Priority access to new products",
      "Direct founder line",
    ],
    cta: "Talk to Piyush",
    featured: false,
  },
];

function PricingPage() {
  return (
    <section className="relative pt-36 pb-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-ember)" }} />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Engagement models</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black max-w-3xl">
          Three ways to ship <span className="text-gradient">with Signhify</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
          Pricing is anchored, not opaque. Pick the cadence that fits your stage —
          a focused sprint, an embedded studio, or a long-term platform partnership.
        </p>

        <div className="mt-16 grid md:grid-cols-3 gap-5">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border bg-card/80 backdrop-blur p-7 flex flex-col ${
                t.featured
                  ? "border-primary shadow-[var(--shadow-glow)]"
                  : "border-border"
              }`}
            >
              {t.featured && (
                <div className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
                  {t.tag}
                </div>
              )}
              {!t.featured && (
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {t.tag}
                </div>
              )}
              <div className="mt-4 font-display text-2xl font-bold">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-black text-gradient">
                  {t.price}
                </span>
                <span className="text-muted-foreground text-sm">{t.period}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              <ul className="mt-6 space-y-2.5 flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`mt-7 group inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition ${
                  t.featured
                    ? "bg-primary text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110"
                    : "border border-border bg-surface/60 hover:border-primary/60"
                }`}
              >
                {t.cta}
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          All engagements include source code on your GitHub, deployment on your
          infra (Vercel / Netlify / Cloudflare), and no platform lock-in.
        </p>
      </div>
    </section>
  );
}
