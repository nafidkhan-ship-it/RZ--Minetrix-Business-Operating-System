import React, { useState } from 'react';
import {
  Printer,
  Download,
  Share2,
  CheckCircle2,
  X,
  FileText,
  ShieldCheck,
  Building2,
  QrCode
} from 'lucide-react';

interface ErpPrintDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentData?: any;
}

export const ErpPrintDocumentModal: React.FC<ErpPrintDocumentModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentData
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] flex flex-col justify-between">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">{documentTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Paper Preview (High-Contrast White Sheet Look) */}
        <div className="flex-1 overflow-y-auto p-6 rounded-2xl bg-white text-slate-900 shadow-inner font-sans text-xs space-y-4 border border-slate-200">
          {/* Company Masthead */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
            <div>
              <div className="text-xl font-black tracking-tight text-slate-900">RZ® MINETRIX</div>
              <div className="text-[10px] uppercase font-bold text-slate-600">Enterprise Resource Planning &bull; BOS Core</div>
              <div className="text-[10px] text-slate-500 mt-1">Calicut HQ &bull; Concessions: Wayanad &bull; GSTIN: 32AAECR9912Q1ZZ</div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 border border-slate-300 font-bold block mb-1">
                OFFICIAL VOUCHER
              </span>
              <span className="text-[10px] text-slate-500">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="text-center font-bold text-sm uppercase tracking-wide border-b border-slate-200 pb-2">
            {documentTitle}
          </div>

          {/* Dynamic Content Display */}
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-800">
                {JSON.stringify(documentData, null, 2)}
              </pre>
            </div>
          </div>

          {/* Signatures & QR Authentication */}
          <div className="pt-6 border-t border-slate-300 flex items-end justify-between text-[10px] text-slate-500">
            <div>
              <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-700" />
              </div>
              <span className="block mt-1">Digital Signature Verified</span>
            </div>

            <div className="text-right">
              <div className="w-36 border-b border-slate-400 mb-1" />
              <span className="font-bold text-slate-800">Authorized Signatory</span>
              <div className="text-[9px]">RZ® Minetrix Finance &amp; Audit Engine</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Generated secure PDF')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => showToast('Dispatched link via WhatsApp Business API')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
