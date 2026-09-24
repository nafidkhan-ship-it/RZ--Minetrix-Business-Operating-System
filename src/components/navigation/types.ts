import { SectionId } from '../../types/architecture';

export interface RouteDefinition {
  path: string;
  sectionId: SectionId;
  label: string;
  category: string;
  subtab?: string;
  description: string;
  breadcrumbs: { label: string; path?: string }[];
  crossPlatformLinks?: { label: string; path: string; iconName?: string }[];
}

export type DemoRole = 
  | 'OWNER'
  | 'ACCOUNTANT'
  | 'DRIVER'
  | 'CUSTOMER'
  | 'GENERAL_MANAGER'
  | 'SUPERVISOR'
  | 'CONTRACTOR';

export interface RoleNavigationPreset {
  role: DemoRole;
  title: string;
  badge: string;
  description: string;
  featuredRoutes: { label: string; path: string; tag: string }[];
}

export interface UniversalSearchRecord {
  id: string;
  module: string;
  recordType: 'People' | 'Companies' | 'Quarries' | 'Crusher Plants' | 'Vehicles' | 'Jobs' | 'Orders' | 'Products' | 'Land' | 'Marketplace' | 'Chats' | 'Tasks' | 'Invoices' | 'Payments' | 'Documents';
  name: string;
  subtitle: string;
  status: string;
  statusColor?: string;
  targetPath: string;
}

export interface QuickActionItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  category: 'Operations' | 'Fleet & Commerce' | 'Financial' | 'Workforce';
  targetPath: string;
  actionIntent?: string;
}
