-- RZ® Minetrix BOS - Migration 0013
-- Fleet fuel records (tenant RLS)

CREATE TABLE IF NOT EXISTS fleet_fuel_records (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  vehicle_id VARCHAR(128) NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  fuel_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fuel_type VARCHAR(32) NOT NULL,
  quantity NUMERIC(12, 3) NOT NULL,
  unit VARCHAR(16) NOT NULL DEFAULT 'LITER',
  rate NUMERIC(12, 4) NOT NULL,
  total_amount NUMERIC(14, 2) NOT NULL,
  odometer_reading NUMERIC(12, 2),
  station_name VARCHAR(255),
  reference_number VARCHAR(128),
  notes VARCHAR(512),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_fleet_fuel_records_type CHECK (
    fuel_type IN ('DIESEL', 'PETROL', 'CNG', 'ELECTRIC', 'HYBRID', 'OTHER')
  ),
  CONSTRAINT chk_fleet_fuel_records_quantity CHECK (quantity > 0),
  CONSTRAINT chk_fleet_fuel_records_rate CHECK (rate >= 0),
  CONSTRAINT chk_fleet_fuel_records_total CHECK (total_amount >= 0),
  CONSTRAINT chk_fleet_fuel_records_odometer CHECK (
    odometer_reading IS NULL OR odometer_reading >= 0
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_fleet_fuel_records_active_reference
  ON fleet_fuel_records(tenant_id, reference_number)
  WHERE deleted_at IS NULL AND reference_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fleet_fuel_records_tenant ON fleet_fuel_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_fuel_records_vehicle ON fleet_fuel_records(tenant_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_fuel_records_date ON fleet_fuel_records(tenant_id, fuel_date);
CREATE INDEX IF NOT EXISTS idx_fleet_fuel_records_reference ON fleet_fuel_records(tenant_id, reference_number);

ALTER TABLE fleet_fuel_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_fuel_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_fleet_fuel_records ON fleet_fuel_records;
CREATE POLICY tenant_isolation_fleet_fuel_records ON fleet_fuel_records
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));
