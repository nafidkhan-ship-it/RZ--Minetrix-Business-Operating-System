import React, { useState } from 'react';
import {
  Presentation,
  Plus,
  Play,
  Download,
  Copy,
  Trash2,
  Image,
  Table,
  BarChart3,
  Shapes,
  Layout,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  Sparkles,
  Eye,
  RotateCcw
} from 'lucide-react';
import { SlideItem } from '../types';
import { MOCK_SLIDES } from '../mockData';

interface RzSlideViewProps {
  onToast?: (msg: string) => void;
}

export const RzSlideView: React.FC<RzSlideViewProps> = ({ onToast }) => {
  const [deckTitle, setDeckTitle] = useState('Investor_Pitch_Crusher_Expansion_2026.rzp');
  const [slides, setSlides] = useState<SlideItem[]>(MOCK_SLIDES);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState('Investor Presentation');

  // 9 Presentation Templates
  const SLIDE_TEMPLATES = [
    { id: 'biz-pres', name: 'Business Presentation', desc: 'Corporate operational and market review' },
    { id: 'co-profile', name: 'Company Profile', desc: 'RZ Group mining assets, history & executive team' },
    { id: 'proj-prop', name: 'Project Proposal', desc: 'Commercial aggregate tender and supply proposal' },
    { id: 'inv-pres', name: 'Investor Presentation', desc: 'Return on capital, pithead yield & growth roadmap' },
    { id: 'quarry-proj', name: 'Quarry Project', desc: 'Pit #01 to #12 laterite reserves and SEIAA clearance' },
    { id: 'crusher-proj', name: 'Crusher Project', desc: '200 TPH VSI plant economics and sand processing' },
    { id: 'veh-fleet', name: 'Vehicle Fleet', desc: 'Tipper logistics, fuel telematics & driver batta' },
    { id: 'biz-report', name: 'Business Report', desc: 'Quarterly financial earnings and EBITDA deck' },
    { id: 'mkt-pres', name: 'Marketing Presentation', desc: 'B2B building materials catalog & delivery terms' }
  ];

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleAddSlide = () => {
    const newSlide: SlideItem = {
      id: `SL-${Date.now()}`,
      title: 'New Slide Title',
      subtitle: 'Add operational metrics or strategic initiatives here',
      layout: 'bullets',
      points: [
        'Point 1: Strategic expansion of quarry concession acreage',
        'Point 2: Deployment of Euro-6 multi-axle tippers'
      ],
      speakerNotes: 'Key takeaway for attendees regarding asset efficiency.'
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
    onToast?.('Added new slide');
  };

  const handleDuplicateSlide = () => {
    const clone: SlideItem = {
      ...currentSlide,
      id: `SL-DUP-${Date.now()}`,
      title: `${currentSlide.title} (Copy)`
    };
    setSlides([...slides, clone]);
    onToast?.('Duplicated current slide');
  };

  const handleDeleteSlide = () => {
    if (slides.length <= 1) {
      onToast?.('Cannot delete the only slide');
      return;
    }
    const newSlides = slides.filter((_, idx) => idx !== currentSlideIndex);
    setSlides(newSlides);
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    onToast?.('Slide deleted');
  };

  const handleApplyTemplate = (tplName: string) => {
    setSelectedTemplate(tplName);
    setDeckTitle(`${tplName.replace(/\s+/g, '_')}_Deck.rzp`);
    onToast?.(`Loaded template: ${tplName}`);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
            <Presentation className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                className="bg-transparent font-bold text-white text-base focus:outline-none border-b border-transparent focus:border-amber-400"
              />
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
                RZ® SLIDE DECK
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Preset: <strong>{selectedTemplate}</strong></span>
              <span>&bull;</span>
              <span className="text-amber-400 font-mono">Slide {currentSlideIndex + 1} of {slides.length}</span>
            </div>
          </div>
        </div>

        {/* Presentation Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => onToast?.('Exported presentation to PDF format')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1.5 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => {
              setIsPresenting(true);
              onToast?.('Full screen presentation mode started (Press Esc to exit)');
            }}
            className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-600/30"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Present (F5)</span>
          </button>
        </div>
      </div>

      {/* Toolbar & Templates */}
      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={handleAddSlide}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500 hover:text-white transition font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slide</span>
          </button>
          <button
            onClick={handleDuplicateSlide}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
            title="Duplicate Slide"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDeleteSlide}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
            title="Delete Slide"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1" />

          {/* Insert Elements */}
          <button
            onClick={() => onToast?.('Inserted interactive metric chart into slide')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Chart</span>
          </button>
          <button
            onClick={() => onToast?.('Inserted data table')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Table className="w-3.5 h-3.5 text-emerald-400" />
            <span>Table</span>
          </button>
          <button
            onClick={() => onToast?.('Inserted quarry satellite snapshot image')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Image className="w-3.5 h-3.5 text-amber-400" />
            <span>Image</span>
          </button>
          <button
            onClick={() => onToast?.('Inserted flowchart shape')}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <Shapes className="w-3.5 h-3.5 text-purple-400" />
            <span>Shapes</span>
          </button>
        </div>

        {/* 9 Templates Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px] uppercase font-bold">9 Templates:</span>
          <select
            value={selectedTemplate}
            onChange={(e) => handleApplyTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-purple-300 font-bold rounded-xl px-3 py-1 focus:outline-none"
          >
            {SLIDE_TEMPLATES.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Slide Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Thumbnails Strip */}
        <div className="lg:col-span-3 space-y-2.5 max-h-[500px] overflow-y-auto pr-1 scrollbar-none font-mono text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">
            Slide Navigator ({slides.length})
          </span>
          {slides.map((s, idx) => (
            <div
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentSlideIndex === idx
                  ? 'bg-slate-950 border-purple-500/80 shadow-md ring-1 ring-purple-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                <span>SLIDE #{idx + 1}</span>
                <span className="uppercase">{s.layout}</span>
              </div>
              <div className="font-bold text-white text-xs truncate font-sans">{s.title}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{s.subtitle}</div>
            </div>
          ))}
        </div>

        {/* Right Active Slide Canvas (16:9 Aspect Ratio) */}
        <div className="lg:col-span-9 space-y-4">
          <div className="aspect-[16/9] w-full bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Top Slide Meta */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 font-mono text-xs">
              <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">
                RZ® MINETRIX EXECUTIVE PRESENTATION
              </span>
              <span className="text-slate-500 text-[10px]">
                Slide {currentSlideIndex + 1} of {slides.length}
              </span>
            </div>

            {/* Slide Body based on Layout */}
            <div className="space-y-4 my-auto">
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {currentSlide.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed max-w-2xl">
                {currentSlide.subtitle}
              </p>

              {/* Stats Layout */}
              {currentSlide.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {currentSlide.stats.map((st, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-500 font-mono">{st.label}</div>
                      <div className="text-xl font-black text-white mt-1">{st.value}</div>
                      {st.change && (
                        <div className="text-[10px] text-emerald-400 font-mono mt-0.5">{st.change}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Bullets Layout */}
              {currentSlide.points && (
                <div className="space-y-2 pt-2 text-xs sm:text-sm font-sans text-slate-300">
                  {currentSlide.points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Slide Footer */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>CONFIDENTIAL &bull; INTERNAL MANAGEMENT REPORT</span>
              <span>RZ GROUP HOLDINGS &bull; KASARAGOD &bull; CALICUT</span>
            </div>
          </div>

          {/* Speaker Notes Area */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-purple-400" />
                <span>Executive Speaker Notes</span>
              </span>
              <span className="text-[10px] text-emerald-400">Private &bull; Not visible to audience</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {currentSlide.speakerNotes || 'No specific notes recorded for this slide.'}
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen Presentation Modal Overlay */}
      {isPresenting && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-8 sm:p-16 animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              RZ® PRESENTATION &bull; {currentSlideIndex + 1} / {slides.length}
            </span>
            <button
              onClick={() => setIsPresenting(false)}
              className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
            >
              Exit (Esc)
            </button>
          </div>

          <div className="max-w-4xl mx-auto space-y-6 text-center my-auto">
            <h1 className="text-4xl sm:text-5xl font-black text-white">
              {currentSlide.title}
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-sans">
              {currentSlide.subtitle}
            </p>

            {currentSlide.stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
                {currentSlide.stats.map((st, i) => (
                  <div key={i} className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
                    <div className="text-xs text-slate-400 font-mono">{st.label}</div>
                    <div className="text-3xl font-black text-white mt-1">{st.value}</div>
                    <div className="text-xs text-emerald-400 font-mono mt-1">{st.change}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <button
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-900 disabled:opacity-30 text-white flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <span>Use Left/Right keys or buttons to navigate</span>
            <button
              onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="px-4 py-2 rounded-xl bg-slate-900 disabled:opacity-30 text-white flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
