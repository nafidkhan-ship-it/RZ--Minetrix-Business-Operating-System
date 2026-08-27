import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  Tenant,
  Company,
  Branch,
  BusinessUnit,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  MasterData,
  Document,
  Notification,
  AuditLog,
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowAction
} from './schema.js';
import { IPersistenceAdapter, LocalJsonPersistenceAdapter, PostgresPersistenceAdapter, DatabaseTables } from './persistenceAdapter.js';
import { syncRelationalTenantData } from './relationalTenantStore.js';
import { isProduction } from '../config/securityConfig.js';

// Utility: UUID v7 generator (RFC 9562 compliant timestamp-ordered UUID)
export function generateUuidV7(): string {
  const timestamp = Date.now().toString(16).padStart(12, '0');
  const randomHex = crypto.randomBytes(10).toString('hex');
  return `${timestamp.slice(0, 8)}-${timestamp.slice(8, 12)}-7${randomHex.slice(0, 3)}-a${randomHex.slice(3, 6)}-${randomHex.slice(6, 18)}`;
}

// Password Hashing Utility
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, finalSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: finalSalt };
}

// In-Memory Database Store with Persistence Abstraction Layer
export class DatabaseStore {
  public tenants: Map<string, Tenant> = new Map();
  public companies: Map<string, Company> = new Map();
  public branches: Map<string, Branch> = new Map();
  public businessUnits: Map<string, BusinessUnit> = new Map();
  public users: Map<string, User> = new Map();
  public roles: Map<string, Role> = new Map();
  public permissions: Map<string, Permission> = new Map();
  public userRoles: Map<string, UserRole> = new Map();
  public rolePermissions: Map<string, RolePermission> = new Map();
  public masterData: Map<string, MasterData> = new Map();
  public documents: Map<string, Document> = new Map();
  public notifications: Map<string, Notification> = new Map();
  public auditLogs: Map<string, AuditLog> = new Map();
  public workflowDefinitions: Map<string, WorkflowDefinition> = new Map();
  public workflowInstances: Map<string, WorkflowInstance> = new Map();
  public workflowActions: Map<string, WorkflowAction> = new Map();

  public persistenceAdapter: IPersistenceAdapter;
  private storageFilePath: string;
  private initialized = false;

  constructor() {
    this.storageFilePath = path.join(process.cwd(), 'data', 'shared_core_db.json');
    const hasPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

    if (isProduction() && !hasPostgres) {
      throw new Error('Production requires DATABASE_URL. JSON persistence fallback is not permitted.');
    }

    if (hasPostgres) {
      this.persistenceAdapter = new PostgresPersistenceAdapter();
    } else {
      this.persistenceAdapter = new LocalJsonPersistenceAdapter(this.storageFilePath);
    }
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.persistenceAdapter.initialize();

    const dir = path.dirname(this.storageFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      const parsed = await this.persistenceAdapter.loadAll();
      const hasData = (parsed.tenants?.length || 0) > 0;
      if (hasData) {
        this.loadFromDump(parsed);
        this.ensureHrmsPermissionCatalog();
        this.ensureFleetPermissionCatalog();
        console.log(`[DB] Database loaded via adapter [${this.persistenceAdapter.providerName}] from persistent storage.`);
        if (this.persistenceAdapter.providerName === 'POSTGRES_DRIZZLE') {
          await syncRelationalTenantData({
            companies: parsed.companies || [],
            branches: parsed.branches || [],
            users: parsed.users || [],
            auditLogs: parsed.auditLogs || []
          });
        }
        await this.persistToDisk();
        this.initialized = true;
        return;
      }
    } catch (err) {
      console.warn('[DB] Failed to load persistence state, seeding fresh database:', err);
    }

    this.seedDefaultEnterpriseData();
    await this.persistToDisk();
    this.initialized = true;
  }

