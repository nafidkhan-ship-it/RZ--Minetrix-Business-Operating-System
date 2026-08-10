// RZ® Minetrix BOS Phase 23 - Enterprise HRMS, Workforce, Payroll & Intelligence Platform

export interface OrgNodeRecord {
  id: string;
  name: string;
  code: string;
  type: 'Company' | 'Branch' | 'Business Unit' | 'Department' | 'Designation';
  parentName?: string;
  headPerson: string;
  employeeCount: number;
  location: string;
}

export interface EmployeeMasterRecord {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  businessUnit: string;
  workforceType: 'Monthly Salary' | 'Weekly Wage' | 'Daily Wage' | 'Contract Worker' | 'Driver' | 'Operator';
  photoUrl: string;
  aadhaarNumberMasked: string;
  panNumberMasked: string;
  bankAccountMasked: string;
  ifscCode: string;
  phone: string;
  email: string;
  joiningDate: string;
  status: 'Active' | 'On Leave' | 'Probation' | 'Notice Period';
  kycStatus: 'Verified' | 'Pending Verification';
}

export interface RecruitmentRecord {
  id: string;
  jobCode: string;
  title: string;
  department: string;
  openings: number;
  applicantsCount: number;
  shortlistedCount: number;
  offeredCount: number;
  status: 'Open' | 'Interviewing' | 'Closed';
  targetJoiningDate: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  workforceType: string;
  date: string;
  shift: 'Morning Shift (06:00 - 14:00)' | 'General Shift (09:00 - 17:30)' | 'Night Pit Shift (22:00 - 06:00)';
  checkInTime: string;
  checkOutTime: string;
  verificationMethod: 'GPS Geofence + Face Rec' | 'Biometric Thumb' | 'QR Code Scanner' | 'Supervisor Manual Override';
  status: 'Present - On Time' | 'Late Entry' | 'Overtime' | 'Absent';
  locationCoordinates: string;
}

export interface LeaveRequestRecord {
  id: string;
  leaveCode: string;
  employeeName: string;
  leaveType: 'Privilege Leave' | 'Sick Leave' | 'Casual Leave' | 'Compensatory Off' | 'Maternity / Paternity';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  approvalStatus: 'Approved' | 'Pending Manager Sign-off' | 'Rejected';
  leaveBalanceRemaining: number;
}

export interface PayrollRecord {
  id: string;
  paySlipNumber: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  payType: 'Monthly Salary' | 'Weekly Saturday Settlement' | 'Daily Shift Payout';
  basePayRs: number;
  overtimePayRs: number;
  tripIncentivesRs: number;
  loadingChargesRs: number;
  attendanceBonusRs: number;
  advanceDeductionsRs: number;
  statutoryDeductionsRs: number; // PF, ESI, TDS
  netPayoutRs: number;
  paymentStatus: 'Processed & Disbursed' | 'Pending Approval' | 'Hold';
}

export interface ContractorWorkforceRecord {
  id: string;
  contractorCode: string;
  contractorName: string;
  workOrderNumber: string;
  assignedSite: 'Bhilwara Pit #1 Quarry' | 'Rajsamand Crusher Yard' | 'Highway NH-79 Earthwork';
  activeLabourCount: number;
  dailyBillingRatePerHeadRs: number;
  weeklySettlementDueRs: number;
  complianceStatus: 'Labour Law Compliant' | 'Pending PF Challan';
}

export interface DriverOperatorRecord {
  id: string;
  staffCode: string;
  fullName: string;
  role: 'Heavy Dumper Driver' | 'Excavator Operator' | 'Crusher Operator' | 'Transit Mixer Driver';
  licenseNumber: string;
  badgeNumber: string;
  licenseValidityDate: string;
  medicalFitnessStatus: 'Class-A Fit' | 'Pending Eye Test';
  monthlyCompletedTrips: number;
  machineEfficiencyScore: number; // 0-100
  safetyIncidentHistory: number;
}

export interface PerformanceKpiRecord {
  id: string;
  employeeName: string;
  role: string;
  kpiTitle: string;
  targetMetric: string;
  achievedMetric: string;
  performanceRating: 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement';
  lastAppraisalDate: string;
  aiProductivityScore: number;
}

export interface SafetyTrainingRecord {
  id: string;
  courseCode: string;
  topic: 'Pit Blasting Safety' | 'Heavy Equipment Roll-over Training' | 'Dust & Silicosis PPE Usage' | 'First Aid & Fire Response';
  trainerName: string;
  completedEmployeesCount: number;
  certificationValidityDays: number;
  nextScheduledSession: string;
  status: 'Completed' | 'Upcoming Mandatory';
}

export interface HealthSafetyRecord {
  id: string;
  incidentCode: string;
  siteLocation: string;
  incidentType: 'Near Miss' | 'Equipment Scrape' | 'First Aid Injury' | 'Environmental Dust Spike';
  severity: 'Low / Minor' | 'Medium' | 'Critical';
  incidentDate: string;
  investigationStatus: 'Resolved & Corrected' | 'Under Safety Committee Review';
  actionTaken: string;
}

