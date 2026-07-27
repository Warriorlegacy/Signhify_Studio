import { createFileRoute } from "@tanstack/react-router";
import { EcosystemSection } from "@/components/sections/EcosystemSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/vision")({
  head: () => ({
    meta: [
      { title: "Signhify Vision 2030 — Building the AI Ecosystem" },
      {
        name: "description",
        content:
          "Explore Signhify's Vision 2030 — building the premier AI product ecosystem, from prompt-to-product studio to AI Cloud and autonomous OS.",
      },
      { property: "og:title", content: "Signhify Vision 2030 — Building the AI Ecosystem" },
      {
        property: "og:description",
        content: "Studio · AI · Deploy · Marketplace · Cloud · OS. Built in public by Signhify.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/vision" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/vision" }],
  }),
  component: VisionPage,
});

function VisionPage() {
  return (
    <>
      <section className="pt-36 pb-6">
        <div className="mx-auto max-w-7xl px-6">
          <Breadcrumbs items={[{ label: "Vision", to: "/vision" }]} />
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Vision 2030</div>
          <h1 className="font-display text-5xl sm:text-6xl font-black max-w-4xl">
            From a studio to an <span className="text-gradient">ecosystem</span>.
          </h1>
          <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
            We&rsquo;re building Signhify in the open — six layers, one mission: turn any idea into
            a deployed AI product.
          </p>
        </div>
      </section>
      <EcosystemSection />
      <CtaSection />
    </>
  );
}
