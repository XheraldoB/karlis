import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('lithos_cookie_consent');
    if (!consent) {
      // Small delay before showing so it doesn't hit them immediately on load
      const timer = setTimeout(() => setIsVisible(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    localStorage.setItem('lithos_cookie_consent', type);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-auto md:w-96 z-50 bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] p-6 rounded-2xl shadow-2xl flex flex-col gap-4 font-sans"
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl tracking-widest text-[#f2ece4]">lithos</span>
              <span className="h-4 w-[1px] bg-[var(--color-brand-beige)]/30"></span>
              <span className="text-xs uppercase tracking-widest opacity-80 mt-1">Privacy</span>
            </div>
            <button 
              onClick={() => setIsVisible(false)}
              className="opacity-50 hover:opacity-100 transition-opacity p-1"
              aria-label="Κλείσιμο"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">
            Χρησιμοποιούμε cookies για να εξασφαλίσουμε την καλύτερη δυνατή εμπειρία πλοήγησης στο site μας και για τη λειτουργία των κρατήσεων.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              onClick={() => handleAccept('all')}
              className="bg-[var(--color-brand-olive)] hover:bg-[var(--color-brand-olive)]/80 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full"
            >
              Αποδοχή όλων
            </button>
            <button
              onClick={() => handleAccept('essential')}
              className="border border-[var(--color-brand-beige)]/30 hover:bg-[var(--color-brand-beige)]/10 text-[var(--color-brand-beige)] px-4 py-2.5 rounded-lg text-sm font-medium transition-colors w-full whitespace-nowrap"
            >
              Μόνο απαραίτητα
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
