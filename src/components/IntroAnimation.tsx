import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const IntroAnimation = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    // Timing for the stone impact sound (when the spring animation roughly hits the center)
    const soundTimer = setTimeout(() => {
      const audio = new Audio('https://actions.google.com/sounds/v1/foley/chunky_rock_hit.ogg');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Browsers require user interaction sometimes, but we try anyway
        console.log("Audio play prevented by browser policy without interaction");
      });
    }, 900); // 0.5s delay + 0.4s travel time

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3500); // Stay visible for a few seconds before fading out

    return () => {
      clearTimeout(soundTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div 
      key="intro-overlay"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-brand-beige)] overflow-hidden"
    >
      {/* Background Placeholder Image */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 4.5, ease: 'easeOut' }}
          src="https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&w=2000&q=80" 
          alt="Stone House Background Image" 
          className="w-full h-full object-cover blur-sm opacity-40 grayscale sepia-[0.3]"
        />
        <div className="absolute inset-0 bg-[var(--color-brand-brown)]/10 mix-blend-multiply" />
      </div>

      {/* Logo Animation */}
      <motion.div 
        className="w-[90vw] max-w-4xl relative z-10 text-[var(--color-brand-brown)]"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, delay: 0.8, type: 'spring', bounce: 0.4 }}
      >
        <svg viewBox="100 100 500 450" className="w-full h-auto drop-shadow-2xl" fill="currentColor">
          {/* Sea (Bottom Left) -> goes to position 1 on the left initially */}
          <motion.g
            initial={{ x: -120, y: -130 }}
            animate={{ x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, type: 'spring', bounce: 0.25 }}
          >
            <path d="M348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z" />
          </motion.g>

          {/* Sun (Top Right) -> position 2 initially */}
          <motion.g
            initial={{ x: -160, y: 70 }}
            animate={{ x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, type: 'spring', bounce: 0.25 }}
          >
            <path d="M422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z" />
          </motion.g>

          {/* Home/Mountain (Top Left) -> position 3 initially */}
          <motion.g
            initial={{ x: 120, y: 80 }}
            animate={{ x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, type: 'spring', bounce: 0.25 }}
          >
            <polygon points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6" />
          </motion.g>

          {/* BBQ (Bottom Right) -> position 4 initially */}
          <motion.g
            initial={{ x: 50, y: -120 }}
            animate={{ x: 0, y: 0 }}
            transition={{ delay: 0.5, duration: 1.2, type: 'spring', bounce: 0.25 }}
          >
            <path d="M549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z" />
          </motion.g>
        </svg>
      </motion.div>
    </motion.div>
  );
};
