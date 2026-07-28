import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Store,
  Plus,
  Trash2,
  ExternalLink,
  DollarSign,
  TrendingUp,
  Loader2,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  getConnectStatus,
  createConnectAccount,
  getOnboardingLink,
  getLoginLink,
  confirmOnboardingComplete,
  getCreatorEarnings,
  createListing,
  deleteListing,
} from "@/lib/marketplace-connect.functions";
import { getCreatorListings } from "@/lib/marketplace-creator.functions";

export const Route = createFileRoute("/app/marketplace/sell")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [{ title: "Creator Dashboard — Signhify" }],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/app/marketplace/sell" }],
  }),
  component: CreatorDashboard,
});

function CreatorDashboard() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const search = useSearch({ from: Route.id as any }) as Record<string, string>;
  const connectReturn = search.connect === "return";

  // ── Server fns ──────────────────────────────────────────────────────
  const statusFn = useServerFn(getConnectStatus);
  const createAccountFn = useServerFn(createConnectAccount);
  const onboardingFn = useServerFn(getOnboardingLink);
  const loginLinkFn = useServerFn(getLoginLink);
  const confirmCompleteFn = useServerFn(confirmOnboardingComplete);
  const earningsFn = useServerFn(getCreatorEarnings);
  const listingsFn = useServerFn(getCreatorListings);
  const createListingFn = useServerFn(createListing);
  const deleteListingFn = useServerFn(deleteListing);

  // ── Queries ─────────────────────────────────────────────────────────
  const connectQ = useQuery({
    queryKey: ["creator_connect"],
    queryFn: () => statusFn({ data: undefined }),
  });

  const earningsQ = useQuery({
    queryKey: ["creator_earnings"],
    queryFn: () => earningsFn({ data: undefined }),
    enabled: !!connectQ.data?.hasAccount,
  });

  const listingsQ = useQuery({
    queryKey: ["creator_listings"],
    queryFn: () => listingsFn({ data: undefined }),
  });

  // Confirm onboarding after returning from Stripe
  useEffect(() => {
    if (connectReturn) {
      confirmCompleteFn({ data: undefined }).then((res) => {
        if (res.onboardingComplete) {
          toast.success("Stripe Connect account linked successfully!");
        } else {
          toast.warning(
            "Stripe onboarding is not yet complete. Finish the setup to receive payouts.",
          );
        }
        qc.invalidateQueries({ queryKey: ["creator_connect"] });
        // Clean the query param
        navigate({ to: "/app/marketplace/sell", replace: true });
      });
    }
  }, [connectReturn, confirmCompleteFn, navigate, qc]);

  // ── Mutations ───────────────────────────────────────────────────────
  const connectMut = useMutation({
    mutationFn: () => createAccountFn({ data: undefined }),
    onSuccess: async (res) => {
      const { url } = await onboardingFn({ data: { accountId: res.accountId } });
      window.location.href = url;
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const loginMut = useMutation({
    mutationFn: () => {
      const accountId = connectQ.data?.accountId;
      if (!accountId) throw new Error("No Stripe account found");
      return loginLinkFn({ data: { accountId } });
    },
    onSuccess: (res) => {
      window.location.href = res.url;
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteListingFn({ data: { id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["creator_listings"] });
      toast.success("Listing deactivated.");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── New listing form ────────────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Template" as string,
    price_cents: "",
    tags_raw: "",
    image_url: "",
  });

  const createMut = useMutation({
    mutationFn: () =>
      createListingFn({
        data: {
          name: form.name,
          description: form.description,
          category: form.category,
          price_cents: Math.round(parseFloat(form.price_cents || "0") * 100),
          tags_raw: form.tags_raw,
          image_url: form.image_url,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["creator_listings"] });
      setShowForm(false);
      setForm({
        name: "",
        description: "",
        category: "Template",
        price_cents: "",
        tags_raw: "",
        image_url: "",
      });
      toast.success("Listing published!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const listings = (listingsQ.data ?? []) as any[];
  const connect = connectQ.data;
  const earnings = earningsQ.data;

  if (connectQ.isLoading) {
    return (
      <section className="pt-32 pb-24 px-6 min-h-screen">
        <div className="mx-auto max-w-5xl space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Creator console
            </div>
            <h1 className="font-display text-4xl font-black">Sell on Marketplace</h1>
          </div>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm"
          >
            <Store size={14} /> Browse marketplace
          </Link>
        </div>

        {/* Stripe Connect card */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-lg font-bold">Stripe Connect</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {connect?.hasAccount
                  ? connect.onboardingComplete
                    ? "Your Stripe account is connected and ready to receive payouts."
                    : "Account created — finish onboarding to start receiving payouts."
                  : "Connect a Stripe Express account to get paid for your listings."}
              </p>
            </div>
            <div className="shrink-0">
              {!connect?.hasAccount ? (
                <button
                  onClick={() => connectMut.mutate()}
                  disabled={connectMut.isPending}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  {connectMut.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Plus size={14} />
                  )}
                  Connect Stripe
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                      connect.onboardingComplete
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                        : "bg-yellow-500/10 text-yellow-300 border border-yellow-500/30"
                    }`}
                  >
                    {connect.onboardingComplete ? (
                      <>
                        <CheckCircle2 size={12} /> Active
                      </>
                    ) : (
                      <>
                        <AlertCircle size={12} /> Pending
                      </>
                    )}
                  </span>
                  <button
                    onClick={() => loginMut.mutate()}
                    disabled={loginMut.isPending}
                    className="rounded-md border border-border bg-surface/60 px-3 py-1.5 text-xs"
                  >
                    Stripe Dashboard
                  </button>
                  {!connect.onboardingComplete && (
                    <button
                      onClick={async () => {
                        const { url } = await onboardingFn({
                          data: { accountId: connect.accountId! },
                        });
                        window.location.href = url;
                      }}
                      className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Complete onboarding
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Earnings summary */}
        {earnings && (
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp size={14} /> Total sales
              </div>
              <div className="mt-2 font-display text-2xl font-bold">${earnings.totalSales}</div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign size={14} /> Earned (after commission)
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-emerald-400">
                ${earnings.totalEarned}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle size={14} /> Pending payout
              </div>
              <div className="mt-2 font-display text-2xl font-bold text-yellow-400">
                ${earnings.pendingPayouts}
              </div>
            </div>
          </div>
        )}

        {/* New listing form */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Your listings</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            disabled={!connect?.hasAccount}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {showForm ? (
              "Cancel"
            ) : (
              <>
                <Plus size={14} /> New listing
              </>
            )}
          </button>
        </div>

        {showForm && (
          <div className="mt-4 rounded-2xl border border-border bg-card p-6">
            <h3 className="font-display text-lg font-bold mb-4">Create a listing</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="My Awesome Template"
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="What does your listing do?"
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                >
                  <option>Template</option>
                  <option>Agent</option>
                  <option>Component</option>
                  <option>Workflow</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Price (USD)</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price_cents}
                  onChange={(e) => setForm({ ...form, price_cents: e.target.value })}
                  placeholder="29.00"
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Tags (comma separated)
                </label>
                <input
                  value={form.tags_raw}
                  onChange={(e) => setForm({ ...form, tags_raw: e.target.value })}
                  placeholder="React, TypeScript"
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">
                  Preview image URL
                </label>
                <input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => createMut.mutate()}
                disabled={createMut.isPending || !form.name || !form.price_cents}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {createMut.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ArrowUpRight size={14} />
                )}
                Publish listing
              </button>
              <span className="text-xs text-muted-foreground">
                Signhify takes 15% commission. You receive 85%.
              </span>
            </div>
          </div>
        )}

        {/* Listings table */}
        {listingsQ.isLoading ? (
          <div className="mt-4 space-y-3">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="mt-4 rounded-2xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-5 py-3 font-medium">Category</th>
                  <th className="text-left px-5 py-3 font-medium">Price</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l: any) => (
                  <tr key={l.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-4 font-medium">{l.title}</td>
                    <td className="px-5 py-4 text-muted-foreground">{l.category || "—"}</td>
                    <td className="px-5 py-4">
                      {!l.price_cents || l.price_cents === 0
                        ? "Free"
                        : `$${(l.price_cents / 100).toFixed(2)}`}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] uppercase rounded-full border px-2 py-1 ${
                          l.is_active !== false
                            ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
                            : "text-muted-foreground border-border bg-surface"
                        }`}
                      >
                        {l.is_active !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {l.preview_url && (
                          <a
                            href={l.preview_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md border border-border bg-surface/60 px-3 py-1.5 text-xs"
                          >
                            <ExternalLink size={12} />
                          </a>
                        )}
                        <button
                          onClick={() => deleteMut.mutate(l.id)}
                          disabled={deleteMut.isPending || l.is_active === false}
                          className="rounded-md border border-border bg-surface/60 px-3 py-1.5 text-xs disabled:opacity-50 text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border p-12 text-center">
            <Store size={48} className="mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl font-bold">No listings yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {connect?.hasAccount
                ? "Create your first listing above."
                : "Connect Stripe first, then list your work."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
