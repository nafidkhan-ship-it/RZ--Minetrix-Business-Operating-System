import React, { useState } from 'react';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Clock,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import {
  DEAL_DOCUMENTS,
  DealDocumentItem
} from '../../data/usedMachineryMarketplaceData';

interface DealDocumentsViewProps {
  onOpenOttModal: (contextRef?: string) => void;
}

export const DealDocumentsView: React.FC<DealDocumentsViewProps> = ({
  onOpenOttModal
}) => {
  const [documents, setDocuments] = useState<DealDocumentItem[]>(DEAL_DOCUMENTS);
  const [filterType, setFilterType] = useState('ALL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Deal Documents & RTO Ownership Transfer</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Verified Legal Vault
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Smart card RC, Parivahan Form 29 & 30, Commercial Tax clearances, and bilateral notarized sale agreements
          </p>
        </div>

        <button
          onClick={() => onOpenOttModal('DOC-RTO-TRANSFER-AUDIT')}
          className="px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Clock className="w-4 h-4" />
          <span>+ Create RTO Task</span>
        </button>
      </div>

      {/* DOCUMENT TILES */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <h2 className="text-base font-black text-white">Archived Deal Documentation</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                <th className="p-3 font-semibold">Document Title</th>
                <th className="p-3 font-semibold">Deal Reference</th>
                <th className="p-3 font-semibold">Document Classification</th>
                <th className="p-3 font-semibold">File Info</th>
                <th className="p-3 font-semibold">Verification Status</th>
                <th className="p-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-950/40 transition">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{doc.title}</span>
                  </td>
                  <td className="p-3 font-mono text-amber-400 font-bold">{doc.dealCode}</td>
                  <td className="p-3 text-slate-300">{doc.documentType}</td>
                  <td className="p-3 font-mono text-slate-400 text-[11px]">
                    <div>{doc.fileName}</div>
                    <div className="text-[10px] text-slate-500">{doc.fileSize} &bull; {doc.uploadedAt}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border inline-flex items-center gap-1 ${
                        doc.status === 'Approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{doc.status}</span>
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => alert(`Opening ${doc.fileName}`)}
                      className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                    >
                      View Document
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
