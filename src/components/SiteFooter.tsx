import { Link } from "@tanstack/react-router";
import { BadgeCheck, Camera, Code2, Link2, Mail } from "lucide-react";
import { SignhifyLogo } from "@/components/SignhifyLogo";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <SignhifyLogo size={40} showTile className="shrink-0" />
            <div>
              <div className="font-stylish font-extrabold text-lg tracking-[-0.03em] text-foreground">Signhify</div>
              <div className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                AI Engineering Studio
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Describe your idea. Signhify builds it. We design, ship, and scale AI-first products
            end-to-end — from MVP to revenue.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
            <BadgeCheck size={14} className="text-primary" />
            Registered MSME · Govt. of India (UDYAM)
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold mb-4">Studio</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/ventures" className="hover:text-foreground text-emerald-400 font-medium">
                Ventures Lab (10 Live Apps)
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link to="/templates" className="hover:text-foreground">
                3D Templates & Prompts
              </Link>
            </li>
            <li>
              <Link to="/scroll-studio" className="hover:text-foreground">
                Scroll Studio Builder
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-foreground">
                Pricing & Credits ($5-$200)
              </Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-foreground">
                Projects
              </Link>
            </li>
            <li>
              <Link to="/ai" className="hover:text-foreground">
                AI Generator
              </Link>
            </li>
            <li>
              <Link to="/marketplace" className="hover:text-foreground">
                Marketplace
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About
              </Link>
            </li>
            <li>
              <Link to="/vision" className="hover:text-foreground">
                Vision 2030
              </Link>
            </li>
            <li>
              <Link to="/roadmap" className="hover:text-foreground">
                Roadmap
              </Link>
            </li>
            <li>
              <Link to="/insights" className="hover:text-foreground">
                Insights & AEO Playbooks
              </Link>
            </li>
            <li>
              <Link to="/brand" className="hover:text-foreground">
                Brand Entity
              </Link>
            </li>
            <li>
              <Link to="/help" className="hover:text-foreground">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/best-ai-engineering-studio" className="hover:text-foreground">
                AI Engineering Studio
              </Link>
            </li>
            <li>
              <Link to="/best-vibe-coding-platform" className="hover:text-foreground">
                Vibe-Coding Platform
              </Link>
            </li>
            <li>
              <Link to="/best-digital-marketing-studio" className="hover:text-foreground">
                Digital Marketing Studio
              </Link>
            </li>
            <li>
              <Link to="/saas-mvp" className="hover:text-foreground">
                SaaS MVP Development
              </Link>
            </li>
            <li>
              <Link to="/free-consultation" className="hover:text-foreground">
                Free Consultation
              </Link>
            </li>
            <li>
              <Link to="/book" className="hover:text-foreground">
                Book a call
              </Link>
            </li>
            <li>
              <Link to="/affiliate" className="hover:text-foreground">
                Affiliate Program
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold mb-4">Connect</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href="https://linkedin.com/in/piyushraj-singh"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Link2 size={14} /> LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com/piyushrajsingh.golu"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Camera size={14} /> Instagram
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Warriorlegacy"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Code2 size={14} /> GitHub
              </a>
            </li>
            <li>
              <a
                href="mailto:Piyushrajsingh092@gmail.com"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Mail size={14} /> Piyushrajsingh092@gmail.com
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/916202442690"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                <Link2 size={14} /> WhatsApp · +91 62024 42690
              </a>
            </li>
            <li className="pt-3 border-t border-border/60 flex gap-4">
              <Link to="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-foreground">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Signhify · Built by Piyush Raj Singh</div>
          <div className="font-mono">signhify.dpdns.org</div>
        </div>
      </div>
    </footer>
  );
}
