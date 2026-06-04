import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/signhify-logo.png.asset.json";

const NAV = [
  { to: "/", label: "Studio" },
  { to: "/projects", label: "Projects" },
  { to: "/ai", label: "AI Builder", badge: "New" },
  { to: "/templates", label: "Templates" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/pricing", label: "Pricing" },
  { to: "/sprint", label: "Sprint" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logoAsset.url}
            alt="Signhify"
            className="h-9 w-9 rounded-full ring-1 ring-primary/40 group-hover:ring-primary transition"
          />
          <span className="font-display font-bold tracking-tight text-lg">
            Signhify
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="relative px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition rounded-md"
              activeProps={{ className: "relative px-3 py-2 text-sm text-foreground rounded-md" }}
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
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_0_24px_-4px_var(--primary-glow)] hover:shadow-[0_0_36px_-2px_var(--primary-glow)] hover:brightness-110 transition"
          >
            Start a Project
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden p-2 rounded-md text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-2 py-3 text-base text-muted-foreground hover:text-foreground flex items-center gap-2"
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
              className="mt-2 inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
