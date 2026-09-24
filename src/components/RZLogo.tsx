import React, { useState } from 'react';
import { OFFICIAL_RZ_ICON_SVG, OFFICIAL_RZ_LOGO_SVG } from '../services/brandingService';

interface RZLogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'standard' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  subText?: string;
  useImage?: boolean;
}

export const RZLogo: React.FC<RZLogoProps> = ({
  variant = 'full',
  size = 'standard',
  className = '',
  showText = true,
  subText,
  useImage = true
}) => {
  const [imgError, setImgError] = useState(false);

  // Height requirements: 24px-28px mobile, 32px-36px desktop
  const logoDimensions = {
    standard: 'h-7 w-7 sm:h-8 sm:w-8', // 28px mobile, 32px desktop
    sm: 'h-6 w-6 sm:h-7 sm:w-7',       // 24px / 28px
    md: 'h-7 w-7 sm:h-8 sm:w-8',       // 28px / 32px
    lg: 'h-9 w-9 sm:h-11 sm:w-11',     // 36px / 44px
    xl: 'h-12 w-12 sm:h-16 sm:w-16'    // 48px / 64px
  };

  const svgToUse = variant === 'full' ? OFFICIAL_RZ_LOGO_SVG : OFFICIAL_RZ_ICON_SVG;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Official Executive Gold App Icon Emblem */}
      {useImage && !imgError ? (
        <div className={`${logoDimensions[size]} shrink-0 relative rounded-xl overflow-hidden shadow-lg shadow-amber-500/25 border border-amber-400/50 transition-transform hover:scale-105 group`}>
          <img
            src="/app-logo.jpg"
            alt="RZ® Minetrix BOS Logo"
            className="w-full h-full object-cover object-center group-hover:brightness-110 transition duration-300"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div
          className={`${logoDimensions[size]} shrink-0 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-transform hover:scale-105`}
          dangerouslySetInnerHTML={{ __html: svgToUse }}
        />
      )}

      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 font-mono font-black tracking-tight text-white text-sm sm:text-base leading-none">
            <span>RZ<sup className="text-amber-400 font-bold text-[10px] ml-0.5">®</sup></span>
            <span className="text-amber-400">Minetrix BOS</span>
          </div>
          {subText && (
            <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5 hidden sm:block">
              {subText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

