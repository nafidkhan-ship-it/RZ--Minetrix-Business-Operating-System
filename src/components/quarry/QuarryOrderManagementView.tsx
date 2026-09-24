import React, { useState } from 'react';
import {
  Package,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText,
  Download,
  Printer,
  ChevronRight,
  Check,
  Pickaxe,
  Truck
} from 'lucide-react';

export interface QuarryOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  stoneType: 'Laterite Grade A (High Density)' | 'Laterite Grade B' | 'Laterite Sized Blocks' | 'Quarry Spalls / Rubble';
  quantityBlocks: number;
  ratePerBlock: number;
  totalAmount: number;
  deliveryLocation: string;
  requiredDate: string;
  assignedVehicle: string | null;
  driverName: string | null;
  orderStatus: 'NEW' | 'CONFIRMED' | 'CUTTING_IN_PROGRESS' | 'DISPATCH_READY' | 'DISPATCHED' | 'DELIVERED';
  paymentStatus: 'Unpaid' | 'Advance Received' | 'Fully Paid';
  notes: string;
}

interface QuarryOrderManagementViewProps {
  onCreateOttTask?: (taskTitle: string) => void;
  onNavigateSection?: (sectionId: any) => void;
}

export const QuarryOrderManagementView: React.FC<QuarryOrderManagementViewProps> = ({
  onCreateOttTask,
  onNavigateSection
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<QuarryOrder | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const initialOrders: QuarryOrder[] = [
    {
      id: 'QO-101',
      orderNumber: 'Q-ORD-2026-0041',
      customerName: 'Malabar Heritage Resorts',
      customerPhone: '+91 98471 22910',
      stoneType: 'Laterite Grade A (High Density)',
      quantityBlocks: 4500,
      ratePerBlock: 54,
      totalAmount: 243000,
      deliveryLocation: 'Bekal Fort Beach Resort Project, Kasaragod',
      requiredDate: '2026-09-22',
      assignedVehicle: 'KL-14-AJ-8821 (12-Wheeler)',
      driverName: 'Muneer Ahmed',
      orderStatus: 'DISPATCH_READY',
      paymentStatus: 'Advance Received',
      notes: 'High compressive strength required for exposed heritage stone masonry.'
    },
    {
      id: 'QO-102',
      orderNumber: 'Q-ORD-2026-0042',
      customerName: 'Apex Villa Developers',
      customerPhone: '+91 94470 88123',
      stoneType: 'Laterite Sized Blocks',
      quantityBlocks: 3000,
      ratePerBlock: 51,
      totalAmount: 153000,
      deliveryLocation: 'Kanhangad Green Valley Township, Site 3',
      requiredDate: '2026-09-23',
      assignedVehicle: 'KL-14-B-7719 (10-Wheeler)',
      driverName: 'Shankar Gowda',
      orderStatus: 'CUTTING_IN_PROGRESS',
      paymentStatus: 'Advance Received',
      notes: 'Standard 12x8x6 inch wire cut precision blocks.'
    },
    {
      id: 'QO-103',
      orderNumber: 'Q-ORD-2026-0043',
      customerName: 'Kasaragod Municipal Contractor',
      customerPhone: '+91 94475 00981',
      stoneType: 'Quarry Spalls / Rubble',
      quantityBlocks: 1200,
      ratePerBlock: 38,
      totalAmount: 45600,
      deliveryLocation: 'Chandragiri River Embankment Bund',
      requiredDate: '2026-09-24',
      assignedVehicle: null,
      driverName: null,
      orderStatus: 'NEW',
      paymentStatus: 'Unpaid',
      notes: 'Heavy foundation rubble stones.'
    }
  ];

  const [orders, setOrders] = useState<QuarryOrder[]>(initialOrders);

  // Form State
  const [formCustomer, setFormCustomer] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStone, setFormStone] = useState<QuarryOrder['stoneType']>('Laterite Grade A (High Density)');
  const [formQty, setFormQty] = useState('2000');
  const [formRate, setFormRate] = useState('52');
  const [formLoc, setFormLoc] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomer || !formLoc) {
      showToast('Customer and delivery location are required');
      return;
    }
    const qty = parseInt(formQty) || 1000;
    const rate = parseFloat(formRate) || 50;

    const newOrd: QuarryOrder = {
      id: `QO-${Date.now().toString().slice(-4)}`,
      orderNumber: `Q-ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerName: formCustomer,
      customerPhone: formPhone || '+91 94470 00000',
      stoneType: formStone,
      quantityBlocks: qty,
      ratePerBlock: rate,
      totalAmount: qty * rate,
      deliveryLocation: formLoc,
      requiredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      assignedVehicle: null,
      driverName: null,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'Unpaid',
      notes: formNotes
    };

    setOrders([newOrd, ...orders]);
    setIsNewOrderModalOpen(false);
    showToast(`Created Quarry Order ${newOrd.orderNumber} for ${newOrd.customerName}`);
  };

  const advanceStatus = (ordId: string) => {
    const STAGES: QuarryOrder['orderStatus'][] = [
      'NEW',
      'CONFIRMED',
      'CUTTING_IN_PROGRESS',
      'DISPATCH_READY',
      'DISPATCHED',
      'DELIVERED'
    ];
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== ordId) return o;
        const idx = STAGES.indexOf(o.orderStatus);
        if (idx < STAGES.length - 1) {
          const next = STAGES[idx + 1];
          showToast(`Advanced ${o.orderNumber} to ${next}`);
          return {
            ...o,
            orderStatus: next,
            assignedVehicle: o.assignedVehicle || 'KL-14-AJ-8821'
          };
        }
        return o;
      })
    );
  };

  const filtered = orders.filter((o) => {
    const matchesStatus = statusFilter === 'ALL' || o.orderStatus === statusFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.deliveryLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Pickaxe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  QUARRY ORDER MANAGEMENT & COMMERCIAL COMMISSIONS
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Pit #01 &bull; Kasaragod North</span>
              </div>
              <h2 className="text-lg font-black text-white">Quarry Customer Orders & Laterite Cutting Requisitions</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Quarry Order</span>
            </button>
            <button
              onClick={() => {
                if (onCreateOttTask) {
                  onCreateOttTask('Verify Quarry cutting bench allocation for tomorrow orders');
                }
                showToast('Created OTT Task: Quarry Cutting Bench Allocation');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Cutting OTT Task</span>
            </button>
            <button
              onClick={() => showToast('Exported Quarry Orders Ledger (PDF)')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Export Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('Printed Cutting & Dispatch Master Manifest')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-950/70 border border-amber-500/20 rounded-2xl">
            <div className="text-[11px] text-amber-400">Total Stones Ordered</div>
            <div className="text-xl font-mono font-black text-white mt-1">8,700 Blocks</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Grade A Laterite & Sized Stones</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="text-[11px] text-emerald-400">Committed Order Value</div>
            <div className="text-xl font-mono font-black text-white mt-1">₹4,41,600</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Avg ₹50.7 / Stone</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="text-[11px] text-cyan-400">Fleet Dispatch Synchronization</div>
            <div className="text-xl font-mono font-black text-white mt-1">2 Vehicles Active</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Linked to Vehicle Platform</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search customer, order #, destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Order Stages</option>
            <option value="NEW">New</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CUTTING_IN_PROGRESS">Cutting in Progress</option>
            <option value="DISPATCH_READY">Dispatch Ready</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing {filtered.length} of {orders.length} quarry orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Order # & Date</th>
                <th className="p-3">Customer & Phone</th>
                <th className="p-3">Stone Grade / Variety</th>
                <th className="p-3">Quantity & Rate</th>
                <th className="p-3">Order Value</th>
                <th className="p-3">Delivery Site</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <div className="font-bold text-white font-mono">{ord.orderNumber}</div>
                    <div className="text-[10px] text-slate-500">{ord.requiredDate}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{ord.customerName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{ord.customerPhone}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-200">{ord.stoneType}</div>
                  </td>
                  <td className="p-3 font-mono">
                    <div className="text-white font-bold">{ord.quantityBlocks.toLocaleString()} Blocks</div>
                    <div className="text-[10px] text-slate-400">₹{ord.ratePerBlock} / block</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3 text-slate-300 max-w-xs text-[11px] truncate">
                    {ord.deliveryLocation}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {ord.orderStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => advanceStatus(ord.id)}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                        title="Advance Workflow Stage"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Pickaxe className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Create Quarry Customer Order</h3>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer / Construction Firm *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malabar Heritage Resorts"
                  value={formCustomer}
                  onChange={(e) => setFormCustomer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Customer Mobile Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +91 98471 22910"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Stone Variety</label>
                <select
                  value={formStone}
                  onChange={(e) => setFormStone(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Laterite Grade A (High Density)">Laterite Grade A (High Density)</option>
                  <option value="Laterite Grade B">Laterite Grade B</option>
                  <option value="Laterite Sized Blocks">Laterite Sized Blocks</option>
                  <option value="Quarry Spalls / Rubble">Quarry Spalls / Rubble</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity (Blocks)</label>
                  <input
                    type="number"
                    min="100"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rate / Block (₹)</label>
                  <input
                    type="number"
                    min="10"
                    value={formRate}
                    onChange={(e) => setFormRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Delivery Destination / Site *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bekal Fort Project Site, Kasaragod"
                  value={formLoc}
                  onChange={(e) => setFormLoc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Special Cutting / Handling Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Precision wire cut required, deliver before noon"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Confirm Quarry Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                  Quarry Order Dossier
                </span>
                <h3 className="text-base font-bold text-white">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Customer:</span>
                <span className="text-white font-bold">{selectedOrder.customerName} ({selectedOrder.customerPhone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Stone Specification:</span>
                <span className="text-amber-400">{selectedOrder.stoneType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Quantity & Rate:</span>
                <span className="text-white font-mono">{selectedOrder.quantityBlocks} Blocks @ ₹{selectedOrder.ratePerBlock}/block</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Total Billed:</span>
                <span className="text-emerald-400 font-mono font-bold text-sm">₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Delivery Destination:</span>
                <span className="text-white">{selectedOrder.deliveryLocation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Assigned Vehicle:</span>
                <span className="text-cyan-400 font-mono">{selectedOrder.assignedVehicle || 'Awaiting Tipper Assignment'}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-400 block mb-1">Notes:</span>
                <p className="text-slate-300 text-[11px] bg-slate-950 p-2 rounded-xl border border-slate-800">{selectedOrder.notes}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  advanceStatus(selectedOrder.id);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <span>Advance to Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
