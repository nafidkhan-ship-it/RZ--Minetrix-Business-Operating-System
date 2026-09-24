// RZ® MINETRIX — PLATFORM 4: CONTRACT & JOB MANAGEMENT STUDIO DATA & TYPES

export type CustomerType = 'Individual' | 'Company' | 'Contractor' | 'Builder' | 'Government' | 'Other';

export type CustomerStatus = 'Active' | 'Under Review' | 'Suspended' | 'Inactive';

export interface Customer {
  id: string; // e.g. CUST-1001
  name: string;
  companyName: string;
  customerType: CustomerType;
  phone: string;
  email: string;
  address: string;
  district: string;
  state: string;
  gstRegistration: string;
  contactPerson: string;
  creditLimit: number;
  paymentTerms: string;
  status: CustomerStatus;
  documentsCount: number;
  totalJobsCount: number;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
}

export type RequirementType = 'Quarry Excavation' | 'Crushed Aggregate Supply' | 'Road Sub-base Construction' | 'Earthmoving & Grading' | 'Laterite Masonry Work' | 'Machinery Hire & Operation';

export type RequirementStatus = 'New' | 'Under Review' | 'Quotation Prepared' | 'Negotiation' | 'Approved' | 'Rejected' | 'Converted to Job';

export interface JobRequirement {
  id: string; // e.g. REQ-2026-001
  customerId: string;
  customerName: string;
  requirementType: RequirementType;
  title: string;
  description: string;
  location: string;
  district: string;
  startDate: string;
  expectedCompletion: string;
  budget: number;
  materialRequirement: string;
  vehicleRequirement: string;
  labourRequirement: string;
  notes: string;
  attachmentsCount: number;
  status: RequirementStatus;
  createdAt: string;
}

export type LeadSource = 'Direct Inbound' | 'Referral' | 'Tender / e-Procurement' | 'Quarry Site Visit' | 'RZ® Chat' | 'Marketplace Lead';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Quotation' | 'Negotiation' | 'Won' | 'Lost';

export interface JobLead {
  id: string; // e.g. LEAD-801
  customerId: string;
  customerName: string;
  requirementTitle: string;
  requirementType: RequirementType;
  source: LeadSource;
  estimatedValue: number;
  salesPerson: string;
  followUpDate: string;
  status: LeadStatus;
  notes: string;
  probabilityPercent: number;
  createdDate: string;
}

export type QuotationStatus = 'Draft' | 'Sent' | 'Viewed' | 'Negotiation' | 'Accepted' | 'Rejected' | 'Expired' | 'Converted';

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string; // MT, Cu.m, Sq.ft, Hours, Trips, Lump-Sum
  rate: number;
  discountPercent: number;
  taxPercent: number; // e.g. 5%, 18%
  totalAmount: number;
}

export interface Quotation {
  quotationNumber: string; // e.g. QT-2026-042
  date: string;
  customerId: string;
  customerName: string;
  requirementId: string;
  validUntil: string;
  items: QuotationLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  paymentTerms: string;
  deliveryTerms: string;
  notes: string;
  status: QuotationStatus;
  preparedBy: string;
}

export type AgreementStatus = 'Draft' | 'Under Review' | 'Sent' | 'Signed' | 'Active' | 'Expiring' | 'Completed' | 'Terminated';

export interface Agreement {
  agreementNumber: string; // e.g. AGR-2026-018
  customerName: string;
  customerId: string;
  jobId: string;
  quotationNumber: string;
  startDate: string;
  endDate: string;
  contractValue: number;
  scopeSummary: string;
  paymentTerms: string;
  retentionPercent: number; // e.g. 5%
  advancePercent: number; // e.g. 15%
  milestonesCount: number;
  termsAndConditions: string;
  documentsCount: number;
  signatureStatus: 'Drafted' | 'Pending Client Signature' | 'Fully Executed (E-Signed)';
  status: AgreementStatus;
  signedDate?: string;
}

export type WorkOrderStatus = 'Draft' | 'Approved' | 'Assigned' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface WorkOrder {
  workOrderNumber: string; // e.g. WO-2026-104
  customerName: string;
  jobId: string;
  jobName?: string;
  contractorName: string;
  subcontractorName: string;
  scope: string;
  startDate: string;
  endDate: string;
  budget: number;
  materials?: string;
  materialsSummary?: string;
  workersAllocated?: number;
  workersCount?: number;
  vehiclesAllocated?: number;
  vehiclesCount?: number;
  supervisor?: string;
  supervisorName?: string;
  priority: PriorityLevel;
  instructions: string;
  documentsCount: number;
  status: WorkOrderStatus;
}

export type JobStatus = 'Planning' | 'Planned' | 'Approved' | 'Assigned' | 'In Progress' | 'On Hold' | 'Delayed' | 'Completed' | 'Cancelled';
export type JobCategory = 'Quarrying' | 'Crushing & Aggregates' | 'Road & Infrastructure' | 'Commercial Earthwork' | 'Building Works' | string;

export interface ContractJob {
  id: string; // e.g. JOB-4001
  name: string;
  customerName: string;
  customerId: string;
  agreementNumber?: string;
  workOrderNumber?: string;
  location: string;
  district?: string;
  startDate: string;
  expectedCompletion?: string;
  endDate?: string;
  actualCompletion?: string;
  contractValue: number;
  budget: number;
  actualCost: number;
  actualProfit?: number;
  estimatedProfit?: number;
  outstandingAmount?: number;
  billedAmount: number;
  receivedAmount: number;
  progressPercent: number;
  workersCount?: number;
  contractorsCount?: number;
  vehiclesCount?: number;
  materialsTons?: number;
  scopeItemsCount?: number;
  milestonesCount?: number;
  documentsCount?: number;
  openTasksCount?: number;
  manager: string;
  supervisor: string;
  contractor?: string;
  status: JobStatus;
  priority: PriorityLevel;
  category: 'Quarrying' | 'Crushing & Aggregates' | 'Road & Infrastructure' | 'Commercial Earthwork' | 'Building Works' | string;
}

export interface JobScopeItem {
  id: string;
  jobId: string;
  scopeItem?: string;
  title?: string;
  description: string;
  quantity: number;
  completedQuantity?: number;
  unit: string;
  rate: number;
  amount: number;
  responsiblePerson: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Variance Added';
}

export interface JobMilestone {
  id: string;
  jobId: string;
  milestone?: string;
  title?: string;
  description: string;
  targetDate: string;
  amount: number;
  percentage: number;
  responsiblePerson: string;
  status: 'Pending' | 'Started' | 'In Progress' | 'Completed' | 'Delayed';
}

export interface JobProgressUpdate {
  id: string;
  date: string;
  jobId: string;
  jobName: string;
  progressPercent: number;
  workCompleted: string;
  materialsUsed: string;
  workersCount: number;
  workersPresent?: number;
  vehiclesCount: number;
  vehiclesActive?: number;
  notes: string;
  photosCount: number;
  submittedBy: string;
  loggedBy?: string;
}

export type ContractorStatus = 'Active' | 'Approved' | 'Pending Verification' | 'Suspended';

export interface Contractor {
  id: string; // e.g. CONT-501
  name: string;
  company?: string;
  phone: string;
  email: string;
  address: string;
  gst?: string;
  gstNumber?: string;
  panNumber?: string;
  serviceType: string;
  contractValue: number;
  activeJobsCount: number;
  totalPaid?: number;
  outstandingAmount?: number;
  paymentTerms: string;
  status: ContractorStatus;
  documentsCount: number;
  rating: number;
  contactPerson?: string;
}

export interface Subcontractor {
  id: string; // e.g. SUB-301
  subcontractor?: string;
  name?: string;
  contractorId?: string;
  contractorName?: string;
  parentContractor?: string;
  jobId: string;
  jobName?: string;
  scope?: string;
  assignedScope?: string;
  contractValue: number;
  startDate: string;
  endDate?: string;
  paymentTerms?: string;
  supervisorName?: string;
  status: 'Active' | 'Assigned' | 'Completed' | 'Under Review' | string;
  documentsCount?: number;
}

export type WorkerRole = 'Excavator Operator' | 'Tipper Driver' | 'Blasting Assistant' | 'Mason' | 'Labourer' | 'Site Supervisor' | string;

export interface JobWorker {
  id: string;
  workerName?: string;
  name?: string;
  employeeId?: string;
  jobId: string;
  jobName?: string;
  contractor?: string;
  contractorName?: string;
  role: WorkerRole;
  dailyRate: number;
  attendanceDays: number;
  overtimeHours: number;
  battaAmount: number;
  totalEarnings?: number;
  status: 'Present On-Site' | 'Off-Duty' | 'Transferred' | 'Relieved' | 'Present' | string;
  phone?: string;
}

export type MaterialSourceType = 'Quarry' | 'Crusher' | 'Supplier' | 'Building Materials' | 'Existing Inventory' | string;

