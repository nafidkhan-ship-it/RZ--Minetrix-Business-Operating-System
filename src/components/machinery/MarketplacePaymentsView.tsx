import React, { useState } from 'react';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Building2,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Plus
} from 'lucide-react';
import {
  MARKETPLACE_PAYMENTS,
  MarketplacePaymentRecord
} from '../../data/usedMachineryMarketplaceData';

interface MarketplacePaymentsViewProps {
  onOpenOttModal: (contextRef?: string) => void;
}

export const MarketplacePaymentsView: React.FC<MarketplacePaymentsViewProps> = ({
  onOpenOttModal
}) => {
  const [payments, setPayments] = useState<MarketplacePaymentRecord[]>(MARKETPLACE_PAYMENTS);
  const [activeReceipt, setActiveReceipt] = useState<MarketplacePaymentRecord | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Marketplace Payments & Escrow Ledger</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Verified Escrow
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Advance escrow holdings, RTGS settlements, and surveyor diagnostic fees
          </p>
        </div>

        <button
          onClick={() => onOpenOttModal('ESCROW-PAYMENT-RECON')}
          className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>+ Create Payment Follow-up</span>
        </button>
      </div>

      {/* KPI Ledger Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs">Total Escrow Processed</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">₹26.50 Lakh</div>
          <div className="text-[11px] text-slate-400 mt-1">2 Settled deals</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs">Active Escrow Held</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">₹3.00 Lakh</div>
          <div className="text-[11px] text-amber-400 mt-1">Awaiting RTO NOC transfer</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs">Pending Buyer Balance</div>
          <div className="text-2xl font-black text-white font-mono mt-1">₹27.00 Lakh</div>
          <div className="text-[11px] text-slate-400 mt-1">Payable upon trailer dispatch</div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-slate-400 text-xs">Surveyor & Transport Escrow</div>
          <div className="text-2xl font-black text-white font-mono mt-1">₹34,500</div>
          <div className="text-[11px] text-emerald-400 mt-1">Disbursed upon completion</div>
        </div>
      </div>

      {/* PAYMENT TRANSACTIONS TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h2 className="text-base font-black text-white">Escrow Receipts & Transaction Records</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                <th className="p-3 font-semibold">Payment Code</th>
                <th className="p-3 font-semibold">Deal Reference</th>
                <th className="p-3 font-semibold">Remitter / Party</th>
                <th className="p-3 font-semibold">Type</th>
                <th className="p-3 font-semibold">Method & Bank Ref</th>
                <th className="p-3 font-semibold">Amount</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-950/40 transition">
                  <td className="p-3 font-mono font-bold text-amber-400">{p.paymentCode}</td>
                  <td className="p-3 font-mono text-slate-300">{p.dealCode}</td>
                  <td className="p-3 font-bold text-white">{p.partyName}</td>
                  <td className="p-3 text-slate-300">{p.paymentType}</td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">
                    <div>{p.paymentMethod}</div>
                    <div className="text-[10px] text-slate-500">{p.referenceId}</div>
                  </td>
                  <td className="p-3 font-mono font-black text-white text-sm">
                    ₹{(p.amountRs / 100000).toFixed(2)} Lakh
                  </td>
                  <td className="p-3">
                    <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{p.status}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setActiveReceipt(p)}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEIPT POPUP */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="font-mono text-amber-400 font-bold">{activeReceipt.receiptNumber}</div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <div className="text-slate-500 uppercase text-[10px]">Escrow Transaction Receipt</div>
              <div className="text-2xl font-black text-white font-mono">
                ₹{activeReceipt.amountRs.toLocaleString()}
              </div>
              <div className="text-emerald-400 font-bold">{activeReceipt.status}</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Party:</span>
                <span className="font-bold text-white">{activeReceipt.partyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deal Reference:</span>
                <span className="font-mono text-white">{activeReceipt.dealCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Channel:</span>
                <span>{activeReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UTR Reference:</span>
                <span className="font-mono text-white text-[11px]">{activeReceipt.referenceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Timestamp:</span>
                <span>{activeReceipt.date}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
