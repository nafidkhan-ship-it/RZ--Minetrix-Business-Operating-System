import React, { useState } from 'react';
import { SYSTEM_OVERVIEW } from '../data/blueprintData';
import {
  ShieldCheck,
  CheckCircle2,
  Layers,
  Cpu,
  ArrowRight,
  ArrowUpRight,
  Pickaxe,
  Factory,
  Truck,
  Briefcase,
  ShoppingCart,
  Tractor,
  MapPin,
  MessageSquare,
  CalendarCheck,
  KeyRound,
  LayoutGrid,
  GitBranch,
  BrainCircuit,
  DollarSign,
  Users,
  Package,
  ShoppingBag,
  Target,
  FileText,
  Bell,
  Zap,
  BarChart3,
  Webhook,
  Lock,
  Boxes,
  Sparkles,
  ChevronRight,
  Calculator
} from 'lucide-react';
import { SectionId } from '../types/architecture';

interface OverviewSectionProps {
  onNavigateSection?: (sectionId: SectionId) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ onNavigateSection }) => {
  const [activePlatformId, setActivePlatformId] = useState<string | null>(null);

  // The 10 Approved Connected Platforms
  const platforms = [
    {
      number: '01',
      id: 'quarry-management' as SectionId,
      name: 'Quarry Management',
      icon: Pickaxe,
      theme: 'amber',
      accentColor: 'text-amber-400',
      borderAccent: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      tagBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      description:
        'Complete quarry operations, production, stone management, stock, dispatch, sales, workforce, equipment, expenses and reporting.',
      modulesPreview: 'Quarry • Production • Stock • Dispatch • Sales • Workforce • Equipment',
      modules: ['Quarry', 'Production', 'Stock', 'Dispatch', 'Sales', 'Workforce', 'Equipment']
    },
    {
      number: '02',
      id: 'crusher-management' as SectionId,
      name: 'Crusher Management',
      icon: Factory,
      theme: 'cyan',
      accentColor: 'text-cyan-400',
      borderAccent: 'hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
      tagBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      description:
        'Complete crusher and aggregate plant management including production, materials, stock, dispatch, maintenance, fuel, power and accounts.',
      modulesPreview: 'Plants • Production • M-Sand • P-Sand • Aggregates • Stock • Maintenance',
      modules: ['Plants', 'Production', 'M-Sand', 'P-Sand', 'Aggregates', 'Stock', 'Maintenance']
    },
    {
      number: '03',
      id: 'vehicle-management' as SectionId,
      name: 'Vehicle Management',
      icon: Truck,
      theme: 'blue',
      accentColor: 'text-blue-400',
      borderAccent: 'hover:border-blue-500/50',
      iconBg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
      tagBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
      description:
        'Fleet, vehicle, driver and trip management with fuel, maintenance, documents, service schedules and profitability.',
      modulesPreview: 'Vehicles • Drivers • Trips • Fuel • Maintenance • Documents • Tracking',
      modules: ['Vehicles', 'Drivers', 'Trips', 'Fuel', 'Maintenance', 'Documents', 'Tracking']
    },
    {
      number: '04',
      id: 'contract-job-management' as SectionId,
      name: 'Contract & Job Management',
      icon: Briefcase,
      theme: 'emerald',
      accentColor: 'text-emerald-400',
      borderAccent: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      tagBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      description:
        'Manage requirements, quotations, agreements, work orders, subcontractors, rentals, job progress, billing and profitability.',
      modulesPreview: 'Requirements • Quotations • Agreements • Jobs • Subcontract • Billing • Profitability',
      modules: ['Requirements', 'Quotations', 'Agreements', 'Jobs', 'Subcontract', 'Billing', 'Profitability']
    },
    {
      number: '05',
      id: 'building-materials-ecommerce' as SectionId,
      name: 'Building Materials E-Commerce',
      icon: ShoppingCart,
      theme: 'rose',
      accentColor: 'text-rose-400',
      borderAccent: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      tagBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      description:
        'Digital marketplace for building materials, suppliers, buyers, products, orders, delivery, payments and invoices.',
      modulesPreview: 'Products • Suppliers • Buyers • Orders • Delivery • Payments • Invoices',
      modules: ['Products', 'Suppliers', 'Buyers', 'Orders', 'Delivery', 'Payments', 'Invoices']
    },
    {
      number: '06',
      id: 'used-machinery-marketplace' as SectionId,
      name: 'Used Machinery & Vehicle Marketplace',
      icon: Tractor,
      theme: 'orange',
      accentColor: 'text-orange-400',
      borderAccent: 'hover:border-orange-500/50',
      iconBg: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
      tagBg: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
      description:
        'Buy, sell, exchange and rent used quarry machinery, crusher equipment, heavy equipment and commercial vehicles.',
      modulesPreview: 'Machines • Vehicles • Buy • Sell • Exchange • Rental • Inspection',
      modules: ['Machines', 'Vehicles', 'Buy', 'Sell', 'Exchange', 'Rental', 'Inspection']
    },
    {
      number: '07',
      id: 'quarry-land-management' as SectionId,
      name: 'Quarry Land Management',
      icon: MapPin,
      theme: 'lime',
      accentColor: 'text-lime-400',
      borderAccent: 'hover:border-lime-500/50',
      iconBg: 'bg-lime-500/10 text-lime-400 border border-lime-500/20',
      tagBg: 'bg-lime-500/10 text-lime-300 border-lime-500/20',
      description:
        'Connect quarry land owners with buyers, lessees and investors through land discovery, matching, enquiries and deal management.',
      modulesPreview: 'Land Owners • Land • Sale • Lease • Buyers • Investors • Deals',
      modules: ['Land Owners', 'Land', 'Sale', 'Lease', 'Buyers', 'Investors', 'Deals']
    },
    {
      number: '08',
      id: 'rz-chating' as SectionId,
      name: 'RZ® Chating',
      icon: MessageSquare,
      theme: 'violet',
      accentColor: 'text-violet-400',
      borderAccent: 'hover:border-violet-500/50',
      iconBg: 'bg-violet-500/10 text-violet-400 border border-violet-500/20',
      tagBg: 'bg-violet-500/10 text-violet-300 border-violet-500/20',
      description:
        'Connected communication platform for personal, business, staff, customers, suppliers, buyers, sellers and project groups.',
      modulesPreview: 'Personal • Business • Groups • Files • Voice • Video • Support',
      modules: ['Personal', 'Business', 'Groups', 'Files', 'Voice', 'Video', 'Support']
    },
    {
      number: '09',
      id: 'rz-ott' as SectionId,
      name: 'RZ® OTT',
      icon: CalendarCheck,
      theme: 'yellow',
      accentColor: 'text-yellow-400',
      borderAccent: 'hover:border-yellow-500/50',
      iconBg: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
      tagBg: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
      description:
        'Organise Today & Tomorrow — tasks, reminders, follow-ups, calendar, daily planning, notifications and automation.',
      modulesPreview: 'My Day • Tasks • Calendar • Reminders • Follow-ups • Automation • Reports',
      modules: ['My Day', 'Tasks', 'Calendar', 'Reminders', 'Follow-ups', 'Automation', 'Reports']
    },
    {
      number: '10',
      id: 'rz-calculator' as SectionId,
      name: 'RZ® Calculator — FREE',
      icon: Calculator,
      theme: 'lime',
      accentColor: 'text-lime-400',
      borderAccent: 'hover:border-lime-500/50',
      iconBg: 'bg-lime-500/10 text-lime-400 border border-lime-500/20',
      tagBg: 'bg-lime-500/10 text-lime-300 border-lime-500/20',
      description:
        'General, business, GST, finance, and RZ mining utility calculators for immediate operational decisions.',
      modulesPreview: 'General • GST • Finance • Vehicle • Mining • Productivity',
      modules: ['General', 'GST', 'Finance', 'Vehicle', 'Mining', 'Productivity']
    }
  ];

  // 15 Shared Backbone Services (NOT numbered as Platform 10)
  const backboneServices = [
    { name: 'RZ® Identity', desc: 'SSO, RBAC, Passkeys & Multi-tenant isolation', icon: KeyRound, target: 'auth-multi-tenant' as SectionId },
    { name: 'RZ® Grid', desc: 'High-speed spreadsheet bulk entry & sync studio', icon: LayoutGrid, target: 'rz-grid-studio' as SectionId },
    { name: 'RZ® Workflow', desc: 'Multi-step approval hierarchies & state machine', icon: GitBranch, target: 'workflow-approval-audit' as SectionId },
    { name: 'RZ® Intelligence', desc: 'Embedded AI forecasting, anomaly & vision bots', icon: BrainCircuit, target: 'ai-suite' as SectionId },
    { name: 'Finance & Accounts', desc: 'Double-entry GL, GST e-Way, accounts & P&L', icon: DollarSign, target: 'finance-suite' as SectionId },
    { name: 'HR & Employees', desc: 'Biometric shift roster, attendance & payroll', icon: Users, target: 'hrms-suite' as SectionId },
    { name: 'Inventory & Warehouse', desc: 'Multi-site stockpiles, bins & reorder levels', icon: Package, target: 'shared-core' as SectionId },
    { name: 'Procurement', desc: 'Vendor RFQs, purchase orders & gate receipts', icon: ShoppingBag, target: 'crm-suite' as SectionId },
    { name: 'Sales & CRM', desc: 'Lead pipeline, price sheets & customer portals', icon: Target, target: 'crm-suite' as SectionId },
    { name: 'Documents', desc: 'Encrypted DMS, leases, weigh-slips & e-Pass', icon: FileText, target: 'shared-masters-dms' as SectionId },
    { name: 'Notifications', desc: 'SMS, WhatsApp, web-push & operational alerts', icon: Bell, target: 'notification-communication-engine' as SectionId },
    { name: 'Automation', desc: 'Cross-platform triggers, cron jobs & rules engine', icon: Zap, target: 'automation-engine' as SectionId },
    { name: 'Reports & Analytics', desc: 'Unified BI dashboards, drill-downs & CSV/PDF', icon: BarChart3, target: 'dashboard-kpi-reporting' as SectionId },
    { name: 'API & Integrations', desc: 'REST, GraphQL, weighbridges, GPS & FASTag', icon: Webhook, target: 'api-gateway-integration-hub' as SectionId },
    { name: 'Security & Audit', desc: 'Immutable audit logs, encryption & SOC compliance', icon: Lock, target: 'security' as SectionId },
  ];

  const enterpriseComparisons = [
    { system: 'Microsoft Dynamics 365', benchmark: 'Modular Business Suite architecture & Common Data Model (CDM)' },
    { system: 'SAP S/4HANA', benchmark: 'Strict Double-entry General Ledger & Audit trail integrity' },
    { system: 'Oracle NetSuite', benchmark: 'Multi-tenant cloud scalability & Subsidiary multi-currency consolidation' },
    { system: 'Salesforce Core', benchmark: 'Flexible RBAC permissions & Event-driven pub/sub architecture' },
    { system: 'Odoo Enterprise', benchmark: 'Extensible app ecosystem with unified user experience' }
  ];

  const handleCardClick = (id: SectionId) => {
    setActivePlatformId(id);
    if (onNavigateSection) {
      onNavigateSection(id);
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Vision Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20 mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>Master Enterprise Operating Platform Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            RZ® Minetrix Business Operating System
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            {SYSTEM_OVERVIEW.tagline}. Designed as a unified multi-tenant SaaS cloud platform built to power thousands of enterprise accounts with zero duplicate business logic or redundant master data.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> One Platform, One Login
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 10 Connected Platforms
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> One Shared Backbone
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> RLS Multi-Tenant Data Isolation
            </span>
          </div>
        </div>
      </div>

      {/* ================================================== */}
      {/* RZ® MINETRIX ECOSYSTEM (FINAL 10-PLATFORM GRID)     */}
      {/* ================================================== */}
      <section className="space-y-6" id="rz-minetrix-ecosystem">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold mb-1">
              CONNECTED PLATFORM ARCHITECTURE
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              RZ® MINETRIX ECOSYSTEM
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              One Business Ecosystem. Ten Connected Platforms.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300">
              10 Primary Platforms
            </span>
          </div>
        </div>

        {/* Responsive Grid: 3 columns desktop, 2 columns tablet, 1 column mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {platforms.map((p) => {
            const Icon = p.icon;
            const isActive = activePlatformId === p.id;
            return (
              <div
                key={p.number}
                onClick={() => handleCardClick(p.id)}
                onMouseEnter={() => setActivePlatformId(p.id)}
                className={`group relative rounded-2xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 border-amber-500/70 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-400/30 -translate-y-1'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 hover:-translate-y-1 hover:shadow-xl'
                }`}
              >
                <div>
                  {/* Top Bar: Platform Number & Icon */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-xs font-mono font-black text-slate-500 group-hover:text-slate-300 transition-colors px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      PLATFORM {p.number}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${p.iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Platform Name */}
                  <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight mb-2 flex items-center justify-between">
                    <span>{p.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                  </h4>

                  {/* Short Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div>
                  {/* Modules Preview */}
                  <div className="pt-3 border-t border-slate-800/80 mb-4">
                    <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 font-semibold">
                      Modules Preview
                    </div>
                    <div className="text-[11px] font-medium text-slate-300 leading-relaxed">
                      {p.modulesPreview}
                    </div>
                  </div>

                  {/* Open Button / Clickable Card Action */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(p.id);
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-300 group-hover:bg-amber-500 group-hover:text-slate-950 border border-slate-800 group-hover:border-transparent'
                    }`}
                  >
                    <span>Open Platform</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================== */}
      {/* ECOSYSTEM RELATIONSHIP VISUAL                      */}
      {/* ================================================== */}
      <section className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-mono uppercase tracking-widest font-bold border border-amber-500/20">
            ARCHITECTURE TOPOLOGY
          </span>
          <h4 className="text-xl sm:text-2xl font-black text-white mt-2">
            Ecosystem Relationship
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            How the 10 primary platforms synchronize over a single unified backbone.
          </p>
        </div>

        {/* Visual Clean Topology Diagram */}
        <div className="max-w-4xl mx-auto">
          {/* Top Level: RZ MINETRIX */}
          <div className="flex flex-col items-center">
            <div className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-sm tracking-wider shadow-xl shadow-amber-500/20 border border-amber-300 flex items-center gap-2">
              <Boxes className="w-4 h-4" />
              <span>RZ® MINETRIX</span>
            </div>
            {/* Vertical Line */}
            <div className="w-0.5 h-6 bg-amber-500/60" />
            {/* Split Bar */}
            <div className="w-full max-w-2xl h-0.5 bg-slate-700 relative">
              <div className="absolute left-0 top-0 w-0.5 h-6 bg-slate-700" />
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-6 bg-amber-500/60" />
              <div className="absolute right-0 top-0 w-0.5 h-6 bg-slate-700" />
            </div>
          </div>

          {/* 3 Middle Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {/* Pillar 1: Business Operations */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold mb-3 border border-blue-500/20">
                <Pickaxe className="w-3.5 h-3.5" />
                <span>Business Operations</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-medium">
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">Quarry</li>
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">Crusher</li>
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">Vehicle</li>
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">Contract & Jobs</li>
              </ul>
            </div>

            {/* Pillar 2: Marketplace & Commerce */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-bold mb-3 border border-rose-500/20">
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Marketplace & Commerce</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-medium">
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">Building Materials</li>
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">Used Market</li>
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">Quarry Land</li>
              </ul>
            </div>

            {/* Pillar 3: Digital Platforms */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-xs font-bold mb-3 border border-violet-500/20">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Digital Platforms</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 font-medium">
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">RZ® Chat</li>
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">RZ® OTT</li>
                <li className="py-1 px-2 rounded-lg bg-slate-900 border border-slate-800/80">RZ® Calculator</li>
              </ul>
            </div>
          </div>

          {/* Converging Lines */}
          <div className="flex flex-col items-center mt-6">
            <div className="w-full max-w-2xl h-0.5 bg-slate-700 relative">
              <div className="absolute left-0 bottom-0 w-0.5 h-6 bg-slate-700" />
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-6 bg-amber-500/60" />
              <div className="absolute right-0 bottom-0 w-0.5 h-6 bg-slate-700" />
            </div>
            <div className="w-0.5 h-6 bg-amber-500/60" />

            {/* Foundation Bottom: SHARED BACKBONE */}
            <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-center shadow-lg">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-amber-400 text-xs font-bold border border-slate-700 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SHARED BACKBONE</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-mono leading-relaxed max-w-2xl mx-auto">
                Identity • Grid • Workflow • Finance • HR • Inventory • CRM • Documents • Notifications • Automation • API • Security • Analytics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================== */}
      {/* SHARED BACKBONE (NOT A 10th PLATFORM)              */}
      {/* ================================================== */}
      <section className="space-y-6" id="shared-backbone-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-1">
              FOUNDATION SERVICES
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              SHARED BACKBONE
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              One shared foundation powering the entire RZ® ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
              15 Universal Shared Services
            </span>
          </div>
        </div>

        {/* 15 Compact Service Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {backboneServices.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigateSection && onNavigateSection(srv.target)}
                className="group p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 group-hover:border-amber-500/30 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h5 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {srv.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-snug">
                    {srv.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 group-hover:text-amber-400">
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enterprise Architectural Guarantees */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" /> Enterprise Architectural Guarantees
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SYSTEM_OVERVIEW.principles.map((p, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
              <h4 className="font-bold text-amber-400 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {p.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* World-Class Enterprise SaaS Benchmarks */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" /> World-Class Enterprise SaaS Benchmarks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {enterpriseComparisons.map((c, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <div className="font-bold text-white flex items-center justify-between">
                <span>{c.system}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <p className="text-slate-400 mt-1.5">{c.benchmark}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
