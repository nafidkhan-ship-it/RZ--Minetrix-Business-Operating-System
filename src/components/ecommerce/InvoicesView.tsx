import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Building,
  User
} from 'lucide-react';
import { CommerceOrder, COMMERCE_ORDERS } from '../../data/ecommerceStudioData';

interface InvoicesViewProps {
  order?: CommerceOrder;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ order }) => {
  const activeOrder = order || COMMERCE_ORDERS[0];

  const cgst = Math.round(activeOrder.taxAmount / 2);
  const sgst = activeOrder.taxAmount - cgst;

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              GST COMPLIANT TAX INVOICE
            </span>
            <span className="text-xs text-slate-400 font-medium">Form GST INV-1 Standard</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Tax Invoice INV-RZ-2026-0881</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={() => alert('Downloading GST PDF invoice...')}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Document Canvas */}
      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-200 max-w-4xl mx-auto space-y-8 font-sans">
        {/* Top Branding & Invoice Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="text-2xl font-black tracking-tight text-slate-950">
              RZ® MINETRIX
            </div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Mining & Building Materials Infrastructure
            </div>
            <div className="text-xs text-slate-600 mt-2 leading-relaxed">
              Industrial Concession Zone, Nileshwaram - Kasaragod Road<br />
              GSTIN: <strong className="text-slate-900 font-mono">32AABCR9912K1Z9</strong> &bull; PAN: AABCR9912K
            </div>
          </div>

          <div className="text-right sm:text-right space-y-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 uppercase">
              ORIGINAL FOR RECIPIENT
            </span>
            <div className="text-xl font-mono font-black text-slate-950 pt-1">
              INV-RZ-2026-0881
            </div>
            <div className="text-xs text-slate-500 font-mono">
              Date: {activeOrder.orderDate} &bull; Order: {activeOrder.orderNumber}
            </div>
          </div>
        </div>

        {/* Bill To & Dispatch From */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">BILLED TO (BUYER):</span>
            <div className="text-sm font-bold text-slate-950">{activeOrder.customerName}</div>
            <div className="text-slate-600">{activeOrder.customerAddress}</div>
            <div className="text-slate-600">{activeOrder.district}, {activeOrder.state} - {activeOrder.pinCode}</div>
            <div className="text-slate-700 font-mono pt-1">Contact: {activeOrder.customerPhone}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">QUARRY CONCESSION SOURCE:</span>
            <div className="text-sm font-bold text-slate-950">{activeOrder.supplierName}</div>
            <div className="text-slate-600">Direct Extraction Concession Pit #01</div>
            <div className="text-slate-600">Kasaragod District, Kerala</div>
            <div className="text-slate-700 font-mono pt-1">Weighbridge Gate: GP-KL14-8821</div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-950 text-slate-700 font-mono text-[11px]">
                <th className="py-2.5">Sl</th>
                <th className="py-2.5">Item Description & Specification</th>
                <th className="py-2.5">HSN / SAC</th>
                <th className="py-2.5 text-right">Qty</th>
                <th className="py-2.5 text-right">Unit Rate</th>
                <th className="py-2.5 text-right">Taxable Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono text-slate-800">
              <tr>
                <td className="py-3">1</td>
                <td className="py-3 font-sans">
                  <div className="font-bold text-slate-950">{activeOrder.productName}</div>
                  <div className="text-[11px] text-slate-500">{activeOrder.dimensions} &bull; Pit Concession Cut</div>
                </td>
                <td className="py-3">2516 11 00</td>
                <td className="py-3 text-right font-bold">{activeOrder.quantity.toLocaleString()} {activeOrder.unit}s</td>
                <td className="py-3 text-right">₹{activeOrder.materialRate}</td>
                <td className="py-3 text-right font-bold text-slate-950">₹{activeOrder.materialAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-3">2</td>
                <td className="py-3 font-sans">
                  <div className="font-bold text-slate-950">Direct Tipper Haulage Freight</div>
                  <div className="text-[11px] text-slate-500">Destination Delivery to {activeOrder.siteProjectName}</div>
                </td>
                <td className="py-3">9965 11</td>
                <td className="py-3 text-right">1 Trip</td>
                <td className="py-3 text-right">₹{activeOrder.deliveryCharge.toLocaleString()}</td>
                <td className="py-3 text-right font-bold text-slate-950">₹{activeOrder.deliveryCharge.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Financial Summary Breakdown */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-6 text-xs">
          <div className="space-y-2 max-w-sm">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">PAYMENT SETTLEMENT:</span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
              <div>Advance Received: <strong className="text-slate-950">₹{activeOrder.advancePaid.toLocaleString()}</strong> (Direct Bank NEFT)</div>
              <div>Balance Due on Delivery: <strong className="text-slate-950">₹{activeOrder.balanceAmount.toLocaleString()}</strong></div>
              <div>Payment Status: <span className="text-emerald-600 font-bold uppercase">{activeOrder.paymentStatus}</span></div>
            </div>
          </div>

          <div className="space-y-2 min-w-[240px] font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal Taxable:</span>
              <span className="font-bold text-slate-950">₹{(activeOrder.materialAmount + activeOrder.deliveryCharge).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>CGST (2.5%):</span>
              <span>₹{cgst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SGST (2.5%):</span>
              <span>₹{sgst.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t-2 border-slate-950 flex justify-between text-base font-black text-slate-950">
              <span>Grand Total:</span>
              <span>₹{activeOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div>This is a computerized tax invoice generated by RZ® MINETRIX Commerce Platform.</div>
          <div className="font-bold text-slate-950">Authorized Signatory</div>
        </div>
      </div>
    </div>
  );
};
