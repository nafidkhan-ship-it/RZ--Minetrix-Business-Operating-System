import React, { useState } from 'react';
import {
  Briefcase,
  GitBranch,
  ArrowRightLeft,
  Zap,
  CheckCircle2,
  MessageSquare,
  CalendarCheck,
  ArrowLeft
} from 'lucide-react';
import { SectionId } from '../../types/architecture';
import { ContractJobTab, ContractJobSecondaryNav } from '../contract_job/ContractJobSecondaryNav';
import { JobDashboardView } from '../contract_job/JobDashboardView';
import { CustomersView } from '../contract_job/CustomersView';
import { RequirementsView } from '../contract_job/RequirementsView';
import { LeadsView } from '../contract_job/LeadsView';
import { QuotationsView } from '../contract_job/QuotationsView';
import { AgreementsView } from '../contract_job/AgreementsView';
import { WorkOrdersView } from '../contract_job/WorkOrdersView';
import { JobsListView } from '../contract_job/JobsListView';
import { JobProfileView } from '../contract_job/JobProfileView';
import { ContractorsView } from '../contract_job/ContractorsView';
import { SubcontractorsView } from '../contract_job/SubcontractorsView';
import { WorkersView } from '../contract_job/WorkersView';
import { MaterialsView } from '../contract_job/MaterialsView';
import { VehiclesView } from '../contract_job/VehiclesView';
import { ExpensesView } from '../contract_job/ExpensesView';
import { BillingView } from '../contract_job/BillingView';
import { PaymentsView } from '../contract_job/PaymentsView';
import { JobPandLView } from '../contract_job/JobPandLView';
import { ChangeOrdersView } from '../contract_job/ChangeOrdersView';
import { JobDocumentsView } from '../contract_job/JobDocumentsView';
import { JobReportsView } from '../contract_job/JobReportsView';

// Interactive Modals
import { JobWorkflowModal } from '../contract_job/JobWorkflowModal';
import { JobCrossPlatformModal } from '../contract_job/JobCrossPlatformModal';
import { JobQuickActionsModal } from '../contract_job/JobQuickActionsModal';
import { RzChatBridgeModal } from '../contract_job/RzChatBridgeModal';
import { RzOttTaskModal } from '../contract_job/RzOttTaskModal';

import { ContractJob, SAMPLE_JOBS } from '../../data/contractJobStudioData';

interface ContractJobManagementPlatformProps {
  onNavigateSection?: (sectionId: SectionId) => void;
}

