import { useState } from "react";
import { ChatInterface } from "./ChatInterface";
import { SettingsPanel } from "./SettingsPanel";
import { CreditsDisplay } from "./CreditsDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, Settings, Layers } from "lucide-react";

export function Sidebar({
  projectId,
  onProjectSelect,
  onUpdatePreview,
  onFramesExtracted,
}: {
  projectId: string | null;
  onProjectSelect: (id: string) => void;
  onUpdatePreview: (data: { html: string; css: string; js: string }) => void;
  onFramesExtracted?: (frames: string[]) => void;
}) {
  return (
    <div className="w-[350px] flex flex-col h-full bg-background border-r border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <h1 className="font-semibold text-sm">Scroll Studio</h1>
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
