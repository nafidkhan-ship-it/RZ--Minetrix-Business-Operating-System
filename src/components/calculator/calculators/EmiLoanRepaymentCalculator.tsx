import React, { useState } from 'react';
import { Coins, Calendar, FileText, Printer, Copy, Check, RotateCcw, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  initialSubTab?: 'emi' | 'reverse' | 'commercial' | 'prepayment';
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
  onOpenPrintModal?: (details: any) => void;
}

export const EmiLoanRepaymentCalculator: React.FC<Props> = ({
  initialSubTab = 'emi',
  onRecordHistory,
  onOpenPrintModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'emi' | 'reverse' | 'commercial' | 'prepayment'>(initialSubTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Standard EMI State
  const [loanPrincipal, setLoanPrincipal] = useState<string>('2500000');
  const [loanInterestRate, setLoanInterestRate] = useState<string>('10.5');
  const [tenureYears, setTenureYears] = useState<string>('5');
  const [tenureUnit, setTenureUnit] = useState<'years' | 'months'>('years');
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const principal = parseFloat(loanPrincipal) || 0;
  const annualRate = parseFloat(loanInterestRate) || 0;
  const rawTenure = parseFloat(tenureYears) || 0;
  const totalMonths = tenureUnit === 'years' ? rawTenure * 12 : rawTenure;

  // Monthly interest rate
  const monthlyRate = annualRate / 12 / 100;
  const emiNumerator = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths);
  const emiDenominator = Math.pow(1 + monthlyRate, totalMonths) - 1;
  const monthlyEmi = totalMonths > 0 && emiDenominator !== 0 ? Math.round(emiNumerator / emiDenominator) : 0;
  const totalRepayment = monthlyEmi * totalMonths;
  const totalInterest = Math.max(0, totalRepayment - principal);
  const principalSharePct = totalRepayment > 0 ? (principal / totalRepayment) * 100 : 0;
  const interestSharePct = totalRepayment > 0 ? (totalInterest / totalRepayment) * 100 : 0;

  // 2. Reverse EMI State (Affordability)
  const [targetEmi, setTargetEmi] = useState<string>('40000');
  const [revRate, setRevRate] = useState<string>('10.0');
  const [revTenureYears, setRevTenureYears] = useState<string>('5');

  const budgetEmi = parseFloat(targetEmi) || 0;
  const revAnnualRate = parseFloat(revRate) || 0;
  const revMonths = (parseFloat(revTenureYears) || 1) * 12;
  const revMonthlyRate = revAnnualRate / 12 / 100;

  const maxAffordablePrincipal = revMonthlyRate > 0 && revMonths > 0
    ? Math.round((budgetEmi * (Math.pow(1 + revMonthlyRate, revMonths) - 1)) / (revMonthlyRate * Math.pow(1 + revMonthlyRate, revMonths)))
    : 0;

  // 3. Commercial Vehicle / Tipper Equipment Loan
  const [assetPrice, setAssetPrice] = useState<string>('4200000');
  const [downPaymentAmount, setDownPaymentAmount] = useState<string>('840000'); // 20%
  const [procFeePct, setProcFeePct] = useState<string>('1.5');
  const [commRate, setCommRate] = useState<string>('9.75');
  const [commTenureYears, setCommTenureYears] = useState<string>('4');

  const assetVal = parseFloat(assetPrice) || 0;
  const downPay = parseFloat(downPaymentAmount) || 0;
  const feeRate = parseFloat(procFeePct) || 0;
  const netCommercialLoan = Math.max(0, assetVal - downPay);
  const processingFee = (netCommercialLoan * feeRate) / 100;
  const upfrontCashRequired = downPay + processingFee;

  const commMonthlyRate = (parseFloat(commRate) || 0) / 12 / 100;
  const commTotalMonths = (parseFloat(commTenureYears) || 1) * 12;
  const commEmiNum = netCommercialLoan * commMonthlyRate * Math.pow(1 + commMonthlyRate, commTotalMonths);
  const commEmiDen = Math.pow(1 + commMonthlyRate, commTotalMonths) - 1;
  const commMonthlyEmi = commTotalMonths > 0 && commEmiDen !== 0 ? Math.round(commEmiNum / commEmiDen) : 0;

  // 4. Prepayment / Part Payment
  const [existingPrincipal, setExistingPrincipal] = useState<string>('1800000');
  const [existingRate, setExistingRate] = useState<string>('10.5');
  const [remMonths, setRemMonths] = useState<string>('48');
  const [partPaymentSum, setPartPaymentSum] = useState<string>('300000');

  const currPrin = parseFloat(existingPrincipal) || 0;
  const curRate = parseFloat(existingRate) || 0;
  const curMonths = parseFloat(remMonths) || 0;
  const lumpSum = parseFloat(partPaymentSum) || 0;
  const curMonthlyRate = curRate / 12 / 100;

  // Baseline without prepayment
  const baselineEmi = curMonthlyRate > 0 && curMonths > 0
    ? Math.round((currPrin * curMonthlyRate * Math.pow(1 + curMonthlyRate, curMonths)) / (Math.pow(1 + curMonthlyRate, curMonths) - 1))
    : 0;
  const baselineTotalInterest = (baselineEmi * curMonths) - currPrin;

  // Option A: Reduce EMI (keep tenure)
  const newPrin = Math.max(0, currPrin - lumpSum);
  const reducedEmi = curMonthlyRate > 0 && curMonths > 0
    ? Math.round((newPrin * curMonthlyRate * Math.pow(1 + curMonthlyRate, curMonths)) / (Math.pow(1 + curMonthlyRate, curMonths) - 1))
    : 0;
  const interestWithReducedEmi = (reducedEmi * curMonths) - newPrin;
  const interestSavedOptionA = Math.max(0, baselineTotalInterest - interestWithReducedEmi);

  // Option B: Reduce Tenure (keep EMI same)
  let newTenureMonths = 0;
  if (curMonthlyRate > 0 && baselineEmi > newPrin * curMonthlyRate) {
    newTenureMonths = Math.ceil(
      Math.log(baselineEmi / (baselineEmi - newPrin * curMonthlyRate)) / Math.log(1 + curMonthlyRate)
    );
  }
  const interestWithReducedTenure = (baselineEmi * newTenureMonths) - newPrin;
  const interestSavedOptionB = Math.max(0, baselineTotalInterest - interestWithReducedTenure);
  const monthsSaved = Math.max(0, curMonths - newTenureMonths);

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit overflow-x-auto scrollbar-none">
        {[
          { id: 'emi', label: 'Loan EMI & Schedule' },
          { id: 'reverse', label: 'Reverse EMI (Affordability)' },
          { id: 'commercial', label: 'Equipment & Vehicle Loan' },
          { id: 'prepayment', label: 'Part-Payment Savings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. STANDARD EMI TAB */}
      {activeSubTab === 'emi' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
              <div>
                <h3 className="font-bold text-white text-base">Loan &amp; Mortgage Parameters</h3>
                <p className="text-xs text-slate-400 mt-0.5">Simulate commercial term loans, machinery leases and personal credit</p>
              </div>

              {/* Principal Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <span>Loan Amount (₹ Principal)</span>
                  <span className="font-mono text-amber-400">₹{principal.toLocaleString()}</span>
                </div>
                <input
                  type="number"
                  value={loanPrincipal}
                  onChange={e => setLoanPrincipal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  placeholder="2500000"
                />
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[500000, 1000000, 2500000, 5000000, 10000000].map(val => (
                    <button
                      key={val}
                      onClick={() => setLoanPrincipal(String(val))}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                    >
                      ₹{(val / 100000).toFixed(0)}L
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                    <span>Interest Rate (% p.a.)</span>
                    <span className="font-mono text-amber-400">{annualRate}%</span>
                  </div>
                  <input
                    type="number"
                    step="0.05"
                    value={loanInterestRate}
                    onChange={e => setLoanInterestRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="10.5"
                  />
                </div>

                {/* Tenure */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                    <span>Loan Tenure</span>
                    <div className="flex items-center gap-1 text-[10px]">
                      <button
                        onClick={() => setTenureUnit('years')}
                        className={`px-1.5 py-0.5 rounded ${tenureUnit === 'years' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-500'}`}
                      >
                        Yrs
                      </button>
                      <button
                        onClick={() => setTenureUnit('months')}
                        className={`px-1.5 py-0.5 rounded ${tenureUnit === 'months' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-500'}`}
                      >
                        Mos
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    value={tenureYears}
                    onChange={e => setTenureYears(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder={tenureUnit === 'years' ? '5' : '60'}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{showSchedule ? 'Hide Amortization Table' : 'View Full Monthly Schedule'}</span>
                </button>

                <button
                  onClick={() => {
                    if (onRecordHistory) {
                      onRecordHistory({
                        calculatorId: 'emi-calculator',
                        calculatorName: 'Loan EMI Calculator',
                        inputs: { principal, rate: `${annualRate}%`, tenure: `${totalMonths} months` },
                        resultSummary: `Monthly EMI: ₹${monthlyEmi.toLocaleString()} | Total Interest: ₹${totalInterest.toLocaleString()}`
                      });
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Save to History
                </button>
              </div>
            </div>

            {/* EMI Summary Card */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Repayment Projection
                </span>

                {/* Monthly Installment */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                  <div className="text-xs text-slate-400">Monthly Equated Installment (EMI)</div>
                  <div className="text-4xl font-black text-amber-400 font-mono">
                    ₹{monthlyEmi.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    Tenure: {totalMonths} Months ({tenureUnit === 'years' ? `${rawTenure} Years` : `${(totalMonths / 12).toFixed(1)} Years`})
                  </div>
                </div>

                {/* Principal vs Interest Distribution Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Principal: {principalSharePct.toFixed(1)}%</span>
                    <span>Interest: {interestSharePct.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex">
                    <div style={{ width: `${principalSharePct}%` }} className="bg-amber-400 h-full" />
                    <div style={{ width: `${interestSharePct}%` }} className="bg-rose-500 h-full" />
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Total Borrowed:</span>
                    <span className="text-white font-bold">₹{principal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Total Interest Outflow:</span>
                    <span className="text-rose-400 font-bold">₹{totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white text-sm">
                    <span>Total Repayment:</span>
                    <span className="text-emerald-400">₹{totalRepayment.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(`EMI: ₹${monthlyEmi}/mo | Total Repayment: ₹${totalRepayment} | Interest: ₹${totalInterest}`, 'emi')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {copiedKey === 'emi' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'emi' ? 'Copied' : 'Copy Quote'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition cursor-pointer"
                  title="Print Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Amortization Schedule Table */}
          {showSchedule && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">Full Amortization Schedule</h4>
                  <p className="text-xs text-slate-500">First 24 months detailed ledger</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Schedule</span>
                </button>
              </div>

              <div className="overflow-x-auto scrollbar-none max-h-96">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[11px] uppercase text-slate-500 border-b border-slate-800 bg-slate-950/80 sticky top-0">
                    <tr>
                      <th className="py-2.5 px-3">Month</th>
                      <th className="py-2.5 px-3">Opening (₹)</th>
                      <th className="py-2.5 px-3">EMI (₹)</th>
                      <th className="py-2.5 px-3">Principal (₹)</th>
                      <th className="py-2.5 px-3">Interest (₹)</th>
                      <th className="py-2.5 px-3">Closing (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const rows = [];
                      let curBal = principal;
                      const limit = Math.min(totalMonths, 36);
                      for (let m = 1; m <= limit; m++) {
                        const intPaid = Math.round(curBal * monthlyRate);
                        const prinPaid = Math.round(monthlyEmi - intPaid);
                        const closing = Math.max(0, curBal - prinPaid);
                        rows.push(
                          <tr key={m} className="border-b border-slate-800/40 text-slate-300 hover:bg-slate-950/40">
                            <td className="py-2 px-3 font-bold text-amber-400">#{m}</td>
                            <td className="py-2 px-3">₹{curBal.toLocaleString()}</td>
                            <td className="py-2 px-3 text-emerald-400 font-bold">₹{monthlyEmi.toLocaleString()}</td>
                            <td className="py-2 px-3 text-cyan-400">₹{prinPaid.toLocaleString()}</td>
                            <td className="py-2 px-3 text-rose-400">₹{intPaid.toLocaleString()}</td>
                            <td className="py-2 px-3 font-bold text-white">₹{closing.toLocaleString()}</td>
                          </tr>
                        );
                        curBal = closing;
                      }
                      return rows;
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. REVERSE EMI TAB */}
      {activeSubTab === 'reverse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="font-bold text-white text-base">Reverse EMI (Borrowing Capacity)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Calculate maximum loan principal from target monthly budget</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Affordable Monthly Budget (₹ / mo)</label>
                <input
                  type="number"
                  value={targetEmi}
                  onChange={e => setTargetEmi(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                  placeholder="40000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Offered Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    value={revRate}
                    onChange={e => setRevRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="10.0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Desired Tenure (Years)</label>
                  <input
                    type="number"
                    value={revTenureYears}
                    onChange={e => setRevTenureYears(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="5"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Maximum Eligible Principal
              </span>

              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Borrowing Power</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  ₹{maxAffordablePrincipal.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 font-semibold">
                  Supports ₹{budgetEmi.toLocaleString()}/mo over {revTenureYears} years
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Affordable Loan: ₹${maxAffordablePrincipal} for budget EMI ₹${budgetEmi}/mo`, 'rev')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'rev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'rev' ? 'Copied' : 'Copy Capacity Figure'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. COMMERCIAL EQUIPMENT & VEHICLE LOAN */}
      {activeSubTab === 'commercial' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Commercial Vehicle &amp; Machinery Loan</h3>
              <p className="text-xs text-slate-400 mt-0.5">Heavy tippers, excavators, wheel loaders &amp; crushers</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Asset On-Road / Invoice Price (₹)</label>
                <input
                  type="number"
                  value={assetPrice}
                  onChange={e => setAssetPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Down Payment / Equity (₹)</label>
                <input
                  type="number"
                  value={downPaymentAmount}
                  onChange={e => setDownPaymentAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bank Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  value={commRate}
                  onChange={e => setCommRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tenure (Years)</label>
                <input
                  type="number"
                  value={commTenureYears}
                  onChange={e => setCommTenureYears(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Bank Processing Fee (%)</label>
                <input
                  type="number"
                  value={procFeePct}
                  onChange={e => setProcFeePct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Financing Summary
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Monthly Commercial EMI</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  ₹{commMonthlyEmi.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500">
                  Net Disbursal: ₹{netCommercialLoan.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Down Payment:</span>
                  <span className="font-mono text-white font-bold">₹{downPay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Bank Processing Fee ({feeRate}%):</span>
                  <span className="font-mono text-rose-400 font-bold">₹{Math.round(processingFee).toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-white">
                  <span>Total Upfront Cash Needed:</span>
                  <span className="font-mono text-amber-400">₹{Math.round(upfrontCashRequired).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Vehicle Loan: Net ₹${netCommercialLoan} | EMI ₹${commMonthlyEmi}/mo | Upfront ₹${upfrontCashRequired}`, 'comm')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'comm' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'comm' ? 'Copied' : 'Copy Loan Structure'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. PREPAYMENT / PART PAYMENT */}
      {activeSubTab === 'prepayment' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Prepayment Strategy Simulator</h3>
              <p className="text-xs text-slate-400 mt-0.5">Model the impact of a lump-sum principal reduction</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Current Balance (₹)</label>
                <input
                  type="number"
                  value={existingPrincipal}
                  onChange={e => setExistingPrincipal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Interest Rate (% p.a.)</label>
                <input
                  type="number"
                  value={existingRate}
                  onChange={e => setExistingRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Remaining Months</label>
                <input
                  type="number"
                  value={remMonths}
                  onChange={e => setRemMonths(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Lump-Sum Prepayment (₹)</label>
                <input
                  type="number"
                  value={partPaymentSum}
                  onChange={e => setPartPaymentSum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs font-bold text-amber-400"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
              Current Installment: <strong className="text-white">₹{baselineEmi.toLocaleString()} / month</strong>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Comparison of 2 Prepayment Strategies
            </span>

            {/* Strategy 1: Reduce Tenure (Recommended) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-400">Strategy A: Keep EMI Same &rarr; Shorten Loan</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">HIGHEST SAVINGS</span>
              </div>
              <div className="text-2xl font-black text-white font-mono">
                Save ₹{Math.round(interestSavedOptionB).toLocaleString()} in Interest
              </div>
              <div className="text-xs text-slate-400">
                Loan finishes <strong className="text-white">{monthsSaved} months earlier</strong> ({newTenureMonths} months remaining instead of {curMonths})
              </div>
            </div>

            {/* Strategy 2: Reduce EMI */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="text-xs font-bold text-slate-300">Strategy B: Keep Tenure &rarr; Lower Monthly Burden</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                New EMI: ₹{reducedEmi.toLocaleString()} / mo
              </div>
              <div className="text-xs text-slate-400">
                Monthly relief of ₹{(baselineEmi - reducedEmi).toLocaleString()}/mo &bull; Total Interest Saved: ₹{Math.round(interestSavedOptionA).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
