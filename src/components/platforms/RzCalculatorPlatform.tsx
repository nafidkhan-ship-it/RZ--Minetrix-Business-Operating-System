import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator as CalcIcon,
  Percent,
  Coins,
  TrendingUp,
  Receipt,
  Scale,
  Truck,
  Building2,
  Pickaxe,
  Calendar,
  DollarSign,
  ArrowRight,
  RotateCcw,
  Copy,
  Printer,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Info,
  ChevronRight,
  ShieldCheck,
  Zap,
  Layers,
  Search,
  Star,
  Clock,
  LayoutGrid,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Bookmark,
  Heart,
  ArrowLeft
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import { CalculatorId, CalculatorCategoryId, CalculationHistoryItem, CalculatorMeta } from '../calculator/types';
import { CALCULATOR_CATALOG, CALCULATOR_CATEGORIES } from '../calculator/data/calculatorCatalog';
import { BasicDeskCalculator } from '../calculator/calculators/BasicDeskCalculator';
import { PercentageDiscountMarkupCalculator } from '../calculator/calculators/PercentageDiscountMarkupCalculator';
import { ProfitLossRatioCalculator } from '../calculator/calculators/ProfitLossRatioCalculator';
import { UnitLandConverter } from '../calculator/calculators/UnitLandConverter';
import { GstTaxCalculator } from '../calculator/calculators/GstTaxCalculator';
import { EmiLoanRepaymentCalculator } from '../calculator/calculators/EmiLoanRepaymentCalculator';
import { InterestCalculators } from '../calculator/calculators/InterestCalculators';
import { BusinessCalculators } from '../calculator/calculators/BusinessCalculators';
import { IndustryQuarryCrusherCalculators } from '../calculator/calculators/IndustryQuarryCrusherCalculators';
import { VehicleTripFuelOwnershipCalculators } from '../calculator/calculators/VehicleTripFuelOwnershipCalculators';
import { CalculationHistoryDrawer } from '../calculator/modals/CalculationHistoryDrawer';
import { SharePrintPdfModal } from '../calculator/modals/SharePrintPdfModal';

interface RzCalculatorPlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
  initialTab?: string;
}

