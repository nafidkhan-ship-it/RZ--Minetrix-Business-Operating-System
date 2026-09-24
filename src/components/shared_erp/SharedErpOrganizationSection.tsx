import React, { useState } from 'react';
import {
  Building2,
  CreditCard,
  Shield,
  MapPin,
  FileText,
  Users,
  CheckCircle2,
  Sparkles,
  Send,
  Settings,
  Activity,
  Layers,
  Search,
  MessageSquare
} from 'lucide-react';
import { WorkspaceSwitcher } from '../organization/WorkspaceSwitcher';
import { OrgDashboardView } from '../organization/views/OrgDashboardView';
import { CompanyProfileView } from '../organization/views/CompanyProfileView';
import { BranchesSitesView } from '../organization/views/BranchesSitesView';
import { SubscriptionPlansView } from '../organization/views/SubscriptionPlansView';
import { StaffDirectoryView } from '../organization/views/StaffDirectoryView';
import { RbacRoleDirectoryView } from '../organization/views/RbacRoleDirectoryView';
import { RoleDashboardsView } from '../organization/views/RoleDashboardsView';
import { OrgSettingsAuditView } from '../organization/views/OrgSettingsAuditView';
import { InviteStaffModal } from '../organization/modals/InviteStaffModal';
import { StaffDetailModal } from '../organization/modals/StaffDetailModal';
import { UpgradeDowngradeModal } from '../organization/modals/UpgradeDowngradeModal';
import { OrgTestFlowsModal } from '../organization/modals/OrgTestFlowsModal';
import { StaffMember, Role24 } from '../organization/types';
import { DEMO_BRANCHES, DEMO_SITES } from '../organization/data/orgDemoData';

export type OrgSubTab =
  | 'overview'
  | 'workspace'
  | 'profile'
  | 'branches'
  | 'subscription'
  | 'staff'
  | 'rbac'
  | 'role-dashboards'
  | 'settings';

interface SharedErpOrganizationSectionProps {
  onNavigate?: (section: string) => void;
  initialSubTab?: OrgSubTab;
}

