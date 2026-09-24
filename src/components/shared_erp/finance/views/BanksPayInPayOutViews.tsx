import React, { useState } from 'react';
import {
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Printer,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Calendar,
  X,
  CreditCard,
  Building2,
  DollarSign
} from 'lucide-react';
import { BankAccountItem, BankTransactionItem, PayInVoucher, PayOutVoucher } from '../types';
import {
  MOCK_BANKS,
  MOCK_BANK_TRANSACTIONS,
  MOCK_PAY_IN_VOUCHERS,
  MOCK_PAY_OUT_VOUCHERS
} from '../financeMockData';

// =========================================================================
// 1. BANKS VIEW (Multi-Bank, Transfer Tagging, Accounts)
// =========================================================================
export const BanksView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onNavigateTab?: (tab: string) => void;
}> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [banks, setBanks] = useState<BankAccountItem[]>(MOCK_BANKS);
  const [transactions, setTransactions] = useState<BankTransactionItem[]>(MOCK_BANK_TRANSACTIONS);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState('200000');
  const [fromBank, setFromBank] = useState('HDFC Bank');
  const [toBank, setToBank] = useState('State Bank of India');

  const handleExecuteTransfer = () => {
    const amt = parseFloat(transferAmount) || 0;
    if (fromBank === toBank) {
      onToast('Error: Source and Destination banks cannot be identical');
      return;
    }

    // Update balances
    setBanks((prev) =>
      prev.map((b) => {
        if (b.bankName === fromBank) {
          return { ...b, currentBalance: b.currentBalance - amt, todayOut: b.todayOut + amt };
        }
        if (b.bankName === toBank) {
          return { ...b, currentBalance: b.currentBalance + amt, todayIn: b.todayIn + amt };
        }
        return b;
      })
    );

    // Record as TRANSFER (explicitly not income or expense)
    const newTxn: BankTransactionItem = {
      id: `TXN-${Date.now()}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      bankName: `${fromBank} → ${toBank}`,
      reference: `TRF-INT-${Math.floor(1000 + Math.random() * 9000)}`,
      description: `Internal Treasury Transfer (${fromBank} to ${toBank})`,
      type: 'TRANSFER',
      isTransfer: true,
      fromAccount: fromBank,
      toAccount: toBank,
      amount: amt,
      balance: 0,
      reconciled: true
    };

    setTransactions([newTxn, ...transactions]);
    setIsTransferModalOpen(false);
    onToast(`Treasury Transfer executed: ₹${amt.toLocaleString('en-IN')} moved from ${fromBank} to ${toBank}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-400" />
            <span>Multi-Bank Command Center &amp; Treasury Balances</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of operating accounts, escrow deposits, and internal transfers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Bank-to-Bank Transfer</span>
          </button>
          <button
            onClick={() => onNavigateTab?.('reconciliation')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>Reconcile Statements</span>
          </button>
          <button
            onClick={() => setIsAddBankModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bank</span>
          </button>
        </div>
      </div>

      {/* 3 Bank Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {banks.map((b) => (
          <div
            key={b.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {b.type} ACCOUNT &bull; {b.branch}
                </span>
                <h3 className="text-base font-bold text-white">{b.bankName}</h3>
                <span className="text-xs font-mono text-slate-500">A/C: {b.accountNumber}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Landmark className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Opening Balance:</span>
                <span className="text-slate-300">₹{b.openingBalance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Today's Inflow:</span>
                <span className="text-emerald-400 font-bold">+₹{b.todayIn.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Today's Outflow:</span>
                <span className="text-rose-400 font-bold">-₹{b.todayOut.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
                <span className="text-slate-300 font-bold font-sans">Current Balance:</span>
                <span className="text-lg font-black text-cyan-400">₹{b.currentBalance.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                onClick={() => onToast(`Generating statement for ${b.bankName}`)}
                className="text-amber-400 hover:underline font-bold text-[11px] cursor-pointer"
              >
                Download Statement &rarr;
              </button>
              <button
                onClick={() => {
                  setFromBank(b.bankName);
                  setIsTransferModalOpen(true);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold cursor-pointer"
              >
                Transfer Funds
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bank Transactions Register */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl space-y-3 p-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white">Bank Transaction Ledger</h3>
            <p className="text-[11px] text-slate-400">
              Internal transfers are highlighted specifically as neutral liquidity rebalancing.
            </p>
          </div>
          <button
            onClick={() => onOpenPrintModal?.('Consolidated Bank Transaction Register', transactions)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Register</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Date &amp; Time</th>
                <th className="py-2.5 px-4">Bank Account</th>
                <th className="py-2.5 px-4">Reference</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4">Classification</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions.map((t) => {
                const isTransfer = t.type === 'TRANSFER' || t.isTransfer;
                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-slate-850/60 transition ${
                      isTransfer ? 'bg-blue-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-slate-400">{t.date}</td>
                    <td className="py-3 px-4 font-bold text-white font-sans">{t.bankName}</td>
                    <td className="py-3 px-4 text-amber-400 font-bold">{t.reference}</td>
                    <td className="py-3 px-4 text-slate-300 font-sans">{t.description}</td>
                    <td className="py-3 px-4 font-sans">
                      {isTransfer ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                          TRANSFER (NEUTRAL)
                        </span>
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            t.type === 'CUSTOMER_PAYMENT' || t.type === 'DEPOSIT'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {t.type.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-bold">
                      {isTransfer ? (
                        <span className="text-blue-400 font-black">
                          ⇄ ₹{t.amount.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span
                          className={
                            t.type === 'CUSTOMER_PAYMENT' || t.type === 'DEPOSIT'
                              ? 'text-emerald-400'
                              : 'text-rose-400'
                          }
                        >
                          {t.type === 'CUSTOMER_PAYMENT' || t.type === 'DEPOSIT' ? '+' : '-'}₹
                          {t.amount.toLocaleString('en-IN')}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      {t.reconciled ? (
                        <span className="text-emerald-400 font-bold text-[10px] flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Matched</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold text-[10px] flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Unmatched</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Transfer Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                  Treasury Rebalancing
                </span>
                <h3 className="text-base font-bold text-white">Bank-to-Bank Transfer</h3>
              </div>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-mono">
              <strong>Notice:</strong> This transaction will be classified strictly as an internal <strong>TRANSFER</strong>, having zero net impact on corporate income or operating expenses.
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Source Bank Account</label>
                <select
                  value={fromBank}
                  onChange={(e) => setFromBank(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                >
                  <option value="HDFC Bank">HDFC Bank (Current A/C)</option>
                  <option value="State Bank of India">State Bank of India (Escrow)</option>
                  <option value="Federal Bank">Federal Bank (Fuel &amp; Fleet)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Destination Bank Account</label>
                <select
                  value={toBank}
                  onChange={(e) => setToBank(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                >
                  <option value="State Bank of India">State Bank of India (Escrow)</option>
                  <option value="HDFC Bank">HDFC Bank (Current A/C)</option>
                  <option value="Federal Bank">Federal Bank (Fuel &amp; Fleet)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">Transfer Amount (₹)</label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteTransfer}
                className="px-4 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black cursor-pointer shadow-md shadow-blue-500/20"
              >
                Execute Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Modal */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Corporate Bank Account</h3>
              <button
                onClick={() => setIsAddBankModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. Axis Bank, ICICI Bank"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Account Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9190200388102"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">IFSC Code &amp; Branch</label>
                <input
                  type="text"
                  placeholder="e.g. UTIB0001021 - Calicut Branch"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsAddBankModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsAddBankModalOpen(false);
                  onToast('Configured new corporate bank account');
                }}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black cursor-pointer"
              >
                Save Bank Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. PAY-IN VOUCHERS VIEW (Customer Payment, Advance, Cash/Bank Receipts)
// =========================================================================
export const PayInVoucherView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [vouchers, setVouchers] = useState<PayInVoucher[]>(MOCK_PAY_IN_VOUCHERS);
  const [partyInput, setPartyInput] = useState('Sobha Developers Ltd');
  const [sourceInput, setSourceInput] = useState<PayInVoucher['source']>('Customer Payment');
  const [amountInput, setAmountInput] = useState('50000');
  const [modeInput, setModeInput] = useState<PayInVoucher['paymentMode']>('NEFT/RTGS');
  const [accountInput, setAccountInput] = useState('HDFC Operating Current A/C');
  const [referenceInput, setReferenceInput] = useState('UTR: CMS99210081');
  const [notesInput, setNotesInput] = useState('Part settlement against Tax Invoice');

  const handleSave = (actionType: 'save' | 'print' | 'pdf') => {
    const amt = parseFloat(amountInput) || 0;
    const newVoucher: PayInVoucher = {
      id: `PI-${Date.now()}`,
      voucherNo: `PI-2026-00${vouchers.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      party: partyInput,
      source: sourceInput,
      amount: amt,
      paymentMode: modeInput,
      account: accountInput,
      reference: referenceInput,
      notes: notesInput,
      status: 'VERIFIED'
    };
    setVouchers([newVoucher, ...vouchers]);

    if (actionType === 'print') {
      onOpenPrintModal?.(`Pay-In Voucher: ${newVoucher.voucherNo}`, newVoucher);
      onToast(`Saved and opened Print dialog for ${newVoucher.voucherNo}`);
    } else if (actionType === 'pdf') {
      onToast(`Generated and saved PDF for ${newVoucher.voucherNo}`);
    } else {
      onToast(`Successfully saved Pay-In Voucher ${newVoucher.voucherNo} (₹${amt.toLocaleString('en-IN')})`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pay-In Voucher Builder Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              Cash &amp; Bank Inward Treasury
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
              <span>Pay-In Voucher Interface</span>
            </h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold">
            Voucher Auto-ID: PI-2026-00{vouchers.length + 1}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Party / Payer Name</label>
            <input
              type="text"
              value={partyInput}
              onChange={(e) => setPartyInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Payment Source</label>
            <select
              value={sourceInput}
              onChange={(e) => setSourceInput(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              <option value="Customer Payment">Customer Payment</option>
              <option value="Customer Advance">Customer Advance</option>
              <option value="Cash Receipt">Cash Receipt</option>
              <option value="Bank Receipt">Bank Receipt</option>
              <option value="Other Income">Other Income</option>
              <option value="Partner Investment">Partner Investment</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Inward Amount (₹)</label>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500 text-base text-emerald-400"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Payment Mode</label>
            <select
              value={modeInput}
              onChange={(e) => setModeInput(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              <option value="NEFT/RTGS">NEFT / RTGS Wire Transfer</option>
              <option value="UPI">UPI Instant QR</option>
              <option value="CASH">Cash Desk Currency</option>
              <option value="CHEQUE">Cheque Clearance</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Destination Bank / Cash Account</label>
            <select
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              <option value="HDFC Operating Current A/C">HDFC Operating Current A/C</option>
              <option value="State Bank of India">State Bank of India (Escrow)</option>
              <option value="Federal Bank Fleet & Fuel A/C">Federal Bank Fleet &amp; Fuel A/C</option>
              <option value="Pithead Main Cash Box">Pithead Main Cash Box</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Reference / UTR / Cheque #</label>
            <input
              type="text"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-slate-400 font-bold block mb-1.5">Notes / Purpose Details</label>
            <input
              type="text"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Supporting Attachment</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToast('Attached file: payment_proof_slip.pdf')}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Proof / Cheque Scan</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => handleSave('save')}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
          >
            Save Voucher
          </button>
          <button
            onClick={() => handleSave('print')}
            className="px-5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Save &amp; Print</span>
          </button>
          <button
            onClick={() => handleSave('pdf')}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Save &amp; PDF</span>
          </button>
        </div>
      </div>

      {/* Pay-In Vouchers History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Recent Verified Pay-In Vouchers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Party</th>
                <th className="py-3 px-4">Source</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 text-amber-400 font-bold">{v.voucherNo}</td>
                  <td className="py-3 px-4 text-slate-400">{v.date}</td>
                  <td className="py-3 px-4 text-white font-sans font-bold">{v.party}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {v.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[180px]">{v.account}</td>
                  <td className="py-3 px-4 text-slate-300">{v.paymentMode}</td>
                  <td className="py-3 px-4 text-right font-black text-emerald-400">
                    +₹{v.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <button
                      onClick={() => onOpenPrintModal?.(`Pay-In Receipt: ${v.voucherNo}`, v)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
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
// 3. PAY-OUT VOUCHERS VIEW (Suppliers, Land Owners, Partners, Staff, Fleet)
// =========================================================================
export const PayOutVoucherView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [vouchers, setVouchers] = useState<PayOutVoucher[]>(MOCK_PAY_OUT_VOUCHERS);
  const [partyInput, setPartyInput] = useState('Bharat Petroleum Commercial');
  const [categoryInput, setCategoryInput] = useState<PayOutVoucher['category']>('Supplier Payment');
  const [amountInput, setAmountInput] = useState('45000');
  const [modeInput, setModeInput] = useState<PayOutVoucher['paymentMode']>('NEFT/RTGS');
  const [accountInput, setAccountInput] = useState('Federal Bank Fleet & Fuel A/C');
  const [referenceInput, setReferenceInput] = useState('RTGS-BPCL-9921');
  const [notesInput, setNotesInput] = useState('Diesel bowser fuel consignment payment');

  const handleSave = (actionType: 'save' | 'print' | 'pdf') => {
    const amt = parseFloat(amountInput) || 0;
    const newVoucher: PayOutVoucher = {
      id: `PO-${Date.now()}`,
      voucherNo: `PO-2026-00${vouchers.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      party: partyInput,
      category: categoryInput,
      amount: amt,
      paymentMode: modeInput,
      account: accountInput,
      reference: referenceInput,
      notes: notesInput,
      status: 'PAID'
    };
    setVouchers([newVoucher, ...vouchers]);

    if (actionType === 'print') {
      onOpenPrintModal?.(`Pay-Out Voucher: ${newVoucher.voucherNo}`, newVoucher);
      onToast(`Saved and opened Print dialog for ${newVoucher.voucherNo}`);
    } else if (actionType === 'pdf') {
      onToast(`Generated and saved PDF for ${newVoucher.voucherNo}`);
    } else {
      onToast(`Successfully saved Pay-Out Voucher ${newVoucher.voucherNo} (₹${amt.toLocaleString('en-IN')})`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Pay-Out Voucher Builder Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
              Disbursement &amp; Settlement Outflow
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <ArrowUpRight className="w-5 h-5 text-rose-400" />
              <span>Pay-Out Voucher Interface</span>
            </h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-bold">
            Voucher Auto-ID: PO-2026-00{vouchers.length + 1}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Payee / Beneficiary Name</label>
            <input
              type="text"
              value={partyInput}
              onChange={(e) => setPartyInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-medium focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Expense / Payout Category</label>
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              <option value="Supplier Payment">Supplier Payment</option>
              <option value="Land Owner Payment">Land Owner Payment</option>
              <option value="Partner Payment">Partner Payment</option>
              <option value="Staff Payment">Staff Payment</option>
              <option value="Vehicle Expense">Vehicle Expense</option>
              <option value="Salary">Salary</option>
              <option value="Purchase">Purchase</option>
              <option value="Expense">Expense</option>
              <option value="EMI">EMI</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Disbursement Amount (₹)</label>
            <input
              type="number"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:border-amber-500 text-base text-rose-400"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Disbursement Mode</label>
            <select
              value={modeInput}
              onChange={(e) => setModeInput(e.target.value as any)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              <option value="NEFT/RTGS">NEFT / RTGS Wire Transfer</option>
              <option value="UPI">UPI Instant</option>
              <option value="CASH">Cash Desk Outflow</option>
              <option value="CHEQUE">Corporate Cheque</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Disbursing Account</label>
            <select
              value={accountInput}
              onChange={(e) => setAccountInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
            >
              <option value="Federal Bank Fleet & Fuel A/C">Federal Bank Fleet &amp; Fuel A/C</option>
              <option value="HDFC Operating Current A/C">HDFC Operating Current A/C</option>
              <option value="State Bank of India">State Bank of India (Escrow)</option>
              <option value="Pithead Main Cash Box">Pithead Main Cash Box</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Transaction Reference</label>
            <input
              type="text"
              value={referenceInput}
              onChange={(e) => setReferenceInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:border-amber-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-slate-400 font-bold block mb-1.5">Expenditure Notes &amp; Voucher Justification</label>
            <input
              type="text"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1.5">Vendor Invoice / Voucher Bill Scan</label>
            <button
              type="button"
              onClick={() => onToast('Attached vendor invoice: bpcl_diesel_bill_9921.pdf')}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-rose-400" />
              <span>Attach Vendor Bill / Receipt</span>
            </button>
          </div>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={() => handleSave('save')}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs cursor-pointer"
          >
            Save Voucher
          </button>
          <button
            onClick={() => handleSave('print')}
            className="px-5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Save &amp; Print</span>
          </button>
          <button
            onClick={() => handleSave('pdf')}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/20"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Save &amp; PDF</span>
          </button>
        </div>
      </div>

      {/* Pay-Out Vouchers Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">Recent Approved Pay-Out Vouchers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Voucher #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Payee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Mode</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {vouchers.map((v) => (
                <tr key={v.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 text-amber-400 font-bold">{v.voucherNo}</td>
                  <td className="py-3 px-4 text-slate-400">{v.date}</td>
                  <td className="py-3 px-4 text-white font-sans font-bold">{v.party}</td>
                  <td className="py-3 px-4 font-sans">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-bold">
                      {v.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[180px]">{v.account}</td>
                  <td className="py-3 px-4 text-slate-300">{v.paymentMode}</td>
                  <td className="py-3 px-4 text-right font-black text-rose-400">
                    -₹{v.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <button
                      onClick={() => onOpenPrintModal?.(`Pay-Out Voucher: ${v.voucherNo}`, v)}
                      className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>
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

export const PayInView = PayInVoucherView;
export const PayOutView = PayOutVoucherView;
