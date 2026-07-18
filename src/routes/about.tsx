import { createFileRoute } from "@tanstack/react-router";
import { FounderSection } from "@/components/sections/FounderSection";
import { CtaSection } from "@/components/sections/CtaSection";
import { BadgeCheck, MapPin, Rocket } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Signhify" },
      {
        name: "description",
        content:
          "Signhify is an AI engineering studio founded by Piyush Raj Singh. Registered MSME, Govt. of India. Building the AI product ecosystem from India to the world.",
      },
      { property: "og:title", content: "About — Signhify" },
      {
        property: "og:description",
        content:
          "Founded by Piyush Raj Singh. AI-native studio, registered MSME, building in the open.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/about" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-5xl px-6">
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