export interface JobMaterial {
  id: string;
  materialName: string;
  productType?: string;
  source: MaterialSourceType;
  sourceFacilityName?: string;
  supplier?: string;
  quantity?: number;
  quantityRequired?: number;
  quantityReceived?: number;
  quantityUsed?: number;
  quantityRemaining?: number;
  unit: string;
  rate: number;
  amount: number;
  requiredDate?: string;
  receivedQuantity?: number;
  usedQuantity?: number;
  remainingQuantity?: number;
  status: 'Fully Delivered' | 'Partially Delivered' | 'Scheduled' | 'Depleted' | 'Active' | string;
  jobId: string;
}

export type JobMaterialAllocation = JobMaterial;

export interface JobVehicleAllocation {
  id: string;
  vehicleNumber: string;
  vehicleType: string;
  owner?: string;
  driver?: string;
  driverName?: string;
  jobId: string;
  jobName?: string;
  tripsCount: number;
  purpose: string;
  startDate?: string;
  endDate?: string;
  ratePerTripOrDay?: number;
  dailyRate?: number;
  rateType?: 'Per Trip' | 'Per Day' | 'Per MT-Km' | 'Monthly Hire' | string;
  fuelExpenses?: number;
  totalCost: number;
  status: 'Active on Site' | 'In Transit' | 'Standby' | 'Released' | 'Active' | string;
}

export type ExpenseCategory =
  | 'Labour'
  | 'Materials'
  | 'Material'
  | 'Vehicle'
  | 'Vehicle Hire'
  | 'Fuel'
  | 'Toll'
  | 'Contractor'
  | 'Subcontractor'
  | 'Equipment'
  | 'Machinery Maintenance'
  | 'Explosives / Blasting'
  | 'Transport'
  | 'Permits & Approvals'
  | 'Site Office'
  | 'Accommodation'
  | 'Food'
  | 'Permit'
  | 'Miscellaneous'
  | 'Other'
  | string;

export interface JobExpense {
  id: string;
  date: string;
  jobId: string;
  jobName?: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: 'Bank Transfer' | 'Bank Transfer (RTGS)' | 'Bank Transfer (RTGS/NEFT)' | 'UPI' | 'Company Card' | 'Cash / Petty Cash' | 'Cheque' | 'Petty Cash' | string;
  reference?: string;
  paidTo?: string;
  description: string;
  hasAttachment?: boolean;
  receiptUrl?: string;
  approvedBy: string;
  status?: string;
}

export type BillingType = 'Advance' | 'Advance Billing' | 'Milestone Billing' | 'Progress Billing' | 'Progress / RA Bill' | 'Material Supply Billing' | 'Time & Material' | 'Final Bill' | 'Final Billing' | 'Retention' | 'Other' | string;
export type InvoiceStatus = 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue' | 'Draft' | 'Generated' | 'Sent' | 'Cancelled' | string;

export interface JobInvoice {
  invoiceNumber: string;
  jobId: string;
  jobName?: string;
  customerId?: string;
  customerName: string;
  billingType: BillingType;
  milestoneTitle?: string;
  contractValue?: number;
  previousBilled?: number;
  currentBill?: number;
  currentAmount?: number;
  taxAmount: number;
  retentionDeduction?: number;
  retentionDeducted?: number;
  totalInvoiceAmount?: number;
  totalAmount?: number;
  paidAmount?: number;
  balanceAmount?: number;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
}

export type PaymentMode = 'Bank Transfer (RTGS)' | 'NEFT / RTGS' | 'UPI' | 'Cheque' | 'Demand Draft' | 'Online Gateway' | 'Cash' | string;

export interface JobPayment {
  id: string;
  paymentDate?: string;
  date?: string;
  customerId?: string;
  customerName: string;
  jobId: string;
  jobName?: string;
  invoiceNumber: string;
  amount: number;
  paymentMethod?: string;
  paymentMode?: PaymentMode;
  reference?: string;
  referenceNumber?: string;
  bankAccount?: string;
  paymentType?: 'Advance' | 'Running Settlement' | 'Milestone Release' | 'Retention Release' | string;
  tdsDeducted?: number;
  netReceived?: number;
  remainingBalance?: number;
  status?: string;
}

export type ChangeOrderStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Implemented';
export type ChangeOrderReason = 'Scope Addition' | 'Scope Reduction' | 'Site Condition' | 'Material Price Variation' | 'Design Change' | string;

export interface ChangeOrder {
  changeOrderNumber: string;
  jobId: string;
  jobName?: string;
  originalScope?: string;
  changedScope?: string;
  reason: ChangeOrderReason;
  description?: string;
  additionalQuantity?: string;
  additionalCost?: number;
  additionalRevenue?: number;
  valueChange?: number;
  scheduleImpactDays?: number;
  approvalStatus?: ChangeOrderStatus;
  customerApproval?: 'Pending' | 'Approved' | 'Rejected' | string;
  status?: string;
  approvedBy?: string;
  date: string;
  documentsCount?: number;
  impactOnProfit?: number;
}

export type JobDocumentCategory =
  | 'Quotations'
  | 'Agreements'
  | 'Work Orders'
  | 'Drawings'
  | 'Drawings / Site Plans'
  | 'Photos'
  | 'Permits'
  | 'Permits & Approvals'
  | 'Customer Documents'
  | 'Contractor Documents'
  | 'Invoices'
  | 'Payment Receipts'
  | 'Receipts'
  | 'Reports'
  | 'Progress Documents'
  | 'Quality & Test Certificates'
  | 'Safety Reports'
  | 'Completion Certificates'
  | string;

export type DocumentCategory = JobDocumentCategory;

export interface JobDocument {
  id: string;
  jobId: string;
  jobName?: string;
  title: string;
  category: JobDocumentCategory;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  status?: string;
  fileUrl?: string;
}

export interface OttTaskBridge {
  id: string;
  title: string;
  jobId: string;
  customerOrContractor: string;
  category: string;
  dueDate: string;
  priority: PriorityLevel;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  source: string;
}

// -------------------------------------------------------------
// SAMPLE DATA REPOSITORY (Studio Preview / Demo Data)
// -------------------------------------------------------------

export const SAMPLE_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-1001',
    name: 'National Highways Infrastructure Trust (NHIT)',
    companyName: 'NHAI Regional Concessionaire JV',
    customerType: 'Government',
    phone: '+91 98450 11200',
    email: 'tenders@nhit-nh66.gov.in',
    address: 'NH-66 Highway Project Office, Kadri Hills',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    gstRegistration: '29AAACN8842K1ZB',
    contactPerson: 'Er. Sandeep Hegde (Chief Engineer)',
    creditLimit: 15000000,
    paymentTerms: '30 Days Net from RA Bill certification',
    status: 'Active',
    documentsCount: 14,
    totalJobsCount: 4,
    totalBilled: 14500000,
    totalPaid: 12200000,
    outstandingBalance: 2300000
  },
  {
    id: 'CUST-1002',
    name: 'Sobha Horizon Developers Pvt Ltd',
    companyName: 'Sobha Ltd South Zone',
    customerType: 'Builder',
    phone: '+91 97410 44820',
    email: 'procurement@sobha-south.com',
    address: 'Horizon Tower, MG Road, Kannur',
    district: 'Kannur',
    state: 'Kerala',
    gstRegistration: '32AABCS5591P1ZX',
    contactPerson: 'Mr. Rajesh Menon (VP Projects)',
    creditLimit: 8000000,
    paymentTerms: '15 Days Net Milestone based',
    status: 'Active',
    documentsCount: 9,
    totalJobsCount: 3,
    totalBilled: 9400000,
    totalPaid: 8100000,
    outstandingBalance: 1300000
  },
  {
    id: 'CUST-1003',
    name: 'Coastal Precast & Infra Solutions',
    companyName: 'Coastal Infra Consortium',
    customerType: 'Contractor',
    phone: '+91 94481 92831',
    email: 'info@coastalprecastinfra.in',
    address: 'Baikampady Industrial Area, Mangalore',
    district: 'Dakshina Kannada',
    state: 'Karnataka',
    gstRegistration: '29AABFC1092Q1ZA',
    contactPerson: 'K. V. Pai (Managing Partner)',
    creditLimit: 5000000,
    paymentTerms: '7 Days Rolling Account',
    status: 'Active',
    documentsCount: 6,
    totalJobsCount: 2,
    totalBilled: 5200000,
    totalPaid: 4700000,
    outstandingBalance: 500000
  },
  {
    id: 'CUST-1004',
    name: 'Malabar Estate Resettlement Project',
    companyName: 'Malabar Highlands Tea & Agro Estates',
    customerType: 'Company',
    phone: '+91 94951 88392',
    email: 'projects@malabarestate.org',
    address: 'Meppadi Road, Kalpetta',
    district: 'Wayanad',
    state: 'Kerala',
    gstRegistration: '32AACFM9018L1ZU',
    contactPerson: 'Dr. Kurian Thomas (Estate Director)',
    creditLimit: 3000000,
    paymentTerms: 'Immediate upon delivery',
    status: 'Active',
    documentsCount: 5,
    totalJobsCount: 1,
    totalBilled: 3100000,
    totalPaid: 2700000,
    outstandingBalance: 400000
  },
  {
    id: 'CUST-1005',
    name: 'Ashraf M. Haji (Villa & Commercial Developer)',
    companyName: 'Ashraf Builders & Promoters',
    customerType: 'Individual',
    phone: '+91 98950 33411',
    email: 'ashraf.builders@gmail.com',
    address: 'New Bus Stand Complex, Kasaragod',
    district: 'Kasaragod',
    state: 'Kerala',
    gstRegistration: '32BXKPA4492M1ZK',
    contactPerson: 'Ashraf M. Haji (Owner)',
    creditLimit: 1500000,
    paymentTerms: '50% Advance, Balance on Completion',
    status: 'Active',
    documentsCount: 4,
    totalJobsCount: 2,
    totalBilled: 1800000,
    totalPaid: 1800000,
    outstandingBalance: 0
  }
];

