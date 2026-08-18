import { useId } from "react";

/**
 * Signhify brand mark — a flowing "S" (signature/scroll ribbon) drawn in
 * ember-to-gold, with a spark dot and orbit ring that echo the cinematic
 * scroll-motion product. Original mark; not derived from any prior logo.
 */
export function SignhifyLogo({
  size = 32,
  className,
  showTile = true,
}: {
  size?: number;
  className?: string;
  showTile?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const main = `sh-main-${uid}`;
  const border = `sh-border-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Signhify"
    >
      <defs>
        <linearGradient id={main} x1="8" y1="10" x2="40" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" />
          <stop offset="1" stopColor="#FFB347" />
        </linearGradient>
        <linearGradient id={border} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6B00" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFB347" stopOpacity="0.18" />
        </linearGradient>
      </defs>

      {showTile && (
        <rect
          x="2.5"
          y="2.5"
          width="43"
          height="43"
          rx="13"
          fill="#0B0B0D"
          stroke={`url(#${border})`}
          strokeWidth="1.5"
        />
      )}

      {/* flowing S: arch over, diagonal, arch under */}
      <path
        d="M15.5 13 A 9 9 0 0 1 31 19.5 L 27.5 25.5 A 7.5 7.5 0 0 1 17 31"
        stroke={`url(#${main})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* spark + orbit */}
      <circle cx="14.5" cy="16" r="2.4" fill="#FFD9A0" />
      <ellipse
        cx="14.5"
        cy="16"
        rx="6.5"
        ry="2.4"
        stroke={`url(#${main})`}
        strokeWidth="1.3"
        transform="rotate(-20 14.5 16)"
        opacity="0.65"
      />
    </svg>
  );
}