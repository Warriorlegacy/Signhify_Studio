import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Clapperboard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  getPromoVideoUrl,
  listMyPromoVideos,
  pollPromoVideo,
  startPromoVideo,
} from "@/lib/promo-video.functions";

/**
 * Generates a short promo film for one blueprint. Video generation is costly,
 * so it only ever starts from a click — never automatically.
 */
export function PromoVideoPanel({
  projectId,
  compact = false,
}: {
  projectId: string | null;
  compact?: boolean;
}) {
  const startFn = useServerFn(startPromoVideo);
  const pollFn = useServerFn(pollPromoVideo);
  const urlFn = useServerFn(getPromoVideoUrl);
  const listFn = useServerFn(listMyPromoVideos);

  const [videoId, setVideoId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [url, setUrl] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show a clip this blueprint already has.
  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    listFn()
      .then(async (all) => {
        const mine = all.find((v) => v.project_id === projectId);
        if (cancelled || !mine) return;
        setVideoId(mine.id);
        if (mine.status === "completed") {
          setStatus("completed");
          const res = await urlFn({ data: { id: mine.id } });
          if (!cancelled) setUrl(res.url);
        } else if (mine.status === "failed") {
          setStatus("failed");
        } else {
          setStatus("processing");
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [projectId, listFn, urlFn]);

  // Poll while a job is running.
  useEffect(() => {
    if (status !== "processing" || !videoId) return;
    let cancelled = false;
    const tick = async () => {
      try {
        const res = await pollFn({ data: { id: videoId } });
        if (cancelled) return;
        if (res.status === "completed") {
          setStatus("completed");
          const signed = await urlFn({ data: { id: videoId } });
          if (!cancelled) setUrl(signed.url);
          toast.success("Your promo video is ready.");
          return;
        }
        if (res.status === "failed") {
          setStatus("failed");
          toast.error(res.error ?? "The video could not be generated.");
          return;
        }
      } catch {
        /* keep waiting — transient poll failures are normal */
      }
      if (!cancelled) timer.current = setTimeout(tick, 8000);
    };
    timer.current = setTimeout(tick, 6000);
    return () => {
      cancelled = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [status, videoId, pollFn, urlFn]);

  const start = async () => {
    if (!projectId) return;
    setStatus("processing");
    try {
      const res = await startFn({ data: { projectId } });
      setVideoId(res.id);
      toast.info("Generating your promo video — this takes a minute or two.");
    } catch (e) {
      setStatus("failed");
      toast.error(e instanceof Error ? e.message : "Could not start the video.");
    }
  };

  const button = (
    <Button
      variant="outline"
      className={compact ? "" : "w-full justify-start text-sm h-9"}
      disabled={!projectId || status === "processing"}
      onClick={start}
    >
      {status === "processing" ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Clapperboard className="w-4 h-4 mr-2" />
      )}
      {status === "processing"
        ? "Making your promo video…"
        : status === "completed"
          ? "Regenerate promo video"
          : "Generate promo video"}
    </Button>
  );

  return (
    <div className="space-y-3">
      {button}
      {status === "completed" && url && (
        <video
          src={url}
          controls
          playsInline
          className="w-full rounded-lg border border-border bg-black"
        />
      )}
      {status === "failed" && (
        <p className="text-xs text-destructive">
          That attempt didn&apos;t work. Try again, or tweak the blueprint description first.
        </p>
      )}
      {status === "idle" && (
        <p className="text-[11px] text-muted-foreground">
          An 8-second cinematic clip of this blueprint, shown on its marketplace listing.
        </p>
      )}
    </div>
  );
}
