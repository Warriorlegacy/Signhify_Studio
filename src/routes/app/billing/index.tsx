import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Zap,
  CreditCard,
  Loader2,
  ExternalLink,
  Clock,
  Download,
  Sparkles,
  BarChart3,
  HardDrive,
  CheckCircle2,
  AlertCircle,
  ShoppingCart,
  Smartphone,
  Landmark,
  Globe,
  MessageCircle,
} from "lucide-react";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { getUserCredits, createCheckoutSession } from "@/lib/monetization.functions";
import { createPortalSession } from "@/lib/stripe-portal.functions";
import { createManualPayment, listMyManualPayments } from "@/lib/manual-payments.functions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/billing/")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [
      { title: "Billing — Signhify" },
      {
        name: "description",
        content: "Manage your Signhify plan, credits, subscription, and billing history.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/app/billing" },
      { property: "og:title", content: "Billing — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/app/billing" }],
  }),
  component: BillingPage,
});

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  studio: "Studio",
  scale: "Scale",
  pro: "Studio",
};

const PLAN_COLORS: Record<string, string> = {
  free: "text-muted-foreground border-muted-foreground/30 bg-muted/20",
  studio: "text-indigo-300 border-indigo-500/40 bg-indigo-500/10",
  scale: "text-amber-300 border-amber-500/40 bg-amber-500/10",
  pro: "text-indigo-300 border-indigo-500/40 bg-indigo-500/10",
};

const CREDIT_PACKS = [
  { label: "Starter Vibe", credits: 5, price: 5, priceId: "price_test_signhify_credit_pack_5" },
  { label: "Pro Builder", credits: 75, price: 50, priceId: "price_test_signhify_credit_pack_50" },
  { label: "Studio Scale", credits: 125, price: 100, priceId: "price_test_signhify_credit_pack_100" },
  { label: "Enterprise Fleet", credits: 300, price: 200, priceId: "price_test_signhify_credit_pack_200" },
];

const MOCK_PURCHASES = [
  {
    id: "1",
    date: "2026-06-28",
    description: "Pro Pack — 50 credits",
    amount: 79,
    status: "completed",
  },
  { id: "2", date: "2026-06-15", description: "Studio Monthly", amount: 49, status: "completed" },
  {
    id: "3",
    date: "2026-05-01",
    description: "Starter Pack — 10 credits",
    amount: 19,
    status: "completed",
  },
];

