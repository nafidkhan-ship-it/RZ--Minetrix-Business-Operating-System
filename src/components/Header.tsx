import React from 'react';
import { SectionId } from '../types/architecture';
import { Layers, Database, Shield, Cpu, Activity, LayoutGrid, FileText, Pickaxe, Sparkles, Box, Truck, ShoppingBag, Users, Globe, Landmark, UserCheck, Brain, Rocket, Award, Palette, Server, Key, FolderTree, Bell, BarChart3, GitFork, Plug, Cloud, Download, Smartphone, MessageSquare } from 'lucide-react';
import { RZLogo } from './RZLogo';

interface HeaderProps {
  activeSection: SectionId;
  setActiveSection: (section: SectionId) => void;
  onOpenDocModal: () => void;
  onOpenBrandingModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection, onOpenDocModal, onOpenBrandingModal }) => {
  const navItems: { id: SectionId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Vision & Core', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'architecture', label: 'System Architecture', icon: <Layers className="w-4 h-4" /> },
    { id: 'shared-core', label: 'Phase 3 Shared Core', icon: <Box className="w-4 h-4 text-emerald-400" /> },
    { id: 'mining-suite', label: 'Phase 4 Mining Suite', icon: <Pickaxe className="w-4 h-4 text-amber-400" /> },
    { id: 'fleet-suite', label: 'Phase 5 Fleet Suite', icon: <Truck className="w-4 h-4 text-blue-400" /> },
    { id: 'materials-suite', label: 'Phase 6 Materials Suite', icon: <ShoppingBag className="w-4 h-4 text-cyan-400" /> },
    { id: 'crm-suite', label: 'Phase 7 CRM Suite', icon: <Users className="w-4 h-4 text-purple-400" /> },
    { id: 'marketplace-suite', label: 'Phase 8 Marketplace Suite', icon: <Globe className="w-4 h-4 text-blue-400" /> },
    { id: 'finance-suite', label: 'Phase 9 Finance Suite', icon: <Landmark className="w-4 h-4 text-emerald-400" /> },
    { id: 'hrms-suite', label: 'Phase 10 HRMS Suite', icon: <UserCheck className="w-4 h-4 text-indigo-400" /> },
    { id: 'ai-suite', label: 'Phase 11 AI Platform', icon: <Brain className="w-4 h-4 text-violet-400" /> },
    { id: 'platform-suite', label: 'Phase 12 Platform Architecture', icon: <Rocket className="w-4 h-4 text-blue-400" /> },
    { id: 'master-blueprint', label: 'Phase 13 Master Blueprint', icon: <Award className="w-4 h-4 text-emerald-400" /> },
    { id: 'ui-design-system', label: 'Phase 14 UI/UX Design System', icon: <Palette className="w-4 h-4 text-violet-400" /> },
    { id: 'backend-foundation', label: 'Phase 15 Backend Foundation', icon: <Server className="w-4 h-4 text-blue-400" /> },
    { id: 'shared-core-implementation', label: 'Phase 16 Shared Core', icon: <Box className="w-4 h-4 text-emerald-400" /> },
    { id: 'auth-multi-tenant', label: 'Phase 16A Auth & SaaS', icon: <Key className="w-4 h-4 text-emerald-400" /> },
    { id: 'shared-masters-dms', label: 'Phase 16B Masters & DMS', icon: <FolderTree className="w-4 h-4 text-blue-400" /> },
    { id: 'notification-communication-engine', label: 'Phase 16C Notification & Communication', icon: <Bell className="w-4 h-4 text-emerald-400" /> },
    { id: 'dashboard-kpi-reporting', label: 'Phase 16D Dashboards & KPIs', icon: <BarChart3 className="w-4 h-4 text-amber-400" /> },
    { id: 'workflow-approval-audit', label: 'Phase 16E Workflows & Approvals', icon: <GitFork className="w-4 h-4 text-emerald-400" /> },
    { id: 'api-gateway-integration-hub', label: 'Phase 16F API Gateway & Hub', icon: <Plug className="w-4 h-4 text-emerald-400" /> },
    { id: 'enterprise-admin-tenant-platform', label: 'Phase 16H Admin & Tenants', icon: <Shield className="w-4 h-4 text-violet-400" /> },
    { id: 'devops-cloud-observability', label: 'Phase 16I DevOps & Cloud', icon: <Cloud className="w-4 h-4 text-blue-400" /> },
    { id: 'core-validation-certification', label: 'Phase 16J Core Certification', icon: <Award className="w-4 h-4 text-amber-400" /> },
    { id: 'design-system-16k', label: 'Phase 16K Design System', icon: <Palette className="w-4 h-4 text-purple-400" /> },
    { id: 'mining-operations-platform', label: 'Phase 17 Mining Operations', icon: <Pickaxe className="w-4 h-4 text-amber-400" /> },
    { id: 'fleet-logistics-platform', label: 'Phase 18 Fleet & Logistics', icon: <Truck className="w-4 h-4 text-blue-400" /> },
    { id: 'ai-load-exchange-marketplace', label: 'Module 31 AI Load Exchange', icon: <ShoppingBag className="w-4 h-4 text-emerald-400" /> },
    { id: 'enterprise-crm-phase20', label: 'Phase 20 Enterprise CRM', icon: <Users className="w-4 h-4 text-purple-400" /> },
    { id: 'enterprise-marketplace-phase21', label: 'Phase 21 Marketplace & Ecosystem', icon: <Globe className="w-4 h-4 text-emerald-400" /> },
    { id: 'enterprise-finance-phase22', label: 'Phase 22 Enterprise Finance & BI', icon: <Landmark className="w-4 h-4 text-emerald-400" /> },
    { id: 'enterprise-hrms-phase23', label: 'Phase 23 Enterprise HRMS & Payroll', icon: <UserCheck className="w-4 h-4 text-indigo-400" /> },
    { id: 'enterprise-ai-phase24', label: 'Phase 24 Enterprise AI & Automation', icon: <Brain className="w-4 h-4 text-purple-400" /> },
    { id: 'enterprise-integration-phase25', label: 'Phase 25 Enterprise Integration & iPaaS', icon: <Plug className="w-4 h-4 text-cyan-400" /> },
    { id: 'enterprise-admin-phase26', label: 'Phase 26 Enterprise Administration & SaaS', icon: <Shield className="w-4 h-4 text-red-400" /> },
    { id: 'enterprise-enhancement-pack', label: 'Post Phase 26 Enhancement Pack', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { id: 'enterprise-mobile-phase27', label: 'Phase 27 Mobile Platform & Field Workforce', icon: <Smartphone className="w-4 h-4 text-emerald-400" /> },
    { id: 'enterprise-portals-phase28', label: 'Phase 28 Self-Service Portals Platform', icon: <Globe className="w-4 h-4 text-amber-400" /> },
    { id: 'rz-chat-phase29', label: 'Phase 29 RZ Chat Foundation', icon: <MessageSquare className="w-4 h-4 text-emerald-400" /> },
    { id: 'domains', label: '10 DDD Domains', icon: <Database className="w-4 h-4" /> },
    { id: 'database', label: 'Database & RLS', icon: <Shield className="w-4 h-4" /> },
    { id: 'events', label: 'Event Choreography', icon: <Activity className="w-4 h-4" /> },
    { id: 'suites', label: '5 Business Suites', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'security', label: 'Security & Offline', icon: <Cpu className="w-4 h-4" /> },
    { id: 'structure', label: 'Folder & Roadmap', icon: <Pickaxe className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <RZLogo
              variant="full"
              size="standard"
              showText={true}
            />
            <span className="hidden xl:inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              Enterprise Architecture Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Branding & Asset Exporter Trigger */}
            <button
              onClick={onOpenBrandingModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-bold text-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Global Asset Export &amp; Branding</span>
              <span className="lg:hidden">Branding</span>
            </button>

            {/* Blueprint Doc Trigger */}
            <button
              onClick={onOpenDocModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-semibold text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden md:inline">View / Export Official Blueprint</span>
              <span className="md:hidden">Blueprint Doc</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/80">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

