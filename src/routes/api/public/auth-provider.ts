import { createFileRoute } from "@tanstack/react-router";

const SUPABASE_URL = "https://nqeuarvpkxupxeeuzuow.supabase.co";
const PROVIDERS = new Set(["google"]);

export const Route = createFileRoute("/api/public/auth-provider")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const provider = url.searchParams.get("provider") ?? "";

        if (!PROVIDERS.has(provider)) {
          return Response.json(
            { enabled: false, message: "Unsupported authentication provider." },
            { status: 400, headers: { "cache-control": "no-store" } },
          );
        }

        const redirectTo = encodeURIComponent(`${url.origin}/app`);
        const probeUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${redirectTo}`;
        const probe = await fetch(probeUrl, { method: "GET", redirect: "manual" });

        if (probe.status >= 300 && probe.status < 400) {
          return Response.json(
            { enabled: true },
            { status: 200, headers: { "cache-control": "no-store" } },
          );
        }

        const payload = await probe.json().catch(() => null);
        return Response.json(
          {
            enabled: false,
            message:
              payload?.msg ||
              payload?.message ||
              "Google sign-in is not enabled for this Supabase project yet.",
          },
          { status: 200, headers: { "cache-control": "no-store" } },
        );
      },
    },
  },
});
