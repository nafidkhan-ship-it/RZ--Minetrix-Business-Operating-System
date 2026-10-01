import { useState, useEffect, useCallback } from 'react';
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
import { HomeEcosystemDashboard } from './components/HomeEcosystemDashboard';
import { QuarryManagementPlatform } from './components/platforms/QuarryManagementPlatform';
import { CrusherManagementPlatform } from './components/platforms/CrusherManagementPlatform';
import { VehicleManagementPlatform } from './components/platforms/VehicleManagementPlatform';
import { ContractJobManagementPlatform } from './components/platforms/ContractJobManagementPlatform';
import { BuildingMaterialsCommercePlatform } from './components/platforms/BuildingMaterialsCommercePlatform';
import { UsedMachineryMarketplacePlatform } from './components/platforms/UsedMachineryMarketplacePlatform';
import { QuarryLandManagementPlatform } from './components/platforms/QuarryLandManagementPlatform';
import { RzChatingPlatform } from './components/platforms/RzChatingPlatform';
import { RzOttPlatform } from './components/platforms/RzOttPlatform';
import { RzCalculatorPlatform } from './components/platforms/RzCalculatorPlatform';
import { RzProductivitySuite } from './components/productivity/RzProductivitySuite';
import { EndToEndFlowsModal } from './components/flows/EndToEndFlowsModal';
import { RzBrandLaunchSplash } from './components/brand/RzBrandLaunchSplash';
import { RzGridDataStudio } from './components/shared/RzGridDataStudio';
import { DatabaseBlueprintSection } from './components/DatabaseBlueprintSection';
import { EventArchitectureSection } from './components/EventArchitectureSection';
import { SuitesMatrixSection } from './components/SuitesMatrixSection';
import { SecurityDeploymentSection } from './components/SecurityDeploymentSection';
import { FolderStructureSection } from './components/FolderStructureSection';
import { OttPlatformSection } from './components/ott/OttPlatformSection';
import { ContractJobManagementSection } from './components/ContractJobManagementSection';
import { QuarryLandManagementSection } from './components/QuarryLandManagementSection';
import { CrusherManagementSection } from './components/CrusherManagementSection';
import { UniversalDashboardSection } from './components/UniversalDashboardSection';
import { AutomationEngineSection } from './components/AutomationEngineSection';
import { BillingSubscriptionSection } from './components/BillingSubscriptionSection';
import { SharedErpCoreSection } from './components/SharedErpCoreSection';
import { LoginAuthenticationScreen } from './components/LoginAuthenticationScreen';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthModal } from './components/AuthModal';
import { BlueprintDocModal } from './components/BlueprintDocModal';
import { BrandingAssetExporterModal } from './components/BrandingAssetExporterModal';
import { brandingService } from './services/brandingService';
import { mobileService } from './services/mobileService';
import { WifiOff } from 'lucide-react';
import { LateriteStoneOrderModal } from './components/LateriteStoneOrderModal';

// Phase 48: Complete Navigation & Route Map Engine
import { BreadcrumbBar } from './components/navigation/BreadcrumbBar';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { RoleAwareNavPreview } from './components/navigation/RoleAwareNavPreview';
import { GlobalQuickActionsMenu } from './components/navigation/GlobalQuickActionsMenu';
import { PlatformSwitcherModal } from './components/navigation/PlatformSwitcherModal';
import { EndToEndRouteTesterModal } from './components/navigation/EndToEndRouteTesterModal';
import { UniversalSearchModal } from './components/navigation/UniversalSearchModal';
import { resolveRoute, ALL_ROUTES_REGISTRY } from './components/navigation/routeRegistry';
import { DemoRole, QuickActionItem } from './components/navigation/types';

