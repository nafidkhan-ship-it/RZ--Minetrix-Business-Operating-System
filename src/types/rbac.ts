/**
 * RZ® MINETRIX BOS - Reusable RBAC Permission Architecture
 * Permission format: MODULE.ACTION (e.g., QUARRY.VIEW, VEHICLE.CREATE, ORDER.APPROVE)
 * 24 Standard Roles controlling Dashboard, Navigation, Actions, and Cross-Platform OTT.
 */

import { UserRole } from './auth';

export type PermissionModule =
  | 'QUARRY'
  | 'CRUSHER'
  | 'VEHICLE'
  | 'JOB'
  | 'ORDER'
  | 'LATERITE'
  | 'MARKETPLACE'
  | 'LAND'
  | 'CHAT'
  | 'OTT'
  | 'FINANCE'
  | 'HR'
  | 'STORE'
  | 'DOCUMENT'
  | 'REPORT'
  | 'AUTOMATION'
  | 'SECURITY';

export type PermissionAction =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'DELETE'
  | 'APPROVE'
  | 'REJECT'
  | 'EXPORT'
  | 'ASSIGN'
  | 'DISPATCH'
  | 'SEND'
  | 'COMPLETE'
  | 'MAINTAIN'
  | 'BILL'
  | 'AUDIT';

export type PermissionString = `${PermissionModule}.${PermissionAction}` | '*';

export type RoleCategory =
  | 'EXECUTIVE'
  | 'OPERATIONS'
  | 'COMMERCIAL_SUPPLY'
  | 'FINANCE_HR'
  | 'EXTERNAL_PARTNER';

export interface RoleDefinition {
  role: UserRole;
  title: string;
  category: RoleCategory;
  description: string;
  welcomeGreeting: string;
  defaultSection: string;
  allowedNav: string[];
  permissions: string[];
  samplePersona: {
    name: string;
    email: string;
    phone: string;
    designation: string;
    unit: string;
  };
}

