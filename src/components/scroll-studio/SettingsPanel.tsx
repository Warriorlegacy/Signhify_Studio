import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useServerFn } from "@tanstack/react-start";
import { exportProjectZip } from "@/lib/export.functions";
import { Loader2, Download, Rocket, Film, Upload } from "lucide-react";
import { toast } from "sonner";
import { extractFramesFromVideo } from "@/lib/client-video-extractor";

export function SettingsPanel({ 
  projectId,
  onFramesExtracted
}: { 
  projectId: string | null;
  onFramesExtracted?: (frames: string[]) => void;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    setExtractionProgress(0);
    
    try {
      const videoUrl = URL.createObjectURL(file);
      toast.info("Extracting frames...");
      
      const frames = await extractFramesFromVideo(videoUrl, (progress) => {
        setExtractionProgress(progress);
      });
      
      console.log(`Extracted ${frames.length} frames successfully.`);
      toast.success(`Successfully extracted ${frames.length} frames for scroll sequence!`);
      
      if (onFramesExtracted) {
        onFramesExtracted(frames);
      }
      
      // Here you would upload the frames to Supabase storage or pass them to the PreviewCanvas
      console.log("Extracted frames payload:", frames.slice(0, 2), "... and more.");
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract frames from video.");
    } finally {
      setIsExtracting(false);
      setExtractionProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <Film className="w-4 h-4" /> Video Processing
        </h3>
        <input 
          type="file" 
          accept="video/mp4,video/webm" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleVideoUpload}
        />
        <Button 
          variant="outline" 
          className="w-full justify-start text-sm h-9 bg-primary/5 border-primary/20 hover:bg-primary/10"
          onClick={() => fileInputRef.current?.click()}
          disabled={isExtracting}
        >
          {isExtracting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {isExtracting ? `Extracting (${extractionProgress}%)...` : "Extract Frames (Client-Side)"}
        </Button>
        <p className="text-[10px] text-muted-foreground mt-1">
          Bypass server limits by parsing MP4s into WebP frames directly in your browser.
        </p>
      </div>

      <div className="space-y-3 pt-4 border-t border-border">
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