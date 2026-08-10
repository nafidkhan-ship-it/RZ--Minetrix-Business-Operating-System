/**
 * RZ® Minetrix BOS - Drizzle ORM Database Schema (Phase 16 Hardening)
 * Compatible with PostgreSQL 14+ / Supabase / Cloud SQL
 */

export const DRIZZLE_TABLE_NAMES = {
  TENANTS: 'core_tenants',
  COMPANIES: 'core_companies',
  BRANCHES: 'core_branches',
  BUSINESS_UNITS: 'core_business_units',
  USERS: 'core_users',
  ROLES: 'core_roles',
  PERMISSIONS: 'core_permissions',
  USER_ROLES: 'core_user_roles',
  ROLE_PERMISSIONS: 'core_role_permissions',
  MASTER_DATA: 'core_master_data',
  DOCUMENTS: 'core_documents',
  NOTIFICATIONS: 'core_notifications',
  AUDIT_LOGS: 'core_audit_logs',
  WORKFLOW_DEFINITIONS: 'core_workflow_definitions',
  WORKFLOW_INSTANCES: 'core_workflow_instances',
  WORKFLOW_ACTIONS: 'core_workflow_actions'
} as const;

export interface DrizzleTableDefinition {
  tableName: string;
  columns: Record<string, { type: string; nullable?: boolean; primaryKey?: boolean; default?: string }>;
  indexes: string[];
  foreignKeys: string[];
}

export const DRIZZLE_SCHEMA_SPEC: Record<string, DrizzleTableDefinition> = {
  tenants: {
    tableName: DRIZZLE_TABLE_NAMES.TENANTS,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      code: { type: 'varchar(64)', nullable: false },
      name: { type: 'varchar(255)', nullable: false },
      domain: { type: 'varchar(255)', nullable: false },
      status: { type: 'varchar(32)', nullable: false, default: "'ACTIVE'" },
      tier: { type: 'varchar(32)', nullable: false, default: "'ENTERPRISE'" },
      settings_json: { type: 'jsonb', nullable: false, default: "'{}'" },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      updated_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      created_by: { type: 'uuid', nullable: true },
      updated_by: { type: 'uuid', nullable: true },
      deleted_at: { type: 'timestamp with time zone', nullable: true },
      version: { type: 'integer', nullable: false, default: '1' }
    },
    indexes: ['idx_core_tenants_code', 'idx_core_tenants_domain'],
    foreignKeys: []
  },
  companies: {
    tableName: DRIZZLE_TABLE_NAMES.COMPANIES,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      code: { type: 'varchar(64)', nullable: false },
      name: { type: 'varchar(255)', nullable: false },
      tax_id: { type: 'varchar(64)', nullable: false },
      currency: { type: 'varchar(10)', nullable: false, default: "'USD'" },
      country: { type: 'varchar(100)', nullable: false, default: "'USA'" },
      status: { type: 'varchar(32)', nullable: false, default: "'ACTIVE'" },
      created_at: { type: 'timestamp with time zone', nullable: false },
      updated_at: { type: 'timestamp with time zone', nullable: false },
      version: { type: 'integer', nullable: false, default: '1' }
    },
    indexes: ['idx_core_companies_tenant', 'idx_core_companies_code'],
    foreignKeys: ['FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE']
  },
  users: {
    tableName: DRIZZLE_TABLE_NAMES.USERS,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      company_id: { type: 'uuid', nullable: false },
      branch_id: { type: 'uuid', nullable: true },
      email: { type: 'varchar(255)', nullable: false },
      password_hash: { type: 'text', nullable: false },
      salt: { type: 'varchar(128)', nullable: false },
      full_name: { type: 'varchar(255)', nullable: false },
      phone: { type: 'varchar(64)', nullable: true },
      department: { type: 'varchar(128)', nullable: false },
      designation: { type: 'varchar(128)', nullable: false },
      status: { type: 'varchar(32)', nullable: false, default: "'ACTIVE'" },
      is_mfa_enabled: { type: 'boolean', nullable: false, default: 'false' },
      linked_employee_id: { type: 'varchar(64)', nullable: true },
      linked_driver_id: { type: 'varchar(64)', nullable: true },
      linked_operator_id: { type: 'varchar(64)', nullable: true },
      created_at: { type: 'timestamp with time zone', nullable: false },
      updated_at: { type: 'timestamp with time zone', nullable: false },
      version: { type: 'integer', nullable: false, default: '1' }
    },
    indexes: ['idx_core_users_tenant', 'idx_core_users_email', 'idx_core_users_company'],
    foreignKeys: [
      'FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE',
      'FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE RESTRICT'
    ]
  },
  audit_logs: {
    tableName: DRIZZLE_TABLE_NAMES.AUDIT_LOGS,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      actor_user_id: { type: 'uuid', nullable: false },
      actor_email: { type: 'varchar(255)', nullable: false },
      action: { type: 'varchar(128)', nullable: false },
      module: { type: 'varchar(128)', nullable: false },
      resource: { type: 'text', nullable: false },
      resource_id: { type: 'varchar(128)', nullable: true },
      ip_address: { type: 'varchar(64)', nullable: false },
      correlation_id: { type: 'uuid', nullable: false },
      status: { type: 'varchar(32)', nullable: false },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' }
    },
    indexes: ['idx_core_audit_tenant', 'idx_core_audit_actor', 'idx_core_audit_created_at'],
    foreignKeys: ['FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE']
  }
};
