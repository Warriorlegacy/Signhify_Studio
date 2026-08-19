import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ArrowRight,
  ChevronDown,
  Shield,
  Code2,
  Zap,
  Mail,
  Loader2,
  CheckCircle2,
  Sparkles,
  Layers,
  HelpCircle,
  CreditCard,
  Building,
  DollarSign,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { submitLead } from "@/lib/leads.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "AI Product Studio Pricing & Development Plans — Signhify" },
      {
        name: "description",
        content:
          "Transparent pricing for AI product development. Choose 2-week fixed sprints, dedicated studio team retainers, or custom platform engineering.",
      },
      { property: "og:title", content: "AI Product Studio Pricing & Development Plans — Signhify" },
      {
        property: "og:description",
        content:
          "Sprint, Studio and Platform engagement models. Transparent pricing for AI-first product execution.",
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
          name: "AI Product Studio Pricing & Development Plans — Signhify",
          url: "https://signhify.dpdns.org/pricing",
          description:
            "Sprint, Studio and Platform engagement models for AI-first product execution.",
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

const TIERS = [
  {
    name: "Starter",
    tag: "Entry Pack",
    monthlyPrice: "$19",
    annualPrice: "$15",
    period: "/ month",
    desc: "Essential AI generation & 3D scroll builder access for solo creators and indie builders.",
    features: [
      "10 AI Generation Credits / month",
      "3D Scroll Studio Builder & Preview",
      "Client-Side BYOK AES-256 Key Vault",
      "Cloudflare Edge Deployment",
      "Full Source Code Ownership (MIT)",
      "Community & Email Support",
    ],
    cta: "Get Starter",
    featured: false,
    badgeColor: "bg-[#22c55e]/10 text-[#4ade80] border-[#22c55e]/20",
    glowColor: "rgba(34, 197, 94, 0.15)",
  },
  {
    name: "Studio",
    tag: "Most Chosen",
    monthlyPrice: "$49",
    annualPrice: "$39",
    period: "/ month",
    desc: "Unlimited AI generations, 6-agent swarm pipeline, and full-stack SaaS builder.",
    features: [
      "Unlimited AI Blueprint & Code Generations",
      "Full-Stack SaaS Builder (Auth + DB + Stripe)",
      "Cloudflare Pages & Worker Deploys",
      "BYOK AES-256 Vault + Managed AI Models",
      "Multi-file Project Export (ZIP + GitHub)",
      "Priority WhatsApp & Email Support",
    ],
    cta: "Upgrade to Studio",
    featured: true,
    badgeColor: "bg-[#22c55e]/20 text-[#22c55e] border-[#22c55e]/40",
    glowColor: "rgba(34, 197, 94, 0.35)",
  },
  {
    name: "Scale",
    tag: "Power Teams",
    monthlyPrice: "$99",
    annualPrice: "$79",
    period: "/ month",
    desc: "For fast-moving founders and agencies deploying multi-app suites and production SaaS.",
    features: [
      "Everything in Studio Plan",
      "Autonomous 6-Agent AI Swarm Orchestration",
      "Custom Domain Mapping & SSL",
      "Multi-Tenant Architecture & RLS Presets",
      "Direct Founder Line & Priority SLA",
      "Commercial Agency Reseller Rights",
    ],
    cta: "Scale Your SaaS",
    featured: false,
    badgeColor: "bg-white/10 text-white/90 border-white/20",
    glowColor: "rgba(255, 255, 255, 0.15)",
  },
];

const FAQ = [
  {
    q: "What's included in the Starter plan?",
    a: "Starter ($19/mo) gives you full access to the 3D Scroll Studio, BYOK AES-256 key encryption vault, Cloudflare edge deployments, and 10 managed AI generation credits per month. Code is 100% yours on GitHub.",
  },
  {
    q: "Can I upgrade or downgrade anytime?",
    a: "Yes. You can upgrade from Starter to Studio ($49/mo) or Scale ($99/mo) anytime from your billing dashboard with prorated billing. You can also cancel anytime with zero lock-in.",
  },
  {
    q: "Do you build on my tech stack or yours?",
    a: "We generate and build on modern open-source stacks — TanStack Start (React 19 SSR), Supabase PostgreSQL with Row-Level Security, Tailwind CSS, Stripe, and Cloudflare Workers.",
  },
  {
    q: "What happens after I export or deploy?",
    a: "You own 100% of the source code and infrastructure credentials. There is zero vendor lock-in. You can self-host anywhere or keep running on Cloudflare.",
  },
  {
    q: "How do payments work?",
    a: "We offer simple monthly and annual subscription plans ($19 Starter, $49 Studio, $99 Scale) with instant activation. We accept Stripe (credit/debit cards), UPI (6202442690@jio), PayPal (paypal.me/signhify), and direct bank transfer (A/C 000521712140642, Piyush Raj Singh, Jio Payments Bank, IFSC JIOP0000001).",
  },
  {
    q: "What if I need custom AI agents or 3D scroll experiences?",
    a: "Both are core studio capabilities. Our 3D scroll builder generates frame-interpolated parallax experiences, while our agent pipeline deploys multi-step LLM workflows with tool-calling and BYOK key vaults.",
  },
];

function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          scope: selectedTier || "Studio",
          budget: annual ? "annual" : "monthly",
          timeline: "2-weeks",
          goals: ["launch-mvp", "growth"],
          message: `Plan: ${selectedTier} | Billing: ${annual ? "Annual" : "Monthly"}\n${notes}`,
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
    <div className="min-h-screen bg-[#030712] text-white pt-24 pb-20 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,107,26,0.07) 0%, rgba(255,179,71,0.04) 50%, transparent 80%)",
        }}
      />
      <div className="bg-grid-global" />
      <div className="bg-dots" />

      <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
        <Breadcrumbs items={[{ label: "Pricing", to: "/pricing" }]} />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mt-8 mb-12">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4ade80] mb-4 bg-[#22c55e]/10 px-3.5 py-1.5 rounded-full border border-[#22c55e]/25">
            <Zap size={11} className="text-[#22c55e]" /> Transparent Pricing · 100% Code Ownership
          </span>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-5">
            Predictable plans for <span className="text-[#22c55e]">serious builders</span>
          </h1>
          <p className="text-white/70 text-[16px] md:text-[18px] leading-relaxed">
            No endless hourly billing. Pick a simple monthly subscription for your AI products, or
            scale to our dedicated swarm platform.
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

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-20">
          {TIERS.map((tier) => {
            const price = annual ? tier.annualPrice : tier.monthlyPrice;
            return (
              <div
                key={tier.name}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-500 backdrop-blur-xl ${
                  tier.featured
                    ? "bg-[#080c16]/95 border-2 border-[#22c55e]/60 shadow-[0_20px_60px_rgba(34,197,94,0.18)] scale-[1.02]"
                    : "bg-[#080c16]/80 border border-white/[0.08] hover:border-white/[0.18] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#22c55e] text-black text-[11px] font-extrabold uppercase tracking-wider shadow-[0_4px_16px_rgba(34,197,94,0.5)]">
                    Most Chosen
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <h2 className="text-xl font-bold text-white tracking-tight">{tier.name}</h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${tier.badgeColor}`}>
                      {tier.tag}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight">
                        {price}
                      </span>
                      <span className="text-white/50 text-xs">{tier.period}</span>
                    </div>
                  </div>

                  <p className="text-white/60 text-xs leading-relaxed mb-6 pb-6 border-b border-white/[0.06]">
                    {tier.desc}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-white/80 leading-relaxed">
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
                    className={`w-full py-3.5 px-6 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                      tier.featured
                        ? "btn-moonlit agent-glass-shine text-black hover:scale-[1.02]"
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

        {/* Payment Rails / Direct Transfer Info */}
        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl p-8 mb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/[0.06] pb-6 mb-6">
            <div>
              <h3 className="font-display text-xl font-bold text-white mb-1">
                Flexible Global &amp; Indian Payment Rails
              </h3>
              <p className="text-white/50 text-xs">
                Zero friction onboarding. Choose the rail that matches your currency.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-mono">
                💳 Stripe / Cards
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-mono">
                ⚡ UPI / Razorpay
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/70 text-xs font-mono">
                🌐 PayPal / Wire
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
                <Building size={13} className="text-[#22c55e]" /> Bank Wire (Direct)
              </div>
              <p className="font-mono text-white/90 text-[10px] select-all bg-black/40 p-2 rounded-lg mt-1 border border-white/[0.04]">
                A/C 000521712140642 · IFSC JIOP0000001
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#4ade80] mb-3 bg-[#22c55e]/10 px-3 py-1.5 rounded-full border border-[#22c55e]/25">
              <HelpCircle size={11} className="text-[#22c55e]" /> Common Questions
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
                      Leave your work email and brief. We'll reply within 2 hours to confirm kickoff.
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
                          Project Brief / Scope Notes
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
                          className="flex-1 py-3 rounded-xl btn-moonlit font-bold text-xs flex items-center justify-center gap-2"
                        >
                          {submitting ? <Loader2 size={13} className="animate-spin" /> : "Submit Request"}
                        </button>
                      </div>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle2 size={42} className="text-[#22c55e] mx-auto mb-3" />
                    <h3 className="font-display text-xl font-bold text-white mb-2">Request Received</h3>
                    <p className="text-white/60 text-xs mb-6">
                      We've queued your {selectedTier} project request. Look out for our confirmation email.
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
