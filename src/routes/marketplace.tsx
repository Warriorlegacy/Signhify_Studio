import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight, Download, Search, Sparkles } from "lucide-react";
import { MARKET, MARKET_CATEGORIES, type MarketItem } from "@/lib/marketplace";
import { downloadAsset } from "@/lib/marketplace-download.functions";
import { createCheckoutSession } from "@/lib/stripe-checkout.functions";
import { fetchMarketplaceListings } from "@/lib/marketplace-listings.functions";

export const Route = createFileRoute("/marketplace")({
  loader: async () => {
    try {
      const { items } = await fetchMarketplaceListings();
      return { items: items.length ? items : MARKET };
    } catch {
      return { items: MARKET };
    }
  },
  head: () => ({
    meta: [
      { title: "Marketplace — Signhify" },
      {
        name: "description",
        content:
          "Browse templates, AI agents, components and workflows shipped by Signhify and partner studios. Grab one free this week.",
      },
      { property: "og:title", content: "Marketplace — Signhify" },
      {
        property: "og:description",
        content:
          "Templates, AI agents, components and workflows — one marketplace from Signhify.",
      },
      { property: "og:url", content: "https://signhify.online/marketplace" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/marketplace" }],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const { items: initialItems } = Route.useLoaderData();
  const [cat, setCat] = useState<(typeof MARKET_CATEGORIES)[number]>("All");
  const [q, setQ] = useState("");

  const items = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (initialItems as MarketItem[]).filter(
      (i: MarketItem) =>
        (cat === "All" || i.category === cat) &&
        (!query ||
          i.name.toLowerCase().includes(query) ||
          i.blurb.toLowerCase().includes(query) ||
          i.tags.some((t: string) => t.toLowerCase().includes(query))),
    );
  }, [cat, q, initialItems]);

  return (
    <section className="relative pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
          Marketplace · v0
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="font-display text-5xl sm:text-6xl font-black max-w-3xl">
              Ship faster. <span className="text-gradient">Borrow our spine.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
              Production templates, plug-in AI agents, components and full
              workflows — every listing has been used in a real Signhify build.
            </p>
          </div>
          <Link
            to="/contact"
            className="self-start inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm text-foreground hover:bg-primary/15 transition"
          >
            <Sparkles size={14} className="text-primary" />
            Sell on Signhify
          </Link>
        </div>

        {/* Filter bar */}
        <div className="mt-10 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates, agents, workflows…"
              className="w-full rounded-full bg-surface border border-border pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 rounded-full bg-surface border border-border p-1">
            {MARKET_CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 text-xs rounded-full transition ${
                  cat === c
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item: MarketItem) => (
            <MarketCard key={item.slug} item={item} />
          ))}
          {items.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No listings match yet. Try another category.
            </div>
          )}
        </div>

        {/* Creator stub */}
        <div className="mt-16 rounded-3xl border border-border bg-surface/50 p-8 lg:p-12 grid lg:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-primary mb-2">
              Creator console · coming Week 3
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Have a template that ships product? List it.
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl text-sm">
              Stripe Connect payouts, signed download URLs, version history and
              a public author page. Submit interest and we&rsquo;ll onboard you.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Apply as creator <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MarketCard({ item }: { item: MarketItem }) {
  const isFree = (item.price_cents ?? item.price * 100) === 0;
  const download = useServerFn(downloadAsset);
  const checkout = useServerFn(createCheckoutSession);
  const handleCta = async () => {
    if (!item.id) {
      if (item.preview_url) window.location.href = item.preview_url;
      return;
    }
    if (isFree) {
      const { signedUrl } = await download({ data: { listingId: item.id } });
      window.location.href = signedUrl;
    } else {
      const { url } = await checkout({ data: { listingId: item.id } });
      window.location.href = url;
    }
  };
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:border-primary/50 transition shadow-[var(--shadow-card)]">
      <div
        className="relative aspect-[16/9] overflow-hidden"
        style={{ background: item.accent }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              "radial-gradient(oklch(1 0 0 / 0.3) 1px, transparent 1px)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-foreground">
          {item.category}
        </div>
        {item.badge && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-50">
            {item.badge}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-tight">
            {item.name}
          </h3>
          <div className="text-sm font-mono">
            {isFree ? (
              <span className="text-emerald-400 font-bold">FREE</span>
            ) : (
              <span className="text-foreground">${item.price}</span>
            )}
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {item.blurb}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] rounded-full border border-border bg-surface px-2 py-0.5 text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={handleCta}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md border border-border bg-surface/80 px-4 py-2.5 text-sm font-semibold hover:border-primary/60 hover:bg-primary/10 transition"
        >
          {isFree ? (
            <>
              <Download size={14} /> Get it free
            </>
          ) : (
            <>
              Buy <ArrowUpRight size={14} />
            </>
          )}
        </button>
      </div>
    </article>
  );
}
