import React, { useState } from 'react';
import {
  Truck,
  Package,
  Calendar,
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
  Building2,
  Navigation,
  ShieldCheck
} from 'lucide-react';

export type VehicleOrderType =
  | 'Transport Order'
  | 'Load Delivery Order'
  | 'Trip Order'
  | 'Vehicle Hire Order'
  | 'Customer Transport Requirement'
  | 'Internal Vehicle Assignment'
  | 'Delivery Order'
  | 'Material Transport Requirement';

export type VehicleOrderStatus =
  | 'ORDER_RECEIVED'
  | 'REVIEW'
  | 'QUOTE_OFFERED'
  | 'CONFIRMED'
  | 'VEHICLE_ASSIGNED'
  | 'DRIVER_ASSIGNED'
  | 'LOAD_ASSIGNED'
  | 'TRIP_CREATED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'SETTLED';

export interface VehicleOrder {
  id: string;
  orderNumber: string;
  orderType: VehicleOrderType;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropLocation: string;
  materialType: string;
  tonnage: number;
  ratePerTonOrKm: number;
  totalFreight: number;
  requiredDate: string;
  assignedVehicle: string | null;
  assignedDriver: string | null;
  driverPhone: string | null;
  currentStage: VehicleOrderStatus;
  tripId: string | null;
  notes: string;
  paymentSettlementStatus: 'Unpaid' | 'Advance Paid' | 'Paid & Settled';
}

interface VehicleOrderManagementViewProps {
  onCreateOttTask?: (taskTitle: string) => void;
}

