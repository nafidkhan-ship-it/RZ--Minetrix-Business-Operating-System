import React, { useState } from 'react';
import {
  Palette,
  Download,
  Sparkles,
  FileCode,
  Layers,
  CheckCircle2,
  X,
  Copy,
  Globe2,
  ShieldAlert,
  Sliders,
  FileText
} from 'lucide-react';
import { brandingService, BRAND_ASSET_LIBRARY, ENTERPRISE_BRAND_SPEC } from '../services/brandingService';
import { BrandThemeMode } from '../types/branding';
import { RZLogo } from './RZLogo';

interface BrandingAssetExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (msg: string) => void;
}

export const BrandingAssetExporterModal: React.FC<BrandingAssetExporterModalProps> = ({
  isOpen,
  onClose,
  showToast = (msg: string) => alert(msg)
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'themes' | 'guidelines'>('export');
  const [selectedTheme, setSelectedTheme] = useState<BrandThemeMode>(brandingService.getCurrentTheme());

  if (!isOpen) return null;

  const handleApplyTheme = (theme: BrandThemeMode) => {
    setSelectedTheme(theme);
    brandingService.applyBrandTheme(theme);
    showToast(`Brand Theme updated to "${theme}" across RZ® Minetrix BOS!`);
  };

  const handleDownloadAsset = (assetId: string) => {
    if (assetId === 'asset-1') {
      brandingService.downloadSvgAsset(ENTERPRISE_BRAND_SPEC.logoSvg, 'RZ-Minetrix-BOS-Master-Logo');
      showToast('Downloaded RZ® Minetrix Master Vector Logo (SVG)');
    } else if (assetId === 'asset-2') {
      brandingService.downloadSvgAsset(ENTERPRISE_BRAND_SPEC.logoIconSvg, 'RZ-Minetrix-BOS-Icon-Monogram');
      showToast('Downloaded RZ® Icon Monogram Mark (SVG)');
    } else if (assetId === 'asset-3') {
      brandingService.exportCssTokens();
      showToast('Exported RZ® Brand CSS Theme Variables');
    } else if (assetId === 'asset-4') {
      brandingService.exportJsonTokens();
      showToast('Exported RZ® Brand Tokens (JSON)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative font-mono text-xs overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <RZLogo variant="full" size="lg" />
          <div className="text-right sm:pr-12">
            <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-bold text-[10px]">
              Central Branding Service
            </span>
            <p className="text-slate-400 text-[10px] mt-0.5">
              Official RZ® Single Source of Truth Brand Asset Infrastructure
            </p>
          </div>
        </div>

        {/* TABS */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition ${
              activeTab === 'export'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Download className="w-4 h-4" /> Global Asset Export
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition ${
              activeTab === 'themes'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" /> Theme Integration
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-4 py-2 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition ${
              activeTab === 'guidelines'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> Brand Spec &amp; Palette
          </button>
        </div>

        {/* TAB 1: GLOBAL ASSET EXPORT */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <p className="text-slate-300 text-xs">
              Export high-resolution vector SVGs, monogram icons, CSS theme variables, and brand design tokens directly from the central RZ® branding engine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BRAND_ASSET_LIBRARY.map((asset) => (
                <div key={asset.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-amber-400 font-bold text-xs">{asset.name}</span>
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-bold text-[10px]">
                        {asset.format}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1 leading-normal">{asset.description}</p>
                  </div>

                  <button
                    onClick={() => handleDownloadAsset(asset.id)}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer transition shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Asset ({asset.format})
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: THEME INTEGRATION */}
        {activeTab === 'themes' && (
          <div className="space-y-4">
            <p className="text-slate-300 text-xs">
              Dynamically switch global enterprise themes. Changing themes updates CSS root properties (`--rz-primary-amber`, `--rz-canvas-obsidian`) across all 26 phases in real-time.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: 'dark-obsidian',
                  name: 'Dark Obsidian Industrial (Default)',
                  bgHex: '#020617',
                  accentHex: '#F59E0B',
                  desc: 'High-contrast dark canvas engineered for quarry night shifts and high-glare environments.'
                },
                {
                  id: 'gold-amber',
                  name: 'Gold Amber Industrial High-Vis',
                  bgHex: '#1C1917',
                  accentHex: '#FBBF24',
                  desc: 'High-visibility amber canvas optimized for outdoor sunlight tipper weighbridge screens.'
                },
                {
                  id: 'high-contrast-slate',
                  name: 'High Contrast Ocean Slate',
                  bgHex: '#0F172A',
                  accentHex: '#38BDF8',
                  desc: 'Executive boardroom analytics theme with ocean slate contrast and cyan highlights.'
                },
                {
                  id: 'enterprise-emerald',
                  name: 'Operation Emerald Safety',
                  bgHex: '#022C22',
                  accentHex: '#34D399',
                  desc: 'ESG compliance & pit safety monitoring theme with deep emerald hues.'
                }
              ].map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => handleApplyTheme(theme.id as BrandThemeMode)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                    selectedTheme === theme.id
                      ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">{theme.name}</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full border border-slate-600" style={{ backgroundColor: theme.bgHex }} />
                      <div className="w-4 h-4 rounded-full border border-slate-600" style={{ backgroundColor: theme.accentHex }} />
                    </div>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-normal">{theme.desc}</p>
                  <button
                    className={`w-full py-1.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 ${
                      selectedTheme === theme.id
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {selectedTheme === theme.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                    {selectedTheme === theme.id ? 'Active Theme' : 'Apply Theme'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BRAND SPEC & PALETTE */}
        {activeTab === 'guidelines' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <h3 className="text-white font-bold text-xs">Registered Trademark &amp; Brand Usage Rules</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                <strong className="text-amber-400 font-mono">RZ®</strong> is a registered trademark of Race Zone Ventures. All user interfaces, reports, dispatch slips, and APIs generated within Minetrix BOS MUST display the official RZ® monogram or master vector logo.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-bold text-xs">Official RZ® Brand Palette Tokens</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.values(ENTERPRISE_BRAND_SPEC.palette).map((col, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="w-full h-8 rounded-lg border border-slate-700" style={{ backgroundColor: col.hex }} />
                    <span className="text-white font-bold text-[11px] block">{col.name}</span>
                    <span className="text-amber-400 font-mono text-[10px] block">{col.hex}</span>
                    <span className="text-slate-400 text-[9px] block truncate">{col.usage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-[10px] text-slate-400">
          <span>RZ® Minetrix BOS Central Branding Infrastructure • Version {ENTERPRISE_BRAND_SPEC.version}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-200 hover:text-white rounded-xl font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
