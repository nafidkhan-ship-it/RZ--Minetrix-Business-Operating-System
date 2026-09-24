import React, { useState, useEffect } from 'react';
import { SectionId } from '../types/architecture';
import {
  Shield,
  Cpu,
  Activity,
  FileText,
  Pickaxe,
  Sparkles,
  Truck,
  ShoppingBag,
  Globe,
  Landmark,
  Brain,
  Key,
  FolderTree,
  GitFork,
  Plug,
  Smartphone,
  MessageSquare,
  Clock,
  Building2,
  Award,
  Layers,
  Database,
  Download,
  CheckCircle2,
  LayoutDashboard,
  User,
  DollarSign,
  Users,
  Package,
  Zap,
  Bell,
  ShieldCheck,
  BarChart3,
  Sliders,
  TrendingUp,
  CreditCard,
  Search,
  Calculator,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  Plus
} from 'lucide-react';
import { RZLogo } from './RZLogo';
import { authService } from '../services/authService';

interface HeaderProps {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  onOpenDocModal: () => void;
  onOpenBrandingModal?: () => void;
  onOpenAuthModal?: () => void;
  onOpenSearchModal?: () => void;
  onOpenFlowsModal?: () => void;
  onOpenLateriteModal?: () => void;
  onOpenPlatformSwitcher?: () => void;
  onOpenQuickActions?: () => void;
  onOpenTester?: () => void;
  onToggleRolePreview?: () => void;
  isRolePreviewOpen?: boolean;
}

export interface MasterCategory {
  id: string;
  label: string;
  count?: number;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  isFoundation?: boolean;
  items: {
    id: SectionId;
    label: string;
    number?: string;
    subtitle?: string;
    icon: React.ComponentType<{ className?: string }>;
    tag?: string;
  }[];
}