export const SharedErpOrganizationSection: React.FC<SharedErpOrganizationSectionProps> = ({
  onNavigate,
  initialSubTab = 'overview'
}) => {
  // Normalize initial tab
  const normalizedInitial = initialSubTab === 'workspace' ? 'overview' : initialSubTab;
  const [activeTab, setActiveTab] = useState<OrgSubTab>(normalizedInitial);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedStaffDetail, setSelectedStaffDetail] = useState<StaffMember | null>(null);
  const [planModalMode, setPlanModalMode] = useState<'upgrade' | 'downgrade' | null>(null);
  const [isTestFlowsModalOpen, setIsTestFlowsModalOpen] = useState(false);
  const [previewRoleForDashboard, setPreviewRoleForDashboard] = useState<Role24>('OWNER');

  // Workspace Context state (Global HQ -> Kerala Branch -> Crusher Plant -> Quarry Site)
  const [currentWorkspace, setCurrentWorkspace] = useState({
    branchId: DEMO_BRANCHES[0].id,
    branchName: DEMO_BRANCHES[0].name,
    siteId: DEMO_SITES[0].id,
    siteName: DEMO_SITES[0].name
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSwitchWorkspace = (branchId: string, siteId?: string) => {
    const br = DEMO_BRANCHES.find(b => b.id === branchId) || DEMO_BRANCHES[0];
    const site = siteId ? DEMO_SITES.find(s => s.id === siteId) : undefined;
    setCurrentWorkspace({
      branchId: br.id,
      branchName: br.name,
      siteId: site?.id,
      siteName: site?.name
    });
    showToast(`Switched active workspace scope: ${br.code} ${site ? `> ${site.name}` : ''}`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-emerald-400">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header Bar with Workspace Switcher */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase">
              Shared ERP Core &bull; Organization Engine
            </span>
            <span className="text-slate-500">&bull;</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
              Studio Preview / Demo Data
            </span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span>Organization &amp; Workspace Management</span>
          </h2>
        </div>

        {/* Global Controls & Workspace Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          <WorkspaceSwitcher
            currentWorkspace={currentWorkspace}
            onSwitchWorkspace={handleSwitchWorkspace}
          />

          <button
            onClick={() => setIsTestFlowsModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>4 Interactive Test Flows</span>
          </button>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-purple-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>+ Invite Staff</span>
          </button>
        </div>
      </div>

      {/* Main Subtabs Navigation Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'overview' as OrgSubTab, label: '1. Org Overview', icon: Building2, tag: 'Dashboard & KPIs' },
          { id: 'profile' as OrgSubTab, label: '2. Company Profile', icon: FileText, tag: 'Legal & Docs' },
          { id: 'branches' as OrgSubTab, label: '3. Branches & Sites', icon: MapPin, tag: '3 Hubs / 6 Sites' },
          { id: 'subscription' as OrgSubTab, label: '4. Subscription & Quotas', icon: CreditCard, tag: 'Enterprise BOS' },
          { id: 'staff' as OrgSubTab, label: '5. Staff Directory', icon: Users, tag: 'Personnel' },
          { id: 'rbac' as OrgSubTab, label: '6. 24 Roles & Matrix', icon: Shield, tag: '9 Permissions' },
          { id: 'role-dashboards' as OrgSubTab, label: '7. Role Dashboards', icon: Activity, tag: '24 Views' },
          { id: 'settings' as OrgSubTab, label: '8. Settings & Audit', icon: Settings, tag: 'Security Trail' }
        ].map(tab => {
          const Icon = tab.icon;
          const isAct = activeTab === tab.id || (tab.id === 'overview' && activeTab === 'workspace');
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap border cursor-pointer ${
                isAct
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                isAct ? 'bg-purple-900 text-white' : 'bg-slate-800 text-slate-300'
              }`}>
                {tab.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Organization Overview */}
      {(activeTab === 'overview' || activeTab === 'workspace') && (
        <OrgDashboardView
          onNavigateTab={tab => setActiveTab(tab as OrgSubTab)}
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
          onOpenUpgradeModal={() => setPlanModalMode('upgrade')}
          onOpenTestFlowsModal={() => setIsTestFlowsModalOpen(true)}
        />
      )}

      {/* Tab 2: Company Profile */}
      {activeTab === 'profile' && (
        <CompanyProfileView
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
          onOpenAddBranch={() => setActiveTab('branches')}
          onOpenAddSite={() => setActiveTab('branches')}
        />
      )}

      {/* Tab 3: Branches & Sites */}
      {activeTab === 'branches' && (
        <BranchesSitesView
          onOpenAddBranch={() => showToast('Add Branch Modal Triggered')}
          onOpenAddSite={() => showToast('Add Mining Site Modal Triggered')}
        />
      )}

      {/* Tab 4: Subscription & Quotas */}
      {activeTab === 'subscription' && (
        <SubscriptionPlansView
          onOpenUpgradeModal={() => setPlanModalMode('upgrade')}
          onOpenDowngradeModal={() => setPlanModalMode('downgrade')}
        />
      )}

      {/* Tab 5: Staff Directory */}
      {activeTab === 'staff' && (
        <StaffDirectoryView
          onOpenInviteModal={() => setIsInviteModalOpen(true)}
          onSelectStaff={st => setSelectedStaffDetail(st)}
          onOpenChatWithStaff={name => {
            showToast(`Opened RZ® Chat with ${name}`);
            onNavigate?.('rz-chat');
          }}
          onCreateTaskForStaff={task => {
            showToast(`Dispatched RZ® OTT task: "${task}"`);
            onNavigate?.('rz-ott');
          }}
        />
      )}

      {/* Tab 6: RBAC 24 Roles & Permission Matrix */}
      {activeTab === 'rbac' && (
        <RbacRoleDirectoryView
          onSelectRoleForDashboard={r => {
            setPreviewRoleForDashboard(r);
            setActiveTab('role-dashboards');
          }}
        />
      )}

      {/* Tab 7: Role Dashboards (All 24 Roles Previews) */}
      {activeTab === 'role-dashboards' && (
        <RoleDashboardsView
          initialRole={previewRoleForDashboard}
          onOpenChat={() => onNavigate?.('rz-chat')}
          onOpenOttTask={t => {
            showToast(`Task created in RZ® OTT: "${t}"`);
            onNavigate?.('rz-ott');
          }}
        />
      )}

      {/* Tab 8: Organization Settings & Security Audit Trail */}
      {activeTab === 'settings' && (
        <OrgSettingsAuditView />
      )}

      {/* Modals */}
      <InviteStaffModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={(name, role) => {
          showToast(`Invitation dispatched to ${name} for ${role} role!`);
        }}
      />

      <StaffDetailModal
        staff={selectedStaffDetail}
        onClose={() => setSelectedStaffDetail(null)}
        onOpenChat={name => {
          showToast(`Connecting with ${name} on RZ® Chat`);
          onNavigate?.('rz-chat');
        }}
        onCreateTask={task => {
          showToast(`Created task on RZ® OTT: ${task}`);
          onNavigate?.('rz-ott');
        }}
      />

      {planModalMode && (
        <UpgradeDowngradeModal
          isOpen={true}
          mode={planModalMode}
          onClose={() => setPlanModalMode(null)}
          onSuccess={planName => {
            showToast(`Subscription updated to: ${planName} (Studio Preview applied)`);
          }}
        />
      )}

      <OrgTestFlowsModal
        isOpen={isTestFlowsModalOpen}
        onClose={() => setIsTestFlowsModalOpen(false)}
        onJumpToTab={t => setActiveTab(t as OrgSubTab)}
      />
    </div>
  );
};
