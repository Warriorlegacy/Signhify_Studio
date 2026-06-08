import { createFileRoute } from "@tanstack/react-router";
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
        content: "Six capabilities, one team. End-to-end AI-first product execution.",
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
            "Brand",
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
      <section className="pt-36 pb-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Services</div>
          <h1 className="font-display text-5xl sm:text-6xl font-black max-w-4xl">
            One studio. <span className="text-gradient">End-to-end</span> execution.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
            We don&rsquo;t hand off deliverables — we ship outcomes. From idea, through design, into
            production and beyond.
          </p>
        </div>
      </section>
      <ServicesSection />
      <ProcessSection />
      <CtaSection />
    </>
  );
}
