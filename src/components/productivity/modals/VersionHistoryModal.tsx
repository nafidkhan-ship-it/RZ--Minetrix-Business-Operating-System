import React from 'react';
import {
  X,
  History,
  RotateCcw,
  CheckCircle2,
  Calendar,
  User,
  FileText,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ProductivityFile, VersionHistoryItem } from '../types';
import { MOCK_VERSIONS } from '../mockData';

interface VersionHistoryModalProps {
  isOpen: boolean;
  file: ProductivityFile | null;
  onClose: () => void;
  onRestoreVersion?: (version: VersionHistoryItem) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  file,
  onClose,
  onRestoreVersion
}) => {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Version History &amp; Audit Trail</h3>
              <p className="text-[11px] text-slate-400 font-mono truncate max-w-xs">{file.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 font-mono flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Every revision is cryptographically timestamped and synced to RZ MINETRIX event log.</span>
        </div>

        {/* Timeline of Versions */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-none font-mono text-xs">
          {MOCK_VERSIONS.map((ver, idx) => (
            <div
              key={ver.id}
              className={`p-3.5 rounded-2xl border transition ${
                ver.isCurrent
                  ? 'bg-slate-950 border-emerald-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{ver.version}</span>
                    {ver.isCurrent ? (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        Current Live
                      </span>
                    ) : (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        Historical
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-1">
                    <span>{ver.timestamp}</span>
                    <span>&bull;</span>
                    <span className="text-amber-400">{ver.author}</span>
                  </div>
                </div>

                {!ver.isCurrent && (
                  <button
                    onClick={() => {
                      onRestoreVersion?.(ver);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
                  >
                    <RotateCcw className="w-3 h-3 text-cyan-400" />
                    <span>Restore</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-300 mt-2 font-sans leading-relaxed">
                {ver.changeSummary}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end font-sans">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
