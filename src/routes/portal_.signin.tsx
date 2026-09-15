import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/portal_/signin")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/portal",
  }),
  head: () => ({
    meta: [
      { title: "Buyer Sign In — Client Portal | Signhify" },
      {
        name: "description",
        content:
          "Create a free buyer account or sign in to track your UPI payments, unlock the blueprints you bought, and message the Signhify studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Buyer Sign In — Signhify Client Portal" },
      {
        property: "og:description",
        content: "Your own account for payments, unlocked blueprints and studio support.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/portal/signin" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/portal/signin" }],
  }),
  component: BuyerSignIn,
});

function BuyerSignIn() {
  const nav = useNavigate();
  const { redirect } = Route.useSearch();
  const { user, loading, signIn, signUp, signInWithGoogle } = useUser();
  const [mode, setMode] = useState<"in" | "up">("up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) void nav({ to: redirect || "/portal" });
  }, [loading, user, nav, redirect]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (!email.trim() || password.length < 6) {
      setError("Enter a valid email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    const target = `${window.location.origin}${redirect || "/portal"}`;
    const res =
      mode === "in"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password, target);
    setBusy(false);
    if (res.error) {
      setError(res.error.message);
      return;
    }
    if (mode === "up" && !("session" in res.data && res.data.session)) {
      setNotice("Account created. Confirm it from your email, then sign in here.");
      setMode("in");
      return;
    }
    toast.success("Welcome back — opening your portal.");
    await nav({ to: redirect || "/portal" });
  };

  const google = async () => {
    setError("");
    setBusy(true);
    const res = await signInWithGoogle(`${window.location.origin}${redirect || "/portal"}`);
    setBusy(false);
    if (res.error) setError(res.error.message);
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-6 grid place-items-center">
      <div className="w-full max-w-md">
        <Breadcrumbs items={[{ label: "Client portal", to: "/portal" }]} />
        <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Buyers</div>
          <h1 className="font-display text-3xl font-bold">
            {mode === "up" ? (
              <>
                Create your <span className="text-gradient">buyer account</span>
              </>
            ) : (
              "Sign in to your portal"
            )}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your own account for UPI payment status, unlocked blueprints, reviews and a direct line
            to the studio.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary/60"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              autoComplete={mode === "in" ? "current-password" : "new-password"}
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary/60"
            />
            {error && <div className="text-sm text-red-300">{error}</div>}
            {notice && <div className="text-sm text-emerald-300">{notice}</div>}
            <button
              type="submit"
              disabled={busy || loading}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "up" ? "Create buyer account" : "Sign in"}
            </button>
          </form>

          <button
            onClick={() => setMode(mode === "up" ? "in" : "up")}
            className="mt-3 w-full rounded-md border border-border bg-surface/60 px-4 py-3 text-sm"
          >
            {mode === "up" ? "Already a buyer? Sign in" : "New here? Create an account"}
          </button>
          <button
            onClick={google}
            disabled={busy || loading}
            className="mt-3 w-full rounded-md border border-border bg-surface/60 px-4 py-3 text-sm disabled:opacity-60"
          >
            Continue with Google
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Browsing first?{" "}
            <Link to="/marketplace" className="text-primary hover:underline">
              See the blueprint marketplace
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
