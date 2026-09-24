import React, { useState } from 'react';
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Users,
  Building2,
  Tag,
  Receipt,
  Truck,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Layers,
  ChevronRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';

export type CommerceTab =
  | 'purchase'
  | 'sales'
  | 'orders'
  | 'customers'
  | 'suppliers'
  | 'products'
  | 'rates'
  | 'billing'
  | 'gate-pass';

interface SharedErpCommerceSectionProps {
  onNavigate?: (section: string) => void;
  initialSubTab?: CommerceTab;
  onOpenLateriteOrder?: () => void;
}

export const SharedErpCommerceSection: React.FC<SharedErpCommerceSectionProps> = ({
  onNavigate,
  initialSubTab = 'purchase',
  onOpenLateriteOrder
}) => {
  const [activeTab, setActiveTab] = useState<CommerceTab>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Mock Purchase Orders
  const PURCHASE_ORDERS = [
    { id: 'PO-9041', vendor: 'Sandvik Mining Spare Parts', date: '21 Feb 2026', items: 'Cone Crusher Manganese Mantle & Concave', qty: '2 Sets', amount: 185000, status: 'DELIVERED' },
    { id: 'PO-9042', vendor: 'Bharat Petroleum Yard Depot', date: '20 Feb 2026', items: 'High-Speed Diesel (HSD) Bulk Tanker', qty: '12,000 Litres', amount: 1104000, status: 'IN_TRANSIT' },
    { id: 'PO-9043', vendor: 'Solar Explosives India Ltd', date: '19 Feb 2026', items: 'Cast Booster & Non-Electric Detonators', qty: '400 Units', amount: 74000, status: 'APPROVED' },
    { id: 'PO-9044', vendor: 'JK Tyre Commercial Fleet', date: '18 Feb 2026', items: 'Radial Heavy Tipper Tyres (10.00R20)', qty: '8 Tyres', amount: 192000, status: 'DELIVERED' }
  ];

  // Mock Sales Records
  const SALES_RECORDS = [
    { id: 'INV-2026-081', customer: 'Sobha Developers Ltd', date: 'Today 10:15 AM', product: '20mm Concrete Aggregates', qty: '140 MT', rate: 780, total: 109200, status: 'BILLED' },
    { id: 'INV-2026-082', customer: 'Malabar Highway Infrastructure', date: 'Today 09:30 AM', product: 'Manufactured Sand (Zone II)', qty: '220 MT', rate: 850, total: 187000, status: 'BILLED' },
    { id: 'INV-2026-083', customer: 'Calicut Heritage Villa Builders', date: 'Today 08:45 AM', product: 'Dressed Laterite Stone (30×20×15 cm)', qty: '1,400 Stones', rate: 45, total: 63000, status: 'DISPATCHED' },
    { id: 'INV-2026-084', customer: 'Kalyan Precast Industries', date: 'Yesterday', product: 'Plastering Sand (P-Sand)', qty: '80 MT', rate: 950, total: 76000, status: 'PAID' }
  ];

  // Mock Orders
  const MATERIAL_ORDERS = [
    { id: 'ORD-7701', customer: 'Calicut Heritage Villa Builders', product: 'Dressed Laterite Stone', qty: '2,500 Stones', deliveryDate: '23 Feb 2026', destination: 'NH Bypass Project Site', status: 'IN_PRODUCTION' },
    { id: 'ORD-7702', customer: 'L&T Metro Infra Package 4', product: '20mm Graded Blue Metal', qty: '800 MT', deliveryDate: '24 Feb 2026', destination: 'Palarivattom Bridge Site', status: 'CONFIRMED' },
    { id: 'ORD-7703', customer: 'Wayanad Hill Highway Builders', product: 'Granite Rubble (Soling)', qty: '350 MT', deliveryDate: '22 Feb 2026', destination: 'Ghat Road Sector 2', status: 'DISPATCHING' }
  ];

  // Customers
  const CUSTOMERS = [
    { id: 'CUST-001', name: 'Sobha Developers Ltd', contact: '+91 98450 11223', gst: '32AABCS8891P1ZR', creditLimit: 2500000, outstanding: 480000, tier: 'PLATINUM' },
    { id: 'CUST-002', name: 'Malabar Highway Infrastructure', contact: '+91 94470 33445', gst: '32AACCM4412L1ZQ', creditLimit: 5000000, outstanding: 1240000, tier: 'ENTERPRISE' },
    { id: 'CUST-003', name: 'Calicut Heritage Villa Builders', contact: '+91 99950 55667', gst: '32AADCV9012N1ZW', creditLimit: 800000, outstanding: 63000, tier: 'GOLD' },
    { id: 'CUST-004', name: 'Kalyan Precast Industries', contact: '+91 97441 77889', gst: '32AAECK2231K1ZS', creditLimit: 1500000, outstanding: 0, tier: 'SILVER' }
  ];

  // Suppliers
  const SUPPLIERS = [
    { id: 'SUPP-001', name: 'Bharat Petroleum Yard Depot', material: 'Bulk High-Speed Diesel', contact: '0495-2761100', paymentTerms: '15 Days Credit', balancePayable: 450000 },
    { id: 'SUPP-002', name: 'Sandvik Mining Spare Parts', material: 'Crusher Jaw & Cone Liners', contact: '+91 80 4400 1100', paymentTerms: 'Advance / 30 Days', balancePayable: 185000 },
    { id: 'SUPP-003', name: 'Solar Explosives India Ltd', material: 'Commercial Blasting Cartridges', contact: '+91 712 6634555', paymentTerms: 'Cash Against Delivery', balancePayable: 0 },
    { id: 'SUPP-004', name: 'JK Tyre Commercial Fleet', material: 'Tipper & Dumper Radial Tyres', contact: '+91 98110 44552', paymentTerms: '30 Days Credit', balancePayable: 92000 }
  ];

  // Product Catalog
  const PRODUCTS = [
    { id: 'PRD-01', name: 'Dressed Laterite Stone', specs: '30×20×15 cm Standard Building Block', currentStock: '18,400 Stones', basePrice: '₹42 – ₹48 / piece', category: 'Dimension Stone' },
    { id: 'PRD-02', name: 'Manufactured Sand (M-Sand)', specs: 'Zone II Concrete Aggregate Sand', currentStock: '4,280 MT', basePrice: '₹820 – ₹880 / MT', category: 'Crushed Sand' },
    { id: 'PRD-03', name: 'Plastering Sand (P-Sand)', specs: 'High-Finishing Plaster Grade (<150 micron controlled)', currentStock: '1,840 MT', basePrice: '₹920 – ₹980 / MT', category: 'Crushed Sand' },
    { id: 'PRD-04', name: '20mm Blue Metal Aggregate', specs: 'IS 383 Compliant Concrete Blue Granite', currentStock: '6,120 MT', basePrice: '₹750 – ₹800 / MT', category: 'Aggregates' },
    { id: 'PRD-05', name: '12mm Blue Metal Aggregate', specs: 'High-Grade Precast & Roofing Aggregate', currentStock: '2,900 MT', basePrice: '₹840 – ₹900 / MT', category: 'Aggregates' },
    { id: 'PRD-06', name: 'Laterite Foundation Jumbo Block', specs: '40×25×20 cm Heavy Foundation Cut', currentStock: '4,200 Stones', basePrice: '₹75 – ₹85 / piece', category: 'Dimension Stone' }
  ];

  // Rate Master
  const RATES_MASTER = [
    { item: 'Dressed Laterite Stone (30×20×15 cm)', pitRate: '₹40.00 / stone', loadingRate: '₹3.00 / stone', freightPerKm: '₹0.12 / stone/km', gst: '5%' },
    { item: 'M-Sand (Zone II)', pitRate: '₹760.00 / MT', loadingRate: '₹40.00 / MT', freightPerKm: '₹4.50 / MT/km', gst: '5%' },
    { item: 'P-Sand (Plastering)', pitRate: '₹860.00 / MT', loadingRate: '₹40.00 / MT', freightPerKm: '₹4.50 / MT/km', gst: '5%' },
    { item: '20mm Granite Aggregate', pitRate: '₹710.00 / MT', loadingRate: '₹40.00 / MT', freightPerKm: '₹4.50 / MT/km', gst: '5%' },
    { item: 'Wet Mix Macadam (WMM)', pitRate: '₹620.00 / MT', loadingRate: '₹35.00 / MT', freightPerKm: '₹4.20 / MT/km', gst: '5%' }
  ];

  // Weighbridge Gate Passes
  const GATE_PASSES = [
    { id: 'GP-2026-0941', vehicle: 'KL-11-BH-4401', material: '20mm Aggregate', tareWeight: '9,450 kg', grossWeight: '25,850 kg', netWeight: '16,400 kg', customer: 'Sobha Developers', time: '10:14 AM', passType: 'OUTBOUND' },
    { id: 'GP-2026-0942', vehicle: 'KL-18-E-9022', material: 'Dressed Laterite Stone (700 Stones)', tareWeight: '8,200 kg', grossWeight: '26,400 kg', netWeight: '18,200 kg', customer: 'Calicut Heritage Villas', time: '09:48 AM', passType: 'OUTBOUND' },
    { id: 'GP-2026-0943', vehicle: 'KL-10-AZ-1188', material: 'Manufactured Sand (M-Sand)', tareWeight: '10,100 kg', grossWeight: '32,100 kg', netWeight: '22,000 kg', customer: 'Malabar Highway Infra', time: '08:52 AM', passType: 'OUTBOUND' },
    { id: 'GP-2026-0944', vehicle: 'KA-19-F-3301', material: 'Diesel Tanker 12,000L', tareWeight: '7,800 kg', grossWeight: '18,000 kg', netWeight: '10,200 kg', customer: 'Inbound Supplier', time: '07:30 AM', passType: 'INBOUND_FUEL' }
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
              Shared ERP Core
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Studio Preview &bull; Demo / Sample Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>Commerce & Trade</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLateriteOrder && (
            <button
              onClick={onOpenLateriteOrder}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>+ Order Laterite Stone</span>
            </button>
          )}
          <button
            onClick={() => showToast('New Digital Weighbridge Pass Initiated')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Generate Gate Pass</span>
          </button>
        </div>
      </div>

      {/* 9 Macro Sub-tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'purchase' as CommerceTab, label: 'Purchase (PO)', count: PURCHASE_ORDERS.length, icon: ShoppingBag },
          { id: 'sales' as CommerceTab, label: 'Sales & Invoices', count: SALES_RECORDS.length, icon: TrendingUp },
          { id: 'orders' as CommerceTab, label: 'Customer Orders', count: MATERIAL_ORDERS.length, icon: Package },
          { id: 'customers' as CommerceTab, label: 'Customers', count: CUSTOMERS.length, icon: Users },
          { id: 'suppliers' as CommerceTab, label: 'Suppliers', count: SUPPLIERS.length, icon: Building2 },
          { id: 'products' as CommerceTab, label: 'Product Catalog', count: PRODUCTS.length, icon: Tag },
          { id: 'rates' as CommerceTab, label: 'Rate Master', count: RATES_MASTER.length, icon: DollarSign },
          { id: 'billing' as CommerceTab, label: 'Tax Billing', count: 'GST Ready', icon: Receipt },
          { id: 'gate-pass' as CommerceTab, label: 'Gate Pass', count: `${GATE_PASSES.length} Active`, icon: Truck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap border cursor-pointer ${
                isAct
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isAct ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PURCHASE */}
      {activeTab === 'purchase' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Purchase Orders (PO) & Requisitions</h3>
            <button
              onClick={() => showToast('Create New Purchase Order')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Create PO</span>
            </button>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-4">Vendor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Item Description</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">PO Value</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {PURCHASE_ORDERS.map((po) => (
                <tr key={po.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{po.id}</td>
                  <td className="py-3 px-4 font-bold text-white">{po.vendor}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{po.date}</td>
                  <td className="py-3 px-4 text-slate-300">{po.items}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{po.qty}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">₹{po.amount.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      po.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      po.status === 'IN_TRANSIT' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: SALES */}
      {activeTab === 'sales' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Daily Outbound Sales Invoices</h3>
            <button
              onClick={() => showToast('Direct Sales Billing Modal Triggered')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Invoice</span>
            </button>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Rate</th>
                <th className="py-3 px-4">Invoice Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {SALES_RECORDS.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{s.id}</td>
                  <td className="py-3 px-4 font-bold text-white">{s.customer}</td>
                  <td className="py-3 px-4 text-slate-300">{s.product}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{s.qty}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">₹{s.rate}</td>
                  <td className="py-3 px-4 font-mono font-black text-emerald-400">₹{s.total.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      s.status === 'BILLED' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Active Quarry & Crusher Orders</h3>
            <button
              onClick={onOpenLateriteOrder}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Book Laterite Stone Order</span>
            </button>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Material / Specs</th>
                <th className="py-3 px-4">Order Qty</th>
                <th className="py-3 px-4">Delivery Due</th>
                <th className="py-3 px-4">Site Destination</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {MATERIAL_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{o.id}</td>
                  <td className="py-3 px-4 font-bold text-white">{o.customer}</td>
                  <td className="py-3 px-4 text-slate-300">{o.product}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{o.qty}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{o.deliveryDate}</td>
                  <td className="py-3 px-4 text-slate-400">{o.destination}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: CUSTOMERS */}
      {activeTab === 'customers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Commercial Debtors & Customer Master</h3>
            <button
              onClick={() => showToast('Add New Customer Account')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Customer</span>
            </button>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Customer ID & Name</th>
                <th className="py-3 px-4">GSTIN</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Credit Limit</th>
                <th className="py-3 px-4">Current Outstanding</th>
                <th className="py-3 px-4">Account Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {CUSTOMERS.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[10px] font-mono text-blue-400">{c.id}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{c.gst}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{c.contact}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">₹{c.creditLimit.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-rose-400 font-bold">
                    {c.outstanding > 0 ? `₹${c.outstanding.toLocaleString()}` : '₹0 (Clear)'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      {c.tier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: SUPPLIERS */}
      {activeTab === 'suppliers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Vendors & Operational Creditors Master</h3>
            <button
              onClick={() => showToast('Register New Supplier')}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Register Vendor</span>
            </button>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Vendor ID & Company</th>
                <th className="py-3 px-4">Supply Category</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Payment Credit Terms</th>
                <th className="py-3 px-4">Payable Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {SUPPLIERS.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{sup.name}</div>
                    <div className="text-[10px] font-mono text-emerald-400">{sup.id}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{sup.material}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{sup.contact}</td>
                  <td className="py-3 px-4 text-slate-400">{sup.paymentTerms}</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {sup.balancePayable > 0 ? `₹${sup.balancePayable.toLocaleString()}` : '₹0 (Settled)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: PRODUCT CATALOG */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRODUCTS.map((prod) => (
            <div key={prod.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {prod.category}
                </span>
                <span className="font-mono text-xs text-slate-500">{prod.id}</span>
              </div>
              <div>
                <h4 className="font-bold text-white text-base">{prod.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{prod.specs}</p>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-500">Live Pit Stock</div>
                  <div className="font-mono font-bold text-cyan-400 text-sm">{prod.currentStock}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500">Standard Price</div>
                  <div className="font-mono font-bold text-emerald-400">{prod.basePrice}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 7: RATE MASTER */}
      {activeTab === 'rates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Central Rate Master & Dynamic Fuel Index</h3>
              <p className="text-xs text-slate-400">Standardized pit-head prices, loading batta, freight per km & GST</p>
            </div>
            <button
              onClick={() => showToast('Update Rate Master Modal Opened')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
            >
              Update Price Index
            </button>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Commodity / Material</th>
                <th className="py-3 px-4">Pit-Head Base Rate</th>
                <th className="py-3 px-4">Loading / Tipper Batta</th>
                <th className="py-3 px-4">Freight Tariff</th>
                <th className="py-3 px-4">Applicable GST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {RATES_MASTER.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-bold text-white">{r.item}</td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{r.pitRate}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{r.loadingRate}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{r.freightPerKm}</td>
                  <td className="py-3 px-4 font-mono text-amber-300 font-bold">{r.gst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 8: BILLING */}
      {activeTab === 'billing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">GST Invoicing & E-Way Bill Reconciliation</h3>
              <p className="text-xs text-slate-400">State Mining Department Transit Pass & E-Way Bill sync</p>
            </div>
            <button
              onClick={() => showToast('Generated Monthly GST-R1 Outward Supply Summary')}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GSTR-1 CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Total Taxable Value (Feb 2026)</span>
              <div className="text-xl font-bold text-white mt-1">₹42,80,000</div>
              <span className="text-[10px] text-emerald-400 font-bold">CGST: ₹1,07,000 &bull; SGST: ₹1,07,000</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px]">Mineral Royalty Cess (Seigniorage)</span>
              <div className="text-xl font-bold text-amber-400 mt-1">₹2,84,000</div>
              <span className="text-[10px] text-slate-400">Department of Mining & Geology</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px]">E-Way Bills Generated</span>
              <div className="text-xl font-bold text-cyan-400 mt-1">142 Passes</div>
              <span className="text-[10px] text-emerald-400 font-bold">100% Transit Pass Matched</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: GATE PASS */}
      {activeTab === 'gate-pass' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Digital Weighbridge Gate Passes</h3>
              <p className="text-xs text-slate-400">Live Tare/Gross/Net automated weight slips with QR security</p>
            </div>
            <button
              onClick={() => showToast('Printing weighbridge slip with barcode')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Pass #</th>
                <th className="py-3 px-4">Vehicle #</th>
                <th className="py-3 px-4">Commodity</th>
                <th className="py-3 px-4">Tare Weight</th>
                <th className="py-3 px-4">Gross Weight</th>
                <th className="py-3 px-4">Net Mineral Payload</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {GATE_PASSES.map((g) => (
                <tr key={g.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">{g.id}</td>
                  <td className="py-3 px-4 font-mono font-bold text-white">{g.vehicle}</td>
                  <td className="py-3 px-4 text-slate-300">{g.material}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{g.tareWeight}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{g.grossWeight}</td>
                  <td className="py-3 px-4 font-mono font-black text-emerald-400 text-sm">{g.netWeight}</td>
                  <td className="py-3 px-4 text-slate-300">{g.customer}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{g.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
