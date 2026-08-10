import React from 'react';
import { OFFICIAL_RZ_ICON_SVG, OFFICIAL_RZ_LOGO_SVG } from '../services/brandingService';

interface RZLogoProps {
  variant?: 'full' | 'icon' | 'badge';
  size?: 'standard' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  subText?: string;
}

export const RZLogo: React.FC<RZLogoProps> = ({
  variant = 'full',
  size = 'standard',
  className = '',
  showText = true,
  subText
}) => {
  // Height requirements: 24px mobile (h-6 w-6), 32px desktop (sm:h-8 sm:w-8)
  const logoDimensions = {
    standard: 'h-6 w-6 sm:h-8 sm:w-8', // 24px mobile, 32px desktop
    sm: 'h-5 w-5 sm:h-6 sm:w-6',       // 20px / 24px
    md: 'h-6 w-6 sm:h-8 sm:w-8',       // 24px / 32px
    lg: 'h-8 w-8 sm:h-10 sm:w-10',     // 32px / 40px
    xl: 'h-10 w-10 sm:h-14 sm:w-14'    // 40px / 56px
  };

  const svgToUse = variant === 'full' ? OFFICIAL_RZ_LOGO_SVG : OFFICIAL_RZ_ICON_SVG;

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {/* Official Uploaded RZ Logo Mark aligned on left */}
      <div
        className={`${logoDimensions[size]} shrink-0 drop-shadow-[0_0_12px_rgba(245,158,11,0.3)] transition-transform hover:scale-105`}
        dangerouslySetInnerHTML={{ __html: svgToUse }}
      />

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

