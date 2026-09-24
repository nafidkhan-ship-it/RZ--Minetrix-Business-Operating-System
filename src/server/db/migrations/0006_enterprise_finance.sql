-- RZ® Minetrix BOS - Enterprise Finance, Accounting & Financial Control Migration 0006
-- PostgreSQL Drizzle Schema & Row-Level Security (RLS) Initializer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Chart of Accounts Table
CREATE TABLE IF NOT EXISTS finance_chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  account_code VARCHAR(64) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  account_type VARCHAR(32) NOT NULL, -- ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
  parent_account_id UUID REFERENCES finance_chart_of_accounts(id) ON DELETE SET NULL,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  is_control_account BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_acc_code UNIQUE (tenant_id, account_code)
);

CREATE INDEX IF NOT EXISTS idx_fin_coa_tenant ON finance_chart_of_accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_coa_type ON finance_chart_of_accounts(account_type);

-- 2. Fiscal Years Table
CREATE TABLE IF NOT EXISTS finance_fiscal_years (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  year_code VARCHAR(32) NOT NULL,
  year_name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN', -- OPEN, LOCKED, CLOSED
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_fy_code UNIQUE (tenant_id, year_code)
);

CREATE INDEX IF NOT EXISTS idx_fin_fy_tenant ON finance_fiscal_years(tenant_id);

-- 3. Fiscal Periods Table
CREATE TABLE IF NOT EXISTS finance_fiscal_periods (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  fiscal_year_id UUID NOT NULL REFERENCES finance_fiscal_years(id) ON DELETE CASCADE,
  period_number INTEGER NOT NULL,
  period_name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN', -- OPEN, LOCKED, CLOSED
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_fp_num UNIQUE (tenant_id, fiscal_year_id, period_number)
);

