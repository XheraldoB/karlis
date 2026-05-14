export const BrandMark = ({ className }: { className?: string }) => (
  <svg viewBox="169 155 395 337" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <polygon points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6" />
    <path d="M422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z" />
    <path d="M348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z" />
    <path d="M549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z" />
  </svg>
);

export const InteractiveLogo = ({ 
  className, 
  activePart = 'all',
  onPartHover
}: { 
  className?: string, 
  activePart?: 'all' | 'sea' | 'mountain' | 'sun' | 'home' | 'bbq',
  onPartHover?: (part: 'all' | 'sea' | 'mountain' | 'sun' | 'home' | 'bbq') => void
}) => {
  const darkColor = "var(--color-brand-teal)";
  const gray = "var(--color-brand-gray, #a3abad)";
  const allColor = "currentColor";

  const getFill = (part: string) => {
    if (activePart === 'all') return allColor;
    if (part === 'top-left' && activePart === 'home') return darkColor;
    if (part === 'sea' && activePart === 'sea') return darkColor;
    if (part === 'sun' && activePart === 'sun') return darkColor;
    if (part === 'bbq' && activePart === 'bbq') return darkColor;
    return gray;
  };

  const handleInteraction = (part: 'sea' | 'mountain' | 'sun' | 'home' | 'bbq' | 'all') => {
    onPartHover?.(part);
  };

  return (
    <svg viewBox="169 155 395 337" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'color 0.5s ease', overflow: 'visible' }} onMouseLeave={() => handleInteraction('all')}>
      {/* Top Left (Home / Mountain) */}
      <polygon 
        points="172.33 155.6 169.41 330.57 289.99 295.06 320.62 315.24 351.85 327.66 355.35 283.77 358.33 246.21 356.6 208.57 354.56 164.59 322.94 175.96 232.41 197.6 172.33 155.6"
        fill={getFill('top-left')}
        style={{ transition: 'fill 0.5s ease', cursor: onPartHover ? 'pointer' : 'default' }}
        onMouseEnter={() => handleInteraction('home')}
        onClick={() => handleInteraction('home')}
      />

      {/* Negative Space (Mountain) */}
      <polygon
         points="169.41,330.57 289.99,295.06 320.62,315.24 351.85,327.66 348.78,348.78 316.57,351.04 217.94,350.81 169.68,361.34"
         fill={activePart === 'mountain' ? darkColor : 'transparent'}
         style={{ transition: 'fill 0.5s ease', cursor: onPartHover ? 'pointer' : 'default' }}
         onMouseEnter={() => handleInteraction('mountain')}
         onClick={() => handleInteraction('mountain')}
      />
      
      {/* Top Right (Sun) */}
      <path 
        d="M422.59,302.64c-39.46-16.25-60.97-60.16-48.25-100.9,9.34-29.92,34.96-56.32,100.09-42.23,130.26,28.2,35.63,157-18.43,151.53-12.43-1.26-23.59-4.36-33.4-8.4Z"
        fill={getFill('sun')}
        style={{ transition: 'fill 0.5s ease', cursor: onPartHover ? 'pointer' : 'default' }}
        onMouseEnter={() => handleInteraction('sun')}
        onClick={() => handleInteraction('sun')}
      />

      {/* Bottom Left (Sea) */}
      <path 
        d="M348.88,491.59l-40.98-.29-5.49-.27c-17.19-1.3-44.54-3.3-70.3-19.8-7.1-4.55-14.08-10.26-20.71-17.39-48.03-51.67-41.72-92.5-41.72-92.5l48.26-10.53,98.63.23,32.21-2.26-3.24,132.98,3.34,9.84Z"
        fill={getFill('sea')}
        style={{ transition: 'fill 0.5s ease', cursor: onPartHover ? 'pointer' : 'default' }}
        onMouseEnter={() => handleInteraction('sea')}
        onClick={() => handleInteraction('sea')}
      />

      {/* Bottom Right (BBQ / Welcome) */}
      <path 
        d="M549.31,415.41c10.85,36.42,14.33,59.35,14.33,59.35l-45.53,9.94-117.64,4.76-30.39,2.13,3.05-125.46,2.08-55.05,38.66.27,40.69,44.32,50.8,3.28c28.54,9.27,35.37,27.71,43.94,56.47Z"
        fill={getFill('bbq')}
        style={{ transition: 'fill 0.5s ease', cursor: onPartHover ? 'pointer' : 'default' }}
        onMouseEnter={() => handleInteraction('bbq')}
        onClick={() => handleInteraction('bbq')}
      />
    </svg>
  );
};

export const StoneMenuIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M 18 30 L 53 16 L 77 28 L 71 36 L 50 30 L 35 34 Z" />
    <path d="M 20 46 L 43 38 L 63 41 L 78 48 L 73 60 L 61 60 A 16 16 0 0 0 29 60 L 20 60 Z" />
    <path d="M 13 66 L 23 62 L 73 62 L 73 70 L 20 72 Z" />
    <path d="M 23 75 L 79 73 L 88 78 L 79 84 L 23 84 Z" />
  </svg>
);

export const SeaIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 50 C25 20 75 20 90 50 C90 70 70 90 50 90 C30 90 10 70 10 50 Z" fill="#95c2d5" />
    <path d="M30 60 L70 60 L60 80 L40 80 Z" fill="#1a434b" />
    <path d="M45 35 L45 55 L65 55 Z" fill="#1a434b" />
  </svg>
);

export const MountainIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 80 L40 30 L60 50 L80 40 L90 80 Z" fill="#798C53" />
    <path d="M40 30 L50 45 L30 55 C35 50 40 40 40 30 Z" fill="#1a434b" />
    <path d="M60 50 L80 40 L70 60 Z" fill="#1a434b" />
  </svg>
);
