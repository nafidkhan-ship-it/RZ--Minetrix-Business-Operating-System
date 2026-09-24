import React, { useState } from 'react';
import {
  Search,
  X,
  FileText,
  Users,
  Building2,
  DollarSign,
  Landmark,
  Truck,
  Layers,
  ArrowRight,
  TrendingUp,
  Receipt,
  Sparkles
} from 'lucide-react';
import { FinanceSectionTab } from '../types';

interface FinanceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: FinanceSectionTab) => void;
}

export const FinanceSearchModal: React.FC<FinanceSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  if (!isOpen) return null;

  const SEARCH_ITEMS: {
    id: string;
    type: 'Invoice' | 'Customer' | 'Supplier' | 'Voucher' | 'Expense' | 'Ledger' | 'Staff' | 'Partner' | 'Vehicle' | 'Land Owner' | 'Bank';
    title: string;
    subtitle: string;
    amount?: string;
    targetTab: FinanceSectionTab;
  }[] = [
    { id: '1', type: 'Invoice', title: 'Tax Invoice INV-2026-081', subtitle: 'Customer: Sobha Developers Ltd • Laterite Cut Stones', amount: '₹1,09,200', targetTab: 'debtors' },
    { id: '2', type: 'Customer', title: 'Malabar Highway Infra Ltd', subtitle: 'Calicut Bypass Package 3 • Balance: ₹12,40,000', amount: '₹12,40,000', targetTab: 'debtors' },
    { id: '3', type: 'Supplier', title: 'Bharat Petroleum Yard Depot', subtitle: 'Diesel bulk dispenser credit account • Bill: BILL-BP-9921', amount: '₹4,50,000', targetTab: 'creditors' },
    { id: '4', type: 'Supplier', title: 'Sandvik Mining Spare Parts', subtitle: 'Jaw Crusher toggle plate & wear rings • Bill: BILL-SV-4401', amount: '₹1,85,000', targetTab: 'creditors' },
    { id: '5', type: 'Voucher', title: 'Pay-In Voucher PIN-2026-101', subtitle: 'From Sobha Developers Ltd via HDFC RTGS', amount: '₹75,000', targetTab: 'pay-in' },
    { id: '6', type: 'Voucher', title: 'Pay-Out Voucher POUT-2026-091', subtitle: 'BPCL Diesel Bowser Bulk Fill • Federal Bank NEFT', amount: '₹1,50,000', targetTab: 'pay-out' },
    { id: '7', type: 'Expense', title: 'EXP-2026-01: Pit Excavator Diesel', subtitle: 'Category: Fuel • Dispensed to CAT 320D', amount: '₹42,500', targetTab: 'expenses' },
    { id: '8', type: 'Expense', title: 'EXP-2026-02: VSI Jaw Liner Wear Replacement', subtitle: 'Category: Maintenance • Paid to Sandvik Spares', amount: '₹68,000', targetTab: 'expenses' },
    { id: '9', type: 'Staff', title: 'Rajesh Nair (Pit Supervisor)', subtitle: 'Staff Advance Balance: ₹35,000 • Salary: ₹38,000', amount: '₹35,000', targetTab: 'staff-advances' },
    { id: '10', type: 'Staff', title: 'Manoj Kumar (Hydraulic Operator)', subtitle: 'Staff Advance Balance: ₹18,000 • Salary: ₹32,000', amount: '₹18,000', targetTab: 'payroll' },
    { id: '11', type: 'Partner', title: 'Dr. CP Moideen', subtitle: 'Equity Capital Partner • 40% Share • Current Valuation ₹2.85 Cr', amount: '₹1,50,00,000', targetTab: 'investments' },
    { id: '12', type: 'Partner', title: 'K. Raghavan (Operations Partner)', subtitle: 'Monthly Profit Share • Draw: ₹85,000/mo', amount: '₹34,50,000', targetTab: 'settlements' },
    { id: '13', type: 'Vehicle', title: 'Tipper Truck KL-11-BH-4401', subtitle: 'Trip Account TRP-9921 • Safeer Logistics (Owner 100%)', amount: '₹8,500', targetTab: 'trips' },
    { id: '14', type: 'Vehicle', title: 'Multi-Owner Tipper KL-18-E-9022', subtitle: 'Owner B (60%) & Owner E (40%) • Net Margin: ₹5,800', amount: '₹12,000', targetTab: 'vehicle-owners' },
    { id: '15', type: 'Land Owner', title: 'K. Balakrishnan Nambiar', subtitle: 'Lease: MINE-LEASE-KL-04 • Royalty Due: ₹2,28,000', amount: '₹2,28,000', targetTab: 'land-owners' },
    { id: '16', type: 'Land Owner', title: 'V. Moosa Haji Estate', subtitle: 'Parcel: Quarry Hill West #09 • Mining & Return Hybrid', amount: '₹1,68,400', targetTab: 'land-owners' },
    { id: '17', type: 'Bank', title: 'HDFC Corporate Current A/C', subtitle: 'Account: ...3711 • Balance: ₹24,50,000', amount: '₹24,50,000', targetTab: 'banks' },
    { id: '18', type: 'Bank', title: 'SBI Mining Escrow Account', subtitle: 'Account: ...9019 • Balance: ₹14,20,450', amount: '₹14,20,450', targetTab: 'banks' },
    { id: '19', type: 'Ledger', title: 'Accounts Receivable (Debtors Ledger)', subtitle: 'General Ledger #1100 • 18 Open Invoices', amount: '₹34,60,000', targetTab: 'ledgers' }
  ];

  const filtered = SEARCH_ITEMS.filter((item) => {
    const matchesQuery =
      query === '' ||
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filterType === 'ALL' || item.type.toUpperCase() === filterType.toUpperCase();
    return matchesQuery && matchesFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'Invoice':
      case 'Voucher':
      case 'Ledger':
        return FileText;
      case 'Customer':
        return Users;
      case 'Supplier':
        return Building2;
      case 'Expense':
        return Receipt;
      case 'Staff':
        return DollarSign;
      case 'Partner':
        return Sparkles;
      case 'Vehicle':
        return Truck;
      case 'Land Owner':
        return Layers;
      case 'Bank':
        return Landmark;
      default:
        return FileText;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search invoice, customer, voucher, expense, staff, bank, land owner..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-500 hover:text-white text-xs px-1.5 py-0.5 rounded-md bg-slate-800"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono scrollbar-none">
          {['ALL', 'INVOICE', 'CUSTOMER', 'SUPPLIER', 'VOUCHER', 'EXPENSE', 'STAFF', 'PARTNER', 'VEHICLE', 'LAND OWNER', 'BANK'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap cursor-pointer ${
                filterType === cat
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-3 overflow-y-auto space-y-1.5 flex-1 divide-y divide-slate-800/40">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No matching records found for "{query}"
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = getIcon(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onNavigateTab(item.targetTab);
                    onClose();
                  }}
                  className="pt-1.5 first:pt-0 p-2 rounded-2xl hover:bg-slate-850/80 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 group-hover:scale-105 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white group-hover:text-amber-300 transition">
                          {item.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 font-mono uppercase">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    {item.amount && (
                      <span className="text-xs font-mono font-bold text-amber-400">{item.amount}</span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
