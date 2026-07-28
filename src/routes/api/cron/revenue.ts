import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cron/revenue")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json().catch(() => ({}))) as { secret?: string };
          const secret = body?.secret || "";
          const expected =
            process.env.CRON_REVENUE_SECRET ||
            "5ab4b9bb901631d6d58f6d29d5841e380ab6c9347170ecdd53916bf25631642d";

          if (!secret || secret !== expected) {
            return new Response(JSON.stringify({ error: "Unauthorized cron request" }), {
              status: 401,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(
            JSON.stringify({
              ok: true as const,
              ranAt: new Date().toISOString(),
              totalProcessed: 0,
              results: [],
              errors: [],
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Cron failure" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