export const VehicleOrderManagementView: React.FC<VehicleOrderManagementViewProps> = ({
  onCreateOttTask
}) => {
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState<VehicleOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const initialOrders: VehicleOrder[] = [
    {
      id: 'VO-101',
      orderNumber: 'TRN-ORD-2026-081',
      orderType: 'Transport Order',
      customerName: 'Sobha City Horizon Projects',
      customerPhone: '+91 98450 12390',
      pickupLocation: 'Central Crusher Complex #01 (Kasaragod)',
      dropLocation: 'Sobha Commercial Site, Mangalore Port Road',
      materialType: '20mm & 12mm Blue Metal Aggregates',
      tonnage: 42.5,
      ratePerTonOrKm: 420,
      totalFreight: 17850,
      requiredDate: '2026-09-21',
      assignedVehicle: 'KL-14-AJ-8821 (12-Wheeler)',
      assignedDriver: 'Muneer Ahmed',
      driverPhone: '+91 94471 88210',
      currentStage: 'IN_TRANSIT',
      tripId: 'TRIP-8821-04',
      notes: 'Urgent concrete pour scheduled for 3:00 PM. Direct tipper delivery.',
      paymentSettlementStatus: 'Advance Paid'
    },
    {
      id: 'VO-102',
      orderNumber: 'TRN-ORD-2026-082',
      orderType: 'Load Delivery Order',
      customerName: 'Kasaragod PWD Highway Division',
      customerPhone: '+91 94470 55102',
      pickupLocation: 'Kasaragod North Laterite Pit #01',
      dropLocation: 'National Highway Bypass Section 4, Vidyanagar',
      materialType: 'Grade A Laterite Building Blocks (1,200 stones)',
      tonnage: 36.0,
      ratePerTonOrKm: 500,
      totalFreight: 18000,
      requiredDate: '2026-09-21',
      assignedVehicle: 'KL-14-B-7719 (10-Wheeler)',
      assignedDriver: 'Shankar Gowda',
      driverPhone: '+91 94472 99014',
      currentStage: 'LOAD_ASSIGNED',
      tripId: 'TRIP-7719-02',
      notes: 'Requires loading clearance slip #QP-881',
      paymentSettlementStatus: 'Unpaid'
    },
    {
      id: 'VO-103',
      orderNumber: 'TRN-ORD-2026-083',
      orderType: 'Customer Transport Requirement',
      customerName: 'Prestige Valley Villas JV',
      customerPhone: '+91 98860 33412',
      pickupLocation: 'River Sand Depot & VSI Plant, Puttur',
      dropLocation: 'Prestige Valley Gate 2, Bantwal',
      materialType: 'Certified Plastering Sand (P-Sand)',
      tonnage: 28.0,
      ratePerTonOrKm: 450,
      totalFreight: 12600,
      requiredDate: '2026-09-22',
      assignedVehicle: null,
      assignedDriver: null,
      driverPhone: null,
      currentStage: 'CONFIRMED',
      tripId: null,
      notes: 'Awaiting driver roster assignment for early morning shift',
      paymentSettlementStatus: 'Advance Paid'
    },
    {
      id: 'VO-104',
      orderNumber: 'TRN-ORD-2026-084',
      orderType: 'Vehicle Hire Order',
      customerName: 'Coastal Earthmovers & Dredging Co.',
      customerPhone: '+91 94473 11899',
      pickupLocation: 'Fleet Terminal A (Heavy Yard)',
      dropLocation: 'Bekal Seawall Embankment Project',
      materialType: 'Armour Rock Boulders (Rip-Rap)',
      tonnage: 120.0,
      ratePerTonOrKm: 380,
      totalFreight: 45600,
      requiredDate: '2026-09-23',
      assignedVehicle: 'KL-14-Z-9901 & KL-14-Z-9902 (2 Tippers)',
      assignedDriver: 'K. Balaram & S. Joy',
      driverPhone: '+91 94479 00812',
      currentStage: 'TRIP_CREATED',
      tripId: 'TRIP-9901-01',
      notes: 'Full day hire contract with fuel included',
      paymentSettlementStatus: 'Paid & Settled'
    }
  ];

  const [orders, setOrders] = useState<VehicleOrder[]>(initialOrders);

  // New Order Form state
  const [formCustomer, setFormCustomer] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formType, setFormType] = useState<VehicleOrderType>('Transport Order');
  const [formPickup, setFormPickup] = useState('');
  const [formDrop, setFormDrop] = useState('');
  const [formMaterial, setFormMaterial] = useState('');
  const [formTonnage, setFormTonnage] = useState('30');
  const [formRate, setFormRate] = useState('450');
  const [formNotes, setFormNotes] = useState('');

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCustomer || !formPickup || !formDrop) {
      showToast('Customer, Pickup, and Drop locations are required');
      return;
    }

    const ton = parseFloat(formTonnage) || 25;
    const rate = parseFloat(formRate) || 400;

    const newOrd: VehicleOrder = {
      id: `VO-${Date.now().toString().slice(-4)}`,
      orderNumber: `TRN-ORD-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderType: formType,
      customerName: formCustomer,
      customerPhone: formPhone || '+91 90000 00000',
      pickupLocation: formPickup,
      dropLocation: formDrop,
      materialType: formMaterial || 'Standard Aggregates / Stone',
      tonnage: ton,
      ratePerTonOrKm: rate,
      totalFreight: ton * rate,
      requiredDate: new Date().toISOString().split('T')[0],
      assignedVehicle: null,
      assignedDriver: null,
      driverPhone: null,
      currentStage: 'ORDER_RECEIVED',
      tripId: null,
      notes: formNotes,
      paymentSettlementStatus: 'Unpaid'
    };

    setOrders([newOrd, ...orders]);
    setIsNewOrderModalOpen(false);
    showToast(`Vehicle transport order ${newOrd.orderNumber} created!`);
  };

  const advanceStage = (ordId: string) => {
    const STAGE_ORDER: VehicleOrderStatus[] = [
      'ORDER_RECEIVED',
      'REVIEW',
      'QUOTE_OFFERED',
      'CONFIRMED',
      'VEHICLE_ASSIGNED',
      'DRIVER_ASSIGNED',
      'LOAD_ASSIGNED',
      'TRIP_CREATED',
      'DISPATCHED',
      'IN_TRANSIT',
      'DELIVERED',
      'COMPLETED',
      'SETTLED'
    ];

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== ordId) return o;
        const currIndex = STAGE_ORDER.indexOf(o.currentStage);
        if (currIndex < STAGE_ORDER.length - 1) {
          const nextStage = STAGE_ORDER[currIndex + 1];
          showToast(`Advanced ${o.orderNumber} to stage: ${nextStage.replace(/_/g, ' ')}`);
          return {
            ...o,
            currentStage: nextStage,
            assignedVehicle: o.assignedVehicle || 'KL-14-AJ-8821 (12-Wheeler)',
            assignedDriver: o.assignedDriver || 'Muneer Ahmed',
            tripId: o.tripId || `TRIP-${Date.now().toString().slice(-4)}`
          };
        }
        return o;
      })
    );
  };

  const filteredOrders = orders.filter((o) => {
    const matchesType = typeFilter === 'ALL' || o.orderType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || o.currentStage === statusFilter;
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.pickupLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.dropLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.materialType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner & KPI */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  VEHICLE MANAGEMENT &bull; ORDER MANAGEMENT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">13-Stage Operational Flow</span>
              </div>
              <h2 className="text-lg font-black text-white">Vehicle Transport & Haulage Orders</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsNewOrderModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Create Vehicle Order</span>
            </button>
            <button
              onClick={() => {
                if (onCreateOttTask) {
                  onCreateOttTask('Verify pending vehicle order dispatches and driver assignments');
                }
                showToast('Created OTT Task: Fleet Dispatch Verification');
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Dispatch OTT Task</span>
            </button>
            <button
              onClick={() => showToast('Exported Vehicle Orders Ledger (PDF)')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Export Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast('Printed Today Vehicle Trip Manifest')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print Manifest"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Fleet Order Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="text-[11px] text-slate-400">Total Active Orders</div>
            <div className="text-xl font-mono font-black text-white mt-1">{orders.length} Orders</div>
            <div className="text-[10px] text-blue-400 mt-0.5">8 Types Supported</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="text-[11px] text-slate-400">In-Transit Tonnage</div>
            <div className="text-xl font-mono font-black text-amber-400 mt-1">126.5 MT</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Active Fleet Hauls</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="text-[11px] text-slate-400">Order Revenue (Committed)</div>
            <div className="text-xl font-mono font-black text-emerald-400 mt-1">₹94,050</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">₹48,450 Advance Collected</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="text-[11px] text-slate-400">Trip & GPS Tracking</div>
            <div className="text-xl font-mono font-black text-cyan-400 mt-1">100% Geo-Fenced</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Real-time telematics</div>
          </div>
        </div>
      </div>

      {/* 13-Stage Vehicle Order Flow Visualization */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md overflow-x-auto">
        <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>Vehicle Order Lifecycle Pipeline:</span>
        </div>
        <div className="flex items-center gap-1 min-w-[950px] text-[10px] font-mono">
          {[
            'ORDER_RECEIVED',
            'REVIEW',
            'QUOTE_OFFERED',
            'CONFIRMED',
            'VEHICLE_ASSIGNED',
            'DRIVER_ASSIGNED',
            'LOAD_ASSIGNED',
            'TRIP_CREATED',
            'DISPATCHED',
            'IN_TRANSIT',
            'DELIVERED',
            'COMPLETED',
            'SETTLED'
          ].map((stage, idx) => (
            <React.Fragment key={stage}>
              <div className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 font-bold whitespace-nowrap text-center flex-1">
                <span className="text-amber-400 mr-1">{idx + 1}.</span>
                {stage.replace(/_/g, ' ')}
              </div>
              {idx < 12 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search customer, order #, pickup, destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-400"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-400"
          >
            <option value="ALL">All Order Types</option>
            <option value="Transport Order">Transport Order</option>
            <option value="Load Delivery Order">Load Delivery Order</option>
            <option value="Trip Order">Trip Order</option>
            <option value="Vehicle Hire Order">Vehicle Hire Order</option>
            <option value="Customer Transport Requirement">Customer Transport Requirement</option>
            <option value="Internal Vehicle Assignment">Internal Vehicle Assignment</option>
            <option value="Delivery Order">Delivery Order</option>
            <option value="Material Transport Requirement">Material Transport Requirement</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-blue-400"
          >
            <option value="ALL">All Stages</option>
            <option value="ORDER_RECEIVED">Order Received</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="VEHICLE_ASSIGNED">Vehicle Assigned</option>
            <option value="LOAD_ASSIGNED">Load Assigned</option>
            <option value="TRIP_CREATED">Trip Created</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="DELIVERED">Delivered</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Order # & Type</th>
                <th className="p-3">Customer & Contact</th>
                <th className="p-3">Route (Pickup → Drop)</th>
                <th className="p-3">Material & Tonnage</th>
                <th className="p-3">Assigned Fleet & Driver</th>
                <th className="p-3">Total Freight</th>
                <th className="p-3">Current Stage</th>
                <th className="p-3 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <div className="font-bold text-white font-mono">{ord.orderNumber}</div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                      {ord.orderType}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{ord.customerName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{ord.customerPhone}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-300 text-[11px]">From: {ord.pickupLocation}</div>
                    <div className="text-amber-400 text-[11px]">To: {ord.dropLocation}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-200">{ord.materialType}</div>
                    <div className="text-[10px] font-mono text-cyan-400">{ord.tonnage} MT</div>
                  </td>
                  <td className="p-3">
                    {ord.assignedVehicle ? (
                      <div>
                        <div className="font-mono text-white font-bold">{ord.assignedVehicle}</div>
                        <div className="text-[10px] text-slate-400">Driver: {ord.assignedDriver}</div>
                      </div>
                    ) : (
                      <span className="text-amber-400 text-[11px] italic font-semibold">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3 font-mono font-bold text-white">
                    <div>₹{ord.totalFreight.toLocaleString('en-IN')}</div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                      ord.paymentSettlementStatus === 'Paid & Settled'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {ord.paymentSettlementStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                      {ord.currentStage.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => advanceStage(ord.id)}
                        className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-[10px] flex items-center gap-1 transition"
                        title="Advance Workflow Stage"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="View Full Order Dossier"
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

      {/* Order Detail Dossier Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">
                  Vehicle Order Dossier &bull; {selectedOrder.orderType}
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

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-white text-sm">Customer & Order Particulars</div>
                <div className="text-slate-400">Customer: <strong className="text-white">{selectedOrder.customerName}</strong></div>
                <div className="text-slate-400">Phone: <strong className="text-white">{selectedOrder.customerPhone}</strong></div>
                <div className="text-slate-400">Required Date: <strong className="text-white">{selectedOrder.requiredDate}</strong></div>
                <div className="text-slate-400">Payment Status: <strong className="text-emerald-400">{selectedOrder.paymentSettlementStatus}</strong></div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-white text-sm">Haulage & Vehicle Assignment</div>
                <div className="text-slate-400">Assigned Truck: <strong className="text-white">{selectedOrder.assignedVehicle || 'Pending assignment'}</strong></div>
                <div className="text-slate-400">Assigned Driver: <strong className="text-white">{selectedOrder.assignedDriver || 'Pending'}</strong></div>
                <div className="text-slate-400">Trip Reference: <strong className="text-cyan-400 font-mono">{selectedOrder.tripId || 'Not created'}</strong></div>
                <div className="text-slate-400">Current Stage: <strong className="text-amber-400 font-mono">{selectedOrder.currentStage}</strong></div>
              </div>

              <div className="col-span-2 p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
                <div className="font-bold text-white text-sm">Routing & Material Details</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Origin / Loading Point:</span>
                  <span className="text-white">{selectedOrder.pickupLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination / Unloading Point:</span>
                  <span className="text-amber-400">{selectedOrder.dropLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Commodity & Tonnage:</span>
                  <span className="text-white">{selectedOrder.materialType} ({selectedOrder.tonnage} MT)</span>
                </div>
                <div className="flex justify-between border-t border-slate-800 pt-1.5">
                  <span className="text-slate-300 font-bold">Total Freight Value:</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm">
                    ₹{selectedOrder.totalFreight.toLocaleString('en-IN')} (@ ₹{selectedOrder.ratePerTonOrKm}/MT)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  advanceStage(selectedOrder.id);
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <span>Advance Order to Next Stage</span>
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

      {/* New Vehicle Order Modal */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Create Vehicle Transport Order</h3>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer / Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sobha Developers"
                    value={formCustomer}
                    onChange={(e) => setFormCustomer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Customer Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98450 12345"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Vehicle Order Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="Transport Order">Transport Order</option>
                  <option value="Load Delivery Order">Load Delivery Order</option>
                  <option value="Trip Order">Trip Order</option>
                  <option value="Vehicle Hire Order">Vehicle Hire Order</option>
                  <option value="Customer Transport Requirement">Customer Transport Requirement</option>
                  <option value="Internal Vehicle Assignment">Internal Vehicle Assignment</option>
                  <option value="Delivery Order">Delivery Order</option>
                  <option value="Material Transport Requirement">Material Transport Requirement</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Pickup / Origin Point *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Central Crusher Complex #01"
                    value={formPickup}
                    onChange={(e) => setFormPickup(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Drop / Destination Point *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Highway Project Site"
                    value={formDrop}
                    onChange={(e) => setFormDrop(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Material</label>
                  <input
                    type="text"
                    placeholder="e.g. 20mm Aggregate"
                    value={formMaterial}
                    onChange={(e) => setFormMaterial(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tonnage (MT)</label>
                  <input
                    type="number"
                    min="1"
                    value={formTonnage}
                    onChange={(e) => setFormTonnage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rate (₹/MT or km)</label>
                  <input
                    type="number"
                    min="1"
                    value={formRate}
                    onChange={(e) => setFormRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dispatch Instructions & Constraints</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Weighbridge printout required, delivery between 10am-4pm"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-400"
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
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold"
                >
                  Confirm Vehicle Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
