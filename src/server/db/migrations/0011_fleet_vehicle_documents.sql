-- RZ® Minetrix BOS - Migration 0011
-- Fleet vehicle compliance documents (tenant RLS)

CREATE TABLE IF NOT EXISTS fleet_vehicle_documents (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  vehicle_id VARCHAR(128) NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  document_type VARCHAR(32) NOT NULL,
  document_number VARCHAR(128),
  issue_date DATE,
  expiry_date DATE,
  issuing_authority VARCHAR(255),
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  storage_key VARCHAR(512),
  file_name VARCHAR(255),
  notes VARCHAR(512),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_fleet_vehicle_documents_type CHECK (
    document_type IN ('INSURANCE', 'FITNESS', 'PERMIT', 'REGISTRATION', 'POLLUTION', 'TAX', 'OTHER')
  ),
  CONSTRAINT chk_fleet_vehicle_documents_status CHECK (
    status IN ('PENDING', 'VALID', 'EXPIRING_SOON', 'EXPIRED', 'ARCHIVED')
  ),
  CONSTRAINT chk_fleet_vehicle_documents_dates CHECK (
    expiry_date IS NULL OR issue_date IS NULL OR expiry_date >= issue_date
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_fleet_vehicle_documents_active_number
  ON fleet_vehicle_documents(tenant_id, vehicle_id, document_type, document_number)
  WHERE deleted_at IS NULL AND document_number IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_documents_tenant ON fleet_vehicle_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_documents_vehicle ON fleet_vehicle_documents(tenant_id, vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_documents_type ON fleet_vehicle_documents(tenant_id, document_type);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_documents_status ON fleet_vehicle_documents(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicle_documents_expiry ON fleet_vehicle_documents(tenant_id, expiry_date);

ALTER TABLE fleet_vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicle_documents FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tenant_isolation_fleet_vehicle_documents ON fleet_vehicle_documents;
CREATE POLICY tenant_isolation_fleet_vehicle_documents ON fleet_vehicle_documents
  FOR ALL
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''))
  WITH CHECK (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));
