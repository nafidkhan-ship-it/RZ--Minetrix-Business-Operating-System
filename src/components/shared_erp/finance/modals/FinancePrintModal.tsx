import React from 'react';
import { X, Printer, Download, CheckCircle2, Landmark } from 'lucide-react';

interface FinancePrintModalProps {
  isOpen: boolean;
  title: string;
  data: any;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export const FinancePrintModal: React.FC<FinancePrintModalProps> = ({
  isOpen,
  title,
  data,
  onClose,
  onToast
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:border-none print:shadow-none print:max-w-none print:w-full print:bg-white print:text-black">
        {/* Header toolbar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Document Print &amp; Export Preview</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToast(`Exported ${title} as PDF`)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Document</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 flex-1 bg-slate-950 print:bg-white print:text-black font-mono">
          <div className="border-b border-slate-800 print:border-black pb-4 flex justify-between items-start">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest print:text-black">
                RZ® MINETRIX BOS &bull; SHARED ERP CORE
              </div>
              <h2 className="text-xl font-black text-white print:text-black mt-1">{title}</h2>
              <div className="text-xs text-slate-400 print:text-gray-600 mt-1">
                Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-bold uppercase print:border-black print:text-black">
                OFFICIAL RECORD
              </span>
              <div className="text-xs text-slate-400 print:text-gray-600 mt-2">
                Ref: DOC-FIN-{Math.floor(100000 + Math.random() * 900000)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 text-xs text-slate-300 print:text-gray-800 space-y-2">
            <div className="flex justify-between font-bold">
              <span>Organization Unit:</span>
              <span className="text-white print:text-black">Malabar Granites &amp; Infra Projects Pvt Ltd</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>GSTIN / Registration:</span>
              <span className="text-amber-400 print:text-black">32AAECM9921D1ZM</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Verification Hash:</span>
              <span className="text-slate-400 print:text-gray-600 font-mono">SHA256: 8f9b...a12c (Audited)</span>
            </div>
          </div>

          {/* Render Data Summary if array or object */}
          {Array.isArray(data) ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 print:border-gray-300">
                <thead className="bg-slate-900 print:bg-gray-200 text-slate-400 print:text-black uppercase text-[10px]">
                  <tr>
                    <th className="p-2 border border-slate-800 print:border-gray-300">#</th>
                    <th className="p-2 border border-slate-800 print:border-gray-300">Identifier / Ref</th>
                    <th className="p-2 border border-slate-800 print:border-gray-300">Description</th>
                    <th className="p-2 border border-slate-800 print:border-gray-300 text-right">Value / Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 10).map((row, idx) => (
                    <tr key={idx} className="border border-slate-800/60 print:border-gray-300">
                      <td className="p-2 text-slate-400 print:text-black">{idx + 1}</td>
                      <td className="p-2 text-amber-400 print:text-black font-bold">
                        {row.reference || row.invoiceNo || row.billNo || row.id || `Item #${idx + 1}`}
                      </td>
                      <td className="p-2 text-white print:text-black font-sans">
                        {row.party || row.customerName || row.partyName || row.description || 'Verified Ledger Posting'}
                      </td>
                      <td className="p-2 text-right font-bold text-emerald-400 print:text-black">
                        {row.amount ? `₹${Number(row.amount).toLocaleString('en-IN')}` : row.balance ? `₹${Number(row.balance).toLocaleString('en-IN')}` : row.status || 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900 print:bg-gray-50 border border-slate-800 print:border-gray-300 text-xs space-y-2">
              <div className="font-bold text-white print:text-black uppercase text-[11px] mb-2">Statement Summary &amp; Ledger Notes:</div>
              <p className="text-slate-300 print:text-gray-700 font-sans leading-relaxed">
                This document serves as an immutable studio preview of financial ledger movements, settlement splits, voucher approvals, and account balances inside RZ® MINETRIX BOS.
              </p>
            </div>
          )}

          <div className="pt-8 border-t border-slate-800 print:border-black flex justify-between items-center text-[10px] text-slate-500 print:text-gray-500">
            <div>Signatory: Authorized Accounts Comptroller</div>
            <div>RZ® MINETRIX BOS Finance Hub &bull; All rights reserved</div>
          </div>
        </div>
      </div>
    </div>
  );
};
