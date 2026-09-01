import React from "react";
import { HelpCircle, Sparkles, Compass } from "lucide-react";
import { useTour, TourStep } from "@/hooks/useTour";

interface OnboardingTourLauncherProps {
  tourId: string;
  steps: TourStep[];
  label?: string;
  autoStart?: boolean;
  className?: string;
}

export function OnboardingTourLauncher({
  tourId,
  steps,
  label = "Quick Tour",
  autoStart = false,
  className = "",
}: OnboardingTourLauncherProps) {
  const { startTour, isRunning } = useTour({
    tourId,
    steps,
    autoStart,
  });

  return (
    <button
      onClick={startTour}
      disabled={isRunning}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all duration-200 shadow-sm active:scale-95 group ${className}`}
      title="Start guided onboarding walkthrough"
    >
      <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      <span>{label}</span>
    </button>
  );
}

// ==========================================
// Predefined Signhify Studio Tours
// ==========================================
export const SIGNHIFY_AI_STUDIO_STEPS: TourStep[] = [
  {
    popover: {
      title: "Welcome to Signhify Studio ✨",
      description:
        "Your autonomous 6-agent AI engineering powerhouse. Let's take a 30-second tour of how to generate and ship full-stack applications.",
      side: "over",
    },
  },
  {
    element: "#prompt-input-box",
    popover: {
      title: "1. Natural Language Prompt 📝",
      description:
        "Describe your SaaS MVP, CRM, marketplace, or internal tool in plain English. You can also pick from one-click preset templates.",
      side: "bottom",
    },
  },
  {
    element: "#agent-pipeline-tracker",
    popover: {
      title: "2. Autonomous Agent Fleet 🤖",
      description:
        "Watch the 6 specialized agents orchestrate: Product Strategist → System Architect → UI/UX → Codegen → Review → Deployment.",
      side: "top",
    },
  },
  {
    element: "#byok-security-badge",
    popover: {
      title: "3. Enterprise BYOK Security 🔐",
      description:
        "Zero data retention. Plug your own OpenAI, Anthropic, Gemini, or Groq keys stored safely in client-side memory.",
      side: "left",
    },
  },
  {
    element: "#export-download-btn",
    popover: {
      title: "4. One-Click ZIP Export 📦",
      description:
        "Download complete production-ready source code with schemas, Tailwind styles, and runnable files.",
      side: "left",
    },
  },
];
