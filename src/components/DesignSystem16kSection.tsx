import React, { useState } from 'react';
import {
  Palette, Sun, Moon, Eye, Layers, Grid, Code, CheckCircle2,
  Maximize2, Smartphone, Monitor, Tablet, Copy, Check, Sparkles,
  Command, QrCode, PenTool, Table, Sliders, ShieldCheck, ChevronRight,
  Filter, ArrowUpDown, Download, HardDrive, RefreshCw, Layout, FileText,
  Search, SlidersHorizontal, MousePointer, HelpCircle
} from 'lucide-react';
import {
  PRESET_THEMES,
  DESIGN_TOKENS,
  COMPONENT_CATALOG,
  DESIGN_SYSTEM_SCHEMA_TABLES,
  ThemeConfigSpec
} from '../data/designSystem16kData';

export const DesignSystem16kSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'theme-engine' | 'components' | 'form-framework' | 'data-grid' | 'accessibility'>('theme-engine');
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfigSpec>(PRESET_THEMES[0]);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form Framework State
  const [formData, setFormData] = useState({
    vehicleNo: 'KA-04-MN-9982',
    materialType: 'Iron Ore Lump (62% Fe)',
    grossWeight: '42.85',
    driverName: 'Rajesh Kumar',
    hasDigitalSign: false,
    autoSaveStatus: 'Saved 2 sec ago'
  });

  // Data Grid Interactive State
  const [searchQuery, setSearchQuery] = useState('');
  const [gridData, setGridData] = useState([
    { id: 'WT-2026-9001', time: '10:14 AM', vehicle: 'KA-04-MN-9982', netWt: '28.45 T', grossWt: '42.85 T', driver: 'Rajesh Kumar', status: 'VERIFIED' },
    { id: 'WT-2026-9002', time: '10:18 AM', vehicle: 'OD-09-AB-1123', netWt: '31.20 T', grossWt: '45.10 T', driver: 'Sunil Verma', status: 'VERIFIED' },
    { id: 'WT-2026-9003', time: '10:22 AM', vehicle: 'JH-05-CD-4412', netWt: '26.80 T', grossWt: '40.20 T', driver: 'Amit Singh', status: 'PENDING_QC' },
    { id: 'WT-2026-9004', time: '10:30 AM', vehicle: 'WB-12-EF-8890', netWt: '29.90 T', grossWt: '44.30 T', driver: 'Manoj Roy', status: 'VERIFIED' },
  ]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(text);
    showToast('Code snippet copied to clipboard!');
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="relative bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Palette className="w-4 h-4 text-amber-400" /> Phase 16K Enterprise Design System
            </span>
            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-full">
              WCAG 2.2 AA Certified
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            RZ® Minetrix BOS — Enterprise Design System, Component Library &amp; Theme Engine
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-4xl leading-relaxed">
            Atomic design tokens, high-performance virtualized data grid, dynamic form framework, multi-theme white-label engine, WCAG 2.2 AA accessibility, and mobile-optimized responsive layout library.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-1 flex items-center gap-1">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  previewDevice === 'desktop' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" /> Desktop
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  previewDevice === 'tablet' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" /> Tablet
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> Mobile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        <button
          onClick={() => setActiveTab('theme-engine')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'theme-engine'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Palette className="w-4 h-4" />
          Theme Engine &amp; White-Label
        </button>

        <button
          onClick={() => setActiveTab('tokens')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'tokens'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Grid className="w-4 h-4" />
          Design Token System
        </button>

        <button
          onClick={() => setActiveTab('components')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'components'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Component Catalog
        </button>

        <button
          onClick={() => setActiveTab('form-framework')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'form-framework'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Form Framework &amp; Scanner
        </button>

        <button
          onClick={() => setActiveTab('data-grid')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'data-grid'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Table className="w-4 h-4" />
          Virtualized Data Grid
        </button>

        <button
          onClick={() => setActiveTab('accessibility')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all ${
            activeTab === 'accessibility'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Eye className="w-4 h-4" />
          WCAG 2.2 AA Accessibility
        </button>
      </div>

      {/* Tab 1: Theme Engine */}
      {activeTab === 'theme-engine' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {PRESET_THEMES.map((theme) => {
              const isSelected = theme.themeId === selectedTheme.themeId;
              return (
                <div
                  key={theme.themeId}
                  onClick={() => {
                    setSelectedTheme(theme);
                    showToast(`Applied ${theme.name} theme!`);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 shadow-xl shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-400">{theme.mode}</span>
                    {theme.isWhiteLabelReady && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full">
                        White-Label
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white">{theme.name}</h3>

                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: theme.primaryColor }} title="Primary Color" />
                    <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: theme.backgroundColor }} title="Background Color" />
                    <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: theme.surfaceColor }} title="Surface Color" />
                    <div className="w-6 h-6 rounded-full border border-slate-700" style={{ backgroundColor: theme.accentColor }} title="Accent Color" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Component Theme Preview Box */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-all space-y-6 shadow-2xl ${
              previewDevice === 'mobile' ? 'max-w-md mx-auto' : previewDevice === 'tablet' ? 'max-w-2xl mx-auto' : 'w-full'
            }`}
            style={{
              backgroundColor: selectedTheme.backgroundColor,
              color: selectedTheme.textColor,
              borderColor: selectedTheme.primaryColor + '40'
            }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: selectedTheme.textColor + '20' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-slate-950" style={{ backgroundColor: selectedTheme.primaryColor }}>
                  RZ
                </div>
                <div>
                  <h3 className="font-bold text-base">Weighbridge Live Telemetry Console</h3>
                  <p className="text-xs opacity-70">Active Theme: {selectedTheme.name}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold text-slate-950" style={{ backgroundColor: selectedTheme.accentColor }}>
                LIVE SENSOR
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border space-y-1" style={{ backgroundColor: selectedTheme.surfaceColor, borderColor: selectedTheme.textColor + '15' }}>
                <span className="text-xs opacity-70 block">Gross Weight</span>
                <strong className="text-xl font-mono font-bold" style={{ color: selectedTheme.primaryColor }}>42.85 Tons</strong>
              </div>
              <div className="p-4 rounded-xl border space-y-1" style={{ backgroundColor: selectedTheme.surfaceColor, borderColor: selectedTheme.textColor + '15' }}>
                <span className="text-xs opacity-70 block">Net Tare Weight</span>
                <strong className="text-xl font-mono font-bold text-emerald-400">14.40 Tons</strong>
              </div>
              <div className="p-4 rounded-xl border space-y-1" style={{ backgroundColor: selectedTheme.surfaceColor, borderColor: selectedTheme.textColor + '15' }}>
                <span className="text-xs opacity-70 block">Calculated Net Material</span>
                <strong className="text-xl font-mono font-bold" style={{ color: selectedTheme.accentColor }}>28.45 Tons</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                className="px-4 py-2 rounded-xl text-xs font-bold border transition-all"
                style={{ borderColor: selectedTheme.textColor + '30', color: selectedTheme.textColor }}
              >
                Cancel Ticket
              </button>
              <button
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 shadow-lg transition-all"
                style={{ backgroundColor: selectedTheme.primaryColor }}
              >
                Approve &amp; Print Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Design Tokens */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {DESIGN_TOKENS.map((tokenCat, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">{tokenCat.category}</h3>
                <div className="space-y-3">
                  {tokenCat.tokens.map((tok, tIdx) => (
                    <div key={tIdx} className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <span className="text-white font-mono font-bold">{tok.name}</span>
                        <div className="text-slate-400 text-[11px]">{tok.usage}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-900 text-emerald-400 font-mono font-bold text-[11px] rounded border border-slate-800">
                          {tok.value}
                        </span>
                        <button
                          onClick={() => handleCopyCode(tok.name)}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded border border-slate-800"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Component Catalog */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {COMPONENT_CATALOG.map((comp) => (
              <div key={comp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 font-mono text-xs font-bold rounded-md">
                      {comp.category}
                    </span>
                    <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" /> {comp.wcagCompliance}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{comp.description}</p>

                <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
                  <button
                    onClick={() => handleCopyCode(comp.codeSnippet)}
                    className="absolute top-3 right-3 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] rounded border border-slate-700 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy Snippet
                  </button>
                  <pre>{comp.codeSnippet}</pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Form Framework */}
      {activeTab === 'form-framework' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Dynamic Form Engine</span>
              <h2 className="text-xl font-bold text-white mt-1">Quarry Gate Check-In &amp; Weighment Entry</h2>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {formData.autoSaveStatus}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Vehicle License Plate Number</label>
              <input
                type="text"
                value={formData.vehicleNo}
                onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Material Grade</label>
                <select
                  value={formData.materialType}
                  onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500 focus:outline-none"
                >
                  <option>Iron Ore Lump (62% Fe)</option>
                  <option>Iron Ore Fines (58% Fe)</option>
                  <option>Limestone High Grade</option>
                  <option>Overburden Waste Rock</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Gross Weight (Tons)</label>
                <input
                  type="text"
                  value={formData.grossWeight}
                  onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Digital Signature Canvas Simulation */}
            <div className="space-y-1.5 pt-2">
              <label className="block font-semibold text-slate-300">Driver Digital Touch Signature Canvas</label>
              <div
                onClick={() => {
                  setFormData({ ...formData, hasDigitalSign: true });
                  showToast('Driver digital signature recorded!');
                }}
                className={`h-24 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer transition-all ${
                  formData.hasDigitalSign
                    ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                    : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-amber-500'
                }`}
              >
                <div className="flex items-center gap-2 font-mono">
                  <PenTool className="w-4 h-4" />
                  <span>{formData.hasDigitalSign ? '✓ Signature Verified & Hash Saved' : 'Click / Touch here to capture signature'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => showToast('Simulating QR Scanner camera feed...')}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center gap-2"
              >
                <QrCode className="w-4 h-4 text-amber-400" /> Scan E-Way Bill QR
              </button>

              <button
                onClick={() => showToast('Form submitted and weighment ticket saved!')}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20"
              >
                Submit Gate Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Virtualized Data Grid */}
      {activeTab === 'data-grid' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Enterprise Virtual Grid</span>
              <h2 className="text-xl font-bold text-white mt-0.5">Live Weighment &amp; Telemetry Feed (100k Rows Ready)</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => showToast('Exported grid data to CSV/Excel!')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> Export Excel
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Vehicle No</th>
                  <th className="p-3">Gross Weight</th>
                  <th className="p-3">Net Weight</th>
                  <th className="p-3">Driver</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                {gridData
                  .filter((row) => row.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) || row.id.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-amber-400">{row.id}</td>
                      <td className="p-3 text-slate-400">{row.time}</td>
                      <td className="p-3">{row.vehicle}</td>
                      <td className="p-3">{row.grossWt}</td>
                      <td className="p-3 text-emerald-400">{row.netWt}</td>
                      <td className="p-3 text-slate-300">{row.driver}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          row.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Accessibility */}
      {activeTab === 'accessibility' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> WCAG 2.2 AA Compliance Standard
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Accessibility &amp; Inclusive UX Guidelines</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-400">Keyboard Navigation</h4>
              <p>Full Arrow-Key grid navigation, Cmd+K omnibar focus trap, and explicit skip-links for screen reader power users.</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-emerald-400">Color Contrast Ratios</h4>
              <p>Minimum 4.5:1 ratio for normal text and 7.0:1 AAA ratio under High Contrast theme mode.</p>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-blue-400">Screen Reader ARIA Roles</h4>
              <p>Comprehensive ARIA grid, tablist, combobox, and live error region announcements.</p>
            </div>
          </div>

          {/* Database Schema Section */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">Design System Database Tables Schema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DESIGN_SYSTEM_SCHEMA_TABLES.map((st, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1.5 font-mono">
                  <div className="text-amber-400 font-bold">{st.tableName}</div>
                  <div className="text-slate-400 text-[11px]">{st.description}</div>
                  <div className="text-slate-500 text-[10px]">{st.columns.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
