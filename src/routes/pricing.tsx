import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ChevronDown,
  Shield,
  Zap,
  Loader2,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  CreditCard,
  Building,
  DollarSign,
  Sliders,
  Cpu,
  Boxes,
  XCircle,
  Crown,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { submitLead } from "@/lib/leads.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Transparent Pricing & AI Credit Plans ($5 to $200/mo) — Signhify" },
      {
        name: "description",
        content:
          "Predictable AI credits starting at $5/mo for 5 credits, $50 for 75 credits, $100 for 125 credits, up to $200 for 300 credits. 3D scroll builder, multi-agent swarms, and 100% full source code ownership.",
      },
      { property: "og:title", content: "Transparent Pricing & AI Credit Plans — Signhify" },
      {
        property: "og:description",
        content:
          "AI credit plans starting at $5/month. Full code ownership, 3D scroll engine, and multi-agent swarm orchestration.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/pricing" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Transparent Pricing & AI Credit Plans — Signhify",
          url: "https://signhify.dpdns.org/pricing",
          description:
            "AI credit plans starting at $5/month. Full code ownership, 3D scroll engine, and multi-agent swarm orchestration.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }),
      },
    ],
  }),
  component: PricingPage,
});

interface PricingTier {
  id: string;
  name: string;
  tag: string;
  monthlyPrice: number;
  annualPrice: number;
  credits: number;
  creditsLabel: string;
  desc: string;
  features: string[];
  cta: string;
  featured: boolean;
  badgeColor: string;
  glowColor: string;
}

const TIERS: PricingTier[] = [
  {
    id: "starter",
    name: "Starter Vibe",
    tag: "Entry Pack",
    monthlyPrice: 5,
    annualPrice: 4,
    credits: 5,
    creditsLabel: "5 AI Credits / month",
    desc: "Essential AI generation & 3D scroll studio access. Perfect for indie creators, learning vibe coding, and quick landing sites.",
    features: [
      "5 AI Generation Credits / month",
      "3D Scroll Studio Builder & Simulator",
      "18+ God-Level Prompts & Templates",
      "Client-Side BYOK AES-256 Key Vault",
      "Cloudflare Edge Deployment Ready",
      "Full Source Code Ownership (100% MIT)",
      "Community & Discord Support",
    ],
    cta: "Start for $5",
    featured: false,
    badgeColor: "bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/20",
    glowColor: "rgba(34, 197, 94, 0.15)",
  },
  {
    id: "pro",
    name: "Pro Builder",
    tag: "High Velocity",
    monthlyPrice: 50,
    annualPrice: 40,
    credits: 75,
    creditsLabel: "75 AI Credits / month",
    desc: "Engineered for active indie hackers and founders shipping full-stack apps, dynamic databases, and 480-frame scroll experiences.",
    features: [
      "75 AI Generation Credits / month",
      "Full-Stack SaaS Builder (Auth + DB + Stripe)",
      "480-Frame 3D Scroll Exports (WebP + Canvas)",
      "Multi-File Project Export (ZIP + GitHub Sync)",
      "BYOK Vault + Managed Claude/GPT-4 Models",
      "Automated SEO Metadata & Sitemap Generation",
      "Priority WhatsApp & Email Support",
    ],
    cta: "Get Pro ($50)",
    featured: false,
    badgeColor: "bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/30",
    glowColor: "rgba(34, 197, 94, 0.25)",
  },
  {
    id: "scale",
    name: "Studio Scale",
    tag: "Most Chosen",
    monthlyPrice: 100,
    annualPrice: 80,
    credits: 125,
    creditsLabel: "125 AI Credits / month",
    desc: "For high-growth startups and creative agencies deploying multi-app suites, autonomous agent pipelines, and custom domains.",
    features: [
      "125 AI Generation Credits / month",
      "Autonomous 6-Agent AI Swarm Orchestrator",
      "600-Frame Ultra 3D Parallax Video Pipelines",
      "Multi-Tenant Supabase RLS Database Presets",
      "Custom Domain Mapping & Auto SSL",
      "Commercial Agency Reseller Rights",
      "Direct Founder Line & Priority SLA",
    ],
    cta: "Scale with Studio ($100)",
    featured: true,
    badgeColor: "bg-[#22c55e]/30 text-[#22c55e] border-[#22c55e]/50 font-bold",
    glowColor: "rgba(34, 197, 94, 0.4)",
  },
  {
    id: "enterprise",
    name: "Enterprise Fleet",
    tag: "Power Cluster",
    monthlyPrice: 200,
    annualPrice: 160,
    credits: 300,
    creditsLabel: "300 AI Credits / month",
    desc: "Unrestricted powerhouse tier for heavy vibe coding, dedicated agent clusters, custom WebGL shaders, and high-frequency production pipelines.",
    features: [
      "300 AI Generation Credits / month",
      "Dedicated Autonomous Swarm Cluster",
      "Custom 3D WebGL / Three.js Shaders on Demand",
      "Unlimited Workspace Team Seats",
      "White-Glove Architecture & Security Audit Review",
      "Custom Stripe & Billing Gateway Webhook Pipelines",
      "1-on-1 Dedicated Engineering Retainer Access",
    ],
    cta: "Deploy Fleet ($200)",
    featured: false,
    badgeColor: "bg-white/10 text-white/90 border-white/20",
    glowColor: "rgba(255, 255, 255, 0.15)",
  },
];

