// RZ® Minetrix BOS Post-Phase 26 Enterprise Architecture Enhancement Pack Data

export interface DomainRuntimeSdkRecord {
  id: string;
  sdkModuleName: string;
  category: 'Runtime Core' | 'Transaction Management' | 'Event Bus & Outbox' | 'Plugin Engine';
  status: 'Active Enforced' | 'Pre-compiled';
  latencyImpactMs: number;
  description: string;
}

export interface IntelligenceGovernanceRecord {
  id: string;
  moduleName: string;
  pillar: 'Executive & Digital Twin' | 'AI & Model Governance' | 'GRC & Security Operations (SOC)' | 'Global & Currency Operations';
  kpiHealthMetric: string;
  status: 'Active Live Stream' | 'Synced to Data Lake';
  primaryCapability: string;
}

export interface EnterpriseMissingFeatureRecord {
  id: string;
  featureName: string;
  suiteArea: 'Developer & Marketplace' | 'Low-Code & Design Tools' | 'IoT & Document Edge' | 'Observability & AI Analytics';
  status: 'Deployed & Operational' | 'Configured';
  usageMetric: string;
  description: string;
}

export interface EnhancementPackMetrics {
  totalDomainSDKsActive: number;
  digitalTwinNodesConnected: number;
  activeSagaTransactions: number;
  lowCodeFormsCreated: number;
  globalCurrenciesSupported: number;
  outboxEventSuccessRatePercent: number;
}

// MOCK DATASETS

export const MOCK_DOMAIN_RUNTIME_SDKS: DomainRuntimeSdkRecord[] = [
  {
    id: 'sdk-1',
    sdkModuleName: '@minetrix/domain-sdk-core',
    category: 'Runtime Core',
    status: 'Active Enforced',
    latencyImpactMs: 0.12,
    description: 'Shared Domain SDK providing entity lifecycle, validation, and domain event dispatch wrappers.'
  },
  {
    id: 'sdk-2',
    sdkModuleName: '@minetrix/saga-orchestrator',
    category: 'Transaction Management',
    status: 'Active Enforced',
    latencyImpactMs: 0.45,
    description: 'Distributed Saga Transaction Manager executing two-phase compensation routines across Mining, Fleet & Finance.'
  },
  {
    id: 'sdk-3',
    sdkModuleName: '@minetrix/outbox-idempotency',
    category: 'Event Bus & Outbox',
    status: 'Active Enforced',
    latencyImpactMs: 0.18,
    description: 'Transactional Outbox Pattern & Idempotency Key Validator preventing duplicate dispatch processing.'
  },
  {
    id: 'sdk-4',
    sdkModuleName: '@minetrix/plugin-framework',
    category: 'Plugin Engine',
    status: 'Active Enforced',
    latencyImpactMs: 0.25,
    description: 'Hot-swappable enterprise plugin framework for custom third-party weighbridge and SAP extensions.'
  }
];

export const MOCK_INTELLIGENCE_GOVERNANCE: IntelligenceGovernanceRecord[] = [
  {
    id: 'ig-1',
    moduleName: 'Executive Digital Twin Command Center',
    pillar: 'Executive & Digital Twin',
    kpiHealthMetric: '99.98% Realtime Pit & Fleet Sync',
    status: 'Active Live Stream',
    primaryCapability: 'Real-time 3D spatial simulation of Bhilwara Quarry pits, Crusher plant throughput, and 142 Tippers.'
  },
  {
    id: 'ig-2',
    moduleName: 'Enterprise Data Lake & AI Model Registry',
    pillar: 'AI & Model Governance',
    kpiHealthMetric: '1.2 PB Analytics Stream • Gemini 2.5 Flash',
    status: 'Synced to Data Lake',
    primaryCapability: 'Centralized model versioning, prompt safety filters, cost tracking & AI decision auditing.'
  },
  {
    id: 'ig-3',
    moduleName: 'Security Operations Center (SOC) & GRC',
    pillar: 'GRC & Security Operations (SOC)',
    kpiHealthMetric: 'ISO 27001 & SOC2 Type II Compliant',
    status: 'Active Live Stream',
    primaryCapability: 'Continuous automated threat vector detection, vulnerability assessments & access governance.'
  },
  {
    id: 'ig-4',
    moduleName: 'Global Region & Multi-Currency Engine',
    pillar: 'Global & Currency Operations',
    kpiHealthMetric: '24 Currencies • Realtime FX Hedging',
    status: 'Synced to Data Lake',
    primaryCapability: 'Automated multi-entity consolidation in INR, USD, AED, and EUR for global mineral export orders.'
  }
];

export const MOCK_ENTERPRISE_MISSING_FEATURES: EnterpriseMissingFeatureRecord[] = [
  {
    id: 'emf-1',
    featureName: 'Universal Global Search Engine',
    suiteArea: 'Developer & Marketplace',
    status: 'Deployed & Operational',
    usageMetric: '14,200 Queries / Day',
    description: 'Sub-millisecond full-text vector search indexing mining dispatch slips, invoices, drivers, and equipment.'
  },
  {
    id: 'emf-2',
    featureName: 'Low-Code Drag-and-Drop Workflow & Form Builder',
    suiteArea: 'Low-Code & Design Tools',
    status: 'Deployed & Operational',
    usageMetric: '84 Custom Workflows Active',
    description: 'Visual flowchart editor for custom multi-level gate-pass approvals, credit limit overrides, and safety checks.'
  },
  {
    id: 'emf-3',
    featureName: 'Developer Portal & API/Plugin Marketplace',
    suiteArea: 'Developer & Marketplace',
    status: 'Deployed & Operational',
    usageMetric: '42 Third-Party Connectors',
    description: 'Public Partner SDK documentation portal, OAuth client registration, and rate-limited API key store.'
  },
  {
    id: 'emf-4',
    featureName: 'IoT Device Manager & Edge Gateway Sync',
    suiteArea: 'IoT & Document Edge',
    status: 'Deployed & Operational',
    usageMetric: '184 Sensors Connected',
    description: 'Offline sync buffer for quarry weighbridges, fuel flowmeters, and vibration sensors during network drops.'
  },
  {
    id: 'emf-5',
    featureName: 'Observability Platform (Logs, Metrics & Traces)',
    suiteArea: 'Observability & AI Analytics',
    status: 'Deployed & Operational',
    usageMetric: '100% OpenTelemetry Tracing',
    description: 'Centralized log aggregation, span propagation, and distributed latency profiling across microservices.'
  }
];

export const MOCK_ENHANCEMENT_PACK_METRICS: EnhancementPackMetrics = {
  totalDomainSDKsActive: 14,
  digitalTwinNodesConnected: 342,
  activeSagaTransactions: 1240,
  lowCodeFormsCreated: 84,
  globalCurrenciesSupported: 24,
  outboxEventSuccessRatePercent: 99.99
};
