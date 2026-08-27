-- RZ® Minetrix BOS - Migration 0016
-- Finance foundation: accounts, ERP transaction references, journals, invoices, payments

CREATE TABLE IF NOT EXISTS finance_accounts (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(32) NOT NULL,
  parent_account_id VARCHAR(128) REFERENCES finance_accounts(id) ON DELETE SET NULL,
  description VARCHAR(512),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_finance_accounts_tenant_code UNIQUE (tenant_id, code),
  CONSTRAINT chk_finance_accounts_category CHECK (category IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
  CONSTRAINT chk_finance_accounts_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED'))
);

CREATE INDEX IF NOT EXISTS idx_finance_accounts_tenant ON finance_accounts(tenant_id);

CREATE TABLE IF NOT EXISTS finance_transactions (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  transaction_number VARCHAR(64) NOT NULL,
  source_module VARCHAR(32) NOT NULL,
  source_record_type VARCHAR(32) NOT NULL,
  source_record_id VARCHAR(128) NOT NULL,
  customer_id VARCHAR(128) REFERENCES erp_customers(id) ON DELETE SET NULL,
  order_id VARCHAR(128) REFERENCES erp_orders(id) ON DELETE SET NULL,
  dispatch_id VARCHAR(128) REFERENCES erp_dispatches(id) ON DELETE SET NULL,
  settlement_id VARCHAR(128) REFERENCES erp_settlements(id) ON DELETE SET NULL,
  transaction_date DATE NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  description VARCHAR(512),
  journal_id VARCHAR(128),
  idempotency_key VARCHAR(128),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_finance_transactions_tenant_number UNIQUE (tenant_id, transaction_number),
  CONSTRAINT uq_finance_transactions_source UNIQUE (tenant_id, source_module, source_record_type, source_record_id),
  CONSTRAINT chk_finance_transactions_amount CHECK (amount >= 0),
  CONSTRAINT chk_finance_transactions_status CHECK (status IN ('DRAFT', 'POSTED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_finance_transactions_tenant ON finance_transactions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_customer ON finance_transactions(tenant_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_finance_transactions_order ON finance_transactions(tenant_id, order_id);

CREATE TABLE IF NOT EXISTS finance_journals (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  journal_number VARCHAR(64) NOT NULL,
  journal_date DATE NOT NULL,
  description VARCHAR(512),
  source_transaction_id VARCHAR(128) REFERENCES finance_transactions(id) ON DELETE SET NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_finance_journals_tenant_number UNIQUE (tenant_id, journal_number),
  CONSTRAINT chk_finance_journals_status CHECK (status IN ('DRAFT', 'POSTED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_finance_journals_tenant ON finance_journals(tenant_id);

CREATE TABLE IF NOT EXISTS finance_journal_entries (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  journal_id VARCHAR(128) NOT NULL REFERENCES finance_journals(id) ON DELETE CASCADE,
  account_id VARCHAR(128) NOT NULL REFERENCES finance_accounts(id) ON DELETE RESTRICT,
  entry_type VARCHAR(8) NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  description VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_finance_journal_entries_type CHECK (entry_type IN ('DEBIT', 'CREDIT')),
  CONSTRAINT chk_finance_journal_entries_amount CHECK (amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_finance_journal_entries_tenant ON finance_journal_entries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_journal_entries_journal ON finance_journal_entries(tenant_id, journal_id);

CREATE TABLE IF NOT EXISTS finance_invoices (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  invoice_number VARCHAR(64) NOT NULL,
  customer_id VARCHAR(128) NOT NULL REFERENCES erp_customers(id) ON DELETE RESTRICT,
  order_id VARCHAR(128) REFERENCES erp_orders(id) ON DELETE SET NULL,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(14, 2) NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  notes VARCHAR(512),
  finance_transaction_id VARCHAR(128) REFERENCES finance_transactions(id) ON DELETE SET NULL,
  created_by VARCHAR(128),
  issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_finance_invoices_tenant_number UNIQUE (tenant_id, invoice_number),
  CONSTRAINT uq_finance_invoices_order UNIQUE (tenant_id, order_id),
  CONSTRAINT chk_finance_invoices_status CHECK (status IN ('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'CANCELLED')),
  CONSTRAINT chk_finance_invoices_totals CHECK (subtotal >= 0 AND tax_amount >= 0 AND discount_amount >= 0 AND grand_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_finance_invoices_tenant ON finance_invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoices_customer ON finance_invoices(tenant_id, customer_id);

CREATE TABLE IF NOT EXISTS finance_invoice_lines (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  invoice_id VARCHAR(128) NOT NULL REFERENCES finance_invoices(id) ON DELETE CASCADE,
  product_id VARCHAR(128) REFERENCES erp_products(id) ON DELETE SET NULL,
  product_size_id VARCHAR(128) REFERENCES erp_product_sizes(id) ON DELETE SET NULL,
  description VARCHAR(512) NOT NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  unit_price NUMERIC(14, 2) NOT NULL,
  line_subtotal NUMERIC(14, 2) NOT NULL,
  tax_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  line_total NUMERIC(14, 2) NOT NULL,
  CONSTRAINT chk_finance_invoice_lines_qty CHECK (quantity > 0),
  CONSTRAINT chk_finance_invoice_lines_price CHECK (unit_price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_finance_invoice_lines_tenant ON finance_invoice_lines(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_invoice_lines_invoice ON finance_invoice_lines(tenant_id, invoice_id);

CREATE TABLE IF NOT EXISTS finance_payments (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  payment_number VARCHAR(64) NOT NULL,
  invoice_id VARCHAR(128) NOT NULL REFERENCES finance_invoices(id) ON DELETE RESTRICT,
  amount NUMERIC(14, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(32) NOT NULL,
  payment_reference VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  notes VARCHAR(512),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_finance_payments_tenant_number UNIQUE (tenant_id, payment_number),
  CONSTRAINT uq_finance_payments_reference UNIQUE (tenant_id, payment_reference),
  CONSTRAINT chk_finance_payments_amount CHECK (amount > 0),
  CONSTRAINT chk_finance_payments_method CHECK (payment_method IN ('CASH', 'BANK_TRANSFER', 'CHEQUE', 'UPI', 'CARD', 'OTHER')),
  CONSTRAINT chk_finance_payments_status CHECK (status IN ('DRAFT', 'POSTED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_finance_payments_tenant ON finance_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_finance_payments_invoice ON finance_payments(tenant_id, invoice_id);

CREATE TABLE IF NOT EXISTS finance_expenses (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  expense_number VARCHAR(64) NOT NULL,
  category VARCHAR(64) NOT NULL,
  amount NUMERIC(14, 2) NOT NULL,
  expense_date DATE NOT NULL,
  vendor_name VARCHAR(255),
  reference VARCHAR(128),
  attachment_ref VARCHAR(128),
  approval_status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  notes VARCHAR(512),
  submitted_by VARCHAR(128),
  approved_by VARCHAR(128),
  rejected_by VARCHAR(128),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_finance_expenses_tenant_number UNIQUE (tenant_id, expense_number),
  CONSTRAINT chk_finance_expenses_amount CHECK (amount > 0),
  CONSTRAINT chk_finance_expenses_status CHECK (approval_status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'))
);

CREATE INDEX IF NOT EXISTS idx_finance_expenses_tenant ON finance_expenses(tenant_id);

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'finance_accounts',
    'finance_transactions',
    'finance_journals',
    'finance_journal_entries',
    'finance_invoices',
    'finance_invoice_lines',
    'finance_payments',
    'finance_expenses'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_%s ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY tenant_isolation_%s ON %I FOR ALL USING (tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), '''')) WITH CHECK (tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), ''''))',
      t, t
    );
  END LOOP;
END $$;
