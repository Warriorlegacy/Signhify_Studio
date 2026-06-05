import { Link } from "@tanstack/react-router";
import { BadgeCheck, Code2, Link2, Mail } from "lucide-react";
import logoAsset from "@/assets/signhify-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-background">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2 space-y-5">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="" className="h-10 w-10 rounded-full ring-1 ring-primary/40" />
            <div>
              <div className="font-display font-bold text-lg">Signhify</div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                AI Engineering Studio
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Describe your idea. Signhify builds it. We design, ship, and scale AI-first
            products end-to-end — from MVP to revenue.
          </p>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
            <BadgeCheck size={14} className="text-primary" />
            Registered MSME · Govt. of India (UDYAM)
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold mb-4">Studio</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/projects" className="hover:text-foreground">Projects</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/vision" className="hover:text-foreground">Vision 2030</Link></li>
            <li><Link to="/roadmap" className="hover:text-foreground">Roadmap</Link></li>
            <li><Link to="/book" className="hover:text-foreground">Book a call</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold mb-4">Connect</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <a href="https://linkedin.com/in/piyushraj-singh" target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 hover:text-foreground">
                <Link2 size={14} /> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://github.com/Warriorlegacy" target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 hover:text-foreground">
                <Code2 size={14} /> GitHub
              </a>
            </li>
            <li>
              <a href="mailto:hello@signhify.online"
                 className="inline-flex items-center gap-2 hover:text-foreground">
                <Mail size={14} /> hello@signhify.online
              </a>
            </li>
            <li>
              <a href="https://wa.me/916202442690" target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-2 hover:text-foreground">
                <Link2 size={14} /> WhatsApp · +91 62024 42690
              </a>
            </li>
            <li className="pt-3 border-t border-border/60 flex gap-4">
              <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground">Terms</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Signhify · Built by Piyush Raj Singh</div>
          <div className="font-mono">signhify.online</div>
        </div>
      </div>
    </footer>
  );
}
