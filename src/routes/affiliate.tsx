import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ArrowRight, DollarSign, Users, Share2, Wallet, Check, ChevronDown } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/affiliate")({
  head: () => ({
    meta: [
      { title: "Signhify Affiliate Program — Earn 20% Commission on Every Referral" },
      {
        name: "description",
        content:
          "Join the Signhify affiliate program and earn 20% commission on every referral. Share your link, get paid via PayPal, UPI, or bank transfer. Start earning with AI.",
      },
      { property: "og:title", content: "Earn Money with AI — Signhify Affiliate Program" },
      {
        property: "og:description",
        content: "Earn 20% recurring commissions by referring developers and founders to Signhify.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/affiliate" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/affiliate" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "QAPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "How does the Signhify affiliate program work?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sign up for free, get your unique referral link, and earn 20% commission on every referred customer's first purchase. You also earn 10% on renewals. Payouts via PayPal, UPI, or bank transfer.",
              },
            },
            {
              "@type": "Question",
              name: "What commission rate does Signhify offer affiliates?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Affiliates earn 20% commission on the referred customer's first purchase and 10% on subscription renewals.",
              },
            },
            {
              "@type": "Question",
              name: "How do I get paid as a Signhify affiliate?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Payouts are processed via PayPal, UPI (India), or bank transfer. Minimum payout threshold is $50.",
              },
            },
            {
              "@type": "Question",
              name: "Who can join the Signhify affiliate program?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Anyone with an audience in tech, AI, SaaS, or startup space — content creators, developers, YouTubers, bloggers, agency owners, and freelancers.",
              },
            },
            {
              "@type": "Question",
              name: "Is there a cost to join the affiliate program?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "No. Joining the Signhify affiliate program is completely free. You just need a free Signhify account to get started.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: AffiliatePage,
});

const STEPS = [
  {
    icon: Users,
    title: "Sign up free",
    desc: "Create your Signhify account in 30 seconds. No credit card needed.",
  },
  {
    icon: Share2,
    title: "Share your link",
    desc: "Get a unique affiliate code and share it with your audience.",
  },
  {
    icon: DollarSign,
    title: "Earn commissions",
    desc: "Get paid 20% on first purchases, 10% on renewals.",
  },
];

const BENEFITS = [
  "20% commission on every referred customer's first purchase",
  "10% on subscription renewals — recurring income",
  "Real-time referral tracking dashboard",
  "PayPal, UPI, and bank transfer payouts",
  "Dedicated affiliate support",
  "Promotional assets and banners provided",
];

const FAQ = [
  {
    q: "How do I get my unique referral link?",
    a: "After signing up and joining the affiliate program, you'll get a unique code and referral link in your affiliate dashboard. Share it anywhere — social media, YouTube, blog posts, or your newsletter.",
  },
  {
    q: "When do I get paid?",
    a: "Payouts are processed within 7 days after the referred customer's payment clears. The minimum payout threshold is $50. Payments are sent via PayPal, UPI, or bank transfer.",
  },
  {
    q: "What counts as a qualified referral?",
    a: "A qualified referral is a new customer who signs up using your affiliate link and makes a paid purchase (credit pack, sprint, or studio engagement). Self-referrals are not permitted.",
  },
  {
    q: "Can I promote Signhify on YouTube or social media?",
    a: "Absolutely. We encourage content creators to share their experience working with Signhify. We provide banners, copy templates, and promo materials. Just don't use paid ads on branded search terms.",
  },
  {
    q: "Is there a cookie duration for referrals?",
    a: "Yes. Referral cookies last 90 days. If someone clicks your link and purchases within 90 days, you earn the commission.",
  },
];

function AffiliatePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-ember)" }}
        />
        <div className="absolute inset-0 bg-grid mask-fade-edges opacity-30 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Breadcrumbs items={[{ label: "Affiliate Program", to: "/affiliate" }]} />
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
            Earn with Signhify
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black">
            Earn <span className="text-gradient">20% commission</span>
            <br />
            on every referral
          </h1>
          <p className="mt-5 max-w-2xl mx-auto text-muted-foreground text-lg">
            Join the Signhify affiliate program. Share your unique link with founders, developers,
            and startups who need AI-powered product development — and earn recurring commissions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              search={{ redirect: "/affiliate" }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px(var(--primary-glow))] hover:brightness-110 transition"
            >
              Join the program <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-24 border-t border-border">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            How it works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Three steps to start <span className="text-gradient">earning</span>
          </h2>
          <div className="mt-14 grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="text-center"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-5">
                  <s.icon size={28} className="text-primary" />
                </div>
                <div className="font-display text-xl font-bold">{s.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission structure */}
      <section className="relative py-24 border-t border-border bg-card/30">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">
                Commission structure
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">
                Earn more as your network grows
              </h2>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                Every customer you refer generates recurring income. We handle the product, support,
                and payments — you just share your link.
              </p>
              <div className="mt-8 space-y-4">
                <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-5 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold">First purchase</div>
                    <div className="text-xs text-muted-foreground">
                      On any credit pack or sprint
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gradient">20%</div>
                </div>
                <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-5 flex items-center justify-between">
                  <div>
                    <div className="font-display font-bold">Renewals</div>
                    <div className="text-xs text-muted-foreground">
                      Subscription renewals &amp; repeat purchases
                    </div>
                  </div>
                  <div className="text-2xl font-black text-gradient">10%</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur p-7">
              <div className="flex items-center gap-3 mb-5">
                <Wallet size={20} className="text-primary" />
                <div className="font-display text-lg font-bold">Payout methods</div>
              </div>
              <ul className="space-y-3">
                {[
                  "PayPal — global payouts",
                  "Bank Transfer — direct to your account",
                  "UPI — instant transfers for India",
                ].map((m) => (
                  <li key={m} className="flex items-center gap-3 text-sm">
                    <Check size={14} className="text-primary shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
                Min. payout: $50 · Paid within 7 days of cleared payment
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative py-24 border-t border-border">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            Why join
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Everything you need to <span className="text-gradient">succeed</span>
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-3 rounded-xl border border-border bg-card/60 backdrop-blur p-4"
              >
                <Check size={16} className="text-primary mt-0.5 shrink-0" />
                <span className="text-sm">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-24 border-t border-border">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3 text-center">
            FAQ
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-center">
            Affiliate program questions
          </h2>
          <div className="mt-12 space-y-3">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div
                  key={i}
                  initial={false}
                  className="rounded-xl border border-border bg-card/80 backdrop-blur overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-xl"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display font-semibold text-base">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown size={18} className="text-muted-foreground" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-20 border-t border-border">
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{ background: "var(--gradient-ember)" }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Ready to start <span className="text-gradient">earning</span>?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Join hundreds of affiliates earning 20% on every referral. Free to join, no minimums.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/signup"
              search={{ redirect: "/affiliate" }}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-6px_var(--primary-glow)] hover:brightness-110 transition"
            >
              Join the program — It's Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