export const RzCalculatorPlatform: React.FC<RzCalculatorPlatformProps> = ({
  onNavigateSection,
  initialTab
}) => {
  // Navigation & Search State
  const [activeCategoryId, setActiveCategoryId] = useState<CalculatorCategoryId>('ALL');
  const [activeCalculatorId, setActiveCalculatorId] = useState<CalculatorId | 'home'>('home');

  useEffect(() => {
    if (initialTab) {
      if (initialTab === 'basic') setActiveCalculatorId('basic-desk');
      else if (initialTab === 'gst') setActiveCalculatorId('gst-calculator');
      else if (initialTab === 'quarry') setActiveCalculatorId('quarry-crusher-pack');
      else if (initialTab === 'emi') setActiveCalculatorId('emi-calculator');
      else if (initialTab === 'percentage') setActiveCalculatorId('percentage-calc');
      else if (initialTab === 'discount') setActiveCalculatorId('discount-calc');
      else if (initialTab === 'markup') setActiveCalculatorId('markup-calc');
      else if (initialTab === 'fleet') setActiveCalculatorId('vehicle-fleet-pack');
    }
  }, [initialTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // User Preferences & Persistence (Local storage simulation)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rz_calc_favs');
      return saved ? JSON.parse(saved) : ['basic-desk', 'emi-calculator', 'gst-calculator', 'land-converter'];
    } catch {
      return ['basic-desk', 'emi-calculator', 'gst-calculator', 'land-converter'];
    }
  });

  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    return [
      {
        id: 'hist-1',
        calculatorId: 'emi-calculator',
        calculatorName: 'Loan EMI Calculator & Schedule',
        timestamp: '10 mins ago',
        inputs: { Principal: '₹25,00,000', Rate: '10.5%', Tenure: '5 Years' },
        resultSummary: 'Monthly EMI: ₹53,744 | Total Interest: ₹7,24,635'
      },
      {
        id: 'hist-2',
        calculatorId: 'gst-calculator',
        calculatorName: 'GST Tax Calculator',
        timestamp: '25 mins ago',
        inputs: { Base: '₹1,00,000', Rate: '18%', Mode: 'Add GST' },
        resultSummary: 'Net Total: ₹1,18,000 (CGST: ₹9,000, SGST: ₹9,000)'
      },
      {
        id: 'hist-3',
        calculatorId: 'land-converter',
        calculatorName: 'Quarry Land & Area Converter',
        timestamp: '1 hour ago',
        inputs: { Value: '50 Cents', From: 'Cents', To: 'Acres' },
        resultSummary: '50 Cents = 0.50 Acre (21,780 sq.ft)'
      }
    ];
  });

  const [recentCalculators, setRecentCalculators] = useState<CalculatorId[]>([
    'emi-calculator',
    'gst-calculator',
    'land-converter',
    'vehicle-trip'
  ]);

  // Modals & Panels
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showFormulaAccordion, setShowFormulaAccordion] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rz_calc_favs', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleRecordHistory = (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: CalculationHistoryItem = {
      ...item,
      id: `hist-${Date.now()}`,
      timestamp: 'Just now'
    };
    setHistory(prev => [newItem, ...prev.slice(0, 24)]);
  };

  const handleLaunchCalculator = (id: CalculatorId) => {
    setActiveCalculatorId(id);
    // Add to recents
    setRecentCalculators(prev => [id, ...prev.filter(item => item !== id)].slice(0, 6));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareApp = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filtered calculators list
  const filteredCalculators = useMemo(() => {
    return CALCULATOR_CATALOG.filter(calc => {
      // Category match
      if (activeCategoryId !== 'ALL' && calc.category !== activeCategoryId) {
        return false;
      }
      // Favorites only
      if (favoritesOnly && !favorites.includes(calc.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = calc.name.toLowerCase().includes(q);
        const matchesShort = calc.shortName.toLowerCase().includes(q);
        const matchesDesc = calc.description.toLowerCase().includes(q);
        const matchesTags = calc.tags.some(t => t.toLowerCase().includes(q));
        return matchesName || matchesShort || matchesDesc || matchesTags;
      }
      return true;
    });
  }, [activeCategoryId, favoritesOnly, searchQuery, favorites]);

  // Current active calculator metadata
  const currentCalcMeta = useMemo(() => {
    if (activeCalculatorId === 'home') return null;
    return CALCULATOR_CATALOG.find(c => c.id === activeCalculatorId);
  }, [activeCalculatorId]);

  return (
    <div className="space-y-6">
      {/* 1. PUBLIC PLATFORM TITLE & ACCESS HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono tracking-wider uppercase">
                Platform #10 &bull; RZ® Ecosystem
              </span>
              <span className="px-3 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black tracking-widest uppercase">
                FREE PUBLIC ACCESS &bull; NO LOGIN REQUIRED
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono">
                30+ High-Precision Engines
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-mono font-bold">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <CalcIcon className="w-8 h-8 text-amber-400" />
              <span>RZ® Calculator</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 uppercase tracking-wider font-mono">
                UNIVERSAL FREE
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              <strong>Calculate. Compare. Plan.</strong> Professional financial, business, quarry mining, crusher aggregate and commercial vehicle calculators. 100% free with no subscription, paywall, or forced account signup.
            </p>
          </div>

          {/* Top Utility Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition cursor-pointer"
              title="View Session History"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>History</span>
              {history.length > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[10px] font-bold font-mono">
                  {history.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition cursor-pointer"
              title="Print Calculation Slip"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Print Slip</span>
            </button>

            <button
              onClick={handleShareApp}
              className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition cursor-pointer"
              title="Copy shareable link"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Global Search & Category Filter Navigation Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search calculators (e.g. EMI, GST, Land, Tipper, Markup, Quarry)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Favorites Toggle & Home Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveCalculatorId('home');
                  setFavoritesOnly(false);
                  setSearchQuery('');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeCalculatorId === 'home' && !favoritesOnly && !searchQuery
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>All Hub</span>
              </button>

              <button
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  favoritesOnly
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-slate-950 text-slate-950' : 'text-amber-400'}`} />
                <span>Favorites ({favorites.length})</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CALCULATOR_CATEGORIES.map(cat => {
              const active = activeCategoryId === cat.id && !favoritesOnly;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategoryId(cat.id);
                    setFavoritesOnly(false);
                    if (activeCalculatorId !== 'home') {
                      setActiveCalculatorId('home');
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold text-xs whitespace-nowrap transition cursor-pointer border ${
                    active
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-850 border-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. RECENT CALCULATORS CHIPS */}
      {recentCalculators.length > 0 && activeCalculatorId === 'home' && !searchQuery && (
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-xs">
          <span className="text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Recent:</span>
          </span>
          {recentCalculators.map(rId => {
            const meta = CALCULATOR_CATALOG.find(c => c.id === rId);
            if (!meta) return null;
            return (
              <button
                key={rId}
                onClick={() => handleLaunchCalculator(rId)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition whitespace-nowrap cursor-pointer"
              >
                {meta.shortName}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. ACTIVE CALCULATOR WORKSPACE OR HOME DISCOVERY GRID */}
      {activeCalculatorId !== 'home' && currentCalcMeta ? (
        <div className="space-y-6">
          {/* Active Calculator Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveCalculatorId('home')}
                className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer border border-slate-800"
                title="Back to All Calculators"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                    {currentCalcMeta.category}
                  </span>
                  <span className="text-slate-600">&bull;</span>
                  <span className="text-[10px] font-mono text-emerald-400">FREE UNRESTRICTED</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">{currentCalcMeta.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{currentCalcMeta.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={e => toggleFavorite(currentCalcMeta.id, e)}
                className={`p-2 rounded-xl border transition cursor-pointer ${
                  favorites.includes(currentCalcMeta.id)
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-white'
                }`}
                title="Favorite"
              >
                <Star className={`w-4 h-4 ${favorites.includes(currentCalcMeta.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>

              <button
                onClick={() => setIsShareModalOpen(true)}
                className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                title="Print Calculation Slip"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Interactive Calculator Component Render */}
          <div>
            {/* 1. Basic Desk Calculator */}
            {activeCalculatorId === 'basic-desk' && (
              <BasicDeskCalculator onRecordHistory={handleRecordHistory} />
            )}

            {/* 2, 3, 4: Percentage, Discount, Markup */}
            {(activeCalculatorId === 'percentage' || activeCalculatorId === 'discount' || activeCalculatorId === 'markup') && (
              <PercentageDiscountMarkupCalculator
                initialSubTab={activeCalculatorId as any}
                onRecordHistory={handleRecordHistory}
              />
            )}

            {/* 5, 6: Profit/Loss & Ratio */}
            {(activeCalculatorId === 'profit-loss' || activeCalculatorId === 'ratio') && (
              <ProfitLossRatioCalculator
                initialSubTab={activeCalculatorId as any}
                onRecordHistory={handleRecordHistory}
              />
            )}

            {/* 7, 8: Units & Land Converter */}
            {(activeCalculatorId === 'unit-converter' || activeCalculatorId === 'land-converter') && (
              <UnitLandConverter
                initialCategory={activeCalculatorId === 'land-converter' ? 'land' : 'weight'}
                onRecordHistory={handleRecordHistory}
              />
            )}

            {/* 9: GST Calculator */}
            {activeCalculatorId === 'gst-calculator' && (
              <GstTaxCalculator onRecordHistory={handleRecordHistory} />
            )}

            {/* 10, 11, 15, 16, 17: EMI & Loan Suite */}
            {(activeCalculatorId === 'emi-calculator' ||
              activeCalculatorId === 'reverse-emi' ||
              activeCalculatorId === 'loan-calculator' ||
              activeCalculatorId === 'repayment-schedule' ||
              activeCalculatorId === 'prepayment-calculator') && (
              <EmiLoanRepaymentCalculator
                initialSubTab={
                  activeCalculatorId === 'reverse-emi'
                    ? 'reverse'
                    : activeCalculatorId === 'loan-calculator'
                    ? 'commercial'
                    : activeCalculatorId === 'prepayment-calculator'
                    ? 'prepayment'
                    : 'emi'
                }
                onRecordHistory={handleRecordHistory}
              />
            )}

            {/* 12, 13, 14: Simple, Compound & Reducing Interest */}
            {(activeCalculatorId === 'simple-interest' ||
              activeCalculatorId === 'compound-interest' ||
              activeCalculatorId === 'reducing-interest') && (
              <InterestCalculators
                initialSubTab={
                  activeCalculatorId === 'compound-interest'
                    ? 'compound'
                    : activeCalculatorId === 'reducing-interest'
                    ? 'reducing'
                    : 'simple'
                }
                onRecordHistory={handleRecordHistory}
              />
            )}

            {/* 18, 19, 20, 21, 22, 23: Business Operations */}
            {(activeCalculatorId === 'revenue-calculator' ||
              activeCalculatorId === 'expense-ratio' ||
              activeCalculatorId === 'gross-margin' ||
              activeCalculatorId === 'break-even' ||
              activeCalculatorId === 'sales-target' ||
              activeCalculatorId === 'cost-per-unit') && (
              <BusinessCalculators
                initialSubTab={
                  activeCalculatorId === 'revenue-calculator'
                    ? 'revenue'
                    : activeCalculatorId === 'gross-margin'
                    ? 'margin'
                    : activeCalculatorId === 'sales-target'
                    ? 'target'
                    : activeCalculatorId === 'cost-per-unit'
                    ? 'unitcost'
                    : activeCalculatorId === 'expense-ratio'
                    ? 'expense'
                    : 'breakeven'
                }
                onRecordHistory={handleRecordHistory}
              />
            )}

            {/* 24, 25, 26, 27, 28: Quarry & Crusher Suite */}
            {(activeCalculatorId === 'quarry-load' ||
              activeCalculatorId === 'landowner-load' ||
              activeCalculatorId === 'quarry-profit' ||
              activeCalculatorId === 'crusher-cost' ||
              activeCalculatorId === 'crusher-margin') && (
              <IndustryQuarryCrusherCalculators
                initialSubTab={
                  activeCalculatorId === 'landowner-load'
                    ? 'landowner'
                    : activeCalculatorId === 'quarry-profit'
                    ? 'quarry-profit'
                    : activeCalculatorId === 'crusher-cost'
                    ? 'crusher-cost'
                    : activeCalculatorId === 'crusher-margin'
                    ? 'crusher-margin'
                    : 'quarry-load'
                }
                onRecordHistory={handleRecordHistory}
              />
            )}

            {/* 29, 30, 31, 32: Vehicle Trip, Fuel & Ownership */}
            {(activeCalculatorId === 'vehicle-trip' ||
              activeCalculatorId === 'fuel-mileage' ||
              activeCalculatorId === 'ownership-split' ||
              activeCalculatorId === 'investment-return') && (
              <VehicleTripFuelOwnershipCalculators
                initialSubTab={
                  activeCalculatorId === 'fuel-mileage'
                    ? 'fuel'
                    : activeCalculatorId === 'ownership-split'
                    ? 'ownership'
                    : activeCalculatorId === 'investment-return'
                    ? 'roi'
                    : 'trip'
                }
                onRecordHistory={handleRecordHistory}
              />
            )}
          </div>

          {/* Formula & Explanation Accordion */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <button
              onClick={() => setShowFormulaAccordion(!showFormulaAccordion)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">
                  Formula, Computational Methodology &amp; Assumptions
                </span>
              </div>
              {showFormulaAccordion ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {showFormulaAccordion && (
              <div className="p-5 border-t border-slate-800 bg-slate-950/70 space-y-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                    Mathematical Expression:
                  </span>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 font-bold">
                    {currentCalcMeta.formula}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-sans">
                      How it Works:
                    </span>
                    <p className="text-slate-400 font-sans leading-relaxed text-[11px]">
                      {currentCalcMeta.howItWorks}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1 font-sans">
                      Standard Example:
                    </span>
                    <p className="text-slate-400 font-sans leading-relaxed text-[11px]">
                      {currentCalcMeta.example}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cross-Platform Ecosystem Integration CTA Bridge */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-white text-xs">
                  Need to record these figures in live enterprise operations?
                </span>
              </div>
              <p className="text-xs text-slate-400">
                You can create tasks in <strong>09 RZ® OTT</strong>, quote contracts in <strong>04 Contracts</strong>, or order stone blocks in <strong>05 Building Materials</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateSection && (
                <>
                  <button
                    onClick={() => onNavigateSection('rz-ott')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border border-slate-700 transition cursor-pointer"
                  >
                    Open RZ® OTT
                  </button>
                  <button
                    onClick={() => onNavigateSection('building-materials-ecommerce')}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow transition cursor-pointer"
                  >
                    Order Stone
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* HOME DISCOVERY GRID */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">
                {favoritesOnly
                  ? 'Favorite Calculators'
                  : searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : activeCategoryId === 'ALL'
                  ? 'All Calculators Catalog'
                  : CALCULATOR_CATEGORIES.find(c => c.id === activeCategoryId)?.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Showing {filteredCalculators.length} calculators &bull; Free instant access
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-amber-400 hover:underline cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>

          {filteredCalculators.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No calculators match your search</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try searching for general keywords like "loan", "tax", "trip", "stone", "discount", or clear your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryId('ALL');
                  setFavoritesOnly(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCalculators.map(calc => {
                const isFav = favorites.includes(calc.id);
                return (
                  <div
                    key={calc.id}
                    onClick={() => handleLaunchCalculator(calc.id)}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-5 shadow-lg transition-all duration-200 cursor-pointer group flex flex-col justify-between hover:-translate-y-0.5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                          {calc.category}
                        </span>

                        <button
                          onClick={e => toggleFavorite(calc.id, e)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-400 transition"
                          title={isFav ? 'Remove Favorite' : 'Save Favorite'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition flex items-center justify-between">
                          <span>{calc.name}</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {calc.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-500">
                        {calc.isPopular && (
                          <span className="text-amber-400 font-bold">★ Popular</span>
                        )}
                      </span>
                      <div className="text-amber-400 group-hover:translate-x-1 transition font-bold flex items-center gap-1 text-xs">
                        <span>Launch</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. MODALS & DRAWERS */}
      <CalculationHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        history={history}
        onClearHistory={() => setHistory([])}
        onSelectCalculator={id => handleLaunchCalculator(id as CalculatorId)}
      />

      <SharePrintPdfModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        calculator={currentCalcMeta || undefined}
        calculationDetails={
          currentCalcMeta
            ? {
                title: currentCalcMeta.name,
                formula: currentCalcMeta.formula,
                inputs: { 'Active Mode': 'Live Sandbox Simulation' },
                results: { 'Certified Result': 'Calculated on RZ® 64-bit IEEE 754 Engine' },
                summaryText: `${currentCalcMeta.name} computation certified.`
              }
            : undefined
        }
      />

      {/* 5. AUDIT & LEGAL NOTICE */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>RZ® Calculator Standard Rule:</strong> Calculations are analytical estimations for commercial planning and do not automatically alter verified accounting ledgers, banking contracts, or statutory tax returns.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] text-slate-600">
            RZ-CALC-V10 &bull; ZERO LATENCY CLIENT EXECUTION
          </span>
        </div>
      </div>
    </div>
  );
};
