import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonScene } from "@/components/ComingSoonScene";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — Signhify Marketplace" },
      {
        name: "description",
        content:
          "Production-ready templates for SaaS, AI products, landing pages and CRMs. Ships June 21, 2026 at marketplace.signhify.online.",
      },
      { property: "og:title", content: "Templates — Signhify" },
    ],
  }),
  component: () => (
    <ComingSoonScene
      eyebrow="Templates"
      title="Ship faster. Start from a production template."
      subdomain="marketplace.signhify.online"
      description="A curated library of SaaS, AI, landing, CRM and dashboard templates — opinionated, deployable, and built on the same stack we use for client work."
      week="Week 3 · June 15–21"
      bullets={[
        "10+ launch-ready Next.js / TanStack templates",
        "One-click deploy through Signhify Deploy",
        "Cinematic landing pages tuned for conversion",
        "AI starter kits with agents pre-wired",
      ]}
    />
  ),
});
