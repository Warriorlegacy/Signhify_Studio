import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Layers } from "lucide-react";
import { ECOSYSTEM } from "@/lib/ecosystem";

const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  preview: "Preview",
  soon: "Soon",
};

export function EcosystemSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-muted-foreground hover:text-foreground transition"
      >
        <Layers size={13} />
        <span>Ecosystem</span>
        <ChevronDown
          size={12}
          className={`transition ${open ? "rotate-180 text-primary" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+10px)] w-[min(92vw,560px)] rounded-2xl border border-white/10 bg-background/95 backdrop-blur-2xl shadow-[0_30px_80px_-20px_oklch(0_0_0/0.8)] p-2 animate-in fade-in zoom-in-95"
        >
          <div className="px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-primary">
            The Signhify ecosystem
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
            {ECOSYSTEM.map((node) => {
              const Icon = node.icon;
              return (
                <Link
                  key={node.key}
                  to={node.to}
                  onClick={() => setOpen(false)}
                  className={`group relative overflow-hidden rounded-xl border border-border/60 bg-surface/40 hover:border-primary/50 transition p-3 flex gap-3 items-start`}
                >
                  <div
                    aria-hidden
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${node.accent} transition`}
                  />
                  <div className="relative grid place-items-center h-9 w-9 rounded-lg bg-background/80 border border-border text-primary">
                    <Icon size={16} />
                  </div>
                  <div className="relative min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-semibold text-sm">
                        {node.label}
                      </span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider rounded-full px-1.5 py-0.5 border ${
                          node.status === "live"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : node.status === "preview"
                              ? "bg-primary/15 text-primary border-primary/30"
                              : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {STATUS_LABEL[node.status]}
                      </span>
                    </div>
                    <div className="text-[12px] text-muted-foreground mt-0.5">
                      {node.tagline}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Link
            to="/roadmap"
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-[12px] text-foreground hover:bg-primary/10 transition"
          >
            See the full roadmap →
          </Link>
        </div>
      )}
    </div>
  );
}
