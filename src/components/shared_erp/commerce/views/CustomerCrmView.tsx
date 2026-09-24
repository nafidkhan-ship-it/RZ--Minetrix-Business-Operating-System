import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  CreditCard,
  TrendingUp,
  FileText,
  DollarSign,
  MessageSquare,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Printer,
  Receipt,
  Package,
  Calendar
} from 'lucide-react';
import { CustomerProfile, CommerceSubTab } from '../types';
import { MOCK_CUSTOMERS, MOCK_SALES_ORDERS, MOCK_INVOICES, MOCK_CUSTOMER_LEDGER } from '../commerceMockData';

interface CustomerCrmViewProps {
  onNavigateTab: (tab: CommerceSubTab) => void;
  onToast: (msg: string) => void;
  onOpenChatWithPerson?: (name: string) => void;
  onCreateTaskForPerson?: (name: string) => void;
  onOpenPrintModal: (title: string, data: any) => void;
}

export const CustomerCrmView: React.FC<CustomerCrmViewProps> = ({
  onNavigateTab,
  onToast,
  onOpenChatWithPerson,
  onCreateTaskForPerson,
  onOpenPrintModal
}) => {
  const [customers, setCustomers] = useState<CustomerProfile[]>(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile>(customers[0]);
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'ORDERS' | 'INVOICES' | 'PAYMENTS' | 'OUTSTANDING' | 'LEDGER' | 'DOCUMENTS' | 'COMMUNICATION' | 'ACTIVITY'
  >('OVERVIEW');

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.businessName.toLowerCase().includes(search.toLowerCase()) ||
    c.gstin.toLowerCase().includes(search.toLowerCase()) ||
    c.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Customer CRM &bull; Module 2
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Customer Relationship Management &amp; Credit Governance
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Monitors enterprise developer syndicates, road contractors, credit limits, overdue invoices, and direct communication bridges to RZ® Chat &amp; RZ® OTT tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToast('Create new customer record')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Customer</span>
            </button>
            <button
              onClick={() => onOpenPrintModal('Customer Master Directory', customers)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main CRM Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Customer List (5 cols) */}
        <div className="xl:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Customer Accounts ({filtered.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400">CREDIT SYNCED</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by company, name or GSTIN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2 pt-1">
            {filtered.map((c) => {
              const isSelected = selectedCustomer?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-md'
                      : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-black text-white">{c.businessName}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{c.name} &bull; {c.district}, {c.state}</p>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                      {c.customerType}
                    </span>
                  </div>

                  <div className="pt-2 mt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">Limit: ₹{(c.creditLimit / 100000).toFixed(1)}L</span>
                    <span className="font-mono font-bold text-amber-400">
                      {c.outstandingReceivable > 0 ? `₹${(c.outstandingReceivable / 100000).toFixed(1)}L O/S` : 'Nil O/S'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Dossier with 9 Tabs & Quick Actions (7 cols) */}
        <div className="xl:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          {selectedCustomer ? (
            <>
              {/* Dossier Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">{selectedCustomer.id}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {selectedCustomer.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1">{selectedCustomer.businessName}</h2>
                  <p className="text-xs text-slate-400">{selectedCustomer.name} &bull; GSTIN: {selectedCustomer.gstin}</p>
                </div>

                {/* Quick Action Bridges */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => onOpenChatWithPerson?.(selectedCustomer.name)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition border border-amber-500/30 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>RZ® Chat</span>
                  </button>
                  <button
                    onClick={() => onCreateTaskForPerson?.(selectedCustomer.name)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-400 font-bold text-xs flex items-center gap-1.5 transition border border-purple-500/30 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RZ® OTT</span>
                  </button>
                </div>
              </div>

              {/* CRM Quick Operations Strip (Prompt 10: New Quote, New Order, New Invoice, Receive Payment, View Ledger) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
                <button
                  onClick={() => onNavigateTab('quotations')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 cursor-pointer border border-slate-700"
                >
                  + New Quotation
                </button>
                <button
                  onClick={() => onNavigateTab('sales-orders')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 cursor-pointer border border-slate-700"
                >
                  + New Order
                </button>
                <button
                  onClick={() => onNavigateTab('invoices')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold shrink-0 cursor-pointer border border-slate-700"
                >
                  + New Invoice
                </button>
                <button
                  onClick={() => onNavigateTab('payments')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold shrink-0 cursor-pointer border border-emerald-500/30"
                >
                  Receive Payment
                </button>
                <button
                  onClick={() => setActiveTab('LEDGER')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold shrink-0 cursor-pointer border border-amber-500/30"
                >
                  View Ledger
                </button>
              </div>

              {/* 9 CRM Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 text-xs">
                {[
                  { id: 'OVERVIEW', label: 'Overview' },
                  { id: 'ORDERS', label: 'Orders' },
                  { id: 'INVOICES', label: 'Invoices' },
                  { id: 'PAYMENTS', label: 'Payments' },
                  { id: 'OUTSTANDING', label: 'Outstanding' },
                  { id: 'LEDGER', label: 'Ledger' },
                  { id: 'DOCUMENTS', label: 'Documents' },
                  { id: 'COMMUNICATION', label: 'Communication' },
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
                      <span className="text-[10px] text-slate-400 block font-mono">Credit Limit</span>
                      <strong className="text-base font-mono font-bold text-white mt-0.5 block">
                        ₹{selectedCustomer.creditLimit.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block font-mono">Outstanding</span>
                      <strong className="text-base font-mono font-bold text-amber-400 mt-0.5 block">
                        ₹{selectedCustomer.outstandingReceivable.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block font-mono">Advance Balance</span>
                      <strong className="text-base font-mono font-bold text-emerald-400 mt-0.5 block">
                        ₹{selectedCustomer.advanceBalance.toLocaleString()}
                      </strong>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                      <span className="text-[10px] text-slate-400 block font-mono">Payment Terms</span>
                      <strong className="text-white mt-0.5 block truncate">{selectedCustomer.paymentTerms}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-4 text-slate-300">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-amber-400" /> {selectedCustomer.phone}</span>
                      <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> {selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <span>{selectedCustomer.address}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/20 border border-slate-800">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">Commercial Notes:</span>
                    <p className="text-slate-300">{selectedCustomer.notes}</p>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders */}
              {activeTab === 'ORDERS' && (
                <div className="space-y-2 text-xs">
                  {MOCK_SALES_ORDERS.filter((so) => so.customerName === selectedCustomer.businessName).length > 0 ? (
                    MOCK_SALES_ORDERS.filter((so) => so.customerName === selectedCustomer.businessName).map((so) => (
                      <div key={so.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white">{so.orderNumber} &bull; {so.productName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Delivery: {so.deliveryDate} &bull; Qty: {so.quantity} {so.unit}</p>
                        </div>
                        <span className="font-mono font-bold text-amber-400">₹{so.grandTotal.toLocaleString()}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-slate-500">No active sales orders for this client.</div>
                  )}
                </div>
              )}

              {/* Tab 3: Ledger */}
              {activeTab === 'LEDGER' && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="font-bold text-white">Running Statement of Account</span>
                    <button
                      onClick={() => onOpenPrintModal(`Statement of Account - ${selectedCustomer.businessName}`, MOCK_CUSTOMER_LEDGER)}
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
                        {MOCK_CUSTOMER_LEDGER.map((l) => (
                          <tr key={l.id} className="hover:bg-slate-800/40 text-slate-300">
                            <td className="py-2 px-2">{l.date}</td>
                            <td className="py-2 px-2 text-amber-400">{l.docNumber}</td>
                            <td className="py-2 px-2 font-sans max-w-xs truncate">{l.description}</td>
                            <td className="py-2 px-2 text-right">{l.debit > 0 ? l.debit.toLocaleString() : '-'}</td>
                            <td className="py-2 px-2 text-right text-emerald-400">{l.credit > 0 ? l.credit.toLocaleString() : '-'}</td>
                            <td className="py-2 px-2 text-right font-bold text-white">₹{l.balance.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Other Tabs Fallback */}
              {['INVOICES', 'PAYMENTS', 'OUTSTANDING', 'DOCUMENTS', 'COMMUNICATION', 'ACTIVITY'].includes(activeTab) && (
                <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-800 text-center space-y-2">
                  <FileText className="w-8 h-8 text-amber-400/50 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">{activeTab} Details Active for {selectedCustomer.businessName}</p>
                  <p className="text-[11px] text-slate-500">Live synchronized records from ERP Billing Engine and RZ® Chat.</p>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              Select a customer from the left directory to open full dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
