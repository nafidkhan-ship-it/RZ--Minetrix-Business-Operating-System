import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Package,
  Users,
  Building2,
  Receipt,
  ShoppingBag,
  QrCode,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CommerceSubTab } from '../types';
import {
  MOCK_COMMERCE_PRODUCTS,
  MOCK_CUSTOMERS,
  MOCK_SUPPLIERS,
  MOCK_INVOICES,
  MOCK_PURCHASE_ORDERS,
  MOCK_GATE_PASSES
} from '../commerceMockData';

interface CommerceUniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: CommerceSubTab) => void;
}

export const CommerceUniversalSearchModal: React.FC<CommerceUniversalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle search handled externally if needed
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase();

  const matchedProducts = MOCK_COMMERCE_PRODUCTS.filter(
    (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );

  const matchedCustomers = MOCK_CUSTOMERS.filter(
    (c) => c.businessName.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.gstin.toLowerCase().includes(q)
  );

  const matchedSuppliers = MOCK_SUPPLIERS.filter(
    (s) => s.businessName.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
  );

  const matchedInvoices = MOCK_INVOICES.filter(
    (inv) => inv.invoiceNumber.toLowerCase().includes(q) || inv.customerName.toLowerCase().includes(q)
  );

  const matchedPOs = MOCK_PURCHASE_ORDERS.filter(
    (po) => po.poNumber.toLowerCase().includes(q) || po.supplierName.toLowerCase().includes(q)
  );

  const matchedGatePasses = MOCK_GATE_PASSES.filter(
    (gp) => gp.gatePassNumber.toLowerCase().includes(q) || gp.vehicleNumber.toLowerCase().includes(q)
  );

  const hasMatches =
    matchedProducts.length > 0 ||
    matchedCustomers.length > 0 ||
    matchedSuppliers.length > 0 ||
    matchedInvoices.length > 0 ||
    matchedPOs.length > 0 ||
    matchedGatePasses.length > 0;

  const handleSelect = (tab: CommerceSubTab) => {
    onNavigateTab(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search Products, Customers, Suppliers, Invoices, POs, Gate Passes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Stream */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!query.trim() ? (
            <div className="py-8 text-center text-slate-500 space-y-1">
              <Sparkles className="w-6 h-6 text-amber-400/40 mx-auto" />
              <p className="text-white font-medium">Type anything to search across the entire Commerce engine</p>
              <p className="text-[11px] text-slate-500">Search by Material SKU, Customer GSTIN, Vehicle Number, Invoice or PO ID</p>
            </div>
          ) : !hasMatches ? (
            <div className="py-8 text-center text-slate-500">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-4">
              {/* Products */}
              {matchedProducts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">Products ({matchedProducts.length})</span>
                  {matchedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect('products')}
                      className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-white">{p.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({p.sku})</span>
                      </div>
                      <span className="font-mono text-amber-400">₹{p.salesRate}/{p.unit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Customers */}
              {matchedCustomers.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Customers ({matchedCustomers.length})</span>
                  {matchedCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect('customers')}
                      className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-blue-400" />
                        <span className="font-bold text-white">{c.businessName}</span>
                        <span className="text-[10px] text-slate-400">({c.name})</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">{c.gstin}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Invoices */}
              {matchedInvoices.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Invoices ({matchedInvoices.length})</span>
                  {matchedInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => handleSelect('invoices')}
                      className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-bold text-white font-mono">{inv.invoiceNumber}</span>
                        <span className="text-[10px] text-slate-400">({inv.customerName})</span>
                      </div>
                      <span className="font-mono font-bold text-white">₹{inv.grandTotal.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Gate Passes */}
              {matchedGatePasses.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Gate Passes ({matchedGatePasses.length})</span>
                  {matchedGatePasses.map((gp) => (
                    <div
                      key={gp.id}
                      onClick={() => handleSelect('gate-pass')}
                      className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-bold text-white font-mono">{gp.gatePassNumber}</span>
                        <span className="text-[10px] text-slate-400">Vehicle: {gp.vehicleNumber}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400">{gp.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
