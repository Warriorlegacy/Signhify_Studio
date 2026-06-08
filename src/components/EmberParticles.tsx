import { useEffect, useRef } from "react";

/**
 * Lightweight canvas of slow-rising ember particles. Respects
 * prefers-reduced-motion (renders nothing). Sized to its parent.
 */
export function EmberParticles({ count = 36 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = { x: number; y: number; r: number; vy: number; vx: number; a: number; life: number };
    let particles: P[] = [];

    const spawn = (): P => ({
      x: Math.random() * w,
      y: h + Math.random() * 60,
      r: 0.6 + Math.random() * 1.8,
      vy: -0.15 - Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.15,
      a: 0.15 + Math.random() * 0.5,
      life: 0,
    });

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: count }, spawn);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += 1;
        if (p.y < -20 || p.life > 600) Object.assign(p, spawn());
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grd.addColorStop(0, `rgba(255,140,40,${p.a})`);
        grd.addColorStop(1, "rgba(255,140,40,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [count]);

  return (
    <canvas ref={ref} aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" />
  );
}
