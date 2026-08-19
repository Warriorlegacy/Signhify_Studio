import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Layers,
  Search,
  WandSparkles,
  ArrowRight,
  ArrowUpRight,
  Check,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  X,
  Zap,
  Sliders,
  Eye,
  FileCode,
  Download,
  Boxes,
  Play,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { SignhifyLogo } from "@/components/SignhifyLogo";

interface TemplatesSearch {
  id?: string;
  preview?: string;
  category?: string;
}

export const Route = createFileRoute("/templates")({
  validateSearch: (s: Record<string, unknown>): TemplatesSearch => ({
    id: typeof s.id === "string" ? s.id : undefined,
    preview: typeof s.preview === "string" ? s.preview : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Templates & Live Previews — Signhify 3D Studio" },
      {
        name: "description",
        content:
          "Explore cinematic 3D scroll templates, SaaS kits, and AI product starters. Preview interactively and customize in one click.",
      },
      { property: "og:title", content: "Templates & Live Previews — Signhify 3D Studio" },
      {
        property: "og:description",
        content:
          "Production-ready 3D scroll templates, SaaS starters, and interactive previews.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/templates" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/templates" }],
  }),
  component: TemplatesPage,
});

/* ── Template Catalog ─────────────────────────────────────── */

interface TemplateItem {
  id: string;
  name: string;
  category: "3D Scroll" | "SaaS & AI" | "Cinematic Landing" | "E-Commerce" | "Dashboards";
  tag: string;
  gradient: string;
  accent: string;
  frames: number;
  fps: number;
  desc: string;
  longDesc: string;
  features: string[];
  techStack: string[];
  previewPrompt: string;
  mockStats: { label: string; value: string }[];
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "cyberpunk-kinetic-watch",
    name: "Cyberpunk Kinetic Watch",
    category: "3D Scroll",
    tag: "3D Parallax",
    gradient: "from-emerald-950 via-black to-zinc-950",
    accent: "#22c55e",
    frames: 480,
    fps: 60,
    desc: "Luxury kinetic timepiece with 360-degree rotation and micro-interactions on scroll.",
    longDesc:
      "A flagship scroll experience engineered for luxury and hardware products. Features exploded gear assembly, titanium case lighting reflections, and silky frame-by-frame parallax scrolling.",
    features: [
      "480-Frame Smooth Scroll Interpolation",
      "Exploded Sub-Assembly Breakdowns",
      "Reactive Light Beam Shaders",
      "Zero Three.js Overhead — Pure Native Canvas",
    ],
    techStack: ["React 19", "HTML5 Canvas", "Tailwind CSS", "Cloudflare Pages"],
    previewPrompt: "Luxury mechanical timepiece exploded view titanium bezel emerald accents",
    mockStats: [
      { label: "Frame Count", value: "480 frames" },
      { label: "Scroll Latency", value: "< 4ms" },
      { label: "Asset Footprint", value: "1.2 MB WebP" },
    ],
  },
  {
    id: "nova-ai-code-copilot",
    name: "Nova AI Code Copilot",
    category: "SaaS & AI",
    tag: "Full-Stack SaaS",
    gradient: "from-zinc-950 via-emerald-950/40 to-black",
    accent: "#4ade80",
    frames: 360,
    fps: 60,
    desc: "Autonomous developer platform with live playground, multi-tab IDE, and terminal streaming.",
    longDesc:
      "Engineered for devtools and agentic AI startups. Ships with built-in Monaco code editor, real-time SSE token stream visualizer, API key vault, and Stripe subscription checkout.",
    features: [
      "Streaming AI Code Generation Panel",
      "Client-Side AES-256 Vault Encryption",
      "Stripe Customer Portal & Webhooks",
      "Supabase Auth & PostgreSQL Row-Level Security",
    ],
    techStack: ["TanStack Start", "Tailwind CSS", "Supabase", "Stripe API", "Monaco Editor"],
    previewPrompt: "Modern dark developer IDE with neon green code syntax streaming terminal",
    mockStats: [
      { label: "Auth Ready", value: "Supabase RLS" },
      { label: "Checkout", value: "Stripe Billing" },
      { label: "Deployment", value: "Cloudflare Workers" },
    ],
  },
  {
    id: "orbital-quantum-compute",
    name: "Orbital Quantum Compute",
    category: "Cinematic Landing",
    tag: "Deep Tech",
    gradient: "from-black via-zinc-950 to-emerald-950",
    accent: "#86efac",
    frames: 520,
    fps: 60,
    desc: "Deep tech quantum simulator with particle physics and dark glassmorphic layout.",
    longDesc:
      "A high-conversion landing page crafted for deep tech, aerospace, and AI infrastructure ventures. Dynamic particles respond to mouse cursor acceleration with crisp monochrome typography.",
    features: [
      "GPU-Accelerated Particle Canvas",
      "Interactive Qubit Coherence Graph",
      "Interactive Benchmark Comparisons",
      "High-Conversion Demo Request Funnel",
    ],
    techStack: ["React 19", "Framer Motion", "Tailwind CSS", "Vite"],
    previewPrompt: "Quantum cryo-chamber floating qubits emerald glow dark deep tech laboratory",
    mockStats: [
      { label: "Lighthouse Score", value: "99/100" },
      { label: "Frame Rate", value: "60 FPS Locked" },
      { label: "SEO Ready", value: "Schema.org Json-LD" },
    ],
  },
  {
    id: "vortex-wireless-audio",
    name: "Vortex Wireless Audio",
    category: "E-Commerce",
    tag: "Hardware / D2C",
    gradient: "from-zinc-900 via-black to-emerald-950",
    accent: "#22c55e",
    frames: 420,
    fps: 60,
    desc: "High-fidelity acoustic hardware with exploded 3D component view and cart drawer.",
    longDesc:
      "D2C hardware product launch template. Includes 3D spatial acoustics demo, acoustic frequency response curve visualizer, variant swatch picker, and frictionless slide-out checkout.",
    features: [
      "Scroll-Controlled Driver & Diaphragm Reveal",
      "Interactive Frequency Response Curve",
      "Multi-Color Finish Swatch Switcher",
      "Slide-Over Cart & Instant Apple Pay / UPI",
    ],
    techStack: ["TanStack Start", "Tailwind CSS", "Shopify / Stripe", "Web Audio API"],
    previewPrompt: "Matte black noise canceling headphones floating acoustic sound waves green aura",
    mockStats: [
      { label: "Conversion Lift", value: "+38%" },
      { label: "Interactive Drivers", value: "50mm Beryllium" },
      { label: "Checkout", value: "Instant 1-Click" },
    ],
  },
  {
    id: "apex-swarm-ai-orchestrator",
    name: "Apex Swarm AI Orchestrator",
    category: "Dashboards",
    tag: "Agent Control",
    gradient: "from-black via-emerald-950/50 to-zinc-950",
    accent: "#4ade80",
    frames: 300,
    fps: 60,
    desc: "Real-time multi-agent supervisor dashboard with telemetry and token analytics.",
    longDesc:
      "Enterprise command center for multi-agent autonomous swarms. Track task execution trees, token burn rates, memory retrieval latency, and model cost allocation across your fleet.",
    features: [
      "Real-Time Agent DAG Graph Visualizer",
      "Token Burn & Latency Telemetry Gauges",
      "Multi-Tenant Workspace Permissions",
      "Instant Human-in-the-Loop Interventions",
    ],
    techStack: ["React 19", "TanStack Table", "Tailwind CSS", "Recharts", "Lucide"],
    previewPrompt: "Multi-agent AI supervisor dashboard real-time telemetry dark mode emerald graphs",
    mockStats: [
      { label: "Active Agents", value: "6 Swarms" },
      { label: "Telemetry Latency", value: "< 15ms" },
      { label: "Export Formats", value: "CSV / JSON / OpenTelemetry" },
    ],
  },
  {
    id: "zenith-spatial-headset",
    name: "Zenith Spatial Headset",
    category: "3D Scroll",
    tag: "Vision Pro / AR",
    gradient: "from-emerald-950 via-zinc-950 to-black",
    accent: "#86efac",
    frames: 540,
    fps: 60,
    desc: "Spatial AR computing headset with interactive layers and optical lens scroll effect.",
    longDesc:
      "Experience next-generation spatial computing interface. Users scroll to glide through micro-OLED optical layers, carbon fiber headband ergonomics, and spatial audio field diagrams.",
    features: [
      "540-Frame Dual Eye Micro-OLED Scrub",
      "Spatial Mesh & LiDAR Depth Visuals",
      "Interactive FOV & Resolution Slider",
      "One-Click WebXR Browser Mode",
    ],
    techStack: ["React 19", "Tailwind CSS", "Canvas Scrub", "Cloudflare Pages"],
    previewPrompt: "Futuristic spatial computing glass headset glowing green micro OLED displays",
    mockStats: [
      { label: "Display Spec", value: "4K Dual Micro-OLED" },
      { label: "Weight Spec", value: "310g Carbon" },
      { label: "Refresh Rate", value: "120Hz Spatial" },
    ],
  },
  {
    id: "hyperflow-fintech-cloud",
    name: "HyperFlow Fintech Cloud",
    category: "SaaS & AI",
    tag: "Global Treasury",
    gradient: "from-zinc-950 via-black to-emerald-950/60",
    accent: "#22c55e",
    frames: 340,
    fps: 60,
    desc: "Cross-border automated treasury management with dynamic currency conversions.",
    longDesc:
      "Automated treasury and multi-currency banking SaaS starter. Ships with automated ledger reconciliations, real-time FX rate streams, smart contractor payouts, and audit logs.",
    features: [
      "Dynamic Multi-Currency Ledger",
      "Automated Split Payroll & Contractor Rail",
      "Biometric Sign-In & Passkey Support",
      "PDF & Excel Statement Generator",
    ],
    techStack: ["TanStack Start", "Tailwind CSS", "Supabase", "Stripe Connect", "Zod"],
    previewPrompt: "Modern dark financial treasury dashboard glowing green crypto fiat exchange rates",
    mockStats: [
      { label: "Supported Rails", value: "USD / EUR / INR / Stablecoin" },
      { label: "Compliance", value: "SOC2 Type II Ready" },
      { label: "Settlement", value: "T+0 Instant" },
    ],
  },
  {
    id: "titanium-ev-supercar",
    name: "Titanium EV Supercar",
    category: "Cinematic Landing",
    tag: "Automotive / 3D",
    gradient: "from-black via-zinc-950 to-emerald-950",
    accent: "#4ade80",
    frames: 600,
    fps: 60,
    desc: "Electric hypercar launch page with chassis breakdown and acceleration curve graph.",
    longDesc:
      "A breathtaking automotive experience with 0-60 dynamic acceleration scrub, aero air tunnel simulation, carbon tub stress analysis, and custom config reservation builder.",
    features: [
      "600-Frame Aerodynamic Wind Tunnel Scrub",
      "Interactive 0-60 MPH Acceleration Chart",
      "Battery Pack & Dual Motor X-Ray",
      "VIP Reservation & Stripe Deposit Flow",
    ],
    techStack: ["React 19", "Framer Motion", "Tailwind CSS", "Vite"],
    previewPrompt: "Aerodynamic matte black electric hypercar green laser headlights dark wind tunnel",
    mockStats: [
      { label: "0-60 MPH", value: "1.89s" },
      { label: "Range", value: "520 Miles" },
      { label: "Aero Drag", value: "0.208 Cd" },
    ],
  },
  {
    id: "solaris-renewable-energy-grid",
    name: "Solaris Renewable Energy Grid",
    category: "Dashboards",
    tag: "IoT & Utilities",
    gradient: "from-zinc-950 via-emerald-950/40 to-black",
    accent: "#86efac",
    frames: 320,
    fps: 60,
    desc: "Live solar and wind grid monitoring console with power generation gauges.",
    longDesc:
      "Industrial clean energy monitoring panel. Connect to IoT sensor streams to visualize megawatts generated, battery storage charge state, and power grid balance across facilities.",
    features: [
      "Live MegaWatt Generation Streamer",
      "Battery Storage Thermals & Depth-of-Discharge",
      "Weather Satellite Cloud Cover Overlay",
      "Substation Fault Prediction Alerts",
    ],
    techStack: ["TanStack Start", "Tailwind CSS", "Recharts", "WebSockets"],
    previewPrompt: "Solar farm clean energy grid telemetry interface futuristic green dials and gauges",
    mockStats: [
      { label: "Total Capacity", value: "1.4 GW" },
      { label: "Battery Reserve", value: "850 MWh" },
      { label: "Uptime", value: "99.99%" },
    ],
  },
];