const COMPETITOR_COMPARISON = [
  {
    feature: "Starting Price",
    signhify: "$5 / mo (5 Credits)",
    lovable: "$20 - $50 / mo",
    bolt: "$20 - $50 / mo",
    replit: "$25 - $100 / mo",
    cursor: "$20 - $40 / mo",
  },
  {
    feature: "3D Cinematic Scroll Engine",
    signhify: "✅ 60 FPS Native Canvas",
    lovable: "❌ Basic 2D only",
    bolt: "❌ Basic 2D only",
    replit: "❌ Generic code",
    cursor: "❌ Code editor only",
  },
  {
    feature: "Full Source Code Ownership",
    signhify: "✅ 100% MIT / Zero Lock-in",
    lovable: "⚠️ Platform dependent",
    bolt: "⚠️ Platform dependent",
    replit: "⚠️ Cloud workspace locked",
    cursor: "✅ Local files",
  },
  {
    feature: "BYOK Client-Side Key Vault",
    signhify: "✅ AES-256 Encrypted",
    lovable: "❌ Managed only",
    bolt: "❌ Managed only",
    replit: "❌ Server-side secrets",
    cursor: "⚠️ Partial",
  },
  {
    feature: "Multi-Agent Swarm Pipeline",
    signhify: "✅ 6 Autonomous Agents",
    lovable: "❌ Single turn LLM",
    bolt: "❌ Single turn LLM",
    replit: "❌ Single agent",
    cursor: "⚠️ 1 agent at a time",
  },
  {
    feature: "Global & Indian Payment Rails",
    signhify: "✅ Stripe, UPI, PayPal, Wire",
    lovable: "❌ Card only",
    bolt: "❌ Card only",
    replit: "❌ Card only",
    cursor: "❌ Card only",
  },
];

