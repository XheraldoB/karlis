import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import { X, MapPin, Mail, Phone, Navigation } from 'lucide-react';
import { BrandMark, InteractiveLogo, StoneMenuIcon } from './components/icons';
import { ScrollAssembleLogo } from './components/ScrollAssembleLogo';
import { DayPicker } from 'react-day-picker';
import { cn } from './lib/utils';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { CookieBanner } from './components/CookieBanner';
import { t, Language } from './i18n';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuState, setMenuState] = useState<'closed' | 'idle' | 'shrinking' | 'fading'>('closed');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [activeExplore, setActiveExplore] = useState<'all'|'sea'|'mountain'|'home'|'sun'|'bbq'>('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [lang, setLang] = useState<Language>('el');
  
  const d = t[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  const quoteOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const quoteY = useTransform(scrollYProgress, [0.4, 0.6], [30, 0]);

  const navItems = [
    { label: d.nav.home, href: '#home' },
    { label: d.nav.about, href: '#history' },
    { label: d.nav.gallery, href: '#gallery' },
    { label: d.nav.booking, href: '#booking' },
    { label: d.nav.location, href: '#location' },
    { label: d.nav.contact, href: '#contact' },
  ];

  const openMenu = () => {
    setIsMenuOpen(true);
    setMenuState('idle');
    setSelectedItem(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setMenuState('closed');
    setSelectedItem(null);
  };

  const handleItemClick = (href: string) => {
    if (menuState !== 'idle') return;

    setSelectedItem(href);
    setMenuState('shrinking');
    
    setTimeout(() => {
      setMenuState('fading');
    }, 600);

    setTimeout(() => {
      closeMenu();
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  };

  const scrollTo = (href: string) => {
    closeMenu();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[var(--color-brand-beige)] text-[var(--color-brand-brown)] selection:bg-[var(--color-brand-olive)] selection:text-white">
      {/* Persistent Header / Nav */}
      <nav className={cn(
        "fixed top-0 inset-x-0 z-40 p-4 md:px-8 md:py-5 flex justify-between items-center transition-all duration-500 pointer-events-none",
        isScrolled 
          ? "bg-[var(--color-brand-beige)]/90 backdrop-blur-md shadow-sm text-[var(--color-brand-brown)]" 
          : "bg-transparent text-[#f2ece4] mix-blend-difference"
      )}>
        <div className="flex items-center gap-3 md:gap-4 cursor-pointer pointer-events-auto group" onClick={() => scrollTo('#home')}>
          <BrandMark className={cn(
            "w-10 h-10 md:w-14 md:h-14 transition-transform duration-500 group-hover:scale-105",
            isScrolled ? "text-[var(--color-brand-brown)]" : "text-[#f2ece4]"
          )} />
          <div className="flex flex-col -mt-1 drop-shadow-md">
            <span className="font-serif text-[1.5rem] md:text-5xl tracking-normal leading-none" style={{ textShadow: isScrolled ? "none" : "0px 2px 10px rgba(0,0,0,0.5)"}}>lithos</span>
            <span className="font-sans text-[0.6rem] md:text-sm tracking-wide whitespace-nowrap opacity-90 mt-1" style={{ textShadow: isScrolled ? "none" : "0px 2px 10px rgba(0,0,0,0.5)"}}>{d.guesthouse}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLang(lang === 'el' ? 'en' : 'el')}
            className="pointer-events-auto font-sans text-xs md:text-sm uppercase tracking-widest hover:opacity-75 transition-opacity px-2 py-1 rounded border border-[var(--color-brand-beige)]/30 backdrop-blur-sm"
          >
            {lang === 'el' ? 'EN' : 'ΕΛ'}
          </button>
          <button 
            onClick={openMenu}
            className="p-2 hover:opacity-75 transition-opacity pointer-events-auto"
          >
            <StoneMenuIcon className="w-8 h-8 md:w-12 md:h-12" style={{ filter: isScrolled ? "none" : "drop-shadow(0px 2px 4px rgba(0,0,0,0.4))" }} />
          </button>
        </div>
      </nav>

      {/* Persistent PDF-like Footer (Desktop only) */}
      <div className="fixed bottom-0 inset-x-0 p-6 flex justify-between items-end pointer-events-none z-40 mix-blend-difference text-[var(--color-brand-beige)] hidden md:flex">
        <div className="font-serif text-lg tracking-wide opacity-80">
          Οπτική Ταυτότητα
        </div>
        <div className="font-serif text-lg tracking-wide text-right opacity-80 flex flex-col">
          <span>Λίθος</span>
          <span className="font-sans text-xs tracking-widest uppercase mt-1">ξενώνας στην Εύβοια</span>
        </div>
      </div>

      {/* Menu Overlay Sequence */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex overflow-hidden max-w-[100vw]"
          >
            {/* Click-away layer for desktop */}
            <div 
              className="bg-[var(--color-brand-beige)]/40 backdrop-blur-md w-1/3 md:w-1/2 cursor-pointer hidden md:block" 
              onClick={closeMenu} 
            />
            
            {/* Main Menu Panel */}
            <div className="bg-[var(--color-brand-beige)] w-full md:w-1/2 h-full flex flex-col relative overflow-visible px-6 py-24 md:p-24">
              
              {/* The Animated Brown Background */}
              {menuState === 'idle' && (
                <motion.div
                  layoutId="active-bg"
                  className="absolute inset-0 bg-[#2d1912] z-0 origin-right"
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
                      {/* When an item is selected, its background shrinks to here */}
                      {isSelected && menuState !== 'idle' && (
                        <motion.div
                          layoutId="active-bg"
                          className="absolute -inset-x-8 -inset-y-2 bg-[#2d1912] z-0 rounded-2xl"
                          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                        />
                      )}
                      
                      <motion.a
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ 
                          opacity: isFading ? 0 : 1, 
                          x: 0,
                          color: (menuState === 'idle' || isSelected) ? '#e6e2d6' : '#2d1912'
                        }}
                        transition={{ duration: 0.5, delay: menuState === 'idle' ? i * 0.1 : 0 }}
                        href={item.href}
                        onClick={(e) => { e.preventDefault(); handleItemClick(item.href); }}
                        className="relative z-10 block font-serif text-3xl sm:text-4xl md:text-5xl px-4 cursor-pointer hover:opacity-75 transition-opacity"
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
        {/* Scroll Linked Intro Assembly / Hero Section */}
        <section id="home" ref={heroRef} className="relative h-[300vh]">
          {/* Background Image with Sepia Overlay */}
          <div className="sticky top-0 h-screen w-full overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1587632646274-0678c1cd8321?auto=format&fit=crop&w=2000&q=80" 
              alt="Rustic stone room" 
              className="absolute inset-0 w-full h-full object-cover filter sepia-[0.3]"
              referrerPolicy="no-referrer"
            />
            {/* The Overlay */}
            <div className="absolute inset-0 bg-[#d9d5c9]/80 backdrop-blur-[2px] mix-blend-multiply z-10" />
            <div className="absolute inset-0 bg-[var(--color-brand-beige)]/40 z-10" />

            <div className="relative z-20 h-full w-full flex flex-col items-center justify-center">
              {/* Logo Assembling via Scroll */}
              <div className="w-full max-w-5xl px-6 flex flex-col items-center mb-16">
                <ScrollAssembleLogo progress={scrollYProgress} className="w-full h-auto text-[var(--color-brand-brown)] drop-shadow-2xl" />
              </div>

              {/* Fading in quote */}
              <motion.div 
                 style={{ opacity: quoteOpacity, y: quoteY }}
                 className="absolute bottom-[10vh] md:bottom-[15vh] text-center px-4 w-full"
              >
                 <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--color-brand-brown)] max-w-4xl mx-auto leading-tight font-medium" style={{ textShadow: "0px 2px 10px rgba(255,255,255,0.3)" }}>
                   "τόπος συνάντησης<br/>κάθε καλοκαίρι"
                 </h1>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Philosophy & Explore */}
        <section id="explore" className="py-24 md:py-32 px-6 md:px-12 lg:px-24 mx-auto">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-24">
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-6">
                <div className="hidden md:block h-[1px] bg-[var(--color-brand-brown)]/40 w-24" />
                <span>η φιλοσοφία της οικογένειας<br/>και των ανθρώπων μας</span>
                <div className="hidden md:block h-[1px] bg-[var(--color-brand-brown)]/40 w-24" />
              </h2>
              <p className="text-xl opacity-70 font-sans max-w-2xl mx-auto mt-8 relative z-20">
                Περιηγηθείτε στο λογότυπο του Λίθου για να ανακαλύψετε τις εμπειρίες που σας περιμένουν στην Εύβοια.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-20">
              {/* Left: Interactive Logo */}
              <div className="order-2 lg:order-1 flex justify-center">
                <InteractiveLogo 
                  activePart={activeExplore} 
                  onPartHover={(part) => setActiveExplore(part)}
                  className="w-full max-w-[320px] md:max-w-[400px] h-auto drop-shadow-sm transition-transform duration-500 hover:scale-[1.02]" 
                />
              </div>

              {/* Right: Hoverable Categories List */}
              <div className="order-1 lg:order-2 flex flex-col gap-6" onMouseLeave={() => setActiveExplore('all')}>
                {[
                  {
                    id: 'sea' as const,
                    title: 'θάλασσα',
                    description: 'Απολαύστε την αύρα του Αιγαίου και τα καταγάλανα νερά του Ευβοϊκού. Ένα καταφύγιο γαλήνης όπου το απέραντο γαλάζιο συναντά τον ουρανό, προσφέροντας απόλυτη αναζωογόνηση.',
                    activities: ['Παραλία Αγίας Άννας', 'Παραλία Σαρακήνικο', 'Βόλτες στον Ευβοϊκό', 'Ψάρεμα και θαλάσσια σπορ']
                  },
                  {
                    id: 'mountain' as const,
                    title: 'βουνό',
                    description: 'Ανακαλύψτε την άγρια ομορφιά και τα κρυφά μονοπάτια της Εύβοιας. Η ενέργεια της φύσης και τα απόκρημνα τοπία σας προσκαλούν σε αξέχαστες στιγμές εξερεύνησης και ηρεμίας.',
                    activities: ['Πεζοπορία στο Δάσος', 'Φαράγγι Νηλέα', 'Καταρράκτες Δρυμώνα', 'Ορεινή ποδηλασία']
                  },
                  {
                    id: 'home' as const,
                    title: 'χώρος / σπίτι',
                    description: 'Ο σεβασμός στην παραδοσιακή αρχιτεκτονική και η αίσθηση του «ανήκειν». Ένας χώρος φτιαγμένος με μεράκι που σας αγκαλιάζει.',
                    activities: ['Χαλάρωση στο τζάκι', 'Διάβασμα στη σοφίτα', 'Τοπικές γεύσεις', 'Ηρεμία και απομόνωση']
                  },
                  {
                    id: 'sun' as const,
                    title: 'ήλιος / οικογένεια',
                    description: 'Στιγμές μοιρασιάς, γέλιου και χαράς κάτω από τον ελληνικό ήλιο. Εκεί όπου η οικογένεια σμίγει και δημιουργεί αξέχαστες αναμνήσεις.',
                    activities: ['Πρωινό στον κήπο', 'Παιχνίδι στη φύση', 'Απογευματινός καφές', 'Επιτραπέζια στην αυλή']
                  },
                  {
                    id: 'bbq' as const,
                    title: 'μπάρμπεκιου / καλωσόρισμα',
                    description: 'Η καρδιά της φιλοξενίας χτυπά εδώ. Γύρω από τη φωτιά, μοιραζόμαστε γεύσεις, ιστορίες και την αυθεντική ελληνική φιλοξενία.',
                    activities: ['Βραδιές BBQ', 'Παραδοσιακό φαγητό', 'Κρασί με φίλους', 'Γλέντι και μουσική']
                  }
                ].map((category) => (
                  <motion.div 
                    layout
                    key={category.id}
                    className={cn(
                      "relative p-6 md:p-8 transition-all duration-500 cursor-pointer rounded-2xl",
                      activeExplore === category.id 
                        ? "bg-white/50 shadow-sm border border-[var(--color-brand-brown)]/10" 
                        : "hover:bg-white/20 border border-transparent opacity-60 hover:opacity-100"
                    )}
                    onClick={() => setActiveExplore(category.id === activeExplore ? 'all' : category.id)}
                  >
                    <motion.div layout className="relative z-10">
                      <motion.h3 layout className="font-serif text-2xl md:text-3xl font-bold flex items-center gap-6">
                        <span className={cn(
                          "transition-colors duration-500",
                          activeExplore === category.id ? "text-[var(--color-brand-teal)]" : ""
                        )}>
                          {category.title}
                        </span>
                        <div className={cn(
                          "h-[1px] transition-all duration-500",
                          activeExplore === category.id ? "flex-1 bg-[var(--color-brand-teal)]/40" : "w-12 bg-[var(--color-brand-brown)]/20"
                        )} />
                      </motion.h3>

                      <AnimatePresence>
                        {activeExplore === category.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: "auto", opacity: 1, marginTop: 16 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="text-base md:text-lg opacity-80 leading-relaxed font-sans mb-4">
                              {category.description}
                            </p>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                              {category.activities.map((activity, idx) => (
                                <div key={idx} className="flex items-center gap-2 font-sans text-sm tracking-wide opacity-80">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-teal)]" />
                                  <span>{activity}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* History */}
        <section id="history" className="py-24 px-6 md:px-24 bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <h2 className="font-serif text-5xl md:text-7xl mb-8">Η ιστορία</h2>
              <div className="space-y-6 font-sans text-lg opacity-90 leading-relaxed">
                <p>Το μοναδικό πέτρινο σπίτι του χωριού, σημείο συνάντησης της οικογένειας Καρλή. Ξέγνοιαστα καλοκαίρια, αξέχαστες στιγμές.</p>
                <p>Το σπίτι αυτό αγκάλιασε με την ζεστασιά και την θαλπωρή του, οικογένεια, φίλους και όλους όσους πέρασαν το κατώφλι του.</p>
                <p>Ανακαινίστηκε πρόσφατα με πολύ μεράκι από τον πατέρα της οικογένειας, διατηρώντας τον χαρακτήρα και την αυθεντικότητά του.</p>
                <div className="pt-8 border-t border-[var(--color-brand-beige)]/20">
                  <p className="font-serif text-2xl leading-normal">
                    "Η φιλοξενία έγινε τρόπος ζωής, μια βαθιά ριζωμένη αξία, χτισμένη πάνω στην εμπιστοσύνη, τη φροντίδα και την αίσθηση του «ανήκειν»."
                  </p>
                </div>
              </div>
            </div>
            <div className="md:col-span-7 flex flex-col gap-8">
              <img 
                src="https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1000&q=80" 
                alt="House exterior"
                className="w-full aspect-[4/3] object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1546708973-c15be2118357?auto=format&fit=crop&w=1000&q=80" 
                alt="Sea view"
                className="w-3/4 self-end aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </section>

        {/* Today */}
        <section className="py-24 px-6 md:px-24">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-32 lg:gap-48 items-start">
            <h2 className="font-serif text-5xl md:text-7xl md:sticky top-32">Σήμερα</h2>
            <div className="space-y-12 font-sans text-xl opacity-90 leading-relaxed">
              <p>Το σπίτι ανοίγει τις πόρτες του για να υποδεχτεί και να φιλοξενήσει άλλες οικογένειες και παρέες όπως μόνο η οικογένεια Καρλή ξέρει!</p>
              <p>Κάθε επισκέπτης αντιμετωπίζεται με τη φροντίδα που προσφερόταν πάντα στα μέλη της οικογένειας: με απλές, ουσιαστικές χειρονομίες και μια αίσθηση οικειότητας που δύσκολα βρίσκει κανείς αλλού.</p>
              <p>Στόχος είναι ο ξενώνας να αποτελέσει ένα σημείο αναφοράς για κάθε νέο επισκέπτη που αναζητά έναν τόπο αυθεντικό, ζεστό και αληθινό.</p>
              <div className="pt-8 border-t border-[var(--color-brand-brown)]/20">
                <p className="font-serif text-3xl font-bold">
                  Έναν τόπο που σε κάνει να θέλεις να επιστρέφεις, ξανά και ξανά.<br/><br/>
                  Σαν να επιστρέφεις στο δικό σου σπίτι.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Concept */}
        <section className="py-24 px-6 md:px-24 bg-[#d9d5c9]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="font-serif text-5xl md:text-6xl mb-12">Κεντρική Ιδέα</h2>
              <img 
                src="https://images.unsplash.com/photo-1587632646274-0678c1cd8321?auto=format&fit=crop&w=800&q=80" 
                alt="Stone texture"
                className="w-full aspect-[16/9] object-cover mb-8"
              />
              <p className="font-serif text-2xl mb-8">Σημείο συνάντησης.</p>
              <p className="font-sans text-lg opacity-80 leading-relaxed">
                Όπως οι πέτρες ενώθηκαν για να χτιστεί το σπίτι, έτσι και οι άνθρωποι έρχονται κοντά μέσα από τη φιλοξενία.<br/><br/>
                Ένας τόπος όπου θάλασσα και βουνό συναντιούνται και άνθρωποι σμίγουν για να δημιουργήσουν εμπειρίες.
              </p>
            </div>
            <div className="md:pt-32 space-y-8 font-sans text-lg opacity-80 leading-relaxed">
              <p>Κατά τη σχεδίαση αντλούμε έμπνευση από τις πέτρες και τα φυσικά τοπία της περιοχής, διατηρώντας την παραδοσιακή αισθητική του ξενώνα μέσα από μια σύγχρονη οπτική.</p>
              <p>Όπως το σπίτι ανακαινίστηκε με φροντίδα και προσωπική εργασία από τον πατέρα της οικογένειας, έτσι και η χρήση χαρακτικών τεχνικών, σε εφαρμογές της οπτικής ταυτότητας, προσδίδει αυθεντικότητα, ενισχύοντας το στοιχείο του χειροποίητου.</p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <GallerySection />

        {/* Booking Form */}
        <BookingSection />

        {/* Location Section */}
        <LocationSection />

      </main>

      {/* Contact / Footer */}
      <footer id="contact" className="bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] py-16 px-6 md:px-24">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <BrandMark className="w-8 h-8" />
              <div className="flex flex-col">
                <span className="font-serif text-2xl leading-none">lithos</span>
                <span className="font-sans text-[0.6rem] tracking-widest whitespace-nowrap">guesthouse in Evia</span>
              </div>
            </div>
            <p className="opacity-80 font-sans text-sm max-w-xs">
              Ένας τόπος αυθεντικός, ζεστός και αληθινός, όπου θάλασσα και βουνό συναντιούνται.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-serif text-2xl mb-6">Επικοινωνία</h4>
            <div className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
              <MapPin className="w-5 h-5" />
              <span>Εύβοια, Ελλάδα</span>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full border-t border-[var(--color-brand-brown)]/20 pt-8 mt-12 gap-6 pb-6">
            <div className="flex flex-row flex-wrap gap-6 font-sans text-sm opacity-80 font-medium">
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-60 transition-opacity whitespace-nowrap">Πολιτική Απορρήτου</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:opacity-60 transition-opacity whitespace-nowrap">Όροι Χρήσης</a>
            </div>
            <div className="flex flex-col justify-end items-start md:items-end opacity-60 text-sm font-sans">
              <p>&copy; {new Date().getFullYear()} Lithos Guesthouse.</p>
              <p>All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}

// Gallery Section with custom stone grid and lightbox
function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const images = [
    "https://images.unsplash.com/photo-1546708973-c15be2118357?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516483638261-f40af5ba3233?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587632646274-0678c1cd8321?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1de2d9d000?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
  ];

  // 10 precisely interlocking tiles forming a massive stone wall around the logo concept
  const galleryStones = [
    // 0: Outer Left
    { left: '0%', top: '12%', width: '10%', height: '76%', path: 'polygon(0% 0%, 100% 5%, 80% 50%, 100% 95%, 0% 100%)' },
    // 1: Outer Top
    { left: '12%', top: '0%', width: '36%', height: '15%', path: 'polygon(5% 0%, 90% 0%, 100% 100%, 0% 80%)' },
    // 2: Center TL (Mountain)
    { left: '12%', top: '17%', width: '36%', height: '34%', path: 'polygon(0% 0%, 100% 28%, 100% 94%, 50% 70%, 0% 100%)' },
    // 3: Outer Top Right
    { left: '50%', top: '0%', width: '38%', height: '15%', path: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 80%)' },
    // 4: Center TR (Circle approximation)
    { left: '56%', top: '17%', width: '30%', height: '30%', path: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' },
    // 5: Outer Right
    { left: '88%', top: '5%', width: '12%', height: '80%', path: 'polygon(0% 0%, 100% 10%, 100% 90%, 0% 100%, 20% 50%)' },
    // 6: Center BL (Sea)
    { left: '12%', top: '53%', width: '36%', height: '34%', path: 'polygon(0% 14%, 28% 0%, 100% 14%, 100% 100%, 0% 57%)' },
    // 7: Center BR (BBQ)
    { left: '56%', top: '49%', width: '30%', height: '38%', path: 'polygon(0% 0%, 0% 100%, 100% 100%, 100% 37%, 83% 12%, 33% 12%)' },
    // 8: Outer Bottom Left
    { left: '12%', top: '89%', width: '36%', height: '11%', path: 'polygon(0% 0%, 40% 100%, 100% 30%, 100% 100%, 0% 100%)' },
    // 9: Outer Bottom Right
    { left: '56%', top: '89%', width: '30%', height: '11%', path: 'polygon(0% 20%, 100% 20%, 90% 100%, 0% 100%)' },
  ];

  return (
    <section id="gallery" className="py-24 px-4 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2 className="font-serif text-5xl md:text-7xl mb-16 md:mb-24 text-center">Gallery</h2>
        
        {/* Massive interactive interlocking mural */}
        <div className="relative w-full aspect-square max-w-5xl mx-auto hidden md:block">
          {galleryStones.map((stone, i) => (
            <motion.div
              key={i}
              className="absolute cursor-pointer group overflow-hidden"
              style={{ 
                left: stone.left, 
                top: stone.top, 
                width: stone.width, 
                height: stone.height,
                clipPath: stone.path
              }}
              onClick={() => setSelectedImage(images[i])}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            >
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <img 
                src={images[i]} 
                alt={`Gallery photo ${i}`}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile View: Simple grid */}
        <div className="md:hidden grid grid-cols-2 gap-2 w-full">
          {images.slice(0, 8).map((src, i) => (
            <div 
              key={i} 
              className={`w-full aspect-square cursor-pointer overflow-hidden ${i % 3 === 0 ? 'col-span-2 aspect-[2/1]' : ''}`}
              onClick={() => setSelectedImage(src)}
            >
              <img 
                src={src} 
                className="w-full h-full object-cover active:opacity-75 transition-opacity" 
              />
            </div>
          ))}
        </div>
      </div>

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

// Booking Section
import { DateRange } from 'react-day-picker';

function BookingSection() {
  const [range, setRange] = useState<DateRange | undefined>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '2',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!range?.from || !range?.to) {
      alert("Παρακαλώ επιλέξτε ημερομηνίες άφιξης και αναχώρησης.");
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
        })
      });
      
      if (!res.ok) throw new Error('Network error');
      
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', guests: '2', message: '' });
        setRange(undefined);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="booking" className="py-24 px-6 md:px-24 bg-[#95c2d5]/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-5xl md:text-7xl mb-6">Ημερολόγιο & Κράτηση</h2>
          <p className="font-sans text-xl opacity-80">
            Επιλέξτε ημερομηνίες για να εκδηλώσετε ενδιαφέρον. Θα επικοινωνήσουμε άμεσα μαζί σας για την επιβεβαίωση.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="bg-white/50 p-6 md:p-8 rounded-2xl shadow-sm border border-white/20">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              locale={el}
              numberOfMonths={1}
              className="font-sans mx-auto flex justify-center !text-lg"
              disabled={[{ before: new Date() }]}
            />
            {range?.from && range?.to && (
              <div className="mt-8 text-center p-4 bg-[var(--color-brand-olive)]/10 rounded-lg">
                <span className="font-bold">Επιλεγμένες Ημερομηνίες:</span>
                <br/>
                {format(range.from, 'dd MMM yyyy', { locale: el })} - {format(range.to, 'dd MMM yyyy', { locale: el })}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-8 font-sans">
            {status === 'success' ? (
              <div className="bg-green-100/50 text-green-800 p-8 rounded-xl text-center">
                <h3 className="text-2xl font-serif mb-4">Ευχαριστούμε!</h3>
                <p>Το αίτημά σας στάλθηκε με επιτυχία στον ιδιοκτήτη.<br/>Θα επικοινωνήσουμε σύντομα μαζί σας στο email που δηλώσατε.</p>
                <button 
                  type="button" 
                  onClick={() => setStatus('idle')}
                  className="mt-6 px-6 py-2 bg-[var(--color-brand-olive)] text-white rounded hover:opacity-90"
                >
                  Νέα Κράτηση
                </button>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-8">
                  <Input 
                    label="Ονοματεπώνυμο *" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData(f => ({...f, name: e.target.value}))}
                  />
                  <Input 
                    label="Email *" 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={e => setFormData(f => ({...f, email: e.target.value}))}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <Input 
                    label="Τηλέφωνο επικοινωνίας" 
                    type="tel" 
                    value={formData.phone} 
                    onChange={e => setFormData(f => ({...f, phone: e.target.value}))}
                  />
                  <div className="flex flex-col border-b border-[var(--color-brand-brown)]/30 pb-2">
                    <label className="text-sm opacity-70 mb-2">Αριθμός Επισκεπτών *</label>
                    <select 
                      className="bg-transparent focus:outline-none w-full appearance-none"
                      value={formData.guests}
                      onChange={e => setFormData(f => ({...f, guests: e.target.value}))}
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Επισκέπτες</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex flex-col border-b border-[var(--color-brand-brown)]/30 pb-2">
                  <label className="text-sm opacity-70 mb-2">Μήνυμα / Ιδιαίτερες ανάγκες</label>
                  <textarea 
                    rows={4}
                    className="bg-transparent focus:outline-none w-full resize-none"
                    value={formData.message}
                    onChange={e => setFormData(f => ({...f, message: e.target.value}))}
                  ></textarea>
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm">Προέκυψε σφάλμα κατά την αποστολή. Δοκιμάστε ξανά.</p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] py-4 px-12 md:self-start font-serif text-xl hover:bg-[var(--color-brand-olive)] transition-colors disabled:opacity-50"
                >
                  {status === 'loading' ? 'Αποστολή...' : 'Αίτημα Κράτησης'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Input({ label, type = "text", required = false, value, onChange }: any) {
  return (
    <div className="flex flex-col border-b border-[var(--color-brand-brown)]/30 pb-2">
      <label className="text-sm opacity-70 mb-2">{label}</label>
      <input 
        type={type} 
        required={required}
        value={value}
        onChange={onChange}
        className="bg-transparent focus:outline-none w-full"
      />
    </div>
  )
}

const customIcon = L.divIcon({
  className: 'custom-pin',
  html: `
    <div class="relative group cursor-pointer flex flex-col items-center justify-center transition-transform duration-500 hover:scale-110 drop-shadow-2xl">
      <!-- House Drawing -->
      <div class="bg-[var(--color-brand-beige)] rounded-full p-3 shadow-[0_10px_30px_rgba(45,25,18,0.2)] border-2 border-[var(--color-brand-brown)]/10 animate-bounce-slow relative z-10 w-20 h-20 flex items-center justify-center">
        <!-- SVG BrandMark overlaying a House -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-12 h-12 text-[var(--color-brand-brown)]">
          <!-- House contour -->
          <path d="M5 50 L50 15 L95 50 L85 50 L85 90 L15 90 L15 50 Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
          <path d="M40 90 L40 60 L60 60 L60 90" fill="none" stroke="currentColor" stroke-width="4" />
          <circle cx="55" cy="75" r="2" fill="currentColor"/>
          <!-- Windows -->
          <rect x="22" y="55" width="10" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="4"/>
          <rect x="68" y="55" width="10" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="4"/>
          <!-- Chimney -->
          <path d="M75 30 L75 12 L85 12 L85 38" fill="none" stroke="currentColor" stroke-width="4" />
        </svg>
        
        <!-- Logo Absolute Overlay -->
        <div class="absolute -top-3 -right-3 bg-[var(--color-brand-beige)] shadow-md rounded-full p-1 border border-[var(--color-brand-brown)]/10">
          <svg viewBox="169 155 395 337" class="w-6 h-6 text-[var(--color-brand-olive)]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <polygon points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6" />
            <path d="M422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z" />
            <path d="M348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z" />
            <path d="M549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z" />
          </svg>
        </div>
      </div>
      
      <!-- Logo Label -->
      <div class="mt-2 text-center relative z-20">
        <div class="font-serif text-2xl font-bold text-[var(--color-brand-brown)] tracking-tight drop-shadow-md">Lithos</div>
        <div class="font-sans text-xs tracking-widest uppercase font-bold text-[var(--color-brand-olive)] drop-shadow-md">Οκτωνια Ευβοιας</div>
      </div>
    </div>
  `,
  iconSize: [120, 140],
  iconAnchor: [60, 100],
  popupAnchor: [0, -100]
});

function LocationSection() {
  const position: [number, number] = [38.5414, 24.1245]; // Oktonia, Evia
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=Οκτωνιά+Εύβοιας`;

  return (
    <section id="location" className="py-24 px-6 md:px-24 bg-[var(--color-brand-beige)] relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <h2 className="font-serif text-5xl md:text-7xl mb-8 text-center text-[var(--color-brand-brown)]">Τοποθεσία</h2>
        <p className="font-sans text-xl opacity-80 text-center max-w-2xl mb-12 text-[var(--color-brand-brown)]">
          Βρισκόμαστε στην πανέμορφη Οκτωνιά Εύβοιας, ένα γραφικό σημείο όπου το βουνό συναντά το γαλάζιο του Αιγαίου.
        </p>
        
        <div className="w-full relative rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white/20" style={{ height: '700px' }}>
          {/* Subtle vignette/gradient overlay for "game" map look */}
          <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.15)] bg-gradient-to-tr from-[rgba(255,250,240,0.1)] to-transparent"></div>
          
          <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={false}
            zoomControl={false}
            className="w-full h-full relative z-0 bg-[#e4e1d7]"
          >
            {/* Using voyager_nolabels for a very clean, minimal base */}
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
              className="map-tiles custom-map-filter"
            />
            <Marker position={position} icon={customIcon} />
          </MapContainer>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[400]">
            <a 
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[var(--color-brand-brown)] text-[var(--color-brand-beige)] py-4 px-8 rounded-full font-serif text-xl border border-[var(--color-brand-beige)]/20 hover:bg-[var(--color-brand-olive)] transition-all shadow-[0_10px_30px_rgba(45,25,18,0.4)] hover:-translate-y-1 active:translate-y-0 whitespace-nowrap"
            >
              <Navigation className="w-5 h-5" fill="currentColor" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

