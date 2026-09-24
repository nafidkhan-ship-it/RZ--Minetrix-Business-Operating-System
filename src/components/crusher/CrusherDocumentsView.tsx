import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  ShieldCheck,
  Calendar,
  Building2,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { CrusherDocument } from '../../data/crusherStudioData';

interface CrusherDocumentsViewProps {
  documents: CrusherDocument[];
  onNavigatePage: (page: string) => void;
}

export const CrusherDocumentsView: React.FC<CrusherDocumentsViewProps> = ({
  documents,
  onNavigatePage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');

  const filtered = documents.filter(d => {
    const matchSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = catFilter === 'ALL' || d.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                COMPLIANCE VAULT & STATUTORY PERMITS
              </span>
              <h2 className="text-xl font-black text-white">Crusher Permits & Compliance Documents</h2>
            </div>
          </div>
          <button
            onClick={() => alert('Upload Document modal opened.')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Upload Permit / Document</span>
          </button>
        </div>

        {/* Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by permit name, document number, or issuing authority..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <select
              value={catFilter}
              onChange={e => setCatFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="Statutory Permit">Statutory Permits (PCB / Mining)</option>
              <option value="Calibration">Weighbridge Calibration</option>
              <option value="Legal">Legal & Deeds</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(doc => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-cyan-400 font-bold block">{doc.category}</span>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                      {doc.title}
                    </h3>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                    doc.status === 'VALID'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {doc.status}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>DOCUMENT REF:</span>
                  <span className="text-white font-bold">{doc.documentNumber}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>AUTHORITY:</span>
                  <span className="text-slate-300 truncate max-w-[150px]">{doc.issuingAuthority}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>VALID UNTIL:</span>
                  <span className="text-emerald-400 font-bold">{doc.validUntil}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[10px]">{doc.fileSize} &bull; PDF</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Viewing ${doc.title}...`)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  title="View"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => alert(`Downloading ${doc.title}...`)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 font-bold transition flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
