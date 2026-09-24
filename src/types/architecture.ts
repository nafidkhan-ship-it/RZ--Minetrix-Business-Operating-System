export type SectionId = 
  | 'universal-dashboard'
  | 'quarry-management'
  | 'crusher-management'
  | 'vehicle-management'
  | 'contract-job-management'
  | 'building-materials-ecommerce'
  | 'used-machinery-marketplace'
  | 'quarry-land-management'
  | 'rz-chating'
  | 'rz-ott'
  | 'rz-calculator'
  | 'rz-productivity-suite'
  | 'rz-grid-studio'
  | 'automation-engine'
  | 'shared-erp-organization'
  | 'shared-erp-finance'
  | 'shared-erp-hr'
  | 'shared-erp-inventory'
  | 'shared-erp-procurement'
  | 'shared-erp-sales-crm'
  | 'shared-erp-documents'
  | 'shared-erp-workflow'
  | 'shared-erp-automation'
  | 'shared-erp-notifications'
  | 'shared-erp-security'
  | 'shared-erp-api'
  | 'shared-erp-analytics'
  | 'shared-erp-admin'
  | 'shared-erp-core'
  | 'login-screen'
  | 'billing-subscription'
  | 'usage-billing'
  | 'overview' 
  | 'ott-platform'
  | 'architecture' 
  | 'shared-core'
  | 'mining-suite'
  | 'fleet-suite'
  | 'materials-suite'
  | 'crm-suite'
  | 'marketplace-suite'
  | 'finance-suite'
  | 'hrms-suite'
  | 'ai-suite'
  | 'platform-suite'
  | 'master-blueprint'
  | 'ui-design-system'
  | 'backend-foundation'
  | 'shared-core-implementation'
  | 'auth-multi-tenant'
  | 'shared-masters-dms'
  | 'notification-communication-engine'
  | 'dashboard-kpi-reporting'
  | 'workflow-approval-audit'
  | 'api-gateway-integration-hub'
  | 'enterprise-admin-tenant-platform'
  | 'devops-cloud-observability'
  | 'core-validation-certification'
  | 'design-system-16k'
  | 'mining-operations-platform'
  | 'fleet-logistics-platform'
  | 'ai-load-exchange-marketplace'
  | 'enterprise-crm-phase20'
  | 'enterprise-marketplace-phase21'
  | 'enterprise-finance-phase22'
  | 'enterprise-hrms-phase23'
  | 'enterprise-ai-phase24'
  | 'enterprise-integration-phase25'
  | 'enterprise-admin-phase26'
  | 'enterprise-enhancement-pack'
  | 'enterprise-mobile-phase27'
  | 'enterprise-portals-phase28'
  | 'rz-chat-phase29'
  | 'domains' 
  | 'database' 
  | 'events' 
  | 'suites' 
  | 'security' 
  | 'structure' 
  | 'blueprint-doc';

export interface PlatformPortal {
  id: string;
  number: number;
  title: string;
  icon: string;
  targetUser: string;
  keyCapabilities: string[];
  coreWorkflows: string[];
  securityScope: string;
}

export interface AiSuiteModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'Command & Copilot' | 'Document & Voice AI' | 'Automation & Rules' | 'Predictive & Decision Intelligence' | 'Search & Knowledge' | 'Security & Governance';
  summary: string;
  subModules: string[];
  keyCapabilities: string[];
  masterDataEntities: string[];
  eventIntegrations: {
    publishes: string[];
    subscribes: string[];
  };
  sharedCoreDependencies: string[];
  aiFeatures?: string[];
}

export interface HrmsSuiteModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'Workforce Core' | 'Attendance & Shifts' | 'Payroll & Settlements' | 'Incentives & Advances' | 'Talent & ESS' | 'Intelligence & Analytics';
  summary: string;
  subModules: string[];
  keyCapabilities: string[];
  masterDataEntities: string[];
  eventIntegrations: {
    publishes: string[];
    subscribes: string[];
  };
  sharedCoreDependencies: string[];
  aiFeatures?: string[];
}

