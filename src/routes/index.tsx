import { createFileRoute } from "@tanstack/react-router";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingSections } from "@/components/landing/LandingSections";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Signhify — AI 3D Website Builder: Cinematic Scroll Websites from a Single Prompt" },
      {
        name: "description",
        content:
          "Build cinematic 3D websites from a single prompt — about 10× faster. AI motion, frame extraction, and production HTML in minutes.",
      },
      {
        name: "keywords",
        content:
          "3D website builder,AI website builder,cinematic website,scroll website,Signhify,motion website",
      },
      { property: "og:title", content: "Signhify — 3D Website Builder" },
      {
        property: "og:description",
        content:
          "Build cinematic 3D websites from a single prompt — about 10× faster. AI motion, frame extraction, and production HTML in minutes.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/" },
      { name: "theme-color", content: "#030712" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-[#030712] relative overflow-x-hidden text-white">
      <div className="bg-grid-global" />
      <div className="bg-lines" />
      <div className="bg-dots" />
      <div className="bg-vignette" />
      <div className="bg-noise" />
      <div className="relative z-10">
        <h1 className="sr-only">
          Signhify — AI 3D Website Builder: Cinematic Scroll Websites from a Single Prompt
        </h1>
        <LandingHero />
        <LandingSections />
        <LandingFooter />
      </div>
    </div>
  );
}
