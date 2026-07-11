import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateAIResponseFor } from "./ai-gateway.server";
import { BYOKRequiredError } from "./ai-access.server";


type GenerateInput = { prompt: string };

type PlanSection = { title: string; bullets: string[] };
export type GeneratedPlan = {
  productName: string;
  oneLiner: string;
  sections: PlanSection[];
  stack: string[];
  providerUsed?: string;
  tokensUsed?: number;
};

function validate(input: unknown): GenerateInput {
  const obj = input as Record<string, unknown>;
  const prompt = typeof obj?.prompt === "string" ? obj.prompt.trim() : "";
  if (prompt.length < 4 || prompt.length > 1200) {
    throw new Error("Prompt must be between 4 and 1200 characters.");
  }
  return { prompt };
}

const SYSTEM = `You are Signhify AI, a six-agent product studio (Product Strategist, System Architect, UI/UX Designer, Frontend Engineer, Backend Engineer, Deployment).
Given a single product idea, return a concise build plan as STRICT JSON matching this TypeScript type:
{ "productName": string, "oneLiner": string, "sections": { "title": string, "bullets": string[] }[], "stack": string[] }
- 6 sections, one per agent, in the order listed above.
- 3 to 5 bullets per section, each <= 140 characters, no markdown.
- "stack" is a flat list of 5-8 technologies.
- Output ONLY the JSON object. No prose, no code fences.`;

export const generatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => validate(input))
  .handler(async ({ context, data }): Promise<GeneratedPlan> => {
    const { supabase, userId, claims } = context;
    const email = (claims as { email?: string | null } | undefined)?.email ?? null;
    try {
      const { content, providerUsed } = await generateAIResponseFor(
        {
          messages: [
            { role: "system", content: SYSTEM },
            { role: "user", content: data.prompt },
          ],
          temperature: 0.6,
          response_format: { type: "json_object" },
        },
        { supabase, userId, email },
      );

      const parsed = JSON.parse(content) as GeneratedPlan;
      parsed.providerUsed = providerUsed;
      parsed.tokensUsed = 0;

      if (
        parsed?.productName &&
        parsed?.oneLiner &&
        Array.isArray(parsed?.sections) &&
        Array.isArray(parsed?.stack)
      ) {
        return parsed;
      }

      throw new Error("Incomplete plan returned by AI.");
    } catch (e) {
      // BYOK gate must surface to the UI — never silently fall back to mock.
      if (e instanceof BYOKRequiredError || (e as { code?: string })?.code === "BYOK_REQUIRED") {
        throw e;
      }
      console.warn(
        "[ai] AI Gateway failed or returned invalid JSON. Falling back to local mock generator.",
        e,
      );
      return generateLocalMockPlan(data.prompt);
    }
  });


