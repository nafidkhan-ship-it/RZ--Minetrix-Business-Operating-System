import React from 'react';
import { Printer, X, Download, ShieldCheck, QrCode } from 'lucide-react';

interface CommercePrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  documentData: any;
  onToast: (msg: string) => void;
}

export const CommercePrintPreviewModal: React.FC<CommercePrintPreviewModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  documentData,
  onToast
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    onToast('Sending document to printer spooler...');
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-4 relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Official Document Spooler &bull; Print Preview
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-lg font-black text-white mt-0.5">{documentTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Realistic A4 White/Paper Sheet Simulation */}
        <div className="overflow-y-auto bg-slate-950 p-4 rounded-2xl flex justify-center">
          <div className="bg-white text-slate-900 w-full max-w-2xl p-8 rounded-xl shadow-2xl font-sans text-xs space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-950">RZ&reg; MINETRIX BOS</h1>
                <p className="text-[11px] font-bold text-amber-700">SHARED ERP CORE &bull; COMMERCE &amp; TRADE</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  Central Mining &amp; Aggregates Concession Complex<br />
                  NH-66 Highway Corridor, Industrial Zone<br />
                  GSTIN: 32AABCR9912E1Z8 &bull; CIN: U14100KL2026PTC081299
                </p>
              </div>

              <div className="text-right space-y-1">
                <span className="inline-block px-2.5 py-1 rounded bg-slate-900 text-white font-mono text-[10px] font-bold">
                  ORIGINAL FOR RECIPIENT
                </span>
                <p className="text-[10px] font-mono text-slate-600">Date: 24-FEB-2026</p>
                <p className="text-[10px] font-mono text-slate-600">Ref: RZ-DOC-{Math.floor(1000 + Math.random() * 9000)}</p>
              </div>
            </div>

            {/* Document Title Bar */}
            <div className="bg-slate-100 p-3 rounded-lg border border-slate-300 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Document Type</span>
                <strong className="text-sm font-black text-slate-900">{documentTitle}</strong>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Compliance Status</span>
                <span className="text-[10px] font-mono font-bold text-emerald-700">DIGITALLY VERIFIED</span>
              </div>
            </div>

            {/* Content Preview */}
            <div className="space-y-3">
              <p className="text-[11px] text-slate-700">
                This document serves as an authentic commercial record under the RZ® MINETRIX Business Operating System. All weights, tax computations and batch references are digitally validated against pithead weighbridge gross readings and GST Section 31 statutory regulations.
              </p>

              {/* Sample Breakdown Grid */}
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="bg-slate-100 border-b border-slate-300 font-mono text-slate-700">
                    <tr>
                      <th className="p-2">DESCRIPTION</th>
                      <th className="p-2">QTY</th>
                      <th className="p-2 text-right">RATE (₹)</th>
                      <th className="p-2 text-right">TAX</th>
                      <th className="p-2 text-right">TOTAL (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2">
                        <strong className="block text-slate-900">20mm Blue Metal Granite Aggregate</strong>
                        <span className="text-[9px] text-slate-500 font-mono">HSN: 25171000 &bull; Pithead Weighbridge 01</span>
                      </td>
                      <td className="p-2 font-mono">28.0 MT</td>
                      <td className="p-2 text-right font-mono">580.00</td>
                      <td className="p-2 text-right font-mono">5% GST</td>
                      <td className="p-2 text-right font-mono font-bold">17,052.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* QR Code & Signatures Footer */}
            <div className="pt-4 border-t-2 border-slate-900 flex justify-between items-end">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-900 text-white flex flex-col items-center justify-center p-1 rounded font-mono text-[7px] text-center">
                  <span>RZ-QR</span>
                  <span className="font-black text-[9px]">e-VERIFY</span>
                  <span>WEIGHED</span>
                </div>
                <div className="text-[9px] text-slate-600">
                  <p className="font-bold text-slate-900">Digital Seal &amp; Tamper-Proof Cryptographic Hash</p>
                  <p>IRN: 8a91b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0</p>
                  <p>Gate Pass verified by RFID Boom Barrier Controller</p>
                </div>
              </div>

              <div className="text-right space-y-4">
                <div className="h-8 border-b border-slate-400 w-36 ml-auto" />
                <p className="text-[10px] font-bold text-slate-900">Authorised Signatory / Weigher</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
