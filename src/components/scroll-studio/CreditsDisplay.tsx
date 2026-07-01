import { useServerFn } from "@tanstack/react-start";
import { getUserCredits, createCheckoutSession } from "@/lib/monetization.functions";
import { useEffect, useState } from "react";
import { Zap, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export function CreditsDisplay() {
  const getCreditsFn = useServerFn(getUserCredits);
  const checkoutFn = useServerFn(createCheckoutSession);

  const [data, setData] = useState<{
    tier: string;
    creditsRemaining: number;
    maxCredits: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    getCreditsFn()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await checkoutFn({ data: { plan: "pro" } });
      if (res.url) {
        window.open(res.url, "_blank");
      }
    } catch (e) {
      toast.error("Failed to start checkout");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="p-4 flex justify-center">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const percent = ((data.maxCredits - data.creditsRemaining) / data.maxCredits) * 100;

  return (
    <div className="p-4 bg-muted/30 border-t border-border mt-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          {data.tier === "pro" ? "Pro Plan" : "Free Tier"}
        </div>
        <div className="text-xs font-semibold">
          {data.creditsRemaining} / {data.maxCredits} credits
        </div>
      </div>

      <Progress value={percent} className="h-1.5 mb-3 bg-muted" />

      {data.tier === "free" && (
        <Button
          variant="default"
          size="sm"
          className="w-full text-xs h-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
          onClick={handleUpgrade}
          disabled={upgrading}
        >
          {upgrading ? (
            <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
          ) : (
            <CreditCard className="w-3.5 h-3.5 mr-2" />
          )}
          Upgrade to Pro ($49/mo)
        </Button>
      )}
    </div>
  );
}
