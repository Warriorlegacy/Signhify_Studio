import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeStack } from "@/components/sections/MarqueeStack";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ScrollStorySection } from "@/components/sections/ScrollStorySection";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { FounderSection } from "@/components/sections/FounderSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Signhify — AI Engineering Studio" },
      {
        name: "description",
        content:
          "Describe your idea. Signhify builds it. We design, engineer and ship AI-first SaaS, automation and growth systems end-to-end.",
      },
      { property: "og:title", content: "Signhify — AI Engineering Studio" },
      {
        property: "og:description",
        content: "Describe your idea. Signhify builds it.",
      },
    ],
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
      <ScrollStorySection />
      <EcosystemSection />
      <FounderSection />
      <CtaSection />
    </>
  );
}
