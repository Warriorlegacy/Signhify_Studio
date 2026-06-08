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
      { property: "og:url", content: "https://signhify.online/login" },
      { property: "og:title", content: "Login — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/login" }],
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
  const submit = async () => {
    setError("");
    const res = mode === "in" ? await signIn(email, password) : await signUp(email, password);
    if (res.error) setError(res.error.message);
    else await nav({ to: redirect || "/app" });
  };
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
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary/60"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary/60"
          />
          {error && <div className="text-sm text-red-300">{error}</div>}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            {mode === "in" ? "Sign In" : "Sign Up"}
          </button>
          <button
            onClick={() => setMode(mode === "in" ? "up" : "in")}
            className="w-full rounded-md border border-border bg-surface/60 px-4 py-3 text-sm"
          >
            {mode === "in" ? "Need an account? Sign Up" : "Have an account? Sign In"}
          </button>
          <button
            onClick={() => signInWithGoogle()}
            className="w-full rounded-md border border-border bg-surface/60 px-4 py-3 text-sm"
          >
            Continue with Google
          </button>
        </div>
      </div>
    </section>
  );
}
