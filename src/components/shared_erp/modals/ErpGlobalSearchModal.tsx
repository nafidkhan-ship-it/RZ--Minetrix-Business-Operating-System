import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  Users,
  Package,
  ShoppingBag,
  TrendingUp,
  Truck,
  CreditCard,
  Building2,
  FileText,
  DollarSign
} from 'lucide-react';
import {
  MOCK_MASTER_PEOPLE,
  MOCK_ERP_PRODUCTS,
  MOCK_CENTRAL_ORDERS,
  MOCK_SALES_INVOICES,
  MOCK_STAFF_MEMBERS
} from '../data/erpMasterData';

interface ErpGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (category: string, item: any) => void;
}

export const ErpGlobalSearchModal: React.FC<ErpGlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];

    const q = query.toLowerCase();
    const list: {
      type: string;
      title: string;
      subtitle: string;
      badge: string;
      icon: any;
      data: any;
    }[] = [];

    // People
    MOCK_MASTER_PEOPLE.forEach(p => {
      if (
        p.fullName.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.relationships.some(r => r.toLowerCase().includes(q))
      ) {
        list.push({
          type: 'master-data',
          title: p.fullName,
          subtitle: `Relationships: ${p.relationships.join(', ')} • Phone: ${p.phone}`,
          badge: p.primaryRole,
          icon: Users,
          data: p
        });
      }
    });

    // Products
    MOCK_ERP_PRODUCTS.forEach(prd => {
      if (prd.name.toLowerCase().includes(q) || prd.sku.toLowerCase().includes(q)) {
        list.push({
          type: 'products-rates',
          title: prd.name,
          subtitle: `SKU: ${prd.sku} • Stock: ${prd.currentStock} ${prd.unit} • Sales Rate: ₹${prd.salesRate}`,
          badge: prd.category,
          icon: Package,
          data: prd
        });
      }
    });

    // Orders
    MOCK_CENTRAL_ORDERS.forEach(ord => {
      if (
        ord.orderNumber.toLowerCase().includes(q) ||
        ord.customerName.toLowerCase().includes(q) ||
        ord.productName.toLowerCase().includes(q)
      ) {
        list.push({
          type: 'orders',
          title: ord.orderNumber,
          subtitle: `Customer: ${ord.customerName} • Qty: ${ord.quantity} ${ord.unit} • Status: ${ord.status}`,
          badge: `₹${ord.totalAmount.toLocaleString()}`,
          icon: TrendingUp,
          data: ord
        });
      }
    });

    // Invoices
    MOCK_SALES_INVOICES.forEach(inv => {
      if (inv.invoiceNumber.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q)) {
        list.push({
          type: 'sales',
          title: inv.invoiceNumber,
          subtitle: `To: ${inv.customerName} • Total: ₹${inv.totalAmount.toLocaleString()} • Status: ${inv.paymentStatus}`,
          badge: 'TAX INVOICE',
          icon: FileText,
          data: inv
        });
      }
    });

    // Staff
    MOCK_STAFF_MEMBERS.forEach(st => {
      if (st.name.toLowerCase().includes(q) || st.employeeId.toLowerCase().includes(q)) {
        list.push({
          type: 'staff',
          title: st.name,
          subtitle: `${st.designation} • Dept: ${st.department} • Rate: ₹${st.salaryRate}/mo`,
          badge: st.employeeId,
          icon: Users,
          data: st
        });
      }
    });

    return list;
  }, [query]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Universal Search across People, Products, Orders, Invoices, Staff..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
          {results.length > 0 ? (
            results.map((res, idx) => {
              const Icon = res.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectResult(res.type, res.data);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 flex items-center justify-between gap-3 cursor-pointer group transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs group-hover:text-amber-300">
                          {res.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-300 font-mono">
                          {res.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {res.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition shrink-0" />
                </div>
              );
            })
          ) : query.trim().length >= 2 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              Type at least 2 characters to search across the entire Shared ERP Core backbone.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
