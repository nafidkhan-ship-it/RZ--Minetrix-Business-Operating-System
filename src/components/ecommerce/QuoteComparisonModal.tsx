import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';
import { SupplierQuote } from '../../data/ecommerceStudioData';

interface QuoteComparisonModalProps {
  quotes: SupplierQuote[];
  isOpen: boolean;
  onClose: () => void;
  onSelectQuote: (quote: SupplierQuote) => void;
}

export const QuoteComparisonModal: React.FC<QuoteComparisonModalProps> = ({
  quotes,
  isOpen,
  onClose,
  onSelectQuote
}) => {
  if (!isOpen || quotes.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                COMPARE {quotes.length} SUPPLIER QUOTES
              </span>
              <h2 className="text-lg font-black text-white">Factual Quotation Comparison</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Table */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          <div className="overflow-x-auto bg-slate-950 border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-900/60">
                  <th className="p-4">Commercial Metric</th>
                  {quotes.map((q) => (
                    <th key={q.id} className="p-4 font-bold text-white min-w-[200px]">
                      <div className="text-amber-400 font-mono text-[10px]">{q.quoteNumber}</div>
                      <div className="text-sm font-bold text-white truncate">{q.supplierName}</div>
                      <div className="text-amber-300 font-mono text-xs flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400" /> {q.supplierRating} Rating
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                <tr>
                  <td className="p-4 font-sans text-slate-400 font-medium">Material Rate</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-white font-bold text-sm">
                      ₹{q.unitRate} / {q.unit}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-sans text-slate-400 font-medium">Material Subtotal</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-slate-200">
                      ₹{q.materialAmount.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-sans text-slate-400 font-medium">Direct Haulage / Delivery</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-slate-200">
                      ₹{q.deliveryCharge.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-sans text-slate-400 font-medium">GST Tax (Royalty / Transport)</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-slate-200">
                      ₹{q.taxAmount.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr className="bg-amber-500/5">
                  <td className="p-4 font-sans text-amber-400 font-bold">Total Delivered Value</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-emerald-400 font-black text-base">
                      ₹{q.totalAmount.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-sans text-slate-400 font-medium">Advance Required</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-slate-300">
                      ₹{q.advanceRequired.toLocaleString()}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-sans text-slate-400 font-medium">Estimated Delivery</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-slate-300 font-sans">
                      {q.estimatedDelivery}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-sans text-slate-400 font-medium">Quote Validity</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-slate-300 font-sans">
                      {q.quoteValidityDays} Days from issue
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-sans text-slate-400 font-medium">Terms & Stacking</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4 text-slate-400 font-sans text-[11px] leading-relaxed">
                      {q.terms}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-900/50">
                  <td className="p-4 font-sans text-slate-400 font-medium">Selection</td>
                  {quotes.map((q) => (
                    <td key={q.id} className="p-4">
                      <button
                        onClick={() => onSelectQuote(q)}
                        className="w-full px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SELECT QUOTE</span>
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
