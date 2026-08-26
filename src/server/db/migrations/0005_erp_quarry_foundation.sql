-- RZ® Minetrix BOS - Migration 0005
-- ERP Quarry vertical slice foundation (schema groundwork only)

CREATE TABLE IF NOT EXISTS erp_quarries (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  company_id VARCHAR(128) NOT NULL,
  branch_id VARCHAR(128),
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  mineral_type VARCHAR(64) NOT NULL DEFAULT 'HARD_ROCK',
  operational_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  gps_latitude NUMERIC(10, 7),
  gps_longitude NUMERIC(10, 7),
  capacity_tons NUMERIC(14, 3),
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(128),
  updated_by VARCHAR(128),
  deleted_at TIMESTAMPTZ,
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT uq_erp_quarries_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_erp_quarries_tenant ON erp_quarries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_quarries_company ON erp_quarries(tenant_id, company_id);

CREATE TABLE IF NOT EXISTS erp_quarry_locations (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  quarry_id VARCHAR(128) NOT NULL REFERENCES erp_quarries(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  location_type VARCHAR(64) NOT NULL DEFAULT 'BENCH',
  gps_latitude NUMERIC(10, 7),
  gps_longitude NUMERIC(10, 7),
  boundary_json JSONB,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_erp_quarry_locations_tenant ON erp_quarry_locations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_quarry_locations_quarry ON erp_quarry_locations(tenant_id, quarry_id);

CREATE TABLE IF NOT EXISTS erp_land_parcels (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  survey_number VARCHAR(128) NOT NULL,
  village_taluk VARCHAR(255),
  acreage NUMERIC(12, 4),
  owner_name VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_land_parcels_tenant_survey UNIQUE (tenant_id, survey_number)
);

CREATE INDEX IF NOT EXISTS idx_erp_land_parcels_tenant ON erp_land_parcels(tenant_id);

CREATE TABLE IF NOT EXISTS erp_quarry_leases (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  land_parcel_id VARCHAR(128) NOT NULL REFERENCES erp_land_parcels(id) ON DELETE RESTRICT,
  quarry_id VARCHAR(128) REFERENCES erp_quarries(id) ON DELETE SET NULL,
  lease_number VARCHAR(128) NOT NULL,
  royalty_type VARCHAR(64) NOT NULL,
  royalty_rate NUMERIC(14, 4),
  revenue_share_percent NUMERIC(5, 2),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_quarry_leases_tenant_number UNIQUE (tenant_id, lease_number)
);

CREATE INDEX IF NOT EXISTS idx_erp_quarry_leases_tenant ON erp_quarry_leases(tenant_id);

CREATE TABLE IF NOT EXISTS erp_products (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  default_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  density_ton_per_cft NUMERIC(10, 6),
  gst_percent NUMERIC(5, 2) NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_products_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_erp_products_tenant ON erp_products(tenant_id);

CREATE TABLE IF NOT EXISTS erp_product_sizes (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  product_id VARCHAR(128) NOT NULL REFERENCES erp_products(id) ON DELETE CASCADE,
  size_code VARCHAR(64) NOT NULL,
  size_label VARCHAR(255) NOT NULL,
  dimensions VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_product_sizes_tenant_product_code UNIQUE (tenant_id, product_id, size_code)
);

CREATE INDEX IF NOT EXISTS idx_erp_product_sizes_tenant ON erp_product_sizes(tenant_id);

CREATE TABLE IF NOT EXISTS erp_product_prices (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  product_id VARCHAR(128) NOT NULL REFERENCES erp_products(id) ON DELETE CASCADE,
  product_size_id VARCHAR(128) REFERENCES erp_product_sizes(id) ON DELETE SET NULL,
  quarry_id VARCHAR(128) REFERENCES erp_quarries(id) ON DELETE SET NULL,
  unit_price NUMERIC(14, 4) NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  price_includes_gst BOOLEAN NOT NULL DEFAULT FALSE,
  effective_from DATE NOT NULL,
  effective_to DATE,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_erp_product_prices_tenant ON erp_product_prices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_product_prices_product ON erp_product_prices(tenant_id, product_id);

CREATE TABLE IF NOT EXISTS erp_production_batches (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  quarry_id VARCHAR(128) NOT NULL REFERENCES erp_quarries(id) ON DELETE RESTRICT,
  batch_number VARCHAR(64) NOT NULL,
  production_date DATE NOT NULL,
  shift_name VARCHAR(64),
  operator_user_id VARCHAR(128),
  total_quantity NUMERIC(14, 3) NOT NULL DEFAULT 0,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  details_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_production_batches_tenant_number UNIQUE (tenant_id, batch_number)
);

CREATE INDEX IF NOT EXISTS idx_erp_production_batches_tenant ON erp_production_batches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_production_batches_quarry ON erp_production_batches(tenant_id, quarry_id);

ALTER TABLE erp_quarries ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_quarry_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_land_parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_quarry_leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_production_batches ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_erp_quarries ON erp_quarries
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_erp_quarry_locations ON erp_quarry_locations
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_erp_land_parcels ON erp_land_parcels
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_erp_quarry_leases ON erp_quarry_leases
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_erp_products ON erp_products
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_erp_product_sizes ON erp_product_sizes
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_erp_product_prices ON erp_product_prices
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_erp_production_batches ON erp_production_batches
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

ALTER TABLE erp_quarries FORCE ROW LEVEL SECURITY;
ALTER TABLE erp_quarry_locations FORCE ROW LEVEL SECURITY;
ALTER TABLE erp_land_parcels FORCE ROW LEVEL SECURITY;
ALTER TABLE erp_quarry_leases FORCE ROW LEVEL SECURITY;
ALTER TABLE erp_products FORCE ROW LEVEL SECURITY;
ALTER TABLE erp_product_sizes FORCE ROW LEVEL SECURITY;
ALTER TABLE erp_product_prices FORCE ROW LEVEL SECURITY;
ALTER TABLE erp_production_batches FORCE ROW LEVEL SECURITY;