export const SAMPLE_REQUIREMENTS: JobRequirement[] = [
  {
    id: 'REQ-2026-001',
    customerId: 'CUST-1001',
    customerName: 'National Highways Infrastructure Trust (NHIT)',
    requirementType: 'Crushed Aggregate Supply',
    title: '40mm & GSB Sub-base Aggregate for NH-66 By-pass Ch. 342-358 km',
    description: 'Bulk supply of 40mm crushed metal, GSB Type-I mix, and 20mm graded stone chips conforming to MORTH specifications.',
    location: 'NH-66 Suratkal to Mulki Flyover Stretch',
    district: 'Dakshina Kannada',
    startDate: '2026-10-01',
    expectedCompletion: '2026-12-31',
    budget: 8500000,
    materialRequirement: '45,000 MT 40mm Granular Sub-base (GSB) & 20mm Road Metal',
    vehicleRequirement: '12 x 10-Wheeler / 12-Wheeler Tippers (28MT Cap)',
    labourRequirement: 'Quality controller, 2 site inspectors, 4 weighbridge coordinators',
    notes: 'Requires daily delivery batches of 600 MT with computer weighment slips and MORTH lab test certificates.',
    attachmentsCount: 3,
    status: 'Approved',
    createdAt: '2026-09-10'
  },
  {
    id: 'REQ-2026-002',
    customerId: 'CUST-1002',
    customerName: 'Sobha Horizon Developers Pvt Ltd',
    requirementType: 'Quarry Excavation',
    title: 'Site Formation Rock Blasting & Controlled Pit Excavation (22,000 Cu.m)',
    description: 'Controlled rock blasting with non-electric shock tubes, pit leveling, and excavator hydraulic breaker clearing for basement foundation.',
    location: 'Horizon Heights Project Site, Kannur Hills',
    district: 'Kannur',
    startDate: '2026-10-15',
    expectedCompletion: '2026-11-30',
    budget: 4200000,
    materialRequirement: 'Explosives, detonators, non-electric shock tubes, blasting mats',
    vehicleRequirement: '2 x Heavy Excavators (CAT 320D) with Rock Breakers, 6 Dumper Trucks',
    labourRequirement: '1 Licensed Blaster, 1 Mining Mate, 6 Operators & Riggers',
    notes: 'Permits and blast timing strictly restricted between 12:30 PM - 02:00 PM per District Magistrate guidelines.',
    attachmentsCount: 5,
    status: 'Quotation Prepared',
    createdAt: '2026-09-14'
  },
  {
    id: 'REQ-2026-003',
    customerId: 'CUST-1003',
    customerName: 'Coastal Precast & Infra Solutions',
    requirementType: 'Crushed Aggregate Supply',
    title: 'High-Density 10mm & Manufactured Sand (M-Sand) Zone-II Supply',
    description: 'Precision washed VSI manufactured sand and 10mm aggregate for automated precast girder casting.',
    location: 'Baikampady Precast Casting Yard',
    district: 'Dakshina Kannada',
    startDate: '2026-09-25',
    expectedCompletion: '2026-10-25',
    budget: 2800000,
    materialRequirement: '8,000 MT Plaster Sand & VSI Concrete Sand, 4,000 MT 10mm Stone',
    vehicleRequirement: '4 x 16MT Multi-axle Trucks with GPS tracking',
    labourRequirement: 'Logistics dispatcher and sample testing technician',
    notes: 'Silt content must be strictly below 3.5% with zero mica impurities.',
    attachmentsCount: 2,
    status: 'Converted to Job',
    createdAt: '2026-08-28'
  },
  {
    id: 'REQ-2026-004',
    customerId: 'CUST-1004',
    customerName: 'Malabar Estate Resettlement Project',
    requirementType: 'Laterite Masonry Work',
    title: 'Machine-Cut Laterite Stone Supply & Retaining Wall Masonry (30,000 Blocks)',
    description: 'Extraction and delivery of top-grade heavy red laterite stones (size 30x20x15cm) and construction of hillside anti-erosion retaining structures.',
    location: 'Tea Plantation Sector 4, Meppadi, Wayanad',
    district: 'Wayanad',
    startDate: '2026-10-05',
    expectedCompletion: '2026-11-20',
    budget: 1950000,
    materialRequirement: '30,000 First-grade Laterite Dressing Blocks, Cement, Binding wire',
    vehicleRequirement: '2 x 6-Wheeler Tipper Trucks suited for steep incline mountain roads',
    labourRequirement: '1 Mason Supervisor, 8 Master Stone Masons, 6 Helpers',
    notes: 'Monsoon drainage trenches to be executed simultaneously.',
    attachmentsCount: 4,
    status: 'New',
    createdAt: '2026-09-20'
  },
  {
    id: 'REQ-2026-005',
    customerId: 'CUST-1005',
    customerName: 'Ashraf M. Haji (Villa & Commercial Developer)',
    requirementType: 'Earthmoving & Grading',
    title: 'Plot Leveling, Foundation Cutting & Granular Backfilling for Commercial Complex',
    description: 'Clearing 1.8 acres sloping site, leveling with dozer, and providing 1,200 MT gravel soling.',
    location: 'NH Bypass Junction, Cheruvathur, Kasaragod',
    district: 'Kasaragod',
    startDate: '2026-10-10',
    expectedCompletion: '2026-10-30',
    budget: 1200000,
    materialRequirement: '1,200 MT Red Soil Gravel Soling & Quarry Dust',
    vehicleRequirement: '1 x JCB 3DX Backhoe Loader, 1 x Vibratory Soil Roller, 3 Tippers',
    labourRequirement: '1 Site Engineer, 2 Plant Operators, 2 Survey Helpers',
    notes: 'Soil compaction test report required prior to column footing excavation.',
    attachmentsCount: 2,
    status: 'Negotiation',
    createdAt: '2026-09-18'
  }
];

export const SAMPLE_LEADS: JobLead[] = [
  {
    id: 'LEAD-801',
    customerId: 'CUST-1001',
    customerName: 'National Highways Infrastructure Trust (NHIT)',
    requirementTitle: 'NH-66 By-pass Flyover Sub-base Crushed Stone Package',
    requirementType: 'Crushed Aggregate Supply',
    source: 'Tender / e-Procurement',
    estimatedValue: 8500000,
    salesPerson: 'Anand Kumar (Commercial Head)',
    followUpDate: '2026-09-25',
    status: 'Won',
    notes: 'Tender award letter issued; agreement drafted and advance milestone agreed.',
    probabilityPercent: 95,
    createdDate: '2026-09-08'
  },
  {
    id: 'LEAD-802',
    customerId: 'CUST-1002',
    customerName: 'Sobha Horizon Developers Pvt Ltd',
    requirementTitle: 'Basement Controlled Rock Blasting & Crushing Package',
    requirementType: 'Quarry Excavation',
    source: 'Direct Inbound',
    estimatedValue: 4200000,
    salesPerson: 'Praveen Shetty (Site Accounts)',
    followUpDate: '2026-09-24',
    status: 'Negotiation',
    notes: 'Discussing rate per cubic meter vs lump-sum machine hours; blast permissions reviewed.',
    probabilityPercent: 75,
    createdDate: '2026-09-12'
  },
  {
    id: 'LEAD-803',
    customerId: 'CUST-1003',
    customerName: 'Coastal Precast & Infra Solutions',
    requirementTitle: 'Precast Girder Yard M-Sand Annual Contract',
    requirementType: 'Crushed Aggregate Supply',
    source: 'Referral',
    estimatedValue: 2800000,
    salesPerson: 'Anand Kumar (Commercial Head)',
    followUpDate: '2026-09-20',
    status: 'Won',
    notes: 'Converted to Job JOB-4001 successfully. First batch dispatched.',
    probabilityPercent: 100,
    createdDate: '2026-08-25'
  },
  {
    id: 'LEAD-804',
    customerId: 'CUST-1004',
    customerName: 'Malabar Estate Resettlement Project',
    requirementTitle: 'Estate Retaining Wall & Stone Masonry Package',
    requirementType: 'Laterite Masonry Work',
    source: 'Quarry Site Visit',
    estimatedValue: 1950000,
    salesPerson: 'Suresh Babu (Wayanad Liaison)',
    followUpDate: '2026-09-26',
    status: 'Contacted',
    notes: 'Visited Meppadi tea estate site; surveying slope contours and delivery paths.',
    probabilityPercent: 50,
    createdDate: '2026-09-19'
  },
  {
    id: 'LEAD-805',
    customerId: 'CUST-1005',
    customerName: 'Ashraf M. Haji (Villa & Commercial Developer)',
    requirementTitle: 'Commercial Complex Soling & Earthwork Contract',
    requirementType: 'Earthmoving & Grading',
    source: 'RZ® Chat',
    estimatedValue: 1200000,
    salesPerson: 'Nafid Khan (RZ Regional Lead)',
    followUpDate: '2026-09-23',
    status: 'Quotation',
    notes: 'Quotation QT-2026-045 submitted via RZ Chat; client reviewing equipment schedule.',
    probabilityPercent: 65,
    createdDate: '2026-09-16'
  }
];

