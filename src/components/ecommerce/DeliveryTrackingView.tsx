import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CommerceOrder, COMMERCE_ORDERS } from '../../data/ecommerceStudioData';

interface DeliveryTrackingViewProps {
  orders: CommerceOrder[];
  onOpenConfirmationModal: (order: CommerceOrder) => void;
  onOpenDisputeModal: (order: CommerceOrder) => void;
}

export const DeliveryTrackingView: React.FC<DeliveryTrackingViewProps> = ({
  orders,
  onOpenConfirmationModal,
  onOpenDisputeModal
}) => {
  const [selectedOrder, setSelectedOrder] = useState<CommerceOrder>(orders[0]);

  const STAGES = [
    { title: 'Order Confirmed', desc: 'Concession matched & advance logged' },
    { title: 'Quarry Pit Extraction', desc: 'Quality inspected & pit dressed' },
    { title: 'Ready for Dispatch', desc: 'Palletized / weighbridge slip logged' },
    { title: 'Tipper Dispatched', desc: 'Government mineral transit pass issued' },
    { title: 'In Transit', desc: 'Haulage route en route to destination' },
    { title: 'Site Arrival & Unloading', desc: 'Tipper arrived at project location' },
    { title: 'Customer Confirmed', desc: 'Digital receipt sign-off & balance cleared' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider">
              REAL-TIME LOGISTICS TRACKER
            </span>
            <span className="text-xs text-slate-400 font-medium">Site Milestone Verification</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Live Order & Delivery Tracking</h1>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedOrder.id}
            onChange={(e) => {
              const found = orders.find(o => o.id === e.target.value);
              if (found) setSelectedOrder(found);
            }}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs font-mono font-bold focus:outline-none"
          >
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                {o.orderNumber} - {o.customerName} ({o.productName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tracking Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-black text-amber-400">{selectedOrder.orderNumber}</span>
              <span className="text-xs font-bold text-white">&bull; {selectedOrder.customerName}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Site: <strong className="text-slate-200">{selectedOrder.siteProjectName}</strong> ({selectedOrder.district})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenConfirmationModal(selectedOrder)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Site Delivery</span>
            </button>
            <button
              onClick={() => onOpenDisputeModal(selectedOrder)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>

        {/* Milestone Steps */}
        <div className="space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Logistics Pipeline & Transit Milestones
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STAGES.slice(0, 4).map((stage, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">STAGE 0{idx + 1}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="text-xs font-bold text-white">{stage.title}</h4>
                <p className="text-[11px] text-slate-400">{stage.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {STAGES.slice(4).map((stage, idx) => {
              const stageNum = idx + 5;
              const isCurrent = stageNum === 5;
              return (
                <div
                  key={stageNum}
                  className={`p-4 rounded-2xl border space-y-1 ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 font-bold">STAGE 0{stageNum}</span>
                    {isCurrent ? <Clock className="w-4 h-4 text-amber-400 animate-spin" /> : <div className="w-2 h-2 rounded-full bg-slate-700" />}
                  </div>
                  <h4 className="text-xs font-bold text-white">{stage.title}</h4>
                  <p className="text-[11px] text-slate-400">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assigned Haulage Dossier */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 block">Assigned Tipper</span>
            <span className="text-amber-400 font-bold text-sm">{selectedOrder.assignedVehicleNumber || 'KL-14-V-8821'}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Driver & Phone</span>
            <span className="text-white">{selectedOrder.assignedDriverName || 'Binu S.'} ({selectedOrder.assignedDriverPhone || '+91 94471 00192'})</span>
          </div>
          <div>
            <span className="text-slate-500 block">Estimated Drop Window</span>
            <span className="text-emerald-400 font-bold text-sm">{selectedOrder.estimatedDelivery}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
