import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Filter,
  ShieldCheck,
  Printer,
  CheckCircle2
} from 'lucide-react';
import { CommerceDocument, COMMERCE_DOCUMENTS } from '../../data/ecommerceStudioData';

export const DocumentsView: React.FC = () => {
  const [docs, setDocs] = useState<CommerceDocument[]>(COMMERCE_DOCUMENTS);
  const [filterCat, setFilterCat] = useState<string>('ALL');

  const filtered = docs.filter((d) => {
    if (filterCat === 'ALL') return true;
    return d.category.toUpperCase().includes(filterCat);
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              LEGAL & TRANSIT DOCUMENT VAULT
            </span>
            <span className="text-xs text-slate-400 font-medium">Compliance Archives</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">E-Commerce Documents ({docs.length})</h1>
        </div>

        <button
          onClick={() => alert('Upload compliance document modal')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
        >
          + Upload Document
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 overflow-x-auto text-xs">
        {['ALL', 'TRANSIT', 'WEIGHBRIDGE', 'INVOICE', 'QUALITY'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
              filterCat === cat
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/80">
                <th className="p-4">Doc Title & Category</th>
                <th className="p-4">Associated Order</th>
                <th className="p-4">File Format</th>
                <th className="p-4">Size</th>
                <th className="p-4">Uploaded Date</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-sans">
                    <div className="font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{d.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono pl-6">{d.category}</div>
                  </td>
                  <td className="p-4 font-bold text-amber-400">{d.orderNumber}</td>
                  <td className="p-4 uppercase text-slate-300">{d.fileType}</td>
                  <td className="p-4 text-slate-400">{d.fileSize}</td>
                  <td className="p-4 text-slate-400">{d.uploadedAt}</td>
                  <td className="p-4 text-right font-sans">
                    <button
                      onClick={() => alert(`Downloading ${d.title}`)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Download
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
