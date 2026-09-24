import React, { useState } from 'react';
import {
  QrCode,
  Plus,
  Search,
  Filter,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  Building2,
  Package,
  Calendar,
  Eye
} from 'lucide-react';
import { GatePassRecord, CommerceSubTab } from '../types';
import { MOCK_GATE_PASSES } from '../commerceMockData';

interface GatePassViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const GatePassView: React.FC<GatePassViewProps> = ({
  onNavigateTab,
  onToast,
  onOpenPrintModal
}) => {
  const [passes, setPasses] = useState<GatePassRecord[]>(MOCK_GATE_PASSES);
  const [selectedPass, setSelectedPass] = useState<GatePassRecord>(passes[0]);
  const [filterType, setFilterType] = useState<'ALL' | 'OUTGOING' | 'INCOMING'>('ALL');

  const filtered = passes.filter((p) =>
    filterType === 'ALL' ? true : p.gatePassType === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Physical Security &amp; Logistics Gateway &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Weighbridge Gate Pass &amp; QR Barcode Validation Portal
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Issues digitally signed QR Gate Passes for outward mineral haulage and inward vendor raw materials. Links gross tare weighbridge gross readings directly with vehicle GPS.
            </p>
          </div>

          <button
            onClick={() => onToast('Open Gate Pass Generator')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Issue New Gate Pass</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Pass List (7 cols) */}
        <div className="xl:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>Gate Movement Register ({filtered.length})</span>
            </h3>

            <div className="flex items-center gap-1">
              {['ALL', 'OUTGOING', 'INCOMING'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t as any)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold cursor-pointer ${
                    filterType === t ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {filtered.map((gp) => {
              const isSelected = selectedPass?.id === gp.id;
              return (
                <div
                  key={gp.id}
                  onClick={() => setSelectedPass(gp)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">{gp.gatePassNumber}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          gp.gatePassType === 'OUTGOING' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {gp.gatePassType}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white mt-1">{gp.partyName}</p>
                      <p className="text-[11px] text-slate-400">{gp.productName} ({gp.quantity} {gp.unit})</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-white block">{gp.vehicleNumber}</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
                        gp.status === 'CLEARED_GATE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {gp.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Pass QR Badge & Weighbridge Slip Preview (5 cols) */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          {selectedPass ? (
            <>
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">{selectedPass.gatePassNumber}</span>
                  <h3 className="text-base font-black text-white">Weighbridge Clear Pass</h3>
                  <p className="text-xs text-slate-400">{selectedPass.dateTime}</p>
                </div>
                <button
                  onClick={() => onOpenPrintModal(`Official Gate Pass Slip - ${selectedPass.gatePassNumber}`, selectedPass)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>

              {/* QR Code Mock Preview */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg">
                  <div className="w-full h-full border-4 border-black flex flex-col items-center justify-center font-mono text-[9px] text-black font-black leading-tight">
                    <span>RZ-GATE</span>
                    <span className="text-xs">QR-PASS</span>
                    <span>{selectedPass.vehicleNumber}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Scan via RZ® Security Terminal or Mobile App
                </span>
              </div>

              {/* Weighbridge Slip Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Party / Consignee:</span>
                    <strong className="text-white">{selectedPass.partyName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Material:</span>
                    <strong className="text-amber-400">{selectedPass.productName}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Net Weight / Payload:</span>
                    <strong className="text-emerald-400 font-mono">{selectedPass.quantity} {selectedPass.unit}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Haulage Vehicle:</span>
                    <strong className="text-white font-mono">{selectedPass.vehicleNumber}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Driver in Charge:</span>
                    <strong className="text-slate-300">{selectedPass.driverName}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/30 border border-slate-800 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Origin / Destination:</span>
                  <span className="text-slate-200 font-medium">{selectedPass.sourceDestination}</span>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
