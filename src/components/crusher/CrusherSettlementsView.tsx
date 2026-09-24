import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Building2,
  FileText,
  Printer,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { CrusherPartnerSettlement } from '../../data/crusherStudioData';

interface CrusherSettlementsViewProps {
  settlements: CrusherPartnerSettlement[];
  onNavigatePage: (page: string) => void;
}

export const CrusherSettlementsView: React.FC<CrusherSettlementsViewProps> = ({
  settlements,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSettlement, setSelectedSettlement] = useState<CrusherPartnerSettlement | null>(
    settlements[0] || null
  );

  const filtered = settlements.filter(s =>
    s.settlementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.plantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDistributed = settlements.reduce((acc, s) => acc + s.netSettlementAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                PROFIT SHARING & DIVIDEND CLEARANCE
              </span>
              <h2 className="text-xl font-black text-white">Crusher Partner Profit Settlements</h2>
            </div>
          </div>
          <button
            onClick={() => alert('New Partner Settlement calculated.')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Run Monthly Settlement</span>
          </button>
        </div>

        {/* Legal Independence Rule Notice */}
        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs flex items-center gap-2.5 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Crusher Partnership Independence:</strong> Crusher profit distribution calculations are strictly isolated from Quarry P&L accounts. Partners receive distinct dividend vouchers for each business vertical.
          </span>
        </div>

        {/* Search */}
        <div className="relative pt-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by settlement number, partner name, or plant..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid: Settlements Table + Formula Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl overflow-x-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Settlement Dispatches</h3>
            <span className="text-[10px] font-mono text-cyan-400">{filtered.length} Statements</span>
          </div>

          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-2.5">Settlement No</th>
                <th className="p-2.5">Partner</th>
                <th className="p-2.5">Period</th>
                <th className="p-2.5">Profit Share</th>
                <th className="p-2.5">Net Distributable</th>
                <th className="p-2.5">Net Payable</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map(st => (
                <tr
                  key={st.id}
                  onClick={() => setSelectedSettlement(st)}
                  className={`hover:bg-slate-800/40 cursor-pointer transition ${
                    selectedSettlement?.id === st.id ? 'bg-cyan-500/10' : ''
                  }`}
                >
                  <td className="p-2.5 font-mono font-bold text-cyan-400">{st.settlementNumber}</td>
                  <td className="p-2.5 font-bold text-white">{st.partnerName}</td>
                  <td className="p-2.5 font-mono text-slate-400">{st.period}</td>
                  <td className="p-2.5 font-mono text-cyan-400 font-bold">{st.profitSharePercent}%</td>
                  <td className="p-2.5 font-mono text-slate-300">₹{(st.netDistributableProfit / 100000).toFixed(1)} L</td>
                  <td className="p-2.5 font-mono font-black text-emerald-400">₹{st.netSettlementAmount.toLocaleString()}</td>
                  <td className="p-2.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        st.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {st.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Waterfall Calculation Card */}
        {selectedSettlement && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">PROFIT WATERFALL</span>
                <h3 className="text-sm font-bold text-white">{selectedSettlement.settlementNumber}</h3>
              </div>
              <button
                onClick={() => alert(`Printing Partner Settlement Statement ${selectedSettlement.settlementNumber}...`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Print Statement"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs font-mono">
              <div className="text-slate-400 flex justify-between">
                <span>PLANT REVENUE:</span>
                <span className="text-white font-bold">₹{selectedSettlement.plantRevenue.toLocaleString()}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>- BOULDER PURCHASE:</span>
                <span className="text-red-400">-₹{selectedSettlement.rawMaterialCost.toLocaleString()}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>- OPERATING EXPENSES:</span>
                <span className="text-red-400">-₹{selectedSettlement.operatingExpenses.toLocaleString()}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>- MACHINERY MAINT:</span>
                <span className="text-red-400">-₹{selectedSettlement.maintenanceCost.toLocaleString()}</span>
              </div>
              <div className="text-slate-400 flex justify-between">
                <span>- RETAINED RESERVES:</span>
                <span className="text-amber-400">-₹{selectedSettlement.reserveFund.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-slate-900 flex justify-between font-bold text-cyan-400">
                <span>NET DISTRIBUTABLE:</span>
                <span>₹{selectedSettlement.netDistributableProfit.toLocaleString()}</span>
              </div>

              <div className="pt-2 border-t border-slate-900 space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>PARTNER SHARE ({selectedSettlement.profitSharePercent}%):</span>
                  <span className="text-white font-bold">₹{selectedSettlement.partnerShareAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>- LESS ADVANCE DRAWINGS:</span>
                  <span className="text-amber-400">-₹{selectedSettlement.advanceDrawings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-emerald-400 pt-1 border-t border-slate-900">
                  <span>NET DIVIDEND PAYABLE:</span>
                  <span>₹{selectedSettlement.netSettlementAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[11px] text-emerald-300">
              Paid via {selectedSettlement.paymentMode} ({selectedSettlement.paymentRef}) on {selectedSettlement.paidDate}.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
