import { createFileRoute } from "@tanstack/react-router";
import { sprintTracks, statusMeta, type SprintStatus } from "@/lib/sprint-checklist";
import { CtaSection } from "@/components/sections/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/sprint")({
  head: () => ({
    meta: [
      { title: "Signhify Engineering Sprint & Public Delivery Checklist" },
      {
        name: "description",
        content:
          "Live progress checklist of Signhify's product delivery sprint across Studio, AI, Deploy, Marketplace, Cloud and OS — tracked in real time.",
      },
      { property: "og:title", content: "Signhify Engineering Sprint & Public Delivery Checklist" },
      {
        property: "og:description",
        content: "Built in public. Live tracking of Signhify AI Studio engineering sprint items.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/sprint" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/sprint" }],
  }),
  component: SprintPage,
});

function SprintPage() {
  const all = sprintTracks.flatMap((t) => t.items);
  const counts = all.reduce(
    (acc, i) => ({ ...acc, [i.status]: (acc[i.status] ?? 0) + 1 }),
    {} as Record<SprintStatus, number>,
  );
  const total = all.length;
  const done = counts.done ?? 0;
  const pct = Math.round((done / total) * 100);

  return (
    <>
      <section className="pt-36 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <Breadcrumbs items={[{ label: "Sprint Checklist", to: "/sprint" }]} />
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
            End-of-month delivery checklist
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black max-w-4xl">
            June 2026 sprint, <span className="text-gradient">tracked live</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
            Every remaining Phase 1 item — status, owner and due date. Updated as we ship. Deadline:{" "}
            <span className="text-foreground font-medium">June 30, 2026</span>.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <StatCard label="Total items" value={total} />
            <StatCard label="Done" value={counts.done ?? 0} tone="emerald" />
            <StatCard label="In progress" value={counts.in_progress ?? 0} tone="primary" />
            <StatCard label="Todo" value={counts.todo ?? 0} />
            <StatCard label="Blocked" value={counts.blocked ?? 0} tone="red" />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Overall progress</span>
              <span className="font-mono text-foreground">{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-surface overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-primary to-amber transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 space-y-10">
          {sprintTracks.map((track) => {
            const tDone = track.items.filter((i) => i.status === "done").length;
            return (
              <div
                key={track.key}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-border flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-muted-foreground">{track.window}</div>
                    <h2 className="mt-1 font-display text-2xl font-bold">{track.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{track.summary}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-primary">{track.subdomain}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {tDone} / {track.items.length} done
                    </div>
                  </div>
                </div>
                <ul className="divide-y divide-border">
                  {track.items.map((item) => {
                    const meta = statusMeta[item.status];
                    return (
                      <li
                        key={item.id}
                        className="px-6 py-4 flex flex-wrap items-start gap-4 hover:bg-surface/40 transition"
                      >
                        <div className={`mt-2 h-2.5 w-2.5 rounded-full shrink-0 ${meta.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="font-medium">{item.title}</div>
                            <span
                              className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${meta.pill}`}
                            >
                              {meta.label}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-medium">{item.owner}</div>
                          <div className="font-mono text-xs text-muted-foreground">
                            due {item.due}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <CtaSection />
    </>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "primary" | "emerald" | "red";
}) {
  const toneClass =
    tone === "primary"
      ? "text-primary"
      : tone === "emerald"
        ? "text-emerald-300"
        : tone === "red"
          ? "text-red-300"
          : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-3xl font-bold ${toneClass}`}>{value}</div>
    </div>
  );
}