export const SAMPLE_QUOTATIONS: Quotation[] = [
  {
    quotationNumber: 'QT-2026-042',
    date: '2026-09-12',
    customerId: 'CUST-1001',
    customerName: 'National Highways Infrastructure Trust (NHIT)',
    requirementId: 'REQ-2026-001',
    validUntil: '2026-10-15',
    items: [
      {
        id: 'ITEM-1',
        description: '40mm Granular Sub-base (GSB) Machine Crushed Aggregate',
        quantity: 25000,
        unit: 'MT',
        rate: 145,
        discountPercent: 2,
        taxPercent: 5,
        totalAmount: 3731175
      },
      {
        id: 'ITEM-2',
        description: '20mm Graded Stone Metal (MORTH Standard)',
        quantity: 15000,
        unit: 'MT',
        rate: 220,
        discountPercent: 2,
        taxPercent: 5,
        totalAmount: 3395700
      },
      {
        id: 'ITEM-3',
        description: 'Granular Dust & Stone Screening Fill Material',
        quantity: 5000,
        unit: 'MT',
        rate: 85,
        discountPercent: 0,
        taxPercent: 5,
        totalAmount: 446250
      },
      {
        id: 'ITEM-4',
        description: 'Dedicated Weighbridge & Logistics Dispatch Coordination',
        quantity: 1,
        unit: 'Lump-Sum',
        rate: 150000,
        discountPercent: 0,
        taxPercent: 18,
        totalAmount: 177000
      }
    ],
    subtotal: 7350000,
    discountTotal: 138600,
    taxTotal: 388725,
    grandTotal: 7750125,
    paymentTerms: '15% Mobilization advance, running monthly RA bill payments within 30 days',
    deliveryTerms: 'FOR Job Site, delivered via RZ Registered Fleet with electronic gate passes',
    notes: 'Rates are firm and fixed for 90 days from agreement execution. Diesel fluctuation clause applicable if price varies > ₹5/L.',
    status: 'Accepted',
    preparedBy: 'Er. Anand Kumar'
  },
  {
    quotationNumber: 'QT-2026-043',
    date: '2026-09-15',
    customerId: 'CUST-1002',
    customerName: 'Sobha Horizon Developers Pvt Ltd',
    requirementId: 'REQ-2026-002',
    validUntil: '2026-10-10',
    items: [
      {
        id: 'ITEM-1',
        description: 'Controlled Rock Blasting & Drilling with Non-Electric Systems',
        quantity: 12000,
        unit: 'Cu.m',
        rate: 185,
        discountPercent: 3,
        taxPercent: 18,
        totalAmount: 2541888
      },
      {
        id: 'ITEM-2',
        description: 'Hydraulic Breaker Secondary Fragmentation & Muck Shifting',
        quantity: 10000,
        unit: 'Cu.m',
        rate: 120,
        discountPercent: 0,
        taxPercent: 18,
        totalAmount: 1416000
      }
    ],
    subtotal: 3420000,
    discountTotal: 66600,
    taxTotal: 603688,
    grandTotal: 3957088,
    paymentTerms: '20% Advance, weekly progress billing certified by structural engineer',
    deliveryTerms: 'Ex-site muck loading with contractor tippers',
    notes: 'Vibration monitoring seismograph deployment included in rates.',
    status: 'Negotiation',
    preparedBy: 'Praveen Shetty'
  },
  {
    quotationNumber: 'QT-2026-044',
    date: '2026-09-02',
    customerId: 'CUST-1003',
    customerName: 'Coastal Precast & Infra Solutions',
    requirementId: 'REQ-2026-003',
    validUntil: '2026-09-30',
    items: [
      {
        id: 'ITEM-1',
        description: 'VSI Washed Manufactured Concrete Sand (Zone II)',
        quantity: 6000,
        unit: 'MT',
        rate: 260,
        discountPercent: 0,
        taxPercent: 5,
        totalAmount: 1638000
      },
      {
        id: 'ITEM-2',
        description: '10mm Single Size Crushed Granite Chips',
        quantity: 3500,
        unit: 'MT',
        rate: 240,
        discountPercent: 0,
        taxPercent: 5,
        totalAmount: 882000
      }
    ],
    subtotal: 2400000,
    discountTotal: 0,
    taxTotal: 120000,
    grandTotal: 2520000,
    paymentTerms: 'Weekly running account payment against electronic weighment vouchers',
    deliveryTerms: 'Delivered at Baikampady Casting Yard',
    notes: 'Test certificates for fineness modulus (FM 2.6 - 2.8) attached with each dispatch.',
    status: 'Converted',
    preparedBy: 'Anand Kumar'
  }
];

export const SAMPLE_AGREEMENTS: Agreement[] = [
  {
    agreementNumber: 'AGR-2026-018',
    customerName: 'National Highways Infrastructure Trust (NHIT)',
    customerId: 'CUST-1001',
    jobId: 'JOB-4002',
    quotationNumber: 'QT-2026-042',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    contractValue: 7750125,
    scopeSummary: 'Comprehensive supply and staged dispatch of 45,000 MT 40mm GSB and 20mm road aggregate for NH-66 Suratkal Bypass',
    paymentTerms: '15% Advance, Monthly RA Bills certified within 15 days, 5% Retention held for 6 months post-delivery',
    retentionPercent: 5,
    advancePercent: 15,
    milestonesCount: 4,
    termsAndConditions: 'Penalty of 0.5% per week of delay up to a max of 5%. Force Majeure applicable. Electronic dispatch slips mandatory.',
    documentsCount: 6,
    signatureStatus: 'Fully Executed (E-Signed)',
    status: 'Active',
    signedDate: '2026-09-18'
  },
  {
    agreementNumber: 'AGR-2026-019',
    customerName: 'Coastal Precast & Infra Solutions',
    customerId: 'CUST-1003',
    jobId: 'JOB-4001',
    quotationNumber: 'QT-2026-044',
    startDate: '2026-09-05',
    endDate: '2026-10-30',
    contractValue: 2520000,
    scopeSummary: 'Dedicated batch supply of 9,500 MT VSI Concrete Sand and 10mm aggregate for railway viaduct precast casting',
    paymentTerms: 'Weekly billing with 7 days credit. No retention applicable.',
    retentionPercent: 0,
    advancePercent: 10,
    milestonesCount: 3,
    termsAndConditions: 'All batches subject to 3-day quality checks. Rejection policy applies if silt > 3.5%.',
    documentsCount: 4,
    signatureStatus: 'Fully Executed (E-Signed)',
    status: 'Active',
    signedDate: '2026-09-04'
  },
  {
    agreementNumber: 'AGR-2026-020',
    customerName: 'Sobha Horizon Developers Pvt Ltd',
    customerId: 'CUST-1002',
    jobId: 'JOB-4003',
    quotationNumber: 'QT-2026-043',
    startDate: '2026-10-15',
    endDate: '2026-11-30',
    contractValue: 3957088,
    scopeSummary: 'Rock blasting, breaker excavation, and ground engineering for multi-tier basement podium',
    paymentTerms: '20% Mobilization advance, 75% running progress bills, 5% Retention',
    retentionPercent: 5,
    advancePercent: 20,
    milestonesCount: 3,
    termsAndConditions: 'Contractor responsible for all explosive safety licensing, insurance, and statutory permissions.',
    documentsCount: 8,
    signatureStatus: 'Pending Client Signature',
    status: 'Under Review'
  }
];

