/**
 * RZ® Minetrix BOS - Shared Core Database Schema Definitions (Phase 16)
 * Follows Phase 15 Enterprise Database Standards:
 * - UUID v7 / UUID keys
 * - Multi-tenant hierarchy (tenant_id, company_id, branch_id, business_unit_id)
 * - Timestamps (created_at, updated_at)
 * - Tracking (created_by, updated_by, deleted_at)
 * - Optimistic concurrency (version)
 */

export interface Tenant {
  id: string;
  code: string;
  name: string;
  domain: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
  tier: 'ENTERPRISE' | 'BUSINESS' | 'STANDARD';
  settingsJson: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface Company {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  taxId: string;
  currency: string;
  country: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface Branch {
  id: string;
  tenantId: string;
  companyId: string;
  code: string;
  name: string;
  locationType: 'QUARRY' | 'CRUSHER' | 'DEPOT' | 'OFFICE' | 'YARD';
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface BusinessUnit {
  id: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  code: string;
  name: string;
  unitType: 'MINING' | 'FLEET' | 'MATERIALS' | 'TRADING' | 'SERVICES';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface User {
  id: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  email: string;
  passwordHash: string;
  salt: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  department: string;
  designation: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'SUSPENDED';
  isMfaEnabled: boolean;
  linkedEmployeeId?: string;
  linkedDriverId?: string;
  linkedOperatorId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface Role {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Permission {
  id: string;
  code: string; // e.g. mining:quarry:create, finance:invoice:approve, hrms:employee:view
  module: string; // Mining, Fleet, CRM, Finance, Shared Core, etc.
  action: string; // create, view, update, delete, approve, export
  description: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  tenantId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permissionCode: string;
}

export interface MasterData {
  id: string;
  tenantId: string;
  category: 'UOM' | 'ITEM_CATEGORY' | 'NUMBER_SERIES' | 'CURRENCY' | 'TAX_CODE' | 'PAYMENT_TERM';
  code: string;
  name: string;
  valueJson: string; // Additional settings e.g. conversion rates, prefixes
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Document {
  id: string;
  tenantId: string;
  companyId: string;
  module: string; // Mining, Fleet, CRM, Finance, etc.
  entityType: string;
  entityId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  accessLevel: 'PUBLIC' | 'TENANT_PRIVATE' | 'RESTRICTED';
  uploaderUserId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  version: number;
}

export interface Notification {
  id: string;
  tenantId: string;
  recipientUserId: string;
  title: string;
  body: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  channel: 'IN_APP' | 'EMAIL' | 'WHATSAPP' | 'PUSH';
  isRead: boolean;
  readAt?: string;
  linkUrl?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actorUserId: string;
  actorEmail: string;
  action: string; // e.g. AUTH_LOGIN, USER_CREATE, QUARRY_APPROVE
  module: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  correlationId: string;
  beforeStateJson?: string;
  afterStateJson?: string;
  status: 'SUCCESS' | 'FAILURE';
  createdAt: string;
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  entityType: string; // e.g. INVOICE, DISPATCH, PURCHASE_ORDER
  initialState: string;
  statesJson: string; // Array of states
  transitionsJson: string; // Allowed state transitions with required permission
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowInstance {
  id: string;
  tenantId: string;
  workflowDefinitionId: string;
  entityType: string;
  entityId: string;
  currentState: string;
  initiatedByUserId: string;
  status: 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowAction {
  id: string;
  tenantId: string;
  instanceId: string;
  fromState: string;
  toState: string;
  actionName: string;
  actorUserId: string;
  comments?: string;
  createdAt: string;
}
