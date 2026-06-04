import { useEffect, useRef } from "react";

/**
 * Tracks pointer position on the returned ref and writes
 * `--mx` / `--my` (0–100%) CSS variables so children can drive
 * a radial-gradient spotlight without React re-renders.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };
    const onLeave = () => {
      el.style.setProperty("--mx", `50%`);
      el.style.setProperty("--my", `-20%`);
    };
    onLeave();
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return ref;
}
