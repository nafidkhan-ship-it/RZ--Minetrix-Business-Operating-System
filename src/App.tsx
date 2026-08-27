import { useState, useEffect } from 'react';
import { SectionId } from './types/architecture';
import { Header } from './components/Header';
import { OverviewSection } from './components/OverviewSection';
import { SystemArchitectureSection } from './components/SystemArchitectureSection';
import { SharedCoreSection } from './components/SharedCoreSection';
import { MiningSuiteSection } from './components/MiningSuiteSection';
import { FleetSuiteSection } from './components/FleetSuiteSection';
import { BuildingMaterialsSuiteSection } from './components/BuildingMaterialsSuiteSection';
import { CrmSuiteSection } from './components/CrmSuiteSection';
import { MarketplaceSuiteSection } from './components/MarketplaceSuiteSection';
import { FinanceSuiteSection } from './components/FinanceSuiteSection';
import { HrmsSuiteSection } from './components/HrmsSuiteSection';
import { AiSuiteSection } from './components/AiSuiteSection';
import { PlatformSuiteSection } from './components/PlatformSuiteSection';
import { MasterBlueprintSection } from './components/MasterBlueprintSection';
import { DesignSystemSection } from './components/DesignSystemSection';
import { BackendFoundationSection } from './components/BackendFoundationSection';
import { SharedCoreImplementationSection } from './components/SharedCoreImplementationSection';
import { AuthMultiTenantSection } from './components/AuthMultiTenantSection';
import { SharedMastersDmsSection } from './components/SharedMastersDmsSection';
import { NotificationCommunicationSection } from './components/NotificationCommunicationSection';
import { DashboardKpiReportingSection } from './components/DashboardKpiReportingSection';
import { WorkflowApprovalAuditSection } from './components/WorkflowApprovalAuditSection';
import { IntegrationHubSection } from './components/IntegrationHubSection';
import { AdminTenantPlatformSection } from './components/AdminTenantPlatformSection';
import { DevOpsCloudPlatformSection } from './components/DevOpsCloudPlatformSection';
import { CoreValidationSection } from './components/CoreValidationSection';
import { DesignSystem16kSection } from './components/DesignSystem16kSection';
import { MiningOperationsPhase17Section } from './components/MiningOperationsPhase17Section';
import { FleetOperationsPhase18Section } from './components/FleetOperationsPhase18Section';
import { AILoadExchangeMarketplaceSection } from './components/AILoadExchangeMarketplaceSection';
import { EnterpriseCrmPhase20Section } from './components/EnterpriseCrmPhase20Section';
import { EnterpriseMarketplacePhase21Section } from './components/EnterpriseMarketplacePhase21Section';
import { EnterpriseFinancePhase22Section } from './components/EnterpriseFinancePhase22Section';
import { EnterpriseHrmsPhase23Section } from './components/EnterpriseHrmsPhase23Section';
import { EnterpriseAiPhase24Section } from './components/EnterpriseAiPhase24Section';
import { EnterpriseIntegrationPhase25Section } from './components/EnterpriseIntegrationPhase25Section';
import { EnterpriseAdminPhase26Section } from './components/EnterpriseAdminPhase26Section';
import { EnterpriseEnhancementPackSection } from './components/EnterpriseEnhancementPackSection';
import { EnterpriseMobilePhase27Section } from './components/EnterpriseMobilePhase27Section';
import { EnterprisePortalsPhase28Section } from './components/EnterprisePortalsPhase28Section';
import { RzChatPhase29Section } from './components/RzChatPhase29Section';
import { DomainExplorerSection } from './components/DomainExplorerSection';
import { DatabaseBlueprintSection } from './components/DatabaseBlueprintSection';
import { EventArchitectureSection } from './components/EventArchitectureSection';
import { SuitesMatrixSection } from './components/SuitesMatrixSection';
import { SecurityDeploymentSection } from './components/SecurityDeploymentSection';
import { FolderStructureSection } from './components/FolderStructureSection';
import { BlueprintDocModal } from './components/BlueprintDocModal';
import { BrandingAssetExporterModal } from './components/BrandingAssetExporterModal';
import { brandingService } from './services/brandingService';

