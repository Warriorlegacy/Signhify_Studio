import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { confirmWaitlistToken } from "@/lib/waitlist.functions";

export const Route = createFileRoute("/confirm")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: typeof search.token === "string" ? search.token : undefined,
    };
  },
  component: ConfirmPage,
});

function ConfirmPage() {
  const { token } = Route.useSearch();
  const confirmFn = useServerFn(confirmWaitlistToken);
  const [state, setState] = useState<"verifying" | "success" | "error">("verifying");
  const [email, setEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMessage("Missing verification token.");
      setState("error");
      return;
    }

    let active = true;
    confirmFn({ data: { token } })
      .then((res) => {
        if (!active) return;
        setEmail(res.email);
        setState("success");
      })
      .catch((err) => {
        if (!active) return;
        setErrorMessage(err instanceof Error ? err.message : "Verification failed.");
        setState("error");
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <section className="relative isolate min-h-svh pt-36 pb-28 overflow-hidden flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "var(--gradient-ember)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none" aria-hidden />

      <div className="relative w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          {state === "verifying" && (
            <motion.div
              key="verifying"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl border border-border bg-card/80 backdrop-blur-md p-8 text-center shadow-(--shadow-glow) flex flex-col items-center"
            >
              <div className="relative h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-6 animate-pulse">
                <Loader2 className="animate-spin text-primary" size={24} />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Verifying Link</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Securing your position on the Signhify AI waitlist...
              </p>
            </motion.div>
          )}

          {state === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-2xl border border-primary/40 bg-card/85 backdrop-blur-md p-8 text-center shadow-(--shadow-glow) flex flex-col items-center"
            >
              <div className="relative h-14 w-14 flex items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="font-display text-2xl font-black tracking-tight">Early Access Confirmed!</h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Your email <span className="text-foreground font-medium">{email}</span> is verified. We&rsquo;ll notify you the moment the OS deployment engine opens.
              </p>

              <div className="mt-8 w-full flex flex-col gap-3">
                <Link
                  to="/ai"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition duration-300"
                >
                  Explore AI Workspace <ArrowRight size={14} />
                </Link>
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3.5 text-sm font-semibold hover:border-primary/50 transition duration-300"
                >
                  Back to Studio Home
                </Link>
              </div>
            </motion.div>
          )}

          {state === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl border border-destructive/30 bg-card/85 backdrop-blur-md p-8 text-center shadow-lg flex flex-col items-center"
            >
              <div className="relative h-14 w-14 flex items-center justify-center rounded-full bg-destructive/10 text-destructive mb-6">
                <AlertCircle size={32} />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-destructive-foreground">Verification Failed</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {errorMessage || "The verification link is invalid or has expired."}
              </p>

              <div className="mt-8 w-full flex flex-col gap-3">
                <Link
                  to="/ai"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition duration-300"
                >
                  Retry Early Access Sign-up
                </Link>
                <Link
                  to="/"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3.5 text-sm font-semibold hover:border-primary/50 transition duration-300"
                >
                  Back to Studio Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
