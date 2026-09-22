import fs from 'fs';
import path from 'path';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from './drizzleSchema.js';
import * as tables from './drizzleSchema.js';
import { Tenant, Company, Branch, BusinessUnit, User, Role, Permission, UserRole, RolePermission, MasterData, Document, Notification, AuditLog, WorkflowDefinition, WorkflowInstance, WorkflowAction } from './schema.js';

export interface DatabaseTables { tenants: Tenant[]; companies: Company[]; branches: Branch[]; businessUnits: BusinessUnit[]; users: User[]; roles: Role[]; permissions: Permission[]; userRoles: UserRole[]; rolePermissions: RolePermission[]; masterData: MasterData[]; documents: Document[]; notifications: Notification[]; auditLogs: AuditLog[]; workflowDefinitions: WorkflowDefinition[]; workflowInstances: WorkflowInstance[]; workflowActions: WorkflowAction[]; }
const empty = (): DatabaseTables => ({ tenants: [], companies: [], branches: [], businessUnits: [], users: [], roles: [], permissions: [], userRoles: [], rolePermissions: [], masterData: [], documents: [], notifications: [], auditLogs: [], workflowDefinitions: [], workflowInstances: [], workflowActions: [] });
const iso = (v: unknown) => v instanceof Date ? v.toISOString() : v;
const normalize = (row: any) => Object.fromEntries(Object.entries(row).map(([k, v]) => [k, iso(v)]));

export interface IPersistenceAdapter {
  providerName: 'LOCAL_JSON' | 'POSTGRES_DRIZZLE';
  isLivePostgresConnected(): boolean;
  loadAll(): Promise<DatabaseTables>;
  saveAll(tables: DatabaseTables): Promise<void>;
  executeHealthCheck(): Promise<{ status: string; engine: string; tablesCount: number }>;
  close?(): Promise<void>;
}

export class LocalJsonPersistenceAdapter implements IPersistenceAdapter {
  providerName = 'LOCAL_JSON' as const;
  constructor(private filePath = path.join(process.cwd(), 'data', 'shared_core_db.json')) {}
  isLivePostgresConnected() { return false; }
  async loadAll() {
    try { if (fs.existsSync(this.filePath)) return JSON.parse(fs.readFileSync(this.filePath, 'utf8')) as DatabaseTables; } catch (error) { console.warn('[DB] Invalid local JSON database:', error); }
    return empty();
  }
  async saveAll(tables: DatabaseTables) { fs.mkdirSync(path.dirname(this.filePath), { recursive: true }); fs.writeFileSync(this.filePath, JSON.stringify(tables, null, 2)); }
  async executeHealthCheck() { return { status: 'ACTIVE_LOCAL', engine: 'Explicit local JSON development adapter', tablesCount: 16 }; }
}

export class PostgresPersistenceAdapter implements IPersistenceAdapter {
  providerName = 'POSTGRES_DRIZZLE' as const;
  readonly pool: Pool;
  readonly client: NodePgDatabase<typeof schema>;
  constructor(url = process.env.DATABASE_URL) {
    if (!url) throw new Error('DATABASE_URL is required for PostgreSQL persistence; refusing an implicit local fallback.');
    this.pool = new Pool({ connectionString: url, max: Number(process.env.DB_POOL_MAX || 10), connectionTimeoutMillis: 5000 });
    this.client = drizzle(this.pool, { schema });
  }
  isLivePostgresConnected() { return true; }
  async setTenantContext(tenantId: string) {
    await this.pool.query('select set_config($1, $2, false)', ['app.current_tenant_id', tenantId]);
  }
  async select(table: any, where?: any) {
    const query = this.client.select().from(table);
    return (where ? query.where(where) : query) as any;
  }
  async insert(table: any, values: any) { return this.client.insert(table).values(values).returning() as any; }
  async update(table: any, values: any, where: any) { return this.client.update(table).set(values).where(where).returning() as any; }
  async loadAll(): Promise<DatabaseTables> {
    const [tenants, companies, branches, businessUnits, users, roles, permissions, userRoles, rolePermissions, masterData, documents, notifications, auditLogs, workflowDefinitions, workflowInstances, workflowActions] = await Promise.all([
      this.client.select().from(tables.tenants), this.client.select().from(tables.companies), this.client.select().from(tables.branches), this.client.select().from(tables.businessUnits), this.client.select().from(tables.users), this.client.select().from(tables.roles), this.client.select().from(tables.permissions), this.client.select().from(tables.userRoles), this.client.select().from(tables.rolePermissions), this.client.select().from(tables.masterData), this.client.select().from(tables.documents), this.client.select().from(tables.notifications), this.client.select().from(tables.auditLogs), this.client.select().from(tables.workflowDefinitions), this.client.select().from(tables.workflowInstances), this.client.select().from(tables.workflowActions)
    ]);
    return { tenants: tenants.map(normalize) as unknown as Tenant[], companies: companies.map(normalize) as unknown as Company[], branches: branches.map(normalize) as unknown as Branch[], businessUnits: businessUnits.map(normalize) as unknown as BusinessUnit[], users: users.map(normalize) as unknown as User[], roles: roles.map(normalize) as unknown as Role[], permissions: permissions.map(normalize) as unknown as Permission[], userRoles: userRoles.map(normalize) as unknown as UserRole[], rolePermissions: rolePermissions.map(normalize) as unknown as RolePermission[], masterData: masterData.map(normalize) as unknown as MasterData[], documents: documents.map(normalize) as unknown as Document[], notifications: notifications.map(normalize) as unknown as Notification[], auditLogs: auditLogs.map(normalize) as unknown as AuditLog[], workflowDefinitions: workflowDefinitions.map(normalize) as unknown as WorkflowDefinition[], workflowInstances: workflowInstances.map(normalize) as unknown as WorkflowInstance[], workflowActions: workflowActions.map(normalize) as unknown as WorkflowAction[] };
  }
  async saveAll(tablesData: DatabaseTables) {
    await this.client.transaction(async tx => {
      for (const table of [tables.workflowActions, tables.workflowInstances, tables.workflowDefinitions, tables.auditLogs, tables.notifications, tables.documents, tables.masterData, tables.rolePermissions, tables.userRoles, tables.permissions, tables.roles, tables.users, tables.businessUnits, tables.branches, tables.companies, tables.tenants]) await tx.delete(table);
      const entries: Array<[any, any[]]> = [[tables.tenants, tablesData.tenants], [tables.companies, tablesData.companies], [tables.branches, tablesData.branches], [tables.businessUnits, tablesData.businessUnits], [tables.users, tablesData.users], [tables.roles, tablesData.roles], [tables.permissions, tablesData.permissions], [tables.userRoles, tablesData.userRoles], [tables.rolePermissions, tablesData.rolePermissions], [tables.masterData, tablesData.masterData], [tables.documents, tablesData.documents], [tables.notifications, tablesData.notifications], [tables.auditLogs, tablesData.auditLogs], [tables.workflowDefinitions, tablesData.workflowDefinitions], [tables.workflowInstances, tablesData.workflowInstances], [tables.workflowActions, tablesData.workflowActions]];
      for (const [table, rows] of entries) if (rows.length) await tx.insert(table).values(rows as any[]);
    });
  }
  async executeHealthCheck() { await this.pool.query('select 1'); return { status: 'CONNECTED', engine: 'PostgreSQL / Drizzle ORM', tablesCount: 16 }; }
  async close() { await this.pool.end(); }
}
