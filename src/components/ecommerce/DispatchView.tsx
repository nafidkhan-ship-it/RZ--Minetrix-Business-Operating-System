import React, { useState } from 'react';
import {
  Truck,
  FileText,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  MapPin,
  Phone
} from 'lucide-react';
import { CommerceDispatch, COMMERCE_DISPATCHES } from '../../data/ecommerceStudioData';

export const DispatchView: React.FC = () => {
  const [dispatches, setDispatches] = useState<CommerceDispatch[]>(COMMERCE_DISPATCHES);
  const [selectedDispatch, setSelectedDispatch] = useState<CommerceDispatch | null>(COMMERCE_DISPATCHES[0]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              QUARRY GATE & WEIGHBRIDGE DISPATCH
            </span>
            <span className="text-xs text-slate-400 font-medium">Logistics Desk</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Dispatch Management ({dispatches.length})</h1>
        </div>

        <button
          onClick={() => alert('Issuing new quarry gate pass in Studio Preview...')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Quarry Dispatch</span>
        </button>
      </div>

      {/* Dispatches List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          {dispatches.map((disp) => {
            const isSelected = selectedDispatch?.id === disp.id;
            return (
              <div
                key={disp.id}
                onClick={() => setSelectedDispatch(disp)}
                className={`p-5 rounded-3xl border transition cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-xl'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{disp.gatePassNumber}</span>
                    <span className="text-xs font-bold text-white font-mono">{disp.orderNumber}</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {disp.loadingStatus}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div>Quarry: <span className="text-white font-medium">{disp.pickupLocation}</span></div>
                  <div>Site: <span className="text-slate-300">{disp.deliveryLocation}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold">{disp.vehicleNumber}</span>
                  <span className="text-slate-400">{disp.driverName} ({disp.driverPhone})</span>
                  <span className="text-emerald-400 font-bold">{disp.netWeightTons} MT</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Dispatch Dossier */}
        {selectedDispatch && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 self-start sticky top-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{selectedDispatch.id}</span>
                <h3 className="text-base font-black text-white mt-0.5">Gate Pass: {selectedDispatch.gatePassNumber}</h3>
              </div>
              <button
                onClick={() => alert(`Printing Gate Pass ${selectedDispatch.gatePassNumber}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5 text-cyan-400" />
                <span>Print Pass</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Order Reference:</span>
                <span className="text-white font-bold">{selectedDispatch.orderNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Gross Weighbridge:</span>
                <span className="text-white">{selectedDispatch.grossWeightTons} MT</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tare Weight (Truck):</span>
                <span className="text-white">{selectedDispatch.tareWeightTons} MT</span>
              </div>
              <div className="flex justify-between text-cyan-400 font-bold pt-1 border-t border-slate-800">
                <span>Net Mineral Weight:</span>
                <span>{selectedDispatch.netWeightTons} MT</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div><span className="text-slate-500">Transit Pass Ref:</span> <span className="text-white font-mono">{selectedDispatch.transitPassNumber}</span></div>
              <div><span className="text-slate-500">Assigned Driver:</span> <span className="text-white font-medium">{selectedDispatch.driverName}</span></div>
              <div><span className="text-slate-500">Contact Number:</span> <span className="text-white font-mono">{selectedDispatch.driverPhone}</span></div>
              <div><span className="text-slate-500">Est. Site Arrival:</span> <span className="text-emerald-400 font-mono font-bold">{selectedDispatch.estimatedArrival}</span></div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert(`Vehicle ${selectedDispatch.vehicleNumber} status updated to En Route`)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition cursor-pointer shadow-md"
              >
                Confirm Quarry Gate Departure
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
