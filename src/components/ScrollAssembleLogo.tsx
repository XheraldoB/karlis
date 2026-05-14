import React from 'react';
import { motion, MotionValue, useTransform, useSpring } from 'motion/react';

export const ScrollAssembleLogo = ({ 
  progress, 
  className 
}: { 
  progress: MotionValue<number>;
  className?: string;
}) => {
  const smoothProgress = useSpring(progress, {
    stiffness: 40,
    damping: 15,
    restDelta: 0.001
  });

  const range = [0, 0.6];

  // Responsive Math: 
  // We use percentages based on the native dimensions of the SVG paths 
  // relative to an 850px flex container with 40px gaps. This eliminates
  // JS scaling bugs and renders perfectly flush without cropped borders.
  
  const seaX = useTransform(smoothProgress, range, ["0%", "120.652%"]);
  const seaY = useTransform(smoothProgress, range, ["0%", "76.296%"]);

  const homeX = useTransform(smoothProgress, range, ["0%", "-1.562%"]);
  const homeY = useTransform(smoothProgress, range, ["0%", "-31.428%"]);

  const sunX = useTransform(smoothProgress, range, ["0%", "-18.831%"]);
  const sunY = useTransform(smoothProgress, range, ["0%", "-61.437%"]);

  const bbqX = useTransform(smoothProgress, range, ["0%", "-115.500%"]);
  const bbqY = useTransform(smoothProgress, range, ["0%", "30.046%"]);

  // We increase scale towards the end of the scroll purely for visual impact 
  // on mobile, keeping it gracefully responsive and centered.
  const visualImpactScale = useTransform(smoothProgress, range, [1, 1.4]);

  return (
    <div className={`relative flex justify-center items-center w-full max-w-[850px] mx-auto overflow-visible ${className}`}>
      <motion.div 
        className="w-full flex justify-between items-center"
        style={{ scale: visualImpactScale, transformOrigin: 'center center' }}
      >
        
        {/* 1. Sea */}
        <motion.svg 
          id="shape-bottom-left"
          viewBox="168 359 184 135" 
          fill="currentColor" 
          className="w-[21.647%] h-auto drop-shadow-md overflow-visible"
          style={{ x: seaX, y: seaY }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path className="cls-4" d="m348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z" />
        </motion.svg>

        {/* 2. Home */}
        <motion.svg 
          id="shape-top-left"
          viewBox="168 153 192 210" 
          fill="currentColor" 
          className="w-[22.588%] h-auto drop-shadow-md overflow-visible"
          style={{ x: homeX, y: homeY }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon className="cls-4" points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6" />
        </motion.svg>

        {/* 3. Sun */}
        <motion.svg 
          id="shape-circle"
          viewBox="372 153 154 153" 
          fill="currentColor" 
          className="w-[18.117%] h-auto drop-shadow-md overflow-visible"
          style={{ x: sunX, y: sunY }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path className="cls-4" d="m422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z" />
        </motion.svg>

        {/* 4. BBQ */}
        <motion.svg 
          id="shape-bottom-right"
          viewBox="368 281 200 213" 
          fill="currentColor" 
          className="w-[23.529%] h-auto drop-shadow-md overflow-visible"
          style={{ x: bbqX, y: bbqY }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path className="cls-4" d="m549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z" />
        </motion.svg>
        
      </motion.div>
    </div>
  );
};
