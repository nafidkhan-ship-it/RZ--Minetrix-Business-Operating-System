import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

interface WorkforcePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any;
  onToast: (msg: string) => void;
}

export const WorkforcePrintModal: React.FC<WorkforcePrintModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
  onToast
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
    onToast(`Sent "${title}" to local/network printer spool`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans">Print Document Preview</h3>
              <p className="text-xs text-slate-400 font-mono">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Area Preview */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950 text-slate-200 font-mono text-xs space-y-4">
          <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/50 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <span className="text-amber-400 font-black text-sm block">RZ&reg; MINETRIX WORKFORCE DOSSIER</span>
                <span className="text-[11px] text-slate-400">Malabar Quarries &amp; Crushers Pvt. Ltd.</span>
              </div>
              <div className="text-right text-[10px] text-slate-500">
                <span>Date: {new Date().toLocaleDateString('en-IN')}</span>
                <br />
                <span>CONFIDENTIAL OFFICIAL RECORD</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white text-sm font-sans mb-1">{title}</h4>
              <p className="text-[11px] text-slate-400 font-sans">
                Official print export compiled from RZ® MINETRIX People &amp; Workforce Shared ERP Core.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 overflow-x-auto max-h-64">
              <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between text-[10px] text-slate-500">
              <span>Audited By: ERP Core Security Gateway</span>
              <span>Signatory: Verified Digital Token</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
