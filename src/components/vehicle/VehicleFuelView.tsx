import React, { useState } from 'react';
import {
  Fuel,
  Search,
  Plus,
  Truck,
  TrendingUp,
  CreditCard,
  Calendar,
  DollarSign,
  Gauge,
  ArrowUpRight
} from 'lucide-react';
import { FuelRecord, Vehicle } from '../../data/vehicleStudioData';

interface VehicleFuelViewProps {
  fuels: FuelRecord[];
  vehicles: Vehicle[];
  onOpenFuelModal: () => void;
}

export const VehicleFuelView: React.FC<VehicleFuelViewProps> = ({
  fuels,
  vehicles,
  onOpenFuelModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('ALL');

  const filtered = fuels.filter((f) => {
    const matchesSearch =
      f.slipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fuelStation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVehicle = vehicleFilter === 'ALL' || f.vehicleNumber === vehicleFilter;
    return matchesSearch && matchesVehicle;
  });

  const totalFuelCost = filtered.reduce((acc, f) => acc + f.totalAmount, 0);
  const totalLiters = filtered.reduce((acc, f) => acc + f.quantityLiters, 0);
  const avgMileage = (filtered.reduce((acc, f) => acc + f.mileageKmpL, 0) / (filtered.length || 1)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              FLEET DIESEL TELEMETRY &bull; {fuels.length} REFUELLING LOGS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Fuel Management & Kilometric Mileage Audits</h2>
          <p className="text-xs text-slate-400">
            Per-vehicle HSD diesel slips, odometer correlation, km/L calculation and cost per kilometre
          </p>
        </div>

        <button
          onClick={onOpenFuelModal}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Fuel Entry</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Diesel Burned</span>
            <Fuel className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
            {totalLiters.toLocaleString()} L
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Heavy Tippers & Dumpers</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Fuel Expenditure</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{totalFuelCost.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Average ₹92.40 / Liter</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Fleet Average Mileage</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {avgMileage} km/L
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Within 2.8 - 3.8 km/L standard range</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search slip #, vehicle number, driver, petrol pump..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Vehicles</option>
              {vehicles.map((v) => (
                <option key={v.id} value={v.vehicleNumber}>
                  {v.vehicleNumber} ({v.vehicleCode})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Fuel Records Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Slip # & Date</th>
                <th className="py-3.5 px-3">Vehicle & Driver</th>
                <th className="py-3.5 px-3">Fuel Station</th>
                <th className="py-3.5 px-3">Volume & Rate</th>
                <th className="py-3.5 px-3">Total Amount</th>
                <th className="py-3.5 px-3">Odometer & Km Run</th>
                <th className="py-3.5 px-3">Mileage (km/L)</th>
                <th className="py-3.5 px-4 text-right">Cost / km</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((fuel) => (
                <tr key={fuel.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono">
                    <div className="font-bold text-white">{fuel.slipNumber}</div>
                    <div className="text-[10px] text-slate-400">{fuel.date} {fuel.time}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-mono font-bold text-cyan-400">{fuel.vehicleNumber}</div>
                    <div className="text-[10px] text-slate-400">{fuel.driverName}</div>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="text-slate-200 font-medium">{fuel.fuelStation}</div>
                    <div className="text-[10px] text-slate-500">{fuel.paymentMethod}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    <div className="font-bold text-white">{fuel.quantityLiters} L</div>
                    <div className="text-[10px] text-slate-400">@ ₹{fuel.ratePerLiter}/L</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono font-bold text-emerald-400 text-sm">
                    ₹{fuel.totalAmount.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    <div className="text-white">{fuel.odometerKm.toLocaleString()} KM</div>
                    <div className="text-[10px] text-slate-400">Run: {fuel.kmRun} KM</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/20">
                      {fuel.mileageKmpL} km/L
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    ₹{fuel.costPerKm}/km
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
