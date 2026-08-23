import { Link } from "@tanstack/react-router";
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
        <Link to="/pricing" className="block w-full">
          <Button
            variant="default"
            size="sm"
            className="w-full text-xs h-8 bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold border-0 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
          >
            <CreditCard className="w-3.5 h-3.5 mr-2" />
            Upgrade Plan ($5 - $200/mo)
          </Button>
        </Link>
      )}
    </div>
  );
}
