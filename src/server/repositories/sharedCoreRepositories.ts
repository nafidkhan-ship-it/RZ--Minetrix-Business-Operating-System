import { db, generateUuidV7 } from '../db/database.js';
import {
  Tenant,
  Company,
  Branch,
  BusinessUnit,
  User,
  Role,
  Permission,
  MasterData,
  Document,
  Notification,
  AuditLog,
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowAction
} from '../db/schema.js';

export class TenantRepository {
  async findById(id: string): Promise<Tenant | null> {
    const tenant = db.tenants.get(id);
    if (!tenant || tenant.deletedAt) return null;
    return tenant;
  }

  async findByCode(code: string): Promise<Tenant | null> {
    for (const t of db.tenants.values()) {
      if (t.code === code && !t.deletedAt) return t;
    }
    return null;
  }

  async findAll(): Promise<Tenant[]> {
    return Array.from(db.tenants.values()).filter(t => !t.deletedAt);
  }

  async create(tenantData: Partial<Tenant>): Promise<Tenant> {
    const now = new Date().toISOString();
    const newTenant: Tenant = {
      id: tenantData.id || generateUuidV7(),
      code: tenantData.code || `TNT-${Date.now()}`,
      name: tenantData.name || 'New Tenant',
      domain: tenantData.domain || 'tenant.com',
      status: tenantData.status || 'ACTIVE',
      tier: tenantData.tier || 'ENTERPRISE',
      settingsJson: tenantData.settingsJson || '{}',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    db.tenants.set(newTenant.id, newTenant);
    db.persistToDisk();
    return newTenant;
  }
}

export class OrganizationRepository {
  async findCompaniesByTenant(tenantId: string): Promise<Company[]> {
    return Array.from(db.companies.values()).filter(c => c.tenantId === tenantId && !c.deletedAt);
  }

  async findBranchesByCompany(companyId: string, tenantId: string): Promise<Branch[]> {
    return Array.from(db.branches.values()).filter(b => b.companyId === companyId && b.tenantId === tenantId && !b.deletedAt);
  }

  async findBusinessUnitsByTenant(tenantId: string): Promise<BusinessUnit[]> {
    return Array.from(db.businessUnits.values()).filter(u => u.tenantId === tenantId && !u.deletedAt);
  }
}

export class UserRepository {
  async findById(id: string, tenantId?: string): Promise<User | null> {
    const user = db.users.get(id);
    if (!user || user.deletedAt) return null;
    if (tenantId && user.tenantId !== tenantId) return null; // Tenant Isolation Enforcement
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const u of db.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase() && !u.deletedAt) {
        return u;
      }
    }
    return null;
  }

  async findByTenant(tenantId: string): Promise<User[]> {
    return Array.from(db.users.values()).filter(u => u.tenantId === tenantId && !u.deletedAt);
  }

  async create(userData: Partial<User>): Promise<User> {
    const now = new Date().toISOString();
    const newUser: User = {
      id: userData.id || generateUuidV7(),
      tenantId: userData.tenantId!,
      companyId: userData.companyId!,
      branchId: userData.branchId,
      email: userData.email!,
      passwordHash: userData.passwordHash!,
      salt: userData.salt!,
      fullName: userData.fullName!,
      phone: userData.phone,
      department: userData.department || 'General',
      designation: userData.designation || 'Staff',
      status: userData.status || 'ACTIVE',
      isMfaEnabled: userData.isMfaEnabled || false,
      linkedEmployeeId: userData.linkedEmployeeId,
      linkedDriverId: userData.linkedDriverId,
      linkedOperatorId: userData.linkedOperatorId,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    db.users.set(newUser.id, newUser);
    db.persistToDisk();
    return newUser;
  }

  async updateProfile(id: string, tenantId: string, updates: Partial<User>): Promise<User> {
    const user = await this.findById(id, tenantId);
    if (!user) throw new Error('User not found or tenant access denied');
    
    const updated: User = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: user.version + 1
    };
    db.users.set(id, updated);
    db.persistToDisk();
    return updated;
  }
}

export class RolePermissionRepository {
  async findRolesByTenant(tenantId: string): Promise<Role[]> {
    return Array.from(db.roles.values()).filter(r => r.tenantId === tenantId || r.isSystemRole);
  }