// 4 Business Operations + 3 Marketplace & Commerce + 3 Digital Platforms = Exactly 10 Primary Platforms
// Shared ERP, Finance, Productivity & Admin features remain shared system modules
export const MASTER_ECOSYSTEM_STRUCTURE: MasterCategory[] = [
  {
    id: 'business-operations',
    label: 'Business Operations',
    count: 4,
    icon: Pickaxe,
    tag: 'BOS Core (4)',
    items: [
      {
        id: 'quarry-management',
        number: '1',
        label: 'Quarry Management',
        subtitle: 'Master, Production, Cutting, Stock, Dispatch, Sales, Reports',
        icon: Pickaxe
      },
      {
        id: 'crusher-management',
        number: '2',
        label: 'Crusher Management',
        subtitle: 'Master, Production, Aggregate, Stock, Dispatch, Maintenance, Reports',
        icon: Building2
      },
      {
        id: 'vehicle-management',
        number: '3',
        label: 'Vehicle Management',
        subtitle: 'Driver Management, Trip, Fuel, GPS Telematics, Profitability, Reports',
        icon: Truck
      },
      {
        id: 'contract-job-management',
        number: '4',
        label: 'Contract & Job Management',
        subtitle: 'Work Orders, Subcontractors, Rental Fleet, Billing, Profitability',
        icon: GitFork
      }
    ]
  },
  {
    id: 'marketplace',
    label: 'Marketplace & Commerce',
    count: 3,
    icon: Globe,
    tag: 'Commerce (3)',
    items: [
      {
        id: 'building-materials-ecommerce',
        number: '5',
        label: 'Building Materials E-Commerce',
        subtitle: 'Laterite, Aggregates, M-Sand, Blocks, Cement, Orders & Delivery',
        icon: ShoppingBag
      },
      {
        id: 'used-machinery-marketplace',
        number: '6',
        label: 'Used Machinery & Vehicle Marketplace',
        subtitle: 'Buy, Sell, Exchange, Heavy Equipment, Inspections & Deals',
        icon: Truck
      },
      {
        id: 'quarry-land-management',
        number: '7',
        label: 'Quarry Land Management',
        subtitle: 'Land Database, Sale, Lease, Investor Matching, Deal Assistance',
        icon: Landmark
      }
    ]
  },
  {
    id: 'digital-platforms',
    label: 'Digital Platforms',
    count: 3,
    icon: Smartphone,
    tag: 'Digital (3)',
    items: [
      {
        id: 'rz-chating',
        number: '8',
        label: 'RZ® Chat',
        subtitle: '1-to-1, Groups, Broadcast, Reels, Business Chat & OTT Bridge',
        icon: MessageSquare
      },
      {
        id: 'rz-ott',
        number: '9',
        label: 'RZ® OTT',
        subtitle: 'Organise Today & Tomorrow — Universal Task Management & Reminders',
        icon: Clock,
        tag: 'Universal OS'
      },
      {
        id: 'rz-calculator',
        number: '10',
        label: 'RZ® Calculator — FREE',
        subtitle: 'General, Business, GST, Finance & RZ Industry Mining Calculators',
        icon: Calculator,
        tag: 'FREE'
      }
    ]
  },
  {
    id: 'shared-backbone',
    label: 'Shared Backbone',
    count: 9,
    icon: Shield,
    tag: 'Shared Backbone Foundation',
    isFoundation: true,
    items: [
      { id: 'auth-multi-tenant', label: 'RZ Identity', subtitle: 'RZ Identity, SSO, Multi-Tenant Authentication', icon: Key },
      { id: 'enterprise-admin-phase26', label: 'Roles & Permissions', subtitle: 'RBAC, Tenant Scopes & Fine-Grained Permissions', icon: Users },
      { id: 'notification-communication-engine', label: 'Notifications', subtitle: 'Multi-Channel Push, SMS & WhatsApp Engine', icon: Bell },
      { id: 'api-gateway-integration-hub', label: 'API Gateway', subtitle: 'REST API, Webhooks & 3rd Party Integrations', icon: Plug },
      { id: 'automation-engine', label: 'Automation', subtitle: '22 BOS Event Triggers & Rule Dispatcher', icon: Zap },
      { id: 'security', label: 'Security & Audit', subtitle: 'Immutable Audit Trail & Regulatory Compliance', icon: ShieldCheck },
      { id: 'backend-foundation', label: 'Documents', subtitle: 'DMS, Contract Templates, Invoicing & Receipts', icon: FileText },
      { id: 'billing-subscription', label: 'Billing & Subscription', subtitle: 'Free, Pro, Business & Enterprise Tiers', icon: CreditCard },
      { id: 'usage-billing', label: 'Usage & Billing', subtitle: 'Weighbridge Passes, GPS, Storage & API Quotas', icon: BarChart3 },
      { id: 'rz-grid-studio', label: 'Grid Data Studio', subtitle: 'Rapid batch data grid & spreadsheet reconciliation', icon: LayoutDashboard }
    ]
  }
];

// The ONLY 9 Primary User-Facing Pillars
export interface EcosystemPillar {
  id: SectionId;
  pillarNumber: number;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  primaryColor: string;
}

