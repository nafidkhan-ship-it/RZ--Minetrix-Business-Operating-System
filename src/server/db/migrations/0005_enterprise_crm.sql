-- RZ® Minetrix BOS - Enterprise CRM, Customer 360 & Sales Management Migration 0005
-- PostgreSQL Drizzle Schema & Row-Level Security (RLS) Initializer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. CRM Customers Master Table
CREATE TABLE IF NOT EXISTS crm_customers (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  customer_type VARCHAR(64) NOT NULL DEFAULT 'BUSINESS',
  business_id VARCHAR(64),
  display_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  customer_code VARCHAR(64) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  city VARCHAR(100) NOT NULL,
  district VARCHAR(100),
  state VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'India',
  tax_identifier VARCHAR(64),
  credit_limit NUMERIC(15, 2) NOT NULL DEFAULT 500000.00,
  credit_days INTEGER NOT NULL DEFAULT 30,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  source VARCHAR(100) NOT NULL DEFAULT 'Direct',
  assigned_sales_user VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT uq_crm_cust_code UNIQUE (tenant_id, customer_code)
);

CREATE INDEX IF NOT EXISTS idx_crm_cust_tenant ON crm_customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_cust_status ON crm_customers(status);

-- 2. CRM Contacts Table
CREATE TABLE IF NOT EXISTS crm_contacts (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  business_id VARCHAR(64),
  name VARCHAR(255) NOT NULL,
  designation VARCHAR(100) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(64),
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  preferred_language VARCHAR(50) DEFAULT 'English',
  notes TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_contact_tenant ON crm_contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_contact_customer ON crm_contacts(customer_id);

-- 3. CRM Leads Table
CREATE TABLE IF NOT EXISTS crm_leads (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES crm_customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255),
  source VARCHAR(64) NOT NULL DEFAULT 'Website',
  campaign VARCHAR(100),
  product_service VARCHAR(255) NOT NULL,
  estimated_value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  probability NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
  expected_close_date DATE NOT NULL,
  assigned_user VARCHAR(64),
  notes TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'NEW',
  lead_score INTEGER NOT NULL DEFAULT 50,
  priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
  reason_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_lead_tenant ON crm_leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_lead_status ON crm_leads(status);

-- 4. CRM Opportunities Table
CREATE TABLE IF NOT EXISTS crm_opportunities (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  value NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  probability NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
  stage VARCHAR(32) NOT NULL DEFAULT 'DISCOVERY',
  expected_close_date DATE NOT NULL,
  sales_owner VARCHAR(64),
  products_services TEXT[],
  competitors TEXT,
  next_action TEXT,
  notes TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_opp_tenant ON crm_opportunities(tenant_id);
CREATE INDEX IF NOT EXISTS idx_crm_opp_customer ON crm_opportunities(customer_id);

-- 5. CRM Sales Activities Table
CREATE TABLE IF NOT EXISTS crm_sales_activities (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  activity_type VARCHAR(32) NOT NULL DEFAULT 'Call',
  subject VARCHAR(255) NOT NULL,
  customer_id UUID REFERENCES crm_customers(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES crm_opportunities(id) ON DELETE SET NULL,
  assigned_user VARCHAR(64),
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_activity_tenant ON crm_sales_activities(tenant_id);

-- 6. CRM Quotations Table
CREATE TABLE IF NOT EXISTS crm_quotations (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  quote_number VARCHAR(64) NOT NULL,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES crm_opportunities(id) ON DELETE SET NULL,
  subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  validity_date DATE NOT NULL,
  terms_and_conditions TEXT,
  notes TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_crm_quote_num UNIQUE (tenant_id, quote_number)
);

CREATE INDEX IF NOT EXISTS idx_crm_quote_tenant ON crm_quotations(tenant_id);

-- 7. CRM Quotation Items Table
CREATE TABLE IF NOT EXISTS crm_quotation_items (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  quotation_id UUID NOT NULL REFERENCES crm_quotations(id) ON DELETE CASCADE,
  item_description VARCHAR(255) NOT NULL,
  material_id VARCHAR(64),
  quantity NUMERIC(12, 3) NOT NULL DEFAULT 1.000,
  unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  tax_percent NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
  total_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_qitem_tenant ON crm_quotation_items(tenant_id);

-- 8. CRM Customer Credit Table
CREATE TABLE IF NOT EXISTS crm_customer_credit (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  credit_limit NUMERIC(15, 2) NOT NULL DEFAULT 500000.00,
  credit_days INTEGER NOT NULL DEFAULT 30,
  outstanding_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  available_credit NUMERIC(15, 2) NOT NULL DEFAULT 500000.00,
  overdue_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  credit_status VARCHAR(32) NOT NULL DEFAULT 'GOOD',
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_crm_credit_customer UNIQUE (tenant_id, customer_id)
);

CREATE INDEX IF NOT EXISTS idx_crm_credit_tenant ON crm_customer_credit(tenant_id);

-- 9. CRM Customer Documents Table
CREATE TABLE IF NOT EXISTS crm_customer_documents (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  document_type VARCHAR(64) NOT NULL DEFAULT 'KYC',
  title VARCHAR(255) NOT NULL,
  storage_ref VARCHAR(512) NOT NULL,
  mime_type VARCHAR(128) NOT NULL DEFAULT 'application/pdf',
  size_bytes BIGINT NOT NULL DEFAULT 0,
  uploaded_by VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_doc_tenant ON crm_customer_documents(tenant_id);

-- 10. CRM Support Tickets Table
CREATE TABLE IF NOT EXISTS crm_support_tickets (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  ticket_number VARCHAR(64) NOT NULL,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(32) NOT NULL DEFAULT 'MEDIUM',
  category VARCHAR(64) NOT NULL DEFAULT 'GENERAL',
  assigned_user VARCHAR(64),
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_crm_ticket_num UNIQUE (tenant_id, ticket_number)
);

CREATE INDEX IF NOT EXISTS idx_crm_ticket_tenant ON crm_support_tickets(tenant_id);

-- 11. CRM Customer Segments & Members Table
CREATE TABLE IF NOT EXISTS crm_customer_segments (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria_json TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_crm_segment_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS crm_customer_segment_members (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  segment_id UUID NOT NULL REFERENCES crm_customer_segments(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_crm_segment_member UNIQUE (tenant_id, segment_id, customer_id)
);

-- 12. CRM Customer Health Table
CREATE TABLE IF NOT EXISTS crm_customer_health (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  health_score INTEGER NOT NULL DEFAULT 85,
  health_status VARCHAR(32) NOT NULL DEFAULT 'GOOD',
  risk_flags TEXT[],
  factors_json TEXT,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_crm_health_customer UNIQUE (tenant_id, customer_id)
);

-- 13. CRM Customer Notes Table
CREATE TABLE IF NOT EXISTS crm_customer_notes (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES crm_customers(id) ON DELETE CASCADE,
  author_user_id VARCHAR(64) NOT NULL,
  note_text TEXT NOT NULL,
  is_private BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ENABLE ROW-LEVEL SECURITY (RLS) FOR ALL CRM TABLES
ALTER TABLE crm_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_sales_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customer_credit ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customer_segment_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customer_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_customer_notes ENABLE ROW LEVEL SECURITY;

-- CREATE TENANT ISOLATION RLS POLICIES FOR ALL CRM TABLES
CREATE POLICY p_crm_customers_tenant ON crm_customers
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_contacts_tenant ON crm_contacts
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_leads_tenant ON crm_leads
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_opportunities_tenant ON crm_opportunities
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_sales_activities_tenant ON crm_sales_activities
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_quotations_tenant ON crm_quotations
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_quotation_items_tenant ON crm_quotation_items
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_customer_credit_tenant ON crm_customer_credit
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_customer_documents_tenant ON crm_customer_documents
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_support_tickets_tenant ON crm_support_tickets
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_customer_segments_tenant ON crm_customer_segments
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_customer_segment_members_tenant ON crm_customer_segment_members
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_customer_health_tenant ON crm_customer_health
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);

CREATE POLICY p_crm_customer_notes_tenant ON crm_customer_notes
  USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid);
