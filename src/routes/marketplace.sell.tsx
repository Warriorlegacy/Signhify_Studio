import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle2, DollarSign, Layers, Store } from "lucide-react";

export const Route = createFileRoute("/marketplace/sell")({
  head: () => ({
    meta: [
      { title: "Sell on Marketplace — Signhify | AI Product Studio" },
      {
        name: "description",
        content:
          "Sell AI templates, agents, components, and workflows on Signhify Marketplace. Stripe Connect payouts — you earn 85%.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/marketplace/sell" },
      { property: "og:title", content: "Sell on Signhify Marketplace" },
      {
        property: "og:description",
        content:
          "List your templates and AI agents. Stripe Connect handles payments and payouts. You keep 85% of every sale.",
      },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/marketplace/sell" }],
  }),
  component: SellPage,
});

function SellPage() {
  return (
    <section className="pt-36 pb-24 min-h-screen px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs uppercase tracking-[0.18em] text-primary">
            <Store size={12} /> Creator program
          </div>
          <h1 className="mt-5 font-display text-5xl sm:text-6xl font-black max-w-2xl mx-auto">
            Sell what you build.
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
            List your templates, AI agents, components, and workflows on the Signhify Marketplace.
            Stripe Connect handles payments — you get paid directly.
          </p>
        </div>

        {/* Commission card */}
        <div className="mt-10 rounded-3xl border border-border bg-gradient-to-br from-primary/5 to-surface p-8 text-center">
          <div className="text-4xl font-black font-display">
            You earn <span className="text-gradient">85%</span>
          </div>
          <p className="mt-2 text-muted-foreground">
            Signhify takes a 15% commission on each sale to cover hosting, payment processing, and
            marketplace operations. Payouts are sent directly to your Stripe Connect account.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10">
              <DollarSign size={20} className="text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">1. Connect Stripe</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Link your Stripe Connect Express account. It&apos;s free and takes a few minutes.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10">
              <Layers size={20} className="text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">2. List your item</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Set a name, description, price, and preview. Publish to the marketplace instantly.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10">
              <CheckCircle2 size={20} className="text-primary" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">3. Get paid</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Stripe sends payouts directly to your bank account. Track earnings in your dashboard.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-14 rounded-3xl border border-border bg-surface/50 p-8 lg:p-10">
          <h2 className="font-display text-2xl font-bold">Everything you need</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {[
              "Stripe Connect Express onboarding",
              "85% payout on every sale",
              "Automatic commission tracking",
              "Manage listings from your dashboard",
              "No monthly fees — pay per sale",
              "Payouts sent directly to your bank",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={16} className="shrink-0 text-primary" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/login"
            search={{ redirect: "/app/marketplace/sell" } as any}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-4 text-base font-semibold text-primary-foreground hover:bg-primary/90 transition"
          >
            Sign in to start selling <ArrowUpRight size={16} />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" search={{ redirect: "/app/marketplace/sell" } as any} className="text-primary underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
