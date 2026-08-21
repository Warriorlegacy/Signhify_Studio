import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Key, LogIn, UserPlus, LayoutDashboard, User } from "lucide-react";
import { SignhifyLogo } from "@/components/SignhifyLogo";
import { EcosystemSwitcher } from "./EcosystemSwitcher";
import AiKeyQuickConfig from "@/components/ai/AiKeyQuickConfig";
import { useUser } from "@/hooks/useUser";

const NAV = [
  { to: "/", label: "Studio" },
  { to: "/templates", label: "Templates", badge: "3D" },
  { to: "/pricing", label: "Pricing", badge: "$5" },
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/ai", label: "AI", badge: "New" },
  { to: "/marketplace", label: "Market" },
  { to: "/app/deploy", label: "Deploy" },
  { to: "/app", label: "Cloud" },
  { to: "/os", label: "OS" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [keyOpen, setKeyOpen] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-3.5 sm:pt-4 flex items-center justify-between gap-3">
        {/* Logo pill */}
        <Link
          to="/"
          className="pointer-events-auto group inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/80 backdrop-blur-xl pl-1.5 pr-4 py-1.5 shadow-[0_10px_30px_-10px_oklch(0_0_0/0.6)] hover:border-primary/40 transition"
        >
          <SignhifyLogo size={28} className="shrink-0" />
          <span className="font-display font-bold tracking-tight text-sm text-foreground">Signhify</span>
        </Link>

        {/* Floating pill nav */}
        <nav
          className={`pointer-events-auto hidden lg:flex items-center gap-0.5 rounded-full border border-white/10 bg-background/80 backdrop-blur-xl px-2 py-1.5 shadow-[0_10px_30px_-10px_oklch(0_0_0/0.6)] transition ${
            scrolled ? "bg-background/90" : ""
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
          <button
            onClick={() => setKeyOpen((v) => !v)}
            className="relative ml-1 rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface/60 transition"
            aria-label="AI Keys"
            title="Configure AI Keys & Sessions"
          >
            <Key size={14} />
          </button>
        </nav>

        {keyOpen && (
          <div className="pointer-events-auto fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setKeyOpen(false)}>
            <div
              className="absolute top-[72px] left-1/2 -translate-x-1/2 w-full max-w-lg mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <AiKeyQuickConfig />
            </div>
          </div>
        )}

        {/* Auth & CTA Right Pill Group */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2">
          {!loading && user ? (
            <Link
              to="/app"
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-background/80 backdrop-blur-xl px-3.5 py-2 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-surface transition-all shadow-[0_4px_20px_-4px_oklch(0_0_0/0.5)]"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <LayoutDashboard size={13} className="text-primary" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              {/* Login Button */}
              <Link
                to="/login"
                search={{ redirect: "/app" }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-background/80 backdrop-blur-xl px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-white/25 hover:bg-surface/80 transition-all shadow-[0_4px_20px_-4px_oklch(0_0_0/0.4)]"
              >
                <LogIn size={13} />
                <span>Log In</span>
              </Link>

              {/* Sign Up Button */}
              <Link
                to="/signup"
                search={{ redirect: "/app" }}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-xl px-3.5 py-2 text-xs font-semibold text-primary hover:bg-primary/20 hover:border-primary transition-all shadow-[0_0_20px_-4px_var(--primary-glow)]"
              >
                <UserPlus size={13} />
                <span>Sign Up</span>
              </Link>
            </>
          )}

          {/* Start a Project CTA */}
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-primary pl-4 pr-1.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_0_24px_-4px_var(--primary-glow)] hover:shadow-[0_0_36px_-2px_var(--primary-glow)] hover:brightness-110 active:scale-[0.98] transition-all duration-300"
          >
            <span>Start a Project</span>
            <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowRight size={11} />
            </span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto lg:hidden rounded-full border border-white/10 bg-background/80 backdrop-blur-xl p-2.5 text-foreground shadow-lg"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="lg:hidden pointer-events-auto mx-4 mt-2 rounded-2xl border border-white/10 bg-background/95 backdrop-blur-2xl p-4 shadow-[0_20px_60px_-10px_oklch(0_0_0/0.8)]">
          {/* Mobile Auth Action Bar */}
          <div className="grid grid-cols-2 gap-2 mb-3 pb-3 border-b border-border/50">
            {!loading && user ? (
              <Link
                to="/app"
                onClick={() => setOpen(false)}
                className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-primary/15 border border-primary/30 p-2.5 text-xs font-semibold text-primary"
              >
                <LayoutDashboard size={14} /> Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  search={{ redirect: "/app" }}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-surface/60 p-2.5 text-xs font-semibold text-foreground hover:bg-surface"
                >
                  <LogIn size={13} /> Log In
                </Link>
                <Link
                  to="/signup"
                  search={{ redirect: "/app" }}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/20 p-2.5 text-xs font-semibold text-primary hover:bg-primary/30"
                >
                  <UserPlus size={13} /> Sign Up Free
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center justify-between rounded-lg hover:bg-white/5"
              >
                <span>{n.label}</span>
                {"badge" in n && n.badge && (
                  <span className="text-[9px] font-bold uppercase tracking-wider rounded-full bg-primary/15 text-primary border border-primary/30 px-1.5 py-0.5">
                    {n.badge}
                  </span>
                )}
              </Link>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                setKeyOpen((v) => !v);
              }}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/60 p-2.5 text-xs font-semibold"
            >
              <Key size={14} /> Configure AI Keys
            </button>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-primary p-2.5 text-xs font-semibold text-primary-foreground"
            >
              Start a Project <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
