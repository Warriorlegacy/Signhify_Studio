import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      {
        title: "AI Engineering & Digital Marketing Services — Signhify",
      },
      {
        name: "description",
        content:
          "Signhify provides full-stack AI engineering & digital marketing: SaaS MVPs, AI agents, vibe coding, cloud systems, and growth engineering.",
      },
      { property: "og:title", content: "AI Engineering & SaaS Development Services — Signhify" },
      {
        property: "og:description",
        content:
          "Twelve engineering capabilities, one team. Custom SaaS development, AI agents, cloud systems, and growth engineering.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/services" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Signhify AI Engineering Services",
          description:
            "End-to-end AI-first product execution: design, engineering, automation and launch.",
          url: "https://signhify.dpdns.org/services",
          numberOfItems: 12,
          itemListElement: [
            { "@type": "Service", name: "AI Automation", position: 1 },
            { "@type": "Service", name: "SaaS Development", position: 2 },
            { "@type": "Service", name: "Web and Product Design", position: 3 },
            { "@type": "Service", name: "CRM Systems", position: 4 },
            { "@type": "Service", name: "Digital & Performance Marketing", position: 5 },
            { "@type": "Service", name: "Brand Identity", position: 6 },
            { "@type": "Service", name: "API Engineering", position: 7 },
            { "@type": "Service", name: "Cloud & DevOps", position: 8 },
            { "@type": "Service", name: "Data & Analytics", position: 9 },
            { "@type": "Service", name: "Mobile App Development", position: 10 },
            { "@type": "Service", name: "Security & Compliance", position: 11 },
            { "@type": "Service", name: "AI & LLM Integrations", position: 12 },
          ],
          provider: {
            "@type": "Organization",
            name: "Signhify",
            url: "https://signhify.dpdns.org",
          },
        }),
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      {/* Immersive page hero */}
      <section className="relative pt-40 pb-4 overflow-hidden">
        {/* Depth background */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, oklch(0.72 0.21 45 / 0.12), transparent 65%)",
          }}
        />
        <div className="absolute inset-0 bg-grid mask-fade-edges opacity-25" aria-hidden />

        <div className="mx-auto max-w-7xl px-6 relative">
          <Breadcrumbs items={[{ label: "Services", to: "/services" }]} />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary mb-4"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
            Services
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-black max-w-4xl leading-none"
          >
            One studio. <span className="text-gradient">End-to-end</span> execution.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-6 max-w-2xl text-muted-foreground text-lg leading-relaxed"
          >
            We don&rsquo;t hand off deliverables — we ship outcomes. From idea, through design, into
            production and beyond. Twelve capabilities. One team. Every build signed.
          </motion.p>
        </div>
      </section>
      <ServicesSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
