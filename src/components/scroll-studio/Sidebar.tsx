import { useState } from "react";
import { ChatInterface } from "./ChatInterface";
import { SettingsPanel } from "./SettingsPanel";
import { CreditsDisplay } from "./CreditsDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Settings, Layers, ChevronDown, FolderOpen, Plus } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { getScrollStudioProjects } from "@/lib/scroll-studio-projects.functions";

function ProjectSwitcher({
  projectId,
  onSelect,
}: {
  projectId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Array<{ id: string; title: string }>>([]);
  const listFn = useServerFn(getScrollStudioProjects);

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && projects.length === 0) {
      try {
        setProjects(await listFn());
      } catch (e) {
        console.warn("[ProjectSwitcher] failed to list projects", e);
      }
    }
  };

  const current =
    projects.find((p) => p.id === projectId)?.title ?? (projectId ? "Project" : "No project");

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors max-w-[180px]"
      >
        <FolderOpen className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{current}</span>
        <ChevronDown className="w-3 h-3 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-56 rounded-lg border border-border bg-background shadow-xl z-50 py-1 max-h-64 overflow-y-auto">
          {projects.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground">No projects yet</div>
          )}
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setOpen(false);
                onSelect(p.id);
              }}
              className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted truncate"
            >
              {p.title}
            </button>
          ))}
          <div className="border-t border-border mt-1 pt-1">
            <button
              onClick={() => {
                setOpen(false);
                onSelect(null);
              }}
              className="w-full text-left px-3 py-1.5 text-xs text-primary flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3" /> New project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({
  projectId,
  onProjectSelect,
  onUpdatePreview,
  onFramesExtracted,
}: {
  projectId: string | null;
  onProjectSelect: (id: string | null) => void;
  onUpdatePreview: (data: { html: string; css: string; js: string }) => void;
  onFramesExtracted?: (frames: string[]) => void;
}) {
  return (
    <div className="w-[350px] flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="font-semibold text-sm leading-tight">Scroll Studio</h1>
            <ProjectSwitcher projectId={projectId} onSelect={onProjectSelect} />
          </div>
        </div>
      </div>

      <Tabs defaultValue="chat" className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 pt-2">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="chat" className="text-xs">
              <Bot className="w-3.5 h-3.5 mr-2" />
              AI Builder
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="w-3.5 h-3.5 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 overflow-hidden m-0 p-0">
          <ChatInterface projectId={projectId} onUpdatePreview={onUpdatePreview} />
        </TabsContent>

        <TabsContent value="settings" className="flex-1 overflow-y-auto m-0 p-0">
          <SettingsPanel projectId={projectId} onFramesExtracted={onFramesExtracted} />
        </TabsContent>
      </Tabs>

      <CreditsDisplay />
    </div>
  );
}
