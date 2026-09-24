import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Printer,
  CheckCircle2,
  Calendar,
  Building2,
  Truck,
  ShieldCheck,
  QrCode,
  Sparkles
} from 'lucide-react';
import { CrusherGatePass } from '../../data/crusherStudioData';

interface CrusherGatePassViewProps {
  gatePasses: CrusherGatePass[];
  onNavigatePage: (page: string) => void;
}

export const CrusherGatePassView: React.FC<CrusherGatePassViewProps> = ({
  gatePasses,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPass, setSelectedPass] = useState<CrusherGatePass | null>(gatePasses[0] || null);

  const filtered = gatePasses.filter(g =>
    g.passNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                DIGITAL DISPATCH SLIP & POLICE/MINING CLEARANCE
              </span>
              <h2 className="text-xl font-black text-white">Crusher Outward Gate Passes</h2>
            </div>
          </div>
          <button
            onClick={() => alert('New Gate Pass generated.')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Issue New Gate Pass</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by gate pass number, customer, vehicle, or product..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid: Passes Table + Digital Pass Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Authorized Outward Gate Passes</h3>
            <span className="text-[10px] font-mono text-cyan-400">{filtered.length} Gate Passes</span>
          </div>

          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-2.5">Pass No</th>
                <th className="p-2.5">Customer</th>
                <th className="p-2.5">Vehicle</th>
                <th className="p-2.5">Product</th>
                <th className="p-2.5">Net Tonnage</th>
                <th className="p-2.5">Status</th>
                <th className="p-2.5 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(pass => (
                <tr
                  key={pass.id}
                  onClick={() => setSelectedPass(pass)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition ${
                    selectedPass?.id === pass.id ? 'bg-cyan-500/10' : ''
                  }`}
                >
                  <td className="p-2.5 font-mono font-bold text-cyan-400">{pass.passNumber}</td>
                  <td className="p-2.5">
                    <div className="font-bold text-white truncate max-w-xs">{pass.customerName}</div>
                    <div className="text-[10px] text-slate-500">{pass.date} &bull; {pass.time}</div>
                  </td>
                  <td className="p-2.5 font-mono text-white">{pass.vehicleNumber}</td>
                  <td className="p-2.5 text-slate-300">{pass.productName}</td>
                  <td className="p-2.5 font-mono font-black text-cyan-400">{pass.netQuantityTons} MT</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-bold">
                      {pass.status}
                    </span>
                  </td>
                  <td className="p-2.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPass(pass);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                    >
                      Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Digital Pass Preview Card */}
        {selectedPass && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">OUTWARD DISPATCH PASS</span>
                <h3 className="text-sm font-bold text-white">{selectedPass.passNumber}</h3>
              </div>
              <button
                onClick={() => alert(`Printing Gate Pass ${selectedPass.passNumber}...`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Print Gate Pass"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs font-mono">
              <div className="text-center pb-2 border-b border-slate-900">
                <span className="text-xs font-bold text-white block">RZ® MINETRIX CRUSHER DISPATCH PASS</span>
                <span className="text-[10px] text-emerald-400 font-bold">SECURITY CLEARANCE STAMPED</span>
              </div>

              <div className="space-y-1.5 text-slate-400">
                <div className="flex justify-between">
                  <span>PASS REF:</span>
                  <span className="text-white font-bold">{selectedPass.passNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DISPATCH DATE:</span>
                  <span className="text-white">{selectedPass.date} {selectedPass.time}</span>
                </div>
                <div className="flex justify-between">
                  <span>CUSTOMER:</span>
                  <span className="text-cyan-400 font-bold truncate max-w-[150px]">{selectedPass.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>VEHICLE REG:</span>
                  <span className="text-white font-bold">{selectedPass.vehicleNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>DRIVER:</span>
                  <span className="text-slate-300">{selectedPass.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span>AGGREGATE:</span>
                  <span className="text-amber-400 font-bold">{selectedPass.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span>NET WEIGHT:</span>
                  <span className="text-white font-bold text-sm">{selectedPass.netQuantityTons} MT</span>
                </div>
                <div className="flex justify-between">
                  <span>WEIGH SLIP:</span>
                  <span className="text-slate-300">{selectedPass.weighbridgeSlipNumber}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div className="text-[10px] leading-tight">
                    <span className="text-emerald-400 font-bold block">{selectedPass.securityStamp}</span>
                    <span>Officer: {selectedPass.issuedBy}</span>
                  </div>
                </div>
                <div className="p-1 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white text-[9px] font-bold">
                    QR
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
