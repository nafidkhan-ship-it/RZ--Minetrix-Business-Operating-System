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
  WORKFLOW_ACTIONS: 'core_workflow_actions',

  // Fleet Tables
  FLEET_VEHICLE_CATEGORIES: 'fleet_vehicle_categories',
  FLEET_VEHICLES: 'fleet_vehicles',
  FLEET_VEHICLE_DOCUMENTS: 'fleet_vehicle_documents',
  FLEET_DRIVERS: 'fleet_drivers',
  FLEET_VEHICLE_ASSIGNMENTS: 'fleet_vehicle_assignments',
  FLEET_TRIPS: 'fleet_trips',
  FLEET_TRIP_STOPS: 'fleet_trip_stops',
  FLEET_FUEL_LOGS: 'fleet_fuel_logs',
  FLEET_MAINTENANCE_RECORDS: 'fleet_maintenance_records',
  FLEET_SERVICE_RECORDS: 'fleet_service_records',
  FLEET_TYRE_RECORDS: 'fleet_tyre_records',
  FLEET_BATTERY_RECORDS: 'fleet_battery_records',
  FLEET_INSURANCE_RECORDS: 'fleet_insurance_records',
  FLEET_COMPLIANCE_RECORDS: 'fleet_compliance_records',
  FLEET_ODOMETER_LOGS: 'fleet_odometer_logs',
  FLEET_VEHICLE_EXPENSES: 'fleet_vehicle_expenses',
  FLEET_VEHICLE_REVENUE: 'fleet_vehicle_revenue',
  FLEET_VEHICLE_STATUS_HISTORY: 'fleet_vehicle_status_history',
  FLEET_VEHICLE_ALERTS: 'fleet_vehicle_alerts',

  // Phase 19 Marketplace Tables
  MARKETPLACE_TRANSPORTER_PROFILES: 'marketplace_transporter_profiles',
  MARKETPLACE_SERVICE_AREAS: 'marketplace_service_areas',
  MARKETPLACE_LOAD_REQUESTS: 'marketplace_load_requests',
  MARKETPLACE_LOAD_MATCHES: 'marketplace_load_matches',
  MARKETPLACE_LOAD_OFFERS: 'marketplace_load_offers',
  MARKETPLACE_BOOKINGS: 'marketplace_bookings',
  MARKETPLACE_PRICING_RULES: 'marketplace_pricing_rules',
  MARKETPLACE_DELIVERIES: 'marketplace_deliveries',
  MARKETPLACE_RATINGS: 'marketplace_ratings',
  MARKETPLACE_DISPUTES: 'marketplace_disputes',
  MARKETPLACE_MATCHING_EVENTS: 'marketplace_matching_events',

  // Phase 20 CRM Tables
  CRM_CUSTOMERS: 'crm_customers',
  CRM_CONTACTS: 'crm_contacts',
  CRM_LEADS: 'crm_leads',
  CRM_OPPORTUNITIES: 'crm_opportunities',
  CRM_SALES_ACTIVITIES: 'crm_sales_activities',
  CRM_QUOTATIONS: 'crm_quotations',
  CRM_QUOTATION_ITEMS: 'crm_quotation_items',
  CRM_CUSTOMER_CREDIT: 'crm_customer_credit',
  CRM_CUSTOMER_DOCUMENTS: 'crm_customer_documents',
  CRM_SUPPORT_TICKETS: 'crm_support_tickets',
  CRM_CUSTOMER_SEGMENTS: 'crm_customer_segments',
  CRM_CUSTOMER_SEGMENT_MEMBERS: 'crm_customer_segment_members',
  CRM_CUSTOMER_HEALTH: 'crm_customer_health',
  CRM_CUSTOMER_NOTES: 'crm_customer_notes',

  // Phase 21 Finance Tables
  FINANCE_CHART_OF_ACCOUNTS: 'finance_chart_of_accounts',
  FINANCE_FISCAL_YEARS: 'finance_fiscal_years',
  FINANCE_FISCAL_PERIODS: 'finance_fiscal_periods',
  FINANCE_COST_CENTERS: 'finance_cost_centers',
  FINANCE_PROJECTS: 'finance_projects',
  FINANCE_JOURNALS: 'finance_journals',
  FINANCE_JOURNAL_LINES: 'finance_journal_lines',
  FINANCE_CUSTOMER_INVOICES: 'finance_customer_invoices',
  FINANCE_INVOICE_ITEMS: 'finance_invoice_items',
  FINANCE_CUSTOMER_PAYMENTS: 'finance_customer_payments',
  FINANCE_PAYMENT_ALLOCATIONS: 'finance_payment_allocations',
  FINANCE_SUPPLIER_BILLS: 'finance_supplier_bills',
  FINANCE_SUPPLIER_BILL_ITEMS: 'finance_supplier_bill_items',
  FINANCE_SUPPLIER_PAYMENTS: 'finance_supplier_payments',
  FINANCE_EXPENSES: 'finance_expenses',
  FINANCE_BANK_ACCOUNTS: 'finance_bank_accounts',
  FINANCE_BANK_TRANSACTIONS: 'finance_bank_transactions',
  FINANCE_RECONCILIATIONS: 'finance_reconciliations',
  FINANCE_CREDIT_NOTES: 'finance_credit_notes',
  FINANCE_DEBIT_NOTES: 'finance_debit_notes',
  FINANCE_TAX_CODES: 'finance_tax_codes',

  // Phase 22 HRMS Tables
  HR_EMPLOYEES: 'hr_employees',
  HR_DEPARTMENTS: 'hr_departments',
  HR_DESIGNATIONS: 'hr_designations',
  HR_EMPLOYEE_ASSIGNMENTS: 'hr_employee_assignments',
  HR_EMPLOYEE_USERS: 'hr_employee_users',
  HR_SHIFTS: 'hr_shifts',
  HR_EMPLOYEE_SHIFTS: 'hr_employee_shifts',
  HR_ATTENDANCE: 'hr_attendance',
  HR_ATTENDANCE_CORRECTIONS: 'hr_attendance_corrections',
  HR_LEAVE_TYPES: 'hr_leave_types',
  HR_LEAVE_POLICIES: 'hr_leave_policies',
  HR_LEAVE_BALANCES: 'hr_leave_balances',
  HR_LEAVE_APPLICATIONS: 'hr_leave_applications',
  HR_HOLIDAYS: 'hr_holidays',
  HR_OVERTIME: 'hr_overtime',
  HR_SALARY_STRUCTURES: 'hr_salary_structures',
  HR_SALARY_COMPONENTS: 'hr_salary_components',
  HR_PAYROLL_YEARS: 'hr_payroll_years',
  HR_PAYROLL_PERIODS: 'hr_payroll_periods',
  HR_PAYROLL_RUNS: 'hr_payroll_runs',
  HR_PAYROLL_ITEMS: 'hr_payroll_items',
  HR_PAYSLIPS: 'hr_payslips',
  HR_SALARY_ADVANCES: 'hr_salary_advances',
  HR_EMPLOYEE_LOANS: 'hr_employee_loans',
  HR_LOAN_INSTALLMENTS: 'hr_loan_installments',
  HR_REIMBURSEMENTS: 'hr_reimbursements',
  HR_EMPLOYEE_DOCUMENTS: 'hr_employee_documents',
  HR_PERFORMANCE_CYCLES: 'hr_performance_cycles',
  HR_EMPLOYEE_GOALS: 'hr_employee_goals',
  HR_EMPLOYEE_REVIEWS: 'hr_employee_reviews',
  HR_JOB_REQUISITIONS: 'hr_job_requisitions',
  HR_CANDIDATES: 'hr_candidates',
  HR_APPLICATIONS: 'hr_applications',
  HR_INTERVIEWS: 'hr_interviews',
  HR_OFFERS: 'hr_offers',
  HR_ONBOARDING: 'hr_onboarding',
  HR_OFFBOARDING: 'hr_offboarding',
  HR_FINAL_SETTLEMENTS: 'hr_final_settlements',

  // Platform 1: Quarry Management Tables
  QUARRY_MASTERS: 'quarry_masters',
  STONE_PRODUCTS: 'stone_products',
  QUARRY_PRODUCTIONS: 'quarry_productions',
  QUARRY_STOCKS: 'quarry_stocks',
  GATE_PASSES: 'gate_passes',
  QUARRY_LAND_LEASES: 'quarry_land_leases',
  LANDOWNER_SETTLEMENTS: 'landowner_settlements'
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
  },

  // Quarry Management Drizzle Schema Specs
  quarry_masters: {
    tableName: DRIZZLE_TABLE_NAMES.QUARRY_MASTERS,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      company_id: { type: 'uuid', nullable: false },
      branch_id: { type: 'uuid', nullable: true },
      business_unit_id: { type: 'uuid', nullable: true },
      name: { type: 'varchar(255)', nullable: false },
      quarry_type: { type: 'varchar(32)', nullable: false },
      status: { type: 'varchar(32)', nullable: false, default: "'ACTIVE'" },
      location: { type: 'varchar(255)', nullable: false },
      address: { type: 'text', nullable: true },
      owner_id: { type: 'varchar(64)', nullable: false },
      lease_reference: { type: 'varchar(128)', nullable: true },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      updated_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      created_by: { type: 'uuid', nullable: true },
      updated_by: { type: 'uuid', nullable: true },
      deleted_at: { type: 'timestamp with time zone', nullable: true },
      version: { type: 'integer', nullable: false, default: '1' }
    },
    indexes: ['uq_quarry_masters_name', 'idx_quarry_masters_tenant', 'idx_quarry_masters_company', 'idx_quarry_masters_type'],
    foreignKeys: [
      'FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE',
      'FOREIGN KEY (company_id) REFERENCES core_companies(id) ON DELETE RESTRICT'
    ]
  },
  stone_products: {
    tableName: DRIZZLE_TABLE_NAMES.STONE_PRODUCTS,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      quarry_id: { type: 'uuid', nullable: false },
      product_code: { type: 'varchar(64)', nullable: false },
      name: { type: 'varchar(255)', nullable: false },
      mineral_type: { type: 'varchar(32)', nullable: false },
      dimensions: { type: 'varchar(64)', nullable: true },
      unit: { type: 'varchar(32)', nullable: false },
      default_price: { type: 'numeric(14,4)', nullable: false, default: '0.0000' },
      gst_rate: { type: 'numeric(6,2)', nullable: false, default: '5.00' },
      status: { type: 'varchar(32)', nullable: false, default: "'ACTIVE'" },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      updated_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      created_by: { type: 'uuid', nullable: true },
      updated_by: { type: 'uuid', nullable: true }
    },
    indexes: ['uq_stone_products_code', 'idx_stone_products_tenant', 'idx_stone_products_quarry', 'idx_stone_products_mineral'],
    foreignKeys: [
      'FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE',
      'FOREIGN KEY (quarry_id) REFERENCES quarry_masters(id) ON DELETE CASCADE'
    ]
  },
  quarry_productions: {
    tableName: DRIZZLE_TABLE_NAMES.QUARRY_PRODUCTIONS,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      quarry_id: { type: 'uuid', nullable: false },
      product_id: { type: 'uuid', nullable: false },
      production_type: { type: 'varchar(64)', nullable: false },
      production_date: { type: 'date', nullable: false },
      shift: { type: 'varchar(32)', nullable: false },
      quantity: { type: 'numeric(14,4)', nullable: false },
      unit: { type: 'varchar(32)', nullable: false },
      operator_id: { type: 'varchar(64)', nullable: false },
      machine_id: { type: 'varchar(64)', nullable: true },
      remarks: { type: 'text', nullable: true },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      updated_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      created_by: { type: 'uuid', nullable: true }
    },
    indexes: ['idx_quarry_prod_tenant', 'idx_quarry_prod_quarry', 'idx_quarry_prod_product', 'idx_quarry_prod_date'],
    foreignKeys: [
      'FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE',
      'FOREIGN KEY (quarry_id) REFERENCES quarry_masters(id) ON DELETE RESTRICT',
      'FOREIGN KEY (product_id) REFERENCES stone_products(id) ON DELETE RESTRICT'
    ]
  },
  quarry_stocks: {
    tableName: DRIZZLE_TABLE_NAMES.QUARRY_STOCKS,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      quarry_id: { type: 'uuid', nullable: false },
      product_id: { type: 'uuid', nullable: false },
      transaction_type: { type: 'varchar(32)', nullable: false },
      reference_type: { type: 'varchar(32)', nullable: false },
      reference_id: { type: 'varchar(128)', nullable: false },
      quantity_in: { type: 'numeric(14,4)', nullable: false, default: '0.0000' },
      quantity_out: { type: 'numeric(14,4)', nullable: false, default: '0.0000' },
      balance_quantity: { type: 'numeric(14,4)', nullable: false },
      transaction_date: { type: 'date', nullable: false },
      created_by: { type: 'uuid', nullable: true },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' }
    },
    indexes: ['uq_quarry_stocks_ref', 'idx_quarry_stocks_tenant', 'idx_quarry_stocks_quarry_prod', 'idx_quarry_stocks_created_at'],
    foreignKeys: [
      'FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE',
      'FOREIGN KEY (quarry_id) REFERENCES quarry_masters(id) ON DELETE RESTRICT',
      'FOREIGN KEY (product_id) REFERENCES stone_products(id) ON DELETE RESTRICT'
    ]
  },
  gate_passes: {
    tableName: DRIZZLE_TABLE_NAMES.GATE_PASSES,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      quarry_id: { type: 'uuid', nullable: false },
      pass_number: { type: 'varchar(64)', nullable: false },
      customer_id: { type: 'varchar(64)', nullable: false },
      product_id: { type: 'uuid', nullable: false },
      quantity: { type: 'numeric(14,4)', nullable: false },
      unit: { type: 'varchar(32)', nullable: false },
      vehicle_id: { type: 'varchar(64)', nullable: true },
      vehicle_no: { type: 'varchar(64)', nullable: true },
      driver_id: { type: 'varchar(64)', nullable: true },
      driver_name: { type: 'varchar(255)', nullable: true },
      gross_weight: { type: 'numeric(14,4)', nullable: true },
      tare_weight: { type: 'numeric(14,4)', nullable: true },
      net_weight: { type: 'numeric(14,4)', nullable: true },
      status: { type: 'varchar(32)', nullable: false, default: "'ISSUED'" },
      sales_reference: { type: 'varchar(128)', nullable: true },
      finance_invoice_id: { type: 'varchar(128)', nullable: true },
      created_by: { type: 'uuid', nullable: true },
      approved_by: { type: 'uuid', nullable: true },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      updated_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' }
    },
    indexes: ['uq_gate_passes_number', 'idx_gate_passes_tenant', 'idx_gate_passes_quarry', 'idx_gate_passes_status', 'idx_gate_passes_customer'],
    foreignKeys: [
      'FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE',
      'FOREIGN KEY (quarry_id) REFERENCES quarry_masters(id) ON DELETE RESTRICT',
      'FOREIGN KEY (product_id) REFERENCES stone_products(id) ON DELETE RESTRICT'
    ]
  },
  quarry_land_leases: {
    tableName: DRIZZLE_TABLE_NAMES.QUARRY_LAND_LEASES,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      quarry_id: { type: 'uuid', nullable: false },
      owner_id: { type: 'varchar(64)', nullable: true },
      owner_name: { type: 'varchar(255)', nullable: false },
      survey_number: { type: 'varchar(128)', nullable: false },
      village: { type: 'varchar(128)', nullable: false },
      taluk: { type: 'varchar(128)', nullable: false },
      area: { type: 'numeric(10,4)', nullable: false },
      lease_type: { type: 'varchar(32)', nullable: false },
      royalty_type: { type: 'varchar(32)', nullable: false },
      royalty_rate: { type: 'numeric(14,4)', nullable: false, default: '0.0000' },
      start_date: { type: 'date', nullable: false },
      expiry_date: { type: 'date', nullable: false },
      status: { type: 'varchar(32)', nullable: false, default: "'ACTIVE'" },
      document_reference: { type: 'varchar(255)', nullable: true },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      updated_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' }
    },
    indexes: ['idx_quarry_leases_tenant', 'idx_quarry_leases_quarry', 'idx_quarry_leases_survey'],
    foreignKeys: [
      'FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE',
      'FOREIGN KEY (quarry_id) REFERENCES quarry_masters(id) ON DELETE CASCADE'
    ]
  },
  landowner_settlements: {
    tableName: DRIZZLE_TABLE_NAMES.LANDOWNER_SETTLEMENTS,
    columns: {
      id: { type: 'uuid', primaryKey: true, nullable: false },
      tenant_id: { type: 'uuid', nullable: false },
      lease_id: { type: 'uuid', nullable: false },
      period_start: { type: 'date', nullable: false },
      period_end: { type: 'date', nullable: false },
      basis_quantity: { type: 'numeric(14,4)', nullable: false, default: '0.0000' },
      calculated_amount: { type: 'numeric(14,4)', nullable: false, default: '0.0000' },
      status: { type: 'varchar(32)', nullable: false, default: "'DRAFT'" },
      finance_bill_id: { type: 'varchar(128)', nullable: true },
      created_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' },
      updated_at: { type: 'timestamp with time zone', nullable: false, default: 'NOW()' }
    },
    indexes: ['idx_land_settlements_tenant', 'idx_land_settlements_lease', 'idx_land_settlements_status'],
    foreignKeys: [
      'FOREIGN KEY (tenant_id) REFERENCES core_tenants(id) ON DELETE CASCADE',
      'FOREIGN KEY (lease_id) REFERENCES quarry_land_leases(id) ON DELETE RESTRICT'
    ]
  }
};
