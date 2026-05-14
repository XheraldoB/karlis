import React from 'react';

/* =================================================================
   LITHOS — Brand symbols & illustrated category icons
   The full logo symbol uses the original designer's exact viewBox
   and paths (from the official Visual Identity SVGs).
   ================================================================= */

// ─────────────────────────────────────────────────────────
// The Brand Mark (full logo symbol — 4 shapes assembled)
// ─────────────────────────────────────────────────────────
export const BrandMark = ({ className }: { className?: string }) => (
  <svg viewBox="169 155 395 337" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6" />
    <path d="M422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z" />
    <path d="M348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z" />
    <path d="M549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z" />
  </svg>
);

// ─────────────────────────────────────────────────────────
// Stone Stack Menu Icon (per designer PDF — 3 stones stacked)
// ─────────────────────────────────────────────────────────
export const StoneMenuIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    {/* top stone */}
    <path d="M 20 28 L 50 22 L 80 30 L 75 42 L 50 38 L 25 42 Z" />
    {/* middle larger stone */}
    <path d="M 14 48 L 50 42 L 86 50 L 82 64 L 50 60 L 18 64 Z" />
    {/* bottom widest */}
    <path d="M 10 70 L 50 64 L 90 72 L 86 82 L 50 78 L 14 82 Z" />
  </svg>
);

// ─────────────────────────────────────────────────────────
// Illustrated category icons (per Philosophy section in designer PDF)
// Each category gets a unique illustrated motif — not the logo split.
// ─────────────────────────────────────────────────────────

// SEA — blue boat on water
export const SeaIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* water base */}
    <path d="M30 140 Q 100 110 170 140 L 170 175 Q 100 165 30 175 Z" fill="#95c2d5" />
    {/* boat hull */}
    <path d="M60 130 Q 100 155 140 130 L 130 145 Q 100 150 70 145 Z" fill="#1d434b" />
    {/* sail */}
    <path d="M100 60 L 100 130 L 135 130 Z" fill="#1d434b" />
    {/* mast highlight */}
    <line x1="100" y1="55" x2="100" y2="130" stroke="#1d434b" strokeWidth="3" />
  </svg>
);

// MOUNTAIN — angular peaks
export const MountainIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* far mountain (lighter) */}
    <path d="M30 160 L 80 60 L 130 130 L 115 160 Z" fill="#9bafa9" />
    {/* front mountain (darker) */}
    <path d="M75 160 L 130 80 L 170 160 Z" fill="#3d5a2e" />
    {/* snowcap on far peak */}
    <path d="M70 80 L 80 60 L 90 80 L 80 75 Z" fill="#e6e2d6" />
  </svg>
);

// HOUSE — stone house silhouette
export const HouseIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* roof */}
    <path d="M40 105 L 100 60 L 160 105 L 150 110 L 100 73 L 50 110 Z" fill="#2d1912" />
    {/* body */}
    <rect x="55" y="105" width="90" height="60" fill="#5a3a2b" />
    {/* door */}
    <rect x="90" y="125" width="20" height="40" fill="#2d1912" />
    {/* windows */}
    <rect x="65" y="115" width="14" height="14" fill="#e6e2d6" />
    <rect x="121" y="115" width="14" height="14" fill="#e6e2d6" />
    {/* chimney */}
    <rect x="130" y="68" width="10" height="22" fill="#2d1912" />
  </svg>
);

// SUN/FAMILY — sun with rays
export const SunIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* sun rays */}
    <g stroke="#c89b4a" strokeWidth="5" strokeLinecap="round">
      <line x1="100" y1="30" x2="100" y2="48" />
      <line x1="100" y1="152" x2="100" y2="170" />
      <line x1="30" y1="100" x2="48" y2="100" />
      <line x1="152" y1="100" x2="170" y2="100" />
      <line x1="50" y1="50" x2="63" y2="63" />
      <line x1="137" y1="137" x2="150" y2="150" />
      <line x1="150" y1="50" x2="137" y2="63" />
      <line x1="50" y1="150" x2="63" y2="137" />
    </g>
    {/* sun body */}
    <circle cx="100" cy="100" r="35" fill="#e8a854" />
    {/* warm overlay glow */}
    <circle cx="100" cy="100" r="22" fill="#d6883a" />
  </svg>
);

// BBQ/WELCOME — fire with flames
export const BbqIllustration = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* logs */}
    <rect x="55" y="145" width="90" height="10" rx="3" fill="#5a3a2b" />
    <rect x="60" y="155" width="80" height="8" rx="3" fill="#2d1912" />
    {/* big flame */}
    <path d="M100 55 Q 75 95 80 125 Q 90 140 100 142 Q 110 140 120 125 Q 125 95 100 55 Z" fill="#d65a30" />
    {/* inner flame */}
    <path d="M100 80 Q 88 105 92 125 Q 100 135 108 125 Q 112 105 100 80 Z" fill="#e8a854" />
    {/* core */}
    <path d="M100 105 Q 96 118 100 130 Q 104 118 100 105 Z" fill="#fae08a" />
  </svg>
);

/* =================================================================
   Map of category id → illustration component
   ================================================================= */
export const categoryIllustrations: Record<string, React.FC<{ className?: string }>> = {
  sea: SeaIllustration,
  mountain: MountainIllustration,
  home: HouseIllustration,
  sun: SunIllustration,
  bbq: BbqIllustration,
};
