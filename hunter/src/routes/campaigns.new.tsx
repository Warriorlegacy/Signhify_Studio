import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button, GlassCard, PageTitle, Field, inputCls } from "../components/ui";

type Step = { delay_days: number; subject: string; body: string };
type Sample = { leadId: number; org: string; contact: string | null; subject: string; body: string };

const DEFAULT_BODY = `Hi {{lead.contactName}},

Saw that {{lead.orgName}} is working on something interesting. I run Signhify — an AI engineering studio (14+ shipped products). We help teams like yours go from idea to shipped product in ~14 days.

If that's useful, happy to jump on a quick call.

Best,
Piyush`;

export const Route = createFileRoute("/campaigns/new")({
  component: NewCampaign,
});

function NewCampaign() {
  const navigate = useNavigate();
  const [name, setName] = useState("Untitled campaign");
  const [tier, setTier] = useState("A");
  const [steps, setSteps] = useState<Step[]>([{ delay_days: 0, subject: "A build question for {{lead.orgName}}", body: DEFAULT_BODY }]);
  const [samples, setSamples] = useState<Sample[] | null>(null);
  const [saving, setSaving] = useState(false);

  const setStep = (i: number, patch: Partial<Step>) => {
    setSteps((prev) => prev.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  };

  const preview = async () => {
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "preview",
        tier,
        step: { subject: steps[0]?.subject ?? "", body: steps[0]?.body ?? "" },
      }),
    });
    const d = (await res.json()) as { samples: Sample[] };
    setSamples(d.samples);
  };

  const create = async () => {
    setSaving(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "create", name, tier, steps }),
    });
    const d = (await res.json()) as { ok: boolean; id?: number };
    if (d.ok && d.id) navigate({ to: "/campaigns/$id", params: { id: String(d.id) } });
    setSaving(false);
  };

  return (
    <div>
      <PageTitle title="New campaign" sub="Audience → sequence → AI samples → launch gate." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <GlassCard>
            <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">1 · Audience</h2>
            <div className="flex gap-4">
              <Field label="Campaign name">
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Lead tier">
                <select className={inputCls} value={tier} onChange={(e) => setTier(e.target.value)}>
                  <option value="A">Tier A</option>
                  <option value="B">Tier B</option>
                </select>
              </Field>
            </div>
            <p className="mt-3 text-xs text-slate-soft">
              Audience = verified-email leads at tier {tier}. Compliance: no unsubscribed or archived leads, ever.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">2 · Sequence</h2>
            {steps.map((s, i) => (
              <div key={i} className="mb-4 rounded-lg border border-white/8 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-display text-xs font-600 uppercase tracking-wider text-ember-soft">
                    Step {i + 1} · email
                  </span>
                  {steps.length > 1 && (
                    <button
                      onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                      className="text-xs text-slate-soft hover:text-red-400"
                    >
                      remove
                    </button>
                  )}
                </div>
                <div className="mb-3 flex items-center gap-3">
                  <Field label="Delay (days)">
                    <input
                      type="number"
                      min={0}
                      className={`${inputCls} w-24`}
                      value={s.delay_days}
                      onChange={(e) => setStep(i, { delay_days: Number(e.target.value) })}
                    />
                  </Field>
                  <Field label="Subject template">
                    <input
                      className={inputCls}
                      value={s.subject}
                      onChange={(e) => setStep(i, { subject: e.target.value })}
                    />
                  </Field>
                </div>
                <Field label="Body template ({{lead.…}} slots)">
                  <textarea
                    className={`${inputCls} h-40 font-mono text-xs`}
                    value={s.body}
                    onChange={(e) => setStep(i, { body: e.target.value })}
                  />
                </Field>
              </div>
            ))}
            <Button
              variant="ghost"
              onClick={() => setSteps((prev) => [...prev, { delay_days: 4, subject: "Quick follow-up", body: DEFAULT_BODY }])}
            >
              + Add step
            </Button>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-sm font-600 uppercase tracking-wider text-slate-soft">3 · AI samples</h2>
              <Button variant="ghost" onClick={preview}>Generate 5 samples</Button>
            </div>
            {samples?.length ? (
              <div className="space-y-3">
                {samples.map((s) => (
                  <div key={s.leadId} className="rounded-lg border border-white/8 p-3">
                    <div className="mb-1 flex items-center gap-2 text-xs">
                      <span className="font-medium text-slate-200">{s.org}</span>
                      <span className="text-slate-soft">→ {s.contact ?? "there"}</span>
                    </div>
                    <div className="mb-1 text-sm font-medium text-ember-soft">{s.subject}</div>
                    <p className="whitespace-pre-wrap text-xs text-slate-soft">{s.body.slice(0, 240)}…</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-slate-soft">
                Samples personalize on real tier-{tier} leads with verified emails.
              </p>
            )}
          </GlassCard>

          <GlassCard className="border-ember/30">
            <h2 className="mb-2 font-display text-sm font-600 uppercase tracking-wider text-ember-soft">Launch gate</h2>
            <p className="mb-4 text-xs text-slate-soft">
              Launched campaigns send only to verified emails, stop on reply/unsubscribe, and respect sandbox mode.
            </p>
            <Button onClick={create} disabled={saving || steps.length === 0}>
              {saving ? "Creating…" : "Create campaign"}
            </Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
