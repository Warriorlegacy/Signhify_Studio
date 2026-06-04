import { motion } from "framer-motion";
import {
  Bot, Code2, LayoutDashboard, Megaphone, Workflow, Sparkles,
} from "lucide-react";

const services = [
  {
    icon: Bot,
    name: "AI Automation",
    desc: "Custom agents, workflows and integrations that remove operational friction.",
  },
  {
    icon: Code2,
    name: "SaaS Development",
    desc: "Multi-tenant products built to scale — auth, billing, dashboards, infra.",
  },
  {
    icon: LayoutDashboard,
    name: "Web & Product",
    desc: "Cinematic websites, MVPs and product surfaces engineered for conversion.",
  },
  {
    icon: Workflow,
    name: "CRM & Systems",
    desc: "Internal tools, CRMs and pipelines tailored to how your business actually runs.",
  },
  {
    icon: Megaphone,
    name: "Performance Marketing",
    desc: "Landing pages, funnels and paid acquisition systems that compound.",
  },
  {
    icon: Sparkles,
    name: "Brand & Identity",
    desc: "Visual systems, logos and creative direction for AI-first brands.",
  },
];

export function ServicesSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
              What we do
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold max-w-2xl">
              One studio. End-to-end product execution.
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Six capabilities, one team. We stitch them together to ship outcomes —
            not deliverables.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 rounded-2xl overflow-hidden border border-border">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative bg-background p-8 hover:bg-surface/60 transition"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 border border-primary/30 text-primary">
                <s.icon size={20} />
              </div>
              <div className="mt-5 font-display text-xl font-semibold">{s.name}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