function BillingPage() {
  const getCreditsFn = useServerFn(getUserCredits);
  const checkoutFn = useServerFn(createCheckoutSession);
  const portalFn = useServerFn(createPortalSession);
  const createManualFn = useServerFn(createManualPayment);
  const listManualFn = useServerFn(listMyManualPayments);

  const qc = useQueryClient();
  const [credits, setCredits] = useState<{
    tier: string;
    creditsRemaining: number;
    maxCredits: number;
    projectsCount: number;
    videosGenerated: number;
  } | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const [manualAmount, setManualAmount] = useState<string>("");
  const [manualMethod, setManualMethod] = useState<"upi" | "bank_transfer" | "paypal">("upi");
  const [manualRef, setManualRef] = useState<string>("");
  const [manualNotes, setManualNotes] = useState<string>("");
  const [manualSubmitting, setManualSubmitting] = useState(false);

  const manualPaymentsQuery = useQuery({
    queryKey: ["my_manual_payments"],
    queryFn: async () => {
      const res = await listManualFn({ data: undefined });
      return res.payments;
    },
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(manualAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid positive amount.");
      return;
    }
    if (!manualRef.trim()) {
      toast.error("Transaction reference ID is required.");
      return;
    }
    setManualSubmitting(true);
    try {
      await createManualFn({
        data: {
          amount,
          method: manualMethod,
          description: manualNotes.trim() || undefined,
          transactionRef: manualRef.trim(),
        },
      });
      toast.success("Verification request submitted! We will credit your account soon.");
      setManualAmount("");
      setManualRef("");
      setManualNotes("");
      qc.invalidateQueries({ queryKey: ["my_manual_payments"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit request.");
    } finally {
      setManualSubmitting(false);
    }
  };

  useEffect(() => {
    getCreditsFn()
      .then(setCredits)
      .finally(() => setCreditsLoading(false));
  }, []);

  const usageQuery = useQuery({
    queryKey: ["ai_usage_month"],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return { apiCalls: 0, storageBytes: 0 };
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const { count } = await (supabase.from as any)("ai_usage")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", start.toISOString());
      const { data: projects } = await (supabase.from as any)("user_projects")
        .select("id")
        .eq("user_id", user.id);
      return { apiCalls: count ?? 0, storageBytes: (projects?.length ?? 0) * 256 };
    },
  });

  const tier = credits?.tier ?? "free";
  const isUnlimited = tier === "studio" || tier === "scale" || tier === "pro";
  const creditPercent = credits
    ? ((credits.maxCredits - credits.creditsRemaining) / credits.maxCredits) * 100
    : 0;

  const handleBuyCredits = async (priceId: string) => {
    setBuying(priceId);
    try {
      const res = await checkoutFn({ data: { priceId } });
      if (res.url) window.open(res.url, "_blank");
    } catch {
      /* toast would go here */
    } finally {
      setBuying(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const res = await portalFn({ data: undefined });
      window.location.href = res.url;
    } catch {
      /* toast */
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-2">
              Account & billing
            </div>
            <h1 className="font-display text-4xl font-black">Billing</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePortal} disabled={portalLoading}>
              {portalLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              Manage Subscription
            </Button>
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* Left column — plan + credits */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan card */}
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your active subscription tier</CardDescription>
                </div>
                <Badge className={PLAN_COLORS[tier] ?? PLAN_COLORS.free}>
                  {PLAN_LABELS[tier] ?? "Free"}
                </Badge>
              </CardHeader>
              <CardContent>
                {creditsLoading ? (
                  <Skeleton className="h-12 w-full rounded-lg" />
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">
                          {tier === "free" ? "Free Tier" : `${PLAN_LABELS[tier] ?? "Studio"} Plan`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {isUnlimited
                            ? "Unlimited AI generations & scrolls"
                            : `${credits?.creditsRemaining ?? 0} of ${credits?.maxCredits ?? 2} credits remaining`}
                        </div>
                      </div>
                    </div>
                    {isUnlimited ? (
                      <div className="inline-flex items-center gap-2 text-sm text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Unlimited credits
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Progress value={creditPercent} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            Used: {credits ? credits.maxCredits - credits.creditsRemaining : 0}
                          </span>
                          <span>Remaining: {credits?.creditsRemaining ?? 0}</span>
                        </div>
                      </div>
                    )}
                    {tier === "free" && (
                      <Link to="/pricing">
                        <Button
                          className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold border-0 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          View Plans &amp; Upgrade — Starting $5/mo
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credit packs */}
            <Card>
              <CardHeader>
                <CardTitle>Buy Credits</CardTitle>
                <CardDescription>
                  One-time credit packs for AI generation. Credits never expire.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-4">
                  {CREDIT_PACKS.map((pack) => (
                    <div
                      key={pack.label}
                      className="rounded-xl border border-border bg-surface/40 p-5 flex flex-col"
                    >
                      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                        {pack.label}
                      </div>
                      <div className="font-display text-3xl font-black mt-1">{pack.credits}</div>
                      <div className="text-sm text-muted-foreground">credits</div>
                      <div className="mt-auto pt-4">
                        <div className="text-lg font-semibold">${pack.price}</div>
                        <Button
                          className="mt-2 w-full"
                          size="sm"
                          onClick={() => handleBuyCredits(pack.priceId)}
                          disabled={buying === pack.priceId}
                        >
                          {buying === pack.priceId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <ShoppingCart className="w-3.5 h-3.5" />
                          )}
                          Buy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Manual payment methods */}
            <Card>
              <CardHeader>
                <CardTitle>Manual Payment Verification</CardTitle>
                <CardDescription>
                  Send payment first, then submit receipt details below for verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column: Details */}
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-3 md:grid-cols-1 gap-3">
                      <div className="rounded-xl border border-border bg-surface/40 p-4">
                        <Smartphone className="w-5 h-5 text-blue-400 mb-2" />
                        <div className="text-sm font-semibold">UPI</div>
                        <div className="text-xs text-muted-foreground font-mono mt-1">
                          6202442690@jio
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-surface/40 p-4">
                        <Globe className="w-5 h-5 text-sky-400 mb-2" />
                        <div className="text-sm font-semibold">PayPal</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          <a
                            href="https://paypal.me/signhify"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-primary underline"
                          >
                            paypal.me/signhify
                          </a>
                        </div>
                      </div>
                      <div className="rounded-xl border border-border bg-surface/40 p-4">
                        <Landmark className="w-5 h-5 text-emerald-400 mb-2" />
                        <div className="text-sm font-semibold">Bank Transfer</div>
                        <div className="text-xs text-muted-foreground mt-1 font-mono leading-relaxed">
                          A/C 000521712140642
                          <br />
                          Piyush Raj Singh
                          <br />
                          Jio Payments Bank
                          <br />
                          IFSC JIOP0000001
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-surface/40 p-4 flex items-start gap-3">
                      <MessageCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <span className="font-semibold">WhatsApp confirmation</span>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          After payment, send the screenshot to{" "}
                          <a
                            href="https://wa.me/916202442690"
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-primary underline"
                          >
                            +91 620202442690
                          </a>{" "}
                          and we&rsquo;ll credit your account within 2 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Verification Form */}
                  <form
                    onSubmit={handleManualSubmit}
                    className="space-y-4 rounded-xl border border-border bg-surface/20 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-semibold text-sm mb-3">Verify Payment Receipt</h3>

                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">
                            Amount (INR)
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="e.g. 79"
                            value={manualAmount}
                            onChange={(e) => setManualAmount(e.target.value)}
                            className="w-full rounded border border-border bg-background/50 px-3 py-1.5 text-xs outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Method</label>
                          <select
                            value={manualMethod}
                            onChange={(e) => setManualMethod(e.target.value as any)}
                            className="w-full rounded border border-border bg-background/50 px-3 py-1.5 text-xs outline-none focus:border-primary"
                          >
                            <option value="upi">UPI</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_transfer">Bank Transfer</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="block text-xs text-muted-foreground mb-1">
                          Transaction Ref / ID
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. UTR / Txn ID / Reference"
                          value={manualRef}
                          onChange={(e) => setManualRef(e.target.value)}
                          className="w-full rounded border border-border bg-background/50 px-3 py-1.5 text-xs outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">
                          Notes (Optional)
                        </label>
                        <textarea
                          placeholder="Describe what you purchased (e.g., Pro Pack)"
                          rows={2}
                          value={manualNotes}
                          onChange={(e) => setManualNotes(e.target.value)}
                          className="w-full rounded border border-border bg-background/50 px-3 py-1.5 text-xs outline-none focus:border-primary resize-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={manualSubmitting}
                      className="w-full text-xs py-2 mt-4"
                    >
                      {manualSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      ) : null}
                      Submit Verification Request
                    </Button>
                  </form>
                </div>

                {/* History Section inside Card */}
                {manualPaymentsQuery.data && manualPaymentsQuery.data.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-semibold text-sm mb-3">
                      Your Offline Verification Requests
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {manualPaymentsQuery.data.map((p: any) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border/60 bg-surface/30 text-xs"
                        >
                          <div>
                            <div className="font-medium">
                              {p.method === "upi"
                                ? "UPI"
                                : p.method === "paypal"
                                  ? "PayPal"
                                  : "Bank Transfer"}{" "}
                              — ₹{p.amount}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                              Ref: {p.transaction_ref}
                            </div>
                            {p.description && (
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                Note: {p.description}
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-[10px] uppercase font-semibold",
                                p.status === "confirmed"
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                  : p.status === "expired"
                                    ? "bg-red-500/10 text-red-400 border border-red-500/30"
                                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30",
                              )}
                            >
                              {p.status}
                            </span>
                            <div className="text-[9px] text-muted-foreground mt-1">
                              {new Date(p.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage stats */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
                <CardDescription>AI generation and storage metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {usageQuery.isLoading ? (
                          <Skeleton className="h-7 w-12 inline-block" />
                        ) : (
                          (usageQuery.data?.apiCalls ?? 0)
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">API calls this month</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-surface/40 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {usageQuery.isLoading ? (
                          <Skeleton className="h-7 w-12 inline-block" />
                        ) : (
                          `${((usageQuery.data?.storageBytes ?? 0) / 1024).toFixed(1)} KB`
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">Storage used</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column — purchase history */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>Recent transactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {MOCK_PURCHASES.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface/30 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{p.description}</div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(p.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-semibold">${p.amount}</div>
                      <Badge
                        variant={p.status === "completed" ? "secondary" : "outline"}
                        className="mt-1 text-[10px]"
                      >
                        {p.status === "completed" ? (
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                        ) : (
                          <AlertCircle className="w-2.5 h-2.5 mr-1" />
                        )}
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <div className="text-center text-xs text-muted-foreground pt-2">
                  Full history available in the{" "}
                  <button
                    onClick={handlePortal}
                    disabled={portalLoading}
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    Stripe portal <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Quick links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  to="/app/settings"
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface/30 p-3 text-sm hover:border-primary/60 transition"
                >
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  Settings & billing info
                </Link>
                <Link
                  to="/ai"
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface/30 p-3 text-sm hover:border-primary/60 transition"
                >
                  <Zap className="w-4 h-4 text-amber-500" />
                  Signhify AI
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
