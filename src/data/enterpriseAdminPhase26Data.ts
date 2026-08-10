// RZ® Minetrix BOS Phase 26 - Enterprise Administration, Governance, Security, DevOps & SaaS Platform Data

export interface TenantMasterRecord {
  id: string;
  tenantCode: string;
  tenantName: string;
  subdomain: string;
  planName: 'Enterprise Ultimate' | 'Pro Mining & Fleet' | 'Commercial Quarry';
  databaseIsolation: 'Dedicated Schema (RLS Enforced)' | 'Dedicated Cloud SQL Database';
  storageQuotaGb: number;
  storageUsedGb: number;
  activeUsersCount: number;
  maxUserSeats: number;
  status: 'Active' | 'Suspended (Payment Overdue)' | 'Provisioning';
  createdAt: string;
}

export interface CompanyStructureRecord {
  id: string;
  companyCode: string;
  companyName: string;
  parentGroup: string;
  activeBranchesCount: number;
  businessUnits: string[];
  headquartersLocation: string;
  gstinRegistration: string;
}

export interface UserAccountRecord {
  id: string;
  userCode: string;
  fullName: string;
  email: string;
  assignedRole: 'Global Super Admin' | 'Mining Operations Director' | 'Fleet Dispatch Manager' | 'Chief Financial Officer' | 'Auditor & Compliance Officer';
  department: string;
  mfaStatus: 'MFA Hardware Key Active' | 'TOTP Authenticator' | 'SMS OTP Enforced';
  ssoConnected: boolean;
  lastLogin: string;
  accountStatus: 'Active' | 'Locked (Failed Attempts)' | 'Disabled';
}

export interface SecurityThreatRecord {
  id: string;
  threatCode: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  threatType: 'Brute Force API Attempt' | 'Unusual IP Geofence Anomaly' | 'Privilege Escalation Alert' | 'Expired TLS Cert Alert';
  targetResource: string;
  ipAddressOrigin: string;
  mitigationActionTaken: string;
  detectedAt: string;
}

export interface SubscriptionBillingRecord {
  id: string;
  invoiceCode: string;
  tenantName: string;
  planName: string;
  billingCycle: 'Annual Enterprise Escrow' | 'Monthly Auto-Debit';
  amountRs: number;
  paymentStatus: 'Paid & Reconciled' | 'Pending Invoice' | 'Processing Escrow';
  renewalDate: string;
}

export interface SystemHealthNodeRecord {
  id: string;
  subsystemName: 'API Gateway Cluster' | 'PostgreSQL Primary Cluster' | 'Redis Message Queue Workers' | 'Gemini AI Copilot Service' | 'Weighbridge IoT MQTT Broker';
  status: '100% Operational' | 'Degraded Performance' | 'Scheduled Maintenance';
  uptime90DaysPercent: number;
  cpuLoadPercent: number;
  ramUsagePercent: number;
  activeConnections: number;
}

export interface FeatureFlagRecord {
  id: string;
  flagKey: string;
  featureName: string;
  category: 'AI Copilot' | 'IoT Telemetry' | 'GST Automation' | 'Marketplace Load Exchange';
  rolloutPercent: number;
  isEnabled: boolean;
  environment: 'Production' | 'Staging' | 'Beta Sandbox';
}

export interface BackupRecoveryRecord {
  id: string;
  backupCode: string;
  tenantCode: string;
  backupType: 'Automated Point-in-time Snapshot' | 'Full Database Dump' | 'Encrypted Cold Vault';
  sizeGb: number;
  restoreVerifiedStatus: '100% Integrity Verified' | 'Verification Pending';
  timestamp: string;
}

export interface DevopsReleaseRecord {
  id: string;
  versionTag: string;
  releaseTitle: string;
  deployEnvironment: 'Production Cloud Run' | 'Staging Integration';
  deployedBy: string;
  buildStatus: 'Successfully Deployed (0 Errors)' | 'Rolling Back';
  deployedAt: string;
}

export interface SystemAdminMetrics {
  totalTenantsActive: number;
  totalRegisteredUsers: number;
  totalSystemUptimePercent: number;
  activeSecurityIncidents: number;
  monthlyRecurringRevenueRs: number;
  databaseStorageUsedTb: number;
  activeFeatureFlags: number;
}

// MOCK DATASETS

