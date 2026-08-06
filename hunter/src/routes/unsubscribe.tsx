import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button, GlassCard } from "../components/ui";

export const Route = createFileRoute("/unsubscribe")({
  component: Unsubscribe,
});

function Unsubscribe() {
  const search = Route.useSearch() as { email?: string; token?: string };
  const [state, setState] = useState<"idle" | "done" | "invalid">("idle");

  const valid = useMemo(() => {
    const email = search.email ?? "";
    const token = search.token ?? "";
    if (!email || !token) return false;
    const expected = Buffer.from(`${email}:${location.origin}`).toString("base64url");
    return token === expected;
  }, [search.email, search.token]);

  const confirm = async () => {
    await fetch("/api/unsubscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: search.email }),
    });
    setState("done");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <GlassCard className="max-w-md text-center">
        {state === "done" ? (
          <>
            <div className="mb-2 font-display text-xl font-700 text-white">Unsubscribed</div>
            <p className="text-sm text-slate-soft">
              {search.email} will never receive Signhify Hunter emails again. This is immediate and permanent.
            </p>
            <p className="mt-4 text-xs text-slate-soft">
              Changed your mind?{" "}
              <Link to="/" className="text-ember-soft hover:underline">Back to dashboard</Link>
            </p>
          </>
        ) : valid ? (
          <>
            <div className="mb-2 font-display text-xl font-700 text-white">One-click unsubscribe</div>
            <p className="text-sm text-slate-soft">
              Confirm you want to stop all emails to <span className="text-slate-200">{search.email}</span>.
              No follow-ups, no new campaigns, nothing.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Button onClick={confirm}>Unsubscribe me</Button>
              <Link to="/" className="rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/5">
                Cancel
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 font-display text-xl font-700 text-white">Invalid link</div>
            <p className="text-sm text-slate-soft">
              This unsubscribe link is invalid or expired. If this keeps failing, reply to any email with
              "unsubscribe" and we'll handle it manually.
            </p>
          </>
        )}
      </GlassCard>
    </div>
  );
}
