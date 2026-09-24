import React, { useState } from 'react';
import {
  Clock,
  Search,
  CheckCircle2,
  Truck,
  MapPin,
  FileText,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Delivery, DeliveryStatus } from '../../data/vehicleStudioData';

interface VehicleDeliveryViewProps {
  deliveries: Delivery[];
  onUpdateDeliveryStatus: (deliveryId: string, nextStatus: DeliveryStatus) => void;
}

const DELIVERY_STAGES: DeliveryStatus[] = [
  'Order Received',
  'Loading',
  'Weighed',
  'Dispatched',
  'In Transit',
  'Arrived at Site',
  'Unloading',
  'Delivered',
  'Customer Confirmed'
];

export const VehicleDeliveryView: React.FC<VehicleDeliveryViewProps> = ({
  deliveries,
  onUpdateDeliveryStatus
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filtered = deliveries.filter((d) => {
    const matchesSearch =
      d.deliveryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ewayBillNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.siteLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              9-STAGE DISPATCH PIPELINE &bull; {deliveries.length} DELIVERIES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Aggregates & Mineral Delivery Tracking</h2>
          <p className="text-xs text-slate-400">
            Real-time consignment milestones, e-Way bills, site geofencing & customer digital confirmation
          </p>
        </div>
      </div>

      {/* 9-Stage Visual Pipeline Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {DELIVERY_STAGES.map((stage, idx) => (
            <div key={stage} className="flex items-center gap-2">
              <button
                onClick={() => setSelectedStatus(selectedStatus === stage ? 'ALL' : stage)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                  selectedStatus === stage
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-200 text-[10px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{stage}</span>
              </button>
              {idx < DELIVERY_STAGES.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search delivery number, customer, vehicle, e-way bill..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Deliveries Cards */}
      <div className="space-y-4">
        {filtered.map((del) => {
          const currentStageIndex = DELIVERY_STAGES.indexOf(del.status);
          const nextStage = DELIVERY_STAGES[currentStageIndex + 1];

          return (
            <div
              key={del.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
                    {del.vehicleNumber.slice(-4)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-sm">{del.deliveryNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
                        {del.status}
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      Customer: <strong className="text-white">{del.customerName}</strong> &bull; Vehicle: <span className="font-mono text-slate-200">{del.vehicleNumber}</span> &bull; Driver: {del.driverName}
                    </div>
                  </div>
                </div>

                {/* Progress / Advance Button */}
                {nextStage && (
                  <button
                    onClick={() => onUpdateDeliveryStatus(del.id, nextStage)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer self-start sm:self-auto"
                  >
                    <span>Advance to &ldquo;{nextStage}&rdquo;</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Visual Progress Steps within the Card */}
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-1 text-center font-mono text-[9px] pt-1 pb-1">
                {DELIVERY_STAGES.map((stg, idx) => {
                  const isDone = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <div
                      key={stg}
                      className={`p-1.5 rounded-lg border transition ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : isDone
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {stg}
                    </div>
                  );
                })}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Consignment & Cargo</span>
                  <div className="text-white font-bold">
                    {del.material} &bull; {del.quantityMT} MT
                  </div>
                  <div className="text-[11px] text-cyan-400 font-mono">e-Way Bill: {del.ewayBillNumber}</div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Delivery Site</span>
                  <div className="text-white font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{del.siteLocation}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Dispatch: {del.dispatchTime} &bull; Exp: {del.expectedDeliveryTime}
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase font-mono">Confirmation & Signature</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{del.signatureStatus}</span>
                  </div>
                  {del.notes && <div className="text-[11px] text-slate-400 italic">&ldquo;{del.notes}&rdquo;</div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
