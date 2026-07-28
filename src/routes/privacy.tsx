import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy & Data Security Standards — Signhify Studio" },
      {
        name: "description",
        content:
          "How Signhify collects, uses and protects your data across the studio site, contact wizard and Signhify AI waitlist.",
      },
      {
        property: "og:title",
        content: "Privacy Policy & Data Security Standards — Signhify Studio",
      },
      {
        property: "og:description",
        content:
          "How Signhify collects, uses and protects your data across the studio site, contact wizard and Signhify AI waitlist.",
      },
      { property: "og:url", content: "https://signhify.dpdns.org/privacy" },
    ],
    links: [{ rel: "canonical", href: "https://signhify.dpdns.org/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="pt-32 pb-24 mx-auto max-w-3xl px-6 prose prose-invert prose-headings:font-display">
      <Breadcrumbs items={[{ label: "Privacy Policy", to: "/privacy" }]} />
      <div className="text-xs uppercase tracking-[0.25em] text-primary mb-3">Legal</div>
      <h1 className="font-display text-5xl font-black">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: June 5, 2026</p>

      <h2>1. Who we are</h2>
      <p>
        Signhify is an AI engineering studio operated by Piyush Raj Singh, registered as an MSME
        with the Government of India (UDYAM). Contact:{" "}
        <a href="mailto:Piyushrajsingh092@gmail.com">Piyushrajsingh092@gmail.com</a>.
      </p>

      <h2>2. What we collect</h2>
      <ul>
        <li>
          <strong>Studio leads</strong> — name, email, optional company, project scope, budget,
          timeline and goals submitted through the contact wizard.
        </li>
        <li>
          <strong>AI waitlist</strong> — email and (optionally) the prompt you typed on the{" "}
          <code>/ai</code> page.
        </li>
        <li>
          <strong>Analytics</strong> — aggregate page views, device class and referrer. No
          third-party advertising cookies.
        </li>
      </ul>

      <h2>3. How we use it</h2>
      <p>
        Only to respond to your enquiry, deliver the service you asked for, and notify you when
        Signhify AI ships. We do not sell, rent, or share your data with third parties for
        marketing.
      </p>

      <h2>4. Where it lives</h2>
      <p>
        Data is stored on Supabase (EU/US regions) with row-level security enabled. Only Signhify
        staff with a service-role key can read it. Backups are encrypted at rest.
      </p>

      <h2>5. Your rights</h2>
      <p>
        Email <a href="mailto:Piyushrajsingh092@gmail.com">Piyushrajsingh092@gmail.com</a> to
        access, correct or delete your data. We will respond within 7 days.
      </p>

      <h2>6. Cookies</h2>
      <p>
        We use first-party cookies only for session and theme preference. Embedded Calendly or
        WhatsApp links may set their own cookies subject to their respective privacy policies.
      </p>

      <h2>7. Changes</h2>
      <p>
        We will post material changes here and update the date above. Continued use of the site
        after a change means you accept the updated policy.
      </p>
    </article>
  );
}
