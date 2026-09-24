import React, { useState } from 'react';
import {
  BarChart3,
  Search,
  Filter,
  Calendar,
  Printer,
  Download,
  FileText,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { CommerceReportDefinition, CommerceSubTab } from '../types';
import { MOCK_COMMERCE_REPORTS } from '../commerceMockData';

interface CommerceReportsViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const CommerceReportsView: React.FC<CommerceReportsViewProps> = ({
  onNavigateTab,
  onToast,
  onOpenPrintModal
}) => {
  const [reports, setReports] = useState<CommerceReportDefinition[]>(MOCK_COMMERCE_REPORTS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeReportModal, setActiveReportModal] = useState<CommerceReportDefinition | null>(null);

  const CATEGORIES = ['ALL', 'SALES', 'PURCHASE', 'RECEIVABLES', 'PAYABLES', 'TAXATION', 'INVENTORY', 'AUDIT'];

  const filtered = reports.filter((r) => {
    const matchesCat = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Management Information System &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              16 Enterprise Commerce, Statutory Tax &amp; Fulfillment Reports
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Real-time transactional registers, aging schedules, rate audit trails, quarry-to-crusher margins, and GSTR-1 / GSTR-3B tax reconciliations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenPrintModal('16 Commerce Management Reports Catalog', reports)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Catalog</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-4 border-t border-slate-800/80 mt-4">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategory === c
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((rep) => (
          <div
            key={rep.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 space-y-3 shadow-lg flex flex-col justify-between group transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-amber-400">{rep.code}</span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {rep.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mt-2 group-hover:text-amber-300 transition">
                {rep.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {rep.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500">{rep.frequency}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setActiveReportModal(rep);
                    onToast(`Generated preview for ${rep.title}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => onToast(`Exporting ${rep.title} as Excel/PDF...`)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal Preview */}
      {activeReportModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{activeReportModal.code}</span>
                <h3 className="text-lg font-black text-white">{activeReportModal.title}</h3>
                <p className="text-xs text-slate-400">{activeReportModal.description}</p>
              </div>
              <button
                onClick={() => setActiveReportModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Period Frequency: <strong className="text-white">{activeReportModal.frequency}</strong></span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  SIMULATED PRODUCTION SNAPSHOT
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1">
                <p className="text-amber-400 font-bold">&gt;&gt;&gt; RZ® MINETRIX EXECUTIVE REPORT RENDERED</p>
                <p>Total Filtered Records: 142 records</p>
                <p>Gross Value: ₹84,60,000.00</p>
                <p>Net Tax Component: ₹4,23,000.00</p>
                <p>Audit Verification Hash: 9f8a-44c2-81e0-eb71b</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => onOpenPrintModal(activeReportModal.title, activeReportModal)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official PDF</span>
              </button>
              <button
                onClick={() => {
                  onToast(`Downloaded ${activeReportModal.title}`);
                  setActiveReportModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
              >
                Download CSV / Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
