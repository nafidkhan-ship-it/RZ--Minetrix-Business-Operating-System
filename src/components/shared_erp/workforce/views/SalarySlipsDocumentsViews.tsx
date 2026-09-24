import React, { useState } from 'react';
import {
  FileText,
  FolderLock,
  Printer,
  Download,
  Share2,
  Eye,
  Plus,
  Upload,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';
import { StaffDocument, DocumentStatus, WorkforceSectionTab } from '../types';
import { MOCK_STAFF_DOCUMENTS, MOCK_PAYROLL_RECORDS } from '../workforceMockData';

interface ViewProps {
  onToast: (msg: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
  onNavigateTab?: (tab: WorkforceSectionTab) => void;
}

/* ========================================================================
   1. SALARY SLIPS CENTER VIEW
   ======================================================================== */
export const SalarySlipsView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [selectedRecord, setSelectedRecord] = useState(MOCK_PAYROLL_RECORDS[0]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              PAYSLIP ISSUANCE &amp; DISBURSEMENT DOSSIER
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>RZ&reg; MINETRIX Salary Slip Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise branded salary slips, statutory deduction annexures, and PDF export templates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpenPrintModal?.(`Salary Slip: ${selectedRecord.employeeName} (${selectedRecord.month})`, selectedRecord)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Current Slip</span>
          </button>
          <button
            onClick={() => onToast('Generated PDF Salary Slip download')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => onToast(`Salary slip link copied for WhatsApp/SMS sharing to ${selectedRecord.employeeName}`)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Slip</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Employee Selector List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 font-mono">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Select Employee Payslip:
          </span>
          <div className="space-y-2">
            {MOCK_PAYROLL_RECORDS.map((rec) => (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  selectedRecord.id === rec.id
                    ? 'bg-amber-500/10 border-amber-500/50 text-white'
                    : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-bold text-xs font-sans text-white">{rec.employeeName}</div>
                  <div className="text-[10px] text-slate-500">{rec.employeeId} &bull; {rec.designation}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black text-emerald-400">₹{rec.netSalary.toLocaleString('en-IN')}</div>
                  <div className="text-[9px] text-slate-500">{rec.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Full RZ MINETRIX Professional Salary Slip Layout */}
        <div className="lg:col-span-2 bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 font-mono relative">
          {/* Watermark/Emblem */}
          <div className="border-b-2 border-amber-500/30 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-lg font-black text-white tracking-wider flex items-center gap-2">
                <span className="text-amber-400">RZ&reg; MINETRIX</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  OFFICIAL PAYSLIP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                MALABAR QUARRIES &amp; CRUSHERS PVT. LTD. &bull; Calicut Laterite Concession #1
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-amber-400 block">PAY PERIOD: {selectedRecord.month.toUpperCase()}</span>
              <span className="text-[10px] text-slate-400">Ref: {selectedRecord.id}</span>
            </div>
          </div>

          {/* Staff Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block">Employee Name:</span>
              <span className="font-bold text-white font-sans text-sm">{selectedRecord.employeeName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Employee ID:</span>
              <span className="font-bold text-amber-400">{selectedRecord.employeeId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Department:</span>
              <span className="font-bold text-white font-sans">{selectedRecord.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Designation:</span>
              <span className="font-bold text-white font-sans">{selectedRecord.designation}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Working Days:</span>
              <span className="font-bold text-cyan-400">{selectedRecord.workingDays} Days</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Payment Mode:</span>
              <span className="font-bold text-white">{selectedRecord.paymentMode}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Disbursement Date:</span>
              <span className="font-bold text-white">{selectedRecord.paymentDate || '24 Mar 2026'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Slip Status:</span>
              <span className="font-bold text-emerald-400">{selectedRecord.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Earnings & Deductions Tables Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block border-b border-slate-800 pb-1.5">
                Earnings (A)
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Basic Wage / Salary:</span>
                  <span className="font-bold text-white">₹{selectedRecord.basic.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Overtime Pay:</span>
                  <span className="font-bold text-white">₹{selectedRecord.overtime.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver &amp; Field Batta:</span>
                  <span className="font-bold text-white">₹{selectedRecord.batta.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Fixed Allowances:</span>
                  <span className="font-bold text-white">₹{selectedRecord.allowances.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Production Bonus:</span>
                  <span className="font-bold text-white">₹0</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-emerald-400">
                <span>Gross Earnings:</span>
                <span>₹{selectedRecord.grossSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block border-b border-slate-800 pb-1.5">
                Deductions (B)
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Staff Advance Recovery:</span>
                  <span className="font-bold text-yellow-400">₹{selectedRecord.advanceDeduction.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Provident Fund (PF):</span>
                  <span className="font-bold text-white">₹{Math.floor(selectedRecord.otherDeductions * 0.6).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ESI Statutory:</span>
                  <span className="font-bold text-white">₹{Math.floor(selectedRecord.otherDeductions * 0.4).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TDS / Professional Tax:</span>
                  <span className="font-bold text-white">₹0</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-sm text-rose-400">
                <span>Total Deductions:</span>
                <span>₹{(selectedRecord.advanceDeduction + selectedRecord.otherDeductions).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                NET SALARY PAYABLE (A - B)
              </span>
              <span className="text-[11px] text-slate-400">Directly transferred to Federal Bank A/C ending 8422</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              ₹{selectedRecord.netSalary.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="pt-4 border-t border-slate-800 flex justify-between text-[11px] text-slate-500">
            <div>
              <span className="block font-bold text-slate-400">Prepared By:</span>
              <span>Anjali Menon (Accounts)</span>
            </div>
            <div className="text-center">
              <span className="block font-bold text-slate-400">Authorized Signatory:</span>
              <span>Nafid Khan (Managing Director)</span>
            </div>
            <div className="text-right">
              <span className="block font-bold text-slate-400">Employee Acknowledgment:</span>
              <span>Verified &bull; Electronic Token</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================
   2. STAFF DOCUMENTS VAULT VIEW
   ======================================================================== */
export const StaffDocumentsView: React.FC<ViewProps> = ({ onToast, onOpenPrintModal, onNavigateTab }) => {
  const [documents, setDocuments] = useState<StaffDocument[]>(MOCK_STAFF_DOCUMENTS);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredDocs = documents.filter((d) => {
    const matchesCat = filterCategory === 'ALL' || d.category === filterCategory;
    const matchesStat = filterStatus === 'ALL' || d.status === filterStatus;
    return matchesCat && matchesStat;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Valid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Expiring Soon':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Expired':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Missing':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              COMPLIANCE &amp; STATUTORY VAULT
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
              STUDIO PREVIEW / DEMO DATA
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-amber-400" />
            <span>Staff Document Vault &amp; License Tracking</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mining competency certificates, PESO explosive blaster licenses, HMV driving badges, and Aadhaar ID records.
          </p>
        </div>

        <button
          onClick={() => onToast('Opened Document Upload Dialog')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-wrap items-center gap-2 font-mono">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
        >
          <option value="ALL">All Categories</option>
          <option value="ID Proof">ID Proof</option>
          <option value="License">License</option>
          <option value="Certification">Certification</option>
          <option value="Employment Agreement">Employment Agreement</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-500 font-sans"
        >
          <option value="ALL">All Statuses</option>
          <option value="Valid">Valid</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Expired">Expired</option>
          <option value="Missing">Missing</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">Doc ID</th>
                <th className="py-3.5 px-4 font-bold">Employee</th>
                <th className="py-3.5 px-4 font-bold">Document Title</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Document No.</th>
                <th className="py-3.5 px-4 font-bold">Issue Date</th>
                <th className="py-3.5 px-4 font-bold">Expiry Date</th>
                <th className="py-3.5 px-4 font-bold">Status</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocs.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-amber-400 font-bold">{d.id}</td>
                  <td className="py-3 px-4">
                    <span className="text-white font-bold font-sans block">{d.employeeName}</span>
                    <span className="text-[10px] text-slate-500">{d.employeeId}</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-200 font-sans text-xs">{d.title}</td>
                  <td className="py-3 px-4 text-cyan-400 font-sans">{d.category}</td>
                  <td className="py-3 px-4 text-slate-400">{d.documentNumber}</td>
                  <td className="py-3 px-4 text-slate-400">{d.issueDate}</td>
                  <td className="py-3 px-4 text-slate-300 font-bold">{d.expiryDate}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusBadge(d.status)}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-sans">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onToast(`Viewing document ${d.title} for ${d.employeeName}`)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onToast(`Initiated renewal for ${d.title}`)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 cursor-pointer"
                        title="Renew"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
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
