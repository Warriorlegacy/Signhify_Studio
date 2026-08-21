import { useEffect, useRef } from "react";

interface TemplateParticleCanvasProps {
  mode: "cyberpunk" | "quantum" | "galaxy" | "matrix" | "luxury" | "mesh" | "audio" | "energy";
  accent?: string;
  secondaryAccent?: string;
  scrubProgress?: number;
  className?: string;
  interactive?: boolean;
}

export function TemplateParticleCanvas({
  mode = "cyberpunk",
  accent = "#22c55e",
  secondaryAccent = "#4ade80",
  scrubProgress = 50,
  className = "w-full h-full",
  interactive = true,
}: TemplateParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 400);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Mouse tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Particle setup
    const particleCount = mode === "matrix" ? 60 : 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 400 - 200,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      vz: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 2.5 + 1.2,
      phase: Math.random() * Math.PI * 2,
      char: String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96)),
    }));

    let time = 0;

    const render = () => {
      time += 0.02;
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const scrubFactor = (scrubProgress / 100) * Math.PI * 2;
      const rotationSpeed = time + scrubFactor;

      if (mode === "matrix") {
        // Digital Rain / Cyber Grid
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(0, 0, width, height);

        ctx.font = "12px monospace";
        particles.forEach((p, i) => {
          p.y += (i % 3 + 1) * 2;
          if (p.y > height) {
            p.y = 0;
            p.x = Math.random() * width;
            p.char = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96));
          }

          const alpha = Math.sin(time * 2 + p.phase) * 0.3 + 0.7;
          ctx.fillStyle = i % 4 === 0 ? "#ffffff" : accent;
          ctx.globalAlpha = alpha;
          ctx.fillText(p.char, p.x, p.y);
        });
      } else if (mode === "mesh" || mode === "energy") {
        // 3D Geometric Mesh / Lattice Points
        const cx = width / 2;
        const cy = height / 2;

        ctx.strokeStyle = accent;
        ctx.lineWidth = 0.8;

        const renderedPoints: { x: number; y: number; z: number }[] = [];

        particles.forEach((p) => {
          // 3D rotation
          const rad = rotationSpeed * 0.5;
          const x1 = p.x - cx;
          const y1 = p.y - cy;
          const z1 = p.z;

          const rx = x1 * Math.cos(rad) - z1 * Math.sin(rad);
          const rz = x1 * Math.sin(rad) + z1 * Math.cos(rad) + 300;

          const fov = 350;
          const scale = fov / (fov + rz);
          const px = cx + rx * scale + (mouseX - cx) * 0.08;
          const py = cy + y1 * scale + (mouseY - cy) * 0.08;

          renderedPoints.push({ x: px, y: py, z: rz });

          const alpha = Math.max(0.1, Math.min(1, scale * 0.8));
          ctx.fillStyle = accent;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw connections
        ctx.globalAlpha = 0.18;
        for (let i = 0; i < renderedPoints.length; i++) {
          for (let j = i + 1; j < renderedPoints.length; j++) {
            const dx = renderedPoints[i].x - renderedPoints[j].x;
            const dy = renderedPoints[i].y - renderedPoints[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 75) {
              ctx.beginPath();
              ctx.moveTo(renderedPoints[i].x, renderedPoints[i].y);
              ctx.lineTo(renderedPoints[j].x, renderedPoints[j].y);
              ctx.stroke();
            }
          }
        }
      } else if (mode === "audio") {
        // Audio Waves / Frequency Oscillations
        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) * 0.28;

        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.85;

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.05) {
          const wave = Math.sin(a * 8 + time * 3 + scrubFactor) * 14 + Math.cos(a * 4 - time * 2) * 8;
          const r = radius + wave;
          const x = cx + Math.cos(a) * r + (mouseX - cx) * 0.05;
          const y = cy + Math.sin(a) * r + (mouseY - cy) * 0.05;

          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner glowing core
        const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, radius * 0.7);
        grad.addColorStop(0, accent);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.25;
        ctx.fill();

        // Floating frequency particles
        particles.slice(0, 30).forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          ctx.fillStyle = secondaryAccent;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Quantum, Cyberpunk, Galaxy, Luxury default 3D kinetic dust & orbital rings
        const cx = width / 2;
        const cy = height / 2;

        // Central glowing orbit ring
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotationSpeed * 0.3);
        ctx.strokeStyle = accent;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.3, height * 0.18, (scrubProgress / 100) * 0.5, 0, Math.PI * 2);
        ctx.stroke();

        // Secondary ring
        ctx.strokeStyle = secondaryAccent;
        ctx.lineWidth = 0.8;
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.ellipse(0, 0, width * 0.38, height * 0.25, -(scrubProgress / 100) * 0.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // Swirling 3D orbital particles
        particles.forEach((p) => {
          p.phase += 0.015;
          const rad = p.phase + rotationSpeed;
          const dist = 60 + (p.z + 200) * 0.6;
          const px = cx + Math.cos(rad) * dist + (mouseX - cx) * 0.06;
          const py = cy + Math.sin(rad * 0.8) * (dist * 0.55) + (mouseY - cy) * 0.06;

          const depthAlpha = ((p.z + 200) / 400) * 0.7 + 0.2;
          ctx.fillStyle = p.z > 0 ? accent : secondaryAccent;
          ctx.globalAlpha = depthAlpha;

          ctx.beginPath();
          ctx.arc(px, py, p.size * (depthAlpha + 0.5), 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (canvas) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [mode, accent, secondaryAccent, scrubProgress, interactive]);

  return <canvas ref={canvasRef} className={className} />;
}