const FAQ = [
  {
    q: "How does the $5 per month plan work?",
    a: "Our Starter plan begins at just $5/month and grants you 5 AI credits every month. Each credit covers complete full-page code generations or 3D scroll frame extractions. It's the most affordable entry point in the entire vibe coding ecosystem.",
  },
  {
    q: "What happens if I need more credits during the month?",
    a: "You can seamlessly scale from $5 (5 credits) to $50 (75 credits), $100 (125 credits), or $200 (300 credits) anytime with prorated billing. Your existing project state, vaults, and deployments remain uninterrupted.",
  },
  {
    q: "How do Signhify prices compare to Lovable, Bolt, and Replit?",
    a: "Platforms like Lovable and Bolt charge $20 to $50/month with zero native 3D scroll capabilities. Signhify starts at just $5/month, offers 480-600 frame 3D scroll interpolation, 6-agent autonomous swarm pipelines, and gives you 100% full source code ownership with zero vendor lock-in.",
  },
  {
    q: "Do I own the source code generated by Signhify?",
    a: "Yes! 100% full MIT license code ownership. You can download your project as a clean ZIP, sync with your GitHub repository, or deploy directly to Cloudflare Pages, Vercel, or custom VPS servers.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We support global cards via Stripe (Visa, Mastercard, Amex, Apple Pay), instant UPI in India (6202442690@jio), PayPal Global (paypal.me/signhify), and direct wire transfer (Jio Payments Bank, Piyush Raj Singh, A/C 000521712140642, IFSC JIOP0000001).",
  },
  {
    q: "Can I use my own API keys (BYOK)?",
    a: "Absolutely. Signhify includes a client-side AES-256 encryption key vault. You can plug in your own Anthropic Claude 3.7, OpenAI GPT-4.5, or DeepSeek R1 API keys to generate code at raw provider cost.",
  },
];

