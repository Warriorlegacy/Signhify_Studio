import { useState } from 'react';
import { FLEET_VENTURES, type VentureItem } from '@/data/ventures';
import { ExternalLink, Sparkles, Zap, Eye, X, Shield, Cpu, Activity } from 'lucide-react';

interface VenturesShowcaseProps {
  showTitle?: boolean;
  limit?: number;
  initialCategory?: string;
}

export function VenturesShowcase({ showTitle = true, limit, initialCategory = 'All' }: VenturesShowcaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [previewVenture, setPreviewVenture] = useState<VentureItem | null>(null);

  const categories = [
    'All',
    'Fintech',
    'LegalTech',
    'DevOps',
    'HealthTech',
    'MarTech',
    'GovTech',
    'QualityAI',
    'HRTech',
    'BigData',
    'Media',
  ];

  const filtered = selectedCategory === 'All' 
    ? FLEET_VENTURES 
    : FLEET_VENTURES.filter(v => v.category === selectedCategory);

  const displayedVentures = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[900px] h-[450px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      {showTitle && (
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-xs font-mono font-semibold text-emerald-400 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>SIGNHIFY VENTURE LAB · 10 LIVE APPS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            Production AI Platforms <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-400">
              Shipped &amp; Scaled with Signhify
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base md:text-lg leading-relaxed">
            Explore 10 enterprise-grade AI SaaS ventures engineered with pure client-side compute, WebAssembly sandboxes, DuckDB columnar analytics, and agentic copilots.
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/50'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bento Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedVentures.map((venture) => (
          <div
            key={venture.id}
            className="group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-white/10 bg-[#090a10]/85 backdrop-blur-xl p-6 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300"
          >
            {/* Top Glow on Hover */}
            <div 
              className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${venture.accentColor}18 0%, transparent 70%)`
              }}
            />

            {/* Top Bar */}
            <div className="relative z-10">
              <div className="flex items-center justify-between gap-3 mb-4">
                <span 
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border border-white/10 bg-white/5"
                  style={{ borderColor: `${venture.accentColor}40`, color: venture.accentColor }}
                >
                  {venture.badge}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="font-mono font-semibold text-white">{venture.metrics.value}</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-1.5">
                {venture.name}
              </h3>
              <p className="text-xs font-medium text-emerald-400/90 mb-3">
                {venture.tagline}
              </p>
              <p className="text-slate-400 text-xs leading-relaxed mb-4 line-clamp-3">
                {venture.description}
              </p>

              {/* Core Engine Pill */}
              <div className="mb-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/5 text-[11px] text-slate-300 font-mono">
                <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{venture.coreEngine}</span>
              </div>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {venture.features.map((feat, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300">
                    ✓ {feat}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-10 pt-4 border-t border-white/5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setPreviewVenture(venture)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Preview</span>
              </button>

              <a
                href={venture.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 shadow-md shadow-emerald-500/20 hover:scale-[1.02] transition-all"
              >
                <span>Launch App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal (Iframe Sandbox) */}
      {previewVenture && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl h-[88vh] bg-[#07080e] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-[#0c0d16]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {previewVenture.name}
                    <span className="hidden sm:inline text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Live Vercel Production
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                    {previewVenture.coreEngine}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={previewVenture.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span className="hidden sm:inline">Open Fullscreen</span>
                  <span className="sm:hidden">Open</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewVenture(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close live preview modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Iframe Viewport */}
            <div className="flex-1 w-full bg-black relative">
              <iframe
                src={previewVenture.liveUrl}
                title={previewVenture.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default VenturesShowcase;
