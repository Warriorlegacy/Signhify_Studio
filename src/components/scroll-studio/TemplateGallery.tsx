import {
  LayoutTemplate,
  Sparkles,
  Plus,
  ChevronRight,
  Eye,
  Copy,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { createScrollStudioProject } from "@/lib/scroll-studio-projects.functions";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { useState } from "react";
import { TemplateThumbnail } from "@/components/templates/TemplateThumbnail";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory, type TemplateItem } from "@/lib/templates-data";

export function TemplateGallery({ onSelectProject }: { onSelectProject: (id: string) => void }) {
  const { user } = useUser();
  const createProjectFn = useServerFn(createScrollStudioProject);
  const [isCreating, setIsCreating] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("All");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates =
    activeCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleSelectTemplate = async (template: TemplateItem) => {
    if (!user) {
      toast.error("You must be logged in to create a project.");
      return;
    }

    setIsCreating(template.id);
    try {
      const project = await createProjectFn({
        data: {
          title: `${template.name} Site`,
          initialPrompt: template.godLevelPrompt,
        },
      });
      toast.success(`Project created with ${template.name}!`);
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
          title: "Blank 3D Canvas",
          initialPrompt: "Start with a blank cinematic 3D scroll canvas.",
        },
      });
      toast.success("Blank project created!");
      onSelectProject(project.id);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create project");
    } finally {
      setIsCreating(null);
    }
  };

  const handleCopyPrompt = (template: TemplateItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(template.godLevelPrompt);
    setCopiedId(template.id);
    toast.success("God-Level Prompt copied to clipboard!");
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="w-full h-full p-6 sm:p-10 lg:p-12 overflow-y-auto bg-[#030712] text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/30 bg-[#22c55e]/10 px-3 py-1.5 text-xs font-semibold text-[#4ade80]">
            <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
            3D Preset &amp; God-Level Prompt Gallery
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Start from a proven 3D cinematic template
          </h2>
          <p className="text-white/60 text-sm max-w-3xl leading-relaxed">
            Every template includes an exhaustive god-level prompt, 3D particle shaders, 60 FPS
            scroll scrub interpolation, and production architecture. Pick any template to customize
            or start from scratch.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[#22c55e] text-black font-bold shadow-[0_0_12px_rgba(34,197,94,0.35)]"
                  : "bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {/* Blank Canvas Card */}
          <div
            className="group relative rounded-2xl border border-white/[0.08] bg-[#080c16] hover:bg-white/[0.04] p-6 flex flex-col justify-between cursor-pointer transition-all hover:border-[#22c55e]/50 shadow-md"
            onClick={handleCreateBlank}
          >
            <div className="w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center mb-6">
              <Plus className="w-6 h-6 text-white/70 group-hover:text-[#22c55e] transition-colors" />
            </div>
            <div>
              <div className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#4ade80] mb-1">
                Custom Build
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Blank 3D Canvas</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Start from an empty canvas and write your own custom prompt.
              </p>
            </div>
            {isCreating === "blank" && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                <div className="flex items-center text-sm font-medium text-[#4ade80]">
                  <Sparkles className="w-4 h-4 mr-2 animate-spin text-[#22c55e]" /> Creating canvas...
                </div>
              </div>
            )}
          </div>

          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group relative rounded-2xl border border-white/[0.08] bg-[#080c16] hover:bg-white/[0.03] flex flex-col justify-between cursor-pointer transition-all hover:border-[#22c55e]/50 overflow-hidden shadow-lg"
              onClick={() => handleSelectTemplate(template)}
            >
              {/* Template Thumbnail Visual */}
              <TemplateThumbnail
                id={template.id}
                name={template.name}
                thumbnail={template.thumbnail}
                gradient={template.gradient}
                category={template.category}
                frames={template.frames}
                badge={template.badge}
                aspectRatio="video"
                interactive={true}
              />

              <div className="relative z-10 p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">{template.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-[#4ade80] transition-colors line-clamp-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-white/60 mb-4 line-clamp-2 leading-relaxed">
                    {template.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {template.features.slice(0, 2).map((feat) => (
                    <span
                      key={feat}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-white/60 line-clamp-1"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.06] flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs bg-white/[0.04] hover:bg-white/[0.1] border-white/[0.1] text-white"
                  onClick={(e) => handleCopyPrompt(template, e)}
                  title="Copy God-Level Prompt"
                >
                  {copiedId === template.id ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] mr-1" />
                  ) : (
                    <Terminal className="w-3.5 h-3.5 text-[#22c55e] mr-1" />
                  )}
                  Prompt
                </Button>
                <Button
                  size="sm"
                  className="flex-1 h-8 text-xs btn-moonlit agent-glass-shine text-black font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTemplate(template);
                  }}
                  disabled={isCreating === template.id}
                >
                  {isCreating === template.id ? (
                    <Sparkles className="w-3.5 h-3.5 mr-1 animate-spin" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 mr-1" />
                  )}
                  Use Template
                </Button>
              </div>

              {isCreating === template.id && (
                <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="flex items-center text-sm font-bold text-[#4ade80]">
                    <Sparkles className="w-4 h-4 mr-2 animate-spin text-[#22c55e]" /> Initializing {template.name}...
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