CREATE INDEX IF NOT EXISTS idx_fin_fp_tenant ON finance_fiscal_periods(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_fp_year ON finance_fiscal_periods(fiscal_year_id);

-- 4. Cost Centers Table
CREATE TABLE IF NOT EXISTS finance_cost_centers (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL DEFAULT 'General',
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_cc_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_fin_cc_tenant ON finance_cost_centers(tenant_id);

-- 5. Projects Accounting Table
CREATE TABLE IF NOT EXISTS finance_projects (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  project_code VARCHAR(64) NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  budget NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  actual_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  actual_revenue NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'IN_PROGRESS',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_proj_code UNIQUE (tenant_id, project_code)
);

CREATE INDEX IF NOT EXISTS idx_fin_proj_tenant ON finance_projects(tenant_id);

-- 6. Journals Master Table
CREATE TABLE IF NOT EXISTS finance_journals (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  journal_number VARCHAR(64) NOT NULL,
  journal_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  reference_type VARCHAR(64) NOT NULL DEFAULT 'MANUAL',
  reference_id VARCHAR(128),
  description TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, POSTED, REVERSED
  created_by VARCHAR(64) NOT NULL,
  posted_by VARCHAR(64),
  reversed_by VARCHAR(64),
  reversed_journal_id UUID,
  total_debit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  total_credit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  posted_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_jnl_num UNIQUE (tenant_id, journal_number)
);

CREATE INDEX IF NOT EXISTS idx_fin_jnl_tenant ON finance_journals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_jnl_status ON finance_journals(status);

-- 7. Journal Lines Table
CREATE TABLE IF NOT EXISTS finance_journal_lines (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  journal_id UUID NOT NULL REFERENCES finance_journals(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES finance_chart_of_accounts(id),
  debit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  credit NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  cost_center_id UUID REFERENCES finance_cost_centers(id),
  project_id UUID REFERENCES finance_projects(id),
  customer_id UUID REFERENCES crm_customers(id),
  supplier_id VARCHAR(128),
  description TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_fin_jnl_line_tenant ON finance_journal_lines(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_jnl_line_journal ON finance_journal_lines(journal_id);
CREATE INDEX IF NOT EXISTS idx_fin_jnl_line_account ON finance_journal_lines(account_id);

-- 8. Customer Invoices Table
CREATE TABLE IF NOT EXISTS finance_customer_invoices (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  invoice_number VARCHAR(64) NOT NULL,
  customer_id UUID NOT NULL REFERENCES crm_customers(id),
  quotation_id UUID,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  credit_terms_days INTEGER NOT NULL DEFAULT 30,
  subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  outstanding_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, APPROVED, ISSUED, PARTIALLY_PAID, PAID, OVERDUE, CANCELLED
  notes TEXT,
  journal_id UUID REFERENCES finance_journals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_inv_num UNIQUE (tenant_id, invoice_number)
);

CREATE INDEX IF NOT EXISTS idx_fin_inv_tenant ON finance_customer_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_inv_customer ON finance_customer_invoices(customer_id);

-- 9. Invoice Items Table
CREATE TABLE IF NOT EXISTS finance_invoice_items (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES finance_customer_invoices(id) ON DELETE CASCADE,
  item_description TEXT NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL DEFAULT 1.0,
  unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  tax_code_id UUID,
  tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  total_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00
);

CREATE INDEX IF NOT EXISTS idx_fin_inv_item_tenant ON finance_invoice_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fin_inv_item_inv ON finance_invoice_items(invoice_id);

-- 10. Customer Payments Table
CREATE TABLE IF NOT EXISTS finance_customer_payments (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  payment_number VARCHAR(64) NOT NULL,
  customer_id UUID NOT NULL REFERENCES crm_customers(id),
  payment_date DATE NOT NULL,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  payment_method VARCHAR(32) NOT NULL DEFAULT 'BANK',
  bank_account_id UUID,
  reference_number VARCHAR(128),
  unallocated_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  journal_id UUID REFERENCES finance_journals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_cust_pay_num UNIQUE (tenant_id, payment_number)
);

CREATE INDEX IF NOT EXISTS idx_fin_cpay_tenant ON finance_customer_payments(tenant_id);

-- 11. Payment Allocations Table
CREATE TABLE IF NOT EXISTS finance_payment_allocations (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  payment_id UUID NOT NULL REFERENCES finance_customer_payments(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES finance_customer_invoices(id) ON DELETE CASCADE,
  allocated_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  allocated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fin_alloc_tenant ON finance_payment_allocations(tenant_id);

-- 12. Supplier Bills Table
CREATE TABLE IF NOT EXISTS finance_supplier_bills (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  bill_number VARCHAR(64) NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  supplier_id VARCHAR(128),
  bill_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  outstanding_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  journal_id UUID REFERENCES finance_journals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_bill_num UNIQUE (tenant_id, bill_number)
);

CREATE INDEX IF NOT EXISTS idx_fin_bill_tenant ON finance_supplier_bills(tenant_id);

-- 13. Supplier Bill Items Table
CREATE TABLE IF NOT EXISTS finance_supplier_bill_items (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  bill_id UUID NOT NULL REFERENCES finance_supplier_bills(id) ON DELETE CASCADE,
  item_description TEXT NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL DEFAULT 1.0,
  unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  total_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  cost_center_id UUID REFERENCES finance_cost_centers(id)
);

-- 14. Supplier Payments Table
CREATE TABLE IF NOT EXISTS finance_supplier_payments (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  payment_number VARCHAR(64) NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  supplier_id VARCHAR(128),
  bill_id UUID REFERENCES finance_supplier_bills(id),
  payment_date DATE NOT NULL,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  payment_method VARCHAR(32) NOT NULL DEFAULT 'BANK',
  bank_account_id UUID,
  reference_number VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  journal_id UUID REFERENCES finance_journals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_spay_num UNIQUE (tenant_id, payment_number)
);

-- 15. Expenses Table
CREATE TABLE IF NOT EXISTS finance_expenses (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  expense_number VARCHAR(64) NOT NULL,
  category VARCHAR(64) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  expense_date DATE NOT NULL,
  payment_method VARCHAR(32) NOT NULL DEFAULT 'CASH',
  cost_center_id UUID REFERENCES finance_cost_centers(id),
  project_id UUID REFERENCES finance_projects(id),
  vehicle_id VARCHAR(128),
  employee_id VARCHAR(128),
  description TEXT NOT NULL,
  receipt_url TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'APPROVED',
  journal_id UUID REFERENCES finance_journals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_exp_num UNIQUE (tenant_id, expense_number)
);

CREATE INDEX IF NOT EXISTS idx_fin_exp_tenant ON finance_expenses(tenant_id);

-- 16. Bank Accounts Table
CREATE TABLE IF NOT EXISTS finance_bank_accounts (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  account_name VARCHAR(255) NOT NULL,
  account_number_masked VARCHAR(64) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  ifsc_code VARCHAR(32),
  opening_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',
  account_type VARCHAR(32) NOT NULL DEFAULT 'CURRENT',
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  gl_account_id UUID REFERENCES finance_chart_of_accounts(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 17. Bank Transactions Table
CREATE TABLE IF NOT EXISTS finance_bank_transactions (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES finance_bank_accounts(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  value_date DATE NOT NULL,
  description TEXT NOT NULL,
  reference VARCHAR(128),
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  transaction_type VARCHAR(10) NOT NULL, -- CREDIT, DEBIT
  reconciliation_status VARCHAR(32) NOT NULL DEFAULT 'UNMATCHED',
  matched_reference_id VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 18. Bank Reconciliations Table
CREATE TABLE IF NOT EXISTS finance_reconciliations (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES finance_bank_accounts(id) ON DELETE CASCADE,
  statement_date DATE NOT NULL,
  statement_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  gl_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  difference NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'RECONCILED',
  reconciled_by VARCHAR(64),
  reconciled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 19. Credit Notes Table
CREATE TABLE IF NOT EXISTS finance_credit_notes (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  note_number VARCHAR(64) NOT NULL,
  customer_id UUID NOT NULL REFERENCES crm_customers(id),
  invoice_id UUID REFERENCES finance_customer_invoices(id),
  issue_date DATE NOT NULL,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  reason TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  journal_id UUID REFERENCES finance_journals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_cn_num UNIQUE (tenant_id, note_number)
);

-- 20. Debit Notes Table
CREATE TABLE IF NOT EXISTS finance_debit_notes (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  note_number VARCHAR(64) NOT NULL,
  supplier_name VARCHAR(255) NOT NULL,
  supplier_id VARCHAR(128),
  bill_id UUID REFERENCES finance_supplier_bills(id),
  issue_date DATE NOT NULL,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  reason TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  journal_id UUID REFERENCES finance_journals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_dn_num UNIQUE (tenant_id, note_number)
);

-- 21. Tax Codes Table
CREATE TABLE IF NOT EXISTS finance_tax_codes (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  tax_code VARCHAR(64) NOT NULL,
  tax_name VARCHAR(255) NOT NULL,
  rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  tax_type VARCHAR(32) NOT NULL DEFAULT 'GST',
  effective_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fin_tax_code UNIQUE (tenant_id, tax_code)
);

-- ==========================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================

DO $$
DECLARE
  tbl_name text;
  finance_tables text[] := ARRAY[
    'finance_chart_of_accounts',
    'finance_fiscal_years',
    'finance_fiscal_periods',
    'finance_cost_centers',
    'finance_projects',
    'finance_journals',
    'finance_journal_lines',
    'finance_customer_invoices',
    'finance_invoice_items',
    'finance_customer_payments',
    'finance_payment_allocations',
    'finance_supplier_bills',
    'finance_supplier_bill_items',
    'finance_supplier_payments',
    'finance_expenses',
    'finance_bank_accounts',
    'finance_bank_transactions',
    'finance_reconciliations',
    'finance_credit_notes',
    'finance_debit_notes',
    'finance_tax_codes'
  ];
BEGIN
  FOREACH tbl_name IN ARRAY finance_tables LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl_name);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_policy ON %I;', tbl_name);
    EXECUTE format('CREATE POLICY tenant_isolation_policy ON %I USING (tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), '''')::UUID);', tbl_name);
  END LOOP;
END $$;