export interface FinanceSuiteModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'Core Financials' | 'Operational Accounting' | 'Assets & Taxation' | 'Control & Intelligence';
  summary: string;
  subModules: string[];
  keyCapabilities: string[];
  masterDataEntities: string[];
  eventIntegrations: {
    publishes: string[];
    subscribes: string[];
  };
  sharedCoreDependencies: string[];
  aiFeatures?: string[];
}

export interface MarketplaceSuiteModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'E-Commerce & Portals' | 'Category Marketplaces' | 'Rentals & Services' | 'Ad Network & Intelligence' | 'Ecosystem Networks';
  summary: string;
  subModules: string[];
  keyCapabilities: string[];
  masterDataEntities: string[];
  eventIntegrations: {
    publishes: string[];
    subscribes: string[];
  };
  sharedCoreDependencies: string[];
  aiFeatures?: string[];
}

export interface CrmSuiteModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'Lead & Opportunity' | 'Sales & Commercial' | 'Partner & Network' | 'Service & Contracts' | 'Marketing & Intelligence';
  summary: string;
  subModules: string[];
  keyCapabilities: string[];
  masterDataEntities: string[];
  eventIntegrations: {
    publishes: string[];
    subscribes: string[];
  };
  sharedCoreDependencies: string[];
  aiFeatures?: string[];
}

export interface BuildingMaterialsSuiteModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'Masters & Catalog' | 'Procurement & Inventory' | 'Sales & Public Ordering' | 'Pricing & Logistics' | 'Finance & Intelligence';
  summary: string;
  subModules: string[];
  keyCapabilities: string[];
  masterDataEntities: string[];
  eventIntegrations: {
    publishes: string[];
    subscribes: string[];
  };
  sharedCoreDependencies: string[];
  aiFeatures?: string[];
}

export interface FleetSuiteModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'Fleet Operations' | 'Drivers & Owners' | 'Logistics & Dispatch' | 'Maintenance & Fuel' | 'Finance & Intelligence';
  summary: string;
  subModules: string[];
  keyCapabilities: string[];
  masterDataEntities: string[];
  eventIntegrations: {
    publishes: string[];
    subscribes: string[];
  };
  sharedCoreDependencies: string[];
  aiFeatures?: string[];
}


export interface MiningSuiteModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'Operations & Quarry' | 'Compliance & Land' | 'Logistics & Dispatch' | 'Fleet & Machinery' | 'Finance & Analytics';
  summary: string;
  subModules: string[];
  keyCapabilities: string[];
  masterDataEntities: string[];
  eventIntegrations: {
    publishes: string[];
    subscribes: string[];
  };
  sharedCoreDependencies: string[];
  aiFeatures?: string[];
}


export interface EntityField {
  name: string;
  type: string;
  isPk?: boolean;
  isFk?: boolean;
  isTenantKey?: boolean;
  isNullable?: boolean;
  description: string;
}

export interface DomainEntity {
  name: string;
  aggregateRoot?: string;
  description: string;
  fields: EntityField[];
  relationships: {
    targetEntity: string;
    type: '1:1' | '1:N' | 'N:M';
    description: string;
  }[];
}

export interface BoundedContextDomain {
  id: string;
  name: string;
  code: string;
  iconName: string;
  color: string;
  description: string;
  aggregateRoots: string[];
  entities: DomainEntity[];
  domainEvents: {
    eventName: string;
    producer: string;
    consumers: string[];
    description: string;
  }[];
}

export interface BusinessSuite {
  id: string;
  name: string;
  code: string;
  tagline: string;
  color: string;
  icon: string;
  description: string;
  modules: {
    name: string;
    description: string;
    keyFeatures: string[];
    sharedCoreDependencies: string[];
  }[];
}

export interface ArchitectureLayer {
  name: string;
  title: string;
  description: string;
  components: {
    name: string;
    tech: string;
    purpose: string;
  }[];
}

export interface SharedCoreModule {
  id: string;
  number: number;
  title: string;
  icon: string;
  category: 'Security & Auth' | 'Data & Multi-Tenancy' | 'Integration & Ops' | 'Intelligence & Workflows';
  summary: string;
  keyResponsibilities: string[];
  serviceBoundaries: string[];
  securityAndPermissions: string[];
  eventStreams: {
    publishes: string[];
    subscribes: string[];
  };
  suiteConsumers: string[];
  techStack: string;
}

