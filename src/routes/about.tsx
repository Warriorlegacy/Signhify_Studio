import { createFileRoute } from "@tanstack/react-router";
import { FounderSection } from "@/components/sections/FounderSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { BadgeCheck, MapPin, Rocket } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Signhify & Founder Piyush Raj Singh — AI Studio" },
      {
        name: "description",
        content:
          "Learn about Signhify, an AI product engineering studio founded by Piyush Raj Singh. Registered MSME, Govt. of India. Building software for global founders.",
      },
      { property: "og:title", content: "About Signhify & Founder Piyush Raj Singh — AI Studio" },
      {
        property: "og:description",
        content:
          "Founded by Piyush Raj Singh. AI-native studio, registered MSME (UDYAM-UP-30-0081308), building software for global founders.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/about" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Signhify & Founder Piyush Raj Singh — AI Studio",
          url: "https://signhify.dpdns.org/about",
          mainEntity: {
            "@type": "Person",
            name: "Piyush Raj Singh",
            jobTitle: "Founder & Lead AI Engineer",
            worksFor: {
              "@type": "Organization",
              name: "Signhify",
              identifier: "UDYAM-UP-30-0081308",
            },
            sameAs: [
              "https://github.com/Warriorlegacy",
              "https://linkedin.com/in/piyushraj-singh",
              "https://instagram.com/piyushrajsingh.golu",
            ],
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Signhify AI Product Studio",
          url: "https://signhify.dpdns.org",
          telephone: "+91-6202442690",
          email: "Piyushrajsingh092@gmail.com",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "28.5355",
            longitude: "77.3910",
          },
          areaServed: ["India", "United States", "United Kingdom", "Worldwide"],
          knowsAbout: [
            "AI SaaS Development",
            "Autonomous AI Agents",
            "Full Stack Web Development",
            "Performance Marketing",
          ],
        }),
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-5xl px-6">
          <Breadcrumbs items={[{ label: "About", to: "/about" }]} />
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">About</div>
          <h1 className="font-display text-5xl sm:text-6xl font-black leading-[1.05]">
            A studio for the <span className="text-gradient">AI-native</span> era.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Signhify is the front door of a future AI product ecosystem. Today, we&rsquo;re a
            premium AI engineering studio shipping software for ambitious founders. Tomorrow,
            we&rsquo;re the platform that turns any idea into a deployed AI product — designed,
            built and operated end-to-end.
          </p>

          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {[
              { icon: Rocket, k: "14+", v: "Shipped products" },
              { icon: BadgeCheck, k: "MSME", v: "Registered with Govt. of India (UDYAM)" },
              { icon: MapPin, k: "India → World", v: "Remote-first, globally scoped" },
            ].map((s) => (
              <div key={s.v} className="rounded-2xl border border-border bg-card p-6">
                <s.icon size={20} className="text-primary" />
                <div className="mt-4 font-display text-3xl font-bold text-gradient">{s.k}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FounderSection />
      <CtaSection />
    </>
  );
}
