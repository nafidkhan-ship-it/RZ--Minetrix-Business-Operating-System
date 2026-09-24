export type Role24 =
  | 'SUPER ADMIN'
  | 'OWNER'
  | 'DIRECTOR'
  | 'ADMIN'
  | 'GENERAL MANAGER'
  | 'MANAGER'
  | 'ACCOUNTANT'
  | 'HR'
  | 'SUPERVISOR'
  | 'OPERATOR'
  | 'DRIVER'
  | 'STAFF'
  | 'SALES'
  | 'PURCHASE'
  | 'STORE'
  | 'DISPATCH'
  | 'MARKETING'
  | 'CONTRACTOR'
  | 'CUSTOMER'
  | 'SUPPLIER'
  | 'SELLER'
  | 'BUYER'
  | 'LAND OWNER'
  | 'SERVICE PROVIDER';

export type PermissionAction =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Approve'
  | 'Export'
  | 'Print'
  | 'Calculate'
  | 'Manage';

export type StaffStatus =
  | 'Invited'
  | 'Active'
  | 'Suspended'
  | 'Inactive'
  | 'Removed';

export type SeatType = 'Owner' | 'Admin' | 'Staff' | 'Driver' | 'Contractor';

export type OperatingSiteType =
  | 'Quarry'
  | 'Crusher'
  | 'Warehouse'
  | 'Yard'
  | 'Office'
  | 'Workshop'
  | 'Other';

export interface CompanyProfile {
  legalName: string;
  displayName: string;
  businessType: string;
  industry: string;
  logo: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  district: string;
  state: string;
  country: string;
  pin: string;
  gstin: string;
  pan: string;
  cin: string;
  primaryContact: string;
  owner: string;
  createdDate: string;
  status: 'Active' | 'Under Review' | 'Suspended';
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  district: string;
  state: string;
  manager: string;
  phone: string;
  email: string;
  status: 'Active' | 'Suspended' | 'Pending';
  staffCount: number;
  sitesCount: number;
}

export interface OperatingSite {
  id: string;
  name: string;
  type: OperatingSiteType;
  location: string;
  manager: string;
  branchId: string;
  branchName: string;
  status: 'Operational' | 'Maintenance' | 'Planned';
  capacity: string;
  connectedPlatform: string;
}

export interface SubscriptionPlan {
  id: 'starter' | 'business' | 'professional' | 'enterprise';
  name: string;
  badge: string;
  tagline: string;
  priceDisplay: string;
  billingCycle: string;
  popular?: boolean;
  limits: {
    staffSeats: number;
    driverSeats: number;
    vehicles: number;
    quarries: number;
    crushers: number;
    branches: number;
    storageGb: number;
    monthlyEvents: number;
    aiUsageQuota: string;
  };
  features: string[];
  platformAccess: Record<string, 'Included' | 'Configurable' | 'Locked' | 'FREE'>;
}

export interface StaffMember {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  role: Role24;
  branch: string;
  site: string;
  seatType: SeatType;
  status: StaffStatus;
  joiningDate: string;
  lastActive: string;
  manager: string;
  permissions: PermissionAction[];
  authorizedModules: string[];
  documentsCount: number;
  avatar?: string;
}

export interface StaffInvitation {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  role: Role24;
  branch: string;
  site: string;
  seatType: SeatType;
  status: 'Pending' | 'Accepted' | 'Expired' | 'Cancelled';
  invitedAt: string;
  expiresAt: string;
  invitedBy: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipDevice: string;
  status: 'Success' | 'Warning' | 'Blocked';
}

export interface RoleDefinition {
  id: Role24;
  number: number;
  title: string;
  category: 'Executive' | 'Management' | 'Operations' | 'Finance & HR' | 'Commercial' | 'External Stakeholders';
  description: string;
  userCount: number;
  coreModules: string[];
  defaultPermissions: PermissionAction[];
  dashboardWidgets: string[];
}
