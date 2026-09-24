import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Clock,
  Truck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  MessageSquare,
  Printer,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { CentralOrder, OrderStatus } from '../types';
import { MOCK_CENTRAL_ORDERS } from '../data/erpMasterData';

interface CentralOrderManagementViewProps {
  onCreateTask?: (title: string) => void;
  onOpenChatWithCustomer?: (name: string) => void;
  onOpenPrintModal?: (title: string, data: any) => void;
}

export const CentralOrderManagementView: React.FC<CentralOrderManagementViewProps> = ({
  onCreateTask,
  onOpenChatWithCustomer,
  onOpenPrintModal
}) => {
  const [orders, setOrders] = useState<CentralOrder[]>(MOCK_CENTRAL_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<CentralOrder | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const ALL_17_STATUSES: OrderStatus[] = [
    'DRAFT',
    'ENQUIRY',
    'QUOTATION_REQUESTED',
    'QUOTATION_RECEIVED',
    'CONFIRMED',
    'PAYMENT_PENDING',
    'PROCESSING',
    'READY_FOR_DISPATCH',
    'DISPATCHED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CUSTOMER_CONFIRMED',
    'COMPLETED',
    'CANCELLED',
    'DISPUTED',
    'REFUND_PENDING',
    'REFUNDED'
  ];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      if (selectedStatusFilter !== 'ALL' && ord.status !== selectedStatusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          ord.orderNumber.toLowerCase().includes(q) ||
          ord.customerName.toLowerCase().includes(q) ||
          ord.productName.toLowerCase().includes(q) ||
          ord.destination.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [orders, selectedStatusFilter, searchQuery]);

  const advanceOrderStatus = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;
        let next: OrderStatus = ord.status;
        if (ord.status === 'READY_FOR_DISPATCH') next = 'DISPATCHED';
        else if (ord.status === 'DISPATCHED') next = 'OUT_FOR_DELIVERY';
        else if (ord.status === 'OUT_FOR_DELIVERY') next = 'DELIVERED';
        else if (ord.status === 'DELIVERED') next = 'CUSTOMER_CONFIRMED';
        else if (ord.status === 'CUSTOMER_CONFIRMED') next = 'COMPLETED';
        else if (ord.status === 'PAYMENT_PENDING') next = 'PROCESSING';
        else if (ord.status === 'PROCESSING') next = 'READY_FOR_DISPATCH';
        else if (ord.status === 'QUOTATION_RECEIVED') next = 'CONFIRMED';

        const updated = { ...ord, status: next };
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updated);
        }
        showToast(`Order ${ord.orderNumber} advanced to ${next}`);
        return updated;
      })
    );
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
              CENTRAL ORDER MANAGEMENT ENGINE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Cross-Platform Central Order Orchestrator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Supports all <strong>17 Order Lifecycle Statuses</strong>. Connects customer profile, rate engine, vehicle &amp; driver assignment, weighbridge tare pass, and billing in one unified view.
          </p>
        </div>

        <button
          onClick={() => showToast('New Order draft created')}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Filter by Status Pills (All 17 Statuses) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by order #, customer, product, site..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>
          <div className="text-xs font-mono text-slate-400">
            Total Orders: <strong className="text-white">{filteredOrders.length}</strong>
          </div>
        </div>

        {/* 17 Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedStatusFilter === 'ALL'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
            }`}
          >
            All 17 Statuses
          </button>
          {ALL_17_STATUSES.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer font-mono text-[11px] border ${
                selectedStatusFilter === st
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map(order => (
          <div
            key={order.id}
            onClick={() => setSelectedOrder(order)}
            className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-5 shadow-lg transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-xs">{order.orderNumber}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mt-0.5 group-hover:text-cyan-300 transition">
                    {order.customerName}
                  </h3>
                  <div className="text-[10px] text-slate-500 font-mono">{order.customerPhone}</div>
                </div>

                <span className="text-[9px] px-2 py-0.5 rounded font-mono font-bold bg-slate-950 border border-slate-800 text-amber-300">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Product and Qty */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 text-xs font-mono">
                <div className="text-white font-bold">{order.productName}</div>
                <div className="text-slate-400 text-[11px] flex justify-between">
                  <span>Quantity: {order.quantity.toLocaleString()} {order.unit}</span>
                  <span className="text-amber-400 font-bold">₹{order.appliedRate} / {order.unit}</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate" title={order.rateSource}>
                  Source: {order.rateSource}
                </div>
              </div>

              {/* Assigned Vehicle & Destination */}
              <div className="space-y-1 text-xs text-slate-400">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span>Destination:</span>
                  <span className="text-slate-200 truncate max-w-[150px]">{order.destination}</span>
                </div>
                {order.assignedVehicle && (
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span>Vehicle &amp; Driver:</span>
                    <span className="text-cyan-300 font-bold">{order.assignedVehicle} ({order.assignedDriver})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial summary */}
            <div className="pt-3 border-t border-slate-800 text-xs font-mono flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Total Payable:</span>
                <span className="text-white font-bold">₹{order.totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block">Balance:</span>
                <span className={order.balanceAmount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  ₹{order.balanceAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Order Detail Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="font-bold text-cyan-400 text-base">{selectedOrder.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                    {selectedOrder.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{selectedOrder.customerName}</h3>
                <div className="text-xs text-slate-500 font-mono">Date: {selectedOrder.date} &bull; Delivery: {selectedOrder.deliveryDate}</div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Communication & Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenChatWithCustomer?.(selectedOrder.customerName)}
                className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Customer</span>
              </button>
              <button
                onClick={() => onCreateTask?.(`Manage dispatch for ${selectedOrder.orderNumber} to ${selectedOrder.destination}`)}
                className="flex-1 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Assign OTT Task</span>
              </button>
              <button
                onClick={() => onOpenPrintModal?.(`Delivery Challan ${selectedOrder.orderNumber}`, selectedOrder)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                title="Print Challan"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Workflow Next Step */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Order Status Lifecycle</span>
                <span className="font-mono text-cyan-400 text-[10px]">17-Step Enterprise Engine</span>
              </div>
              <p className="text-xs text-slate-400">
                Current State: <strong className="text-amber-300">{selectedOrder.status.replace(/_/g, ' ')}</strong>
              </p>
              <button
                onClick={() => advanceOrderStatus(selectedOrder.id)}
                className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Advance to Next Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Product & Rate Engine Verification */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">
                Product &amp; Dynamic Pricing
              </span>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Product:</span>
                  <span className="text-white font-bold">{selectedOrder.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Quantity:</span>
                  <span className="text-white">{selectedOrder.quantity.toLocaleString()} {selectedOrder.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Resolved Rate:</span>
                  <span className="text-amber-400 font-bold">₹{selectedOrder.appliedRate} / {selectedOrder.unit}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-900 text-[11px]">
                  <span className="text-slate-500">Rate Rule Source:</span>
                  <span className="text-cyan-300 text-right max-w-xs">{selectedOrder.rateSource}</span>
                </div>
              </div>
            </div>

            {/* Vehicle & Logistics Integration */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">
                Fleet Logistics &amp; Weighbridge Pass
              </span>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Source Concession:</span>
                  <span className="text-white">{selectedOrder.supplierOrPlantSource || 'Quarry Pit #1'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Vehicle:</span>
                  <span className="text-amber-300 font-bold">{selectedOrder.assignedVehicle || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Driver:</span>
                  <span className="text-white">{selectedOrder.assignedDriver || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="text-white">{selectedOrder.destination}</span>
                </div>
              </div>
            </div>

            {/* Financial Ledger Summary */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-500 font-bold block">
                Billing &amp; Payment Ledger
              </span>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="text-white">₹{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (5%):</span>
                  <span className="text-white">+₹{selectedOrder.gstAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-slate-900">
                  <span>Total Bill:</span>
                  <span className="text-amber-400">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Paid Advance:</span>
                  <span>₹{selectedOrder.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-400 font-bold pt-1 border-t border-slate-900">
                  <span>Balance Due:</span>
                  <span>₹{selectedOrder.balanceAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