export const ALL_DEMO_ROLES: RoleDefinition[] = [
  {
    role: 'SUPER_ADMIN',
    title: 'Super Admin',
    category: 'EXECUTIVE',
    description: 'Full platform access, organizations, users, system settings, API, automation, audit, and all 9 platforms.',
    welcomeGreeting: 'Welcome, Super Admin',
    defaultSection: 'overview',
    allowedNav: ['*'],
    permissions: ['*'],
    samplePersona: {
      name: 'Nafid Khan',
      email: 'superadmin@rzminetrix.com',
      phone: '+91 98470 12001',
      designation: 'Master System Administrator',
      unit: 'Global Platform Operations'
    }
  },
  {
    role: 'OWNER',
    title: 'Owner',
    category: 'EXECUTIVE',
    description: 'Executive overview, consolidated finance, P&L, production, sales, fleet, jobs, OTT, reports, and strategic alerts.',
    welcomeGreeting: 'Welcome, Owner',
    defaultSection: 'home-dashboard',
    allowedNav: ['home-dashboard', 'quarry-management', 'crusher-management', 'vehicle-management', 'contract-job-management', 'building-materials-ecommerce', 'used-machinery-marketplace', 'quarry-land-management', 'rz-chating', 'rz-ott', 'finance-suite', 'dashboard-kpi-reporting'],
    permissions: ['QUARRY.VIEW', 'QUARRY.APPROVE', 'CRUSHER.VIEW', 'VEHICLE.VIEW', 'JOB.VIEW', 'JOB.APPROVE', 'ORDER.VIEW', 'ORDER.APPROVE', 'FINANCE.VIEW', 'FINANCE.APPROVE', 'FINANCE.EXPORT', 'REPORT.VIEW', 'REPORT.EXPORT', 'OTT.VIEW', 'OTT.CREATE', 'OTT.COMPLETE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Nafid Khan',
      email: 'owner@racezoneventures.com',
      phone: '+91 98470 12000',
      designation: 'Managing Director & Concession Owner',
      unit: 'Racezone Industrial Ventures'
    }
  },
  {
    role: 'DIRECTOR',
    title: 'Director',
    category: 'EXECUTIVE',
    description: 'Executive dashboard across business units, capital investments, contracts, macro sales, and OTT strategic oversight.',
    welcomeGreeting: 'Welcome, Director',
    defaultSection: 'home-dashboard',
    allowedNav: ['home-dashboard', 'quarry-management', 'crusher-management', 'vehicle-management', 'contract-job-management', 'building-materials-ecommerce', 'finance-suite', 'dashboard-kpi-reporting', 'rz-ott'],
    permissions: ['QUARRY.VIEW', 'CRUSHER.VIEW', 'VEHICLE.VIEW', 'JOB.VIEW', 'JOB.APPROVE', 'FINANCE.VIEW', 'FINANCE.APPROVE', 'REPORT.VIEW', 'REPORT.EXPORT', 'OTT.VIEW', 'OTT.CREATE'],
    samplePersona: {
      name: 'Fahad Al-Maktoum',
      email: 'director@rzminetrix.com',
      phone: '+91 98470 12002',
      designation: 'Board Director & Strategy Lead',
      unit: 'Executive Committee'
    }
  },
  {
    role: 'ADMIN',
    title: 'Admin',
    category: 'EXECUTIVE',
    description: 'Tenant administration, user provisioning, role RBAC permissions, master data, audit logs, and document workflows.',
    welcomeGreeting: 'Welcome, Admin',
    defaultSection: 'home-dashboard',
    allowedNav: ['home-dashboard', 'auth-multi-tenant', 'workflow-approval-audit', 'shared-masters-dms', 'rz-ott', 'security', 'api-gateway-integration-hub'],
    permissions: ['SECURITY.VIEW', 'SECURITY.AUDIT', 'DOCUMENT.VIEW', 'DOCUMENT.UPLOAD', 'DOCUMENT.APPROVE', 'OTT.VIEW', 'OTT.CREATE', 'OTT.ASSIGN', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Sarah Mathew',
      email: 'admin@rzminetrix.com',
      phone: '+91 98470 12003',
      designation: 'Enterprise Systems Administrator',
      unit: 'IT & Governance'
    }
  },
  {
    role: 'GENERAL_MANAGER',
    title: 'General Manager',
    category: 'EXECUTIVE',
    description: 'Operational command across quarry pits, crusher lines, vehicle fleet, job progress, workforce, and inter-site approvals.',
    welcomeGreeting: 'Welcome, General Manager',
    defaultSection: 'home-dashboard',
    allowedNav: ['home-dashboard', 'quarry-management', 'crusher-management', 'vehicle-management', 'contract-job-management', 'building-materials-ecommerce', 'hrms-suite', 'rz-ott', 'rz-chating'],
    permissions: ['QUARRY.VIEW', 'QUARRY.CREATE', 'QUARRY.APPROVE', 'CRUSHER.VIEW', 'CRUSHER.APPROVE', 'VEHICLE.VIEW', 'VEHICLE.APPROVE', 'JOB.VIEW', 'JOB.APPROVE', 'ORDER.VIEW', 'HR.VIEW', 'OTT.VIEW', 'OTT.CREATE', 'OTT.ASSIGN', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'Col. K.S. Rathore',
      email: 'gm@rzminetrix.com',
      phone: '+91 94470 44011',
      designation: 'General Manager - Regional Operations',
      unit: 'South Concession Operations'
    }
  },
  {
    role: 'MANAGER',
    title: 'Manager',
    category: 'OPERATIONS',
    description: 'Day-to-day site operations, daily production quotas, vehicle dispatches, task assignments, and site approvals.',
    welcomeGreeting: 'Welcome, Manager',
    defaultSection: 'quarry-management',
    allowedNav: ['home-dashboard', 'quarry-management', 'crusher-management', 'vehicle-management', 'contract-job-management', 'rz-ott', 'rz-chating'],
    permissions: ['QUARRY.VIEW', 'QUARRY.CREATE', 'QUARRY.EDIT', 'CRUSHER.VIEW', 'CRUSHER.EDIT', 'VEHICLE.VIEW', 'VEHICLE.ASSIGN', 'JOB.VIEW', 'OTT.VIEW', 'OTT.CREATE', 'OTT.ASSIGN', 'OTT.COMPLETE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Rajesh Nambiar',
      email: 'quarry.manager@rzminetrix.com',
      phone: '+91 94470 33812',
      designation: 'Quarry & Operations Site Manager',
      unit: 'Kasaragod Pit 01'
    }
  },
  {
    role: 'ACCOUNTANT',
    title: 'Accountant',
    category: 'FINANCE_HR',
    description: 'General ledger, tax invoices, GST e-Way bills, accounts receivable, vendor payables, quarry expenses, and financial reconciliation.',
    welcomeGreeting: 'Welcome, Accountant',
    defaultSection: 'finance-suite',
    allowedNav: ['home-dashboard', 'finance-suite', 'building-materials-ecommerce', 'shared-masters-dms', 'rz-ott', 'dashboard-kpi-reporting'],
    permissions: ['FINANCE.VIEW', 'FINANCE.CREATE', 'FINANCE.EDIT', 'FINANCE.APPROVE', 'FINANCE.EXPORT', 'ORDER.VIEW', 'JOB.VIEW', 'REPORT.VIEW', 'REPORT.EXPORT', 'OTT.VIEW', 'OTT.CREATE', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'Sneha Menon, FCA',
      email: 'accounts@rzminetrix.com',
      phone: '+91 94471 88022',
      designation: 'Head of Accounts & Taxation',
      unit: 'Finance & Compliance'
    }
  },
  {
    role: 'HR',
    title: 'HR',
    category: 'FINANCE_HR',
    description: 'Workforce records, biometric shift attendance, Saturday wage settlements, driver trip batta, leave approvals, and contracts.',
    welcomeGreeting: 'Welcome, HR',
    defaultSection: 'hrms-suite',
    allowedNav: ['home-dashboard', 'hrms-suite', 'shared-masters-dms', 'rz-ott', 'rz-chating'],
    permissions: ['HR.VIEW', 'HR.CREATE', 'HR.EDIT', 'HR.PAYROLL', 'DOCUMENT.VIEW', 'DOCUMENT.UPLOAD', 'OTT.VIEW', 'OTT.CREATE', 'OTT.ASSIGN', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Priya Nair',
      email: 'hr@rzminetrix.com',
      phone: '+91 94472 55190',
      designation: 'Human Resources & Talent Officer',
      unit: 'People & Operations'
    }
  },
  {
    role: 'SUPERVISOR',
    title: 'Supervisor',
    category: 'OPERATIONS',
    description: 'On-bench quarry cutting, drill/blast monitoring, crusher plant feed rates, shift workers, and real-time weighbridge passes.',
    welcomeGreeting: 'Welcome, Supervisor',
    defaultSection: 'quarry-management',
    allowedNav: ['home-dashboard', 'quarry-management', 'crusher-management', 'vehicle-management', 'rz-ott', 'rz-chating'],
    permissions: ['QUARRY.VIEW', 'QUARRY.CREATE', 'QUARRY.EDIT', 'CRUSHER.VIEW', 'VEHICLE.VIEW', 'OTT.VIEW', 'OTT.CREATE', 'OTT.COMPLETE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Ramesh Gowda',
      email: 'supervisor@rzminetrix.com',
      phone: '+91 94473 11823',
      designation: 'Pit Bench & Extraction Supervisor',
      unit: 'Pit 01 South Section'
    }
  },
  {
    role: 'OPERATOR',
    title: 'Operator',
    category: 'OPERATIONS',
    description: 'Excavator, wire-saw, breaker machine, and crusher plant console operations with run-hours logging and breakdown reporting.',
    welcomeGreeting: 'Welcome, Operator',
    defaultSection: 'crusher-management',
    allowedNav: ['home-dashboard', 'crusher-management', 'quarry-management', 'rz-ott'],
    permissions: ['CRUSHER.VIEW', 'CRUSHER.MAINTAIN', 'QUARRY.VIEW', 'OTT.VIEW', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'Sunil Kurian',
      email: 'operator@rzminetrix.com',
      phone: '+91 98471 99201',
      designation: 'Heavy Plant & Crusher Console Operator',
      unit: 'Wayanad VSI Plant'
    }
  },
  {
    role: 'DRIVER',
    title: 'Driver',
    category: 'OPERATIONS',
    description: 'Assigned tipper trips, active load passes, digital weighbridge slips, GPS route, fuel logs, and trip batta incentives.',
    welcomeGreeting: 'Welcome, Driver',
    defaultSection: 'vehicle-management',
    allowedNav: ['home-dashboard', 'vehicle-management', 'rz-ott', 'rz-chating'],
    permissions: ['VEHICLE.VIEW', 'OTT.VIEW', 'OTT.COMPLETE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Jaleel Ahmed',
      email: 'driver.jaleel@rzminetrix.com',
      phone: '+91 97455 22091',
      designation: 'Senior Heavy Tipper Pilot (KL-14-Y-9201)',
      unit: 'Logistics Fleet Hub'
    }
  },
  {
    role: 'STAFF',
    title: 'Staff',
    category: 'OPERATIONS',
    description: 'General site administration, gate pass issuance, attendance check-in, routine work logs, and team communication.',
    welcomeGreeting: 'Welcome, Staff',
    defaultSection: 'home-dashboard',
    allowedNav: ['home-dashboard', 'rz-ott', 'rz-chating', 'shared-masters-dms'],
    permissions: ['DOCUMENT.VIEW', 'OTT.VIEW', 'OTT.COMPLETE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Manoj Pillai',
      email: 'staff@rzminetrix.com',
      phone: '+91 94474 88391',
      designation: 'Administrative Staff & Weighbridge Clerk',
      unit: 'Site Office - Wayanad'
    }
  },
  {
    role: 'SALES',
    title: 'Sales',
    category: 'COMMERCIAL_SUPPLY',
    description: 'Customer leads, laterite stone quotations, aggregate price sheets, building material orders, collections, and CRM.',
    welcomeGreeting: 'Welcome, Sales',
    defaultSection: 'building-materials-ecommerce',
    allowedNav: ['home-dashboard', 'building-materials-ecommerce', 'crm-suite', 'rz-ott', 'rz-chating'],
    permissions: ['ORDER.VIEW', 'ORDER.CREATE', 'LATERITE.ORDER', 'LATERITE.SUPPLY', 'OTT.VIEW', 'OTT.CREATE', 'OTT.COMPLETE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Anand Varma',
      email: 'sales@rzminetrix.com',
      phone: '+91 98475 33019',
      designation: 'Key Account Commercial Sales Lead',
      unit: 'Commercial Sales Division'
    }
  },
  {
    role: 'PURCHASE',
    title: 'Purchase',
    category: 'COMMERCIAL_SUPPLY',
    description: 'Supplier onboarding, RFQ quotations, purchase orders for diesel, explosives, breaker chisels, wire ropes, and GRN clearance.',
    welcomeGreeting: 'Welcome, Purchase',
    defaultSection: 'crm-suite',
    allowedNav: ['home-dashboard', 'crm-suite', 'building-materials-ecommerce', 'rz-ott', 'rz-chating'],
    permissions: ['ORDER.VIEW', 'ORDER.CREATE', 'DOCUMENT.VIEW', 'OTT.VIEW', 'OTT.CREATE', 'OTT.COMPLETE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Deepak Sharma',
      email: 'purchase@rzminetrix.com',
      phone: '+91 98476 11204',
      designation: 'Procurement & Materials Officer',
      unit: 'Central Procurement'
    }
  },
  {
    role: 'STORE',
    title: 'Store',
    category: 'OPERATIONS',
    description: 'Spare parts inventory, drill bits, conveyor belts, lubricants, material issue slips, stock level alerts, and yard bins.',
    welcomeGreeting: 'Welcome, Store',
    defaultSection: 'shared-core',
    allowedNav: ['home-dashboard', 'shared-core', 'quarry-management', 'crusher-management', 'rz-ott'],
    permissions: ['STORE.VIEW', 'STORE.CREATE', 'STORE.EDIT', 'OTT.VIEW', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'Girish Babu',
      email: 'store@rzminetrix.com',
      phone: '+91 98477 44102',
      designation: 'Central Stores & Yard Custodian',
      unit: 'Mines Depot Store'
    }
  },
  {
    role: 'DISPATCH',
    title: 'Dispatch',
    category: 'OPERATIONS',
    description: 'Weighbridge gross/tare weighing, royalty e-pass verification, vehicle loading, driver pass hand-off, and delivery status.',
    welcomeGreeting: 'Welcome, Dispatch',
    defaultSection: 'quarry-management',
    allowedNav: ['home-dashboard', 'quarry-management', 'crusher-management', 'vehicle-management', 'building-materials-ecommerce', 'rz-ott'],
    permissions: ['ORDER.VIEW', 'ORDER.DISPATCH', 'LATERITE.DISPATCH', 'VEHICLE.VIEW', 'OTT.VIEW', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'Muhammed Shafi',
      email: 'dispatch@rzminetrix.com',
      phone: '+91 98478 99105',
      designation: 'Chief Weighbridge & Dispatch Officer',
      unit: 'Gate #1 Weighbridge Depot'
    }
  },
  {
    role: 'MARKETING',
    title: 'Marketing',
    category: 'COMMERCIAL_SUPPLY',
    description: 'Product listings, stone specifications, regional campaigns, marketplace enquiries, lead generation, and social promotions.',
    welcomeGreeting: 'Welcome, Marketing',
    defaultSection: 'building-materials-ecommerce',
    allowedNav: ['home-dashboard', 'building-materials-ecommerce', 'used-machinery-marketplace', 'rz-ott', 'rz-chating'],
    permissions: ['MARKETPLACE.VIEW', 'MARKETPLACE.LIST', 'OTT.VIEW', 'OTT.CREATE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Aishwarya Roy',
      email: 'marketing@rzminetrix.com',
      phone: '+91 98479 66108',
      designation: 'Digital Marketing & Growth Manager',
      unit: 'Brand & E-Commerce'
    }
  },
  {
    role: 'CONTRACTOR',
    title: 'Contractor',
    category: 'EXTERNAL_PARTNER',
    description: 'Assigned construction jobs, work orders, stone cutting requirements, progress milestone submission, subcontractor billing, and OTT.',
    welcomeGreeting: 'Welcome, Contractor',
    defaultSection: 'contract-job-management',
    allowedNav: ['home-dashboard', 'contract-job-management', 'building-materials-ecommerce', 'rz-chating', 'rz-ott'],
    permissions: ['JOB.VIEW', 'JOB.EDIT', 'JOB.BILL', 'LATERITE.ORDER', 'OTT.VIEW', 'OTT.COMPLETE', 'CHAT.VIEW', 'CHAT.SEND'],
    samplePersona: {
      name: 'Abdul Salam',
      email: 'salam.infra@contractors.in',
      phone: '+91 98480 33410',
      designation: 'Class-A Civil Contractor & Infrastructure Builder',
      unit: 'Salam Infrastructure Projects'
    }
  },
  {
    role: 'CUSTOMER',
    title: 'Customer',
    category: 'EXTERNAL_PARTNER',
    description: 'Browse building materials, order laterite stone directly from verified quarries, track tipper delivery, and download tax invoices.',
    welcomeGreeting: 'Welcome, Customer',
    defaultSection: 'building-materials-ecommerce',
    allowedNav: ['home-dashboard', 'building-materials-ecommerce', 'rz-chating', 'rz-ott'],
    permissions: ['ORDER.VIEW', 'ORDER.CREATE', 'LATERITE.ORDER', 'CHAT.VIEW', 'CHAT.SEND', 'OTT.VIEW', 'OTT.CREATE'],
    samplePersona: {
      name: 'Arjun Varma',
      email: 'arjun.varma@gmail.com',
      phone: '+91 98481 22914',
      designation: 'Private Villa & Home Builder',
      unit: 'Kannur Coastal Project'
    }
  },
  {
    role: 'SUPPLIER',
    title: 'Supplier',
    category: 'EXTERNAL_PARTNER',
    description: 'Building materials catalog, bulk laterite supply, aggregates availability, incoming buyer purchase orders, and payment tracking.',
    welcomeGreeting: 'Welcome, Supplier',
    defaultSection: 'building-materials-ecommerce',
    allowedNav: ['home-dashboard', 'building-materials-ecommerce', 'crm-suite', 'rz-chating', 'rz-ott'],
    permissions: ['ORDER.VIEW', 'ORDER.APPROVE', 'LATERITE.SUPPLY', 'CHAT.VIEW', 'CHAT.SEND', 'OTT.VIEW', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'K. Mahaveer Jain',
      email: 'sales@mahaveeraggregates.com',
      phone: '+91 98482 77011',
      designation: 'Commercial Director & Aggregate Supplier',
      unit: 'Mahaveer Quarry & Stone Supplies'
    }
  },
  {
    role: 'SELLER',
    title: 'Seller',
    category: 'EXTERNAL_PARTNER',
    description: 'List used quarry machinery, excavators, tipper trucks, crusher screens, buyer enquiries, deal negotiations, and escrow documents.',
    welcomeGreeting: 'Welcome, Seller',
    defaultSection: 'used-machinery-marketplace',
    allowedNav: ['home-dashboard', 'used-machinery-marketplace', 'rz-chating', 'rz-ott'],
    permissions: ['MARKETPLACE.VIEW', 'MARKETPLACE.LIST', 'CHAT.VIEW', 'CHAT.SEND', 'OTT.VIEW', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'Biju Thomas',
      email: 'biju@malabarmachinery.com',
      phone: '+91 98483 55902',
      designation: 'Certified Used Heavy Equipment Dealer',
      unit: 'Malabar Heavy Machinery Mart'
    }
  },
  {
    role: 'BUYER',
    title: 'Buyer',
    category: 'EXTERNAL_PARTNER',
    description: 'Search used machinery & commercial tippers, inspect inspection certificates, negotiate verified prices, and chat directly with sellers.',
    welcomeGreeting: 'Welcome, Buyer',
    defaultSection: 'used-machinery-marketplace',
    allowedNav: ['home-dashboard', 'used-machinery-marketplace', 'building-materials-ecommerce', 'rz-chating', 'rz-ott'],
    permissions: ['MARKETPLACE.VIEW', 'MARKETPLACE.BUY', 'LATERITE.ORDER', 'CHAT.VIEW', 'CHAT.SEND', 'OTT.VIEW', 'OTT.CREATE'],
    samplePersona: {
      name: 'George K. Mathew',
      email: 'george@highlandquarries.in',
      phone: '+91 98484 11903',
      designation: 'Quarry Owner & Fleet Investor',
      unit: 'Highland Minerals & Stones'
    }
  },
  {
    role: 'LAND_OWNER',
    title: 'Land Owner',
    category: 'EXTERNAL_PARTNER',
    description: 'List quarry potential land, survey maps, lease or sale opportunities, review investor enquiries, and execute joint ventures.',
    welcomeGreeting: 'Welcome, Land Owner',
    defaultSection: 'quarry-land-management',
    allowedNav: ['home-dashboard', 'quarry-land-management', 'rz-chating', 'rz-ott'],
    permissions: ['LAND.VIEW', 'LAND.LIST', 'LAND.ENQUIRE', 'LAND.DEAL', 'CHAT.VIEW', 'CHAT.SEND', 'OTT.VIEW', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'K.V. Moideen Haji',
      email: 'moideen.land@keralaproperties.org',
      phone: '+91 98485 88910',
      designation: 'Mineral Concession Landholder (42 Acres Laterite Reserve)',
      unit: 'Kasaragod Foothills Concession'
    }
  },
  {
    role: 'SERVICE_PROVIDER',
    title: 'Service Provider',
    category: 'EXTERNAL_PARTNER',
    description: 'Offer drilling & blasting services, wire-saw cutting, GPS telematics maintenance, tyre vulcanizing, and take on-demand bookings.',
    welcomeGreeting: 'Welcome, Service Provider',
    defaultSection: 'contract-job-management',
    allowedNav: ['home-dashboard', 'contract-job-management', 'used-machinery-marketplace', 'rz-chating', 'rz-ott'],
    permissions: ['JOB.VIEW', 'JOB.EDIT', 'CHAT.VIEW', 'CHAT.SEND', 'OTT.VIEW', 'OTT.COMPLETE'],
    samplePersona: {
      name: 'Suresh Kumar',
      email: 'suresh@hydraulictech.in',
      phone: '+91 98486 44819',
      designation: 'Senior Hydraulics & Wire-Saw Technician',
      unit: 'Hydraulic Tech Mobile Services'
    }
  }
];

export function getRoleDefinition(role: UserRole): RoleDefinition {
  const match = ALL_DEMO_ROLES.find((r) => r.role === role);
  if (match) return match;
  // Fallback to Super Admin or Owner
  return ALL_DEMO_ROLES[1];
}

export function hasPermission(role: UserRole, permission: string): boolean {
  const def = getRoleDefinition(role);
  if (def.permissions.includes('*')) return true;
  return def.permissions.includes(permission);
}

export function isNavAllowedForRole(role: UserRole, sectionId: string): boolean {
  const def = getRoleDefinition(role);
  if (def.allowedNav.includes('*')) return true;
  return def.allowedNav.includes(sectionId);
}
