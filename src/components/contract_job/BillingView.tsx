import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Filter,
  Eye,
  Printer,
  Download,
  Send,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import {
  JobInvoice,
  InvoiceStatus,
  BillingType,
  SAMPLE_INVOICES,
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

interface BillingViewProps {
  onRecordPayment: (invoiceNumber: string) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ onRecordPayment }) => {
  const [invoices, setInvoices] = useState<JobInvoice[]>(SAMPLE_INVOICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState<JobInvoice | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Invoice form
  const [newInv, setNewInv] = useState<Partial<JobInvoice>>({
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    customerName: SAMPLE_JOBS[0]?.customerName || 'Prestige Estates Ltd',
    date: '2026-09-24',
    dueDate: '2026-10-15',
    billingType: 'Progress / RA Bill',
    currentAmount: 1200000,
    retentionDeducted: 60000,
    taxAmount: 216000,
    status: 'Generated'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const curr = Number(newInv.currentAmount) || 500000;
    const ret = Number(newInv.retentionDeducted) || 25000;
    const tax = Math.round(curr * 0.18);
    const total = curr - ret + tax;

    const created: JobInvoice = {
      invoiceNumber: `INV-2026-0${invoices.length + 88}`,
      jobId: newInv.jobId || 'JOB-4001',
      customerName: newInv.customerName || 'Direct Customer',
      date: newInv.date || '2026-09-24',
      dueDate: newInv.dueDate || '2026-10-15',
      billingType: (newInv.billingType as BillingType) || 'Progress / RA Bill',
      previousBilled: 1500000,
      currentAmount: curr,
      retentionDeducted: ret,
      taxAmount: tax,
      totalAmount: total,
      status: 'Generated'
    };

    setInvoices([created, ...invoices]);
    setIsAddModalOpen(false);
    showToast(`Generated Invoice ${created.invoiceNumber} for ₹${created.totalAmount.toLocaleString('en-IN')}`);
  };

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.jobId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Revenue Realization
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              {filtered.length} Invoices
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Billing & Invoicing (RA Bills)</h2>
          <p className="text-xs text-slate-400">
            Progress billing, milestone release claims, 5% retention deductions, and GST compliance tax schedules.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Generate RA Bill</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice number, client, job ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Generated">Generated</option>
            <option value="Sent">Sent</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Invoices List Cards */}
      <div className="space-y-4">
        {filtered.map((inv) => (
          <div
            key={inv.invoiceNumber}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-cyan-400">
                    {inv.invoiceNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Job: {inv.jobId}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-semibold">
                    {inv.billingType}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : inv.status === 'Partially Paid'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{inv.customerName}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-3 mt-0.5">
                  <span>Issued: {inv.date}</span>
                  <span>&bull;</span>
                  <span className="text-amber-400">Due: {inv.dueDate}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">Invoice Net Total (Incl. GST)</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                  ₹{inv.totalAmount.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Base: ₹{inv.currentAmount.toLocaleString('en-IN')} | Retention: -₹
                  {inv.retentionDeducted.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Actions: Preview, Print, PDF, Send, Record Payment */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedInvoice(inv)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => showToast(`Printing Tax Invoice ${inv.invoiceNumber}`)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => showToast(`Exported Invoice PDF`)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => showToast(`Dispatched invoice notification to ${inv.customerName}`)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-purple-400" />
                  <span>Send</span>
                </button>
              </div>

              <button
                onClick={() => onRecordPayment(inv.invoiceNumber)}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Record Client Payment</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PREVIEW INVOICE MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {selectedInvoice.invoiceNumber}
                </span>
                <h3 className="text-base font-black text-white">Tax Invoice / RA Bill Voucher</h3>
                <div className="text-xs text-slate-400">{selectedInvoice.customerName}</div>
              </div>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Job Reference:</span>
                <span className="text-white">{selectedInvoice.jobId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Gross Work Completed (Taxable):</span>
                <span className="text-white">
                  ₹{selectedInvoice.currentAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Less: Retention Guarantee (5%):</span>
                <span>-₹{selectedInvoice.retentionDeducted.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Add: GST @ 18%:</span>
                <span className="text-white">₹{selectedInvoice.taxAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                <span className="text-white">Net Bill Payable:</span>
                <span className="text-emerald-400 font-black">
                  ₹{selectedInvoice.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  const inv = selectedInvoice;
                  setSelectedInvoice(null);
                  onRecordPayment(inv.invoiceNumber);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Record Payment Received
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-cyan-400" />
                <span>Generate Running Account Bill</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Job</label>
                  <select
                    value={newInv.jobId}
                    onChange={(e) => {
                      const found = SAMPLE_JOBS.find((j) => j.id === e.target.value);
                      setNewInv({
                        ...newInv,
                        jobId: e.target.value,
                        customerName: found ? found.customerName : ''
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    {SAMPLE_JOBS.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.id} - {j.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Billing Type</label>
                  <select
                    value={newInv.billingType}
                    onChange={(e) => setNewInv({ ...newInv, billingType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Progress / RA Bill">Progress / RA Bill</option>
                    <option value="Advance Billing">Advance Billing</option>
                    <option value="Milestone Billing">Milestone Billing</option>
                    <option value="Material Supply Billing">Material Supply Billing</option>
                    <option value="Time & Material">Time & Material</option>
                    <option value="Final Bill">Final Bill</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Taxable Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newInv.currentAmount}
                    onChange={(e) => setNewInv({ ...newInv, currentAmount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Retention Deduction (₹)</label>
                  <input
                    type="number"
                    value={newInv.retentionDeducted}
                    onChange={(e) =>
                      setNewInv({ ...newInv, retentionDeducted: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={newInv.date}
                    onChange={(e) => setNewInv({ ...newInv, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Payment Due Date</label>
                  <input
                    type="date"
                    value={newInv.dueDate}
                    onChange={(e) => setNewInv({ ...newInv, dueDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
