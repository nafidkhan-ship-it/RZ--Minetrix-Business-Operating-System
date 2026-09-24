import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Download,
  FileText,
  DollarSign,
  ArrowRight,
  Truck,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import {
  PurchaseRequest,
  PurchaseOrder,
  GoodsReceiptNote,
  PurchaseBill
} from '../types';
import {
  MOCK_PURCHASE_REQUESTS,
  MOCK_PURCHASE_ORDERS,
  MOCK_GOODS_RECEIPT_NOTES,
  MOCK_PURCHASE_BILLS
} from '../data/erpMasterData';

interface PurchaseManagementViewProps {
  onCreateTask?: (title: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}

export const PurchaseManagementView: React.FC<PurchaseManagementViewProps> = ({
  onCreateTask,
  onOpenPrintModal
}) => {
  const [subTab, setSubTab] = useState<'requests' | 'orders' | 'grn' | 'bills'>('orders');
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [requests, setRequests] = useState<PurchaseRequest[]>(MOCK_PURCHASE_REQUESTS);
  const [grns, setGrns] = useState<GoodsReceiptNote[]>(MOCK_GOODS_RECEIPT_NOTES);
  const [bills, setBills] = useState<PurchaseBill[]>(MOCK_PURCHASE_BILLS);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              PROCUREMENT &bull; FULL PURCHASE LIFECYCLE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <span>Procurement &amp; Supplier Purchase Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Covers the complete sequence: <strong>Purchase Request &rarr; RFQ &rarr; Supplier Quotation &rarr; PO &rarr; Material Received &rarr; GRN &rarr; Purchase Bill &rarr; Payment</strong>.
          </p>
        </div>

        {/* Action button */}
        <button
          onClick={() => showToast('Purchase Requisition draft created')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Purchase Request</span>
        </button>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs font-mono">
        {[
          { id: 'requests', label: `Purchase Requests (${requests.length})`, icon: FileText },
          { id: 'orders', label: `Purchase Orders (${purchaseOrders.length})`, icon: ShoppingBag },
          { id: 'grn', label: `Goods Receipt Notes (${grns.length})`, icon: Truck },
          { id: 'bills', label: `Purchase Bills (${bills.length})`, icon: DollarSign }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PURCHASE ORDERS TAB */}
      {subTab === 'orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {purchaseOrders.map(po => (
              <div
                key={po.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-amber-400 text-sm">{po.poNumber}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                        {po.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm mt-0.5">{po.supplierName}</h3>
                    <div className="text-[11px] text-slate-500 font-mono">
                      PO Date: {po.date} &bull; Expected Delivery: {po.deliveryDate} &bull; Terms: {po.paymentTerms}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Total Amount</span>
                    <span className="text-xl font-black text-white">₹{po.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Items in PO */}
                <div className="space-y-2">
                  {po.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                    >
                      <div>
                        <span className="text-white font-bold">{item.productName}</span>
                        <div className="text-[11px] text-slate-500">
                          {item.qty} {item.unit} @ ₹{item.rate} / {item.unit} &bull; GST {item.gstPct}%
                        </div>
                      </div>
                      <div className="text-amber-400 font-bold">
                        ₹{item.total.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Subtotal: ₹{po.subtotal.toLocaleString()} + Tax: ₹{po.taxTotal.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast(`Sent PO ${po.poNumber} to supplier via WhatsApp`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold cursor-pointer"
                    >
                      Send Supplier WhatsApp
                    </button>
                    <button
                      onClick={() => onCreateTask?.(`Follow-up delivery for ${po.poNumber} (${po.supplierName})`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-amber-400 font-bold cursor-pointer flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Create OTT Task</span>
                    </button>
                    <button
                      onClick={() => onOpenPrintModal?.(`Purchase Order ${po.poNumber}`, po)}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. GOODS RECEIPT NOTES (GRN) */}
      {subTab === 'grn' && (
        <div className="space-y-3">
          {grns.map(grn => (
            <div
              key={grn.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="font-bold text-amber-400">{grn.grnNumber}</span>
                    <span className="text-slate-500">&bull; Linked PO: {grn.poNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                      {grn.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm mt-1">{grn.supplierName}</h4>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Item Received: <strong className="text-white">{grn.productName}</strong> ({grn.acceptedQty.toLocaleString()} units)
                  </div>
                </div>

                <div className="text-right text-xs font-mono">
                  <span className="text-slate-500 block">Gate Pass Reference:</span>
                  <span className="text-amber-300 font-bold">{grn.gatePassNo}</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>Vehicle: <strong className="text-white">{grn.vehicleNumber}</strong> (Driver: {grn.driverName})</span>
                <span className="text-emerald-400">&bull; {grn.remarks}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. PURCHASE REQUESTS */}
      {subTab === 'requests' && (
        <div className="space-y-3">
          {requests.map(req => (
            <div
              key={req.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-amber-400">{req.requestNo}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    Dept: {req.department}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    {req.priority} PRIORITY
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm mt-1">{req.product} ({req.quantity})</h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  Requested by {req.requestedBy} &bull; Purpose: {req.purpose} &bull; Required by {req.requiredDate}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold">
                  {req.approvalStatus}
                </span>
                <button
                  onClick={() => showToast(`Converted ${req.requestNo} into RFQ for suppliers`)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Generate RFQ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. PURCHASE BILLS */}
      {subTab === 'bills' && (
        <div className="space-y-3">
          {bills.map(b => (
            <div
              key={b.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">{b.billNumber}</span>
                  <span className="text-slate-500">&bull; GRN: {b.grnNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                    Due: {b.dueDate}
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm font-sans mt-0.5">{b.supplierName}</h4>
                <div className="text-slate-400 mt-0.5">
                  Total Bill: ₹{b.totalAmount.toLocaleString()} &bull; Paid: ₹{b.paidAmount.toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Balance Payable:</span>
                <span className="text-base font-black text-rose-400">₹{b.balance.toLocaleString()}</span>
                <button
                  onClick={() => showToast(`Recorded payment voucher for ${b.billNumber}`)}
                  className="mt-1 px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer block ml-auto font-sans"
                >
                  Pay Supplier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
