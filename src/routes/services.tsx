import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaSection } from "@/components/sections/CtaSection";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Signhify" },
      {
        name: "description",
        content:
          "AI automation, SaaS development, web and product, CRM systems, performance marketing and brand — one studio, end-to-end.",
      },
      { property: "og:title", content: "Services — Signhify" },
      {
        property: "og:description",
        content: "Twelve capabilities, one team. End-to-end AI-first product execution.",
      },
      { property: "og:url", content: "https://signhify.online/services" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Signhify — AI Engineering Studio Services",
          provider: { "@type": "Organization", name: "Signhify", url: "https://signhify.online" },
          url: "https://signhify.online/services",
          serviceType: [
            "AI automation",
            "SaaS development",
            "Web and product design",
            "CRM systems",
            "Performance marketing",
            "Brand identity",
            "API engineering",
            "Cloud & DevOps",
            "Data & Analytics",
            "Mobile app development",
            "Security & compliance",
            "AI & LLM integrations",
          ],
          description:
            "End-to-end AI-first product execution: design, engineering, automation and launch.",
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
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-black max-w-4xl leading-[1.0]"
          >
            One studio.{" "}
            <span className="text-gradient">End-to-end</span> execution.
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
