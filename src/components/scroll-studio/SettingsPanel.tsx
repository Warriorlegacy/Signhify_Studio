import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useServerFn } from "@tanstack/react-start";
import { exportProjectZip } from "@/lib/export.functions";
import { Loader2, Download, Rocket } from "lucide-react";
import { toast } from "sonner";

export function SettingsPanel({ projectId }: { projectId: string | null }) {
  const [isExporting, setIsExporting] = useState(false);
  const exportFn = useServerFn(exportProjectZip);

  const handleExport = async () => {
    if (!projectId) {
      toast.error("Please create a project first before exporting.");
      return;
    }
    
    setIsExporting(true);
    try {
      const result = await exportFn({ data: { projectId } });
      if (result.success) {
        toast.success("Export ready! Downloading bundle...");
        // Simulate download
        window.open(result.downloadUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate export bundle.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-3">
        <h3 className="font-medium text-sm">Export Settings</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="quality" className="text-sm text-muted-foreground">High Quality Frames</Label>
          <Switch id="quality" defaultChecked />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Target Framerate (FPS)</Label>
          <Slider defaultValue={[30]} max={60} min={15} step={5} />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15</span>
            <span>30</span>
            <span>60</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-sm">Actions</h3>
        <Button 
          variant="outline" 
          className="w-full justify-start text-sm h-9"
          onClick={handleExport}
          disabled={isExporting || !projectId}
        >
          {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Export ZIP Bundle
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start text-sm h-9"
          disabled={!projectId}
        >
          <Rocket className="w-4 h-4 mr-2" />
          Deploy to Vercel
        </Button>
      </div>
    </div>
  );
}