import React, { useState } from 'react';
import {
  Truck,
  Search,
  Filter,
  Phone,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { CommerceVehicle, COMMERCE_VEHICLES } from '../../data/ecommerceStudioData';

export const VehiclesView: React.FC = () => {
  const [vehicles, setVehicles] = useState<CommerceVehicle[]>(COMMERCE_VEHICLES);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filtered = vehicles.filter((v) => {
    if (filterType === 'ALL') return true;
    return v.type.toUpperCase().includes(filterType);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              FLEET & LOGISTICS INTEGRATION
            </span>
            <span className="text-xs text-slate-400 font-medium">Synchronized with Platform 3</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Delivery Vehicles ({vehicles.length})</h1>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Available for Haulage: <strong className="text-emerald-400">{vehicles.filter(v => v.status === 'Available').length} Tippers</strong>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto text-xs">
        {['ALL', 'TIPPER', 'MULTI-AXLE', 'MEDIUM'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterType === t
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400">{v.type}</span>
                <h3 className="text-base font-black text-white mt-0.5 font-mono">{v.vehicleNumber}</h3>
              </div>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                v.status === 'Available'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : v.status === 'In Transit'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              }`}>
                {v.status}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Haulage Capacity:</span>
                <span className="text-white font-bold">{v.capacityTons} MT (~{v.capacityBlocks} Blocks)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Current Trip:</span>
                <span className="text-amber-300 font-bold">{v.currentTripOrder || 'None (Stationed)'}</span>
              </div>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>Driver: <strong className="text-white">{v.driverName}</strong></div>
              <div>Phone: <span className="text-slate-300 font-mono">{v.driverPhone}</span></div>
              <div>Location: <span className="text-slate-400">{v.gpsLocation}</span></div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">{v.completedTrips} Trips logged</span>
              <button
                onClick={() => alert(`Allocating vehicle ${v.vehicleNumber} to order`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                Assign Trip
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
