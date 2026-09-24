import React from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Users,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CRUSHER_FINANCE_SUMMARY } from '../../data/crusherStudioData';

interface CrusherFinanceSummaryViewProps {
  onNavigatePage: (page: string) => void;
}

export const CrusherFinanceSummaryView: React.FC<CrusherFinanceSummaryViewProps> = ({
  onNavigatePage
}) => {
  const f = CRUSHER_FINANCE_SUMMARY;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                COMPREHENSIVE FINANCIAL HEALTH & BALANCE SHEET
              </span>
              <h2 className="text-xl font-black text-white">Crusher Accounting & P&L Statement</h2>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            FY 2025-26 &bull; CURRENT MONTH AUDIT
          </span>
        </div>

        {/* Top 4 Financial Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Crusher Sales Revenue</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5">₹{(f.crusherSalesRevenue / 100000).toFixed(1)} L</span>
            <span className="text-[10px] text-slate-500 block mt-1">100% Sized Products</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Gross Profit</span>
            <span className="text-2xl font-black text-cyan-400 font-mono mt-0.5">₹{(f.grossProfit / 100000).toFixed(1)} L</span>
            <span className="text-[10px] text-emerald-400 font-bold block mt-1">45.2% Margin</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Net Operating Profit</span>
            <span className="text-2xl font-black text-white font-mono mt-0.5">₹{(f.netOperatingProfit / 100000).toFixed(1)} L</span>
            <span className="text-[10px] text-cyan-400 font-bold block mt-1">36.9% Net Margin</span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800/80">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Partner Capital Pool</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-0.5">₹{(f.partnerCapitalAccounts / 10000000).toFixed(2)} Cr</span>
            <span className="text-[10px] text-slate-500 block mt-1">Independent Crusher Equity</span>
          </div>
        </div>
      </div>

      {/* Two Column P&L and Balance Sheet Ledgers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P&L Statement Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Profit & Loss Breakdown</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Month To Date</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-white">
              <span className="font-bold">(+) Gross Sales Realization</span>
              <span className="font-black text-emerald-400 text-sm">₹{f.crusherSalesRevenue.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex justify-between items-center text-slate-300">
              <span>(-) Raw Boulder Feeder Cost</span>
              <span className="text-red-400 font-bold">-₹{f.rawMaterialCost.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex justify-between items-center text-cyan-300 font-bold">
              <span>(=) Gross Profit (Production Margin)</span>
              <span className="text-sm">₹{f.grossProfit.toLocaleString()}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-slate-400 px-3 py-1">
                <span>(-) Electricity / KSEB Power</span>
                <span className="text-red-400">-₹{f.electricityCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 px-3 py-1">
                <span>(-) Generator & Machinery Diesel</span>
                <span className="text-red-400">-₹{f.fuelCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 px-3 py-1">
                <span>(-) Spare Parts, Jaw Plates & Mantles</span>
                <span className="text-red-400">-₹{f.sparesCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 px-3 py-1">
                <span>(-) Scheduled Overhauls & Maintenance</span>
                <span className="text-red-400">-₹{f.maintenanceCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400 px-3 py-1">
                <span>(-) Plant Operators, Loaders & Staff</span>
                <span className="text-red-400">-₹{f.salariesCost.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex justify-between items-center text-emerald-400 font-bold text-sm">
              <span>(=) NET OPERATING PROFIT</span>
              <span>₹{f.netOperatingProfit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Working Capital & Receivables / Payables */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              <span>Working Capital & Liquidity</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-mono block">Customer Receivables (Debtors)</span>
                <span className="text-lg font-black text-white font-mono block">
                  ₹{(f.customerReceivables / 100000).toFixed(1)} L
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block">88% within 30-day terms</span>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-slate-500 font-mono block">Vendor Payables (Creditors)</span>
                <span className="text-lg font-black text-amber-400 font-mono block">
                  ₹{(f.vendorPayables / 100000).toFixed(1)} L
                </span>
                <span className="text-[10px] text-slate-400 block">Fuel, spares & utilities</span>
              </div>
            </div>

            {/* GST Tax Summary */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs font-mono">
              <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                STATUTORY GST POSITION (HSN 2517 @ 5%)
              </span>
              <div className="flex justify-between text-slate-300">
                <span>Output GST Collected on Sales:</span>
                <span className="font-bold text-white">₹{f.gstOutput.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>(-) Eligible Input Tax Credit (ITC):</span>
                <span className="text-emerald-400">-₹{f.gstInputCredit.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-900 flex justify-between font-bold text-cyan-400">
                <span>Net GST Payable:</span>
                <span>₹{(f.gstOutput - f.gstInputCredit).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation to Settlements */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Ready for Dividend Payout?</span>
              <span className="text-[11px] text-slate-400">Execute partner profit distribution waterfall.</span>
            </div>
            <button
              onClick={() => onNavigatePage('partner-settlement')}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <span>Settlements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
