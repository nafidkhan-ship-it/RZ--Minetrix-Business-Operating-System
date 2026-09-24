import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { QuarryDocument, DocumentCategory, QuarryItem } from '../../data/quarryStudioData';

interface QuarryDocumentsViewProps {
  documents: QuarryDocument[];
  quarries: QuarryItem[];
}

export const QuarryDocumentsView: React.FC<QuarryDocumentsViewProps> = ({
  documents,
  quarries
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filtered = documents.filter((d) => {
    const matchSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.quarryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.linkedEntity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              COMPLIANCE & LEGAL VAULT
            </span>
            <span className="text-xs text-slate-500 font-mono">
              ({filtered.length} verified deeds & permits)
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">Quarry Document Vault</h2>
          <p className="text-xs text-slate-400">
            Encrypted repository of DMG mining concessions, KSPCB environmental clearances, FMB cadastral sketches, and partner deeds.
          </p>
        </div>

        <button
          onClick={() => alert('Upload New Document to Vault (Simulated)')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 flex items-center gap-2 transition shadow-lg shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload Document</span>
        </button>
      </div>

      {/* Vault Category Filters (Section 19) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search document title, permit #, quarry, or linked landowner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:border-amber-400 focus:outline-none"
          >
            <option value="ALL">All Vault Categories</option>
            <option value="DMG Mining Permit">DMG Mining Permits</option>
            <option value="Lease Deed">Lease Deeds</option>
            <option value="Environmental Clearance (EC)">Environmental Clearance (EC)</option>
            <option value="Consent to Operate (CTO)">Consent to Operate (CTO)</option>
            <option value="Explosive License">Explosive Licenses</option>
            <option value="Survey Maps / FMB Sketch">Survey Maps / FMB Sketches</option>
            <option value="Partner Agreement">Partner Agreements</option>
            <option value="Identity Document">Identity Documents</option>
          </select>
        </div>
      </div>

      {/* Documents Table (Section 19) */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Document Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Quarry Concession</th>
                <th className="py-3.5 px-4">Linked Entity / Authority</th>
                <th className="py-3.5 px-4">Issue Date</th>
                <th className="py-3.5 px-4">Expiry Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white text-sm">{doc.title}</div>
                        <div className="text-[10px] font-mono text-slate-500">{doc.documentNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-white font-medium">{doc.quarryName}</td>
                  <td className="py-3.5 px-4 text-slate-300">{doc.linkedEntity}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">{doc.issueDate}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">{doc.expiryDate}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        doc.status === 'Valid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : doc.status === 'Expiring Soon'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => alert(`Viewing document: ${doc.title}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Downloading: ${doc.title}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Download File"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => alert(`Replace/Renew file for ${doc.title}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Replace / Renew"
                      >
                        <RefreshCw className="w-4 h-4" />
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
