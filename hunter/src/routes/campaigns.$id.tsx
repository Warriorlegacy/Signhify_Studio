import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge, Button, GlassCard, PageTitle } from "../components/ui";

type Detail = {
  campaign: {
    id: number; name: string; status: string; audience: { tier: string };
  };
  steps: Array<{ id: number; step_order: number; channel: string; delay_days: number; subject_template: string }>;
  leads: Array<{
    id: number; lead_id: number; step_index: number; next_send_at: string | null;
    status: string; org_name: string; contact_email: string | null; contact_name: string | null; tier: string;
  }>;
  messages: Array<{ id: number; org_name: string; subject: string | null; status: string; sent_at: string | null; created_at: string }>;
};

export const Route = createFileRoute("/campaigns/$id")({
  component: CampaignDetail,
});

function CampaignDetail() {
  const { id } = Route.useParams();
  const [data, setData] = useState<Detail | null>(null);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    fetch(`/api/campaigns/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id, bump]);

  useEffect(() => {
    const t = setInterval(() => setBump((n) => n + 1), 4000);
    return () => clearInterval(t);
  }, []);

  const act = async (action: "launch" | "pause") => {
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, id: Number(id) }),
    });
    setBump((n) => n + 1);
  };

  if (!data) return <PageTitle title="Campaign" />;
  const c = data.campaign;

  return (
    <div>
      <div className="mb-2">
        <Link to="/campaigns" className="text-xs text-slate-soft hover:text-ember-soft">← Campaigns</Link>
      </div>
      <PageTitle title={c.name} sub={`Audience: tier ${c.audience.tier} · ${data.leads.length} leads loaded`} />
      <div className="mb-6 flex gap-2">
        <Badge kind="status" value={c.status} />
        {c.status === "draft" && <Button onClick={() => act("launch")}>Launch</Button>}
        {c.status === "running" && <Button variant="ghost" onClick={() => act("pause")}>Pause</Button>}
        {c.status === "paused" && <Button onClick={() => act("launch")}>Resume</Button>}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {data.steps.map((s) => (
          <div key={s.id} className="glass px-4 py-3">
            <div className="text-xs text-slate-soft">
              Step {s.step_order + 1} · +{s.delay_days}d · {s.channel}
            </div>
            <div className="mt-1 max-w-64 truncate text-sm text-slate-200">{s.subject_template}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="overflow-x-auto p-0">
          <h3 className="border-b border-white/8 px-4 py-3 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
            Leads
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-soft">
                <th className="px-4 py-2">Org</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Step</th>
                <th className="px-4 py-2">Next send</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((l) => (
                <tr key={l.id} className="border-b border-white/5">
                  <td className="px-4 py-2 text-slate-200">{l.org_name}</td>
                  <td className="px-4 py-2 text-xs text-slate-soft">{l.contact_email ?? "—"}</td>
                  <td className="px-4 py-2 text-xs text-slate-soft">{l.step_index + 1}</td>
                  <td className="px-4 py-2 text-xs text-slate-soft">
                    {l.next_send_at ? l.next_send_at.slice(0, 16).replace("T", " ") : "—"}
                  </td>
                  <td className="px-4 py-2"><Badge kind="status" value={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <GlassCard className="overflow-x-auto p-0">
          <h3 className="border-b border-white/8 px-4 py-3 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
            Messages
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-soft">
                <th className="px-4 py-2">Org</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.messages.map((m) => (
                <tr key={m.id} className="border-b border-white/5">
                  <td className="px-4 py-2 text-xs text-slate-200">{m.org_name}</td>
                  <td className="max-w-56 truncate px-4 py-2 text-xs text-slate-soft">{m.subject}</td>
                  <td className="px-4 py-2"><Badge kind="status" value={m.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
}
