import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  Compass,
  CheckCircle2,
  Sparkles,
  Layers
} from 'lucide-react';
import { getLandDashboardMetrics } from '../../../data/quarryLandData';

export const LandReportsView: React.FC = () => {
  const metrics = getLandDashboardMetrics();

  const handleExport = (reportName: string) => {
    alert(`Generating & downloading ${reportName}... Complete.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
              Platform 7 &bull; Governance & Audit Reports
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
              Executive BOS Summary
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Quarry Land Reports Center</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastral coverage, agreement expiration watchlists, royal tax audits, and double-entry reconciliations.
          </p>
        </div>

        <button
          onClick={() => handleExport('Comprehensive_Platform_7_Executive_Dossier')}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export All Reports (ZIP/PDF)</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Report 1 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-sm">Land Extent & Cadastral Audit Report</h3>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Q3 2026</span>
          </div>
          <p className="text-xs text-slate-400">
            Total cadastral area under concession: {metrics.totalExtentCents.toLocaleString('en-IN')} Cents ({metrics.totalExtentAcres} Acres).
            Includes parcel benchmarks, access haul road rights of way, and boundary benchmarks.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-emerald-400 font-semibold text-[11px]">100% Surveyed</span>
            <button
              onClick={() => handleExport('Land_Extent_Report')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Report 2 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Agreement Expiry & Concession Renewal</h3>
            </div>
            <span className="text-[10px] text-amber-400 font-mono">3 Upcoming Renewals</span>
          </div>
          <p className="text-xs text-slate-400">
            Monitoring active concessions for Hosdurg Pit #01 and Wayanad Pit #04. Highlights 36-month restoration schedules and ground leveling commitments.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-amber-400 font-semibold text-[11px]">Action Required: 60 Days</span>
            <button
              onClick={() => handleExport('Concession_Renewal_Report')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Report 3 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">Financial Payouts & Advance Deductions</h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Reconciled</span>
          </div>
          <p className="text-xs text-slate-400">
            Complete disbursement ledger: ₹{metrics.totalPaid.toLocaleString('en-IN')} disbursed with ₹{metrics.totalAdvances.toLocaleString('en-IN')} advances issued. Net outstanding ₹{metrics.totalOutstanding.toLocaleString('en-IN')}.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-emerald-400 font-semibold text-[11px]">Audit-Ready CSV & PDF</span>
            <button
              onClick={() => handleExport('Financial_Payouts_Report')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>

        {/* Report 4 */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-sm">Mineral Royalty & Load Audit</h3>
            </div>
            <span className="text-[10px] text-purple-400 font-mono">2,380 Verified Loads</span>
          </div>
          <p className="text-xs text-slate-400">
            Per-load weighment slip verification across all active quarry benches. Correlates mined quantities against state mining department concession limits.
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <span className="text-purple-400 font-semibold text-[11px]">Government Royalty Compliant</span>
            <button
              onClick={() => handleExport('Mineral_Royalty_Report')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
