import React from 'react';

/* =================================================================
   LITHOS — Brand symbols
   ================================================================= */

// Category type used by InteractiveLogo & PhilosophySection
export type CategoryId = 'sea' | 'mountain' | 'home' | 'sun' | 'bbq' | 'all';

// ─────────────────────────────────────────────────────────
// BRAND MARK — Full logo symbol (4 shapes assembled, single color)
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
// STONE STACK MENU ICON (per designer brand book)
// ─────────────────────────────────────────────────────────
export const StoneMenuIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 100 100" className={className} style={style} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 20 28 L 50 22 L 80 30 L 75 42 L 50 38 L 25 42 Z" />
    <path d="M 14 48 L 50 42 L 86 50 L 82 64 L 50 60 L 18 64 Z" />
    <path d="M 10 70 L 50 64 L 90 72 L 86 82 L 50 78 L 14 82 Z" />
  </svg>
);

/* =================================================================
   INTERACTIVE LOGO
   Per the designer's brand-book pages: each category corresponds to
   one shape in the logo. When a category is active, that shape is
   highlighted in petrol (#1d434b) and the rest become gray (#a3abad).
   When activePart === 'all', the whole logo renders in the brand
   brown so it reads as a single solid mark.

   Mapping:
     sea       → bottom-left shape       (path "sea")
     mountain  → negative-space mountain (an overlay polygon)
     home      → top-left polygon
     sun       → top-right circle
     bbq       → bottom-right shape
   ================================================================= */

const GRAY = 'var(--color-brand-gray, #a3abad)';
const PETROL = 'var(--color-brand-teal, #1d434b)';
const SOLID = 'var(--color-brand-brown, #2d1912)';

export const InteractiveLogo = ({
  className,
  activePart = 'all',
  onPartHover,
  onPartClick,
}: {
  className?: string;
  activePart?: CategoryId;
  onPartHover?: (part: CategoryId) => void;
  onPartClick?: (part: CategoryId) => void;
}) => {
  const isAll = activePart === 'all';

  const fillFor = (part: Exclude<CategoryId, 'all'>) => {
    if (isAll) return SOLID;
    return activePart === part ? PETROL : GRAY;
  };

  const interactive = Boolean(onPartHover || onPartClick);
  const cursorStyle = interactive ? 'pointer' : 'default';

  const handlers = (part: CategoryId) => ({
    onMouseEnter: () => onPartHover?.(part),
    onClick: () => onPartClick?.(part),
  });

  return (
    <svg
      viewBox="169 155 395 337"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
      onMouseLeave={() => onPartHover?.('all')}
    >
      {/* HOME (top-left polygon) */}
      <polygon
        points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6"
        fill={fillFor('home')}
        style={{ transition: 'fill 0.45s ease', cursor: cursorStyle }}
        {...handlers('home')}
      />

      {/* MOUNTAIN — overlay polygon that sits on the lower edge of the
          home polygon, visually representing the inner mountain peak.
          It is shown only when activePart === 'mountain'.
          Triangle peak inside home, anchored at the home shape's
          lower contour. */}
      <polygon
        points="200,330 240,260 290,295 320,315 352,327 320,335 245,330"
        fill={activePart === 'mountain' ? PETROL : 'transparent'}
        style={{
          transition: 'fill 0.45s ease, opacity 0.45s ease',
          opacity: activePart === 'mountain' ? 1 : 0,
          cursor: cursorStyle,
          pointerEvents: 'none',
        }}
      />

      {/* SUN (top-right circle) */}
      <path
        d="M422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z"
        fill={fillFor('sun')}
        style={{ transition: 'fill 0.45s ease', cursor: cursorStyle }}
        {...handlers('sun')}
      />

      {/* SEA (bottom-left) */}
      <path
        d="M348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z"
        fill={fillFor('sea')}
        style={{ transition: 'fill 0.45s ease', cursor: cursorStyle }}
        {...handlers('sea')}
      />

      {/* BBQ (bottom-right) */}
      <path
        d="M549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z"
        fill={fillFor('bbq')}
        style={{ transition: 'fill 0.45s ease', cursor: cursorStyle }}
        {...handlers('bbq')}
      />

      {/* Invisible mountain hit-zone — sits on top so hover/click work
          even though the visible mountain overlay is non-interactive. */}
      <polygon
        points="200,330 240,260 290,295 320,315 352,327 320,335 245,330"
        fill="transparent"
        style={{ cursor: cursorStyle }}
        {...handlers('mountain')}
      />
    </svg>
  );
};