export const ECOSYSTEM_PILLARS: EcosystemPillar[] = [
  {
    id: 'quarry-management',
    pillarNumber: 1,
    label: '1. Quarry Management',
    subtitle: 'Master, Production, Cutting, Stock, Dispatch, Sales, Reports',
    icon: Pickaxe,
    tag: 'Business Operations',
    primaryColor: 'text-amber-400'
  },
  {
    id: 'crusher-management',
    pillarNumber: 2,
    label: '2. Crusher Management',
    subtitle: 'Master, Production, Aggregate, Stock, Dispatch, Maintenance, Reports',
    icon: Building2,
    tag: 'Business Operations',
    primaryColor: 'text-cyan-400'
  },
  {
    id: 'vehicle-management',
    pillarNumber: 3,
    label: '3. Vehicle Management',
    subtitle: 'Driver, Trip, Fuel, GPS Telematics, Profitability, Reports',
    icon: Truck,
    tag: 'Business Operations',
    primaryColor: 'text-blue-400'
  },
  {
    id: 'contract-job-management',
    pillarNumber: 4,
    label: '4. Contract & Job Management',
    subtitle: 'Work Orders, Subcontractors, Rental Fleet, Billing, Profitability',
    icon: GitFork,
    tag: 'Business Operations',
    primaryColor: 'text-emerald-400'
  },
  {
    id: 'building-materials-ecommerce',
    pillarNumber: 5,
    label: '5. Building Materials E-Commerce',
    subtitle: 'Laterite, Aggregates, M-Sand, Blocks, Cement, Orders & Delivery',
    icon: ShoppingBag,
    tag: 'Marketplace & Commerce',
    primaryColor: 'text-amber-400'
  },
  {
    id: 'used-machinery-marketplace',
    pillarNumber: 6,
    label: '6. Used Machinery & Vehicle Marketplace',
    subtitle: 'Buy, Sell, Exchange, Heavy Equipment, Inspections & Deals',
    icon: Truck,
    tag: 'Marketplace & Commerce',
    primaryColor: 'text-blue-400'
  },
  {
    id: 'quarry-land-management',
    pillarNumber: 7,
    label: '7. Quarry Land Management',
    subtitle: 'Land Database, Sale, Lease, Investor Matching, Deal Assistance',
    icon: Landmark,
    tag: 'Marketplace & Commerce',
    primaryColor: 'text-purple-400'
  },
  {
    id: 'rz-chating',
    pillarNumber: 8,
    label: '8. RZ® Chat',
    subtitle: 'Personal & Business Chat, Groups, Voice, Video & OTT Task Creator',
    icon: MessageSquare,
    tag: 'Digital Platform',
    primaryColor: 'text-emerald-400'
  },
  {
    id: 'rz-ott',
    pillarNumber: 9,
    label: '9. RZ® OTT',
    subtitle: 'Organise Today & Tomorrow — Universal Task Management & Reminders',
    icon: Clock,
    tag: 'Digital Platform',
    primaryColor: 'text-amber-400'
  },
  {
    id: 'rz-calculator',
    pillarNumber: 10,
    label: '10. RZ® Calculator — FREE',
    subtitle: 'General, Business, GST, Finance & RZ Industry Mining Calculators',
    icon: Calculator,
    tag: '100% FREE',
    primaryColor: 'text-amber-400'
  }
];

