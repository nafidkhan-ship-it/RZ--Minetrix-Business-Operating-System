import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  Layers,
  Sliders,
  Users,
  Building2,
  ShoppingBag,
  FileText,
  Truck,
  RotateCcw,
  TrendingUp,
  Receipt,
  CreditCard,
  QrCode,
  Sparkles,
  Search,
  Zap,
  Plus,
  ShieldCheck,
  ChevronDown,
  Filter,
  CheckCircle2,
  Calendar,
  DollarSign,
  Settings,
  Scale,
  Percent
} from 'lucide-react';
import { CommerceSubTab, CommerceRole } from './types';

interface CommerceNavPillsProps {
  activeTab: CommerceSubTab;
  onSelectTab: (tab: CommerceSubTab) => void;
  currentRole: CommerceRole;
  onSelectRole: (role: CommerceRole) => void;
  onOpenSearch: () => void;
  onOpenQuickActions: () => void;
  onOpenFlows: () => void;
  onOpenNewProduct: () => void;
}

export const CommerceNavPills: React.FC<CommerceNavPillsProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  onSelectRole,
  onOpenSearch,
  onOpenQuickActions,
  onOpenFlows,
  onOpenNewProduct
}) => {
  const [filterGroup, setFilterGroup] = useState<string>('ALL');

  const ALL_TABS: {
    id: CommerceSubTab;
    label: string;
    group: 'OVERVIEW' | 'CATALOG' | 'PARTNERS' | 'PURCHASE' | 'SALES' | 'FULFILLMENT' | 'FINANCE' | 'SYSTEM';
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'dashboard', label: '1. Dashboard', group: 'OVERVIEW', icon: BarChart3 },
    { id: 'products', label: '2. Products', group: 'CATALOG', icon: Package, badge: '24' },
    { id: 'categories', label: '3. Categories', group: 'CATALOG', icon: Layers, badge: '6' },
    { id: 'units', label: '4. Units', group: 'CATALOG', icon: Scale },
    { id: 'hsn-gst', label: '5. HSN / GST', group: 'CATALOG', icon: Percent },
    { id: 'rates', label: '6. Rate Setup', group: 'CATALOG', icon: Sliders },
    { id: 'customers', label: '7. Customers CRM', group: 'PARTNERS', icon: Users, badge: '48' },
    { id: 'suppliers', label: '8. Suppliers SRM', group: 'PARTNERS', icon: Building2, badge: '32' },
    { id: 'purchase-requests', label: '9. Purchase Requests', group: 'PURCHASE', icon: FileText, badge: '3' },
    { id: 'rfq', label: '10. RFQ Matrix', group: 'PURCHASE', icon: Filter },
    { id: 'purchase-orders', label: '11. Purchase Orders', group: 'PURCHASE', icon: ShoppingBag, badge: '4' },
    { id: 'grn', label: '12. GRN / Receipts', group: 'PURCHASE', icon: Truck, badge: '2' },
    { id: 'purchase-bills', label: '13. Purchase Bills', group: 'PURCHASE', icon: Receipt },
    { id: 'purchase-returns', label: '14. Purchase Returns', group: 'PURCHASE', icon: RotateCcw },
    { id: 'quotations', label: '15. Quotations', group: 'SALES', icon: FileText, badge: '2' },
    { id: 'sales-orders', label: '16. Sales Orders', group: 'SALES', icon: Package, badge: '7' },
    { id: 'delivery', label: '17. Delivery Dispatches', group: 'FULFILLMENT', icon: Truck, badge: '5' },
    { id: 'invoices', label: '18. Invoices', group: 'SALES', icon: Receipt, badge: '4' },
    { id: 'payments', label: '19. Payments & Receipts', group: 'FINANCE', icon: DollarSign },
    { id: 'sales-returns', label: '20. Sales Returns', group: 'SALES', icon: RotateCcw },
    { id: 'credit-debit-notes', label: '21. Credit / Debit Notes', group: 'FINANCE', icon: CreditCard },
    { id: 'orders', label: '22. Unified Order Center', group: 'FULFILLMENT', icon: Layers, badge: '10-Plat' },
    { id: 'gate-pass', label: '23. Gate Pass (QR)', group: 'FULFILLMENT', icon: QrCode },
    { id: 'customer-ledger', label: '24. Customer Ledger', group: 'FINANCE', icon: TrendingUp },
    { id: 'supplier-ledger', label: '25. Supplier Ledger', group: 'FINANCE', icon: DollarSign },
    { id: 'reports', label: '26. Commerce Reports', group: 'SYSTEM', icon: BarChart3, badge: '16' },
    { id: 'settings', label: '27. Settings', group: 'SYSTEM', icon: Settings }
  ];

  const GROUPS = [
    { id: 'ALL', label: 'All 26 Modules' },
    { id: 'OVERVIEW', label: 'Overview' },
    { id: 'CATALOG', label: 'Catalog & Rates' },
    { id: 'PARTNERS', label: 'CRM & SRM' },
    { id: 'PURCHASE', label: 'Purchase Flow' },
    { id: 'SALES', label: 'Sales Flow' },
    { id: 'FULFILLMENT', label: 'Fulfillment & Gate' },
    { id: 'FINANCE', label: 'Finance & Ledgers' },
    { id: 'SYSTEM', label: 'Reports & Config' }
  ];

  const visibleTabs = filterGroup === 'ALL'
    ? ALL_TABS
    : ALL_TABS.filter((t) => t.group === filterGroup);

  const ROLES: { id: CommerceRole; label: string; desc: string }[] = [
    { id: 'OWNER', label: 'OWNER / MD', desc: 'Full authority, credit overrides & financial P&L' },
    { id: 'MANAGER', label: 'MANAGER', desc: 'Order approvals, discounts & inventory monitoring' },
    { id: 'ACCOUNTANT', label: 'ACCOUNTANT', desc: 'Invoices, GST returns, ledgers & payments' },
    { id: 'SALES', label: 'SALES EXECUTIVE', desc: 'Quotations, customer orders & rate sheets' },
    { id: 'PURCHASE', label: 'PURCHASE OFFICER', desc: 'PRs, RFQ vendor quotes & purchase orders' },
    { id: 'STORE', label: 'STORE / INVENTORY', desc: 'GRN inspection, stock levels & issues' },
    { id: 'DISPATCH', label: 'DISPATCH OFFICER', desc: 'Weighbridge loading, gate pass & logistics' },
    { id: 'SUPERVISOR', label: 'SITE SUPERVISOR', desc: 'Pithead/crusher delivery acceptance' },
    { id: 'STAFF', label: 'GENERAL STAFF', desc: 'Internal material requisitions' },
    { id: 'CUSTOMER', label: 'CUSTOMER PORTAL', desc: 'Order tracking, invoice downloads & pay-in' },
    { id: 'SUPPLIER', label: 'SUPPLIER PORTAL', desc: 'RFQ bidding, PO confirmation & payment receipts' }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-4 shadow-xl">
      {/* Top Row: Role Switcher & Action Center */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400 text-[11px]">Role View:</span>
            <select
              value={currentRole}
              onChange={(e) => onSelectRole(e.target.value as CommerceRole)}
              className="bg-transparent text-amber-400 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900 text-white">
                  {r.label} — {r.desc}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
            Simulated Permissions: <span className="text-emerald-400 font-bold">{currentRole}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
          <button
            onClick={onOpenSearch}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition border border-slate-700 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Universal Search</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">⌘K</span>
          </button>

          <button
            onClick={onOpenQuickActions}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition border border-amber-500/30 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>15 Quick Actions</span>
          </button>

          <button
            onClick={onOpenFlows}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>6 Interactive Flows</span>
          </button>

          <button
            onClick={onOpenNewProduct}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Product</span>
          </button>
        </div>
      </div>

      {/* Filter Category Tabs for 26 Items */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
        <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 mr-1">Clusters:</span>
        {GROUPS.map((grp) => (
          <button
            key={grp.id}
            onClick={() => setFilterGroup(grp.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
              filterGroup === grp.id
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {grp.label}
          </button>
        ))}
      </div>

      {/* 26-Pill Horizontal Scrollable Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-amber-500/30">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
