-- RZ® Minetrix BOS - Fleet Operations & Vehicle Management Migration 0003
-- PostgreSQL Drizzle Schema & Row-Level Security (RLS) Initializer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Fleet Vehicle Categories Table
CREATE TABLE IF NOT EXISTS fleet_vehicle_categories (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fleet_category_tenant_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_fleet_categories_tenant ON fleet_vehicle_categories(tenant_id);

-- 2. Fleet Vehicles Table
CREATE TABLE IF NOT EXISTS fleet_vehicles (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES core_companies(id) ON DELETE RESTRICT,
  branch_id UUID REFERENCES core_branches(id) ON DELETE SET NULL,
  business_unit_id UUID REFERENCES core_business_units(id) ON DELETE SET NULL,
  registration_number VARCHAR(64) NOT NULL,
  vehicle_type VARCHAR(64) NOT NULL,
  category_id UUID REFERENCES fleet_vehicle_categories(id) ON DELETE SET NULL,
  category_name VARCHAR(64) NOT NULL,
  make VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  variant VARCHAR(100),
  manufacturing_year INTEGER NOT NULL,
  purchase_date DATE NOT NULL,
  purchase_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  ownership_type VARCHAR(32) NOT NULL DEFAULT 'OWNED', -- OWNED, LEASED, HIRED, CUSTOMER_LINKED
  owner_name VARCHAR(255) NOT NULL,
  fuel_type VARCHAR(32) NOT NULL DEFAULT 'DIESEL', -- DIESEL, PETROL, ELECTRIC, CNG, HYBRID
  fuel_capacity NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  engine_number VARCHAR(128) NOT NULL,
  chassis_number VARCHAR(128) NOT NULL,
  color VARCHAR(64),
  seating_capacity INTEGER DEFAULT 2,
  load_capacity NUMERIC(10, 2) NOT NULL DEFAULT 0.00, -- Tons / CFT
  current_odometer NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, ASSIGNED, ON_TRIP, UNDER_MAINTENANCE, ACCIDENT, INACTIVE, SOLD, RETIRED
  location VARCHAR(255) NOT NULL DEFAULT 'Main Depot Yard',
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT uq_fleet_vehicle_tenant_reg UNIQUE (tenant_id, registration_number)
);

CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_tenant ON fleet_vehicles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_company ON fleet_vehicles(company_id);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_status ON fleet_vehicles(status);
CREATE INDEX IF NOT EXISTS idx_fleet_vehicles_reg ON fleet_vehicles(registration_number);

-- 3. Fleet Vehicle Documents Table
CREATE TABLE IF NOT EXISTS fleet_vehicle_documents (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  document_type VARCHAR(64) NOT NULL, -- RC, INSURANCE, FITNESS, PERMIT, TAX, PUC, LICENSE, SERVICE_INVOICE, OTHER
  document_number VARCHAR(128) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  storage_document_id UUID REFERENCES core_documents(id) ON DELETE SET NULL,
  file_reference VARCHAR(255),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, EXPIRING_SOON, EXPIRED
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fleet_docs_tenant ON fleet_vehicle_documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_docs_vehicle ON fleet_vehicle_documents(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_docs_expiry ON fleet_vehicle_documents(expiry_date);

-- 4. Fleet Drivers Table
CREATE TABLE IF NOT EXISTS fleet_drivers (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id VARCHAR(64),
  linked_user_id UUID REFERENCES core_users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  license_number VARCHAR(128) NOT NULL,
  license_type VARCHAR(64) NOT NULL DEFAULT 'HEAVY_COMMERCIAL',
  license_issue_date DATE NOT NULL,
  license_expiry_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, INACTIVE, ON_LEAVE, SUSPENDED
  joining_date DATE NOT NULL,
  emergency_contact VARCHAR(255),
  address TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fleet_driver_tenant_license UNIQUE (tenant_id, license_number)
);

CREATE INDEX IF NOT EXISTS idx_fleet_drivers_tenant ON fleet_drivers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_drivers_status ON fleet_drivers(status);

-- 5. Fleet Vehicle Assignments Table
CREATE TABLE IF NOT EXISTS fleet_vehicle_assignments (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  primary_driver_id UUID REFERENCES fleet_drivers(id) ON DELETE SET NULL,
  secondary_driver_id UUID REFERENCES fleet_drivers(id) ON DELETE SET NULL,
  assigned_employee_id VARCHAR(64),
  company_id UUID REFERENCES core_companies(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES core_branches(id) ON DELETE SET NULL,
  business_unit_id UUID REFERENCES core_business_units(id) ON DELETE SET NULL,
  assignment_start TIMESTAMP WITH TIME ZONE NOT NULL,
  assignment_end TIMESTAMP WITH TIME ZONE,
  purpose TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, COMPLETED, CANCELLED
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fleet_assign_tenant ON fleet_vehicle_assignments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_assign_vehicle ON fleet_vehicle_assignments(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_assign_driver ON fleet_vehicle_assignments(primary_driver_id);

-- 6. Fleet Trips Table
CREATE TABLE IF NOT EXISTS fleet_trips (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  trip_number VARCHAR(64) NOT NULL,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES fleet_drivers(id) ON DELETE RESTRICT,
  source VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  trip_date DATE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  start_odometer NUMERIC(12, 2) NOT NULL,
  end_odometer NUMERIC(12, 2),
  distance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  trip_type VARCHAR(64) NOT NULL DEFAULT 'MINING_DISPATCH', -- MINING_DISPATCH, COMMERCIAL_FREIGHT, RENTAL_LEASE, INTERNAL_TRANSFER
  customer_id VARCHAR(64),
  customer_name VARCHAR(255),
  material VARCHAR(128),
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  load_reference VARCHAR(128),
  delivery_reference VARCHAR(128),
  status VARCHAR(32) NOT NULL DEFAULT 'PLANNED', -- PLANNED, DISPATCHED, IN_PROGRESS, COMPLETED, CANCELLED
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_fleet_trip_tenant_num UNIQUE (tenant_id, trip_number)
);

CREATE INDEX IF NOT EXISTS idx_fleet_trips_tenant ON fleet_trips(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_trips_vehicle ON fleet_trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_fleet_trips_driver ON fleet_trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_fleet_trips_status ON fleet_trips(status);

-- 7. Fleet Trip Stops Table
CREATE TABLE IF NOT EXISTS fleet_trip_stops (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  trip_id UUID NOT NULL REFERENCES fleet_trips(id) ON DELETE CASCADE,
  stop_sequence INTEGER NOT NULL DEFAULT 1,
  location_name VARCHAR(255) NOT NULL,
  arrival_time TIMESTAMP WITH TIME ZONE,
  departure_time TIMESTAMP WITH TIME ZONE,
  odometer NUMERIC(12, 2),
  purpose TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. Fleet Fuel Logs Table
CREATE TABLE IF NOT EXISTS fleet_fuel_logs (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  driver_id UUID REFERENCES fleet_drivers(id) ON DELETE SET NULL,
  log_date DATE NOT NULL,
  fuel_station VARCHAR(255) NOT NULL,
  fuel_type VARCHAR(32) NOT NULL DEFAULT 'DIESEL',
  quantity NUMERIC(10, 2) NOT NULL, -- Liters
  rate NUMERIC(10, 2) NOT NULL, -- Price per liter
  amount NUMERIC(12, 2) NOT NULL, -- quantity * rate
  odometer NUMERIC(12, 2) NOT NULL,
  payment_method VARCHAR(64) NOT NULL DEFAULT 'COMPANY_CARD',
  invoice_number VARCHAR(128),
  calculated_efficiency NUMERIC(8, 2), -- KM/L
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fleet_fuel_tenant ON fleet_fuel_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_fuel_vehicle ON fleet_fuel_logs(vehicle_id);

-- 9. Fleet Maintenance Records Table
CREATE TABLE IF NOT EXISTS fleet_maintenance_records (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  maintenance_type VARCHAR(64) NOT NULL, -- PREVENTIVE, CORRECTIVE, BREAKDOWN, SERVICE, INSPECTION
  service_date DATE NOT NULL,
  odometer NUMERIC(12, 2) NOT NULL,
  workshop VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  parts_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  labour_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  other_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00, -- parts + labour + other
  next_service_date DATE,
  next_service_odometer NUMERIC(12, 2),
  status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED', -- SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fleet_maint_tenant ON fleet_maintenance_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_maint_vehicle ON fleet_maintenance_records(vehicle_id);

-- 10. Fleet Service Records Table
CREATE TABLE IF NOT EXISTS fleet_service_records (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  service_code VARCHAR(64) NOT NULL,
  service_title VARCHAR(255) NOT NULL,
  performed_date DATE NOT NULL,
  cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  technician_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 11. Fleet Tyre Records Table
CREATE TABLE IF NOT EXISTS fleet_tyre_records (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  tyre_number VARCHAR(128) NOT NULL,
  vehicle_id UUID REFERENCES fleet_vehicles(id) ON DELETE SET NULL,
  position VARCHAR(32) NOT NULL, -- FRONT_LEFT, FRONT_RIGHT, REAR_LEFT_OUTER, REAR_LEFT_INNER, etc.
  brand VARCHAR(100) NOT NULL,
  size VARCHAR(64) NOT NULL,
  installation_date DATE NOT NULL,
  installation_odometer NUMERIC(12, 2) NOT NULL,
  current_odometer NUMERIC(12, 2) NOT NULL,
  purchase_cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, MOUNTED, REPLACED, SCRAPPED
  removal_date DATE,
  removal_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 12. Fleet Battery Records Table
CREATE TABLE IF NOT EXISTS fleet_battery_records (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  battery_number VARCHAR(128) NOT NULL,
  vehicle_id UUID REFERENCES fleet_vehicles(id) ON DELETE SET NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  installation_date DATE NOT NULL,
  installation_odometer NUMERIC(12, 2) NOT NULL,
  warranty_expiry DATE NOT NULL,
  replacement_date DATE,
  cost NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, REPLACED, CLAIMED_WARRANTY
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 13. Fleet Insurance Records Table
CREATE TABLE IF NOT EXISTS fleet_insurance_records (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  policy_number VARCHAR(128) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  policy_type VARCHAR(64) NOT NULL DEFAULT 'COMPREHENSIVE',
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  premium_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  insured_declared_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 14. Fleet Compliance Records Table
CREATE TABLE IF NOT EXISTS fleet_compliance_records (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  compliance_type VARCHAR(64) NOT NULL, -- FITNESS, PERMIT, ROAD_TAX, POLLUTION_CERTIFICATE, NATIONAL_PERMIT
  certificate_number VARCHAR(128) NOT NULL,
  issue_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  issuing_authority VARCHAR(255) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 15. Fleet Odometer Logs Table
CREATE TABLE IF NOT EXISTS fleet_odometer_logs (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  log_type VARCHAR(64) NOT NULL, -- OPENING, TRIP_READING, FUEL_READING, SERVICE_READING, MANUAL_READING
  reading NUMERIC(12, 2) NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  recorded_by_user_id UUID REFERENCES core_users(id) ON DELETE SET NULL,
  reference_id VARCHAR(128),
  notes TEXT,
  is_audit_correction BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_fleet_odometer_tenant ON fleet_odometer_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_fleet_odometer_vehicle ON fleet_odometer_logs(vehicle_id);

-- 16. Fleet Vehicle Expenses Table
CREATE TABLE IF NOT EXISTS fleet_vehicle_expenses (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES fleet_drivers(id) ON DELETE SET NULL,
  trip_id UUID REFERENCES fleet_trips(id) ON DELETE SET NULL,
  expense_category VARCHAR(64) NOT NULL, -- FUEL, MAINTENANCE, INSURANCE, TAX, PERMIT, TYRES, BATTERY, DRIVER_ALLOWANCE, TOLL, PARKING, FINE, OTHER
  expense_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  payment_status VARCHAR(32) NOT NULL DEFAULT 'PAID',
  reference_number VARCHAR(128),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 17. Fleet Vehicle Revenue Table
CREATE TABLE IF NOT EXISTS fleet_vehicle_revenue (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES fleet_trips(id) ON DELETE SET NULL,
  revenue_category VARCHAR(64) NOT NULL, -- TRIP_REVENUE, TRANSPORT_CHARGE, RENTAL_REVENUE, CUSTOMER_DELIVERY
  revenue_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  invoice_number VARCHAR(128),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 18. Fleet Vehicle Status History Table
CREATE TABLE IF NOT EXISTS fleet_vehicle_status_history (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  previous_status VARCHAR(32) NOT NULL,
  new_status VARCHAR(32) NOT NULL,
  reason TEXT,
  changed_by_user_id UUID REFERENCES core_users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 19. Fleet Vehicle Alerts Table
CREATE TABLE IF NOT EXISTS fleet_vehicle_alerts (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES fleet_vehicles(id) ON DELETE CASCADE,
  alert_type VARCHAR(64) NOT NULL, -- DOCUMENT_EXPIRY, SERVICE_DUE, HIGH_FUEL_CONSUMPTION, MAINTENANCE_OVERDUE, VEHICLE_IDLE
  severity VARCHAR(32) NOT NULL DEFAULT 'WARNING', -- INFO, WARNING, CRITICAL
  message TEXT NOT NULL,
  is_resolved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_fleet_alerts_tenant ON fleet_vehicle_alerts(tenant_id);

-- ==================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR FLEET TABLES
-- ==================================================

ALTER TABLE fleet_vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicle_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_fuel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_tyre_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_battery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_insurance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_compliance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_odometer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicle_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicle_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicle_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_vehicle_alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_fleet_vehicles ON fleet_vehicles;
CREATE POLICY tenant_isolation_fleet_vehicles ON fleet_vehicles
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_fleet_drivers ON fleet_drivers;
CREATE POLICY tenant_isolation_fleet_drivers ON fleet_drivers
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_fleet_trips ON fleet_trips;
CREATE POLICY tenant_isolation_fleet_trips ON fleet_trips
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_fleet_fuel_logs ON fleet_fuel_logs;
CREATE POLICY tenant_isolation_fleet_fuel_logs ON fleet_fuel_logs
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_fleet_maintenance ON fleet_maintenance_records;
CREATE POLICY tenant_isolation_fleet_maintenance ON fleet_maintenance_records
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_fleet_alerts ON fleet_vehicle_alerts;
CREATE POLICY tenant_isolation_fleet_alerts ON fleet_vehicle_alerts
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
