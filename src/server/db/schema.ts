/**
 * RZ® Minetrix BOS - Shared Core Database Schema Definitions (Phase 16)
 * Follows Phase 15 Enterprise Database Standards:
 * - UUID v7 / UUID keys
 * - Multi-tenant hierarchy (tenant_id, company_id, branch_id, business_unit_id)
 * - Timestamps (created_at, updated_at)
 * - Tracking (created_by, updated_by, deleted_at)
 * - Optimistic concurrency (version)
 */

export interface Tenant {
  id: string;
  code: string;
  name: string;
  domain: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
  tier: 'ENTERPRISE' | 'BUSINESS' | 'STANDARD';
  settingsJson: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface Company {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  taxId: string;
  currency: string;
  country: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface Branch {
  id: string;
  tenantId: string;
  companyId: string;
  code: string;
  name: string;
  locationType: 'QUARRY' | 'CRUSHER' | 'DEPOT' | 'OFFICE' | 'YARD';
  address: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface BusinessUnit {
  id: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  code: string;
  name: string;
  unitType: 'MINING' | 'FLEET' | 'MATERIALS' | 'TRADING' | 'SERVICES';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface User {
  id: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  email: string;
  passwordHash: string;
  salt: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  department: string;
  designation: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'SUSPENDED';
  isMfaEnabled: boolean;
  linkedEmployeeId?: string;
  linkedDriverId?: string;
  linkedOperatorId?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface Role {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Permission {
  id: string;
  code: string; // e.g. mining:quarry:create, finance:invoice:approve, hrms:employee:view
  module: string; // Mining, Fleet, CRM, Finance, Shared Core, etc.
  action: string; // create, view, update, delete, approve, export
  description: string;
}

export interface UserRole {
  id: string;
  userId: string;
  roleId: string;
  tenantId: string;
  assignedAt: string;
  assignedBy: string;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permissionCode: string;
}

export interface MasterData {
  id: string;
  tenantId: string;
  category: 'UOM' | 'ITEM_CATEGORY' | 'NUMBER_SERIES' | 'CURRENCY' | 'TAX_CODE' | 'PAYMENT_TERM';
  code: string;
  name: string;
  valueJson: string; // Additional settings e.g. conversion rates, prefixes
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Document {
  id: string;
  tenantId: string;
  companyId: string;
  module: string; // Mining, Fleet, CRM, Finance, etc.
  entityType: string;
  entityId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storageKey: string;
  accessLevel: 'PUBLIC' | 'TENANT_PRIVATE' | 'RESTRICTED';
  uploaderUserId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  version: number;
}

export interface Notification {
  id: string;
  tenantId: string;
  recipientUserId: string;
  title: string;
  body: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  channel: 'IN_APP' | 'EMAIL' | 'WHATSAPP' | 'PUSH' | 'SMS';
  isRead: boolean;
  readAt?: string;
  linkUrl?: string;
  relatedModule?: string;
  relatedRecordType?: string;
  relatedRecordId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  actorUserId: string;
  actorEmail: string;
  action: string; // e.g. AUTH_LOGIN, USER_CREATE, QUARRY_APPROVE
  module: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  correlationId: string;
  beforeStateJson?: string;
  afterStateJson?: string;
  status: 'SUCCESS' | 'FAILURE';
  createdAt: string;
}

export interface WorkflowDefinition {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  entityType: string; // e.g. INVOICE, DISPATCH, PURCHASE_ORDER
  initialState: string;
  statesJson: string; // Array of states
  transitionsJson: string; // Allowed state transitions with required permission
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowInstance {
  id: string;
  tenantId: string;
  workflowDefinitionId: string;
  entityType: string;
  entityId: string;
  currentState: string;
  initiatedByUserId: string;
  status: 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowAction {
  id: string;
  tenantId: string;
  instanceId: string;
  fromState: string;
  toState: string;
  actionName: string;
  actorUserId: string;
  comments?: string;
  createdAt: string;
}

// ==========================================
// FLEET OPERATIONS & VEHICLE MANAGEMENT SCHEMAS
// ==========================================

export interface FleetVehicleCategory {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export type VehicleStatus = 
  | 'AVAILABLE' 
  | 'ASSIGNED' 
  | 'ON_TRIP' 
  | 'UNDER_MAINTENANCE' 
  | 'ACCIDENT' 
  | 'INACTIVE' 
  | 'SOLD' 
  | 'RETIRED';

export interface FleetVehicle {
  id: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  businessUnitId?: string;
  registrationNumber: string;
  vehicleType: string;
  categoryId?: string;
  categoryName: string;
  make: string;
  model: string;
  variant?: string;
  manufacturingYear: number;
  purchaseDate: string;
  purchaseValue: number;
  ownershipType: 'OWNED' | 'LEASED' | 'HIRED' | 'CUSTOMER_LINKED';
  ownerName: string;
  fuelType: 'DIESEL' | 'PETROL' | 'ELECTRIC' | 'CNG' | 'HYBRID';
  fuelCapacity: number;
  engineNumber: string;
  chassisNumber: string;
  color?: string;
  seatingCapacity: number;
  loadCapacity: number;
  currentOdometer: number;
  status: VehicleStatus;
  location: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface FleetVehicleDocument {
  id: string;
  tenantId: string;
  vehicleId: string;
  documentType: 'RC' | 'INSURANCE' | 'FITNESS' | 'PERMIT' | 'TAX' | 'PUC' | 'LICENSE' | 'SERVICE_INVOICE' | 'OTHER';
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  storageDocumentId?: string;
  fileReference?: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetDriver {
  id: string;
  tenantId: string;
  employeeId?: string;
  linkedUserId?: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseIssueDate: string;
  licenseExpiryDate: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED';
  joiningDate: string;
  emergencyContact?: string;
  address?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetVehicleAssignment {
  id: string;
  tenantId: string;
  vehicleId: string;
  primaryDriverId?: string;
  secondaryDriverId?: string;
  assignedEmployeeId?: string;
  companyId?: string;
  branchId?: string;
  businessUnitId?: string;
  assignmentStart: string;
  assignmentEnd?: string;
  purpose: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export type TripStatus = 'PLANNED' | 'DISPATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface FleetTrip {
  id: string;
  tenantId: string;
  tripNumber: string;
  vehicleId: string;
  driverId: string;
  source: string;
  destination: string;
  tripDate: string;
  startTime: string;
  endTime?: string;
  startOdometer: number;
  endOdometer?: number;
  distance: number;
  tripType: string;
  customerId?: string;
  customerName?: string;
  material?: string;
  quantity: number;
  loadReference?: string;
  deliveryReference?: string;
  status: TripStatus;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetFuelLog {
  id: string;
  tenantId: string;
  vehicleId: string;
  driverId?: string;
  logDate: string;
  fuelStation: string;
  fuelType: string;
  quantity: number;
  rate: number;
  amount: number;
  odometer: number;
  paymentMethod: string;
  invoiceNumber?: string;
  calculatedEfficiency?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FleetMaintenanceRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  maintenanceType: 'PREVENTIVE' | 'CORRECTIVE' | 'BREAKDOWN' | 'SERVICE' | 'INSPECTION';
  serviceDate: string;
  odometer: number;
  workshop: string;
  description: string;
  partsCost: number;
  labourCost: number;
  otherCost: number;
  totalCost: number;
  nextServiceDate?: string;
  nextServiceOdometer?: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface FleetComplianceRecord {
  id: string;
  tenantId: string;
  vehicleId: string;
  complianceType: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED';
  remarks?: string;
  createdAt: string;
}

export interface FleetOdometerLog {
  id: string;
  tenantId: string;
  vehicleId: string;
  logType: 'OPENING' | 'TRIP_READING' | 'FUEL_READING' | 'SERVICE_READING' | 'MANUAL_READING';
  reading: number;
  recordedAt: string;
  recordedByUserId?: string;
  referenceId?: string;
  notes?: string;
  isAuditCorrection: boolean;
}

export interface FleetVehicleExpense {
  id: string;
  tenantId: string;
  vehicleId: string;
  driverId?: string;
  tripId?: string;
  expenseCategory: string;
  expenseDate: string;
  amount: number;
  paymentStatus: string;
  referenceNumber?: string;
  remarks?: string;
  createdAt: string;
}

export interface FleetVehicleRevenue {
  id: string;
  tenantId: string;
  vehicleId: string;
  tripId?: string;
  revenueCategory: string;
  revenueDate: string;
  amount: number;
  invoiceNumber?: string;
  remarks?: string;
  createdAt: string;
}

export interface FleetVehicleAlert {
  id: string;
  tenantId: string;
  vehicleId?: string;
  alertType: 'DOCUMENT_EXPIRY' | 'SERVICE_DUE' | 'HIGH_FUEL_CONSUMPTION' | 'MAINTENANCE_OVERDUE' | 'VEHICLE_IDLE';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  isResolved: boolean;
  createdAt: string;
  resolvedAt?: string;
}

// ==========================================
// Phase 19: AI Load Exchange & Transport Marketplace
// ==========================================

export type LoadStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'MATCHING'
  | 'MATCHED'
  | 'BOOKED'
  | 'DISPATCHED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXPIRED';

export interface LoadRequest {
  id: string;
  tenantId: string;
  requestNumber: string;
  customerId: string;
  customerName: string;
  businessId?: string;
  materialId: string;
  materialName: string;
  source: string;
  destination: string;
  requiredDate: string;
  requiredTime: string;
  quantity: number;
  unit: string;
  vehicleType: string;
  vehicleCapacity: number;
  budget: number;
  specialRequirements?: string;
  status: LoadStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export type OfferStatus = 'SUBMITTED' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'WITHDRAWN';

export interface LoadOffer {
  id: string;
  tenantId: string;
  offerNumber: string;
  loadId: string;
  transporterId: string;
  vehicleId?: string;
  driverId?: string;
  quotedPrice: number;
  estimatedPickup: string;
  estimatedDelivery: string;
  remarks?: string;
  status: OfferStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoadMatch {
  id: string;
  tenantId: string;
  loadId: string;
  vehicleId?: string;
  driverId?: string;
  transporterId?: string;
  distance: number;
  estimatedTime: string;
  estimatedCost: number;
  offeredPrice: number;
  matchScore: number;
  availability: string;
  reasonCodes: string[];
  createdAt: string;
}

export type BookingStatus = 'CONFIRMED' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED';

export interface LoadBooking {
  id: string;
  tenantId: string;
  bookingNumber: string;
  loadId: string;
  offerId?: string;
  vehicleId: string;
  driverId: string;
  transporterId: string;
  customerId: string;
  customerName: string;
  agreedPrice: number;
  pickupDatetime: string;
  deliveryDatetime: string;
  status: BookingStatus;
  fleetTripId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransporterProfile {
  id: string;
  tenantId: string;
  businessId?: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  rating: number;
  totalTrips: number;
  completedTrips: number;
  cancellationRate: number;
  verifiedStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  serviceAreas: string[];
  vehicleTypes: string[];
  baseRatePerKm: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface TransporterServiceArea {
  id: string;
  tenantId: string;
  transporterId: string;
  region: string;
  state: string;
  city: string;
  primaryRoutes?: string;
  createdAt: string;
}

export interface MarketplacePricingRule {
  id: string;
  tenantId: string;
  materialId: string;
  materialName: string;
  vehicleType: string;
  baseFare: number;
  ratePerKm: number;
  ratePerTon: number;
  minCharge: number;
  surgeMultiplier: number;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceDelivery {
  id: string;
  tenantId: string;
  bookingId: string;
  loadId: string;
  tripId?: string;
  pickupTime?: string;
  deliveryTime?: string;
  receiverName: string;
  receiverContact: string;
  quantityDelivered: number;
  documentReference?: string;
  photoReference?: string;
  status: 'PENDING' | 'DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CONFIRMED';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceRating {
  id: string;
  tenantId: string;
  bookingId: string;
  tripId?: string;
  customerId: string;
  transporterId?: string;
  driverId?: string;
  vehicleId?: string;
  rating: number;
  review?: string;
  createdAt: string;
}

export type DisputeType = 'DELIVERY' | 'QUANTITY' | 'PRICE' | 'DAMAGE' | 'CANCELLATION' | 'OTHER';
export type DisputeStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'CLOSED';

export interface MarketplaceDispute {
  id: string;
  tenantId: string;
  disputeNumber: string;
  bookingId: string;
  loadId: string;
  raisedByUserId: string;
  disputeType: DisputeType;
  description: string;
  status: DisputeStatus;
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceMatchingEvent {
  id: string;
  tenantId: string;
  loadId: string;
  matchesFound: number;
  topMatchScore: number;
  triggerType: 'AUTO' | 'MANUAL';
  createdAt: string;
}

// ==========================================
// PHASE 20 — ENTERPRISE CRM, CUSTOMER 360 & SALES MANAGEMENT SUITE
// ==========================================

export type CustomerType = 'INDIVIDUAL' | 'BUSINESS' | 'DEALER' | 'CONTRACTOR' | 'TRANSPORTER' | 'SUPPLIER' | 'INSTITUTION' | 'GOVERNMENT';
export type CustomerStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'PROSPECT';

export interface CrmCustomer {
  id: string;
  tenantId: string;
  customerType: CustomerType;
  businessId?: string;
  displayName: string;
  legalName?: string;
  customerCode: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  taxIdentifier?: string;
  creditLimit: number;
  creditDays: number;
  status: CustomerStatus;
  source: string;
  assignedSalesUser?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

export interface CrmContact {
  id: string;
  tenantId: string;
  customerId: string;
  businessId?: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  whatsapp?: string;
  isPrimary: boolean;
  preferredLanguage?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export type LeadSource = 'Website' | 'WhatsApp' | 'Phone' | 'Referral' | 'Marketplace' | 'Walk-in' | 'Advertisement' | 'Existing Customer' | 'Other';
export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST' | 'DISQUALIFIED';

export interface CrmLead {
  id: string;
  tenantId: string;
  customerId?: string;
  customerName: string;
  phone: string;
  email?: string;
  source: LeadSource;
  campaign?: string;
  productService: string;
  estimatedValue: number;
  probability: number;
  expectedCloseDate: string;
  assignedUser?: string;
  notes?: string;
  status: LeadStatus;
  leadScore?: number;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'HOT';
  reasonCodes?: string[];
  createdAt: string;
  updatedAt: string;
}

export type OpportunityStage = 'LEAD' | 'QUALIFIED' | 'DISCOVERY' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';

export interface CrmOpportunity {
  id: string;
  tenantId: string;
  customerId: string;
  leadId?: string;
  title: string;
  value: number;
  probability: number;
  stage: OpportunityStage;
  expectedCloseDate: string;
  salesOwner?: string;
  productsServices: string[];
  competitors?: string;
  nextAction?: string;
  notes?: string;
  status: 'OPEN' | 'WON' | 'LOST' | 'ABANDONED';
  createdAt: string;
  updatedAt: string;
}

export type ActivityType = 'Call' | 'Meeting' | 'Email' | 'WhatsApp' | 'Visit' | 'Task' | 'Note' | 'Follow-up';
export type ActivityStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface CrmSalesActivity {
  id: string;
  tenantId: string;
  activityType: ActivityType;
  subject: string;
  customerId?: string;
  leadId?: string;
  opportunityId?: string;
  assignedUser?: string;
  dueDate?: string;
  completedAt?: string;
  status: ActivityStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type QuotationStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export interface CrmQuotationItem {
  id: string;
  tenantId: string;
  quotationId: string;
  itemDescription: string;
  materialId?: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  totalPrice: number;
  createdAt: string;
}

export interface CrmQuotation {
  id: string;
  tenantId: string;
  quoteNumber: string;
  customerId: string;
  opportunityId?: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  validityDate: string;
  termsAndConditions?: string;
  notes?: string;
  status: QuotationStatus;
  version: number;
  items?: CrmQuotationItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CrmCustomerCredit {
  id: string;
  tenantId: string;
  customerId: string;
  creditLimit: number;
  creditDays: number;
  outstandingBalance: number;
  availableCredit: number;
  overdueAmount: number;
  creditStatus: 'GOOD' | 'WARNING' | 'BLOCKED';
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmCustomerDocument {
  id: string;
  tenantId: string;
  customerId: string;
  documentType: 'KYC' | 'GST_TAX' | 'CONTRACT' | 'QUOTATION' | 'PURCHASE_ORDER' | 'DELIVERY' | 'OTHER';
  title: string;
  storageRef: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  createdAt: string;
}

export type SupportTicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type SupportTicketStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export interface CrmSupportTicket {
  id: string;
  tenantId: string;
  ticketNumber: string;
  customerId: string;
  subject: string;
  description: string;
  priority: SupportTicketPriority;
  category: 'BILLING' | 'DELIVERY' | 'QUALITY' | 'SERVICE' | 'GENERAL';
  assignedUser?: string;
  status: SupportTicketStatus;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmCustomerSegment {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string;
  criteriaJson?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrmCustomerHealth {
  id: string;
  tenantId: string;
  customerId: string;
  healthScore: number;
  healthStatus: 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'AT_RISK' | 'CRITICAL';
  riskFlags: string[];
  factorsJson?: string;
  calculatedAt: string;
}

export interface CrmCustomerNote {
  id: string;
  tenantId: string;
  customerId: string;
  authorUserId: string;
  noteText: string;
  isPrivate: boolean;
  createdAt: string;
}

// ==========================================
// PHASE 21 — ENTERPRISE FINANCE & ACCOUNTING
// ==========================================

export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'REVENUE' | 'EXPENSE';

export interface ChartOfAccount {
  id: string;
  tenantId: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  parentAccountId?: string;
  currency: string;
  isControlAccount: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FiscalYear {
  id: string;
  tenantId: string;
  yearCode: string;
  yearName: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'LOCKED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface FiscalPeriod {
  id: string;
  tenantId: string;
  fiscalYearId: string;
  periodNumber: number;
  periodName: string;
  startDate: string;
  endDate: string;
  status: 'OPEN' | 'LOCKED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface CostCenter {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface FinanceProject {
  id: string;
  tenantId: string;
  projectCode: string;
  projectName: string;
  budget: number;
  actualCost: number;
  actualRevenue: number;
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  createdAt: string;
  updatedAt: string;
}

export type JournalStatus = 'DRAFT' | 'POSTED' | 'REVERSED';
export type JournalRefType = 'INVOICE' | 'PAYMENT' | 'BILL' | 'SUPPLIER_PAYMENT' | 'EXPENSE' | 'REVERSAL' | 'MANUAL' | 'MARKETPLACE' | 'FLEET' | 'CREDIT_NOTE' | 'DEBIT_NOTE';

export interface Journal {
  id: string;
  tenantId: string;
  journalNumber: string;
  journalDate: string;
  referenceType: JournalRefType;
  referenceId?: string;
  description: string;
  status: JournalStatus;
  createdBy: string;
  postedBy?: string;
  reversedBy?: string;
  reversedJournalId?: string;
  totalDebit: number;
  totalCredit: number;
  createdAt: string;
  postedAt?: string;
  updatedAt: string;
}

export interface JournalLine {
  id: string;
  tenantId: string;
  journalId: string;
  accountId: string;
  debit: number;
  credit: number;
  costCenterId?: string;
  projectId?: string;
  customerId?: string;
  supplierId?: string;
  description: string;
}

export type InvoiceStatus = 'DRAFT' | 'APPROVED' | 'ISSUED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface CustomerInvoice {
  id: string;
  tenantId: string;
  invoiceNumber: string;
  customerId: string;
  quotationId?: string;
  invoiceDate: string;
  dueDate: string;
  creditTermsDays: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  outstandingAmount: number;
  status: InvoiceStatus;
  notes?: string;
  journalId?: string;
  createdAt: string;
  updatedAt: string;
  items?: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  tenantId: string;
  invoiceId: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  taxCodeId?: string;
  taxRate: number;
  taxAmount: number;
  totalPrice: number;
}

export type PaymentMethod = 'CASH' | 'BANK' | 'CARD' | 'UPI' | 'TRANSFER' | 'OTHER';

export interface CustomerPayment {
  id: string;
  tenantId: string;
  paymentNumber: string;
  customerId: string;
  paymentDate: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  referenceNumber?: string;
  unallocatedAmount: number;
  status: 'RECORDED' | 'POSTED' | 'REVERSED';
  journalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAllocation {
  id: string;
  tenantId: string;
  paymentId: string;
  invoiceId: string;
  allocatedAmount: number;
  allocatedAt: string;
}

export type BillStatus = 'DRAFT' | 'APPROVED' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface SupplierBill {
  id: string;
  tenantId: string;
  billNumber: string;
  supplierName: string;
  supplierId?: string;
  billDate: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  outstandingAmount: number;
  status: BillStatus;
  journalId?: string;
  createdAt: string;
  updatedAt: string;
  items?: SupplierBillItem[];
}

export interface SupplierBillItem {
  id: string;
  tenantId: string;
  billId: string;
  itemDescription: string;
  quantity: number;
  unitPrice: number;
  taxAmount: number;
  totalPrice: number;
  costCenterId?: string;
}

export interface SupplierPayment {
  id: string;
  tenantId: string;
  paymentNumber: string;
  supplierName: string;
  supplierId?: string;
  billId?: string;
  paymentDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  bankAccountId?: string;
  referenceNumber?: string;
  status: 'POSTED' | 'REVERSED';
  journalId?: string;
  createdAt: string;
}

export type ExpenseCategory = 'Fuel' | 'Maintenance' | 'Salary' | 'Travel' | 'Utilities' | 'Rent' | 'Marketing' | 'Office' | 'Other';

export interface FinanceExpense {
  id: string;
  tenantId: string;
  expenseNumber: string;
  category: ExpenseCategory;
  amount: number;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  costCenterId?: string;
  projectId?: string;
  vehicleId?: string;
  employeeId?: string;
  description: string;
  receiptUrl?: string;
  status: 'DRAFT' | 'APPROVED' | 'POSTED' | 'REJECTED';
  journalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  tenantId: string;
  accountName: string;
  accountNumberMasked: string;
  bankName: string;
  ifscCode?: string;
  openingBalance: number;
  currentBalance: number;
  currency: string;
  accountType: 'SAVINGS' | 'CURRENT' | 'CASH';
  status: 'ACTIVE' | 'INACTIVE';
  glAccountId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankTransaction {
  id: string;
  tenantId: string;
  bankAccountId: string;
  transactionDate: string;
  valueDate: string;
  description: string;
  reference?: string;
  amount: number;
  transactionType: 'CREDIT' | 'DEBIT';
  reconciliationStatus: 'UNMATCHED' | 'MATCHED' | 'RECONCILED';
  matchedReferenceId?: string;
  createdAt: string;
}

export interface BankReconciliation {
  id: string;
  tenantId: string;
  bankAccountId: string;
  statementDate: string;
  statementBalance: number;
  glBalance: number;
  difference: number;
  status: 'DRAFT' | 'RECONCILED';
  reconciledBy?: string;
  reconciledAt?: string;
  createdAt: string;
}

export interface CreditNote {
  id: string;
  tenantId: string;
  noteNumber: string;
  customerId: string;
  invoiceId?: string;
  issueDate: string;
  amount: number;
  reason: string;
  status: 'DRAFT' | 'APPROVED' | 'POSTED';
  journalId?: string;
  createdAt: string;
}

export interface DebitNote {
  id: string;
  tenantId: string;
  noteNumber: string;
  supplierName: string;
  supplierId?: string;
  billId?: string;
  issueDate: string;
  amount: number;
  reason: string;
  status: 'DRAFT' | 'APPROVED' | 'POSTED';
  journalId?: string;
  createdAt: string;
}

export interface TaxCode {
  id: string;
  tenantId: string;
  taxCode: string;
  taxName: string;
  rate: number;
  taxType: 'GST' | 'VAT' | 'TDS' | 'SERVICE_TAX' | 'EXCISE';
  effectiveDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

// ==========================================
// PHASE 22 — ENTERPRISE HRMS, WORKFORCE & PAYROLL
// ==========================================

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY' | 'INTERN' | 'CONSULTANT';
export type EmploymentStatus = 'ACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'RESIGNED' | 'TERMINATED' | 'RETIRED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'ON_LEAVE' | 'HOLIDAY' | 'WEEK_OFF' | 'REMOTE' | 'WORK_FROM_HOME';
export type LeaveStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type OvertimeStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
export type PayrollStatus = 'DRAFT' | 'CALCULATING' | 'REVIEW' | 'APPROVED' | 'PROCESSED' | 'LOCKED' | 'CANCELLED';
export type PayrollPeriodStatus = 'OPEN' | 'PROCESSING' | 'APPROVED' | 'LOCKED' | 'CLOSED';
export type PayslipStatus = 'DRAFT' | 'GENERATED' | 'APPROVED' | 'PAID';
export type AdvanceStatus = 'REQUESTED' | 'APPROVED' | 'DISBURSED' | 'PARTIALLY_RECOVERED' | 'RECOVERED' | 'REJECTED';
export type LoanStatus = 'REQUESTED' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type ReimbursementCategory = 'Travel' | 'Fuel' | 'Food' | 'Accommodation' | 'Medical' | 'Communication' | 'Other';
export type ReimbursementStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID';
export type ApplicationStatus = 'APPLIED' | 'SCREENING' | 'SHORTLISTED' | 'INTERVIEW' | 'SELECTED' | 'REJECTED' | 'HIRED';

export interface HrEmployee {
  id: string;
  tenantId: string;
  employeeCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  displayName: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  joiningDate: string;
  employmentType: EmploymentType;
  employmentStatus: EmploymentStatus;
  departmentId: string;
  designationId: string;
  managerId?: string;
  branchId?: string;
  businessUnitId?: string;
  workLocation: string;
  bankAccountMasked?: string;
  emergencyContact?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface HrDepartment {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  headEmployeeId?: string;
  description?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface HrDesignation {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  departmentId?: string;
  gradeLevel?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface HrEmployeeAssignment {
  id: string;
  tenantId: string;
  employeeId: string;
  departmentId: string;
  designationId: string;
  branchId?: string;
  businessUnitId?: string;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrEmployeeUser {
  id: string;
  tenantId: string;
  employeeId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrShift {
  id: string;
  tenantId: string;
  shiftCode: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  breakMinutes: number;
  overtimeAfterMinutes: number;
  shiftType: 'DAY' | 'NIGHT' | 'GENERAL' | 'CUSTOM';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface HrEmployeeShift {
  id: string;
  tenantId: string;
  employeeId: string;
  shiftId: string;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrAttendance {
  id: string;
  tenantId: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  breakMinutes: number;
  workingMinutes: number;
  overtimeMinutes: number;
  lateMinutes: number;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrAttendanceCorrection {
  id: string;
  tenantId: string;
  attendanceId?: string;
  employeeId: string;
  date: string;
  requestedCheckIn: string;
  requestedCheckOut: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrLeaveType {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  daysAllowed: number;
  isPaid: boolean;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface HrLeavePolicy {
  id: string;
  tenantId: string;
  leaveTypeId: string;
  policyName: string;
  carryForwardMax: number;
  createdAt: string;
  updatedAt: string;
}

export interface HrLeaveBalance {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveTypeId: string;
  year: number;
  totalAllocated: number;
  used: number;
  pending: number;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface HrLeaveApplication {
  id: string;
  tenantId: string;
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrHoliday {
  id: string;
  tenantId: string;
  name: string;
  date: string;
  branchId?: string;
  businessUnitId?: string;
  holidayType: 'NATIONAL' | 'REGIONAL' | 'OPTIONAL';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface HrOvertime {
  id: string;
  tenantId: string;
  employeeId: string;
  date: string;
  attendanceId?: string;
  claimedMinutes: number;
  approvedMinutes: number;
  rate: number;
  amount: number;
  approvalStatus: OvertimeStatus;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrSalaryStructure {
  id: string;
  tenantId: string;
  employeeId: string;
  effectiveDate: string;
  baseSalary: number;
  payFrequency: 'MONTHLY' | 'BI_WEEKLY' | 'WEEKLY';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface HrSalaryComponent {
  id: string;
  tenantId: string;
  salaryStructureId: string;
  componentName: string;
  componentType: 'EARNING' | 'DEDUCTION';
  amount: number;
  isPercentage: boolean;
  percentageOf?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrPayrollYear {
  id: string;
  tenantId: string;
  yearCode: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'CLOSED';
  createdAt: string;
}

export interface HrPayrollPeriod {
  id: string;
  tenantId: string;
  yearId: string;
  periodName: string;
  month: number;
  year: number;
  startDate: string;
  endDate: string;
  status: PayrollPeriodStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HrPayrollRun {
  id: string;
  tenantId: string;
  periodId: string;
  runNumber: string;
  runDate: string;
  totalEmployees: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  status: PayrollStatus;
  processedBy?: string;
  journalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrPayrollItem {
  id: string;
  tenantId: string;
  payrollRunId: string;
  employeeId: string;
  basicEarnings: number;
  hra: number;
  allowances: number;
  overtimeAmount: number;
  bonusAmount: number;
  grossEarnings: number;
  advanceDeduction: number;
  loanDeduction: number;
  unpaidLeaveDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: PayslipStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HrPayslip {
  id: string;
  tenantId: string;
  payrollRunId: string;
  payrollItemId: string;
  employeeId: string;
  employeeCode: string;
  departmentName: string;
  designationName: string;
  periodName: string;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  earningsJson: string;
  deductionsJson: string;
  status: PayslipStatus;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrSalaryAdvance {
  id: string;
  tenantId: string;
  employeeId: string;
  amount: number;
  reason: string;
  monthlyRecoveryAmount: number;
  recoveredAmount: number;
  remainingBalance: number;
  status: AdvanceStatus;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrEmployeeLoan {
  id: string;
  tenantId: string;
  employeeId: string;
  loanAmount: number;
  interestRate: number;
  installments: number;
  startDate: string;
  monthlyDeduction: number;
  recoveredAmount: number;
  remainingBalance: number;
  status: LoanStatus;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrLoanInstallment {
  id: string;
  tenantId: string;
  loanId: string;
  employeeId: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrReimbursement {
  id: string;
  tenantId: string;
  employeeId: string;
  category: ReimbursementCategory;
  amount: number;
  expenseDate: string;
  description: string;
  receiptReference?: string;
  status: ReimbursementStatus;
  approvedBy?: string;
  financeJournalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrEmployeeDocument {
  id: string;
  tenantId: string;
  employeeId: string;
  documentType: 'ID' | 'Offer Letter' | 'Employment Contract' | 'License' | 'Certificate' | 'KYC' | 'Other';
  documentName: string;
  fileReference: string;
  expiryDate?: string;
  status: 'ACTIVE' | 'EXPIRED';
  createdAt: string;
  updatedAt: string;
}

export interface HrPerformanceCycle {
  id: string;
  tenantId: string;
  cycleName: string;
  startDate: string;
  endDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface HrEmployeeGoal {
  id: string;
  tenantId: string;
  cycleId: string;
  employeeId: string;
  goalTitle: string;
  description: string;
  weightage: number;
  targetValue: number;
  achievedValue: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface HrEmployeeReview {
  id: string;
  tenantId: string;
  cycleId: string;
  employeeId: string;
  reviewerUserId: string;
  selfRating?: number;
  managerRating?: number;
  finalRating?: number;
  feedback?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface HrJobRequisition {
  id: string;
  tenantId: string;
  title: string;
  departmentId: string;
  designationId: string;
  openings: number;
  status: 'OPEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface HrCandidate {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resumeReference?: string;
  status: 'NEW' | 'QUALIFIED' | 'REJECTED' | 'HIRED';
  createdAt: string;
  updatedAt: string;
}

export interface HrApplication {
  id: string;
  tenantId: string;
  jobRequisitionId: string;
  candidateId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface HrInterview {
  id: string;
  tenantId: string;
  applicationId: string;
  interviewerUserId: string;
  scheduledAt: string;
  feedback?: string;
  rating?: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface HrOffer {
  id: string;
  tenantId: string;
  applicationId: string;
  offeredSalary: number;
  joiningDate: string;
  status: 'OFFERED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

export interface HrOnboarding {
  id: string;
  tenantId: string;
  employeeId: string;
  taskName: string;
  category: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HrOffboarding {
  id: string;
  tenantId: string;
  employeeId: string;
  resignationDate: string;
  noticePeriodDays: number;
  lastWorkingDate: string;
  reason: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
}

export interface HrFinalSettlement {
  id: string;
  tenantId: string;
  employeeId: string;
  pendingSalary: number;
  leaveSettlement: number;
  advanceRecovery: number;
  loanRecovery: number;
  reimbursements: number;
  otherDeductions: number;
  netPayable: number;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// RZ® MINETRIX BOS — PLATFORM 1: QUARRY MANAGEMENT ENTITIES
// ============================================================================

export type QuarryType = 'LATERITE' | 'HARD_ROCK';

export interface QuarryMaster {
  id: string;
  tenantId: string;
  companyId: string;
  branchId: string;
  businessUnitId?: string;
  name: string;
  quarryType: QuarryType;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  location: string;
  address?: string;
  ownerId: string;
  leaseReference?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string | null;
  version: number;
}

export interface StoneProduct {
  id: string;
  tenantId: string;
  quarryId: string;
  productCode: string;
  name: string;
  mineralType: QuarryType;
  dimensions?: string; // e.g., "30x20x15 cm" for laterite stones
  unit: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  defaultPrice: number;
  gstRate: number; // e.g. 5, 18
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface QuarryProduction {
  id: string;
  tenantId: string;
  quarryId: string;
  productId: string;
  productionType: 'LATERITE_CUTTING' | 'HARD_ROCK_EXTRACTION';
  productionDate: string; // YYYY-MM-DD
  shift: 'DAY' | 'NIGHT' | 'GENERAL';
  quantity: number;
  unit: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  operatorId: string;
  machineId?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface QuarryStock {
  id: string;
  tenantId: string;
  quarryId: string;
  productId: string;
  transactionType: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT';
  referenceType: 'PRODUCTION' | 'GATE_PASS' | 'STOCK_ADJUSTMENT' | 'OPENING_BALANCE';
  referenceId: string;
  quantityIn: number;
  quantityOut: number;
  balanceQuantity: number;
  transactionDate: string;
  createdBy: string;
  createdAt: string;
}

export type GatePassStatus = 'DRAFT' | 'ISSUED' | 'VERIFIED' | 'DISPATCHED' | 'CANCELLED';

export interface GatePass {
  id: string;
  tenantId: string;
  quarryId: string;
  passNumber: string; // Sequential identifier (e.g., "GP-Q1-2026-00001")
  customerId: string;
  productId: string;
  quantity: number;
  unit: 'TON' | 'CFT' | 'PIECE' | 'LOAD';
  vehicleId?: string;
  vehicleNo?: string;
  driverId?: string;
  driverName?: string;
  grossWeight?: number;
  tareWeight?: number;
  netWeight?: number;
  status: GatePassStatus;
  salesReference?: string;
  financeInvoiceId?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuarryLandLease {
  id: string;
  tenantId: string;
  quarryId: string;
  ownerId?: string;
  ownerName: string;
  surveyNumber: string;
  village: string;
  taluk: string;
  area: number; // in Acres
  leaseType: 'OWNED' | 'LEASED' | 'REVENUE_SHARE';
  royaltyType: 'FIXED_MONTHLY' | 'PER_TON' | 'PER_PIECE' | 'REVENUE_PERCENT';
  royaltyRate: number;
  startDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  documentReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LandownerSettlement {
  id: string;
  tenantId: string;
  leaseId: string;
  periodStart: string;
  periodEnd: string;
  basisQuantity: number;
  calculatedAmount: number;
  status: 'DRAFT' | 'APPROVED' | 'POSTED_TO_FINANCE' | 'PAID';
  financeBillId?: string;
  createdAt: string;
  updatedAt: string;
}





