import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/os")({
  head: () => ({
    meta: [
      { title: "OS — Signhify" },
      {
        name: "description",
        content:
          "Signhify OS - Agent orchestration runtime. Monitor and manage AI agents, workflows, and system performance.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/os" },
      { property: "og:title", content: "OS — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/os" }],
  }),
  component: () => <Outlet />,
});
