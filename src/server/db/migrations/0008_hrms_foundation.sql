-- RZ® Minetrix BOS - Migration 0008
-- HRMS foundation: employees, pay structures, attendance, leave, payroll (tenant RLS)

CREATE TABLE IF NOT EXISTS hrms_pay_structures (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  basic_salary NUMERIC(14, 2) NOT NULL,
  allowance_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  pf_percent NUMERIC(6, 2) NOT NULL DEFAULT 0,
  other_deduction_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  overtime_rate_per_hour NUMERIC(14, 2) NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hrms_pay_structures_tenant_code UNIQUE (tenant_id, code),
  CONSTRAINT chk_hrms_pay_structures_amounts CHECK (
    basic_salary >= 0 AND allowance_amount >= 0 AND pf_percent >= 0 AND pf_percent <= 100
    AND other_deduction_amount >= 0 AND overtime_rate_per_hour >= 0
  )
);

CREATE INDEX IF NOT EXISTS idx_hrms_pay_structures_tenant ON hrms_pay_structures(tenant_id);

CREATE TABLE IF NOT EXISTS hrms_employees (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  code VARCHAR(64) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(64),
  email VARCHAR(255),
  address VARCHAR(512),
  joining_date DATE NOT NULL,
  department VARCHAR(128) NOT NULL,
  designation VARCHAR(128) NOT NULL,
  employment_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  branch_id VARCHAR(128),
  pay_structure_id VARCHAR(128) REFERENCES hrms_pay_structures(id) ON DELETE SET NULL,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(64),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT uq_hrms_employees_tenant_code UNIQUE (tenant_id, code),
  CONSTRAINT chk_hrms_employees_status CHECK (employment_status IN ('ACTIVE', 'INACTIVE', 'ARCHIVED'))
);

CREATE INDEX IF NOT EXISTS idx_hrms_employees_tenant ON hrms_employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_status ON hrms_employees(tenant_id, employment_status);
CREATE INDEX IF NOT EXISTS idx_hrms_employees_dept ON hrms_employees(tenant_id, department);

CREATE TABLE IF NOT EXISTS hrms_attendance (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  employee_id VARCHAR(128) NOT NULL REFERENCES hrms_employees(id) ON DELETE RESTRICT,
  work_date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  status VARCHAR(32) NOT NULL,
  working_hours NUMERIC(8, 2) NOT NULL DEFAULT 0,
  overtime_hours NUMERIC(8, 2) NOT NULL DEFAULT 0,
  remarks VARCHAR(512),
  branch_id VARCHAR(128),
  leave_request_id VARCHAR(128),
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hrms_attendance_employee_date UNIQUE (tenant_id, employee_id, work_date),
  CONSTRAINT chk_hrms_attendance_status CHECK (status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'HOLIDAY', 'OFF')),
  CONSTRAINT chk_hrms_attendance_hours CHECK (working_hours >= 0 AND overtime_hours >= 0)
);

CREATE INDEX IF NOT EXISTS idx_hrms_attendance_tenant ON hrms_attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_attendance_employee ON hrms_attendance(tenant_id, employee_id);

CREATE TABLE IF NOT EXISTS hrms_leave_requests (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  employee_id VARCHAR(128) NOT NULL REFERENCES hrms_employees(id) ON DELETE RESTRICT,
  leave_type VARCHAR(32) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason VARCHAR(512),
  status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED',
  approved_by VARCHAR(128),
  approved_at TIMESTAMPTZ,
  rejected_by VARCHAR(128),
  rejected_at TIMESTAMPTZ,
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_hrms_leave_type CHECK (leave_type IN ('CL', 'SL', 'EL', 'LOP', 'MATERNITY', 'PATERNITY')),
  CONSTRAINT chk_hrms_leave_status CHECK (status IN ('REQUESTED', 'APPROVED', 'REJECTED', 'CANCELLED')),
  CONSTRAINT chk_hrms_leave_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_hrms_leave_tenant ON hrms_leave_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_leave_employee ON hrms_leave_requests(tenant_id, employee_id);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_hrms_attendance_leave') THEN
    ALTER TABLE hrms_attendance
      ADD CONSTRAINT fk_hrms_attendance_leave
      FOREIGN KEY (leave_request_id) REFERENCES hrms_leave_requests(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS hrms_payroll_runs (
  id VARCHAR(128) PRIMARY KEY,
  tenant_id VARCHAR(128) NOT NULL,
  employee_id VARCHAR(128) NOT NULL REFERENCES hrms_employees(id) ON DELETE RESTRICT,
  pay_structure_id VARCHAR(128) NOT NULL REFERENCES hrms_pay_structures(id) ON DELETE RESTRICT,
  period_year INTEGER NOT NULL,
  period_month INTEGER NOT NULL,
  present_days NUMERIC(6, 2) NOT NULL DEFAULT 0,
  leave_days NUMERIC(6, 2) NOT NULL DEFAULT 0,
  absent_days NUMERIC(6, 2) NOT NULL DEFAULT 0,
  payable_days NUMERIC(6, 2) NOT NULL DEFAULT 0,
  overtime_hours NUMERIC(8, 2) NOT NULL DEFAULT 0,
  basic_salary NUMERIC(14, 2) NOT NULL,
  allowances NUMERIC(14, 2) NOT NULL DEFAULT 0,
  overtime_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  deductions NUMERIC(14, 2) NOT NULL DEFAULT 0,
  gross_amount NUMERIC(14, 2) NOT NULL,
  net_amount NUMERIC(14, 2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'POSTED',
  created_by VARCHAR(128),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hrms_payroll_employee_period UNIQUE (tenant_id, employee_id, period_year, period_month),
  CONSTRAINT chk_hrms_payroll_month CHECK (period_month BETWEEN 1 AND 12),
  CONSTRAINT chk_hrms_payroll_year CHECK (period_year BETWEEN 2000 AND 2100),
  CONSTRAINT chk_hrms_payroll_status CHECK (status IN ('DRAFT', 'POSTED', 'CANCELLED')),
  CONSTRAINT chk_hrms_payroll_amounts CHECK (gross_amount >= 0 AND net_amount >= 0 AND deductions >= 0)
);

CREATE INDEX IF NOT EXISTS idx_hrms_payroll_tenant ON hrms_payroll_runs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hrms_payroll_employee ON hrms_payroll_runs(tenant_id, employee_id);

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'hrms_pay_structures',
    'hrms_employees',
    'hrms_attendance',
    'hrms_leave_requests',
    'hrms_payroll_runs'
  ]
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS tenant_isolation_%s ON %I', t, t);
    EXECUTE format(
      'CREATE POLICY tenant_isolation_%s ON %I FOR ALL USING (tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), '''')) WITH CHECK (tenant_id = NULLIF(current_setting(''app.current_tenant_id'', true), ''''))',
      t, t
    );
  END LOOP;
END $$;
