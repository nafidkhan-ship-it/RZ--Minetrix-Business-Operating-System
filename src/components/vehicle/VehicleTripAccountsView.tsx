import React, { useState } from 'react';
import {
  DollarSign,
  Search,
  Truck,
  Calendar,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Percent,
  MapPin,
  Download
} from 'lucide-react';
import { Trip, Vehicle } from '../../data/vehicleStudioData';

interface VehicleTripAccountsViewProps {
  trips: Trip[];
  vehicles: Vehicle[];
}

export const VehicleTripAccountsView: React.FC<VehicleTripAccountsViewProps> = ({
  trips,
  vehicles
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');

  const filtered = trips.filter(
    (t) =>
      t.tripNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.material.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalGrossIncome = filtered.reduce((acc, t) => acc + t.tripIncome, 0);
  const totalDirectExpenses = filtered.reduce(
    (acc, t) => acc + t.fuelCost + t.tollCost + t.driverBatta + t.loadingUnloadingCost + t.otherExpense,
    0
  );
  const totalNetContribution = totalGrossIncome - totalDirectExpenses;
  const avgMargin = totalGrossIncome > 0 ? Math.round((totalNetContribution / totalGrossIncome) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              VADAKA ACCOUNTING &bull; {filtered.length} SETTLED TRIPS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Trip Accounts & Net Freight Contribution</h2>
          <p className="text-xs text-slate-400">
            Income minus Fuel, Toll, Driver Batta & Loading charges equals True Vehicle Contribution (Vadaka)
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {(['Daily', 'Weekly', 'Monthly'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                timeframe === tf
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Gross Freight Income</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{totalGrossIncome.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{filtered.length} Trips Audited</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Total Direct Trip Costs</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-1">
            ₹{totalDirectExpenses.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Fuel, Toll, Batta, Loading</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Net Vadaka Contribution</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            ₹{totalNetContribution.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-0.5">Distributable Vehicle Earnings</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Average Profit Margin</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {avgMargin}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Net Freight Efficiency</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search trip number, vehicle, customer, material..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Trips Accounts Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Trip # & Route</th>
                <th className="py-3.5 px-3">Vehicle & Driver</th>
                <th className="py-3.5 px-3">Gross Income</th>
                <th className="py-3.5 px-3">Fuel</th>
                <th className="py-3.5 px-3">Toll</th>
                <th className="py-3.5 px-3">Batta</th>
                <th className="py-3.5 px-3">Loading</th>
                <th className="py-3.5 px-3">Contribution</th>
                <th className="py-3.5 px-4 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((t) => {
                const totalCost = t.fuelCost + t.tollCost + t.driverBatta + t.loadingUnloadingCost + t.otherExpense;
                const margin = t.tripIncome > 0 ? Math.round((t.tripContribution / t.tripIncome) * 100) : 0;

                return (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white font-mono">{t.tripNumber}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{t.pickupLocation} &rarr; {t.destinationLocation}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-mono font-bold text-cyan-400">{t.vehicleNumber}</div>
                      <div className="text-[10px] text-slate-400">{t.driverName}</div>
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 text-sm">
                      ₹{t.tripIncome.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      ₹{t.fuelCost}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      ₹{t.tollCost}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      ₹{t.driverBatta}
                    </td>

                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      ₹{t.loadingUnloadingCost}
                    </td>

                    <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                      ₹{t.tripContribution.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
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
