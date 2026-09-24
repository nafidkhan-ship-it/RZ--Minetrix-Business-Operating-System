import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  Share2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  FolderArchive,
  FileSpreadsheet,
  FileCode,
  File
} from 'lucide-react';
import { DEMO_FILES_ITEMS } from '../../../data/rzChatData';

export const RzFilesView: React.FC = () => {
  const [files, setFiles] = useState(DEMO_FILES_ITEMS);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const TYPES = ['ALL', 'PDF', 'Excel', 'CAD / DWG'];

  const filtered = files.filter((f) => {
    const matchesType = selectedType === 'ALL' || f.fileType === selectedType;
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.sender.toLowerCase().includes(search.toLowerCase()) ||
      f.businessTag.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'Excel':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'CAD / DWG':
        return <FileCode className="w-5 h-5 text-cyan-400" />;
      case 'PDF':
      default:
        return <FileText className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs overflow-hidden">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-white">Files & Document Vault</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">
              {files.length} Stored Documents
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Extraction statements, tax invoices, weighbridge logs, CAD surveys & equipment service records
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                selectedType === t
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t === 'ALL' ? 'All Files' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/40">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search document name, ecosystem module, or sender..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {filtered.map((file) => (
          <div
            key={file.id}
            className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                {getIcon(file.fileType)}
              </div>

              <div>
                <div className="font-bold text-white text-xs group-hover:text-cyan-300 transition">
                  {file.name}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-cyan-400 font-bold">{file.size}</span>
                  <span>&bull;</span>
                  <span>{file.sender}</span>
                  <span>&bull;</span>
                  <span className="text-slate-500 font-mono">{file.date}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold font-mono">
                    {file.businessTag}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => showToast(`Opening preview of ${file.name}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                <span>Open</span>
              </button>
              <button
                onClick={() => showToast(`Downloading ${file.name}...`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast(`Sharing ${file.name}`)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
