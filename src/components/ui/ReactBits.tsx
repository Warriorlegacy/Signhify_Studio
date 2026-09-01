import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ==========================================
// 1. DitherWaves (Retro Dithered Wave Canvas)
// ==========================================
interface DitherWavesProps {
  className?: string;
  waveColor?: string;
  dotColor?: string;
  speed?: number;
  density?: number;
}

export function DitherWaves({
  className = "",
  waveColor = "#FF6A00",
  dotColor = "rgba(255, 255, 255, 0.15)",
  speed = 0.002,
  density = 14,
}: DitherWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      time += speed;
      ctx.clearRect(0, 0, width, height);

      const step = density;
      for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
          // Multi-frequency wave calculation
          const dist1 = Math.sin(x * 0.008 + time * 3) * Math.cos(y * 0.008 + time * 2);
          const dist2 = Math.sin((x + y) * 0.005 - time * 2);
          const val = (dist1 + dist2 + 2) / 4; // 0 to 1

          if (val > 0.45) {
            const radius = val * (step / 3);
            ctx.beginPath();
            ctx.arc(x, y, Math.max(0.5, radius), 0, Math.PI * 2);
            ctx.fillStyle = val > 0.7 ? waveColor : dotColor;
            ctx.globalAlpha = val > 0.7 ? 0.6 : 0.25;
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [waveColor, dotColor, speed, density]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`}
    />
  );
}

// ==========================================
// 2. AuroraGlow (Gentle Ambient Aurora Mesh)
// ==========================================
interface AuroraGlowProps {
  className?: string;
  colors?: string[];
  opacity?: number;
  blur?: number;
}

export function AuroraGlow({
  className = "",
  colors = ["#FF6A00", "#9333EA", "#06B6D4"],
  opacity = 0.2,
  blur = 120,
}: AuroraGlowProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          rotate: [0, 90, 180, 270, 360],
          x: ["0%", "8%", "-6%", "0%"],
          y: ["0%", "-10%", "6%", "0%"],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] rounded-full mix-blend-screen"
        style={{
          filter: `blur(${blur}px)`,
          background: `radial-gradient(circle at 30% 30%, ${colors[0]} 0%, transparent 60%),
                       radial-gradient(circle at 70% 60%, ${colors[1]} 0%, transparent 55%),
                       radial-gradient(circle at 40% 80%, ${colors[2]} 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}

// ==========================================
// 3. SpotlightCard (Double-Bezel Cursor Torch)
// ==========================================
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 106, 0, 0.12)",
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative rounded-2xl p-[1px] bg-gradient-to-b from-white/10 to-white/[0.02] overflow-hidden group ${className}`}
    >
      {/* Dynamic Cursor Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />

      {/* Inner Core Container */}
      <div className="relative h-full w-full rounded-[calc(1rem-1px)] bg-zinc-950/90 backdrop-blur-xl p-6 transition-all duration-300 group-hover:bg-zinc-950/80">
        {children}
      </div>
    </div>
  );
}

// ==========================================
// 4. SilkTouchCard (Haptic 3D Spring Tilt)
// ==========================================
interface SilkTouchCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SilkTouchCard({ children, className = "" }: SilkTouchCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 350, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 350, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative rounded-3xl p-1.5 ring-1 ring-white/10 bg-white/[0.02] backdrop-blur-2xl shadow-2xl transition-shadow hover:shadow-amber-500/5 ${className}`}
    >
      <div
        style={{ transform: "translateZ(20px)" }}
        className="h-full w-full rounded-[calc(1.5rem-0.375rem)] bg-zinc-950/80 p-6 border border-white/5"
      >
        {children}
      </div>
    </motion.div>
  );
}

// ==========================================
// 5. TextDither (Retro Staggered Entrance)
// ==========================================
interface TextDitherProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextDither({ text, className = "", delay = 0 }: TextDitherProps) {
  const letters = Array.from(text);

  return (
    <span className={`inline-block ${className}`}>
      {letters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + index * 0.025,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}
