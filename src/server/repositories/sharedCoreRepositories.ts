import { and, desc, eq } from 'drizzle-orm';
import { db, generateUuidV7 } from '../db/database.js';
import { PostgresPersistenceAdapter } from '../db/persistenceAdapter.js';
import * as t from '../db/drizzleSchema.js';
import { Tenant, Company, Branch, BusinessUnit, User, Role, Permission, AuditLog, Notification, Document, WorkflowDefinition, WorkflowInstance } from '../db/schema.js';

const pg = () => db.persistenceAdapter instanceof PostgresPersistenceAdapter ? db.persistenceAdapter : null;
const iso = (v: any) => v instanceof Date ? v.toISOString() : v;
const legacy = (row: any) => {
  if (!row) return row;
  const value = { ...row };
  for (const key of ['settingsJson', 'valueJson', 'statesJson', 'transitionsJson', 'beforeStateJson', 'afterStateJson']) if (value[key] !== undefined && typeof value[key] !== 'string') value[key] = JSON.stringify(value[key]);
  for (const [key, val] of Object.entries(value)) if (val instanceof Date) value[key] = iso(val);
  return value;
};
const rows = <T>(items: any[]) => items.map(legacy) as T[];

export class TenantRepository {
  async findById(id: string): Promise<Tenant | null> {
    const p = pg(); if (p) return legacy((await p.select(t.tenants, eq(t.tenants.id, id))).find((x: any) => !x.deletedAt)) as Tenant || null;
    const x = db.tenants.get(id); return x && !x.deletedAt ? x : null;
  }
  async findByCode(code: string): Promise<Tenant | null> {
    const p = pg(); if (p) return legacy((await p.select(t.tenants, eq(t.tenants.code, code))).find((x: any) => !x.deletedAt)) as Tenant || null;
    return Array.from(db.tenants.values()).find(x => x.code === code && !x.deletedAt) || null;
  }
  async findAll(): Promise<Tenant[]> { const p = pg(); if (p) return rows<Tenant>(await p.select(t.tenants)); return Array.from(db.tenants.values()).filter(x => !x.deletedAt); }
  async create(data: Partial<Tenant>): Promise<Tenant> {
    const value: any = { id: data.id || undefined, code: data.code || `TNT-${Date.now()}`, name: data.name || 'New Tenant', domain: data.domain || 'tenant.invalid', status: data.status || 'ACTIVE', tier: data.tier || 'ENTERPRISE', settingsJson: JSON.parse(data.settingsJson || '{}') };
    const p = pg(); if (p) return legacy((await p.insert(t.tenants, value))[0]) as Tenant;
    const result = { ...value, id: value.id || generateUuidV7(), settingsJson: JSON.stringify(value.settingsJson), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1 } as Tenant; db.tenants.set(result.id, result); db.persistToDisk(); return result;
  }
}

export class OrganizationRepository {
  async findCompaniesByTenant(tenantId: string): Promise<Company[]> { const p = pg(); if (p) return rows<Company>(await p.select(t.companies, eq(t.companies.tenantId, tenantId))); return Array.from(db.companies.values()).filter(x => x.tenantId === tenantId && !x.deletedAt); }
  async findBranchesByCompany(companyId: string, tenantId: string): Promise<Branch[]> { const p = pg(); if (p) return rows<Branch>(await p.select(t.branches, and(eq(t.branches.companyId, companyId), eq(t.branches.tenantId, tenantId)))); return Array.from(db.branches.values()).filter(x => x.companyId === companyId && x.tenantId === tenantId && !x.deletedAt); }
  async findBusinessUnitsByTenant(tenantId: string): Promise<BusinessUnit[]> { const p = pg(); if (p) return rows<BusinessUnit>(await p.select(t.businessUnits, eq(t.businessUnits.tenantId, tenantId))); return Array.from(db.businessUnits.values()).filter(x => x.tenantId === tenantId && !x.deletedAt); }
}

