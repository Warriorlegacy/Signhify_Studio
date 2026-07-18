import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";

export const Route = createFileRoute("/login")({
  validateSearch: (s) => ({ redirect: typeof s.redirect === "string" ? s.redirect : "/app" }),
  head: () => ({
    meta: [
      { title: "Login — Signhify | AI Product Studio" },
      {
        name: "description",
        content: "Sign in to your Signhify workspace with email, password, or Google OAuth.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/login" },
      { property: "og:title", content: "Login — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/login" }],
  }),
  component: LoginPage,
});
function LoginPage() {
  const nav = useNavigate();
  const { redirect } = Route.useSearch();
  const { signIn, signUp, signInWithGoogle, loading } = useUser();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const authMessage = (message: string) => {
    const lower = message.toLowerCase();
    if (lower.includes("rate limit") || lower.includes("429")) {
      return "Too many auth attempts. Please wait a minute, then try again.";
    }
    if (lower.includes("unsupported provider") || lower.includes("not enabled")) {
      return "Google sign-in is not enabled in Supabase yet. Enable Google under Authentication → Providers, then try again.";
    }
    if (lower.includes("invalid login credentials")) {
      return "That email/password does not match. Use the password set for this Supabase account.";
    }
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
    const target = `${window.location.origin}${redirect || "/app"}`;
    const res =
      mode === "in"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password, target);
    setSubmitting(false);
    if (res.error) setError(authMessage(res.error.message));
    else if (mode === "up" && !res.data.session) {
      setNotice("Account created. Check your email to confirm it, then sign in here.");
      setMode("in");
    } else await nav({ to: redirect || "/app" });
  };

  const google = async () => {
    setError("");
    setNotice("");
    setSubmitting(true);
    const res = await signInWithGoogle(`${window.location.origin}${redirect || "/app"}`);
    setSubmitting(false);
    if (res.error) setError(authMessage(res.error.message));
  };

  const isBusy = loading || submitting;
  return (
    <section className="min-h-screen pt-32 pb-20 grid place-items-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-[var(--shadow-card)]">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Workspace</div>
        <h1 className="font-display text-3xl font-bold">
          {mode === "in" ? "Sign in" : "Create account"}
        </h1>
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
            autoComplete={mode === "in" ? "current-password" : "new-password"}
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary/60"
          />
          {error && <div className="text-sm text-red-300">{error}</div>}
          {notice && <div className="text-sm text-emerald-300">{notice}</div>}
          <button
            onClick={submit}
            disabled={isBusy}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            {submitting ? "Please wait…" : mode === "in" ? "Sign In" : "Sign Up"}
          </button>
          <button
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="w-full rounded-md border border-border bg-surface/60 px-4 py-3 text-sm"
          >
            {mode === "in" ? "Need an account? Sign Up" : "Have an account? Sign In"}
          </button>
          <button
            onClick={google}
            disabled={isBusy}
            className="w-full rounded-md border border-border bg-surface/60 px-4 py-3 text-sm"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </section>
  );
}
