import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  RotateCcw,
  Truck,
  Receipt,
  FileText,
  Printer,
  Sparkles
} from 'lucide-react';
import {
  QuotationRecord,
  SalesOrderItem,
  DeliveryRecord,
  InvoiceRecord,
  CommerceSubTab
} from '../types';
import {
  MOCK_QUOTATIONS,
  MOCK_SALES_ORDERS,
  MOCK_DELIVERIES,
  MOCK_INVOICES,
  MOCK_SALES_RETURNS
} from '../commerceMockData';

interface SalesViewsProps {
  activeSubSection: 'quotations' | 'sales-orders' | 'delivery' | 'invoices' | 'sales-returns';
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
  onOpenFlowModal?: () => void;
}

export const SalesViews: React.FC<SalesViewsProps> = ({
  activeSubSection,
  onNavigateTab,
  onToast,
  onOpenPrintModal,
  onOpenFlowModal
}) => {
  const [selectedSo, setSelectedSo] = useState<SalesOrderItem | null>(MOCK_SALES_ORDERS[0]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Sub-Navigation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Sales, Dispatch &amp; Revenue Operations &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white capitalize">
              {activeSubSection.replace('-', ' ')} &bull; Quarry &amp; Crusher Order-to-Cash
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Quotation &rarr; 1-Click Sales Order &rarr; Weighbridge Delivery Dispatch &rarr; e-Invoice / Gate Pass &rarr; Customer Payment &amp; Credit Notes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenFlowModal?.()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate Sales to Invoice Flow</span>
            </button>
          </div>
        </div>

        {/* Sub-Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 border-t border-slate-800/80 mt-4">
          {[
            { id: 'quotations', label: '1. Quotations', count: MOCK_QUOTATIONS.length },
            { id: 'sales-orders', label: '2. Sales Orders (SO)', count: MOCK_SALES_ORDERS.length },
            { id: 'delivery', label: '3. Delivery & Weighbridge Dispatches', count: MOCK_DELIVERIES.length },
            { id: 'invoices', label: '4. Invoices & e-Way Simulation', count: MOCK_INVOICES.length },
            { id: 'sales-returns', label: '5. Sales Returns & Credit Notes', count: MOCK_SALES_RETURNS.length }
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

      {/* A. QUOTATIONS */}
      {activeSubSection === 'quotations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Commercial Quotations &amp; Estimations</span>
              </h3>
              <p className="text-[11px] text-slate-400">Formal commercial quotes for building contractors with 1-click conversion to Sales Order</p>
            </div>
            <button
              onClick={() => onToast('Open New Quotation Creator')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Create Quotation
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_QUOTATIONS.map((q: QuotationRecord) => (
              <div
                key={q.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{q.quotationNumber}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {q.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Valid until {q.validityDate}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{q.customerName}</p>
                  <p className="text-[11px] text-slate-300 font-mono">{q.productName} &bull; {q.quantity} {q.unit} @ ₹{q.rate}/{q.unit}</p>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
                  <span className="text-base font-mono font-black text-white mr-2">₹{q.grandTotal.toLocaleString()}</span>
                  <button
                    onClick={() => onOpenPrintModal(`Quotation ${q.quotationNumber}`, q)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onToast(`Converting ${q.quotationNumber} into Sales Order...`);
                      onNavigateTab('sales-orders');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs cursor-pointer flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Convert to Sales Order</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* B. SALES ORDERS */}
      {activeSubSection === 'sales-orders' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* List (6 cols) */}
          <div className="xl:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Confirmed Sales Orders ({MOCK_SALES_ORDERS.length})</span>
              </h3>
              <button
                onClick={() => onToast('Open New Sales Order modal')}
                className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                + New Order
              </button>
            </div>

            <div className="space-y-2">
              {MOCK_SALES_ORDERS.map((so: SalesOrderItem) => {
                const isSelected = selectedSo?.id === so.id;
                return (
                  <div
                    key={so.id}
                    onClick={() => setSelectedSo(so)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-md'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-400">{so.orderNumber}</span>
                        <p className="text-xs font-bold text-white mt-0.5">{so.customerName}</p>
                      </div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {so.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-700/60">
                      <span>{so.productName} ({so.quantity} {so.unit})</span>
                      <span className="font-mono font-bold text-white">₹{so.grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Dispatch Button (6 cols) */}
          <div className="xl:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            {selectedSo ? (
              <>
                <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">{selectedSo.orderNumber}</span>
                    <h3 className="text-base font-black text-white">{selectedSo.customerName}</h3>
                    <p className="text-xs text-slate-400">Scheduled: {selectedSo.deliveryDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onOpenPrintModal(`Sales Order ${selectedSo.orderNumber}`, selectedSo)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onToast(`Initiating Dispatch for ${selectedSo.orderNumber}`);
                        onNavigateTab('delivery');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                    >
                      Dispatch Material
                    </button>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Material Breakdown</span>
                    <div className="flex justify-between items-center text-white">
                      <span>{selectedSo.productName}</span>
                      <span className="font-mono">{selectedSo.quantity} {selectedSo.unit} @ ₹{selectedSo.rate}/{selectedSo.unit}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">Subtotal</span>
                      <span className="font-mono font-bold text-white text-xs mt-0.5 block">
                        ₹{(selectedSo.quantity * selectedSo.rate).toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block">GST Tax</span>
                      <span className="font-mono font-bold text-amber-400 text-xs mt-0.5 block">
                        ₹{selectedSo.taxAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <span className="text-[10px] text-emerald-300 font-bold block">Grand Total</span>
                      <span className="font-mono font-black text-emerald-400 text-xs mt-0.5 block">
                        ₹{selectedSo.grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/20 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">Origin &amp; Logistics Allocation</span>
                    <p className="text-slate-300">Delivery Address: {selectedSo.deliveryAddress}</p>
                    <p className="text-slate-400 text-[11px]">Requirement: {selectedSo.vehicleRequirement}</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* C. DELIVERY & WEIGHBRIDGE DISPATCH */}
      {activeSubSection === 'delivery' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Delivery Dispatches &amp; Weighbridge Slips</span>
              </h3>
              <p className="text-[11px] text-slate-400">Assigned fleet tippers with gross, tare and net payload measurements</p>
            </div>
            <button
              onClick={() => onToast('Open Weighbridge Loading Pass')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Create Dispatch Slip
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_DELIVERIES.map((d: DeliveryRecord) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{d.deliveryNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">SO: {d.salesOrderNumber}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white">{d.customerName} &bull; {d.productName}</p>
                  <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                    <span>Vehicle: <strong className="text-white">{d.vehicleNumber}</strong></span>
                    <span>Driver: {d.driverName} ({d.driverPhone})</span>
                    <span>Net Weight: <strong className="text-emerald-400 font-mono">{d.quantity} {d.unit}</strong></span>
                    <span>Pass: <strong className="text-amber-300 font-mono">{d.gatePassNumber}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
                  <button
                    onClick={() => onOpenPrintModal(`Weighbridge Delivery Slip ${d.deliveryNumber}`, d)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onToast(`Generated Tax Invoice for ${d.deliveryNumber}`);
                      onNavigateTab('invoices');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Generate Tax Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D. INVOICES & e-WAY SIMULATION */}
      {activeSubSection === 'invoices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>GST Tax Invoices &amp; e-Invoice / e-Way Port</span>
              </h3>
              <p className="text-[11px] text-slate-400">Statutory GST compliance with automated IRN generation and QR code embedding</p>
            </div>
            <button
              onClick={() => onToast('Open Invoice Builder')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              + Create Direct Invoice
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_INVOICES.map((inv: InvoiceRecord) => (
              <div
                key={inv.id}
                className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 hover:border-slate-600 transition flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{inv.invoiceNumber}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {inv.paymentStatus}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Order: {inv.orderNumber}</span>
                  </div>
                  <p className="text-sm font-bold text-white">{inv.customerName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">Date: {inv.date} &bull; Due: {inv.dueDate}</p>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-700">
                  <span className="text-base font-mono font-black text-white mr-2">₹{inv.grandTotal.toLocaleString()}</span>
                  <button
                    onClick={() => onOpenPrintModal(`GST Tax Invoice ${inv.invoiceNumber}`, inv)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onToast(`Recording payment for ${inv.invoiceNumber}`);
                      onNavigateTab('payments');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Receive Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E. SALES RETURNS */}
      {activeSubSection === 'sales-returns' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Sales Returns &amp; Credit Notes</span>
              </h3>
              <p className="text-[11px] text-slate-400">Return weighbridge re-entry and credit note issuance for customer disputes or excess loads</p>
            </div>
            <button
              onClick={() => onToast('Create Sales Return & Credit Note')}
              className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 font-black text-xs cursor-pointer"
            >
              + Issue Credit Note
            </button>
          </div>

          <div className="space-y-3">
            {MOCK_SALES_RETURNS.map((ret) => (
              <div key={ret.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 flex justify-between items-center text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-rose-400">{ret.creditNoteNumber}</span>
                    <span className="text-[10px] font-mono text-slate-400">Ref Inv: {ret.invoiceNumber} &bull; Return: {ret.returnNumber}</span>
                  </div>
                  <p className="font-bold text-white mt-1">Return of {ret.returnedQty} {ret.unit} {ret.productName} by {ret.customerName}</p>
                  <p className="text-[11px] text-slate-400">{ret.reason}</p>
                </div>
                <span className="text-base font-mono font-black text-rose-400">₹{ret.creditAmount.toLocaleString()} Credit</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
