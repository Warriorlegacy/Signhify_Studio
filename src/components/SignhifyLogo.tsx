import { useId } from "react";

export interface SignhifyLogoProps {
  /** Size in pixels (width and height). Defaults to 32 */
  size?: number;
  className?: string;
  /** Whether to render inside the dark obsidian glass tile container. Defaults to true */
  showTile?: boolean;
  /** Whether to show the glowing ambient backdrop aura. Defaults to false */
  showGlow?: boolean;
  /** Custom accessible label */
  ariaLabel?: string;
}

/**
 * Signhify Brand Mark — A high-precision kinetic "S" monogram crafted with
 * multi-layered electric emerald & neon lime gradients, specular light bevels,
 * and a glowing plasma energy nexus.
 */
export function SignhifyLogo({
  size = 32,
  className = "",
  showTile = true,
  showGlow = false,
  ariaLabel = "Signhify",
}: SignhifyLogoProps) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");

  const gMain = `sh-g-main-${uid}`;
  const gAccent = `sh-g-accent-${uid}`;
  const gDark = `sh-g-dark-${uid}`;
  const gBorder = `sh-g-border-${uid}`;
  const gTile = `sh-g-tile-${uid}`;
  const fGlow = `sh-f-glow-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        {/* Core Electric Emerald-to-Lime Gradient */}
        <linearGradient id={gMain} x1="10" y1="12" x2="54" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="45%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Secondary Cyan-Mint Shading Gradient for Depth */}
        <linearGradient id={gAccent} x1="14" y1="48" x2="50" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#86EFAC" />
        </linearGradient>

        {/* Deep Underlay Ambient Gradient */}
        <linearGradient id={gDark} x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#14532D" />
          <stop offset="100%" stopColor="#052E16" />
        </linearGradient>

        {/* Glass Tile Border Gradient */}
        <linearGradient id={gBorder} x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#22C55E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.15" />
        </linearGradient>

        {/* Tile Background Radial Glow */}
        <radialGradient id={gTile} cx="32" cy="30" r="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.16" />
          <stop offset="65%" stopColor="#080C16" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#040711" />
        </radialGradient>

        {/* Neon Glow Filter */}
        <filter id={fGlow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient Outer Aura Glow (optional) */}
      {showGlow && (
        <circle cx="32" cy="32" r="26" fill="#22C55E" opacity="0.25" filter={`url(#${fGlow})`} />
      )}

      {/* Dark Obsidian Squircle Tile */}
      {showTile && (
        <>
          <rect
            x="3.5"
            y="3.5"
            width="57"
            height="57"
            rx="17"
            fill={`url(#${gTile})`}
            stroke={`url(#${gBorder})`}
            strokeWidth="1.5"
          />
          {/* Subtle top-inner specular light reflection */}
          <path
            d="M 12 5.5 Q 32 4.5 52 5.5"
            stroke="#FFFFFF"
            strokeWidth="0.8"
            strokeOpacity="0.2"
            strokeLinecap="round"
          />
        </>
      )}

      {/* ── Precision "S" Kinetic Ribbon Monogram ── */}
      <g filter={`url(#${fGlow})`}>
        {/* Deep Under-Ribbon Shadow / Occlusion Path */}
        <path
          d="M 23 27 C 27 21 37 21 41 27 C 43 30 42 34 39 37 L 27 46 C 23 49 22 52 25 54"
          stroke={`url(#${gDark})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />

        {/* Lower Sweeping Ribbon Arc (Bottom loop of 'S') */}
        <path
          d="M 23 35 C 23 35 29 32 35 34 C 42 36 47 41 44 47 C 41 53 32 55 24 51 C 18 48 16 43 18 39"
          stroke={`url(#${gAccent})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Upper Sweeping Ribbon Arc (Top loop of 'S') */}
        <path
          d="M 46 25 C 48 21 46 16 40 13 C 32 9 23 11 20 17 C 17 23 22 28 29 30 C 35 32 41 35 41 35"
          stroke={`url(#${gMain})`}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Diagonal Dynamic Energy Bridge connecting both arcs */}
        <path
          d="M 40 21 L 24 43"
          stroke={`url(#${gMain})`}
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Upper Specular Gleam Highlight */}
        <path
          d="M 24 14.5 C 29 12 36 12.5 41 15.5"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Lower Specular Gleam Highlight */}
        <path
          d="M 25 51.5 C 31 54 39 53 43 48.5"
          stroke="#86EFAC"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Central White-Hot Energy Spark Nexus */}
        <circle cx="32" cy="32" r="3.2" fill="#FFFFFF" />
        <circle cx="32" cy="32" r="5" stroke={`url(#${gMain})`} strokeWidth="1.2" opacity="0.8" />

        {/* Dynamic Energy Orbit Ring */}
        <ellipse
          cx="32"
          cy="32"
          rx="11"
          ry="4"
          stroke={`url(#${gAccent})`}
          strokeWidth="1.2"
          transform="rotate(-30 32 32)"
          opacity="0.75"
          strokeDasharray="18 4"
        />
      </g>
    </svg>
  );
}

/**
 * Signhify Brand Lockup — Logo + Typography Wordmark
 */
export function SignhifyBrand({
  size = 32,
  className = "",
  showTagline = false,
}: {
  size?: number;
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <SignhifyLogo size={size} className="shrink-0" />
      <div className="flex flex-col">
        <span className="font-display font-bold tracking-tight text-foreground text-base leading-none">
          Signhify
        </span>
        {showTagline && (
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#4ADE80] font-mono font-semibold mt-0.5">
            AI 3D Studio
          </span>
        )}
      </div>
    </div>
  );
}