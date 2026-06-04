import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-ember)" }} />
      <div className="absolute inset-0 bg-grid mask-fade-edges opacity-40" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-display text-4xl sm:text-6xl font-black leading-[1.05]">
          Your success, <span className="text-gradient">Signhified.</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          One call. We&rsquo;ll scope your idea, map the stack, and tell you exactly
          what it takes to ship it.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-md bg-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_60px_-8px_var(--primary-glow)] hover:brightness-110 transition"
          >
            Book a discovery call
            <ArrowRight size={18} className="group-hover:translate-x-0.5 transition" />
          </Link>
        </div>
      </div>
    </section>
  );
}
