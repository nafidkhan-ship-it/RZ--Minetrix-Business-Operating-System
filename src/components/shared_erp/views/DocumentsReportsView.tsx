import React, { useState } from 'react';
import {
  FileText,
  BarChart3,
  Download,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  ShoppingBag,
  DollarSign,
  Users
} from 'lucide-react';

interface DocumentsReportsViewProps {
  initialSubTab?: 'documents' | 'reports';
  onOpenPrintModal?: (title: string, data: any) => void;
}

export const DocumentsReportsView: React.FC<DocumentsReportsViewProps> = ({
  initialSubTab = 'documents',
  onOpenPrintModal
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'reports'>(initialSubTab);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const DOCUMENTS = [
    { title: 'Tax Invoice (INV-2026-081)', category: 'Commercial Billing', party: 'Thomas Mathew (Sobha)', date: '2026-02-21' },
    { title: 'Purchase Order (PO-2026-9041)', category: 'Procurement', party: 'Sandvik Mining Spares', date: '2026-02-18' },
    { title: 'Goods Receipt Note (GRN-2026-8801)', category: 'Receiving Log', party: 'Bharat Petroleum', date: '2026-02-21' },
    { title: 'Security Gate Pass (GP-OUT-1092)', category: 'Dispatch Pass', party: 'KL-11-BH-9921', date: '2026-02-21' },
    { title: 'Staff Salary Slip (EMP-001 Rajesh Nair)', category: 'Workforce HRMS', party: 'Quarry Supervisor', date: '2026-02-28' },
    { title: 'Advance Disbursement Receipt (ADV-012)', category: 'HR Advance', party: 'Arun Varma (Driver)', date: '2026-02-10' },
    { title: 'Stakeholder Settlement Statement (SET-041)', category: 'Ownership Split', party: 'K. P. Moideenkutty', date: '2026-02-01' }
  ];

  const REPORTS = [
    { title: 'Daily Extraction & Dispatch Reconciliation', type: 'Operations', metric: '1,840 MT / Day', desc: 'Cross-checks weighbridge gross/tare against pit blasting face volume' },
    { title: 'Commercial Sales & Aging Debtor Report', type: 'Sales & Receivables', metric: '₹34,60,000 Receivables', desc: 'Overdue debtor buckets: 0-15 days, 16-30 days, 31-60 days' },
    { title: 'Diesel Burn & Fleet Mileage Run-Rate', type: 'Fleet & Equipment', metric: '0.68 Litre / MT', desc: 'Specific diesel consumption across excavators, wheel loaders, and dumpers' },
    { title: 'Executive Profit & Loss Statement (P&L)', type: 'Finance & Treasury', metric: 'Net Margin 32.4%', desc: 'Unified accounting ledger consolidating all 10 ecosystem platforms' },
    { title: 'Quarry Concession Royalty Audit', type: 'Ownership & Land', metric: '₹45,000 Moideenkutty', desc: 'Per-load extraction royalty reconciliation against land lessor agreement' }
  ];

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
              VAULT &bull; LEGAL DMS &amp; BUSINESS INTELLIGENCE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            {activeTab === 'documents' ? (
              <>
                <FileText className="w-6 h-6 text-purple-400" />
                <span>Central Document Vault (Invoices, POs, Passes &amp; Slips)</span>
              </>
            ) : (
              <>
                <BarChart3 className="w-6 h-6 text-amber-400" />
                <span>Cross-Platform Operational BI &amp; Reports</span>
              </>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Central repository for previewing, printing, and exporting all 10-platform financial vouchers, contracts, and multi-tenant management reports.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'bg-purple-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents ({DOCUMENTS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'reports'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Reports ({REPORTS.length})</span>
          </button>
        </div>
      </div>

      {/* 1. DOCUMENTS LIST */}
      {activeTab === 'documents' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-sm">Archived Legal Vouchers &amp; Receipts</h3>
            <span className="text-xs font-mono text-slate-500">Universal Print &amp; PDF Engine</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {DOCUMENTS.map((doc, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm font-sans">{doc.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold">
                      {doc.category}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Beneficiary / Party: {doc.party} &bull; Generated: {doc.date}
                  </div>
                </div>

                <div className="flex items-center gap-2 font-sans">
                  <button
                    onClick={() => onOpenPrintModal?.(doc.title, doc)}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. BI REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REPORTS.map((rep, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                      {rep.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">{rep.metric}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-2">{rep.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => showToast(`Exported ${rep.title} to Excel spreadsheet`)}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Excel (.xlsx)</span>
                  </button>
                  <button
                    onClick={() => onOpenPrintModal?.(rep.title, rep)}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
