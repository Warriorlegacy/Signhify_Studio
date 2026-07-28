import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Bot,
  Code2,
  LayoutDashboard,
  Megaphone,
  Workflow,
  Sparkles,
  Cpu,
  Network,
  Cloud,
  LineChart,
  Smartphone,
  Lock,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ThreeDCard } from "@/components/ui/ThreeDCard";

const services = [
  {
    icon: Bot,
    name: "AI Automation",
    desc: "Custom agents, workflows and integrations that remove operational friction — from inbox to invoicing.",
    image: "/images/services/ai-automation.png",
    accent: "oklch(0.72 0.21 45)",
    featured: true,
  },
  {
    icon: Cpu,
    name: "AI & LLM Integrations",
    desc: "RAG pipelines, semantic search, vector databases, and custom fine-tuned model agents.",
    image: "/images/services/ai-integrations.png",
    accent: "oklch(0.78 0.16 70)",
    featured: true,
  },
  {
    icon: Code2,
    name: "SaaS Development",
    desc: "Multi-tenant products built to scale — auth, billing, dashboards, infra.",
    image: "/images/services/saas-development.png",
    accent: "oklch(0.72 0.18 250)",
  },
  {
    icon: LayoutDashboard,
    name: "Web & Product",
    desc: "Cinematic websites, MVPs and product surfaces engineered for conversion.",
    image: "/images/services/web-product.png",
    accent: "oklch(0.74 0.18 320)",
  },
  {
    icon: Workflow,
    name: "CRM & Systems",
    desc: "Internal tools, CRMs and pipelines tailored to how your business actually runs.",
    image: "/images/services/crm-systems.png",
    accent: "oklch(0.7 0.16 130)",
  },
  {
    icon: Network,
    name: "API Engineering",
    desc: "High-throughput REST & GraphQL endpoints, webhooks, and secure third-party integrations.",
    image: "/images/services/api-engineering.png",
    accent: "oklch(0.65 0.18 200)",
  },
  {
    icon: Cloud,
    name: "Cloud & DevOps",
    desc: "Scalable hosting (AWS, Supabase, Vercel), continuous delivery, and load scaling.",
    image: "/images/services/cloud-devops.png",
    accent: "oklch(0.7 0.16 50)",
  },
  {
    icon: LineChart,
    name: "Data & Analytics",
    desc: "Real-time reporting pipelines, database tracking, and custom metrics engines.",
    image: "/images/services/data-analytics.png",
    accent: "oklch(0.72 0.21 45)",
  },
  {
    icon: Smartphone,
    name: "Mobile App Development",
    desc: "React Native and Flutter apps built for speed, offline capability, and App Store readiness.",
    image: "/images/services/mobile-development.png",
    accent: "oklch(0.7 0.15 90)",
  },
  {
    icon: Megaphone,
    name: "Performance Marketing",
    desc: "Landing pages, funnels and paid acquisition systems that compound over time.",
    image: "/images/services/performance-marketing.png",
    accent: "oklch(0.68 0.2 20)",
  },
  {
    icon: Lock,
    name: "Security & Compliance",
    desc: "SOC2 readiness, penetration testing, secure auth policy, and data encryption audits.",
    image: "/images/services/security-compliance.png",
    accent: "oklch(0.62 0.18 260)",
  },
  {
    icon: Sparkles,
    name: "Brand & Identity",
    desc: "Visual systems, logos and creative direction for AI-first brands that want to be remembered.",
    image: "/images/services/brand-identity.png",
    accent: "oklch(0.74 0.18 350)",
  },
];

export function ServicesSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      aria-labelledby="services-heading"
    >
      {/* Depth background — parallax ember orbs */}
      <motion.div style={{ y: bgY }} aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-[-5%] top-[10%] w-[40vw] h-[40vw] rounded-full blur-3xl opacity-25"
          style={{
            background: "radial-gradient(circle, oklch(0.72 0.21 45 / 0.5), transparent 70%)",
          }}
        />
        <div
          className="absolute right-[-5%] bottom-[5%] w-[30vw] h-[30vw] rounded-full blur-3xl opacity-20"
          style={{
            background: "radial-gradient(circle, oklch(0.78 0.16 70 / 0.4), transparent 70%)",
          }}
        />
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 relative">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary mb-3"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary-glow)]" />
              What we do
            </motion.div>
            <motion.h2
              id="services-heading"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl font-bold max-w-2xl"
            >
              One studio. <span className="text-gradient">End-to-end</span> execution.
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3 max-w-sm"
          >
            <p className="text-muted-foreground leading-relaxed">
              Twelve core capabilities, one team. We stitch them together to ship outcomes — not
              deliverables.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4 w-fit"
            >
              Explore all services <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </div>

        {/* Featured row — 2 large cards */}
        <div className="grid sm:grid-cols-2 gap-5 mb-5">
          {services
            .filter((s) => s.featured)
            .map((s, i) => (
              <ServiceCard key={s.name} s={s} i={i} large />
            ))}
        </div>

        {/* Remaining 10 — 3-col grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services
            .filter((s) => !s.featured)
            .map((s, i) => (
              <ServiceCard key={s.name} s={s} i={i + 2} />
            ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  s,
  i,
  large = false,
}: {
  s: (typeof services)[number];
  i: number;
  large?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(8px)", scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.32, 0.72, 0, 1] }}
      className="group relative rounded-[1.75rem] p-1.5 bg-white/5 border border-white/10 backdrop-blur-xl hover:border-primary/40 transition-all duration-500 shadow-(--shadow-card)"
    >
      <ThreeDCard className="relative bg-card rounded-[calc(1.75rem-0.375rem)] border border-white/5 overflow-hidden flex flex-col h-full">
        {/* Service preview image */}
        <div
          className={`relative overflow-hidden ${large ? "aspect-video" : "aspect-16/10"} w-full shrink-0`}
        >
          <img
            src={s.image}
            alt={`${s.name} service preview`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          {/* Category badge */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-foreground">
            <span className="h-1 w-1 rounded-full" style={{ background: s.accent }} />
            {s.name}
          </div>
          {/* Shimmer line on hover */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="relative p-5 flex flex-col gap-2 flex-1">
          {/* Accent glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${s.accent}14, transparent 65%)`,
            }}
          />
          <div className="relative flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg border shrink-0 transition-colors duration-300"
              style={{
                backgroundColor: `color-mix(in oklch, ${s.accent} 12%, transparent)`,
                borderColor: `color-mix(in oklch, ${s.accent} 28%, transparent)`,
                color: s.accent,
              }}
            >
              <s.icon size={16} />
            </div>
            <div className="font-display text-base font-semibold leading-tight">{s.name}</div>
          </div>
          <p className="relative text-xs text-muted-foreground leading-relaxed">{s.desc}</p>

          {/* Bottom hover glow line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </ThreeDCard>
    </motion.div>
  );
}