export interface EssTicketRecord {
  id: string;
  ticketNumber: string;
  employeeName: string;
  category: 'Salary Query' | 'Document Request' | 'Expense Reimbursement' | 'Profile Update';
  subject: string;
  submissionDate: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

export interface MssApprovalRecord {
  id: string;
  approvalCode: string;
  requestType: 'Overtime Signoff' | 'Emergency Advance Approval' | 'Leave Concession' | 'Shift Swap';
  requestedBy: string;
  requestDetails: string;
  amountOrHours: string;
  status: 'Pending Manager Action' | 'Approved' | 'Escalated to HR';
}

export interface AIHRPlatformRecord {
  id: string;
  insightType: 'Attrition Risk Alert' | 'Shift Productivity Optimizer' | 'Overtime Fatigue Shield' | 'Salary Anomaly Detection';
  severity: 'Action Recommended' | 'Optimization Opportunity' | 'High Attrition Danger';
  findingSummary: string;
  aiSuggestedAction: string;
  confidencePercent: number;
}

export interface WorkforceAnalyticsMetrics {
  totalActiveWorkforce: number;
  monthlySalaryCount: number;
  weeklyWageCount: number;
  dailyWageCount: number;
  contractWorkersCount: number;
  driversOperatorsCount: number;
  averageAttendancePercent: number;
  totalMonthlyPayrollDisbursedRs: number;
  activeSafetyIncidents: number;
  attritionRatePercent: number;
}

export interface EcosystemHrIntegration {
  id: string;
  connectedDomain: string;
  integrationBridgeName: string;
  dataFlowFrequency: string;
  status: 'Active Real-Time Sync' | 'Standby';
}

// MODULE 28: WORKFORCE MARKETPLACE
export interface WorkforceMarketplaceCandidate {
  id: string;
  candidateCode: string;
  fullName: string;
  primaryRole: 'Volvo Dumper Driver' | 'Excavator Operator' | 'Blasting Supervisor' | 'Civil Engineer' | 'Crusher Operator' | 'Helper / Labourer' | 'Safety Officer';
  category: 'Driver' | 'Operator' | 'Quarry Worker' | 'Crusher Worker' | 'Engineer' | 'Supervisor' | 'Safety' | 'Helper' | 'Contract Labour';
  experienceYears: number;
  currentLocation: string;
  preferredLocations: string[];
  skills: string[];
  certifications: string[];
  dailyRateRs: number;
  availabilityStatus: 'Immediate (Available Today)' | 'Available in 3 Days' | 'Engaged on Project';
  aiMatchScore: number; // 0-100
  phone: string;
  rating: number;
}

// MODULE 29: DIGITAL RECRUITMENT PLATFORM
export interface DigitalRecruitmentApplicant {
  id: string;
  applicantCode: string;
  appliedPosition: string;
  applicantName: string;
  parsedExperienceYears: number;
  aiResumeScore: number;
  videoInterviewStatus: 'Completed & AI Rated' | 'Scheduled for Today' | 'Pending Video Link';
  bgVerificationStatus: 'Clear & Verified' | 'Verification in Progress' | 'Not Initiated';
  digitalOfferStatus: 'Offer Accepted' | 'Offer Sent' | 'Under Salary Negotiation';
  joiningDate: string;
}

// MODULE 30: WORKFORCE PLANNING
export interface WorkforcePlanningRecord {
  id: string;
  unitOrProjectName: string;
  domainCategory: 'Quarry Pit' | 'Crusher Plant' | 'Heavy Fleet' | 'Highway Construction' | 'HQ Corporate';
  currentHeadcount: number;
  requiredHeadcount: number;
  headcountGap: number;
  shiftCapacityPercent: number;
  ai30DayForecastDemand: number;
  recommendedAction: string;
}

// MODULE 31: COMPETENCY & SKILL MATRIX
export interface CompetencySkillRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  machineAuthorizationList: string[];
  licenseExpiryDate: string;
  skillGapIdentified: string;
  aiRecommendedCourse: string;
  competencyRating: 'Level 4 - Expert / Instructor' | 'Level 3 - Fully Proficient' | 'Level 2 - Supervised' | 'Level 1 - Trainee';
}

// MODULE 32: TRAINING & LEARNING
export interface TrainingCourseRecord {
  id: string;
  courseId: string;
  title: string;
  category: 'Safety & DGMS Compliance' | 'Heavy Equipment Operation' | 'Crusher Maintenance' | 'First Aid & Health';
  format: 'Interactive Online LMS' | 'On-Site Practical Ground Training' | 'Simulated VR Machine Driving';
  durationHours: number;
  enrolledCount: number;
  completionRatePercent: number;
  nextRenewalAlertDate: string;
}

// MODULE 33: SUCCESSION PLANNING
export interface SuccessionPlanRecord {
  id: string;
  criticalPositionTitle: string;
  currentIncumbent: string;
  department: string;
  readinessLevel: 'Emergency Backup Ready' | 'Ready in 6 Months' | 'Developing Talent Pool';
  designatedSuccessors: Array<{
    name: string;
    currentRole: string;
    readinessScore: number;
  }>;
  retentionRiskLevel: 'Low Risk' | 'Medium Risk' | 'High Retention Priority';
}

// MODULE 34: EMPLOYEE ENGAGEMENT
export interface EmployeeEngagementSurvey {
  id: string;
  title: string;
  type: 'Company Broadcast Notice' | 'Monthly Pulse Survey' | 'Safety Suggestion Box' | 'Peer Excellence Award';
  participantCount: number;
  engagementScorePercent: number;
  topFeedbackSummary: string;
  publishedDate: string;
}

// MODULE 35: TIME & PRODUCTIVITY
export interface TimeProductivityJobCard {
  id: string;
  jobCardNumber: string;
  assignedStaffName: string;
  machineUnitId: string;
  taskAllocation: string;
  allocatedHours: number;
  actualMachineHours: number;
  idleHours: number;
  productivityScore: number;
  aiEfficiencyNote: string;
}

