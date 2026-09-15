import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  MessageSquare,
  Package,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { getClientPortal, type PortalPayment, type PortalUnlock } from "@/lib/client-portal.functions";
import {
  listMyClientMessages,
  sendClientMessage,
  type ClientMessage,
} from "@/lib/client-messages.functions";
import { UPI_ID, whatsappLink } from "@/lib/payment-contact";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — Payments, Blueprints & Support | Signhify" },
      {
        name: "description",
        content:
          "Track your UPI payment status, see the blueprints you have unlocked, message the Signhify studio, and reach us on WhatsApp — all in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Signhify Client Portal" },
      {
        property: "og:description",
        content: "Payment status, unlocked blueprints, and a direct line to the studio.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/portal" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/portal" }],
  }),
  component: ClientPortal,
});

const money = (amount: number, currency: string) =>
  currency === "INR" ? `₹${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;

const statusChip = (status: string) => {
  const s = status.toLowerCase();
  if (s === "confirmed" || s === "paid")
    return "text-emerald-300 border-emerald-500/40 bg-emerald-500/10";
  if (s === "failed" || s === "rejected") return "text-red-300 border-red-500/40 bg-red-500/10";
  return "text-amber-300 border-amber-500/40 bg-amber-500/10";
};

function ClientPortal() {
  const { user, loading: authLoading } = useUser();
  const navigate = useNavigate();

  const loadPortal = useServerFn(getClientPortal);
  const loadMessages = useServerFn(listMyClientMessages);
  const postMessage = useServerFn(sendClientMessage);

  const [data, setData] = useState<Awaited<ReturnType<typeof getClientPortal>> | null>(null);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [portal, msgs] = await Promise.all([loadPortal(), loadMessages()]);
      setData(portal);
      setMessages(msgs.messages);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not load your portal.");
    }
  }, [loadPortal, loadMessages]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/portal/signin", search: { redirect: "/portal" } });
      return;
    }
    void refresh();
  }, [authLoading, user, navigate, refresh]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      await postMessage({ data: { body } });
      setDraft("");
      const msgs = await loadMessages();
      setMessages(msgs.messages);
      toast.success("Message sent — we reply on WhatsApp or email.");
    } catch (e: any) {
      toast.error(e?.message ?? "Could not send your message.");
    } finally {
      setSending(false);
    }
  };

  if (authLoading || (!data && user)) {
    return (
      <section className="pt-32 pb-24 px-6 min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </section>
    );
  }

  const payments: PortalPayment[] = data?.payments ?? [];
  const unlocks: PortalUnlock[] = data?.unlocks ?? [];

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">Client portal</div>
        <h1 className="font-display text-4xl font-black">Your account</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Payment status, unlocked blueprints, and a direct line to the studio.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsappLink("Hi Signhify — I have a question about my blueprint.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-black"
          >
            <MessageSquare className="w-4 h-4" /> Chat on WhatsApp
          </a>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm"
          >
            <CreditCard className="w-4 h-4" /> Buy credits
          </Link>
          <Link
            to="/creator"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm"
          >
            <Package className="w-4 h-4" /> My listings
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs text-muted-foreground">Credits left</div>
            <div className="mt-1 text-2xl font-bold">{data?.credits.remaining ?? 0}</div>
            <div className="text-xs text-muted-foreground">plan: {data?.credits.tier}</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs text-muted-foreground">Payments reported</div>
            <div className="mt-1 text-2xl font-bold">{payments.length}</div>
            <div className="text-xs text-muted-foreground">UPI to {UPI_ID}</div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <div className="text-xs text-muted-foreground">Unlocked blueprints</div>
            <div className="mt-1 text-2xl font-bold">{unlocks.length}</div>
            <div className="text-xs text-muted-foreground">{data?.projects.length ?? 0} projects</div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" /> Payment status
            </h2>
            {payments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No payments yet. When you pay by UPI, the reference you submit shows up here.
              </p>
            ) : (
              <ul className="space-y-3">
                {payments.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-lg border border-border/70 p-3 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {p.description ?? "Payment"}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Ref {p.transaction_ref ?? "—"} · {new Date(p.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold">{money(p.amount, p.currency)}</div>
                      <span
                        className={`mt-1 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${statusChip(p.status)}`}
                      >
                        {p.status === "confirmed" ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {p.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <a
              href={whatsappLink("Hi Signhify — here is my UPI payment screenshot.")}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-xs text-primary hover:underline"
            >
              Send your payment screenshot on WhatsApp →
            </a>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" /> Unlocked blueprints
            </h2>
            {unlocks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nothing unlocked yet.{" "}
                <Link to="/marketplace" className="text-primary hover:underline">
                  Browse the marketplace
                </Link>
                .
              </p>
            ) : (
              <ul className="space-y-3">
                {unlocks.map((u) => (
                  <li key={u.id} className="rounded-lg border border-border/70 p-3">
                    <div className="text-sm font-medium">{u.title}</div>
                    <div className="text-xs text-muted-foreground">
                      Unlocked {new Date(u.purchased_at).toLocaleDateString()}
                    </div>
                    {u.slug && (
                      <Link
                        to="/marketplace/$slug"
                        params={{ slug: u.slug }}
                        className="mt-1 inline-block text-xs text-primary hover:underline"
                      >
                        Open blueprint →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface p-5">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Message the studio
          </h2>
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ask anything about your blueprint before it goes live — we answer here and on
                WhatsApp.
              </p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-lg border p-3 text-sm ${
                    m.sender_role === "client"
                      ? "ml-auto border-primary/40 bg-primary/10"
                      : "border-border bg-background"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.body}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {m.sender_role === "client" ? "You" : "Signhify"} ·{" "}
                    {new Date(m.created_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={send} className="mt-4 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Tell us what you need changed before publishing…"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
