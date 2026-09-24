import React, { useState } from 'react';
import {
  DollarSign,
  UserCheck,
  Truck,
  Layers,
  Printer,
  Download,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Eye,
  Calendar,
  Building2
} from 'lucide-react';
import {
  StaffSalaryItem,
  StaffAdvanceItem,
  TripAccountItem,
  VehicleOwnerItem,
  LandOwnerItem
} from '../types';
import {
  MOCK_STAFF_SALARIES,
  MOCK_STAFF_ADVANCES,
  MOCK_TRIP_ACCOUNTS,
  MOCK_VEHICLE_OWNERS,
  MOCK_LAND_OWNERS
} from '../financeMockData';

// =========================================================================
// 1. STAFF SALARY VIEW (Payroll Pipeline & Salary Slip Engine)
// =========================================================================
export const StaffSalaryView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [salaries, setSalaries] = useState<StaffSalaryItem[]>(MOCK_STAFF_SALARIES);
  const [selectedStaff, setSelectedStaff] = useState<StaffSalaryItem | null>(null);

  const totalPayroll = salaries.reduce((acc, s) => acc + s.netSalary, 0);

  const handleDisburseAll = () => {
    setSalaries((prev) => prev.map((s) => ({ ...s, status: 'PAID' })));
    onToast(`Successfully initiated batch salary disbursement for ${salaries.length} employees (₹${totalPayroll.toLocaleString('en-IN')})`);
  };

  return (
    <div className="space-y-6">
      {/* 10-Step Payroll Pipeline Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            10-Stage Enterprise Payroll Pipeline Engine
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">Auto-Synced with Biometrics</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-mono font-bold scrollbar-thin">
          {[
            '1. Attendance',
            '2. Working Days',
            '3. Salary Calc',
            '4. Overtime',
            '5. Batta / Allowance',
            '6. Advance Deduction',
            '7. Other Deduction',
            '8. Net Salary',
            '9. Bank Batch Pay',
            '10. Salary Slip'
          ].map((stage, idx) => (
            <React.Fragment key={stage}>
              <div className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 whitespace-nowrap">
                {stage}
              </div>
              {idx < 9 && <ArrowRight className="w-3 h-3 text-slate-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white">
            Staff Payroll Register &bull; March 2026 Cycle
          </span>
          <span className="text-xs font-mono font-black text-amber-400">
            Total Net: ₹{totalPayroll.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Exported Monthly Payroll Sheet')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={handleDisburseAll}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-emerald-500/20"
          >
            Disburse All Staff Salaries
          </button>
        </div>
      </div>

      {/* Salary Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Designation</th>
                <th className="py-3 px-4 text-center">Days (Att/Work)</th>
                <th className="py-3 px-4 text-right">Basic</th>
                <th className="py-3 px-4 text-right">Overtime</th>
                <th className="py-3 px-4 text-right">Batta</th>
                <th className="py-3 px-4 text-right text-rose-400">Advance Ded.</th>
                <th className="py-3 px-4 text-right font-black text-emerald-400">Net Salary</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {salaries.map((s) => (
                <tr key={s.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-white text-xs">{s.employeeName}</div>
                    <div className="text-[10px] text-slate-400">{s.employeeId} &bull; {s.department}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{s.designation}</td>
                  <td className="py-3 px-4 text-center text-slate-300">
                    {s.attendanceDays}/{s.workingDays}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-200">
                    ₹{s.basicSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    +₹{s.overtime.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-cyan-400">
                    +₹{s.batta.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400">
                    -₹{s.advanceDeduction.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-amber-400 text-sm">
                    ₹{s.netSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        s.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : s.status === 'APPROVED'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-center">
                    <button
                      onClick={() => setSelectedStaff(s)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                    >
                      Salary Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Slip Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  RZ MINETRIX BOS &bull; Official Pay Slip
                </span>
                <h3 className="text-base font-bold text-white">{selectedStaff.employeeName}</h3>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedStaff.designation} &bull; {selectedStaff.employeeId}
                </span>
              </div>
              <button
                onClick={() => setSelectedStaff(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Basic Wage:</span>
                  <span className="text-white">₹{selectedStaff.basicSalary.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Overtime Pay:</span>
                  <span className="text-emerald-400">+₹{selectedStaff.overtime.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Duty Batta &amp; Travel:</span>
                  <span className="text-cyan-400">+₹{selectedStaff.batta.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Staff Loan / Advance Deduction:</span>
                  <span className="text-rose-400">-₹{selectedStaff.advanceDeduction.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Statutory &amp; Other Deductions:</span>
                  <span className="text-rose-400">-₹{selectedStaff.otherDeduction.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                  <span className="text-slate-200">Net Take-Home Salary:</span>
                  <span className="text-amber-400 font-black">₹{selectedStaff.netSalary.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onOpenPrintModal?.(`Salary Pay Slip: ${selectedStaff.employeeName}`, selectedStaff)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. STAFF ADVANCES VIEW (Staff Loans, Recoveries, Balances)
// =========================================================================
export const StaffAdvancesView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [advances, setAdvances] = useState<StaffAdvanceItem[]>(MOCK_STAFF_ADVANCES);
  const [isNewAdvanceOpen, setIsNewAdvanceOpen] = useState(false);
  const [nameInput, setNameInput] = useState('Bijumon V.');
  const [amountInput, setAmountInput] = useState('10000');
  const [reasonInput, setReasonInput] = useState('Home repair assistance');

  const totalOutstandingAdvances = advances.reduce((acc, a) => acc + a.balance, 0);

  const handleCreateAdvance = () => {
    const amt = parseFloat(amountInput) || 0;
    const newAdv: StaffAdvanceItem = {
      id: `ADV-${Date.now()}`,
      staffName: nameInput,
      employeeId: 'EMP-003',
      advanceDate: new Date().toISOString().slice(0, 10),
      advanceAmount: amt,
      recovered: 0,
      balance: amt,
      status: 'ACTIVE',
      reason: reasonInput
    };
    setAdvances([newAdv, ...advances]);
    setIsNewAdvanceOpen(false);
    onToast(`Issued new staff advance of ₹${amt.toLocaleString('en-IN')} to ${nameInput}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Outstanding Advances</span>
          <div className="text-xl font-black text-yellow-400 mt-1">₹{totalOutstandingAdvances.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Deducted monthly from payroll</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Recovered This Month</span>
          <div className="text-xl font-black text-emerald-400 mt-1">₹27,000</div>
          <span className="text-[10px] text-slate-500">Auto-deducted in cycle</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Staff Borrowers</span>
          <div className="text-xl font-black text-slate-200 mt-1">{advances.filter(a => a.balance > 0).length} Employees</div>
          <span className="text-[10px] text-slate-500">Zero interest employee welfare</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <span className="text-xs font-bold text-white">Staff Advance &amp; Recovery Ledger</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsNewAdvanceOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Issue Staff Advance</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Staff Name</th>
                <th className="py-3 px-4">Advance Date</th>
                <th className="py-3 px-4">Purpose / Reason</th>
                <th className="py-3 px-4 text-right">Advance Amount</th>
                <th className="py-3 px-4 text-right">Recovered</th>
                <th className="py-3 px-4 text-right font-black">Balance Dues</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {advances.map((a) => (
                <tr key={a.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-white text-xs">{a.staffName}</div>
                    <div className="text-[10px] text-slate-400">{a.employeeId}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{a.advanceDate}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans max-w-[200px] truncate">{a.reason}</td>
                  <td className="py-3 px-4 text-right text-slate-200">₹{a.advanceAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-emerald-400 font-bold">₹{a.recovered.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right font-black text-rose-400 text-sm">₹{a.balance.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        a.status === 'RECOVERED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : a.status === 'PARTIAL'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-center">
                    <button
                      onClick={() => onOpenPrintModal?.(`Staff Advance Ledger: ${a.staffName}`, a)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                    >
                      Statement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Advance Modal */}
      {isNewAdvanceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Disburse New Staff Advance</h3>
              <button
                onClick={() => setIsNewAdvanceOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Employee</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Advance Amount (₹)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Purpose / Reason</label>
                <input
                  type="text"
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsNewAdvanceOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdvance}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black cursor-pointer shadow-md shadow-amber-500/20"
              >
                Disburse Advance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 3. TRIP ACCOUNTS VIEW (Vehicle Management Integration & Net Contribution)
// =========================================================================
export const TripAccountsView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [trips, setTrips] = useState<TripAccountItem[]>(MOCK_TRIP_ACCOUNTS);

  const totalTripIncome = trips.reduce((acc, t) => acc + t.tripIncome, 0);
  const totalTripExpenses = trips.reduce(
    (acc, t) => acc + t.fuelExpense + t.tollExpense + t.battaExpense + t.loadingExpense + t.otherExpense,
    0
  );
  const totalNetContribution = totalTripIncome - totalTripExpenses;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>Trip Accounts &amp; Fleet Logistics P&amp;L Integration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Connected to RZ Fleet Platform: Real-time calculation of fuel, tolls, batta, loading costs, and net trip contribution.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">TOTAL HAULAGE REVENUE</span>
            <span className="text-emerald-400 font-black">₹{totalTripIncome.toLocaleString('en-IN')}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">NET TRIP CONTRIBUTION</span>
            <span className="text-amber-400 font-black">₹{totalNetContribution.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Trip # &amp; Date</th>
                <th className="py-3 px-4">Vehicle &amp; Driver</th>
                <th className="py-3 px-4">Customer &amp; Route</th>
                <th className="py-3 px-4">Load Qty</th>
                <th className="py-3 px-4 text-right">Income</th>
                <th className="py-3 px-4 text-right">Fuel</th>
                <th className="py-3 px-4 text-right">Toll</th>
                <th className="py-3 px-4 text-right">Batta</th>
                <th className="py-3 px-4 text-right">Loading</th>
                <th className="py-3 px-4 text-right font-black text-amber-400">Net Contrib.</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {trips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-amber-400">{t.tripNo}</div>
                    <div className="text-[10px] text-slate-400">{t.date}</div>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-white text-xs">{t.vehicleNo}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{t.driverName}</div>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-slate-200 text-xs">{t.customerName}</div>
                    <div className="text-[10px] text-slate-400">{t.pickup} &rarr; {t.destination}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{t.loadQty}</td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    ₹{t.tripIncome.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-400">₹{t.fuelExpense.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-slate-300">₹{t.tollExpense.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-slate-300">₹{t.battaExpense.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right text-slate-300">₹{t.loadingExpense.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-right font-black text-amber-400 text-sm">
                    ₹{t.netContribution.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans text-center">
                    <button
                      onClick={() => onOpenPrintModal?.(`Trip Settlement Sheet: ${t.tripNo}`, t)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 4. VEHICLE OWNER ACCOUNTS VIEW (Multi-Owner Split: e.g. Owner B 60%, Owner E 40%)
// =========================================================================
export const VehicleOwnerAccountsView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [vehicles, setVehicles] = useState<VehicleOwnerItem[]>(MOCK_VEHICLE_OWNERS);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-cyan-400" />
            <span>Vehicle Multi-Owner Profit &amp; Loss Settlement Hub</span>
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
            MULTI-OWNER ALLOCATION
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Supports fractional syndicates where single tippers or haulage fleets are owned across multiple stakeholders (e.g. Vehicle V002: Owner B - 60%, Owner E - 40%).
        </p>
      </div>

      <div className="space-y-4">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-base font-black text-amber-400 font-mono mr-2">{v.vehicleNo}</span>
                <span className="text-xs text-slate-300 font-bold">{v.vehicleModel}</span>
                <span className="text-xs text-slate-500 ml-2">&bull; Period: {v.period}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">GROSS INCOME</span>
                  <span className="text-emerald-400 font-bold">₹{v.grossIncome.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">EXPENSES</span>
                  <span className="text-rose-400 font-bold">-₹{v.eligibleExpenses.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">NET DISTRIBUTABLE</span>
                  <span className="text-cyan-400 font-black">₹{v.netAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Individual Owners Split Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {v.owners.map((o, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs flex justify-between items-center"
                >
                  <div>
                    <div className="font-bold text-white text-xs font-sans">{o.ownerName}</div>
                    <div className="text-[11px] text-slate-400">Equity Share: <strong className="text-cyan-400">{o.ownershipPercent}%</strong></div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">Share: ₹{o.ownerShare.toLocaleString('en-IN')}</div>
                    <div className="text-[11px] text-rose-400">Bal Due: ₹{o.balance.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-slate-800/80">
              <button
                onClick={() => onOpenPrintModal?.(`Vehicle Settlement Statement: ${v.vehicleNo}`, v)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Settlement Sheet</span>
              </button>
              <button
                onClick={() => onToast(`Executed payout settlement for vehicle ${v.vehicleNo}`)}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer"
              >
                Settle Owner Balances
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =========================================================================
// 5. LAND OWNER ACCOUNTS VIEW (4 Concession Models: Fixed, Return, Per-Load, Hybrid)
// =========================================================================
export const LandOwnerAccountsView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [landOwners, setLandOwners] = useState<LandOwnerItem[]>(MOCK_LAND_OWNERS);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <span>Quarry Land Owner Royalty &amp; Concession Management</span>
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
            4 AGREEMENT MODELS
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Connected to RZ Quarry Land Management: Evaluates royalty dues across 4 industry models: <strong>Fixed land purchase</strong>, <strong>Mining &amp; return</strong>, <strong>Per-load payment</strong>, and <strong>Hybrid agreements</strong>.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Land Owner &amp; Parcel</th>
                <th className="py-3 px-4">Agreement Model</th>
                <th className="py-3 px-4">Working Area</th>
                <th className="py-3 px-4 text-center">Load Count</th>
                <th className="py-3 px-4 text-right">Rate / Load</th>
                <th className="py-3 px-4 text-right">Advance Paid</th>
                <th className="py-3 px-4 text-right">Payments</th>
                <th className="py-3 px-4 text-right font-black text-rose-400">Balance Dues</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {landOwners.map((l) => (
                <tr key={l.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-white text-xs">{l.landOwnerName}</div>
                    <div className="text-[10px] text-slate-400">{l.parcel} &bull; {l.surveyNo}</div>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {l.agreementType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{l.workingArea}</td>
                  <td className="py-3 px-4 text-center font-bold text-white">{l.loadCount} loads</td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {l.ratePerLoad > 0 ? `₹${l.ratePerLoad}` : 'Lump-sum'}
                  </td>
                  <td className="py-3 px-4 text-right text-orange-400">
                    ₹{l.advance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    ₹{l.payments.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-rose-400 text-sm">
                    ₹{l.balance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        l.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : l.status === 'CLOSED'
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-center">
                    <button
                      onClick={() => onOpenPrintModal?.(`Land Royalty Statement: ${l.landOwnerName}`, l)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                    >
                      Statement
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