export class UserRepository {
  async findById(id: string, tenantId?: string): Promise<User | null> { const p = pg(); if (p) { const result = await p.select(t.users, tenantId ? and(eq(t.users.id, id), eq(t.users.tenantId, tenantId)) : eq(t.users.id, id)); return legacy(result.find((x: any) => !x.deletedAt)) as User || null; } const x = db.users.get(id); return x && !x.deletedAt && (!tenantId || x.tenantId === tenantId) ? x : null; }
  async findByEmail(email: string): Promise<User | null> { const p = pg(); if (p) return legacy((await p.select(t.users, eq(t.users.email, email))).find((x: any) => !x.deletedAt)) as User || null; return Array.from(db.users.values()).find(x => x.email.toLowerCase() === email.toLowerCase() && !x.deletedAt) || null; }
  async findByTenant(tenantId: string): Promise<User[]> { const p = pg(); if (p) return rows<User>(await p.select(t.users, eq(t.users.tenantId, tenantId))); return Array.from(db.users.values()).filter(x => x.tenantId === tenantId && !x.deletedAt); }
  async create(data: Partial<User>): Promise<User> { const value: any = { ...data, id: data.id || undefined, department: data.department || 'General', designation: data.designation || 'Staff', status: data.status || 'ACTIVE', isMfaEnabled: data.isMfaEnabled || false }; const p = pg(); if (p) return legacy((await p.insert(t.users, value))[0]) as User; const result = { ...value, id: value.id || generateUuidV7(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1 } as User; db.users.set(result.id, result); db.persistToDisk(); return result; }
  async updateProfile(id: string, tenantId: string, updates: Partial<User>): Promise<User> { const p = pg(); if (p) { const result = await p.update(t.users, { ...updates, updatedAt: new Date(), version: (updates as any).version }, and(eq(t.users.id, id), eq(t.users.tenantId, tenantId))); if (!result[0]) throw new Error('User not found or tenant access denied'); return legacy(result[0]) as User; } const user = await this.findById(id, tenantId); if (!user) throw new Error('User not found or tenant access denied'); const updated = { ...user, ...updates, updatedAt: new Date().toISOString(), version: user.version + 1 }; db.users.set(id, updated); db.persistToDisk(); return updated; }
}

export class RolePermissionRepository {
  async findAllPermissions(): Promise<Permission[]> { const p = pg(); if (p) return rows<Permission>(await p.select(t.permissions)); return Array.from(db.permissions.values()); }
  async findRolesByTenant(tenantId: string): Promise<Role[]> { const p = pg(); if (p) return rows<Role>(await p.select(t.roles, eq(t.roles.tenantId, tenantId))); return Array.from(db.roles.values()).filter(x => x.tenantId === tenantId || x.isSystemRole); }
  async findPermissionsByUser(userId: string): Promise<string[]> { const p = pg(); if (p) { const links = await p.client.select({ code: t.rolePermissions.permissionCode }).from(t.userRoles).innerJoin(t.rolePermissions, eq(t.userRoles.roleId, t.rolePermissions.roleId)).where(eq(t.userRoles.userId, userId)); return links.map(x => x.code); } const result = new Set<string>(); for (const ur of db.userRoles.values()) if (ur.userId === userId) for (const rp of db.rolePermissions.values()) if (rp.roleId === ur.roleId) result.add(rp.permissionCode); return [...result]; }
}

export class AuditRepository {
  async log(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> { const value: any = { ...data, id: undefined, correlationId: data.correlationId, beforeStateJson: data.beforeStateJson ? JSON.parse(data.beforeStateJson) : undefined, afterStateJson: data.afterStateJson ? JSON.parse(data.afterStateJson) : undefined }; const p = pg(); if (p) return legacy((await p.insert(t.auditLogs, value))[0]) as AuditLog; const result = { ...data, id: generateUuidV7(), createdAt: new Date().toISOString() }; db.auditLogs.set(result.id, result); db.persistToDisk(); return result; }
  async search(tenantId: string, limit = 50): Promise<AuditLog[]> { const p = pg(); if (p) return rows<AuditLog>(await p.client.select().from(t.auditLogs).where(eq(t.auditLogs.tenantId, tenantId)).orderBy(desc(t.auditLogs.createdAt)).limit(limit)); return Array.from(db.auditLogs.values()).filter(x => x.tenantId === tenantId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit); }
}

export class NotificationRepository {
  async findByRecipient(userId: string, tenantId: string): Promise<Notification[]> { const p = pg(); if (p) return rows<Notification>(await p.client.select().from(t.notifications).where(and(eq(t.notifications.recipientUserId, userId), eq(t.notifications.tenantId, tenantId))).orderBy(desc(t.notifications.createdAt))); return Array.from(db.notifications.values()).filter(x => x.recipientUserId === userId && x.tenantId === tenantId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
  async create(data: Partial<Notification>): Promise<Notification> { const value: any = { ...data, id: undefined, isRead: false }; const p = pg(); if (p) return legacy((await p.insert(t.notifications, value))[0]) as Notification; const result = { ...value, id: value.id || generateUuidV7(), createdAt: new Date().toISOString() } as Notification; db.notifications.set(result.id, result); db.persistToDisk(); return result; }
  async markAsRead(id: string, tenantId: string): Promise<boolean> { const p = pg(); if (p) return (await p.update(t.notifications, { isRead: true, readAt: new Date() }, and(eq(t.notifications.id, id), eq(t.notifications.tenantId, tenantId)))).length > 0; const x = db.notifications.get(id); if (!x || x.tenantId !== tenantId) return false; x.isRead = true; x.readAt = new Date().toISOString(); db.persistToDisk(); return true; }
}

export class DocumentRepository {
  async findByEntity(tenantId: string, module: string, entityType: string, entityId: string): Promise<Document[]> { const p = pg(); if (p) return rows<Document>(await p.client.select().from(t.documents).where(and(eq(t.documents.tenantId, tenantId), eq(t.documents.module, module), eq(t.documents.entityType, entityType), eq(t.documents.entityId, entityId)))); return Array.from(db.documents.values()).filter(x => x.tenantId === tenantId && x.module === module && x.entityType === entityType && x.entityId === entityId && !x.deletedAt); }
  async registerMetadata(data: Partial<Document>): Promise<Document> { const value: any = { ...data, id: undefined, module: data.module || 'Shared Core', entityType: data.entityType || 'GENERAL', entityId: data.entityId || '0', fileSize: data.fileSize || 1024, mimeType: data.mimeType || 'application/pdf', storageKey: data.storageKey || `docs/${data.tenantId}/${Date.now()}_${data.fileName}`, accessLevel: data.accessLevel || 'TENANT_PRIVATE' }; const p = pg(); if (p) return legacy((await p.insert(t.documents, value))[0]) as Document; const result = { ...value, id: value.id || generateUuidV7(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), version: 1 } as Document; db.documents.set(result.id, result); db.persistToDisk(); return result; }
}

export class WorkflowRepository {
  async findDefinitionByCode(tenantId: string, code: string): Promise<WorkflowDefinition | null> { const p = pg(); if (p) return legacy((await p.select(t.workflowDefinitions, and(eq(t.workflowDefinitions.tenantId, tenantId), eq(t.workflowDefinitions.code, code))))[0]) as WorkflowDefinition || null; return Array.from(db.workflowDefinitions.values()).find(x => x.tenantId === tenantId && x.code === code) || null; }
  async createInstance(data: Partial<WorkflowInstance>): Promise<WorkflowInstance> { const value: any = { ...data, id: undefined, status: 'IN_PROGRESS' }; const p = pg(); if (p) return legacy((await p.insert(t.workflowInstances, value))[0]) as WorkflowInstance; const result = { ...value, id: value.id || generateUuidV7(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as WorkflowInstance; db.workflowInstances.set(result.id, result); db.persistToDisk(); return result; }
}
