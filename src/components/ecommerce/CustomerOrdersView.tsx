import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Truck,
  Layers,
  FileText
} from 'lucide-react';
import { CommerceOrder, OrderStatus, COMMERCE_ORDERS } from '../../data/ecommerceStudioData';

interface CustomerOrdersViewProps {
  orders: CommerceOrder[];
  onSelectOrder: (order: CommerceOrder) => void;
  onNewOrderWizard: () => void;
}

export const CustomerOrdersView: React.FC<CustomerOrdersViewProps> = ({
  orders,
  onSelectOrder,
  onNewOrderWizard
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'PROCESSING' | 'DISPATCHED' | 'DELIVERED' | 'DISPUTED'>('ALL');

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.district.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'ACTIVE') return ord.status !== 'Completed' && ord.status !== 'Cancelled';
    if (activeFilter === 'PROCESSING') return ord.status === 'Processing' || ord.status === 'Ready for Dispatch' || ord.status === 'Order Confirmed';
    if (activeFilter === 'DISPATCHED') return ord.status === 'Dispatched' || ord.status === 'Out for Delivery';
    if (activeFilter === 'DELIVERED') return ord.status === 'Delivered' || ord.status === 'Customer Confirmed' || ord.status === 'Completed';
    if (activeFilter === 'DISPUTED') return ord.status === 'Disputed' || ord.hasDispute;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              ORDER LIFECYCLE MANAGEMENT
            </span>
            <span className="text-xs text-slate-400 font-medium">14 Stage Operational Pipeline</span>
          </div>
          <h1 className="text-xl font-black text-white mt-1">Customer Orders ({orders.length})</h1>
        </div>

        <button
          onClick={onNewOrderWizard}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Customer Order</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer, product, district..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto w-full sm:w-auto">
          {(['ALL', 'ACTIVE', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'DISPUTED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                activeFilter === filter
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/70">
                <th className="p-4">Order ID / Date</th>
                <th className="p-4">Customer & Project</th>
                <th className="p-4">Product & Qty</th>
                <th className="p-4">Supplier Concession</th>
                <th className="p-4">Order Value</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => onSelectOrder(ord)}
                  className="hover:bg-slate-800/50 transition cursor-pointer group"
                >
                  <td className="p-4">
                    <div className="font-mono font-bold text-amber-400">{ord.orderNumber}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{ord.orderDate}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white group-hover:text-amber-400 transition">{ord.customerName}</div>
                    <div className="text-[11px] text-slate-400">{ord.siteProjectName} ({ord.district})</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{ord.productName}</div>
                    <div className="font-mono text-amber-300 font-bold">{ord.quantity.toLocaleString()} {ord.unit}s</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div className="truncate max-w-[160px]">{ord.supplierName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{ord.assignedVehicleNumber || 'No Tipper Assigned'}</div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    ₹{ord.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold block">
                      Paid: ₹{ord.advancePaid.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Bal: ₹{ord.balanceAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg inline-block ${
                      ord.status === 'Completed' || ord.status === 'Customer Confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : ord.status === 'Disputed'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : ord.status === 'Out for Delivery' || ord.status === 'Dispatched'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectOrder(ord);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-xs transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
