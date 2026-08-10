import React, { useState } from 'react';
import {
  DESIGN_PHILOSOPHY,
  BRAND_TOKENS,
  SUITE_BRANDING_THEMES,
  LAYOUT_GRID_SYSTEM,
  REUSABLE_UI_COMPONENTS,
  DENSE_FORM_AND_TABLE_SPECS,
  ROLE_NAVIGATION_MAPPINGS,
  MOBILE_AND_PUBLIC_UX,
  AI_INTERACTION_UX,
  ACCESSIBILITY_AND_FRONTEND_STRUCTURE
} from '../data/designSystemData';
import {
  Palette,
  Layout,
  Layers,
  Smartphone,
  Globe,
  Bot,
  CheckCircle2,
  Sparkles,
  Zap,
  Sliders,
  Maximize2,
  Table,
  FileCode,
  ShieldCheck,
  FolderTree,
  Search,
  Lock,
  ChevronRight,
  Pickaxe,
  Truck,
  Box,
  ShoppingBag,
  Landmark,
  UserCheck,
  Brain,
  Camera,
  QrCode,
  MapPin,
  Mic,
  Eye,
  SlidersHorizontal
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Pickaxe,
  Truck,
  Box,
  ShoppingBag,
  Landmark,
  UserCheck,
  Brain
};

