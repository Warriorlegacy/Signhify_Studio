import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useServerFn } from "@tanstack/react-start";
import { exportProjectZip } from "@/lib/export.functions";
import { publishProjectToMarketplace } from "@/lib/marketplace-listings.functions";
import {
  Loader2,
  Download,
  Store,
  Film,
  Upload,
  Plus,
  X,
  GripVertical,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import { extractFramesFromVideo } from "@/lib/client-video-extractor";

interface VideoSegment {
  id: string;
  name: string;
  file: File | null;
  frames: string[];
  status: "idle" | "extracting" | "ready" | "error";
  progress: number;
}

export function SettingsPanel({
  projectId,
  onFramesExtracted,
}: {
  projectId: string | null;
  onFramesExtracted?: (frames: string[]) => void;
}) {
  const [isExporting, setIsExporting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [targetFps, setTargetFps] = useState(30);
  const [highQuality, setHighQuality] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const exportFn = useServerFn(exportProjectZip);
  const publishFn = useServerFn(publishProjectToMarketplace);

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
        window.open(result.downloadUrl, "_blank");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate export bundle.");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePublish = async () => {
    if (!projectId) return;
    setIsPublishing(true);
    try {
      const result = await publishFn({ data: { projectId } });
      if (result.success) {
        toast.success("Published to Marketplace!", {
          description: "Your template is now live in the global directory.",
          action: {
            label: "View",
            onClick: () => window.open("/marketplace", "_blank"),
          },
        });
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to publish to marketplace.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSingleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract frames from video.");
    } finally {
      setIsExtracting(false);
      setExtractionProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleMultiVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newSegments: VideoSegment[] = Array.from(files).map((file) => ({
      id: `seg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      file,
      frames: [],
      status: "idle" as const,
      progress: 0,
    }));

    setSegments((prev) => [...prev, ...newSegments]);

    // Process each segment sequentially
    for (const segment of newSegments) {
      setSegments((prev) =>
        prev.map((s) => (s.id === segment.id ? { ...s, status: "extracting" } : s)),
      );

      try {
        const videoUrl = URL.createObjectURL(segment.file!);
        const frames = await extractFramesFromVideo(videoUrl, (progress) => {
          setSegments((prev) => prev.map((s) => (s.id === segment.id ? { ...s, progress } : s)));
        });

        setSegments((prev) =>
          prev.map((s) =>
            s.id === segment.id ? { ...s, frames, status: "ready", progress: 100 } : s,
          ),
        );

        toast.success(`Extracted ${frames.length} frames from ${segment.name}`);
      } catch (err) {
        console.error(err);
        setSegments((prev) =>
          prev.map((s) => (s.id === segment.id ? { ...s, status: "error" } : s)),
        );
        toast.error(`Failed to extract frames from ${segment.name}`);
      }
    }

    // Combine all frames from all segments
    const allFrames = segments
      .filter((s) => s.status === "ready")
      .flatMap((s) => s.frames)
      .concat(newSegments.filter((s) => s.status === "ready").flatMap((s) => s.frames));

    if (allFrames.length > 0 && onFramesExtracted) {
      onFramesExtracted(allFrames);
    }

    if (multiFileInputRef.current) multiFileInputRef.current.value = "";
  };

  const removeSegment = (id: string) => {
    setSegments((prev) => prev.filter((s) => s.id !== id));
  };

  const totalFrames = segments
    .filter((s) => s.status === "ready")
    .reduce((sum, s) => sum + s.frames.length, 0);

  return (
    <div className="p-4 space-y-6">
      {/* Single Video Upload */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <Film className="w-4 h-4" /> Video Processing
        </h3>
        <input
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          ref={fileInputRef}
          onChange={handleSingleVideoUpload}
        />
        <Button
          variant="outline"
          className="w-full justify-start text-sm h-9 bg-primary/5 border-primary/20 hover:bg-primary/10"
          onClick={() => fileInputRef.current?.click()}
          disabled={isExtracting}
        >
          {isExtracting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          {isExtracting
            ? `Extracting (${extractionProgress}%)...`
            : "Extract Frames (Single Video)"}
        </Button>
        <p className="text-[10px] text-muted-foreground mt-1">
          Parse a single MP4 into WebP frames directly in your browser.
        </p>
      </div>

      {/* Multi-Video Continuation */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <Layers className="w-4 h-4" /> Multi-Video Continuation
        </h3>
        <p className="text-[10px] text-muted-foreground">
          Chain multiple videos end-to-end for longer scroll animations. First frame of each picks
          up perfectly from the last.
        </p>
        <input
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          ref={multiFileInputRef}
          multiple
          onChange={handleMultiVideoUpload}
        />
        <Button
          variant="outline"
          className="w-full justify-start text-sm h-9"
          onClick={() => multiFileInputRef.current?.click()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Video Segments
        </Button>

        {segments.length > 0 && (
          <div className="space-y-2 mt-2">
            {segments.map((seg, idx) => (
              <div
                key={seg.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border/50"
              >
                <GripVertical className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-[10px] text-muted-foreground w-4">{idx + 1}</span>
                <span className="text-xs flex-1 truncate">{seg.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {seg.status === "ready"
                    ? `${seg.frames.length} frames`
                    : seg.status === "extracting"
                      ? `${seg.progress}%`
                      : seg.status === "error"
                        ? "Error"
                        : "Pending"}
                </span>
                {seg.status === "extracting" && (
                  <Loader2 className="w-3 h-3 animate-spin text-primary" />
                )}
                <button
                  onClick={() => removeSegment(seg.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {totalFrames > 0 && (
              <p className="text-[10px] text-primary font-medium">
                Total: {totalFrames} frames across{" "}
                {segments.filter((s) => s.status === "ready").length} segments
              </p>
            )}
          </div>
        )}
      </div>

      {/* Export Settings */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-sm">Export Settings</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="quality" className="text-sm text-muted-foreground">
            High Quality Frames
          </Label>
          <Switch id="quality" checked={highQuality} onCheckedChange={setHighQuality} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Target Framerate ({targetFps} FPS)
          </Label>
          <Slider
            value={[targetFps]}
            onValueChange={(v) => setTargetFps(v[0])}
            max={60}
            min={15}
            step={5}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>15</span>
            <span>30</span>
            <span>60</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="font-medium text-sm">Actions</h3>
        <Button
          variant="outline"
          className="w-full justify-start text-sm h-9"
          onClick={handleExport}
          disabled={isExporting || !projectId}
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export ZIP Bundle
        </Button>
        <Button
          variant="default"
          className="w-full justify-start text-sm h-9"
          disabled={!projectId || isPublishing}
          onClick={handlePublish}
        >
          {isPublishing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Store className="w-4 h-4 mr-2" />
          )}
          Publish to Marketplace
        </Button>
      </div>
    </div>
  );
}
