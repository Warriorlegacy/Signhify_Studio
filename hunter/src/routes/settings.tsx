import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, GlassCard, PageTitle, Field, inputCls, Badge } from "../components/ui";

type SettingsData = {
  icp: {
    sizeMin?: number;
    sizeMax?: number;
    countries?: string[];
    excludeCountries?: string[];
    signals?: string[];
  };
  suppression: Array<{ email: string; reason: string; source: string; created_at: string }>;
  domains: Array<{ domain: string; status: string }>;
  env: {
    sandbox: boolean;
    llm: boolean;
    resend: boolean;
    fromEmail: string;
    fromName: string;
  };
};

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [icp, setIcp] = useState({ sizeMin: 2, sizeMax: 500, countries: "", excludeCountries: "", signals: "" });
  const [bump, setBump] = useState(0);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d: SettingsData) => {
        setData(d);
        setIcp({
          sizeMin: d.icp.sizeMin ?? 2,
          sizeMax: d.icp.sizeMax ?? 500,
          countries: (d.icp.countries ?? []).join(", "),
          excludeCountries: (d.icp.excludeCountries ?? []).join(", "),
          signals: (d.icp.signals ?? []).join(", "),
        });
      });
  }, [bump]);

  const saveIcp = async () => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "icp",
        icp: {
          sizeMin: Number(icp.sizeMin),
          sizeMax: Number(icp.sizeMax),
          countries: icp.countries.split(",").map((s) => s.trim()).filter(Boolean),
          excludeCountries: icp.excludeCountries.split(",").map((s) => s.trim()).filter(Boolean),
          signals: icp.signals.split(",").map((s) => s.trim()).filter(Boolean),
        },
      }),
    });
    setBump((n) => n + 1);
  };

  const removeSuppression = async (email: string) => {
    await fetch("/api/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "remove-suppression", email }),
    });
    setBump((n) => n + 1);
  };

  return (
    <div>
      <PageTitle title="Settings" sub="ICP rules, compliance, and environment status." />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <GlassCard>
            <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
              ICP rules (used by the Qualify agent)
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <Field label="Min size">
                  <input type="number" className={inputCls} value={icp.sizeMin} onChange={(e) => setIcp({ ...icp, sizeMin: Number(e.target.value) })} />
                </Field>
                <Field label="Max size">
                  <input type="number" className={inputCls} value={icp.sizeMax} onChange={(e) => setIcp({ ...icp, sizeMax: Number(e.target.value) })} />
                </Field>
              </div>
              <Field label="Target countries (comma separated)">
                <input className={inputCls} value={icp.countries} onChange={(e) => setIcp({ ...icp, countries: e.target.value })} />
              </Field>
              <Field label="Exclude countries">
                <input className={inputCls} value={icp.excludeCountries} onChange={(e) => setIcp({ ...icp, excludeCountries: e.target.value })} />
              </Field>
              <Field label="Signal keywords (comma separated)">
                <input className={inputCls} value={icp.signals} onChange={(e) => setIcp({ ...icp, signals: e.target.value })} />
              </Field>
              <div className="flex justify-end">
                <Button onClick={saveIcp}>Save ICP</Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
              Environment
            </h2>
            <div className="space-y-2 text-sm">
              {[
                ["Mode", data?.env.sandbox ? "SANDBOX (simulated sends)" : "LIVE"],
                ["LLM", data?.env.llm ? "configured" : "not configured (deterministic fallbacks)"],
                ["Resend", data?.env.resend ? "configured" : "not configured"],
                ["From", `${data?.env.fromName} <${data?.env.fromEmail}>`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-slate-soft">{k}</span>
                  <span className="text-slate-200">{v}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
              Sending domains
            </h2>
            <div className="space-y-2">
              {data?.domains.map((d) => (
                <div key={d.domain} className="flex justify-between text-sm">
                  <span className="text-slate-200">{d.domain}</span>
                  <Badge kind="status" value={d.status} />
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-soft">
              SPF/DKIM/DMARC must be configured before real sends — see docs.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
              Suppression list (permanent)
            </h2>
            <div className="max-h-72 space-y-1 overflow-y-auto">
              {data?.suppression.map((s) => (
                <div key={s.email} className="flex items-center justify-between rounded-lg bg-white/3 px-3 py-2 text-xs">
                  <div>
                    <span className="text-slate-200">{s.email}</span>
                    <span className="ml-2 text-slate-soft">· {s.reason}</span>
                  </div>
                  <button onClick={() => removeSuppression(s.email)} className="text-slate-soft hover:text-red-400">
                    remove
                  </button>
                </div>
              ))}
              {data?.suppression.length === 0 && (
                <p className="text-sm text-slate-soft">Clean — no suppressed addresses.</p>
              )}
            </div>
            <p className="mt-3 text-xs text-slate-soft">
              Never emailed again. Unsubscribe links, complaints, and bounces land here automatically.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
