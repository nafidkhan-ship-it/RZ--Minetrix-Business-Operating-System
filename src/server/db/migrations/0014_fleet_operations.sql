-- RZ® Minetrix BOS - Migration 0014
-- Fleet operational assignments linking vehicles, drivers, and ERP dispatch (tenant RLS)

CREATE TABLE IF NOT EXISTS fleet_operations (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  operation_number VARCHAR(64) NOT NULL,
  vehicle_id VARCHAR(128) NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  driver_id VARCHAR(128) NOT NULL REFERENCES fleet_drivers(id) ON DELETE RESTRICT,
  gate_pass_id VARCHAR(128) REFERENCES erp_gate_passes(id) ON DELETE SET NULL,
  dispatch_id VARCHAR(128) REFERENCES erp_dispatches(id) ON DELETE SET NULL,
  destination VARCHAR(512),
  planned_start_at TIMESTAMPTZ,
  planned_end_at TIMESTAMPTZ,
  actual_start_at TIMESTAMPTZ,
  actual_end_at TIMESTAMPTZ,
  odometer_start NUMERIC(12, 2),
  odometer_end NUMERIC(12, 2),
  status VARCHAR(32) NOT NULL DEFAULT 'PLANNED',
  notes VARCHAR(512),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_fleet_operations_tenant_number UNIQUE (tenant_id, operation_number),
  CONSTRAINT chk_fleet_operations_status CHECK (
    status IN ('PLANNED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')
  ),
  CONSTRAINT chk_fleet_operations_odometer CHECK (
    (odometer_start IS NULL OR odometer_start >= 0)
    AND (odometer_end IS NULL OR odometer_end >= 0)
    AND (odometer_end IS NULL OR odometer_start IS NULL OR odometer_end >= odometer_start)
  ),
  CONSTRAINT chk_fleet_operations_planned_window CHECK (
    planned_end_at IS NULL OR planned_start_at IS NULL OR planned_end_at >= planned_start_at
  ),
  CONSTRAINT chk_fleet_operations_actual_window CHECK (
    actual_end_at IS NULL OR actual_start_at IS NULL OR actual_end_at >= actual_start_at
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_fleet_operations_active_gate_pass
  ON fleet_operations(tenant_id, gate_pass_id)
  WHERE deleted_at IS NULL AND gate_pass_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fleet_operations_tenant ON fleet_operations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_operations_vehicle ON fleet_operations(tenant_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_operations_driver ON fleet_operations(tenant_id, driver_id);
CREATE INDEX IF NOT EXISTS idx_fleet_operations_status ON fleet_operations(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_fleet_operations_gate_pass ON fleet_operations(tenant_id, gate_pass_id);
CREATE INDEX IF NOT EXISTS idx_fleet_operations_dispatch ON fleet_operations(tenant_id, dispatch_id);

ALTER TABLE fleet_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_operations FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_fleet_operations ON fleet_operations;
CREATE POLICY tenant_isolation_fleet_operations ON fleet_operations
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));