function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Dynamic Credit Slider State
  const [sliderPrice, setSliderPrice] = useState<number>(50);

  // Calculated credits based on slider
  const calculatedCredits = useMemo(() => {
    if (sliderPrice <= 5) return 5;
    if (sliderPrice <= 50) return Math.round(5 + ((sliderPrice - 5) / (50 - 5)) * (75 - 5));
    if (sliderPrice <= 100) return Math.round(75 + ((sliderPrice - 50) / (100 - 50)) * (125 - 75));
    return Math.round(125 + ((sliderPrice - 100) / (200 - 100)) * (300 - 125));
  }, [sliderPrice]);

  // Lead modal state
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitLeadFn = useServerFn(submitLead);

  const handleOpenModal = (tierName: string) => {
    setSelectedTier(tierName);
    setModalOpen(true);
    setSubmitted(false);
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    try {
      await submitLeadFn({
        data: {
          name: name.trim() || "Founder",
          email: email.trim(),
          type: "saas",
          scope: selectedTier || "Studio Scale",
          budget: annual ? "annual" : "monthly",
          timeline: "instant-access",
          goals: ["ai-credits", "3d-builder"],
          message: `Plan: ${selectedTier} | Budget: $${sliderPrice}/mo | Credits: ${calculatedCredits}\n${notes}`,
        },
      });
      setSubmitted(true);
      toast.success("Request received! We will reach out within 2 hours.");
    } catch (err) {
      toast.error("Failed to submit request. Please reach out via WhatsApp directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] rounded-full blur-[170px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, rgba(74,222,128,0.04) 50%, transparent 80%)",
        }}
      />
      <div className="bg-grid-global" />
      <div className="bg-dots" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Breadcrumbs items={[{ label: "Pricing & AI Credits", to: "/pricing" }]} />

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mt-8 mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4ade80] mb-4 bg-[#22c55e]/10 px-3.5 py-1.5 rounded-full border border-[#22c55e]/25 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            <Zap size={11} className="text-[#22c55e]" /> $5 to $200/mo · Best Vibe Coding Value Guaranteed
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-5">
            Transparent pricing starting from <span className="text-[#22c55e]">$5/month</span>
          </h1>
          <p className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed">
            Get 5 AI credits for $5, scale up to 75 credits for $50, 125 credits for $100, and 300
            credits for $200. Full source code ownership, zero lock-in, and 3D scroll engine.
          </p>

          {/* Billing Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                !annual
                  ? "bg-[#22c55e] text-black font-bold shadow-[0_2px_12px_rgba(34,197,94,0.4)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                annual
                  ? "bg-[#22c55e] text-black font-bold shadow-[0_2px_12px_rgba(34,197,94,0.4)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Annual Billing
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-black/30 text-black">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* 4 Pricing Cards Grid ($5, $50, $100, $200) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
          {TIERS.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-7 flex flex-col justify-between transition-all duration-500 backdrop-blur-xl ${
                  tier.featured
                    ? "bg-[#080c16]/95 border-2 border-[#22c55e]/70 shadow-[0_20px_60px_rgba(34,197,94,0.22)] scale-[1.02]"
                    : "bg-[#080c16]/80 border border-white/[0.08] hover:border-white/[0.18] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#22c55e] text-black text-[10px] font-extrabold uppercase tracking-wider shadow-[0_4px_16px_rgba(34,197,94,0.5)]">
                    Most Chosen
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h2 className="text-lg font-bold text-white tracking-tight">{tier.name}</h2>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${tier.badgeColor}`}
                    >
                      {tier.tag}
                    </span>
                  </div>

                  {/* Price & Credit Count */}
                  <div className="mb-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                        ${price}
                      </span>
                      <span className="text-white/50 text-xs">/ month</span>
                    </div>
                  </div>

                  {/* Credits Highlight Pill */}
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#4ade80]">
                      <Sparkles size={12} className="text-[#22c55e]" />
                      {tier.creditsLabel}
                    </span>
                  </div>

                  <p className="text-white/60 text-xs leading-relaxed mb-6 pb-6 border-b border-white/[0.06]">
                    {tier.desc}
                  </p>

                  {/* Feature Checklist */}
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed"
                      >
                        <Check
                          size={14}
                          className="shrink-0 mt-0.5 text-[#22c55e]"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    onClick={() => handleOpenModal(tier.name)}
                    className={`w-full py-3.5 px-5 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      tier.featured
                        ? "btn-moonlit agent-glass-shine text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.35)]"
                        : "bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white hover:border-[#22c55e]/40"
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Interactive Credit & Budget Calculator Slider ──────────── */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#080c16]/90 backdrop-blur-xl p-8 sm:p-10 mb-20 shadow-[0_15px_50px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#4ade80] bg-[#22c55e]/10 px-3 py-1 rounded-full border border-[#22c55e]/25 mb-2 inline-block">
                Dynamic Credit Calculator
              </span>
              <h3 className="font-display text-2xl font-bold text-white">
                Customize your monthly credit volume ($5 - $200+)
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-1">
                Drag the slider to match your exact monthly build requirements and team size.
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-white/50">Calculated Plan</div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-[#4ade80]">
                ${sliderPrice} <span className="text-xs text-white/50">/ month</span>
              </div>
            </div>
          </div>

          <div className="py-8 space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-white/60">
              <span>$5 (5 Credits)</span>
              <span>$50 (75 Credits)</span>
              <span>$100 (125 Credits)</span>
              <span>$200 (300 Credits)</span>
            </div>

            <input
              type="range"
              min={5}
              max={200}
              step={5}
              value={sliderPrice}
              onChange={(e) => setSliderPrice(Number(e.target.value))}
              className="w-full h-3 bg-white/[0.08] rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-white/50">Monthly AI Credits</div>
                  <div className="text-lg font-bold text-white">{calculatedCredits} Credits</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                  <Layers size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-white/50">3D Scroll Builds</div>
                  <div className="text-lg font-bold text-white">
                    {Math.max(1, Math.round(calculatedCredits / 2))} Sites
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/30 flex items-center justify-center text-[#22c55e]">
                  <Cpu size={18} />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-white/50">Agent Swarm Hours</div>
                  <div className="text-lg font-bold text-white">
                    {Math.round(calculatedCredits * 1.5)} Hours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Competitor Comparison Matrix (Lovable, Bolt, Replit, Cursor) ── */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#080c16]/90 backdrop-blur-xl p-8 sm:p-10 mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#4ade80] bg-[#22c55e]/10 px-3 py-1 rounded-full border border-[#22c55e]/25 mb-2 inline-block">
              Market Benchmark
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Why Signhify outclasses other platforms
            </h3>
            <p className="text-white/60 text-xs sm:text-sm mt-1">
              We charge less than industry peers while delivering cinematic 3D motion and true code ownership.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-xs font-mono uppercase text-white/50">
                  <th className="py-4 px-4">Feature / Capability</th>
                  <th className="py-4 px-4 text-[#4ade80] font-bold bg-[#22c55e]/10 rounded-t-xl">
                    Signhify
                  </th>
                  <th className="py-4 px-4">Lovable.dev</th>
                  <th className="py-4 px-4">Bolt.new</th>
                  <th className="py-4 px-4">Replit</th>
                  <th className="py-4 px-4">Cursor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {COMPETITOR_COMPARISON.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-white/90">{row.feature}</td>
                    <td className="py-4 px-4 font-bold text-[#4ade80] bg-[#22c55e]/5">
                      {row.signhify}
                    </td>
                    <td className="py-4 px-4 text-white/60">{row.lovable}</td>
                    <td className="py-4 px-4 text-white/60">{row.bolt}</td>
                    <td className="py-4 px-4 text-white/60">{row.replit}</td>
                    <td className="py-4 px-4 text-white/60">{row.cursor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global & Indian Payment Rails */}
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/[0.06] pb-6 mb-6">
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-1">
                Flexible Global &amp; Indian Payment Rails
              </h3>
              <p className="text-white/50 text-xs">
                Zero friction onboarding. Instant activation across all major currencies.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-mono">
                💳 Stripe / Apple Pay
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-mono">
                ⚡ UPI / Instant
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-mono">
                🌐 PayPal / Bank Wire
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-white/70">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <CreditCard size={13} className="text-[#22c55e]" /> UPI Instant (India)
              </div>
              <p className="font-mono text-white/90 text-[11px] select-all bg-black/40 p-2 rounded-lg mt-1 border border-white/[0.04]">
                6202442690@jio
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <DollarSign size={13} className="text-[#22c55e]" /> PayPal Global
              </div>
              <p className="font-mono text-white/90 text-[11px] select-all bg-black/40 p-2 rounded-lg mt-1 border border-white/[0.04]">
                paypal.me/signhify
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <Building size={13} className="text-[#22c55e]" /> Direct Bank Wire
              </div>
              <p className="font-mono text-white/90 text-[10px] select-all bg-black/40 p-2 rounded-lg mt-1 border border-white/[0.04]">
                A/C 000521712140642 · IFSC JIOP0000001 (Piyush Raj Singh)
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4ade80] mb-3 bg-[#22c55e]/10 px-3 py-1.5 rounded-full border border-[#22c55e]/25">
              <HelpCircle size={11} className="text-[#22c55e]" /> Billing &amp; Credits FAQ
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white/90 hover:text-white"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={15}
                      className={`shrink-0 transition-transform duration-300 text-white/40 ${
                        isOpen ? "rotate-180 text-[#22c55e]" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="p-5 pt-0 text-xs text-white/60 leading-relaxed border-t border-white/[0.04]">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Capture Modal */}
        <AnimatePresence>
          {modalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#080c16] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
              >
                {!submitted ? (
                  <>
                    <h3 className="font-display text-xl font-bold text-white mb-1">
                      Start with {selectedTier}
                    </h3>
                    <p className="text-white/60 text-xs mb-6">
                      Leave your work email. We'll set up your AI credit allocation immediately.
                    </p>

                    <form onSubmit={handleSubmitLead} className="space-y-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                          Your Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs outline-none focus:border-[#22c55e]/60"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                          Work Email
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs outline-none focus:border-[#22c55e]/60"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1.5">
                          Project Brief / Requirements
                        </label>
                        <textarea
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="What are we building or deploying?"
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs outline-none focus:border-[#22c55e]/60 resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white/70"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="flex-1 py-3 rounded-xl btn-moonlit font-bold text-xs flex items-center justify-center gap-2 text-black"
                        >
                          {submitting ? <Loader2 size={13} className="animate-spin" /> : "Confirm Plan"}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 size={42} className="text-[#22c55e] mx-auto mb-3" />
                    <h3 className="font-display text-xl font-bold text-white mb-2">Plan Confirmed!</h3>
                    <p className="text-white/60 text-xs mb-6">
                      We've queued your {selectedTier} activation. Look out for our confirmation email.
                    </p>
                    <button
                      onClick={() => setModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-bold text-white"
                    >
                      Done
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
