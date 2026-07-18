import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import articles from "../../public/help-articles.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Signhify | AI Product Studio" },
      {
        name: "description",
        content:
          "Search Signhify help articles for onboarding, AI Studio, marketplace, billing, and deployment guidance.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/help" },
      { property: "og:title", content: "Help — Signhify" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/help" }],
  }),
  component: HelpPage,
});
function HelpPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () => articles.filter((a) => (a.title + a.excerpt).toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  const cats = [...new Set(filtered.map((a) => a.category))];
  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <a
          href="https://docs.signhify.dpdns.org"
          className="block rounded-2xl border border-primary/30 bg-primary/10 p-5 text-primary"
        >
          Visit full docs at docs.signhify.dpdns.org
        </a>
        <h1 className="mt-8 font-display text-5xl font-black">Help Center</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search help articles…"
          className="mt-8 w-full rounded-full border border-border bg-surface px-5 py-3 text-sm outline-none"
        />
        {cats.map((cat) => (
          <div key={cat} className="mt-8">
            <h2 className="font-display text-2xl font-bold">{cat}</h2>
            <Accordion type="single" collapsible className="mt-3">
              {filtered
                .filter((a) => a.category === cat)
                .map((a) => (
                  <AccordionItem key={a.slug} value={a.slug}>
                    <AccordionTrigger>{a.title}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{a.excerpt}</p>
                      <p className="mt-3">{a.content}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
        ))}
      </div>
    </section>
  );
}