export const ContractJobManagementPlatform: React.FC<ContractJobManagementPlatformProps> = ({
  onNavigateSection
}) => {
  const [activeTab, setActiveTab] = useState<ContractJobTab>('dashboard');
  const [selectedJobForProfile, setSelectedJobForProfile] = useState<ContractJob | null>(null);
  const [preselectedInvoice, setPreselectedInvoice] = useState<string | null>(null);

  // Modals state
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [isCrossPlatformModalOpen, setIsCrossPlatformModalOpen] = useState(false);
  const [isQuickActionsModalOpen, setIsQuickActionsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatChannelDetails, setChatChannelDetails] = useState({
    title: 'JOB-4001 • Moodbidri Quarry Pit 2 Operational Channel',
    subtitle: 'Coastal Blasting, Er. Rajesh Varma, Fleet Logistics, Site Safety'
  });
  const [isOttModalOpen, setIsOttModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleTabChange = (tab: ContractJobTab) => {
    setActiveTab(tab);
    setSelectedJobForProfile(null);
  };

  const handleSelectJob = (job: ContractJob) => {
    setSelectedJobForProfile(job);
  };

  const handleRecordPayment = (invoiceNumber: string) => {
    setPreselectedInvoice(invoiceNumber);
    setActiveTab('payments');
    setSelectedJobForProfile(null);
    showToast(`Opening payment remittance voucher for invoice ${invoiceNumber}`);
  };

  const handleOpenChat = (title?: string, subtitle?: string) => {
    if (title) {
      setChatChannelDetails({
        title,
        subtitle: subtitle || 'Project stakeholders, Site Engineers, Subcontractors'
      });
    }
    setIsChatModalOpen(true);
  };

  const handleOpenTask = () => {
    setIsOttModalOpen(true);
  };

  const handlePlatformNavigation = (platformId: number) => {
    if (!onNavigateSection) return;
    if (platformId === 1) onNavigateSection('quarry-management');
    else if (platformId === 2) onNavigateSection('crusher-management');
    else if (platformId === 3) onNavigateSection('vehicle-management');
  };

  const handleQuickActionSelect = (navKey: string) => {
    if (navKey === 'chat') {
      handleOpenChat();
    } else if (navKey === 'tasks') {
      handleOpenTask();
    } else {
      setSelectedJobForProfile(null);
      setActiveTab(navKey as ContractJobTab);
    }
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

      {/* Global Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                04 &bull; CONTRACT & JOB MANAGEMENT
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                100% Studio UI/UX Build
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                STUDIO PREVIEW / DEMO DATA
              </span>
            </div>
            <h1 className="text-xl font-black text-white mt-0.5">
              Contract & Job Management Platform
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer &rarr; RFQ &rarr; Quotation &rarr; Agreement &rarr; Work Order &rarr; Job &rarr; Progress &rarr; RA Billing &rarr; Net P&L
            </p>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenChat()}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Open RZ Chat"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">RZ Chat</span>
          </button>

          <button
            onClick={() => handleOpenTask()}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
            title="Create RZ OTT Site Task"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">RZ OTT</span>
          </button>

          <button
            onClick={() => setIsWorkflowModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs border border-purple-500/30 transition flex items-center gap-1.5 cursor-pointer shadow-md"
            title="End-to-End Clickable Job Workflow Simulation"
          >
            <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            <span>Workflow Simulation</span>
          </button>

          <button
            onClick={() => setIsQuickActionsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>+ Quick Actions</span>
          </button>
        </div>
      </div>

      {/* 20-MODULE SECONDARY NAVIGATION */}
      <ContractJobSecondaryNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
        onOpenCrossPlatform={() => setIsCrossPlatformModalOpen(true)}
        onOpenQuickActions={() => setIsQuickActionsModalOpen(true)}
      />

      {/* JOB PROFILE VIEW (If a specific Job is opened) */}
      {selectedJobForProfile ? (
        <JobProfileView
          job={selectedJobForProfile}
          onBack={() => setSelectedJobForProfile(null)}
          onOpenChat={(channel) =>
            handleOpenChat(
              `${selectedJobForProfile.id} • ${channel} Channel`,
              `Stakeholders, Site Team & Contractors for ${selectedJobForProfile.name}`
            )
          }
          onOpenTask={() => handleOpenTask()}
        />
      ) : (
        /* MAIN WORKSPACE VIEW ROUTER */
        <div>
          {activeTab === 'dashboard' && (
            <JobDashboardView
              onNavigate={(view) => handleTabChange(view as ContractJobTab)}
              onOpenWorkflow={() => setIsWorkflowModalOpen(true)}
              onOpenCrossPlatform={() => setIsCrossPlatformModalOpen(true)}
              onOpenQuickActions={() => setIsQuickActionsModalOpen(true)}
              onSelectJob={handleSelectJob}
            />
          )}

          {activeTab === 'customers' && <CustomersView />}

          {activeTab === 'requirements' && <RequirementsView />}

          {activeTab === 'leads' && <LeadsView />}

          {activeTab === 'quotations' && <QuotationsView />}

          {activeTab === 'agreements' && <AgreementsView />}

          {activeTab === 'work-orders' && <WorkOrdersView />}

          {(activeTab === 'jobs' || activeTab === 'progress') && (
            <JobsListView onSelectJob={handleSelectJob} />
          )}

          {activeTab === 'contractors' && <ContractorsView />}

          {activeTab === 'subcontractors' && <SubcontractorsView />}

          {activeTab === 'workers' && <WorkersView />}

          {activeTab === 'materials' && <MaterialsView />}

          {activeTab === 'vehicles' && <VehiclesView />}

          {activeTab === 'billing' && (
            <BillingView onRecordPayment={handleRecordPayment} />
          )}

          {activeTab === 'payments' && (
            <PaymentsView preselectedInvoice={preselectedInvoice} />
          )}

          {activeTab === 'expenses' && <ExpensesView />}

          {activeTab === 'pnl' && <JobPandLView />}

          {activeTab === 'change-orders' && <ChangeOrdersView />}

          {activeTab === 'documents' && <JobDocumentsView />}

          {activeTab === 'reports' && <JobReportsView />}
        </div>
      )}

      {/* END-TO-END WORKFLOW SIMULATION MODAL */}
      <JobWorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        onNavigateToView={(view) => handleTabChange(view as ContractJobTab)}
      />

      {/* CROSS-PLATFORM DATA CONNECTIONS MODAL */}
      <JobCrossPlatformModal
        isOpen={isCrossPlatformModalOpen}
        onClose={() => setIsCrossPlatformModalOpen(false)}
        onNavigatePlatform={handlePlatformNavigation}
      />

      {/* GLOBAL QUICK ACTIONS MODAL */}
      <JobQuickActionsModal
        isOpen={isQuickActionsModalOpen}
        onClose={() => setIsQuickActionsModalOpen(false)}
        onSelectAction={handleQuickActionSelect}
      />

      {/* RZ CHAT REAL-TIME BRIDGE MODAL */}
      <RzChatBridgeModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        channelTitle={chatChannelDetails.title}
        channelSubtitle={chatChannelDetails.subtitle}
      />

      {/* RZ OTT SITE TASK MODAL */}
      <RzOttTaskModal
        isOpen={isOttModalOpen}
        onClose={() => setIsOttModalOpen(false)}
        onCreatedTask={(taskTitle) =>
          showToast(`Task "${taskTitle}" dispatched to RZ OTT Platform!`)
        }
      />
    </div>
  );
};
