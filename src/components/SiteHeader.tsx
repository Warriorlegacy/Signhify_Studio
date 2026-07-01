import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import logoAsset from "@/assets/signhify-logo.png.asset.json";
import { EcosystemSwitcher } from "./EcosystemSwitcher";

const NAV = [
  { to: "/", label: "Studio" },
  { to: "/projects", label: "Projects" },
  { to: "/ai", label: "AI", badge: "New" },
  { to: "/marketplace", label: "Market" },
  { to: "/app/deploy", label: "Deploy" },
  { to: "/app", label: "Cloud" },
  { to: "/os", label: "OS" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-4 sm:pt-5 flex items-center justify-between gap-3">
        {/* Logo pill */}
        <Link
          to="/"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/60 backdrop-blur-xl pl-1.5 pr-4 py-1.5 shadow-[0_10px_30px_-10px_oklch(0_0_0/0.6)] hover:border-primary/40 transition"
        >
          <img
            src={logoAsset.url}
            loading="lazy"
            decoding="async"
            width="28"
            height="28"
            alt="Signhify AI Engineering Studio"
            className="h-7 w-7 rounded-full ring-1 ring-primary/40 group-hover:ring-primary transition"
          />
          <span className="font-display font-bold tracking-tight text-sm">Signhify</span>
        </Link>

        {/* Floating pill nav */}
        <nav
          className={`pointer-events-auto hidden lg:flex items-center gap-0.5 rounded-full border border-white/10 bg-background/60 backdrop-blur-xl px-1.5 py-1.5 shadow-[0_10px_30px_-10px_oklch(0_0_0/0.6)] transition ${
            scrolled ? "bg-background/75" : ""
          }`}
        >
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition rounded-full"
              activeProps={{
                className:
                  "relative px-3 py-1.5 text-[13px] text-foreground rounded-full bg-surface/80 shadow-[inset_0_0_0_1px_oklch(1_0_0/0.06)]",
              }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
              {"badge" in n && n.badge && (
                <span className="ml-1.5 align-middle text-[9px] font-bold uppercase tracking-wider rounded-full bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5">
                  {n.badge}
                </span>
              )}
            </Link>
          ))}
          <span aria-hidden className="mx-1 h-4 w-px bg-white/10" />
          <EcosystemSwitcher />
        </nav>

        {/* CTA pill */}
        <div className="pointer-events-auto hidden lg:flex items-center">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-[0_0_24px_-4px_var(--primary-glow)] hover:shadow-[0_0_36px_-2px_var(--primary-glow)] hover:brightness-110 transition"
          >
            Start a Project
            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto lg:hidden rounded-full border border-white/10 bg-background/60 backdrop-blur-xl p-2.5 text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden pointer-events-auto mx-4 mt-2 rounded-2xl border border-white/10 bg-background/85 backdrop-blur-2xl shadow-[0_20px_60px_-10px_oklch(0_0_0/0.7)]">
          <div className="px-4 py-3 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 border-b border-border/50 last:border-0"
              >
                {n.label}
                {"badge" in n && n.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider rounded-full bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5">
                    {n.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
