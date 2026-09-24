-- RZ® Minetrix BOS - Platform 1: Quarry Management Migration 0008
-- PostgreSQL Drizzle Schema, Row-Level Security (RLS) & Atomic Constraints Initializer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Quarry Masters Table
CREATE TABLE IF NOT EXISTS quarry_masters (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES core_companies(id) ON DELETE RESTRICT,
  branch_id UUID REFERENCES core_branches(id) ON DELETE SET NULL,
  business_unit_id UUID REFERENCES core_business_units(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  quarry_type VARCHAR(32) NOT NULL CHECK (quarry_type IN ('LATERITE', 'HARD_ROCK')),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE')),
  location VARCHAR(255) NOT NULL,
  address TEXT,
  owner_id VARCHAR(64) NOT NULL,
  lease_reference VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID,
  deleted_at TIMESTAMP WITH TIME ZONE,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_quarry_masters_name ON quarry_masters(tenant_id, company_id, lower(name)) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_quarry_masters_tenant ON quarry_masters(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quarry_masters_company ON quarry_masters(company_id);
CREATE INDEX IF NOT EXISTS idx_quarry_masters_type ON quarry_masters(quarry_type);
CREATE INDEX IF NOT EXISTS idx_quarry_masters_status ON quarry_masters(status);

-- 2. Stone Products Master Table
CREATE TABLE IF NOT EXISTS stone_products (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  quarry_id UUID NOT NULL REFERENCES quarry_masters(id) ON DELETE CASCADE,
  product_code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  mineral_type VARCHAR(32) NOT NULL CHECK (mineral_type IN ('LATERITE', 'HARD_ROCK')),
  dimensions VARCHAR(64),
  unit VARCHAR(32) NOT NULL CHECK (unit IN ('TON', 'CFT', 'PIECE', 'LOAD')),
  default_price NUMERIC(14,4) NOT NULL DEFAULT 0.0000 CHECK (default_price >= 0),
  gst_rate NUMERIC(6,2) NOT NULL DEFAULT 5.00 CHECK (gst_rate >= 0),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_stone_products_code ON stone_products(tenant_id, quarry_id, lower(product_code));
CREATE INDEX IF NOT EXISTS idx_stone_products_tenant ON stone_products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stone_products_quarry ON stone_products(quarry_id);
CREATE INDEX IF NOT EXISTS idx_stone_products_mineral ON stone_products(mineral_type);

-- 3. Quarry Production Logs Table
CREATE TABLE IF NOT EXISTS quarry_productions (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  quarry_id UUID NOT NULL REFERENCES quarry_masters(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES stone_products(id) ON DELETE RESTRICT,
  production_type VARCHAR(64) NOT NULL CHECK (production_type IN ('LATERITE_CUTTING', 'HARD_ROCK_EXTRACTION')),
  production_date DATE NOT NULL,
  shift VARCHAR(32) NOT NULL CHECK (shift IN ('DAY', 'NIGHT', 'GENERAL')),
  quantity NUMERIC(14,4) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(32) NOT NULL CHECK (unit IN ('TON', 'CFT', 'PIECE', 'LOAD')),
  operator_id VARCHAR(64) NOT NULL,
  machine_id VARCHAR(64),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID
);

CREATE INDEX IF NOT EXISTS idx_quarry_prod_tenant ON quarry_productions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quarry_prod_quarry ON quarry_productions(quarry_id);
CREATE INDEX IF NOT EXISTS idx_quarry_prod_product ON quarry_productions(product_id);
CREATE INDEX IF NOT EXISTS idx_quarry_prod_date ON quarry_productions(production_date);

-- 4. Quarry Stock Ledger Table (Strictly Append-Only)
CREATE TABLE IF NOT EXISTS quarry_stocks (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  quarry_id UUID NOT NULL REFERENCES quarry_masters(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES stone_products(id) ON DELETE RESTRICT,
  transaction_type VARCHAR(32) NOT NULL CHECK (transaction_type IN ('STOCK_IN', 'STOCK_OUT', 'ADJUSTMENT_IN', 'ADJUSTMENT_OUT')),
  reference_type VARCHAR(32) NOT NULL CHECK (reference_type IN ('PRODUCTION', 'GATE_PASS', 'STOCK_ADJUSTMENT', 'OPENING_BALANCE')),
  reference_id VARCHAR(128) NOT NULL,
  quantity_in NUMERIC(14,4) NOT NULL DEFAULT 0.0000 CHECK (quantity_in >= 0),
  quantity_out NUMERIC(14,4) NOT NULL DEFAULT 0.0000 CHECK (quantity_out >= 0),
  balance_quantity NUMERIC(14,4) NOT NULL,
  transaction_date DATE NOT NULL,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_quarry_stocks_ref ON quarry_stocks(tenant_id, reference_type, reference_id, transaction_type);
CREATE INDEX IF NOT EXISTS idx_quarry_stocks_tenant ON quarry_stocks(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quarry_stocks_quarry_prod ON quarry_stocks(quarry_id, product_id);
CREATE INDEX IF NOT EXISTS idx_quarry_stocks_created_at ON quarry_stocks(created_at);

-- 5. Gate Passes Table
CREATE TABLE IF NOT EXISTS gate_passes (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  quarry_id UUID NOT NULL REFERENCES quarry_masters(id) ON DELETE RESTRICT,
  pass_number VARCHAR(64) NOT NULL,
  customer_id VARCHAR(64) NOT NULL,
  product_id UUID NOT NULL REFERENCES stone_products(id) ON DELETE RESTRICT,
  quantity NUMERIC(14,4) NOT NULL CHECK (quantity > 0),
  unit VARCHAR(32) NOT NULL CHECK (unit IN ('TON', 'CFT', 'PIECE', 'LOAD')),
  vehicle_id VARCHAR(64),
  vehicle_no VARCHAR(64),
  driver_id VARCHAR(64),
  driver_name VARCHAR(255),
  gross_weight NUMERIC(14,4),
  tare_weight NUMERIC(14,4),
  net_weight NUMERIC(14,4),
  status VARCHAR(32) NOT NULL DEFAULT 'ISSUED' CHECK (status IN ('DRAFT', 'ISSUED', 'VERIFIED', 'DISPATCHED', 'CANCELLED')),
  sales_reference VARCHAR(128),
  finance_invoice_id VARCHAR(128),
  created_by UUID,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_gate_pass_weights CHECK (tare_weight IS NULL OR gross_weight IS NULL OR tare_weight <= gross_weight)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_gate_passes_number ON gate_passes(tenant_id, pass_number);
CREATE INDEX IF NOT EXISTS idx_gate_passes_tenant ON gate_passes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_gate_passes_quarry ON gate_passes(quarry_id);
CREATE INDEX IF NOT EXISTS idx_gate_passes_status ON gate_passes(status);
CREATE INDEX IF NOT EXISTS idx_gate_passes_customer ON gate_passes(customer_id);

-- 6. Quarry Land Leases Table
CREATE TABLE IF NOT EXISTS quarry_land_leases (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  quarry_id UUID NOT NULL REFERENCES quarry_masters(id) ON DELETE CASCADE,
  owner_id VARCHAR(64),
  owner_name VARCHAR(255) NOT NULL,
  survey_number VARCHAR(128) NOT NULL,
  village VARCHAR(128) NOT NULL,
  taluk VARCHAR(128) NOT NULL,
  area NUMERIC(10,4) NOT NULL CHECK (area > 0),
  lease_type VARCHAR(32) NOT NULL CHECK (lease_type IN ('OWNED', 'LEASED', 'REVENUE_SHARE')),
  royalty_type VARCHAR(32) NOT NULL CHECK (royalty_type IN ('FIXED_MONTHLY', 'PER_TON', 'PER_PIECE', 'REVENUE_PERCENT')),
  royalty_rate NUMERIC(14,4) NOT NULL DEFAULT 0.0000 CHECK (royalty_rate >= 0),
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'TERMINATED')),
  document_reference VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_lease_dates CHECK (expiry_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_quarry_leases_tenant ON quarry_land_leases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quarry_leases_quarry ON quarry_land_leases(quarry_id);
CREATE INDEX IF NOT EXISTS idx_quarry_leases_survey ON quarry_land_leases(survey_number);

-- 7. Landowner Settlements Table
CREATE TABLE IF NOT EXISTS landowner_settlements (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  lease_id UUID NOT NULL REFERENCES quarry_land_leases(id) ON DELETE RESTRICT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  basis_quantity NUMERIC(14,4) NOT NULL DEFAULT 0.0000 CHECK (basis_quantity >= 0),
  calculated_amount NUMERIC(14,4) NOT NULL DEFAULT 0.0000 CHECK (calculated_amount >= 0),
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'APPROVED', 'POSTED_TO_FINANCE', 'PAID')),
  finance_bill_id VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_settlement_period CHECK (period_end >= period_start)
);

CREATE INDEX IF NOT EXISTS idx_land_settlements_tenant ON landowner_settlements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_land_settlements_lease ON landowner_settlements(lease_id);
CREATE INDEX IF NOT EXISTS idx_land_settlements_status ON landowner_settlements(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) TENANT ISOLATION POLICIES
-- ============================================================================

ALTER TABLE quarry_masters ENABLE ROW LEVEL SECURITY;
ALTER TABLE stone_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarry_productions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarry_stocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quarry_land_leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE landowner_settlements ENABLE ROW LEVEL SECURITY;

-- 1. Quarry Masters Policy
DROP POLICY IF EXISTS tenant_isolation_quarry_masters ON quarry_masters;
CREATE POLICY tenant_isolation_quarry_masters ON quarry_masters
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 2. Stone Products Policy
DROP POLICY IF EXISTS tenant_isolation_stone_products ON stone_products;
CREATE POLICY tenant_isolation_stone_products ON stone_products
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 3. Quarry Productions Policy
DROP POLICY IF EXISTS tenant_isolation_quarry_productions ON quarry_productions;
CREATE POLICY tenant_isolation_quarry_productions ON quarry_productions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 4. Quarry Stocks Policy
DROP POLICY IF EXISTS tenant_isolation_quarry_stocks ON quarry_stocks;
CREATE POLICY tenant_isolation_quarry_stocks ON quarry_stocks
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 5. Gate Passes Policy
DROP POLICY IF EXISTS tenant_isolation_gate_passes ON gate_passes;
CREATE POLICY tenant_isolation_gate_passes ON gate_passes
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 6. Quarry Land Leases Policy
DROP POLICY IF EXISTS tenant_isolation_quarry_land_leases ON quarry_land_leases;
CREATE POLICY tenant_isolation_quarry_land_leases ON quarry_land_leases
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

-- 7. Landowner Settlements Policy
DROP POLICY IF EXISTS tenant_isolation_landowner_settlements ON landowner_settlements;
CREATE POLICY tenant_isolation_landowner_settlements ON landowner_settlements
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