const CATEGORIES = [
  "All",
  "3D Scroll",
  "SaaS & AI",
  "Cinematic Landing",
  "E-Commerce",
  "Dashboards",
] as const;

/* ── Main Component ───────────────────────────────────────── */

function TemplatesPage() {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.category || "All",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Preview Modal State
  const initialActiveTemplate = useMemo(() => {
    const targetId = searchParams.preview || searchParams.id;
    if (!targetId) return null;
    return (
      TEMPLATES.find(
        (t) =>
          t.id === targetId ||
          t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === targetId,
      ) || null
    );
  }, [searchParams.preview, searchParams.id]);

  const [activePreview, setActivePreview] = useState<TemplateItem | null>(
    initialActiveTemplate,
  );
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [scrubProgress, setScrubProgress] = useState(35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "features" | "stack">("preview");

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesCategory =
        selectedCategory === "All" || t.category === selectedCategory;
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const openPreview = (template: TemplateItem) => {
    setActivePreview(template);
    setScrubProgress(25);
    setIsPlaying(false);
    navigate({
      to: "/templates",
      search: {
        id: searchParams.id,
        category: searchParams.category,
        preview: template.id,
      },
    });
  };

  const closePreview = () => {
    setActivePreview(null);
    setIsPlaying(false);
    navigate({
      to: "/templates",
      search: {
        id: searchParams.id,
        category: searchParams.category,
        preview: undefined,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-[#22c55e] selection:text-black pt-24 pb-20 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 0.6px, transparent 0.9px)",
            backgroundSize: "8px 8px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#22c55e]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#4ade80]/5 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#4ade80]">Templates &amp; Presets</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#4ade80]">
              <Sparkles size={11} className="text-[#22c55e]" />
              9 Production Templates Ready
            </span>
          </div>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4ade80] mb-4 bg-[#22c55e]/10 px-3.5 py-1.5 rounded-full border border-[#22c55e]/25">
            <Layers size={11} className="text-[#22c55e]" /> Signhify Starter Kits
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Production Templates &amp; <span className="text-[#22c55e]">Live Previews</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
            Jumpstart your next cinematic 3D website or AI SaaS. Click any preset to test the
            interactive scroll simulator, swap viewports, or customize directly in the 3D builder.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080c16]/80 backdrop-blur-xl p-4 mb-10 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#22c55e] text-black font-bold shadow-[0_0_16px_rgba(34,197,94,0.35)]"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.06]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px] md:min-w-[280px]">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates or tech..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs outline-none focus:border-[#22c55e]/60 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-16">
            {filteredTemplates.map((template) => (
              <article
                key={template.id}
                className="group relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#080c16] hover:border-[#22c55e]/40 transition-all duration-500 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
              >
                {/* Glow Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 70%)",
                  }}
                />

                {/* Card Visual Header */}
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-[#030712] border-b border-white/10 isolate">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${template.gradient}`}
                    aria-hidden
                  />
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.1) 1px, transparent 0)",
                      backgroundSize: "16px 16px",
                    }}
                  />

                  {/* Window Controls */}
                  <div className="absolute top-3.5 left-3.5 flex gap-1.5 z-10">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10">
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/70 border border-[#22c55e]/40 text-[#4ade80] backdrop-blur-md">
                      {template.tag}
                    </span>
                  </div>

                  {/* Center Visual Mockup */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-md flex items-center justify-center text-white mb-2 shadow-inner group-hover:scale-110 group-hover:text-[#22c55e] group-hover:border-[#22c55e]/40 transition-all duration-300">
                      <WandSparkles size={20} />
                    </div>
                    <span className="text-xs font-mono text-white/50 tracking-wider">
                      {template.frames} Frames · {template.fps} FPS Scrub
                    </span>
                  </div>

                  {/* Hover Quick Action */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => openPreview(template)}
                      className="px-4 py-1.5 rounded-full bg-[#22c55e] text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(34,197,94,0.4)]"
                    >
                      <Eye size={12} /> Interactive Preview
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h2 className="text-white font-bold text-lg tracking-tight group-hover:text-[#4ade80] transition-colors">
                        {template.name}
                      </h2>
                      <span className="text-[10px] font-mono text-white/40 uppercase">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-white/60 text-xs sm:text-[13px] leading-relaxed line-clamp-2">
                      {template.desc}
                    </p>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {template.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-white/[0.06]">
                    <button
                      onClick={() => openPreview(template)}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white hover:text-[#4ade80] hover:border-[#22c55e]/40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye size={13} />
                      Preview
                    </button>
                    <Link
                      to="/scroll-studio"
                      search={{ prompt: template.previewPrompt }}
                      className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold btn-moonlit agent-glass-shine text-black flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
                    >
                      <WandSparkles size={12} />
                      Customize
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-3xl border border-white/[0.06] bg-white/[0.02]">
            <Layers size={36} className="text-white/30 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-white mb-1">No templates found</h3>
            <p className="text-white/50 text-xs mb-4">
              Try adjusting your search terms or select another category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pro Banner Callout */}
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#22c55e]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#4ade80] mb-2 bg-[#22c55e]/10 px-3 py-1 rounded-full border border-[#22c55e]/20">
                <Zap size={10} className="text-[#22c55e]" /> Need a custom bespoke experience?
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                Have a unique design or 3D 360° asset?
              </h2>
              <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
                Describe your vision in Scroll Studio or hire our engineering studio to build,
                render, and deploy your custom flagship website.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/pricing"
                className="px-6 py-3.5 rounded-xl text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white hover:border-[#22c55e]/40 transition-colors"
              >
                View Plans ($49/mo)
              </Link>
              <Link
                to="/builder"
                className="px-6 py-3.5 rounded-xl text-xs font-bold btn-moonlit agent-glass-shine text-black flex items-center gap-2"
              >
                Launch Builder <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Live Preview Modal ───────────────────────── */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          {/* Backdrop */}
          <div
            onClick={closePreview}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-6xl max-h-[95vh] rounded-3xl border border-white/[0.12] bg-[#080c16] shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-[scaleUp_0.25s_ease-out]">
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/[0.08] bg-[#030712]/90">
              {/* Title & Badge */}
              <div className="flex items-center gap-3">
                <SignhifyLogo size={22} />
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                    {activePreview.name}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#4ade80]">
                      {activePreview.tag}
                    </span>
                  </h3>
                </div>
              </div>

              {/* Viewport Switcher Controls */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <button
                  onClick={() => setDeviceViewport("desktop")}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                    deviceViewport === "desktop"
                      ? "bg-[#22c55e] text-black font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="Desktop (100% width)"
                >
                  <Laptop size={14} />
                  <span className="hidden md:inline">Desktop</span>
                </button>
                <button
                  onClick={() => setDeviceViewport("tablet")}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                    deviceViewport === "tablet"
                      ? "bg-[#22c55e] text-black font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet size={14} />
                  <span className="hidden md:inline">Tablet</span>
                </button>
                <button
                  onClick={() => setDeviceViewport("mobile")}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                    deviceViewport === "mobile"
                      ? "bg-[#22c55e] text-black font-bold"
                      : "text-white/60 hover:text-white"
                  }`}
                  title="Mobile (375px)"
                >
                  <Smartphone size={14} />
                  <span className="hidden md:inline">Mobile</span>
                </button>
              </div>

              {/* Close Button */}
              <div className="flex items-center gap-2">
                <Link
                  to="/scroll-studio"
                  search={{ prompt: activePreview.previewPrompt }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold btn-moonlit agent-glass-shine text-black"
                >
                  <WandSparkles size={12} />
                  Open in 3D Builder
                </Link>
                <button
                  onClick={closePreview}
                  className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.15] border border-white/[0.1] text-white flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* Responsive Simulated Viewport Container */}
              <div className="w-full flex justify-center items-center py-2">
                <div
                  className={`transition-all duration-300 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#030712] shadow-2xl relative ${
                    deviceViewport === "desktop"
                      ? "w-full aspect-[16/9]"
                      : deviceViewport === "tablet"
                        ? "w-[680px] aspect-[4/3]"
                        : "w-[360px] aspect-[9/16]"
                  }`}
                >
                  {/* Simulated 3D Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${activePreview.gradient}`}
                  />
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 0)",
                      backgroundSize: "20px 20px",
                    }}
                  />

                  {/* Traffic lights inside viewport */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                  </div>

                  {/* Simulated Frame Display */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                    <div className="p-4 rounded-3xl bg-black/60 border border-white/[0.1] backdrop-blur-xl max-w-md">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono text-[#4ade80] bg-[#22c55e]/10 border border-[#22c55e]/30 mb-3">
                        <Sparkles size={11} className="text-[#22c55e]" />
                        Frame {Math.round((scrubProgress / 100) * activePreview.frames)} of{" "}
                        {activePreview.frames} ({scrubProgress}%)
                      </div>
                      <h4 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
                        {activePreview.name}
                      </h4>
                      <p className="text-white/60 text-xs leading-relaxed mb-4">
                        {activePreview.longDesc}
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-left pt-3 border-t border-white/[0.08]">
                        {activePreview.mockStats.map((st) => (
                          <div key={st.label}>
                            <div className="text-[10px] font-mono text-white/40">{st.label}</div>
                            <div className="text-xs font-bold text-white mt-0.5">{st.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Overlay Watermark */}
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/30 tracking-wider">
                    Signhify 3D Engine · 60 FPS
                  </div>
                </div>
              </div>

              {/* Scroll Simulator Scrub Bar */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-white/70 font-mono shrink-0">
                  <Sliders size={14} className="text-[#22c55e]" />
                  <span>Scroll Scrub:</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={scrubProgress}
                  onChange={(e) => setScrubProgress(Number(e.target.value))}
                  className="flex-1 w-full accent-[#22c55e] cursor-pointer"
                />
                <div className="flex items-center gap-2 text-xs font-mono text-[#4ade80] shrink-0">
                  <span>{scrubProgress}% (Frame {Math.round((scrubProgress / 100) * activePreview.frames)})</span>
                  <button
                    onClick={() => setScrubProgress(0)}
                    className="p-1 rounded bg-white/[0.06] hover:bg-white/[0.12] text-white/60 hover:text-white"
                    title="Reset to 0%"
                  >
                    <RotateCcw size={12} />
                  </button>
                </div>
              </div>

              {/* Specs & Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4ade80] mb-3 flex items-center gap-2">
                    <Check size={14} className="text-[#22c55e]" /> Included Features
                  </h4>
                  <ul className="space-y-2">
                    {activePreview.features.map((feat) => (
                      <li key={feat} className="text-xs text-white/75 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4ade80] mb-3 flex items-center gap-2">
                    <Boxes size={14} className="text-[#22c55e]" /> Architecture &amp; Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activePreview.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/40 mt-4 leading-relaxed">
                    100% full source code ownership. No lock-in, clean TypeScript, and deployable to
                    Cloudflare, Vercel, or custom VPS.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer Bar */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/[0.08] bg-[#030712]/90">
              <button
                onClick={closePreview}
                className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-white/70 hover:text-white transition-colors"
              >
                Close
              </button>
              <div className="flex items-center gap-3">
                <Link
                  to="/scroll-studio"
                  search={{ prompt: activePreview.previewPrompt }}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold btn-moonlit agent-glass-shine text-black flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-[1.02] transition-transform"
                >
                  <WandSparkles size={13} />
                  Customize in 3D Builder
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
