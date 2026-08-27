-- RZ® Minetrix BOS - Migration 0006
-- ERP operations vertical slice: production lines, stock ledger, gate pass, dispatch, settlement

ALTER TABLE erp_production_batches
  ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS posted_by VARCHAR(128),
  ADD COLUMN IF NOT EXISTS created_by VARCHAR(128),
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(128);

CREATE TABLE IF NOT EXISTS erp_production_batch_lines (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  batch_id VARCHAR(128) NOT NULL REFERENCES erp_production_batches(id) ON DELETE CASCADE,
  product_id VARCHAR(128) NOT NULL REFERENCES erp_products(id) ON DELETE RESTRICT,
  product_size_id VARCHAR(128) REFERENCES erp_product_sizes(id) ON DELETE SET NULL,
  location_id VARCHAR(128) REFERENCES erp_quarry_locations(id) ON DELETE SET NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  notes VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_erp_production_batch_lines_qty CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_erp_production_batch_lines_tenant ON erp_production_batch_lines(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_production_batch_lines_batch ON erp_production_batch_lines(tenant_id, batch_id);

CREATE TABLE IF NOT EXISTS erp_customers (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  destination VARCHAR(512),
  phone VARCHAR(64),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_customers_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_erp_customers_tenant ON erp_customers(tenant_id);

CREATE TABLE IF NOT EXISTS erp_stock_balances (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  quarry_id VARCHAR(128) NOT NULL REFERENCES erp_quarries(id) ON DELETE RESTRICT,
  product_id VARCHAR(128) NOT NULL REFERENCES erp_products(id) ON DELETE RESTRICT,
  product_size_id VARCHAR(128) REFERENCES erp_product_sizes(id) ON DELETE SET NULL,
  location_id VARCHAR(128) REFERENCES erp_quarry_locations(id) ON DELETE SET NULL,
  quantity NUMERIC(14, 3) NOT NULL DEFAULT 0,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_erp_stock_balances_qty CHECK (quantity >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_erp_stock_balances_key
  ON erp_stock_balances (
    tenant_id,
    quarry_id,
    product_id,
    COALESCE(product_size_id, ''),
    COALESCE(location_id, '')
  );

CREATE INDEX IF NOT EXISTS idx_erp_stock_balances_tenant ON erp_stock_balances(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_stock_balances_quarry ON erp_stock_balances(tenant_id, quarry_id);

CREATE TABLE IF NOT EXISTS erp_stock_ledger (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  quarry_id VARCHAR(128) NOT NULL REFERENCES erp_quarries(id) ON DELETE RESTRICT,
  product_id VARCHAR(128) NOT NULL REFERENCES erp_products(id) ON DELETE RESTRICT,
  product_size_id VARCHAR(128) REFERENCES erp_product_sizes(id) ON DELETE SET NULL,
  location_id VARCHAR(128) REFERENCES erp_quarry_locations(id) ON DELETE SET NULL,
  movement_type VARCHAR(32) NOT NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  reference_type VARCHAR(32) NOT NULL,
  reference_id VARCHAR(128) NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(128),
  notes VARCHAR(512),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_erp_stock_ledger_qty CHECK (quantity > 0),
  CONSTRAINT chk_erp_stock_ledger_type CHECK (movement_type IN ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT'))
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_erp_stock_ledger_posting
  ON erp_stock_ledger (
    tenant_id,
    reference_type,
    reference_id,
    movement_type,
    product_id,
    COALESCE(product_size_id, ''),
    COALESCE(location_id, '')
  );

CREATE INDEX IF NOT EXISTS idx_erp_stock_ledger_tenant ON erp_stock_ledger(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_stock_ledger_quarry ON erp_stock_ledger(tenant_id, quarry_id);
CREATE INDEX IF NOT EXISTS idx_erp_stock_ledger_ref ON erp_stock_ledger(tenant_id, reference_type, reference_id);

CREATE TABLE IF NOT EXISTS erp_idempotency_keys (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  scope VARCHAR(64) NOT NULL,
  idempotency_key VARCHAR(128) NOT NULL,
  resource_type VARCHAR(64) NOT NULL,
  resource_id VARCHAR(128) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_idempotency_keys UNIQUE (tenant_id, scope, idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_erp_idempotency_keys_tenant ON erp_idempotency_keys(tenant_id);

CREATE TABLE IF NOT EXISTS erp_gate_passes (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  gate_pass_number VARCHAR(64) NOT NULL,
  quarry_id VARCHAR(128) NOT NULL REFERENCES erp_quarries(id) ON DELETE RESTRICT,
  customer_id VARCHAR(128) NOT NULL REFERENCES erp_customers(id) ON DELETE RESTRICT,
  vehicle_number VARCHAR(64) NOT NULL,
  driver_name VARCHAR(255) NOT NULL,
  destination VARCHAR(512),
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  dispatch_id VARCHAR(128),
  notes VARCHAR(512),
  created_by VARCHAR(128),
  approved_by VARCHAR(128),
  issued_by VARCHAR(128),
  cancelled_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  issued_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  CONSTRAINT uq_erp_gate_passes_tenant_number UNIQUE (tenant_id, gate_pass_number),
  CONSTRAINT chk_erp_gate_passes_status CHECK (status IN ('DRAFT', 'APPROVED', 'ISSUED', 'CANCELLED', 'DISPATCHED'))
);

CREATE INDEX IF NOT EXISTS idx_erp_gate_passes_tenant ON erp_gate_passes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_gate_passes_quarry ON erp_gate_passes(tenant_id, quarry_id);

CREATE TABLE IF NOT EXISTS erp_gate_pass_lines (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  gate_pass_id VARCHAR(128) NOT NULL REFERENCES erp_gate_passes(id) ON DELETE CASCADE,
  product_id VARCHAR(128) NOT NULL REFERENCES erp_products(id) ON DELETE RESTRICT,
  product_size_id VARCHAR(128) REFERENCES erp_product_sizes(id) ON DELETE SET NULL,
  location_id VARCHAR(128) REFERENCES erp_quarry_locations(id) ON DELETE SET NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  CONSTRAINT chk_erp_gate_pass_lines_qty CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_erp_gate_pass_lines_tenant ON erp_gate_pass_lines(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_gate_pass_lines_gp ON erp_gate_pass_lines(tenant_id, gate_pass_id);

CREATE TABLE IF NOT EXISTS erp_dispatches (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  dispatch_number VARCHAR(64) NOT NULL,
  gate_pass_id VARCHAR(128) NOT NULL REFERENCES erp_gate_passes(id) ON DELETE RESTRICT,
  quarry_id VARCHAR(128) NOT NULL REFERENCES erp_quarries(id) ON DELETE RESTRICT,
  customer_id VARCHAR(128) NOT NULL REFERENCES erp_customers(id) ON DELETE RESTRICT,
  vehicle_number VARCHAR(64) NOT NULL,
  driver_name VARCHAR(255) NOT NULL,
  destination VARCHAR(512),
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  dispatched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_dispatches_tenant_number UNIQUE (tenant_id, dispatch_number),
  CONSTRAINT uq_erp_dispatches_gate_pass UNIQUE (tenant_id, gate_pass_id),
  CONSTRAINT chk_erp_dispatches_status CHECK (status IN ('POSTED', 'CANCELLED'))
);

CREATE INDEX IF NOT EXISTS idx_erp_dispatches_tenant ON erp_dispatches(tenant_id);

CREATE TABLE IF NOT EXISTS erp_dispatch_lines (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  dispatch_id VARCHAR(128) NOT NULL REFERENCES erp_dispatches(id) ON DELETE CASCADE,
  product_id VARCHAR(128) NOT NULL REFERENCES erp_products(id) ON DELETE RESTRICT,
  product_size_id VARCHAR(128) REFERENCES erp_product_sizes(id) ON DELETE SET NULL,
  location_id VARCHAR(128) REFERENCES erp_quarry_locations(id) ON DELETE SET NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  CONSTRAINT chk_erp_dispatch_lines_qty CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_erp_dispatch_lines_tenant ON erp_dispatch_lines(tenant_id);

CREATE TABLE IF NOT EXISTS erp_settlement_rates (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  land_parcel_id VARCHAR(128) NOT NULL REFERENCES erp_land_parcels(id) ON DELETE RESTRICT,
  quarry_id VARCHAR(128) REFERENCES erp_quarries(id) ON DELETE SET NULL,
  product_id VARCHAR(128) REFERENCES erp_products(id) ON DELETE SET NULL,
  rate_per_uom NUMERIC(14, 4) NOT NULL,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  effective_from DATE NOT NULL,
  effective_to DATE,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_erp_settlement_rates_rate CHECK (rate_per_uom >= 0)
);

CREATE INDEX IF NOT EXISTS idx_erp_settlement_rates_tenant ON erp_settlement_rates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_settlement_rates_parcel ON erp_settlement_rates(tenant_id, land_parcel_id);

CREATE TABLE IF NOT EXISTS erp_settlements (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  settlement_number VARCHAR(64) NOT NULL,
  land_parcel_id VARCHAR(128) NOT NULL REFERENCES erp_land_parcels(id) ON DELETE RESTRICT,
  quarry_id VARCHAR(128) NOT NULL REFERENCES erp_quarries(id) ON DELETE RESTRICT,
  basis VARCHAR(32) NOT NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  rate_per_uom NUMERIC(14, 4) NOT NULL,
  gross_amount NUMERIC(14, 2) NOT NULL,
  deductions NUMERIC(14, 2) NOT NULL DEFAULT 0,
  net_amount NUMERIC(14, 2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  statement_ref VARCHAR(128),
  production_batch_id VARCHAR(128) REFERENCES erp_production_batches(id) ON DELETE SET NULL,
  dispatch_id VARCHAR(128) REFERENCES erp_dispatches(id) ON DELETE SET NULL,
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_settlements_tenant_number UNIQUE (tenant_id, settlement_number),
  CONSTRAINT chk_erp_settlements_basis CHECK (basis IN ('PRODUCTION', 'DISPATCH')),
  CONSTRAINT chk_erp_settlements_status CHECK (status IN ('DRAFT', 'POSTED', 'CANCELLED')),
  CONSTRAINT chk_erp_settlements_qty CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS idx_erp_settlements_tenant ON erp_settlements(tenant_id);

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'erp_production_batch_lines',
    'erp_customers',
    'erp_stock_balances',
    'erp_stock_ledger',
    'erp_idempotency_keys',
    'erp_gate_passes',
    'erp_gate_pass_lines',
    'erp_dispatches',
    'erp_dispatch_lines',
    'erp_settlement_rates',
    'erp_settlements'
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
