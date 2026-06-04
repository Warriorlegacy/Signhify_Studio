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
      { title: "Signhify — Describe your idea. We build it." },
      {
        name: "description",
        content:
          "Describe your idea. Signhify builds it. We design, engineer and ship AI-first SaaS, automation and growth systems end-to-end.",
      },
      { property: "og:title", content: "Signhify — Describe your idea. We build it." },
      {
        property: "og:description",
        content: "Describe your idea. Signhify builds it.",
      },
      { property: "og:url", content: "https://signhify.online/" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/" }],
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
