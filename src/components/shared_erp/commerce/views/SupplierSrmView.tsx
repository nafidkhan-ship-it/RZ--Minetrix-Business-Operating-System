import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  ShoppingBag,
  Truck,
  FileText,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Printer,
  Receipt
} from 'lucide-react';
import { SupplierProfile, CommerceSubTab } from '../types';
import { MOCK_SUPPLIERS, MOCK_PURCHASE_ORDERS, MOCK_PURCHASE_BILLS, MOCK_SUPPLIER_LEDGER } from '../commerceMockData';

interface SupplierSrmViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenChatWithPerson?: (name: string) => void;
  onCreateTaskForPerson?: (name: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const SupplierSrmView: React.FC<SupplierSrmViewProps> = ({
  onNavigateTab,
  onToast,
  onOpenChatWithPerson,
  onCreateTaskForPerson,
  onOpenPrintModal
}) => {
  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(MOCK_SUPPLIERS);
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProfile>(suppliers[0]);
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'PRODUCTS' | 'POS' | 'GRN' | 'BILLS' | 'PAYMENTS' | 'OUTSTANDING' | 'LEDGER' | 'DOCUMENTS' | 'ACTIVITY'
  >('OVERVIEW');

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.businessName.toLowerCase().includes(search.toLowerCase()) ||
    s.gstin.toLowerCase().includes(search.toLowerCase()) ||
    s.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Supplier SRM &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Supplier Relationship Management &amp; Vendor Procurement
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Covers OEM spare parts manufacturers (Sandvik, Metso), licensed explosive magazines (Solar), commercial fuel terminals (BPCL), and fleet tyre vendors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToast('Create new supplier profile')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Supplier</span>
            </button>
            <button
              onClick={() => onOpenPrintModal('Supplier Master Directory', suppliers)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main SRM Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Supplier List (5 cols) */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Vendor Registry ({filtered.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">SRM ACTIVE</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search vendor by name, company or GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2 pt-1">
            {filtered.map((s) => {
              const isSelected = selectedSupplier?.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSupplier(s)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-black text-white">{s.businessName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{s.name} &bull; {s.district}, {s.state}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                      {s.supplierType}
                    </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">Terms: {s.creditTerms}</span>
                    <span className="font-mono font-bold text-rose-400">
                      ₹{(s.outstandingPayable / 100000).toFixed(1)}L Payable
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Supplier Dossier with 10 Tabs & Quick Actions (7 cols) */}
        <div className="xl:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          {selectedSupplier ? (
            <>
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{selectedSupplier.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {selectedSupplier.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1">{selectedSupplier.businessName}</h2>
                  <p className="text-xs text-slate-400">{selectedSupplier.name} &bull; GSTIN: {selectedSupplier.gstin}</p>
                </div>

                {/* Communication Bridges */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenChatWithPerson?.(selectedSupplier.name)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition border border-amber-500/30 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>RZ® Chat</span>
                  </button>
                  <button
                    onClick={() => onCreateTaskForPerson?.(selectedSupplier.name)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-bold text-xs flex items-center gap-1.5 transition border border-purple-500/30 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RZ® OTT</span>
                  </button>
                </div>
              </div>

              {/* SRM Quick Operations Strip (Prompt 11: PR, RFQ, PO, Record GRN, Purchase Bill, Make Payment, View Ledger) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                <button
                  onClick={() => onNavigateTab('purchase-requests')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 cursor-pointer border border-slate-700"
                >
                  + Purchase Request
                </button>
                <button
                  onClick={() => onNavigateTab('rfq')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 cursor-pointer border border-slate-700"
                >
                  + RFQ
                </button>
                <button
                  onClick={() => onNavigateTab('purchase-orders')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 cursor-pointer border border-slate-700"
                >
                  + Purchase Order
                </button>
                <button
                  onClick={() => onNavigateTab('grn')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 cursor-pointer border border-slate-700"
                >
                  Record GRN
                </button>
                <button
                  onClick={() => onNavigateTab('purchase-bills')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 cursor-pointer border border-slate-700"
                >
                  Purchase Bill
                </button>
                <button
                  onClick={() => onNavigateTab('payments')}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold shrink-0 cursor-pointer border border-rose-500/30"
                >
                  Make Payment
                </button>
                <button
                  onClick={() => setActiveTab('LEDGER')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold shrink-0 cursor-pointer border border-amber-500/30"
                >
                  View Ledger
                </button>
              </div>

              {/* 10 SRM Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 text-xs">
                {[
                  { id: 'OVERVIEW', label: 'Overview' },
                  { id: 'PRODUCTS', label: 'Supplied Spares' },
                  { id: 'POS', label: 'Purchase Orders' },
                  { id: 'GRN', label: 'Inward GRN' },
                  { id: 'BILLS', label: 'Bills' },
                  { id: 'PAYMENTS', label: 'Disbursements' },
                  { id: 'OUTSTANDING', label: 'Payables' },
                  { id: 'LEDGER', label: 'Ledger' },
                  { id: 'DOCUMENTS', label: 'Licenses & MOUs' },
                  { id: 'ACTIVITY', label: 'Activity' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                      activeTab === t.id
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'OVERVIEW' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block font-mono">Credit Terms</span>
                      <strong className="text-white mt-0.5 block truncate">{selectedSupplier.creditTerms}</strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block font-mono">Outstanding Payable</span>
                      <strong className="text-base font-mono font-bold text-rose-400 mt-0.5 block">
                        ₹{selectedSupplier.outstandingPayable.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block font-mono">Advance Paid</span>
                      <strong className="text-base font-mono font-bold text-emerald-400 mt-0.5 block">
                        ₹{selectedSupplier.advancePaid.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block font-mono">Purchase Count</span>
                      <strong className="text-base font-mono font-bold text-white mt-0.5 block">
                        {selectedSupplier.purchaseHistoryCount} Invoices
                      </strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-4 text-slate-300">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> {selectedSupplier.phone}</span>
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> {selectedSupplier.email}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{selectedSupplier.address}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/20 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Contractor Notes:</span>
                    <p className="text-slate-300">{selectedSupplier.notes}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Supplier Ledger */}
              {activeTab === 'LEDGER' && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="font-bold text-white">Creditors Statement of Account</span>
                    <button
                      onClick={() => onOpenPrintModal(`Supplier Ledger - ${selectedSupplier.businessName}`, MOCK_SUPPLIER_LEDGER)}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      Print Ledger
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400">
                          <th className="py-2 px-2">DATE</th>
                          <th className="py-2 px-2">DOC</th>
                          <th className="py-2 px-2">DESCRIPTION</th>
                          <th className="py-2 px-2 text-right">DEBIT (₹)</th>
                          <th className="py-2 px-2 text-right">CREDIT (₹)</th>
                          <th className="py-2 px-2 text-right">BALANCE (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        {MOCK_SUPPLIER_LEDGER.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-800/40 text-slate-300">
                            <td className="py-2 px-2">{l.date}</td>
                            <td className="py-2 px-2 text-amber-400">{l.docNumber}</td>
                            <td className="py-2 px-2 font-sans max-w-xs truncate">{l.description}</td>
                            <td className="py-2 px-2 text-right text-emerald-400">{l.debit > 0 ? l.debit.toLocaleString() : '-'}</td>
                            <td className="py-2 px-2 text-right">{l.credit > 0 ? l.credit.toLocaleString() : '-'}</td>
                            <td className="py-2 px-2 text-right font-bold text-rose-400">₹{l.balance.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Fallback for other tabs */}
              {['PRODUCTS', 'POS', 'GRN', 'BILLS', 'PAYMENTS', 'OUTSTANDING', 'DOCUMENTS', 'ACTIVITY'].includes(activeTab) && (
                <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-800 text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-amber-400/50 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">{activeTab} Record Stream for {selectedSupplier.businessName}</p>
                  <p className="text-[11px] text-slate-500">Live synchronized records from Purchase Orders, Material Receipts &amp; Ledger.</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select a supplier from the left registry to inspect dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
