import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SignhifyLogo } from "@/components/SignhifyLogo";

const FOOTER_COLS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/services" },
      { label: "3D Builder", to: "/scroll-studio" },
      { label: "Presets", to: "/templates" },
      { label: "Pricing", to: "/pricing" },
      { label: "Changelog", to: "/roadmap" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Blog", to: "/insights" },
      { label: "Affiliate", to: "/affiliate" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", to: "/help" },
      { label: "Customization Guide", to: "/help" },
      { label: "SEO Best Practices", to: "/os" },
      { label: "API Reference", to: "/os" },
      { label: "MCP Server", to: "/os" },
      { label: "Help Center", to: "/help" },
      { label: "Signhify Engine", to: "/scroll-studio" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
      { label: "Cancellation & Refund", to: "/terms" },
      { label: "Cookies", to: "/privacy" },
      { label: "DPA", to: "/privacy" },
    ],
  },
];

const XIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z" />
  </svg>
);
const LinkedInIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z" />
  </svg>
);
const InstagramIcon = (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const SOCIALS = [
  { label: "Twitter", href: "https://x.com/Piyush_Sxt", icon: XIcon },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/piyushraj-singh",
    icon: LinkedInIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/piyushrajsingh.golu",
    icon: InstagramIcon,
  },
  { label: "Email", href: "mailto:piyushrajsingh092@gmail.com", icon: <Mail size={13} /> },
];

export function LandingFooter() {
  const [cookiesDismissed, setCookiesDismissed] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("signhify-cookies") === "1",
  );
  const dismissCookies = () => {
    localStorage.setItem("signhify-cookies", "1");
    setCookiesDismissed(true);
  };

  return (
    <>
      <footer
        id="contact"
        className="relative border-t border-white/[0.04] bg-[rgba(3,7,18,0.90)] backdrop-blur-2xl pt-[72px] pb-8"
      >
        <div className="max-w-6xl mx-auto px-6 mb-16">
          <div className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md p-8 md:p-12 overflow-hidden">
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#22c55e]/12 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-[#4ade80]/10 rounded-full blur-[100px] pointer-events-none translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                  Ready to build something cinematic?
                </h3>
                <p className="text-white/50 text-[14px] max-w-md">
                  Start from a preset or describe your vision. Ship a production website in minutes.
                </p>
              </div>
              <Link
                to="/signup"
                search={{ redirect: "/app/billing" }}
                className="btn-moonlit agent-glass-shine shrink-0 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-[15px] text-[14px] font-bold"
              >
                Start Building Free
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_repeat(4,1fr)] gap-12">
            <div>
              <Link to="/" className="flex items-center gap-2.5 mb-3.5">
                <SignhifyLogo size={28} />
                <span className="font-display font-extrabold text-[17px] tracking-tight uppercase text-white/90">
                  SIGNHIFY
                </span>
              </Link>
              <p className="text-[13px] text-white/50 leading-relaxed max-w-[300px] mb-5">
                3D Website Builder for cinematic scroll experiences — generated from a single
                prompt.
              </p>
              <div className="flex gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-[10px] bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/[0.08] hover:border-[#22c55e]/40 transition-all duration-300"
                  >
                    {s.icon}
                    <span className="sr-only">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.18em] mb-3.5 font-mono">
                  {col.title}
                </h4>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-[13px] text-white/40 hover:text-[#4ade80] transition-colors duration-200"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-16 pt-6 border-t border-white/[0.04] flex items-center justify-between flex-wrap gap-4">
            <span className="font-mono text-[11px] text-white/40">
              © 2026 Signhify. All rights reserved. · support@signhify.business
            </span>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] text-white/40">
              <Link to="/privacy" className="hover:text-white/60 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white/60 transition-colors">
                Terms
              </Link>
              <Link to="/terms" className="hover:text-white/60 transition-colors">
                Cancellation &amp; Refund
              </Link>
              <span className="hidden sm:inline text-white/15">|</span>
              <span className="flex items-center gap-1.5">
                <span>Built in India</span>
                <span
                  className="inline-block relative w-[18px] h-[12px] rounded-[2px] overflow-hidden"
                  aria-hidden
                >
                  <span className="absolute inset-x-0 top-0 h-[4px] bg-orange-500" />
                  <span className="absolute inset-x-0 top-[4px] h-[4px] bg-white" />
                  <span className="absolute inset-x-0 bottom-0 h-[4px] bg-green-600" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full border border-blue-800" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {!cookiesDismissed && (
        <div className="fixed bottom-0 inset-x-0 z-[9999] p-4 pointer-events-none">
          <div className="pointer-events-auto mx-auto max-w-lg rounded-2xl border border-white/[0.1] bg-[#080c16]/95 backdrop-blur-xl shadow-[0_-8px_40px_rgba(0,0,0,0.7)] px-5 py-4 animate-[slideUp_0.4s_ease-out]">
            <p className="text-[13px] leading-relaxed text-white/60">
              We use cookies for authentication, analytics, and to improve your experience.{" "}
              <Link
                to="/privacy"
                className="text-[#4ade80] underline underline-offset-2 hover:text-white"
              >
                Cookie Policy
              </Link>
            </p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={dismissCookies}
                className="rounded-lg border border-white/20 bg-white/[0.08] px-4 py-2 text-[12px] font-semibold text-white/70 hover:bg-white/[0.13] transition-colors"
              >
                Essential only
              </button>
              <button
                onClick={dismissCookies}
                className="rounded-lg bg-[#22c55e] px-4 py-2 text-[12px] font-bold text-black hover:bg-[#4ade80] transition-colors"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
