import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  MapPin,
  FileCode,
  Cpu,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "Signhify AI Studio — Official Brand Entity & Identity" },
      {
        name: "description",
        content:
          "Official brand entity page for Signhify AI Studio (https://signhify.dpdns.org). Founded by Piyush Raj Singh, registered MSME UDYAM-UP-30-0081308 in Noida, India.",
      },
      { property: "og:title", content: "Signhify AI Studio — Official Brand Entity & Identity" },
      {
        property: "og:description",
        content:
          "Signhify AI Studio is an AI product studio and SaaS engineering platform building 2-week MVPs and autonomous AI agent workflows.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/brand" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/brand" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Brand",
          name: "Signhify",
          alternateName: [
            "Signhify AI Studio",
            "Signhify Studio",
            "Signhify AI",
            "Signhify Engineering Studio",
          ],
          url: "https://signhify.dpdns.org",
          logo: "https://signhify.dpdns.org/favicon.ico",
          description:
            "Signhify AI Studio is an AI product studio and full-stack SaaS engineering platform founded by Piyush Raj Singh in Noida, India (Govt. MSME UDYAM-UP-30-0081308).",
          sameAs: [
            "https://github.com/Warriorlegacy/Signhify_Studio",
            "https://github.com/Warriorlegacy",
            "https://linkedin.com/in/piyushraj-singh",
          ],
        }),
      },
    ],
  }),
  component: BrandEntityPage,
});

function BrandEntityPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ label: "Brand", to: "/brand" }]} />

        <div className="text-center my-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
            <Sparkles size={13} /> Official Brand Entity & Disambiguation
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Signhify AI Studio</h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Official entity verification for <strong>Signhify AI Studio</strong>{" "}
            (`https://signhify.dpdns.org`), the AI product studio & SaaS engineering platform
            founded by Piyush Raj Singh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
          <div className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <Building2 size={20} className="text-primary" /> Corporate Entity Details
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <li>
                <strong>Brand Name:</strong> Signhify (Signhify AI Studio)
              </li>
              <li>
                <strong>Legal Reg:</strong> Govt. of India MSME (`UDYAM-UP-30-0081308`)
              </li>
              <li>
                <strong>Founder & Lead Engineer:</strong> Piyush Raj Singh
              </li>
              <li>
                <strong>Headquarters:</strong> Noida, Uttar Pradesh 201301, India
              </li>
              <li>
                <strong>Official Website:</strong>{" "}
                <a href="https://signhify.dpdns.org" className="text-primary underline">
                  https://signhify.dpdns.org
                </a>
              </li>
              <li>
                <strong>GitHub Repository:</strong>{" "}
                <a
                  href="https://github.com/Warriorlegacy/Signhify_Studio"
                  className="text-primary underline"
                >
                  Warriorlegacy/Signhify_Studio (Public)
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface/50 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <Cpu size={20} className="text-primary" /> Core Technical Offerings
            </div>
            <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed">
              <li>
                <strong>2-Week SaaS Sprints:</strong> Full-stack MVP development ($299 / $799)
              </li>
              <li>
                <strong>BYOK Security Vault:</strong> AES-256 GCM client-side encryption
              </li>
              <li>
                <strong>AI Agent Swarm:</strong> 6 autonomous agents for auto-generating code &
                schemas
              </li>
              <li>
                <strong>Tech Stack:</strong> TanStack Start, React 19, Supabase, Cloudflare, Nitro
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center my-12">
          <ShieldCheck className="mx-auto h-8 w-8 text-primary mb-3" />
          <h2 className="text-2xl font-bold">Search Disambiguation Notice</h2>
          <p className="mt-2 text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
            <strong>Signhify AI Studio</strong> is an AI software engineering firm & product studio.
            It is distinct from music generation applications. For official engineering briefs,
            consult our live site at{" "}
            <a href="https://signhify.dpdns.org" className="text-primary underline">
              signhify.dpdns.org
            </a>
            .
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:brightness-110 transition"
          >
            Start an AI Engineering Sprint <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
