import { LayoutTemplate, Sparkles, ShoppingCart, Briefcase, Plus } from "lucide-react";
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
    description: "Cinematic dark mode landing page for software products.",
    icon: LayoutTemplate,
    gradient: "from-blue-600/20 to-purple-600/20",
    tags: ["SaaS", "Dark", "3D"]
  },
  {
    id: "ecommerce-light",
    name: "E-Commerce Light",
    description: "Clean, high-end product showcase with smooth transitions.",
    icon: ShoppingCart,
    gradient: "from-emerald-500/20 to-teal-400/20",
    tags: ["E-Commerce", "Light", "Minimal"]
  },
  {
    id: "portfolio-creative",
    name: "Creative Portfolio",
    description: "Vibrant and interactive gallery for designers and agencies.",
    icon: Briefcase,
    gradient: "from-orange-500/20 to-pink-500/20",
    tags: ["Portfolio", "Creative", "Colorful"]
  }
];

export function TemplateGallery({ onSelectProject }: { onSelectProject: (id: string) => void }) {
  const { user } = useUser();
  const createProjectFn = useServerFn(createScrollStudioProject);
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const handleSelectTemplate = async (templateId: string, templateName: string) => {
    if (!user) {
      toast.error("You must be logged in to create a project.");
      return;
    }
    
    setIsCreating(templateId);
    try {
      const project = await createProjectFn({
        data: {
          title: `${templateName} Site`,
          initialPrompt: `Create a cinematic landing page using the ${templateName} template style.`,
          userId: user.id
        }
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
          userId: user.id
        }
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
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="w-3.5 h-3.5" />
            Template Gallery
          </div>
          <h2 className="text-3xl font-display font-bold">Start your cinematic journey</h2>
          <p className="text-muted-foreground max-w-2xl">
            Choose a starting point for your immersive 3D scroll experience, or start from a blank canvas and let AI build it for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            className="group relative rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/50 p-6 flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50"
            onClick={handleCreateBlank}
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-6">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Blank Canvas</h3>
              <p className="text-sm text-muted-foreground">Start from scratch and use natural language to build your site piece by piece.</p>
            </div>
            {isCreating === "blank" && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                <div className="flex items-center text-sm font-medium text-primary">
                  <Sparkles className="w-4 h-4 mr-2 animate-spin" /> Creating...
                </div>
              </div>
            )}
          </div>

          {TEMPLATES.map(template => (
            <div 
              key={template.id}
              onClick={() => handleSelectTemplate(template.id, template.name)}
              className="group relative rounded-2xl border border-border/50 bg-background/50 hover:bg-muted/50 p-6 flex flex-col justify-between cursor-pointer transition-all hover:border-primary/50 overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${template.gradient} opacity-20 transition-opacity group-hover:opacity-40`} />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
                  <template.icon className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-muted text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
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