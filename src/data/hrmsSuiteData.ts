import { HrmsSuiteModule } from '../types/architecture';

export const WORKFORCE_CATEGORIES_DATA = [
  {
    category: 'Permanent Employees',
    description: 'Full-time monthly salaried staff with PF, ESI, gratuity, and paid leave benefits.',
    roles: ['Plant Managers', 'Senior Engineers', 'Finance Heads', 'Operations Directors'],
    compensationModel: 'Monthly Fixed Salary + Annual Bonus + Statutory Benefits',
    settlementCycle: 'Monthly (1st of every month)'
  },
  {
    category: 'Daily Wage Employees',
    description: 'Manual quarry site labor, stone dressers, yard loaders, and site helpers.',
    roles: ['Quarry Stone Dressers', 'Yard Loaders', 'Pit Helpers', 'Cleaner Boys'],
    compensationModel: 'Daily Base Rate + Piece-Rate Loading Charges (₹/ton)',
    settlementCycle: 'Weekly (Every Saturday Evening)'
  },
  {
    category: 'Weekly Wage Employees',
    description: 'Crusher plant operators, maintenance fitters, and yard assistants paid on weekly tally.',
    roles: ['Crusher Attendants', 'Screening Plant Helpers', 'Interlock Block Dressers'],
    compensationModel: 'Daily Wage x Days Worked + Overtime Hours',
    settlementCycle: 'Weekly (Every Saturday)'
  },
  {
    category: 'Monthly Salary Employees',
    description: 'Administrative, weighing scale operators, and office support team.',
    roles: ['Weighbridge Operators', 'Yard Cashiers', 'Billing Clerks', 'Storekeepers'],
    compensationModel: 'Monthly Fixed Basic + HRA + Conveyance Allowance',
    settlementCycle: 'Monthly (5th of every month)'
  },
  {
    category: 'Contract Employees',
    description: 'Third-party manpower supplied by labor contractors for peak excavation or construction.',
    roles: ['Blasting Helpers', 'Demolition Crews', 'Site Survey Assistants'],
    compensationModel: 'Contractor Invoice Base Rate per Shift / Project Lump-Sum',
    settlementCycle: 'Fortnightly / Contract Milestone'
  },
  {
    category: 'Commercial Drivers',
    description: 'Tipper drivers, transit mixer operators, and long-haul heavy lorry drivers.',
    roles: ['Tipper Drivers', 'Lorry Drivers', 'Transit Mixer Drivers'],
    compensationModel: 'Daily Base Bata + Per-Trip Distance Incentive + Fuel Saving Bonus',
    settlementCycle: 'Weekly Settlement (Trip Bata Paid Daily/Weekly)'
  },
  {
    category: 'Heavy Machine Operators',
    description: 'JCB excavator operators, rock breaker pilots, mobile crusher operators.',
    roles: ['Excavator Operators', 'Rock Breaker Pilots', 'Wheel Loader Operators'],
    compensationModel: 'Base Monthly Salary + Telematics Hour-Meter Incentive (₹/Engine Hr)',
    settlementCycle: 'Monthly Salary + Weekly Hour-Meter Incentive'
  },
  {
    category: 'Site Supervisors & Managers',
    description: 'Field supervisors enforcing safety, pit output targets, and attendance logging.',
    roles: ['Quarry Pit Supervisors', 'Fleet Dispatch Supervisors', 'Yard In-charges'],
    compensationModel: 'Monthly Salary + Pit Production Target Bonus + Zero-Accident Bonus',
    settlementCycle: 'Monthly'
  }
];

