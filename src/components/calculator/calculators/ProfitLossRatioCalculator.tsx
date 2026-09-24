import React, { useState } from 'react';
import { TrendingUp, Scale, Copy, Check, RotateCcw, Split } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  initialSubTab?: 'profit-loss' | 'ratio';
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

export const ProfitLossRatioCalculator: React.FC<Props> = ({
  initialSubTab = 'profit-loss',
  onRecordHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profit-loss' | 'ratio'>(initialSubTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Profit / Loss State
  const [unitCost, setUnitCost] = useState<string>('450');
  const [unitSale, setUnitSale] = useState<string>('620');
  const [quantity, setQuantity] = useState<string>('100');

  const uCost = parseFloat(unitCost) || 0;
  const uSale = parseFloat(unitSale) || 0;
  const qty = parseFloat(quantity) || 0;

  const totalCost = uCost * qty;
  const totalSales = uSale * qty;
  const netProfit = totalSales - totalCost;
  const isProfitable = netProfit >= 0;
  const profitLossPct = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const salesMarginPct = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;

  // Ratio Calculator State
  const [ratioMode, setRatioMode] = useState<'split' | 'simplify' | 'proportion'>('split');
  // Split Amount
  const [splitAmount, setSplitAmount] = useState<string>('100000');
  const [ratioParts, setRatioParts] = useState<{ id: string; name: string; share: string }[]>([
    { id: '1', name: 'Partner A', share: '60' },
    { id: '2', name: 'Partner B', share: '40' }
  ]);
  // Simplify
  const [simpA, setSimpA] = useState<string>('120');
  const [simpB, setSimpB] = useState<string>('80');
  // Proportion A:B = C:D
  const [propA, setPropA] = useState<string>('2');
  const [propB, setPropB] = useState<string>('5');
  const [propC, setPropC] = useState<string>('10');

  // Helper gcd for simplify
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const sA = parseInt(simpA) || 0;
  const sB = parseInt(simpB) || 0;
  const commonDivisor = sA > 0 && sB > 0 ? gcd(sA, sB) : 1;
  const simplifiedA = commonDivisor > 0 ? sA / commonDivisor : 0;
  const simplifiedB = commonDivisor > 0 ? sB / commonDivisor : 0;

  // Proportion D = (B * C) / A
  const pA = parseFloat(propA) || 0;
  const pB = parseFloat(propB) || 0;
  const pC = parseFloat(propC) || 0;
  const propD = pA !== 0 ? (pB * pC) / pA : 0;

  // Ratio split calculations
  const totalAmountToSplit = parseFloat(splitAmount) || 0;
  const totalRatioSum = ratioParts.reduce((sum, part) => sum + (parseFloat(part.share) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab('profit-loss')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'profit-loss'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Profit &amp; Loss</span>
        </button>
        <button
          onClick={() => setActiveSubTab('ratio')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'ratio'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Ratio &amp; Proportion</span>
        </button>
      </div>

      {/* 1. PROFIT & LOSS WORKSPACE */}
      {activeSubTab === 'profit-loss' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="font-bold text-white text-base">Cost, Selling &amp; Volume Parameters</h3>
              <p className="text-xs text-slate-400 mt-0.5">Evaluate unit and batch financial return</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Unit Cost Price (₹)</label>
                <input
                  type="number"
                  value={unitCost}
                  onChange={e => setUnitCost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  placeholder="450"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Unit Selling Price (₹)</label>
                <input
                  type="number"
                  value={unitSale}
                  onChange={e => setUnitSale(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  placeholder="620"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Quantity / Volume</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Quick volume badges */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Preset Quantity Batches</span>
              <div className="flex flex-wrap items-center gap-2">
                {[10, 50, 100, 250, 500, 1000, 2500].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuantity(String(q))}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                      quantity === String(q)
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {q} units
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  setUnitCost('0');
                  setUnitSale('0');
                  setQuantity('0');
                }}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={() => {
                  if (onRecordHistory) {
                    onRecordHistory({
                      calculatorId: 'profit-loss',
                      calculatorName: 'Profit & Loss & Margin',
                      inputs: { unitCost, unitSale, quantity },
                      resultSummary: `${isProfitable ? 'Profit' : 'Loss'}: ₹${Math.abs(netProfit).toLocaleString()} (${salesMarginPct.toFixed(1)}% margin)`
                    });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                Save Calculation
              </button>
            </div>
          </div>

          {/* Profit / Loss Output */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Financial Performance Summary
              </span>

              <div className={`p-4 rounded-2xl bg-slate-950 border text-center space-y-1 ${
                isProfitable ? 'border-emerald-500/30' : 'border-rose-500/30'
              }`}>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {isProfitable ? 'Net Gross Profit' : 'Operating Net Loss'}
                </div>
                <div className={`text-4xl font-black font-mono ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isProfitable ? '+' : '−'}₹{Math.abs(netProfit).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  {profitLossPct.toFixed(2)}% on Cost &bull; {salesMarginPct.toFixed(2)}% Sales Margin
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Total Gross Turnover:</span>
                  <span className="font-mono text-white font-bold">₹{totalSales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Procurement / Cost:</span>
                  <span className="font-mono text-slate-300 font-bold">₹{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Profit Per Unit:</span>
                  <span className={`font-mono font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{(uSale - uCost).toFixed(2)} / unit
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(
                `Turnover: ₹${totalSales} | Cost: ₹${totalCost} | Net Profit: ₹${netProfit} (${salesMarginPct.toFixed(1)}%)`,
                'pl'
              )}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'pl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'pl' ? 'Copied Ledger' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. RATIO WORKSPACE */}
      {activeSubTab === 'ratio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Ratio, Proportion &amp; Splitting</h3>
                <p className="text-xs text-slate-400 mt-0.5">Solve partner ratios, mathematical proportions, and lump-sum splits</p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setRatioMode('split')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    ratioMode === 'split' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Split Amount
                </button>
                <button
                  onClick={() => setRatioMode('simplify')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    ratioMode === 'simplify' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Simplify
                </button>
                <button
                  onClick={() => setRatioMode('proportion')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    ratioMode === 'proportion' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Proportion
                </button>
              </div>
            </div>

            {/* Split Mode */}
            {ratioMode === 'split' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Total Amount to Allocate (₹)</label>
                  <input
                    type="number"
                    value={splitAmount}
                    onChange={e => setSplitAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="100000"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Stakeholder Shares / Ratio Weights</span>
                  {ratioParts.map((part, index) => (
                    <div key={part.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={part.name}
                        onChange={e => {
                          const val = e.target.value;
                          setRatioParts(prev => prev.map(p => p.id === part.id ? { ...p, name: val } : p));
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs flex-1"
                      />
                      <div className="flex items-center gap-1.5 w-32">
                        <input
                          type="number"
                          value={part.share}
                          onChange={e => {
                            const val = e.target.value;
                            setRatioParts(prev => prev.map(p => p.id === part.id ? { ...p, share: val } : p));
                          }}
                          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs w-full text-right"
                        />
                        <span className="text-xs text-slate-500 font-mono">pts</span>
                      </div>
                    </div>
                  ))}

                  {ratioParts.length < 5 && (
                    <button
                      onClick={() => setRatioParts([
                        ...ratioParts,
                        { id: String(Date.now()), name: `Partner ${String.fromCharCode(65 + ratioParts.length)}`, share: '20' }
                      ])}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold transition pt-1 cursor-pointer"
                    >
                      + Add Another Stakeholder
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Simplify Mode */}
            {ratioMode === 'simplify' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">First Term (A)</label>
                    <input
                      type="number"
                      value={simpA}
                      onChange={e => setSimpA(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Second Term (B)</label>
                    <input
                      type="number"
                      value={simpB}
                      onChange={e => setSimpB(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm"
                      placeholder="80"
                    />
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 text-xs text-slate-400 border border-slate-800">
                  Greatest Common Divisor (GCD): <strong className="text-amber-400">{commonDivisor}</strong>
                </div>
              </div>
            )}

            {/* Proportion Mode: A : B = C : D */}
            {ratioMode === 'proportion' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400">Solve for missing variable: A : B = C : ? (D)</div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Term A</label>
                    <input
                      type="number"
                      value={propA}
                      onChange={e => setPropA(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Term B</label>
                    <input
                      type="number"
                      value={propB}
                      onChange={e => setPropB(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Term C</label>
                    <input
                      type="number"
                      value={propC}
                      onChange={e => setPropC(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ratio Output Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                {ratioMode === 'split' ? 'Distribution Breakdown' : ratioMode === 'simplify' ? 'Reduced Ratio' : 'Solved Proportion'}
              </span>

              {ratioMode === 'split' && (
                <div className="space-y-2">
                  {ratioParts.map(part => {
                    const weight = parseFloat(part.share) || 0;
                    const portion = totalRatioSum > 0 ? (weight / totalRatioSum) * totalAmountToSplit : 0;
                    const pctOfWhole = totalRatioSum > 0 ? (weight / totalRatioSum) * 100 : 0;
                    return (
                      <div key={part.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white text-xs">{part.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {weight} pts ({pctOfWhole.toFixed(1)}%)
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black text-amber-400 font-mono">
                            ₹{Math.round(portion).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {ratioMode === 'simplify' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
                  <div className="text-xs text-slate-400">{simpA} : {simpB} reduces to</div>
                  <div className="text-5xl font-black text-amber-400 font-mono tracking-wider">
                    {simplifiedA} : {simplifiedB}
                  </div>
                  <div className="text-xs text-slate-500">
                    Decimal Value: {(sB !== 0 ? (sA / sB).toFixed(4) : 0)}
                  </div>
                </div>
              )}

              {ratioMode === 'proportion' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
                  <div className="text-xs text-slate-400">
                    {propA} : {propB} = {propC} : <strong>D</strong>
                  </div>
                  <div className="text-5xl font-black text-amber-400 font-mono">
                    {propD.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Formula: ({propB} × {propC}) ÷ {propA}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => handleCopy(
                ratioMode === 'split'
                  ? `Split of ₹${totalAmountToSplit}: ${ratioParts.map(p => `${p.name}: ₹${Math.round((parseFloat(p.share) / totalRatioSum) * totalAmountToSplit)}`).join(', ')}`
                  : `${simplifiedA}:${simplifiedB}`,
                'ratio'
              )}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'ratio' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'ratio' ? 'Copied' : 'Copy Split Result'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
