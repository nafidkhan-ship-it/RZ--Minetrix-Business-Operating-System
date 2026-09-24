import React, { useState } from 'react';
import {
  ShoppingBag,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Truck,
  FileText,
  DollarSign,
  Printer,
  Sparkles
} from 'lucide-react';
import {
  PurchaseRequestItem,
  RfqRecord,
  PurchaseOrderItem,
  GrnRecord,
  PurchaseBillRecord,
  CommerceSubTab
} from '../types';
import {
  MOCK_PURCHASE_REQUESTS,
  MOCK_RFQS,
  MOCK_PURCHASE_ORDERS,
  MOCK_GRNS,
  MOCK_PURCHASE_BILLS,
  MOCK_PURCHASE_RETURNS
} from '../commerceMockData';

interface PurchaseViewsProps {
  activeSubSection: 'purchase-requests' | 'rfq' | 'purchase-orders' | 'grn' | 'purchase-bills' | 'purchase-returns';
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
  onOpenFlowModal?: () => void;
}

export const PurchaseViews: React.FC<PurchaseViewsProps> = ({
  activeSubSection,
  onNavigateTab,
  onToast,
  onOpenPrintModal,
  onOpenFlowModal
}) => {
  const [selectedPo, setSelectedPo] = useState<PurchaseOrderItem | null>(MOCK_PURCHASE_ORDERS[0]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Sub-Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Procurement Life-Cycle &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white capitalize">
              {activeSubSection.replace('-', ' ')} &bull; End-to-End Vendor Procurement
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              PR &rarr; RFQ Multi-Vendor Comparison &rarr; Purchase Order &rarr; Inward GRN / Weighbridge QC &rarr; 3-Way Match Purchase Bill &rarr; Debit Note Returns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenFlowModal?.()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate PO to GRN Flow</span>
            </button>
          </div>
        </div>

        {/* Sub-Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-800/80 mt-4">
          {[
            { id: 'purchase-requests', label: '1. Purchase Requests (PR)', count: MOCK_PURCHASE_REQUESTS.length },
            { id: 'rfq', label: '2. RFQ Comparison Matrix', count: MOCK_RFQS.length },
            { id: 'purchase-orders', label: '3. Purchase Orders (PO)', count: MOCK_PURCHASE_ORDERS.length },
            { id: 'grn', label: '4. GRN / Material Receipts', count: MOCK_GRNS.length },
            { id: 'purchase-bills', label: '5. Purchase Bills', count: MOCK_PURCHASE_BILLS.length },
            { id: 'purchase-returns', label: '6. Purchase Returns & Debit Notes', count: MOCK_PURCHASE_RETURNS.length }
          ].map((step) => {
            const isCurrent = activeSubSection === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onNavigateTab(step.id as CommerceSubTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                  isCurrent
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                    : 'bg-slate-800/40 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <span>{step.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isCurrent ? 'bg-slate-950 text-amber-400' : 'bg-slate-700 text-slate-300'
                }`}>
                  {step.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Content per Sub-Section */}

      {/* A. PURCHASE REQUESTS */}
      {activeSubSection === 'purchase-requests' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Internal Material Requisitions (PR)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Departmental requisitions requiring HOD or Project Manager budget sanction</p>
            </div>
            <button
              onClick={() => onToast('Opened New Purchase Requisition form')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Create Requisition
            </button>
          </div>

          <div className="space-y-2.5">
            {MOCK_PURCHASE_REQUESTS.map((pr: PurchaseRequestItem) => (
              <div
                key={pr.id}
                className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/70 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{pr.requestNumber}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {pr.approvalStatus}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      pr.priority === 'URGENT' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {pr.priority}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{pr.productName} ({pr.quantity} {pr.unit})</p>
                  <p className="text-[11px] text-slate-400">Dept: {pr.department} &bull; Requested by: {pr.requestedBy} &bull; Required: {pr.requiredDate}</p>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
                  <span className="text-sm font-mono font-bold text-white mr-2">Est: ₹{pr.estimatedAmount.toLocaleString()}</span>
                  <button
                    onClick={() => {
                      onToast(`Approved PR ${pr.requestNumber}. Converting to RFQ.`);
                      onNavigateTab('rfq');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Approve &amp; Send RFQ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* B. RFQ COMPARISON MATRIX */}
      {activeSubSection === 'rfq' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-amber-400" />
                <span>Multi-Vendor RFQ Quotation Comparison Matrix</span>
              </h3>
              <p className="text-[11px] text-slate-400">Evaluate bids by Rate, Payment Terms, Freight terms and Lead Times (L1 Determination)</p>
            </div>
            <button
              onClick={() => onToast('New RFQ dispatched to 3 approved vendors')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Launch RFQ
            </button>
          </div>

          {MOCK_RFQS.map((rfq: RfqRecord) => (
            <div key={rfq.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">{rfq.rfqNumber}</span>
                  <h4 className="text-sm font-black text-white mt-0.5">{rfq.productName}</h4>
                  <p className="text-[11px] text-slate-400">Target Qty: {rfq.quantity} {rfq.unit} &bull; Closing: {rfq.closingDate}</p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold self-start">
                  {rfq.status}
                </span>
              </div>

              {/* Side-by-side Quotation Comparison Table */}
              <div className="overflow-x-auto pt-2">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-[10px] font-mono text-slate-400">
                      <th className="py-2 px-3">BIDDER VENDOR</th>
                      <th className="py-2 px-3 text-right">UNIT RATE (₹)</th>
                      <th className="py-2 px-3 text-right">TOTAL QUOTE (₹)</th>
                      <th className="py-2 px-3">PAYMENT TERMS</th>
                      <th className="py-2 px-3">LEAD TIME</th>
                      <th className="py-2 px-3 text-center">RANK</th>
                      <th className="py-2 px-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {rfq.quotes.map((v, i) => (
                      <tr key={i} className={`hover:bg-slate-700/30 ${v.isSelected ? 'bg-emerald-500/10' : ''}`}>
                        <td className="py-3 px-3">
                          <strong className="text-white block">{v.supplierName}</strong>
                          <span className="text-[10px] text-slate-400">Freight: ₹{v.freight.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white">
                          ₹{v.rate.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-amber-400">
                          ₹{v.totalAmount.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono">{v.paymentTerms}</td>
                        <td className="py-3 px-3 text-slate-300">{v.deliveryTimeDays} Days</td>
                        <td className="py-3 px-3 text-center">
                          {v.isSelected ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[9px]">
                              L1 LOWEST
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500">L{i + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => {
                              onToast(`Awarded RFQ to ${v.supplierName}. Generating PO.`);
                              onNavigateTab('purchase-orders');
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              v.isSelected
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black'
                                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            }`}
                          >
                            Award PO
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* C. PURCHASE ORDERS */}
      {activeSubSection === 'purchase-orders' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Issued Purchase Orders ({MOCK_PURCHASE_ORDERS.length})</span>
              </h3>
              <button
                onClick={() => onToast('New PO Creation Dialog')}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                + New PO
              </button>
            </div>

            <div className="space-y-2">
              {MOCK_PURCHASE_ORDERS.map((po: PurchaseOrderItem) => {
                const isSelected = selectedPo?.id === po.id;
                return (
                  <div
                    key={po.id}
                    onClick={() => setSelectedPo(po)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-md'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400">{po.poNumber}</span>
                        <p className="text-xs font-bold text-white mt-0.5">{po.supplierName}</p>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        {po.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-700/60">
                      <span>{po.productName} ({po.quantity} {po.unit})</span>
                      <span className="font-mono font-bold text-white">₹{po.total.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            {selectedPo ? (
              <>
                <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">{selectedPo.poNumber}</span>
                    <h3 className="text-base font-black text-white">{selectedPo.supplierName}</h3>
                    <p className="text-xs text-slate-400">Target: {selectedPo.expectedDelivery}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenPrintModal(`Purchase Order ${selectedPo.poNumber}`, selectedPo)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onToast(`Generating GRN for PO ${selectedPo.poNumber}`);
                        onNavigateTab('grn');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Inward GRN
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Line Items Ordered</span>
                    <div className="flex justify-between items-center text-white">
                      <span>{selectedPo.productName}</span>
                      <span className="font-mono">{selectedPo.quantity} {selectedPo.unit} @ ₹{selectedPo.rate}/{selectedPo.unit}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Payment Terms</span>
                      <span className="font-mono font-bold text-white text-xs mt-0.5 block">{selectedPo.paymentTerms}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-300 font-bold block">Grand Total (Net)</span>
                      <span className="font-mono font-black text-emerald-400 text-xs mt-0.5 block">₹{selectedPo.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/20 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">3-Way Match Governance</span>
                    <div className="flex items-center gap-3 pt-1 text-[11px]">
                      <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> PO Matched</span>
                      <span className="flex items-center gap-1 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> GRN Inspected</span>
                      <span className="flex items-center gap-1 text-amber-400"><Clock className="w-3.5 h-3.5" /> Bill Awaiting</span>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* D. GRN / MATERIAL RECEIPTS */}
      {activeSubSection === 'grn' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Goods Receipt Notes (GRN) &bull; Weighbridge &amp; QC Gate Inward</span>
              </h3>
              <p className="text-[11px] text-slate-400">Physical receipt inspection with gross/tare/net weighbridge certificate verification</p>
            </div>
            <button
              onClick={() => onToast('Opened Weighbridge Inward GRN form')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Record Inward GRN
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_GRNS.map((grn: GrnRecord) => (
              <div
                key={grn.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{grn.grnNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">Ref: {grn.poNumber}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      QC: {grn.qualityCheck}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{grn.materialName}</p>
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                    <span>Received: <strong className="text-white font-mono">{grn.receivedQty} {grn.unit}</strong></span>
                    <span>Accepted: <strong className="text-emerald-400 font-mono">{grn.acceptedQty} {grn.unit}</strong></span>
                    {grn.rejectedQty > 0 && (
                      <span className="text-rose-400 font-bold">Rejected: {grn.rejectedQty} {grn.unit}</span>
                    )}
                    <span>Vehicle: <strong className="text-slate-200">{grn.vehicleNumber}</strong></span>
                    <span>Officer: {grn.receivedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
                  <button
                    onClick={() => onOpenPrintModal(`GRN Receipt ${grn.grnNumber}`, grn)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onToast(`Converting GRN ${grn.grnNumber} into Purchase Bill`);
                      onNavigateTab('purchase-bills');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Book Purchase Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E. PURCHASE BILLS */}
      {activeSubSection === 'purchase-bills' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Vendor Purchase Bills (Accounts Payable)</span>
              </h3>
              <p className="text-[11px] text-slate-400">Validated against PO and GRN with automated input tax credit (ITC) ledger booking</p>
            </div>
            <button
              onClick={() => onToast('Open Purchase Bill Booking Form')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Record Purchase Bill
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_PURCHASE_BILLS.map((bill: PurchaseBillRecord) => (
              <div
                key={bill.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{bill.billNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">PO: {bill.poNumber}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {bill.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{bill.supplierName}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Due Date: <strong className="text-white font-mono">{bill.dueDate}</strong></span>
                    <span>GST Tax: <strong className="text-emerald-400 font-mono">₹{bill.gstAmount.toLocaleString()}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
                  <span className="text-base font-mono font-black text-white mr-2">₹{bill.grandTotal.toLocaleString()}</span>
                  <button
                    onClick={() => {
                      onToast(`Initiating disbursement for ${bill.billNumber}`);
                      onNavigateTab('payments');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Disburse Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* F. PURCHASE RETURNS */}
      {activeSubSection === 'purchase-returns' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Purchase Returns &amp; Debit Notes</span>
              </h3>
              <p className="text-[11px] text-slate-400">Issue debit notes for rejected crusher spares, contaminated fuel or substandard tyres</p>
            </div>
            <button
              onClick={() => onToast('Create Debit Note & Return Memo')}
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs cursor-pointer"
            >
              + Create Debit Note
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_PURCHASE_RETURNS.map((ret) => (
              <div key={ret.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">{ret.debitNoteNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">Ref: {ret.returnNumber} &bull; {ret.billNumber}</span>
                  </div>
                  <p className="font-bold text-white mt-1">Returned {ret.quantity} {ret.unit} {ret.productName} to {ret.supplierName}</p>
                  <p className="text-[11px] text-slate-400">{ret.reason}</p>
                </div>
                <span className="text-base font-mono font-black text-rose-400">₹{ret.amount.toLocaleString()} Debit</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
