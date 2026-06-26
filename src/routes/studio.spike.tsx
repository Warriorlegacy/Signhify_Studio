import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Sparkles,
  Send,
  Sliders,
  RotateCcw,
  Download,
  Laptop,
  Smartphone,
  Play,
  Pause,
  Loader2,
  Check,
  Undo2,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import {
  triggerVideoGeneration,
  getVideoJobStatus,
  getProjectFramesList,
} from "@/lib/studio.functions";
import { exportScrollStudioProject } from "@/lib/studio-export.functions";

export const Route = createFileRoute("/studio/spike")({
  head: () => ({
    meta: [
      { title: "Scroll Studio Spike — Signhify" },
      {
        name: "description",
        content: "Technical spike for frame-based scroll-linked canvas rendering engine.",
      },
    ],
  }),
  component: StudioSpike,
});

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

type RenderStyle = "wireframe" | "glowing" | "particle";

function StudioSpike() {
  const { user } = useUser();
  const userId = user?.id || "00000000-0000-0000-0000-000000000000";
  const projectId = "00000000-0000-0000-0000-000000000000"; // static mock project ID for spike

  // Config state
  const [frameCount, setFrameCount] = useState(150);
  const [style, setStyle] = useState<RenderStyle>("glowing");
  const [primaryColor, setPrimaryColor] = useState("oklch(0.72 0.21 45)"); // Teal: oklch(0.72 0.21 160), Ember: oklch(0.72 0.21 45), Violet: oklch(0.65 0.22 290)
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [autoplaySpeed, setAutoplaySpeed] = useState(0); // 0 = scroll-linked, >0 = FPS (e.g. 30fps)

  // Builder interaction state
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to Signhify Scroll Studio Spike! I'm your AI Strategist. Describe style edits (e.g., 'make it a wireframe', 'change color to purple', 'increase frame count to 200') to update the scroll-locked animation engine.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Engine state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [frames, setFrames] = useState<ImageBitmap[]>([]);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [exported, setExported] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportReady, setExportReady] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [exportFileName, setExportFileName] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const autoplayRef = useRef<number | null>(null);
  const framesRef = useRef<ImageBitmap[]>([]);

  // Keep ref up to date for scroll listener
  useEffect(() => {
    framesRef.current = frames;
  }, [frames]);

  // Clean up frames on unmount
  useEffect(() => {
    return () => {
      framesRef.current.forEach((f) => f.close());
    };
  }, []);

  // Frame Generation Pipeline
  const generateFrames = useCallback(
    async (count: number, renderStyle: RenderStyle, color: string) => {
      setIsGenerating(true);
      setGenerationProgress(0);

      // Release old frames to free memory
      framesRef.current.forEach((f) => f.close());
      setFrames([]);

      const colorHex = color.includes("160")
        ? "#14b8a6" // Teal
        : color.includes("290")
          ? "#8b5cf6" // Violet
          : "#ff6b00"; // Primary Electric Orange

      try {
        // 1. Trigger the server function to start generation job
        const promptText = `Generate a cinematic scroll animation in ${renderStyle} style with ${colorHex} primary color.`;
        const { jobId } = await triggerVideoGeneration({
          data: {
            projectId,
            prompt: promptText,
            style: renderStyle,
            frameCount: count,
          },
        });

        // 2. Poll job status
        let status = "queued";
        while (status === "queued" || status === "processing") {
          // Poll every 1.5s
          await new Promise((resolve) => setTimeout(resolve, 1500));
          const job = await getVideoJobStatus({ data: { jobId } });
          if (!job) {
            throw new Error("Failed to retrieve job status");
          }
          status = job.status;
          if (status === "failed") {
            throw new Error(job.error_message || "Video job failed on server");
          }
        }

        // 3. Fetch frames list
        const framesList = await getProjectFramesList({ data: { projectId } });
        if (!framesList || framesList.length === 0) {
          throw new Error("No frames returned from server");
        }

        // 4. Download and buffer frame images
        const newFrames: ImageBitmap[] = [];
        const chunkSize = 15;

        for (let start = 0; start < framesList.length; start += chunkSize) {
          const end = Math.min(start + chunkSize, framesList.length);
          const chunk = framesList.slice(start, end);

          // Download chunk in parallel
          const chunkBitmaps = await Promise.all(
            chunk.map(async (frameItem, idx) => {
              const i = start + idx;
              let imageBitmap: ImageBitmap;
              try {
                const res = await fetch(frameItem.cdn_url, { mode: "cors" });
                if (!res.ok) throw new Error("Fetch failed");
                const blob = await res.blob();
                imageBitmap = await createImageBitmap(blob);
              } catch (fetchErr) {
                // Fallback to procedural draw
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = 800;
                tempCanvas.height = 450;
                const tempCtx = tempCanvas.getContext("2d");
                if (tempCtx) {
                  // Clear canvas
                  tempCtx.fillStyle = "#030712";
                  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

                  // Subtle tech grid
                  tempCtx.strokeStyle = "rgba(255, 255, 255, 0.02)";
                  tempCtx.lineWidth = 1;
                  const gridSize = 40;
                  for (let x = 0; x < tempCanvas.width; x += gridSize) {
                    tempCtx.beginPath();
                    tempCtx.moveTo(x, 0);
                    tempCtx.lineTo(x, tempCanvas.height);
                    tempCtx.stroke();
                  }
                  for (let y = 0; y < tempCanvas.height; y += gridSize) {
                    tempCtx.beginPath();
                    tempCtx.moveTo(0, y);
                    tempCtx.lineTo(tempCanvas.width, y);
                    tempCtx.stroke();
                  }

                  // L-bracket corners
                  tempCtx.strokeStyle = `${colorHex}33`;
                  tempCtx.lineWidth = 1.5;
                  const margin = 20;
                  const size = 15;
                  tempCtx.beginPath();
                  tempCtx.moveTo(margin + size, margin);
                  tempCtx.lineTo(margin, margin);
                  tempCtx.lineTo(margin, margin + size);
                  tempCtx.stroke();

                  tempCtx.beginPath();
                  tempCtx.moveTo(tempCanvas.width - margin - size, margin);
                  tempCtx.lineTo(tempCanvas.width - margin, margin);
                  tempCtx.lineTo(tempCanvas.width - margin, margin + size);
                  tempCtx.stroke();

                  // Orbiting sphere drawing logic
                  const t = (i / count) * Math.PI * 2;
                  const orbX = tempCanvas.width / 2 + Math.cos(t) * (tempCanvas.width * 0.22);
                  const orbY =
                    tempCanvas.height / 2 + Math.sin(2 * t) * (tempCanvas.height * 0.16) - 10;
                  const orbZ = Math.sin(t);
                  const scale = 1 + orbZ * 0.35;
                  const radius = 55 * scale;

                  // Particle stream behind sphere
                  if (renderStyle === "particle") {
                    tempCtx.fillStyle = `${colorHex}1a`;
                    for (let p = 0; p < 25; p++) {
                      const px =
                        tempCanvas.width / 2 +
                        Math.sin(t + p * 0.25) * (tempCanvas.width * 0.3) +
                        Math.cos(p * 2) * 15;
                      const py =
                        tempCanvas.height / 2 +
                        Math.cos(t + p * 0.4) * (tempCanvas.height * 0.2) +
                        Math.sin(p * 3) * 15;
                      const pr = Math.abs(Math.sin(p)) * 4 + 1.5;
                      tempCtx.beginPath();
                      tempCtx.arc(px, py, pr, 0, Math.PI * 2);
                      tempCtx.fill();
                    }
                  }

                  // Glow gradient
                  const glowGrad = tempCtx.createRadialGradient(
                    orbX,
                    orbY,
                    0,
                    orbX,
                    orbY,
                    radius * 2.2,
                  );
                  if (renderStyle === "wireframe") {
                    glowGrad.addColorStop(0, `${colorHex}44`);
                    glowGrad.addColorStop(0.5, `${colorHex}11`);
                    glowGrad.addColorStop(1, "transparent");
                  } else {
                    glowGrad.addColorStop(0, `${colorHex}dd`);
                    glowGrad.addColorStop(0.3, `${colorHex}66`);
                    glowGrad.addColorStop(0.6, `${colorHex}1a`);
                    glowGrad.addColorStop(1, "transparent");
                  }
                  tempCtx.fillStyle = glowGrad;
                  tempCtx.beginPath();
                  tempCtx.arc(orbX, orbY, radius * 2.2, 0, Math.PI * 2);
                  tempCtx.fill();

                  // Orb base
                  tempCtx.beginPath();
                  tempCtx.arc(orbX, orbY, radius, 0, Math.PI * 2);
                  if (renderStyle === "wireframe") {
                    tempCtx.strokeStyle = `${colorHex}aa`;
                    tempCtx.lineWidth = 1.5;
                    tempCtx.stroke();
                    tempCtx.beginPath();
                    tempCtx.ellipse(orbX, orbY, radius, radius * 0.25, t, 0, Math.PI * 2);
                    tempCtx.stroke();
                    tempCtx.beginPath();
                    tempCtx.ellipse(orbX, orbY, radius * 0.25, radius, t * 1.5, 0, Math.PI * 2);
                    tempCtx.stroke();
                  } else {
                    tempCtx.fillStyle = "#090d16";
                    tempCtx.fill();
                    tempCtx.strokeStyle = `${colorHex}ff`;
                    tempCtx.lineWidth = 2.5;
                    tempCtx.stroke();
                  }

                  // Text overlays
                  tempCtx.fillStyle = `${colorHex}bb`;
                  tempCtx.font = "9px monospace";
                  tempCtx.fillText(`SEQ_ID: SIGNHIFY-DB-V1`, 40, 45);
                  tempCtx.fillText(`ENGINE: SERVER_DB_POLL`, 40, 57);
                  tempCtx.fillText(`FRAME: ${String(i).padStart(3, "0")} / ${count}`, 40, 69);
                  tempCtx.fillStyle = "rgba(255, 255, 255, 0.3)";
                  tempCtx.fillText(`PREF_REDUCED_MOTION: FALSE`, 40, tempCanvas.height - 40);
                  tempCtx.fillText(`COMPRESSION: WEBP_90`, 40, tempCanvas.height - 28);
                }
                imageBitmap = await createImageBitmap(tempCanvas);
              }
              return imageBitmap;
            }),
          );

          newFrames.push(...chunkBitmaps);
          setGenerationProgress(Math.round((end / framesList.length) * 100));
          await new Promise((resolve) => setTimeout(resolve, 15));
        }

        setFrames(newFrames);
      } catch (err) {
        console.error("[studio.spike] generateFrames pipeline failed:", err);
      } finally {
        setIsGenerating(false);
      }
    },
    [userId],
  );

  // Draw target frame
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const frame = frames[index];
      if (!frame) return;

      // Responsive sizing
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.width * (450 / 800); // lock 16:9 aspect ratio

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw frame scaled to canvas size
      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
    },
    [frames],
  );

  // Trigger regeneration when key settings change
  useEffect(() => {
    void generateFrames(frameCount, style, primaryColor);
  }, [generateFrames, frameCount, style, primaryColor]);

  // Redraw when frames list updates or index shifts
  useEffect(() => {
    if (frames.length > 0) {
      drawFrame(activeFrameIndex);
    }
  }, [drawFrame, frames.length, activeFrameIndex]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (frames.length > 0) {
        drawFrame(activeFrameIndex);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame, frames.length, activeFrameIndex]);

  // Scroll Engine
  useEffect(() => {
    const handleScroll = () => {
      if (autoplaySpeed > 0 || frames.length === 0) return;

      const container = scrollContainerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollHeight = rect.height - window.innerHeight;

      if (scrollHeight <= 0) return;

      // Calculate relative scroll position in target container
      const relativeScroll = -rect.top;
      const progress = Math.min(1, Math.max(0, relativeScroll / scrollHeight));

      const frameIndex = Math.min(frames.length - 1, Math.floor(progress * (frames.length - 1)));
      setActiveFrameIndex(frameIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [frames, autoplaySpeed]);

  // Autoplay Engine (standard preview fallback)
  useEffect(() => {
    if (autoplaySpeed === 0) {
      if (autoplayRef.current) {
        cancelAnimationFrame(autoplayRef.current);
        autoplayRef.current = null;
      }
      return;
    }

    let lastTime = 0;
    const interval = 1000 / autoplaySpeed;

    const loop = (time: number) => {
      if (!lastTime) lastTime = time;
      const elapsed = time - lastTime;

      if (elapsed >= interval) {
        setActiveFrameIndex((prev) => (prev + 1) % frames.length);
        lastTime = time - (elapsed % interval);
      }
      autoplayRef.current = requestAnimationFrame(loop);
    };

    autoplayRef.current = requestAnimationFrame(loop);

    return () => {
      if (autoplayRef.current) {
        cancelAnimationFrame(autoplayRef.current);
      }
    };
  }, [autoplaySpeed, frames]);

  // Command handler (client-side LLM mock editor)
  const handleSendCommand = (text?: string) => {
    const commandText = (text ?? prompt).trim();
    if (!commandText) return;

    setPrompt("");
    const newMsg: Message = {
      role: "user",
      content: commandText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatHistory((prev) => [...prev, newMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const lower = commandText.toLowerCase();
      let reply = "";

      if (lower.includes("wireframe")) {
        setStyle("wireframe");
        reply = "Design token updated. Transpiled visual engine style to **Wireframe Mode**.";
      } else if (lower.includes("particle") || lower.includes("dots")) {
        setStyle("particle");
        reply = "Design token updated. Shifted render buffer to **Additive Particle Field Mode**.";
      } else if (lower.includes("glow") || lower.includes("solid")) {
        setStyle("glowing");
        reply =
          "Design token updated. Transformed sphere rasterization to **Volumetric Glowing Material**.";
      } else if (lower.includes("purple") || lower.includes("violet")) {
        setPrimaryColor("oklch(0.65 0.22 290)");
        reply =
          "Color system updated. Injected brand token primary color **#8b5cf6 (Violet)** into UI theme.";
      } else if (lower.includes("teal") || lower.includes("blue")) {
        setPrimaryColor("oklch(0.72 0.21 160)");
        reply =
          "Color system updated. Injected brand token primary color **#14b8a6 (Teal)** into UI theme.";
      } else if (lower.includes("orange") || lower.includes("ember")) {
        setPrimaryColor("oklch(0.72 0.21 45)");
        reply =
          "Color system updated. Reverted to brand token primary color **#ff6b00 (Electric Orange)**.";
      } else if (lower.includes("frame count") || lower.includes("frames")) {
        const match = lower.match(/\b\d+\b/);
        const count = match ? parseInt(match[0], 10) : 150;
        if (count >= 50 && count <= 400) {
          setFrameCount(count);
          reply = `Frame buffer updated. Set sequence target to **${count} frames** to recalibrate scroll density.`;
        } else {
          reply =
            "Frame count out of bounds. Please specify a count between 50 and 400 frames for browser sanity.";
        }
      } else if (lower.includes("export")) {
        // Start actual export process
        setExporting(true);
        reply = "Export process initialized. Compiling project files...";

        // Call the export function
        exportScrollStudioProject
          .call({ projectId })
          .then((result) => {
            if (result.data?.success) {
              setExportReady(true);
              setExportUrl(result.data.downloadUrl);
              setExportFileName(result.data.fileName);
              reply = `Export complete! Your project is ready for download as ${result.data.fileName}.`;
            } else {
              throw new Error("Export failed");
            }
          })
          .catch((error) => {
            console.error("Export failed:", error);
            reply = "Export failed. Please try again.";
          })
          .finally(() => {
            setExporting(false);
          });
      } else {
        reply = `I've analyzed your command: "${commandText}". Try commands like:
• *"change style to wireframe"*
• *"make the theme color purple"*
• *"increase frame count to 200"*
• *"export the code"*`;
      }

      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-foreground font-sans relative overflow-x-hidden">
      {/* Background radial atmosphere */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] pointer-events-none opacity-20 filter blur-3xl transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${primaryColor.includes("160") ? "rgba(20, 184, 166, 0.4)" : primaryColor.includes("290") ? "rgba(139, 92, 246, 0.4)" : "rgba(255, 107, 0, 0.4)"} 0%, transparent 70%)`,
        }}
      />

      {/* Main layout container */}
      <div className="grid lg:grid-cols-[400px_1fr] min-h-screen">
        {/* Left Column: Editor controls & chat */}
        <aside className="border-r border-border/40 bg-[#070b14]/90 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-20">
          {/* Header */}
          <div className="p-6 border-b border-border/40 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                <span className="font-display font-bold text-lg tracking-tight">
                  Scroll Studio Spike
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mt-1">
                Signhify v1.0 · Technical Spike
              </span>
            </div>
            <button
              onClick={() => {
                setFrameCount(150);
                setStyle("glowing");
                setPrimaryColor("oklch(0.72 0.21 45)");
                setAutoplaySpeed(0);
                setChatHistory([
                  {
                    role: "assistant",
                    content: "Settings reset. Canvas engine re-rendering frames...",
                    timestamp: new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                  },
                ]);
              }}
              title="Reset config"
              className="p-2 rounded-lg border border-border/40 hover:border-primary/40 text-muted-foreground hover:text-foreground transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick controls panels */}
          <div className="p-5 border-b border-border/40 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <Sliders className="w-3.5 h-3.5" />
              <span>VISUAL TOKENS</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["wireframe", "glowing", "particle"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium capitalize transition ${
                    style === s
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/40 hover:border-border text-muted-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Timeline density</span>
                <span>{frameCount} frames</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="25"
                value={frameCount}
                onChange={(e) => setFrameCount(parseInt(e.target.value, 10))}
                className="w-full h-1 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Mock engine color</span>
              <div className="flex gap-2">
                {[
                  { hex: "#ff6b00", val: "oklch(0.72 0.21 45)" }, // Orange
                  { hex: "#14b8a6", val: "oklch(0.72 0.21 160)" }, // Teal
                  { hex: "#8b5cf6", val: "oklch(0.65 0.22 290)" }, // Violet
                ].map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setPrimaryColor(c.val)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-5 h-5 rounded-full border transition ${
                      primaryColor === c.val
                        ? "border-white scale-110 shadow-lg"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Autoplay preview</span>
              <div className="flex items-center gap-1.5 bg-surface border border-border/40 rounded-lg p-0.5">
                <button
                  onClick={() => setAutoplaySpeed(0)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                    autoplaySpeed === 0 ? "bg-[#030712] text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Scroll
                </button>
                <button
                  onClick={() => setAutoplaySpeed(24)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold transition ${
                    autoplaySpeed > 0 ? "bg-[#030712] text-foreground" : "text-muted-foreground"
                  }`}
                >
                  24 FPS
                </button>
              </div>
            </div>
          </div>

          {/* Chat transcript */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <AnimatePresence initial={false}>
              {chatHistory.map((m, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col max-w-[85%] ${
                    m.role === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl p-3.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                        : "bg-surface-2/60 border border-border/40 text-muted-foreground rounded-tl-none"
                    }`}
                  >
                    {m.content}
                  </div>
                  <span className="text-[9px] text-muted-foreground/60 mt-1 px-1 font-mono">
                    {m.timestamp}
                  </span>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-1.5 self-start bg-surface-2/40 border border-border/40 rounded-full px-3 py-1.5 text-xs text-muted-foreground"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                  <span>Strategist is designing...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat input box */}
          <div className="p-4 border-t border-border/40 bg-[#05080f]/90 flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendCommand()}
              placeholder="e.g. 'wireframe', 'make it purple'..."
              className="flex-1 bg-surface border border-border/40 rounded-xl px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 text-foreground focus:border-primary/40 transition"
            />
            <button
              onClick={() => handleSendCommand()}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:brightness-110 shadow-[0_0_20px_rgba(255,107,0,0.15)] transition flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Right Column: Sticky preview and scroll simulator */}
        <main
          ref={scrollContainerRef}
          className="relative min-h-[300vh] flex flex-col items-center select-none"
        >
          {/* Top sticky actionbar */}
          <div className="sticky top-0 left-0 right-0 w-full z-10 p-5 bg-[#030712]/80 backdrop-blur-md border-b border-border/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-semibold tracking-wider text-muted-foreground uppercase">
                {autoplaySpeed > 0 ? "Autoplay active" : "LINKED TO SCROLL CONTAINER"}
              </span>
            </div>

            {/* Viewport Toggles & Export */}
            <div className="flex items-center gap-3">
              <div className="flex bg-surface border border-border/40 rounded-lg p-0.5">
                <button
                  onClick={() => setViewport("desktop")}
                  className={`p-1.5 rounded transition ${
                    viewport === "desktop"
                      ? "bg-[#030712] text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewport("mobile")}
                  className={`p-1.5 rounded transition ${
                    viewport === "mobile" ? "bg-[#030712] text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Export Button */}
              <button
                onClick={async () => {
                  if (exportUrl && exportFileName) {
                    // Trigger download
                    const link = document.createElement("a");
                    link.href = exportUrl;
                    link.download = exportFileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }
                }}
                disabled={exporting}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ${
                  exporting
                    ? "bg-surface border border-primary/50 text-primary/50 cursor-not-allowed"
                    : exportReady
                      ? "bg-primary hover:brightness-110 text-primary-foreground transition shadow-md"
                      : "bg-primary hover:brightness-110 text-primary-foreground transition shadow-md"
                }`}
              >
                {exporting ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : exportReady ? (
                  <Check className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>
                  {exporting ? "Exporting..." : exportReady ? "Download ZIP" : "Export ZIP"}
                </span>
              </button>

              {/* Deploy Button */}
              <button
                onClick={async () => {
                  setExporting(true);
                  // Call the deploy function
                  const { deployScrollStudioProject } = await import(
                    "@/lib/studio-export.functions"
                  );
                  deployScrollStudioProject
                    .call({ projectId })
                    .then((result) => {
                      if (result.data?.success) {
                        // Show success and open deployment URL in new tab
                        window.open(result.data.deploymentUrl, "_blank");
                      } else {
                        throw new Error("Deployment failed");
                      }
                    })
                    .catch((error) => {
                      console.error("Deployment failed:", error);
                      // In a real app, we'd show a toast notification
                      alert("Deployment failed. Please check credentials and try again.");
                    })
                    .finally(() => {
                      setExporting(false);
                    });
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-primary/50 text-primary/50 hover:border-primary/70 hover:text-primary/70 transition`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Deploy</span>
              </button>
            </div>
          </div>

          {/* Sticky player section */}
          <div className="sticky top-[77px] h-[calc(100vh-77px)] w-full flex items-center justify-center overflow-hidden pointer-events-none px-6">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 bg-surface/50 border border-border/40 rounded-2xl p-8 backdrop-blur"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <div className="text-center space-y-1.5">
                    <div className="font-semibold text-sm">Generating Procedural Frames</div>
                    <div className="text-xs text-muted-foreground font-mono">
                      Frame buffering: {generationProgress}%
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="player"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    width: viewport === "desktop" ? "100%" : "340px",
                    maxWidth: viewport === "desktop" ? "880px" : "100%",
                  }}
                  className="relative rounded-2xl border border-border/40 bg-card overflow-hidden shadow-[var(--shadow-card)] transition-all duration-500"
                >
                  {/* Canvas Renderer */}
                  <canvas ref={canvasRef} className="w-full block bg-black" />

                  {/* Tech telemetry overlay bar */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-muted-foreground/60 select-none bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
                    <span>FRAME INDEX: {activeFrameIndex}</span>
                    <span>
                      FPS CACHE: {autoplaySpeed > 0 ? `${autoplaySpeed}fps` : "Scroll driver"}
                    </span>
                    <span>MEMORY STATE: Bitmaps cached</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scroll indicators down the page */}
          <div className="absolute top-[20%] left-6 text-left border-l border-white/10 pl-4 space-y-2 pointer-events-none">
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground block uppercase">
              Narrative Steps
            </span>
            <div
              className="text-sm font-semibold opacity-30 transition-opacity"
              style={{ opacity: activeFrameIndex < frameCount * 0.25 ? 1 : 0.3 }}
            >
              01. The Void Awakens
            </div>
            <div
              className="text-sm font-semibold opacity-30 transition-opacity"
              style={{
                opacity:
                  activeFrameIndex >= frameCount * 0.25 && activeFrameIndex < frameCount * 0.5
                    ? 1
                    : 0.3,
              }}
            >
              02. Gesture Decoded
            </div>
            <div
              className="text-sm font-semibold opacity-30 transition-opacity"
              style={{
                opacity:
                  activeFrameIndex >= frameCount * 0.5 && activeFrameIndex < frameCount * 0.75
                    ? 1
                    : 0.3,
              }}
            >
              03. Translation Bridge
            </div>
            <div
              className="text-sm font-semibold opacity-30 transition-opacity"
              style={{ opacity: activeFrameIndex >= frameCount * 0.75 ? 1 : 0.3 }}
            >
              04. Launch Trajectory
            </div>
          </div>

          {/* Scroll Cue at Bottom */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground animate-bounce">
              {autoplaySpeed === 0 ? "Scroll Down to Play Story" : "Autoplaying"}
            </span>
          </div>
        </main>
      </div>
    </div>
  );
}
