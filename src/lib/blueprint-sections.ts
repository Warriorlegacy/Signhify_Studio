/**
 * The section stack a blueprint ships with, by category.
 *
 * These describe the page structure buyers get — not invented marketing claims.
 * Every blueprint published through Scroll Studio follows one of these stacks.
 */

export type BlueprintSection = { name: string; detail: string };

const BASE: BlueprintSection[] = [
  { name: "Hero", detail: "Headline, sub-line and the primary call to action, above the fold." },
  { name: "Proof strip", detail: "Logos, counts or short credibility lines under the hero." },
  { name: "What it does", detail: "Three to four benefit blocks with icons and short copy." },
  { name: "How it works", detail: "A numbered walkthrough of the flow, step by step." },
  { name: "Pricing", detail: "Tiered plans with feature lists and a highlighted option." },
  { name: "FAQ", detail: "Expandable answers to the objections buyers raise most." },
  { name: "Closing CTA", detail: "A final full-width call to action with the sign-up path." },
  { name: "Footer", detail: "Navigation, legal links and contact details." },
];

const BY_CATEGORY: Record<string, BlueprintSection[]> = {
  saas: [
    BASE[0]!,
    BASE[1]!,
    { name: "Feature tour", detail: "Alternating screenshot and copy blocks per core feature." },
    BASE[3]!,
    { name: "Integrations", detail: "A grid of the tools the product connects to." },
    BASE[4]!,
    BASE[5]!,
    BASE[6]!,
    BASE[7]!,
  ],
  ecommerce: [
    BASE[0]!,
    { name: "Product grid", detail: "Filterable cards with image, price and quick add." },
    { name: "Product detail", detail: "Gallery, variants, description and add-to-cart." },
    { name: "Reviews", detail: "Star summary plus individual customer reviews." },
    { name: "Cart & checkout", detail: "Line items, totals and the payment step." },
    BASE[5]!,
    BASE[7]!,
  ],
  agency: [
    BASE[0]!,
    BASE[1]!,
    { name: "Services", detail: "Cards for each service with scope and outcome." },
    { name: "Case studies", detail: "Selected work with the result for each client." },
    { name: "Process", detail: "The engagement timeline from brief to launch." },
    BASE[4]!,
    { name: "Booking", detail: "A contact or call-booking block wired to your inbox." },
    BASE[7]!,
  ],
  portfolio: [
    BASE[0]!,
    { name: "Selected work", detail: "A gallery of projects with cover images and tags." },
    { name: "Project detail", detail: "Full case layout with images, role and outcome." },
    { name: "About", detail: "Bio, skills and the tools you work in." },
    { name: "Contact", detail: "A short form plus your social links." },
    BASE[7]!,
  ],
};

export function blueprintSections(category?: string | null): BlueprintSection[] {
  const key = (category ?? "").toLowerCase();
  for (const [k, v] of Object.entries(BY_CATEGORY)) {
    if (key.includes(k)) return v;
  }
  return BASE;
}
