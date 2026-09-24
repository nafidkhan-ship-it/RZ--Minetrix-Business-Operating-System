-- RZ® Minetrix BOS - AI Load Exchange, Transport Marketplace & Smart Logistics Migration 0004
-- PostgreSQL Drizzle Schema & Row-Level Security (RLS) Initializer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Marketplace Transporter Profiles Table
CREATE TABLE IF NOT EXISTS marketplace_transporter_profiles (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  business_id VARCHAR(64),
  company_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 4.50,
  total_trips INTEGER NOT NULL DEFAULT 0,
  completed_trips INTEGER NOT NULL DEFAULT 0,
  cancellation_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  verified_status VARCHAR(32) NOT NULL DEFAULT 'VERIFIED', -- VERIFIED, PENDING, REJECTED
  service_areas TEXT[], -- Array of covered cities/regions
  vehicle_types TEXT[], -- Array of vehicle types supported
  base_rate_per_km NUMERIC(10, 2) NOT NULL DEFAULT 65.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT uq_mkt_transporter_tenant_company UNIQUE (tenant_id, company_name)
);

CREATE INDEX IF NOT EXISTS idx_mkt_transporter_tenant ON marketplace_transporter_profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_transporter_status ON marketplace_transporter_profiles(verified_status);

-- 2. Marketplace Transporter Service Areas Table
CREATE TABLE IF NOT EXISTS marketplace_service_areas (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  transporter_id UUID NOT NULL REFERENCES marketplace_transporter_profiles(id) ON DELETE CASCADE,
  region VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  primary_routes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mkt_service_area_tenant ON marketplace_service_areas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_service_area_transporter ON marketplace_service_areas(transporter_id);

-- 3. Marketplace Load Requests Table
CREATE TABLE IF NOT EXISTS marketplace_load_requests (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  request_number VARCHAR(64) NOT NULL,
  customer_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  business_id VARCHAR(64),
  material_id VARCHAR(64) NOT NULL,
  material_name VARCHAR(255) NOT NULL,
  source VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  required_date DATE NOT NULL,
  required_time VARCHAR(32) NOT NULL DEFAULT '08:00 AM',
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 1.00,
  unit VARCHAR(32) NOT NULL DEFAULT 'TONS', -- TONS, CFT, LOADS, TRIPS, BAGS
  vehicle_type VARCHAR(64) NOT NULL,
  vehicle_capacity NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  budget NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  special_requirements TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN', -- DRAFT, OPEN, MATCHING, MATCHED, BOOKED, DISPATCHED, IN_TRANSIT, DELIVERED, COMPLETED, CANCELLED, EXPIRED
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT uq_mkt_load_req_tenant_num UNIQUE (tenant_id, request_number)
);

CREATE INDEX IF NOT EXISTS idx_mkt_loads_tenant ON marketplace_load_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_loads_status ON marketplace_load_requests(status);
CREATE INDEX IF NOT EXISTS idx_mkt_loads_mat ON marketplace_load_requests(material_id);

-- 4. Marketplace Load Matches Table
CREATE TABLE IF NOT EXISTS marketplace_load_matches (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  load_id UUID NOT NULL REFERENCES marketplace_load_requests(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES fleet_vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES fleet_drivers(id) ON DELETE SET NULL,
  transporter_id UUID REFERENCES marketplace_transporter_profiles(id) ON DELETE SET NULL,
  distance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  estimated_time VARCHAR(64) NOT NULL,
  estimated_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  offered_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  match_score INTEGER NOT NULL DEFAULT 0, -- 0 to 100
  availability VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE',
  reason_codes TEXT[] NOT NULL DEFAULT '{}', -- E.g. ARRAY['HIGH_CAPACITY_MATCH', 'NEAR_SOURCE']
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mkt_matches_tenant ON marketplace_load_matches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_matches_load ON marketplace_load_matches(load_id);

-- 5. Marketplace Load Offers Table
CREATE TABLE IF NOT EXISTS marketplace_load_offers (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  offer_number VARCHAR(64) NOT NULL,
  load_id UUID NOT NULL REFERENCES marketplace_load_requests(id) ON DELETE CASCADE,
  transporter_id UUID NOT NULL REFERENCES marketplace_transporter_profiles(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES fleet_vehicles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES fleet_drivers(id) ON DELETE SET NULL,
  quoted_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  estimated_pickup TIMESTAMP WITH TIME ZONE NOT NULL,
  estimated_delivery TIMESTAMP WITH TIME ZONE NOT NULL,
  remarks TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, SHORTLISTED, ACCEPTED, REJECTED, EXPIRED, WITHDRAWN
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_mkt_offer_tenant_num UNIQUE (tenant_id, offer_number)
);

CREATE INDEX IF NOT EXISTS idx_mkt_offers_tenant ON marketplace_load_offers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_offers_load ON marketplace_load_offers(load_id);
CREATE INDEX IF NOT EXISTS idx_mkt_offers_status ON marketplace_load_offers(status);

-- 6. Marketplace Bookings Table
CREATE TABLE IF NOT EXISTS marketplace_bookings (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  booking_number VARCHAR(64) NOT NULL,
  load_id UUID NOT NULL REFERENCES marketplace_load_requests(id) ON DELETE CASCADE,
  offer_id UUID REFERENCES marketplace_load_offers(id) ON DELETE SET NULL,
  vehicle_id UUID NOT NULL REFERENCES fleet_vehicles(id) ON DELETE RESTRICT,
  driver_id UUID NOT NULL REFERENCES fleet_drivers(id) ON DELETE RESTRICT,
  transporter_id UUID NOT NULL REFERENCES marketplace_transporter_profiles(id) ON DELETE RESTRICT,
  customer_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  agreed_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  pickup_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  delivery_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'CONFIRMED', -- CONFIRMED, DISPATCHED, IN_TRANSIT, DELIVERED, COMPLETED, CANCELLED
  fleet_trip_id UUID REFERENCES fleet_trips(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_mkt_booking_tenant_num UNIQUE (tenant_id, booking_number)
);

CREATE INDEX IF NOT EXISTS idx_mkt_bookings_tenant ON marketplace_bookings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_bookings_load ON marketplace_bookings(load_id);
CREATE INDEX IF NOT EXISTS idx_mkt_bookings_status ON marketplace_bookings(status);

-- 7. Marketplace Pricing Rules Table
CREATE TABLE IF NOT EXISTS marketplace_pricing_rules (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  material_id VARCHAR(64) NOT NULL,
  material_name VARCHAR(255) NOT NULL,
  vehicle_type VARCHAR(64) NOT NULL,
  base_fare NUMERIC(12, 2) NOT NULL DEFAULT 500.00,
  rate_per_km NUMERIC(10, 2) NOT NULL DEFAULT 50.00,
  rate_per_ton NUMERIC(10, 2) NOT NULL DEFAULT 120.00,
  min_charge NUMERIC(12, 2) NOT NULL DEFAULT 1500.00,
  surge_multiplier NUMERIC(4, 2) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_mkt_pricing_tenant_mat_veh UNIQUE (tenant_id, material_id, vehicle_type)
);

CREATE INDEX IF NOT EXISTS idx_mkt_pricing_tenant ON marketplace_pricing_rules(tenant_id);

-- 8. Marketplace Deliveries Table
CREATE TABLE IF NOT EXISTS marketplace_deliveries (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES marketplace_bookings(id) ON DELETE CASCADE,
  load_id UUID NOT NULL REFERENCES marketplace_load_requests(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES fleet_trips(id) ON DELETE SET NULL,
  pickup_time TIMESTAMP WITH TIME ZONE,
  delivery_time TIMESTAMP WITH TIME ZONE,
  receiver_name VARCHAR(255) NOT NULL,
  receiver_contact VARCHAR(64) NOT NULL,
  quantity_delivered NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  document_reference VARCHAR(255),
  photo_reference VARCHAR(255),
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING', -- PENDING, DISPATCHED, IN_TRANSIT, DELIVERED, CONFIRMED
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mkt_deliveries_tenant ON marketplace_deliveries(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_deliveries_booking ON marketplace_deliveries(booking_id);

-- 9. Marketplace Ratings Table
CREATE TABLE IF NOT EXISTS marketplace_ratings (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  booking_id UUID NOT NULL REFERENCES marketplace_bookings(id) ON DELETE CASCADE,
  trip_id UUID REFERENCES fleet_trips(id) ON DELETE SET NULL,
  customer_id VARCHAR(64) NOT NULL,
  transporter_id UUID REFERENCES marketplace_transporter_profiles(id) ON DELETE SET NULL,
  driver_id UUID REFERENCES fleet_drivers(id) ON DELETE SET NULL,
  vehicle_id UUID REFERENCES fleet_vehicles(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_mkt_rating_booking UNIQUE (tenant_id, booking_id)
);

CREATE INDEX IF NOT EXISTS idx_mkt_ratings_tenant ON marketplace_ratings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_ratings_transporter ON marketplace_ratings(transporter_id);

-- 10. Marketplace Disputes Table
CREATE TABLE IF NOT EXISTS marketplace_disputes (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  dispute_number VARCHAR(64) NOT NULL,
  booking_id UUID NOT NULL REFERENCES marketplace_bookings(id) ON DELETE CASCADE,
  load_id UUID NOT NULL REFERENCES marketplace_load_requests(id) ON DELETE CASCADE,
  raised_by_user_id VARCHAR(64) NOT NULL,
  dispute_type VARCHAR(64) NOT NULL, -- DELIVERY, QUANTITY, PRICE, DAMAGE, CANCELLATION, OTHER
  description TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN', -- OPEN, UNDER_INVESTIGATION, RESOLVED, CLOSED
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_mkt_dispute_tenant_num UNIQUE (tenant_id, dispute_number)
);

CREATE INDEX IF NOT EXISTS idx_mkt_disputes_tenant ON marketplace_disputes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_mkt_disputes_booking ON marketplace_disputes(booking_id);

-- 11. Marketplace Matching Events Table
CREATE TABLE IF NOT EXISTS marketplace_matching_events (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  load_id UUID NOT NULL REFERENCES marketplace_load_requests(id) ON DELETE CASCADE,
  matches_found INTEGER NOT NULL DEFAULT 0,
  top_match_score INTEGER NOT NULL DEFAULT 0,
  trigger_type VARCHAR(32) NOT NULL DEFAULT 'AUTO', -- AUTO, MANUAL
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mkt_matching_events_tenant ON marketplace_matching_events(tenant_id);

-- ==================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES FOR MARKETPLACE TABLES
-- ==================================================

ALTER TABLE marketplace_transporter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_load_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_load_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_load_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_matching_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS tenant_isolation_mkt_transporters ON marketplace_transporter_profiles;
CREATE POLICY tenant_isolation_mkt_transporters ON marketplace_transporter_profiles
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_service_areas ON marketplace_service_areas;
CREATE POLICY tenant_isolation_mkt_service_areas ON marketplace_service_areas
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_loads ON marketplace_load_requests;
CREATE POLICY tenant_isolation_mkt_loads ON marketplace_load_requests
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_matches ON marketplace_load_matches;
CREATE POLICY tenant_isolation_mkt_matches ON marketplace_load_matches
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_offers ON marketplace_load_offers;
CREATE POLICY tenant_isolation_mkt_offers ON marketplace_load_offers
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_bookings ON marketplace_bookings;
CREATE POLICY tenant_isolation_mkt_bookings ON marketplace_bookings
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_pricing ON marketplace_pricing_rules;
CREATE POLICY tenant_isolation_mkt_pricing ON marketplace_pricing_rules
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_deliveries ON marketplace_deliveries;
CREATE POLICY tenant_isolation_mkt_deliveries ON marketplace_deliveries
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_ratings ON marketplace_ratings;
CREATE POLICY tenant_isolation_mkt_ratings ON marketplace_ratings
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_disputes ON marketplace_disputes;
CREATE POLICY tenant_isolation_mkt_disputes ON marketplace_disputes
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

DROP POLICY IF EXISTS tenant_isolation_mkt_matching_events ON marketplace_matching_events;
CREATE POLICY tenant_isolation_mkt_matching_events ON marketplace_matching_events
    FOR ALL USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
