import React, { useState } from 'react';
import {
  Users,
  Building2,
  Search,
  Plus,
  Filter,
  CreditCard,
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  ArrowRight,
  Receipt
} from 'lucide-react';
import { MasterPerson } from '../types';
import { MOCK_MASTER_PEOPLE } from '../data/erpMasterData';

interface CustomerSupplierViewProps {
  initialType?: 'customers' | 'suppliers';
  onOpenChatWithPerson?: (name: string) => void;
  onCreateTaskForPerson?: (name: string) => void;
}

export const CustomerSupplierView: React.FC<CustomerSupplierViewProps> = ({
  initialType = 'customers',
  onOpenChatWithPerson,
  onCreateTaskForPerson
}) => {
  const [activeTab, setActiveTab] = useState<'customers' | 'suppliers'>(initialType);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<MasterPerson | null>(null);
  const [paymentToast, setPaymentToast] = useState<string | null>(null);

  const people = MOCK_MASTER_PEOPLE;

  const customers = people.filter(p => p.relationships.includes('CUSTOMER'));
  const suppliers = people.filter(p => p.relationships.includes('SUPPLIER'));

  const list = activeTab === 'customers' ? customers : suppliers;

  const filtered = list.filter(item =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.phone.includes(searchQuery) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (msg: string) => {
    setPaymentToast(msg);
    setTimeout(() => setPaymentToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {paymentToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{paymentToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
              COMMERCIAL PARTNERS &bull; CUSTOMERS &amp; SUPPLIERS
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            {activeTab === 'customers' ? (
              <>
                <Users className="w-6 h-6 text-amber-400" />
                <span>Customer Relationship Management (CRM &amp; Receivables)</span>
              </>
            ) : (
              <>
                <Building2 className="w-6 h-6 text-emerald-400" />
                <span>Supplier Relationship Management (SRM &amp; Payables)</span>
              </>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
            Linked to the Master Person Profile. Displays credit terms, outstanding balances, order pipeline, payment history, and integrated RZ Chat &amp; OTT tasks.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setActiveTab('customers'); setSelectedEntity(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Customers ({customers.length})</span>
          </button>
          <button
            onClick={() => { setActiveTab('suppliers'); setSelectedEntity(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'suppliers'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Suppliers ({suppliers.length})</span>
          </button>
        </div>
      </div>

      {/* Search & Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            {filtered.map(entity => {
              const isSelected = selectedEntity?.id === entity.id;
              return (
                <div
                  key={entity.id}
                  onClick={() => setSelectedEntity(entity)}
                  className={`p-4 rounded-2xl border transition cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500 shadow-md'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">{entity.fullName}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">{entity.id}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold">
                      {entity.primaryRole}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-900">
                    <span>
                      {activeTab === 'customers' ? 'Outstanding Rec:' : 'Payable Due:'}
                    </span>
                    <span className={activeTab === 'customers' ? 'text-cyan-400 font-bold' : 'text-rose-400 font-bold'}>
                      ₹{(activeTab === 'customers' ? entity.totalReceivable : entity.totalPayable)?.toLocaleString() || '0'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail & Ledger Column */}
        <div className="lg:col-span-2">
          {selectedEntity ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black text-lg flex items-center justify-center font-mono">
                    {selectedEntity.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selectedEntity.fullName}</h3>
                    <div className="text-xs text-slate-500 font-mono">
                      {selectedEntity.id} &bull; GSTIN: {selectedEntity.gstin || 'Unregistered'} &bull; PAN: {selectedEntity.panNumber || 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenChatWithPerson?.(selectedEntity.fullName)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>RZ® Chat</span>
                  </button>
                  <button
                    onClick={() => onCreateTaskForPerson?.(selectedEntity.fullName)}
                    className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-amber-400 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>OTT Task</span>
                  </button>
                </div>
              </div>

              {/* Financial Dashboard Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Credit Limit</span>
                  <span className="text-base font-black text-white">
                    ₹{selectedEntity.creditLimit?.toLocaleString() || 'Unlimited'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Payment Terms</span>
                  <span className="text-xs font-bold text-amber-400 block truncate">
                    {selectedEntity.paymentTerms || 'Net 15 Days'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Current Balance</span>
                  <span className={`text-base font-black ${activeTab === 'customers' ? 'text-cyan-400' : 'text-rose-400'}`}>
                    ₹{(activeTab === 'customers' ? selectedEntity.totalReceivable : selectedEntity.totalPayable)?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Risk Status</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Credit Good</span>
                  </span>
                </div>
              </div>

              {/* Account Ledger Transactions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-white text-xs flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-amber-400" />
                    <span>Statement of Account &amp; Transaction Ledger</span>
                  </h4>
                  <button
                    onClick={() => showToast(`Recorded payment receipt for ${selectedEntity.fullName}`)}
                    className="px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Record Payment
                  </button>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">INV-2026-081 &bull; 2,500 Pcs Laterite Stone</span>
                      <div className="text-[10px] text-slate-500">2026-02-21 &bull; Weighbridge Pass #GP-1092</div>
                    </div>
                    <div className="text-right">
                      <div className="text-rose-400 font-bold">+₹1,10,250 (Debit)</div>
                      <div className="text-[10px] text-slate-500">Billed</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">PAY-RTGS-9921 &bull; HDFC Bank Direct Transfer</span>
                      <div className="text-[10px] text-slate-500">2026-02-21 &bull; Ref: HDFC991201992</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold">-₹50,000 (Credit)</div>
                      <div className="text-[10px] text-emerald-500">Cleared</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-2">
              <Users className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs">Select any {activeTab === 'customers' ? 'customer' : 'supplier'} on the left to inspect their statement, credit limit, and active orders.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
