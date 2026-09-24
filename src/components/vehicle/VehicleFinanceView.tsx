import React, { useState } from 'react';
import {
  TrendingUp,
  Search,
  Plus,
  Truck,
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Building
} from 'lucide-react';
import { Vehicle } from '../../data/vehicleStudioData';

interface VehicleFinanceViewProps {
  vehicles: Vehicle[];
  onOpenNewLoanModal?: () => void;
  onCreateOttTask?: (msg: string) => void;
}

export const VehicleFinanceView: React.FC<VehicleFinanceViewProps> = ({
  vehicles,
  onOpenNewLoanModal,
  onCreateOttTask
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const financedVehicles = vehicles.filter((v) => v.finance && v.finance.hasFinance);

  const filtered = financedVehicles.filter((v) => {
    const f = v.finance;
    return (
      v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.financeProvider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.loanAccountNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalOutstanding = financedVehicles.reduce(
    (acc, v) => acc + (v.finance.outstandingAmount || 0),
    0
  );
  const totalMonthlyEmi = financedVehicles.reduce(
    (acc, v) => acc + (v.finance.emiAmount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
              FLEET HYPOTHECATION &bull; {financedVehicles.length} FINANCED VEHICLES
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 font-bold border border-yellow-500/20">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Commercial Vehicle EMI & Bank Finance Tracker</h2>
          <p className="text-xs text-slate-400">
            Hypothecation contracts, monthly installments schedule, interest amortization and outstanding liabilities
          </p>
        </div>

        {onOpenNewLoanModal && (
          <button
            onClick={onOpenNewLoanModal}
            className="px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-yellow-500/20 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Finance Contract</span>
          </button>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Total Outstanding Principal</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            ₹{totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across {financedVehicles.length} financed assets</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Monthly Fleet EMI Obligation</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₹{totalMonthlyEmi.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-0.5">Automated NACH auto-debits</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <div className="text-xs text-slate-400">Next Due Installment</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            Oct 10, 2024
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">₹1,18,000 across 2 vehicles</div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-inner">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bank name, loan account #, vehicle number..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Financed Vehicles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((v) => {
          const f = v.finance;
          const paidPercentage = Math.min(100, Math.round((f.totalPaid / (f.loanAmount || 1)) * 100));

          return (
            <div
              key={v.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 font-mono font-bold flex items-center justify-center text-xs">
                    {v.vehicleCode}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{f.financeProvider}</h3>
                    <div className="text-[10px] text-slate-400 font-mono">
                      A/C: {f.loanAccountNumber} &bull; {v.vehicleNumber}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {f.status}
                </span>
              </div>

              {/* Ratios & Balances */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Loan Amount</span>
                  <div className="font-bold text-white mt-0.5">₹{f.loanAmount.toLocaleString()}</div>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Monthly EMI</span>
                  <div className="font-bold text-emerald-400 mt-0.5">₹{f.emiAmount.toLocaleString()}</div>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Paid so far</span>
                  <div className="font-bold text-cyan-400 mt-0.5">₹{f.totalPaid.toLocaleString()}</div>
                </div>

                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 text-[10px]">Outstanding</span>
                  <div className="font-bold text-amber-400 mt-0.5">₹{f.outstandingAmount.toLocaleString()}</div>
                </div>
              </div>

              {/* Amortization Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Repayment Progress:</span>
                  <span className="font-mono font-bold text-white">{paidPercentage}% Repaid</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-yellow-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${paidPercentage}%` }}
                  />
                </div>
              </div>

              {/* Contract terms footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <div>
                  Next Due: <strong className="text-white font-mono">{f.nextDueDate}</strong> &bull; {f.interestRate}% APR
                </div>

                {onCreateOttTask && (
                  <button
                    onClick={() => onCreateOttTask(`Verify EMI Payment for ${v.vehicleNumber} (${f.financeProvider})`)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] transition"
                  >
                    OTT Task
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
