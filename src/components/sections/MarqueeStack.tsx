const stack = [
  "Next.js",
  "TanStack Start",
  "React 19",
  "TypeScript",
  "Tailwind v4",
  "Supabase",
  "Postgres",
  "Vercel",
  "Cloudflare",
  "OpenAI",
  "Anthropic",
  "LangChain",
  "Stripe",
  "Framer Motion",
  "shadcn/ui",
  "Lovable",
];

export function MarqueeStack() {
  const items = [...stack, ...stack];
  return (
    <section className="relative py-16 border-y border-border bg-surface/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground mb-8">
          Powered by a modern AI-native stack
        </div>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div
          className="flex gap-10 whitespace-nowrap will-change-transform"
          style={{ animation: "marquee 40s linear infinite" }}
        >
          {items.map((s, i) => (
            <span
              key={i}
              className="font-mono text-sm text-muted-foreground hover:text-primary transition"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
