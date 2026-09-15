import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, BanknoteIcon, Loader2, TrendingUp, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import {
  getCreatorEarnings,
  requestPayout,
  type ListingEarning,
  type PayoutRequestRow,
} from "@/lib/creator-payouts.functions";
import { UPI_ID, whatsappLink } from "@/lib/payment-contact";

export const Route = createFileRoute("/creator_/payouts")({
  head: () => ({
    meta: [
      { title: "Creator Payouts — UPI Earnings & Withdrawals | Signhify" },
      {
        name: "description",
        content:
          "See what every approved Signhify blueprint has earned over UPI, track your available balance, and request a withdrawal straight to your UPI ID.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Creator Payouts — Signhify" },
      {
        property: "og:description",
        content: "Track UPI earnings per listing and withdraw your balance to your UPI ID.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/creator/payouts" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/creator/payouts" }],
  }),
  component: CreatorPayouts,
});

const inr = (n: number) => `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

type Summary = {
  earnings: ListingEarning[];
  payoutRequests: PayoutRequestRow[];
  totals: {
    grossInr: number;
    lifetimeNet: number;
    withdrawn: number;
    pendingOut: number;
    availableInr: number;
    sales: number;
  };
  creatorShare: number;
};

const statusChip = (status: string) => {
  if (status === "paid") return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
  if (status === "rejected") return "bg-red-500/15 text-red-300 border-red-500/30";
  return "bg-amber-500/15 text-amber-300 border-amber-500/30";
};

function CreatorPayouts() {
  const { user, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const fetchEarnings = useServerFn(getCreatorEarnings);
  const submitPayout = useServerFn(requestPayout);

  const [data, setData] = useState<Summary | null>(null);
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = (await fetchEarnings({})) as Summary;
      setData(res);
      if (res.totals.availableInr > 0) setAmount(String(res.totals.availableInr));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load your earnings.");
    }
  }, [fetchEarnings]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/creator/payouts" } });
      return;
    }
    void load();
  }, [authLoading, user, load, navigate]);

  const withdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      await submitPayout({
        data: { amountInr: Number(amount), upiId: upi.trim(), note: note.trim() },
      });
      toast.success("Withdrawal requested — it lands in your UPI account after review.");
      setNote("");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not request that withdrawal.");
    } finally {
      setBusy(false);
    }
  };

  const totals = data?.totals;

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/creator"
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white"
        >
          <ArrowLeft size={14} /> Back to your listings
        </Link>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fb923c]">
              <Wallet size={12} /> Payouts
            </span>
            <h1 className="mt-4 truncate font-display text-3xl sm:text-5xl font-black tracking-tight">
              Your earnings
            </h1>
            <p className="mt-3 max-w-xl text-sm text-white/60">
              Every confirmed UPI purchase of your approved blueprints, with your{" "}
              {Math.round((data?.creatorShare ?? 0.85) * 100)}% share after platform commission.
            </p>
          </div>
        </div>

        {!data ? (
          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 text-white/60">
            <Loader2 size={18} className="animate-spin" /> Loading your earnings…
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Available to withdraw", value: inr(totals!.availableInr), accent: true },
                { label: "Lifetime earnings", value: inr(totals!.lifetimeNet) },
                { label: "Withdrawal pending", value: inr(totals!.pendingOut) },
                { label: "Paid out", value: inr(totals!.withdrawn) },
              ].map((card) => (
                <div
                  key={card.label}
                  className={`rounded-2xl border p-5 ${
                    card.accent
                      ? "border-[#f97316]/40 bg-[#f97316]/10"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] text-white/50">
                    {card.label}
                  </div>
                  <div className="mt-2 text-2xl font-black">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <h2 className="font-display text-xl font-bold">Earnings by listing</h2>
                {data.earnings.length === 0 ? (
                  <p className="mt-3 rounded-2xl border border-dashed border-white/15 px-5 py-10 text-center text-sm text-white/55">
                    No listings yet. Publish a blueprint and its sales show up here.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {data.earnings.map((e) => (
                      <li
                        key={e.listingId}
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
                      >
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                          <div className="min-w-0">
                            <Link
                              to="/marketplace/$slug"
                              params={{ slug: e.slug }}
                              className="block truncate font-semibold hover:text-[#fb923c]"
                            >
                              {e.title}
                            </Link>
                            <p className="mt-1 text-xs text-white/50">
                              {e.sales} sale{e.sales === 1 ? "" : "s"}
                              {e.lastSaleAt
                                ? ` · last ${new Date(e.lastSaleAt).toLocaleDateString()}`
                                : ""}
                              {e.status !== "live" ? " · not live yet" : ""}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-lg font-black text-[#fb923c]">{inr(e.netInr)}</div>
                            <div className="text-[11px] text-white/45">
                              of {inr(e.grossInr)} collected
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                <h2 className="mt-10 font-display text-xl font-bold">Withdrawal history</h2>
                {data.payoutRequests.length === 0 ? (
                  <p className="mt-3 text-sm text-white/55">No withdrawals requested yet.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {data.payoutRequests.map((r) => (
                      <li
                        key={r.id}
                        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold">{inr(r.amount_inr)}</div>
                          <div className="truncate text-xs text-white/50">
                            to {r.upi_id} · {new Date(r.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusChip(r.status)}`}
                        >
                          {r.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 lg:sticky lg:top-28">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <BanknoteIcon size={16} className="text-[#fb923c]" /> Withdraw to UPI
                </div>
                <form onSubmit={withdraw} className="mt-4 space-y-3">
                  <label className="block text-sm">
                    <span className="text-white/60">Amount (₹)</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={(ev) => setAmount(ev.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#f97316]"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-white/60">Your UPI ID</span>
                    <input
                      value={upi}
                      onChange={(ev) => setUpi(ev.target.value)}
                      placeholder="name@bank"
                      className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#f97316]"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="text-white/60">Note (optional)</span>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(ev) => setNote(ev.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#f97316]"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={busy || !amount || totals!.availableInr <= 0}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#fb923c] disabled:opacity-50"
                  >
                    {busy && <Loader2 size={15} className="animate-spin" />} Request withdrawal
                  </button>
                </form>
                <p className="mt-3 text-[11px] leading-relaxed text-white/45">
                  Buyer payments arrive at {UPI_ID} and are transferred to your UPI ID once the
                  request is processed.{" "}
                  <a
                    href={whatsappLink("Hi Signhify — a question about my creator payout.")}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#fb923c] hover:underline"
                  >
                    Ask on WhatsApp
                  </a>
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-white/45">
                  <TrendingUp size={13} /> {totals!.sales} total sale
                  {totals!.sales === 1 ? "" : "s"} · {inr(totals!.grossInr)} collected
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
