import fs from 'fs';
import path from 'path';
import pg from 'pg';
import {
  Tenant, Company, Branch, BusinessUnit, User, Role, Permission,
  UserRole, RolePermission, MasterData, Document, Notification,
  AuditLog, WorkflowDefinition, WorkflowInstance, WorkflowAction
} from './schema.js';
import { runDatabaseMigrations } from './migrationRunner.js';

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
}

export interface IPersistenceAdapter {
  providerName: 'LOCAL_JSON' | 'POSTGRES_DRIZZLE';
  isLivePostgresConnected(): boolean;
  initialize(): Promise<void>;
  loadAll(): Promise<DatabaseTables>;
  saveAll(tables: DatabaseTables): Promise<void>;
  executeHealthCheck(): Promise<{ status: string; engine: string; tablesCount: number }>;
}

const EMPTY_TABLES: DatabaseTables = {
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
  workflowActions: []
};

export class LocalJsonPersistenceAdapter implements IPersistenceAdapter {
  public providerName: 'LOCAL_JSON' = 'LOCAL_JSON';
  private filePath: string;

  constructor(customPath?: string) {
    this.filePath = customPath || path.join(process.cwd(), 'data', 'shared_core_db.json');
  }

  public isLivePostgresConnected(): boolean {
    return false;
  }

  public async initialize(): Promise<void> {
    return;
  }

  public async loadAll(): Promise<DatabaseTables> {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw) as DatabaseTables;
      }
    } catch (err) {
      console.warn('[PersistenceAdapter] Could not load JSON persistence file, starting fresh:', err);
    }
    return { ...EMPTY_TABLES };
  }

  public async saveAll(tables: DatabaseTables): Promise<void> {
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
    return {
      status: 'ACTIVE_FALLBACK',
      engine: 'Local JSON File System (/data/shared_core_db.json)',
      tablesCount: 16
    };
  }
}

export class PostgresPersistenceAdapter implements IPersistenceAdapter {
  public providerName: 'POSTGRES_DRIZZLE' = 'POSTGRES_DRIZZLE';
  private connectionUrl?: string;
  private pool: pg.Pool | null = null;
  private initialized = false;

  constructor() {
    this.connectionUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  }

  public isLivePostgresConnected(): boolean {
    return Boolean(this.connectionUrl && this.connectionUrl.length > 5);
  }

  private getPool(): pg.Pool {
    if (!this.pool) {
      if (!this.connectionUrl) {
        throw new Error('PostgreSQL connection credentials not provided in environment variables.');
      }
      this.pool = new pg.Pool({
        connectionString: this.connectionUrl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000
      });
    }
    return this.pool;
  }

  public async initialize(): Promise<void> {
    if (this.initialized || !this.isLivePostgresConnected()) {
      return;
    }

    const applied = await runDatabaseMigrations(this.connectionUrl!);
    if (applied.length > 0) {
      console.log(`[DB] Applied PostgreSQL migrations: ${applied.join(', ')}`);
    }
    this.initialized = true;
  }

  public async loadAll(): Promise<DatabaseTables> {
    if (!this.isLivePostgresConnected()) {
      throw new Error('PostgreSQL connection credentials not provided in environment variables.');
    }

    await this.initialize();
    const pool = this.getPool();
    const result = await pool.query(
      `SELECT state_json FROM core_platform_snapshot WHERE snapshot_key = $1 LIMIT 1`,
      ['primary']
    );

    if (!result.rowCount) {
      return { ...EMPTY_TABLES };
    }

    return result.rows[0].state_json as DatabaseTables;
  }

  public async saveAll(tables: DatabaseTables): Promise<void> {
    if (!this.isLivePostgresConnected()) {
      throw new Error('PostgreSQL connection credentials not provided in environment variables.');
    }

    await this.initialize();
    const pool = this.getPool();
    await pool.query(
      `INSERT INTO core_platform_snapshot (snapshot_key, state_json, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (snapshot_key)
       DO UPDATE SET state_json = EXCLUDED.state_json, updated_at = NOW()`,
      ['primary', JSON.stringify(tables)]
    );
  }

  public async executeHealthCheck(): Promise<{ status: string; engine: string; tablesCount: number }> {
    if (!this.isLivePostgresConnected()) {
      return {
        status: 'CONFIGURATION_REQUIRED',
        engine: 'PostgreSQL Adapter (Pending DATABASE_URL credentials)',
        tablesCount: 0
      };
    }

    try {
      await this.initialize();
      const pool = this.getPool();
      await pool.query('SELECT 1');
      const migrationCount = await pool.query(
        'SELECT COUNT(*)::int AS count FROM core_schema_migrations'
      );
      const snapshotCount = await pool.query(
        'SELECT COUNT(*)::int AS count FROM core_platform_snapshot'
      );

      return {
        status: 'CONNECTED',
        engine: `PostgreSQL (${migrationCount.rows[0].count} migrations, ${snapshotCount.rows[0].count} snapshots)`,
        tablesCount: 16
      };
    } catch (error) {
      console.error('[PersistenceAdapter] PostgreSQL health check failed:', error);
      return {
        status: 'UNHEALTHY',
        engine: 'PostgreSQL connection failed',
        tablesCount: 0
      };
    }
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}
