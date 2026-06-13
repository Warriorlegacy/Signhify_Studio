import { createServerFn } from "@tanstack/react-start";
import { generateAIResponse } from "./ai-gateway.server";

type GenerateInput = { prompt: string };

type PlanSection = { title: string; bullets: string[] };
export type GeneratedPlan = {
  productName: string;
  oneLiner: string;
  sections: PlanSection[];
  stack: string[];
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
  .inputValidator((input: unknown) => validate(input))
  .handler(async ({ data }): Promise<GeneratedPlan> => {
    try {
      const content = await generateAIResponse({
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: data.prompt },
        ],
        temperature: 0.6,
        response_format: { type: "json_object" }
      });

      const parsed = JSON.parse(content) as GeneratedPlan;
      
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
      console.warn("[ai] AI Gateway failed or returned invalid JSON. Falling back to local mock generator.", e);
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
  ];
  let archBullets = [
    "Design database schema with proper relational keys.",
    "Configure secure Supabase RLS (Row Level Security) policies.",
    "Optimize query indexes to keep sub-100ms response latencies.",
  ];
  let designBullets = [
    "Establish harmonious dark/light mode CSS design system tokens.",
    "Map key typography settings using premium font scales (Space Grotesk).",
    "Design fluid card components utilizing smooth 3D parallax hover states.",
  ];
  const frontBullets = [
    "Create type-safe layouts and dynamic routing via TanStack Router.",
    "Build interactive components utilizing spring physics (framer-motion).",
    "Optimize asset loader pipelines for perfect Core Web Vitals score.",
  ];
  const backBullets = [
    "Develop robust TanStack Start server functions to isolate credentials.",
    "Integrate webhook handlers to receive notifications from partner platforms.",
    "Implement rate limiting guards on all public client-facing actions.",
  ];
  const deployBullets = [
    "Configure CI/CD pipelines to trigger builds on push to main branch.",
    "Set up Cloudflare Workers edge caching layer to optimize static pages.",
    "Wire up automated SSL validation and custom DNS mapping details.",
  ];

  if (p.includes("gym") || p.includes("crm") || p.includes("fit")) {
    productName = "GymFlow CRM";
    oneLiner = "Multi-tenant operating system for fitness centers and gyms.";
    stack = ["React", "Next.js", "Supabase", "Stripe", "Tailwind CSS"];
    strategBullets = [
      "Target gym owners looking to replace legacy fragmented billing tools.",
      "Map out user journeys for front-desk managers, members, and owners.",
      "Design flexible pricing model separating membership tiers and add-ons.",
    ];
    archBullets = [
      "Create tables for memberships, check-ins, classes, and payments.",
      "Establish tenant isolation layer using database filters.",
      "Integrate Stripe Webhooks to sync invoice status changes in real-time.",
    ];
    designBullets = [
      "Choose a bold, high-contrast dark palette with energetic orange accents.",
      "Build bento-grid dashboards showcasing daily check-in charts.",
      "Design minimal check-in scanner interface optimized for mobile views.",
    ];
  } else if (
    p.includes("ngo") ||
    p.includes("donate") ||
    p.includes("profit") ||
    p.includes("sewa")
  ) {
    productName = "Sewarth Path NGO Platform";
    oneLiner = "Unified digital hub for campaign tracking, volunteers, and donations.";
    stack = ["TanStack Start", "Supabase", "Razorpay", "Tailwind", "Resend"];
    strategBullets = [
      "Focus on transparency to increase donor trust and return rates.",
      "Build interactive dashboard showing live campaign impacts.",
      "Design quick-donate funnels with single-tap payment methods.",
    ];
    archBullets = [
      "Define schemas for campaigns, donations, and volunteer rosters.",
      "Configure webhooks to listen for Razorpay payment success states.",
      "Secure donor identity records with strict RLS policies.",
    ];
    designBullets = [
      "Select warm, welcoming HSL colors (soft emeralds and earth tones).",
      "Draft typography layouts emphasizing powerful project storytelling.",
      "Create custom progress indicators showing funding achievements.",
    ];
  } else if (p.includes("notion") || p.includes("workspace") || p.includes("doc")) {
    productName = "NebulaWorkspace";
    oneLiner = "AI-powered documentation and task organizer for distributed teams.";
    stack = ["React", "Supabase", "TipTap", "Clerk", "Tailwind CSS"];
    strategBullets = [
      "Target small remote teams seeking a faster, minimal Notion replacement.",
      "Detail collaborative editing and sharing flow structures.",
      "Plan offline-first sync capability checklist for future sprint.",
    ];
    archBullets = [
      "Implement document trees using recursive parent-child references.",
      "Configure real-time sync channel broadcasts via Supabase Realtime.",
      "Draft server functions to handle rich-text exports to markdown files.",
    ];
    designBullets = [
      "Implement a sleek glassmorphic sidebar layout with micro-animations.",
      "Establish typography system utilizing JetBrains Mono for blocks.",
      "Design fluid popup menus reactively aligning with selection offsets.",
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
  .handler(async ({ context, data }) => {
    // Require authentication
    if (!context.userId) throw new Error("Unauthorized");

    const { prompt, plan } = data;

    if (!prompt) throw new Error("Prompt is required.");
    if (!plan || !plan.productName) throw new Error("Plan is required.");

    const { supabase } = await import("@/integrations/supabase/client");
    const { data: row, error } = await supabase
      .from("ai_sessions")
      .insert({
        prompt: prompt,
        response: plan,
        user_id: context.userId, // Use authenticated user's ID
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
  .handler(
    async ({
      context,
      data,
    }): Promise<{ prompt: string; plan: GeneratedPlan; userId: string | null } | null> => {
      // Require authentication
      if (!context.userId) throw new Error("Unauthorized");

      const { id } = data;
      if (typeof id !== "string" || !id.trim()) {
        throw new Error("Session ID is required.");
      }

      const { supabase } = await import("@/integrations/supabase/client");
      const { data: row, error } = await supabase
        .from("ai_sessions")
        .select("prompt, response, user_id")
        .eq("id", id.trim())
        .eq("user_id", context.userId) // Ensure user owns the session
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
