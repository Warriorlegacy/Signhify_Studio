import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge, Button, GlassCard, PageTitle, inputCls } from "../components/ui";

type Lead = {
  id: number;
  org_name: string;
  org_domain: string;
  industry: string | null;
  country: string | null;
  contact_name: string | null;
  contact_role: string | null;
  contact_email: string | null;
  source_channel: string;
  source_url: string | null;
  email_verdict: string;
  score: number;
  tier: string;
  score_reason: string | null;
  status: string;
  created_at: string;
};

type Detail = {
  lead: Lead;
  history: Array<{ type: string; payload: string; created_at: string }>;
  messages: Array<{ direction: string; subject: string | null; body: string | null; status: string; created_at: string }>;
};

export const Route = createFileRoute("/leads")({
  component: Leads,
});

function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [tierFilter, setTierFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bump, setBump] = useState(0);

  const load = () => {
    fetch(`/api/leads?tier=${tierFilter}&q=${encodeURIComponent(search)}`)
      .then((r) => r.json())
      .then((d: { leads: Lead[] }) => setLeads(d.leads))
      .catch(() => setLeads([]));
  };

  useEffect(load, [tierFilter, search, bump]);

  const openDetail = (id: number) => {
    fetch(`/api/leads/${id}`)
      .then((r) => r.json())
      .then(setDetail);
  };

  const setTier = async (tier: string) => {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "tier", ids: [...selected], tier }),
    });
    setSelected(new Set());
    setBump((n) => n + 1);
  };

  const toggle = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div>
      <PageTitle title="Leads" sub={`${leads.length} shown · ${selected.size} selected`} />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className={`${inputCls} w-40`}
        >
          <option value="all">All tiers</option>
          <option value="A">Tier A</option>
          <option value="B">Tier B</option>
          <option value="C">Tier C</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search org / email / domain…"
          className={`${inputCls} max-w-xs`}
        />
        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-soft">Bulk tier:</span>
            {["A", "B", "C"].map((t) => (
              <Button key={t} variant="ghost" onClick={() => setTier(t)}>
                → {t}
              </Button>
            ))}
          </div>
        )}
      </div>

      <GlassCard className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left text-xs uppercase tracking-wider text-slate-soft">
              <th className="px-4 py-3" />
              <th className="px-4 py-3">Organization</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Verdict</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Tier</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr
                key={l.id}
                onClick={() => openDetail(l.id)}
                className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/3"
              >
                <td className="px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.has(l.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggle(l.id);
                    }}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <div className="font-medium text-slate-200">{l.org_name}</div>
                  <div className="text-xs text-slate-soft">{l.org_domain}</div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="text-slate-200">{l.contact_name ?? "—"}</div>
                  <div className="text-xs text-slate-soft">{l.contact_email ?? "no email"}</div>
                </td>
                <td className="px-4 py-2.5 text-slate-soft">{l.source_channel}</td>
                <td className="px-4 py-2.5">
                  <Badge kind="verdict" value={l.email_verdict} />
                </td>
                <td className="px-4 py-2.5 font-mono text-ember-soft">{l.score}</td>
                <td className="px-4 py-2.5">
                  <Badge kind="tier" value={l.tier} />
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-soft">
                  No leads. Run a source from the Sources tab.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end bg-black/60"
          onClick={() => setDetail(null)}
        >
          <div
            className="h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-obsidian-2 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-600 text-white">{detail.lead.org_name}</h2>
                <p className="text-xs text-slate-soft">{detail.lead.org_domain}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-slate-soft hover:text-white">
                ✕
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge kind="tier" value={detail.lead.tier} />
              <Badge kind="verdict" value={detail.lead.email_verdict} />
              <Badge kind="status" value={detail.lead.status} />
            </div>
            <dl className="space-y-2 text-sm">
              {[
                ["Website", detail.lead.source_url],
                ["Contact", detail.lead.contact_name],
                ["Role", detail.lead.contact_role],
                ["Email", detail.lead.contact_email],
                ["Country", detail.lead.country],
                ["Industry", detail.lead.industry],
                ["Source", detail.lead.source_channel],
                ["Score", String(detail.lead.score)],
                ["Reason", detail.lead.score_reason],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-24 shrink-0 text-xs uppercase tracking-wider text-slate-soft">{k}</dt>
                  <dd className="break-all text-slate-200">{v ?? "—"}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-6 mb-2 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
              Timeline
            </h3>
            <div className="space-y-1.5 font-mono text-xs">
              {detail.history.map((h, i) => (
                <div key={i} className="flex gap-2 text-slate-soft">
                  <span className="text-slate-soft/50">{h.created_at.slice(11, 19)}</span>
                  <span className="text-ember-soft">{h.type}</span>
                </div>
              ))}
            </div>
            <h3 className="mt-6 mb-2 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
              Messages
            </h3>
            <div className="space-y-2 text-xs">
              {detail.messages.map((m, i) => (
                <div key={i} className="glass p-3">
                  <div className="mb-1 flex justify-between">
                    <span className="font-medium text-slate-200">
                      {m.direction === "out" ? "→ sent" : "← received"}
                    </span>
                    <span className="text-slate-soft">{m.status}</span>
                  </div>
                  <p className="text-slate-soft">{m.body?.slice(0, 180)}…</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
