import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Kpi, GlassCard, PageTitle } from "../components/ui";

type DashboardData = {
  kpis: {
    total: number; verified: number; tierA: number; sent: number;
    replied: number; meetings: number; unsubs: number; pendingJobs: number; failedJobs: number;
  };
  funnel: Array<{ stage: string; value: number; pct: number }>;
  byChannel: Array<{ source_channel: string; c: number }>;
  events: Array<{ id: number; type: string; payload: string; created_at: string }>;
  sandbox: boolean;
};

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [refresh]);

  useEffect(() => {
    const t = setInterval(() => setRefresh((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const k = data?.kpis;

  return (
    <div>
      <PageTitle
        title="Command Center"
        sub={
          data?.sandbox
            ? "Sandbox mode — messages are simulated, nothing leaves the system."
            : "Live mode — real sends via Resend."
        }
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Leads sourced" value={k?.total ?? "—"} sub="all time" />
        <Kpi label="Verified emails" value={k?.verified ?? "—"} sub={`${k?.tierA ?? 0} tier A`} />
        <Kpi label="Contacted" value={k?.sent ?? "—"} sub="messages sent" />
        <Kpi label="Replies" value={k?.replied ?? "—"} sub="threads" />
        <Kpi label="Meetings" value={k?.meetings ?? "—"} sub="booked" />
        <Kpi
          label="Pipeline health"
          value={k && (k.unsubs ?? 0) === 0 ? "clean" : `${k?.unsubs ?? 0} unsubs`}
          sub={`${k?.pendingJobs ?? 0} jobs queued`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
            Acquisition funnel
          </h2>
          {data?.funnel.map((f) => (
            <div key={f.stage} className="mb-3">
              <div className="mb-1 flex justify-between text-xs">
                <span className="text-slate-200">{f.stage}</span>
                <span className="text-slate-soft">
                  {f.value} · {f.pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ember to-gold"
                  style={{ width: `${f.pct}%` }}
                />
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard>
          <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
            By channel
          </h2>
          {data?.byChannel.length ? (
            data.byChannel.map((c) => (
              <div key={c.source_channel} className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-200">{c.source_channel}</span>
                <span className="text-ember-soft">{c.c}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-soft">No leads yet — configure a source.</p>
          )}
          <div className="mt-4 border-t border-white/8 pt-3">
            <button
              onClick={() => setRefresh((n) => n + 1)}
              className="text-xs text-ember-soft hover:text-ember"
            >
              Refresh
            </button>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-6">
        <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
          <span className="pulse-dot" /> Agent activity
        </h2>
        <div className="max-h-72 space-y-1.5 overflow-y-auto font-mono text-xs">
          {data?.events.length ? (
            data.events.map((e) => (
              <div key={e.id} className="flex gap-2 text-slate-soft">
                <span className="shrink-0 text-slate-soft/50">{e.created_at.slice(11, 19)}</span>
                <span className="shrink-0 text-ember-soft">{e.type}</span>
                <span className="truncate">{e.payload.slice(0, 120)}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-soft">Waiting for the first agent run…</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
