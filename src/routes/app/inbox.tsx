import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { Check, Inbox, Loader2, Send, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { isAdminEmail } from "@/lib/admin";
import {
  listClientInbox,
  markThreadRead,
  sendClientMessage,
  type InboxThread,
} from "@/lib/client-messages.functions";
import {
  listListingsForReview,
  reviewListing,
  type ReviewListing,
} from "@/lib/marketplace-review.functions";

export const Route = createFileRoute("/app/inbox")({
  head: () => ({
    meta: [
      { title: "Client Inbox & Listing Review — Signhify" },
      {
        name: "description",
        content:
          "Read and answer client messages about their blueprints, and approve or reject creator listings before they go live on the Signhify marketplace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Client Inbox — Signhify" },
      {
        property: "og:description",
        content: "Answer client messages and approve marketplace listings.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/app/inbox" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/app/inbox" }],
  }),
  component: InboxPage,
});

function InboxPage() {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  const loadInbox = useServerFn(listClientInbox);
  const loadReview = useServerFn(listListingsForReview);
  const postReply = useServerFn(sendClientMessage);
  const markRead = useServerFn(markThreadRead);
  const decide = useServerFn(reviewListing);

  const [threads, setThreads] = useState<InboxThread[] | null>(null);
  const [listings, setListings] = useState<ReviewListing[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);

  const admin = isAdminEmail(user?.email);

  const refresh = useCallback(async () => {
    try {
      const [inbox, review] = await Promise.all([loadInbox(), loadReview()]);
      setThreads(inbox.threads);
      setListings(review.listings);
      setActiveId((prev) => prev ?? inbox.threads[0]?.clientId ?? null);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not load the inbox.");
      setThreads([]);
    }
  }, [loadInbox, loadReview]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/app/inbox" } });
      return;
    }
    if (!admin) return;
    void refresh();
  }, [loading, user, admin, navigate, refresh]);

  if (loading) {
    return (
      <section className="pt-32 pb-24 px-6 min-h-screen flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </section>
    );
  }

  if (user && !admin) {
    return (
      <section className="pt-32 pb-24 px-6 min-h-screen">
        <div className="mx-auto max-w-xl rounded-xl border border-border bg-surface p-6 text-center">
          <ShieldCheck className="mx-auto mb-3 w-6 h-6 text-primary" />
          <h1 className="font-display text-2xl font-bold">Studio inbox</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This inbox belongs to the Signhify studio. Your own conversation lives in your client
            portal.
          </p>
        </div>
      </section>
    );
  }

  const active = threads?.find((t) => t.clientId === activeId) ?? null;

  const reply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!active || !draft.trim() || busy) return;
    setBusy(true);
    try {
      await postReply({ data: { body: draft.trim(), clientId: active.clientId } });
      await markRead({ data: { clientId: active.clientId } });
      setDraft("");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Could not send the reply.");
    } finally {
      setBusy(false);
    }
  };

  const review = async (id: string, decision: "approve" | "reject") => {
    setBusy(true);
    try {
      await decide({ data: { id, decision } });
      toast.success(decision === "approve" ? "Listing is live." : "Listing rejected.");
      await refresh();
    } catch (e: any) {
      toast.error(e?.message ?? "Could not update the listing.");
    } finally {
      setBusy(false);
    }
  };

  const pending = listings.filter((l) => (l.status ?? "pending") === "pending");

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Studio</div>
        <h1 className="font-display text-4xl font-black flex items-center gap-3">
          <Inbox className="w-7 h-7 text-primary" /> Client inbox
        </h1>

        <div className="mt-8 grid gap-4 lg:grid-cols-[280px_1fr]">
          <div className="rounded-xl border border-border bg-surface p-2 max-h-[520px] overflow-y-auto">
            {threads === null ? (
              <div className="p-4">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            ) : threads.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No client messages yet.</p>
            ) : (
              threads.map((t) => (
                <button
                  key={t.clientId}
                  onClick={() => setActiveId(t.clientId)}
                  className={`w-full rounded-lg p-3 text-left ${
                    t.clientId === activeId ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium">{t.clientLabel}</span>
                    {t.unread > 0 && (
                      <span className="rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                        {t.unread}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">{t.lastMessage}</div>
                </button>
              ))
            )}
          </div>

          <div className="rounded-xl border border-border bg-surface p-5 flex flex-col min-h-[520px]">
            {!active ? (
              <p className="text-sm text-muted-foreground">
                Pick a conversation to read and reply.
              </p>
            ) : (
              <>
                <div className="mb-3 text-sm font-semibold">{active.clientLabel}</div>
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {active.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[80%] rounded-lg border p-3 text-sm ${
                        m.sender_role === "studio"
                          ? "ml-auto border-primary/40 bg-primary/10"
                          : "border-border bg-background"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.body}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {new Date(m.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={reply} className="mt-4 flex gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Reply to this client…"
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={busy || !draft.trim()}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Reply
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold">
            Listings awaiting approval{" "}
            <span className="text-sm font-normal text-muted-foreground">({pending.length})</span>
          </h2>
          <div className="mt-4 space-y-3">
            {pending.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing waiting for review.</p>
            ) : (
              pending.map((l) => (
                <div
                  key={l.id}
                  className="rounded-xl border border-border bg-surface p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{l.title}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {l.category ?? "Template"} ·{" "}
                      {(l.price_cents ?? 0) > 0 ? `$${((l.price_cents ?? 0) / 100).toFixed(2)}` : "Free"}{" "}
                      · {l.slug}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => review(l.id, "approve")}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 disabled:opacity-50"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => review(l.id, "reject")}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
