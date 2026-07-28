import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useServerFn } from "@tanstack/react-start";
import { initFreeCredits } from "@/lib/credits-init.functions";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/signup")({
  validateSearch: (s) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/app/billing",
  }),
  head: () => ({
    meta: [
      { title: "Sign Up — Signhify AI Studio | Start Building Free" },
      {
        name: "description",
        content:
          "Create your free Signhify account and get 2 free AI credits to start building. No credit card required.",
      },
      { property: "og:title", content: "Sign Up — Signhify AI Studio | Start Building Free" },
      {
        property: "og:description",
        content: "Create your free Signhify account and get 2 free AI credits to start building.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/signup" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const { redirect } = Route.useSearch();
  const { signUp, signInWithGoogle, loading } = useUser();
  const initCredits = useServerFn(initFreeCredits);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const authMessage = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes("rate limit") || lower.includes("429"))
      return "Too many attempts. Please wait a minute, then try again.";
    if (lower.includes("unsupported provider") || lower.includes("not enabled"))
      return "Google sign-in is not enabled yet. Enable it in Supabase → Authentication → Providers.";
    if (lower.includes("invalid login credentials")) return "That email/password does not match.";
    return message;
  };

  const submit = async () => {
    setError("");
    setNotice("");
    if (!email.trim() || password.length < 6) {
      setError("Enter a valid email and a password with at least 6 characters.");
      return;
    }
    setSubmitting(true);
    const target = `${window.location.origin}${redirect || "/app/billing"}`;
    const res = await signUp(email.trim(), password, target);
    setSubmitting(false);
    if (res.error) {
      setError(authMessage(res.error.message));
      return;
    }
    // If session exists (email confirm disabled), init credits and go
    if (res.data.session) {
      try {
        await initCredits({ data: { userId: res.data.session.user.id } });
      } catch {
        // non-fatal: user can still use the app with defaults
      }
      await nav({ to: redirect || "/app/billing" });
    } else {
      setNotice("Account created. Check your email to confirm it, then sign in.");
    }
  };

  const google = async () => {
    setError("");
    setNotice("");
    setSubmitting(true);
    const res = await signInWithGoogle(`${window.location.origin}${redirect || "/app/billing"}`);
    setSubmitting(false);
    if (res.error) setError(authMessage(res.error.message));
  };

  const isBusy = loading || submitting;
  return (
    <section className="min-h-screen pt-32 pb-20 grid place-items-center px-6">
      <div className="w-full max-w-md">
        <Breadcrumbs items={[{ label: "Sign Up", to: "/signup" }]} />
        <div className="rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Get started</div>
          <h1 className="font-display text-3xl font-bold">
            Create your <span className="text-gradient">free account</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            2 free AI credits included. No credit card.
          </p>
          <div className="mt-6 space-y-3">
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
              autoComplete="new-password"
              className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary/60"
            />
            {error && <div className="text-sm text-red-300">{error}</div>}
            {notice && <div className="text-sm text-emerald-300">{notice}</div>}
            <button
              onClick={submit}
              disabled={isBusy}
              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              {submitting ? "Creating account…" : "Sign Up Free"}
            </button>
            <div className="relative flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex-1 border-t border-border" />
              <span>or</span>
              <span className="flex-1 border-t border-border" />
            </div>
            <button
              onClick={google}
              disabled={isBusy}
              className="w-full rounded-md border border-border bg-surface/60 px-4 py-3 text-sm inline-flex items-center justify-center gap-2"
            >
              Continue with Google
            </button>
            <p className="text-center text-xs text-muted-foreground pt-2">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