export const HRMS_SUITE_MODULES: HrmsSuiteModule[] = [
  {
    id: 'executive-hr-dashboard',
    number: 1,
    title: 'Executive HR & Workforce Command Center',
    icon: 'LayoutDashboard',
    category: 'Intelligence & Analytics',
    summary: 'Executive dashboard providing real-time visibility into total headcount, today\'s attendance across all quarry pits and yards, driver/operator availability, weekly wage liability, monthly salary due, and AI workforce insights.',
    subModules: [
      'Real-Time Enterprise Total Headcount & Shift Distribution Counter',
      'Today\'s Attendance Pulse (Present, Absent, Late, On-Leave Matrix)',
      'Site-Wise Active Workforce Heatmap (Quarries, Crushers, Yards, Fleet)',
      'Commercial Driver & Heavy Machine Operator Live Availability Gauge',
      'Weekly Wage Settlement Due Calculator (Daily Wage & Piece-Rate Labor)',
      'Monthly Payroll Liability & Statutory Tax Accrual Matrix',
      'Overtime & Excessive Shift Alert Bar',
      'Gemini AI Workforce Productivity & Attendance Anomaly Feed'
    ],
    keyCapabilities: [
      'Live attendance streaming from face-recognition biometric devices at remote quarry yards.',
      'Instant bottleneck detector: Flags if a quarry pit lacks excavator operators or drivers before shift start.',
      'Predictive weekly cash requirement forecast for yard cashbox wage payouts.'
    ],
    masterDataEntities: ['WorkforceAttendancePulse', 'HeadcountSummary', 'WeeklyWageAccrual', 'AIWorkforceInsight'],
    eventIntegrations: {
      publishes: ['hrms.dashboard.viewed', 'hrms.headcount.recalculated'],
      subscribes: ['hrms.attendance.punched', 'hrms.payroll.calculated']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Identity & Auth (Mod 1)'],
    aiFeatures: ['Real-time workforce shift shortage predictor & driver allocation optimizer']
  },
  {
    id: 'employee-masters',
    number: 2,
    title: 'Enterprise Employee Master & Lifecycle Management',
    icon: 'UserCheck',
    category: 'Workforce Core',
    summary: 'Centralized employee information repository managing personal details, department, designation, employment type, skill matrix, statutory documents (Aadhaar, PAN, DL), emergency contacts, and status history.',
    subModules: [
      '360-Degree Employee Master Record Configurator',
      'Department, Designation & Skill Matrix Hierarchy Manager',
      'Employment Type Classifier (Permanent, Daily Wage, Contract, Driver, Operator)',
      'Digital Document Locker (Aadhaar, PAN, Driving License, Heavy Operator Permit)',
      'Emergency Contact, Blood Group & Medical Fitness Certification Vault',
      'Work Experience, Academic & Technical Qualification Tracker',
      'Employee Status Lifecycle Manager (Active, On-Leave, Suspended, Resigned, Retired)'
    ],
    keyCapabilities: [
      'Automatic driving license expiry tracking for commercial tipper drivers with automated renewal alerts.',
      'Aadhaar e-KYC integration ensuring zero ghost/duplicate workers across remote quarry yards.',
      'Multi-branch transfer history tracking employee movements between quarry locations.'
    ],
    masterDataEntities: ['EmployeeMaster', 'EmployeeDocumentVault', 'EmployeeSkillMatrix', 'EmploymentStatusHistory'],
    eventIntegrations: {
      publishes: ['hrms.employee.created', 'hrms.employee.updated', 'hrms.employee.status_changed'],
      subscribes: ['core.tenant.provisioned']
    },
    sharedCoreDependencies: ['Shared Master Data Management (Mod 5)', 'Document Management System (Mod 7)']
  },
  {
    id: 'workforce-categories',
    number: 3,
    title: 'Multi-Category Workforce Classification Engine',
    icon: 'Users',
    category: 'Workforce Core',
    summary: 'Configurable workforce categorizer tailoring attendance rules, wage structures, incentive formulas, and shift mandates across 12 distinct employee categories ranging from stone dressers to executive managers.',
    subModules: [
      '12-Tier Workforce Category Policy Configurator',
      'Quarry Site Labor & Piece-Rate Stone Dresser Rules Engine',
      'Commercial Driver & Tipper Operator Wage Matrix Configurator',
      'Heavy Equipment Machine Operator Hour-Meter Rate Engine',
      'Crusher Plant Shift & Safety Gear Adherence Policy Manager',
      'Contractor Labor Gang & Supervisor Allocation Desk',
      'Category-Specific Statutory PF/ESI/TDS Benefit Matrix'
    ],
    keyCapabilities: [
      'Differentiated rules: Monthly salaried managers get paid leave; daily wage loaders get piece-rate loading charges.',
      'Flexible gang management: Grouping contract workers under specific labor contractors for batch billing.',
      'Automatic category migration upon skill upgrading (e.g., Cleaner to Tipper Driver).'
    ],
    masterDataEntities: ['WorkforceCategoryPolicy', 'GangMaster', 'CategoryWageRule'],
    eventIntegrations: {
      publishes: ['hrms.category.updated', 'hrms.gang.assigned'],
      subscribes: ['hrms.employee.created']
    },
    sharedCoreDependencies: ['RBAC Engine (Mod 2)', 'Shared Master Data Management (Mod 5)']
  },
  {
    id: 'attendance-management',
    number: 4,
    title: 'Multi-Modal Attendance & Biometric Capture Engine',
    icon: 'Fingerprint',
    category: 'Attendance & Shifts',
    summary: 'Hybrid attendance capturing framework supporting IoT biometric devices, mobile face-recognition, geofenced GPS punches, site supervisor batch marking, shift attendance logging, and overtime authorization.',
    subModules: [
      'IoT Biometric Device Ingestion Engine (Face Recognition & Fingerprint)',
      'Mobile App Geofenced GPS Attendance Punch with Selfie Verification',
      'Site Supervisor Batch Attendance Marking Desk for Quarry Labor Gangs',
      'Shift In/Out, Lunch Break & Overtime (OT) Hour Tracking Engine',
      'Night Shift Allowance & Extended Shift Duration Manager',
      'Attendance Regularization & Missed Punch Correction Workflow',
      'Lop (Loss of Pay) & Late Arrival Penalty Calculator'
    ],
    keyCapabilities: [
      'Offline-first mobile punch capability for deep pit quarry locations with zero cellular coverage.',
      'Geofence verification ensuring drivers punch attendance only within assigned vehicle yards or quarries.',
      'Automated integration with weighbridge tickets to verify physical presence of loading labor.'
    ],
    masterDataEntities: ['AttendancePunchLog', 'AttendanceRegularizationRequest', 'BiometricDeviceMaster'],
    eventIntegrations: {
      publishes: ['hrms.attendance.punched', 'hrms.attendance.regularized'],
      subscribes: ['fleet.vehicle.assigned', 'mining.pit.assigned']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'shift-management',
    number: 5,
    title: 'Dynamic Shift Scheduling & Rotation Engine',
    icon: 'Clock',
    category: 'Attendance & Shifts',
    summary: 'Enterprise shift planning engine managing multi-shift quarry operations, 24/7 crusher plant shifts, night shifts, driver haulage rotation, weekly off schedules, and automated operator machine handovers.',
    subModules: [
      'Master Shift Configurator (Day, Evening, Night, Split Shifts)',
      'Quarry Pit & Crusher Plant Shift Roster Builder',
      'Driver Haulage & Tipper Shift Rotation Matrix',
      'Heavy Equipment Machine Operator Handover Shift Scheduler',
      'Automated Shift Rotation Rules (Weekly/Fortnightly Night Shift Swap)',
      'Overtime Shift Authorization & Relief Operator Finder',
      'Holiday & Weekly Off Duty Roster Synchronizer'
    ],
    keyCapabilities: [
      'Machine Handover Safeguard: Ensures Machine Operator A signs off on hour-meter readings before Operator B starts shift.',
      'Fatigue Prevention Engine: Automatically blocks scheduling drivers for consecutive night trips beyond safety limits.',
      'Automated WhatsApp shift schedule broadcast to site supervisors every evening.'
    ],
    masterDataEntities: ['ShiftMaster', 'ShiftRosterSchedule', 'ShiftHandoverLog'],
    eventIntegrations: {
      publishes: ['hrms.shift.assigned', 'hrms.shift.swapped'],
      subscribes: ['mining.production.scheduled']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'RBAC Engine (Mod 2)']
  },
  {
    id: 'payroll-engine',
    number: 6,
    title: 'Multi-Structure Enterprise Payroll Engine',
    icon: 'Calculator',
    category: 'Payroll & Settlements',
    summary: 'Comprehensive payroll calculation engine computing monthly salaries, weekly wages, daily wages, overtime, loading charges, trip incentives, and statutory deductions (PF, ESI, Professional Tax, TDS).',
    subModules: [
      'Monthly Salary Processing Engine (Basic, HRA, DA, Special Allowance)',
      'Daily & Weekly Wage Computation Engine based on Attendance Logs',
      'Piece-Rate Loading Charge Calculator (₹ per ton loaded/dressed)',
      'Commercial Driver Trip Incentive & Mileage Allowance Calculator',
      'Heavy Machine Operator Telematics Hour-Meter Incentive Engine',
      'Overtime (OT) Rate Calculator (Double Rate / Standard Rate)',
      'Statutory Deductions Engine (EPF 12%, ESI 0.75%, PT, Income Tax TDS)',
      'Payslip PDF Generator & WhatsApp/Email Distribution Engine'
    ],
    keyCapabilities: [
      'Multi-currency / multi-structure calculation executing 10,000+ worker payrolls in under 5 seconds.',
      'Deep integration with weighbridge telemetry: Loading charges calculated directly from verified weighment receipts.',
      'Automated bank salary transfer file generation (HDFC, SBI, Federal Bank) for direct bank credit.'
    ],
    masterDataEntities: ['PayrollRunHeader', 'EmployeePayslipRecord', 'StatutoryTaxDeductionLog'],
    eventIntegrations: {
      publishes: ['hrms.payroll.calculated', 'hrms.payslip.generated'],
      subscribes: ['hrms.attendance.closed', 'mining.dispatch.completed']
    },
    sharedCoreDependencies: ['Finance Shared Bridge (Mod 8)', 'Document Management System (Mod 7)']
  },
  {
    id: 'advances-loans',
    number: 7,
    title: 'Employee Advances, Driver Bata & Loan Management',
    icon: 'Coins',
    category: 'Incentives & Advances',
    summary: 'Financial assistance management suite handling emergency staff advances, daily driver trip bata advances, equipment operator float, long-term employee loans, and automated payroll recovery schedules.',
    subModules: [
      'Emergency Employee Cash Advance Request & Approval Workflow',
      'Driver Daily Trip Bata Advance Issuance Desk (UPI / Yard Cash)',
      'Quarry Site Labor Yard Float & Weekly Advance Tracker',
      'Long-Term Employee Loan Configurator (Interest-Free / Interest-Bearing)',
      'Automated Monthly / Weekly Payroll Salary Recovery Schedule Engine',
      'Outstanding Advance Balance & Maximum Eligible Advance Enforcer',
      'Loan Prepayment, Waiver & Emergency Settlement Desk'
    ],
    keyCapabilities: [
      'Advance Cap Enforcement: Prevents issuing advances exceeding 50% of the employee\'s earned wages for the month.',
      'Instant UPI payout to driver wallets for fuel/bata while on long-distance interstate haulage trips.',
      'Automatic deduction from weekly wage settlements with clear itemized ledger visibility.'
    ],
    masterDataEntities: ['AdvanceRequestRecord', 'EmployeeLoanMaster', 'LoanRecoverySchedule'],
    eventIntegrations: {
      publishes: ['hrms.advance.issued', 'hrms.loan.recovered'],
      subscribes: ['fin.cash.transferred', 'fin.payout.released']
    },
    sharedCoreDependencies: ['Finance Shared Bridge (Mod 8)', 'Accounts Payable (Mod 6)']
  },
  {
    id: 'incentives-deductions',
    number: 8,
    title: 'Performance Incentives, Fuel Savings & Deductions Engine',
    icon: 'TrendingUp',
    category: 'Incentives & Advances',
    summary: 'Dynamic bonus and penalty framework rewarding production milestones, fuel savings, zero accidents, and attendance punctuality, while enforcing disciplinary fines, damage recoveries, and salary deductions.',
    subModules: [
      'Quarry Pit Production Milestone Target Incentive Calculator',
      'Commercial Fleet Fuel Efficiency & Mileage Bonus Engine',
      'Commercial Driver Zero-Accident & Timely Delivery Incentive Desk',
      'Full Attendance & Perfect Punctuality Monthly Bonus Manager',
      'Vehicle Damage, Tyre Misuse & Machinery Negligence Recovery Fine Desk',
      'Unexcused Absence & Safety Equipment Violation Penalty Engine',
      'Disciplinary Salary Deduction & Approval Escrow Desk'
    ],
    keyCapabilities: [
      'IoT Fuel Bonus Algorithm: Compares actual trip fuel consumption against standard baseline to credit 50% savings to driver.',
      'Transparent penalty workflow requiring supervisor photo proof before applying machine damage fines.',
      'Real-time incentive tally visible on Employee Self-Service Mobile App.'
    ],
    masterDataEntities: ['IncentiveRecord', 'PenaltyFineRecord', 'FuelEfficiencyRewardLog'],
    eventIntegrations: {
      publishes: ['hrms.incentive.calculated', 'hrms.penalty.applied'],
      subscribes: ['fleet.fuel.dispensed', 'mining.production.logged']
    },
    sharedCoreDependencies: ['Fleet & Logistics Suite (Phase 5)', 'Mining Operations Suite (Phase 4)']
  },
  {
    id: 'weekly-settlement',
    number: 9,
    title: 'Quarry Site & Fleet Weekly Wage Settlement Engine',
    icon: 'Receipt',
    category: 'Payroll & Settlements',
    summary: 'Specialized weekly payout execution engine tallying 6-day attendance, piece-rate loading charges, trip bata, advance recoveries, and net cash/UPI settlements for quarry labor gangs and tipper drivers every Saturday.',
    subModules: [
      'Weekly Attendance & Shift Tally Sheet Aggregator',
      'Quarry Stone Loading Charge Tally (Weighbridge Tonnage x Rate/Ton)',
      'Commercial Tipper Driver Weekly Trip Incentive & Bata Reconciliation',
      'Weekly Advance & Yard Cash Float Deductions Adjuster',
      'Net Weekly Wage Settlement Approval & Verification Workflow',
      'Yard Cash Payout & Direct UPI Batch Transfer Execution Engine',
      'Weekly Wage Receipt Slip Generator & Thumbprint/Signature Log'
    ],
    keyCapabilities: [
      'Saturday Evening Cashbox Balance Match: Ensures physical cash handed out at quarry yards matches exact net settlement total.',
      'Instant UPI payout option directly transferring weekly earnings to worker bank accounts.',
      'One-click finance journal posting debiting Wage Expense and crediting Cash/Bank.'
    ],
    masterDataEntities: ['WeeklySettlementBatch', 'WorkerWeeklySlip', 'YardCashPayoutLog'],
    eventIntegrations: {
      publishes: ['hrms.weekly_settlement.approved', 'hrms.weekly_payout.released'],
      subscribes: ['hrms.attendance.punched', 'mining.dispatch.completed']
    },
    sharedCoreDependencies: ['Finance Shared Bridge (Mod 8)', 'Cash & Bank Engine (Mod 4)']
  },
  {
    id: 'leave-management',
    number: 10,
    title: 'Leave Policy, Entitlement & Approval Engine',
    icon: 'Calendar',
    category: 'Talent & ESS',
    summary: 'Comprehensive leave management module handling casual leave, sick leave, earned leave, statutory maternity/paternity leave, loss of pay (LOP), leave encashment, and automated holiday calendar management.',
    subModules: [
      'Multi-Tier Leave Policy Configurator (Permanent vs Daily Wage Rules)',
      'Annual Leave Entitlement, Credit & Carry-Forward Engine',
      'Mobile Leave Application & Multi-Level Supervisor Approval Workflow',
      'Regional Statutory Holiday Calendar Manager (Kerala, Karnataka, TN)',
      'Compensatory Off (Comp-Off) Grant for Festival / Sunday Shifts',
      'Leave Encashment Calculation Desk upon Year-End or Resignation',
      'Loss of Pay (LOP) Automated Ingestion into Payroll Calculation'
    ],
    keyCapabilities: [
      'Auto-reliever prompt: Requests staff to nominate an acting supervisor before approving leave.',
      'Real-time leave balance deduction upon approval with instant WhatsApp status update.',
      'Integration with shift planner preventing scheduling employees on approved leave.'
    ],
    masterDataEntities: ['LeavePolicyMaster', 'LeaveBalanceRecord', 'LeaveApplicationRequest', 'HolidayCalendar'],
    eventIntegrations: {
      publishes: ['hrms.leave.approved', 'hrms.leave.rejected'],
      subscribes: ['hrms.shift.assigned']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'RBAC Engine (Mod 2)']
  },
  {
    id: 'performance-management',
    number: 11,
    title: 'Workforce KPI & Productivity Appraisal Engine',
    icon: 'Award',
    category: 'Intelligence & Analytics',
    summary: 'Quantitative performance appraisal suite evaluating quarry stone output, excavator machine productivity, driver fuel efficiency, safety adherence, attendance punctuality, and supervisor leadership ratings.',
    subModules: [
      'Role-Specific Key Performance Indicator (KPI) Template Builder',
      'Quarry Pit Excavator & Breaker Operator Tons-Per-Hour Productivity Metric',
      'Commercial Tipper Driver On-Time Delivery & Mileage Scorecard',
      'Site Supervisor Safety, Environmental Cess & Target Output Rating',
      'Annual 360-Degree Performance Review & Appraisal Workflow',
      'Performance-Linked Increment & Annual Bonus Allocator',
      'Underperformance Identification & Corrective Action Plan (CAP) Desk'
    ],
    keyCapabilities: [
      'Telematics-Driven Appraisal: Operator scorecards built from actual machine telematics data rather than subjective opinions.',
      'Automated leaderboard highlighting top-performing drivers and machine operators across branches.',
      'Direct linkage to annual salary increment and career progression workflows.'
    ],
    masterDataEntities: ['PerformanceKPIConfig', 'OperatorProductivityScorecard', 'EmployeeAppraisalRecord'],
    eventIntegrations: {
      publishes: ['hrms.appraisal.completed', 'hrms.kpi.evaluated'],
      subscribes: ['mining.production.logged', 'fleet.trip.completed']
    },
    sharedCoreDependencies: ['Executive Dashboard Engine (Mod 10)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'recruitment',
    number: 12,
    title: 'Recruitment, Candidate Tracking & Onboarding Engine',
    icon: 'UserPlus',
    category: 'Talent & ESS',
    summary: 'End-to-end talent acquisition platform managing vacancy requisitions, candidate registration, heavy equipment operator driving tests, interview rounds, background checks, offer letters, and digital onboarding.',
    subModules: [
      'Manpower Vacancy Requisition & Budgeted Headcount Checker',
      'Candidate Sourcing & Applicant Tracking System (ATS)',
      'Commercial Driver & Heavy Operator Practical Driving Test Scorecard',
      'Background Verification & Previous Employer Reference Desk',
      'Offer Letter Generator with Automated CTC Breakdown',
      'Pre-Employment Medical Fitness & Drug Test Tracker',
      'Digital Onboarding & Employee Master Auto-Creation Pipeline'
    ],
    keyCapabilities: [
      'Practical Field Test Verification: Evaluates excavator operators on actual quarry rock breaking before making job offer.',
      'One-click candidate conversion into active Employee Master upon joining sign-off.',
      'Automated WhatsApp candidate engagement sending interview directions and document checklists.'
    ],
    masterDataEntities: ['JobRequisitionMaster', 'CandidateProfile', 'OperatorTestScorecard', 'OfferLetterRecord'],
    eventIntegrations: {
      publishes: ['hrms.candidate.hired', 'hrms.requisition.opened'],
      subscribes: ['hrms.employee.status_changed']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Omni-Channel Notification Router (Mod 6)']
  },
  {
    id: 'training',
    number: 13,
    title: 'Safety Training, Skill Development & Certification Vault',
    icon: 'GraduationCap',
    category: 'Talent & ESS',
    summary: 'Occupational safety and skill development framework managing Directorate General of Mines Safety (DGMS) mandatory training, heavy machine safety certification, defensive driving courses, and skill matrix upgrades.',
    subModules: [
      'DGMS Quarry Vocational Training & Mandatory Safety Course Planner',
      'Commercial Fleet Defensive Driving & Fuel Conservation Workshop Manager',
      'First Aid, Blasting Safety & Emergency Evacuation Drill Tracker',
      'Employee Skill Certification Vault & Expiry Renewal Alert System',
      'Skill Matrix Matrix Competency Assessment & Level Upgrade Engine',
      'Training Attendance Logging via Biometric / QR Code Scan'
    ],
    keyCapabilities: [
      'Compliance Blocker: Automatically revokes quarry pit entry access if an operator\'s DGMS safety refresher training expires.',
      'Skill Upgrade Tracking: Tracks progress from Junior Machine Operator to Master Rock Breaker Pilot.',
      'Digital training completion certificate generation stored in employee document locker.'
    ],
    masterDataEntities: ['TrainingProgramMaster', 'SafetyCertificationRecord', 'SkillMatrixCompetency'],
    eventIntegrations: {
      publishes: ['hrms.training.completed', 'hrms.certification.issued'],
      subscribes: ['hrms.employee.created']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'employee-self-service',
    number: 14,
    title: 'Employee Self-Service (ESS) & Supervisor Mobile Portal',
    icon: 'Smartphone',
    category: 'Talent & ESS',
    summary: 'Multilingual mobile application for workers, drivers, and site supervisors providing digital payslip downloads, daily trip bata status, attendance history, leave requests, advance tracking, and safety alerts.',
    subModules: [
      'Multilingual Mobile App Interface (Malayalam, English, Tamil, Hindi, Kannada)',
      'Digital Payslip & Weekly Wage Settlement Slip Download Center',
      'Live Attendance Calendar & Shift Roster Viewer',
      'One-Tap Mobile Leave Request & Advance Request Submission',
      'Driver Daily Trip Incentive, Fuel Bonus & Bata E-Ledger',
      'Quarry Site Safety Incident Reporting & Hazard Alert Desk',
      'Company Announcements, Holiday List & Push Notification Center'
    ],
    keyCapabilities: [
      'Voice-guided Malayalam UI for quarry site workers with low digital literacy.',
      'Instant downloading of Form 16 tax statements and salary certificates for bank loans.',
      'Supervisor mode allowing yard in-charges to approve leave requests directly from smartphone.'
    ],
    masterDataEntities: ['ESSUserProfile', 'MobileNotificationLog', 'WorkerFeedbackTicket'],
    eventIntegrations: {
      publishes: ['hrms.ess.request_submitted', 'hrms.hazard.reported'],
      subscribes: ['hrms.payslip.generated', 'hrms.leave.approved']
    },
    sharedCoreDependencies: ['Omni-Channel Notification Router (Mod 6)', 'Identity & Auth (Mod 1)']
  },
  {
    id: 'reports',
    number: 15,
    title: 'Statutory HR, Payroll & Workforce Analytics Suite',
    icon: 'FileText',
    category: 'Intelligence & Analytics',
    summary: 'Reporting module generating statutory EPF/ESI returns, Form 12BA, Muster Roll, Weekly Settlement Statements, Driver Mileage Reports, Attendance Variance Reports, and Cost-Center Labor Expense Statements.',
    subModules: [
      'Statutory Form B Muster Roll & Attendance Register Exporter',
      'EPF Electronic Challan-cum-Return (ECR) File Compiler',
      'ESI Monthly Contribution Return File Generator',
      'Weekly Wage Settlement Master Report by Quarry / Yard Branch',
      'Commercial Driver Trip Incentive, Mileage & Bata Summary Report',
      'Cost Center Labor Expense vs Budget Variance Report',
      'Employee Turnover, Attrition Rate & Exit Analysis Report'
    ],
    keyCapabilities: [
      '1-Click ECR Text File Export for direct uploading to EPFO Portal without formatting errors.',
      'Schedule III audit-ready labor expense statements for corporate financial audits.',
      'Automated daily email dispatch of Muster Roll reports to Quarry Safety Officers.'
    ],
    masterDataEntities: ['HRReportConfig', 'StatutoryExportPackage', 'LaborCostAnalysisRecord'],
    eventIntegrations: {
      publishes: ['hrms.report.generated', 'hrms.statutory_file.exported'],
      subscribes: ['hrms.payroll.calculated', 'hrms.weekly_settlement.approved']
    },
    sharedCoreDependencies: ['Document Management System (Mod 7)', 'Audit & Telemetry (Mod 14)']
  },
  {
    id: 'ai-features',
    number: 16,
    title: 'Workforce Intelligence & Gemini AI Copilot Suite',
    icon: 'Sparkles',
    category: 'Intelligence & Analytics',
    summary: 'AI copilot engine powered by server-side Gemini models predicting worker absenteeism, estimating quarry labor attrition risk, optimizing driver shift allocations, validating payroll anomalies, and suggesting smart shifts.',
    subModules: [
      'Gemini AI Worker Absenteeism & Shift Shortage Predictor',
      'Commercial Driver & Machine Operator Attrition Risk Detector',
      'AI Smart Shift Allocation Engine matching operator skills with machine telemetry',
      'Automated Payroll & Weekly Wage Anomaly & Fraud Guardrail',
      'Natural Language HR Assistant ("Show all tipper drivers present at Kannur Yard today")',
      'Quarry Labor Productivity & Tonnage Output Optimization Suggestions'
    ],
    keyCapabilities: [
      'Server-side Gemini execution via `/api/ai/hrms/*` ensuring employee personal data remains encrypted.',
      'Payroll Fraud Guardrail: Flags suspicious overtime punches or duplicate loading charges before payout sign-off.',
      'Predictive absenteeism warning giving supervisors 12 hours advance notice to arrange standby operators.'
    ],
    masterDataEntities: ['AIWorkforcePredictor', 'PayrollFraudFlag', 'ShiftOptimizationRecommendation'],
    eventIntegrations: {
      publishes: ['hrms.ai.insight_generated', 'hrms.ai.fraud_flagged'],
      subscribes: ['hrms.attendance.punched', 'hrms.payroll.calculated']
    },
    sharedCoreDependencies: ['Gemini AI Ecosystem (Mod 12)', 'Executive Dashboard Engine (Mod 10)'],
    aiFeatures: ['Gemini Absenteeism Predictor', 'Payroll Fraud & Anomaly Detector', 'Smart Driver Shift Allocator']
  }
];

export const SPECIALIZED_WORKFLOWS = [
  {
    title: 'Standard Employee Lifecycle Workflow',
    steps: [
      'Recruitment Requisition & Candidate Sourcing',
      'Practical Assessment / Interview Sign-Off',
      'Employee Master Creation & Aadhaar Document Locker Upload',
      'Shift Allocation & Biometric / GPS Attendance Punching',
      'Monthly Payroll / Weekly Wage Calculation',
      'Advance & Loan Recovery Adjustment',
      'Automated Finance GL Posting (Debit Wage Expense / Credit Payable)',
      'Direct Bank / Cash Settlement Payout',
      'KPI Performance Review & Skill Matrix Upgrade'
    ]
  },
  {
    title: 'Commercial Driver Trip & Incentive Workflow',
    steps: [
      'Driver Assigned to Tipper / Heavy Vehicle',
      'Vehicle Gate Pass & Fuel Dispenser Ingestion',
      'Trip Completion Verified via e-POD Sign-Off',
      'Per-Km Distance Incentive & Fuel Savings Bonus Calculated',
      'Daily Bata Advance Issued via Wallet / Cash',
      'Weekly Saturday Reconciliation & Net Settlement Approval',
      'Direct UPI / Cash Release & Finance Ledger Credit'
    ]
  },
  {
    title: 'Heavy Machine Operator Productivity Workflow',
    steps: [
      'Operator Assigned to Excavator / Rock Breaker',
      'Pre-Shift Machine Hour-Meter Reading Sign-In',
      'Operational Running Time Recorded via IoT Telematics',
      'Quarry Pit Production Tonnage Mapped to Operator ID',
      'Base Salary + Telematics Running Hour Bonus Calculated',
      'Monthly Payroll Ingestion & Performance Rating Updated'
    ]
  },
  {
    title: 'Quarry Labor Weekly Wage & Loading Charge Workflow',
    steps: [
      'Daily Biometric / Supervisor Batch Attendance Punch',
      'Yard Weighbridge Tonnage Ticket Mapped to Loading Gang ID',
      'Piece-Rate Loading Charges (₹/ton) Accrued Daily',
      'Weekly Saturday Attendance & Loading Charge Tally',
      'Yard Cash Float / Emergency Advance Adjustment',
      'Net Weekly Cash / UPI Settlement Approval & Slip Issue',
      'Quarry Yard Cashbox Reconciliation & Finance JV Posting'
    ]
  }
];

export const HRMS_INTEGRATION_TOPOLOGY = [
  {
    suite: 'Shared Core Platform (Mod 1-15)',
    interaction: 'Tenant security isolation, 4-tier RLS, Aadhaar/PAN document vault, WhatsApp notification router, and Gemini AI Gateway.',
    protocol: 'Internal gRPC / Shared Module Service Calls'
  },
  {
    suite: 'Mining Operations Suite (Phase 4)',
    interaction: 'Quarry pit attendance streaming, excavator machine hour-meter sync, and weighbridge loading charge accruals.',
    protocol: 'Event Topics (`mining.pit_attendance.logged`, `mining.dispatch.completed`)'
  },
  {
    suite: 'Fleet & Logistics Suite (Phase 5)',
    interaction: 'Driver vehicle assignments, trip e-POD delivery verification, fuel efficiency telemetry, and mileage incentive calculations.',
    protocol: 'Event Topics (`fleet.trip.completed`, `fleet.fuel.dispensed`)'
  },
  {
    suite: 'Building Materials Suite (Phase 6)',
    interaction: 'Stockyard labor attendance, precast paver piece-rate production tally, and yard cashier shift handovers.',
    protocol: 'Event Topics (`materials.yard_shift.closed`, `materials.production.tallied`)'
  },
  {
    suite: 'CRM & Business Suite (Phase 7)',
    interaction: 'Site engineering staff allocation for contracting projects, customer site supervisor attendance, and project labor costing.',
    protocol: 'REST API Proxy & Events (`crm.project_staff.assigned`)'
  },
  {
    suite: 'Marketplace Suite (Phase 8)',
    interaction: 'Gig driver / independent operator verification, escrow payout settlements, and service provider background checks.',
    protocol: 'Event Topics (`marketplace.provider.verified`)'
  },
  {
    suite: 'General Ledger Finance Engine (Phase 9)',
    interaction: 'Automated payroll journal vouchers, weekly wage expense debits, cashbox advance credits, and TDS tax deductions.',
    protocol: 'Direct Event Bus (`hrms.payroll.calculated` → `fin.journal.posted`)'
  },
  {
    suite: 'External Statutory & Banking APIs',
    interaction: 'EPFO portal ECR text file submission, ESIC portal upload, and RazorpayX / Bank API batch salary payouts.',
    protocol: 'External Secure HTTPS REST API / Webhooks'
  }
];

export const HRMS_FOLDER_STRUCTURE = [
  'src/modules/hrms/',
  '├── controllers/',
  '│   ├── executive-hr.controller.ts',
  '│   ├── employee-master.controller.ts',
  '│   ├── workforce-category.controller.ts',
  '│   ├── attendance.controller.ts',
  '│   ├── shift-roster.controller.ts',
  '│   ├── payroll.controller.ts',
  '│   ├── advances-loans.controller.ts',
  '│   ├── incentives-deductions.controller.ts',
  '│   ├── weekly-settlement.controller.ts',
  '│   ├── leave.controller.ts',
  '│   ├── performance-kpi.controller.ts',
  '│   ├── recruitment.controller.ts',
  '│   ├── safety-training.controller.ts',
  '│   ├── employee-ess.controller.ts',
  '│   ├── hr-reports.controller.ts',
  '│   └── hrms-ai.controller.ts',
  '├── services/',
  '│   ├── payroll-calculator.service.ts',
  '│   ├── biometric-ingestion.service.ts',
  '│   ├── weekly-settlement-engine.service.ts',
  '│   ├── statutory-compliance.service.ts',
  '│   ├── telematics-incentive.service.ts',
  '│   └── hrms-ai-copilot.service.ts',
  '├── models/',
  '│   ├── employee.model.ts',
  '│   ├── attendance-log.model.ts',
  '│   ├── payslip.model.ts',
  '│   ├── advance-loan.model.ts',
  '│   └── shift-schedule.model.ts',
  '├── events/',
  '│   ├── hrms-events.publisher.ts',
  '│   └── hrms-events.subscriber.ts',
  '└── interfaces/',
  '    ├── employee.interface.ts',
  '    └── payroll-run.interface.ts'
];

export const HRMS_SECURITY_AND_SCALABILITY = {
  security: [
    'Biometric & Aadhaar Verification: Strict identity checks preventing ghost workers or proxy punches across remote quarry pits.',
    '4-Tier Row Level Security (RLS) Isolation: Site supervisors can only view attendance for their assigned quarry pit or vehicle fleet.',
    'Maker-Checker Payroll Approval: Payroll runs above ₹1,00,000 require dual approval (HR Manager + CFO) before bank transfer dispatch.'
  ],
  audit: [
    'Immutable Attendance Punch Audit Log: Every biometric, GPS, or manual punch records original timestamp, device ID, geofence coordinates, and supervisor ID.',
    'Encrypted Document Locker: Aadhaar, PAN, and Bank Account details stored with AES-256 encryption with restricted access logs.',
    'Payroll Revision Trail: Every salary adjustment or penalty fine records justifying notes and approval timestamps.'
  ],
  scalability: [
    'Sharded Attendance Log Tables: Partitioned by month and tenant branch to support millions of daily biometric punches.',
    'Asynchronous Parallel Payroll Computation: Worker payslips calculated concurrently in background worker threads.',
    'Redis Cached Shift Rosters: Active shift schedules cached in memory for sub-10ms attendance validation.'
  ]
};

export const PHASE11_TRANSITION_REVIEW = {
  title: 'Phase 10 HRMS Architecture Review & Phase 11 Transition Plan',
  validatedCapabilities: [
    'Unified Workforce Engine: Single platform managing permanent staff, daily wage quarry workers, drivers, machine operators, and contract labor.',
    'Automated Weekly Saturday Settlements: Seamless tally of 6-day attendance, weighbridge loading charges, and cashbox advances.',
    'Telematics-Linked Incentives: Operator bonuses calculated directly from machine running hour-meters and fuel telemetry.',
    'Direct Finance Engine Synchronization: Instant GL posting of salary expenses, TDS tax liabilities, and cashbox wage payouts.',
    'Gemini AI HR Copilot: Server-side AI intelligence predicting shift shortages, detecting payroll fraud, and matching driver skills.'
  ],
  identifiedImprovementsForPhase11: [
    'Autonomous Multi-Entity Resource Balancer: Global AI agent dynamically shifting drivers and tippers between Mining and Building Material divisions during demand peaks.',
    'Predictive Equipment Wear-to-Labor Optimization: Correlating machine operator driving smoothness with equipment breakdown frequencies.',
    'Cross-Suite Mobile Offline Synchronization: P2P mesh sync for remote quarry devices operating in zero-connectivity mountain valleys.'
  ],
  status: 'APPROVED — READY FOR PHASE 11 (AUTONOMOUS MULTI-ENTITY RESOURCE OPTIMIZATION, AI MESH & GLOBAL EXPANSION)'
};
