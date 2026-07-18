import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { getUserCredits, createCheckoutSession } from "@/lib/monetization.functions";
import { createPortalSession } from "@/lib/stripe-portal.functions";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/app/billing/")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [
      { title: "Billing — Signhify" },
      {
        name: "description",
        content:
          "Manage your Signhify plan, credits, subscription, and billing history.",
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
  { label: "Starter Pack", credits: 10, price: 19, priceId: "price_test_signhify_credit_pack" },
  { label: "Pro Pack", credits: 50, price: 79, priceId: "price_test_signhify_credit_pack_50" },
  { label: "Ultra Pack", credits: 200, price: 249, priceId: "price_test_signhify_credit_pack_200" },
];

const MOCK_PURCHASES = [
  { id: "1", date: "2026-06-28", description: "Pro Pack — 50 credits", amount: 79, status: "completed" },
  { id: "2", date: "2026-06-15", description: "Studio Monthly", amount: 49, status: "completed" },
  { id: "3", date: "2026-05-01", description: "Starter Pack — 10 credits", amount: 19, status: "completed" },
];

function BillingPage() {
  const getCreditsFn = useServerFn(getUserCredits);
  const checkoutFn = useServerFn(createCheckoutSession);
  const portalFn = useServerFn(createPortalSession);

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

  useEffect(() => {
    getCreditsFn()
      .then(setCredits)
      .finally(() => setCreditsLoading(false));
  }, []);

  const usageQuery = useQuery({
    queryKey: ["ai_usage_month"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
                          <span>Used: {credits ? credits.maxCredits - credits.creditsRemaining : 0}</span>
                          <span>Remaining: {credits?.creditsRemaining ?? 0}</span>
                        </div>
                      </div>
                    )}
                    {tier === "free" && (
                      <Button
                        onClick={() => checkoutFn({ data: { plan: "pro" } }).then((r) => r.url && window.open(r.url, "_blank"))}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Upgrade to Studio — $49/mo
                      </Button>
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
                          usageQuery.data?.apiCalls ?? 0
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
