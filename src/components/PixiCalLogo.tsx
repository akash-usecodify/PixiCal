import React from 'react';

interface PixiCalLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
  isLight?: boolean;
}

export const PixiCalLogo: React.FC<PixiCalLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  isLight = false,
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24',
  }[size];

  const primaryTextColor = isLight ? 'text-[#0D2619]' : 'text-white';

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center ${iconDimensions} ${className}`}>
        <svg viewBox="0 0 500 340" className="w-full h-full drop-shadow-sm" fill="none">
          <defs>
            <linearGradient id="camGradIcon" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#00D26A" />
              <stop offset="50%" stopColor="#00C49F" />
              <stop offset="100%" stopColor="#007BFF" />
            </linearGradient>
            <linearGradient id="forkGradIcon" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFB300" />
              <stop offset="50%" stopColor="#FF6D00" />
              <stop offset="100%" stopColor="#FF2E36" />
            </linearGradient>
            <linearGradient id="leafGradIcon" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00C853" />
              <stop offset="100%" stopColor="#43A047" />
            </linearGradient>
          </defs>

          {/* Brackets */}
          <path d="M 160 102 H 142 C 128.745 102 118 112.745 118 126 V 144" stroke="#00D068" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 338 102 H 356 C 369.255 102 380 112.745 380 126 V 144" stroke="#0084FF" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 118 280 V 298 C 118 311.255 128.745 322 142 322 H 160" stroke="#00D068" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 380 280 V 298 C 380 311.255 369.255 322 356 322 H 338" stroke="#FF7A00" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />

          {/* Camera Body */}
          <path d="M 198 128 C 203 115 215 107 229 107 H 271 C 285 107 297 115 302 128 H 326 C 346.987 128 364 145.013 364 166 V 264 C 364 284.987 346.987 302 326 302 H 174 C 153.013 302 136 284.987 136 264 V 166 C 136 145.013 153.013 128 174 128 Z" fill="url(#camGradIcon)" />
          
          {/* Flash dot */}
          <circle cx="330" cy="162" r="11" fill="#FFFFFF" opacity="0.95" />

          {/* Plate */}
          <circle cx="249" cy="223" r="78" fill="#FFFFFF" />
          <circle cx="249" cy="223" r="68" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />

          {/* Leaves */}
          <path d="M 244 160 C 274 158 290 190 288 220 C 260 216 244 186 244 160 Z" fill="url(#leafGradIcon)" />
          <path d="M 290 196 C 314 196 322 222 314 238 C 298 234 290 212 290 196 Z" fill="url(#leafGradIcon)" />

          {/* Fork */}
          <g transform="translate(210, 202)">
            <rect x="0" y="0" width="11" height="36" rx="5.5" fill="#FFA000" />
            <rect x="17" y="0" width="11" height="36" rx="5.5" fill="#FF8F00" />
            <rect x="34" y="0" width="11" height="36" rx="5.5" fill="#FF7D00" />
            <path d="M 0 24 C 0 45 8 50 17 52 V 90 C 17 97 28 97 28 90 V 52 C 37 50 45 45 45 24 Z" fill="url(#forkGradIcon)" />
          </g>
        </svg>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`font-black tracking-tight flex items-center select-none ${className}`}>
        <span className={primaryTextColor}>P</span>
        <span className={`relative ${primaryTextColor}`}>
          i
          <span className="absolute -top-2.5 left-0.5 text-xs text-[#00C853] font-normal leading-none transform -rotate-12">
            🍃
          </span>
        </span>
        <span className={primaryTextColor}>x</span>
        <span className="text-[#0084FF]">i</span>
        <span className="text-[#0070F3]">C</span>
        <span className="text-[#FF7A00]">a</span>
        <span className="text-[#FF334B]">l</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Cute Camera Plate Icon */}
      <PixiCalLogo variant="icon" size={size} />

      {/* PixiCal Colored Wordmark */}
      <div className="flex flex-col justify-center leading-none">
        <div className="text-xl sm:text-2xl font-black tracking-tight flex items-center font-sans">
          <span className={primaryTextColor}>P</span>
          <span className={`relative ${primaryTextColor}`}>
            i
            <span className="absolute -top-2 left-0 w-2 h-2 text-[9px] text-[#00C853] transform rotate-12">
              🍃
            </span>
          </span>
          <span className={primaryTextColor}>x</span>
          <span className="text-[#0084FF]">i</span>
          <span className="text-[#0070F3]">C</span>
          <span className="text-[#FF7A00]">a</span>
          <span className="text-[#FF334B]">l</span>
        </div>
        <span className="text-[10px] font-bold text-[#FF7A00] tracking-wide mt-0.5">
          Snap Your Food. Know Your Calories.
        </span>
      </div>
    </div>
  );
};
