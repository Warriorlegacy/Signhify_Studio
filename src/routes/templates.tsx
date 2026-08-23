import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Layers,
  Search,
  WandSparkles,
  ArrowRight,
  Check,
  Laptop,
  Tablet,
  Smartphone,
  X,
  Zap,
  Sliders,
  Eye,
  Boxes,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Copy,
  CheckCircle2,
  Terminal,
  Code2,
  Cpu,
  Orbit,
  Maximize2,
} from "lucide-react";
import { SignhifyLogo } from "@/components/SignhifyLogo";
import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateItem, type TemplateCategory } from "@/lib/templates-data";
import { TemplateParticleCanvas } from "@/components/three/TemplateParticleCanvas";
import { toast } from "sonner";

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
      { title: "3D Templates & God-Level Prompts Catalog — Signhify 3D Studio" },
      {
        name: "description",
        content:
          "Explore over 18+ cinematic 3D scroll templates, SaaS kits, AI co-pilots, and god-level master prompts. Interactive real-time 3D preview simulator, responsive viewports, and 1-click builder fork.",
      },
      { property: "og:title", content: "3D Templates & God-Level Prompts — Signhify 3D Studio" },
      {
        property: "og:description",
        content:
          "Production-ready 3D scroll templates, SaaS starters, and interactive god-level prompt previews.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/templates" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/templates" }],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const navigate = Route.useNavigate();
  const searchParams = Route.useSearch();
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>(
    (searchParams.category as TemplateCategory) || "All",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("All");

  // Active Preview Modal
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

  const [activePreview, setActivePreview] = useState<TemplateItem | null>(initialActiveTemplate);
  const [promptModalTemplate, setPromptModalTemplate] = useState<TemplateItem | null>(null);
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [scrubProgress, setScrubProgress] = useState(35);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Auto-play scrub simulation
  useMemo(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setScrubProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 45);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
      const matchesBadge = selectedBadge === "All" || t.badge === selectedBadge;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        t.name.toLowerCase().includes(query) ||
        t.desc.toLowerCase().includes(query) ||
        t.tag.toLowerCase().includes(query) ||
        t.techStack.some((tech) => tech.toLowerCase().includes(query)) ||
        t.godLevelPrompt.toLowerCase().includes(query);
      return matchesCategory && matchesBadge && matchesSearch;
    });
  }, [selectedCategory, selectedBadge, searchQuery]);

  const handleCopyPrompt = (template: TemplateItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(template.godLevelPrompt);
    setCopiedId(template.id);
    toast.success(`God-Level Prompt for "${template.name}" copied to clipboard!`);
    setTimeout(() => setCopiedId(null), 3000);
  };

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
    <div className="min-h-screen bg-[#030712] text-white selection:bg-[#22c55e] selection:text-black pt-24 pb-24 relative overflow-hidden">
      {/* Background Ambience & Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 0.6px, transparent 0.9px)",
            backgroundSize: "12px 12px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[400px] bg-[#22c55e]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-[600px] h-[350px] bg-[#4ade80]/5 rounded-full blur-[170px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs & Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-white/50 font-mono">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#4ade80]">Templates &amp; God-Level Prompts</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#22c55e]/10 border border-[#22c55e]/30 text-[#4ade80] shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <Sparkles size={11} className="text-[#22c55e]" />
              {TEMPLATES.length} Cinematic 3D Templates Ready
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4ade80] mb-4 bg-[#22c55e]/10 px-3.5 py-1.5 rounded-full border border-[#22c55e]/25">
            <Layers size={11} className="text-[#22c55e]" /> Vibe Coding &amp; 3D Scroll Library
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            Cinematic 3D Templates &amp; <span className="text-[#22c55e]">God-Level Prompts</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Choose from an exhaustive collection of 3D scroll websites, AI co-pilots, telemetry
            dashboards, and hardware stores. Copy production master prompts or test the real-time 3D
            simulator in one click.
          </p>
        </div>

        {/* Search, Categories & Quick Badges Bar */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#080c16]/80 backdrop-blur-xl p-4 sm:p-5 mb-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {TEMPLATE_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#22c55e] text-black font-bold shadow-[0_0_16px_rgba(34,197,94,0.4)]"
                        : "bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white border border-white/[0.06]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] md:min-w-[320px]">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 18+ templates, prompts, tech stack..."
                className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs outline-none focus:border-[#22c55e]/60 transition-colors"
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

          {/* Quick Badges Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/[0.06]">
            <span className="text-[11px] font-mono text-white/40 uppercase mr-1">Filter by:</span>
            {["All", "God-Level Prompt", "Cinematic 3D", "Featured", "Trending", "New"].map(
              (badge) => (
                <button
                  key={badge}
                  onClick={() => setSelectedBadge(badge)}
                  className={`text-[11px] px-3 py-1 rounded-lg transition-colors ${
                    selectedBadge === badge
                      ? "bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/40 font-bold"
                      : "bg-white/[0.02] text-white/50 hover:text-white/80 border border-white/[0.04]"
                  }`}
                >
                  {badge}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-20">
            {filteredTemplates.map((template) => (
              <article
                key={template.id}
                className="group relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#080c16] hover:border-[#22c55e]/50 transition-all duration-500 flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
              >
                {/* Ambient Card Hover Glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.15) 0%, transparent 70%)",
                  }}
                />

                {/* 3D Visual Preview Header with High-Res Thumbnail & Overlay Actions */}
                <TemplateThumbnail
                  id={template.id}
                  name={template.name}
                  thumbnail={template.thumbnail}
                  gradient={template.gradient}
                  accent={template.accent}
                  category={template.category}
                  tag={template.tag}
                  frames={template.frames}
                  badge={template.badge}
                  aspectRatio="16/10"
                  interactive={true}
                >
                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex justify-center items-center gap-2 opacity-0 group-hover/thumb:opacity-100 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button
                      onClick={() => openPreview(template)}
                      className="px-4 py-1.5 rounded-full bg-[#22c55e] text-black text-xs font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(34,197,94,0.5)] hover:scale-105 transition-transform"
                    >
                      <Eye size={12} /> 3D Live Preview
                    </button>
                    <button
                      onClick={(e) => handleCopyPrompt(template, e)}
                      className="px-3 py-1.5 rounded-full bg-black/80 hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 backdrop-blur-md"
                    >
                      {copiedId === template.id ? <CheckCircle2 size={12} className="text-[#22c55e]" /> : <Copy size={12} />}
                      Prompt
                    </button>
                  </div>
                </TemplateThumbnail>

                {/* Card Content & Features */}
                <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h2 className="text-white font-bold text-lg tracking-tight group-hover:text-[#4ade80] transition-colors line-clamp-1">
                        {template.name}
                      </h2>
                      <span className="text-[10px] font-mono text-white/40 uppercase shrink-0">
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

                  {/* Bottom Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-3.5 border-t border-white/[0.06]">
                    <button
                      onClick={() => openPreview(template)}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] text-white hover:text-[#4ade80] hover:border-[#22c55e]/40 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye size={13} />
                      Preview
                    </button>
                    <button
                      onClick={() => setPromptModalTemplate(template)}
                      className="py-2.5 px-3 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.1] text-white hover:text-white transition-all flex items-center justify-center gap-1.5"
                      title="Inspect God-Level Prompt"
                    >
                      <Terminal size={13} className="text-[#22c55e]" />
                      Prompt
                    </button>
                    <Link
                      to="/scroll-studio"
                      search={{ prompt: template.godLevelPrompt }}
                      className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold btn-moonlit agent-glass-shine text-black flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02]"
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
              Try adjusting your search terms or selecting another category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedBadge("All");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Pricing / Pro Callout Banner */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#080c16]/90 backdrop-blur-xl p-8 sm:p-12 relative overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#22c55e]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-[#4ade80] mb-2 bg-[#22c55e]/10 px-3 py-1 rounded-full border border-[#22c55e]/20">
                <Zap size={10} className="text-[#22c55e]" /> Starting from just $5/month (5 AI Credits)
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                Need bespoke 3D assets or autonomous swarms?
              </h2>
              <p className="text-white/60 text-xs sm:text-sm max-w-xl leading-relaxed">
                Describe your project prompt or scale up to our $50 (75 credits), $100 (125 credits),
                or $200 (300 credits) dedicated tiers with full source code ownership.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/pricing"
                className="px-6 py-3.5 rounded-xl text-xs font-bold bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white hover:border-[#22c55e]/40 transition-colors"
              >
                View Pricing ($5 - $200/mo)
              </Link>
              <Link
                to="/scroll-studio"
                className="px-6 py-3.5 rounded-xl text-xs font-bold btn-moonlit agent-glass-shine text-black flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
              >
                Open 3D Builder <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Interactive Live 3D Preview Modal ───────────────────────── */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
          {/* Backdrop */}
          <div
            onClick={closePreview}
            className="absolute inset-0 bg-black/85 backdrop-blur-xl animate-[fadeIn_0.2s_ease-out]"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-6xl max-h-[95vh] rounded-3xl border border-white/[0.12] bg-[#080c16] shadow-[0_25px_80px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-[scaleUp_0.25s_ease-out]">
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-white/[0.08] bg-[#030712]/90">
              <div className="flex items-center gap-3">
                <SignhifyLogo size={24} />
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                    {activePreview.name}
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/40 text-[#4ade80]">
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
                  title="Desktop (16:9)"
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
                  title="Tablet (4:3)"
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
                  title="Mobile (9:16)"
                >
                  <Smartphone size={14} />
                  <span className="hidden md:inline">Mobile</span>
                </button>
              </div>

              {/* Actions & Close */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyPrompt(activePreview)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-white"
                >
                  {copiedId === activePreview.id ? (
                    <CheckCircle2 size={13} className="text-[#22c55e]" />
                  ) : (
                    <Copy size={13} />
                  )}
                  <span>Copy Prompt</span>
                </button>
                <Link
                  to="/scroll-studio"
                  search={{ prompt: activePreview.godLevelPrompt }}
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
              {/* Responsive Simulated 3D Viewport */}
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
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${activePreview.gradient}`}
                  />

                  {/* Live 3D Particle Canvas */}
                  <div className="absolute inset-0">
                    <TemplateParticleCanvas
                      mode={activePreview.particleMode}
                      accent={activePreview.accent}
                      secondaryAccent={activePreview.secondaryAccent}
                      scrubProgress={scrubProgress}
                      interactive={true}
                    />
                  </div>

                  {/* Window Controls Overlay */}
                  <div className="absolute top-3.5 left-3.5 flex gap-1.5 z-20">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                  </div>

                  {/* Simulated Content Hero Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 pointer-events-none">
                    <div className="p-5 rounded-3xl bg-black/65 border border-white/[0.12] backdrop-blur-xl max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono text-[#4ade80] bg-[#22c55e]/10 border border-[#22c55e]/30 mb-3">
                        <Sparkles size={11} className="text-[#22c55e]" />
                        Frame {Math.round((scrubProgress / 100) * activePreview.frames)} of{" "}
                        {activePreview.frames} ({scrubProgress}%)
                      </div>
                      <h4 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
                        {activePreview.name}
                      </h4>
                      <p className="text-white/70 text-xs leading-relaxed mb-4 line-clamp-3">
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
                  <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/40 tracking-wider bg-black/40 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
                    Signhify 3D Engine · 60 FPS Locked
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
                <div className="flex items-center gap-3 text-xs font-mono text-[#4ade80] shrink-0">
                  <span>
                    {scrubProgress}% (Frame {Math.round((scrubProgress / 100) * activePreview.frames)})
                  </span>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.15] text-white transition-colors"
                    title={isPlaying ? "Pause scrub animation" : "Auto-play scrub animation"}
                  >
                    {isPlaying ? <Pause size={13} /> : <Play size={13} />}
                  </button>
                  <button
                    onClick={() => setScrubProgress(0)}
                    className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.15] text-white/60 hover:text-white transition-colors"
                    title="Reset to frame 0"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* God-Level Prompt Drawer */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#030712] p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4ade80] flex items-center gap-2">
                    <Terminal size={14} className="text-[#22c55e]" /> God-Level Master Prompt
                  </h4>
                  <button
                    onClick={() => handleCopyPrompt(activePreview)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.12] text-white flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === activePreview.id ? (
                      <CheckCircle2 size={12} className="text-[#22c55e]" />
                    ) : (
                      <Copy size={12} />
                    )}
                    <span>{copiedId === activePreview.id ? "Copied!" : "Copy Full Prompt"}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl bg-black/70 border border-white/[0.06] font-mono text-xs text-white/80 leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap select-all">
                  {activePreview.godLevelPrompt}
                </div>
              </div>

              {/* Specs & Architecture Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4ade80] mb-3 flex items-center gap-2">
                    <Check size={14} className="text-[#22c55e]" /> Included Features
                  </h4>
                  <ul className="space-y-2">
                    {activePreview.features.map((feat) => (
                      <li key={feat} className="text-xs text-white/75 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#4ade80] mb-3 flex items-center gap-2">
                    <Boxes size={14} className="text-[#22c55e]" /> Architecture &amp; Tech Stack
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {activePreview.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs font-mono px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/80"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    100% full source code ownership. Zero vendor lock-in. Clean TypeScript, MIT
                    license, and one-click deployment ready for Cloudflare, Vercel, or custom VPS.
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
                  search={{ prompt: activePreview.godLevelPrompt }}
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

      {/* ── God-Level Prompt Dedicated Modal ──────────────────────── */}
      {promptModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setPromptModalTemplate(null)}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />
          <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/[0.12] bg-[#080c16] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#4ade80] bg-[#22c55e]/10 px-2.5 py-0.5 rounded-full border border-[#22c55e]/30">
                  God-Level Master Prompt
                </span>
                <h3 className="text-white font-bold text-lg mt-1">{promptModalTemplate.name}</h3>
              </div>
              <button
                onClick={() => setPromptModalTemplate(null)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.15] text-white flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/80 border border-white/[0.08] font-mono text-xs text-white/80 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap select-all mb-6">
              {promptModalTemplate.godLevelPrompt}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => handleCopyPrompt(promptModalTemplate)}
                className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white flex items-center gap-2 transition-colors"
              >
                {copiedId === promptModalTemplate.id ? (
                  <CheckCircle2 size={14} className="text-[#22c55e]" />
                ) : (
                  <Copy size={14} />
                )}
                <span>{copiedId === promptModalTemplate.id ? "Copied to Clipboard" : "Copy Prompt"}</span>
              </button>
              <Link
                to="/scroll-studio"
                search={{ prompt: promptModalTemplate.godLevelPrompt }}
                onClick={() => setPromptModalTemplate(null)}
                className="px-6 py-2.5 rounded-xl text-xs font-bold btn-moonlit agent-glass-shine text-black flex items-center gap-2"
              >
                <WandSparkles size={13} />
                Open in 3D Builder
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
