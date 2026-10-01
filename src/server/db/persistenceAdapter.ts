import fs from 'fs';
import path from 'path';
import { 
  Tenant, Company, Branch, BusinessUnit, User, Role, Permission, 
  UserRole, RolePermission, MasterData, Document, Notification, 
  AuditLog, WorkflowDefinition, WorkflowInstance, WorkflowAction,
  QuarryMaster, StoneProduct, QuarryProduction, QuarryStock,
  GatePass, QuarryLandLease, LandownerSettlement
} from './schema.js';

export interface DatabaseTables {
  tenants: Tenant[];
  companies: Company[];
  branches: Branch[];
  businessUnits: BusinessUnit[];
  users: User[];
  roles: Role[];
  permissions: Permission[];
  userRoles: UserRole[];
  rolePermissions: RolePermission[];
  masterData: MasterData[];
  documents: Document[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  workflowDefinitions: WorkflowDefinition[];
  workflowInstances: WorkflowInstance[];
  workflowActions: WorkflowAction[];

  // Platform 1: Quarry Management Tables
  quarryMasters: QuarryMaster[];
  stoneProducts: StoneProduct[];
  quarryProductions: QuarryProduction[];
  quarryStocks: QuarryStock[];
  gatePasses: GatePass[];
  quarryLandLeases: QuarryLandLease[];
  landownerSettlements: LandownerSettlement[];
}

export interface IPersistenceAdapter {
  providerName: 'LOCAL_JSON' | 'POSTGRES_DRIZZLE';
  isLivePostgresConnected(): boolean;
  loadAll(): Promise<DatabaseTables>;
  saveAll(tables: DatabaseTables): Promise<void>;
  executeHealthCheck(): Promise<{ status: string; engine: string; tablesCount: number }>;
}

function isLocalJsonFallbackAllowed(): boolean {
  return process.env.ALLOW_LOCAL_JSON_FALLBACK === 'true';
}

export class LocalJsonPersistenceAdapter implements IPersistenceAdapter {
  public providerName: 'LOCAL_JSON' = 'LOCAL_JSON';
  private filePath: string;

  constructor(customPath?: string) {
    this.filePath = customPath || path.join(process.cwd(), 'data', 'shared_core_db.json');
  }

  public isLivePostgresConnected(): boolean {
    return false;
  }

  public async loadAll(): Promise<DatabaseTables> {
    if (!isLocalJsonFallbackAllowed()) {
      throw new Error('Local JSON database fallback is disabled. Configure DATABASE_URL or POSTGRES_URL before startup.');
    }

    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseTables;
        return {
          tenants: parsed.tenants || [],
          companies: parsed.companies || [],
          branches: parsed.branches || [],
          businessUnits: parsed.businessUnits || [],
          users: parsed.users || [],
          roles: parsed.roles || [],
          permissions: parsed.permissions || [],
          userRoles: parsed.userRoles || [],
          rolePermissions: parsed.rolePermissions || [],
          masterData: parsed.masterData || [],
          documents: parsed.documents || [],
          notifications: parsed.notifications || [],
          auditLogs: parsed.auditLogs || [],
          workflowDefinitions: parsed.workflowDefinitions || [],
          workflowInstances: parsed.workflowInstances || [],
          workflowActions: parsed.workflowActions || [],
          quarryMasters: parsed.quarryMasters || [],
          stoneProducts: parsed.stoneProducts || [],
          quarryProductions: parsed.quarryProductions || [],
          quarryStocks: parsed.quarryStocks || [],
          gatePasses: parsed.gatePasses || [],
          quarryLandLeases: parsed.quarryLandLeases || [],
          landownerSettlements: parsed.landownerSettlements || []
        };
      }
    } catch (err) {
      console.warn('[PersistenceAdapter] Could not load JSON persistence file, starting fresh:', err);
    }
    return {
      tenants: [],
      companies: [],
      branches: [],
      businessUnits: [],
      users: [],
      roles: [],
      permissions: [],
      userRoles: [],
      rolePermissions: [],
      masterData: [],
      documents: [],
      notifications: [],
      auditLogs: [],
      workflowDefinitions: [],
      workflowInstances: [],
      workflowActions: [],
      quarryMasters: [],
      stoneProducts: [],
      quarryProductions: [],
      quarryStocks: [],
      gatePasses: [],
      quarryLandLeases: [],
      landownerSettlements: []
    };
  }

  public async saveAll(tables: DatabaseTables): Promise<void> {
    if (!isLocalJsonFallbackAllowed()) {
      throw new Error('Local JSON database fallback is disabled. Configure DATABASE_URL or POSTGRES_URL before startup.');
    }

    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.filePath, JSON.stringify(tables, null, 2), 'utf-8');
    } catch (err) {
      console.error('[PersistenceAdapter] Failed to save JSON database state:', err);
    }
  }

  public async executeHealthCheck(): Promise<{ status: string; engine: string; tablesCount: number }> {
    if (!isLocalJsonFallbackAllowed()) {
      throw new Error('Local JSON database fallback is disabled. Configure DATABASE_URL or POSTGRES_URL before startup.');
    }

    return {
      status: 'ACTIVE_FALLBACK',
      engine: 'Local JSON File System (/data/shared_core_db.json)',
      tablesCount: 23
    };
  }
}

