import { useEffect, useRef, useState } from "react";
import { Loader2, Monitor, Smartphone, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PreviewCanvas({
  projectId,
  previewHtml,
}: {
  projectId: string | null;
  previewHtml: string | null;
}) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col h-full bg-muted/10 relative">
      {/* Top Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center bg-background/80 backdrop-blur-md border border-border/50 rounded-full p-1 shadow-sm">
        <Button
          variant={device === "desktop" ? "secondary" : "ghost"}
          size="icon"
          className="w-8 h-8 rounded-full"
          onClick={() => setDevice("desktop")}
        >
          <Monitor className="w-4 h-4" />
        </Button>
        <Button
          variant={device === "mobile" ? "secondary" : "ghost"}
          size="icon"
          className="w-8 h-8 rounded-full"
          onClick={() => setDevice("mobile")}
        >
          <Smartphone className="w-4 h-4" />
        </Button>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-md">
          <Maximize2 className="w-4 h-4 mr-2" />
          Full Screen
        </Button>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 mt-12">
        <div
          className={`bg-white rounded-md shadow-xl overflow-hidden transition-all duration-500 ease-in-out border border-border/20 ${
            device === "desktop" ? "w-full h-full max-w-[1200px]" : "w-[375px] h-[812px]"
          }`}
        >
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm font-medium">Generating preview...</p>
            </div>
          ) : previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-slate-50">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Monitor className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-500">No project selected</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[250px] text-center">
                Send a message to the AI builder to start creating your cinematic website.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
