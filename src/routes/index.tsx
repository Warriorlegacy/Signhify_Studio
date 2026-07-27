import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeStack } from "@/components/sections/MarqueeStack";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ScrollStorySection } from "@/components/sections/ScrollStorySection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Signhify — AI Product Studio & Full Stack SaaS Engineering" },
      {
        name: "description",
        content:
          "Describe your idea — Signhify designs, engineers, markets, and ships AI-first SaaS apps, autonomous AI agents, and growth systems end-to-end.",
      },
      { property: "og:title", content: "Signhify — AI Product Studio & Full Stack SaaS Engineering" },
      {
        property: "og:description",
        content:
          "Describe your idea — Signhify designs, engineers, markets, and ships AI-first SaaS apps, autonomous AI agents, and growth systems end-to-end.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <MarqueeStack />
      <ProjectsSection limit={6} />
      <ServicesSection />
      <ProcessSection />
      <ScrollStorySection />
      <EcosystemSection />
      <FounderSection />
      <CtaSection />
    </>
  );
}
