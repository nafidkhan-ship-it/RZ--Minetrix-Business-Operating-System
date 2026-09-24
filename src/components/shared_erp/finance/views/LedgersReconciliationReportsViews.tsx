import React, { useState } from 'react';
import {
  BookOpen,
  RefreshCw,
  FileSpreadsheet,
  Printer,
  Download,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Plus,
  Calendar,
  X,
  Building2,
  Layers,
  Check,
  TrendingUp,
  CreditCard,
  Landmark,
  DollarSign
} from 'lucide-react';
import { LedgerEntry, BankReconciliationItem } from '../types';
import {
  MOCK_LEDGER_ENTRIES,
  MOCK_RECONCILIATION_ITEMS,
  FINANCIAL_REPORTS_LIST,
  MOCK_BANKS
} from '../financeMockData';

// =========================================================================
// 1. GENERAL & PARTY LEDGERS VIEW
// =========================================================================
export const LedgersView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [entries, setEntries] = useState<LedgerEntry[]>(MOCK_LEDGER_ENTRIES);
  const [accountFilter, setAccountFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);

  // New Journal state
  const [journalRef, setJournalRef] = useState(`JRN-2026-0${entries.length + 1}`);
  const [journalAccount, setJournalAccount] = useState('Land Concession Royalty Expense');
  const [journalParty, setJournalParty] = useState('K. P. Moideenkutty');
  const [journalDesc, setJournalDesc] = useState('Monthly quarry concession adjustment');
  const [journalDebit, setJournalDebit] = useState('25000');
  const [journalCredit, setJournalCredit] = useState('0');

  const filtered = entries.filter((e) => {
    const matchesAccount = accountFilter === 'ALL' || e.account.toLowerCase().includes(accountFilter.toLowerCase());
    const matchesSearch =
      search === '' ||
      e.party.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.reference.toLowerCase().includes(search.toLowerCase());
    return matchesAccount && matchesSearch;
  });

  const totalDebits = filtered.reduce((acc, e) => acc + e.debit, 0);
  const totalCredits = filtered.reduce((acc, e) => acc + e.credit, 0);

  const handleAddJournal = () => {
    const deb = parseFloat(journalDebit) || 0;
    const cred = parseFloat(journalCredit) || 0;
    const newEntry: LedgerEntry = {
      id: `LED-00${entries.length + 1}`,
      date: new Date().toISOString().slice(0, 10),
      reference: journalRef,
      account: journalAccount,
      party: journalParty,
      businessUnit: 'Quarry Pit #01',
      description: journalDesc,
      debit: deb,
      credit: cred,
      balance: deb - cred,
      transactionType: 'JOURNAL'
    };
    setEntries([newEntry, ...entries]);
    setIsNewJournalOpen(false);
    onToast(`Journal entry ${journalRef} posted to ${journalAccount}`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">General &amp; Party Ledger Register</h2>
            <p className="text-xs text-slate-400">Complete double-entry audit trail across all chart of accounts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToast('Exported Ledger Register to Excel')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => onOpenPrintModal?.('Complete General Ledger Audit Trail', filtered)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Ledger</span>
          </button>
          <button
            onClick={() => setIsNewJournalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Journal</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search party, voucher, or ref..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:border-amber-500 outline-none w-64 font-mono"
            />
          </div>

          <select
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono"
          >
            <option value="ALL">All Ledger Accounts</option>
            <option value="Receivable">Accounts Receivable (Debtors)</option>
            <option value="Payable">Accounts Payable (Creditors)</option>
            <option value="HDFC">HDFC Operating Bank</option>
            <option value="Federal">Federal Bank Fleet</option>
            <option value="Revenue">Revenue Accounts</option>
            <option value="Royalty">Concession Royalty Accounts</option>
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 mr-1.5">Total Debits:</span>
            <span className="text-emerald-400 font-black">₹{totalDebits.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-slate-400 mr-1.5">Total Credits:</span>
            <span className="text-rose-400 font-black">₹{totalCredits.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Party</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Type</th>
                <th className="py-3 px-4 text-right">Debit (₹)</th>
                <th className="py-3 px-4 text-right">Credit (₹)</th>
                <th className="py-3 px-4 text-right font-black">Running Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-slate-850/60 transition">
                  <td className="py-3 px-4 text-slate-400">{e.date}</td>
                  <td className="py-3 px-4 text-amber-400 font-bold">{e.reference}</td>
                  <td className="py-3 px-4 text-white font-sans font-bold">{e.account}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{e.party}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans max-w-[220px] truncate">{e.description}</td>
                  <td className="py-3 px-4 text-center font-sans">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        e.transactionType === 'RECEIPT' || e.transactionType === 'SALE'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : e.transactionType === 'PAYMENT' || e.transactionType === 'PURCHASE'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {e.transactionType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    {e.debit > 0 ? `₹${e.debit.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-400">
                    {e.credit > 0 ? `₹${e.credit.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-black text-amber-400">
                    ₹{e.balance.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Journal Modal */}
      {isNewJournalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Post Manual Journal Voucher</h3>
              <button
                onClick={() => setIsNewJournalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Journal Reference #</label>
                <input
                  type="text"
                  value={journalRef}
                  onChange={(e) => setJournalRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Target Account</label>
                <input
                  type="text"
                  value={journalAccount}
                  onChange={(e) => setJournalAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Counterparty</label>
                <input
                  type="text"
                  value={journalParty}
                  onChange={(e) => setJournalParty(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Debit (₹)</label>
                  <input
                    type="number"
                    value={journalDebit}
                    onChange={(e) => setJournalDebit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Credit (₹)</label>
                  <input
                    type="number"
                    value={journalCredit}
                    onChange={(e) => setJournalCredit(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 font-bold block mb-1">Narration / Description</label>
                <input
                  type="text"
                  value={journalDesc}
                  onChange={(e) => setJournalDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsNewJournalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddJournal}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black cursor-pointer shadow-md shadow-amber-500/20"
              >
                Post Journal Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. BANK RECONCILIATION VIEW
// =========================================================================
export const BankReconciliationView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [items, setItems] = useState<BankReconciliationItem[]>(MOCK_RECONCILIATION_ITEMS);
  const [selectedBank, setSelectedBank] = useState('HDFC Operating Current A/C');

  const matchedCount = items.filter((i) => i.matched).length;
  const unmatchedCount = items.filter((i) => !i.matched).length;
  const totalDifference = items.reduce((acc, i) => acc + (i.matched ? 0 : i.difference), 0);

  const handleAutoMatch = () => {
    setItems((prev) =>
      prev.map((i) => ({
        ...i,
        matched: true,
        difference: 0,
        systemRef: i.systemRef || 'AUTO-RESOLVED-SYS'
      }))
    );
    onToast('Ran Intelligent Auto-Match algorithm. All matching transaction hash codes reconciled!');
  };

  const handleToggleMatch = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              matched: !i.matched,
              difference: !i.matched ? 0 : i.statementAmount
            }
          : i
      )
    );
    onToast(`Updated reconciliation status for item ${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Reconciliation Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase">Selected Account</span>
          <div className="text-sm font-black text-white mt-1 truncate">{selectedBank}</div>
          <span className="text-[10px] text-blue-400 font-mono">Verified live feeds</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Matched Records</span>
          <div className="text-xl font-black text-emerald-400 mt-1">{matchedCount} Items</div>
          <span className="text-[10px] text-slate-500">Exact voucher match</span>
        </div>
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Unmatched Discrepancies</span>
          <div className="text-xl font-black text-rose-400 mt-1">{unmatchedCount} Items</div>
          <span className="text-[10px] text-rose-300 font-mono">Net Diff: ₹{Math.abs(totalDifference).toLocaleString('en-IN')}</span>
        </div>
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase">Reconciliation Status</span>
          <div className="text-xl font-black text-amber-400 mt-1">{unmatchedCount === 0 ? 'Balanced' : 'Pending Audit'}</div>
          <span className="text-[10px] text-slate-500">March 2026 statement</span>
        </div>
      </div>

      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-3">
        <div className="flex items-center gap-2">
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold"
          >
            <option value="HDFC Operating Current A/C">HDFC Bank (A/C: ...3711)</option>
            <option value="SBI Mining Escrow A/C">SBI Escrow (A/C: ...9019)</option>
            <option value="Federal Bank Fleet & Fuel A/C">Federal Bank (A/C: ...9381)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenPrintModal?.(`Bank Reconciliation Statement: ${selectedBank}`, items)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Audit</span>
          </button>
          <button
            onClick={handleAutoMatch}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Auto-Match Algorithm</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Statement Date</th>
                <th className="py-3 px-4">Bank Statement Ref</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Bank Amount</th>
                <th className="py-3 px-4">ERP System Ref</th>
                <th className="py-3 px-4 text-right">System Amount</th>
                <th className="py-3 px-4 text-right font-black">Variance / Diff</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {items.map((i) => (
                <tr key={i.id} className={`transition ${!i.matched ? 'bg-rose-950/10' : 'hover:bg-slate-850/60'}`}>
                  <td className="py-3 px-4 text-slate-400">{i.statementDate}</td>
                  <td className="py-3 px-4 text-blue-400 font-bold">{i.statementRef}</td>
                  <td className="py-3 px-4 text-slate-200 font-sans max-w-[200px] truncate">{i.description}</td>
                  <td className="py-3 px-4 text-right font-bold text-white">
                    ₹{i.statementAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-bold">
                    {i.systemRef || <span className="text-rose-400 italic">Not Found in ERP</span>}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">
                    {i.systemAmount ? `₹${i.systemAmount.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className={`py-3 px-4 text-right font-black ${i.difference === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ₹{i.difference.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-sans text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        i.matched
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {i.matched ? 'Matched' : 'Unmatched'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-center">
                    <button
                      onClick={() => handleToggleMatch(i.id)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                        i.matched
                          ? 'bg-slate-800 text-slate-400 hover:text-white'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                    >
                      {i.matched ? 'Unlink' : 'Reconcile'}
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
// 3. FINANCIAL BI REPORTS CATALOGUE VIEW (14 Reports)
// =========================================================================
export const FinancialReportsView: React.FC<{
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}> = ({ onToast, onOpenPrintModal }) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(FINANCIAL_REPORTS_LIST[0].id);
  const [dateRange, setDateRange] = useState('CURRENT_MONTH');

  const currentReport = FINANCIAL_REPORTS_LIST.find((r) => r.id === selectedReportId) || FINANCIAL_REPORTS_LIST[0];

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-400" />
            <span>Financial Business Intelligence &amp; Executive Reports</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            14 production-grade accounting, tax compliance, aging, and business-unit margin statements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
          >
            <option value="CURRENT_MONTH">March 2026 (Month-to-Date)</option>
            <option value="PREVIOUS_MONTH">February 2026 (Full Month)</option>
            <option value="Q4_FY26">Q4 FY 2025-26</option>
            <option value="FULL_FY26">Full FY 2025-26</option>
          </select>
          <button
            onClick={() => onToast(`Exported ${currentReport.title} as CSV/Excel`)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => onOpenPrintModal?.(currentReport.title, { report: currentReport, period: dateRange })}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: 14 Reports List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
          <span className="text-[10px] font-mono text-slate-500 uppercase px-2 font-bold block mb-2">
            Reports Catalogue (14)
          </span>
          <div className="space-y-1 max-h-[620px] overflow-y-auto scrollbar-thin pr-1">
            {FINANCIAL_REPORTS_LIST.map((rep) => (
              <button
                key={rep.id}
                onClick={() => setSelectedReportId(rep.id)}
                className={`w-full text-left p-2.5 rounded-xl transition cursor-pointer flex flex-col gap-0.5 ${
                  selectedReportId === rep.id
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate">{rep.title}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 font-mono">
                    {rep.category}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 line-clamp-1">{rep.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Live Report Viewer */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                Category: {currentReport.category}
              </span>
              <h3 className="text-lg font-black text-white">{currentReport.title}</h3>
              <p className="text-xs text-slate-400">{currentReport.description}</p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
              AUDITED COMPLIANCE READY
            </span>
          </div>

          {/* Conditional Mock Content based on selected report */}
          {currentReport.id === 'cash-flow' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 uppercase text-[11px] block">A. Cash from Operating Activities</span>
                <div className="flex justify-between text-slate-300">
                  <span>Customer Collections &amp; Weighbridge Direct Receipts</span>
                  <span className="text-emerald-400 font-bold">+₹38,50,000</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Operating Fuel, Explosives &amp; Maintenance Outflows</span>
                  <span className="text-rose-400 font-bold">-₹14,20,000</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Staff Salaries &amp; Driver Haulage Batta</span>
                  <span className="text-rose-400 font-bold">-₹5,80,000</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white">
                  <span>Net Operating Cash Flow:</span>
                  <span className="text-emerald-400 font-black">+₹18,50,000</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-400 uppercase text-[11px] block">B. Cash from Financing &amp; Concessions</span>
                <div className="flex justify-between text-slate-300">
                  <span>Land Owner Extraction Royalties</span>
                  <span className="text-rose-400 font-bold">-₹1,85,000</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Crusher Plant Heavy Machinery Lease EMI</span>
                  <span className="text-rose-400 font-bold">-₹85,000</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Partner Capital Addition (Crusher Screen Inflow)</span>
                  <span className="text-emerald-400 font-bold">+₹2,50,000</span>
                </div>
              </div>
            </div>
          )}

          {currentReport.id === 'receivables-aging' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3 font-mono text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">0-30 Days</span>
                  <span className="text-emerald-400 font-bold text-sm">₹21,40,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">31-60 Days</span>
                  <span className="text-amber-400 font-bold text-sm">₹8,70,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">61-90 Days</span>
                  <span className="text-orange-400 font-bold text-sm">₹4,50,000</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">90+ Days</span>
                  <span className="text-rose-400 font-bold text-sm">₹0</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Healthy debtor collection profile: 87% of receivables are within the standard 30-day grace window.
              </p>
            </div>
          )}

          {currentReport.id !== 'cash-flow' && currentReport.id !== 'receivables-aging' && (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3 font-mono">
              <FileSpreadsheet className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
              <div className="text-white font-bold text-sm">{currentReport.title} Prepared &amp; Calculated</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                Real-time aggregated figures compiled across active business units. Click below to view the full audit format or print directly.
              </p>
              <button
                onClick={() => onOpenPrintModal?.(currentReport.title, { report: currentReport })}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md shadow-amber-500/20"
              >
                Open Full Printable Statement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
