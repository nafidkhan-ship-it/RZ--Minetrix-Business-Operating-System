import React from 'react';
import {
  ChevronRight,
  Home,
  ArrowLeft,
  Share2,
  Copy,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import { resolveRoute, ALL_ROUTES_REGISTRY } from './routeRegistry';

interface BreadcrumbBarProps {
  currentPath: string;
  onNavigatePath: (path: string) => void;
  onGoBack?: () => void;
  canGoBack?: boolean;
  onOpenTester?: () => void;
  onOpenQuickActions?: () => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  currentPath,
  onNavigatePath,
  onGoBack,
  canGoBack = false,
  onOpenTester,
  onOpenQuickActions
}) => {
  const [copied, setCopied] = React.useState(false);
  const routeDef = resolveRoute(currentPath);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.origin + '#' + currentPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2.5 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-md">
      {/* Left: Back button + Breadcrumb Chain */}
      <div className="flex items-center flex-wrap gap-2 text-slate-400">
        {/* Back Button */}
        {canGoBack && onGoBack && (
          <button
            onClick={onGoBack}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer font-bold border border-slate-700"
            title="Return to previous screen"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>
        )}

        {/* Home Root Icon */}
        <button
          onClick={() => onNavigatePath('/home')}
          className="flex items-center gap-1 hover:text-white transition cursor-pointer text-slate-300"
          title="Return to Home Dashboard"
        >
          <Home className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold">Home</span>
        </button>

        {/* Breadcrumb Steps */}
        {routeDef.breadcrumbs.map((crumb, idx) => {
          if (idx === 0 && crumb.label === 'Home') return null;
          const isLast = idx === routeDef.breadcrumbs.length - 1;

          return (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
              {isLast || !crumb.path ? (
                <span className="font-bold text-white bg-slate-800/60 px-2 py-0.5 rounded-lg border border-slate-700/60">
                  {crumb.label}
                </span>
              ) : (
                <button
                  onClick={() => crumb.path && onNavigatePath(crumb.path)}
                  className="hover:text-amber-400 transition cursor-pointer font-medium"
                >
                  {crumb.label}
                </button>
              )}
            </React.Fragment>
          );
        })}

        {/* Route Path Badge */}
        <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950 font-mono text-[10px] text-purple-400 border border-slate-800">
          {currentPath}
        </span>
      </div>

      {/* Right: Cross-Platform Quick Jumps & Tester Trigger */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end">
        {routeDef.crossPlatformLinks && routeDef.crossPlatformLinks.length > 0 && (
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono">
            <span className="text-slate-500">Related:</span>
            {routeDef.crossPlatformLinks.map((link, lIdx) => (
              <button
                key={lIdx}
                onClick={() => onNavigatePath(link.path)}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center gap-1 border border-slate-700"
              >
                <span>{link.label}</span>
                <ChevronRight className="w-2.5 h-2.5 text-amber-400" />
              </button>
            ))}
          </div>
        )}

        {/* Copy Route Link */}
        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title="Copy direct route hash link"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>

        {/* End-to-End Route Test Loop Trigger */}
        {onOpenTester && (
          <button
            onClick={onOpenTester}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-[11px] font-bold transition cursor-pointer"
            title="Launch 20-Step End-to-End Navigation Test Loop (Section AD)"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>20-Step Route Loop</span>
          </button>
        )}
      </div>
    </div>
  );
};