function sectionFromHash(): SectionId | null {
  if (typeof window === 'undefined') return null;
  const id = window.location.hash.replace(/^#/, '').trim();
  return id ? (id as SectionId) : null;
}

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('universal-dashboard');
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return window.location.hash.replace(/^#/, '');
    }
    return '/home';
  });
  const [activeSubtab, setActiveSubtab] = useState<string | undefined>(undefined);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [activeDemoRole, setActiveDemoRole] = useState<DemoRole>('OWNER');

  // Modals & Navigation Drawers
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFlowsModalOpen, setIsFlowsModalOpen] = useState(false);
  const [isLateriteOrderModalOpen, setIsLateriteOrderModalOpen] = useState(false);
  const [isPlatformSwitcherOpen, setIsPlatformSwitcherOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState(false);
  const [isTesterOpen, setIsTesterOpen] = useState(false);
  const [isRolePreviewOpen, setIsRolePreviewOpen] = useState(true);
  const [commerceIntent, setCommerceIntent] = useState<{ subpage?: string; openWizard?: boolean } | null>(null);

  // Centralized Route Navigator
  const handleNavigatePath = useCallback((path: string, options?: { replace?: boolean }) => {
    const routeDef = resolveRoute(path);

    if (!options?.replace && currentPath !== path) {
      setHistoryStack(prev => [...prev, currentPath]);
    }

    setCurrentPath(path);
    setActiveSection(routeDef.sectionId);
    setActiveSubtab(routeDef.subtab);

    if (path === '/commerce/laterite/order' || routeDef.subtab === 'laterite-order') {
      setIsLateriteOrderModalOpen(true);
      setCommerceIntent({ subpage: 'laterite-stone', openWizard: true });
    }

    if (typeof window !== 'undefined') {
      window.location.hash = path;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPath]);

  // Back Navigation Handler
  const handleGoBack = useCallback(() => {
    if (historyStack.length > 0) {
      const prevPath = historyStack[historyStack.length - 1];
      setHistoryStack(prev => prev.slice(0, -1));
      handleNavigatePath(prevPath, { replace: true });
    } else {
      handleNavigatePath('/home', { replace: true });
    }
  }, [historyStack, handleNavigatePath]);

  // Section ID to Path Router (Bridge for existing triggers)
  const handleNavigateSection = (sectionId: SectionId, options?: { commerceSubpage?: string; openWizard?: boolean }) => {
    let targetPath = '/home';
    switch (sectionId) {
      case 'universal-dashboard': targetPath = '/home'; break;
      case 'quarry-management': targetPath = '/quarry'; break;
      case 'crusher-management': targetPath = '/crusher'; break;
      case 'vehicle-management': targetPath = '/vehicle'; break;
      case 'contract-job-management': targetPath = '/jobs'; break;
      case 'building-materials-ecommerce': targetPath = options?.openWizard ? '/commerce/laterite/order' : '/commerce'; break;
      case 'used-machinery-marketplace': targetPath = '/marketplace'; break;
      case 'quarry-land-management': targetPath = '/land'; break;
      case 'rz-chating':
      case 'rz-chat-phase29': targetPath = '/chat'; break;
      case 'rz-ott':
      case 'ott-platform': targetPath = '/ott'; break;
      case 'rz-calculator': targetPath = '/calculator'; break;
      case 'shared-erp-core': targetPath = '/erp'; break;
      case 'shared-erp-finance': targetPath = '/finance'; break;
      case 'shared-erp-organization': targetPath = '/organization'; break;
      case 'billing-subscription': targetPath = '/subscription'; break;
      case 'shared-erp-hr': targetPath = '/staff'; break;
      case 'rz-productivity-suite': targetPath = '/productivity'; break;
      default:
        setActiveSection(sectionId);
        return;
    }

    if (options?.commerceSubpage || options?.openWizard) {
      setCommerceIntent({ subpage: options.commerceSubpage, openWizard: options.openWizard });
    }

    handleNavigatePath(targetPath);
  };

  const handleQuickActionSelect = (action: QuickActionItem) => {
    handleNavigatePath(action.targetPath);
  };

  // Sync with browser hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hashPath = window.location.hash.replace(/^#/, '');
      if (hashPath && hashPath !== currentPath) {
        handleNavigatePath(hashPath, { replace: true });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentPath, handleNavigatePath]);

  const [showBrandSplash, setShowBrandSplash] = useState(() => {
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('rz_splash_shown');
      if (!shown) {
        sessionStorage.setItem('rz_splash_shown', 'true');
        return true;
      }
    }
    return false;
  });
  const [isOnline, setIsOnline] = useState<boolean>(mobileService.getIsOnline());

  useEffect(() => {
    brandingService.initializeGlobalTheme();
    const unsub = mobileService.onNetworkChange((online) => {
      setIsOnline(online);
    });
    return () => unsub();
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950 flex flex-col pt-safe pb-safe pl-safe pr-safe">
      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-300 px-4 py-2 text-xs flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Offline Mode:</strong> Live Cloud SQL sync paused. Stock deductions and financial transactions require active connection.
          </span>
        </div>
      )}

      {/* Header Bar & Navigation */}
      <Header
        activeSection={activeSection}
        setActiveSection={handleNavigateSection}
        onOpenDocModal={() => setIsDocModalOpen(true)}
        onOpenBrandingModal={() => setIsBrandingModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenSearchModal={() => setIsUniversalSearchOpen(true)}
        onOpenFlowsModal={() => setIsFlowsModalOpen(true)}
        onOpenLateriteModal={() => setIsLateriteOrderModalOpen(true)}
        onOpenPlatformSwitcher={() => setIsPlatformSwitcherOpen(true)}
        onOpenQuickActions={() => setIsQuickActionsOpen(true)}
        onOpenTester={() => setIsTesterOpen(true)}
        onToggleRolePreview={() => setIsRolePreviewOpen(prev => !prev)}
        isRolePreviewOpen={isRolePreviewOpen}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full pb-20 lg:pb-8">
        {/* Role-Aware Navigation Persona Ribbon (Section AA) */}
        {isRolePreviewOpen && (
          <RoleAwareNavPreview
            onNavigatePath={handleNavigatePath}
            currentRole={activeDemoRole}
            onSelectRole={setActiveDemoRole}
          />
        )}

        {/* Global Breadcrumb Bar & Back Navigation (Section W & X) */}
        <BreadcrumbBar
          currentPath={currentPath}
          onNavigatePath={handleNavigatePath}
          onGoBack={handleGoBack}
          canGoBack={historyStack.length > 0}
          onOpenTester={() => setIsTesterOpen(true)}
          onOpenQuickActions={() => setIsQuickActionsOpen(true)}
        />

        {/* Universal Context-Aware Dashboard */}
        {activeSection === 'universal-dashboard' && (
          <HomeEcosystemDashboard onNavigateSection={handleNavigateSection} />
        )}

        {/* Full-Page Login & Authentication Screen */}
        {activeSection === 'login-screen' && (
          <LoginAuthenticationScreen
            onSuccess={() => handleNavigatePath('/home')}
            onNavigateHome={() => handleNavigatePath('/home')}
          />
        )}

        {/* 1. Quarry Management */}
        {(activeSection === 'quarry-management' || activeSection === 'mining-operations-platform') && (
          <QuarryManagementPlatform
            onNavigateSection={handleNavigateSection}
            initialTab={activeSubtab as any}
          />
        )}
        
        {/* 2. Crusher Management */}
        {(activeSection === 'crusher-management' || activeSection === 'materials-suite') && (
          <CrusherManagementPlatform
            onNavigateSection={handleNavigateSection}
            initialTab={activeSubtab as any}
          />
        )}
        
        {/* 3. Vehicle Management */}
        {(activeSection === 'vehicle-management' || activeSection === 'fleet-logistics-platform') && (
          <VehicleManagementPlatform onNavigateSection={handleNavigateSection} />
        )}
        
        {/* 4. Contract & Job Management */}
        {activeSection === 'contract-job-management' && (
          <ContractJobManagementPlatform onNavigateSection={handleNavigateSection} />
        )}
        
        {/* 5. Building Materials E-Commerce */}
        {(activeSection === 'building-materials-ecommerce' || activeSection === 'enterprise-marketplace-phase21') && (
          <BuildingMaterialsCommercePlatform
            onNavigateSection={handleNavigateSection}
            initialSubpage={commerceIntent?.subpage || activeSubtab}
            initialOpenWizard={commerceIntent?.openWizard}
          />
        )}
        
        {/* 6. Used Machinery & Vehicle Marketplace */}
        {(activeSection === 'used-machinery-marketplace' || activeSection === 'ai-load-exchange-marketplace') && (
          <UsedMachineryMarketplacePlatform onNavigateSection={handleNavigateSection} />
        )}
        
        {/* 7. Quarry Land Management */}
        {activeSection === 'quarry-land-management' && (
          <QuarryLandManagementPlatform onNavigateSection={handleNavigateSection} />
        )}
        
        {/* 8. RZ® Chating */}
        {(activeSection === 'rz-chating' || activeSection === 'rz-chat-phase29') && (
          <RzChatingPlatform onNavigateSection={handleNavigateSection} />
        )}
        
        {/* 9. RZ® OTT: Organise Today & Tomorrow */}
        {(activeSection === 'rz-ott' || activeSection === 'ott-platform') && (
          <RzOttPlatform onNavigateSection={handleNavigateSection} />
        )}

        {/* 10. RZ® Calculator — 100% FREE Universal Platform */}
        {activeSection === 'rz-calculator' && (
          <RzCalculatorPlatform
            onNavigateSection={handleNavigateSection}
            initialTab={activeSubtab}
          />
        )}

        {/* RZ® Productivity Suite (Sheet, Word, Form, Slide, Drive, PDF, Print) */}
        {activeSection === 'rz-productivity-suite' && (
          <RzProductivitySuite
            onNavigateSection={handleNavigateSection}
            initialTool={activeSubtab as any}
          />
        )}

        {/* RZ® Grid Data Studio (Smart Spreadsheet Entry) */}
        {activeSection === 'rz-grid-studio' && <RzGridDataStudio />}

        {/* Shared ERP Core Platform & 4 Flagship Pillars */}
        {(activeSection === 'shared-erp-core' || (typeof activeSection === 'string' && activeSection.startsWith('shared-erp-'))) && (
          <SharedErpCoreSection
            onNavigate={(sec) => handleNavigateSection(sec as SectionId)}
            initialTab={
              (activeSubtab as any) ||
              (activeSection === 'shared-erp-hr' ? 'people' :
              activeSection === 'shared-erp-procurement' ? 'commerce' :
              activeSection === 'shared-erp-sales-crm' ? 'commerce' :
              activeSection === 'shared-erp-finance' ? 'finance' :
              activeSection === 'shared-erp-organization' ? 'organization' :
              activeSection.replace('shared-erp-', ''))
            }
          />
        )}

        {/* Shared Backbone - Automation Engine */}
        {activeSection === 'automation-engine' && <AutomationEngineSection />}

        {/* Shared Backbone - Billing & Subscription & Usage */}
        {(activeSection === 'billing-subscription' || activeSection === 'usage-billing') && <BillingSubscriptionSection />}

        {/* Blueprint & Shared Backbone Sections */}
        {activeSection === 'overview' && <OverviewSection onNavigateSection={handleNavigateSection} />}
        {activeSection === 'architecture' && <SystemArchitectureSection />}
        {activeSection === 'master-blueprint' && <MasterBlueprintSection />}
        {activeSection === 'shared-core' && <SharedCoreSection />}
        {activeSection === 'mining-suite' && <MiningSuiteSection />}
        {activeSection === 'fleet-suite' && <FleetSuiteSection />}
        {activeSection === 'crm-suite' && <CrmSuiteSection />}
        {activeSection === 'marketplace-suite' && <MarketplaceSuiteSection />}
        {activeSection === 'finance-suite' && <FinanceSuiteSection />}
        {activeSection === 'hrms-suite' && <HrmsSuiteSection />}
        {activeSection === 'ai-suite' && <AiSuiteSection />}
        {activeSection === 'platform-suite' && <PlatformSuiteSection />}
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
        {activeSection === 'enterprise-crm-phase20' && <EnterpriseCrmPhase20Section />}
        {activeSection === 'enterprise-finance-phase22' && <EnterpriseFinancePhase22Section />}
        {activeSection === 'enterprise-hrms-phase23' && <EnterpriseHrmsPhase23Section />}
        {activeSection === 'enterprise-ai-phase24' && <EnterpriseAiPhase24Section />}
        {activeSection === 'enterprise-integration-phase25' && <EnterpriseIntegrationPhase25Section />}
        {activeSection === 'enterprise-admin-phase26' && <EnterpriseAdminPhase26Section />}
        {activeSection === 'enterprise-enhancement-pack' && <EnterpriseEnhancementPackSection />}
        {activeSection === 'enterprise-mobile-phase27' && <EnterpriseMobilePhase27Section />}
        {activeSection === 'enterprise-portals-phase28' && <EnterprisePortalsPhase28Section />}
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

      {/* Mobile Bottom Navigation (Section Y) */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
        onOpenLateriteModal={() => setIsLateriteOrderModalOpen(true)}
      />

      {/* All 10 Platforms Switcher Modal (Section Z) */}
      <PlatformSwitcherModal
        isOpen={isPlatformSwitcherOpen}
        onClose={() => setIsPlatformSwitcherOpen(false)}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
      />

      {/* Universal Quick Actions Launcher (Section AB) */}
      <GlobalQuickActionsMenu
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onSelectAction={handleQuickActionSelect}
      />

      {/* Universal Search Modal across 15 record types (Section U) */}
      <UniversalSearchModal
        isOpen={isUniversalSearchOpen}
        onClose={() => setIsUniversalSearchOpen(false)}
        onNavigatePath={handleNavigatePath}
      />

      {/* 20-Step End-to-End Navigation Test Runner (Section AD) */}
      <EndToEndRouteTesterModal
        isOpen={isTesterOpen}
        onClose={() => setIsTesterOpen(false)}
        onNavigatePath={handleNavigatePath}
        currentPath={currentPath}
      />

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

      {/* Enterprise Authentication, Login, Security & Tenant Persona Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Cross-Platform Legacy Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={(section) => handleNavigateSection(section as SectionId)}
      />

      {/* Interactive End-to-End User Journeys (Flows A–F) Modal */}
      <EndToEndFlowsModal
        isOpen={isFlowsModalOpen}
        onClose={() => setIsFlowsModalOpen(false)}
        onNavigateSection={(section) => handleNavigateSection(section)}
      />

      {/* Direct Instant Booking for Dressed Laterite Stone Modal */}
      <LateriteStoneOrderModal
        isOpen={isLateriteOrderModalOpen}
        onClose={() => setIsLateriteOrderModalOpen(false)}
      />

      {/* RZ® Brand Launch Animation & Loading */}
      {showBrandSplash && (
        <RzBrandLaunchSplash onComplete={() => setShowBrandSplash(false)} />
      )}
    </div>
  );
}