function sectionFromHash(): SectionId | null {
  if (typeof window === 'undefined') return null;
  const id = window.location.hash.replace(/^#/, '').trim();
  return id ? (id as SectionId) : null;
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>(() => sectionFromHash() || 'overview');
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);

  useEffect(() => {
    brandingService.initializeGlobalTheme();
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hashed = sectionFromHash();
      if (hashed) setActiveSection(hashed);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const selectSection = (section: SectionId) => {
    setActiveSection(section);
    if (window.location.hash !== `#${section}`) {
      window.location.hash = section;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      {/* Header Bar & Navigation */}
      <Header
        activeSection={activeSection}
        setActiveSection={selectSection}
        onOpenDocModal={() => setIsDocModalOpen(true)}
        onOpenBrandingModal={() => setIsBrandingModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'architecture' && <SystemArchitectureSection />}
        {activeSection === 'shared-core' && <SharedCoreSection />}
        {activeSection === 'mining-suite' && <MiningSuiteSection />}
        {activeSection === 'fleet-suite' && <FleetSuiteSection />}
        {activeSection === 'materials-suite' && <BuildingMaterialsSuiteSection />}
        {activeSection === 'crm-suite' && <CrmSuiteSection />}
        {activeSection === 'marketplace-suite' && <MarketplaceSuiteSection />}
        {activeSection === 'finance-suite' && <FinanceSuiteSection />}
        {activeSection === 'hrms-suite' && <HrmsSuiteSection />}
        {activeSection === 'ai-suite' && <AiSuiteSection />}
        {activeSection === 'platform-suite' && <PlatformSuiteSection />}
        {activeSection === 'master-blueprint' && <MasterBlueprintSection />}
        {activeSection === 'ui-design-system' && <DesignSystemSection />}
        {activeSection === 'backend-foundation' && <BackendFoundationSection />}
        {activeSection === 'shared-core-implementation' && <SharedCoreImplementationSection />}
        {activeSection === 'auth-multi-tenant' && <AuthMultiTenantSection />}
        {activeSection === 'shared-masters-dms' && <SharedMastersDmsSection />}
        {activeSection === 'notification-communication-engine' && <NotificationCommunicationSection />}
        {activeSection === 'dashboard-kpi-reporting' && <DashboardKpiReportingSection />}
        {activeSection === 'workflow-approval-audit' && <WorkflowApprovalAuditSection />}
        {activeSection === 'api-gateway-integration-hub' && <IntegrationHubSection />}
        {activeSection === 'enterprise-admin-tenant-platform' && <AdminTenantPlatformSection />}
        {activeSection === 'devops-cloud-observability' && <DevOpsCloudPlatformSection />}
        {activeSection === 'core-validation-certification' && <CoreValidationSection />}
        {activeSection === 'design-system-16k' && <DesignSystem16kSection />}
        {activeSection === 'mining-operations-platform' && <MiningOperationsPhase17Section />}
        {activeSection === 'fleet-logistics-platform' && <FleetOperationsPhase18Section />}
        {activeSection === 'ai-load-exchange-marketplace' && <AILoadExchangeMarketplaceSection />}
        {activeSection === 'enterprise-crm-phase20' && <EnterpriseCrmPhase20Section />}
        {activeSection === 'enterprise-marketplace-phase21' && <EnterpriseMarketplacePhase21Section />}
        {activeSection === 'enterprise-finance-phase22' && <EnterpriseFinancePhase22Section />}
        {activeSection === 'enterprise-hrms-phase23' && <EnterpriseHrmsPhase23Section />}
        {activeSection === 'enterprise-ai-phase24' && <EnterpriseAiPhase24Section />}
        {activeSection === 'enterprise-integration-phase25' && <EnterpriseIntegrationPhase25Section />}
        {activeSection === 'enterprise-admin-phase26' && <EnterpriseAdminPhase26Section />}
        {activeSection === 'enterprise-enhancement-pack' && <EnterpriseEnhancementPackSection />}
        {activeSection === 'enterprise-mobile-phase27' && <EnterpriseMobilePhase27Section />}
        {activeSection === 'enterprise-portals-phase28' && <EnterprisePortalsPhase28Section />}
        {activeSection === 'rz-chat-phase29' && <RzChatPhase29Section />}
        {activeSection === 'domains' && <DomainExplorerSection />}
        {activeSection === 'database' && <DatabaseBlueprintSection />}
        {activeSection === 'events' && <EventArchitectureSection />}
        {activeSection === 'suites' && <SuitesMatrixSection />}
        {activeSection === 'security' && <SecurityDeploymentSection />}
        {activeSection === 'structure' && <FolderStructureSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 RZ® Minetrix BOS (Business Operating System). All Rights Reserved.</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Enterprise SaaS Platform for Mining, Crusher, Fleet, Building Materials, Equipment Rental & Construction Supply Chains.
          </p>
        </div>
      </footer>

      {/* Blueprint Doc Modal */}
      <BlueprintDocModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />

      {/* Central Branding & Global Asset Exporter Modal */}
      <BrandingAssetExporterModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
      />
    </div>
  );
}

