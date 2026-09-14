import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, MessageSquare, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { fetchListingDetail } from "@/lib/marketplace-listings.functions";
import { createManualPayment } from "@/lib/manual-payments.functions";
import { useUser } from "@/hooks/useUser";
import { UPI_ID, USD_TO_INR, upiIntentLink, whatsappLink } from "@/lib/payment-contact";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/marketplace_/$slug")({
  loader: async ({ params }) => {
    const { listing } = await fetchListingDetail({ data: { slug: params.slug } });
    return { listing };
  },
  head: ({ loaderData }) => {
    const l = loaderData?.listing;
    const title = l ? `${l.name} — Signhify Marketplace` : "Blueprint — Signhify Marketplace";
    const description =
      l?.blurb ?? "A production-ready blueprint from the Signhify marketplace.";
    return {
      meta: [
        { title },
        { name: "description", content: description.slice(0, 155) },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: title },
        { property: "og:description", content: description.slice(0, 155) },
      ],
    };
  },
  component: ListingDetail,
  errorComponent: () => (
    <section className="pt-32 pb-24 px-6 min-h-screen text-center">
      <p className="text-sm text-muted-foreground">This blueprint could not be loaded.</p>
    </section>
  ),
  notFoundComponent: () => (
    <section className="pt-32 pb-24 px-6 min-h-screen text-center">
      <p className="text-sm text-muted-foreground">Blueprint not found.</p>
    </section>
  ),
});

function ListingDetail() {
  const { listing } = Route.useLoaderData();
  const { user } = useUser();
  const navigate = useNavigate();
  const reportPayment = useServerFn(createManualPayment);

  const [buying, setBuying] = useState(false);
  const [ref, setRef] = useState("");
  const [sending, setSending] = useState(false);
  const [reported, setReported] = useState(false);

  if (!listing) {
    return (
      <section className="pt-32 pb-24 px-6 min-h-screen text-center">
        <p className="text-sm text-muted-foreground">Blueprint not found.</p>
        <Link to="/marketplace" className="mt-4 inline-block text-primary hover:underline">
          Back to the marketplace
        </Link>
      </section>
    );
  }

  const usd = listing.price_cents ? listing.price_cents / 100 : listing.price ?? 0;
  const inr = Math.max(1, Math.round(usd * USD_TO_INR));

  const openBuy = () => {
    if (!user) {
      toast.info("Sign in to buy this blueprint.");
      navigate({ to: "/login", search: { redirect: `/marketplace/${listing.slug}` } });
      return;
    }
    setRef("");
    setReported(false);
    setBuying(true);
  };

  const submitRef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref.trim() || sending) return;
    setSending(true);
    try {
      await reportPayment({
        data: {
          amount: usd,
          method: "upi",
          description: `Marketplace blueprint — ${listing.name}`,
          transactionRef: ref.trim(),
        },
      });
      setReported(true);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not record your payment reference.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-5xl">
        <Breadcrumbs
          items={[
            { label: "Marketplace", to: "/marketplace" },
            { label: listing.name, to: "/marketplace" },
          ]}
        />
        <Link
          to="/marketplace"
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All blueprints
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div
              className="h-56 w-full rounded-2xl border border-border"
              style={{ background: listing.accent }}
            />
            <h1 className="mt-6 font-display text-4xl font-black">{listing.name}</h1>
            <div className="mt-2 text-xs uppercase tracking-[0.2em] text-primary">
              {listing.category}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {listing.blurb}
            </p>

            {listing.tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {listing.tags.map((t: string) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <h2 className="mt-10 font-display text-xl font-bold">What you get</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> The full page
                layout, section by section
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Editable copy,
                pricing and calls to action
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" /> Open it straight
                in Scroll Studio to customise
              </li>
            </ul>

            {listing.preview_url && (
              <a
                href={listing.preview_url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block text-sm text-primary hover:underline"
              >
                View the live preview →
              </a>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-28">
            <div className="text-3xl font-black">{usd > 0 ? `$${usd.toFixed(0)}` : "Free"}</div>
            {usd > 0 && (
              <div className="text-xs text-muted-foreground">≈ ₹{inr} · one-time, lifetime use</div>
            )}
            <button
              onClick={openBuy}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <ShoppingBag className="w-4 h-4" /> {usd > 0 ? "Buy with UPI" : "Get it free"}
            </button>
            <a
              href={whatsappLink(`Hi Signhify — I'm interested in "${listing.name}".`)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm"
            >
              <MessageSquare className="w-4 h-4" /> Ask on WhatsApp
            </a>
            <p className="mt-4 text-[11px] text-muted-foreground">
              Payments go to UPI {UPI_ID}. Once we confirm your reference, the blueprint unlocks in
              your client portal.
            </p>
          </aside>
        </div>
      </div>

      {buying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6">
            {!reported ? (
              <>
                <h3 className="font-display text-lg font-bold">Pay by UPI — {listing.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  ${usd.toFixed(0)} ≈ ₹{inr}, one time.
                </p>
                <div className="mt-4 rounded-lg border border-border p-3">
                  <div className="text-xs text-muted-foreground">UPI ID</div>
                  <div className="font-mono text-sm">{UPI_ID}</div>
                </div>
                <a
                  href={upiIntentLink(inr, `Signhify ${listing.slug}`)}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Open my UPI app
                </a>
                <form onSubmit={submitRef} className="mt-4">
                  <label className="text-xs text-muted-foreground">
                    Paste your UPI transaction reference
                  </label>
                  <input
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    placeholder="e.g. 431298765432"
                    className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="submit"
                      disabled={sending || !ref.trim()}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                    >
                      {sending && <Loader2 className="w-4 h-4 animate-spin" />} Submit reference
                    </button>
                    <button
                      type="button"
                      onClick={() => setBuying(false)}
                      className="rounded-md border border-border px-4 py-2 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 className="font-display text-lg font-bold">Reference received</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We'll confirm it shortly. You can track the status in your client portal, and send
                  the screenshot on WhatsApp to speed it up.
                </p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={whatsappLink(
                      `Hi Signhify — I paid for "${listing.name}". Reference: ${ref}`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-md bg-[#25D366] px-4 py-2 text-center text-sm font-semibold text-black"
                  >
                    Send on WhatsApp
                  </a>
                  <Link
                    to="/portal"
                    className="rounded-md border border-border px-4 py-2 text-sm"
                    onClick={() => setBuying(false)}
                  >
                    My portal
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
