import React, { useState } from 'react';
import {
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Layers,
  Truck,
  DollarSign,
  PieChart,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { COMMERCE_DASHBOARD_METRICS } from '../../data/ecommerceStudioData';

export const ReportsAnalyticsView: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'This Week' | 'This Month' | 'This Quarter' | 'FY 2026-27'>('This Month');

  const handleExportCSV = (reportName: string) => {
    alert(`Exporting ${reportName} (${timeframe}) to CSV/Excel...`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              EXECUTIVE INTELLIGENCE & AUDIT
            </span>
            <span className="text-xs text-slate-400 font-medium">Business Intelligence Unit</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">E-Commerce Reports & Analytics</h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono font-bold focus:outline-none"
          >
            <option value="This Week">This Week</option>
            <option value="This Month">This Month (September 2026)</option>
            <option value="This Quarter">This Quarter (Q3 2026)</option>
            <option value="FY 2026-27">FY 2026-27 Year to Date</option>
          </select>

          <button
            onClick={() => handleExportCSV('Consolidated Commerce')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Top Commercial Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Gross Merchandise Value (GMV)</span>
          <div className="text-2xl font-black text-white font-mono">₹48,20,000</div>
          <div className="text-[11px] text-emerald-400 font-mono">+18.4% vs last month</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Laterite Stone Orders</span>
          <div className="text-2xl font-black text-amber-400 font-mono">72,400 Blocks</div>
          <div className="text-[11px] text-slate-400 font-mono">68% of total commerce volume</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Average Fulfillment Time</span>
          <div className="text-2xl font-black text-cyan-400 font-mono">5.2 Hours</div>
          <div className="text-[11px] text-emerald-400 font-mono">Quarry extraction to site dump</div>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <span className="text-[11px] text-slate-400 font-mono uppercase">Dispute Rate</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">0.02%</div>
          <div className="text-[11px] text-slate-400 font-mono">1 claim out of 48 completed trips</div>
        </div>
      </div>

      {/* Standard Downloadable Reports */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white">Standard Auditing & Compliance Exports</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Laterite Concession Pit Extraction Ledger', desc: 'Detailed block quantities, royalties paid, pit concession IDs' },
            { title: 'Customer Billing & GST Tax Schedule', desc: 'B2B/B2C invoice logs with CGST and SGST splits for GSTR-1' },
            { title: 'Haulage & Vehicle Trip Manifest', desc: 'Vehicle mileage, weighbridge gross/tare values, driver payouts' },
            { title: 'Quarry Supplier Settlement & Escrow', desc: 'Supplier billings, advance escrow releases, balance payables' },
            { title: 'Customer Credit & Receivables Aging', desc: '30/60/90 days aging breakdown across active builders' },
            { title: 'Quality Assurance & Breakage Log', desc: 'Transit breakage audit across wire-cut and rough laterite' }
          ].map((rep, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white">{rep.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-mono">Excel & CSV</span>
                <button
                  onClick={() => handleExportCSV(rep.title)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3 h-3 text-amber-400" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