// MODULE 36: SAFETY & COMPLIANCE
export interface SafetyComplianceRecord {
  id: string;
  recordCode: string;
  location: string;
  ppeIssuedCount: number;
  permitToWorkType: 'Hot Work - Blasting Area' | 'Height Work - Crusher Tower' | 'Confined Space - Silo Maintenance';
  permitStatus: 'Active & Verified' | 'Expired & Closed';
  toolboxMeetingTopic: string;
  complianceScorePercent: number;
}

// MODULE 37: DIGITAL DOCUMENT CENTER
export interface DigitalDocumentRecord {
  id: string;
  documentId: string;
  employeeName: string;
  documentType: 'Heavy Driving License' | 'Medical Fitness Certificate' | 'Aadhaar / PAN Card' | 'Employment Agreement';
  expiryDate: string;
  daysToExpiry: number;
  ocrVerificationStatus: 'OCR Validated' | 'Pending Verification';
  digitalSignatureStatus: 'Digitally Signed with Timestamp' | 'Pending Employee Sign';
}

// MODULE 38: EXPENSE & REIMBURSEMENT
export interface ExpenseClaimRecord {
  id: string;
  claimNumber: string;
  employeeName: string;
  expenseCategory: 'Outstation Travel' | 'Site Fuel Top-up' | 'Food Allowance' | 'Mobile & Data';
  claimAmountRs: number;
  submissionDate: string;
  approvalStatus: 'Approved & Settled via Payroll' | 'Pending Finance Audit' | 'Under Manager Review';
}

// MODULE 39: AI HR COMMAND CENTER
export interface AIHRCommandInsight {
  id: string;
  moduleSource: 'AI Workforce Planner' | 'AI Attrition Engine' | 'AI Shift Optimizer' | 'AI Promotion Copilot';
  executiveAlert: string;
  impactScope: string;
  aiRecommendation: string;
  confidenceScore: number;
  actionStatus: 'Pending Executive Action' | 'Applied Automations';
}

// MODULE 41: EXECUTIVE HR COMMAND CENTER
export interface ExecutiveHRDashboardMetrics {
  liveOnsiteWorkforce: number;
  activeShiftsRunning: number;
  driverCoveragePercent: number;
  operatorCoveragePercent: number;
  weeklyWageBillProjectedRs: number;
  monthlySalaryBillProjectedRs: number;
  aiWorkforceHealthIndex: number; // 0-100
  criticalSafetyIncidentsThisMonth: number;
}

// MODULE 42: MOBILE WORKFORCE APP STATUS
export interface MobileAppInstanceStatus {
  appName: 'Employee Self Service App' | 'Driver Companion App' | 'Operator Heavy App' | 'Site Supervisor App' | 'Manager Command App';
  activeInstallsCount: number;
  offlineSyncQueueCount: number;
  gpsCheckInRatePercent: number;
  faceRecMatchRatePercent: number;
  appVersion: string;
}

// MODULE 44: WORKFORCE DIGITAL TWIN
export interface WorkforceDigitalTwinNode {
  id: string;
  siteName: string;
  coordinates: string;
  assignedWorkersCount: number;
  livePresentCount: number;
  activeMachineryCount: number;
  capacityUtilizationPercent: number;
  riskFactor: 'Optimal Green' | 'Shift Shortage Alert' | 'High Overtime Fatigue';
}

// MODULE 45: FUTURE READY CAPABILITIES
export interface FutureReadyCapability {
  capabilityName: string;
  technologyCategory: 'Biometric & Face Rec' | 'AI & Voice HR' | 'IoT & Wearables' | 'Digital Wallet & Rewards';
  deploymentStatus: 'Fully Integrated & Active' | 'Pilot Field Testing' | 'Hardware Ready';
  description: string;
}

// MOCK DATASETS

export const MOCK_ORG_STRUCTURE: OrgNodeRecord[] = [
  { id: 'org-1', name: 'RZ Minetrix Group HQ', code: 'GRP-HQ', type: 'Company', headPerson: 'CEO Vikramaditya Singh', employeeCount: 1450, location: 'Jaipur Group HQ' },
  { id: 'org-2', name: 'Bhilwara Mining Division', code: 'BU-BHIL-MINE', type: 'Business Unit', parentName: 'RZ Minetrix Group HQ', headPerson: 'VP Operations Rajesh Sharma', employeeCount: 620, location: 'Bhilwara Pit' },
  { id: 'org-3', name: 'Rajsamand Crusher & Materials Unit', code: 'BU-RAJ-CRUSH', type: 'Business Unit', parentName: 'RZ Minetrix Group HQ', headPerson: 'Plant Head Sanjay Gupta', employeeCount: 380, location: 'Rajsamand Industrial Area' },
  { id: 'org-4', name: 'Heavy Logistics & Fleet Division', code: 'BU-FLEET-LOG', type: 'Business Unit', parentName: 'RZ Minetrix Group HQ', headPerson: 'Fleet Director Mahendra Verma', employeeCount: 450, location: 'Chittorgarh Logistics Yard' }
];

