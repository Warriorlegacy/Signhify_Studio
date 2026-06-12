import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { requireAppAuth } from "@/lib/auth-guard.server";
import { getProjectAnalytics } from "@/lib/analytics.functions";
export const Route = createFileRoute("/app/projects/$id/analytics")({
  beforeLoad: requireAppAuth,
  head: () => ({
    meta: [
      { title: "Analytics — Signhify | AI Product Studio" },
      {
        name: "description",
        content: "Review seven-day Signhify project page views, top pages, and top referrers.",
      },
      { property: "og:url", content: "https://signhify.online/app/projects/analytics" },
      { property: "og:title", content: "Analytics — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/app/projects/analytics" }],
  }),
  loader: async ({ params }) => ({ id: params.id }),
  component: AnalyticsPage,
});
function tally(rows: any[], key: string) {
  return Object.entries(
    rows.reduce((a: any, r: any) => {
      const k = r[key] || "Unknown";
      a[k] = (a[k] || 0) + 1;
      return a;
    }, {}),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);
}
function AnalyticsPage() {
  const { id } = Route.useParams();
  const get = useServerFn(getProjectAnalytics);
  const q = useQuery({
    queryKey: ["analytics", id],
    queryFn: () => get({ data: { projectId: id } }),
  });
  const rows = q.data?.rows ?? [];
  const daily = tally(
    rows.map((r: any) => ({ ...r, day: new Date(r.created_at).toLocaleDateString() })),
    "day",
  );
  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-4xl font-black">Analytics</h1>
        <div className="mt-8 h-72 rounded-2xl border border-border bg-card p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={daily}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line dataKey="count" stroke="#ff6b00" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-5">
          <Table title="Top pages" rows={tally(rows, "path")} />
          <Table title="Top referrers" rows={tally(rows, "referrer")} />
        </div>
      </div>
    </section>
  );
}
function Table({ title, rows }: { title: string; rows: any[] }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      {rows.map((r) => (
        <div key={r.name} className="mt-3 flex justify-between text-sm">
          <span>{r.name}</span>
          <span>{String(r.count)}</span>
        </div>
      ))}
    </div>
  );
}
