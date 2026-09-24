import React, { useState } from 'react';
import { Coins, Copy, Check, RotateCcw, TrendingUp } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  initialSubTab?: 'simple' | 'compound' | 'reducing';
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

export const InterestCalculators: React.FC<Props> = ({
  initialSubTab = 'simple',
  onRecordHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'simple' | 'compound' | 'reducing'>(initialSubTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Simple Interest State
  const [siPrincipal, setSiPrincipal] = useState<string>('500000');
  const [siRate, setSiRate] = useState<string>('8.5');
  const [siTime, setSiTime] = useState<string>('3');
  const [siTimeUnit, setSiTimeUnit] = useState<'years' | 'months' | 'days'>('years');

  const pSI = parseFloat(siPrincipal) || 0;
  const rSI = parseFloat(siRate) || 0;
  const tRawSI = parseFloat(siTime) || 0;
  const tYearsSI = siTimeUnit === 'years' ? tRawSI : siTimeUnit === 'months' ? tRawSI / 12 : tRawSI / 365;

  const siInterest = (pSI * rSI * tYearsSI) / 100;
  const siTotalMaturity = pSI + siInterest;

  // 2. Compound Interest State
  const [ciPrincipal, setCiPrincipal] = useState<string>('1000000');
  const [ciRate, setCiRate] = useState<string>('9.0');
  const [ciTimeYears, setCiTimeYears] = useState<string>('5');
  const [ciFrequency, setCiFrequency] = useState<number>(4); // 1 = yearly, 2 = half-yearly, 4 = quarterly, 12 = monthly

  const pCI = parseFloat(ciPrincipal) || 0;
  const rCI = (parseFloat(ciRate) || 0) / 100;
  const tCI = parseFloat(ciTimeYears) || 0;
  const nCI = ciFrequency;

  // A = P * (1 + r/n)^(n*t)
  const ciMaturity = pCI > 0 && tCI > 0 ? pCI * Math.pow(1 + rCI / nCI, nCI * tCI) : pCI;
  const ciInterest = Math.max(0, ciMaturity - pCI);
  // Effective Annual Rate (EAR): (1 + r/n)^n - 1
  const effectiveAnnualRate = (Math.pow(1 + rCI / nCI, nCI) - 1) * 100;

  // 3. Reducing Interest State
  const [redPrincipal, setRedPrincipal] = useState<string>('1500000');
  const [redRate, setRedRate] = useState<string>('11.0');
  const [redMonths, setRedMonths] = useState<string>('36');

  const pRed = parseFloat(redPrincipal) || 0;
  const rRed = (parseFloat(redRate) || 0) / 12 / 100;
  const mRed = parseFloat(redMonths) || 0;
  const redEmiNum = pRed * rRed * Math.pow(1 + rRed, mRed);
  const redEmiDen = Math.pow(1 + rRed, mRed) - 1;
  const redEmi = mRed > 0 && redEmiDen !== 0 ? Math.round(redEmiNum / redEmiDen) : 0;
  const redTotalRepay = redEmi * mRed;
  const redTotalInterest = Math.max(0, redTotalRepay - pRed);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab('simple')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'simple'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Simple Interest (Flat)
        </button>
        <button
          onClick={() => setActiveSubTab('compound')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'compound'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Compound Interest (CAGR)
        </button>
        <button
          onClick={() => setActiveSubTab('reducing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubTab === 'reducing'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Reducing Balance Interest
        </button>
      </div>

      {/* 1. SIMPLE INTEREST */}
      {activeSubTab === 'simple' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Simple Interest Formula</h3>
              <p className="text-xs text-slate-400 mt-0.5">Fixed rate flat accrual on original deposit or loan principal</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Principal Amount (₹)</label>
                <input
                  type="number"
                  value={siPrincipal}
                  onChange={e => setSiPrincipal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Annual Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    value={siRate}
                    onChange={e => setSiRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300">Time Duration</label>
                    <div className="flex items-center gap-1 text-[10px]">
                      {(['years', 'months', 'days'] as const).map(u => (
                        <button
                          key={u}
                          onClick={() => setSiTimeUnit(u)}
                          className={`px-1.5 py-0.5 rounded capitalize ${siTimeUnit === u ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-500'}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    value={siTime}
                    onChange={e => setSiTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Simple Interest Yield
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Total Maturity Value</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  ₹{Math.round(siTotalMaturity).toLocaleString()}
                </div>
                <div className="text-xs text-emerald-400 font-semibold">
                  Interest Accrued: +₹{Math.round(siInterest).toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Initial Principal:</span>
                  <span className="font-mono text-white font-bold">₹{pSI.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Simple Interest:</span>
                  <span className="font-mono text-amber-400 font-bold">₹{Math.round(siInterest).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Simple Interest: Principal ₹${pSI} | Interest ₹${siInterest} | Maturity ₹${siTotalMaturity}`, 'si')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'si' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'si' ? 'Copied' : 'Copy Simple Interest'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. COMPOUND INTEREST */}
      {activeSubTab === 'compound' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Compound Interest &amp; Wealth Growth</h3>
              <p className="text-xs text-slate-400 mt-0.5">Exponential compounding with reinvested earnings</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Principal Deposit / Investment (₹)</label>
                <input
                  type="number"
                  value={ciPrincipal}
                  onChange={e => setCiPrincipal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Interest Rate (% p.a.)</label>
                  <input
                    type="number"
                    value={ciRate}
                    onChange={e => setCiRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Years)</label>
                  <input
                    type="number"
                    value={ciTimeYears}
                    onChange={e => setCiTimeYears(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Compounding Frequency</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { n: 1, label: 'Annually' },
                    { n: 2, label: 'Half-Yearly' },
                    { n: 4, label: 'Quarterly' },
                    { n: 12, label: 'Monthly' }
                  ].map(f => (
                    <button
                      key={f.n}
                      onClick={() => setCiFrequency(f.n)}
                      className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        ciFrequency === f.n
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Compounded Growth
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Total Final Balance</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  ₹{Math.round(ciMaturity).toLocaleString()}
                </div>
                <div className="text-xs text-amber-400 font-semibold">
                  Compounded Earnings: +₹{Math.round(ciInterest).toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Initial Investment:</span>
                  <span className="font-mono text-white font-bold">₹{pCI.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Effective Annual Rate (EAR):</span>
                  <span className="font-mono text-emerald-400 font-bold">{effectiveAnnualRate.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Maturity: ₹${Math.round(ciMaturity)} | Compound Interest: ₹${Math.round(ciInterest)} | EAR: ${effectiveAnnualRate.toFixed(2)}%`, 'ci')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'ci' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ci' ? 'Copied' : 'Copy Compound Result'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. REDUCING BALANCE */}
      {activeSubTab === 'reducing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="font-bold text-white text-base">Reducing Balance Interest</h3>
              <p className="text-xs text-slate-400 mt-0.5">Interest calculated strictly on remaining unpaid loan principal</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Principal (₹)</label>
                <input
                  type="number"
                  value={redPrincipal}
                  onChange={e => setRedPrincipal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Annual Rate (% p.a.)</label>
                <input
                  type="number"
                  value={redRate}
                  onChange={e => setRedRate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Tenure (Months)</label>
                <input
                  type="number"
                  value={redMonths}
                  onChange={e => setRedMonths(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              Unlike flat-rate schemes, reducing balance charges interest only on the unpaid principal balance each month. As you pay down the loan, your interest share shrinks while your principal amortization expands.
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Reducing Balance Summary
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Monthly Equated Payment</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  ₹{redEmi.toLocaleString()}
                </div>
                <div className="text-xs text-rose-400 font-semibold">
                  Total Diminishing Interest: ₹{redTotalInterest.toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Outflow:</span>
                  <span className="font-mono text-white font-bold">₹{redTotalRepay.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Principal:</span>
                  <span className="font-mono text-slate-300 font-bold">₹{pRed.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Reducing Balance EMI: ₹${redEmi} | Total Interest: ₹${redTotalInterest}`, 'red')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'red' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'red' ? 'Copied' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