export const SAMPLE_WORK_ORDERS: WorkOrder[] = [
  {
    workOrderNumber: 'WO-2026-104',
    customerName: 'Coastal Precast & Infra Solutions',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    contractorName: 'RZ Minetrix Mining & Logistics Division',
    subcontractorName: 'Coastal Blasting & Haulage Services',
    scope: 'Production, washing, stockpiling, and daily transport of 300 MT VSI Sand and 150 MT 10mm chips',
    startDate: '2026-09-05',
    endDate: '2026-10-30',
    budget: 1750000,
    materials: 'Raw pit boulder from Bantwal Quarry Block B, VSI crusher electricity and water',
    workersAllocated: 14,
    vehiclesAllocated: 6,
    supervisor: 'Mohammed Tariq (Crusher Supervisor)',
    priority: 'High',
    instructions: 'Maintain 2,000 MT safety buffer at crusher yard. Ensure truck tarpaulins tied securely before highway dispatch.',
    documentsCount: 5,
    status: 'In Progress'
  },
  {
    workOrderNumber: 'WO-2026-105',
    customerName: 'National Highways Infrastructure Trust (NHIT)',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    contractorName: 'Apex Infrastructure & Mining Ltd',
    subcontractorName: 'Dakshina Logistics Fleet Union',
    scope: 'Haulage of 45,000 MT crushed rock from Karkala Crusher Plant #2 to NH-66 chainage dumping points',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    budget: 5200000,
    materials: '40mm GSB and 20mm graded blue granite',
    workersAllocated: 22,
    vehiclesAllocated: 14,
    supervisor: 'Er. Sandeep Hegde & Vikram Singh',
    priority: 'Urgent',
    instructions: 'Night-time dumping preferred between 9 PM and 6 AM. Weighment at certified electronic weighbridge with dual camera capture.',
    documentsCount: 6,
    status: 'Approved'
  },
  {
    workOrderNumber: 'WO-2026-106',
    customerName: 'Sobha Horizon Developers Pvt Ltd',
    jobId: 'JOB-4003',
    jobName: 'Kannur Hills Basement Controlled Rock Blasting & Clearing',
    contractorName: 'South Indian Mining & Drilling Corp',
    subcontractorName: 'Precision Explosive Services Ltd',
    scope: 'Drilling 80mm shot holes, blast pattern layout, muffle blasting, and excavator muck loading',
    startDate: '2026-10-15',
    endDate: '2026-11-30',
    budget: 2600000,
    materials: 'Class 2 slurry explosives, detonating cord, electric delay detonators',
    workersAllocated: 18,
    vehiclesAllocated: 8,
    supervisor: 'Rajesh Menon & Site Safety Mate',
    priority: 'High',
    instructions: 'Ensure sirens sounded 10 mins before blast. Public road traffic stopped by marshals for 15 minutes during each round.',
    documentsCount: 4,
    status: 'Draft'
  }
];

export const SAMPLE_JOBS: ContractJob[] = [
  {
    id: 'JOB-4001',
    name: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    customerName: 'Coastal Precast & Infra Solutions',
    customerId: 'CUST-1003',
    agreementNumber: 'AGR-2026-019',
    workOrderNumber: 'WO-2026-104',
    location: 'Baikampady Industrial Estate Yard, Mangalore',
    district: 'Dakshina Kannada',
    startDate: '2026-09-05',
    expectedCompletion: '2026-10-30',
    contractValue: 2520000,
    budget: 1750000,
    actualCost: 1120000,
    billedAmount: 1650000,
    receivedAmount: 1420000,
    progressPercent: 68,
    manager: 'Er. Anand Kumar',
    supervisor: 'Mohammed Tariq',
    contractor: 'RZ Minetrix Mining & Logistics Division',
    status: 'In Progress',
    priority: 'High',
    category: 'Crushing & Aggregates'
  },
  {
    id: 'JOB-4002',
    name: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    customerName: 'National Highways Infrastructure Trust (NHIT)',
    customerId: 'CUST-1001',
    agreementNumber: 'AGR-2026-018',
    workOrderNumber: 'WO-2026-105',
    location: 'NH-66 Suratkal - Mulki Km 342-358',
    district: 'Dakshina Kannada',
    startDate: '2026-10-01',
    expectedCompletion: '2026-12-31',
    contractValue: 7750125,
    budget: 5200000,
    actualCost: 450000,
    billedAmount: 1162518, // Advance bill
    receivedAmount: 1162518,
    progressPercent: 18,
    manager: 'Er. Anand Kumar',
    supervisor: 'Vikram Singh',
    contractor: 'Apex Infrastructure & Mining Ltd',
    status: 'Assigned',
    priority: 'Urgent',
    category: 'Road & Infrastructure'
  },
  {
    id: 'JOB-4003',
    name: 'Kannur Hills Basement Controlled Rock Blasting & Clearing',
    customerName: 'Sobha Horizon Developers Pvt Ltd',
    customerId: 'CUST-1002',
    agreementNumber: 'AGR-2026-020',
    workOrderNumber: 'WO-2026-106',
    location: 'Horizon Heights, MG Road, Kannur',
    district: 'Kannur',
    startDate: '2026-10-15',
    expectedCompletion: '2026-11-30',
    contractValue: 3957088,
    budget: 2600000,
    actualCost: 180000,
    billedAmount: 0,
    receivedAmount: 0,
    progressPercent: 8,
    manager: 'Praveen Shetty',
    supervisor: 'Site Safety Mate',
    contractor: 'South Indian Mining & Drilling Corp',
    status: 'Planning',
    priority: 'High',
    category: 'Quarrying'
  },
  {
    id: 'JOB-4004',
    name: 'Bantwal Pit Face Rock Excavation & Stockpile Loading',
    customerName: 'Bantwal Quarry Concession Group',
    customerId: 'CUST-1001',
    agreementNumber: 'AGR-2026-011',
    workOrderNumber: 'WO-2026-092',
    location: 'Bantwal Quarry Block B Pit #02',
    district: 'Dakshina Kannada',
    startDate: '2026-08-01',
    expectedCompletion: '2026-09-30',
    actualCompletion: '2026-09-22',
    contractValue: 3060000,
    budget: 2200000,
    actualCost: 2095000,
    billedAmount: 3060000,
    receivedAmount: 2950000,
    progressPercent: 100,
    manager: 'Vikram Singh',
    supervisor: 'Ramesh Shenoy',
    contractor: 'Coastal Blasting & Haulage Services',
    status: 'Completed',
    priority: 'Medium',
    category: 'Quarrying'
  },
  {
    id: 'JOB-4005',
    name: 'Malabar Highland Tea Estate Retaining Wall & Terracing',
    customerName: 'Malabar Estate Resettlement Project',
    customerId: 'CUST-1004',
    agreementNumber: 'AGR-2026-015',
    workOrderNumber: 'WO-2026-098',
    location: 'Sector 4, Meppadi, Wayanad',
    district: 'Wayanad',
    startDate: '2026-08-15',
    expectedCompletion: '2026-09-20',
    contractValue: 1950000,
    budget: 1400000,
    actualCost: 1480000,
    billedAmount: 1100000,
    receivedAmount: 850000,
    progressPercent: 52,
    manager: 'Suresh Babu',
    supervisor: 'Gopalakrishnan',
    contractor: 'Highland Stone Masons Guild',
    status: 'Delayed',
    priority: 'High',
    category: 'Building Works'
  }
];

export const SAMPLE_JOB_SCOPES: JobScopeItem[] = [
  {
    id: 'SCP-101',
    jobId: 'JOB-4001',
    scopeItem: 'VSI Manufactured Concrete Sand Production & Washing',
    description: 'Crushing raw granite bouldering, washing in sand washer, and drying on drainage slab',
    quantity: 6000,
    unit: 'MT',
    rate: 260,
    amount: 1560000,
    responsiblePerson: 'Mohammed Tariq',
    startDate: '2026-09-05',
    endDate: '2026-10-25',
    status: 'In Progress'
  },
  {
    id: 'SCP-102',
    jobId: 'JOB-4001',
    scopeItem: '10mm Single Size Graded Granite Crushed Aggregate',
    description: 'Secondary cone crushing and circular screen fractionation',
    quantity: 3500,
    unit: 'MT',
    rate: 240,
    amount: 840000,
    responsiblePerson: 'Mohammed Tariq',
    startDate: '2026-09-10',
    endDate: '2026-10-28',
    status: 'In Progress'
  },
  {
    id: 'SCP-103',
    jobId: 'JOB-4001',
    scopeItem: 'Transport and Weighment Certification to Baikampady',
    description: 'Fleet haulage using GPS monitored multi-axle tippers',
    quantity: 9500,
    unit: 'MT',
    rate: 12,
    amount: 114000,
    responsiblePerson: 'Logistics Desk',
    startDate: '2026-09-06',
    endDate: '2026-10-30',
    status: 'In Progress'
  }
];

