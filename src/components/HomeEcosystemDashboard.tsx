import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Pickaxe,
  Truck,
  GitFork,
  ShoppingBag,
  Clock,
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  Activity,
  Plus,
  ArrowUpRight,
  Sparkles,
  Search,
  Filter,
  Users,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Phone,
  RefreshCw,
  Package,
  Wrench,
  HelpCircle,
  AlertCircle,
  Calculator,
  MessageSquare,
  Landmark
} from 'lucide-react';
import { SectionId } from '../types/architecture';
import { authService } from '../services/authService';
import { QuickActionModal, QuickActionType } from './QuickActionModal';
import { LateriteStoneOrderModal } from './LateriteStoneOrderModal';
import { UserRole } from '../types/auth';
import { ALL_DEMO_ROLES, getRoleDefinition } from '../types/rbac';

interface HomeEcosystemDashboardProps {
  onNavigateSection: (sectionId: SectionId, options?: { commerceSubpage?: string; openWizard?: boolean }) => void;
  onOpenQuickAction?: (actionType?: QuickActionType) => void;
}

export const HomeEcosystemDashboard: React.FC<HomeEcosystemDashboardProps> = ({
  onNavigateSection,
  onOpenQuickAction
}) => {
  const currentProfile = authService.getProfile();
  const [selectedOrg, setSelectedOrg] = useState('org-main');
  const [activeDateFilter, setActiveDateFilter] = useState<'TODAY' | 'WEEK' | 'MONTH'>('TODAY');
  const [quickActionModalOpen, setQuickActionModalOpen] = useState(false);
  const [lateriteModalOpen, setLateriteModalOpen] = useState(false);
  const [selectedQuickActionType, setSelectedQuickActionType] = useState<QuickActionType>('TASK');
  const [activeRoleContext, setActiveRoleContext] = useState<UserRole>(currentProfile.role || 'OWNER');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTriggerQuickAction = (type: QuickActionType) => {
    if (type === 'LATERITE_ORDER') {
      setLateriteModalOpen(true);
      return;
    }
    setSelectedQuickActionType(type);
    setQuickActionModalOpen(true);
  };

  // Organizations list for selector
  const ORGANIZATIONS = [
    { id: 'org-main', name: 'RZ Minetrix Global HQ', subtitle: 'Consolidated Operations (All Units)' },
    { id: 'org-kasaragod', name: 'Kasaragod Concession Pit #01', subtitle: 'Laterite Stone Quarry & Extraction' },
    { id: 'org-wayanad', name: 'Wayanad VSI Crusher Plant #03', subtitle: 'Aggregates & M-Sand Crushing' },
    { id: 'org-mangalore', name: 'Mangalore Logistics Fleet Hub', subtitle: 'Tipper & Trailer Transport Depot' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={quickActionModalOpen}
        onClose={() => setQuickActionModalOpen(false)}
        defaultAction={selectedQuickActionType}
        onNavigate={onNavigateSection}
      />

      {/* Laterite Stone Order Modal */}
      <LateriteStoneOrderModal
        isOpen={lateriteModalOpen}
        onClose={() => setLateriteModalOpen(false)}
        onSuccess={(orderId) => {
          showToast(`Laterite Stone Order ${orderId} created & synced to RZ® OTT!`);
        }}
      />

      {/* 1. WELCOME / ORGANIZATION SELECTOR & ECOSYSTEM HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold font-mono tracking-wider uppercase">
                RZ® Minetrix BOS Ecosystem
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                10 Platforms Active
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-[10px] font-mono">
                Live Sync
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                Demo / Sample Data Mode &bull; Production DB Ready
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome back, {currentProfile.fullName || 'Nafid Khan'}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl">
              Enterprise Business Operating System commanding Quarry, Crusher, Logistics, Contracts, Building Commerce, Used Marketplace, Land, RZ® Chat, RZ® OTT — Organise Today &amp; Tomorrow, and RZ® Calculator (FREE).
            </p>
          </div>

          {/* Org Selector & Time Period */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 w-full lg:w-auto">
            <div className="w-full sm:w-64 bg-slate-950 border border-slate-800 rounded-2xl p-2 flex items-center gap-2 shadow-inner">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
              <select
                value={selectedOrg}
                onChange={(e) => {
                  setSelectedOrg(e.target.value);
                  showToast(`Switched active operational unit to ${ORGANIZATIONS.find(o => o.id === e.target.value)?.name}`);
                }}
                className="w-full bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
              >
                {ORGANIZATIONS.map(org => (
                  <option key={org.id} value={org.id} className="bg-slate-900 text-white">
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
              <button
                onClick={() => setActiveDateFilter('TODAY')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeDateFilter === 'TODAY'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActiveDateFilter('WEEK')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeDateFilter === 'WEEK'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                This Week
              </button>
              <button
                onClick={() => setActiveDateFilter('MONTH')}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  activeDateFilter === 'MONTH'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                This Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* LATERITE STONE — PRIORITY CTA (MANDATORY REQUIREMENT 5) */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 p-5 sm:p-7 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Priority Commercial Flow &bull; Direct Quarry Dispatches
              </span>
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" /> 100% Certified Quarries
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              ORDER LATERITE STONE
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Order laterite stone directly from verified suppliers. Configurable product specs, standard 30×20×15 cm, wire-cut architectural finish, and foundation jumbo blocks with automated RZ® OTT dispatch synchronization.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={() => onNavigateSection('building-materials-ecommerce', { openWizard: true })}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 cursor-pointer transition transform hover:scale-[1.02]"
            >
              <Layers className="w-4 h-4" />
              <span>ORDER LATERITE STONE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateSection('building-materials-ecommerce', { commerceSubpage: 'laterite-stone' })}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <span>VIEW LATERITE STONE</span>
            </button>
          </div>
        </div>
      </div>

      {/* 10 PRIMARY PLATFORMS OF RZ MINETRIX */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                Core Ecosystem
              </span>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                10 Primary Platforms
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Unified Business Operating System &bull; Marketplace &bull; Communication &bull; Productivity
            </p>
          </div>
          <button
            onClick={() => onNavigateSection('shared-erp-core')}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Shared ERP Core</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            {
              id: 'quarry-management' as SectionId,
              num: '1',
              title: 'Quarry Management',
              sub: 'Extraction & Cutting',
              icon: Pickaxe,
              color: 'text-amber-400',
              border: 'hover:border-amber-500/50',
              bg: 'bg-amber-500/5'
            },
            {
              id: 'crusher-management' as SectionId,
              num: '2',
              title: 'Crusher Management',
              sub: 'Aggregates & M-Sand',
              icon: Building2,
              color: 'text-cyan-400',
              border: 'hover:border-cyan-500/50',
              bg: 'bg-cyan-500/5'
            },
            {
              id: 'vehicle-management' as SectionId,
              num: '3',
              title: 'Vehicle Management',
              sub: 'Fleet & GPS Telematics',
              icon: Truck,
              color: 'text-blue-400',
              border: 'hover:border-blue-500/50',
              bg: 'bg-blue-500/5'
            },
            {
              id: 'contract-job-management' as SectionId,
              num: '4',
              title: 'Contract & Job',
              sub: 'Work Orders & Rentals',
              icon: GitFork,
              color: 'text-emerald-400',
              border: 'hover:border-emerald-500/50',
              bg: 'bg-emerald-500/5'
            },
            {
              id: 'building-materials-ecommerce' as SectionId,
              num: '5',
              title: 'Materials E-Commerce',
              sub: 'Laterite, Sand & Blocks',
              icon: ShoppingBag,
              color: 'text-rose-400',
              border: 'hover:border-rose-500/50',
              bg: 'bg-rose-500/5'
            },
            {
              id: 'used-machinery-marketplace' as SectionId,
              num: '6',
              title: 'Used Machinery',
              sub: 'Buy & Sell Equipment',
              icon: Package,
              color: 'text-orange-400',
              border: 'hover:border-orange-500/50',
              bg: 'bg-orange-500/5'
            },
            {
              id: 'quarry-land-management' as SectionId,
              num: '7',
              title: 'Quarry Land',
              sub: 'Lease & Investor Deals',
              icon: Landmark,
              color: 'text-purple-400',
              border: 'hover:border-purple-500/50',
              bg: 'bg-purple-500/5'
            },
            {
              id: 'rz-chating' as SectionId,
              num: '8',
              title: 'RZ® Chat',
              sub: 'Messaging & Calls',
              icon: MessageSquare,
              color: 'text-emerald-400',
              border: 'hover:border-emerald-500/50',
              bg: 'bg-emerald-500/5'
            },
            {
              id: 'rz-ott' as SectionId,
              num: '9',
              title: 'RZ® OTT',
              sub: 'Tasks & Reminders',
              icon: Clock,
              color: 'text-amber-400',
              border: 'hover:border-amber-500/50',
              bg: 'bg-amber-500/5',
              badge: 'Universal'
            },
            {
              id: 'rz-calculator' as SectionId,
              num: '10',
              title: 'RZ® Calculator',
              sub: 'Mining, GST & Finance',
              icon: Calculator,
              color: 'text-yellow-400',
              border: 'hover:border-yellow-500/50',
              bg: 'bg-yellow-500/5',
              badge: 'FREE'
            }
          ].map((platform) => {
            const Icon = platform.icon;
            return (
              <button
                key={platform.id}
                onClick={() => onNavigateSection(platform.id)}
                className={`p-3.5 rounded-2xl bg-slate-950 border border-slate-800 ${platform.border} flex flex-col items-start text-left justify-between gap-2.5 transition cursor-pointer group hover:bg-slate-900/80 shadow-sm`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-8 h-8 rounded-xl ${platform.bg} border border-slate-800 flex items-center justify-center ${platform.color} group-hover:scale-110 transition`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1">
                    {platform.badge && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono ${
                        platform.badge === 'FREE' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {platform.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-mono font-bold text-slate-500 group-hover:text-amber-400">
                      #{platform.num}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-400 transition leading-snug">
                    {platform.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    {platform.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* QUICK ACTIONS BAR (12 Primary BOS Actions + Prominent Laterite Order) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Quick Action Center
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Universal Create Triggers &bull; Synced with RZ® OTT</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
          {/* Prominent Laterite Stone Action */}
          <button
            onClick={() => setLateriteModalOpen(true)}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/25 via-amber-500/20 to-amber-500/10 border-2 border-amber-500/50 text-amber-300 font-black flex items-center justify-center text-center cursor-pointer shadow-lg shadow-amber-500/10 hover:bg-amber-500/30 active:scale-95 transition"
          >
            <span>+ Order Laterite Stone</span>
          </button>

          {[
            { label: '+ New Quarry', type: 'QUARRY' as QuickActionType, color: 'hover:border-amber-500 text-amber-400' },
            { label: '+ New Crusher', type: 'CRUSHER' as QuickActionType, color: 'hover:border-cyan-500 text-cyan-400' },
            { label: '+ New Vehicle', type: 'VEHICLE' as QuickActionType, color: 'hover:border-blue-500 text-blue-400' },
            { label: '+ New Job', type: 'JOB' as QuickActionType, color: 'hover:border-emerald-500 text-emerald-400' },
            { label: '+ New Order', type: 'ORDER' as QuickActionType, color: 'hover:border-rose-500 text-rose-400' },
            { label: '+ New Product', type: 'PRODUCT' as QuickActionType, color: 'hover:border-purple-500 text-purple-400' },
            { label: '+ New Customer', type: 'CUSTOMER' as QuickActionType, color: 'hover:border-cyan-500 text-cyan-400' },
            { label: '+ New Supplier', type: 'SUPPLIER' as QuickActionType, color: 'hover:border-blue-500 text-blue-400' },
            { label: '+ New Task', type: 'TASK' as QuickActionType, color: 'hover:border-amber-500 text-amber-400' },
            { label: '+ New Document', type: 'DOCUMENT' as QuickActionType, color: 'hover:border-indigo-500 text-indigo-400' },
            { label: '+ New Expense', type: 'EXPENSE' as QuickActionType, color: 'hover:border-red-500 text-red-400' },
            { label: '+ New Invoice', type: 'INVOICE' as QuickActionType, color: 'hover:border-emerald-500 text-emerald-400' },
          ].map((act, i) => (
            <button
              key={i}
              onClick={() => handleTriggerQuickAction(act.type)}
              className={`p-2.5 rounded-2xl bg-slate-950 border border-slate-800 font-bold transition flex items-center justify-center text-center cursor-pointer ${act.color} hover:bg-slate-800/80 active:scale-95`}
            >
              <span>{act.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ROLE-BASED DASHBOARD CONTEXT BAR & MODULES (REQUIREMENT 8) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  ROLE-BASED DASHBOARD WORKSPACE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                  {getRoleDefinition(activeRoleContext).title}
                </span>
              </div>
              <h3 className="text-base font-black text-white">
                {getRoleDefinition(activeRoleContext).title} Operations Hub
              </h3>
            </div>
          </div>

          {/* 24-Role Context Switcher for Instant Preview */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 shrink-0 font-medium">Switch Role View:</span>
            <select
              value={activeRoleContext}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setActiveRoleContext(newRole);
                showToast(`Loaded ${getRoleDefinition(newRole).title} Dashboard Workspace`);
              }}
              className="bg-slate-950 border border-slate-700 text-amber-400 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {ALL_DEMO_ROLES.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.title} ({r.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dynamic Role-Specific Modules defined in Section 8 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {/* CUSTOMER Modules */}
          {activeRoleContext === 'CUSTOMER' && (
            <>
              {[
                { label: 'Browse Materials', section: 'building-materials-ecommerce', icon: ShoppingBag, color: 'text-amber-400' },
                { label: 'Laterite Stone', section: 'building-materials-ecommerce', icon: Layers, color: 'text-amber-300 font-bold' },
                { label: 'Building Materials', section: 'building-materials-ecommerce', icon: Package, color: 'text-emerald-400' },
                { label: 'My Orders', section: 'building-materials-ecommerce', icon: ShoppingBag, color: 'text-cyan-400' },
                { label: 'Delivery Tracking', section: 'building-materials-ecommerce', icon: Truck, color: 'text-blue-400' },
                { label: 'Invoices & GST', section: 'finance-suite', icon: DollarSign, color: 'text-emerald-400' },
                { label: 'RZ® Chating', section: 'rz-chating', icon: Users, color: 'text-purple-400' },
                { label: 'RZ® OTT Tasks', section: 'rz-ott', icon: Clock, color: 'text-amber-400' }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigateSection(m.section as SectionId)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer group"
                  >
                    <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition`} />
                    <span className="text-[11px] text-slate-300 font-medium group-hover:text-white leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </>
          )}

          {/* BUYER Modules */}
          {activeRoleContext === 'BUYER' && (
            <>
              {[
                { label: 'Marketplace', section: 'used-machinery-marketplace', icon: ShoppingBag, color: 'text-orange-400' },
                { label: 'Search Machinery', section: 'used-machinery-marketplace', icon: Search, color: 'text-cyan-400' },
                { label: 'Listings', section: 'used-machinery-marketplace', icon: Package, color: 'text-emerald-400' },
                { label: 'Laterite Stone Order', section: 'building-materials-ecommerce', icon: Layers, color: 'text-amber-300 font-bold' },
                { label: 'Equipment Orders', section: 'used-machinery-marketplace', icon: ShoppingBag, color: 'text-blue-400' },
                { label: 'Enquiries & RFQs', section: 'used-machinery-marketplace', icon: Activity, color: 'text-purple-400' },
                { label: 'RZ® Chating', section: 'rz-chating', icon: Users, color: 'text-purple-400' },
                { label: 'RZ® OTT Tasks', section: 'rz-ott', icon: Clock, color: 'text-amber-400' }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (m.label === 'Laterite Stone Order') {
                        setLateriteModalOpen(true);
                      } else {
                        onNavigateSection(m.section as SectionId);
                      }
                    }}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer group"
                  >
                    <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition`} />
                    <span className="text-[11px] text-slate-300 font-medium group-hover:text-white leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </>
          )}

          {/* ACCOUNTANT Modules */}
          {activeRoleContext === 'ACCOUNTANT' && (
            <>
              {[
                { label: 'Finance Suite', section: 'finance-suite', icon: DollarSign, color: 'text-emerald-400' },
                { label: 'Invoices & GST', section: 'finance-suite', icon: FileText, color: 'text-blue-400' },
                { label: 'Payments', section: 'finance-suite', icon: DollarSign, color: 'text-amber-400' },
                { label: 'Receivables', section: 'finance-suite', icon: TrendingUp, color: 'text-rose-400' },
                { label: 'Payables', section: 'finance-suite', icon: Activity, color: 'text-yellow-400' },
                { label: 'Expenses', section: 'finance-suite', icon: FileText, color: 'text-red-400' },
                { label: 'General Ledger', section: 'finance-suite', icon: FileText, color: 'text-cyan-400' },
                { label: 'RZ® OTT Tasks', section: 'rz-ott', icon: Clock, color: 'text-amber-400' }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigateSection(m.section as SectionId)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer group"
                  >
                    <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition`} />
                    <span className="text-[11px] text-slate-300 font-medium group-hover:text-white leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </>
          )}

          {/* HR Modules */}
          {activeRoleContext === 'HR' && (
            <>
              {[
                { label: 'Employees', section: 'shared-hr-payroll', icon: Users, color: 'text-cyan-400' },
                { label: 'Attendance', section: 'shared-hr-payroll', icon: Activity, color: 'text-emerald-400' },
                { label: 'Leave', section: 'shared-hr-payroll', icon: Calendar, color: 'text-yellow-400' },
                { label: 'Payroll', section: 'shared-hr-payroll', icon: DollarSign, color: 'text-amber-400' },
                { label: 'Documents', section: 'shared-masters-dms', icon: FileText, color: 'text-indigo-400' },
                { label: 'RZ® Chating', section: 'rz-chating', icon: Users, color: 'text-purple-400' },
                { label: 'Compliance', section: 'shared-erp-compliance', icon: ShieldCheck, color: 'text-emerald-400' },
                { label: 'RZ® OTT Tasks', section: 'rz-ott', icon: Clock, color: 'text-amber-400' }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigateSection(m.section as SectionId)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer group"
                  >
                    <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition`} />
                    <span className="text-[11px] text-slate-300 font-medium group-hover:text-white leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </>
          )}

          {/* DRIVER Modules */}
          {activeRoleContext === 'DRIVER' && (
            <>
              {[
                { label: 'My Trips', section: 'vehicle-management', icon: Truck, color: 'text-blue-400 font-bold' },
                { label: 'Loads & Gate Pass', section: 'vehicle-management', icon: Package, color: 'text-cyan-400' },
                { label: 'Assigned Vehicle', section: 'vehicle-management', icon: Truck, color: 'text-emerald-400' },
                { label: 'Fuel Logs', section: 'vehicle-management', icon: Activity, color: 'text-amber-400' },
                { label: 'Documents', section: 'shared-masters-dms', icon: FileText, color: 'text-indigo-400' },
                { label: 'Delivery Tasks', section: 'rz-ott', icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'RZ® Chating', section: 'rz-chating', icon: Users, color: 'text-purple-400' },
                { label: 'RZ® OTT My Day', section: 'rz-ott', icon: Clock, color: 'text-amber-400' }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigateSection(m.section as SectionId)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer group"
                  >
                    <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition`} />
                    <span className="text-[11px] text-slate-300 font-medium group-hover:text-white leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </>
          )}

          {/* SUPERVISOR / OPERATOR / STORE / DISPATCH / OTHER ROLES */}
          {activeRoleContext !== 'CUSTOMER' && activeRoleContext !== 'BUYER' && activeRoleContext !== 'ACCOUNTANT' && activeRoleContext !== 'HR' && activeRoleContext !== 'DRIVER' && (
            <>
              {[
                { label: 'Quarry Extraction', section: 'quarry-management', icon: Pickaxe, color: 'text-amber-400' },
                { label: 'Crusher Plants', section: 'crusher-management', icon: Building2, color: 'text-cyan-400' },
                { label: 'Fleet & Trips', section: 'vehicle-management', icon: Truck, color: 'text-blue-400' },
                { label: 'Contract Jobs', section: 'contract-job-management', icon: GitFork, color: 'text-emerald-400' },
                { label: 'Materials E-Com', section: 'building-materials-ecommerce', icon: ShoppingBag, color: 'text-rose-400' },
                { label: 'Used Marketplace', section: 'used-machinery-marketplace', icon: Package, color: 'text-orange-400' },
                { label: 'Quarry Land', section: 'quarry-land-management', icon: Activity, color: 'text-lime-400' },
                { label: 'RZ® OTT — Tasks', section: 'rz-ott', icon: Clock, color: 'text-amber-400' }
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => onNavigateSection(m.section as SectionId)}
                    className="p-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer group"
                  >
                    <Icon className={`w-4 h-4 ${m.color} group-hover:scale-110 transition`} />
                    <span className="text-[11px] text-slate-300 font-medium group-hover:text-white leading-tight">{m.label}</span>
                  </button>
                );
              })}
            </>
          )}
        </div>
      </div>

      {/* 2. TODAY'S OVERVIEW KPI GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg relative overflow-hidden">
          <div className="text-slate-400 text-xs font-medium">Daily Gross Sales</div>
          <div className="text-2xl font-black text-white font-mono mt-1">₹4.82 L</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" />
            <span>+14.2% vs yesterday</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Dispatches: 24 Loads</div>
        </div>

        <div className="p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg">
          <div className="text-slate-400 text-xs font-medium">Daily Production Yield</div>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">1,840 Tons</div>
          <div className="text-[11px] text-cyan-300 mt-1 flex items-center gap-1">
            <span>Aggregates + 4,200 Cut Stones</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across 4 Active Pits & Plants</div>
        </div>

        <div className="p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg">
          <div className="text-slate-400 text-xs font-medium">Logistics & Fleet Active</div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">32 / 38 Trips</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>94% On-Time Delivery</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Fuel Burn: 840 L Diesel</div>
        </div>

        <div className="p-4 sm:p-5 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg">
          <div className="text-slate-400 text-xs font-medium">Outstanding Receivables</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">₹34.6 L</div>
          <div className="text-[11px] text-amber-300 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>6 Invoices Overdue</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Payables: ₹12.4 L</div>
        </div>
      </div>

      {/* 3. PENDING ACTIONS, OTT TASKS, APPROVALS & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Approvals, Pending Actions & Production Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Approvals Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Pending Executive Approvals</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold font-mono">
                  3 Pending
                </span>
              </div>
              <button
                onClick={() => onNavigateSection('shared-erp-workflow')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Workflow Engine</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {[
                {
                  id: 'APPR-101',
                  title: 'Royalty Settlement for Laterite Pit Section 4B (₹2,10,000)',
                  entity: 'Mining Concession Lease #KL-920 &bull; Kasaragod District',
                  due: 'Today 5:00 PM',
                  priority: 'HIGH'
                },
                {
                  id: 'APPR-102',
                  title: 'Emergency Cone Crusher Bearing Replacement PO (₹78,500)',
                  entity: 'Wayanad VSI Plant &bull; Supplier: Sandvik Mining Spare Parts',
                  due: 'Within 2 hours',
                  priority: 'URGENT'
                },
                {
                  id: 'APPR-103',
                  title: 'Credit Limit Extension: Calicut Express Highway Subcontractor',
                  entity: 'Credit Limit increase from ₹15L to ₹25L for 20mm aggregates',
                  due: 'Tomorrow',
                  priority: 'NORMAL'
                }
              ].map((appr) => (
                <div
                  key={appr.id}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{appr.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        appr.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' :
                        appr.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {appr.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400" dangerouslySetInnerHTML={{ __html: appr.entity }} />
                    <div className="text-[10px] text-slate-500">Deadline: {appr.due}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => showToast(`Approved ${appr.id}`)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/30 text-xs transition cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => showToast(`Rejected ${appr.id}`)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Production & Dispatch Operations Summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Extraction & Crusher Production</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateSection('quarry-management')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>Quarry Platform</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
                <span className="text-slate-600">&bull;</span>
                <button
                  onClick={() => onNavigateSection('crusher-management')}
                  className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Crusher Platform</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold">Laterite Quarry #1</span>
                  <Pickaxe className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-lg font-black text-white font-mono mt-1.5">3,200 Stones</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">2 Cutting Machines Active</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Grade-A Building Block Stock: 14,800</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold">VSI Crusher Plant</span>
                  <Building2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-lg font-black text-white font-mono mt-1.5">1,240 Tons</div>
                <div className="text-[10px] text-cyan-400 font-semibold mt-1">M-Sand & P-Sand Line Active</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Silo Capacity: 74% Occupied</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-semibold">Weighbridge Outbound</span>
                  <Truck className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-lg font-black text-white font-mono mt-1.5">28 Gate Passes</div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1">Digital QR Signed</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Zero Overloading Infractions</div>
              </div>
            </div>
          </div>

          {/* Vehicle, Job & Marketplace Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            {/* Vehicle Activity */}
            <div
              onClick={() => onNavigateSection('vehicle-management')}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-blue-400" />
                  <span>Fleet Activity</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">32 Vehicles Running</div>
                <div className="text-[11px] text-slate-400">2 In Maintenance &bull; 4 Idle In Depot</div>
                <div className="text-[10px] text-blue-400 mt-1 font-semibold">GPS Telematics 100% Signal</div>
              </div>
            </div>

            {/* Job Activity */}
            <div
              onClick={() => onNavigateSection('contract-job-management')}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 text-emerald-400" />
                  <span>Job & Contract</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">8 Active Contracts</div>
                <div className="text-[11px] text-slate-400">2 Work Orders awaiting completion</div>
                <div className="text-[10px] text-emerald-400 mt-1 font-semibold">Margin: +26.4% on Projects</div>
              </div>
            </div>

            {/* Marketplace & Commerce */}
            <div
              onClick={() => onNavigateSection('building-materials-ecommerce')}
              className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition cursor-pointer group shadow-lg"
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-rose-400" />
                  <span>Marketplace</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-rose-400 transition" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">14 Inbound Inquiries</div>
                <div className="text-[11px] text-slate-400">3 Heavy Equipment Deals pending</div>
                <div className="text-[10px] text-rose-400 mt-1 font-semibold">₹18.2 L Marketplace Volume</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: OTT Tasks, Follow-ups, Expiring Docs & Service Due */}
        <div className="space-y-6">
          {/* RZ® OTT Today Tasks Widget */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">RZ® OTT Tasks & Reminders</h3>
                  <div className="text-[10px] text-slate-400">Organise Today & Tomorrow</div>
                </div>
              </div>
              <button
                onClick={() => onNavigateSection('rz-ott')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>My Day</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { title: 'Statutory Mining Lease Compliance Audit Report', priority: 'High', due: 'Today 4:00 PM', tag: 'Regulatory' },
                { title: 'Follow-up with Malabar Builders for M-Sand Contract PO', priority: 'Urgent', due: 'Today 11:30 AM', tag: 'Sales' },
                { title: 'Authorize Diesel Tanker unloading (12,000 Litres)', priority: 'Medium', due: '2:00 PM', tag: 'Fuel' },
                { title: 'Verify Hydraulic Pump Pressure Log for CAT 320D', priority: 'Normal', due: 'Tomorrow', tag: 'Maintenance' },
              ].map((task, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white text-xs">{task.title}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Due: {task.due}</span>
                    <span className="text-slate-500">#{task.tag}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleTriggerQuickAction('TASK')}
              className="w-full mt-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700/50 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add OTT Task / Reminder</span>
            </button>
          </div>

          {/* Expiring Documents & Service Due Alerts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Statutory Expiry & Service Due</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                4 Urgent
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span>Tipper KL-11-BH-4401 National Permit</span>
                  <span className="text-[10px]">Expires in 4 Days</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  RTO Renewal fee: ₹4,800. Auto-assigned to Fleet Manager.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-red-500/5 border border-red-500/20">
                <div className="flex items-center justify-between text-red-400 font-bold">
                  <span>Excavator Komatsu PC210 Service</span>
                  <span className="text-[10px]">Overdue by 18 Hours</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  500hr Engine Oil & Filter Change mandatory.
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center justify-between text-blue-400 font-bold">
                  <span>Quarry Environmental Clearance (EC)</span>
                  <span className="text-[10px]">Renewal in 28 Days</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Kasaragod Laterite Pit EC compliance audit filing due.
                </div>
              </div>
            </div>
          </div>

          {/* Follow-up Queue */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Commercial Follow-ups</h3>
              </div>
              <button
                onClick={() => handleTriggerQuickAction('FOLLOW_UP')}
                className="text-[11px] text-purple-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Follow-up</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Kalyan Infrastructure (₹8.5L Outstanding)</div>
                  <div className="text-[10px] text-slate-400">Promise to pay by 3:00 PM via NEFT</div>
                </div>
                <button
                  onClick={() => showToast('Calling Kalyan Infra contact...')}
                  className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
                >
                  <Phone className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Sobha Developers (20mm Supply Contract)</div>
                  <div className="text-[10px] text-slate-400">Quotation sent. Finalize pricing per metric ton.</div>
                </div>
                <button
                  onClick={() => onNavigateSection('rz-chating')}
                  className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
