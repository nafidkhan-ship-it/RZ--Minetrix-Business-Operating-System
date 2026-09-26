-- RZ® Minetrix BOS - Migration 0015
-- Lifecycle integration: gate pass references existing fleet vehicle/driver (no duplicate masters)

ALTER TABLE erp_gate_passes
  ADD COLUMN IF NOT EXISTS vehicle_id VARCHAR(128),
  ADD COLUMN IF NOT EXISTS driver_id VARCHAR(128);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_erp_gate_passes_vehicle'
  ) THEN
    ALTER TABLE erp_gate_passes
      ADD CONSTRAINT fk_erp_gate_passes_vehicle
      FOREIGN KEY (vehicle_id) REFERENCES fleet_vehicles(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_erp_gate_passes_driver'
  ) THEN
    ALTER TABLE erp_gate_passes
      ADD CONSTRAINT fk_erp_gate_passes_driver
      FOREIGN KEY (driver_id) REFERENCES fleet_drivers(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_erp_gate_passes_vehicle ON erp_gate_passes(tenant_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_erp_gate_passes_driver ON erp_gate_passes(tenant_id, driver_id);
CREATE INDEX IF NOT EXISTS idx_erp_gate_passes_order ON erp_gate_passes(tenant_id, order_id);