export const MOCK_TENANTS: TenantMasterRecord[] = [
  {
    id: 't-1',
    tenantCode: 'TNT-BHILWARA-01',
    tenantName: 'Bhilwara Mining & Aggregates Pvt Ltd',
    subdomain: 'bhilwara.minetrixbos.com',
    planName: 'Enterprise Ultimate',
    databaseIsolation: 'Dedicated Schema (RLS Enforced)',
    storageQuotaGb: 2000,
    storageUsedGb: 485.2,
    activeUsersCount: 142,
    maxUserSeats: 250,
    status: 'Active',
    createdAt: '2025-01-15'
  },
  {
    id: 't-2',
    tenantCode: 'TNT-RAJSAMAND-02',
    tenantName: 'Rajsamand Granite & Infrastructure Corp',
    subdomain: 'rajsamand.minetrixbos.com',
    planName: 'Pro Mining & Fleet',
    databaseIsolation: 'Dedicated Schema (RLS Enforced)',
    storageQuotaGb: 1000,
    storageUsedGb: 210.8,
    activeUsersCount: 68,
    maxUserSeats: 100,
    status: 'Active',
    createdAt: '2025-03-20'
  },
  {
    id: 't-3',
    tenantCode: 'TNT-UDAIPUR-03',
    tenantName: 'Mewar Stone & Crusher Infra Enterprise',
    subdomain: 'mewar.minetrixbos.com',
    planName: 'Commercial Quarry',
    databaseIsolation: 'Dedicated Cloud SQL Database',
    storageQuotaGb: 500,
    storageUsedGb: 88.4,
    activeUsersCount: 24,
    maxUserSeats: 50,
    status: 'Active',
    createdAt: '2025-06-10'
  }
];

export const MOCK_COMPANIES: CompanyStructureRecord[] = [
  {
    id: 'c-1',
    companyCode: 'CMP-MINETRIX-HQ',
    companyName: 'RZ® Minetrix Enterprise Holdings',
    parentGroup: 'RaceZone Ventures Global',
    activeBranchesCount: 8,
    businessUnits: ['Mining Quarry Division', 'Heavy Fleet Logistics', 'Building Materials Infra', 'Commercial CRM'],
    headquartersLocation: 'Jaipur & Bhilwara Hub, Rajasthan',
    gstinRegistration: '08AAAAA0000A1Z5'
  }
];

export const MOCK_USER_ACCOUNTS: UserAccountRecord[] = [
  {
    id: 'usr-1',
    userCode: 'USR-ADMIN-01',
    fullName: 'Vikramaditya Singh',
    email: 'v.singh@minetrixbos.com',
    assignedRole: 'Global Super Admin',
    department: 'Enterprise Platform Engineering',
    mfaStatus: 'MFA Hardware Key Active',
    ssoConnected: true,
    lastLogin: 'Active Now (2 mins ago)',
    accountStatus: 'Active'
  },
  {
    id: 'usr-2',
    userCode: 'USR-MINING-02',
    fullName: 'Rajendra Prasad Sharma',
    email: 'r.sharma@bhilwara-mines.com',
    assignedRole: 'Mining Operations Director',
    department: 'Quarry Operations',
    mfaStatus: 'TOTP Authenticator',
    ssoConnected: true,
    lastLogin: 'Today, 09:15 AM',
    accountStatus: 'Active'
  },
  {
    id: 'usr-3',
    userCode: 'USR-FIN-03',
    fullName: 'Ananya Deshmukh',
    email: 'a.deshmukh@minetrixbos.com',
    assignedRole: 'Chief Financial Officer',
    department: 'Finance & Treasury',
    mfaStatus: 'MFA Hardware Key Active',
    ssoConnected: true,
    lastLogin: 'Today, 08:30 AM',
    accountStatus: 'Active'
  }
];

export const MOCK_SECURITY_THREATS: SecurityThreatRecord[] = [
  {
    id: 'sec-1',
    threatCode: 'SEC-BRUTE-001',
    severity: 'Medium',
    threatType: 'Brute Force API Attempt',
    targetResource: '/api/v1/auth/login',
    ipAddressOrigin: '103.211.218.42 (Flagged ISP)',
    mitigationActionTaken: 'IP Rate Limited & Blocked in Cloud Armor Web Application Firewall (WAF)',
    detectedAt: '12 mins ago'
  },
  {
    id: 'sec-2',
    threatCode: 'SEC-TLS-002',
    severity: 'Low',
    threatType: 'Expired TLS Cert Alert',
    targetResource: 'staging-api.minetrixbos.com',
    ipAddressOrigin: 'Internal Automated Cert Scanner',
    mitigationActionTaken: 'Auto-renewed Let\'s Encrypt TLS Certificate via Vault Cert-Manager',
    detectedAt: '1 hour ago'
  }
];

export const MOCK_SUBSCRIPTIONS: SubscriptionBillingRecord[] = [
  {
    id: 'sub-1',
    invoiceCode: 'INV-2026-AUG-001',
    tenantName: 'Bhilwara Mining & Aggregates Pvt Ltd',
    planName: 'Enterprise Ultimate (250 Seats)',
    billingCycle: 'Annual Enterprise Escrow',
    amountRs: 1850000,
    paymentStatus: 'Paid & Reconciled',
    renewalDate: '2027-01-15'
  },
  {
    id: 'sub-2',
    invoiceCode: 'INV-2026-AUG-002',
    tenantName: 'Rajsamand Granite & Infrastructure Corp',
    planName: 'Pro Mining & Fleet (100 Seats)',
    billingCycle: 'Monthly Auto-Debit',
    amountRs: 145000,
    paymentStatus: 'Paid & Reconciled',
    renewalDate: '2026-09-20'
  }
];

