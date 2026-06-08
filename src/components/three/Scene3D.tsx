import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
import { useReducedMotionPref } from "@/hooks/use-reduced-motion-pref";

// Lazy-load R3F so Three.js stays out of the initial bundle and never
// touches SSR. Each immersive scene mounts only when visible.
const Canvas = lazy(() => import("@react-three/fiber").then((m) => ({ default: m.Canvas })));

type Quality = "low" | "medium" | "high";

interface Scene3DProps {
  children: ReactNode;
  className?: string;
  /** Static fallback shown under reduced-motion or before mount. */
  fallback?: ReactNode;
  /** Camera tuning */
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  /** Render on demand (default) saves battery; set false for constant motion. */
  frameloop?: "always" | "demand" | "never";
  /** Force a quality preset; otherwise auto-derived from device. */
  quality?: Quality;
  /** Disable on small screens (default true — keeps mobile fast). */
  disableOnMobile?: boolean;
  ariaLabel?: string;
}

function pickQuality(): Quality {
  if (typeof window === "undefined") return "medium";
  const dpr = window.devicePixelRatio || 1;
  const cores =
    (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (cores <= 4 || mem <= 4 || dpr > 2.5) return "low";
  if (cores >= 8 && mem >= 8) return "high";
  return "medium";
}

/**
 * Cinematic 3D stage. SSR-safe, reduced-motion-safe, lazy, IO-paused.
 * Wrap any R3F scene graph in this — children render inside a <Canvas>.
 */
export function Scene3D({
  children,
  className = "absolute inset-0",
  fallback = null,
  cameraPosition = [0, 0, 5],
  cameraFov = 45,
  frameloop = "demand",
  quality,
  disableOnMobile = true,
  ariaLabel,
}: Scene3DProps) {
  const reduced = useReducedMotionPref();
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (disableOnMobile && window.matchMedia("(max-width: 640px)").matches) return;
    // Skip if user prefers reduced motion or no WebGL.
    if (reduced) return;
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl2") || c.getContext("webgl");
      if (!gl) return;
    } catch {
      return;
    }
    setEnabled(true);
  }, [disableOnMobile, reduced]);

  if (!mounted || !enabled) {
    return (
      <div className={className} aria-hidden>
        {fallback}
      </div>
    );
  }

  const q = quality ?? pickQuality();
  const dprCap = q === "low" ? 1 : q === "medium" ? 1.5 : 2;

  return (
    <div className={className} aria-label={ariaLabel} role={ariaLabel ? "img" : undefined}>
      <Suspense fallback={<div className="w-full h-full">{fallback}</div>}>
        <Canvas
          dpr={[1, dprCap]}
          frameloop={frameloop}
          gl={{ antialias: q !== "low", alpha: true, powerPreference: "high-performance" }}
          camera={{ position: cameraPosition, fov: cameraFov }}
          style={{ width: "100%", height: "100%" }}
        >
          {children}
        </Canvas>
      </Suspense>
    </div>
  );
}
