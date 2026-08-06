import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarClock,
  MessageCircle,
  Phone,
  Sparkles,
  Send,
  CheckCircle2,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { submitLead } from "@/lib/leads.functions";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book an AI Engineering Call — Signhify Product Studio" },
      {
        name: "description",
        content:
          "Pick a 30-minute discovery call slot with Piyush Raj Singh. Scope your SaaS idea, map the tech stack, and get an execution blueprint.",
      },
      { property: "og:title", content: "Book an AI Engineering Call — Signhify Product Studio" },
      {
        property: "og:description",
        content: "30 minutes with the Signhify founder to scope your AI product build.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/book" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/book" }],
  }),
  component: BookPage,
});

const CAL_URL = "https://calendly.com/signhify/30min";
const WHATSAPP =
  "https://wa.me/916202442690?text=Hi%20Signhify%2C%20I%27d%20like%20to%20discuss%20a%20build.";

const TIME_SLOTS = [
  "10:00 AM IST (04:30 AM UTC)",
  "02:00 PM IST (08:30 AM UTC)",
  "05:00 PM IST (11:30 AM UTC)",
  "08:00 PM IST (02:30 PM UTC / 10:30 AM EST)",
  "10:30 PM IST (05:00 PM UTC / 01:00 PM EST)",
];

function BookPage() {
  const submitLeadFn = useServerFn(submitLead);
  const [tab, setTab] = useState<"form" | "calendly">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(TIME_SLOTS[3]);
  const [projectType, setProjectType] = useState("AI SaaS MVP");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
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
          type: projectType,
          scope: `Discovery Call Booking on ${date || "Next Available Slot"} at ${slot}`,
          budget: "$799 - Agent Swarm",
          timeline: "2 weeks",
          goals: [projectType],
          message: notes.trim() || `Booked discovery call slot: ${date || "Soonest"} ${slot}`,
        },
      });
      setSubmitted(true);
      toast.success("Discovery call requested! Piyush will confirm your calendar invite shortly.");
    } catch (err: any) {
      console.error("Booking error:", err);
      toast.error(err.message || "Failed to book slot. Please message Piyush on WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        <Breadcrumbs items={[{ label: "Book Call", to: "/book" }]} />
        <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Book the studio</div>
        <h1 className="font-display text-5xl sm:text-6xl font-black max-w-3xl">
          30 minutes. <span className="text-gradient">A real plan.</span>
        </h1>
        <p className="mt-5 max-w-2xl text-muted-foreground text-lg">
          Request a discovery slot or pick a Calendly time below. We&rsquo;ll scope the idea, map a
          build, and decide if Signhify is the right team to ship it. No deck. No script.
        </p>

        <div className="mt-8 flex gap-3 border-b border-border/60 pb-4">
          <button
            onClick={() => setTab("form")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
              tab === "form"
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_-4px_var(--primary-glow)]"
                : "border border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles size={14} /> Instant Booking Form (Direct)
          </button>
          <button
            onClick={() => setTab("calendly")}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition ${
              tab === "calendly"
                ? "bg-primary text-primary-foreground shadow-[0_0_20px_-4px_var(--primary-glow)]"
                : "border border-border/60 bg-surface/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarIcon size={14} /> Calendly Embed
          </button>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-6">
          {tab === "form" ? (
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-[var(--shadow-card)]">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-display">Call Slot Requested!</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    We received your request for{" "}
                    <strong className="text-foreground">{date || "Next Available Slot"}</strong> at{" "}
                    <strong className="text-primary">{slot}</strong>. Piyush Raj Singh will confirm
                    via Google Calendar invite.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <a
                      href={WHATSAPP}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition"
                    >
                      💬 Confirm Slot on WhatsApp
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="rounded-xl border border-white/10 px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground transition"
                    >
                      Book Another Slot
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="border-b border-border/50 pb-4">
                    <h3 className="font-display text-xl font-bold flex items-center gap-2">
                      <Sparkles className="text-primary h-5 w-5" /> Request a 30-Min Discovery Call
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Direct booking confirmed within 2 hours.
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-surface/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">
                        Project Category
                      </label>
                      <select
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="w-full rounded-xl border border-border/80 bg-surface/60 px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="AI SaaS MVP">AI SaaS MVP (2-Week Sprint)</option>
                        <option value="Autonomous Agent Swarm">Autonomous AI Agent Swarm</option>
                        <option value="Full Stack App">Full Stack Custom Web App</option>
                        <option value="Digital Marketing">AI Digital Marketing & Growth</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-2">
                      Preferred Time Slot
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TIME_SLOTS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSlot(s)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition ${
                            slot === s
                              ? "border-primary bg-primary/10 text-foreground font-semibold"
                              : "border-border/60 bg-surface/40 text-muted-foreground hover:border-border"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      What are you looking to build? (Optional)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Briefly describe your product idea, target audience, or stack questions..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
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
                        <Loader2 className="animate-spin h-4 w-4" /> Reserving Slot...
                      </>
                    ) : (
                      <>
                        <Send size={16} /> Request Discovery Call Slot
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[var(--shadow-card)]">
              <iframe
                title="Book a call with Signhify"
                src={CAL_URL}
                className="w-full h-[720px] border-0 bg-background"
                loading="lazy"
              />
            </div>
          )}

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
                Ping <span className="font-mono text-foreground">+91 62024 42690</span> and
                we&rsquo;ll pick it up.
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
