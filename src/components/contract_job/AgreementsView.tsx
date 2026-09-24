import React, { useState } from 'react';
import {
  FileSignature,
  Search,
  Plus,
  Filter,
  Eye,
  Printer,
  Download,
  PenTool,
  CheckCircle2,
  Calendar,
  DollarSign,
  Briefcase,
  ShieldCheck,
  X,
  FileText
} from 'lucide-react';
import {
  Agreement,
  AgreementStatus,
  SAMPLE_AGREEMENTS,
  SAMPLE_CUSTOMERS
} from '../../data/contractJobStudioData';

interface AgreementsViewProps {
  onOpenDocuments: (agreementNumber: string) => void;
  onOpenJob: (jobId: string) => void;
}

export const AgreementsView: React.FC<AgreementsViewProps> = ({
  onOpenDocuments,
  onOpenJob
}) => {
  const [agreements, setAgreements] = useState<Agreement[]>(SAMPLE_AGREEMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedAgr, setSelectedAgr] = useState<Agreement | null>(null);
  const [signingAgr, setSigningAgr] = useState<Agreement | null>(null);
  const [signatoryName, setSignatoryName] = useState('Er. Sandeep Hegde');
  const [signatoryTitle, setSignatoryTitle] = useState('Chief Project Engineer');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Agreement state
  const [newAgr, setNewAgr] = useState<Partial<Agreement>>({
    customerName: SAMPLE_CUSTOMERS[0]?.name || '',
    customerId: SAMPLE_CUSTOMERS[0]?.id || '',
    quotationNumber: 'QT-2026-042',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    contractValue: 5000000,
    scopeSummary: 'Crushed Granite & Road Metal Staged Mobilization',
    paymentTerms: '15% Advance, Monthly RA Bills, 5% Retention',
    retentionPercent: 5,
    advancePercent: 15,
    milestonesCount: 3,
    termsAndConditions: 'All work subject to MORTH & Bureau of Indian Standards compliance.',
    signatureStatus: 'Drafted',
    status: 'Draft'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Agreement = {
      agreementNumber: `AGR-2026-0${18 + agreements.length + 1}`,
      customerName: newAgr.customerName || 'Direct Customer',
      customerId: newAgr.customerId || 'CUST-1001',
      jobId: `JOB-400${agreements.length + 1}`,
      quotationNumber: newAgr.quotationNumber || 'QT-2026-042',
      startDate: newAgr.startDate || '2026-10-01',
      endDate: newAgr.endDate || '2026-12-31',
      contractValue: Number(newAgr.contractValue) || 3000000,
      scopeSummary: newAgr.scopeSummary || 'Standard Quarry / Crusher Supply Agreement',
      paymentTerms: newAgr.paymentTerms || '30 Days Net Milestone',
      retentionPercent: Number(newAgr.retentionPercent) || 5,
      advancePercent: Number(newAgr.advancePercent) || 10,
      milestonesCount: Number(newAgr.milestonesCount) || 3,
      termsAndConditions: newAgr.termsAndConditions || 'Standard commercial contract clauses apply.',
      documentsCount: 2,
      signatureStatus: 'Drafted',
      status: 'Draft'
    };

    setAgreements([created, ...agreements]);
    setIsAddModalOpen(false);
    showToast(`Agreement ${created.agreementNumber} drafted successfully`);
  };

  const handleExecuteSignature = () => {
    if (!signingAgr) return;
    setAgreements(
      agreements.map((a) =>
        a.agreementNumber === signingAgr.agreementNumber
          ? {
              ...a,
              signatureStatus: 'Fully Executed (E-Signed)',
              status: 'Active',
              signedDate: '2026-09-23'
            }
          : a
      )
    );
    showToast(`E-Signature applied by ${signatoryName} for ${signingAgr.agreementNumber}`);
    setSigningAgr(null);
  };

  const filteredAgreements = agreements.filter((a) => {
    const matchesSearch =
      a.agreementNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.scopeSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.quotationNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
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
              Legal Contracts
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              {filteredAgreements.length} Executed
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Agreement & Contract Management</h2>
          <p className="text-xs text-slate-400">
            Retention guarantee clauses, advance payments, milestone schedules, digital e-signatures, and legal terms.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ New Agreement</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search agreements by number, customer, scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Under Review">Under Review</option>
            <option value="Sent">Sent</option>
            <option value="Signed">Signed</option>
            <option value="Active">Active</option>
            <option value="Expiring">Expiring</option>
            <option value="Completed">Completed</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
      </div>

      {/* Agreements Cards Grid */}
      <div className="space-y-4">
        {filteredAgreements.map((agr) => (
          <div
            key={agr.agreementNumber}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-cyan-400">
                    {agr.agreementNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    Quote Ref: {agr.quotationNumber}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      agr.status === 'Active' || agr.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : agr.status === 'Under Review'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {agr.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{agr.customerName}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>
                    Contract Term: {agr.startDate} &rarr; {agr.endDate}
                  </span>
                  <span>&bull;</span>
                  <span>Job ID: {agr.jobId}</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-500">Contract Total Value</div>
                <div className="text-2xl font-black text-white font-mono mt-0.5">
                  ₹{agr.contractValue.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-cyan-400 font-semibold">
                  Advance: {agr.advancePercent}% &bull; Retention: {agr.retentionPercent}%
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed p-3 bg-slate-950/70 rounded-2xl border border-slate-800/80">
              <strong className="text-slate-400 font-mono text-[10px] uppercase block mb-0.5">
                Contract Scope:
              </strong>
              {agr.scopeSummary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 text-[10px]">Payment Terms</span>
                <div className="text-slate-200 font-medium truncate mt-0.5">{agr.paymentTerms}</div>
              </div>
              <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 text-[10px]">Milestones</span>
                <div className="text-white font-mono font-bold mt-0.5">{agr.milestonesCount} Scheduled</div>
              </div>
              <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 text-[10px]">Legal Documents</span>
                <div className="text-white font-mono font-bold mt-0.5">{agr.documentsCount} Files Attached</div>
              </div>
              <div className="p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/60">
                <span className="text-slate-500 text-[10px]">Signature Status</span>
                <div
                  className={`font-semibold mt-0.5 truncate ${
                    agr.signatureStatus.includes('Fully Executed')
                      ? 'text-emerald-400'
                      : 'text-amber-400'
                  }`}
                >
                  {agr.signatureStatus}
                </div>
              </div>
            </div>

            {/* Actions (Preview, Print, PDF, Signature, Documents) */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedAgr(agr)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Preview Agreement"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => showToast(`Printing Agreement ${agr.agreementNumber}...`)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Print Agreement"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => showToast(`Exported Agreement PDF`)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>

                <button
                  onClick={() => onOpenDocuments(agr.agreementNumber)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition flex items-center gap-1 cursor-pointer"
                  title="Documents"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Documents ({agr.documentsCount})</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSigningAgr(agr)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-bold transition border border-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Digital Signature</span>
                </button>

                <button
                  onClick={() => onOpenJob(agr.jobId)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Open Job {agr.jobId}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DIGITAL SIGNATURE MODAL */}
      {signingAgr && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Execute Digital Signature</h3>
                  <div className="text-xs text-slate-400 font-mono">
                    {signingAgr.agreementNumber} &bull; {signingAgr.customerName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSigningAgr(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Contract Value:</span>
                <span className="text-white font-mono font-bold">
                  ₹{signingAgr.contractValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Current Status:</span>
                <span className="text-amber-400 font-semibold">{signingAgr.signatureStatus}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Authorized Signatory Name</label>
                <input
                  type="text"
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Signatory Title / Designation</label>
                <input
                  type="text"
                  value={signatoryTitle}
                  onChange={(e) => setSignatoryTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              {/* Digital E-Sign Canvas / Pad simulation */}
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Cryptographic Signature Stamp
                </label>
                <div className="h-24 bg-slate-950 rounded-xl border border-slate-800 border-dashed flex flex-col items-center justify-center text-center p-3">
                  <div className="font-serif italic text-lg text-emerald-400 font-bold tracking-wide">
                    {signatoryName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    SHA-256 E-SIGN: RZ-MINETRIX-{Date.now().toString(16).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSigningAgr(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSignature}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Apply E-Signature & Activate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW AGREEMENT MODAL */}
      {selectedAgr && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {selectedAgr.agreementNumber}
                </span>
                <h3 className="text-base font-black text-white">Commercial Contract Agreement</h3>
                <div className="text-xs text-slate-400">{selectedAgr.customerName}</div>
              </div>

              <button
                onClick={() => setSelectedAgr(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-white uppercase font-mono text-[10px] tracking-wider text-slate-400">
                1. Scope of Work
              </h4>
              <p className="text-slate-300 leading-relaxed">{selectedAgr.scopeSummary}</p>

              <h4 className="font-bold text-white uppercase font-mono text-[10px] tracking-wider text-slate-400 pt-2 border-t border-slate-800/80">
                2. Financial Consideration & Value
              </h4>
              <div className="grid grid-cols-2 gap-2 text-slate-300">
                <div>
                  Total Contract Value:{' '}
                  <strong className="text-white font-mono">
                    ₹{selectedAgr.contractValue.toLocaleString('en-IN')}
                  </strong>
                </div>
                <div>
                  Mobilization Advance:{' '}
                  <strong className="text-white font-mono">{selectedAgr.advancePercent}%</strong>
                </div>
                <div>
                  Retention Deducted:{' '}
                  <strong className="text-white font-mono">{selectedAgr.retentionPercent}%</strong>
                </div>
                <div>
                  Milestones Scheduled:{' '}
                  <strong className="text-white font-mono">{selectedAgr.milestonesCount} Milestones</strong>
                </div>
              </div>

              <h4 className="font-bold text-white uppercase font-mono text-[10px] tracking-wider text-slate-400 pt-2 border-t border-slate-800/80">
                3. Terms & Statutory Conditions
              </h4>
              <p className="text-slate-300 leading-relaxed">{selectedAgr.termsAndConditions}</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                Status: {selectedAgr.signatureStatus}
              </span>
              <button
                onClick={() => {
                  const a = selectedAgr;
                  setSelectedAgr(null);
                  setSigningAgr(a);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Digital Signature Pad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW AGREEMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-emerald-400" />
                <span>Draft New Commercial Agreement</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAgreement} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Customer / Client *</label>
                <select
                  value={newAgr.customerId}
                  onChange={(e) => {
                    const found = SAMPLE_CUSTOMERS.find((c) => c.id === e.target.value);
                    setNewAgr({
                      ...newAgr,
                      customerId: e.target.value,
                      customerName: found ? found.name : ''
                    });
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  {SAMPLE_CUSTOMERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Quotation Reference</label>
                  <input
                    type="text"
                    value={newAgr.quotationNumber}
                    onChange={(e) => setNewAgr({ ...newAgr, quotationNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Contract Value (₹) *</label>
                  <input
                    type="number"
                    value={newAgr.contractValue}
                    onChange={(e) => setNewAgr({ ...newAgr, contractValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newAgr.startDate}
                    onChange={(e) => setNewAgr({ ...newAgr, startDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={newAgr.endDate}
                    onChange={(e) => setNewAgr({ ...newAgr, endDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Advance (%)</label>
                  <input
                    type="number"
                    value={newAgr.advancePercent}
                    onChange={(e) => setNewAgr({ ...newAgr, advancePercent: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-medium mb-1">Retention Guarantee (%)</label>
                  <input
                    type="number"
                    value={newAgr.retentionPercent}
                    onChange={(e) => setNewAgr({ ...newAgr, retentionPercent: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Scope Summary *</label>
                <textarea
                  rows={2}
                  required
                  value={newAgr.scopeSummary}
                  onChange={(e) => setNewAgr({ ...newAgr, scopeSummary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Payment & Billing Terms</label>
                <input
                  type="text"
                  value={newAgr.paymentTerms}
                  onChange={(e) => setNewAgr({ ...newAgr, paymentTerms: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Save Agreement Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
