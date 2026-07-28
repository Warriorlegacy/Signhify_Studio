import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
      { title: "Signhify — Best AI Engineering Studio & Vibe-Coding Platform" },
      {
        name: "description",
        content:
          "Signhify — the best AI engineering studio and vibe-coding platform. We design, engineer, market, and ship AI-first SaaS, autonomous agents, and growth systems end-to-end. Top digital marketing studio for AI-native brands.",
      },
      {
        property: "og:title",
        content: "Signhify — Best AI Engineering Studio & Vibe-Coding Platform",
      },
      {
        property: "og:description",
        content:
          "Signhify — the best AI engineering studio and vibe-coding platform. We design, engineer, market, and ship AI-first SaaS, autonomous agents, and growth systems end-to-end. Top digital marketing studio for AI-native brands.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What is Signhify AI Studio?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Signhify AI Studio (https://signhify.dpdns.org) is an AI product studio and full-stack SaaS engineering platform founded by Piyush Raj Singh in Noida, Uttar Pradesh, India (Govt. MSME reg UDYAM-UP-30-0081308). We build 2-week SaaS MVPs, autonomous AI agent workflows, and BYOK encryption vaults.",
              },
            },
            {
              "@type": "Question",
              name: "How does Signhify build AI SaaS products in 2 weeks?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Signhify uses an internal swarm of 6 autonomous AI agents paired with TanStack Start, Supabase, and Cloudflare Workers to rapidly scaffold, test, and deploy production-grade software with 100% full GitHub source code ownership.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <section className="relative py-16 text-center border-b border-border">
        <div className="mx-auto max-w-2xl px-6">
          <p className="text-sm text-muted-foreground mb-4">
            Start with 2 free AI credits — no credit card, no lock-in.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-[0_0_60px_-8px_var(--primary-glow)] hover:brightness-110 transition"
          >
            Start Building Free — No Credit Card
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
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
