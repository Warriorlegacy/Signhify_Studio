import type { ReactNode } from "react";
import { clsx } from "clsx";

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={clsx("glass p-5", className)}>{children}</div>;
}

const TIER_STYLES: Record<string, string> = {
  A: "bg-ember/20 text-ember-soft border-ember/40",
  B: "bg-gold/15 text-gold border-gold/40",
  C: "bg-white/5 text-slate-soft border-white/10",
};

const VERDICT_STYLES: Record<string, string> = {
  verified: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  risky: "bg-gold/15 text-gold border-gold/40",
  failed: "bg-red-500/15 text-red-400 border-red-500/40",
  unknown: "bg-white/5 text-slate-soft border-white/10",
  none: "bg-white/5 text-slate-soft border-white/10",
};

export function Badge({
  kind,
  value,
}: {
  kind: "tier" | "verdict" | "status";
  value: string | null | undefined;
}) {
  const v = value ?? "—";
  const styles =
    kind === "tier"
      ? TIER_STYLES[v] ?? TIER_STYLES.C
      : kind === "verdict"
        ? VERDICT_STYLES[v] ?? VERDICT_STYLES.unknown
        : "bg-white/5 text-slate-soft border-white/10";
  return (
    <span className={clsx("inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium", styles)}>
      {v}
    </span>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const styles = {
    primary:
      "bg-ember text-obsidian font-semibold hover:bg-ember-soft disabled:opacity-40 disabled:cursor-not-allowed",
    ghost:
      "border border-white/15 text-slate-200 hover:bg-white/5 disabled:opacity-40",
    danger: "border border-red-500/40 text-red-400 hover:bg-red-500/10",
  }[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx("rounded-lg px-4 py-2 text-sm transition-colors", styles, className)}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputCls =
  "w-full rounded-lg border border-white/10 bg-obsidian-2 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-soft/50 focus:border-ember/60 focus:outline-none";

export function Kpi({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <GlassCard className="transition-shadow hover:glow-ember">
      <div className="text-xs uppercase tracking-wider text-slate-soft">{label}</div>
      <div className="mt-1.5 font-display text-2xl font-600 text-white">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ember-soft">{sub}</div>}
    </GlassCard>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-700 text-white">{title}</h1>
      {sub && <p className="mt-1 text-sm text-slate-soft">{sub}</p>}
    </div>
  );
}
