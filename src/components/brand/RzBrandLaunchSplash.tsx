import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface RzBrandLaunchSplashProps {
  onComplete: () => void;
  autoDismissMs?: number;
}

export const RzBrandLaunchSplash: React.FC<RzBrandLaunchSplashProps> = ({
  onComplete,
  autoDismissMs = 1800
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + 10;
      });
    }, autoDismissMs / 10);

    return () => clearInterval(timer);
  }, [autoDismissMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* RZ Hexagon Brand Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30 border border-amber-300/40 transform hover:scale-105 transition-transform duration-300">
          <span className="text-3xl sm:text-4xl font-black text-slate-950 font-mono tracking-tighter">
            RZ®
          </span>
        </div>
        <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-slate-900 border border-amber-500/40 text-[9px] font-black text-amber-400 font-mono uppercase tracking-widest shadow">
          SYSTEM OS
        </div>
      </div>

      {/* Main Brand Title */}
      <div className="space-y-2 max-w-lg relative z-10">
        <div className="flex items-center justify-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold font-mono tracking-widest uppercase">
            Unified Enterprise Infrastructure
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          RZ® MINETRIX
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium tracking-wide">
          Business Operating System + Marketplace + Communication + Productivity
        </p>
      </div>

      {/* Loading Progress Bar */}
      <div className="w-64 sm:w-80 mt-8 space-y-2 relative z-10">
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-150 ease-out shadow-lg shadow-amber-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>Initializing 10 Primary Platforms...</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="mt-6 text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <span>Enter Workspace Now</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      {/* Footer System Watermark */}
      <div className="absolute bottom-6 text-[10px] text-slate-600 font-mono flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
        <span>RZ® Enterprise Kernel v4.8 &bull; 100% Client-Side Engine</span>
      </div>
    </div>
  );
};
