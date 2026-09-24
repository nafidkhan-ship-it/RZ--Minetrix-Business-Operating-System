import React, { useState } from 'react';
import {
  TrendingUp,
  Receipt,
  FileText,
  DollarSign,
  Search,
  Plus,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SalesInvoice, SalesQuotation } from '../types';
import { MOCK_SALES_INVOICES } from '../data/erpMasterData';

interface SalesCommercialViewProps {
  onCreateTask?: (title: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onOpenChatWithCustomer?: (name: string) => void;
}

export const SalesCommercialView: React.FC<SalesCommercialViewProps> = ({
  onCreateTask,
  onOpenPrintModal,
  onOpenChatWithCustomer
}) => {
  const [invoices, setInvoices] = useState<SalesInvoice[]>(MOCK_SALES_INVOICES);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice>(invoices[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              COMMERCIAL SALES &bull; BILLING &amp; DISPATCH
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-400" />
            <span>Sales Quotations, Orders &amp; GST Invoicing</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Commercial pipeline: <strong>Quotation &rarr; Sales Order &rarr; Delivery &rarr; Invoice &rarr; Payment &rarr; Sales Return &rarr; Credit Note</strong>.
          </p>
        </div>

        <button
          onClick={() => showToast('New Quotation draft initialized')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Sales Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Invoice List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-xs">Recent Invoices ({invoices.length})</h3>
            <span className="text-[10px] text-slate-500 font-mono">Live Billed</span>
          </div>

          <div className="space-y-2">
            {invoices.map(inv => {
              const isSelected = selectedInvoice.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 font-mono text-xs ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-white">{inv.invoiceNumber}</span>
                      <div className="text-[10px] text-slate-500">{inv.customerName}</div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      inv.paymentStatus === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-amber-500/10 text-amber-300'
                    }`}>
                      {inv.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-slate-400">
                    <span>Due: {inv.dueDate}</span>
                    <span className="text-amber-400 font-black">₹{inv.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Invoice Document Preview */}
        <div className="lg:col-span-2">
          {selectedInvoice ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-amber-400 text-base">{selectedInvoice.invoiceNumber}</span>
                    <span className="text-slate-500">&bull; Linked Order: {selectedInvoice.orderNumber}</span>
                    <span className="text-emerald-400 font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-500/10">
                      TAX INVOICE
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-1">{selectedInvoice.customerName}</h3>
                  <div className="text-xs text-slate-400 font-mono">
                    GSTIN: {selectedInvoice.customerGst || 'Unregistered'} &bull; Date: {selectedInvoice.invoiceDate}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenChatWithCustomer?.(selectedInvoice.customerName)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 hover:text-white cursor-pointer"
                    title="Open RZ Chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onCreateTask?.(`Follow-up collection for ${selectedInvoice.invoiceNumber}`)}
                    className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:text-white cursor-pointer"
                    title="Create OTT Task"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenPrintModal?.(`Tax Invoice ${selectedInvoice.invoiceNumber}`, selectedInvoice)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-3 font-mono text-xs">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="grid grid-cols-12 bg-slate-900/80 p-3 text-slate-400 text-[11px] font-bold border-b border-slate-800">
                    <span className="col-span-6">DESCRIPTION OF GOODS</span>
                    <span className="col-span-2 text-right">QTY</span>
                    <span className="col-span-2 text-right">UNIT RATE</span>
                    <span className="col-span-2 text-right">AMOUNT</span>
                  </div>

                  {selectedInvoice.items.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-12 p-3 text-slate-300 border-b border-slate-900/60 last:border-b-0">
                      <span className="col-span-6 font-bold text-white">{item.name}</span>
                      <span className="col-span-2 text-right">{item.qty.toLocaleString()} {item.unit}</span>
                      <span className="col-span-2 text-right">₹{item.rate}</span>
                      <span className="col-span-2 text-right text-amber-400 font-bold">₹{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Calculation Summary Box */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-between gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex-1 space-y-1.5 text-[11px]">
                    <span className="font-bold text-white block">Tax Breakdown (5% GST):</span>
                    <div className="flex justify-between text-slate-400">
                      <span>Central GST (CGST @ 2.5%):</span>
                      <span className="text-white">₹{(selectedInvoice.gstTotal / 2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>State GST (SGST @ 2.5%):</span>
                      <span className="text-white">₹{(selectedInvoice.gstTotal / 2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-900 text-emerald-400 font-bold">
                      <span>Total GST Tax Assessed:</span>
                      <span>₹{selectedInvoice.gstTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex-1 space-y-2 text-right">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span className="text-white">₹{selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Tax (GST):</span>
                      <span className="text-white">+₹{selectedInvoice.gstTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-200 text-sm font-bold pt-1 border-t border-slate-800">
                      <span>Invoice Total:</span>
                      <span className="text-amber-400 text-base">₹{selectedInvoice.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 text-xs font-bold">
                      <span>Paid Amount:</span>
                      <span>₹{selectedInvoice.paidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-rose-400 text-xs font-bold pt-1 border-t border-slate-900">
                      <span>Balance Outstanding:</span>
                      <span>₹{selectedInvoice.balanceAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Record Payment on Invoice */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Payment Mode: NEFT / RTGS / Weighbridge Cash Box
                </span>
                <button
                  onClick={() => showToast(`Payment recorded for ${selectedInvoice.invoiceNumber}`)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 cursor-pointer"
                >
                  Record Payment Receipt
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
