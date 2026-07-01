import {
  LayoutTemplate,
  Sparkles,
  ShoppingCart,
  Briefcase,
  Plus,
  Bot,
  Wallet,
  Truck,
  Mail,
  ChevronRight,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { createScrollStudioProject } from "@/lib/scroll-studio-projects.functions";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { useState } from "react";

const TEMPLATES = [
  {
    id: "saas-dark",
    name: "SaaS Dark",
    description:
      "Cinematic dark mode landing for software products with hero video and feature cards.",
    icon: LayoutTemplate,
    gradient: "from-blue-600/20 to-purple-600/20",
    tags: ["SaaS", "Dark", "3D"],
    category: "SaaS",
    prompt:
      "Create a cinematic dark SaaS landing page with a full-screen hero video, liquid-glass navbar, feature cards with icons, pricing section, and CTA. Use deep navy background with teal accents.",
  },
  {
    id: "power-ai",
    name: "Power AI",
    description:
      "Full-screen dark AI landing with hero video, gradient headline, and logo marquee.",
    icon: Bot,
    gradient: "from-indigo-600/20 via-purple-600/20 to-amber-500/20",
    tags: ["AI", "Dark", "Video Hero"],
    category: "AI",
    prompt:
      "Build a full-screen dark AI landing page with CloudFront hero video, 220px headline with indigo-to-purple-to-amber AI gradient, liquid-glass navbar, logo marquee, and requestAnimationFrame fade loop.",
  },
  {
    id: "ecommerce-light",
    name: "E-Commerce Light",
    description: "Clean, high-end product showcase with smooth scroll transitions.",
    icon: ShoppingCart,
    gradient: "from-emerald-500/20 to-teal-400/20",
    tags: ["E-Commerce", "Light", "Minimal"],
    category: "E-Commerce",
    prompt:
      "Create a clean high-end e-commerce landing with product showcase cards, smooth scroll transitions, pastel color scheme, 3D object highlights, and a checkout CTA section.",
  },
  {
    id: "halo-usd",
    name: "Halo — Fintech",
    description:
      "Premium fintech stablecoin landing with hero video, savings cards, and backers marquee.",
    icon: Wallet,
    gradient: "from-cyan-500/20 to-blue-400/20",
    tags: ["Fintech", "Premium", "Stablecoin"],
    category: "Fintech",
    prompt:
      "Build a premium fintech stablecoin landing on light background with TT Norms Pro typography, hero video, savings feature cards, backers/partner marquee, and commerce use-case panel.",
  },
  {
    id: "targo-logistics",
    name: "Targo — Logistics",
    description:
      "Logistics hero with bold typography, brand red on black, fullscreen video, and glass consultation card.",
    icon: Truck,
    gradient: "from-red-500/20 to-orange-500/20",
    tags: ["Logistics", "Bold", "Video"],
    category: "Logistics",
    prompt:
      "Create a logistics hero page with Rubik typography, brand red #EE3F2C on black, fullscreen CloudFront video without overlay, clipped-corner CTAs, and a glass consultation card.",
  },
  {
    id: "mindloop-newsletter",
    name: "Mindloop — Newsletter",
    description:
      "Black monochrome newsletter landing with liquid-glass UI, scroll word reveal, and platform cards.",
    icon: Mail,
    gradient: "from-gray-600/20 to-zinc-500/20",
    tags: ["Newsletter", "Monochrome", "Glass"],
    category: "Newsletter",
    prompt:
      "Build a black monochrome newsletter landing with liquid-glass UI, scroll word reveal animation, platform integration cards, and HLS CTA video section.",
  },
  {
    id: "portfolio-creative",
    name: "Creative Portfolio",
    description: "Vibrant and interactive gallery for designers and agencies.",
    icon: Briefcase,
    gradient: "from-orange-500/20 to-pink-500/20",
    tags: ["Portfolio", "Creative", "Colorful"],
    category: "Portfolio",
    prompt:
      "Create a vibrant creative portfolio with interactive gallery, scroll-triggered animations, project case studies, and a contact form. Use warm gradients and bold typography.",
  },
  {
    id: "auto-machines",
    name: "Auto Machines",
    description:
      "Full-viewport black hero with lazy 3D, gradient headline, technical specs card, and mono pill badges.",
    icon: Bot,
    gradient: "from-violet-600/20 to-fuchsia-500/20",
    tags: ["Automation", "Dark", "Technical"],
    category: "AI",
    prompt:
      "Build a full-viewport black hero with lazy Spline 3D, Orbitron gradient headline, technical specs card, mono pill badges, and a request specs section.",
  },
];

const CATEGORIES = [
  "All",
  "SaaS",
  "AI",
  "E-Commerce",
  "Fintech",
  "Logistics",
  "Newsletter",
  "Portfolio",
];

export function TemplateGallery({ onSelectProject }: { onSelectProject: (id: string) => void }) {
  const { user } = useUser();
  const createProjectFn = useServerFn(createScrollStudioProject);
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filteredTemplates =
    activeCategory === "All" ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleSelectTemplate = async (template: (typeof TEMPLATES)[number]) => {
    if (!user) {
      toast.error("You must be logged in to create a project.");
      return;
    }

    setIsCreating(template.id);
    try {
      const project = await createProjectFn({
        data: {
          title: `${template.name} Site`,
          initialPrompt: template.prompt,
        },
      });
      toast.success("Project created!");
      onSelectProject(project.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    } finally {
      setIsCreating(null);
    }
  };

  const handleCreateBlank = async () => {
    if (!user) {
      toast.error("You must be logged in to create a project.");
      return;
    }

    setIsCreating("blank");
    try {
      const project = await createProjectFn({
        data: {
          title: "Blank Project",
          initialPrompt: "Start with a blank cinematic canvas.",
        },
      });
      toast.success("Project created!");
      onSelectProject(project.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    } finally {
      setIsCreating(null);
    }
  };

  return (
    <div className="w-full h-full p-12 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            Preset Gallery
          </div>
          <h2 className="text-3xl font-display font-bold">Start from a proven design</h2>
          <p className="text-muted-foreground max-w-2xl">
            Every preset is inspired by a real customer — their brief, their industry, their visual
            taste. Pick one, make it yours, ship it.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Blank Canvas Card */}
          <div
            className="group relative rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/50 p-6 flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50"
            onClick={handleCreateBlank}
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Blank Canvas</h3>
              <p className="text-sm text-muted-foreground">
                Start from scratch and describe what you want.
              </p>
            </div>
            {isCreating === "blank" && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="flex items-center text-sm font-medium text-primary">
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" /> Creating...
                </div>
              </div>
            )}
          </div>

          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/50 p-6 flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50 overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${template.gradient} opacity-20 transition-opacity group-hover:opacity-40`}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
                  <template.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(previewTemplate === template.id ? null : template.id);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template);
                  }}
                  disabled={isCreating === template.id}
                >
                  {isCreating === template.id ? (
                    <Sparkles className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <ChevronRight className="w-3 h-3 mr-1" />
                  )}
                  Use This
                </Button>
              </div>

              {isCreating === template.id && (
                <div className="absolute inset-0 z-20 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="flex items-center text-sm font-medium text-primary">
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" /> Generating {template.name}...
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
