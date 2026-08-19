import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { WhatsAppFab } from "../components/WhatsAppFab";
import { Toaster } from "../components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-7xl font-black text-gradient">404</div>
        <h2 className="mt-4 text-xl font-semibold">Lost in the ecosystem</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          That page hasn&rsquo;t been built yet. Head back to the home base.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Something glitched.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Try again or head home — we&rsquo;ve logged it.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-surface"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Signhify — AI-Powered Product Studio" },
      {
        name: "description",
        content:
          "Signhify is an AI-powered product studio. Describe your idea — we design, engineer, automate, market, launch and scale it end-to-end. SaaS, AI agents, automation, digital & performance marketing.",
      },
      { name: "author", content: "Signhify · Piyush Raj Singh" },
      { name: "theme-color", content: "#FF6B00" },
      {
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      },
      { name: "googlebot", content: "index, follow" },
      { name: "google-site-verification", content: "zBCOZpU_7xXpa0fRYixneNtYTIcQ9mFLXMooYm00fdE" },
      { name: "application-name", content: "Signhify" },
      { name: "generator", content: "TanStack Start" },
      {
        name: "keywords",
        content:
          "AI engineering studio, SaaS development, AI product development, AI product studio, AI development, SaaS builder, AI agents, automation, Signhify, prompt to product, AI engineering, web development studio, Piyush Raj Singh",
      },
      { property: "og:site_name", content: "Signhify" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://signhify.dpdns.org" },
      { property: "og:title", content: "Signhify — AI-Powered Product Studio" },
      {
        property: "og:description",
        content:
          "Describe your idea — Signhify designs, engineers, and ships AI-first SaaS, automation and growth systems end-to-end.",
      },
      {
        property: "og:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp",
      },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Signhify — AI-Powered Product Studio" },
      {
        name: "twitter:description",
        content:
          "Describe your idea — Signhify designs, engineers, and ships AI-first SaaS, automation and growth systems end-to-end.",
      },
      {
        name: "twitter:image",
        content:
          "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "shortcut icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "preconnect", href: "https://supabase.co" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://supabase.co" },
      { rel: "alternate", hrefLang: "x-default", href: "https://signhify.dpdns.org" },
      { rel: "alternate", hrefLang: "en-US", href: "https://signhify.dpdns.org" },
      { rel: "alternate", hrefLang: "en-IN", href: "https://signhify.dpdns.org" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Signhify",
          legalName: "Signhify AI Engineering Studio",
          alternateName: [
            "Signhify AI Studio",
            "Signhify Studio",
            "Signhify AI",
            "Signhify Engineering Studio",
          ],
          identifier: "UDYAM-UP-30-0081308",
          url: "https://signhify.dpdns.org",
          logo: "https://signhify.dpdns.org/favicon.ico",
          description:
            "Registered MSME AI engineering studio building AI-first SaaS, automation systems, and growth engines end-to-end.",
          disambiguatingDescription:
            "Signhify AI Studio is a full-stack AI software product studio and SaaS engineering platform. It is not affiliated with AI music applications.",
          foundingDate: "2025",
          numberOfEmployees: { "@type": "QuantitativeValue", minValue: 1, maxValue: 10 },
          founder: {
            "@type": "Person",
            name: "Piyush Raj Singh",
            jobTitle: "Founder & Lead AI Engineer",
            email: "Piyushrajsingh092@gmail.com",
            sameAs: [
              "https://github.com/Warriorlegacy",
              "https://linkedin.com/in/piyushraj-singh",
              "https://instagram.com/piyushrajsingh.golu",
            ],
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
          location: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Noida",
              addressRegion: "Uttar Pradesh",
              addressCountry: "IN",
            },
            name: "Signhify AI Studio, Noida",
          },
          areaServed: ["United States", "North America", "Worldwide"],
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Monday",
              opens: "09:00",
              closes: "18:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Tuesday",
              opens: "09:00",
              closes: "18:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Wednesday",
              opens: "09:00",
              closes: "18:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Thursday",
              opens: "09:00",
              closes: "18:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Friday",
              opens: "09:00",
              closes: "18:00",
            },
          ],
          contactPoint: {
            "@type": "ContactPoint",
            email: "Piyushrajsingh092@gmail.com",
            telephone: "+91-6202442690",
            contactType: "customer service",
            availableLanguage: ["English", "Hindi"],
          },
          sameAs: [
              "https://github.com/Warriorlegacy",
              "https://linkedin.com/in/piyushraj-singh",
              "https://instagram.com/piyushrajsingh.golu",
            ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Signhify",
          url: "https://signhify.dpdns.org",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://signhify.dpdns.org/projects?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Signhify AI Studio",
          url: "https://signhify.dpdns.org",
          description:
            "Registered MSME AI product studio that designs, engineers, and ships SaaS, AI agents, automation and growth systems end-to-end.",
          priceRange: "$$",
          founder: { "@type": "Person", name: "Piyush Raj Singh" },
          areaServed: "Worldwide",
          serviceType: [
            "AI Development",
            "SaaS Development",
            "Web Application Development",
            "AI Agent Development",
            "Automation Systems",
            "Digital & Performance Marketing",
          ],
          knowsAbout: [
            "Artificial Intelligence",
            "Machine Learning",
            "AI engineering",
            "vibe coding",
            "digital marketing studio",
            "SaaS development",
            "AI agent development",
            "SaaS",
            "Web Development",
            "React",
            "Node.js",
            "Supabase",
            "Cloudflare",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Signhify AI Studio",
          url: "https://signhify.dpdns.org",
          description:
            "AI-powered product studio platform for building and shipping SaaS, AI agents, and digital products end-to-end.",
          operatingSystem: "Web",
          applicationCategory: "BusinessApplication",
          offers: {
            "@type": "Offer",
            price: "150000",
            priceCurrency: "INR",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Signhify AI Engineering & Digital Marketing Services",
          url: "https://signhify.dpdns.org/services",
          description:
            "End-to-end AI engineering, vibe coding, SaaS development, AI agent automation, and digital marketing services for AI-native brands.",
          provider: {
            "@type": "Organization",
            name: "Signhify",
            url: "https://signhify.dpdns.org",
          },
          serviceType: [
            "AI Engineering",
            "Vibe Coding",
            "SaaS Development",
            "AI Agent Development",
            "Digital Marketing",
            "Cloud Infrastructure",
          ],
          areaServed: "Worldwide",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Corporation",
          name: "Signhify",
          legalName: "Signhify AI Engineering Studio",
          alternateName: [
            "Signhify AI Studio",
            "Signhify Studio",
            "Signhify AI",
            "Signhify Engineering Studio",
          ],
          identifier: "UDYAM-UP-30-0081308",
          url: "https://signhify.dpdns.org",
          logo: "https://signhify.dpdns.org/favicon.ico",
          description:
            "Registered MSME AI engineering studio building AI-first SaaS, automation systems, and growth engines end-to-end.",
          foundingDate: "2024",
          founder: {
            "@type": "Person",
            name: "Piyush Raj Singh",
            jobTitle: "Founder & Lead AI Engineer",
            email: "Piyushrajsingh092@gmail.com",
            sameAs: [
              "https://github.com/Warriorlegacy",
              "https://linkedin.com/in/piyushraj-singh",
              "https://instagram.com/piyushrajsingh.golu",
            ],
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Noida",
            addressRegion: "Uttar Pradesh",
            addressCountry: "IN",
          },
          contactPoint: {
            "@type": "ContactPoint",
            email: "Piyushrajsingh092@gmail.com",
            telephone: "+91-6202442690",
            contactType: "customer service",
            availableLanguage: ["English", "Hindi"],
          },
          sameAs: [
            "https://github.com/Warriorlegacy",
            "https://linkedin.com/in/piyushraj-singh",
            "https://x.com/Warriorlegacy",
            "https://instagram.com/piyushrajsingh.golu",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          name: "Signhify AI Engineering Studio",
          alternateName: "Signhify AI Studio",
          image:
            "https://storage.googleapis.com/gpt-engineer-file-uploads/z9pHpNWd9MUTo6M3fEIu8Itwhu83/social-images/social-1780607616175-ChatGPT_Image_Jun_5,_2026,_02_40_45_AM.webp",
          description:
            "AI-powered product studio. Describe your idea in plain English — our 6-agent autonomous swarm designs, engineers, tests, secures, and deploys it. Production SaaS in 2 weeks.",
          brand: {
            "@type": "Brand",
            name: "Signhify",
          },
          manufacturer: {
            "@type": "Corporation",
            name: "Signhify",
            identifier: "UDYAM-UP-30-0081308",
          },
          offers: [
            {
              "@type": "Offer",
              name: "Sprint",
              description:
                "Production MVP in 5-7 days. Core UI, Supabase backend, custom domain, GitHub transfer.",
              price: "299",
              priceCurrency: "USD",
              priceValidUntil: "2027-12-31",
              availability: "https://schema.org/OnlineOnly",
              url: "https://signhify.dpdns.org/pricing",
            },
            {
              "@type": "Offer",
              name: "Studio",
              description:
                "Full SaaS platform with AI integrations, BYOK vault, Stripe billing, 30-day support.",
              price: "799",
              priceCurrency: "USD",
              priceValidUntil: "2027-12-31",
              availability: "https://schema.org/OnlineOnly",
              url: "https://signhify.dpdns.org/pricing",
            },
            {
              "@type": "Offer",
              name: "Platform",
              description:
                "Custom enterprise — multi-agent orchestration, LLM fine-tuning, SOC2 readiness, SLA.",
              price: "2499",
              priceCurrency: "USD",
              priceValidUntil: "2027-12-31",
              availability: "https://schema.org/OnlineOnly",
              url: "https://signhify.dpdns.org/pricing",
            },
          ],
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            bestRating: "5",
            ratingCount: "22",
            reviewCount: "22",
          },
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          featureList: [
            "6-agent autonomous AI swarm",
            "BYOK AES-256 GCM encryption",
            "2-week production delivery",
            "100% code ownership",
            "Stripe payment integration",
            "Supabase auth and database",
            "Cloudflare deployment",
            "AI agent orchestration pipeline",
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Signhify AI Engineering & Digital Marketing Services",
          description:
            "End-to-end AI-first product execution: 12 engineering capabilities from one studio.",
          url: "https://signhify.dpdns.org/services",
          numberOfItems: 12,
          itemListElement: [
            {
              "@type": "Service",
              name: "AI Automation",
              position: 1,
              description: "Workflow automation, AI pipelines, custom agent chains",
            },
            {
              "@type": "Service",
              name: "SaaS Development",
              position: 2,
              description: "Full-stack subscription platforms with billing, auth, analytics",
            },
            {
              "@type": "Service",
              name: "Web and Product Design",
              position: 3,
              description: "UI/UX, brand identity, conversion-optimized design systems",
            },
            {
              "@type": "Service",
              name: "CRM Systems",
              position: 4,
              description: "Customer relationship platforms, pipeline management, automation",
            },
            {
              "@type": "Service",
              name: "Digital & Performance Marketing",
              position: 5,
              description: "Paid ads, SEO, CRO, attribution, email automation",
            },
            {
              "@type": "Service",
              name: "Brand Identity",
              position: 6,
              description: "Logo, visual identity, brand guidelines, positioning",
            },
            {
              "@type": "Service",
              name: "API Engineering",
              position: 7,
              description: "REST/GraphQL APIs, webhooks, third-party integrations",
            },
            {
              "@type": "Service",
              name: "Cloud & DevOps",
              position: 8,
              description: "Cloudflare, AWS, Docker, CI/CD, monitoring",
            },
            {
              "@type": "Service",
              name: "Data & Analytics",
              position: 9,
              description: "Dashboards, reporting, data pipelines, BI systems",
            },
            {
              "@type": "Service",
              name: "Mobile App Development",
              position: 10,
              description: "Responsive web apps, PWA, mobile-first design",
            },
            {
              "@type": "Service",
              name: "Security & Compliance",
              position: 11,
              description: "BYOK encryption, SOC2 readiness, audit logging",
            },
            {
              "@type": "Service",
              name: "AI & LLM Integrations",
              position: 12,
              description: "Custom GPTs, RAG pipelines, model fine-tuning, agent orchestration",
            },
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
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  return (
    <QueryClientProvider client={queryClient}>
      {!isLanding && <SiteHeader />}
      <main className="min-h-screen">
        <Outlet />
      </main>
      {!isLanding && <SiteFooter />}
      {!isLanding && <WhatsAppFab />}
      <Toaster />
    </QueryClientProvider>
  );
}