  private loadFromDump(dump: any) {
    if (dump.tenants) dump.tenants.forEach((item: Tenant) => this.tenants.set(item.id, item));
    if (dump.companies) dump.companies.forEach((item: Company) => this.companies.set(item.id, item));
    if (dump.branches) dump.branches.forEach((item: Branch) => this.branches.set(item.id, item));
    if (dump.businessUnits) dump.businessUnits.forEach((item: BusinessUnit) => this.businessUnits.set(item.id, item));
    if (dump.users) dump.users.forEach((item: User) => this.users.set(item.id, item));
    if (dump.roles) dump.roles.forEach((item: Role) => this.roles.set(item.id, item));
    if (dump.permissions) dump.permissions.forEach((item: Permission) => this.permissions.set(item.id, item));
    if (dump.userRoles) dump.userRoles.forEach((item: UserRole) => this.userRoles.set(item.id, item));
    if (dump.rolePermissions) dump.rolePermissions.forEach((item: RolePermission) => this.rolePermissions.set(item.id, item));
    if (dump.masterData) dump.masterData.forEach((item: MasterData) => this.masterData.set(item.id, item));
    if (dump.documents) dump.documents.forEach((item: Document) => this.documents.set(item.id, item));
    if (dump.notifications) dump.notifications.forEach((item: Notification) => this.notifications.set(item.id, item));
    if (dump.auditLogs) dump.auditLogs.forEach((item: AuditLog) => this.auditLogs.set(item.id, item));
    if (dump.workflowDefinitions) dump.workflowDefinitions.forEach((item: WorkflowDefinition) => this.workflowDefinitions.set(item.id, item));
    if (dump.workflowInstances) dump.workflowInstances.forEach((item: WorkflowInstance) => this.workflowInstances.set(item.id, item));
    if (dump.workflowActions) dump.workflowActions.forEach((item: WorkflowAction) => this.workflowActions.set(item.id, item));
  }

  public schedulePersist(): void {
    void this.persistToDisk();
  }

  public async persistToDisk(): Promise<void> {
    try {
      const dump = {
        tenants: Array.from(this.tenants.values()),
        companies: Array.from(this.companies.values()),
        branches: Array.from(this.branches.values()),
        businessUnits: Array.from(this.businessUnits.values()),
        users: Array.from(this.users.values()),
        roles: Array.from(this.roles.values()),
        permissions: Array.from(this.permissions.values()),
        userRoles: Array.from(this.userRoles.values()),
        rolePermissions: Array.from(this.rolePermissions.values()),
        masterData: Array.from(this.masterData.values()),
        documents: Array.from(this.documents.values()),
        notifications: Array.from(this.notifications.values()),
        auditLogs: Array.from(this.auditLogs.values()),
        workflowDefinitions: Array.from(this.workflowDefinitions.values()),
        workflowInstances: Array.from(this.workflowInstances.values()),
        workflowActions: Array.from(this.workflowActions.values())
      };
      await this.persistenceAdapter.saveAll(dump);
    } catch (err) {
      console.error('[DB] Error persisting database state:', err);
    }
  }

