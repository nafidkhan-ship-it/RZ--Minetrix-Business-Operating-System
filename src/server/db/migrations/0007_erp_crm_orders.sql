-- RZ® Minetrix BOS - Migration 0007
-- CRM contacts/leads and sales orders linked to inventory dispatch (no double stock consumption)

ALTER TABLE erp_customers
  ADD COLUMN IF NOT EXISTS email VARCHAR(255);

CREATE TABLE IF NOT EXISTS erp_customer_contacts (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  customer_id VARCHAR(128) NOT NULL REFERENCES erp_customers(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  role_title VARCHAR(128),
  phone VARCHAR(64),
  email VARCHAR(255),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_erp_customer_contacts_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

CREATE INDEX IF NOT EXISTS idx_erp_customer_contacts_tenant ON erp_customer_contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_customer_contacts_customer ON erp_customer_contacts(tenant_id, customer_id);

CREATE TABLE IF NOT EXISTS erp_leads (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  code VARCHAR(64) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  phone VARCHAR(64),
  email VARCHAR(255),
  source VARCHAR(64),
  notes VARCHAR(512),
  status VARCHAR(32) NOT NULL DEFAULT 'NEW',
  converted_customer_id VARCHAR(128) REFERENCES erp_customers(id) ON DELETE SET NULL,
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  converted_at TIMESTAMPTZ,
  CONSTRAINT uq_erp_leads_tenant_code UNIQUE (tenant_id, code),
  CONSTRAINT chk_erp_leads_status CHECK (status IN ('NEW', 'QUALIFIED', 'CONVERTED', 'LOST'))
);

CREATE INDEX IF NOT EXISTS idx_erp_leads_tenant ON erp_leads(tenant_id);

CREATE TABLE IF NOT EXISTS erp_orders (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  order_number VARCHAR(64) NOT NULL,
  customer_id VARCHAR(128) NOT NULL REFERENCES erp_customers(id) ON DELETE RESTRICT,
  quarry_id VARCHAR(128) NOT NULL REFERENCES erp_quarries(id) ON DELETE RESTRICT,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  subtotal NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  notes VARCHAR(512),
  gate_pass_id VARCHAR(128),
  created_by VARCHAR(128),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_erp_orders_tenant_number UNIQUE (tenant_id, order_number),
  CONSTRAINT chk_erp_orders_status CHECK (status IN ('DRAFT', 'CONFIRMED', 'ALLOCATED', 'DISPATCHED', 'CANCELLED')),
  CONSTRAINT chk_erp_orders_totals CHECK (subtotal >= 0 AND tax_amount >= 0 AND total_amount >= 0)
);

CREATE INDEX IF NOT EXISTS idx_erp_orders_tenant ON erp_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_orders_customer ON erp_orders(tenant_id, customer_id);

CREATE TABLE IF NOT EXISTS erp_order_lines (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  order_id VARCHAR(128) NOT NULL REFERENCES erp_orders(id) ON DELETE CASCADE,
  product_id VARCHAR(128) NOT NULL REFERENCES erp_products(id) ON DELETE RESTRICT,
  product_size_id VARCHAR(128) REFERENCES erp_product_sizes(id) ON DELETE SET NULL,
  location_id VARCHAR(128) REFERENCES erp_quarry_locations(id) ON DELETE SET NULL,
  quantity NUMERIC(14, 3) NOT NULL,
  quantity_uom VARCHAR(16) NOT NULL DEFAULT 'TON',
  unit_price NUMERIC(14, 2) NOT NULL,
  line_total NUMERIC(14, 2) NOT NULL,
  CONSTRAINT chk_erp_order_lines_qty CHECK (quantity > 0),
  CONSTRAINT chk_erp_order_lines_price CHECK (unit_price >= 0 AND line_total >= 0)
);

CREATE INDEX IF NOT EXISTS idx_erp_order_lines_tenant ON erp_order_lines(tenant_id);
CREATE INDEX IF NOT EXISTS idx_erp_order_lines_order ON erp_order_lines(tenant_id, order_id);

ALTER TABLE erp_gate_passes
  ADD COLUMN IF NOT EXISTS order_id VARCHAR(128);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_erp_gate_passes_order'
  ) THEN
    ALTER TABLE erp_gate_passes
      ADD CONSTRAINT fk_erp_gate_passes_order
      FOREIGN KEY (order_id) REFERENCES erp_orders(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_erp_orders_gate_pass'
  ) THEN
    ALTER TABLE erp_orders
      ADD CONSTRAINT fk_erp_orders_gate_pass
      FOREIGN KEY (gate_pass_id) REFERENCES erp_gate_passes(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'erp_customer_contacts',
    'erp_leads',
    'erp_orders',
    'erp_order_lines'
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