export const SAMPLE_JOB_MILESTONES: JobMilestone[] = [
  {
    id: 'MLS-201',
    jobId: 'JOB-4001',
    milestone: 'Milestone 1: 30% Supply Volume (2,850 MT Delivered)',
    description: 'Initial delivery run with verified sieve analysis certificates',
    targetDate: '2026-09-18',
    amount: 756000,
    percentage: 30,
    responsiblePerson: 'Mohammed Tariq',
    status: 'Completed'
  },
  {
    id: 'MLS-202',
    jobId: 'JOB-4001',
    milestone: 'Milestone 2: 70% Supply Volume (6,650 MT Delivered)',
    description: 'Mid-contract volume target with interim payment certification',
    targetDate: '2026-10-08',
    amount: 1008000,
    percentage: 40,
    responsiblePerson: 'Mohammed Tariq',
    status: 'In Progress'
  },
  {
    id: 'MLS-203',
    jobId: 'JOB-4001',
    milestone: 'Milestone 3: 100% Final Reconciliation & Handover',
    description: 'Final weight tally reconciliation and balance clearance',
    targetDate: '2026-10-30',
    amount: 756000,
    percentage: 30,
    responsiblePerson: 'Er. Anand Kumar',
    status: 'Pending'
  }
];

export const SAMPLE_PROGRESS_UPDATES: JobProgressUpdate[] = [
  {
    id: 'PRG-301',
    date: '2026-09-22',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    progressPercent: 68,
    workCompleted: 'Dispatched 480 MT VSI Sand and 220 MT 10mm chips today across 18 trips. Quality test FM 2.74 verified.',
    materialsUsed: 'Raw Granite Feed: 750 MT, Process water: 12,000 L',
    workersCount: 14,
    vehiclesCount: 6,
    notes: 'No mechanical breakdown; plant operated at 92% efficiency. Client acknowledged receiving all 18 truckloads.',
    photosCount: 4,
    submittedBy: 'Mohammed Tariq'
  },
  {
    id: 'PRG-302',
    date: '2026-09-21',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    progressPercent: 62,
    workCompleted: 'Processed 610 MT VSI Sand. Pre-screened 10mm chips stockpiled in covered dry bay.',
    materialsUsed: 'Raw Granite Feed: 680 MT',
    workersCount: 14,
    vehiclesCount: 5,
    notes: 'Rain delay of 45 mins in afternoon, compensated with extra hour shift.',
    photosCount: 2,
    submittedBy: 'Mohammed Tariq'
  },
  {
    id: 'PRG-303',
    date: '2026-09-20',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    progressPercent: 18,
    workCompleted: 'Mobilized primary jaw crusher and set up mobile weighbridge calibration booth on site.',
    materialsUsed: 'Calibration test weights: 40 MT',
    workersCount: 18,
    vehiclesCount: 8,
    notes: 'Weighbridge calibrated and stamped by Weights & Measures Inspectorate.',
    photosCount: 6,
    submittedBy: 'Vikram Singh'
  }
];

export const SAMPLE_CONTRACTORS: Contractor[] = [
  {
    id: 'CONT-501',
    name: 'Coastal Blasting & Haulage Services',
    company: 'Coastal Earth Movers & Mining JV',
    phone: '+91 98451 09822',
    email: 'contact@coastalminingjv.com',
    address: 'NH-66 Bypass Road, Baikampady, Mangalore',
    gst: '29AAHFC2291N1ZG',
    serviceType: 'Controlled Rock Blasting, Drilling & Heavy Haulage',
    contractValue: 4800000,
    activeJobsCount: 3,
    paymentTerms: 'Bi-weekly payments with 5% retention',
    status: 'Active',
    documentsCount: 12,
    rating: 4.8
  },
  {
    id: 'CONT-502',
    name: 'Apex Infrastructure & Mining Ltd',
    company: 'Apex Infra Concessionaires',
    phone: '+91 94480 33811',
    email: 'apexinfra.operations@gmail.com',
    address: 'Karkala Industrial Zone, Udupi',
    gst: '29AABCA7741P1ZW',
    serviceType: 'Mobile Crushing, Screening & Highway Sub-base Spreading',
    contractValue: 8200000,
    activeJobsCount: 2,
    paymentTerms: 'Monthly certified RA bills with 30-day payment cycle',
    status: 'Active',
    documentsCount: 8,
    rating: 4.6
  },
  {
    id: 'CONT-503',
    name: 'South Indian Mining & Drilling Corp',
    company: 'South Indian Drillers & Blasters LLP',
    phone: '+91 97422 66019',
    email: 'siminingcorp@rediffmail.com',
    address: 'Calicut Road, Kannur',
    gst: '32AACCS8819Q1ZP',
    serviceType: 'Deep-hole Drilling, Pre-split Blasting, Muffle Rock Extraction',
    contractValue: 3600000,
    activeJobsCount: 1,
    paymentTerms: 'Per cubic meter certified volume',
    status: 'Active',
    documentsCount: 7,
    rating: 4.7
  },
  {
    id: 'CONT-504',
    name: 'Highland Stone Masons Guild',
    company: 'Wayanad Hill Builders Cooperative',
    phone: '+91 94950 44102',
    email: 'highlandmasons@wayanadcoop.in',
    address: 'Main Town, Meppadi, Wayanad',
    gst: '32AAACH4910M1ZC',
    serviceType: 'Laterite Stone Masonry, Hillside Retaining Walls & Gabion Boxes',
    contractValue: 1400000,
    activeJobsCount: 1,
    paymentTerms: 'Weekly running labour billing',
    status: 'Active',
    documentsCount: 5,
    rating: 4.2
  }
];

export const SAMPLE_SUBCONTRACTORS: Subcontractor[] = [
  {
    id: 'SUB-301',
    subcontractor: 'Precision Explosive Services Ltd',
    parentContractor: 'Coastal Blasting & Haulage Services',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    scope: 'Supply of non-electric detonators, shock tubes, and magazine delivery',
    contractValue: 420000,
    startDate: '2026-09-08',
    endDate: '2026-10-20',
    paymentTerms: 'Cash against magazine gate delivery',
    status: 'Active',
    documentsCount: 4
  },
  {
    id: 'SUB-302',
    subcontractor: 'Dakshina Logistics Fleet Union',
    parentContractor: 'Apex Infrastructure & Mining Ltd',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    scope: 'Sub-chartered 10 x 12-Wheeler Tippers for night highway hauling',
    contractValue: 1850000,
    startDate: '2026-10-01',
    endDate: '2026-12-15',
    paymentTerms: 'Per metric ton haulage with diesel top-up credit card',
    status: 'Assigned',
    documentsCount: 6
  },
  {
    id: 'SUB-303',
    subcontractor: 'Malabar Hydraulic Breakers & Hire',
    parentContractor: 'South Indian Mining & Drilling Corp',
    jobId: 'JOB-4003',
    jobName: 'Kannur Hills Basement Controlled Rock Blasting & Clearing',
    scope: '2 x 20-Ton Excavators equipped with Soosan hydraulic rock chisels',
    contractValue: 680000,
    startDate: '2026-10-18',
    endDate: '2026-11-25',
    paymentTerms: 'Hourly meter hire at ₹2,200/hr wet rate',
    status: 'Under Review',
    documentsCount: 3
  }
];

export const SAMPLE_JOB_WORKERS: JobWorker[] = [
  {
    id: 'WRK-701',
    workerName: 'Suresh Kumar Yadav',
    employeeId: 'EMP-0418',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    contractor: 'Coastal Blasting & Haulage Services',
    role: 'VSI Plant Senior Operator',
    dailyRate: 950,
    attendanceDays: 22,
    overtimeHours: 16,
    battaAmount: 2200,
    totalEarnings: 24900,
    status: 'Present On-Site'
  },
  {
    id: 'WRK-702',
    workerName: 'Basappa G. Nayak',
    employeeId: 'EMP-0422',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    contractor: 'Coastal Blasting & Haulage Services',
    role: 'Sand Washer & Screen Fitter',
    dailyRate: 850,
    attendanceDays: 21,
    overtimeHours: 12,
    battaAmount: 2100,
    totalEarnings: 21050,
    status: 'Present On-Site'
  },
  {
    id: 'WRK-703',
    workerName: 'Ranjith Nair',
    employeeId: 'EMP-0390',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    contractor: 'RZ Minetrix Core Crew',
    role: 'Quality Control Laboratory Tech',
    dailyRate: 1100,
    attendanceDays: 23,
    overtimeHours: 8,
    battaAmount: 2300,
    totalEarnings: 28400,
    status: 'Present On-Site'
  },
  {
    id: 'WRK-704',
    workerName: 'Muneer P. K.',
    employeeId: 'EMP-0511',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    contractor: 'Apex Infrastructure & Mining Ltd',
    role: 'Weighbridge Systems Controller',
    dailyRate: 800,
    attendanceDays: 19,
    overtimeHours: 14,
    battaAmount: 1900,
    totalEarnings: 18100,
    status: 'Present On-Site'
  },
  {
    id: 'WRK-705',
    workerName: 'Lakhwinder Singh',
    employeeId: 'EMP-0604',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    contractor: 'Apex Infrastructure & Mining Ltd',
    role: 'Vibratory Soil Compactor Pilot',
    dailyRate: 1000,
    attendanceDays: 18,
    overtimeHours: 20,
    battaAmount: 1800,
    totalEarnings: 21800,
    status: 'Off-Duty'
  }
];

