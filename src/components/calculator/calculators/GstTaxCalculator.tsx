import React, { useState } from 'react';
import { Receipt, Copy, Check, Info, FileText, ArrowRight, RotateCcw } from 'lucide-react';
import { CalculationHistoryItem } from '../types';

interface Props {
  onRecordHistory?: (item: Omit<CalculationHistoryItem, 'id' | 'timestamp'>) => void;
}

export const GstTaxCalculator: React.FC<Props> = ({ onRecordHistory }) => {
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [taxScope, setTaxScope] = useState<'intra' | 'inter'>('intra');
  const [amountInput, setAmountInput] = useState<string>('100000');
  const [selectedRate, setSelectedRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const effectiveRate = isCustom ? (parseFloat(customRate) || 0) : selectedRate;
  const rawAmount = parseFloat(amountInput) || 0;

  let baseAmount = 0;
  let gstAmount = 0;
  let totalAmount = 0;

  if (mode === 'add') {
    baseAmount = rawAmount;
    gstAmount = (baseAmount * effectiveRate) / 100;
    totalAmount = baseAmount + gstAmount;
  } else {
    totalAmount = rawAmount;
    baseAmount = effectiveRate > 0 ? totalAmount / (1 + effectiveRate / 100) : totalAmount;
    gstAmount = totalAmount - baseAmount;
  }

  const cgstAmount = taxScope === 'intra' ? gstAmount / 2 : 0;
  const sgstAmount = taxScope === 'intra' ? gstAmount / 2 : 0;
  const igstAmount = taxScope === 'inter' ? gstAmount : 0;

  const handleCopy = () => {
    const text = `GST Quote (${mode.toUpperCase()}): Base ₹${Math.round(baseAmount).toLocaleString()} + GST (${effectiveRate}%) ₹${Math.round(gstAmount).toLocaleString()} = Total ₹${Math.round(totalAmount).toLocaleString()}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs Card */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-base">GST Tax Engine</h3>
              <p className="text-xs text-slate-400 mt-0.5">Simulate Goods and Services Tax invoices &amp; deductions</p>
            </div>

            {/* Mode switch */}
            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setMode('add')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  mode === 'add' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                + Add GST
              </button>
              <button
                onClick={() => setMode('remove')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  mode === 'remove' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                − Remove GST
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              {mode === 'add' ? 'Base Amount (Excluding GST) ₹' : 'Gross Amount (GST Inclusive) ₹'}
            </label>
            <input
              type="number"
              value={amountInput}
              onChange={e => setAmountInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-500"
              placeholder="e.g. 100000"
            />
          </div>

          {/* Tax Scope: Intra (CGST+SGST) vs Inter (IGST) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300">Transaction Jurisdiction</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTaxScope('intra')}
                className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer text-left flex items-start gap-2 ${
                  taxScope === 'intra'
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full mt-0.5 border ${
                  taxScope === 'intra' ? 'bg-amber-400 border-amber-400' : 'border-slate-600'
                }`} />
                <div>
                  <div className="font-bold">Intra-State (Same State)</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">CGST ({effectiveRate / 2}%) + SGST ({effectiveRate / 2}%)</div>
                </div>
              </button>

              <button
                onClick={() => setTaxScope('inter')}
                className={`p-3 rounded-2xl border text-xs font-bold transition cursor-pointer text-left flex items-start gap-2 ${
                  taxScope === 'inter'
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded-full mt-0.5 border ${
                  taxScope === 'inter' ? 'bg-amber-400 border-amber-400' : 'border-slate-600'
                }`} />
                <div>
                  <div className="font-bold">Inter-State (Out of State)</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">Integrated GST (IGST {effectiveRate}%)</div>
                </div>
              </button>
            </div>
          </div>

          {/* GST Slabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-300">GST Rate Slab</label>
              <span className="text-[11px] text-slate-500">Select rate or enter custom</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[0, 5, 12, 18, 28].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRate(r);
                    setIsCustom(false);
                  }}
                  className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                    !isCustom && selectedRate === r
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {r}%
                </button>
              ))}

              <button
                onClick={() => setIsCustom(true)}
                className={`py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  isCustom
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Custom %
              </button>
            </div>

            {isCustom && (
              <div className="pt-2">
                <input
                  type="number"
                  value={customRate}
                  onChange={e => setCustomRate(e.target.value)}
                  placeholder="Enter custom GST percentage e.g. 7.5"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => {
                setAmountInput('0');
                setSelectedRate(18);
                setIsCustom(false);
              }}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Amount</span>
            </button>

            <button
              onClick={() => {
                if (onRecordHistory) {
                  onRecordHistory({
                    calculatorId: 'gst-calculator',
                    calculatorName: 'GST Calculator',
                    inputs: { mode, taxScope, amount: amountInput, rate: `${effectiveRate}%` },
                    resultSummary: `Base: ₹${Math.round(baseAmount).toLocaleString()} | Tax: ₹${Math.round(gstAmount).toLocaleString()} | Total: ₹${Math.round(totalAmount).toLocaleString()}`
                  });
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
            >
              Save Calculation
            </button>
          </div>
        </div>

        {/* Right Output: Invoice Breakdown Slip */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Simulated Tax Invoice
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                GSTIN READY
              </span>
            </div>

            {/* Total Highlight */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-center space-y-1">
              <div className="text-xs text-slate-400">Total Net Invoice Value</div>
              <div className="text-4xl font-black text-amber-400 font-mono">
                ₹{Math.round(totalAmount).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                Includes ₹{Math.round(gstAmount).toLocaleString()} total GST ({effectiveRate}%)
              </div>
            </div>

            {/* Line Item Breakdown */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Taxable Base Value:</span>
                <span className="font-bold text-white">₹{Math.round(baseAmount).toLocaleString()}</span>
              </div>

              {taxScope === 'intra' ? (
                <>
                  <div className="flex justify-between text-slate-400 pl-2 border-l border-slate-800">
                    <span>Central GST (CGST {(effectiveRate / 2).toFixed(1)}%):</span>
                    <span className="text-amber-400 font-bold">₹{Math.round(cgstAmount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pl-2 border-l border-slate-800">
                    <span>State GST (SGST {(effectiveRate / 2).toFixed(1)}%):</span>
                    <span className="text-amber-400 font-bold">₹{Math.round(sgstAmount).toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between text-slate-400 pl-2 border-l border-slate-800">
                  <span>Integrated GST (IGST {effectiveRate}%):</span>
                  <span className="text-purple-400 font-bold">₹{Math.round(igstAmount).toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-white text-sm">
                <span>Final Payable:</span>
                <span className="text-emerald-400">₹{Math.round(totalAmount).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-500 leading-relaxed">
              <strong>Notice:</strong> Rates applied are user-selected. Applicable GST rates for specific minerals, laterite stones, crushed aggregates or transport services should be confirmed against current CBIC HSN classifications.
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Quote' : 'Copy GST Breakdown'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
