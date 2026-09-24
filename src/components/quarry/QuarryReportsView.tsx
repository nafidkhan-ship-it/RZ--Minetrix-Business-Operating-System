import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  FileText,
  Search,
  CheckCircle2,
  TrendingUp,
  Layers,
  Users,
  DollarSign,
  Pickaxe,
  Truck
} from 'lucide-react';
import { REPORT_TEMPLATES, QuarryReportTemplate, QuarryItem } from '../../data/quarryStudioData';

interface QuarryReportsViewProps {
  quarries: QuarryItem[];
}

export const QuarryReportsView: React.FC<QuarryReportsViewProps> = ({ quarries }) => {
  const [selectedReportId, setSelectedReportId] = useState<string>('rep-1');
  const [selectedQuarry, setSelectedQuarry] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState<string>('September 2026');

  const activeReport = REPORT_TEMPLATES.find((r) => r.id === selectedReportId) || REPORT_TEMPLATES[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              INTELLIGENCE & AUDIT SUITE
            </span>
            <span className="text-xs text-slate-500 font-mono">13 specialized analytical dossiers</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Quarry Concession Audit Reports</h2>
          <p className="text-xs text-slate-400">
            Real-time reconciliation of extraction tonnage, landowner royalty deductions, partner P&L dividends, and DMG compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Exporting ${activeReport.name} to Excel (.xlsx)`)}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs hover:bg-emerald-500/30 flex items-center gap-1.5 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => alert(`Exporting ${activeReport.name} to PDF (.pdf)`)}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Export PDF Dossier</span>
          </button>
        </div>
      </div>

      {/* Global Filter Bar (Section 18) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Quarry Filter</label>
          <select
            value={selectedQuarry}
            onChange={(e) => setSelectedQuarry(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Quarry Concessions</option>
            {quarries.map((q) => (
              <option key={q.id} value={q.name}>
                {q.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Audit Period</label>
          <input
            type="text"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-mono uppercase text-slate-500 block mb-1">Frequency</label>
          <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none">
            <option>Daily Shift Resolution</option>
            <option>Weekly Consolidated</option>
            <option>Monthly Accounting Close</option>
            <option>Year-to-Date Concession Audit</option>
          </select>
        </div>
      </div>

      {/* Layout: Left Sidebar with 13 Reports Grid, Right Preview Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 13 Report Cards Selection (Section 18) */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
          {REPORT_TEMPLATES.map((rep) => {
            const isSelected = selectedReportId === rep.id;
            return (
              <div
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer space-y-1 text-xs ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">
                    {rep.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{rep.id.toUpperCase()}</span>
                </div>
                <h4 className="font-bold text-white text-sm">{rep.name}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{rep.description}</p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Live Report Preview (Section 18) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                  ACTIVE DOSSIER PREVIEW &bull; {activeReport.category}
                </span>
                <h3 className="text-lg font-black text-white">{activeReport.name}</h3>
                <p className="text-xs text-slate-400">{activeReport.description}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Record Count</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {activeReport.previewRows.length} Rows
                </span>
              </div>
            </div>

            {/* Preview Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    {activeReport.columns.map((col, idx) => (
                      <th key={idx} className="py-3 px-3.5 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {activeReport.previewRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30 transition">
                      {activeReport.columns.map((col, cIdx) => {
                        const val = row[col] || '-';
                        const isNumeric = typeof val === 'number' || (typeof val === 'string' && (val.startsWith('₹') || val.endsWith('%') || /^\d+$/.test(val)));
                        return (
                          <td
                            key={cIdx}
                            className={`py-3 px-3.5 whitespace-nowrap ${
                              cIdx === 0
                                ? 'font-mono font-bold text-amber-400'
                                : isNumeric
                                  ? 'font-mono text-white'
                                  : 'text-slate-300'
                            }`}
                          >
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Audited for DMG Kerala & Karnataka Regulatory Guidelines</span>
              <span className="font-mono text-emerald-400">Reconciliation Verified &bull; OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