  async findPermissionsByUser(userId: string): Promise<string[]> {
    const permissions: Set<string> = new Set();
    const userRoleEntries = Array.from(db.userRoles.values()).filter(ur => ur.userId === userId);

    for (const ur of userRoleEntries) {
      const rolePerms = Array.from(db.rolePermissions.values()).filter(rp => rp.roleId === ur.roleId);
      for (const rp of rolePerms) {
        permissions.add(rp.permissionCode);
      }
    }
    return Array.from(permissions);
  }
}

export class AuditRepository {
  async log(auditData: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const logEntry: AuditLog = {
      id: generateUuidV7(),
      ...auditData,
      createdAt: new Date().toISOString()
    };
    db.auditLogs.set(logEntry.id, logEntry);
    db.persistToDisk();
    return logEntry;
  }

  async search(tenantId: string, limit: number = 50): Promise<AuditLog[]> {
    return Array.from(db.auditLogs.values())
      .filter(a => a.tenantId === tenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

export class NotificationRepository {
  async findByRecipient(userId: string, tenantId: string): Promise<Notification[]> {
    return Array.from(db.notifications.values())
      .filter(n => n.recipientUserId === userId && n.tenantId === tenantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async create(notifData: Partial<Notification>): Promise<Notification> {
    const newNotif: Notification = {
      id: notifData.id || generateUuidV7(),
      tenantId: notifData.tenantId!,
      recipientUserId: notifData.recipientUserId!,
      title: notifData.title!,
      body: notifData.body || '',
      type: notifData.type || 'INFO',
      channel: notifData.channel || 'IN_APP',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.set(newNotif.id, newNotif);
    db.persistToDisk();
    return newNotif;
  }

  async markAsRead(id: string, tenantId: string): Promise<boolean> {
    const notif = db.notifications.get(id);
    if (!notif || notif.tenantId !== tenantId) return false;
    notif.isRead = true;
    notif.readAt = new Date().toISOString();
    db.notifications.set(id, notif);
    db.persistToDisk();
    return true;
  }
}

export class DocumentRepository {
  async findByEntity(tenantId: string, module: string, entityType: string, entityId: string): Promise<Document[]> {
    return Array.from(db.documents.values()).filter(
      d => d.tenantId === tenantId && d.module === module && d.entityType === entityType && d.entityId === entityId && !d.deletedAt
    );
  }

  async registerMetadata(docData: Partial<Document>): Promise<Document> {
    const now = new Date().toISOString();
    const newDoc: Document = {
      id: docData.id || generateUuidV7(),
      tenantId: docData.tenantId!,
      companyId: docData.companyId!,
      module: docData.module || 'Shared Core',
      entityType: docData.entityType || 'GENERAL',
      entityId: docData.entityId || '0',
      fileName: docData.fileName!,
      fileSize: docData.fileSize || 1024,
      mimeType: docData.mimeType || 'application/pdf',
      storageKey: docData.storageKey || `docs/${docData.tenantId}/${Date.now()}_${docData.fileName}`,
      accessLevel: docData.accessLevel || 'TENANT_PRIVATE',
      uploaderUserId: docData.uploaderUserId!,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    db.documents.set(newDoc.id, newDoc);
    db.persistToDisk();
    return newDoc;
  }
}

export class WorkflowRepository {
  async findDefinitionByCode(tenantId: string, code: string): Promise<WorkflowDefinition | null> {
    for (const wf of db.workflowDefinitions.values()) {
      if (wf.tenantId === tenantId && wf.code === code) return wf;
    }
    return null;
  }

  async createInstance(wfInst: Partial<WorkflowInstance>): Promise<WorkflowInstance> {
    const now = new Date().toISOString();
    const newInst: WorkflowInstance = {
      id: wfInst.id || generateUuidV7(),
      tenantId: wfInst.tenantId!,
      workflowDefinitionId: wfInst.workflowDefinitionId!,
      entityType: wfInst.entityType!,
      entityId: wfInst.entityId!,
      currentState: wfInst.currentState || 'INITIAL',
      initiatedByUserId: wfInst.initiatedByUserId!,
      status: 'IN_PROGRESS',
      createdAt: now,
      updatedAt: now
    };
    db.workflowInstances.set(newInst.id, newInst);
    db.persistToDisk();
    return newInst;
  }
}
