import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { joinCreatorWaitlist } from "@/lib/creator-waitlist.functions";
export const Route = createFileRoute("/marketplace/sell")({
  head: () => ({
    meta: [
      { title: "Sell on Marketplace — Signhify | AI Product Studio" },
      {
        name: "description",
        content:
          "Join the creator waitlist for Signhify Marketplace and get access when the seller console opens.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/marketplace/sell" },
      { property: "og:title", content: "Sell on Signhify Marketplace" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/marketplace/sell" }],
  }),
  component: SellPage,
});
function SellPage() {
  const join = useServerFn(joinCreatorWaitlist);
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  return (
    <section className="pt-36 pb-24 min-h-screen px-6">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
          Locked creator console
        </div>
        <h1 className="font-display text-4xl font-black">Creator access coming soon</h1>
        <p className="mt-4 text-muted-foreground">
          Bring your best templates, agents, and workflows to the Signhify ecosystem. Join the
          onboarding list.
        </p>
        {ok ? (
          <div className="mt-8 rounded-xl border border-primary/40 bg-primary/10 p-4 text-primary">
            You're on the creator list.
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await join({ data: { email } });
              setOk(true);
            }}
            className="mt-8 flex gap-2"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="creator@email.com"
              className="flex-1 rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none"
            />
            <button className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
              Request access
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
