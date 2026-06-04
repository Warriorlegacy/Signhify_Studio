import { createFileRoute } from "@tanstack/react-router";
import { ComingSoonScene } from "@/components/ComingSoonScene";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Signhify" },
      {
        name: "description",
        content:
          "Browse, buy and ship templates, AI agents, components and workflows from Signhify and partner studios.",
      },
      { property: "og:title", content: "Marketplace — Signhify" },
      {
        property: "og:description",
        content:
          "Templates, AI agents, components and workflows — one marketplace from Signhify.",
      },
      { property: "og:url", content: "https://signhify.online/marketplace" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/marketplace" }],
  }),
  component: () => (
    <ComingSoonScene
      eyebrow="Marketplace"
      title="Templates. Agents. Components. Workflows."
      subdomain="marketplace.signhify.online"
      description="One marketplace for everything you'd otherwise rebuild — production templates, plug-in AI agents, design system components and end-to-end workflows."
      week="Week 3 · June 15–21"
      bullets={[
        "Template store — SaaS, landing, CRM, dashboards",
        "Agent store — drop-in AI agents with clear pricing",
        "Component store — design system primitives",
        "Workflow store — automations wired to your stack",
      ]}
    />
  ),
});
