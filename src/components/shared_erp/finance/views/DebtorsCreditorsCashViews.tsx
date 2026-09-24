import React, { useState } from 'react';
import {
  TrendingUp,
  CreditCard,
  Wallet,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Calendar,
  X,
  FileText
} from 'lucide-react';
import { DebtorRecord, CreditorRecord, CashTransaction } from '../types';
import { MOCK_DEBTORS, MOCK_CREDITORS, MOCK_CASH_TRANSACTIONS } from '../financeMockData';

// =========================================================================
// 1. DEBTORS VIEW (Receivables, Visual Chain, Payment & Advance Recording)
// =========================================================================
export const DebtorsView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [debtors, setDebtors] = useState<DebtorRecord[]>(MOCK_DEBTORS);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<DebtorRecord | null>(null);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isAddAdvanceOpen, setIsAddAdvanceOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('50000');
  const [paymentMode, setPaymentMode] = useState('NEFT/RTGS');

  const filtered = debtors.filter(
    (d) =>
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalReceivable = debtors.reduce((acc, d) => acc + d.balance, 0);
  const dueToday = debtors.filter((d) => d.status === 'DUE').reduce((acc, d) => acc + d.balance, 0);
  const overdue = debtors.filter((d) => d.status === 'OVERDUE').reduce((acc, d) => acc + d.balance, 0);
  const customerAdvances = debtors.reduce((acc, d) => acc + d.advance, 0);
  const collectionsToday = 145000;

  const handleSavePayment = () => {
    if (!selectedCustomer) return;
    const pAmt = parseFloat(paymentAmount) || 0;
    setDebtors((prev) =>
      prev.map((d) =>
        d.id === selectedCustomer.id
          ? {
              ...d,
              paid: d.paid + pAmt,
              balance: Math.max(0, d.balance - pAmt),
              status: d.balance - pAmt <= 0 ? 'SETTLED' : d.status
            }
          : d
      )
    );
    setIsRecordPaymentOpen(false);
    onToast(`Recorded payment of ₹${pAmt.toLocaleString('en-IN')} from ${selectedCustomer.customerName}`);
  };

  const handleSaveAdvance = () => {
    if (!selectedCustomer) return;
    const aAmt = parseFloat(paymentAmount) || 0;
    setDebtors((prev) =>
      prev.map((d) =>
        d.id === selectedCustomer.id
          ? {
              ...d,
              advance: d.advance + aAmt
            }
          : d
      )
    );
    setIsAddAdvanceOpen(false);
    onToast(`Added customer booking advance of ₹${aAmt.toLocaleString('en-IN')} for ${selectedCustomer.customerName}`);
  };

  return (
    <div className="space-y-6">
      {/* 5 Debtors KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Receivable</span>
          <div className="text-xl font-black text-cyan-400 mt-1">₹{totalReceivable.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Across 5 client accounts</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Due Today</span>
          <div className="text-xl font-black text-amber-400 mt-1">₹{dueToday.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Scheduled for today</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Overdue (&gt;15 Days)</span>
          <div className="text-xl font-black text-rose-400 mt-1">₹{overdue.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Malabar Highway Infra</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Customer Advances</span>
          <div className="text-xl font-black text-emerald-400 mt-1">₹{customerAdvances.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Held as unadjusted deposit</span>
        </div>
        <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Collections Today</span>
          <div className="text-xl font-black text-teal-400 mt-1">₹{collectionsToday.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Weighbridge &amp; bank NEFT</span>
        </div>
      </div>

      {/* Visual Ledger Chain Callout */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Customer Debtor Ledger Chain Formula
          </span>
          <span className="text-[10px] font-mono text-amber-400 font-bold">Standard Realization Model</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300">
            1. Invoice Raised
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-300">
            2. Advance Credited
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-blue-300">
            3. Payment Realized
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-yellow-300">
            4. Adjustment / Credit Note
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300">
            5. Current Balance Outstanding
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search debtors by customer name, invoice #, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Exported Debtors Ledger to CSV')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => onOpenPrintModal?.('Debtors Aging & Outstanding Statement', debtors)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Aging</span>
          </button>
        </div>
      </div>

      {/* Debtors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Invoice Date</th>
                <th className="py-3 px-4 text-right">Invoice Amount</th>
                <th className="py-3 px-4 text-right">Advance</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-white text-xs">{d.customerName}</div>
                    <div className="text-[10px] text-slate-400">{d.location} &bull; {d.phone}</div>
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-bold">{d.invoiceNo}</td>
                  <td className="py-3 px-4 text-slate-400">{d.invoiceDate}</td>
                  <td className="py-3 px-4 text-right text-slate-200 font-bold">
                    ₹{d.invoiceAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    ₹{d.advance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-blue-400">
                    ₹{d.paid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-rose-400">
                    ₹{d.balance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{d.dueDate}</td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        d.status === 'SETTLED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : d.status === 'OVERDUE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : d.status === 'DUE'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedCustomer(d)}
                        title="View Detailed Customer Ledger"
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                      >
                        Ledger
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(d);
                          setPaymentAmount(d.balance.toString());
                          setIsRecordPaymentOpen(true);
                        }}
                        title="Record Payment"
                        className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold cursor-pointer"
                      >
                        Pay
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(d);
                          setPaymentAmount('25000');
                          setIsAddAdvanceOpen(true);
                        }}
                        title="Add Customer Advance Deposit"
                        className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold cursor-pointer"
                      >
                        Advance
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Ledger Drawer Modal */}
      {selectedCustomer && !isRecordPaymentOpen && !isAddAdvanceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  Individual Debtor Statement
                </span>
                <h3 className="text-lg font-bold text-white">{selectedCustomer.customerName}</h3>
                <p className="text-xs text-slate-400">
                  Site: {selectedCustomer.location} &bull; Contact: {selectedCustomer.phone}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <span className="text-[10px] text-slate-500 block">INVOICE BILLED</span>
                <span className="text-white font-bold">₹{selectedCustomer.invoiceAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <span className="text-[10px] text-slate-500 block">TOTAL CLEARED</span>
                <span className="text-emerald-400 font-bold">₹{(selectedCustomer.paid + selectedCustomer.advance).toLocaleString('en-IN')}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs">
                <span className="text-[10px] text-slate-500 block">NET OUTSTANDING</span>
                <span className="text-rose-400 font-bold">₹{selectedCustomer.balance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2">
              <div className="text-[11px] font-bold text-slate-300">Transaction History Log:</div>
              <div className="flex justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800/80">
                <span>{selectedCustomer.invoiceDate} &bull; Tax Invoice #{selectedCustomer.invoiceNo}</span>
                <span className="text-cyan-400 font-bold">+₹{selectedCustomer.invoiceAmount.toLocaleString('en-IN')} (DR)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800/80">
                <span>Advance Booking Deposit via Bank</span>
                <span className="text-emerald-400 font-bold">-₹{selectedCustomer.advance.toLocaleString('en-IN')} (CR)</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>NEFT Payment Clearance Voucher</span>
                <span className="text-blue-400 font-bold">-₹{selectedCustomer.paid.toLocaleString('en-IN')} (CR)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => onOpenPrintModal?.(`Customer Statement: ${selectedCustomer.customerName}`, selectedCustomer)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Statement</span>
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordPaymentOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Record Customer Payment</h3>
              <button
                onClick={() => setIsRecordPaymentOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Customer</label>
                <input
                  type="text"
                  disabled
                  value={selectedCustomer.customerName}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                >
                  <option value="NEFT/RTGS">NEFT / RTGS Bank Transfer</option>
                  <option value="UPI">UPI / Instant QR</option>
                  <option value="CASH">Pithead Cash Desk</option>
                  <option value="CHEQUE">Cheque Clearance</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Target Account</label>
                <input
                  type="text"
                  disabled
                  value="HDFC Operating Current A/C (50200019283711)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 font-mono text-[11px]"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsRecordPaymentOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePayment}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shadow-md shadow-amber-500/20"
              >
                Save Payment &bull; Reduce Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Advance Modal */}
      {isAddAdvanceOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add Customer Advance Deposit</h3>
              <button
                onClick={() => setIsAddAdvanceOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Customer</label>
                <input
                  type="text"
                  disabled
                  value={selectedCustomer.customerName}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-300"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Advance Amount (₹)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Deposit Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                >
                  <option value="NEFT/RTGS">NEFT / RTGS Bank Transfer</option>
                  <option value="UPI">UPI Instant</option>
                  <option value="CASH">Cash Desk Deposit</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAddAdvanceOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAdvance}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black cursor-pointer shadow-md shadow-emerald-500/20"
              >
                Credit Advance Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. CREDITORS VIEW (Payables, Suppliers, Land Royalty, Service Providers)
// =========================================================================
export const CreditorsView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [creditors, setCreditors] = useState<CreditorRecord[]>(MOCK_CREDITORS);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = creditors.filter((c) => {
    const matchesSearch =
      c.partyName.toLowerCase().includes(search.toLowerCase()) ||
      c.billNo.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPayable = creditors.reduce((acc, c) => acc + c.balance, 0);
  const due = creditors.filter((c) => c.status === 'APPROVED' || c.status === 'PENDING').reduce((acc, c) => acc + c.balance, 0);
  const overdue = creditors.filter((c) => c.status === 'OVERDUE').reduce((acc, c) => acc + c.balance, 0);
  const advancesPaid = creditors.reduce((acc, c) => acc + c.advance, 0);
  const paymentsToday = 120000;

  return (
    <div className="space-y-6">
      {/* 5 Creditor KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Payable</span>
          <div className="text-xl font-black text-rose-400 mt-1">₹{totalPayable.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Across 5 vendor accounts</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Due</span>
          <div className="text-xl font-black text-amber-400 mt-1">₹{due.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Upcoming payment dates</span>
        </div>
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Overdue</span>
          <div className="text-xl font-black text-red-400 mt-1">₹{overdue.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Land owner royalty delay</span>
        </div>
        <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Advances Paid</span>
          <div className="text-xl font-black text-orange-400 mt-1">₹{advancesPaid.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Prepaid vendor deposits</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 col-span-2 sm:col-span-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Payments Today</span>
          <div className="text-xl font-black text-emerald-400 mt-1">₹{paymentsToday.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Fuel RTGS settled</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search creditors by party name or bill #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300"
          >
            <option value="ALL">All Categories</option>
            <option value="Supplier">Suppliers (Fuel/Spares)</option>
            <option value="Land Owner">Land Owners (Royalty)</option>
            <option value="Service Provider">Service Providers</option>
            <option value="Partner">Partners (Draws)</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Exported Creditor Payables to Excel')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => onOpenPrintModal?.('Creditor Payables Summary', creditors)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Creditors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Party</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Bill #</th>
                <th className="py-3 px-4 text-right">Bill Amount</th>
                <th className="py-3 px-4 text-right">Advance</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 font-sans">
                    <div className="font-bold text-white text-xs">{c.partyName}</div>
                    <div className="text-[10px] text-slate-400">{c.contact}</div>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-bold">{c.billNo}</td>
                  <td className="py-3 px-4 text-right text-slate-200 font-bold">
                    ₹{c.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-orange-400">
                    ₹{c.advance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-400">
                    ₹{c.paid.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-rose-400">
                    ₹{c.balance.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{c.dueDate}</td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : c.status === 'OVERDUE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : c.status === 'APPROVED'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onToast(`Opened Creditor Ledger for ${c.partyName}`)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
                      >
                        Ledger
                      </button>
                      <button
                        onClick={() => onToast(`Initiated Pay-Out Voucher for ${c.partyName} (₹${c.balance.toLocaleString('en-IN')})`)}
                        className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-[11px] font-bold cursor-pointer"
                      >
                        Pay
                      </button>
                      <button
                        onClick={() => onOpenPrintModal?.(`Vendor Statement: ${c.partyName}`, c)}
                        className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 3. CASH VIEW (Cash Management, In/Out Register, Daily Closing Balance)
// =========================================================================
export const CashView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [transactions, setTransactions] = useState<CashTransaction[]>(MOCK_CASH_TRANSACTIONS);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('15000');
  const [descInput, setDescInput] = useState('');

  const openingCash = 602200;
  const cashIn = 91800;
  const cashOut = 20900;
  const closingCash = 845200;

  const handleAddReceipt = () => {
    const amt = parseFloat(amountInput) || 0;
    const newTxn: CashTransaction = {
      id: `CSH-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      reference: `RCT-CSH-${Math.floor(1000 + Math.random() * 9000)}`,
      description: descInput || 'Direct Cash Counter Inflow',
      type: 'CASH_IN',
      amount: amt,
      user: 'Nafid Khan (Admin)',
      balance: closingCash + amt
    };
    setTransactions([newTxn, ...transactions]);
    setIsReceiptModalOpen(false);
    setDescInput('');
    onToast(`Added Cash Receipt voucher of ₹${amt.toLocaleString('en-IN')}`);
  };

  const handleAddPayment = () => {
    const amt = parseFloat(amountInput) || 0;
    const newTxn: CashTransaction = {
      id: `CSH-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      reference: `PAY-CSH-${Math.floor(1000 + Math.random() * 9000)}`,
      description: descInput || 'Pithead Cash Outflow Voucher',
      type: 'CASH_OUT',
      amount: amt,
      user: 'Nafid Khan (Admin)',
      balance: closingCash - amt
    };
    setTransactions([newTxn, ...transactions]);
    setIsPaymentModalOpen(false);
    setDescInput('');
    onToast(`Recorded Cash Payment of ₹${amt.toLocaleString('en-IN')}`);
  };

  return (
    <div className="space-y-6">
      {/* 4 Cash KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Opening Cash</span>
          <div className="text-xl font-black text-slate-200 mt-1">₹{openingCash.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Pithead float at 08:00 AM</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Cash In (Today)</span>
          <div className="text-xl font-black text-emerald-400 mt-1">+₹{cashIn.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Retail laterite &amp; customer deposits</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Cash Out (Today)</span>
          <div className="text-xl font-black text-rose-400 mt-1">-₹{cashOut.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Diesel refill &amp; driver batta</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Closing Cash</span>
          <div className="text-xl font-black text-amber-400 mt-1">₹{closingCash.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-slate-500">Verified in site safe</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-300">
            Daily Cash Book &amp; Pithead Drawer Ledger
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setAmountInput('15000');
              setDescInput('Cash Stone Sale - Retail Customer');
              setIsReceiptModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cash Receipt</span>
          </button>
          <button
            onClick={() => {
              setAmountInput('3500');
              setDescInput('Driver Emergency Trip Batta');
              setIsPaymentModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Cash Payment</span>
          </button>
          <button
            onClick={() => onToast('Audited and recorded Cash Drawer Adjustment (₹0 variance)')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
          >
            Adjustment
          </button>
          <button
            onClick={() => onToast('Performed Daily Cash Drawer Closing. Handover token #CLS-081 issued')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-amber-500/20"
          >
            Daily Closing
          </button>
        </div>
      </div>

      {/* Cash Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date &amp; Time</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4 text-right">Drawer Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 text-slate-400">{t.date}</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">{t.reference}</td>
                  <td className="py-3 px-4 text-white font-sans font-medium">{t.description}</td>
                  <td className="py-3 px-4 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.type === 'CASH_IN'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : t.type === 'CASH_OUT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {t.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold">
                    <span className={t.type === 'CASH_IN' ? 'text-emerald-400' : 'text-rose-400'}>
                      {t.type === 'CASH_IN' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{t.user}</td>
                  <td className="py-3 px-4 text-right font-black text-amber-400">
                    ₹{t.balance.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cash Receipt Modal */}
      {isReceiptModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">New Cash Receipt Voucher</h3>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Receipt Description</label>
                <input
                  type="text"
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="e.g. Laterite stone cash pickup"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReceipt}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black cursor-pointer shadow-md shadow-emerald-500/20"
              >
                Save Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">New Cash Payment Voucher</h3>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Expense Description</label>
                <input
                  type="text"
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  placeholder="e.g. Generator diesel or driver batta"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPayment}
                className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-black cursor-pointer shadow-md shadow-rose-500/20"
              >
                Record Payout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
