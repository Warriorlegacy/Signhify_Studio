import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button, GlassCard, PageTitle, Field, inputCls } from "../components/ui";

type Source = {
  id: number;
  channel: string;
  name: string;
  config: string;
  enabled: number;
  last_run_at: string | null;
  last_run_count: number;
  last_error: string | null;
  created_at: string;
};

export const Route = createFileRoute("/sources")({
  component: Sources,
});

function Sources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [channels, setChannels] = useState<string[]>([]);
  const [bump, setBump] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("hnalgolia");
  const [config, setConfig] = useState("{}");

  useEffect(() => {
    fetch("/api/sources")
      .then((r) => r.json())
      .then((d: { sources: Source[]; channels: string[] }) => {
        setSources(d.sources);
        setChannels(d.channels);
      });
  }, [bump]);

  const create = async () => {
    const res = await fetch("/api/sources", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "create",
        name,
        channel,
        config: (() => {
          try {
            return JSON.parse(config);
          } catch {
            return {};
          }
        })(),
      }),
    });
    if (res.ok) {
      setShowForm(false);
      setName("");
      setConfig("{}");
      setBump((n) => n + 1);
    }
  };

  const act = async (action: "run" | "toggle" | "delete", id: number) => {
    await fetch("/api/sources", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, id }),
    });
    setBump((n) => n + 1);
  };

  return (
    <div>
      <PageTitle title="Sources" sub="Scout agents that discover prospects across the public internet." />
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "+ New source"}</Button>
      </div>

      {showForm && (
        <GlassCard className="mb-6 max-w-xl">
          <h2 className="mb-4 font-display text-sm font-600 uppercase tracking-wider text-slate-soft">
            New source
          </h2>
          <div className="space-y-4">
            <Field label="Name">
              <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="HN build requests" />
            </Field>
            <Field label="Channel">
              <select className={inputCls} value={channel} onChange={(e) => setChannel(e.target.value)}>
                {channels.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Config (JSON — channel-specific)">
              <textarea
                className={`${inputCls} h-28 font-mono text-xs`}
                value={config}
                onChange={(e) => setConfig(e.target.value)}
              />
            </Field>
            <div className="flex justify-end">
              <Button onClick={create}>Create source</Button>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sources.map((s) => (
          <GlassCard key={s.id} className="flex flex-col">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <h3 className="font-display font-600 text-white">{s.name}</h3>
                <span className="text-xs text-slate-soft">{s.channel}</span>
              </div>
              <span className={`pulse-dot ${s.enabled ? "" : "opacity-20"}`} />
            </div>
            <div className="mb-3 flex gap-2 text-xs">
              <span className="text-slate-soft">leads found: </span>
              <span className="text-ember-soft">{s.last_run_count}</span>
              <span className="text-slate-soft">· last run: </span>
              <span className="text-slate-soft">{s.last_run_at ? s.last_run_at.slice(0, 16).replace("T", " ") : "never"}</span>
            </div>
            {s.last_error && (
              <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                {s.last_error}
              </div>
            )}
            <div className="mt-auto flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => act("run", s.id)} disabled={!s.enabled}>
                Run now
              </Button>
              <Button variant="ghost" onClick={() => act("toggle", s.id)}>
                {s.enabled ? "Pause" : "Enable"}
              </Button>
              <Button variant="danger" onClick={() => act("delete", s.id)}>
                ✕
              </Button>
            </div>
          </GlassCard>
        ))}
        {sources.length === 0 && (
          <GlassCard className="col-span-full py-12 text-center text-slate-soft">
            No sources yet. Create one to start discovering leads.
          </GlassCard>
        )}
      </div>
    </div>
  );
}
