import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: "up" | "left" | "right" | "scale";
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hidden: CSSProperties = {
    opacity: 0,
    transition:
      "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
    transitionDelay: `${delay}ms`,
  };
  if (from === "up") hidden.transform = "translateY(40px)";
  if (from === "left") hidden.transform = "translateX(-50px)";
  if (from === "right") hidden.transform = "translateX(50px)";
  if (from === "scale") hidden.transform = "scale(0.8)";

  return (
    <div ref={ref} className={className} style={hidden}>
      {children}
    </div>
  );
}