import { postgresManager } from './postgresPool.js';

export class PostgresPersistenceAdapter implements IPersistenceAdapter {
  public providerName: 'POSTGRES_DRIZZLE' = 'POSTGRES_DRIZZLE';

  public isLivePostgresConnected(): boolean {
    return postgresManager.isConfigured();
  }

  public async loadAll(): Promise<DatabaseTables> {
    const pool = postgresManager.getPool();
    if (!pool) {
      throw new Error('PostgreSQL connection credentials not provided in environment variables.');
    }

    const client = await pool.connect();
    try {
      const fetchTableRows = async (tableName: string): Promise<any[]> => {
        const res = await client.query(`SELECT * FROM ${tableName}`);
        return res.rows;
      };

      const [
        tenants,
        companies,
        branches,
        businessUnits,
        users,
        roles,
        permissions,
        userRoles,
        rolePermissions,
        masterData,
        documents,
        notifications,
        auditLogs,
        workflowDefinitions,
        workflowInstances,
        workflowActions,
        quarryMasters,
        stoneProducts,
        quarryProductions,
        quarryStocks,
        gatePasses,
        quarryLandLeases,
        landownerSettlements
      ] = await Promise.all([
        fetchTableRows('core_tenants'),
        fetchTableRows('core_companies'),
        fetchTableRows('core_branches'),
        fetchTableRows('core_business_units'),
        fetchTableRows('core_users'),
        fetchTableRows('core_roles'),
        fetchTableRows('core_permissions'),
        fetchTableRows('core_user_roles'),
        fetchTableRows('core_role_permissions'),
        fetchTableRows('core_master_data'),
        fetchTableRows('core_documents'),
        fetchTableRows('core_notifications'),
        fetchTableRows('core_audit_logs'),
        fetchTableRows('core_workflow_definitions'),
        fetchTableRows('core_workflow_instances'),
        fetchTableRows('core_workflow_actions'),
        fetchTableRows('quarry_masters'),
        fetchTableRows('stone_products'),
        fetchTableRows('quarry_productions'),
        fetchTableRows('quarry_stocks'),
        fetchTableRows('gate_passes'),
        fetchTableRows('quarry_land_leases'),
        fetchTableRows('landowner_settlements')
      ]);

      return {
        tenants,
        companies,
        branches,
        businessUnits,
        users,
        roles,
        permissions,
        userRoles,
        rolePermissions,
        masterData,
        documents,
        notifications,
        auditLogs,
        workflowDefinitions,
        workflowInstances,
        workflowActions,
        quarryMasters,
        stoneProducts,
        quarryProductions,
        quarryStocks,
        gatePasses,
        quarryLandLeases,
        landownerSettlements
      };
    } finally {
      client.release();
    }
  }

  public async saveAll(tables: DatabaseTables): Promise<void> {
    const pool = postgresManager.getPool();
    if (!pool) {
      throw new Error('PostgreSQL connection credentials not provided in environment variables.');
    }
    // Database write operations in PostgreSQL are executed transactionally at repository level
  }

  public async executeHealthCheck(): Promise<{ status: string; engine: string; tablesCount: number }> {
    const health = await postgresManager.checkHealth();
    return {
      status: health.status,
      engine: health.engine,
      tablesCount: health.tablesCount
    };
  }
}
