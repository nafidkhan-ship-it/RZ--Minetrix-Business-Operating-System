-- RZ® Minetrix BOS - Migration 0010
-- Fleet driver master with optional HRMS employee and vehicle assignment (tenant RLS)

CREATE TABLE IF NOT EXISTS fleet_drivers (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  employee_id VARCHAR(128) REFERENCES hrms_employees(id) ON DELETE SET NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  license_number VARCHAR(64) NOT NULL,
  license_class VARCHAR(32) NOT NULL,
  license_issue_date DATE,
  license_expiry_date DATE,
  badge_code VARCHAR(64),
  branch_id VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  assigned_vehicle_id VARCHAR(128) REFERENCES fleet_vehicles(id) ON DELETE SET NULL,
  notes VARCHAR(512),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_fleet_drivers_tenant_license UNIQUE (tenant_id, license_number),
  CONSTRAINT uq_fleet_drivers_tenant_badge UNIQUE (tenant_id, badge_code),
  CONSTRAINT chk_fleet_drivers_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
  CONSTRAINT chk_fleet_drivers_license_class CHECK (license_class IN ('LMV', 'HMV', 'HGMV', 'TRANS', 'OTHER')),
  CONSTRAINT chk_fleet_drivers_license_dates CHECK (
    license_expiry_date IS NULL OR license_issue_date IS NULL OR license_expiry_date >= license_issue_date
  )
);

CREATE INDEX IF NOT EXISTS idx_fleet_drivers_tenant ON fleet_drivers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_drivers_status ON fleet_drivers(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_fleet_drivers_license ON fleet_drivers(tenant_id, license_number);
CREATE INDEX IF NOT EXISTS idx_fleet_drivers_vehicle ON fleet_drivers(tenant_id, assigned_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_drivers_employee ON fleet_drivers(tenant_id, employee_id);

ALTER TABLE fleet_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_drivers FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_fleet_drivers ON fleet_drivers;
CREATE POLICY tenant_isolation_fleet_drivers ON fleet_drivers
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));
