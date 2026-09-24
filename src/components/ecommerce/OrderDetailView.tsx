import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  User,
  Building,
  Printer,
  Download,
  MessageSquare,
  Sparkles,
  Layers,
  MapPin,
  Phone,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';
import {
  CommerceOrder,
  OrderStatus,
  COMMERCE_PAYMENTS,
  COMMERCE_DISPATCHES,
  COMMERCE_DOCUMENTS
} from '../../data/ecommerceStudioData';
import { ottEcosystemBridge } from '../../services/ottEcosystemBridge';

interface OrderDetailViewProps {
  order: CommerceOrder;
  onBack: () => void;
  onOpenChat: (supplierName: string, orderRef: string) => void;
  onCreateOttTask: (order: CommerceOrder) => void;
  onOpenInvoice: (order: CommerceOrder) => void;
  onConfirmDelivery: (order: CommerceOrder) => void;
  onRaiseDispute: (order: CommerceOrder) => void;
}

export type OrderProfileTab =
  | 'Overview'
  | 'Product'
  | 'Customer'
  | 'Supplier'
  | 'Quote'
  | 'Payment'
  | 'Dispatch'
  | 'Vehicle'
  | 'Delivery'
  | 'Invoice'
  | 'Documents'
  | 'Chat'
  | 'OTT Tasks'
  | 'Timeline';

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  onBack,
  onOpenChat,
  onCreateOttTask,
  onOpenInvoice,
  onConfirmDelivery,
  onRaiseDispute
}) => {
  const [activeTab, setActiveTab] = useState<OrderProfileTab>('Overview');
  const [chatMessage, setChatMessage] = useState('');
  const [chatThread, setChatThread] = useState([
    { sender: 'Quarry Dispatch Supervisor', time: 'Yesterday 04:30 PM', text: `Order ${order.orderNumber} confirmed. Stacking ${order.quantity} ${order.unit}s in loading yard.` },
    { sender: 'Customer Desk', time: 'Today 08:15 AM', text: `Please ensure tipper driver carries computer weighbridge certificate and mineral transit pass.` },
    { sender: 'Quarry Dispatch Supervisor', time: 'Today 09:00 AM', text: `Noted. Gate pass GP-KL14 issued. Driver instructed.` }
  ]);

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatThread([
      ...chatThread,
      { sender: 'You (Operations)', time: 'Just now', text: chatMessage }
    ]);
    setChatMessage('');
  };

  const TABS: OrderProfileTab[] = [
    'Overview',
    'Product',
    'Customer',
    'Supplier',
    'Quote',
    'Payment',
    'Dispatch',
    'Vehicle',
    'Delivery',
    'Invoice',
    'Documents',
    'Chat',
    'OTT Tasks',
    'Timeline'
  ];

  // Related data
  const orderPayments = COMMERCE_PAYMENTS.filter(p => p.orderNumber === order.orderNumber);
  const orderDispatches = COMMERCE_DISPATCHES.filter(d => d.orderNumber === order.orderNumber);
  const orderDocs = COMMERCE_DOCUMENTS.filter(doc => doc.orderNumber === order.orderNumber);

  return (
    <div className="space-y-6">
      {/* Back button & top breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Customer Orders</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenInvoice(order)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print Invoice</span>
          </button>
          <button
            onClick={() => onCreateOttTask(order)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>+ RZ OTT Task</span>
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {order.orderNumber}
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                order.status === 'Completed' || order.status === 'Customer Confirmed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : order.status === 'Disputed'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : order.status === 'Out for Delivery' || order.status === 'Dispatched'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {order.status}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Ordered: {order.orderDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {order.quantity.toLocaleString()} {order.unit}s &bull; {order.productName}
            </h1>
            <p className="text-xs text-slate-300">
              Customer: <strong className="text-white">{order.customerName}</strong> &bull; Site: <strong className="text-white">{order.siteProjectName}</strong> ({order.district})
            </p>
          </div>

          <div className="flex flex-row lg:flex-col items-end gap-1 text-right bg-slate-950/80 p-4 rounded-2xl border border-slate-800 w-full lg:w-auto">
            <span className="text-[10px] text-slate-400 uppercase font-mono">Total Order Value</span>
            <span className="text-2xl font-black text-amber-400 font-mono">
              ₹{order.totalAmount.toLocaleString()}
            </span>
            <div className="text-xs text-slate-400 font-mono">
              Paid: <span className="text-emerald-400 font-bold">₹{order.advancePaid.toLocaleString()}</span> &bull; Balance: <span className="text-amber-300">₹{order.balanceAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action strip */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>Delivery Tracking: <strong className="text-white">{order.deliveryStatusTimeline}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenChat(order.supplierName, order.orderNumber)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Chat with Supplier</span>
            </button>
            <button
              onClick={() => onConfirmDelivery(order)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-md"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm Delivery</span>
            </button>
            <button
              onClick={() => onRaiseDispute(order)}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue / Dispute</span>
            </button>
          </div>
        </div>
      </div>

      {/* 14 TABS NAVIGATION (Scrollable horizontal) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === tab
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-500 text-[11px] uppercase font-mono">Product & Dimensions</span>
                <div className="text-sm font-bold text-white">{order.productName}</div>
                <div className="text-xs text-amber-400 font-mono">{order.dimensions}</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-500 text-[11px] uppercase font-mono">Selected Quarry Concession</span>
                <div className="text-sm font-bold text-white">{order.supplierName}</div>
                <div className="text-xs text-slate-400">Direct pit extraction with e-Way pass</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                <span className="text-slate-500 text-[11px] uppercase font-mono">Assigned Fleet Vehicle</span>
                <div className="text-sm font-bold text-white">{order.assignedVehicleNumber || 'Awaiting Tipper Assignment'}</div>
                <div className="text-xs text-slate-400">Driver: {order.assignedDriverName || 'Pending'} ({order.assignedDriverPhone || '—'})</div>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Financial Schedule & Escrow Settlement
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Material Rate</span>
                  <span className="text-white font-bold">₹{order.materialRate} / {order.unit}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Material Amount</span>
                  <span className="text-white font-bold">₹{order.materialAmount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tipper Haulage</span>
                  <span className="text-white font-bold">₹{order.deliveryCharge.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">GST Taxes</span>
                  <span className="text-white font-bold">₹{order.taxAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick Timeline Preview */}
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Order Lifecycle Timeline ({order.timeline.length} Events Logged)
              </h3>
              <div className="space-y-2">
                {order.timeline.map((evt) => (
                  <div key={evt.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-start justify-between gap-4 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{evt.status}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">{evt.actor}</span>
                      </div>
                      <p className="text-slate-400 mt-1">{evt.notes}</p>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px] whitespace-nowrap">{evt.date} {evt.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT */}
        {activeTab === 'Product' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Product Specifications</h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Product Code</span>
                <span className="text-white font-mono font-bold">{order.productCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Dimensions</span>
                <span className="text-white font-mono font-bold">{order.dimensions}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ordered Quantity</span>
                <span className="text-amber-400 font-mono font-black">{order.quantity.toLocaleString()} {order.unit}s</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER */}
        {activeTab === 'Customer' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Customer & Site Profile</h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div><span className="text-slate-500">Name:</span> <strong className="text-white">{order.customerName}</strong></div>
              <div><span className="text-slate-500">Phone:</span> <span className="text-white font-mono">{order.customerPhone}</span></div>
              <div><span className="text-slate-500">Site Project:</span> <span className="text-white">{order.siteProjectName}</span></div>
              <div><span className="text-slate-500">Full Address:</span> <span className="text-slate-300">{order.customerAddress}, {order.district}, {order.state} - {order.pinCode}</span></div>
              <div><span className="text-slate-500">Site Access:</span> <span className="text-slate-300">{order.siteAccessNotes}</span></div>
            </div>
          </div>
        )}

        {/* TAB 4: SUPPLIER */}
        {activeTab === 'Supplier' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Quarry Concession / Mill Supplier</h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div><span className="text-slate-500">Supplier Name:</span> <strong className="text-white">{order.supplierName}</strong></div>
              <div><span className="text-slate-500">Concession ID:</span> <span className="text-amber-400 font-mono font-bold">{order.supplierId}</span></div>
              <div><span className="text-slate-500">Quality Guarantee:</span> <span className="text-emerald-400 font-semibold">100% Verified Concession Extraction</span></div>
            </div>
          </div>
        )}

        {/* TAB 6: PAYMENT */}
        {activeTab === 'Payment' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Payment Ledger & Receipts</h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">{order.paymentStatus}</span>
            </div>
            <div className="space-y-2">
              {orderPayments.map((pay) => (
                <div key={pay.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{pay.paymentType}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">{pay.status}</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1 font-mono">
                      Ref: {pay.transactionReference} &bull; Method: {pay.paymentMethod} &bull; Date: {pay.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400 font-mono">₹{pay.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{pay.receiptNumber}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: DISPATCH */}
        {activeTab === 'Dispatch' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Quarry Gate & Loading Dispatch</h3>
            <div className="space-y-2">
              {orderDispatches.map((disp) => (
                <div key={disp.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Gate Pass: <span className="text-amber-400 font-mono">{disp.gatePassNumber}</span></span>
                    <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">{disp.loadingStatus}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300 font-mono">
                    <div>Vehicle: <strong className="text-white">{disp.vehicleNumber}</strong></div>
                    <div>Driver: <strong className="text-white">{disp.driverName}</strong></div>
                    <div>Net Weight: <strong className="text-white">{disp.netWeightTons || '—'} MT</strong></div>
                    <div>Pickup: <span className="text-slate-400">{disp.pickupLocation}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: VEHICLE */}
        {activeTab === 'Vehicle' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Vehicle Connection & Fleet Telematics</h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs font-mono">
              <div>Assigned Tipper: <strong className="text-amber-400">{order.assignedVehicleNumber || 'Pending'}</strong></div>
              <div>Driver: <span className="text-white">{order.assignedDriverName || 'Pending'} ({order.assignedDriverPhone || '—'})</span></div>
              <div>Requirement Type: <span className="text-slate-300">{order.vehicleRequirement}</span></div>
              <p className="text-slate-400 font-sans pt-2 text-[11px]">
                Connected directly with Platform 3 (Vehicle Management). Real-world status tracking enabled for customer delivery milestone updates.
              </p>
            </div>
          </div>
        )}

        {/* TAB 9: DELIVERY */}
        {activeTab === 'Delivery' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Delivery Milestone Tracking</h3>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
              <div className="text-slate-300">
                Scheduled Arrival: <strong className="text-amber-400 font-mono">{order.estimatedDelivery}</strong>
              </div>
              <div className="text-slate-300">
                Current Status: <span className="text-emerald-400 font-bold">{order.deliveryStatusTimeline}</span>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onConfirmDelivery(order)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Verify Delivery on Site
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: INVOICE */}
        {activeTab === 'Invoice' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">GST Commercial Invoice</h3>
              <button
                onClick={() => onOpenInvoice(order)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
              >
                Open Full Tax Invoice View
              </button>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono space-y-1">
              <div>Invoice #: <span className="text-amber-400 font-bold">INV-RZ-2026-0881</span></div>
              <div>Customer GSTIN: <span className="text-white">32AABCS4490Q1ZX</span></div>
              <div>Total Billable: <span className="text-emerald-400 font-bold">₹{order.totalAmount.toLocaleString()}</span></div>
            </div>
          </div>
        )}

        {/* TAB 11: DOCUMENTS */}
        {activeTab === 'Documents' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Transit Passes & Weighbridge Slips ({orderDocs.length})</h3>
            <div className="space-y-2">
              {orderDocs.map((doc) => (
                <div key={doc.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-bold text-white">{doc.title}</div>
                      <div className="text-[10px] text-slate-500">{doc.category} &bull; {doc.fileSize} &bull; {doc.uploadedAt}</div>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs hover:bg-slate-700 cursor-pointer">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 12: CHAT */}
        {activeTab === 'Chat' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Order Collaboration Thread</h3>
              <span className="text-xs text-amber-400 font-mono">Live RZ® Chat Channel</span>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 h-64 overflow-y-auto space-y-3 text-xs">
              {chatThread.map((msg, i) => (
                <div key={i} className="p-2.5 bg-slate-900 rounded-xl space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="font-bold text-amber-400">{msg.sender}</span>
                    <span className="text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-200">{msg.text}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                placeholder="Type dispatch instructions or inquiry..."
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleSendChat}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* TAB 13: OTT TASKS */}
        {activeTab === 'OTT Tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Linked RZ® OTT Operational Tasks</h3>
                <p className="text-xs text-slate-400">Tasks synchronized between E-Commerce and OTT schedule</p>
              </div>
              <button
                onClick={() => onCreateOttTask(order)}
                className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 cursor-pointer"
              >
                + Add Task to OTT
              </button>
            </div>
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">Coordinate Quarry Dispatch & Weighment</div>
                  <div className="text-[11px] text-slate-400 font-sans">Source: Building Materials E-Commerce &bull; {order.orderNumber}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  HIGH PRIORITY
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 14: TIMELINE */}
        {activeTab === 'Timeline' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white">Full Lifecycle Event Timeline</h3>
            <div className="relative border-l border-slate-800 ml-3 space-y-4 pl-5">
              {order.timeline.map((item, idx) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900" />
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{item.status}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.date} {item.time}</span>
                    </div>
                    <div className="text-[11px] text-amber-400 font-mono">Actor: {item.actor}</div>
                    <p className="text-slate-300 mt-1">{item.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
