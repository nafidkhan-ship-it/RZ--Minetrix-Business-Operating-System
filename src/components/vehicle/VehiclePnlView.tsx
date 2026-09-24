import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Truck,
  Calendar,
  DollarSign,
  Download,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { Vehicle } from '../../data/vehicleStudioData';

interface VehiclePnlViewProps {
  vehicles: Vehicle[];
}

export const VehiclePnlView: React.FC<VehiclePnlViewProps> = ({ vehicles }) => {
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Monthly');

  const totalRevenue = vehicles.reduce((acc, v) => acc + v.monthRevenue, 0);
  const totalExpense = vehicles.reduce((acc, v) => acc + v.monthExpense, 0);
  const totalNet = totalRevenue - totalExpense;
  const fleetMargin = totalRevenue > 0 ? Math.round((totalNet / totalRevenue) * 100) : 0;

  // Sorted by net contribution
  const sortedVehicles = [...vehicles].sort((a, b) => b.monthNetContribution - a.monthNetContribution);
  const bestPerforming = sortedVehicles[0];
  const worstPerforming = sortedVehicles[sortedVehicles.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              FLEET P&L LEDGER &bull; AUDITED OPERATIONAL AUDIT
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Commercial Vehicle P&L Statements</h2>
          <p className="text-xs text-slate-400">
            Per-vehicle freight income, statutory amortization, fuel, toll, driver batta & net profitability
          </p>
        </div>

        {/* Period Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                period === p
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Total Fleet Revenue</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Freight, haulage & detention</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Total Fleet Expenses</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            ₹{totalExpense.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Operating, fuel & compliance</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Net Fleet Contribution</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            ₹{totalNet.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Consolidated net surplus</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Overall Profit Margin</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {fleetMargin}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Weighted average margin</div>
        </div>
      </div>

      {/* Benchmark Banners: Best & Worst Performing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {bestPerforming && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">Top Performing Asset</span>
                <div className="font-bold text-white text-sm">{bestPerforming.vehicleNumber} ({bestPerforming.vehicleCode})</div>
                <div className="text-[11px] text-slate-400">{bestPerforming.monthTripsCount} Trips Executed</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-emerald-400 font-black text-base">₹{bestPerforming.monthNetContribution.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">Net Profit</div>
            </div>
          </div>
        )}

        {worstPerforming && (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Lowest Margin Asset</span>
                <div className="font-bold text-white text-sm">{worstPerforming.vehicleNumber} ({worstPerforming.vehicleCode})</div>
                <div className="text-[11px] text-slate-400">{worstPerforming.monthTripsCount} Trips Executed</div>
              </div>
            </div>
            <div className="text-right font-mono">
              <div className="text-amber-400 font-bold text-base">₹{worstPerforming.monthNetContribution.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">Net Profit</div>
            </div>
          </div>
        )}
      </div>

      {/* Vehicle P&L Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Vehicle & Code</th>
                <th className="py-3.5 px-3">Type</th>
                <th className="py-3.5 px-3">Trips Count</th>
                <th className="py-3.5 px-3">Gross Freight</th>
                <th className="py-3.5 px-3">Direct Operating Cost</th>
                <th className="py-3.5 px-3">Net Contribution</th>
                <th className="py-3.5 px-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {vehicles.map((v) => {
                const margin = v.monthRevenue > 0 ? Math.round((v.monthNetContribution / v.monthRevenue) * 100) : 0;
                return (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-[11px]">
                          {v.vehicleCode}
                        </span>
                        <span className="font-bold text-white">{v.vehicleNumber}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-300">
                      {v.vehicleType}
                    </td>

                    <td className="py-3.5 px-3 font-mono">
                      {v.monthTripsCount} Trips
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 text-sm">
                      ₹{v.monthRevenue.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-rose-400 font-bold">
                      ₹{v.monthExpense.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                      ₹{v.monthNetContribution.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          margin >= 45
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {margin}%
                      </span>
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
