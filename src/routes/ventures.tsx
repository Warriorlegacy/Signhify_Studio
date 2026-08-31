import { createFileRoute } from "@tanstack/react-router";
import { VenturesShowcase } from "@/components/VenturesShowcase";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaSection } from "@/components/sections/CtaSection";
import { FLEET_VENTURES } from "@/data/ventures";

export const Route = createFileRoute("/ventures")({
  head: () => ({
    meta: [
      { title: "Signhify Venture Lab — 10 Production AI SaaS Platforms" },
      {
        name: "description",
        content:
          "Explore 10 enterprise-grade AI SaaS ventures engineered and shipped by Signhify Studio. Pure client-side compute, WebAssembly, DuckDB-WASM, and 3D scroll experiences.",
      },
      { property: "og:title", content: "Signhify AI Venture Lab — Production AI Platforms" },
      {
        property: "og:description",
        content:
          "Portfolio of 10 autonomous, in-browser AI SaaS platforms engineered and shipped by Signhify Studio.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/ventures" },
      { name: "theme-color", content: "#030712" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/ventures" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Signhify AI Venture Lab — Production AI Platforms",
          description:
            "Portfolio of 10 autonomous, in-browser AI SaaS platforms engineered and shipped by Signhify Studio.",
          url: "https://signhify.dpdns.org/ventures",
          numberOfItems: FLEET_VENTURES.length,
          itemListElement: FLEET_VENTURES.map((v, index) => ({
            "@type": "SoftwareApplication",
            position: index + 1,
            name: v.name,
            applicationCategory:
              v.category === "HealthTech"
                ? "MedicalApplication"
                : v.category === "LegalTech"
                  ? "LegalApplication"
                  : v.category === "DevOps"
                    ? "DeveloperApplication"
                    : v.category === "MarTech"
                      ? "MarketingApplication"
                      : v.category === "QualityAI"
                        ? "IndustrialApplication"
                        : v.category === "HRTech"
                          ? "HRApplication"
                          : v.category === "BigData"
                            ? "AnalyticsApplication"
                            : v.category === "Media"
                              ? "MultimediaApplication"
                              : "BusinessApplication",
            operatingSystem: "Web Browser",
            url: v.liveUrl,
          })),
        }),
      },
    ],
  }),
  component: VenturesPage,
});

function VenturesPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white pt-32 pb-16 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="bg-grid-global pointer-events-none -z-10" />
      <div className="bg-lines pointer-events-none -z-10" />
      <div className="bg-dots pointer-events-none -z-10" />
      <div className="bg-vignette pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 mb-6">
        <Breadcrumbs items={[{ label: "Ventures", to: "/ventures" }]} />
      </div>

      <VenturesShowcase showTitle={true} />

      <div className="mt-16">
        <CtaSection />
      </div>
    </div>
  );
}