  /** Additive RBAC catalog so existing persisted snapshots pick up new HRMS permissions. */
  private ensureHrmsPermissionCatalog(): void {
    const catalog: Permission[] = [
      { id: 'p6', code: 'hrms:employee:view', module: 'HRMS', action: 'view', description: 'View HR Employee Master' },
      { id: 'p25', code: 'hrms:employee:create', module: 'HRMS', action: 'create', description: 'Create employee master records' },
      { id: 'p26', code: 'hrms:employee:update', module: 'HRMS', action: 'update', description: 'Update or archive employees' },
      { id: 'p27', code: 'hrms:attendance:view', module: 'HRMS', action: 'view', description: 'View attendance' },
      { id: 'p28', code: 'hrms:attendance:create', module: 'HRMS', action: 'create', description: 'Record attendance' },
      { id: 'p29', code: 'hrms:leave:view', module: 'HRMS', action: 'view', description: 'View leave requests' },
      { id: 'p30', code: 'hrms:leave:create', module: 'HRMS', action: 'create', description: 'Request leave' },
      { id: 'p31', code: 'hrms:leave:approve', module: 'HRMS', action: 'approve', description: 'Approve or reject leave' },
      { id: 'p32', code: 'hrms:payroll:view', module: 'HRMS', action: 'view', description: 'View payroll (sensitive)' },
      { id: 'p33', code: 'hrms:payroll:create', module: 'HRMS', action: 'create', description: 'Run payroll (sensitive)' }
    ];

    for (const permission of catalog) {
      const existing = Array.from(this.permissions.values()).find((item) => item.code === permission.code);
      if (!existing) {
        this.permissions.set(permission.id, permission);
      }
    }

    const adminRole = Array.from(this.roles.values()).find((role) => role.code === 'SUPER_ADMIN');
    const quarryRole = Array.from(this.roles.values()).find((role) => role.code === 'QUARRY_MANAGER');
    const grant = (roleId: string, permissionCode: string) => {
      const permission = Array.from(this.permissions.values()).find((item) => item.code === permissionCode);
      if (!permission) return;
      const already = Array.from(this.rolePermissions.values()).some(
        (row) => row.roleId === roleId && (row.permissionId === permission.id || row.permissionCode === permission.code)
      );
      if (already) return;
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId,
        permissionId: permission.id,
        permissionCode: permission.code
      });
    };

    if (adminRole) {
      for (const permission of catalog) grant(adminRole.id, permission.code);
    }
    if (quarryRole) {
      for (const code of [
        'hrms:employee:view',
        'hrms:employee:create',
        'hrms:employee:update',
        'hrms:attendance:view',
        'hrms:attendance:create',
        'hrms:leave:view',
        'hrms:leave:create',
        'hrms:leave:approve'
      ]) {
        grant(quarryRole.id, code);
      }
    }
  }

  private ensureFleetPermissionCatalog(): void {
    const catalog: Permission[] = [
      { id: 'p4', code: 'fleet:vehicle:dispatch', module: 'Fleet', action: 'dispatch', description: 'Dispatch Fleet Vehicles' },
      { id: 'p34', code: 'fleet:vehicle:view', module: 'Fleet', action: 'view', description: 'View fleet vehicle master' },
      { id: 'p35', code: 'fleet:vehicle:create', module: 'Fleet', action: 'create', description: 'Create fleet vehicles' },
      { id: 'p36', code: 'fleet:vehicle:update', module: 'Fleet', action: 'update', description: 'Update fleet vehicles' },
      { id: 'p37', code: 'fleet:vehicle:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet vehicles' },
      { id: 'p38', code: 'fleet:driver:view', module: 'Fleet', action: 'view', description: 'View fleet driver master' },
      { id: 'p39', code: 'fleet:driver:create', module: 'Fleet', action: 'create', description: 'Create fleet drivers' },
      { id: 'p40', code: 'fleet:driver:update', module: 'Fleet', action: 'update', description: 'Update fleet drivers' },
      { id: 'p41', code: 'fleet:driver:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet drivers' }
    ];
    for (const permission of catalog) {
      const existing = Array.from(this.permissions.values()).find((item) => item.code === permission.code);
      if (!existing) this.permissions.set(permission.id, permission);
    }
    const adminRole = Array.from(this.roles.values()).find((role) => role.code === 'SUPER_ADMIN');
    const quarryRole = Array.from(this.roles.values()).find((role) => role.code === 'QUARRY_MANAGER');
    const grant = (roleId: string, permissionCode: string) => {
      const permission = Array.from(this.permissions.values()).find((item) => item.code === permissionCode);
      if (!permission) return;
      const already = Array.from(this.rolePermissions.values()).some(
        (row) => row.roleId === roleId && (row.permissionId === permission.id || row.permissionCode === permission.code)
      );
      if (already) return;
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId,
        permissionId: permission.id,
        permissionCode: permission.code
      });
    };
    if (adminRole) {
      for (const permission of catalog) grant(adminRole.id, permission.code);
    }
    if (quarryRole) {
      grant(quarryRole.id, 'fleet:vehicle:view');
      grant(quarryRole.id, 'fleet:driver:view');
    }
  }

  private seedDefaultEnterpriseData() {
    const now = new Date().toISOString();

    // 1. Tenants
    const tenant1: Tenant = {
      id: 'tenant-rz-global-001',
      code: 'RZ-GLOBAL',
      name: 'Racezone Ventures & Mining Ltd',
      domain: 'racezoneventures.com',
      status: 'ACTIVE',
      tier: 'ENTERPRISE',
      settingsJson: JSON.stringify({ theme: 'dark', defaultCurrency: 'USD' }),
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const tenant2: Tenant = {
      id: 'tenant-apex-quarry-002',
      code: 'APEX-MINING',
      name: 'Apex Mining & Minerals Ltd',
      domain: 'apexmining.com',
      status: 'ACTIVE',
      tier: 'BUSINESS',
      settingsJson: JSON.stringify({ theme: 'light', defaultCurrency: 'USD' }),
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.tenants.set(tenant1.id, tenant1);
    this.tenants.set(tenant2.id, tenant2);

    // 2. Companies
    const company1: Company = {
      id: 'comp-101',
      tenantId: tenant1.id,
      code: 'RZ-CORP',
      name: 'Racezone Minetrix Operating Corp',
      taxId: 'TAX-9948201',
      currency: 'USD',
      country: 'USA',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const company2: Company = {
      id: 'comp-202',
      tenantId: tenant2.id,
      code: 'APEX-CORP',
      name: 'Apex Quarries Operations',
      taxId: 'TAX-1102934',
      currency: 'USD',
      country: 'USA',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.companies.set(company1.id, company1);
    this.companies.set(company2.id, company2);

    // 3. Branches
    const branch1: Branch = {
      id: 'br-quarry-alpha',
      tenantId: tenant1.id,
      companyId: company1.id,
      code: 'BR-Q1',
      name: 'Quarry Site Alpha (Laterite & Granite)',
      locationType: 'QUARRY',
      address: 'Sector 14 Mining Corridor, Rock Ridge',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const branch2: Branch = {
      id: 'br-crusher-beta',
      tenantId: tenant1.id,
      companyId: company1.id,
      code: 'BR-C2',
      name: 'Crusher Unit Beta',
      locationType: 'CRUSHER',
      address: 'Industrial Hub North, Gate 4',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.branches.set(branch1.id, branch1);
    this.branches.set(branch2.id, branch2);

    // 4. Permissions
    const permList: Array<{ id: string; code: string; module: string; action: string; description: string }> = [
      { id: 'p1', code: 'shared:admin:access', module: 'Shared Core', action: 'admin', description: 'Full Platform Admin Rights' },
      { id: 'p2', code: 'mining:quarry:create', module: 'Mining', action: 'create', description: 'Create Quarry Records' },
      { id: 'p3', code: 'mining:quarry:view', module: 'Mining', action: 'view', description: 'View Quarry Records' },
      { id: 'p8', code: 'mining:product:view', module: 'Mining', action: 'view', description: 'View ERP products and prices' },
      { id: 'p9', code: 'mining:product:create', module: 'Mining', action: 'create', description: 'Manage ERP products and prices' },
      { id: 'p10', code: 'mining:production:view', module: 'Mining', action: 'view', description: 'View production batches' },
      { id: 'p11', code: 'mining:production:create', module: 'Mining', action: 'create', description: 'Create and post production batches' },
      { id: 'p12', code: 'mining:stock:view', module: 'Mining', action: 'view', description: 'View stock balances and ledger' },
      { id: 'p13', code: 'mining:stock:adjust', module: 'Mining', action: 'adjust', description: 'Post stock adjustments' },
      { id: 'p14', code: 'mining:gatepass:view', module: 'Mining', action: 'view', description: 'View gate passes' },
      { id: 'p15', code: 'mining:gatepass:create', module: 'Mining', action: 'create', description: 'Create gate passes' },
      { id: 'p16', code: 'mining:gatepass:approve', module: 'Mining', action: 'approve', description: 'Approve, issue, or cancel gate passes' },
      { id: 'p17', code: 'mining:dispatch:view', module: 'Mining', action: 'view', description: 'View dispatches' },
      { id: 'p18', code: 'mining:dispatch:create', module: 'Mining', action: 'create', description: 'Create dispatches' },
      { id: 'p19', code: 'mining:settlement:view', module: 'Mining', action: 'view', description: 'View landowner settlements' },
      { id: 'p20', code: 'mining:settlement:create', module: 'Mining', action: 'create', description: 'Create landowner settlements' },
      { id: 'p21', code: 'mining:crm:view', module: 'Mining', action: 'view', description: 'View CRM customers, contacts, and leads' },
      { id: 'p22', code: 'mining:crm:create', module: 'Mining', action: 'create', description: 'Create CRM customers, contacts, and leads' },
      { id: 'p23', code: 'mining:order:view', module: 'Mining', action: 'view', description: 'View sales orders' },
      { id: 'p24', code: 'mining:order:create', module: 'Mining', action: 'create', description: 'Create and confirm sales orders' },
      { id: 'p4', code: 'fleet:vehicle:dispatch', module: 'Fleet', action: 'dispatch', description: 'Dispatch Fleet Vehicles' },
      { id: 'p34', code: 'fleet:vehicle:view', module: 'Fleet', action: 'view', description: 'View fleet vehicle master' },
      { id: 'p35', code: 'fleet:vehicle:create', module: 'Fleet', action: 'create', description: 'Create fleet vehicles' },
      { id: 'p36', code: 'fleet:vehicle:update', module: 'Fleet', action: 'update', description: 'Update fleet vehicles' },
      { id: 'p37', code: 'fleet:vehicle:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet vehicles' },
      { id: 'p38', code: 'fleet:driver:view', module: 'Fleet', action: 'view', description: 'View fleet driver master' },
      { id: 'p39', code: 'fleet:driver:create', module: 'Fleet', action: 'create', description: 'Create fleet drivers' },
      { id: 'p40', code: 'fleet:driver:update', module: 'Fleet', action: 'update', description: 'Update fleet drivers' },
      { id: 'p41', code: 'fleet:driver:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet drivers' },
      { id: 'p5', code: 'finance:invoice:approve', module: 'Finance', action: 'approve', description: 'Approve Finance Invoices' },
      { id: 'p6', code: 'hrms:employee:view', module: 'HRMS', action: 'view', description: 'View HR Employee Master' },
      { id: 'p25', code: 'hrms:employee:create', module: 'HRMS', action: 'create', description: 'Create employee master records' },
      { id: 'p26', code: 'hrms:employee:update', module: 'HRMS', action: 'update', description: 'Update or archive employees' },
      { id: 'p27', code: 'hrms:attendance:view', module: 'HRMS', action: 'view', description: 'View attendance' },
      { id: 'p28', code: 'hrms:attendance:create', module: 'HRMS', action: 'create', description: 'Record attendance' },
      { id: 'p29', code: 'hrms:leave:view', module: 'HRMS', action: 'view', description: 'View leave requests' },
      { id: 'p30', code: 'hrms:leave:create', module: 'HRMS', action: 'create', description: 'Request leave' },
      { id: 'p31', code: 'hrms:leave:approve', module: 'HRMS', action: 'approve', description: 'Approve or reject leave' },
      { id: 'p32', code: 'hrms:payroll:view', module: 'HRMS', action: 'view', description: 'View payroll (sensitive)' },
      { id: 'p33', code: 'hrms:payroll:create', module: 'HRMS', action: 'create', description: 'Run payroll (sensitive)' },
      { id: 'p7', code: 'chat:message:send', module: 'RZ Chat', action: 'send', description: 'Send Realtime Chat Messages' }
    ];
    permList.forEach(p => this.permissions.set(p.id, p));

    // 5. Roles
    const roleAdmin: Role = {
      id: 'role-super-admin',
      tenantId: tenant1.id,
      code: 'SUPER_ADMIN',
      name: 'Super Enterprise Administrator',
      description: 'Full access across all modules and tenant settings',
      isSystemRole: true,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const roleQuarryMgr: Role = {
      id: 'role-quarry-mgr',
      tenantId: tenant1.id,
      code: 'QUARRY_MANAGER',
      name: 'Quarry Site Manager',
      description: 'Manages Quarry operations, weighbridge tickets, and dispatches',
      isSystemRole: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.roles.set(roleAdmin.id, roleAdmin);
    this.roles.set(roleQuarryMgr.id, roleQuarryMgr);

    // Link Role Permissions
    permList.forEach(p => {
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId: roleAdmin.id,
        permissionId: p.id,
        permissionCode: p.code
      });
    });

    // 6. Users
    const passwordResult = hashPassword('AdminPass2026!');
    const userAdmin: User = {
      id: 'usr-admin-001',
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      email: 'admin@racezoneventures.com',
      passwordHash: passwordResult.hash,
      salt: passwordResult.salt,
      fullName: 'Nafid Khan (CEO & Enterprise Admin)',
      phone: '+1-800-MINETRIX',
      department: 'Executive Board',
      designation: 'Chief Executive Officer',
      status: 'ACTIVE',
      isMfaEnabled: true,
      linkedEmployeeId: 'EMP-001',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    const userManagerPass = hashPassword('ManagerPass2026!');
    const userManager: User = {
      id: 'usr-quarry-mgr-002',
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      email: 'quarry.manager@racezoneventures.com',
      passwordHash: userManagerPass.hash,
      salt: userManagerPass.salt,
      fullName: 'Vikram Sharma',
      phone: '+1-800-QUARRY',
      department: 'Mining Operations',
      designation: 'Senior Quarry Manager',
      status: 'ACTIVE',
      isMfaEnabled: false,
      linkedEmployeeId: 'EMP-088',
      linkedOperatorId: 'OP-Q1-01',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    // User for Tenant 2 (Apex)
    const userApexPass = hashPassword('ApexPass2026!');
    const userApex: User = {
      id: 'usr-apex-mgr-003',
      tenantId: tenant2.id,
      companyId: company2.id,
      email: 'site.mgr@apexmining.com',
      passwordHash: userApexPass.hash,
      salt: userApexPass.salt,
      fullName: 'David Apex',
      department: 'Mining Operations',
      designation: 'Plant Operator',
      status: 'ACTIVE',
      isMfaEnabled: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    this.users.set(userAdmin.id, userAdmin);
    this.users.set(userManager.id, userManager);
    this.users.set(userApex.id, userApex);

    // User Roles
    this.userRoles.set('ur-1', {
      id: 'ur-1',
      userId: userAdmin.id,
      roleId: roleAdmin.id,
      tenantId: tenant1.id,
      assignedAt: now,
      assignedBy: 'SYSTEM'
    });
    this.userRoles.set('ur-2', {
      id: 'ur-2',
      userId: userManager.id,
      roleId: roleQuarryMgr.id,
      tenantId: tenant1.id,
      assignedAt: now,
      assignedBy: userAdmin.id
    });

    const quarryPermIds = [
      'p2', 'p3', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20', 'p21', 'p22', 'p23', 'p24',
      'p6', 'p25', 'p26', 'p27', 'p28', 'p29', 'p30', 'p31',
      'p4', 'p34', 'p38'
    ];
    for (const permId of quarryPermIds) {
      const perm = permList.find((item) => item.id === permId);
      if (!perm) continue;
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId: roleQuarryMgr.id,
        permissionId: perm.id,
        permissionCode: perm.code
      });
    }

    // 7. Master Data
    const md1: MasterData = {
      id: 'md-uom-mt',
      tenantId: tenant1.id,
      category: 'UOM',
      code: 'MT',
      name: 'Metric Tonne',
      valueJson: JSON.stringify({ conversionToKg: 1000, symbol: 'MT' }),
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const md2: MasterData = {
      id: 'md-uom-cft',
      tenantId: tenant1.id,
      category: 'UOM',
      code: 'CFT',
      name: 'Cubic Feet',
      valueJson: JSON.stringify({ conversionToCmt: 0.0283168, symbol: 'CFT' }),
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.masterData.set(md1.id, md1);
    this.masterData.set(md2.id, md2);

    // 8. Workflows
    const wfDef1: WorkflowDefinition = {
      id: 'wf-def-invoice-appr',
      tenantId: tenant1.id,
      code: 'WF_INVOICE_APPROVAL',
      name: 'Mining Invoice Approval Workflow',
      entityType: 'INVOICE',
      initialState: 'DRAFT',
      statesJson: JSON.stringify(['DRAFT', 'SUBMITTED', 'MANAGER_APPROVED', 'FINANCE_APPROVED', 'REJECTED']),
      transitionsJson: JSON.stringify([
        { from: 'DRAFT', to: 'SUBMITTED', requiredPermission: 'finance:invoice:submit' },
        { from: 'SUBMITTED', to: 'MANAGER_APPROVED', requiredPermission: 'finance:invoice:approve' },
        { from: 'MANAGER_APPROVED', to: 'FINANCE_APPROVED', requiredPermission: 'finance:invoice:approve' }
      ]),
      createdAt: now,
      updatedAt: now
    };
    this.workflowDefinitions.set(wfDef1.id, wfDef1);

    // 9. Initial Audit Log
    const audit1: AuditLog = {
      id: generateUuidV7(),
      tenantId: tenant1.id,
      actorUserId: userAdmin.id,
      actorEmail: userAdmin.email,
      action: 'SYSTEM_BOOTSTRAP',
      module: 'Shared Core',
      resource: 'DatabaseStore',
      ipAddress: '127.0.0.1',
      correlationId: generateUuidV7(),
      status: 'SUCCESS',
      createdAt: now
    };
    this.auditLogs.set(audit1.id, audit1);

    console.log('[DB] Enterprise seed data successfully created.');
  }
}

// Global Singleton DB Instance
export const db = new DatabaseStore();

export async function initializeDatabase(): Promise<void> {
  await db.initialize();
}