export const MOCK_SYSTEM_HEALTH_NODES: SystemHealthNodeRecord[] = [
  {
    id: 'sys-1',
    subsystemName: 'API Gateway Cluster',
    status: '100% Operational',
    uptime90DaysPercent: 99.99,
    cpuLoadPercent: 18.4,
    ramUsagePercent: 32.1,
    activeConnections: 4820
  },
  {
    id: 'sys-2',
    subsystemName: 'PostgreSQL Primary Cluster',
    status: '100% Operational',
    uptime90DaysPercent: 99.98,
    cpuLoadPercent: 24.8,
    ramUsagePercent: 54.2,
    activeConnections: 184
  },
  {
    id: 'sys-3',
    subsystemName: 'Redis Message Queue Workers',
    status: '100% Operational',
    uptime90DaysPercent: 100.0,
    cpuLoadPercent: 12.1,
    ramUsagePercent: 28.0,
    activeConnections: 840
  },
  {
    id: 'sys-4',
    subsystemName: 'Gemini AI Copilot Service',
    status: '100% Operational',
    uptime90DaysPercent: 99.95,
    cpuLoadPercent: 35.6,
    ramUsagePercent: 48.9,
    activeConnections: 64
  },
  {
    id: 'sys-5',
    subsystemName: 'Weighbridge IoT MQTT Broker',
    status: '100% Operational',
    uptime90DaysPercent: 99.99,
    cpuLoadPercent: 9.2,
    ramUsagePercent: 18.4,
    activeConnections: 184
  }
];

export const MOCK_FEATURE_FLAGS: FeatureFlagRecord[] = [
  {
    id: 'ff-1',
    flagKey: 'ENABLE_MCP_PROTOCOL_ROUTER',
    featureName: 'Model Context Protocol (MCP) AI Tool Router',
    category: 'AI Copilot',
    rolloutPercent: 100,
    isEnabled: true,
    environment: 'Production'
  },
  {
    id: 'ff-2',
    flagKey: 'ENABLE_WEIGHBRIDGE_AUTO_CAM',
    featureName: 'Vision AI License Plate & ANPR Auto-Weighbridge',
    category: 'IoT Telemetry',
    rolloutPercent: 50,
    isEnabled: true,
    environment: 'Production'
  },
  {
    id: 'ff-3',
    flagKey: 'ENABLE_DYNAMIC_FREIGHT_SURCHARGE',
    featureName: 'AI Dynamic Freight Fuel Surcharge Calculator',
    category: 'Marketplace Load Exchange',
    rolloutPercent: 100,
    isEnabled: true,
    environment: 'Production'
  }
];

export const MOCK_BACKUP_RECOVERY: BackupRecoveryRecord[] = [
  {
    id: 'bak-1',
    backupCode: 'BAK-2026-0807-001',
    tenantCode: 'TNT-BHILWARA-01',
    backupType: 'Automated Point-in-time Snapshot',
    sizeGb: 485.2,
    restoreVerifiedStatus: '100% Integrity Verified',
    timestamp: 'Today, 02:00 AM'
  },
  {
    id: 'bak-2',
    backupCode: 'BAK-2026-0807-002',
    tenantCode: 'TNT-RAJSAMAND-02',
    backupType: 'Encrypted Cold Vault',
    sizeGb: 210.8,
    restoreVerifiedStatus: '100% Integrity Verified',
    timestamp: 'Today, 02:30 AM'
  }
];

export const MOCK_DEVOPS_RELEASES: DevopsReleaseRecord[] = [
  {
    id: 'rel-1',
    versionTag: 'v26.0.0-RELEASE',
    releaseTitle: 'Phase 26 Enterprise SaaS Control Center & Governance Platform',
    deployEnvironment: 'Production Cloud Run',
    deployedBy: 'CI/CD Automated Pipeline',
    buildStatus: 'Successfully Deployed (0 Errors)',
    deployedAt: '2026-08-07 08:00 AM'
  },
  {
    id: 'rel-2',
    versionTag: 'v25.4.2-PATCH',
    releaseTitle: 'Phase 25 Gateway mTLS & Razorpay Webhook Patch',
    deployEnvironment: 'Production Cloud Run',
    deployedBy: 'Vikramaditya Singh',
    buildStatus: 'Successfully Deployed (0 Errors)',
    deployedAt: '2026-08-06 11:30 PM'
  }
];

export const MOCK_ADMIN_METRICS: SystemAdminMetrics = {
  totalTenantsActive: 3,
  totalRegisteredUsers: 234,
  totalSystemUptimePercent: 99.98,
  activeSecurityIncidents: 0,
  monthlyRecurringRevenueRs: 1995000,
  databaseStorageUsedTb: 0.784,
  activeFeatureFlags: 18
};
