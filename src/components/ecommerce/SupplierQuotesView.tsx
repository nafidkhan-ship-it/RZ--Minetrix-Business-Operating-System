import React, { useState } from 'react';
import {
  FileText,
  Search,
  Sparkles,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  MessageSquare,
  ShieldCheck,
  Star,
  ChevronRight
} from 'lucide-react';
import { SupplierQuote, QuoteStatus, COMMERCE_SUPPLIER_QUOTES } from '../../data/ecommerceStudioData';

interface SupplierQuotesViewProps {
  quotes: SupplierQuote[];
  onCompareQuotes: () => void;
  onAcceptQuote: (quote: SupplierQuote) => void;
  onChatWithSupplier: (supplierName: string, ref: string) => void;
}

export const SupplierQuotesView: React.FC<SupplierQuotesViewProps> = ({
  quotes,
  onCompareQuotes,
  onAcceptQuote,
  onChatWithSupplier
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = quotes.filter((q) => {
    if (filterStatus === 'ALL') return true;
    return q.status.toUpperCase() === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              COMMERCIAL RFQs & QUOTES
            </span>
            <span className="text-xs text-slate-400 font-medium">Bidding & Negotiation Desk</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Supplier Quotations ({quotes.length})</h1>
        </div>

        <button
          onClick={onCompareQuotes}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Compare Quotes Table</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto text-xs">
        {['ALL', 'SUBMITTED', 'NEGOTIATION', 'ACCEPTED', 'EXPIRED'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterStatus === st
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((q) => (
          <div
            key={q.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4 hover:border-amber-500/40 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400">{q.quoteNumber}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{q.supplierName}</h3>
              </div>
              <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold ${
                q.status === 'Accepted'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : q.status === 'Negotiation'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {q.status}
              </span>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <div>
                Customer: <strong className="text-white">{q.customerName}</strong> &bull; Site: <span className="text-slate-300">{q.deliveryLocation}</span>
              </div>
              <div>
                Material: <strong className="text-amber-400">{q.quantity} {q.unit}s &bull; {q.productName}</strong>
              </div>
            </div>

            {/* Financial breakdown */}
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Material Unit Rate:</span>
                <span className="font-bold text-white">₹{q.unitRate} / {q.unit}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Direct Haulage & Tipper Freight:</span>
                <span>₹{q.deliveryCharge.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>GST Tax & Royalty:</span>
                <span>₹{q.taxAmount.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-black text-amber-400">
                <span>Total Quote Amount:</span>
                <span>₹{q.totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 leading-relaxed">
              <strong>Terms:</strong> {q.terms}
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 font-mono">
                Validity: {q.quoteValidityDays} days
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onChatWithSupplier(q.supplierName, q.quoteNumber)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => onAcceptQuote(q)}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black cursor-pointer shadow-md"
                >
                  Accept Quote
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