export const DesignSystemSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'philosophy' | 'tokens' | 'layout' | 'components' | 'forms-tables' | 'navigation' | 'ai-public' | 'architecture'>('philosophy');
  const [selectedTokenGroup, setSelectedTokenGroup] = useState(BRAND_TOKENS[0]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/90 via-slate-900 to-indigo-950/80 border border-violet-500/40 p-6 sm:p-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/30 text-xs font-semibold uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" />
              <span>Phase 14 Enterprise UI/UX Design System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Enterprise UI/UX Design System & Frontend Foundation
            </h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Unified design language, design tokens, responsive layout grid, component specifications, mobile hardware integration standards, role-based navigation architecture, and AI-first conversational UX guidelines for RZ® Minetrix BOS.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono text-violet-300">
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-violet-500/30">Slate & Obsidian Tokens</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-violet-500/30">4-Breakpoint Grid</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-slate-950 border border-violet-500/30">Mobile Camera/GPS/OCR</span>
              <span className="text-slate-500">→</span>
              <span className="px-2.5 py-1 rounded bg-violet-500/20 text-violet-200 border border-violet-500/40 font-bold">WCAG 2.1 AA Compliant</span>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-violet-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Design System</div>
                <div className="text-xs font-extrabold text-violet-400">11 Suites Unified</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Accessibility</div>
                <div className="text-xs font-extrabold text-emerald-400">High Contrast Outdoor</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-slate-800/80 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('philosophy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'philosophy'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Philosophy & Suite Themes</span>
          </button>

          <button
            onClick={() => setActiveTab('tokens')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'tokens'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Design Tokens & Palette</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'layout'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Layout className="w-4 h-4" />
            <span>Layout System & Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('components')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'components'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Component Library Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('forms-tables')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'forms-tables'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Forms & Dense Data Grids</span>
          </button>

          <button
            onClick={() => setActiveTab('navigation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'navigation'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Role Navigation & Mobile UX</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-public')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'ai-public'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Public Portal & AI UX</span>
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeTab === 'architecture'
                ? 'bg-violet-500 text-slate-950 font-bold shadow-lg shadow-violet-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Frontend Folder Structure</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PHILOSOPHY & SUITE THEMES */}
      {activeTab === 'philosophy' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              <span>Core Design Philosophy Pillars</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DESIGN_PHILOSOPHY.corePillars.map((p, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-violet-400 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span>{p.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pt-4">Suite-Specific Visual Identity & Branding Themes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SUITE_BRANDING_THEMES.map((theme, idx) => {
                const IconComponent = ICON_MAP[theme.icon] || Box;
                return (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-white">{theme.suite}</span>
                      </div>
                      <span className="text-[10px] font-mono text-violet-300">{theme.color}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      <strong>Emblem:</strong> {theme.emblem}
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <strong>Atmosphere:</strong> {theme.atmosphere}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DESIGN TOKENS & PALETTE */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-violet-400" />
              <span>Design Tokens & Color Palette Specifications</span>
            </h2>

            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              {BRAND_TOKENS.map((group, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTokenGroup(group)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    selectedTokenGroup.category === group.category
                      ? 'bg-violet-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {group.category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedTokenGroup.tokens.map((token, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg border border-slate-700/50 shrink-0"
                      style={{ backgroundColor: token.hex }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{token.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{token.hex}</div>
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-violet-300">
                    Tailwind: {token.twClass}
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    {token.usage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LAYOUT SYSTEM & GRID */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layout className="w-5 h-5 text-violet-400" />
              <span>4-Breakpoint Responsive Grid & Layout Panel System</span>
            </h2>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Grid Breakpoints & Density</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {LAYOUT_GRID_SYSTEM.breakpoints.map((bp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-violet-400">{bp.name} ({bp.range})</div>
                    <div className="text-[11px] text-slate-300 font-mono">Columns: {bp.columns} | Padding: {bp.padding}</div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">{bp.behavior}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Layout Shell Structural Panels</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LAYOUT_GRID_SYSTEM.layoutPanels.map((panel, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-violet-400" />
                      <span>{panel.title}</span>
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">{panel.features}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPONENT LIBRARY SPECS */}
      {activeTab === 'components' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-400" />
              <span>Reusable UI Component Library & Mobile Hardware Specifications</span>
            </h2>

            <div className="space-y-6">
              {REUSABLE_UI_COMPONENTS.map((group, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{group.category}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {group.components.map((comp, cIdx) => (
                      <div key={cIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="text-xs font-bold text-violet-300">{comp.name}</div>
                        <div className="text-xs text-slate-300 leading-relaxed">{comp.specs}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FORMS & DENSE DATA GRIDS */}
      {activeTab === 'forms-tables' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-violet-400" />
              <span>High-Density Form Patterns & Enterprise Data Grid Standards</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400">High-Efficiency Form Patterns</h3>
                <div className="space-y-2">
                  {DENSE_FORM_AND_TABLE_SPECS.formPatterns.map((pat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {pat}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Data Grid Capabilities</h3>
                <div className="space-y-2">
                  {DENSE_FORM_AND_TABLE_SPECS.dataGridPatterns.map((pat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {pat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ROLE NAVIGATION & MOBILE UX */}
      {activeTab === 'navigation' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-violet-400" />
              <span>Role-Based Route Navigation & Mobile Hardware UX</span>
            </h2>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Role Portal Route Tree Examples</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ROLE_NAVIGATION_MAPPINGS.map((nav, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-white">{nav.role}</div>
                    <div className="text-[10px] font-mono text-violet-300">Home: {nav.home}</div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {nav.primaryNav.map((item, iIdx) => (
                        <span key={iIdx} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Mobile Offline & Field Operator UX</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOBILE_AND_PUBLIC_UX.mobileUx.map((ux, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    {ux}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: PUBLIC PORTAL & AI UX */}
      {activeTab === 'ai-public' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-violet-400" />
              <span>Public Marketplace & Conversational AI Experience</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Public Marketplace E-Commerce UX</span>
                </h3>
                <div className="space-y-2">
                  {MOBILE_AND_PUBLIC_UX.publicPortalUx.map((pUx, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {pUx}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <span>AI-First Co-Pilot Interactions</span>
                </h3>
                <div className="space-y-2">
                  {AI_INTERACTION_UX.features.map((aiFeat, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      {aiFeat}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: ACCESSIBILITY & FRONTEND ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-violet-400" />
              <span>Frontend Folder Structure & Accessibility Standards</span>
            </h2>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Accessibility Standards (WCAG 2.1 AA)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ACCESSIBILITY_AND_FRONTEND_STRUCTURE.accessibility.map((a11y, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                    {a11y}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Frontend Directory Architecture</h3>
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-violet-300 leading-relaxed overflow-x-auto">
                <pre>{ACCESSIBILITY_AND_FRONTEND_STRUCTURE.folderStructure.join('\n')}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
