import React, { useState } from 'react';
import {
  FolderOpen,
  Search,
  Plus,
  Filter,
  Eye,
  Download,
  Share2,
  Trash2,
  FileText,
  FileCheck2,
  CheckCircle2,
  Calendar,
  X
} from 'lucide-react';
import {
  JobDocument,
  DocumentCategory,
  SAMPLE_DOCUMENTS,
  SAMPLE_JOBS
} from '../../data/contractJobStudioData';

export const JobDocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<JobDocument[]>(SAMPLE_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<JobDocument | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Document form
  const [newDoc, setNewDoc] = useState<Partial<JobDocument>>({
    jobId: SAMPLE_JOBS[0]?.id || 'JOB-4001',
    title: '',
    category: 'Permits & Approvals',
    fileName: 'document.pdf',
    uploadedBy: 'Er. Rajesh Varma'
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;

    const created: JobDocument = {
      id: `DOC-2026-0${documents.length + 80}`,
      jobId: newDoc.jobId || 'JOB-4001',
      title: newDoc.title,
      category: (newDoc.category as DocumentCategory) || 'Agreements',
      fileName: newDoc.fileName || `${newDoc.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '2.4 MB',
      uploadDate: '2026-09-24',
      uploadedBy: newDoc.uploadedBy || 'Site Engineer',
      fileUrl: '#'
    };

    setDocuments([created, ...documents]);
    setIsAddModalOpen(false);
    showToast(`Uploaded document: ${created.title}`);
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    showToast(`Document ${id} removed from repository`);
  };

  const filtered = documents.filter((d) => {
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.jobId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter;

    return matchesSearch && matchesCategory;
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
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              Document Vault
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">
              {filtered.length} Archived Files
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">Job Documents Repository</h2>
          <p className="text-xs text-slate-400">
            Legal contracts, site plans, blast licensing permits, aggregate lab test certificates, and completion deeds.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload Document</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title, job ID, file name, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Quotations">Quotations</option>
            <option value="Agreements">Agreements</option>
            <option value="Work Orders">Work Orders</option>
            <option value="Drawings / Site Plans">Drawings / Site Plans</option>
            <option value="Permits & Approvals">Permits & Approvals</option>
            <option value="Invoices">Invoices</option>
            <option value="Payment Receipts">Payment Receipts</option>
            <option value="Quality & Test Certificates">Quality & Test Certificates</option>
            <option value="Safety Reports">Safety Reports</option>
            <option value="Completion Certificates">Completion Certificates</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl transition space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20">
                  {doc.category}
                </span>
                <span className="font-mono text-xs text-slate-500">{doc.fileSize}</span>
              </div>

              <h3 className="text-sm font-bold text-white mt-2 leading-snug">{doc.title}</h3>
              <div className="text-xs text-slate-400 font-mono mt-1 truncate">{doc.fileName}</div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500 flex justify-between">
                <span>Job: {doc.jobId}</span>
                <span>{doc.uploadDate}</span>
              </div>
            </div>

            {/* Actions: Preview, Download, Share, Delete */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                </button>
                <button
                  onClick={() => showToast(`Downloaded ${doc.fileName}`)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  title="Download"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => showToast(`Generated encrypted share link for ${doc.title}`)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5 text-purple-400" />
                </button>
              </div>

              <button
                onClick={() => handleDelete(doc.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold text-purple-400">
                  {previewDoc.id} &bull; {previewDoc.category}
                </span>
                <h3 className="text-base font-black text-white">{previewDoc.title}</h3>
                <div className="text-xs text-slate-400">Uploaded by: {previewDoc.uploadedBy}</div>
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-48 bg-slate-950 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center p-4">
              <FileCheck2 className="w-12 h-12 text-emerald-400 mb-2" />
              <div className="text-xs font-bold text-white">{previewDoc.fileName}</div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                Verified Cryptographic SHA-256 Hash Record
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showToast(`Downloaded ${previewDoc.fileName}`);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-purple-500/20"
              >
                Download Original File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD DOCUMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-purple-400" />
                <span>Upload Job Document</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Document Title *</label>
                <input
                  type="text"
                  required
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="e.g. Environmental Clearance Moodbidri Pit"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Target Job</label>
                  <select
                    value={newDoc.jobId}
                    onChange={(e) => setNewDoc({ ...newDoc, jobId: e.target.value })}
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
                  <label className="block text-slate-400 font-medium mb-1">Category</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Quotations">Quotations</option>
                    <option value="Agreements">Agreements</option>
                    <option value="Work Orders">Work Orders</option>
                    <option value="Drawings / Site Plans">Drawings / Site Plans</option>
                    <option value="Permits & Approvals">Permits & Approvals</option>
                    <option value="Invoices">Invoices</option>
                    <option value="Payment Receipts">Payment Receipts</option>
                    <option value="Quality & Test Certificates">Quality & Test Certificates</option>
                    <option value="Safety Reports">Safety Reports</option>
                    <option value="Completion Certificates">Completion Certificates</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Select File</label>
                <input
                  type="file"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setNewDoc({ ...newDoc, fileName: f.name });
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-400"
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
                  className="px-4 py-2 rounded-xl bg-purple-500 text-slate-950 font-bold text-xs"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
