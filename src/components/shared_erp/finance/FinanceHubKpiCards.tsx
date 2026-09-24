import React from 'react';
import {
  Wallet,
  Landmark,
  TrendingUp,
  CreditCard,
  Users,
  Building2,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Layers
} from 'lucide-react';
import { FINANCE_KPI_SUMMARY } from './financeMockData';

interface FinanceHubKpiCardsProps {
  onCardClick?: (tabId: string) => void;
}

export const FinanceHubKpiCards: React.FC<FinanceHubKpiCardsProps> = ({ onCardClick }) => {
  const cards = [
    {
      id: 'cash',
      label: 'Cash Balance',
      value: `₹${FINANCE_KPI_SUMMARY.cashBalance.toLocaleString('en-IN')}`,
      sub: 'Pithead drawer & site cash float',
      icon: Wallet,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40',
      targetTab: 'cash'
    },
    {
      id: 'banks',
      label: 'Bank Balance',
      value: `₹${FINANCE_KPI_SUMMARY.bankBalance.toLocaleString('en-IN')}`,
      sub: 'Across 3 Active Bank Accounts',
      icon: Landmark,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40',
      targetTab: 'banks'
    },
    {
      id: 'receivables',
      label: 'Receivables',
      value: `₹${FINANCE_KPI_SUMMARY.receivables.toLocaleString('en-IN')}`,
      sub: '5 Active Customer Accounts',
      icon: TrendingUp,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20 hover:border-cyan-500/40',
      targetTab: 'debtors'
    },
    {
      id: 'payables',
      label: 'Payables',
      value: `₹${FINANCE_KPI_SUMMARY.payables.toLocaleString('en-IN')}`,
      sub: 'Fuel, Spares & Land Concession',
      icon: CreditCard,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40',
      targetTab: 'creditors'
    },
    {
      id: 'cust-adv',
      label: 'Customer Advances',
      value: `₹${FINANCE_KPI_SUMMARY.customerAdvances.toLocaleString('en-IN')}`,
      sub: 'Laterite & aggregate bookings',
      icon: Users,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40',
      targetTab: 'debtors'
    },
    {
      id: 'supp-adv',
      label: 'Supplier Advances',
      value: `₹${FINANCE_KPI_SUMMARY.supplierAdvances.toLocaleString('en-IN')}`,
      sub: 'Explosives depot & BPCL bowser',
      icon: Building2,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/40',
      targetTab: 'creditors'
    },
    {
      id: 'staff-adv',
      label: 'Staff Advances',
      value: `₹${FINANCE_KPI_SUMMARY.staffAdvances.toLocaleString('en-IN')}`,
      sub: '4 staff medical/personal loans',
      icon: DollarSign,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10 border-yellow-500/20 hover:border-yellow-500/40',
      targetTab: 'staff-advances'
    },
    {
      id: 'partner-pay',
      label: 'Partner/Owner Payables',
      value: `₹${FINANCE_KPI_SUMMARY.partnerOwnerPayables.toLocaleString('en-IN')}`,
      sub: 'Equity draw & Tipper settlements',
      icon: Layers,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40',
      targetTab: 'settlements'
    },
    {
      id: 'today-payin',
      label: "Today's Pay-In",
      value: `₹${FINANCE_KPI_SUMMARY.todayPayIn.toLocaleString('en-IN')}`,
      sub: 'Weighbridge counter & NEFT receipts',
      icon: ArrowDownLeft,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40',
      targetTab: 'pay-in'
    },
    {
      id: 'today-payout',
      label: "Today's Pay-Out",
      value: `₹${FINANCE_KPI_SUMMARY.todayPayOut.toLocaleString('en-IN')}`,
      sub: 'Diesel bowser, driver batta & spares',
      icon: ArrowUpRight,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40',
      targetTab: 'pay-out'
    },
    {
      id: 'net-cashflow',
      label: 'Net Cash Flow',
      value: `+₹${FINANCE_KPI_SUMMARY.netCashFlow.toLocaleString('en-IN')}`,
      sub: "Today's liquidity surplus realized",
      icon: Receipt,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20 hover:border-teal-500/40',
      targetTab: 'cash'
    }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            11 Core Financial KPI Cards
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
            STUDIO PREVIEW / DEMO DATA
          </span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Click any card to jump directly to corresponding ledger
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              onClick={() => onCardClick?.(c.targetTab)}
              className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${c.bg}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider line-clamp-1">
                  {c.label}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${c.color}`} />
              </div>
              <div className="mt-2">
                <span className={`text-base font-black tracking-tight ${c.color}`}>
                  {c.value}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                  {c.sub}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