export const SAMPLE_JOB_MATERIALS: JobMaterial[] = [
  {
    id: 'MAT-601',
    materialName: 'Raw Pit Granite Boulder (0-300mm)',
    productType: 'Primary Excavated Boulder',
    source: 'Quarry',
    sourceFacilityName: 'Bantwal Quarry Block B Pit #02',
    supplier: 'RZ Quarry Concession Division',
    quantity: 11000,
    unit: 'MT',
    rate: 110,
    amount: 1210000,
    requiredDate: '2026-09-05',
    receivedQuantity: 7400,
    usedQuantity: 6900,
    remainingQuantity: 500,
    status: 'Partially Delivered',
    jobId: 'JOB-4001'
  },
  {
    id: 'MAT-602',
    materialName: 'VSI Manufactured Concrete Sand (Zone-II)',
    productType: 'Washed VSI M-Sand',
    source: 'Crusher',
    sourceFacilityName: 'Karkala Mega Crusher Plant #2',
    supplier: 'RZ Crusher Division',
    quantity: 6000,
    unit: 'MT',
    rate: 260,
    amount: 1560000,
    requiredDate: '2026-09-08',
    receivedQuantity: 4200,
    usedQuantity: 4080,
    remainingQuantity: 120,
    status: 'Partially Delivered',
    jobId: 'JOB-4001'
  },
  {
    id: 'MAT-603',
    materialName: '10mm Graded Granite Chips',
    productType: 'Single Size Blue Aggregate',
    source: 'Crusher',
    sourceFacilityName: 'Karkala Mega Crusher Plant #2',
    supplier: 'RZ Crusher Division',
    quantity: 3500,
    unit: 'MT',
    rate: 240,
    amount: 840000,
    requiredDate: '2026-09-10',
    receivedQuantity: 2450,
    usedQuantity: 2380,
    remainingQuantity: 70,
    status: 'Partially Delivered',
    jobId: 'JOB-4001'
  },
  {
    id: 'MAT-604',
    materialName: 'Machine Cut Red Laterite Stone (30x20x15cm)',
    productType: 'Natural Dimension Stone',
    source: 'Quarry',
    sourceFacilityName: 'Wayanad Laterite Block #04',
    supplier: 'Malabar Quarry Cluster',
    quantity: 30000,
    unit: 'Nos',
    rate: 42,
    amount: 1260000,
    requiredDate: '2026-08-18',
    receivedQuantity: 18000,
    usedQuantity: 16500,
    remainingQuantity: 1500,
    status: 'Partially Delivered',
    jobId: 'JOB-4005'
  },
  {
    id: 'MAT-605',
    materialName: 'Ordinary Portland Cement (OPC 53 Grade)',
    productType: 'Bagged Cement',
    source: 'Supplier',
    sourceFacilityName: 'UltraTech Regional Distribution Hub',
    supplier: 'Malabar Building Supplies Ltd',
    quantity: 600,
    unit: 'Bags',
    rate: 380,
    amount: 228000,
    requiredDate: '2026-08-20',
    receivedQuantity: 600,
    usedQuantity: 450,
    remainingQuantity: 150,
    status: 'Fully Delivered',
    jobId: 'JOB-4005'
  }
];

export const SAMPLE_JOB_VEHICLES: JobVehicleAllocation[] = [
  {
    id: 'VEH-801',
    vehicleNumber: 'KA-19-EA-4412',
    vehicleType: '12-Wheeler Heavy Tipper (28MT)',
    owner: 'RZ Minetrix Logistics Fleet',
    driver: 'Mahesh Gowda',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    tripsCount: 42,
    purpose: 'Crusher to Precast Yard Haulage',
    startDate: '2026-09-06',
    endDate: '2026-10-30',
    ratePerTripOrDay: 1800,
    rateType: 'Per Trip',
    totalCost: 75600,
    status: 'Active on Site'
  },
  {
    id: 'VEH-802',
    vehicleNumber: 'KA-19-EB-8801',
    vehicleType: '12-Wheeler Heavy Tipper (28MT)',
    owner: 'RZ Minetrix Logistics Fleet',
    driver: 'Ismail K.',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    tripsCount: 38,
    purpose: 'Crusher to Precast Yard Haulage',
    startDate: '2026-09-06',
    endDate: '2026-10-30',
    ratePerTripOrDay: 1800,
    rateType: 'Per Trip',
    totalCost: 68400,
    status: 'Active on Site'
  },
  {
    id: 'VEH-803',
    vehicleNumber: 'KA-20-C-9912',
    vehicleType: '10-Wheeler Tipper (20MT)',
    owner: 'Coastal Logistics Partner',
    driver: 'Sunil Poojary',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    tripsCount: 34,
    purpose: 'Quarry boulder to Crusher Plant hopper',
    startDate: '2026-09-05',
    endDate: '2026-10-30',
    ratePerTripOrDay: 1400,
    rateType: 'Per Trip',
    totalCost: 47600,
    status: 'In Transit'
  },
  {
    id: 'VEH-804',
    vehicleNumber: 'KL-12-Q-3310',
    vehicleType: 'CAT 320D Hydraulic Heavy Excavator',
    owner: 'Apex Equipment Rentals',
    driver: 'Jaleel Rehman',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    tripsCount: 16,
    purpose: 'Sub-base spreading & leveling',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    ratePerTripOrDay: 16000,
    rateType: 'Per Day',
    totalCost: 256000,
    status: 'Standby'
  }
];

export const SAMPLE_JOB_EXPENSES: JobExpense[] = [
  {
    id: 'EXP-901',
    date: '2026-09-21',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    category: 'Fuel',
    amount: 42500,
    paymentMethod: 'Company Card',
    reference: 'HPCL Fuel Stn IOC-9921',
    description: 'Diesel top-up for 6 tippers (450 Litres @ ₹94.44/L)',
    hasAttachment: true,
    approvedBy: 'Er. Anand Kumar'
  },
  {
    id: 'EXP-902',
    date: '2026-09-20',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    category: 'Labour',
    amount: 32000,
    paymentMethod: 'Bank Transfer',
    reference: 'NEFT-CRW-SEP3',
    description: 'Weekly advance wages for plant operators & helpers',
    hasAttachment: true,
    approvedBy: 'Accounts Dept'
  },
  {
    id: 'EXP-903',
    date: '2026-09-18',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    category: 'Equipment',
    amount: 18500,
    paymentMethod: 'Bank Transfer',
    reference: 'TXN-VSI-SCN01',
    description: 'Replacement high-tensile wire mesh for 10mm vibrating screen',
    hasAttachment: true,
    approvedBy: 'Mohammed Tariq'
  },
  {
    id: 'EXP-904',
    date: '2026-09-15',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    category: 'Toll',
    amount: 6800,
    paymentMethod: 'UPI',
    reference: 'FASTag Auto-Debit Pack',
    description: 'NHAI Suratkal Toll Plaza FASTag pass monthly recharge',
    hasAttachment: false,
    approvedBy: 'Logistics Desk'
  },
  {
    id: 'EXP-905',
    date: '2026-09-12',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    category: 'Permit',
    amount: 25000,
    paymentMethod: 'Bank Transfer',
    reference: 'CHQ-PWD-KDR22',
    description: 'Department of Mines & Geology transit pass verification fee',
    hasAttachment: true,
    approvedBy: 'Er. Sandeep Hegde'
  }
];

export const SAMPLE_JOB_INVOICES: JobInvoice[] = [
  {
    invoiceNumber: 'INV-JOB-2026-088',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    customerId: 'CUST-1003',
    customerName: 'Coastal Precast & Infra Solutions',
    billingType: 'Milestone Billing',
    milestoneTitle: 'Milestone 1: 30% Volume Delivery Complete (2,850 MT)',
    contractValue: 2520000,
    previousBilled: 252000, // 10% advance
    currentBill: 756000,
    taxAmount: 37800,
    retentionDeduction: 0,
    totalInvoiceAmount: 793800,
    paidAmount: 793800,
    balanceAmount: 0,
    date: '2026-09-18',
    dueDate: '2026-09-25',
    status: 'Paid'
  },
  {
    invoiceNumber: 'INV-JOB-2026-092',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    customerId: 'CUST-1003',
    customerName: 'Coastal Precast & Infra Solutions',
    billingType: 'Progress Billing',
    milestoneTitle: 'Running Bill #2: 3,800 MT Dispatched',
    contractValue: 2520000,
    previousBilled: 1008000,
    currentBill: 642000,
    taxAmount: 32100,
    retentionDeduction: 0,
    totalInvoiceAmount: 674100,
    paidAmount: 374100,
    balanceAmount: 300000,
    date: '2026-09-21',
    dueDate: '2026-09-28',
    status: 'Partially Paid'
  },
  {
    invoiceNumber: 'INV-JOB-2026-095',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    customerId: 'CUST-1001',
    customerName: 'National Highways Infrastructure Trust (NHIT)',
    billingType: 'Advance',
    milestoneTitle: '15% Mobilization Advance per Agreement AGR-2026-018',
    contractValue: 7750125,
    previousBilled: 0,
    currentBill: 1162518,
    taxAmount: 58126,
    retentionDeduction: 0,
    totalInvoiceAmount: 1220644,
    paidAmount: 1220644,
    balanceAmount: 0,
    date: '2026-09-19',
    dueDate: '2026-10-05',
    status: 'Paid'
  },
  {
    invoiceNumber: 'INV-JOB-2026-074',
    jobId: 'JOB-4005',
    jobName: 'Malabar Highland Tea Estate Retaining Wall & Terracing',
    customerId: 'CUST-1004',
    customerName: 'Malabar Estate Resettlement Project',
    billingType: 'Progress Billing',
    milestoneTitle: 'Running Bill #1: Terracing & 15,000 Laterite Blocks',
    contractValue: 1950000,
    previousBilled: 300000,
    currentBill: 800000,
    taxAmount: 40000,
    retentionDeduction: 40000,
    totalInvoiceAmount: 800000,
    paidAmount: 550000,
    balanceAmount: 250000,
    date: '2026-09-01',
    dueDate: '2026-09-15',
    status: 'Overdue'
  }
];

