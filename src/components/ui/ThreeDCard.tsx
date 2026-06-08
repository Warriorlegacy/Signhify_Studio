import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function ThreeDCard({ children, className = "", maxTilt = 12 }: ThreeDCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring configuration
  const springConfig = { damping: 25, stiffness: 250, mass: 0.8 };

  // Map normalized mouse position to rotation values
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), springConfig);

  // Shine position mapped across the card surface
  const shineX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const shineY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const gradient = useTransform(
    [shineX, shineY],
    ([sx, sy]) =>
      `radial-gradient(circle at ${sx}% ${sy}%, oklch(0.72 0.21 45 / 0.15) 0%, transparent 60%)`,
  );

  return (
    <div className="group perspective-1000">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative transition-shadow duration-300 ${className}`}
      >
        <div
          style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }}
          className="h-full w-full"
        >
          {children}
        </div>
        {/* Dynamic lighting reflection */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: gradient,
            mixBlendMode: "screen",
          }}
        />
      </motion.div>
    </div>
  );
}
