import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Badge, Button, GlassCard, PageTitle } from "../components/ui";

type Campaign = {
  id: number;
  name: string;
  status: string;
  created_at: string;
  stats: { total: number; queued: number; complete: number } | null;
};

export const Route = createFileRoute("/campaigns")({
  component: Campaigns,
});

function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [bump, setBump] = useState(0);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d: { campaigns: Campaign[] }) => setCampaigns(d.campaigns));
  }, [bump]);

  const act = async (action: "launch" | "pause", id: number) => {
    await fetch("/api/campaigns", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, id }),
    });
    setBump((n) => n + 1);
  };

  return (
    <div>
      <PageTitle title="Campaigns" sub="Sequences composed by the Writer agent, delivered by Ops." />
      <div className="mb-6 flex justify-end">
        <Link to="/campaigns/new">
          <Button>+ New campaign</Button>
        </Link>
      </div>
      <div className="space-y-3">
        {campaigns.map((c) => (
          <GlassCard key={c.id} className="flex flex-wrap items-center gap-4">
            <div className="min-w-40 flex-1">
              <Link to="/campaigns/$id" params={{ id: String(c.id) }} className="font-display font-600 text-white hover:text-ember-soft">
                {c.name}
              </Link>
              <div className="text-xs text-slate-soft">
                {c.stats?.total ?? 0} leads · {c.stats?.complete ?? 0} complete · {c.stats?.queued ?? 0} queued
              </div>
            </div>
            <Badge kind="status" value={c.status} />
            {c.status === "draft" && (
              <Button onClick={() => act("launch", c.id)}>Launch</Button>
            )}
            {c.status === "running" && (
              <Button variant="ghost" onClick={() => act("pause", c.id)}>Pause</Button>
            )}
            {c.status === "paused" && (
              <Button onClick={() => act("launch", c.id)}>Resume</Button>
            )}
          </GlassCard>
        ))}
        {campaigns.length === 0 && (
          <GlassCard className="py-12 text-center text-slate-soft">
            No campaigns yet. <Link to="/campaigns/new" className="text-ember-soft">Create your first →</Link>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