export const MOCK_EMPLOYEE_MASTER: EmployeeMasterRecord[] = [
  {
    id: 'emp-101',
    employeeId: 'EMP-BHIL-001',
    fullName: 'Ramesh Kumar Choudhary',
    designation: 'Senior Excavator Operator',
    department: 'Heavy Machinery Operations',
    businessUnit: 'Bhilwara Mining Division',
    workforceType: 'Operator',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    aadhaarNumberMasked: 'XXXX-XXXX-8912',
    panNumberMasked: 'ABCDE****F',
    bankAccountMasked: 'SB-0091823****',
    ifscCode: 'SBIN0001234',
    phone: '+91 98290 12345',
    email: 'ramesh.choudhary@rzminetrix.com',
    joiningDate: '2021-04-15',
    status: 'Active',
    kycStatus: 'Verified'
  },
  {
    id: 'emp-102',
    employeeId: 'EMP-FLEET-042',
    fullName: 'Sukhwinder Singh',
    designation: '12-Wheeler Tipper Driver',
    department: 'Haulage & Transport',
    businessUnit: 'Heavy Logistics & Fleet Division',
    workforceType: 'Driver',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    aadhaarNumberMasked: 'XXXX-XXXX-4510',
    panNumberMasked: 'PQRSW****K',
    bankAccountMasked: 'HDFC-881923****',
    ifscCode: 'HDFC0000451',
    phone: '+91 94140 67890',
    email: 'sukhwinder.singh@rzminetrix.com',
    joiningDate: '2022-08-10',
    status: 'Active',
    kycStatus: 'Verified'
  },
  {
    id: 'emp-103',
    employeeId: 'EMP-CRUSH-112',
    fullName: 'Ganesh Lal Meena',
    designation: 'Conveyor Maintenance Supervisor',
    department: 'Crusher Maintenance',
    businessUnit: 'Rajsamand Crusher & Materials Unit',
    workforceType: 'Monthly Salary',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    aadhaarNumberMasked: 'XXXX-XXXX-6612',
    panNumberMasked: 'LMNOP****R',
    bankAccountMasked: 'ICICI-001298****',
    ifscCode: 'ICIC0000123',
    phone: '+91 97831 44556',
    email: 'ganesh.meena@rzminetrix.com',
    joiningDate: '2020-01-20',
    status: 'Active',
    kycStatus: 'Verified'
  }
];

