import React, { useState } from 'react';
import { Percent, Tag, TrendingUp, Copy, Check, RotateCcw, ArrowRight } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  initialSubTab?: 'percentage' | 'discount' | 'markup';
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

export const PercentageDiscountMarkupCalculator: React.FC<Props> = ({
  initialSubTab = 'percentage',
  onRecordHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'percentage' | 'discount' | 'markup'>(initialSubTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Percentage state
  const [pctType, setPctType] = useState<'of' | 'is_what' | 'increase_decrease' | 'diff'>('of');
  const [pctX, setPctX] = useState<string>('18');
  const [pctY, setPctY] = useState<string>('50000');
  const [pctValA, setPctValA] = useState<string>('1200');
  const [pctValB, setPctValB] = useState<string>('1500');

  // Percentage Calculations
  const numX = parseFloat(pctX) || 0;
  const numY = parseFloat(pctY) || 0;
  const numA = parseFloat(pctValA) || 0;
  const numB = parseFloat(pctValB) || 0;

  // Mode 1: What is X% of Y?
  const pctResultOf = (numX / 100) * numY;
  // Mode 2: X is what % of Y?
  const pctResultIsWhat = numY !== 0 ? (numX / numY) * 100 : 0;
  // Mode 3: Percentage increase / decrease from A to B
  const pctChange = numA !== 0 ? ((numB - numA) / numA) * 100 : 0;
  const pctChangeType = pctChange >= 0 ? 'Increase' : 'Decrease';
  // Mode 4: Difference percentage
  const pctDiff = ((numA + numB) / 2) !== 0 ? (Math.abs(numA - numB) / ((numA + numB) / 2)) * 100 : 0;

  // 2. Discount state
  const [discOriginal, setDiscOriginal] = useState<string>('10000');
  const [discPct, setDiscPct] = useState<string>('15');
  const [discFinalInput, setDiscFinalInput] = useState<string>('8500');
  const [discountMode, setDiscountMode] = useState<'forward' | 'reverse'>('forward');

  const origPrice = parseFloat(discOriginal) || 0;
  const discPercent = parseFloat(discPct) || 0;
  const finalPriceIn = parseFloat(discFinalInput) || 0;

  let calcDiscAmount = 0;
  let calcFinalPrice = 0;
  let calcOriginalFromReverse = 0;

  if (discountMode === 'forward') {
    calcDiscAmount = (origPrice * discPercent) / 100;
    calcFinalPrice = Math.max(0, origPrice - calcDiscAmount);
  } else {
    // Reverse: Final Price and Discount % known
    calcOriginalFromReverse = discPercent < 100 ? finalPriceIn / (1 - discPercent / 100) : 0;
    calcDiscAmount = calcOriginalFromReverse - finalPriceIn;
    calcFinalPrice = finalPriceIn;
  }

  // 3. Markup state
  const [markupCost, setMarkupCost] = useState<string>('400');
  const [markupPct, setMarkupPct] = useState<string>('25');
  const [markupSelling, setMarkupSelling] = useState<string>('500');
  const [markupMode, setMarkupMode] = useState<'forward' | 'reverse'>('forward');

  const costP = parseFloat(markupCost) || 0;
  const mkpPct = parseFloat(markupPct) || 0;
  const sellP = parseFloat(markupSelling) || 0;

  let calcMarkupAmt = 0;
  let calcSellingP = 0;
  let calcReverseMarkupPct = 0;

  if (markupMode === 'forward') {
    calcMarkupAmt = (costP * mkpPct) / 100;
    calcSellingP = costP + calcMarkupAmt;
  } else {
    calcMarkupAmt = sellP - costP;
    calcReverseMarkupPct = costP > 0 ? (calcMarkupAmt / costP) * 100 : 0;
    calcSellingP = sellP;
  }

  return (
    <div className="space-y-6">
      {/* Sub tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 w-fit">
        <button
          onClick={() => setActiveSubTab('percentage')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'percentage'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Percent className="w-3.5 h-3.5" />
          <span>Percentage Suite</span>
        </button>
        <button
          onClick={() => setActiveSubTab('discount')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'discount'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Discount &amp; Markdown</span>
        </button>
        <button
          onClick={() => setActiveSubTab('markup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'markup'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Cost Markup</span>
        </button>
      </div>

      {/* 1. PERCENTAGE WORKSPACE */}
      {activeSubTab === 'percentage' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="font-bold text-white text-base">Select Percentage Operation</h3>
              <p className="text-xs text-slate-400 mt-0.5">Solve standard proportions, ratios and percentage shifts</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'of', label: 'X% of Y' },
                { id: 'is_what', label: 'X is what % of Y' },
                { id: 'increase_decrease', label: '% Change (A &rarr; B)' },
                { id: 'diff', label: '% Difference' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setPctType(opt.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer text-center ${
                    pctType === opt.id
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                  }`}
                  dangerouslySetInnerHTML={{ __html: opt.label }}
                />
              ))}
            </div>

            {/* Inputs based on type */}
            {(pctType === 'of' || pctType === 'is_what') ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {pctType === 'of' ? 'Percentage (X %)' : 'Value (X)'}
                  </label>
                  <input
                    type="number"
                    value={pctX}
                    onChange={e => setPctX(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 18"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {pctType === 'of' ? 'Total Amount (Y)' : 'Total Base (Y)'}
                  </label>
                  <input
                    type="number"
                    value={pctY}
                    onChange={e => setPctY(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 50000"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Initial Value (A)</label>
                  <input
                    type="number"
                    value={pctValA}
                    onChange={e => setPctValA(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 1200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Final Value (B)</label>
                  <input
                    type="number"
                    value={pctValB}
                    onChange={e => setPctValB(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="e.g. 1500"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setPctX('0');
                  setPctY('0');
                  setPctValA('0');
                  setPctValB('0');
                }}
                className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Fields</span>
              </button>

              <button
                onClick={() => {
                  if (onRecordHistory) {
                    const resultText = pctType === 'of'
                      ? `${numX}% of ${numY.toLocaleString()} = ${pctResultOf.toLocaleString()}`
                      : `${pctChange.toFixed(2)}% ${pctChangeType}`;
                    onRecordHistory({
                      calculatorId: 'percentage',
                      calculatorName: 'Percentage & Variance',
                      inputs: { X: pctX, Y: pctY, A: pctValA, B: pctValB },
                      resultSummary: resultText
                    });
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              >
                Save to History
              </button>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Calculated Outcome
              </span>

              {pctType === 'of' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
                  <div className="text-xs text-slate-400">
                    {numX}% of ₹{numY.toLocaleString()}
                  </div>
                  <div className="text-4xl font-black text-amber-400 font-mono">
                    ₹{pctResultOf.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-slate-500">
                    Formula: ({numX} / 100) × {numY.toLocaleString()}
                  </div>
                </div>
              )}

              {pctType === 'is_what' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
                  <div className="text-xs text-slate-400">
                    {numX.toLocaleString()} is what % of {numY.toLocaleString()}?
                  </div>
                  <div className="text-4xl font-black text-amber-400 font-mono">
                    {pctResultIsWhat.toFixed(2)}%
                  </div>
                  <div className="text-xs text-slate-500">
                    Formula: ({numX.toLocaleString()} / {numY.toLocaleString()}) × 100
                  </div>
                </div>
              )}

              {pctType === 'increase_decrease' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
                  <div className="text-xs text-slate-400">
                    Shift from {numA.toLocaleString()} to {numB.toLocaleString()}
                  </div>
                  <div className={`text-4xl font-black font-mono ${pctChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(2)}%
                  </div>
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {pctChangeType} of {(Math.abs(numB - numA)).toLocaleString()}
                  </div>
                </div>
              )}

              {pctType === 'diff' && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-2">
                  <div className="text-xs text-slate-400">
                    Relative Difference Between {numA} and {numB}
                  </div>
                  <div className="text-4xl font-black text-amber-400 font-mono">
                    {pctDiff.toFixed(2)}%
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Export Result</span>
              <button
                onClick={() => handleCopy(
                  pctType === 'of' ? String(pctResultOf) : `${pctChange.toFixed(2)}%`,
                  'pct'
                )}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedKey === 'pct' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'pct' ? 'Copied' : 'Copy Result'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DISCOUNT WORKSPACE */}
      {activeSubTab === 'discount' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Discount &amp; Markdown Calculation</h3>
                <p className="text-xs text-slate-400 mt-0.5">Determine net bill after percentage markdown</p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setDiscountMode('forward')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    discountMode === 'forward' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Forward
                </button>
                <button
                  onClick={() => setDiscountMode('reverse')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    discountMode === 'reverse' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Reverse
                </button>
              </div>
            </div>

            {discountMode === 'forward' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Original Price (₹)</label>
                  <input
                    type="number"
                    value={discOriginal}
                    onChange={e => setDiscOriginal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Discount (%)</label>
                  <input
                    type="number"
                    value={discPct}
                    onChange={e => setDiscPct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="15"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Final Discounted Price (₹)</label>
                  <input
                    type="number"
                    value={discFinalInput}
                    onChange={e => setDiscFinalInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="8500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Discount Percentage (%)</label>
                  <input
                    type="number"
                    value={discPct}
                    onChange={e => setDiscPct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="15"
                  />
                </div>
              </div>
            )}

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Quick Discount Presets</span>
              <div className="flex flex-wrap items-center gap-2">
                {[5, 10, 15, 20, 25, 30, 50].map(p => (
                  <button
                    key={p}
                    onClick={() => setDiscPct(String(p))}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                      discPct === String(p)
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Discount Result */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Discount Breakdown
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Final Net Payable</div>
                <div className="text-4xl font-black text-emerald-400 font-mono">
                  ₹{calcFinalPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-amber-400 font-semibold">
                  You Save: ₹{calcDiscAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({discPercent}%)
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Original Tag Price:</span>
                  <span className="font-mono font-bold text-white">
                    ₹{(discountMode === 'forward' ? origPrice : calcOriginalFromReverse).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Deduction ({discPercent}%):</span>
                  <span className="font-mono text-rose-400 font-bold">
                    − ₹{calcDiscAmount.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-1.5 flex justify-between font-bold text-white">
                  <span>Final Invoice:</span>
                  <span className="font-mono text-emerald-400">₹{calcFinalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Original: ₹${origPrice} | Final: ₹${calcFinalPrice} | Saved: ₹${calcDiscAmount}`, 'disc')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'disc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'disc' ? 'Copied Summary' : 'Copy Quote'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. MARKUP WORKSPACE */}
      {activeSubTab === 'markup' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Cost Markup Calculator</h3>
                <p className="text-xs text-slate-400 mt-0.5">Translate base material costs into target quotation</p>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setMarkupMode('forward')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    markupMode === 'forward' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cost &rarr; Selling
                </button>
                <button
                  onClick={() => setMarkupMode('reverse')}
                  className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                    markupMode === 'reverse' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Selling &rarr; Markup %
                </button>
              </div>
            </div>

            {markupMode === 'forward' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={markupCost}
                    onChange={e => setMarkupCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Target Markup (%)</label>
                  <input
                    type="number"
                    value={markupPct}
                    onChange={e => setMarkupPct(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="25"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={markupCost}
                    onChange={e => setMarkupCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={markupSelling}
                    onChange={e => setMarkupSelling(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    placeholder="500"
                  />
                </div>
              </div>
            )}

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-bold block">Standard Industry Markups</span>
              <div className="flex flex-wrap items-center gap-2">
                {[10, 15, 20, 25, 30, 40, 50].map(m => (
                  <button
                    key={m}
                    onClick={() => setMarkupPct(String(m))}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                      markupPct === String(m)
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    +{m}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Markup Result */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Quote &amp; Profit Summary
              </span>

              <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <div className="text-xs text-slate-400">Target Selling Price</div>
                <div className="text-4xl font-black text-amber-400 font-mono">
                  ₹{calcSellingP.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-emerald-400 font-semibold">
                  Profit Addition: +₹{calcMarkupAmt.toLocaleString()} (
                  {markupMode === 'forward' ? mkpPct : calcReverseMarkupPct.toFixed(1)}% Markup
                  )
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Base Cost:</span>
                  <span className="font-mono text-white font-bold">₹{costP.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Gross Margin on Sales:</span>
                  <span className="font-mono text-cyan-400 font-bold">
                    {calcSellingP > 0 ? ((calcMarkupAmt / calcSellingP) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleCopy(`Cost: ₹${costP} | Selling: ₹${calcSellingP} | Markup: ₹${calcMarkupAmt}`, 'mkp')}
              className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copiedKey === 'mkp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'mkp' ? 'Copied' : 'Copy Quotation'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
