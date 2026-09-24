import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  DollarSign,
  Printer,
  Download,
  Calendar,
  Building,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  JobPayment,
  PaymentMode,
  SAMPLE_PAYMENTS,
  SAMPLE_JOBS,
  SAMPLE_CUSTOMERS
} from '../../data/contractJobStudioData';

interface PaymentsViewProps {
  preselectedInvoice?: string | null;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({ preselectedInvoice }) => {
  const [payments, setPayments] = useState<JobPayment[]>(SAMPLE_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<JobPayment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Payment form state
  const [newPay, setNewPay] = useState<Partial<JobPayment>>({
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    customerName: SAMPLE_JOBS[0]?.customerName || 'Prestige Estates Ltd',
    invoiceNumber: preselectedInvoice || 'INV-2026-089',
    date: '2026-09-24',
    amount: 1000000,
    paymentMode: 'Bank Transfer (RTGS)',
    referenceNumber: 'HDFC-RTGS-998822',
    bankAccount: 'RZ Minetrix Canara Bank CC-4490',
    tdsDeducted: 20000,
    status: 'Received'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const gross = Number(newPay.amount) || 500000;
    const tds = Number(newPay.tdsDeducted) || 10000;
    const net = gross - tds;

    const created: JobPayment = {
      id: `PAY-2026-0${payments.length + 80}`,
      jobId: newPay.jobId || 'JOB-4001',
      customerName: newPay.customerName || 'Direct Customer',
      invoiceNumber: newPay.invoiceNumber || 'INV-2026-089',
      date: newPay.date || '2026-09-24',
      amount: gross,
      paymentMode: (newPay.paymentMode as PaymentMode) || 'Bank Transfer (RTGS)',
      referenceNumber: newPay.referenceNumber || 'UTR-009988',
      bankAccount: newPay.bankAccount || 'Canara Bank CC',
      tdsDeducted: tds,
      netReceived: net,
      status: 'Received'
    };

    setPayments([created, ...payments]);
    setIsAddModalOpen(false);
    showToast(`Payment receipt ${created.id} generated for ₹${created.netReceived.toLocaleString('en-IN')}`);
  };

  const handleReconcile = (id: string) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, status: 'Reconciled' } : p))
    );
    showToast(`Payment ${id} reconciled with Bank Ledger`);
  };

  const filtered = payments.filter((p) =>
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCollected = filtered.reduce((acc, curr) => acc + curr.netReceived, 0);

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
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Cash Flow Realization
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Total Inflow: ₹{(totalCollected / 100000).toFixed(2)} Lakhs
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Payments & Collections</h2>
          <p className="text-xs text-slate-400">
            Bank reconciliations, RTGS/NEFT transaction UTRs, 2% TDS credits, and client payment acknowledgements.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Payment</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by payment ID, client, UTR / ref number, invoice..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Payments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-mono text-slate-400">
              <tr>
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Invoice Ref</th>
                <th className="py-3 px-4">Payment Mode</th>
                <th className="py-3 px-4">Bank Ref / UTR</th>
                <th className="py-3 px-4 text-right">TDS (₹)</th>
                <th className="py-3 px-4 text-right">Net Received (₹)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300 font-mono text-xs">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-850 transition">
                  <td className="py-3 px-4 font-bold text-emerald-400">{p.id}</td>
                  <td className="py-3 px-4 text-slate-400">{p.date}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-white">{p.customerName}</td>
                  <td className="py-3 px-4 text-cyan-400">{p.invoiceNumber}</td>
                  <td className="py-3 px-4 font-sans text-slate-200">{p.paymentMode}</td>
                  <td className="py-3 px-4 text-slate-400">{p.referenceNumber}</td>
                  <td className="py-3 px-4 text-right text-amber-400">
                    ₹{p.tdsDeducted.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-emerald-400 text-sm">
                    ₹{p.netReceived.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        p.status === 'Reconciled'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-sans">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
                        title="View Voucher"
                      >
                        Voucher
                      </button>
                      {p.status !== 'Reconciled' && (
                        <button
                          onClick={() => handleReconcile(p.id)}
                          className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/20 cursor-pointer"
                        >
                          Reconcile
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYMENT VOUCHER MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {selectedPayment.id}
                </span>
                <h3 className="text-base font-black text-white">Payment Receipt Voucher</h3>
                <div className="text-xs text-slate-400">{selectedPayment.customerName}</div>
              </div>

              <button
                onClick={() => setSelectedPayment(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Invoice Credited:</span>
                <span className="text-white">{selectedPayment.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment Mode:</span>
                <span className="text-white">{selectedPayment.paymentMode}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Bank Ref / UTR:</span>
                <span className="text-white">{selectedPayment.referenceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Deposited Account:</span>
                <span className="text-slate-300">{selectedPayment.bankAccount}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>TDS 194C Deducted (2%):</span>
                <span>₹{selectedPayment.tdsDeducted.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold">
                <span className="text-white">Net Deposited:</span>
                <span className="text-emerald-400 font-black">
                  ₹{selectedPayment.netReceived.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`Printed Receipt ${selectedPayment.id}`);
                  setSelectedPayment(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Print Official Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RECORD PAYMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Record Client Receipt</span>
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
                  <label className="block text-slate-400 font-medium mb-1">Client / Customer</label>
                  <select
                    value={newPay.customerName}
                    onChange={(e) => setNewPay({ ...newPay, customerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {SAMPLE_CUSTOMERS.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={newPay.invoiceNumber}
                    onChange={(e) => setNewPay({ ...newPay, invoiceNumber: e.target.value })}
                    placeholder="e.g. INV-2026-089"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Gross Remittance (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newPay.amount}
                    onChange={(e) => setNewPay({ ...newPay, amount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">TDS Deducted (₹)</label>
                  <input
                    type="number"
                    value={newPay.tdsDeducted}
                    onChange={(e) => setNewPay({ ...newPay, tdsDeducted: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Payment Mode</label>
                  <select
                    value={newPay.paymentMode}
                    onChange={(e) => setNewPay({ ...newPay, paymentMode: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Bank Transfer (RTGS)">Bank Transfer (RTGS)</option>
                    <option value="Cheque">Cheque</option>
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">UTR / Cheque Ref #</label>
                  <input
                    type="text"
                    required
                    value={newPay.referenceNumber}
                    onChange={(e) => setNewPay({ ...newPay, referenceNumber: e.target.value })}
                    placeholder="e.g. HDFC-RTGS-998822"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Credited Bank Account</label>
                <input
                  type="text"
                  value={newPay.bankAccount}
                  onChange={(e) => setNewPay({ ...newPay, bankAccount: e.target.value })}
                  placeholder="e.g. RZ Minetrix Canara Bank CC-4490"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
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
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
