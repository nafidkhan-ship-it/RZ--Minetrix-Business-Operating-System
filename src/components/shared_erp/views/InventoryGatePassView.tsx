import React, { useState } from 'react';
import {
  Package,
  Truck,
  Plus,
  Search,
  Filter,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { InventoryItem, GatePassRecord } from '../types';
import { MOCK_INVENTORY_ITEMS, MOCK_GATE_PASSES } from '../data/erpMasterData';

interface InventoryGatePassViewProps {
  initialSubTab?: 'inventory' | 'gate-pass';
  onOpenPrintModal?: (title: string, data: any) => void;
}

export const InventoryGatePassView: React.FC<InventoryGatePassViewProps> = ({
  initialSubTab = 'inventory',
  onOpenPrintModal
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'gate-pass'>(initialSubTab);
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [gatePasses, setGatePasses] = useState<GatePassRecord[]>(MOCK_GATE_PASSES);
  const [selectedPass, setSelectedPass] = useState<GatePassRecord | null>(gatePasses[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const totalValuation = inventory.reduce((acc, curr) => acc + curr.totalValuation, 0);

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              OPERATIONS &bull; INVENTORY &amp; SECURITY GATE PASS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            {activeTab === 'inventory' ? (
              <>
                <Package className="w-6 h-6 text-amber-400" />
                <span>Multi-Location Silos &amp; Stock Valuation</span>
              </>
            ) : (
              <>
                <Truck className="w-6 h-6 text-cyan-400" />
                <span>Digital Gate Pass &amp; Weighbridge Dispatch QR</span>
              </>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Live stock balances across <strong>Quarry Pit, Crusher Plant, Central Yard, Workshop Store, and Fuel Bowser</strong>. Verified using digital incoming &amp; outgoing QR Gate Passes.
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Stock Inventory ({inventory.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('gate-pass')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'gate-pass'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Gate Passes ({gatePasses.length})</span>
          </button>
        </div>
      </div>

      {/* 1. INVENTORY VIEW */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Top Valuation Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Total Stock Valuation</span>
              <div className="text-2xl font-black text-amber-400">₹{totalValuation.toLocaleString()}</div>
              <span className="text-slate-500 text-[10px]">Weighted Average Cost Method</span>
            </div>
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Tracked Silos &amp; Yards</span>
              <div className="text-2xl font-black text-white">5 Active Hubs</div>
              <span className="text-emerald-400 text-[10px]">Zero Stock-Out Exceptions</span>
            </div>
            <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Formula Engine</span>
              <div className="text-sm font-black text-cyan-400 mt-2">Opening + In &minus; Out = Balance</div>
              <span className="text-slate-500 text-[10px]">Reconciles with Weighbridge IoT</span>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Stock Ledger Across Strategic Locations</h3>
              <button
                onClick={() => showToast('Stock transfer requisition drafted')}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Inter-Site Stock Transfer</span>
              </button>
            </div>

            <div className="space-y-2">
              {inventory.map(item => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm font-sans">{item.productName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-600" />
                      <span>{item.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 text-slate-300">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Opening</span>
                      <span>{item.openingStock.toLocaleString()} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-500 block">+ Inflow</span>
                      <span className="text-emerald-400 font-bold">+{item.stockIn.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-500 block">&minus; Outflow</span>
                      <span className="text-rose-400 font-bold">&minus;{item.stockOut.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Current Balance</span>
                      <span className="text-base font-black text-amber-400">{item.currentBalance.toLocaleString()} {item.unit}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Valuation</span>
                      <span className="text-base font-black text-white">₹{item.totalValuation.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. GATE PASS VIEW */}
      {activeTab === 'gate-pass' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gate Pass List */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-xs">Recent Security Passes ({gatePasses.length})</h3>
              <button
                onClick={() => showToast('New Gate Pass created')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                + New Pass
              </button>
            </div>

            <div className="space-y-2">
              {gatePasses.map(pass => {
                const isSelected = selectedPass?.id === pass.id;
                return (
                  <div
                    key={pass.id}
                    onClick={() => setSelectedPass(pass)}
                    className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 font-mono text-xs ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-white">{pass.gatePassNo}</span>
                        <div className="text-[10px] text-slate-500">{pass.dateTime}</div>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                        pass.passType === 'OUTGOING'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {pass.passType}
                      </span>
                    </div>

                    <div className="text-slate-300 font-sans text-xs font-semibold">
                      {pass.materialName}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-slate-400 text-[11px]">
                      <span>{pass.vehicleNumber}</span>
                      <span className="text-cyan-400">{pass.partyName.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gate Pass Printable Card with QR Preview */}
          <div className="lg:col-span-2">
            {selectedPass ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-cyan-400 text-base">{selectedPass.gatePassNo}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                        {selectedPass.passType} PASS
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{selectedPass.location}</h3>
                    <div className="text-xs text-slate-400 font-mono">Issued: {selectedPass.dateTime}</div>
                  </div>

                  <button
                    onClick={() => onOpenPrintModal?.(`Security Gate Pass ${selectedPass.gatePassNo}`, selectedPass)}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print QR Gate Pass</span>
                  </button>
                </div>

                {/* Printable Token Card Representation */}
                <div className="p-6 rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-3 font-mono text-xs flex-1">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-slate-500 text-[10px] block">PARTY / CONSIGNEE</span>
                        <span className="text-white font-bold">{selectedPass.partyName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">ORDER / PO REF</span>
                        <span className="text-amber-400 font-bold">{selectedPass.orderOrPoNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">COMMERCIAL VEHICLE</span>
                        <span className="text-cyan-300 font-bold text-sm">{selectedPass.vehicleNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">DRIVER &amp; CONTACT</span>
                        <span className="text-white">{selectedPass.driverName} ({selectedPass.driverPhone})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">DISPATCHED MATERIAL</span>
                        <span className="text-white font-bold">{selectedPass.materialName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">VERIFIED WEIGHT / QUANTITY</span>
                        <span className="text-emerald-400 font-bold">{selectedPass.quantity}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Destination: <strong className="text-white">{selectedPass.destination}</strong></span>
                      <span>Auth by: <strong className="text-amber-300">{selectedPass.authorizedBy}</strong></span>
                    </div>
                  </div>

                  {/* QR Box */}
                  <div className="p-4 rounded-2xl bg-white text-slate-950 flex flex-col items-center justify-center shrink-0 space-y-2 shadow-2xl">
                    <QrCode className="w-28 h-28" />
                    <span className="text-[9px] font-mono font-bold tracking-tight text-slate-700">
                      SCAN FOR BOOM BARRIER
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
