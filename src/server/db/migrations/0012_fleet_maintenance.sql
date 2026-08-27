-- RZ® Minetrix BOS - Migration 0012
-- Fleet vehicle maintenance records (tenant RLS)

CREATE TABLE IF NOT EXISTS fleet_vehicle_maintenance (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  vehicle_id VARCHAR(128) NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  maintenance_type VARCHAR(64) NOT NULL,
  service_date DATE NOT NULL,
  odometer_reading NUMERIC(12, 2),
  workshop_name VARCHAR(255),
  description VARCHAR(512),
  parts_details VARCHAR(512),
  cost NUMERIC(14, 2) NOT NULL DEFAULT 0,
  next_service_date DATE,
  next_service_odometer NUMERIC(12, 2),
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
  notes VARCHAR(512),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_fleet_vehicle_maintenance_status CHECK (
    status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
  ),
  CONSTRAINT chk_fleet_vehicle_maintenance_cost CHECK (cost >= 0),
  CONSTRAINT chk_fleet_vehicle_maintenance_odometer CHECK (
    odometer_reading IS NULL OR odometer_reading >= 0
  ),
  CONSTRAINT chk_fleet_vehicle_maintenance_next_odometer CHECK (
    next_service_odometer IS NULL OR next_service_odometer >= 0
  ),
  CONSTRAINT chk_fleet_vehicle_maintenance_next_dates CHECK (
    next_service_date IS NULL OR next_service_date >= service_date
  )
);

CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_maintenance_tenant ON fleet_vehicle_maintenance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_maintenance_vehicle ON fleet_vehicle_maintenance(tenant_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_maintenance_status ON fleet_vehicle_maintenance(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_maintenance_service_date ON fleet_vehicle_maintenance(tenant_id, service_date);

ALTER TABLE fleet_vehicle_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicle_maintenance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_fleet_vehicle_maintenance ON fleet_vehicle_maintenance;
CREATE POLICY tenant_isolation_fleet_vehicle_maintenance ON fleet_vehicle_maintenance
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));
