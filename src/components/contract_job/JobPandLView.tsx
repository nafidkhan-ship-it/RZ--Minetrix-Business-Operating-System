import React, { useState } from 'react';
import {
  PieChart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Briefcase,
  Layers,
  Printer,
  Download,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import {
  SAMPLE_JOBS,
  ContractJob
} from '../../data/contractJobStudioData';

export const JobPandLView: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalContract = SAMPLE_JOBS.reduce((acc, curr) => acc + curr.contractValue, 0);
  const totalBilled = SAMPLE_JOBS.reduce((acc, curr) => acc + curr.billedAmount, 0);
  const totalReceived = SAMPLE_JOBS.reduce((acc, curr) => acc + curr.receivedAmount, 0);
  const totalCost = SAMPLE_JOBS.reduce((acc, curr) => acc + curr.actualCost, 0);
  const totalNetProfit = SAMPLE_JOBS.reduce((acc, curr) => acc + curr.actualProfit, 0);
  const overallMargin = ((totalNetProfit / (totalBilled || 1)) * 100).toFixed(1);

  const activeJob = SAMPLE_JOBS.find((j) => j.id === selectedJobId);

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Financial Intelligence
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Contribution Margin: {overallMargin}%
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Job Profit & Loss (P&L) Statement</h2>
          <p className="text-xs text-slate-400">
            Real-time commercial analytics: Revenue, Direct Quarry & Crusher Costs, Indirect Overheads, and Net Yields.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">Consolidated Platform P&L</option>
            {SAMPLE_JOBS.map((j) => (
              <option key={j.id} value={j.id}>
                {j.id} - {j.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => showToast('Exported P&L Financial Report (PDF)')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-medium">Total Contract Commitments</span>
          <div className="text-xl font-black text-white font-mono mt-1">
            ₹{(totalContract / 100000).toFixed(2)} L
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-medium">Billed Revenue</span>
          <div className="text-xl font-black text-cyan-400 font-mono mt-1">
            ₹{(totalBilled / 100000).toFixed(2)} L
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-medium">Actual Incurred Costs</span>
          <div className="text-xl font-black text-rose-300 font-mono mt-1">
            ₹{(totalCost / 100000).toFixed(2)} L
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-emerald-500/20 bg-emerald-500/5 rounded-2xl">
          <span className="text-emerald-400 text-[10px] font-medium">Total Net Profit</span>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">
            ₹{(totalNetProfit / 100000).toFixed(2)} L
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <span className="text-slate-500 text-[10px] font-medium">Platform Margin</span>
          <div className="text-xl font-black text-purple-400 font-mono mt-1">{overallMargin}%</div>
        </div>
      </div>

      {/* SINGLE JOB P&L DETAIL VIEW (If specific job selected) */}
      {activeJob && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-emerald-400">{activeJob.id}</span>
              <h3 className="text-lg font-black text-white">{activeJob.name}</h3>
              <div className="text-xs text-slate-400">Customer: {activeJob.customerName}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Contribution Margin</span>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                {((activeJob.actualProfit / (activeJob.billedAmount || 1)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {/* Revenue Column */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-cyan-400 text-xs uppercase tracking-wider font-sans">
                1. Revenue Realization
              </h4>
              <div className="flex justify-between text-slate-300">
                <span>Total Contracted:</span>
                <span className="text-white font-bold">
                  ₹{activeJob.contractValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Progress Billed to Date:</span>
                <span className="text-cyan-300 font-bold">
                  ₹{activeJob.billedAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Net Payments Received:</span>
                <span className="text-emerald-400 font-bold">
                  ₹{activeJob.receivedAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>Outstanding Balance:</span>
                <span className="text-amber-400 font-bold">
                  ₹{activeJob.outstandingAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Direct & Indirect Costs Column */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-rose-400 text-xs uppercase tracking-wider font-sans">
                2. Operational Direct Costs
              </h4>
              <div className="flex justify-between text-slate-300">
                <span>Materials & Quarry Aggregates:</span>
                <span>₹{Math.round(activeJob.actualCost * 0.45).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Specialist Contractors & Blasting:</span>
                <span>₹{Math.round(activeJob.actualCost * 0.25).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fleet, Fuel & Machine Hire:</span>
                <span>₹{Math.round(activeJob.actualCost * 0.20).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Site Supervision & Labour Wages:</span>
                <span>₹{Math.round(activeJob.actualCost * 0.10).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-rose-300 font-bold pt-1 border-t border-slate-800">
                <span>Total Actual Incurred Cost:</span>
                <span>₹{activeJob.actualCost.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JOBS COMPARISON TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Job-by-Job Profitability Comparison
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {SAMPLE_JOBS.length} Projects Analyzed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Job ID</th>
                <th className="py-3 px-4">Job Name & Customer</th>
                <th className="py-3 px-4 text-right">Contract Value</th>
                <th className="py-3 px-4 text-right">Billed</th>
                <th className="py-3 px-4 text-right">Actual Cost</th>
                <th className="py-3 px-4 text-right">Net Profit (₹)</th>
                <th className="py-3 px-4 text-right">Margin %</th>
                <th className="py-3 px-4">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-xs">
              {SAMPLE_JOBS.map((j) => {
                const margin = ((j.actualProfit / (j.billedAmount || 1)) * 100).toFixed(1);
                return (
                  <tr key={j.id} className="hover:bg-slate-850 transition">
                    <td className="py-3 px-4 font-bold text-emerald-400">{j.id}</td>
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-white">{j.name}</div>
                      <div className="text-[10px] text-slate-500">{j.customerName}</div>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-300">
                      ₹{(j.contractValue / 100000).toFixed(2)} L
                    </td>
                    <td className="py-3 px-4 text-right text-cyan-400">
                      ₹{(j.billedAmount / 100000).toFixed(2)} L
                    </td>
                    <td className="py-3 px-4 text-right text-rose-300">
                      ₹{(j.actualCost / 100000).toFixed(2)} L
                    </td>
                    <td className="py-3 px-4 text-right font-black text-emerald-400 text-sm">
                      ₹{(j.actualProfit / 100000).toFixed(2)} L
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-purple-400">{margin}%</td>
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full"
                            style={{ width: `${j.progressPercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{j.progressPercent}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