export const SHARED_ERP_ITEMS: {
  id: SectionId;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}[] = [
  { id: 'shared-erp-hr', label: '1. People & Workforce', subtitle: 'Staff, Attendance, Payroll, Advances, Salary Slips & Batta', icon: Users, tag: 'Workforce' },
  { id: 'shared-erp-procurement', label: '2. Commerce & Trade', subtitle: 'Purchase, Sales, Orders, Customers, Suppliers, Rates, Billing, Gate Pass', icon: ShoppingBag, tag: 'Commerce' },
  { id: 'shared-erp-finance', label: '3. Finance & Accounts', subtitle: '8 KPIs, 10 Ledgers, Bank, Cash, Debtors, Creditors, Investors, Partners', icon: DollarSign, tag: '10 Ledgers' },
  { id: 'shared-erp-organization', label: '4. Organization & Workspace', subtitle: 'Company, Quotas, 24 Roles / 9 Permissions RBAC, Branches', icon: Building2, tag: 'Workspace' },
  { id: 'rz-productivity-suite', label: 'Productivity Suite', subtitle: 'RZ Sheet, Word, Form, Slide, Drive, PDF & Print', icon: Layers, tag: '7 Apps' },
  { id: 'shared-erp-inventory', label: 'Inventory & Silos', subtitle: 'Item Master, Stock Transfers & Valuation', icon: Package, tag: 'Stock' },
  { id: 'shared-erp-automation', label: 'Automation Engine', subtitle: '22 BOS Event Triggers & Rule Engine', icon: Zap, tag: '22 Events' },
  { id: 'shared-erp-documents', label: 'Documents DMS', subtitle: 'Contracts, Permits, Licenses & Expiry Engine', icon: FileText, tag: 'DMS Vault' },
  { id: 'shared-erp-workflow', label: 'Workflow Approvals', subtitle: 'Multi-Level Approval Rules & Signatures', icon: GitFork, tag: 'Approvals' },
  { id: 'shared-erp-notifications', label: 'Notifications Engine', subtitle: 'In-App, Push, SMS & WhatsApp Engine', icon: Bell, tag: 'Dispatch' },
  { id: 'shared-erp-security', label: 'Security & Audit', subtitle: 'Immutable Audit Trail & Regulatory Logs', icon: ShieldCheck, tag: 'Audit Logs' },
  { id: 'shared-erp-api', label: 'API & Webhooks', subtitle: 'REST API Endpoints & ERP Webhooks', icon: Plug, tag: 'REST' },
  { id: 'shared-erp-analytics', label: 'Analytics & BI', subtitle: 'Operational KPIs & BI Export Pack', icon: BarChart3, tag: 'BI' },
  { id: 'shared-erp-admin', label: 'Admin Center', subtitle: 'Tenant Provisioning & System Settings', icon: Sliders, tag: 'Admin' },
  { id: 'billing-subscription', label: 'Billing & Subscription', subtitle: 'Capacity Quotas, Usage & Enterprise Tiers', icon: CreditCard, tag: 'Quotas' },
];

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  onOpenDocModal,
  onOpenBrandingModal,
  onOpenAuthModal,
  onOpenSearchModal,
  onOpenFlowsModal,
  onOpenLateriteModal,
  onOpenPlatformSwitcher,
  onOpenQuickActions,
  onOpenTester,
  onToggleRolePreview,
  isRolePreviewOpen
}) => {
  const [navMode, setNavMode] = useState<'PILLARS' | 'SHARED_ERP' | 'MASTER' | 'BLUEPRINT' | 'DASHBOARD'>('PILLARS');
  const [activeMasterCat, setActiveMasterCat] = useState<string>('business-operations');
  const [currentProfile, setCurrentProfile] = useState(() => authService.getCurrentProfile());
  const [isPlatformMenuOpen, setIsPlatformMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    const unsub = authService.subscribe((profile) => {
      setCurrentProfile(profile);
    });
    return () => unsub();
  }, []);

  // Helper to determine if a section matches
  const isPillarActive = (pillarId: SectionId) => {
    if (activeSection === pillarId) return true;
    if (pillarId === 'quarry-management' && (activeSection === 'mining-operations-platform' || activeSection === 'mining-suite')) return true;
    if (pillarId === 'crusher-management' && (activeSection === 'materials-suite')) return true;
    if (pillarId === 'vehicle-management' && (activeSection === 'fleet-logistics-platform' || activeSection === 'fleet-suite')) return true;
    if (pillarId === 'contract-job-management' && activeSection === 'contract-job-management') return true;
    if (pillarId === 'building-materials-ecommerce' && (activeSection === 'enterprise-marketplace-phase21' || activeSection === 'marketplace-suite')) return true;
    if (pillarId === 'used-machinery-marketplace' && activeSection === 'ai-load-exchange-marketplace') return true;
    if (pillarId === 'quarry-land-management' && activeSection === 'quarry-land-management') return true;
    if (pillarId === 'rz-chating' && activeSection === 'rz-chat-phase29') return true;
    if (pillarId === 'rz-ott' && activeSection === 'ott-platform') return true;
    if (pillarId === 'rz-calculator' && activeSection === 'rz-calculator') return true;
    return false;
  };

  const isErpSectionActive = (id: SectionId) => {
    return activeSection === id;
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveSection('universal-dashboard')}
              className="text-left focus:outline-none cursor-pointer"
              title="Return to RZ MINETRIX Home"
            >
              <RZLogo variant="full" size="standard" showText={true} />
            </button>
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold font-mono">
              <span>10 PLATFORMS</span>
              <span className="text-slate-500">&bull;</span>
              <span>SHARED ERP CORE</span>
            </div>
            <div className="hidden xl:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              Free Public Access
            </div>
          </div>

          {/* Primary View Switcher: [ Dashboard ] [ 10 Platforms ] [ Shared ERP Core ] [ Master Ecosystem ] [ Blueprint ] */}
          <div className="flex items-center gap-2">
            {/* Prominent Quick Action: ORDER LATERITE STONE */}
            <button
              onClick={() => setActiveSection('building-materials-ecommerce')}
              className="hidden 2xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer animate-pulse"
              title="Direct Instant Booking for Dressed Laterite Stone"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>ORDER LATERITE STONE</span>
            </button>

            {/* Quick Actions Trigger (+ Quick Action) */}
            {onOpenQuickActions && (
              <button
                onClick={onOpenQuickActions}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer shadow-sm"
                title="Universal Quick Actions (+ New Quarry, Crusher, Vehicle, Order, Job, Invoice, Staff)"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Action</span>
              </button>
            )}

            {/* Platform Switcher Trigger (All 10 Platforms) */}
            {onOpenPlatformSwitcher && (
              <button
                onClick={onOpenPlatformSwitcher}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition cursor-pointer"
                title="Open All 10 Platforms Switcher"
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Platforms</span>
              </button>
            )}

            {/* Clickable Flows A–F Trigger */}
            {onOpenFlowsModal && (
              <button
                onClick={onOpenFlowsModal}
                className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold transition cursor-pointer"
                title="Interactive End-to-End User Journeys (Flows A–F)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Flows A–F</span>
              </button>
            )}

            {/* 20-Step Route Loop Trigger */}
            {onOpenTester && (
              <button
                onClick={onOpenTester}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-bold transition cursor-pointer"
                title="Launch 20-Step End-to-End Navigation Test Loop (Section AD)"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>20-Step Loop</span>
              </button>
            )}

            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shadow-inner">
              <button
                onClick={() => {
                  setActiveSection('universal-dashboard');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeSection === 'universal-dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Home</span>
              </button>

              <button
                onClick={() => setNavMode('PILLARS')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  navMode === 'PILLARS' && activeSection !== 'universal-dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>10 Platforms</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                  navMode === 'PILLARS' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
                }`}>
                  10
                </span>
              </button>

              <button
                onClick={() => {
                  setNavMode('SHARED_ERP');
                  setActiveSection('shared-erp-core');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  navMode === 'SHARED_ERP' && activeSection !== 'universal-dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Shared ERP Core</span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('shared-erp-organization');
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer hidden xl:flex items-center gap-1 ${
                  activeSection === 'shared-erp-organization'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Organization</span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('billing-subscription');
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer hidden xl:flex items-center gap-1 ${
                  activeSection === 'billing-subscription'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Subscription</span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('rz-productivity-suite');
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer hidden xl:flex items-center gap-1 ${
                  activeSection === 'rz-productivity-suite'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Productivity</span>
              </button>

              <button
                onClick={() => setNavMode('MASTER')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 hidden md:flex ${
                  navMode === 'MASTER' && activeSection !== 'universal-dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Ecosystem</span>
              </button>

              <button
                onClick={() => {
                  setNavMode('BLUEPRINT');
                  setActiveSection('master-blueprint');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 hidden lg:flex ${
                  navMode === 'BLUEPRINT' && activeSection !== 'universal-dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Blueprint</span>
              </button>
            </div>

            {/* Global Search Trigger */}
            {onOpenSearchModal && (
              <button
                onClick={onOpenSearchModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition cursor-pointer"
                title="Global Search across authorized items (Quarries, Crushers, Vehicles, Tasks, Orders)"
              >
                <Search className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-medium">Search</span>
              </button>
            )}

            {/* Role Preview Trigger */}
            {onToggleRolePreview && (
              <button
                onClick={onToggleRolePreview}
                className={`hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                  isRolePreviewOpen
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Toggle Role-Aware Persona Navigation Preview (Section AA)"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Roles</span>
              </button>
            )}

            {/* Auth / User Profile Trigger */}
            {onOpenAuthModal && (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs border border-slate-700 transition cursor-pointer group"
                title="Account, Personas & Security Settings"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 font-black flex items-center justify-center text-[10px] shadow-sm">
                  {currentProfile?.fullName?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-white font-bold leading-tight truncate max-w-[90px]">
                    {currentProfile?.fullName?.split(' ')[0] || 'User'}
                  </span>
                  <span className="text-[9px] text-amber-400 font-mono leading-none capitalize">
                    {currentProfile?.role?.toLowerCase().replace('_', ' ') || 'public'}
                  </span>
                </div>
              </button>
            )}

            {/* Branding Modal Trigger */}
            {onOpenBrandingModal && (
              <button
                onClick={onOpenBrandingModal}
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Branding</span>
              </button>
            )}

            {/* Blueprint Doc Trigger */}
            <button
              onClick={onOpenDocModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Blueprint Doc</span>
            </button>

            {/* Mobile Menu Drawer Toggle */}
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* NAVIGATION AREA */}
        {navMode === 'PILLARS' ? (
          /* 1. THE 10 PILLARS DIRECT RIBBON */
          <div className="border-t border-slate-800/80 py-2">
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-0.5">
              {/* Quick Dropdown: All 10 Platforms */}
              <div className="relative shrink-0">
                <button
                  onClick={() => setIsPlatformMenuOpen(!isPlatformMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>All 10 Platforms</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isPlatformMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPlatformMenuOpen && (
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-slate-900/98 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
                      <span className="font-bold text-white uppercase tracking-wider text-[11px]">10 Official Platforms</span>
                      <button
                        onClick={() => setIsPlatformMenuOpen(false)}
                        className="text-slate-400 hover:text-white p-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[70vh] overflow-y-auto">
                      {ECOSYSTEM_PILLARS.map((p) => {
                        const PIcon = p.icon;
                        const active = isPillarActive(p.id);
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              setActiveSection(p.id);
                              setIsPlatformMenuOpen(false);
                            }}
                            className={`flex items-start gap-2 p-2 rounded-xl text-left transition cursor-pointer ${
                              active ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-slate-800 text-slate-300'
                            }`}
                          >
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold mt-0.5 shrink-0 ${
                              active ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-amber-400'
                            }`}>
                              {p.pillarNumber}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs font-semibold truncate">{p.label.replace(/^\d+\.\s*/, '')}</div>
                              <div className={`text-[10px] truncate ${active ? 'text-slate-900' : 'text-slate-500'}`}>{p.subtitle}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {ECOSYSTEM_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                const isItemActive = isPillarActive(pillar.id);
                const isOtt = pillar.id === 'rz-ott' || pillar.id === 'ott-platform';

                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActiveSection(pillar.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border shrink-0 ${
                      isItemActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : isOtt
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-slate-950/50 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isItemActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
                      }`}
                    >
                      {pillar.pillarNumber}
                    </span>
                    <span>{pillar.label.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : navMode === 'SHARED_ERP' ? (
          /* 2. SHARED ERP CORE: 14 COMMON SERVICES RIBBON */
          <div className="border-t border-slate-800/80 py-2">
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-0.5 text-xs">
              {SHARED_ERP_ITEMS.map((item) => {
                const ItemIcon = item.icon;
                const isItemActive = isErpSectionActive(item.id) || (item.id === 'shared-erp-organization' && activeSection === 'shared-erp-core');

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer border shrink-0 ${
                      isItemActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-950/50 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <ItemIcon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        isItemActive ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : navMode === 'MASTER' ? (
          /* 3. MASTER ECOSYSTEM: Category Navigation + Active Category Items */
          <div className="border-t border-slate-800/80 py-2 space-y-2">
            {/* Category Navigation Bar */}
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 border-b border-slate-800/50">
              {MASTER_ECOSYSTEM_STRUCTURE.map((cat) => {
                const CatIcon = cat.icon;
                const isCatActive = activeMasterCat === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveMasterCat(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      isCatActive
                        ? cat.isFoundation
                          ? 'bg-slate-800 text-amber-300 border-amber-500/50 shadow-sm'
                          : 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-950/40 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isCatActive
                          ? cat.isFoundation
                            ? 'bg-slate-900 text-amber-300'
                            : 'bg-slate-950/20 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {cat.count}
                    </span>
                    {cat.isFoundation && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 uppercase font-mono tracking-wider ml-1">
                        Foundation
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Category Items */}
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-0.5">
              {MASTER_ECOSYSTEM_STRUCTURE.find((c) => c.id === activeMasterCat)?.items.map((item) => {
                const ItemIcon = item.icon;
                const isItemActive = isPillarActive(item.id);
                const isOtt = item.id === 'rz-ott' || item.id === 'ott-platform';

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer border shrink-0 ${
                      isItemActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                        : isOtt
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <ItemIcon className="w-3.5 h-3.5" />
                    {item.number && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isItemActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-amber-400'
                        }`}
                      >
                        {item.number}
                      </span>
                    )}
                    <span>{item.label}</span>
                    {item.tag && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                          isItemActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {item.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* 4. BLUEPRINT & ARCHITECTURE SUB-NAVIGATION */
          <div className="border-t border-slate-800/80 py-2">
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-0.5 text-xs">
              {[
                { id: 'master-blueprint', label: 'Master Blueprint', icon: Award },
                { id: 'overview', label: 'Vision & Ecosystem', icon: Sparkles },
                { id: 'architecture', label: 'System Architecture', icon: Layers },
                { id: 'database', label: 'Database & RLS', icon: Database },
                { id: 'events', label: 'Event Choreography', icon: Activity },
                { id: 'domains', label: '10 DDD Domains', icon: Cpu },
                { id: 'security', label: 'Security & Audit', icon: Shield },
                { id: 'structure', label: 'Folder & Roadmap', icon: FileText }
              ].map((item) => {
                const ItemIcon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as SectionId)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition cursor-pointer border ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                        : 'bg-slate-950/50 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <ItemIcon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE SLIDE-OVER DRAWER FOR ALL 10 PLATFORMS & ERP */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-5 space-y-5 shadow-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <RZLogo variant="full" size="small" showText={true} />
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Studio Preview Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono flex items-center justify-between">
                <span>Studio Preview &bull; Demo Data</span>
                <span className="font-bold text-emerald-400 text-[10px] uppercase">Active</span>
              </div>

              {/* Instant Action: ORDER LATERITE STONE */}
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  if (onOpenLateriteModal) {
                    onOpenLateriteModal();
                  } else {
                    setActiveSection('building-materials-ecommerce');
                  }
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ORDER LATERITE STONE</span>
              </button>

              {/* Flows A–F */}
              {onOpenFlowsModal && (
                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onOpenFlowsModal();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Test Flows A–F</span>
                </button>
              )}

              {/* 10 Primary Platforms List */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  10 Primary Platforms
                </div>
                <div className="space-y-1">
                  {ECOSYSTEM_PILLARS.map((p) => {
                    const PIcon = p.icon;
                    const active = isPillarActive(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActiveSection(p.id);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition cursor-pointer ${
                          active
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                            active ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-amber-400'
                          }`}
                        >
                          {p.pillarNumber}
                        </span>
                        <PIcon className="w-4 h-4 shrink-0" />
                        <span className="truncate">{p.label.replace(/^\d+\.\s*/, '')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4 Flagship Shared ERP Services */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Shared ERP Core
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'shared-erp-hr', label: '1. People & Workforce', icon: Users },
                    { id: 'shared-erp-procurement', label: '2. Commerce & Trade', icon: ShoppingBag },
                    { id: 'shared-erp-finance', label: '3. Finance & Accounts', icon: DollarSign },
                    { id: 'shared-erp-organization', label: '4. Organization & Workspace', icon: Building2 }
                  ].map((s) => {
                    const SIcon = s.icon;
                    const active = activeSection === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveSection(s.id as SectionId);
                          setIsMobileDrawerOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition cursor-pointer ${
                          active
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <SIcon className="w-4 h-4 shrink-0 text-amber-400" />
                        <span className="truncate">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Utilities */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onOpenDocModal();
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Blueprint Master Doc</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
