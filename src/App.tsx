import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { X, MapPin, Mail, Phone, Navigation } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { el, enUS } from 'date-fns/locale';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { BrandMark, StoneMenuIcon, categoryIllustrations } from './components/icons';
import { ScrollAssembleLogo } from './components/ScrollAssembleLogo';
import { CookieBanner } from './components/CookieBanner';
import { cn } from './lib/utils';
import { t, Language } from './i18n';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuState, setMenuState] = useState<'closed' | 'idle' | 'shrinking' | 'fading'>('closed');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeExplore, setActiveExplore] = useState<'all'|'sea'|'mountain'|'home'|'sun'|'bbq'>('all');
  const [lang, setLang] = useState<Language>('el');
  const [showLegalModal, setShowLegalModal] = useState<'terms' | 'privacy' | null>(null);

  const d = t[lang];

  /* ─────────────────────────────────────────
     Hero scroll progress (controls assembly + outro)
     ───────────────────────────────────────── */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  // After logo assembles (around 55%), it should slide down and the
  // brown navigation banner should build up from the top
  const logoY = useTransform(heroProgress, [0.55, 0.8], ['0%', '15%']);
  const logoScale = useTransform(heroProgress, [0.55, 0.85], [1, 0.18]);
  const logoOpacity = useTransform(heroProgress, [0.55, 0.78, 0.85], [1, 1, 0]);

  // The brown nav banner — invisible at start, builds up after assembly
  const navOpacity = useTransform(heroProgress, [0.7, 0.88], [0, 1]);
  const navHeight = useTransform(heroProgress, [0.7, 0.88], ['0%', '100%']);

  // Hero quote — fades in toward the end
  const quoteOpacity = useTransform(heroProgress, [0.85, 0.95], [0, 1]);
  const quoteY = useTransform(heroProgress, [0.85, 0.95], [30, 0]);

  // Global scroll (for the persistent header that takes over after hero)
  const [globalScrolled, setGlobalScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const heroEl = heroRef.current;
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      // Persistent nav appears once the hero has mostly scrolled past
      setGlobalScrolled(rect.bottom < window.innerHeight * 0.4);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: d.nav.home, href: '#home' },
    { label: d.nav.about, href: '#history' },
    { label: d.nav.gallery, href: '#gallery' },
    { label: d.nav.booking, href: '#booking' },
    { label: d.nav.location, href: '#location' },
    { label: d.nav.contact, href: '#contact' },
  ];

  const openMenu = () => { setIsMenuOpen(true); setMenuState('idle'); setSelectedItem(null); };
  const closeMenu = () => { setIsMenuOpen(false); setMenuState('closed'); setSelectedItem(null); };

  const handleItemClick = (href: string) => {
    if (menuState !== 'idle') return;
    setSelectedItem(href);
    setMenuState('shrinking');
    setTimeout(() => setMenuState('fading'), 500);
    setTimeout(() => {
      closeMenu();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  };

  const scrollTo = (href: string) => {
    closeMenu();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-beige)] text-[var(--color-brand-brown)] selection:bg-[var(--color-brand-olive)] selection:text-white">

      {/* ============================================================
          PERSISTENT NAVIGATION
          Appears solid AFTER hero. During hero, the hero owns the
          visual story (logo assembly → banner build).
          ============================================================ */}
      <motion.nav
        initial={false}
        animate={{
          opacity: globalScrolled ? 1 : 0,
          y: globalScrolled ? 0 : -20,
          pointerEvents: globalScrolled ? 'auto' : 'none',
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="fixed top-0 inset-x-0 z-40 bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] px-4 md:px-8 py-4 flex justify-between items-center shadow-sm"
      >
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollTo('#home')}>
          <BrandMark className="w-9 h-9 md:w-11 md:h-11 transition-transform duration-500 group-hover:scale-105" />
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-2xl md:text-3xl">lithos</span>
            <span className="font-sans text-[0.55rem] md:text-[0.65rem] tracking-widest uppercase opacity-80">
              {d.guesthouse}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setLang(lang === 'el' ? 'en' : 'el')}
            className="font-sans text-xs uppercase tracking-widest hover:opacity-70 transition-opacity px-2 py-1 rounded border border-[var(--color-brand-beige)]/30"
          >
            {lang === 'el' ? 'EN' : 'ΕΛ'}
          </button>
          <button onClick={openMenu} className="p-1 hover:opacity-70 transition-opacity">
            <StoneMenuIcon className="w-8 h-8 md:w-10 md:h-10" />
          </button>
        </div>
      </motion.nav>

      {/* ============================================================
          MENU OVERLAY
          ============================================================ */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex overflow-hidden max-w-[100vw]"
          >
            <div
              className="bg-[var(--color-brand-beige)]/40 backdrop-blur-md w-1/3 md:w-1/2 cursor-pointer hidden md:block"
              onClick={closeMenu}
            />
            <div className="bg-[var(--color-brand-beige)] w-full md:w-1/2 h-full flex flex-col relative overflow-visible px-6 py-24 md:p-24">
              {menuState === 'idle' && (
                <motion.div
                  layoutId="active-bg"
                  className="absolute inset-0 bg-[var(--color-brand-brown)] z-0 origin-right"
                  transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                />
              )}
              <motion.button
                onClick={closeMenu}
                animate={{ color: menuState === 'idle' ? '#e6e2d6' : '#2d1912' }}
                className="absolute top-8 right-8 md:top-12 md:right-12 p-2 z-20 hover:scale-110 transition-transform"
              >
                <X className="w-8 h-8 md:w-10 md:h-10" />
              </motion.button>
              <div className="flex flex-col gap-8 md:gap-10 mt-20 md:mt-24 w-full relative z-10 items-end justify-center h-full">
                {navItems.map((item, i) => {
                  const isSelected = selectedItem === item.href;
                  const isFading = menuState === 'fading' && !isSelected;
                  return (
                    <div key={item.href} className="flex justify-end w-full relative">
                      {isSelected && menuState !== 'idle' && (
                        <motion.div
                          layoutId="active-bg"
                          className="absolute -inset-x-8 -inset-y-2 bg-[var(--color-brand-brown)] z-0 rounded-2xl"
                          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                        />
                      )}
                      <motion.a
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                          opacity: isFading ? 0 : 1,
                          x: 0,
                          color: (menuState === 'idle' || isSelected) ? '#e6e2d6' : '#2d1912',
                        }}
                        transition={{ duration: 0.5, delay: menuState === 'idle' ? i * 0.08 : 0 }}
                        href={item.href}
                        onClick={(e) => { e.preventDefault(); handleItemClick(item.href); }}
                        className="relative z-10 block font-serif italic text-3xl sm:text-4xl md:text-5xl px-4 cursor-pointer hover:opacity-75 transition-opacity"
                      >
                        {item.label}
                      </motion.a>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* ============================================================
            HERO — 3-act narrative driven by scroll:
              Act 1 (0%–55%):  4 shapes assemble horizontally → into logo
              Act 2 (55%–85%): assembled logo glides down + shrinks
              Act 3 (85%+):    brown nav banner builds up from the top
            ============================================================ */}
        <section id="home" ref={heroRef} className="relative h-[300vh]">
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-[var(--color-brand-beige)]">
            {/* Background image with subtle warm overlay */}
            <img
              src="https://images.unsplash.com/photo-1587632646274-0678c1cd8321?auto=format&fit=crop&w=2000&q=80"
              alt="Rustic stone interior"
              className="absolute inset-0 w-full h-full object-cover filter sepia-[0.4] saturate-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-[var(--color-brand-beige)]/75 z-10" />

            {/* The animated brown nav banner — builds from top */}
            <motion.div
              style={{ height: navHeight, opacity: navOpacity }}
              className="absolute top-0 inset-x-0 z-30 bg-[var(--color-brand-brown)] overflow-hidden"
            >
              <div className="h-[88px] md:h-[96px] px-4 md:px-8 flex justify-between items-center text-[var(--color-brand-beige)]">
                <div className="flex items-center gap-3">
                  <BrandMark className="w-9 h-9 md:w-11 md:h-11" />
                  <div className="flex flex-col leading-tight">
                    <span className="font-serif text-2xl md:text-3xl">lithos</span>
                    <span className="font-sans text-[0.55rem] md:text-[0.65rem] tracking-widest uppercase opacity-80">
                      {d.guesthouse}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <span className="font-sans text-xs uppercase tracking-widest px-2 py-1 rounded border border-[var(--color-brand-beige)]/30">
                    {lang === 'el' ? 'EN' : 'ΕΛ'}
                  </span>
                  <StoneMenuIcon className="w-8 h-8 md:w-10 md:h-10" />
                </div>
              </div>
            </motion.div>

            {/* Assembling logo (always vertically centered in hero) */}
            <motion.div
              style={{
                y: logoY,
                scale: logoScale,
                opacity: logoOpacity,
              }}
              className="relative z-20 h-full w-full flex items-center justify-center px-6"
            >
              <ScrollAssembleLogo
                progress={heroProgress}
                className="w-full max-w-3xl text-[var(--color-brand-brown)]"
              />
            </motion.div>

            {/* Hero quote — appears once assembly is done */}
            <motion.div
              style={{ opacity: quoteOpacity, y: quoteY }}
              className="absolute bottom-[12vh] md:bottom-[14vh] inset-x-0 text-center px-4 z-25"
            >
              <h1
                className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-[var(--color-brand-brown)] max-w-4xl mx-auto leading-tight"
              >
                "{lang === 'el' ? 'τόπος συνάντησης' : 'a meeting point'}
                <br />
                {lang === 'el' ? 'κάθε καλοκαίρι' : 'every summer'}"
              </h1>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            PHILOSOPHY — illustrated categories (per designer PDF)
            ============================================================ */}
        <PhilosophySection lang={lang} d={d} activeExplore={activeExplore} setActiveExplore={setActiveExplore} />

        {/* ============================================================
            HISTORY
            ============================================================ */}
        <section id="history" className="py-24 px-6 md:px-24 bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <h2 className="font-serif italic text-5xl md:text-7xl mb-8">{d.historyTitle}</h2>
              <div className="space-y-6 font-sans text-lg opacity-90 leading-relaxed">
                <p>{d.history1}</p>
                <p>{d.history2}</p>
                <p>{d.history3}</p>
                <div className="pt-8 border-t border-[var(--color-brand-beige)]/20">
                  <p className="font-serif italic text-2xl leading-normal">{d.historyQuote}</p>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 flex flex-col gap-8">
              <img
                src="https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1000&q=80"
                alt="House exterior"
                className="w-full aspect-[4/3] object-cover rounded-sm"
              />
              <img
                src="https://images.unsplash.com/photo-1546708973-c15be2118357?auto=format&fit=crop&w=1000&q=80"
                alt="Sea view"
                className="w-3/4 self-end aspect-[4/3] object-cover rounded-sm"
              />
            </div>
          </div>
        </section>

        {/* ============================================================
            TODAY
            ============================================================ */}
        <section className="py-24 px-6 md:px-24">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32 lg:gap-48 items-start">
            <h2 className="font-serif italic text-5xl md:text-7xl md:sticky top-32">{d.todayTitle}</h2>
            <div className="space-y-12 font-sans text-xl opacity-90 leading-relaxed">
              <p>{d.today1}</p>
              <p>{d.today2}</p>
              <p>{d.today3}</p>
              <div className="pt-8 border-t border-[var(--color-brand-brown)]/20">
                <p className="font-serif italic text-3xl whitespace-pre-line leading-snug">
                  {d.todayQuote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            CONCEPT
            ============================================================ */}
        <section className="py-24 px-6 md:px-24 bg-[var(--color-brand-beige-warm)]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif italic text-5xl md:text-6xl mb-12">{d.conceptTitle}</h2>
              <img
                src="https://images.unsplash.com/photo-1587632646274-0678c1cd8321?auto=format&fit=crop&w=800&q=80"
                alt="Stone texture"
                className="w-full aspect-[16/9] object-cover mb-8 rounded-sm"
              />
              <p className="font-serif italic text-2xl mb-8">{d.conceptSubtitle}</p>
              <p className="font-sans text-lg opacity-80 leading-relaxed">
                {d.concept1}<br/><br/>
                {d.concept2}
              </p>
            </div>
            <div className="md:pt-32 space-y-8 font-sans text-lg opacity-80 leading-relaxed">
              <p>{d.concept3}</p>
              <p>{d.concept4}</p>
            </div>
          </div>
        </section>

        {/* ============================================================
            GALLERY — staircase scroll-in (per designer PDF page 17)
            ============================================================ */}
        <GallerySection title={d.galleryTitle} />

        {/* ============================================================
            BOOKING
            ============================================================ */}
        <BookingSection lang={lang} d={d} />

        {/* ============================================================
            LOCATION
            ============================================================ */}
        <LocationSection d={d} />
      </main>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer id="contact" className="bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] py-16 px-6 md:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BrandMark className="w-10 h-10" />
              <div className="flex flex-col leading-tight">
                <span className="font-serif text-2xl">lithos</span>
                <span className="font-sans text-[0.6rem] tracking-widest uppercase opacity-80">
                  {d.guesthouse}
                </span>
              </div>
            </div>
            <p className="opacity-80 font-sans text-sm max-w-xs">{d.footerTagline}</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-serif italic text-2xl mb-6">{d.contact}</h4>
            <div className="flex items-center gap-3 opacity-80">
              <MapPin className="w-5 h-5" />
              <span>Οκτωνιά, Εύβοια</span>
            </div>
            <a href="mailto:info@lithosevia.gr" className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
              <Mail className="w-5 h-5" />
              <span>info@lithosevia.gr</span>
            </a>
            <a href="tel:+306900000000" className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
              <Phone className="w-5 h-5" />
              <span>+30 690 000 0000</span>
            </a>
          </div>
          <div className="flex flex-col justify-end items-start md:items-end gap-4">
            <div className="flex flex-row flex-wrap gap-6 font-sans text-sm opacity-80">
              <button
                onClick={() => setShowLegalModal('privacy')}
                className="hover:opacity-60 transition-opacity whitespace-nowrap"
              >
                {d.privacy}
              </button>
              <button
                onClick={() => setShowLegalModal('terms')}
                className="hover:opacity-60 transition-opacity whitespace-nowrap"
              >
                {d.terms}
              </button>
            </div>
            <div className="opacity-60 text-sm font-sans md:text-right">
              <p>&copy; {new Date().getFullYear()} Lithos Guesthouse.</p>
              <p>{d.allRightsReserved}</p>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />

      {/* Legal Modal */}
      <AnimatePresence>
        {showLegalModal && (
          <LegalModal
            kind={showLegalModal}
            lang={lang}
            onClose={() => setShowLegalModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===================================================================
   PHILOSOPHY SECTION
   Per designer PDF (pages 6–7): each category has its own
   illustrated icon — boat for sea, mountains for mountain, etc.
   =================================================================== */
function PhilosophySection({
  lang, d, activeExplore, setActiveExplore,
}: {
  lang: Language;
  d: typeof t['el'];
  activeExplore: 'all' | 'sea' | 'mountain' | 'home' | 'sun' | 'bbq';
  setActiveExplore: (v: 'all' | 'sea' | 'mountain' | 'home' | 'sun' | 'bbq') => void;
}) {
  return (
    <section id="explore" className="py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-serif italic text-4xl md:text-6xl mb-6 whitespace-pre-line leading-tight">
            {d.philosophyTitle}
          </h2>
          <p className="text-lg md:text-xl opacity-70 font-sans max-w-2xl mx-auto mt-8">
            {d.philosophyIntro}
          </p>
        </div>

        {/* Category grid — illustrated cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {d.exploreItems.map((cat) => {
            const Illustration = categoryIllustrations[cat.id];
            const isActive = activeExplore === cat.id;
            return (
              <motion.div
                key={cat.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6 }}
                onClick={() => setActiveExplore(isActive ? 'all' : (cat.id as any))}
                className={cn(
                  'relative p-8 rounded-2xl cursor-pointer transition-all duration-500 border',
                  isActive
                    ? 'bg-white/60 border-[var(--color-brand-brown)]/15 shadow-md'
                    : 'bg-transparent border-transparent hover:bg-white/30'
                )}
              >
                <div className="flex justify-center mb-6">
                  {Illustration && (
                    <Illustration className="w-32 h-32 md:w-40 md:h-40 drop-shadow-sm" />
                  )}
                </div>
                <h3 className="font-serif italic text-3xl mb-4 text-center text-[var(--color-brand-brown)]">
                  {cat.title}
                </h3>
                <p className="font-sans text-sm md:text-base opacity-80 leading-relaxed text-center">
                  {cat.description}
                </p>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.4 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-4 border-t border-[var(--color-brand-brown)]/15">
                        {cat.activities.map((a, idx) => (
                          <div key={idx} className="flex items-center gap-2 font-sans text-xs md:text-sm opacity-80">
                            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-teal)]" />
                            <span>{a}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   GALLERY — Staircase scroll animation (per designer PDF page 17)
   Photos appear one-by-one with vertical offset, like a staircase.
   =================================================================== */
function GallerySection({ title }: { title: string }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    'https://images.unsplash.com/photo-1546708973-c15be2118357?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516483638261-f40af5ba3233?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587632646274-0678c1cd8321?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
  ];

  // Staircase pattern: each image offset down from the previous one.
  // 4 columns; each subsequent image steps down by a fraction of its height.
  return (
    <section id="gallery" className="py-24 md:py-32 px-4 md:px-12 lg:px-24 bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif italic text-5xl md:text-7xl mb-16 md:mb-24 text-center">{title}</h2>

        {/* Desktop staircase grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 lg:gap-8">
          {images.map((src, i) => {
            const colIdx = i % 4;
            const offsetTop = colIdx * 60; // staircase step
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, delay: (i % 4) * 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: `${offsetTop}px` }}
                onClick={() => setSelectedImage(src)}
                className="cursor-pointer overflow-hidden rounded-sm group aspect-[3/4]"
              >
                <img
                  src={src}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </motion.div>
            );
          })}
        </div>

        {/* Mobile: simple 2-col grid */}
        <div className="md:hidden grid grid-cols-2 gap-3">
          {images.slice(0, 8).map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              onClick={() => setSelectedImage(src)}
              className="cursor-pointer overflow-hidden rounded-sm aspect-[3/4]"
            >
              <img src={src} className="w-full h-full object-cover" alt={`Gallery ${i + 1}`} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-8 cursor-zoom-out"
          >
            <img
              src={selectedImage}
              className="max-w-full max-h-full object-contain"
              alt="Gallery fullscreen"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              className="absolute top-4 right-4 md:top-8 md:right-8 p-3 text-white/50 hover:text-white transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8 md:w-10 md:h-10" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ===================================================================
   BOOKING
   =================================================================== */
function BookingSection({ lang, d }: { lang: Language; d: typeof t['el'] }) {
  const [range, setRange] = useState<DateRange | undefined>();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', guests: '2', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to) {
      alert(d.selectDates);
      return;
    }
    setStatus('loading');
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          checkIn: format(range.from, 'yyyy-MM-dd'),
          checkOut: format(range.to, 'yyyy-MM-dd'),
        }),
      });
      if (!res.ok) throw new Error('Network');
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', guests: '2', message: '' });
        setRange(undefined);
      } else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="booking" className="py-24 px-6 md:px-24 bg-[var(--color-brand-teal-light)]/15">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif italic text-5xl md:text-7xl mb-6">{d.bookingTitle}</h2>
          <p className="font-sans text-lg md:text-xl opacity-80 max-w-2xl mx-auto">{d.bookingText}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="bg-white/60 p-6 md:p-8 rounded-2xl shadow-sm border border-white/30">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              locale={lang === 'el' ? el : enUS}
              numberOfMonths={1}
              className="font-sans mx-auto flex justify-center"
              disabled={[{ before: new Date() }]}
            />
            {range?.from && range?.to && (
              <div className="mt-6 text-center p-4 bg-[var(--color-brand-olive)]/10 rounded-lg">
                <span className="font-bold">{d.selectedDates}</span><br/>
                {format(range.from, 'dd MMM yyyy', { locale: lang === 'el' ? el : enUS })} – {format(range.to, 'dd MMM yyyy', { locale: lang === 'el' ? el : enUS })}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 font-sans">
            {status === 'success' ? (
              <div className="bg-green-100/60 text-green-900 p-8 rounded-xl text-center">
                <h3 className="text-2xl font-serif italic mb-4">{d.bookingThanks}</h3>
                <p>{d.bookingSuccess}</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 bg-[var(--color-brand-olive)] text-white rounded hover:opacity-90"
                >
                  {d.newBooking}
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <Input label={d.fullName} required value={formData.name} onChange={(v) => setFormData(f => ({...f, name: v}))} />
                  <Input label={d.email} type="email" required value={formData.email} onChange={(v) => setFormData(f => ({...f, email: v}))} />
                </div>
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <Input label={d.phone} type="tel" value={formData.phone} onChange={(v) => setFormData(f => ({...f, phone: v}))} />
                  <div className="flex flex-col border-b border-[var(--color-brand-brown)]/30 pb-2">
                    <label className="text-sm opacity-70 mb-2">{d.guestsLabel}</label>
                    <select
                      className="bg-transparent focus:outline-none w-full"
                      value={formData.guests}
                      onChange={(e) => setFormData(f => ({...f, guests: e.target.value}))}
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} {d.guestSuffix}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col border-b border-[var(--color-brand-brown)]/30 pb-2">
                  <label className="text-sm opacity-70 mb-2">{d.msg}</label>
                  <textarea
                    rows={4}
                    className="bg-transparent focus:outline-none w-full resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData(f => ({...f, message: e.target.value}))}
                  />
                </div>
                {status === 'error' && <p className="text-red-700 text-sm">{d.error}</p>}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] py-4 px-12 md:self-start font-serif italic text-xl hover:bg-[var(--color-brand-olive)] transition-colors disabled:opacity-50 rounded-sm"
                >
                  {status === 'loading' ? d.sending : d.send}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({ label, type = 'text', required = false, value, onChange }: {
  label: string; type?: string; required?: boolean; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col border-b border-[var(--color-brand-brown)]/30 pb-2">
      <label className="text-sm opacity-70 mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none w-full"
      />
    </div>
  );
}

/* ===================================================================
   LOCATION
   =================================================================== */
const customIcon = L.divIcon({
  className: 'custom-pin',
  html: `
    <div style="display: flex; flex-direction: column; align-items: center; transform: translateY(-30px);">
      <div style="background: #e6e2d6; border-radius: 50%; padding: 14px; box-shadow: 0 10px 30px rgba(45,25,18,0.25); border: 2px solid rgba(45,25,18,0.1); width: 80px; height: 80px; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="169 155 395 337" style="width:50px;height:42px;color:#2d1912;" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <polygon points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6" />
          <path d="M422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z" />
          <path d="M348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z" />
          <path d="M549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z" />
        </svg>
      </div>
      <div style="margin-top: 8px; text-align: center; background: rgba(45,25,18,0.9); padding: 4px 12px; border-radius: 99px;">
        <div style="font-family: 'GFS Didot', serif; font-style: italic; font-size: 16px; color: #e6e2d6; line-height: 1.2;">Lithos</div>
      </div>
    </div>
  `,
  iconSize: [120, 140],
  iconAnchor: [60, 100],
});

function LocationSection({ d }: { d: typeof t['el'] }) {
  const position: [number, number] = [38.5414, 24.1245];
  const googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Οκτωνιά+Εύβοιας';

  return (
    <section id="location" className="py-24 px-6 md:px-24 bg-[var(--color-brand-beige)]">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="font-serif italic text-5xl md:text-7xl mb-8 text-center">{d.locationTitle}</h2>
        <p className="font-sans text-lg md:text-xl opacity-80 text-center max-w-2xl mb-12">{d.locationText}</p>

        <div className="w-full relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/40" style={{ height: '600px' }}>
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.15)] bg-gradient-to-tr from-[rgba(255,250,240,0.1)] to-transparent" />
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            zoomControl={false}
            className="w-full h-full relative z-0 bg-[#e4e1d7]"
          >
            <TileLayer
              attribution='&copy; CARTO'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
              className="map-tiles"
            />
            <Marker position={position} icon={customIcon} />
          </MapContainer>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[400]">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] py-4 px-8 rounded-full font-serif italic text-lg md:text-xl hover:bg-[var(--color-brand-olive)] transition-all shadow-[0_10px_30px_rgba(45,25,18,0.4)] hover:-translate-y-1"
            >
              <Navigation className="w-5 h-5" fill="currentColor" />
              <span>{d.getDirections}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================================================================
   LEGAL MODAL — Terms of Use / Privacy Policy
   =================================================================== */
function LegalModal({ kind, lang, onClose }: { kind: 'terms' | 'privacy'; lang: Language; onClose: () => void }) {
  const isEl = lang === 'el';
  const title = kind === 'terms'
    ? (isEl ? 'Όροι Χρήσης' : 'Terms of Use')
    : (isEl ? 'Πολιτική Απορρήτου' : 'Privacy Policy');

  const body = kind === 'terms'
    ? (isEl
        ? 'Η αποστολή αιτήματος ενδιαφέροντος δεν αποτελεί επιβεβαιωμένη κράτηση. Η οριστικοποίηση γίνεται κατόπιν επικοινωνίας με τον ιδιοκτήτη. Το περιεχόμενο της ιστοσελίδας (κείμενα, εικόνες, λογότυπα) αποτελεί ιδιοκτησία της οικογένειας Καρλή και προστατεύεται από δικαιώματα πνευματικής ιδιοκτησίας.'
        : 'A booking request does not constitute a confirmed reservation. Confirmation follows direct communication with the owner. All website content (text, images, logos) is the property of the Karli family and is protected by copyright.')
    : (isEl
        ? 'Σεβόμαστε τα προσωπικά σας δεδομένα. Τα στοιχεία της φόρμας ενδιαφέροντος χρησιμοποιούνται αποκλειστικά για την επικοινωνία μαζί σας σχετικά με την κράτηση και δεν διαβιβάζονται σε τρίτους, ούτε χρησιμοποιούνται για εμπορικούς σκοπούς. Μπορείτε ανά πάσα στιγμή να αιτηθείτε τη διαγραφή τους.'
        : 'We respect your personal data. The information from the booking form is used exclusively to contact you about your reservation and is not shared with third parties or used for commercial purposes. You may request deletion at any time.');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[var(--color-brand-beige)] text-[var(--color-brand-brown)] rounded-2xl p-8 md:p-10 max-w-xl w-full max-h-[80vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X className="w-6 h-6" />
        </button>
        <h3 className="font-serif italic text-3xl md:text-4xl mb-6">{title}</h3>
        <p className="font-sans text-base leading-relaxed opacity-90">{body}</p>
      </motion.div>
    </motion.div>
  );
}
