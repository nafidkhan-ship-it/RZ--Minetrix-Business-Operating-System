import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  CheckCircle2,
  Calendar,
  Eye,
  Clock,
  Building2,
  Truck,
  Pickaxe,
  Check,
  CreditCard,
  Layers
} from 'lucide-react';
import { OperationalPlatform } from './OperationalAttendanceModule';

interface TradeRecord {
  id: string;
  invoiceNo: string;
  type: 'SALE' | 'PURCHASE';
  platform: OperationalPlatform;
  date: string;
  partyName: string;
  partyGst: string;
  items: string;
  quantity: string;
  unitRate: number;
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
  paidAmount: number;
  dueDate: string;
  dispatchedViaVehicle: string;
}

interface OperationalSalesPurchaseModuleProps {
  platform: OperationalPlatform;
  defaultType?: 'ALL' | 'SALE' | 'PURCHASE';
  onCreateOttTask?: (taskTitle: string) => void;
}

export const OperationalSalesPurchaseModule: React.FC<OperationalSalesPurchaseModuleProps> = ({
  platform,
  defaultType = 'ALL',
  onCreateOttTask
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'SALE' | 'PURCHASE'>(defaultType);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'SALE' | 'PURCHASE'>('SALE');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getInitialRecords = (): TradeRecord[] => {
    if (platform === 'QUARRY') {
      return [
        {
          id: 'TRD-Q-01',
          invoiceNo: 'INV-QP-2026-104',
          type: 'SALE',
          platform: 'QUARRY',
          date: '2026-09-21',
          partyName: 'Malabar Infrastructure Ltd',
          partyGst: '32AABCM1234F1Z8',
          items: 'Laterite Stone Grade A (Cut Blocks)',
          quantity: '3,200 Blocks',
          unitRate: 52.0,
          totalAmount: 166400,
          taxAmount: 8320,
          grandTotal: 174720,
          paymentStatus: 'PAID',
          paidAmount: 174720,
          dueDate: '2026-09-21',
          dispatchedViaVehicle: 'KL-14-AJ-8821'
        },
        {
          id: 'TRD-Q-02',
          invoiceNo: 'INV-QP-2026-105',
          type: 'SALE',
          platform: 'QUARRY',
          date: '2026-09-20',
          partyName: 'Apex Builders & Developers',
          partyGst: '32AAACA5512B1Z1',
          items: 'Laterite Stone Grade B',
          quantity: '2,000 Blocks',
          unitRate: 46.0,
          totalAmount: 92000,
          taxAmount: 4600,
          grandTotal: 96600,
          paymentStatus: 'PARTIAL',
          paidAmount: 50000,
          dueDate: '2026-09-30',
          dispatchedViaVehicle: 'KL-14-B-7719'
        },
        {
          id: 'TRD-Q-03',
          invoiceNo: 'PUR-QP-2026-042',
          type: 'PURCHASE',
          platform: 'QUARRY',
          date: '2026-09-18',
          partyName: 'Bharat Petroleum Corporation',
          partyGst: '32AAACB0001A1Z5',
          items: 'High Speed Diesel (HSD Industrial)',
          quantity: '2,500 Litres',
          unitRate: 92.5,
          totalAmount: 231250,
          taxAmount: 41625,
          grandTotal: 272875,
          paymentStatus: 'PAID',
          paidAmount: 272875,
          dueDate: '2026-09-18',
          dispatchedViaVehicle: 'Tanker TN-38-9901'
        }
      ];
    } else if (platform === 'CRUSHER') {
      return [
        {
          id: 'TRD-C-01',
          invoiceNo: 'INV-CR-2026-301',
          type: 'SALE',
          platform: 'CRUSHER',
          date: '2026-09-21',
          partyName: 'Kochi Metro Contractors JV',
          partyGst: '32AABCK9901C1ZX',
          items: 'Manufactured Sand (M-Sand Concrete Grade)',
          quantity: '450 MT',
          unitRate: 750.0,
          totalAmount: 337500,
          taxAmount: 16875,
          grandTotal: 354375,
          paymentStatus: 'PAID',
          paidAmount: 354375,
          dueDate: '2026-09-21',
          dispatchedViaVehicle: 'KL-14-Z-9901'
        },
        {
          id: 'TRD-C-02',
          invoiceNo: 'INV-CR-2026-302',
          type: 'SALE',
          platform: 'CRUSHER',
          date: '2026-09-20',
          partyName: 'Sobha Horizon City Project',
          partyGst: '29AABCS8810K1ZT',
          items: '20mm Graded Blue Metal Aggregates',
          quantity: '300 MT',
          unitRate: 680.0,
          totalAmount: 204000,
          taxAmount: 10200,
          grandTotal: 214200,
          paymentStatus: 'PARTIAL',
          paidAmount: 100000,
          dueDate: '2026-09-28',
          dispatchedViaVehicle: 'KL-14-AJ-8822'
        },
        {
          id: 'TRD-C-03',
          invoiceNo: 'PUR-CR-2026-088',
          type: 'PURCHASE',
          platform: 'CRUSHER',
          date: '2026-09-19',
          partyName: 'Deccan Explosives & Blasting Mining Corp',
          partyGst: '32AABCD4411M1ZQ',
          items: 'Raw Granite Boulders (Feed for Primary Jaw)',
          quantity: '1,200 MT',
          unitRate: 280.0,
          totalAmount: 336000,
          taxAmount: 16800,
          grandTotal: 352800,
          paymentStatus: 'PAID',
          paidAmount: 352800,
          dueDate: '2026-09-19',
          dispatchedViaVehicle: 'Fleet Tippers'
        }
      ];
    } else {
      // VEHICLE
      return [
        {
          id: 'TRD-V-01',
          invoiceNo: 'INV-FL-2026-501',
          type: 'SALE',
          platform: 'VEHICLE',
          date: '2026-09-21',
          partyName: 'Sobha City Horizon Projects',
          partyGst: '29AABCS8810K1ZT',
          items: 'Aggregate Haulage & Tipper Freight Services',
          quantity: '14 Trips (520 km)',
          unitRate: 4200.0,
          totalAmount: 58800,
          taxAmount: 2940,
          grandTotal: 61740,
          paymentStatus: 'PAID',
          paidAmount: 61740,
          dueDate: '2026-09-21',
          dispatchedViaVehicle: 'KL-14-AJ-8821'
        },
        {
          id: 'TRD-V-02',
          invoiceNo: 'PUR-FL-2026-119',
          type: 'PURCHASE',
          platform: 'VEHICLE',
          date: '2026-09-20',
          partyName: 'Apollo Tyres Commercial Hub',
          partyGst: '32AAACA1299P1ZK',
          items: 'Radial Heavy Truck Tyres 295/80 R22.5',
          quantity: '6 Tyres',
          unitRate: 21500.0,
          totalAmount: 129000,
          taxAmount: 23220,
          grandTotal: 152220,
          paymentStatus: 'PAID',
          paidAmount: 152220,
          dueDate: '2026-09-20',
          dispatchedViaVehicle: 'Service Van'
        }
      ];
    }
  };

  const [records, setRecords] = useState<TradeRecord[]>(getInitialRecords());

  // Form State
  const [formParty, setFormParty] = useState('');
  const [formItems, setFormItems] = useState('');
  const [formQty, setFormQty] = useState('');
  const [formRate, setFormRate] = useState('');
  const [formVehicle, setFormVehicle] = useState('');

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formParty || !formItems) {
      showToast('Party and item details are required');
      return;
    }
    const rate = parseFloat(formRate) || 100;
    const qty = parseFloat(formQty) || 1;
    const total = rate * qty;
    const tax = total * 0.05;

    const newRec: TradeRecord = {
      id: `TRD-${platform[0]}-${Date.now().toString().slice(-4)}`,
      invoiceNo: `${modalType === 'SALE' ? 'INV' : 'PUR'}-${platform[0]}-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: modalType,
      platform,
      date: new Date().toISOString().split('T')[0],
      partyName: formParty,
      partyGst: '32AAACC9911X1Z1',
      items: formItems,
      quantity: `${qty} Units`,
      unitRate: rate,
      totalAmount: total,
      taxAmount: tax,
      grandTotal: total + tax,
      paymentStatus: 'UNPAID',
      paidAmount: 0,
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      dispatchedViaVehicle: formVehicle || 'Direct Pit Gate'
    };

    setRecords([newRec, ...records]);
    setIsNewModalOpen(false);
    showToast(`Created ${modalType} Invoice ${newRec.invoiceNo}`);
  };

  const filtered = records.filter((r) => {
    const matchesTab = activeTab === 'ALL' || r.type === activeTab;
    const matchesStatus = statusFilter === 'ALL' || r.paymentStatus === statusFilter;
    const matchesSearch =
      r.partyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStatus && matchesSearch;
  });

  const totalSales = records
    .filter((r) => r.type === 'SALE')
    .reduce((sum, r) => sum + r.grandTotal, 0);

  const totalPurchases = records
    .filter((r) => r.type === 'PURCHASE')
    .reduce((sum, r) => sum + r.grandTotal, 0);

  const totalReceivables = records
    .filter((r) => r.type === 'SALE')
    .reduce((sum, r) => sum + (r.grandTotal - r.paidAmount), 0);

  const PlatformIcon = platform === 'QUARRY' ? Pickaxe : platform === 'CRUSHER' ? Building2 : Truck;

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
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <PlatformIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {platform} COMMERCIAL TRADE & INVOICES
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Sales &bull; Purchase &bull; Ledgers</span>
              </div>
              <h2 className="text-lg font-black text-white">{platform} Sales & Purchase Operations</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setModalType('SALE');
                setIsNewModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Sale Invoice</span>
            </button>
            <button
              onClick={() => {
                setModalType('PURCHASE');
                setIsNewModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>+ New Purchase Bill</span>
            </button>
            <button
              onClick={() => {
                if (onCreateOttTask) {
                  onCreateOttTask(`Follow up overdue customer receivables for ${platform}`);
                }
                showToast(`Created OTT Task: Collect ${platform} receivables`);
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Receivables OTT Task</span>
            </button>
            <button
              onClick={() => showToast(`Exported ${platform} Sales & Purchase Ledger (Excel)`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Export Report"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={() => showToast(`Printing ${platform} GSTR-1 Invoicing Register`)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Print Sheet"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-950/70 border border-emerald-500/20 rounded-2xl">
            <div className="text-[11px] text-emerald-400">Total Billed Sales</div>
            <div className="text-xl font-mono font-black text-white mt-1">
              ₹{(totalSales / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Dispatched Commercial Cargo</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl">
            <div className="text-[11px] text-slate-400">Total Purchases & Feed</div>
            <div className="text-xl font-mono font-black text-white mt-1">
              ₹{(totalPurchases / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Raw stones, diesel, consumables</div>
          </div>
          <div className="p-3 bg-slate-950/70 border border-amber-500/20 rounded-2xl">
            <div className="text-[11px] text-amber-400">Outstanding Receivables</div>
            <div className="text-xl font-mono font-black text-amber-300 mt-1">
              ₹{(totalReceivables / 100000).toFixed(2)} Lakhs
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">Credit balance across clients</div>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-950'
            }`}
          >
            All Invoices ({records.length})
          </button>
          <button
            onClick={() => setActiveTab('SALE')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
              activeTab === 'SALE'
                ? 'bg-emerald-500 text-slate-950 shadow'
                : 'text-emerald-400 hover:text-emerald-300 bg-slate-950'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Sales ({records.filter((r) => r.type === 'SALE').length})</span>
          </button>
          <button
            onClick={() => setActiveTab('PURCHASE')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition cursor-pointer ${
              activeTab === 'PURCHASE'
                ? 'bg-blue-500 text-slate-950 shadow'
                : 'text-blue-400 hover:text-blue-300 bg-slate-950'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Purchases ({records.filter((r) => r.type === 'PURCHASE').length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search invoice #, customer, item..."
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
            <option value="ALL">All Payment Status</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="UNPAID">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Invoice # / Date</th>
                <th className="p-3">Party Name</th>
                <th className="p-3">Items & Quantity</th>
                <th className="p-3">Grand Total (₹)</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Dispatch Vehicle</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3">
                    <div className="font-bold text-white font-mono">{rec.invoiceNo}</div>
                    <div className="text-[10px] font-mono text-slate-500">{rec.date}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-white">{rec.partyName}</div>
                    <div className="text-[10px] font-mono text-slate-500">GST: {rec.partyGst}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-slate-200">{rec.items}</div>
                    <div className="text-[10px] font-mono text-cyan-400">{rec.quantity}</div>
                  </td>
                  <td className="p-3 font-mono font-bold text-sm text-white">
                    <div>₹{rec.grandTotal.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-500">Paid: ₹{rec.paidAmount.toLocaleString('en-IN')}</div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        rec.paymentStatus === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : rec.paymentStatus === 'PARTIAL'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {rec.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-300 text-[11px]">
                    {rec.dispatchedViaVehicle}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => showToast(`Invoice ${rec.invoiceNo} downloaded`)}
                        title="Download Tax Invoice"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (onCreateOttTask) {
                            onCreateOttTask(`Follow up on Invoice ${rec.invoiceNo} (${rec.partyName})`);
                          }
                          showToast(`Created OTT follow-up for ${rec.partyName}`);
                        }}
                        title="Create OTT Task"
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Invoice / Bill Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Create {platform} {modalType === 'SALE' ? 'Sale Tax Invoice' : 'Purchase Bill'}
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">
                  {modalType === 'SALE' ? 'Customer / Buyer Name *' : 'Supplier / Vendor Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Builders Ltd"
                  value={formParty}
                  onChange={(e) => setFormParty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Material / Product Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laterite Stones Grade A / 20mm Aggregates"
                  value={formItems}
                  onChange={(e) => setFormItems(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity (Units/MT/Tons)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 2000"
                    value={formQty}
                    onChange={(e) => setFormQty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rate per Unit (₹)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 52"
                    value={formRate}
                    onChange={(e) => setFormRate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Transport Vehicle Registration</label>
                <input
                  type="text"
                  placeholder="e.g. KL-14-AJ-8821"
                  value={formVehicle}
                  onChange={(e) => setFormVehicle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Generate {modalType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
