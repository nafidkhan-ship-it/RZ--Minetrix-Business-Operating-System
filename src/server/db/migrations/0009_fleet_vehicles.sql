-- RZ® Minetrix BOS - Migration 0009
-- Fleet vehicle master (tenant RLS)

CREATE TABLE IF NOT EXISTS fleet_vehicles (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  registration_number VARCHAR(32) NOT NULL,
  vehicle_type VARCHAR(32) NOT NULL,
  make VARCHAR(128) NOT NULL,
  model VARCHAR(128) NOT NULL,
  variant VARCHAR(128),
  manufacturing_year INTEGER NOT NULL,
  fuel_type VARCHAR(32) NOT NULL,
  ownership_type VARCHAR(32) NOT NULL,
  owner_reference VARCHAR(255),
  capacity NUMERIC(12, 2) NOT NULL DEFAULT 0,
  capacity_unit VARCHAR(32) NOT NULL DEFAULT 'TON',
  branch_id VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  insurance_reference VARCHAR(128),
  fitness_reference VARCHAR(128),
  permit_reference VARCHAR(128),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_fleet_vehicles_tenant_registration UNIQUE (tenant_id, registration_number),
  CONSTRAINT chk_fleet_vehicles_type CHECK (vehicle_type IN ('TIPPER', 'TRAILER', 'TANKER', 'PICKUP', 'LOWBED', 'OTHER')),
  CONSTRAINT chk_fleet_vehicles_fuel CHECK (fuel_type IN ('DIESEL', 'PETROL', 'CNG', 'ELECTRIC', 'HYBRID')),
  CONSTRAINT chk_fleet_vehicles_ownership CHECK (ownership_type IN ('COMPANY', 'ATTACHED', 'CONTRACTOR', 'LEASED')),
  CONSTRAINT chk_fleet_vehicles_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'RETIRED')),
  CONSTRAINT chk_fleet_vehicles_capacity CHECK (capacity >= 0),
  CONSTRAINT chk_fleet_vehicles_year CHECK (manufacturing_year BETWEEN 1980 AND 2100)
);

CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_tenant ON fleet_vehicles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_status ON fleet_vehicles(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_type ON fleet_vehicles(tenant_id, vehicle_type);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_registration ON fleet_vehicles(tenant_id, registration_number);

ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicles FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_fleet_vehicles ON fleet_vehicles;
CREATE POLICY tenant_isolation_fleet_vehicles ON fleet_vehicles
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));