export const MOCK_RECRUITMENT: RecruitmentRecord[] = [
  { id: 'rec-1', jobCode: 'JOB-2026-DMP', title: 'Heavy Volvo Dumper Drivers (10 Positions)', department: 'Fleet Division', openings: 10, applicantsCount: 38, shortlistedCount: 14, offeredCount: 8, status: 'Interviewing', targetJoiningDate: '2026-08-15' },
  { id: 'rec-2', jobCode: 'JOB-2026-MINENG', title: 'Senior Mining Safety Engineer', department: 'Mining Operations', openings: 2, applicantsCount: 19, shortlistedCount: 5, offeredCount: 2, status: 'Open', targetJoiningDate: '2026-09-01' }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', employeeId: 'EMP-BHIL-001', employeeName: 'Ramesh Kumar Choudhary', workforceType: 'Operator', date: '2026-08-07', shift: 'Morning Shift (06:00 - 14:00)', checkInTime: '05:52 AM', checkOutTime: '14:05 PM', verificationMethod: 'GPS Geofence + Face Rec', status: 'Present - On Time', locationCoordinates: '25.3478° N, 74.6358° E (Pit #1)' },
  { id: 'att-2', employeeId: 'EMP-FLEET-042', employeeName: 'Sukhwinder Singh', workforceType: 'Driver', date: '2026-08-07', shift: 'Morning Shift (06:00 - 14:00)', checkInTime: '06:10 AM', checkOutTime: '15:30 PM', verificationMethod: 'QR Code Scanner', status: 'Overtime', locationCoordinates: 'Chittorgarh Dispatch Gate' }
];

export const MOCK_LEAVE_REQUESTS: LeaveRequestRecord[] = [
  { id: 'lev-1', leaveCode: 'LR-2026-091', employeeName: 'Ganesh Lal Meena', leaveType: 'Privilege Leave', startDate: '2026-08-12', endDate: '2026-08-15', totalDays: 4, reason: 'Family Religious Function in Village', approvalStatus: 'Approved', leaveBalanceRemaining: 12 }
];

export const MOCK_PAYROLL: PayrollRecord[] = [
  {
    id: 'pay-1',
    paySlipNumber: 'PS-2026-07-881',
    employeeId: 'EMP-BHIL-001',
    employeeName: 'Ramesh Kumar Choudhary',
    payPeriod: 'July 2026',
    payType: 'Monthly Salary',
    basePayRs: 38000,
    overtimePayRs: 6500,
    tripIncentivesRs: 0,
    loadingChargesRs: 0,
    attendanceBonusRs: 2000,
    advanceDeductionsRs: 3000,
    statutoryDeductionsRs: 4800,
    netPayoutRs: 38700,
    paymentStatus: 'Processed & Disbursed'
  },
  {
    id: 'pay-2',
    paySlipNumber: 'PS-WEEKLY-AUG01',
    employeeId: 'EMP-FLEET-042',
    employeeName: 'Sukhwinder Singh',
    payPeriod: 'Week 1 Aug 2026',
    payType: 'Weekly Saturday Settlement',
    basePayRs: 8500,
    overtimePayRs: 2400,
    tripIncentivesRs: 4200,
    loadingChargesRs: 800,
    attendanceBonusRs: 500,
    advanceDeductionsRs: 1000,
    statutoryDeductionsRs: 400,
    netPayoutRs: 15000,
    paymentStatus: 'Processed & Disbursed'
  }
];

export const MOCK_CONTRACTOR_WORKFORCE: ContractorWorkforceRecord[] = [
  {
    id: 'cnt-1',
    contractorCode: 'CNT-MEWAR-LAB',
    contractorName: 'Mewar Labour Contracting Agency',
    workOrderNumber: 'WO-2026-BHIL-09',
    assignedSite: 'Bhilwara Pit #1 Quarry',
    activeLabourCount: 85,
    dailyBillingRatePerHeadRs: 650,
    weeklySettlementDueRs: 386750,
    complianceStatus: 'Labour Law Compliant'
  }
];

export const MOCK_DRIVER_OPERATOR: DriverOperatorRecord[] = [
  {
    id: 'drv-1',
    staffCode: 'DRV-VOLVO-01',
    fullName: 'Sukhwinder Singh',
    role: 'Heavy Dumper Driver',
    licenseNumber: 'RJ-06-2018-99201',
    badgeNumber: 'BDG-HAUL-882',
    licenseValidityDate: '2028-11-30',
    medicalFitnessStatus: 'Class-A Fit',
    monthlyCompletedTrips: 184,
    machineEfficiencyScore: 94.5,
    safetyIncidentHistory: 0
  }
];

export const MOCK_PERFORMANCE_KPIS: PerformanceKpiRecord[] = [
  {
    id: 'kpi-1',
    employeeName: 'Ramesh Kumar Choudhary',
    role: 'Senior Excavator Operator',
    kpiTitle: 'Daily Tonnage Excavation Rate & Diesel Efficiency',
    targetMetric: '1,200 Tons / Shift @ < 18L Diesel',
    achievedMetric: '1,280 Tons / Shift @ 16.5L Diesel',
    performanceRating: 'Exceeds Expectations',
    lastAppraisalDate: '2026-03-31',
    aiProductivityScore: 96
  }
];

export const MOCK_SAFETY_TRAINING: SafetyTrainingRecord[] = [
  {
    id: 'trn-101',
    courseCode: 'TRN-SAFE-PIT01',
    topic: 'Pit Blasting Safety',
    trainerName: 'Senior Safety Inspector K.L. Sharma',
    completedEmployeesCount: 420,
    certificationValidityDays: 365,
    nextScheduledSession: '2026-08-20',
    status: 'Completed'
  }
];

export const MOCK_HEALTH_SAFETY: HealthSafetyRecord[] = [
  {
    id: 'hs-1',
    incidentCode: 'INC-2026-BHIL-02',
    siteLocation: 'Bhilwara Crusher Loading Ramp',
    incidentType: 'Near Miss',
    severity: 'Low / Minor',
    incidentDate: '2026-08-02',
    investigationStatus: 'Resolved & Corrected',
    actionTaken: 'Re-aligned stop bar barriers & enforced high-visibility safety jackets.'
  }
];

export const MOCK_ESS_TICKETS: EssTicketRecord[] = [
  {
    id: 'ess-1',
    ticketNumber: 'TKT-ESS-8819',
    employeeName: 'Ganesh Lal Meena',
    category: 'Salary Query',
    subject: 'Overtime hours calculation discrepancy for July 28 night shift',
    submissionDate: '2026-08-05',
    status: 'In Progress'
  }
];

export const MOCK_MSS_APPROVALS: MssApprovalRecord[] = [
  {
    id: 'mss-1',
    approvalCode: 'APP-MSS-2026-11',
    requestType: 'Emergency Advance Approval',
    requestedBy: 'Sukhwinder Singh (Driver)',
    requestDetails: 'Salary Advance ₹10,000 for medical emergency',
    amountOrHours: '₹10,000',
    status: 'Pending Manager Action'
  }
];

export const MOCK_AI_HR_PLATFORM: AIHRPlatformRecord[] = [
  {
    id: 'aihr-1',
    insightType: 'Overtime Fatigue Shield',
    severity: 'Action Recommended',
    findingSummary: '3 Heavy Dumper Drivers have logged >50 hours overtime in consecutive 7 days.',
    aiSuggestedAction: 'Mandate 24-hour mandatory rest shift for Driver ID EMP-FLEET-042 to prevent accident risk.',
    confidencePercent: 98.2
  },
  {
    id: 'aihr-2',
    insightType: 'Attrition Risk Alert',
    severity: 'High Attrition Danger',
    findingSummary: 'Crusher Maintenance Supervisors in Rajsamand showing 42% risk of attrition due to peer market salary gap.',
    aiSuggestedAction: 'Initiate retention bonus or shift allowance revision of +8%.',
    confidencePercent: 91.5
  }
];

export const MOCK_WORKFORCE_ANALYTICS: WorkforceAnalyticsMetrics = {
  totalActiveWorkforce: 1450,
  monthlySalaryCount: 380,
  weeklyWageCount: 420,
  dailyWageCount: 280,
  contractWorkersCount: 220,
  driversOperatorsCount: 150,
  averageAttendancePercent: 94.8,
  totalMonthlyPayrollDisbursedRs: 28500000,
  activeSafetyIncidents: 0,
  attritionRatePercent: 2.1
};

export const MOCK_ECOSYSTEM_HR_INTEGRATIONS: EcosystemHrIntegration[] = [
  {
    id: 'hr-int-1',
    connectedDomain: 'HRMS ↔ Mining Platform (Phase 17)',
    integrationBridgeName: 'Pit Operator Shift Handover & Blasting Duty Roster Sync',
    dataFlowFrequency: 'Real-Time Bi-directional',
    status: 'Active Real-Time Sync'
  },
  {
    id: 'hr-int-2',
    connectedDomain: 'HRMS ↔ Fleet & Logistics Platform (Phase 18)',
    integrationBridgeName: 'Driver License Validity & Trip Incentive Calculator Sync',
    dataFlowFrequency: 'Real-Time',
    status: 'Active Real-Time Sync'
  },
  {
    id: 'hr-int-3',
    connectedDomain: 'HRMS ↔ Finance Platform (Phase 22)',
    integrationBridgeName: 'Automated Payroll GL Voucher & PF/ESI Statutory Journal Posting',
    dataFlowFrequency: 'Scheduled Monthly / Weekly',
    status: 'Active Real-Time Sync'
  },
  {
    id: 'hr-int-4',
    connectedDomain: 'HRMS ↔ Load Exchange Marketplace (Phase 21)',
    integrationBridgeName: 'Driver On-demand Shift Matching & Trip Payroll Discrepancy Reconciliation',
    dataFlowFrequency: 'Real-Time Event Stream',
    status: 'Active Real-Time Sync'
  }
];

// MOCK DATASETS FOR MODULES 28-45

export const MOCK_WORKFORCE_MARKETPLACE: WorkforceMarketplaceCandidate[] = [
  {
    id: 'mkt-1',
    candidateCode: 'CAND-RJ-8801',
    fullName: 'Harish Chandra Rawat',
    primaryRole: 'Volvo Dumper Driver',
    category: 'Driver',
    experienceYears: 8,
    currentLocation: 'Bhilwara, Rajasthan',
    preferredLocations: ['Bhilwara', 'Chittorgarh', 'Rajsamand'],
    skills: ['12-Wheeler Tipper', 'Volvo FMX 440', 'Night Pit Driving', 'Defensive Mining Driving'],
    certifications: ['Heavy Commercial Transport License', 'DGMS Mine Driver Safety Cert'],
    dailyRateRs: 950,
    availabilityStatus: 'Immediate (Available Today)',
    aiMatchScore: 97,
    phone: '+91 98281 99120',
    rating: 4.9
  },
  {
    id: 'mkt-2',
    candidateCode: 'CAND-RJ-8802',
    fullName: 'Mukesh Kumar Saini',
    primaryRole: 'Excavator Operator',
    category: 'Operator',
    experienceYears: 11,
    currentLocation: 'Rajsamand, Rajasthan',
    preferredLocations: ['Rajsamand', 'Udaipur'],
    skills: ['CAT 336D Excavator', 'Rock Breaker Attachment', 'Quarry Bench Operations'],
    certifications: ['Heavy Machinery Operator License', 'First Aid Certified'],
    dailyRateRs: 1200,
    availabilityStatus: 'Available in 3 Days',
    aiMatchScore: 94,
    phone: '+91 94132 88210',
    rating: 4.8
  },
  {
    id: 'mkt-3',
    candidateCode: 'CAND-RJ-8803',
    fullName: 'Er. Vikram Joshi',
    primaryRole: 'Civil Engineer',
    category: 'Engineer',
    experienceYears: 6,
    currentLocation: 'Jaipur, Rajasthan',
    preferredLocations: ['Jaipur', 'Bhilwara', 'Udaipur'],
    skills: ['Aggregate Quality Control', 'Quarry Bench Design', 'AutoCAD Civil', 'IS Code Compliance'],
    certifications: ['B.Tech Civil Engineering', 'Chartered Engineer Registration'],
    dailyRateRs: 2500,
    availabilityStatus: 'Immediate (Available Today)',
    aiMatchScore: 92,
    phone: '+91 97821 33201',
    rating: 4.9
  }
];

export const MOCK_DIGITAL_RECRUITMENT: DigitalRecruitmentApplicant[] = [
  {
    id: 'app-101',
    applicantCode: 'APP-2026-901',
    appliedPosition: 'Senior Mining Safety Engineer',
    applicantName: 'Anil Kumar Sharma',
    parsedExperienceYears: 9,
    aiResumeScore: 95,
    videoInterviewStatus: 'Completed & AI Rated',
    bgVerificationStatus: 'Clear & Verified',
    digitalOfferStatus: 'Offer Accepted',
    joiningDate: '2026-08-18'
  },
  {
    id: 'app-102',
    applicantCode: 'APP-2026-902',
    appliedPosition: 'Crusher Maintenance Technician',
    applicantName: 'Surendra Singh Solanki',
    parsedExperienceYears: 5,
    aiResumeScore: 88,
    videoInterviewStatus: 'Scheduled for Today',
    bgVerificationStatus: 'Verification in Progress',
    digitalOfferStatus: 'Under Salary Negotiation',
    joiningDate: '2026-08-25'
  }
];

export const MOCK_WORKFORCE_PLANNING: WorkforcePlanningRecord[] = [
  {
    id: 'plan-1',
    unitOrProjectName: 'Bhilwara Pit #1 Granite Quarry',
    domainCategory: 'Quarry Pit',
    currentHeadcount: 140,
    requiredHeadcount: 160,
    headcountGap: -20,
    shiftCapacityPercent: 87.5,
    ai30DayForecastDemand: 172,
    recommendedAction: 'Deploy 15 Contract Labourers + 5 Heavy Dumper Drivers immediately via Workforce Marketplace.'
  },
  {
    id: 'plan-2',
    unitOrProjectName: 'Rajsamand 200 TPH Crusher Plant',
    domainCategory: 'Crusher Plant',
    currentHeadcount: 85,
    requiredHeadcount: 90,
    headcountGap: -5,
    shiftCapacityPercent: 94.4,
    ai30DayForecastDemand: 92,
    recommendedAction: 'Appoint 3 Conveyor Helpers from Local Apprentice Pool.'
  }
];

export const MOCK_COMPETENCY_MATRIX: CompetencySkillRecord[] = [
  {
    id: 'comp-1',
    employeeId: 'EMP-BHIL-001',
    employeeName: 'Ramesh Kumar Choudhary',
    designation: 'Senior Excavator Operator',
    machineAuthorizationList: ['CAT 336D Excavator', 'Volvo EC480D', 'Komatsu PC300'],
    licenseExpiryDate: '2029-06-30',
    skillGapIdentified: 'GPS Guided Precision Excavation',
    aiRecommendedCourse: 'VR Simulated GPS Machine Guidance Masterclass',
    competencyRating: 'Level 4 - Expert / Instructor'
  }
];

export const MOCK_TRAINING_COURSES: TrainingCourseRecord[] = [
  {
    id: 'crs-1',
    courseId: 'LMS-SAFE-01',
    title: 'DGMS Mining Regulations & Pit Safety Standards',
    category: 'Safety & DGMS Compliance',
    format: 'Interactive Online LMS',
    durationHours: 8,
    enrolledCount: 340,
    completionRatePercent: 96.5,
    nextRenewalAlertDate: '2027-01-15'
  },
  {
    id: 'crs-2',
    courseId: 'LMS-MECH-02',
    title: 'Advanced Hydraulic Crusher Maintenance & Wear Diagnostics',
    category: 'Crusher Maintenance',
    format: 'On-Site Practical Ground Training',
    durationHours: 16,
    enrolledCount: 65,
    completionRatePercent: 92.0,
    nextRenewalAlertDate: '2026-11-30'
  }
];

export const MOCK_SUCCESSION_PLANS: SuccessionPlanRecord[] = [
  {
    id: 'succ-1',
    criticalPositionTitle: 'Vice President - Mining Operations',
    currentIncumbent: 'Rajesh Sharma',
    department: 'Mining Division',
    readinessLevel: 'Emergency Backup Ready',
    designatedSuccessors: [
      { name: 'Er. Mahendra Pratap', currentRole: 'Senior Quarry Manager', readinessScore: 92 },
      { name: 'Er. Sandeep Bhati', currentRole: 'Chief Safety Engineer', readinessScore: 84 }
    ],
    retentionRiskLevel: 'Low Risk'
  }
];

export const MOCK_EMPLOYEE_ENGAGEMENT: EmployeeEngagementSurvey[] = [
  {
    id: 'eng-1',
    title: 'Q3 2026 Workforce Safety & Amenities Feedback Pulse',
    type: 'Monthly Pulse Survey',
    participantCount: 1120,
    engagementScorePercent: 91.4,
    topFeedbackSummary: 'Request for additional chilled drinking water booths in Pit #2 and air-conditioned rest cabins for Drivers.',
    publishedDate: '2026-08-01'
  }
];

export const MOCK_TIME_PRODUCTIVITY: TimeProductivityJobCard[] = [
  {
    id: 'jc-101',
    jobCardNumber: 'JC-2026-0807-01',
    assignedStaffName: 'Ramesh Kumar Choudhary',
    machineUnitId: 'EXCAVATOR-CAT-336D',
    taskAllocation: 'Overburden Excavation at Pit #1 East Bench',
    allocatedHours: 8,
    actualMachineHours: 7.6,
    idleHours: 0.4,
    productivityScore: 95.0,
    aiEfficiencyNote: 'Optimal diesel usage (16.2L/hr). Zero unapproved idling logged.'
  }
];

export const MOCK_SAFETY_COMPLIANCE: SafetyComplianceRecord[] = [
  {
    id: 'safe-1',
    recordCode: 'PTW-2026-0807-BLAST',
    location: 'Bhilwara Pit Bench #3',
    ppeIssuedCount: 140,
    permitToWorkType: 'Hot Work - Blasting Area',
    permitStatus: 'Active & Verified',
    toolboxMeetingTopic: 'Blasting Shelter Clearance & Siren Protocol Check',
    complianceScorePercent: 99.5
  }
];

export const MOCK_DIGITAL_DOCUMENTS: DigitalDocumentRecord[] = [
  {
    id: 'doc-1',
    documentId: 'DOC-LIC-0912',
    employeeName: 'Sukhwinder Singh',
    documentType: 'Heavy Driving License',
    expiryDate: '2028-11-30',
    daysToExpiry: 845,
    ocrVerificationStatus: 'OCR Validated',
    digitalSignatureStatus: 'Digitally Signed with Timestamp'
  },
  {
    id: 'doc-2',
    documentId: 'DOC-MED-4410',
    employeeName: 'Ganesh Lal Meena',
    documentType: 'Medical Fitness Certificate',
    expiryDate: '2026-09-15',
    daysToExpiry: 39,
    ocrVerificationStatus: 'OCR Validated',
    digitalSignatureStatus: 'Digitally Signed with Timestamp'
  }
];

export const MOCK_EXPENSE_CLAIMS: ExpenseClaimRecord[] = [
  {
    id: 'exp-101',
    claimNumber: 'EXP-2026-08-012',
    employeeName: 'Er. Vikram Joshi',
    expenseCategory: 'Site Fuel Top-up',
    claimAmountRs: 4850,
    submissionDate: '2026-08-05',
    approvalStatus: 'Approved & Settled via Payroll'
  }
];

export const MOCK_AI_COMMAND_INSIGHTS: AIHRCommandInsight[] = [
  {
    id: 'aicmd-1',
    moduleSource: 'AI Shift Optimizer',
    executiveAlert: 'Night Shift Overburden Removal Productivity Surge Detected',
    impactScope: 'Bhilwara Pit #1 Night Shift',
    aiRecommendation: 'Re-allocate 2 backup Dumper Drivers from Yard B to Pit #1 to maximize crusher feed throughput (+18% output).',
    confidenceScore: 98.6,
    actionStatus: 'Pending Executive Action'
  },
  {
    id: 'aicmd-2',
    moduleSource: 'AI Attrition Engine',
    executiveAlert: 'Low Attrition Risk Confirmed Across All Senior Heavy Operators',
    impactScope: 'Quarry & Fleet Units',
    aiRecommendation: 'Maintain existing quarterly performance bonus tiers.',
    confidenceScore: 94.2,
    actionStatus: 'Applied Automations'
  }
];

export const MOCK_EXECUTIVE_HR_METRICS: ExecutiveHRDashboardMetrics = {
  liveOnsiteWorkforce: 1380,
  activeShiftsRunning: 12,
  driverCoveragePercent: 98.5,
  operatorCoveragePercent: 100.0,
  weeklyWageBillProjectedRs: 1240000,
  monthlySalaryBillProjectedRs: 28500000,
  aiWorkforceHealthIndex: 96.2,
  criticalSafetyIncidentsThisMonth: 0
};

export const MOCK_MOBILE_APPS_STATUS: MobileAppInstanceStatus[] = [
  { appName: 'Employee Self Service App', activeInstallsCount: 1240, offlineSyncQueueCount: 0, gpsCheckInRatePercent: 96.8, faceRecMatchRatePercent: 99.2, appVersion: 'v4.2.0-prod' },
  { appName: 'Driver Companion App', activeInstallsCount: 420, offlineSyncQueueCount: 2, gpsCheckInRatePercent: 98.5, faceRecMatchRatePercent: 98.9, appVersion: 'v4.2.0-prod' },
  { appName: 'Operator Heavy App', activeInstallsCount: 180, offlineSyncQueueCount: 0, gpsCheckInRatePercent: 97.4, faceRecMatchRatePercent: 99.5, appVersion: 'v4.2.0-prod' },
  { appName: 'Site Supervisor App', activeInstallsCount: 65, offlineSyncQueueCount: 1, gpsCheckInRatePercent: 99.0, faceRecMatchRatePercent: 99.8, appVersion: 'v4.2.0-prod' },
  { appName: 'Manager Command App', activeInstallsCount: 35, offlineSyncQueueCount: 0, gpsCheckInRatePercent: 100.0, faceRecMatchRatePercent: 100.0, appVersion: 'v4.2.0-prod' }
];

export const MOCK_WORKFORCE_DIGITAL_TWIN: WorkforceDigitalTwinNode[] = [
  { id: 'dtwin-1', siteName: 'Bhilwara Pit #1 Granite Quarry', coordinates: '25.3478° N, 74.6358° E', assignedWorkersCount: 620, livePresentCount: 598, activeMachineryCount: 42, capacityUtilizationPercent: 96.4, riskFactor: 'Optimal Green' },
  { id: 'dtwin-2', siteName: 'Rajsamand Aggregate Crusher Yard', coordinates: '25.0722° N, 73.8821° E', assignedWorkersCount: 380, livePresentCount: 362, activeMachineryCount: 18, capacityUtilizationPercent: 95.2, riskFactor: 'Optimal Green' },
  { id: 'dtwin-3', siteName: 'Chittorgarh Heavy Logistics Hub', coordinates: '24.8887° N, 74.6269° E', assignedWorkersCount: 450, livePresentCount: 420, activeMachineryCount: 88, capacityUtilizationPercent: 93.3, riskFactor: 'Optimal Green' }
];

export const MOCK_FUTURE_READY_CAPABILITIES: FutureReadyCapability[] = [
  { capabilityName: 'Multimodal Face Recognition + GPS Geofence', technologyCategory: 'Biometric & Face Rec', deploymentStatus: 'Fully Integrated & Active', description: 'Real-time anti-spoofing 3D face scan paired with high-precision GPS geofencing at pit entry gates.' },
  { capabilityName: 'Voice AI HR Assistant & Multilingual Query Engine', technologyCategory: 'AI & Voice HR', deploymentStatus: 'Fully Integrated & Active', description: 'Supports Hindi, Rajasthani, Punjabi, and English voice commands for checking salary slips, leave status, and logging safety issues.' },
  { capabilityName: 'Smart IoT Wearable Fatigue & Dust Monitor Integration', technologyCategory: 'IoT & Wearables', deploymentStatus: 'Pilot Field Testing', description: 'Smart helmets and wristbands measuring operator heart rate variability, ambient silica dust, and fatigue indicators in heavy dumpers.' },
  { capabilityName: 'Digital Employee Wallet & Daily Wage Saturday Instant Payout', technologyCategory: 'Digital Wallet & Rewards', deploymentStatus: 'Fully Integrated & Active', description: 'Direct UPI/Bank ledger transfer on Saturday evenings for daily/weekly contract workforce.' }
];

