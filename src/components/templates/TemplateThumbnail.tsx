import { useState } from "react";
import { Layers, Sparkles } from "lucide-react";

export interface TemplateThumbnailProps {
  id?: string;
  name: string;
  thumbnail?: string;
  gradient?: string;
  accent?: string;
  secondaryAccent?: string;
  category?: string;
  tag?: string;
  frames?: number;
  badge?: string;
  aspectRatio?: "video" | "16/10" | "auto";
  className?: string;
  showBadges?: boolean;
  showWindowDots?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
}

export function TemplateThumbnail({
  id,
  name,
  thumbnail,
  gradient = "from-emerald-950 via-[#050b14] to-zinc-950",
  accent = "#22c55e",
  category,
  tag,
  frames = 480,
  badge,
  aspectRatio = "video",
  className = "",
  showBadges = true,
  showWindowDots = true,
  interactive = true,
  children,
}: TemplateThumbnailProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Derived thumbnail path if not explicitly passed
  const resolvedThumbnail =
    thumbnail || (id ? `/images/templates/${id}.png` : undefined);

  const aspectClass =
    aspectRatio === "16/10"
      ? "aspect-[16/10]"
      : aspectRatio === "video"
        ? "aspect-video"
        : "aspect-auto";

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden bg-[#030712] border-b border-white/10 isolate group/thumb ${className}`}
    >
      {/* Background Gradient Fallback */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} aria-hidden />

      {/* Subtle Dot Grid Texture */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.12) 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Render High-Res Visual Thumbnail */}
      {resolvedThumbnail && !imageError && (
        <img
          src={resolvedThumbnail}
          alt={`${name} thumbnail`}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ${
            interactive ? "group-hover:scale-105" : ""
          } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
        />
      )}

      {/* Ambient Vignette & Bottom Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

      {/* Window Traffic Dots */}
      {showWindowDots && (
        <div className="absolute top-3.5 left-3.5 flex gap-1.5 z-10 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/10" />
        </div>
      )}

      {/* Badges */}
      {showBadges && (
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 z-10 pointer-events-none">
          {badge && (
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/75 border border-[#22c55e]/40 text-[#4ade80] backdrop-blur-md shadow-sm">
              {badge}
            </span>
          )}
          {!badge && (
            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 border border-[#22c55e]/40 text-[#4ade80]">
              3D Parallax
            </span>
          )}
        </div>
      )}

      {/* Bottom Frame / Spec Pill */}
      {showBadges && frames && (
        <div className="absolute bottom-3 left-3.5 z-10 pointer-events-none">
          <span className="text-[9px] font-mono text-white/70 bg-black/70 px-2 py-0.5 rounded-md border border-white/10 backdrop-blur-md">
            {frames} Frames · 60 FPS
          </span>
        </div>
      )}

      {/* Overlay action controls (if passed as children) */}
      {children}
    </div>
  );
}
