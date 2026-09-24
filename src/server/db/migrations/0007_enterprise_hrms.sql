-- RZ® Minetrix BOS - Enterprise HRMS, Workforce & Payroll Management Migration 0007
-- PostgreSQL Drizzle Schema & Row-Level Security (RLS) Initializer

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. HR Departments Table
CREATE TABLE IF NOT EXISTS hr_departments (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  head_employee_id UUID,
  description TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_dept_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_hr_dept_tenant ON hr_departments(tenant_id);

-- 2. HR Designations Table
CREATE TABLE IF NOT EXISTS hr_designations (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  department_id UUID REFERENCES hr_departments(id) ON DELETE SET NULL,
  grade_level VARCHAR(64),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_desig_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_hr_desig_tenant ON hr_designations(tenant_id);

-- 3. HR Employees Master Table
CREATE TABLE IF NOT EXISTS hr_employees (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_code VARCHAR(64) NOT NULL,
  first_name VARCHAR(128) NOT NULL,
  middle_name VARCHAR(128),
  last_name VARCHAR(128) NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  gender VARCHAR(32) NOT NULL,
  date_of_birth DATE NOT NULL,
  phone VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  joining_date DATE NOT NULL,
  employment_type VARCHAR(64) NOT NULL, -- FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERN, CONSULTANT
  employment_status VARCHAR(64) NOT NULL, -- ACTIVE, ON_LEAVE, SUSPENDED, RESIGNED, TERMINATED, RETIRED
  department_id UUID NOT NULL REFERENCES hr_departments(id) ON DELETE RESTRICT,
  designation_id UUID NOT NULL REFERENCES hr_designations(id) ON DELETE RESTRICT,
  manager_id UUID REFERENCES hr_employees(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES core_branches(id) ON DELETE SET NULL,
  business_unit_id UUID REFERENCES core_business_units(id) ON DELETE SET NULL,
  work_location VARCHAR(255) NOT NULL DEFAULT 'Main Headquarters',
  bank_account_masked VARCHAR(64),
  emergency_contact VARCHAR(255),
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_emp_code UNIQUE (tenant_id, employee_code)
);

CREATE INDEX IF NOT EXISTS idx_hr_emp_tenant ON hr_employees(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hr_emp_dept ON hr_employees(department_id);
CREATE INDEX IF NOT EXISTS idx_hr_emp_email ON hr_employees(email);

-- 4. HR Employee User Link Table
CREATE TABLE IF NOT EXISTS hr_employee_users (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES core_users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_emp_user UNIQUE (tenant_id, employee_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_hr_emp_user_tenant ON hr_employee_users(tenant_id);

-- 5. HR Employee Assignments Table
CREATE TABLE IF NOT EXISTS hr_employee_assignments (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES hr_departments(id) ON DELETE CASCADE,
  designation_id UUID NOT NULL REFERENCES hr_designations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES core_branches(id) ON DELETE SET NULL,
  business_unit_id UUID REFERENCES core_business_units(id) ON DELETE SET NULL,
  effective_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 6. HR Shifts Table
CREATE TABLE IF NOT EXISTS hr_shifts (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  shift_code VARCHAR(64) NOT NULL,
  shift_name VARCHAR(128) NOT NULL,
  start_time VARCHAR(10) NOT NULL, -- "09:00"
  end_time VARCHAR(10) NOT NULL,   -- "17:00"
  grace_minutes INTEGER NOT NULL DEFAULT 15,
  break_minutes INTEGER NOT NULL DEFAULT 60,
  overtime_after_minutes INTEGER NOT NULL DEFAULT 480,
  shift_type VARCHAR(32) NOT NULL DEFAULT 'DAY', -- DAY, NIGHT, GENERAL, CUSTOM
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_shift_code UNIQUE (tenant_id, shift_code)
);

-- 7. HR Employee Shift Assignments
CREATE TABLE IF NOT EXISTS hr_employee_shifts (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  shift_id UUID NOT NULL REFERENCES hr_shifts(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 8. HR Attendance Table
CREATE TABLE IF NOT EXISTS hr_attendance (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIMESTAMP WITH TIME ZONE,
  check_out TIMESTAMP WITH TIME ZONE,
  break_minutes INTEGER NOT NULL DEFAULT 0,
  working_minutes INTEGER NOT NULL DEFAULT 0,
  overtime_minutes INTEGER NOT NULL DEFAULT 0,
  late_minutes INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'PRESENT',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_att_emp_date UNIQUE (tenant_id, employee_id, date)
);

CREATE INDEX IF NOT EXISTS idx_hr_att_tenant ON hr_attendance(tenant_id);
CREATE INDEX IF NOT EXISTS idx_hr_att_emp ON hr_attendance(employee_id);

-- 9. HR Attendance Corrections Table
CREATE TABLE IF NOT EXISTS hr_attendance_corrections (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  attendance_id UUID REFERENCES hr_attendance(id) ON DELETE SET NULL,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  requested_check_in TIMESTAMP WITH TIME ZONE NOT NULL,
  requested_check_out TIMESTAMP WITH TIME ZONE NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  approved_by UUID REFERENCES core_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 10. HR Leave Types Table
CREATE TABLE IF NOT EXISTS hr_leave_types (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  code VARCHAR(64) NOT NULL,
  name VARCHAR(128) NOT NULL,
  days_allowed INTEGER NOT NULL DEFAULT 12,
  is_paid BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_leave_code UNIQUE (tenant_id, code)
);

-- 11. HR Leave Policies
CREATE TABLE IF NOT EXISTS hr_leave_policies (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES hr_leave_types(id) ON DELETE CASCADE,
  policy_name VARCHAR(128) NOT NULL,
  carry_forward_max INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 12. HR Leave Balances
CREATE TABLE IF NOT EXISTS hr_leave_balances (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES hr_leave_types(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  total_allocated NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  used NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  pending NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  remaining NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_leave_bal UNIQUE (tenant_id, employee_id, leave_type_id, year)
);

-- 13. HR Leave Applications
CREATE TABLE IF NOT EXISTS hr_leave_applications (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES hr_leave_types(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days NUMERIC(10,2) NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED
  approved_by UUID REFERENCES core_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_hr_leave_app_emp ON hr_leave_applications(employee_id);

-- 14. HR Holidays Table
CREATE TABLE IF NOT EXISTS hr_holidays (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  branch_id UUID REFERENCES core_branches(id) ON DELETE SET NULL,
  business_unit_id UUID REFERENCES core_business_units(id) ON DELETE SET NULL,
  holiday_type VARCHAR(32) NOT NULL DEFAULT 'NATIONAL',
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 15. HR Overtime Table
CREATE TABLE IF NOT EXISTS hr_overtime (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  attendance_id UUID REFERENCES hr_attendance(id) ON DELETE SET NULL,
  claimed_minutes INTEGER NOT NULL DEFAULT 0,
  approved_minutes INTEGER NOT NULL DEFAULT 0,
  rate NUMERIC(12,2) NOT NULL DEFAULT 1.5,
  amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  approval_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  approved_by UUID REFERENCES core_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 16. HR Salary Structure Table
CREATE TABLE IF NOT EXISTS hr_salary_structures (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  effective_date DATE NOT NULL,
  base_salary NUMERIC(15,2) NOT NULL,
  pay_frequency VARCHAR(32) NOT NULL DEFAULT 'MONTHLY',
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 17. HR Salary Components Table
CREATE TABLE IF NOT EXISTS hr_salary_components (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  salary_structure_id UUID NOT NULL REFERENCES hr_salary_structures(id) ON DELETE CASCADE,
  component_name VARCHAR(128) NOT NULL,
  component_type VARCHAR(32) NOT NULL, -- EARNING, DEDUCTION
  amount NUMERIC(15,2) NOT NULL,
  is_percentage BOOLEAN NOT NULL DEFAULT FALSE,
  percentage_of VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 18. HR Payroll Years & Periods
CREATE TABLE IF NOT EXISTS hr_payroll_years (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  year_code VARCHAR(32) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_pyr_code UNIQUE (tenant_id, year_code)
);

CREATE TABLE IF NOT EXISTS hr_payroll_periods (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  year_id UUID NOT NULL REFERENCES hr_payroll_years(id) ON DELETE CASCADE,
  period_name VARCHAR(100) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN', -- OPEN, PROCESSING, APPROVED, LOCKED, CLOSED
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 19. HR Payroll Runs Table
CREATE TABLE IF NOT EXISTS hr_payroll_runs (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  period_id UUID NOT NULL REFERENCES hr_payroll_periods(id) ON DELETE CASCADE,
  run_number VARCHAR(64) NOT NULL,
  run_date DATE NOT NULL,
  total_employees INTEGER NOT NULL DEFAULT 0,
  total_gross NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  total_deductions NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  total_net NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT', -- DRAFT, CALCULATING, REVIEW, APPROVED, PROCESSED, LOCKED, CANCELLED
  processed_by UUID REFERENCES core_users(id) ON DELETE SET NULL,
  journal_id UUID REFERENCES finance_journals(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_hr_pr_num UNIQUE (tenant_id, run_number)
);

-- 20. HR Payroll Items Table
CREATE TABLE IF NOT EXISTS hr_payroll_items (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  payroll_run_id UUID NOT NULL REFERENCES hr_payroll_runs(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  basic_earnings NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  hra NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  allowances NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  overtime_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  bonus_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  gross_earnings NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  advance_deduction NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  loan_deduction NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  unpaid_leave_deduction NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  other_deductions NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  total_deductions NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  net_salary NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 21. HR Payslips Table
CREATE TABLE IF NOT EXISTS hr_payslips (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  payroll_run_id UUID NOT NULL REFERENCES hr_payroll_runs(id) ON DELETE CASCADE,
  payroll_item_id UUID NOT NULL REFERENCES hr_payroll_items(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  employee_code VARCHAR(64) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  designation_name VARCHAR(255) NOT NULL,
  period_name VARCHAR(100) NOT NULL,
  gross_salary NUMERIC(15,2) NOT NULL,
  total_deductions NUMERIC(15,2) NOT NULL,
  net_salary NUMERIC(15,2) NOT NULL,
  earnings_json JSONB NOT NULL DEFAULT '{}',
  deductions_json JSONB NOT NULL DEFAULT '{}',
  status VARCHAR(32) NOT NULL DEFAULT 'GENERATED',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 22. HR Salary Advances Table
CREATE TABLE IF NOT EXISTS hr_salary_advances (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  amount NUMERIC(15,2) NOT NULL,
  reason TEXT NOT NULL,
  monthly_recovery_amount NUMERIC(15,2) NOT NULL,
  recovered_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  remaining_balance NUMERIC(15,2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, APPROVED, DISBURSED, PARTIALLY_RECOVERED, RECOVERED, REJECTED
  approved_by UUID REFERENCES core_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 23. HR Employee Loans Table
CREATE TABLE IF NOT EXISTS hr_employee_loans (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  loan_amount NUMERIC(15,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  installments INTEGER NOT NULL DEFAULT 12,
  start_date DATE NOT NULL,
  monthly_deduction NUMERIC(15,2) NOT NULL,
  recovered_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  remaining_balance NUMERIC(15,2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'REQUESTED', -- REQUESTED, APPROVED, ACTIVE, COMPLETED, CANCELLED
  approved_by UUID REFERENCES core_users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 24. HR Loan Installments Table
CREATE TABLE IF NOT EXISTS hr_loan_installments (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  loan_id UUID NOT NULL REFERENCES hr_employee_loans(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  installment_number INTEGER NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 25. HR Reimbursements Table
CREATE TABLE IF NOT EXISTS hr_reimbursements (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  category VARCHAR(64) NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  expense_date DATE NOT NULL,
  description TEXT NOT NULL,
  receipt_reference TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED', -- DRAFT, SUBMITTED, APPROVED, REJECTED, PAID
  approved_by UUID REFERENCES core_users(id) ON DELETE SET NULL,
  finance_journal_id UUID REFERENCES finance_journals(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 26. HR Employee Documents Table
CREATE TABLE IF NOT EXISTS hr_employee_documents (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  document_type VARCHAR(64) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  file_reference TEXT NOT NULL,
  expiry_date DATE,
  status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 27. HR Performance Cycles Table
CREATE TABLE IF NOT EXISTS hr_performance_cycles (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  cycle_name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 28. HR Employee Goals Table
CREATE TABLE IF NOT EXISTS hr_employee_goals (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES hr_performance_cycles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  goal_title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  weightage NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  target_value NUMERIC(15,2) NOT NULL DEFAULT 100.00,
  achieved_value NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'NOT_STARTED',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 29. HR Employee Reviews Table
CREATE TABLE IF NOT EXISTS hr_employee_reviews (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  cycle_id UUID NOT NULL REFERENCES hr_performance_cycles(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  reviewer_user_id UUID NOT NULL REFERENCES core_users(id) ON DELETE CASCADE,
  self_rating NUMERIC(3,2),
  manager_rating NUMERIC(3,2),
  final_rating NUMERIC(3,2),
  feedback TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 30. HR Recruitment Entities
CREATE TABLE IF NOT EXISTS hr_job_requisitions (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  department_id UUID NOT NULL REFERENCES hr_departments(id) ON DELETE CASCADE,
  designation_id UUID NOT NULL REFERENCES hr_designations(id) ON DELETE CASCADE,
  openings INTEGER NOT NULL DEFAULT 1,
  status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_candidates (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  first_name VARCHAR(128) NOT NULL,
  last_name VARCHAR(128) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NOT NULL,
  resume_reference TEXT,
  status VARCHAR(32) NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_applications (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  job_requisition_id UUID NOT NULL REFERENCES hr_job_requisitions(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES hr_candidates(id) ON DELETE CASCADE,
  status VARCHAR(32) NOT NULL DEFAULT 'APPLIED',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_interviews (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES hr_applications(id) ON DELETE CASCADE,
  interviewer_user_id UUID NOT NULL REFERENCES core_users(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  feedback TEXT,
  rating NUMERIC(3,2),
  status VARCHAR(32) NOT NULL DEFAULT 'SCHEDULED',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_offers (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  application_id UUID NOT NULL REFERENCES hr_applications(id) ON DELETE CASCADE,
  offered_salary NUMERIC(15,2) NOT NULL,
  joining_date DATE NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'OFFERED',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 31. HR Onboarding & Offboarding & Final Settlement
CREATE TABLE IF NOT EXISTS hr_onboarding (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_offboarding (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  resignation_date DATE NOT NULL,
  notice_period_days INTEGER NOT NULL DEFAULT 30,
  last_working_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_final_settlements (
  id UUID PRIMARY KEY DEFAULT generate_uuid_v7(),
  tenant_id UUID NOT NULL REFERENCES core_tenants(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES hr_employees(id) ON DELETE CASCADE,
  pending_salary NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  leave_settlement NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  advance_recovery NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  loan_recovery NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  reimbursements NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  other_deductions NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  net_payable NUMERIC(15,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE hr_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employee_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employee_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employee_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_attendance_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_leave_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_overtime ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payroll_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payroll_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_salary_advances ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employee_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_loan_installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_reimbursements ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_performance_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employee_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_employee_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_job_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_offboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr_final_settlements ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation RLS Policies
CREATE POLICY hr_dept_rls ON hr_departments FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_desig_rls ON hr_designations FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_emp_rls ON hr_employees FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_emp_usr_rls ON hr_employee_users FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_emp_assign_rls ON hr_employee_assignments FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_shift_rls ON hr_shifts FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_emp_shift_rls ON hr_employee_shifts FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_att_rls ON hr_attendance FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_att_corr_rls ON hr_attendance_corrections FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_leave_type_rls ON hr_leave_types FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_leave_pol_rls ON hr_leave_policies FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_leave_bal_rls ON hr_leave_balances FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_leave_app_rls ON hr_leave_applications FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_holidays_rls ON hr_holidays FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_overtime_rls ON hr_overtime FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_sal_struct_rls ON hr_salary_structures FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_sal_comp_rls ON hr_salary_components FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_pyr_year_rls ON hr_payroll_years FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_pyr_per_rls ON hr_payroll_periods FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_pyr_run_rls ON hr_payroll_runs FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_pyr_item_rls ON hr_payroll_items FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_payslip_rls ON hr_payslips FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_advance_rls ON hr_salary_advances FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_loan_rls ON hr_employee_loans FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_loan_inst_rls ON hr_loan_installments FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_reimb_rls ON hr_reimbursements FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_doc_rls ON hr_employee_documents FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_perf_cyc_rls ON hr_performance_cycles FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_goal_rls ON hr_employee_goals FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_review_rls ON hr_employee_reviews FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_req_rls ON hr_job_requisitions FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_cand_rls ON hr_candidates FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_app_rls ON hr_applications FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_interview_rls ON hr_interviews FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_offer_rls ON hr_offers FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_onboard_rls ON hr_onboarding FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_offboard_rls ON hr_offboarding FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
CREATE POLICY hr_settle_rls ON hr_final_settlements FOR ALL USING (tenant_id::text = current_setting('app.current_tenant_id', true));
