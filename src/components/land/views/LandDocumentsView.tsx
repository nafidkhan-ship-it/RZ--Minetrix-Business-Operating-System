import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  ShieldCheck,
  Eye,
  CheckCircle2,
  Calendar,
  Users
} from 'lucide-react';
import { DEMO_LAND_DOCUMENTS, LandDocumentItem } from '../../../data/quarryLandData';

export const LandDocumentsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [docTypeFilter, setDocTypeFilter] = useState('ALL');

  const filtered = DEMO_LAND_DOCUMENTS.filter((d) => {
    const matchesSearch =
      d.docTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.notaryOrAuthority.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = docTypeFilter === 'ALL' || d.docType === docTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-purple-400 font-bold uppercase">
              Platform 7 &bull; Legal Compliance Vault
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Verified by Legal Notary
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Land Documents Vault</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Title Deeds, Prior Deeds, Tax Receipts, Possession Certificates, FMB Sketches, LoI, and Environmental Clearances.
          </p>
        </div>

        <button
          onClick={() => alert('Upload Land Document: Select Owner, Parcel, and Document Type.')}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Upload Legal Document</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-3xl transition space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {doc.verifiedStatus}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold block">{doc.docType}</span>
                <h3 className="text-sm font-black text-white mt-0.5">{doc.docTitle}</h3>
                <div className="text-xs text-slate-400 mt-1">
                  Authority: {doc.notaryOrAuthority}
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-xl text-[11px] text-slate-400 flex items-center justify-between font-mono">
                <span>{doc.fileSize}</span>
                <span>{doc.uploadDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-[10px] text-slate-500">Document ID: {doc.id}</span>
              <button
                onClick={() => alert(`Downloading document: ${doc.docTitle}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
