import React from 'react';
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  Users,
  Building2,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  Receipt,
  Truck,
  FileText,
  DollarSign,
  Clock,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { CommerceSubTab } from './types';

interface CommerceKpiCardsProps {
  onCardClick?: (targetTab: CommerceSubTab) => void;
}

export const CommerceKpiCards: React.FC<CommerceKpiCardsProps> = ({ onCardClick }) => {
  const KPIS: {
    id: string;
    label: string;
    value: string;
    subtext: string;
    targetTab: CommerceSubTab;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badge: string;
    badgeColor: string;
  }[] = [
    {
      id: 'total-products',
      label: 'Total Products',
      value: '24',
      subtext: '6 active categories',
      targetTab: 'products',
      icon: Package,
      accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      badge: '+4 new SKUs',
      badgeColor: 'text-amber-400 bg-amber-500/10'
    },
    {
      id: 'active-products',
      label: 'Active Products',
      value: '22',
      subtext: '91.6% catalog active',
      targetTab: 'products',
      icon: CheckCircle2,
      accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      badge: 'LIVE',
      badgeColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'low-stock',
      label: 'Low Stock Alerts',
      value: '3',
      subtext: 'P-Sand, 20mm & Liners',
      targetTab: 'products',
      icon: AlertTriangle,
      accentColor: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      badge: 'REORDER REQ',
      badgeColor: 'text-rose-400 bg-rose-500/10'
    },
    {
      id: 'customers',
      label: 'Active Customers',
      value: '48',
      subtext: 'Key contractors & devs',
      targetTab: 'customers',
      icon: Users,
      accentColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      badge: '+3 this month',
      badgeColor: 'text-blue-400 bg-blue-500/10'
    },
    {
      id: 'suppliers',
      label: 'Active Suppliers',
      value: '32',
      subtext: 'Fuel, spares, explosives',
      targetTab: 'suppliers',
      icon: Building2,
      accentColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      badge: 'VERIFIED SRM',
      badgeColor: 'text-purple-400 bg-purple-500/10'
    },
    {
      id: 'purchase-today',
      label: 'Purchase Today',
      value: '₹3,42,500',
      subtext: 'Diesel tanker & liners',
      targetTab: 'purchase-orders',
      icon: ShoppingBag,
      accentColor: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400',
      badge: '2 POs',
      badgeColor: 'text-cyan-400 bg-cyan-500/10'
    },
    {
      id: 'sales-today',
      label: 'Sales Today',
      value: '₹8,92,400',
      subtext: 'Aggregates & laterite',
      targetTab: 'sales-orders',
      icon: TrendingUp,
      accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      badge: '14 Dispatches',
      badgeColor: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'receivables',
      label: 'Outstanding Receivables',
      value: '₹34,22,000',
      subtext: 'Sobha & Malabar Infra',
      targetTab: 'customer-ledger',
      icon: CreditCard,
      accentColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      badge: '₹4.4L Overdue',
      badgeColor: 'text-amber-400 bg-amber-500/10'
    },
    {
      id: 'payables',
      label: 'Outstanding Payables',
      value: '₹18,65,000',
      subtext: 'BPCL Depot & Sandvik',
      targetTab: 'supplier-ledger',
      icon: DollarSign,
      accentColor: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
      badge: 'DUE 15D',
      badgeColor: 'text-rose-400 bg-rose-500/10'
    },
    {
      id: 'pending-pos',
      label: 'Pending POs',
      value: '4',
      subtext: 'Awaiting vendor dispatch',
      targetTab: 'purchase-orders',
      icon: FileText,
      accentColor: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
      badge: 'IN PIPELINE',
      badgeColor: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      id: 'pending-sos',
      label: 'Pending Sales Orders',
      value: '7',
      subtext: 'In queue for loading',
      targetTab: 'sales-orders',
      icon: Clock,
      accentColor: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
      badge: 'PRODUCTION',
      badgeColor: 'text-orange-400 bg-orange-500/10'
    },
    {
      id: 'pending-deliv',
      label: 'Pending Deliveries',
      value: '5',
      subtext: '2 in-transit, 3 ready',
      targetTab: 'delivery',
      icon: Truck,
      accentColor: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      badge: 'GATE EN-ROUTE',
      badgeColor: 'text-blue-400 bg-blue-500/10'
    },
    {
      id: 'pending-inv',
      label: 'Pending Invoices',
      value: '3',
      subtext: 'Delivered, bill unissued',
      targetTab: 'invoices',
      icon: Receipt,
      accentColor: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
      badge: 'READY TO BILL',
      badgeColor: 'text-yellow-400 bg-yellow-500/10'
    },
    {
      id: 'today-collections',
      label: "Today's Collections",
      value: '₹5,24,000',
      subtext: 'UPI + RTGS receipts',
      targetTab: 'payments',
      icon: Sparkles,
      accentColor: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
      badge: 'CLEARED',
      badgeColor: 'text-emerald-400 bg-emerald-500/10'
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Live Commerce Metrics &amp; Operational Pulse
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
            STUDIO PREVIEW / DEMO DATA
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Click any card to jump to that module section
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {KPIS.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={() => onCardClick?.(kpi.targetTab)}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-3.5 transition cursor-pointer hover:scale-[1.02] flex flex-col justify-between group shadow-lg"
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <div className={`p-2 rounded-xl border ${kpi.accentColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${kpi.badgeColor}`}>
                  {kpi.badge}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium truncate group-hover:text-slate-200">
                  {kpi.label}
                </p>
                <p className="text-base sm:text-lg font-black text-white mt-0.5 tracking-tight group-hover:text-amber-400">
                  {kpi.value}
                </p>
                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                  <span className="truncate">{kpi.subtext}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 shrink-0" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
