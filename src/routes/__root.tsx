import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
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
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { name: "googlebot", content: "index, follow" },
      { name: "google-site-verification", content: "zBCOZpU_7xXpa0fRYixneNtYTIcQ9mFLXMooYm00fdE" },
      { name: "application-name", content: "Signhify" },
      { name: "generator", content: "TanStack Start" },
      { name: "keywords", content: "AI product studio, AI development, SaaS builder, AI agents, automation, Signhify, prompt to product, AI engineering, web development studio, Piyush Raj Singh" },
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "preconnect", href: "https://supabase.co" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
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
          founder: {
            "@type": "Person",
            name: "Piyush Raj Singh",
            jobTitle: "Founder & Lead AI Engineer",
            email: "Piyushrajsingh092@gmail.com",
            sameAs: [
              "https://github.com/Warriorlegacy",
              "https://linkedin.com/in/piyushraj-singh",
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
            "SaaS",
            "Web Development",
            "React",
            "Node.js",
            "Supabase",
            "Cloudflare",
          ],
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
  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFab />
      <Toaster />
    </QueryClientProvider>
  );
}
