import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, GlassCard, PageTitle, Badge, inputCls } from "../components/ui";

type Thread = {
  id: number;
  lead_id: number | null;
  subject: string | null;
  status: string;
  category: string;
  suggestion: string | null;
  created_at: string;
  updated_at: string;
  org_name: string | null;
  contact_name: string | null;
  contact_email: string | null;
};

type ThreadDetail = {
  thread: Thread;
  lead: { id: number; org_name: string; contact_name: string | null } | null;
};

export const Route = createFileRoute("/inbox")({
  component: Inbox,
});

function Inbox() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selected, setSelected] = useState<Thread | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [bump, setBump] = useState(0);
  const [testTarget, setTestTarget] = useState("");

  useEffect(() => {
    fetch("/api/inbox")
      .then((r) => r.json())
      .then((d: { threads: Thread[]; unread: number }) => setThreads(d.threads));
  }, [bump]);

  useEffect(() => {
    const t = setInterval(() => setBump((n) => n + 1), 4000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (selected) setReplyDraft(selected.suggestion ?? "");
  }, [selected]);

  const act = async (action: string, body: Record<string, unknown>) => {
    const res = await fetch("/api/inbox", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, ...body }),
    });
    if (res.ok) setBump((n) => n + 1);
    return res;
  };

  const sendTestReply = async () => {
    await act("test-reply", { leadId: Number(testTarget), text: "Interested — let's talk." });
    setTestTarget("");
  };

  return (
    <div>
      <PageTitle title="Inbox" sub="Respond agent triages; you approve before anything sends." />
      <div className="mb-4 flex items-center gap-3">
        <input
          className={`${inputCls} max-w-xs`}
          placeholder="Lead ID to simulate a reply…"
          value={testTarget}
          onChange={(e) => setTestTarget(e.target.value)}
        />
        <Button variant="ghost" onClick={sendTestReply} disabled={!testTarget}>
          Simulate reply
        </Button>
        <span className="text-xs text-slate-soft">(test harness for the Respond agent)</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <GlassCard className="p-0 lg:col-span-2">
          <div className="max-h-[70vh] overflow-y-auto">
            {threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`block w-full border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/3 ${
                  selected?.id === t.id ? "bg-ember/8" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-sm font-medium text-slate-200">
                    {t.org_name ?? "Unknown org"}
                  </span>
                  <Badge kind="status" value={t.category} />
                </div>
                <div className="truncate text-xs text-slate-soft">{t.subject}</div>
                {t.status === "needs_reply" && <span className="pulse-dot mt-1.5 inline-block" />}
              </button>
            ))}
            {threads.length === 0 && (
              <div className="px-4 py-10 text-center text-sm text-slate-soft">No replies yet.</div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          {selected ? (
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="font-display font-600 text-white">{selected.subject}</h2>
                  <p className="text-xs text-slate-soft">
                    {selected.contact_name ?? "unknown"} · {selected.contact_email ?? "no email"} ·{" "}
                    {selected.category}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => act("book", { threadId: selected.id })}
                  disabled={selected.status === "booked"}
                >
                  Book meeting
                </Button>
              </div>

              {selected.suggestion && (
                <div className="mb-4 rounded-lg border border-gold/30 bg-gold/8 p-4">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold">
                    AI suggestion
                  </div>
                  <p className="text-sm text-slate-200">{selected.suggestion || "(no suggestion — draft below)"}</p>
                </div>
              )}

              <textarea
                className={`${inputCls} h-40`}
                value={replyDraft}
                onChange={(e) => setReplyDraft(e.target.value)}
                placeholder="Draft reply…"
              />
              <div className="mt-3 flex gap-2">
                <Button onClick={() => act("approve-reply", { threadId: selected.id, reply: replyDraft })} disabled={!replyDraft}>
                  Approve & send
                </Button>
                <Button variant="ghost" onClick={() => act("regenerate", { threadId: selected.id })}>
                  Regenerate suggestion
                </Button>
              </div>
              <p className="mt-3 text-xs text-slate-soft">
                Human-in-the-loop: replies never send without your approval.
              </p>
            </div>
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center text-sm text-slate-soft">
              Select a thread — or simulate a reply to see the Respond agent work.
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
