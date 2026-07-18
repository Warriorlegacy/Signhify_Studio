import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Package, ShoppingCart, Download, Archive, ExternalLink } from "lucide-react";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCreatorListings,
  updateListingStatus,
  getUserPurchases,
} from "@/lib/marketplace-creator.functions";

export const Route = createFileRoute("/app/marketplace/")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [{ title: "Marketplace — Signhify" }],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/app/marketplace" }],
  }),
  component: MarketplaceDashboard,
});

const statusColor = (s: string) =>
  s === "published"
    ? "text-emerald-300 border-emerald-500/40 bg-emerald-500/10"
    : s === "draft"
      ? "text-yellow-300 border-yellow-500/40 bg-yellow-500/10"
      : "text-muted-foreground border-border bg-surface";

function MarketplaceDashboard() {
  const qc = useQueryClient();
  const getListings = useServerFn(getCreatorListings);
  const getPurchases = useServerFn(getUserPurchases);
  const updateStatus = useServerFn(updateListingStatus);

  const listingsQ = useQuery({
    queryKey: ["creator_listings"],
    queryFn: () => getListings({ data: undefined }),
  });

  const purchasesQ = useQuery({
    queryKey: ["user_purchases"],
    queryFn: () => getPurchases({ data: undefined }),
  });

  const archiveMut = useMutation({
    mutationFn: (id: string) => updateStatus({ data: { id, status: "archived" as const } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["creator_listings"] }),
  });

  const tab =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("tab") || "listings"
      : "listings";

  const listings = (listingsQ.data ?? []) as any[];
  const purchases = (purchasesQ.data ?? []) as any[];

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Creator hub</div>
            <h1 className="font-display text-4xl font-black">Marketplace</h1>
          </div>
          <Link
            to="/marketplace/sell"
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Sell on Marketplace
          </Link>
        </div>

        <div className="mt-8 flex gap-4 border-b border-border">
          <Link
            to="/app/marketplace"
            search={{ tab: "listings" }}
            className={`pb-3 text-sm font-medium ${
              tab === "listings"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            My Listings
          </Link>
          <Link
            to="/app/marketplace"
            search={{ tab: "purchases" }}
            className={`pb-3 text-sm font-medium ${
              tab === "purchases"
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            My Purchases
          </Link>
        </div>

        {tab === "listings" && (
          <>
            {listingsQ.isLoading ? (
              <div className="mt-6 space-y-4">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
            ) : listings.length ? (
              <div className="mt-6 rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface/50">
                      <th className="text-left px-5 py-3 font-medium">Title</th>
                      <th className="text-left px-5 py-3 font-medium">Status</th>
                      <th className="text-left px-5 py-3 font-medium">Price</th>
                      <th className="text-left px-5 py-3 font-medium">Created</th>
                      <th className="text-right px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((l: any) => (
                      <tr key={l.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-4 font-medium">{l.title}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-[10px] uppercase rounded-full border px-2 py-1 ${statusColor(l.status)}`}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {l.price_cents === 0 || l.price_cents === null
                            ? "Free"
                            : `$${(l.price_cents / 100).toFixed(2)}`}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {new Date(l.created_at).toLocaleDateString()}
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
                              onClick={() => archiveMut.mutate(l.id)}
                              disabled={archiveMut.isPending || l.status === "archived"}
                              className="rounded-md border border-border bg-surface/60 px-3 py-1.5 text-xs disabled:opacity-50"
                            >
                              <Archive size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-20 grid place-items-center text-center">
                <Package size={72} className="text-muted-foreground" />
                <h2 className="mt-5 font-display text-2xl font-bold">No listings yet</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Publish your first template, agent, component, or workflow to the marketplace.
                </p>
                <Link
                  to="/marketplace/sell"
                  className="mt-5 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Create a listing
                </Link>
              </div>
            )}
          </>
        )}

        {tab === "purchases" && (
          <>
            {purchasesQ.isLoading ? (
              <div className="mt-6 space-y-4">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
            ) : purchases.length ? (
              <div className="mt-6 rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface/50">
                      <th className="text-left px-5 py-3 font-medium">Listing</th>
                      <th className="text-left px-5 py-3 font-medium">Category</th>
                      <th className="text-left px-5 py-3 font-medium">Purchased</th>
                      <th className="text-right px-5 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((p: any) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="px-5 py-4 font-medium">{p.listing?.title ?? "Unknown"}</td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {p.listing?.category ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {new Date(p.purchased_at).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button className="inline-flex items-center gap-1 rounded-md border border-border bg-surface/60 px-3 py-1.5 text-xs">
                            <Download size={12} />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-20 grid place-items-center text-center">
                <ShoppingCart size={72} className="text-muted-foreground" />
                <h2 className="mt-5 font-display text-2xl font-bold">No purchases yet</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Browse the marketplace to find templates, agents, components, and workflows.
                </p>
                <Link
                  to="/marketplace"
                  className="mt-5 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Browse Marketplace
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
