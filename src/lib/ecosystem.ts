import {
  Sparkles,
  Boxes,
  Cloud,
  Cpu,
  Rocket,
  Store,
  type LucideIcon,
} from "lucide-react";

export type EcosystemNode = {
  key: string;
  label: string;
  tagline: string;
  to: string;
  icon: LucideIcon;
  accent: string; // tailwind class fragment
  status: "live" | "preview" | "soon";
};

export const ECOSYSTEM: EcosystemNode[] = [
  {
    key: "studio",
    label: "Studio",
    tagline: "Custom AI builds, end-to-end.",
    to: "/",
    icon: Boxes,
    accent: "from-primary/30 to-primary/0",
    status: "live",
  },
  {
    key: "ai",
    label: "AI",
    tagline: "Prompt → real build plan, live.",
    to: "/ai",
    icon: Sparkles,
    accent: "from-fuchsia-500/30 to-fuchsia-500/0",
    status: "preview",
  },
  {
    key: "marketplace",
    label: "Marketplace",
    tagline: "Templates, agents, components.",
    to: "/marketplace",
    icon: Store,
    accent: "from-amber-500/30 to-amber-500/0",
    status: "preview",
  },
  {
    key: "cloud",
    label: "Cloud",
    tagline: "Your workspace + project spaces.",
    to: "/vision",
    icon: Cloud,
    accent: "from-sky-500/30 to-sky-500/0",
    status: "soon",
  },
  {
    key: "os",
    label: "OS",
    tagline: "Agent orchestration runtime.",
    to: "/vision",
    icon: Cpu,
    accent: "from-emerald-500/30 to-emerald-500/0",
    status: "soon",
  },
  {
    key: "deploy",
    label: "Deploy",
    tagline: "One-click ship + observability.",
    to: "/vision",
    icon: Rocket,
    accent: "from-rose-500/30 to-rose-500/0",
    status: "soon",
  },
];