function generateLocalMockPlan(prompt: string): GeneratedPlan {
  const p = prompt.toLowerCase();

  let productName = "Custom App Space";
  let oneLiner = "A bespoke cloud solution designed around your product brief.";
  let stack = ["TanStack Start", "Supabase", "Tailwind CSS", "Vite", "Resend"];

  let strategBullets = [
    "Define core user personas and primary conversion goal.",
    "Draft high-fidelity wireframes focusing on clean, minimal UI layout.",
    "Outline phased release timeline targeting MVP features first.",
    "Define success metrics and key performance indicators (KPIs).",
    "Research competitor landscape and identify unique value proposition.",
  ];
  let archBullets = [
    "Design database schema with proper relational keys and indexing strategy.",
    "Configure secure Supabase RLS (Row Level Security) policies for data protection.",
    "Optimize query performance with indexed views and connection pooling.",
    "Design microservices architecture for scalability and maintainability.",
    "Plan API rate limiting and caching strategies for optimal performance.",
  ];
  let designBullets = [
    "Establish harmonious dark/light mode CSS design system tokens with CSS variables.",
    "Map key typography settings using premium font scales (Space Grotesk and Inter).",
    "Design fluid card components utilizing smooth 3D parallax hover states and animations.",
    "Create responsive breakpoints for mobile, tablet, and desktop experiences.",
    "Implement accessibility standards (WCAG 2.1) for inclusive design.",
  ];
  const frontBullets = [
    "Create type-safe layouts and dynamic routing via TanStack Router with route loading states.",
    "Build interactive components utilizing spring physics (framer-motion) for natural interactions.",
    "Optimize asset loader pipelines for perfect Core Web Vitals score with code splitting.",
    "Implement state management with TanStack Query for efficient data synchronization.",
    "Add offline capabilities with service workers for progressive enhancement.",
  ];
  const backBullets = [
    "Develop robust TanStack Start server functions with input validation and error handling.",
    "Integrate webhook handlers to receive notifications from partner platforms with retry logic.",
    "Implement rate limiting guards on all public client-facing actions using token bucket algorithm.",
    "Design database connection pooling and query optimization for high throughput.",
    "Add comprehensive logging and monitoring with structured logging and health checks.",
  ];
  const deployBullets = [
    "Configure CI/CD pipelines with automated testing, security scanning, and deployment automation.",
    "Set up Cloudflare Workers edge caching layer with intelligent cache invalidation.",
    "Wire up automated SSL validation and custom DNS mapping with zero-downtime renewals.",
    "Implement blue-green deployment strategy for zero-downtime releases.",
    "Set up comprehensive observability with metrics, logs, and distributed tracing.",
  ];

  if (p.includes("gym") || p.includes("crm") || p.includes("fit")) {
    productName = "GymFlow CRM";
    oneLiner =
      "Multi-tenant operating system for fitness centers and gyms with member management, class scheduling, and payment processing.";
    stack = ["React", "Next.js", "Supabase", "Stripe", "Tailwind CSS", "TypeScript"];
    strategBullets = [
      "Target gym owners looking to replace legacy fragmented billing tools with integrated solution.",
      "Map out user journeys for front-desk managers, members, and owners with role-based access control.",
      "Design flexible pricing model separating membership tiers, class packages, and personal training add-ons.",
      "Implement member progress tracking and goal setting features for engagement.",
      "Add community features like challenges and leaderboards to increase retention.",
    ];
    archBullets = [
      "Create tables for memberships, check-ins, classes, payments, members, and trainers with proper relationships.",
      "Establish tenant isolation layer using Row Level Security (RLS) policies for multi-tenancy.",
      "Integrate Stripe Webhooks to sync invoice status changes in real-time with idempotency handling.",
      "Design read replicas for reporting analytics to prevent performance impact on operational queries.",
      "Plan backup and disaster recovery strategy with point-in-time recovery capabilities.",
    ];
    designBullets = [
      "Choose a bold, high-contrast dark palette with energetic orange accents for high energy motivation.",
      "Build bento-grid dashboards showcasing daily check-in charts, attendance trends, and revenue metrics.",
      "Design minimal check-in scanner interface optimized for mobile views with camera permission handling.",
      "Create member portal with profile management, booking history, and payment methods.",
      "Implement accessible color contrast and font sizing for users with visual impairments.",
    ];
  } else if (p.includes("ecommerce") || p.includes("store") || p.includes("shop")) {
    productName = "ShopFlow Ecommerce";
    oneLiner =
      "Complete ecommerce platform for online stores with product catalog, cart, checkout, and order management.";
    stack = ["React", "Next.js", "Supabase", "Stripe", "Tailwind CSS", "TypeScript"];
    strategBullets = [
      "Target entrepreneurs and small businesses needing complete online store solution.",
      "Map customer journey from product discovery to post-purchase support and reviews.",
      "Design comprehensive product catalog with categories, filters, search, and recommendations.",
      "Implement abandoned cart recovery and email marketing automation for conversion optimization.",
      "Add multi-vendor marketplace capabilities for platform scalability.",
    ];
    archBullets = [
      "Create tables for products, categories, orders, order items, customers, payments, and inventory.",
      "Design flexible product variant system for sizes, colors, and customizable attributes.",
      "Integrate multiple payment gateways (Stripe, PayPal) with PCI DSS compliance.",
      "Implement inventory management with real-time stock levels and low stock alerts.",
      "Plan search optimization with full-text search and faceted filtering for large catalogs.",
    ];
    designBullets = [
      "Choose clean, trustworthy palette with brandable accent colors for product highlighting.",
      "Create product grid and list views with quick add-to-cart and wishlist functionality.",
      "Design streamlined one-page checkout with guest checkout and account creation options.",
      "Build admin dashboard for inventory management, order fulfillment, and sales analytics.",
      "Implement responsive design with mobile-first approach for shopping on any device.",
    ];
  }

  return {
    productName,
    oneLiner,
    sections: [
      { title: "Product Strategist", bullets: strategBullets },
      { title: "System Architect", bullets: archBullets },
      { title: "UI/UX Designer", bullets: designBullets },
      { title: "Frontend Engineer", bullets: frontBullets },
      { title: "Backend Engineer", bullets: backBullets },
      { title: "Deployment Agent", bullets: deployBullets },
    ],
    stack,
  };
}

export const savePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const obj = input as Record<string, unknown>;
    const prompt = typeof obj?.prompt === "string" ? obj.prompt : "";
    const plan = obj?.plan as GeneratedPlan | undefined;
    if (!prompt) throw new Error("Prompt is required.");
    if (!plan || !plan.productName) throw new Error("Plan is required.");
    return { prompt, plan };
  })
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { prompt, plan } = data;

    const { data: row, error } = await (supabase as any)
      .from("ai_sessions")
      .insert({
        prompt,
        response: plan as any,
        user_id: userId,
        provider_used: plan.providerUsed ?? null,
        tokens_used: plan.tokensUsed ?? null,
      })
      .select("id")
      .single();
    if (error) {
      console.error("[savePlan] failed:", error);
      throw new Error(error.message);
    }
    return { id: row.id as string };
  });

export const getSavedPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const id = (input as Record<string, unknown>)?.id;
    if (typeof id !== "string" || !id.trim()) throw new Error("Session ID is required.");
    return { id: id.trim() };
  })
  .handler(
    async ({
      context,
      data,
    }): Promise<{ prompt: string; plan: GeneratedPlan; userId: string | null } | null> => {
      const { supabase, userId } = context;
      const { data: row, error } = await supabase
        .from("ai_sessions")
        .select("prompt, response, user_id")
        .eq("id", data.id)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) {
        console.error("[getSavedPlan] failed:", error);
        throw new Error(error.message);
      }
      if (!row) return null;
      return {
        prompt: row.prompt as string,
        plan: row.response as GeneratedPlan,
        userId: row.user_id as string | null,
      };
    },
  );
