import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, MessageCircle, Phone } from "lucide-react";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a call — Signhify" },
      {
        name: "description",
        content:
          "Pick a 30-minute slot with Piyush Raj Singh. We scope your idea, map the build, and decide if Signhify is the right team to ship it.",
      },
      { property: "og:title", content: "Book a call — Signhify" },
      {
        property: "og:description",
        content: "30 minutes with the Signhify founder to scope your build.",
      },
      { property: "og:url", content: "https://signhify.online/book" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.online/book" }],
  }),
  component: BookPage,
});

const CAL_URL = "https://calendly.com/signhify/30min";
const WHATSAPP = "https://wa.me/916202442690?text=Hi%20Signhify%2C%20I%27d%20like%20to%20discuss%20a%20build.";

function BookPage() {
  return (
    <section className="relative pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Book the studio</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black max-w-3xl">
          30 minutes. <span className="text-gradient">A real plan.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
          Pick a slot below. We&rsquo;ll scope the idea, map a build, and decide if Signhify is the
          right team to ship it. No deck. No script.
        </p>

        <div className="mt-10 grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
            <iframe
              title="Book a call with Signhify"
              src={CAL_URL}
              className="w-full h-[720px] border-0 bg-background"
              loading="lazy"
            />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary mb-3">
                <CalendarClock size={16} />
              </div>
              <div className="font-display font-semibold">What we cover</div>
              <ul className="mt-2 text-sm text-muted-foreground space-y-1.5">
                <li>· Your idea, in your words</li>
                <li>· Scope, stack and timeline</li>
                <li>· Honest pricing range</li>
                <li>· Whether AI agents fit the build</li>
              </ul>
            </div>

            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 mb-3">
                <MessageCircle size={16} />
              </div>
              <div className="font-display font-semibold">Prefer WhatsApp?</div>
              <div className="mt-1 text-sm text-muted-foreground">
                Ping <span className="font-mono text-foreground">+91 62024 42690</span> and we&rsquo;ll
                pick it up.
              </div>
            </a>

            <a
              href="tel:+916202442690"
              className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary mb-3">
                <Phone size={16} />
              </div>
              <div className="font-display font-semibold">Call directly</div>
              <div className="mt-1 text-sm text-muted-foreground">+91 62024 42690</div>
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
