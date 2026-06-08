import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, FileText, ArrowRight, Code2, BookOpen } from "lucide-react";
import { marked } from "marked";
import guideMarkdown from "../../public/signhify-local-dev-guide.md?raw";

const guideHtml = marked.parse(guideMarkdown, { async: false }) as string;

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap to 2026 — Signhify" },
      {
        name: "description",
        content:
          "The public, living plan for how Signhify becomes the first AI-native product studio operating system. Week-by-week shipping milestones.",
      },
      { property: "og:title", content: "Signhify — Roadmap to 2026" },
      {
        property: "og:description",
        content:
          "Week-by-week shipping plan from the studio site to Signhify OS, Cloud and Deploy.",
      },
      { property: "og:url", content: "https://signhify.online/roadmap" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/roadmap" }],
  }),
  component: RoadmapPage,
});

const WEEKS = [
  {
    label: "Week 1 — NOW",
    title: "Studio Foundation",
    exit: "A cinematic studio site that converts visitors into briefed leads.",
    items: [
      "Immersive 3D hero (Three.js ember field)",
      "Bento /projects gallery + /projects/:slug detail pages",
      "/contact wizard → Supabase leads table (RLS-hardened)",
      "/book Calendly embed + WhatsApp FAB (+91 62024 42690)",
      "/privacy, /terms, /roadmap surfaces",
      "llms.txt, sitemap.xml, OG cards across every route",
    ],
  },
  {
    label: "Week 2",
    title: "Signhify AI Preview",
    exit: "Anyone prompts /ai and gets a real Claude plan + waitlist capture.",
    items: [
      "/ai wired to Claude via Lovable AI Gateway",
      "Six-agent pipeline animated by real backend stages",
      "waitlist table + double-opt-in email via Resend",
      "Per-IP rate limiting + abuse guard",
      "SSE streaming for sub-second perceived latency",
    ],
  },
  {
    label: "Week 3",
    title: "Ecosystem & Marketplace v0",
    exit: "Logged-out visitors browse the full ecosystem and download one free template.",
    items: [
      "Universal ecosystem switcher in header",
      "/marketplace listings with Supabase + Stripe (test)",
      "Signed-URL asset delivery via Supabase Storage",
      "Creator console stub at /marketplace/sell",
    ],
  },
  {
    label: "Week 4",
    title: "Signhify Cloud — Beta Auth",
    exit: "Authenticated users get a personal /app workspace.",
    items: [
      "Supabase Auth (email + Google via Lovable broker)",
      "_authenticated/ route gate + app schema",
      "One-click export to GitHub repo",
      "Realtime build log viewer (postgres_changes)",
    ],
  },
  {
    label: "Week 5",
    title: "Signhify OS — Agent Orchestration",
    exit: "A prompt triggers a multi-agent run producing a working Lovable project.",
    items: [
      "Agent runtime in TanStack server functions",
      "Tool catalog: code-gen, design-tokens, schema-design, deploy",
      "Cost + latency budget per run, surfaced inline",
      "Replay viewer at /runs/:id",
    ],
  },
  {
    label: "Week 6",
    title: "Signhify Deploy — One-Click Hosting",
    exit: "Finished runs deploy to *.signhify.app in <60 seconds.",
    items: [
      "Cloudflare Workers + Pages integration",
      "Custom domain wizard + automated DNS",
      "Per-project analytics (CWV + page views)",
      "Encrypted production secrets vault",
    ],
  },
  {
    label: "Weeks 7–8",
    title: "Polish, Pricing & Public Launch",
    exit: "GA with public pricing, status page, and 100 paying design partners.",
    items: [
      "Stripe (monthly + annual) + credit-pack add-ons",
      "status.signhify.online status page",
      "docs.signhify.online help center",
      "Product Hunt + X + LinkedIn launch sequence",
    ],
  },
];

const METRICS = [
  ["Prompts → live deploys", "10,000"],
  ["Paying design partners", "1,000"],
  ["Prompt → preview", "< 90s"],
  ["Free-to-paid conversion", "8%"],
  ["NPS", "≥ 60"],
];

function RoadmapPage() {
  return (
    <article className="pt-32 pb-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
          Public roadmap · Living document
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-black max-w-4xl">
          The plan to ship <span className="text-gradient">the final Signhify</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
          From the studio site you&rsquo;re reading right now, to a full AI-native product
          operating system — Studio, AI, Marketplace, Cloud, OS, Deploy. Week by week. In public.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/signhify-roadmap.pdf"
            download
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
          >
            <Download size={14} /> Download roadmap (PDF)
          </a>
          <a
            href="/signhify-roadmap.md"
            download
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
          >
            <FileText size={14} /> Markdown source
          </a>
        </div>

        <section className="mt-10 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-primary/40 bg-background text-primary">
              <Code2 size={18} />
            </div>
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-[0.25em] text-primary">
                Build locally · Deploy via Lovable
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">
                Local IDE Development Guide
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                Continue building Signhify in Google Antigravity, Cursor, Windsurf,
                Kiro, Gemini CLI, Kilo CLI, Claude Code, Aider, Zed or plain VS Code —
                while every push still ships through Lovable&rsquo;s preview &amp; publish
                pipeline via GitHub bidirectional sync.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/signhify-local-dev-guide.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
                >
                  <Download size={14} /> Download guide (PDF)
                </a>
                <a
                  href="/signhify-local-dev-guide.md"
                  download
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm font-semibold hover:border-primary/60 transition"
                >
                  <FileText size={14} /> Markdown source
                </a>
                <a
                  href="/signhify-local-dev-guide.md"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-4 py-2.5 text-sm font-semibold hover:border-primary/60 transition"
                >
                  View in browser <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        <ol className="mt-16 relative border-l border-border/60 pl-8 space-y-10">
          {WEEKS.map((w, i) => (
            <li key={w.title} className="relative">
              <span className="absolute -left-[42px] top-1 grid h-8 w-8 place-items-center rounded-full border border-primary/40 bg-background text-xs font-mono text-primary">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="text-[10px] uppercase tracking-[0.25em] text-primary">
                {w.label}
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">{w.title}</h2>
              <div className="mt-1 text-sm italic text-muted-foreground">Exit: {w.exit}</div>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                {w.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-md border border-border/70 bg-surface/40 px-3 py-2 text-sm text-foreground/90"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <section className="mt-20 rounded-2xl border border-primary/30 bg-primary/5 p-8">
          <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-2">
            North-star metrics — 2026
          </div>
          <div className="grid sm:grid-cols-5 gap-4 mt-2">
            {METRICS.map(([k, v]) => (
              <div key={k} className="rounded-lg border border-border bg-card p-4">
                <div className="font-display text-2xl font-black">{v}</div>
                <div className="text-xs text-muted-foreground mt-1">{k}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid md:grid-cols-2 gap-4">
          {[
            "Ship the surface first, then the fabric.",
            "Every route is a product.",
            "Servers, not browsers, hold the keys.",
            "Public roadmap, private execution.",
          ].map((p, i) => (
            <div key={p} className="rounded-xl border border-border bg-card p-5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
                Principle {i + 1}
              </div>
              <div className="font-display font-semibold">{p}</div>
            </div>
          ))}
        </section>

        <div className="mt-16 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Become a design partner <ArrowRight size={14} />
          </Link>
          <Link
            to="/book"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface/60 px-5 py-3 text-sm font-semibold hover:border-primary/60 transition"
          >
            Book a 30-min call
          </Link>
        </div>
      </div>
    </article>
  );
}
