import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageSquare, Sparkles, CheckCircle2, Loader2, Send } from "lucide-react";
import { EmberParticles } from "@/components/EmberParticles";
import { submitLead } from "@/lib/leads.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

const TRUST_SIGNALS = [
  "14+ products shipped",
  "Multi-tenant SaaS",
  "AI-first engineering",
  "Delivered in weeks",
];

const QUICK_TYPES = [
  { id: "SaaS / Product", label: "AI SaaS MVP", desc: "2-Week Deployed App" },
  { id: "AI Builder / Agents", label: "Autonomous Agent Swarm", desc: "Multi-Agent Workflows" },
  { id: "Full Stack App", label: "Full Stack Custom Web App", desc: "TanStack + Supabase" },
  { id: "Digital Marketing", label: "AI Growth & Marketing", desc: "SEO + AEO Campaign" },
];

const BUDGET_TIERS = [
  "$299 - Starter Sprint",
  "$799 - Agent Swarm",
  "$1,499 - Enterprise MVP",
  "$4,999+ - Custom Ecosystem",
];

export function CtaSection() {
  const submitLeadFn = useServerFn(submitLead);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState("SaaS / Product");
  const [selectedBudget, setSelectedBudget] = useState("$799 - Agent Swarm");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid work email address.");
      return;
    }

    setSubmitting(true);
    try {
      await submitLeadFn({
        data: {
          name: name.trim() || email.split("@")[0],
          email: email.trim(),
          company: "",
          type: selectedType,
          scope: selectedType,
          budget: selectedBudget,
          timeline: "2 weeks",
          goals: [selectedType],
          message: message.trim() || `Instant homepage sprint inquiry for ${selectedType}`,
        },
      });
      setSubmitted(true);
      toast.success("Sprint scope submitted! Piyush will reach out within 2 hours.");
    } catch (err: any) {
      console.error("Lead submission error:", err);
      toast.error(
        err.message || "Failed to send lead. Please email Piyushrajsingh092@gmail.com directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Ember radial backdrop */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-ember)" }} />
      {/* Grid layer */}
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30" />
      {/* Ember particles for depth */}
      <EmberParticles count={20} />

      {/* Animated border pulse ring */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-[600px] h-[600px] rounded-full border border-primary/30"
        />
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.07, 0.16, 0.07] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute w-[800px] h-[800px] rounded-full border border-primary/20"
        />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        {/* Trust chips */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap justify-center gap-2"
        >
          {TRUST_SIGNALS.map((s) => (
            <span
              key={s}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary"
            >
              <span className="h-1 w-1 rounded-full bg-primary" />
              {s}
            </span>
          ))}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl sm:text-6xl font-black leading-[1.05]"
        >
          Your idea, <span className="text-gradient">Signhified.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Scope your idea, pick your budget, and get a production-ready AI product deployed to your
          infrastructure in 14 days.
        </motion.p>

        {!showForm ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={() => setShowForm(true)}
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-[0_0_60px_-8px_var(--primary-glow)] hover:brightness-110 transition cursor-pointer"
            >
              <Sparkles size={18} />
              Instant Sprint Scoper
              <ArrowRight size={18} className="group-hover:translate-x-0.5 transition" />
            </button>
            <Link
              to="/book"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-surface/50 backdrop-blur px-8 py-4 text-base font-semibold hover:border-primary/50 hover:bg-surface/70 transition"
            >
              <MessageSquare size={18} className="text-primary" />
              Book a 10-Min Call
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="mt-10 mx-auto max-w-2xl text-left rounded-3xl border border-white/15 bg-card/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl"
          >
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold font-display">Sprint Scope Received!</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you, <strong className="text-foreground">{name || email}</strong>. Piyush
                  Raj Singh (Founder & Lead AI Engineer) is reviewing your scope for{" "}
                  <strong className="text-primary">{selectedType}</strong>.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <a
                    href="https://wa.me/916202442690?text=Hi%20Piyush,%20I%20just%20submitted%20a%20Sprint%20Scope%20on%20Signhify!"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition"
                  >
                    💬 Direct WhatsApp Chat
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setShowForm(false);
                    }}
                    className="rounded-xl border border-white/10 px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div>
                    <h3 className="font-display text-xl font-bold flex items-center gap-2">
                      <Sparkles className="text-primary h-5 w-5" /> Instant Sprint Scoper
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Select your build parameters to receive a 2-hour scope guarantee.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    1. Select Build Category
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {QUICK_TYPES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedType(t.id)}
                        className={`p-3 rounded-xl border text-left transition ${
                          selectedType === t.id
                            ? "border-primary bg-primary/10 text-foreground shadow-[0_0_20px_-5px_var(--primary-glow)]"
                            : "border-border/60 bg-surface/40 hover:border-border text-muted-foreground"
                        }`}
                      >
                        <div className="text-xs font-bold">{t.label}</div>
                        <div className="text-[10px] opacity-70 mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                    2. Select Target Budget Tier
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {BUDGET_TIERS.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBudget(b)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition ${
                          selectedBudget === b
                            ? "border-primary bg-primary/15 text-primary"
                            : "border-border/50 bg-surface/30 text-muted-foreground hover:border-border"
                        }`}
                      >
                        {b.split(" - ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-surface/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-border/80 bg-surface/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    Brief Product Idea (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. AI-powered invoice parser with Supabase auth and Stripe billing..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-border/80 bg-surface/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4" /> Submitting Scope...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Submit Scope & Book 2-Week Sprint
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* Micro social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-6 text-xs text-muted-foreground"
        >
          No commitment. 100% Code Ownership on your GitHub from Day One.
        </motion.p>
      </div>
    </section>
  );
}
