import React from 'react';
import { motion, MotionValue, useTransform, useSpring } from 'motion/react';

/* =================================================================
   ScrollAssembleLogo
   The 4 logo shapes start spread in a horizontal row and assemble
   into the complete Lithos logo as the user scrolls the hero.

   Each shape lives in its own SVG (absolutely positioned inside a
   fixed-ratio stage that matches the assembled logo's aspect ratio).
   We interpolate between two keyframes — "spread" → "assembled" —
   using CSS left/top percentages so it scales fluidly.
   ================================================================= */

// Logo viewBox bounds: 169,155 → 564,492 ⇒ 395 × 337
const LOGO_W = 395;
const LOGO_H = 337;

// Each shape's natural placement inside the full logo viewBox
const SHAPES = {
  home: { w: 192, h: 180, vbX: 169, vbY: 155 },
  sun:  { w: 160, h: 155, vbX: 370, vbY: 153 },
  sea:  { w: 185, h: 136, vbX: 168, vbY: 358 },
  bbq:  { w: 197, h: 215, vbX: 368, vbY: 280 },
};

type ShapeId = keyof typeof SHAPES;

// Pre-compute assembled positions (% of stage)
const assembled: Record<ShapeId, { left: number; top: number; width: number; height: number }> =
  Object.fromEntries(
    Object.entries(SHAPES).map(([k, s]) => [
      k,
      {
        left:   ((s.vbX - 169) / LOGO_W) * 100,
        top:    ((s.vbY - 155) / LOGO_H) * 100,
        width:  (s.w / LOGO_W) * 100,
        height: (s.h / LOGO_H) * 100,
      },
    ])
  ) as Record<ShapeId, { left: number; top: number; width: number; height: number }>;

// Spread positions: horizontal row, vertically centered at midY
const SPREAD_ORDER: ShapeId[] = ['home', 'sun', 'sea', 'bbq'];
const GAP_PCT = 4;
const totalWidthPct =
  SPREAD_ORDER.reduce((sum, k) => sum + assembled[k].width, 0) +
  GAP_PCT * (SPREAD_ORDER.length - 1);
const startLeft = 50 - totalWidthPct / 2;
const spread: Record<ShapeId, { left: number; top: number }> = {} as Record<
  ShapeId,
  { left: number; top: number }
>;
let cursor = startLeft;
SPREAD_ORDER.forEach((k) => {
  spread[k] = {
    left: cursor,
    top: 50 - assembled[k].height / 2,
  };
  cursor += assembled[k].width + GAP_PCT;
});

function useToPercent(mv: MotionValue<number>): MotionValue<string> {
  return useTransform(mv, (v) => `${v}%`);
}

export const ScrollAssembleLogo = ({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) => {
  const smooth = useSpring(progress, {
    stiffness: 40,
    damping: 18,
    restDelta: 0.001,
  });

  // Assembly completes by 55% of hero scroll
  const range: [number, number] = [0, 0.55];

  // Numeric MotionValues per shape — hooks must be top-level
  const homeLeftNum = useTransform(smooth, range, [spread.home.left, assembled.home.left]);
  const homeTopNum  = useTransform(smooth, range, [spread.home.top,  assembled.home.top]);
  const sunLeftNum  = useTransform(smooth, range, [spread.sun.left,  assembled.sun.left]);
  const sunTopNum   = useTransform(smooth, range, [spread.sun.top,   assembled.sun.top]);
  const seaLeftNum  = useTransform(smooth, range, [spread.sea.left,  assembled.sea.left]);
  const seaTopNum   = useTransform(smooth, range, [spread.sea.top,   assembled.sea.top]);
  const bbqLeftNum  = useTransform(smooth, range, [spread.bbq.left,  assembled.bbq.left]);
  const bbqTopNum   = useTransform(smooth, range, [spread.bbq.top,   assembled.bbq.top]);

  const homeLeft = useToPercent(homeLeftNum);
  const homeTop  = useToPercent(homeTopNum);
  const sunLeft  = useToPercent(sunLeftNum);
  const sunTop   = useToPercent(sunTopNum);
  const seaLeft  = useToPercent(seaLeftNum);
  const seaTop   = useToPercent(seaTopNum);
  const bbqLeft  = useToPercent(bbqLeftNum);
  const bbqTop   = useToPercent(bbqTopNum);

  const baseStyle = {
    position: 'absolute' as const,
    overflow: 'visible' as const,
    color: 'var(--color-brand-brown)',
    fill: 'currentColor',
  };

  return (
    <div
      className={`relative w-full ${className ?? ''}`}
      style={{ overflow: 'visible' }}
    >
      <div
        className="relative mx-auto"
        style={{
          width: '100%',
          maxWidth: 520,
          aspectRatio: `${LOGO_W} / ${LOGO_H}`,
          overflow: 'visible',
        }}
      >
        {/* HOME (top-left) */}
        <motion.svg
          viewBox={`${SHAPES.home.vbX} ${SHAPES.home.vbY} ${SHAPES.home.w} ${SHAPES.home.h}`}
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            ...baseStyle,
            left: homeLeft,
            top: homeTop,
            width: `${assembled.home.width}%`,
            height: `${assembled.home.height}%`,
          }}
        >
          <polygon points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6" />
        </motion.svg>

        {/* SUN (top-right) */}
        <motion.svg
          viewBox={`${SHAPES.sun.vbX} ${SHAPES.sun.vbY} ${SHAPES.sun.w} ${SHAPES.sun.h}`}
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            ...baseStyle,
            left: sunLeft,
            top: sunTop,
            width: `${assembled.sun.width}%`,
            height: `${assembled.sun.height}%`,
          }}
        >
          <path d="M422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z" />
        </motion.svg>

        {/* SEA (bottom-left) */}
        <motion.svg
          viewBox={`${SHAPES.sea.vbX} ${SHAPES.sea.vbY} ${SHAPES.sea.w} ${SHAPES.sea.h}`}
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            ...baseStyle,
            left: seaLeft,
            top: seaTop,
            width: `${assembled.sea.width}%`,
            height: `${assembled.sea.height}%`,
          }}
        >
          <path d="M348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z" />
        </motion.svg>

        {/* BBQ (bottom-right) */}
        <motion.svg
          viewBox={`${SHAPES.bbq.vbX} ${SHAPES.bbq.vbY} ${SHAPES.bbq.w} ${SHAPES.bbq.h}`}
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            ...baseStyle,
            left: bbqLeft,
            top: bbqTop,
            width: `${assembled.bbq.width}%`,
            height: `${assembled.bbq.height}%`,
          }}
        >
          <path d="M549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z" />
        </motion.svg>
      </div>
    </div>
  );
};
