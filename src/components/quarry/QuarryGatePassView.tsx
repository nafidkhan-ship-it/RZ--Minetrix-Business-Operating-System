import React, { useState } from 'react';
import {
  ShieldCheck,
  Printer,
  QrCode,
  Truck,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Search,
  ArrowRight
} from 'lucide-react';
import { GatePassRecord, QuarryLoad } from '../../data/quarryStudioData';

interface QuarryGatePassViewProps {
  gatePasses: GatePassRecord[];
  loads: QuarryLoad[];
}

export const QuarryGatePassView: React.FC<QuarryGatePassViewProps> = ({
  gatePasses,
  loads
}) => {
  const [selectedPass, setSelectedPass] = useState<GatePassRecord>(gatePasses[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = gatePasses.filter(
    (gp) =>
      gp.gatePassNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gp.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gp.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gp.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              SECURITY & WEIGHBRIDGE DISPATCH
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({gatePasses.length} gate clearance tokens)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Quarry Gate Pass Clearance</h2>
          <p className="text-xs text-slate-400">
            Tamper-proof transit passes, vehicle weighbridge sign-offs, QR code telemetry, and security clearance.
          </p>
        </div>

        <button
          onClick={() => alert(`Printing Gate Pass #${selectedPass.gatePassNumber}`)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Print Active Gate Pass</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Gate Pass Selector List */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search gate pass, vehicle, driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filtered.map((gp) => {
              const isSelected = selectedPass.id === gp.id;
              return (
                <div
                  key={gp.id}
                  onClick={() => setSelectedPass(gp)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 text-xs ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{gp.gatePassNumber}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {gp.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white font-bold">{gp.vehicleNumber}</span>
                    <span className="text-slate-400 font-mono">{gp.timeOut}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {gp.material} &bull; {gp.quantity} {gp.unit} &rarr; {gp.destination}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Printable Live Gate Pass Card (Section 13) */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
            {/* Watermark/Stamp */}
            <div className="absolute top-6 right-6 flex flex-col items-center opacity-80 pointer-events-none">
              <div className="border-2 border-emerald-500/60 rounded-xl p-2 text-center rotate-6">
                <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest block">
                  SECURITY CLEARED
                </span>
                <span className="text-[9px] font-mono text-emerald-500 block">RZ® WEIGHBRIDGE KASARAGOD</span>
              </div>
            </div>

            {/* Pass Header */}
            <div className="space-y-1 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
                  RZ® MINETRIX QUARRY GATE PASS
                </span>
              </div>
              <h3 className="text-xl font-black text-white">MINERAL TRANSIT CLEARANCE SLIP</h3>
              <p className="text-xs text-slate-400">
                Department of Mining & Geology (DMG) Transport Authorization Token
              </p>
            </div>

            {/* Pass Fields Grid (Section 13) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Gate Pass No</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{selectedPass.gatePassNumber}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Load Reference</span>
                <span className="font-mono font-bold text-white text-sm">{selectedPass.loadNumber}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Quarry Pit</span>
                <span className="font-bold text-white truncate block">{selectedPass.quarryName}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Vehicle Registration</span>
                <span className="font-mono font-bold text-white text-sm">{selectedPass.vehicleNumber}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Driver Name</span>
                <span className="font-bold text-white">{selectedPass.driverName}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Time of Departure</span>
                <span className="font-mono font-bold text-emerald-400">{selectedPass.timeOut}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Material Extracted</span>
                <span className="font-bold text-amber-300">{selectedPass.material}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Net Quantity</span>
                <span className="font-mono font-black text-white text-sm">
                  {selectedPass.quantity} {selectedPass.unit}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Destination Delivery</span>
                <span className="font-medium text-white truncate block">{selectedPass.destination}</span>
              </div>
            </div>

            {/* QR Code & Security Officer Authorization */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white p-2 flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-950" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                    DMG E-Permit Digital Barcode
                  </span>
                  <p className="text-xs text-slate-300">
                    Scan via Kerala/Karnataka Mining & Geology Enforcement App to verify mineral royalty transit legitimacy.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Security In-Charge</span>
                <span className="text-xs font-bold text-white">{selectedPass.securityOfficer}</span>
                <div className="text-[10px] text-emerald-400 font-mono">Digital Signature Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