export const SAMPLE_JOB_PAYMENTS: JobPayment[] = [
  {
    id: 'PAY-401',
    paymentDate: '2026-09-22',
    customerId: 'CUST-1003',
    customerName: 'Coastal Precast & Infra Solutions',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    invoiceNumber: 'INV-JOB-2026-092',
    amount: 374100,
    paymentMethod: 'NEFT / RTGS',
    reference: 'HDFC-N9928172901',
    paymentType: 'Running Settlement',
    remainingBalance: 300000
  },
  {
    id: 'PAY-402',
    paymentDate: '2026-09-20',
    customerId: 'CUST-1001',
    customerName: 'National Highways Infrastructure Trust (NHIT)',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    invoiceNumber: 'INV-JOB-2026-095',
    amount: 1220644,
    paymentMethod: 'NEFT / RTGS',
    reference: 'RBI-CMS-GOV-882194',
    paymentType: 'Advance',
    remainingBalance: 0
  },
  {
    id: 'PAY-403',
    paymentDate: '2026-09-19',
    customerId: 'CUST-1003',
    customerName: 'Coastal Precast & Infra Solutions',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    invoiceNumber: 'INV-JOB-2026-088',
    amount: 793800,
    paymentMethod: 'NEFT / RTGS',
    reference: 'HDFC-N8812901842',
    paymentType: 'Milestone Release',
    remainingBalance: 0
  }
];

export const SAMPLE_CHANGE_ORDERS: ChangeOrder[] = [
  {
    changeOrderNumber: 'CO-JOB-004',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    originalScope: '6,000 MT VSI Concrete Sand + 3,500 MT 10mm Stone Chips',
    changedScope: 'Additional 1,500 MT Plaster Sand with extra washing cycle',
    reason: 'Client requested ultra-fine plastering sand for architectural exposed beam finishing',
    additionalQuantity: '1,500 MT Plaster Sand',
    additionalCost: 285000,
    additionalRevenue: 420000,
    approvalStatus: 'Approved',
    approvedBy: 'K. V. Pai (Coastal Precast) & Er. Anand Kumar',
    date: '2026-09-16',
    documentsCount: 2,
    impactOnProfit: 135000
  },
  {
    changeOrderNumber: 'CO-JOB-005',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    originalScope: '45,000 MT 40mm GSB and 20mm road aggregate',
    changedScope: 'Extra 5,000 MT wet mix macadam (WMM) aggregate with pugmill mixing',
    reason: 'NHAI highway grade revision at Mulki river bridge ramp',
    additionalQuantity: '5,000 MT WMM',
    additionalCost: 720000,
    additionalRevenue: 1050000,
    approvalStatus: 'Submitted',
    date: '2026-09-20',
    documentsCount: 3,
    impactOnProfit: 330000
  }
];

export const SAMPLE_JOB_DOCUMENTS: JobDocument[] = [
  {
    id: 'DOC-101',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    title: 'Executed Bilateral Supply Agreement & Schedule',
    category: 'Agreements',
    fileName: 'AGR_2026_019_CoastalPrecast_Executed.pdf',
    fileSize: '2.4 MB',
    uploadDate: '2026-09-04',
    uploadedBy: 'Legal Dept',
    status: 'Verified'
  },
  {
    id: 'DOC-102',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    title: 'VSI M-Sand Fineness Modulus & Silt Sieve Test Certificate',
    category: 'Reports',
    fileName: 'LabTest_FM2.74_Baikampady_Batch09.pdf',
    fileSize: '840 KB',
    uploadDate: '2026-09-22',
    uploadedBy: 'Ranjith Nair (QC)',
    status: 'Verified'
  },
  {
    id: 'DOC-103',
    jobId: 'JOB-4001',
    jobName: 'Baikampady Precast Concrete Sand & Aggregate Supply',
    title: 'Tax Invoice INV-JOB-2026-088 Signed Stamp',
    category: 'Invoices',
    fileName: 'INV_JOB_2026_088_Signed.pdf',
    fileSize: '420 KB',
    uploadDate: '2026-09-18',
    uploadedBy: 'Accounts Dept',
    status: 'Verified'
  },
  {
    id: 'DOC-104',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    title: 'NHAI Work Order & Quality Specification Manual',
    category: 'Work Orders',
    fileName: 'NHAI_WO_2026_105_MORTH_Specs.pdf',
    fileSize: '5.1 MB',
    uploadDate: '2026-09-15',
    uploadedBy: 'Er. Anand Kumar',
    status: 'Verified'
  },
  {
    id: 'DOC-105',
    jobId: 'JOB-4002',
    jobName: 'NH-66 Suratkal to Mulki Sub-base Road Metal Mobilization',
    title: 'Department of Mines & Geology Mineral Transit License',
    category: 'Permits',
    fileName: 'DMG_Transit_Permit_NH66_BlockB.pdf',
    fileSize: '1.2 MB',
    uploadDate: '2026-09-14',
    uploadedBy: 'Er. Sandeep Hegde',
    status: 'Verified'
  }
];

export const SAMPLE_OTT_TASKS: OttTaskBridge[] = [
  {
    id: 'OTT-8801',
    title: 'Follow up with customer on Milestone #2 verification certificate',
    jobId: 'JOB-4001',
    customerOrContractor: 'Coastal Precast & Infra Solutions',
    category: 'Payment Follow-up',
    dueDate: '2026-09-24',
    priority: 'High',
    assignedTo: 'Er. Anand Kumar',
    status: 'Pending',
    source: 'Contract & Job Management / JOB-4001'
  },
  {
    id: 'OTT-8802',
    title: 'Visit job site: Inspect Mulki flyover mobile weighbridge calibration',
    jobId: 'JOB-4002',
    customerOrContractor: 'National Highways Infrastructure Trust (NHIT)',
    category: 'Visit Job Site',
    dueDate: '2026-09-25',
    priority: 'Urgent',
    assignedTo: 'Vikram Singh',
    status: 'In Progress',
    source: 'Contract & Job Management / JOB-4002'
  },
  {
    id: 'OTT-8803',
    title: 'Approve quotation QT-2026-043 for Sobha Horizon rock blasting',
    jobId: 'JOB-4003',
    customerOrContractor: 'Sobha Horizon Developers Pvt Ltd',
    category: 'Approve Quotation',
    dueDate: '2026-09-24',
    priority: 'High',
    assignedTo: 'Praveen Shetty',
    status: 'Pending',
    source: 'Contract & Job Management / JOB-4003'
  },
  {
    id: 'OTT-8804',
    title: 'Purchase material: Order additional 500 Litres hydraulic oil for plant',
    jobId: 'JOB-4001',
    customerOrContractor: 'Apex Crusher Supplies',
    category: 'Purchase Material',
    dueDate: '2026-09-26',
    priority: 'Medium',
    assignedTo: 'Mohammed Tariq',
    status: 'Pending',
    source: 'Contract & Job Management / JOB-4001'
  }
];

export const SAMPLE_SCOPE_ITEMS = SAMPLE_JOB_SCOPES;
export const SAMPLE_MILESTONES = SAMPLE_JOB_MILESTONES;
export const SAMPLE_JOB_PROGRESS = SAMPLE_PROGRESS_UPDATES;
export const SAMPLE_INVOICES = SAMPLE_JOB_INVOICES;
export const SAMPLE_PAYMENTS = SAMPLE_JOB_PAYMENTS;
export const SAMPLE_DOCUMENTS = SAMPLE_JOB_DOCUMENTS;
export const SAMPLE_WORKERS = SAMPLE_JOB_WORKERS;
export const SAMPLE_MATERIAL_ALLOCATIONS = SAMPLE_JOB_MATERIALS;
export const SAMPLE_VEHICLE_ALLOCATIONS = SAMPLE_JOB_VEHICLES;
export const SAMPLE_EXPENSES = SAMPLE_JOB_EXPENSES;
