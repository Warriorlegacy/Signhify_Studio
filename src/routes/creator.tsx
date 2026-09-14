import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Pencil, Plus, Store, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import {
  getCreatorListings,
  updateListing,
  deleteListing,
} from "@/lib/marketplace-creator.functions";

export const Route = createFileRoute("/creator")({
  head: () => ({
    meta: [
      { title: "Creator Dashboard — Manage Your Listings | Signhify" },
      {
        name: "description",
        content:
          "Manage the templates and AI agents you sell on Signhify: edit titles, pricing and previews, take listings offline, or delete them before they go live.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Creator Dashboard — Signhify Marketplace" },
      {
        property: "og:description",
        content: "Edit, unpublish, and delete your Signhify Marketplace listings in one place.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/creator" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/creator" }],
  }),
  component: CreatorDashboard,
});

type Listing = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  price_cents: number | null;
  preview_url: string | null;
  is_active: boolean | null;
  created_at: string | null;
};

const money = (cents: number | null) =>
  cents && cents > 0 ? `$${(cents / 100).toFixed(2)}` : "Free";

function CreatorDashboard() {
  const { user, loading: authLoading } = useUser();
  const navigate = useNavigate();

  const fetchListings = useServerFn(getCreatorListings);
  const saveListing = useServerFn(updateListing);
  const removeListing = useServerFn(deleteListing);

  const [listings, setListings] = useState<Listing[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Listing | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Listing | null>(null);

  const load = useCallback(async () => {
    try {
      const rows = (await fetchListings({})) as Listing[];
      setListings(rows);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load your listings.");
      setListings([]);
    }
  }, [fetchListings]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/creator" } });
      return;
    }
    void load();
  }, [authLoading, user, load, navigate]);

  const toggleLive = async (listing: Listing) => {
    setBusyId(listing.id);
    const next = !(listing.is_active ?? false);
    try {
      await saveListing({ data: { id: listing.id, is_active: next } });
      setListings((prev) =>
        (prev ?? []).map((l) => (l.id === listing.id ? { ...l, is_active: next } : l)),
      );
      toast.success(next ? "Listing is now live." : "Listing taken offline.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the listing.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setBusyId(confirmDelete.id);
    try {
      await removeListing({ data: { id: confirmDelete.id } });
      setListings((prev) => (prev ?? []).filter((l) => l.id !== confirmDelete.id));
      toast.success("Listing deleted.");
      setConfirmDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete the listing.");
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const form = new FormData(e.currentTarget);
    const price = String(form.get("price") ?? "0");
    setBusyId(editing.id);
    try {
      const patch = {
        id: editing.id,
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        category: String(form.get("category") ?? ""),
        preview_url: String(form.get("preview_url") ?? ""),
        price_cents: Math.round(Number(price) * 100),
      };
      await saveListing({ data: patch });
      setListings((prev) =>
        (prev ?? []).map((l) =>
          l.id === editing.id
            ? {
                ...l,
                title: patch.title,
                description: patch.description,
                category: patch.category,
                preview_url: patch.preview_url,
                price_cents: patch.price_cents,
              }
            : l,
        ),
      );
      toast.success("Listing updated.");
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your changes.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#f97316]/30 bg-[#f97316]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#fb923c]">
              <Store size={12} /> Creator dashboard
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-black tracking-tight">
              Your listings
            </h1>
            <p className="mt-3 max-w-xl text-white/60">
              Edit the details, take a listing offline while you polish it, or delete it for good.
              Only listings marked live appear in the marketplace.
            </p>
          </div>
          <Link
            to="/marketplace/sell"
            className="inline-flex items-center gap-2 rounded-xl bg-[#f97316] px-4 py-2.5 text-sm font-semibold text-black hover:bg-[#fb923c] transition"
          >
            <Plus size={16} /> New listing
          </Link>
        </div>

        <div className="mt-10 space-y-4">
          {listings === null && (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-6 text-white/60">
              <Loader2 size={18} className="animate-spin" /> Loading your listings…
            </div>
          )}

          {listings?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
              <p className="text-lg font-semibold">You haven't published anything yet.</p>
              <p className="mt-2 text-white/55">
                Publish your first template or AI agent and it will show up here.
              </p>
              <Link
                to="/marketplace/sell"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#fb923c] transition"
              >
                <Plus size={16} /> Create a listing
              </Link>
            </div>
          )}

          {listings?.map((listing) => (
            <div
              key={listing.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-semibold">{listing.title}</h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
                      listing.is_active
                        ? "bg-[#22c55e]/15 text-[#4ade80]"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {listing.is_active ? "Live" : "Draft"}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-white/55">
                  {listing.description || "No description yet."}
                </p>
                <p className="mt-2 text-sm text-white/45">
                  {money(listing.price_cents)}
                  {listing.category ? ` · ${listing.category}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleLive(listing)}
                  disabled={busyId === listing.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50"
                >
                  {listing.is_active ? <EyeOff size={15} /> : <Eye size={15} />}
                  {listing.is_active ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(listing)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  <Pencil size={15} /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(listing)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1120] p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Edit listing</h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close">
                <X size={18} className="text-white/60 hover:text-white" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block text-sm">
                <span className="text-white/70">Title</span>
                <input
                  name="title"
                  defaultValue={editing.title}
                  required
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#f97316]"
                />
              </label>
              <label className="block text-sm">
                <span className="text-white/70">Description</span>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editing.description ?? ""}
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#f97316]"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block text-sm">
                  <span className="text-white/70">Category</span>
                  <input
                    name="category"
                    defaultValue={editing.category ?? ""}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#f97316]"
                  />
                </label>
                <label className="block text-sm">
                  <span className="text-white/70">Price (USD)</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={((editing.price_cents ?? 0) / 100).toFixed(2)}
                    className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#f97316]"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="text-white/70">Preview link</span>
                <input
                  name="preview_url"
                  defaultValue={editing.preview_url ?? ""}
                  placeholder="https://…"
                  className="mt-1 w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none focus:border-[#f97316]"
                />
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busyId === editing.id}
                className="inline-flex items-center gap-2 rounded-lg bg-[#f97316] px-4 py-2 text-sm font-semibold text-black hover:bg-[#fb923c] disabled:opacity-60"
              >
                {busyId === editing.id && <Loader2 size={15} className="animate-spin" />}
                Save changes
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b1120] p-6">
            <h3 className="text-lg font-semibold">Delete “{confirmDelete.title}”?</h3>
            <p className="mt-2 text-sm text-white/60">
              This removes the listing permanently. Anyone who already bought it keeps their copy.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={busyId === confirmDelete.id}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
              >
                {busyId === confirmDelete.id && <Loader2 size={15} className="animate-spin" />}
                Delete listing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
