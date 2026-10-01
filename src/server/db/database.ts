import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import {
  Tenant,
  Company,
  Branch,
  BusinessUnit,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  MasterData,
  Document,
  Notification,
  AuditLog,
  WorkflowDefinition,
  WorkflowInstance,
  WorkflowAction,
  FleetVehicleCategory,
  FleetVehicle,
  FleetVehicleDocument,
  FleetDriver,
  FleetVehicleAssignment,
  FleetTrip,
  FleetFuelLog,
  FleetMaintenanceRecord,
  FleetComplianceRecord,
  FleetOdometerLog,
  FleetVehicleExpense,
  FleetVehicleRevenue,
  FleetVehicleAlert,
  LoadRequest,
  LoadOffer,
  LoadMatch,
  LoadBooking,
  TransporterProfile,
  TransporterServiceArea,
  MarketplacePricingRule,
  MarketplaceDelivery,
  MarketplaceRating,
  MarketplaceDispute,
  MarketplaceMatchingEvent,
  CrmCustomer,
  CrmContact,
  CrmLead,
  CrmOpportunity,
  CrmSalesActivity,
  CrmQuotation,
  CrmQuotationItem,
  CrmCustomerCredit,
  CrmCustomerDocument,
  CrmSupportTicket,
  CrmCustomerSegment,
  CrmCustomerHealth,
  CrmCustomerNote,
  ChartOfAccount,
  FiscalYear,
  FiscalPeriod,
  CostCenter,
  FinanceProject,
  Journal,
  JournalLine,
  CustomerInvoice,
  InvoiceItem,
  CustomerPayment,
  PaymentAllocation,
  SupplierBill,
  SupplierBillItem,
  SupplierPayment,
  FinanceExpense,
  BankAccount,
  BankTransaction,
  BankReconciliation,
  CreditNote,
  DebitNote,
  TaxCode,
  HrDepartment,
  HrDesignation,
  HrEmployee,
  HrEmployeeUser,
  HrEmployeeAssignment,
  HrShift,
  HrEmployeeShift,
  HrAttendance,
  HrAttendanceCorrection,
  HrLeaveType,
  HrLeavePolicy,
  HrLeaveBalance,
  HrLeaveApplication,
  HrHoliday,
  HrOvertime,
  HrSalaryStructure,
  HrSalaryComponent,
  HrPayrollYear,
  HrPayrollPeriod,
  HrPayrollRun,
  HrPayrollItem,
  HrPayslip,
  HrSalaryAdvance,
  HrEmployeeLoan,
  HrLoanInstallment,
  HrReimbursement,
  HrEmployeeDocument,
  HrPerformanceCycle,
  HrEmployeeGoal,
  HrEmployeeReview,
  HrJobRequisition,
  HrCandidate,
  HrApplication,
  HrInterview,
  HrOffer,
  HrOnboarding,
  HrOffboarding,
  HrFinalSettlement,
  QuarryMaster,
  StoneProduct,
  QuarryProduction,
  QuarryStock,
  GatePass,
  QuarryLandLease,
  LandownerSettlement
} from './schema.js';
import { IPersistenceAdapter, LocalJsonPersistenceAdapter, PostgresPersistenceAdapter, DatabaseTables } from './persistenceAdapter.js';
import { postgresManager } from './postgresPool.js';
import pg from 'pg';
import { syncRelationalTenantData } from './relationalTenantStore.js';
import { isProduction } from '../config/securityConfig.js';

export interface TransactionContext {
  client?: pg.PoolClient;
  rollback: () => void;
  query?: (text: string, params?: any[]) => Promise<pg.QueryResult<any>>;
  setTenantContext?: (tenantId: string) => Promise<any>;
  acquireAdvisoryLock?: (key: string) => Promise<void>;
  isPostgres: boolean;
}

// Utility: UUID v7 generator (RFC 9562 compliant timestamp-ordered UUID)
export function generateUuidV7(): string {
  const timestamp = Date.now().toString(16).padStart(12, '0');
  const randomHex = crypto.randomBytes(10).toString('hex');
  return `${timestamp.slice(0, 8)}-${timestamp.slice(8, 12)}-7${randomHex.slice(0, 3)}-a${randomHex.slice(3, 6)}-${randomHex.slice(6, 18)}`;
}

// Password Hashing Utility
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const finalSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, finalSalt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt: finalSalt };
}

// In-Memory Database Store with Persistence Abstraction Layer
export class DatabaseStore {
  public tenants: Map<string, Tenant> = new Map();
  public companies: Map<string, Company> = new Map();
  public branches: Map<string, Branch> = new Map();
  public businessUnits: Map<string, BusinessUnit> = new Map();
  public users: Map<string, User> = new Map();
  public roles: Map<string, Role> = new Map();
  public permissions: Map<string, Permission> = new Map();
  public userRoles: Map<string, UserRole> = new Map();
  public rolePermissions: Map<string, RolePermission> = new Map();
  public masterData: Map<string, MasterData> = new Map();
  public documents: Map<string, Document> = new Map();
  public notifications: Map<string, Notification> = new Map();
  public auditLogs: Map<string, AuditLog> = new Map();
  public workflowDefinitions: Map<string, WorkflowDefinition> = new Map();
  public workflowInstances: Map<string, WorkflowInstance> = new Map();
  public workflowActions: Map<string, WorkflowAction> = new Map();

  // Fleet Maps
  public fleetVehicleCategories: Map<string, FleetVehicleCategory> = new Map();
  public fleetVehicles: Map<string, FleetVehicle> = new Map();
  public fleetVehicleDocuments: Map<string, FleetVehicleDocument> = new Map();
  public fleetDrivers: Map<string, FleetDriver> = new Map();
  public fleetVehicleAssignments: Map<string, FleetVehicleAssignment> = new Map();
  public fleetTrips: Map<string, FleetTrip> = new Map();
  public fleetFuelLogs: Map<string, FleetFuelLog> = new Map();
  public fleetMaintenanceRecords: Map<string, FleetMaintenanceRecord> = new Map();
  public fleetComplianceRecords: Map<string, FleetComplianceRecord> = new Map();
  public fleetOdometerLogs: Map<string, FleetOdometerLog> = new Map();
  public fleetExpenses: Map<string, FleetVehicleExpense> = new Map();
  public fleetRevenues: Map<string, FleetVehicleRevenue> = new Map();
  public fleetAlerts: Map<string, FleetVehicleAlert> = new Map();

  // Phase 19 Marketplace Maps
  public loadRequests: Map<string, LoadRequest> = new Map();
  public loadOffers: Map<string, LoadOffer> = new Map();
  public loadMatches: Map<string, LoadMatch> = new Map();
  public loadBookings: Map<string, LoadBooking> = new Map();
  public transporterProfiles: Map<string, TransporterProfile> = new Map();
  public transporterServiceAreas: Map<string, TransporterServiceArea> = new Map();
  public marketplacePricingRules: Map<string, MarketplacePricingRule> = new Map();
  public marketplaceDeliveries: Map<string, MarketplaceDelivery> = new Map();
  public marketplaceRatings: Map<string, MarketplaceRating> = new Map();
  public marketplaceDisputes: Map<string, MarketplaceDispute> = new Map();
  public marketplaceMatchingEvents: Map<string, MarketplaceMatchingEvent> = new Map();

  // Phase 20 CRM Maps
  public crmCustomers: Map<string, CrmCustomer> = new Map();
  public crmContacts: Map<string, CrmContact> = new Map();
  public crmLeads: Map<string, CrmLead> = new Map();
  public crmOpportunities: Map<string, CrmOpportunity> = new Map();
  public crmSalesActivities: Map<string, CrmSalesActivity> = new Map();
  public crmQuotations: Map<string, CrmQuotation> = new Map();
  public crmQuotationItems: Map<string, CrmQuotationItem> = new Map();
  public crmCustomerCredit: Map<string, CrmCustomerCredit> = new Map();
  public crmCustomerDocuments: Map<string, CrmCustomerDocument> = new Map();
  public crmSupportTickets: Map<string, CrmSupportTicket> = new Map();
  public crmCustomerSegments: Map<string, CrmCustomerSegment> = new Map();
  public crmCustomerHealth: Map<string, CrmCustomerHealth> = new Map();
  public crmCustomerNotes: Map<string, CrmCustomerNote> = new Map();

  // Phase 21 Finance Maps
  public chartOfAccounts: Map<string, ChartOfAccount> = new Map();
  public fiscalYears: Map<string, FiscalYear> = new Map();
  public fiscalPeriods: Map<string, FiscalPeriod> = new Map();
  public costCenters: Map<string, CostCenter> = new Map();
  public financeProjects: Map<string, FinanceProject> = new Map();
  public journals: Map<string, Journal> = new Map();
  public journalLines: Map<string, JournalLine> = new Map();
  public customerInvoices: Map<string, CustomerInvoice> = new Map();
  public invoiceItems: Map<string, InvoiceItem> = new Map();
  public customerPayments: Map<string, CustomerPayment> = new Map();
  public paymentAllocations: Map<string, PaymentAllocation> = new Map();
  public supplierBills: Map<string, SupplierBill> = new Map();
  public supplierBillItems: Map<string, SupplierBillItem> = new Map();
  public supplierPayments: Map<string, SupplierPayment> = new Map();
  public financeExpenses: Map<string, FinanceExpense> = new Map();
  public bankAccounts: Map<string, BankAccount> = new Map();
  public bankTransactions: Map<string, BankTransaction> = new Map();
  public bankReconciliations: Map<string, BankReconciliation> = new Map();
  public creditNotes: Map<string, CreditNote> = new Map();
  public debitNotes: Map<string, DebitNote> = new Map();
  public taxCodes: Map<string, TaxCode> = new Map();

  // Phase 22 Enterprise HRMS Maps
  public hrDepartments: Map<string, HrDepartment> = new Map();
  public hrDesignations: Map<string, HrDesignation> = new Map();
  public hrEmployees: Map<string, HrEmployee> = new Map();
  public hrEmployeeUsers: Map<string, HrEmployeeUser> = new Map();
  public hrEmployeeAssignments: Map<string, HrEmployeeAssignment> = new Map();
  public hrShifts: Map<string, HrShift> = new Map();
  public hrEmployeeShifts: Map<string, HrEmployeeShift> = new Map();
  public hrAttendances: Map<string, HrAttendance> = new Map();
  public hrAttendanceCorrections: Map<string, HrAttendanceCorrection> = new Map();
  public hrLeaveTypes: Map<string, HrLeaveType> = new Map();
  public hrLeavePolicies: Map<string, HrLeavePolicy> = new Map();
  public hrLeaveBalances: Map<string, HrLeaveBalance> = new Map();
  public hrLeaveApplications: Map<string, HrLeaveApplication> = new Map();
  public hrHolidays: Map<string, HrHoliday> = new Map();
  public hrOvertimes: Map<string, HrOvertime> = new Map();
  public hrSalaryStructures: Map<string, HrSalaryStructure> = new Map();
  public hrSalaryComponents: Map<string, HrSalaryComponent> = new Map();
  public hrPayrollYears: Map<string, HrPayrollYear> = new Map();
  public hrPayrollPeriods: Map<string, HrPayrollPeriod> = new Map();
  public hrPayrollRuns: Map<string, HrPayrollRun> = new Map();
  public hrPayrollItems: Map<string, HrPayrollItem> = new Map();
  public hrPayslips: Map<string, HrPayslip> = new Map();
  public hrSalaryAdvances: Map<string, HrSalaryAdvance> = new Map();
  public hrEmployeeLoans: Map<string, HrEmployeeLoan> = new Map();
  public hrLoanInstallments: Map<string, HrLoanInstallment> = new Map();
  public hrReimbursements: Map<string, HrReimbursement> = new Map();
  public hrEmployeeDocuments: Map<string, HrEmployeeDocument> = new Map();
  public hrPerformanceCycles: Map<string, HrPerformanceCycle> = new Map();
  public hrEmployeeGoals: Map<string, HrEmployeeGoal> = new Map();
  public hrEmployeeReviews: Map<string, HrEmployeeReview> = new Map();
  public hrJobRequisitions: Map<string, HrJobRequisition> = new Map();
  public hrCandidates: Map<string, HrCandidate> = new Map();
  public hrApplications: Map<string, HrApplication> = new Map();
  public hrInterviews: Map<string, HrInterview> = new Map();
  public hrOffers: Map<string, HrOffer> = new Map();
  public hrOnboardings: Map<string, HrOnboarding> = new Map();
  public hrOffboardings: Map<string, HrOffboarding> = new Map();
  public hrFinalSettlements: Map<string, HrFinalSettlement> = new Map();

  // Platform 1: Quarry Management Maps
  public quarryMasters: Map<string, QuarryMaster> = new Map();
  public stoneProducts: Map<string, StoneProduct> = new Map();
  public quarryProductions: Map<string, QuarryProduction> = new Map();
  public quarryStocks: Map<string, QuarryStock> = new Map();
  public gatePasses: Map<string, GatePass> = new Map();
  public quarryLandLeases: Map<string, QuarryLandLease> = new Map();
  public landownerSettlements: Map<string, LandownerSettlement> = new Map();

  // Concurrency & Transaction Management
  private lockQueues: Map<string, Promise<void>> = new Map();

  /**
   * Acquires an advisory lock for stock mutation on composite key: tenant_id + quarry_id + product_id.
   * In PostgreSQL mode, maps to pg_advisory_xact_lock(hashtext('...')).
   * In Local/Dev mode, serializes concurrent operations via keyed promise queues.
   */
  public async acquireStockAdvisoryLock(tenantId: string, quarryId: string, productId: string): Promise<() => void> {
    const key = `stock_lock:${tenantId}:${quarryId}:${productId}`;
    const currentLock = this.lockQueues.get(key) || Promise.resolve();
    let release!: () => void;
    const nextLock = new Promise<void>((resolve) => {
      release = resolve;
    });

    this.lockQueues.set(key, currentLock.then(() => nextLock));
    await currentLock;

    let released = false;
    return () => {
      if (!released) {
        released = true;
        release();
        if (this.lockQueues.get(key) === nextLock) {
          this.lockQueues.delete(key);
        }
      }
    };
  }

  /**
   * Executes database operations inside an atomic transaction boundary.
   * In PostgreSQL mode: checks out a pool connection, executes BEGIN, sets transaction-local RLS tenant context,
   * provides native advisory lock capabilities, and performs COMMIT / ROLLBACK.
   * In Local/JSON fallback mode: creates an in-memory snapshot with programmatic rollback and disk persistence.
   */
  public async executeTransaction<T>(
    operation: (tx: TransactionContext) => Promise<T>,
    tenantId?: string
  ): Promise<T> {
    const pool = postgresManager.getPool();
    if (this.persistenceAdapter instanceof PostgresPersistenceAdapter && pool && postgresManager.isConfigured()) {
      const client = await pool.connect();
      let isRolledBack = false;
      const rollback = () => {
        isRolledBack = true;
      };

      try {
        await client.query('BEGIN');
        if (tenantId) {
          // Transaction-scoped parameterized RLS context injection
          await client.query("SELECT set_config('app.current_tenant_id', $1, true)", [tenantId]);
        }

        const txContext: TransactionContext = {
          client,
          isPostgres: true,
          rollback,
          query: (text: string, params?: any[]) => client.query(text, params),
          setTenantContext: async (tId: string) => {
            await client.query("SELECT set_config('app.current_tenant_id', $1, true)", [tId]);
          },
          acquireAdvisoryLock: async (lockKey: string) => {
            await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [lockKey]);
          }
        };

        const result = await operation(txContext);
        if (isRolledBack) {
          await client.query('ROLLBACK');
          throw new Error('Transaction explicitly rolled back');
        } else {
          await client.query('COMMIT');
          return result;
        }
      } catch (err) {
        try {
          await client.query('ROLLBACK');
        } catch {
          // Ignore rollback failure on disconnected client
        }
        throw err;
      } finally {
        client.release();
      }
    }

    // Local JSON / In-Memory Snapshot Fallback
    const snapshot = {
      quarryProductions: new Map(this.quarryProductions),
      quarryStocks: new Map(this.quarryStocks),
      gatePasses: new Map(this.gatePasses),
      quarryMasters: new Map(this.quarryMasters),
      stoneProducts: new Map(this.stoneProducts),
      quarryLandLeases: new Map(this.quarryLandLeases),
      landownerSettlements: new Map(this.landownerSettlements)
    };

    const rollback = () => {
      this.quarryProductions = new Map(snapshot.quarryProductions);
      this.quarryStocks = new Map(snapshot.quarryStocks);
      this.gatePasses = new Map(snapshot.gatePasses);
      this.quarryMasters = new Map(snapshot.quarryMasters);
      this.stoneProducts = new Map(snapshot.stoneProducts);
      this.quarryLandLeases = new Map(snapshot.quarryLandLeases);
      this.landownerSettlements = new Map(snapshot.landownerSettlements);
    };

    const txContext: TransactionContext = {
      isPostgres: false,
      rollback
    };

    try {
      const result = await operation(txContext);
      this.persistToDisk();
      return result;
    } catch (err) {
      rollback();
      this.persistToDisk();
      throw err;
    }
  }

  public getAdapterName(): string {
    return this.persistenceAdapter.providerName;
  }

  public persistenceAdapter: IPersistenceAdapter;
  private storageFilePath: string;
  private initialized = false;

  constructor() {
    this.storageFilePath = path.join(process.cwd(), 'data', 'shared_core_db.json');
    const hasPostgres = Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL);

    if (isProduction() && !hasPostgres) {
      throw new Error('Production requires DATABASE_URL. JSON persistence fallback is not permitted.');
    }

    if (hasPostgres) {
      this.persistenceAdapter = new PostgresPersistenceAdapter();
    } else {
      this.persistenceAdapter = new LocalJsonPersistenceAdapter(this.storageFilePath);
    }
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.persistenceAdapter.initialize();

    const dir = path.dirname(this.storageFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      const parsed = await this.persistenceAdapter.loadAll();
      const hasData = (parsed.tenants?.length || 0) > 0;
      if (hasData) {
        this.loadFromDump(parsed);
        this.ensureHrmsPermissionCatalog();
        this.ensureFleetPermissionCatalog();
        this.ensureFinancePermissionCatalog();
        console.log(`[DB] Database loaded via adapter [${this.persistenceAdapter.providerName}] from persistent storage.`);
        // Ensure Fleet default enterprise seed exists if loaded database was missing fleet data
        if (this.fleetVehicles.size === 0) {
          this.seedFleetDataOnly();
          this.persistToDisk();
        }
        // Ensure Marketplace default enterprise seed exists if loaded database was missing marketplace data
        if (this.transporterProfiles.size === 0) {
          this.seedMarketplaceDataOnly();
          this.persistToDisk();
        }
        // Ensure CRM default enterprise seed exists if loaded database was missing CRM data
        if (this.crmCustomers.size === 0) {
          this.seedCrmDataOnly();
          this.persistToDisk();
        }
        // Ensure Finance default enterprise seed exists if loaded database was missing Finance data
        if (this.chartOfAccounts.size === 0) {
          this.seedFinanceDataOnly();
          this.persistToDisk();
        }
        // Ensure HRMS default enterprise seed exists if loaded database was missing HRMS data
        if (this.hrEmployees.size === 0) {
          this.seedHrDataOnly();
          this.persistToDisk();
        }
        // Ensure Quarry default enterprise seed exists if loaded database was missing Quarry data
        if (this.quarryMasters.size === 0) {
          this.seedQuarryDataOnly();
          this.persistToDisk();
        }
        this.seedQuarryRbacData();
        if (this.persistenceAdapter.providerName === 'POSTGRES_DRIZZLE') {
          await syncRelationalTenantData({
            companies: parsed.companies || [],
            branches: parsed.branches || [],
            users: parsed.users || [],
            auditLogs: parsed.auditLogs || []
          });
        }
        await this.persistToDisk();
        this.initialized = true;
        return;
      }
    } catch (err) {
      console.warn('[DB] Failed to load persistence state, seeding fresh database:', err);
    }

    this.seedDefaultEnterpriseData();
    this.seedQuarryRbacData();
    await this.persistToDisk();
    this.initialized = true;
  }

  private loadFromDump(dump: any) {
    if (dump.tenants) dump.tenants.forEach((item: Tenant) => this.tenants.set(item.id, item));
    if (dump.companies) dump.companies.forEach((item: Company) => this.companies.set(item.id, item));
    if (dump.branches) dump.branches.forEach((item: Branch) => this.branches.set(item.id, item));
    if (dump.businessUnits) dump.businessUnits.forEach((item: BusinessUnit) => this.businessUnits.set(item.id, item));
    if (dump.users) dump.users.forEach((item: User) => this.users.set(item.id, item));
    if (dump.roles) dump.roles.forEach((item: Role) => this.roles.set(item.id, item));
    if (dump.permissions) dump.permissions.forEach((item: Permission) => this.permissions.set(item.id, item));
    if (dump.userRoles) dump.userRoles.forEach((item: UserRole) => this.userRoles.set(item.id, item));
    if (dump.rolePermissions) dump.rolePermissions.forEach((item: RolePermission) => this.rolePermissions.set(item.id, item));
    if (dump.masterData) dump.masterData.forEach((item: MasterData) => this.masterData.set(item.id, item));
    if (dump.documents) dump.documents.forEach((item: Document) => this.documents.set(item.id, item));
    if (dump.notifications) dump.notifications.forEach((item: Notification) => this.notifications.set(item.id, item));
    if (dump.auditLogs) dump.auditLogs.forEach((item: AuditLog) => this.auditLogs.set(item.id, item));
    if (dump.workflowDefinitions) dump.workflowDefinitions.forEach((item: WorkflowDefinition) => this.workflowDefinitions.set(item.id, item));
    if (dump.workflowInstances) dump.workflowInstances.forEach((item: WorkflowInstance) => this.workflowInstances.set(item.id, item));
    if (dump.workflowActions) dump.workflowActions.forEach((item: WorkflowAction) => this.workflowActions.set(item.id, item));

    // Fleet Maps
    if (dump.fleetVehicleCategories) dump.fleetVehicleCategories.forEach((item: FleetVehicleCategory) => this.fleetVehicleCategories.set(item.id, item));
    if (dump.fleetVehicles) dump.fleetVehicles.forEach((item: FleetVehicle) => this.fleetVehicles.set(item.id, item));
    if (dump.fleetVehicleDocuments) dump.fleetVehicleDocuments.forEach((item: FleetVehicleDocument) => this.fleetVehicleDocuments.set(item.id, item));
    if (dump.fleetDrivers) dump.fleetDrivers.forEach((item: FleetDriver) => this.fleetDrivers.set(item.id, item));
    if (dump.fleetVehicleAssignments) dump.fleetVehicleAssignments.forEach((item: FleetVehicleAssignment) => this.fleetVehicleAssignments.set(item.id, item));
    if (dump.fleetTrips) dump.fleetTrips.forEach((item: FleetTrip) => this.fleetTrips.set(item.id, item));
    if (dump.fleetFuelLogs) dump.fleetFuelLogs.forEach((item: FleetFuelLog) => this.fleetFuelLogs.set(item.id, item));
    if (dump.fleetMaintenanceRecords) dump.fleetMaintenanceRecords.forEach((item: FleetMaintenanceRecord) => this.fleetMaintenanceRecords.set(item.id, item));
    if (dump.fleetComplianceRecords) dump.fleetComplianceRecords.forEach((item: FleetComplianceRecord) => this.fleetComplianceRecords.set(item.id, item));
    if (dump.fleetOdometerLogs) dump.fleetOdometerLogs.forEach((item: FleetOdometerLog) => this.fleetOdometerLogs.set(item.id, item));
    if (dump.fleetExpenses) dump.fleetExpenses.forEach((item: FleetVehicleExpense) => this.fleetExpenses.set(item.id, item));
    if (dump.fleetRevenues) dump.fleetRevenues.forEach((item: FleetVehicleRevenue) => this.fleetRevenues.set(item.id, item));
    if (dump.fleetAlerts) dump.fleetAlerts.forEach((item: FleetVehicleAlert) => this.fleetAlerts.set(item.id, item));

    // Phase 19 Marketplace Maps
    if (dump.loadRequests) dump.loadRequests.forEach((item: LoadRequest) => this.loadRequests.set(item.id, item));
    if (dump.loadOffers) dump.loadOffers.forEach((item: LoadOffer) => this.loadOffers.set(item.id, item));
    if (dump.loadMatches) dump.loadMatches.forEach((item: LoadMatch) => this.loadMatches.set(item.id, item));
    if (dump.loadBookings) dump.loadBookings.forEach((item: LoadBooking) => this.loadBookings.set(item.id, item));
    if (dump.transporterProfiles) dump.transporterProfiles.forEach((item: TransporterProfile) => this.transporterProfiles.set(item.id, item));
    if (dump.transporterServiceAreas) dump.transporterServiceAreas.forEach((item: TransporterServiceArea) => this.transporterServiceAreas.set(item.id, item));
    if (dump.marketplacePricingRules) dump.marketplacePricingRules.forEach((item: MarketplacePricingRule) => this.marketplacePricingRules.set(item.id, item));
    if (dump.marketplaceDeliveries) dump.marketplaceDeliveries.forEach((item: MarketplaceDelivery) => this.marketplaceDeliveries.set(item.id, item));
    if (dump.marketplaceRatings) dump.marketplaceRatings.forEach((item: MarketplaceRating) => this.marketplaceRatings.set(item.id, item));
    if (dump.marketplaceDisputes) dump.marketplaceDisputes.forEach((item: MarketplaceDispute) => this.marketplaceDisputes.set(item.id, item));
    if (dump.marketplaceMatchingEvents) dump.marketplaceMatchingEvents.forEach((item: MarketplaceMatchingEvent) => this.marketplaceMatchingEvents.set(item.id, item));

    // Phase 20 CRM Maps
    if (dump.crmCustomers) dump.crmCustomers.forEach((item: CrmCustomer) => this.crmCustomers.set(item.id, item));
    if (dump.crmContacts) dump.crmContacts.forEach((item: CrmContact) => this.crmContacts.set(item.id, item));
    if (dump.crmLeads) dump.crmLeads.forEach((item: CrmLead) => this.crmLeads.set(item.id, item));
    if (dump.crmOpportunities) dump.crmOpportunities.forEach((item: CrmOpportunity) => this.crmOpportunities.set(item.id, item));
    if (dump.crmSalesActivities) dump.crmSalesActivities.forEach((item: CrmSalesActivity) => this.crmSalesActivities.set(item.id, item));
    if (dump.crmQuotations) dump.crmQuotations.forEach((item: CrmQuotation) => this.crmQuotations.set(item.id, item));
    if (dump.crmQuotationItems) dump.crmQuotationItems.forEach((item: CrmQuotationItem) => this.crmQuotationItems.set(item.id, item));
    if (dump.crmCustomerCredit) dump.crmCustomerCredit.forEach((item: CrmCustomerCredit) => this.crmCustomerCredit.set(item.id, item));
    if (dump.crmCustomerDocuments) dump.crmCustomerDocuments.forEach((item: CrmCustomerDocument) => this.crmCustomerDocuments.set(item.id, item));
    if (dump.crmSupportTickets) dump.crmSupportTickets.forEach((item: CrmSupportTicket) => this.crmSupportTickets.set(item.id, item));
    if (dump.crmCustomerSegments) dump.crmCustomerSegments.forEach((item: CrmCustomerSegment) => this.crmCustomerSegments.set(item.id, item));
    if (dump.crmCustomerHealth) dump.crmCustomerHealth.forEach((item: CrmCustomerHealth) => this.crmCustomerHealth.set(item.id, item));
    if (dump.crmCustomerNotes) dump.crmCustomerNotes.forEach((item: CrmCustomerNote) => this.crmCustomerNotes.set(item.id, item));

    // Phase 21 Finance Maps
    if (dump.chartOfAccounts) dump.chartOfAccounts.forEach((item: ChartOfAccount) => this.chartOfAccounts.set(item.id, item));
    if (dump.fiscalYears) dump.fiscalYears.forEach((item: FiscalYear) => this.fiscalYears.set(item.id, item));
    if (dump.fiscalPeriods) dump.fiscalPeriods.forEach((item: FiscalPeriod) => this.fiscalPeriods.set(item.id, item));
    if (dump.costCenters) dump.costCenters.forEach((item: CostCenter) => this.costCenters.set(item.id, item));
    if (dump.financeProjects) dump.financeProjects.forEach((item: FinanceProject) => this.financeProjects.set(item.id, item));
    if (dump.journals) dump.journals.forEach((item: Journal) => this.journals.set(item.id, item));
    if (dump.journalLines) dump.journalLines.forEach((item: JournalLine) => this.journalLines.set(item.id, item));
    if (dump.customerInvoices) dump.customerInvoices.forEach((item: CustomerInvoice) => this.customerInvoices.set(item.id, item));
    if (dump.invoiceItems) dump.invoiceItems.forEach((item: InvoiceItem) => this.invoiceItems.set(item.id, item));
    if (dump.customerPayments) dump.customerPayments.forEach((item: CustomerPayment) => this.customerPayments.set(item.id, item));
    if (dump.paymentAllocations) dump.paymentAllocations.forEach((item: PaymentAllocation) => this.paymentAllocations.set(item.id, item));
    if (dump.supplierBills) dump.supplierBills.forEach((item: SupplierBill) => this.supplierBills.set(item.id, item));
    if (dump.supplierBillItems) dump.supplierBillItems.forEach((item: SupplierBillItem) => this.supplierBillItems.set(item.id, item));
    if (dump.supplierPayments) dump.supplierPayments.forEach((item: SupplierPayment) => this.supplierPayments.set(item.id, item));
    if (dump.financeExpenses) dump.financeExpenses.forEach((item: FinanceExpense) => this.financeExpenses.set(item.id, item));
    if (dump.bankAccounts) dump.bankAccounts.forEach((item: BankAccount) => this.bankAccounts.set(item.id, item));
    if (dump.bankTransactions) dump.bankTransactions.forEach((item: BankTransaction) => this.bankTransactions.set(item.id, item));
    if (dump.bankReconciliations) dump.bankReconciliations.forEach((item: BankReconciliation) => this.bankReconciliations.set(item.id, item));
    if (dump.creditNotes) dump.creditNotes.forEach((item: CreditNote) => this.creditNotes.set(item.id, item));
    if (dump.debitNotes) dump.debitNotes.forEach((item: DebitNote) => this.debitNotes.set(item.id, item));
    if (dump.taxCodes) dump.taxCodes.forEach((item: TaxCode) => this.taxCodes.set(item.id, item));

    // Phase 22 HRMS Maps
    if (dump.hrDepartments) dump.hrDepartments.forEach((item: HrDepartment) => this.hrDepartments.set(item.id, item));
    if (dump.hrDesignations) dump.hrDesignations.forEach((item: HrDesignation) => this.hrDesignations.set(item.id, item));
    if (dump.hrEmployees) dump.hrEmployees.forEach((item: HrEmployee) => this.hrEmployees.set(item.id, item));
    if (dump.hrEmployeeUsers) dump.hrEmployeeUsers.forEach((item: HrEmployeeUser) => this.hrEmployeeUsers.set(item.id, item));
    if (dump.hrEmployeeAssignments) dump.hrEmployeeAssignments.forEach((item: HrEmployeeAssignment) => this.hrEmployeeAssignments.set(item.id, item));
    if (dump.hrShifts) dump.hrShifts.forEach((item: HrShift) => this.hrShifts.set(item.id, item));
    if (dump.hrEmployeeShifts) dump.hrEmployeeShifts.forEach((item: HrEmployeeShift) => this.hrEmployeeShifts.set(item.id, item));
    if (dump.hrAttendances) dump.hrAttendances.forEach((item: HrAttendance) => this.hrAttendances.set(item.id, item));
    if (dump.hrAttendanceCorrections) dump.hrAttendanceCorrections.forEach((item: HrAttendanceCorrection) => this.hrAttendanceCorrections.set(item.id, item));
    if (dump.hrLeaveTypes) dump.hrLeaveTypes.forEach((item: HrLeaveType) => this.hrLeaveTypes.set(item.id, item));
    if (dump.hrLeavePolicies) dump.hrLeavePolicies.forEach((item: HrLeavePolicy) => this.hrLeavePolicies.set(item.id, item));
    if (dump.hrLeaveBalances) dump.hrLeaveBalances.forEach((item: HrLeaveBalance) => this.hrLeaveBalances.set(item.id, item));
    if (dump.hrLeaveApplications) dump.hrLeaveApplications.forEach((item: HrLeaveApplication) => this.hrLeaveApplications.set(item.id, item));
    if (dump.hrHolidays) dump.hrHolidays.forEach((item: HrHoliday) => this.hrHolidays.set(item.id, item));
    if (dump.hrOvertimes) dump.hrOvertimes.forEach((item: HrOvertime) => this.hrOvertimes.set(item.id, item));
    if (dump.hrSalaryStructures) dump.hrSalaryStructures.forEach((item: HrSalaryStructure) => this.hrSalaryStructures.set(item.id, item));
    if (dump.hrSalaryComponents) dump.hrSalaryComponents.forEach((item: HrSalaryComponent) => this.hrSalaryComponents.set(item.id, item));
    if (dump.hrPayrollYears) dump.hrPayrollYears.forEach((item: HrPayrollYear) => this.hrPayrollYears.set(item.id, item));
    if (dump.hrPayrollPeriods) dump.hrPayrollPeriods.forEach((item: HrPayrollPeriod) => this.hrPayrollPeriods.set(item.id, item));
    if (dump.hrPayrollRuns) dump.hrPayrollRuns.forEach((item: HrPayrollRun) => this.hrPayrollRuns.set(item.id, item));
    if (dump.hrPayrollItems) dump.hrPayrollItems.forEach((item: HrPayrollItem) => this.hrPayrollItems.set(item.id, item));
    if (dump.hrPayslips) dump.hrPayslips.forEach((item: HrPayslip) => this.hrPayslips.set(item.id, item));
    if (dump.hrSalaryAdvances) dump.hrSalaryAdvances.forEach((item: HrSalaryAdvance) => this.hrSalaryAdvances.set(item.id, item));
    if (dump.hrEmployeeLoans) dump.hrEmployeeLoans.forEach((item: HrEmployeeLoan) => this.hrEmployeeLoans.set(item.id, item));
    if (dump.hrLoanInstallments) dump.hrLoanInstallments.forEach((item: HrLoanInstallment) => this.hrLoanInstallments.set(item.id, item));
    if (dump.hrReimbursements) dump.hrReimbursements.forEach((item: HrReimbursement) => this.hrReimbursements.set(item.id, item));
    if (dump.hrEmployeeDocuments) dump.hrEmployeeDocuments.forEach((item: HrEmployeeDocument) => this.hrEmployeeDocuments.set(item.id, item));
    if (dump.hrPerformanceCycles) dump.hrPerformanceCycles.forEach((item: HrPerformanceCycle) => this.hrPerformanceCycles.set(item.id, item));
    if (dump.hrEmployeeGoals) dump.hrEmployeeGoals.forEach((item: HrEmployeeGoal) => this.hrEmployeeGoals.set(item.id, item));
    if (dump.hrEmployeeReviews) dump.hrEmployeeReviews.forEach((item: HrEmployeeReview) => this.hrEmployeeReviews.set(item.id, item));
    if (dump.hrJobRequisitions) dump.hrJobRequisitions.forEach((item: HrJobRequisition) => this.hrJobRequisitions.set(item.id, item));
    if (dump.hrCandidates) dump.hrCandidates.forEach((item: HrCandidate) => this.hrCandidates.set(item.id, item));
    if (dump.hrApplications) dump.hrApplications.forEach((item: HrApplication) => this.hrApplications.set(item.id, item));
    if (dump.hrInterviews) dump.hrInterviews.forEach((item: HrInterview) => this.hrInterviews.set(item.id, item));
    if (dump.hrOffers) dump.hrOffers.forEach((item: HrOffer) => this.hrOffers.set(item.id, item));
    if (dump.hrOnboardings) dump.hrOnboardings.forEach((item: HrOnboarding) => this.hrOnboardings.set(item.id, item));
    if (dump.hrOffboardings) dump.hrOffboardings.forEach((item: HrOffboarding) => this.hrOffboardings.set(item.id, item));
    if (dump.hrFinalSettlements) dump.hrFinalSettlements.forEach((item: HrFinalSettlement) => this.hrFinalSettlements.set(item.id, item));

    // Platform 1: Quarry Management Maps
    if (dump.quarryMasters) dump.quarryMasters.forEach((item: QuarryMaster) => this.quarryMasters.set(item.id, item));
    if (dump.stoneProducts) dump.stoneProducts.forEach((item: StoneProduct) => this.stoneProducts.set(item.id, item));
    if (dump.quarryProductions) dump.quarryProductions.forEach((item: QuarryProduction) => this.quarryProductions.set(item.id, item));
    if (dump.quarryStocks) dump.quarryStocks.forEach((item: QuarryStock) => this.quarryStocks.set(item.id, item));
    if (dump.gatePasses) dump.gatePasses.forEach((item: GatePass) => this.gatePasses.set(item.id, item));
    if (dump.quarryLandLeases) dump.quarryLandLeases.forEach((item: QuarryLandLease) => this.quarryLandLeases.set(item.id, item));
    if (dump.landownerSettlements) dump.landownerSettlements.forEach((item: LandownerSettlement) => this.landownerSettlements.set(item.id, item));
  }

  public schedulePersist(): void {
    void this.persistToDisk();
  }

  public async persistToDisk(): Promise<void> {
    try {
      const dump = {
        tenants: Array.from(this.tenants.values()),
        companies: Array.from(this.companies.values()),
        branches: Array.from(this.branches.values()),
        businessUnits: Array.from(this.businessUnits.values()),
        users: Array.from(this.users.values()),
        roles: Array.from(this.roles.values()),
        permissions: Array.from(this.permissions.values()),
        userRoles: Array.from(this.userRoles.values()),
        rolePermissions: Array.from(this.rolePermissions.values()),
        masterData: Array.from(this.masterData.values()),
        documents: Array.from(this.documents.values()),
        notifications: Array.from(this.notifications.values()),
        auditLogs: Array.from(this.auditLogs.values()),
        workflowDefinitions: Array.from(this.workflowDefinitions.values()),
        workflowInstances: Array.from(this.workflowInstances.values()),
        workflowActions: Array.from(this.workflowActions.values()),
        fleetVehicleCategories: Array.from(this.fleetVehicleCategories.values()),
        fleetVehicles: Array.from(this.fleetVehicles.values()),
        fleetVehicleDocuments: Array.from(this.fleetVehicleDocuments.values()),
        fleetDrivers: Array.from(this.fleetDrivers.values()),
        fleetVehicleAssignments: Array.from(this.fleetVehicleAssignments.values()),
        fleetTrips: Array.from(this.fleetTrips.values()),
        fleetFuelLogs: Array.from(this.fleetFuelLogs.values()),
        fleetMaintenanceRecords: Array.from(this.fleetMaintenanceRecords.values()),
        fleetComplianceRecords: Array.from(this.fleetComplianceRecords.values()),
        fleetOdometerLogs: Array.from(this.fleetOdometerLogs.values()),
        fleetExpenses: Array.from(this.fleetExpenses.values()),
        fleetRevenues: Array.from(this.fleetRevenues.values()),
        fleetAlerts: Array.from(this.fleetAlerts.values()),
        loadRequests: Array.from(this.loadRequests.values()),
        loadOffers: Array.from(this.loadOffers.values()),
        loadMatches: Array.from(this.loadMatches.values()),
        loadBookings: Array.from(this.loadBookings.values()),
        transporterProfiles: Array.from(this.transporterProfiles.values()),
        transporterServiceAreas: Array.from(this.transporterServiceAreas.values()),
        marketplacePricingRules: Array.from(this.marketplacePricingRules.values()),
        marketplaceDeliveries: Array.from(this.marketplaceDeliveries.values()),
        marketplaceRatings: Array.from(this.marketplaceRatings.values()),
        marketplaceDisputes: Array.from(this.marketplaceDisputes.values()),
        marketplaceMatchingEvents: Array.from(this.marketplaceMatchingEvents.values()),
        crmCustomers: Array.from(this.crmCustomers.values()),
        crmContacts: Array.from(this.crmContacts.values()),
        crmLeads: Array.from(this.crmLeads.values()),
        crmOpportunities: Array.from(this.crmOpportunities.values()),
        crmSalesActivities: Array.from(this.crmSalesActivities.values()),
        crmQuotations: Array.from(this.crmQuotations.values()),
        crmQuotationItems: Array.from(this.crmQuotationItems.values()),
        crmCustomerCredit: Array.from(this.crmCustomerCredit.values()),
        crmCustomerDocuments: Array.from(this.crmCustomerDocuments.values()),
        crmSupportTickets: Array.from(this.crmSupportTickets.values()),
        crmCustomerSegments: Array.from(this.crmCustomerSegments.values()),
        crmCustomerHealth: Array.from(this.crmCustomerHealth.values()),
        crmCustomerNotes: Array.from(this.crmCustomerNotes.values()),
        chartOfAccounts: Array.from(this.chartOfAccounts.values()),
        fiscalYears: Array.from(this.fiscalYears.values()),
        fiscalPeriods: Array.from(this.fiscalPeriods.values()),
        costCenters: Array.from(this.costCenters.values()),
        financeProjects: Array.from(this.financeProjects.values()),
        journals: Array.from(this.journals.values()),
        journalLines: Array.from(this.journalLines.values()),
        customerInvoices: Array.from(this.customerInvoices.values()),
        invoiceItems: Array.from(this.invoiceItems.values()),
        customerPayments: Array.from(this.customerPayments.values()),
        paymentAllocations: Array.from(this.paymentAllocations.values()),
        supplierBills: Array.from(this.supplierBills.values()),
        supplierBillItems: Array.from(this.supplierBillItems.values()),
        supplierPayments: Array.from(this.supplierPayments.values()),
        financeExpenses: Array.from(this.financeExpenses.values()),
        bankAccounts: Array.from(this.bankAccounts.values()),
        bankTransactions: Array.from(this.bankTransactions.values()),
        bankReconciliations: Array.from(this.bankReconciliations.values()),
        creditNotes: Array.from(this.creditNotes.values()),
        debitNotes: Array.from(this.debitNotes.values()),
        taxCodes: Array.from(this.taxCodes.values()),
        hrDepartments: Array.from(this.hrDepartments.values()),
        hrDesignations: Array.from(this.hrDesignations.values()),
        hrEmployees: Array.from(this.hrEmployees.values()),
        hrEmployeeUsers: Array.from(this.hrEmployeeUsers.values()),
        hrEmployeeAssignments: Array.from(this.hrEmployeeAssignments.values()),
        hrShifts: Array.from(this.hrShifts.values()),
        hrEmployeeShifts: Array.from(this.hrEmployeeShifts.values()),
        hrAttendances: Array.from(this.hrAttendances.values()),
        hrAttendanceCorrections: Array.from(this.hrAttendanceCorrections.values()),
        hrLeaveTypes: Array.from(this.hrLeaveTypes.values()),
        hrLeavePolicies: Array.from(this.hrLeavePolicies.values()),
        hrLeaveBalances: Array.from(this.hrLeaveBalances.values()),
        hrLeaveApplications: Array.from(this.hrLeaveApplications.values()),
        hrHolidays: Array.from(this.hrHolidays.values()),
        hrOvertimes: Array.from(this.hrOvertimes.values()),
        hrSalaryStructures: Array.from(this.hrSalaryStructures.values()),
        hrSalaryComponents: Array.from(this.hrSalaryComponents.values()),
        hrPayrollYears: Array.from(this.hrPayrollYears.values()),
        hrPayrollPeriods: Array.from(this.hrPayrollPeriods.values()),
        hrPayrollRuns: Array.from(this.hrPayrollRuns.values()),
        hrPayrollItems: Array.from(this.hrPayrollItems.values()),
        hrPayslips: Array.from(this.hrPayslips.values()),
        hrSalaryAdvances: Array.from(this.hrSalaryAdvances.values()),
        hrEmployeeLoans: Array.from(this.hrEmployeeLoans.values()),
        hrLoanInstallments: Array.from(this.hrLoanInstallments.values()),
        hrReimbursements: Array.from(this.hrReimbursements.values()),
        hrEmployeeDocuments: Array.from(this.hrEmployeeDocuments.values()),
        hrPerformanceCycles: Array.from(this.hrPerformanceCycles.values()),
        hrEmployeeGoals: Array.from(this.hrEmployeeGoals.values()),
        hrEmployeeReviews: Array.from(this.hrEmployeeReviews.values()),
        hrJobRequisitions: Array.from(this.hrJobRequisitions.values()),
        hrCandidates: Array.from(this.hrCandidates.values()),
        hrApplications: Array.from(this.hrApplications.values()),
        hrInterviews: Array.from(this.hrInterviews.values()),
        hrOffers: Array.from(this.hrOffers.values()),
        hrOnboardings: Array.from(this.hrOnboardings.values()),
        hrOffboardings: Array.from(this.hrOffboardings.values()),
        hrFinalSettlements: Array.from(this.hrFinalSettlements.values()),
        quarryMasters: Array.from(this.quarryMasters.values()),
        stoneProducts: Array.from(this.stoneProducts.values()),
        quarryProductions: Array.from(this.quarryProductions.values()),
        quarryStocks: Array.from(this.quarryStocks.values()),
        gatePasses: Array.from(this.gatePasses.values()),
        quarryLandLeases: Array.from(this.quarryLandLeases.values()),
        landownerSettlements: Array.from(this.landownerSettlements.values())
      };
      await this.persistenceAdapter.saveAll(dump);
    } catch (err) {
      console.error('[DB] Error persisting database state:', err);
    }
  }

  /** Additive RBAC catalog so existing persisted snapshots pick up new HRMS permissions. */
  private ensureHrmsPermissionCatalog(): void {
    const catalog: Permission[] = [
      { id: 'p6', code: 'hrms:employee:view', module: 'HRMS', action: 'view', description: 'View HR Employee Master' },
      { id: 'p77', code: 'hrms:employee:create', module: 'HRMS', action: 'create', description: 'Create employee master records' },
      { id: 'p78', code: 'hrms:employee:update', module: 'HRMS', action: 'update', description: 'Update or archive employees' },
      { id: 'p79', code: 'hrms:attendance:view', module: 'HRMS', action: 'view', description: 'View attendance' },
      { id: 'p80', code: 'hrms:attendance:create', module: 'HRMS', action: 'create', description: 'Record attendance' },
      { id: 'p81', code: 'hrms:leave:view', module: 'HRMS', action: 'view', description: 'View leave requests' },
      { id: 'p82', code: 'hrms:leave:create', module: 'HRMS', action: 'create', description: 'Request leave' },
      { id: 'p83', code: 'hrms:leave:approve', module: 'HRMS', action: 'approve', description: 'Approve or reject leave' },
      { id: 'p84', code: 'hrms:payroll:view', module: 'HRMS', action: 'view', description: 'View payroll (sensitive)' },
      { id: 'p85', code: 'hrms:payroll:create', module: 'HRMS', action: 'create', description: 'Run payroll (sensitive)' },
      { id: 'p86', code: 'hrms:report:view', module: 'HRMS', action: 'view', description: 'View HR reports' }
    ];

    for (const permission of catalog) {
      const existing = Array.from(this.permissions.values()).find((item) => item.code === permission.code);
      if (!existing) {
        this.permissions.set(permission.id, permission);
      }
    }

    const adminRole = Array.from(this.roles.values()).find((role) => role.code === 'SUPER_ADMIN');
    const quarryRole = Array.from(this.roles.values()).find((role) => role.code === 'QUARRY_MANAGER');
    const grant = (roleId: string, permissionCode: string) => {
      const permission = Array.from(this.permissions.values()).find((item) => item.code === permissionCode);
      if (!permission) return;
      const already = Array.from(this.rolePermissions.values()).some(
        (row) => row.roleId === roleId && (row.permissionId === permission.id || row.permissionCode === permission.code)
      );
      if (already) return;
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId,
        permissionId: permission.id,
        permissionCode: permission.code
      });
    };

    if (adminRole) {
      for (const permission of catalog) grant(adminRole.id, permission.code);
    }
    if (quarryRole) {
      for (const code of [
        'hrms:employee:view',
        'hrms:employee:create',
        'hrms:employee:update',
        'hrms:attendance:view',
        'hrms:attendance:create',
        'hrms:leave:view',
        'hrms:leave:create',
        'hrms:leave:approve'
      ]) {
        grant(quarryRole.id, code);
      }
    }
  }

  private ensureFinancePermissionCatalog(): void {
    const catalog: Permission[] = [
      { id: 'p58', code: 'finance:transaction:view', module: 'Finance', action: 'view', description: 'View finance transactions and accounts' },
      { id: 'p59', code: 'finance:transaction:create', module: 'Finance', action: 'create', description: 'Create finance transactions from ERP' },
      { id: 'p60', code: 'finance:invoice:view', module: 'Finance', action: 'view', description: 'View invoices and payments' },
      { id: 'p61', code: 'finance:invoice:create', module: 'Finance', action: 'create', description: 'Create and issue invoices' },
      { id: 'p62', code: 'finance:payment:create', module: 'Finance', action: 'create', description: 'Record invoice payments' },
      { id: 'p63', code: 'finance:expense:view', module: 'Finance', action: 'view', description: 'View expenses' },
      { id: 'p64', code: 'finance:expense:create', module: 'Finance', action: 'create', description: 'Create and submit expenses' },
      { id: 'p65', code: 'finance:expense:approve', module: 'Finance', action: 'approve', description: 'Approve or reject expenses' },
      { id: 'p66', code: 'finance:report:view', module: 'Finance', action: 'view', description: 'View financial reports' }
    ];
    for (const permission of catalog) {
      const existing = Array.from(this.permissions.values()).find((item) => item.code === permission.code);
      if (!existing) this.permissions.set(permission.id, permission);
    }
    const adminRole = Array.from(this.roles.values()).find((role) => role.code === 'SUPER_ADMIN');
    const apexRole = this.roles.get('role-apex-admin') || Array.from(this.roles.values()).find((role) => role.code === 'APEX_ADMIN');
    const grant = (roleId: string, permissionCode: string) => {
      const permission = Array.from(this.permissions.values()).find((item) => item.code === permissionCode);
      if (!permission) return;
      const already = Array.from(this.rolePermissions.values()).some(
        (row) => row.roleId === roleId && (row.permissionId === permission.id || row.permissionCode === permission.code)
      );
      if (already) return;
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId,
        permissionId: permission.id,
        permissionCode: permission.code
      });
    };
    if (adminRole) {
      for (const permission of catalog) grant(adminRole.id, permission.code);
    }
    if (apexRole) {
      grant(apexRole.id, 'finance:transaction:view');
      grant(apexRole.id, 'finance:invoice:view');
    }
    const apexUser = this.users.get('usr-apex-mgr-003');
    if (apexRole && apexUser) {
      const hasRole = Array.from(this.userRoles.values()).some((ur) => ur.userId === apexUser.id && ur.roleId === apexRole.id);
      if (!hasRole) {
        this.userRoles.set('ur-3', {
          id: 'ur-3',
          userId: apexUser.id,
          roleId: apexRole.id,
          tenantId: apexUser.tenantId,
          assignedAt: new Date().toISOString(),
          assignedBy: 'SYSTEM'
        });
      }
    }
    if (!apexRole) {
      const tenant2 = Array.from(this.tenants.values()).find((t) => t.code === 'APEX-MINING');
      if (tenant2) {
        const roleId = 'role-apex-admin';
        if (!this.roles.has(roleId)) {
          const now = new Date().toISOString();
          this.roles.set(roleId, {
            id: roleId,
            tenantId: tenant2.id,
            code: 'APEX_ADMIN',
            name: 'Apex Site Administrator',
            description: 'Apex tenant administrator with finance read access',
            isSystemRole: false,
            createdAt: now,
            updatedAt: now,
            version: 1
          });
        }
        grant(roleId, 'finance:transaction:view');
        grant(roleId, 'finance:invoice:view');
        const apexUser = this.users.get('usr-apex-mgr-003');
        if (apexUser) {
          const hasRole = Array.from(this.userRoles.values()).some((ur) => ur.userId === apexUser.id && ur.roleId === roleId);
          if (!hasRole) {
            this.userRoles.set('ur-3', {
              id: 'ur-3',
              userId: apexUser.id,
              roleId,
              tenantId: apexUser.tenantId,
              assignedAt: new Date().toISOString(),
              assignedBy: 'SYSTEM'
            });
          }
        }
      }
    }
  }

  private ensureFleetPermissionCatalog(): void {
    const catalog: Permission[] = [
      { id: 'p4', code: 'fleet:vehicle:dispatch', module: 'Fleet', action: 'dispatch', description: 'Dispatch Fleet Vehicles' },
      { id: 'p34', code: 'fleet:vehicle:view', module: 'Fleet', action: 'view', description: 'View fleet vehicle master' },
      { id: 'p35', code: 'fleet:vehicle:create', module: 'Fleet', action: 'create', description: 'Create fleet vehicles' },
      { id: 'p36', code: 'fleet:vehicle:update', module: 'Fleet', action: 'update', description: 'Update fleet vehicles' },
      { id: 'p37', code: 'fleet:vehicle:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet vehicles' },
      { id: 'p38', code: 'fleet:driver:view', module: 'Fleet', action: 'view', description: 'View fleet driver master' },
      { id: 'p39', code: 'fleet:driver:create', module: 'Fleet', action: 'create', description: 'Create fleet drivers' },
      { id: 'p40', code: 'fleet:driver:update', module: 'Fleet', action: 'update', description: 'Update fleet drivers' },
      { id: 'p41', code: 'fleet:driver:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet drivers' },
      { id: 'p42', code: 'fleet:document:view', module: 'Fleet', action: 'view', description: 'View fleet vehicle documents' },
      { id: 'p43', code: 'fleet:document:create', module: 'Fleet', action: 'create', description: 'Create fleet vehicle documents' },
      { id: 'p44', code: 'fleet:document:update', module: 'Fleet', action: 'update', description: 'Update fleet vehicle documents' },
      { id: 'p45', code: 'fleet:document:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet vehicle documents' },
      { id: 'p46', code: 'fleet:maintenance:view', module: 'Fleet', action: 'view', description: 'View fleet maintenance records' },
      { id: 'p47', code: 'fleet:maintenance:create', module: 'Fleet', action: 'create', description: 'Create fleet maintenance records' },
      { id: 'p48', code: 'fleet:maintenance:update', module: 'Fleet', action: 'update', description: 'Update fleet maintenance records' },
      { id: 'p49', code: 'fleet:maintenance:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet maintenance records' },
      { id: 'p50', code: 'fleet:fuel:view', module: 'Fleet', action: 'view', description: 'View fleet fuel records' },
      { id: 'p51', code: 'fleet:fuel:create', module: 'Fleet', action: 'create', description: 'Create fleet fuel records' },
      { id: 'p52', code: 'fleet:fuel:update', module: 'Fleet', action: 'update', description: 'Update fleet fuel records' },
      { id: 'p53', code: 'fleet:fuel:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet fuel records' },
      { id: 'p54', code: 'fleet:operation:view', module: 'Fleet', action: 'view', description: 'View fleet operations' },
      { id: 'p55', code: 'fleet:operation:create', module: 'Fleet', action: 'create', description: 'Create fleet operations' },
      { id: 'p56', code: 'fleet:operation:update', module: 'Fleet', action: 'update', description: 'Update fleet operations' },
      { id: 'p57', code: 'fleet:operation:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet operations' }
    ];
    for (const permission of catalog) {
      const existing = Array.from(this.permissions.values()).find((item) => item.code === permission.code);
      if (!existing) this.permissions.set(permission.id, permission);
    }
    const adminRole = Array.from(this.roles.values()).find((role) => role.code === 'SUPER_ADMIN');
    const quarryRole = Array.from(this.roles.values()).find((role) => role.code === 'QUARRY_MANAGER');
    const grant = (roleId: string, permissionCode: string) => {
      const permission = Array.from(this.permissions.values()).find((item) => item.code === permissionCode);
      if (!permission) return;
      const already = Array.from(this.rolePermissions.values()).some(
        (row) => row.roleId === roleId && (row.permissionId === permission.id || row.permissionCode === permission.code)
      );
      if (already) return;
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId,
        permissionId: permission.id,
        permissionCode: permission.code
      });
    };
    if (adminRole) {
      for (const permission of catalog) grant(adminRole.id, permission.code);
    }
    if (quarryRole) {
      grant(quarryRole.id, 'fleet:vehicle:view');
      grant(quarryRole.id, 'fleet:driver:view');
      grant(quarryRole.id, 'fleet:document:view');
      grant(quarryRole.id, 'fleet:maintenance:view');
      grant(quarryRole.id, 'fleet:fuel:view');
      grant(quarryRole.id, 'fleet:operation:view');
    }
  }

  public seedFleetDataOnly() {
    const now = new Date().toISOString();
    const tenantId = 'tenant-rz-global-001';
    const companyId = 'comp-rz-ventures-001';
    const branchId = 'br-quarry-alpha';

    const catTipper: FleetVehicleCategory = {
      id: 'cat-tipper-001',
      tenantId,
      code: 'TIPPER_TRUCK',
      name: 'Heavy Duty Tipper Truck',
      description: 'Multi-axle tippers for quarry aggregate transport',
      isCustom: false,
      createdAt: now,
      updatedAt: now
    };
    this.fleetVehicleCategories.set(catTipper.id, catTipper);

    const veh1: FleetVehicle = {
      id: 'veh-ka19-4491',
      tenantId,
      companyId,
      branchId,
      registrationNumber: 'KA-19-AB-4491',
      vehicleType: 'Tipper',
      categoryId: catTipper.id,
      categoryName: catTipper.name,
      make: 'BharatBenz',
      model: '2823R 10-Wheeler',
      variant: 'Mining Special',
      manufacturingYear: 2024,
      purchaseDate: '2024-03-15',
      purchaseValue: 4850000,
      ownershipType: 'OWNED',
      ownerName: 'Racezone Ventures & Mining Ltd',
      fuelType: 'DIESEL',
      fuelCapacity: 300,
      engineNumber: 'ENG-BB-99201',
      chassisNumber: 'CHS-BB-88301',
      color: 'Amber Gold',
      seatingCapacity: 2,
      loadCapacity: 28,
      currentOdometer: 18450.0,
      status: 'AVAILABLE',
      location: 'Quarry Pit #1 Yard',
      remarks: 'Fitted with telematics GPS & automatic payload scale',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const veh2: FleetVehicle = {
      id: 'veh-ka19-8820',
      tenantId,
      companyId,
      branchId,
      registrationNumber: 'KA-19-MC-8820',
      vehicleType: 'Tipper',
      categoryId: catTipper.id,
      categoryName: catTipper.name,
      make: 'Volvo',
      model: 'FMX 460 8x4 Dump Truck',
      variant: 'Heavy Hauler',
      manufacturingYear: 2025,
      purchaseDate: '2025-01-10',
      purchaseValue: 8200000,
      ownershipType: 'OWNED',
      ownerName: 'Racezone Ventures & Mining Ltd',
      fuelType: 'DIESEL',
      fuelCapacity: 400,
      engineNumber: 'ENG-VOL-4401',
      chassisNumber: 'CHS-VOL-7712',
      color: 'Navy Blue',
      seatingCapacity: 2,
      loadCapacity: 35,
      currentOdometer: 12100.0,
      status: 'AVAILABLE',
      location: 'Main Crusher Yard',
      remarks: 'Primary heavy rock hauler',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.fleetVehicles.set(veh1.id, veh1);
    this.fleetVehicles.set(veh2.id, veh2);

    const drv1: FleetDriver = {
      id: 'drv-suresh-001',
      tenantId,
      employeeId: 'EMP-088',
      linkedUserId: 'usr-quarry-mgr-002',
      name: 'Suresh Kumar',
      phone: '+91-98450-11223',
      licenseNumber: 'KA-19-2018-0099411',
      licenseType: 'HEAVY_COMMERCIAL_HAZMAT',
      licenseIssueDate: '2018-05-10',
      licenseExpiryDate: '2028-05-09',
      status: 'ACTIVE',
      joiningDate: '2022-01-15',
      emergencyContact: 'Lakshmi Kumar (+91-98450-11224)',
      address: 'Near Quarry Gate #2, Bantwal',
      remarks: 'Zero-incident record. Certified for heavy tippers.',
      createdAt: now,
      updatedAt: now
    };
    this.fleetDrivers.set(drv1.id, drv1);
  }

  private seedDefaultEnterpriseData() {
    const now = new Date().toISOString();

    // 1. Tenants
    const tenant1: Tenant = {
      id: 'tenant-rz-global-001',
      code: 'RZ-GLOBAL',
      name: 'Racezone Ventures & Mining Ltd',
      domain: 'racezoneventures.com',
      status: 'ACTIVE',
      tier: 'ENTERPRISE',
      settingsJson: JSON.stringify({ theme: 'dark', defaultCurrency: 'USD' }),
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const tenant2: Tenant = {
      id: 'tenant-apex-quarry-002',
      code: 'APEX-MINING',
      name: 'Apex Mining & Minerals Ltd',
      domain: 'apexmining.com',
      status: 'ACTIVE',
      tier: 'BUSINESS',
      settingsJson: JSON.stringify({ theme: 'light', defaultCurrency: 'USD' }),
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.tenants.set(tenant1.id, tenant1);
    this.tenants.set(tenant2.id, tenant2);

    // 2. Companies
    const company1: Company = {
      id: 'comp-101',
      tenantId: tenant1.id,
      code: 'RZ-CORP',
      name: 'Racezone Minetrix Operating Corp',
      taxId: 'TAX-9948201',
      currency: 'USD',
      country: 'USA',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const company2: Company = {
      id: 'comp-202',
      tenantId: tenant2.id,
      code: 'APEX-CORP',
      name: 'Apex Quarries Operations',
      taxId: 'TAX-1102934',
      currency: 'USD',
      country: 'USA',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.companies.set(company1.id, company1);
    this.companies.set(company2.id, company2);

    // 3. Branches
    const branch1: Branch = {
      id: 'br-quarry-alpha',
      tenantId: tenant1.id,
      companyId: company1.id,
      code: 'BR-Q1',
      name: 'Quarry Site Alpha (Laterite & Granite)',
      locationType: 'QUARRY',
      address: 'Sector 14 Mining Corridor, Rock Ridge',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const branch2: Branch = {
      id: 'br-crusher-beta',
      tenantId: tenant1.id,
      companyId: company1.id,
      code: 'BR-C2',
      name: 'Crusher Unit Beta',
      locationType: 'CRUSHER',
      address: 'Industrial Hub North, Gate 4',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.branches.set(branch1.id, branch1);
    this.branches.set(branch2.id, branch2);

    // 4. Permissions
    const permList: Array<{ id: string; code: string; module: string; action: string; description: string }> = [
      { id: 'p1', code: 'shared:admin:access', module: 'Shared Core', action: 'admin', description: 'Full Platform Admin Rights' },
      { id: 'p2', code: 'mining:quarry:create', module: 'Mining', action: 'create', description: 'Create Quarry Records' },
      { id: 'p3', code: 'mining:quarry:view', module: 'Mining', action: 'view', description: 'View Quarry Records' },
      { id: 'p8', code: 'mining:product:view', module: 'Mining', action: 'view', description: 'View ERP products and prices' },
      { id: 'p9', code: 'mining:product:create', module: 'Mining', action: 'create', description: 'Manage ERP products and prices' },
      { id: 'p10', code: 'mining:production:view', module: 'Mining', action: 'view', description: 'View production batches' },
      { id: 'p11', code: 'mining:production:create', module: 'Mining', action: 'create', description: 'Create and post production batches' },
      { id: 'p12', code: 'mining:stock:view', module: 'Mining', action: 'view', description: 'View stock balances and ledger' },
      { id: 'p13', code: 'mining:stock:adjust', module: 'Mining', action: 'adjust', description: 'Post stock adjustments' },
      { id: 'p14', code: 'mining:gatepass:view', module: 'Mining', action: 'view', description: 'View gate passes' },
      { id: 'p15', code: 'mining:gatepass:create', module: 'Mining', action: 'create', description: 'Create gate passes' },
      { id: 'p16', code: 'mining:gatepass:approve', module: 'Mining', action: 'approve', description: 'Approve, issue, or cancel gate passes' },
      { id: 'p17', code: 'mining:dispatch:view', module: 'Mining', action: 'view', description: 'View dispatches' },
      { id: 'p18', code: 'mining:dispatch:create', module: 'Mining', action: 'create', description: 'Create dispatches' },
      { id: 'p19', code: 'mining:settlement:view', module: 'Mining', action: 'view', description: 'View landowner settlements' },
      { id: 'p20', code: 'mining:settlement:create', module: 'Mining', action: 'create', description: 'Create landowner settlements' },
      { id: 'p21', code: 'mining:crm:view', module: 'Mining', action: 'view', description: 'View CRM customers, contacts, and leads' },
      { id: 'p22', code: 'mining:crm:create', module: 'Mining', action: 'create', description: 'Create CRM customers, contacts, and leads' },
      { id: 'p23', code: 'mining:order:view', module: 'Mining', action: 'view', description: 'View sales orders' },
      { id: 'p24', code: 'mining:order:create', module: 'Mining', action: 'create', description: 'Create and confirm sales orders' },
      { id: 'p4', code: 'fleet:vehicle:dispatch', module: 'Fleet', action: 'dispatch', description: 'Dispatch Fleet Vehicles' },
      { id: 'p34', code: 'fleet:vehicle:view', module: 'Fleet', action: 'view', description: 'View fleet vehicle master' },
      { id: 'p35', code: 'fleet:vehicle:create', module: 'Fleet', action: 'create', description: 'Create fleet vehicles' },
      { id: 'p36', code: 'fleet:vehicle:update', module: 'Fleet', action: 'update', description: 'Update fleet vehicles' },
      { id: 'p37', code: 'fleet:vehicle:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet vehicles' },
      { id: 'p38', code: 'fleet:driver:view', module: 'Fleet', action: 'view', description: 'View fleet driver master' },
      { id: 'p39', code: 'fleet:driver:create', module: 'Fleet', action: 'create', description: 'Create fleet drivers' },
      { id: 'p40', code: 'fleet:driver:update', module: 'Fleet', action: 'update', description: 'Update fleet drivers' },
      { id: 'p41', code: 'fleet:driver:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet drivers' },
      { id: 'p42', code: 'fleet:document:view', module: 'Fleet', action: 'view', description: 'View fleet vehicle documents' },
      { id: 'p43', code: 'fleet:document:create', module: 'Fleet', action: 'create', description: 'Create fleet vehicle documents' },
      { id: 'p44', code: 'fleet:document:update', module: 'Fleet', action: 'update', description: 'Update fleet vehicle documents' },
      { id: 'p45', code: 'fleet:document:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet vehicle documents' },
      { id: 'p46', code: 'fleet:maintenance:view', module: 'Fleet', action: 'view', description: 'View fleet maintenance records' },
      { id: 'p47', code: 'fleet:maintenance:create', module: 'Fleet', action: 'create', description: 'Create fleet maintenance records' },
      { id: 'p48', code: 'fleet:maintenance:update', module: 'Fleet', action: 'update', description: 'Update fleet maintenance records' },
      { id: 'p49', code: 'fleet:maintenance:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet maintenance records' },
      { id: 'p50', code: 'fleet:fuel:view', module: 'Fleet', action: 'view', description: 'View fleet fuel records' },
      { id: 'p51', code: 'fleet:fuel:create', module: 'Fleet', action: 'create', description: 'Create fleet fuel records' },
      { id: 'p52', code: 'fleet:fuel:update', module: 'Fleet', action: 'update', description: 'Update fleet fuel records' },
      { id: 'p53', code: 'fleet:fuel:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet fuel records' },
      { id: 'p54', code: 'fleet:operation:view', module: 'Fleet', action: 'view', description: 'View fleet operations' },
      { id: 'p55', code: 'fleet:operation:create', module: 'Fleet', action: 'create', description: 'Create fleet operations' },
      { id: 'p56', code: 'fleet:operation:update', module: 'Fleet', action: 'update', description: 'Update fleet operations' },
      { id: 'p57', code: 'fleet:operation:archive', module: 'Fleet', action: 'archive', description: 'Archive fleet operations' },
      { id: 'p5', code: 'finance:invoice:approve', module: 'Finance', action: 'approve', description: 'Approve Finance Invoices' },
      { id: 'p58', code: 'finance:transaction:view', module: 'Finance', action: 'view', description: 'View finance transactions and accounts' },
      { id: 'p59', code: 'finance:transaction:create', module: 'Finance', action: 'create', description: 'Create finance transactions from ERP' },
      { id: 'p60', code: 'finance:invoice:view', module: 'Finance', action: 'view', description: 'View invoices and payments' },
      { id: 'p61', code: 'finance:invoice:create', module: 'Finance', action: 'create', description: 'Create and issue invoices' },
      { id: 'p62', code: 'finance:payment:create', module: 'Finance', action: 'create', description: 'Record invoice payments' },
      { id: 'p63', code: 'finance:expense:view', module: 'Finance', action: 'view', description: 'View expenses' },
      { id: 'p64', code: 'finance:expense:create', module: 'Finance', action: 'create', description: 'Create and submit expenses' },
      { id: 'p65', code: 'finance:expense:approve', module: 'Finance', action: 'approve', description: 'Approve or reject expenses' },
      { id: 'p66', code: 'finance:report:view', module: 'Finance', action: 'view', description: 'View financial reports' },
      { id: 'p6', code: 'hrms:employee:view', module: 'HRMS', action: 'view', description: 'View HR Employee Master' },
      { id: 'p7', code: 'chat:message:send', module: 'RZ Chat', action: 'send', description: 'Send Realtime Chat Messages' },
      { id: 'p8', code: 'marketplace.load.read', module: 'Marketplace', action: 'read', description: 'View Load Exchange Requests' },
      { id: 'p9', code: 'marketplace.load.create', module: 'Marketplace', action: 'create', description: 'Create Load Exchange Request' },
      { id: 'p10', code: 'marketplace.load.update', module: 'Marketplace', action: 'update', description: 'Update Load Exchange Request' },
      { id: 'p11', code: 'marketplace.load.delete', module: 'Marketplace', action: 'delete', description: 'Delete Load Exchange Request' },
      { id: 'p12', code: 'marketplace.match.read', module: 'Marketplace', action: 'match_read', description: 'View AI Matches' },
      { id: 'p13', code: 'marketplace.match.create', module: 'Marketplace', action: 'match_create', description: 'Trigger AI Matching Engine' },
      { id: 'p14', code: 'marketplace.offer.read', module: 'Marketplace', action: 'offer_read', description: 'View Transporter Offers' },
      { id: 'p15', code: 'marketplace.offer.create', module: 'Marketplace', action: 'offer_create', description: 'Submit Transporter Offer' },
      { id: 'p16', code: 'marketplace.offer.accept', module: 'Marketplace', action: 'offer_accept', description: 'Accept Transporter Offer' },
      { id: 'p17', code: 'marketplace.offer.reject', module: 'Marketplace', action: 'offer_reject', description: 'Reject Transporter Offer' },
      { id: 'p18', code: 'marketplace.booking.read', module: 'Marketplace', action: 'booking_read', description: 'View Load Bookings' },
      { id: 'p19', code: 'marketplace.booking.create', module: 'Marketplace', action: 'booking_create', description: 'Create Booking' },
      { id: 'p20', code: 'marketplace.booking.cancel', module: 'Marketplace', action: 'booking_cancel', description: 'Cancel Booking' },
      { id: 'p21', code: 'marketplace.delivery.read', module: 'Marketplace', action: 'delivery_read', description: 'View Deliveries' },
      { id: 'p22', code: 'marketplace.delivery.update', module: 'Marketplace', action: 'delivery_update', description: 'Update Delivery Status' },
      { id: 'p23', code: 'marketplace.rating.create', module: 'Marketplace', action: 'rating_create', description: 'Submit Rating' },
      { id: 'p24', code: 'marketplace.dispute.create', module: 'Marketplace', action: 'dispute_create', description: 'Create Dispute' },
      { id: 'p25', code: 'marketplace.reports.read', module: 'Marketplace', action: 'reports_read', description: 'View Marketplace Reports' },
      { id: 'p26', code: 'crm.customer.read', module: 'CRM', action: 'customer_read', description: 'Read CRM Customers' },
      { id: 'p27', code: 'crm.customer.create', module: 'CRM', action: 'customer_create', description: 'Create CRM Customer' },
      { id: 'p28', code: 'crm.customer.update', module: 'CRM', action: 'customer_update', description: 'Update CRM Customer' },
      { id: 'p29', code: 'crm.customer.delete', module: 'CRM', action: 'customer_delete', description: 'Delete CRM Customer' },
      { id: 'p30', code: 'crm.contact.read', module: 'CRM', action: 'contact_read', description: 'Read CRM Contacts' },
      { id: 'p31', code: 'crm.contact.create', module: 'CRM', action: 'contact_create', description: 'Create CRM Contact' },
      { id: 'p32', code: 'crm.contact.update', module: 'CRM', action: 'contact_update', description: 'Update CRM Contact' },
      { id: 'p33', code: 'crm.lead.read', module: 'CRM', action: 'lead_read', description: 'Read CRM Leads' },
      { id: 'p34', code: 'crm.lead.create', module: 'CRM', action: 'lead_create', description: 'Create CRM Lead' },
      { id: 'p35', code: 'crm.lead.update', module: 'CRM', action: 'lead_update', description: 'Update CRM Lead' },
      { id: 'p36', code: 'crm.lead.assign', module: 'CRM', action: 'lead_assign', description: 'Assign CRM Lead' },
      { id: 'p37', code: 'crm.opportunity.read', module: 'CRM', action: 'opportunity_read', description: 'Read Opportunities' },
      { id: 'p38', code: 'crm.opportunity.create', module: 'CRM', action: 'opportunity_create', description: 'Create Opportunity' },
      { id: 'p39', code: 'crm.opportunity.update', module: 'CRM', action: 'opportunity_update', description: 'Update Opportunity' },
      { id: 'p40', code: 'crm.activity.read', module: 'CRM', action: 'activity_read', description: 'Read Sales Activities' },
      { id: 'p41', code: 'crm.activity.create', module: 'CRM', action: 'activity_create', description: 'Create Sales Activity' },
      { id: 'p42', code: 'crm.activity.update', module: 'CRM', action: 'activity_update', description: 'Update Sales Activity' },
      { id: 'p43', code: 'crm.quote.read', module: 'CRM', action: 'quote_read', description: 'Read Quotations' },
      { id: 'p44', code: 'crm.quote.create', module: 'CRM', action: 'quote_create', description: 'Create Quotation' },
      { id: 'p45', code: 'crm.quote.update', module: 'CRM', action: 'quote_update', description: 'Update Quotation' },
      { id: 'p46', code: 'crm.quote.approve', module: 'CRM', action: 'quote_approve', description: 'Approve Quotation' },
      { id: 'p47', code: 'crm.support.read', module: 'CRM', action: 'support_read', description: 'Read Support Tickets' },
      { id: 'p48', code: 'crm.support.create', module: 'CRM', action: 'support_create', description: 'Create Support Ticket' },
      { id: 'p49', code: 'crm.support.update', module: 'CRM', action: 'support_update', description: 'Update Support Ticket' },
      { id: 'p50', code: 'crm.support.assign', module: 'CRM', action: 'support_assign', description: 'Assign Support Ticket' },
      { id: 'p51', code: 'crm.reports.read', module: 'CRM', action: 'reports_read', description: 'Read CRM Reports' },
      { id: 'p52', code: 'finance.account.read', module: 'Finance', action: 'account_read', description: 'Read Chart of Accounts' },
      { id: 'p53', code: 'finance.account.create', module: 'Finance', action: 'account_create', description: 'Create Account' },
      { id: 'p54', code: 'finance.account.update', module: 'Finance', action: 'account_update', description: 'Update Account' },
      { id: 'p55', code: 'finance.journal.read', module: 'Finance', action: 'journal_read', description: 'Read Journals' },
      { id: 'p56', code: 'finance.journal.create', module: 'Finance', action: 'journal_create', description: 'Create Journal Entry' },
      { id: 'p57', code: 'finance.journal.post', module: 'Finance', action: 'journal_post', description: 'Post Journal Entry' },
      { id: 'p58', code: 'finance.journal.reverse', module: 'Finance', action: 'journal_reverse', description: 'Reverse Journal Entry' },
      { id: 'p59', code: 'finance.invoice.read', module: 'Finance', action: 'invoice_read', description: 'Read Customer Invoices' },
      { id: 'p60', code: 'finance.invoice.create', module: 'Finance', action: 'invoice_create', description: 'Create Customer Invoice' },
      { id: 'p61', code: 'finance.invoice.update', module: 'Finance', action: 'invoice_update', description: 'Update Customer Invoice' },
      { id: 'p62', code: 'finance.invoice.approve', module: 'Finance', action: 'invoice_approve', description: 'Approve Customer Invoice' },
      { id: 'p63', code: 'finance.payment.read', module: 'Finance', action: 'payment_read', description: 'Read Customer Payments' },
      { id: 'p64', code: 'finance.payment.create', module: 'Finance', action: 'payment_create', description: 'Record Customer Payment' },
      { id: 'p65', code: 'finance.payment.allocate', module: 'Finance', action: 'payment_allocate', description: 'Allocate Customer Payment' },
      { id: 'p66', code: 'finance.bill.read', module: 'Finance', action: 'bill_read', description: 'Read Supplier Bills' },
      { id: 'p67', code: 'finance.bill.create', module: 'Finance', action: 'bill_create', description: 'Create Supplier Bill' },
      { id: 'p68', code: 'finance.bill.approve', module: 'Finance', action: 'bill_approve', description: 'Approve Supplier Bill' },
      { id: 'p69', code: 'finance.expense.read', module: 'Finance', action: 'expense_read', description: 'Read Finance Expenses' },
      { id: 'p70', code: 'finance.expense.create', module: 'Finance', action: 'expense_create', description: 'Record Expense' },
      { id: 'p71', code: 'finance.expense.approve', module: 'Finance', action: 'expense_approve', description: 'Approve Expense' },
      { id: 'p72', code: 'finance.bank.read', module: 'Finance', action: 'bank_read', description: 'Read Bank Accounts' },
      { id: 'p73', code: 'finance.bank.reconcile', module: 'Finance', action: 'bank_reconcile', description: 'Reconcile Bank Statement' },
      { id: 'p74', code: 'finance.reports.read', module: 'Finance', action: 'reports_read', description: 'Read Financial Statements & Reports' },
      { id: 'p75', code: 'finance.period.close', module: 'Finance', action: 'period_close', description: 'Close Fiscal Period' },
      { id: 'p76', code: 'finance.period.reopen', module: 'Finance', action: 'period_reopen', description: 'Reopen Fiscal Period' },
      { id: 'p77', code: 'hrms:employee:create', module: 'HRMS', action: 'create', description: 'Create employee master records' },
      { id: 'p78', code: 'hrms:employee:update', module: 'HRMS', action: 'update', description: 'Update or archive employees' },
      { id: 'p79', code: 'hrms:attendance:view', module: 'HRMS', action: 'view', description: 'View attendance' },
      { id: 'p80', code: 'hrms:attendance:create', module: 'HRMS', action: 'create', description: 'Record attendance' },
      { id: 'p81', code: 'hrms:leave:view', module: 'HRMS', action: 'view', description: 'View leave requests' },
      { id: 'p82', code: 'hrms:leave:create', module: 'HRMS', action: 'create', description: 'Request leave' },
      { id: 'p83', code: 'hrms:leave:approve', module: 'HRMS', action: 'approve', description: 'Approve or reject leave' },
      { id: 'p84', code: 'hrms:payroll:view', module: 'HRMS', action: 'view', description: 'View payroll (sensitive)' },
      { id: 'p85', code: 'hrms:payroll:create', module: 'HRMS', action: 'create', description: 'Run payroll (sensitive)' },
      { id: 'p86', code: 'hrms:report:view', module: 'HRMS', action: 'view', description: 'View HR reports' }
    ];
    permList.forEach(p => this.permissions.set(p.id, p));

    // 5. Roles
    const roleAdmin: Role = {
      id: 'role-super-admin',
      tenantId: tenant1.id,
      code: 'SUPER_ADMIN',
      name: 'Super Enterprise Administrator',
      description: 'Full access across all modules and tenant settings',
      isSystemRole: true,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const roleQuarryMgr: Role = {
      id: 'role-quarry-mgr',
      tenantId: tenant1.id,
      code: 'QUARRY_MANAGER',
      name: 'Quarry Site Manager',
      description: 'Manages Quarry operations, weighbridge tickets, and dispatches',
      isSystemRole: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.roles.set(roleAdmin.id, roleAdmin);
    this.roles.set(roleQuarryMgr.id, roleQuarryMgr);

    const roleApexAdmin: Role = {
      id: 'role-apex-admin',
      tenantId: tenant2.id,
      code: 'APEX_ADMIN',
      name: 'Apex Site Administrator',
      description: 'Apex tenant administrator with finance read access for isolation tests',
      isSystemRole: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.roles.set(roleApexAdmin.id, roleApexAdmin);

    const apexFinancePermIds = ['p58', 'p60'];
    for (const permId of apexFinancePermIds) {
      const perm = permList.find((item) => item.id === permId);
      if (!perm) continue;
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId: roleApexAdmin.id,
        permissionId: perm.id,
        permissionCode: perm.code
      });
    }

    // Link Role Permissions
    permList.forEach(p => {
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId: roleAdmin.id,
        permissionId: p.id,
        permissionCode: p.code
      });
    });

    // 6. Users
    const passwordResult = hashPassword('AdminPass2026!');
    const userAdmin: User = {
      id: 'usr-admin-001',
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      email: 'admin@racezoneventures.com',
      passwordHash: passwordResult.hash,
      salt: passwordResult.salt,
      fullName: 'Nafid Khan (CEO & Enterprise Admin)',
      phone: '+1-800-MINETRIX',
      department: 'Executive Board',
      designation: 'Chief Executive Officer',
      status: 'ACTIVE',
      isMfaEnabled: true,
      linkedEmployeeId: 'EMP-001',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    const userManagerPass = hashPassword('ManagerPass2026!');
    const userManager: User = {
      id: 'usr-quarry-mgr-002',
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      email: 'quarry.manager@racezoneventures.com',
      passwordHash: userManagerPass.hash,
      salt: userManagerPass.salt,
      fullName: 'Vikram Sharma',
      phone: '+1-800-QUARRY',
      department: 'Mining Operations',
      designation: 'Senior Quarry Manager',
      status: 'ACTIVE',
      isMfaEnabled: false,
      linkedEmployeeId: 'EMP-088',
      linkedOperatorId: 'OP-Q1-01',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    // User for Tenant 2 (Apex)
    const userApexPass = hashPassword('ApexPass2026!');
    const userApex: User = {
      id: 'usr-apex-mgr-003',
      tenantId: tenant2.id,
      companyId: company2.id,
      email: 'site.mgr@apexmining.com',
      passwordHash: userApexPass.hash,
      salt: userApexPass.salt,
      fullName: 'David Apex',
      department: 'Mining Operations',
      designation: 'Plant Operator',
      status: 'ACTIVE',
      isMfaEnabled: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    this.users.set(userAdmin.id, userAdmin);
    this.users.set(userManager.id, userManager);
    this.users.set(userApex.id, userApex);

    // User Roles
    this.userRoles.set('ur-1', {
      id: 'ur-1',
      userId: userAdmin.id,
      roleId: roleAdmin.id,
      tenantId: tenant1.id,
      assignedAt: now,
      assignedBy: 'SYSTEM'
    });
    this.userRoles.set('ur-2', {
      id: 'ur-2',
      userId: userManager.id,
      roleId: roleQuarryMgr.id,
      tenantId: tenant1.id,
      assignedAt: now,
      assignedBy: userAdmin.id
    });
    this.userRoles.set('ur-3', {
      id: 'ur-3',
      userId: userApex.id,
      roleId: roleApexAdmin.id,
      tenantId: tenant2.id,
      assignedAt: now,
      assignedBy: 'SYSTEM'
    });

    const quarryPermIds = [
      'p2', 'p3', 'p8', 'p9', 'p10', 'p11', 'p12', 'p13', 'p14', 'p15', 'p16', 'p17', 'p18', 'p19', 'p20', 'p21', 'p22', 'p23', 'p24',
      'p6', 'p25', 'p26', 'p27', 'p28', 'p29', 'p30', 'p31',
      'p4', 'p34', 'p38'
    ];
    for (const permId of quarryPermIds) {
      const perm = permList.find((item) => item.id === permId);
      if (!perm) continue;
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId: roleQuarryMgr.id,
        permissionId: perm.id,
        permissionCode: perm.code
      });
    }

    // 7. Master Data
    const md1: MasterData = {
      id: 'md-uom-mt',
      tenantId: tenant1.id,
      category: 'UOM',
      code: 'MT',
      name: 'Metric Tonne',
      valueJson: JSON.stringify({ conversionToKg: 1000, symbol: 'MT' }),
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const md2: MasterData = {
      id: 'md-uom-cft',
      tenantId: tenant1.id,
      category: 'UOM',
      code: 'CFT',
      name: 'Cubic Feet',
      valueJson: JSON.stringify({ conversionToCmt: 0.0283168, symbol: 'CFT' }),
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.masterData.set(md1.id, md1);
    this.masterData.set(md2.id, md2);

    // 8. Workflows
    const wfDef1: WorkflowDefinition = {
      id: 'wf-def-invoice-appr',
      tenantId: tenant1.id,
      code: 'WF_INVOICE_APPROVAL',
      name: 'Mining Invoice Approval Workflow',
      entityType: 'INVOICE',
      initialState: 'DRAFT',
      statesJson: JSON.stringify(['DRAFT', 'SUBMITTED', 'MANAGER_APPROVED', 'FINANCE_APPROVED', 'REJECTED']),
      transitionsJson: JSON.stringify([
        { from: 'DRAFT', to: 'SUBMITTED', requiredPermission: 'finance:invoice:submit' },
        { from: 'SUBMITTED', to: 'MANAGER_APPROVED', requiredPermission: 'finance:invoice:approve' },
        { from: 'MANAGER_APPROVED', to: 'FINANCE_APPROVED', requiredPermission: 'finance:invoice:approve' }
      ]),
      createdAt: now,
      updatedAt: now
    };
    this.workflowDefinitions.set(wfDef1.id, wfDef1);

    // 9. Initial Audit Log
    const audit1: AuditLog = {
      id: generateUuidV7(),
      tenantId: tenant1.id,
      actorUserId: userAdmin.id,
      actorEmail: userAdmin.email,
      action: 'SYSTEM_BOOTSTRAP',
      module: 'Shared Core',
      resource: 'DatabaseStore',
      ipAddress: '127.0.0.1',
      correlationId: generateUuidV7(),
      status: 'SUCCESS',
      createdAt: now
    };
    this.auditLogs.set(audit1.id, audit1);

    // 10. Seed Fleet Enterprise Data
    const catTipper: FleetVehicleCategory = {
      id: 'cat-tipper-001',
      tenantId: tenant1.id,
      code: 'TIPPER_TRUCK',
      name: 'Heavy Duty Tipper Truck',
      description: 'Multi-axle tippers for quarry aggregate transport',
      isCustom: false,
      createdAt: now,
      updatedAt: now
    };
    const catExcavator: FleetVehicleCategory = {
      id: 'cat-excavator-002',
      tenantId: tenant1.id,
      code: 'EXCAVATOR',
      name: 'Hydraulic Excavator',
      description: 'Heavy excavation equipment',
      isCustom: false,
      createdAt: now,
      updatedAt: now
    };
    this.fleetVehicleCategories.set(catTipper.id, catTipper);
    this.fleetVehicleCategories.set(catExcavator.id, catExcavator);

    const veh1: FleetVehicle = {
      id: 'veh-ka19-4491',
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      registrationNumber: 'KA-19-AB-4491',
      vehicleType: 'Tipper',
      categoryId: catTipper.id,
      categoryName: catTipper.name,
      make: 'BharatBenz',
      model: '2823R 10-Wheeler',
      variant: 'Mining Special',
      manufacturingYear: 2024,
      purchaseDate: '2024-03-15',
      purchaseValue: 4850000,
      ownershipType: 'OWNED',
      ownerName: 'Racezone Ventures & Mining Ltd',
      fuelType: 'DIESEL',
      fuelCapacity: 300,
      engineNumber: 'ENG-BB-99201',
      chassisNumber: 'CHS-BB-88301',
      color: 'Amber Gold',
      seatingCapacity: 2,
      loadCapacity: 28,
      currentOdometer: 18450.0,
      status: 'AVAILABLE',
      location: 'Quarry Pit #1 Yard',
      remarks: 'Fitted with telematics GPS & automatic payload scale',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const veh2: FleetVehicle = {
      id: 'veh-ka19-8820',
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      registrationNumber: 'KA-19-MC-8820',
      vehicleType: 'Tipper',
      categoryId: catTipper.id,
      categoryName: catTipper.name,
      make: 'Volvo',
      model: 'FMX 460 8x4 Dump Truck',
      variant: 'Heavy Hauler',
      manufacturingYear: 2025,
      purchaseDate: '2025-01-10',
      purchaseValue: 8200000,
      ownershipType: 'OWNED',
      ownerName: 'Racezone Ventures & Mining Ltd',
      fuelType: 'DIESEL',
      fuelCapacity: 400,
      engineNumber: 'ENG-VOL-4401',
      chassisNumber: 'CHS-VOL-7712',
      color: 'Navy Blue',
      seatingCapacity: 2,
      loadCapacity: 35,
      currentOdometer: 12100.0,
      status: 'AVAILABLE',
      location: 'Main Crusher Yard',
      remarks: 'Primary heavy rock hauler',
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.fleetVehicles.set(veh1.id, veh1);
    this.fleetVehicles.set(veh2.id, veh2);

    const drv1: FleetDriver = {
      id: 'drv-suresh-001',
      tenantId: tenant1.id,
      employeeId: 'EMP-088',
      linkedUserId: userManager.id,
      name: 'Suresh Kumar',
      phone: '+91-98450-11223',
      licenseNumber: 'KA-19-2018-0099411',
      licenseType: 'HEAVY_COMMERCIAL_HAZMAT',
      licenseIssueDate: '2018-05-10',
      licenseExpiryDate: '2028-05-09',
      status: 'ACTIVE',
      joiningDate: '2022-01-15',
      emergencyContact: 'Lakshmi Kumar (+91-98450-11224)',
      address: 'Near Quarry Gate #2, Bantwal',
      remarks: 'Zero-incident record. Certified for heavy tippers.',
      createdAt: now,
      updatedAt: now
    };
    this.fleetDrivers.set(drv1.id, drv1);

    // Fleet Audit Alert
    const alert1: FleetVehicleAlert = {
      id: generateUuidV7(),
      tenantId: tenant1.id,
      vehicleId: veh1.id,
      alertType: 'SERVICE_DUE',
      severity: 'WARNING',
      message: `Vehicle ${veh1.registrationNumber} is approaching 20,000 km service threshold.`,
      isResolved: false,
      createdAt: now
    };
    this.fleetAlerts.set(alert1.id, alert1);

    // Seed Marketplace & Load Exchange Data
    this.seedMarketplaceDataOnly(tenant1.id);

    // Seed Enterprise CRM Data
    this.seedCrmDataOnly();

    // Seed Enterprise Quarry Data
    this.seedQuarryDataOnly();

    console.log('[DB] Enterprise seed data, Fleet, Marketplace, CRM & Quarry records successfully created.');
  }

  public seedMarketplaceDataOnly(tenantId: string = 'tenant-rz-global-001') {
    const now = new Date().toISOString();

    // 1. Transporter Profiles
    const transp1: TransporterProfile = {
      id: 'tp-trans-001',
      tenantId,
      businessId: 'biz-trans-coastal',
      companyName: 'Coastal Logistics & Heavy Haulers Ltd',
      contactPerson: 'Vikram R. Shetty',
      phone: '+91-98800-44112',
      email: 'logistics@coastallogistics.com',
      rating: 4.85,
      totalTrips: 142,
      completedTrips: 139,
      cancellationRate: 1.2,
      verifiedStatus: 'VERIFIED',
      serviceAreas: ['Mangaluru', 'Udupi', 'Bantwal', 'Surathkal', 'Bengaluru'],
      vehicleTypes: ['Tipper', 'Trailer', 'Container', 'Dumper'],
      baseRatePerKm: 62.00,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const transp2: TransporterProfile = {
      id: 'tp-trans-002',
      tenantId,
      businessId: 'biz-trans-apex',
      companyName: 'Apex Express Freight Services',
      contactPerson: 'Anand Rao',
      phone: '+91-98440-55667',
      email: 'dispatch@apexexpress.in',
      rating: 4.70,
      totalTrips: 98,
      completedTrips: 95,
      cancellationRate: 2.0,
      verifiedStatus: 'VERIFIED',
      serviceAreas: ['Mangaluru', 'Dharmasthala', 'Puttur', 'Hassan'],
      vehicleTypes: ['Tipper', 'Flatbed', '6-Wheeler'],
      baseRatePerKm: 58.00,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.transporterProfiles.set(transp1.id, transp1);
    this.transporterProfiles.set(transp2.id, transp2);

    // 2. Pricing Rules
    const prRule1: MarketplacePricingRule = {
      id: 'pr-rule-001',
      tenantId,
      materialId: 'mat-m-sand-01',
      materialName: 'M-Sand (Manufactured Sand)',
      vehicleType: 'Tipper',
      baseFare: 600.00,
      ratePerKm: 55.00,
      ratePerTon: 110.00,
      minCharge: 1800.00,
      surgeMultiplier: 1.0,
      createdAt: now,
      updatedAt: now
    };
    const prRule2: MarketplacePricingRule = {
      id: 'pr-rule-002',
      tenantId,
      materialId: 'mat-aggregate-20mm',
      materialName: '20mm Aggregate Stone',
      vehicleType: 'Tipper',
      baseFare: 550.00,
      ratePerKm: 50.00,
      ratePerTon: 100.00,
      minCharge: 1500.00,
      surgeMultiplier: 1.0,
      createdAt: now,
      updatedAt: now
    };
    this.marketplacePricingRules.set(prRule1.id, prRule1);
    this.marketplacePricingRules.set(prRule2.id, prRule2);

    // 3. Load Request
    const load1: LoadRequest = {
      id: 'load-req-001',
      tenantId,
      requestNumber: 'LR-2026-00101',
      customerId: 'cust-infra-corp-1',
      customerName: 'Soma Infrastructure Ltd',
      businessId: 'biz-soma-infra',
      materialId: 'mat-m-sand-01',
      materialName: 'M-Sand (Manufactured Sand)',
      source: 'Quarry Site Alpha, Rock Ridge',
      destination: 'Smart City Highway Expansion Site, Gate 3, Surathkal',
      requiredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      requiredTime: '07:30 AM',
      quantity: 35.0,
      unit: 'TONS',
      vehicleType: 'Tipper',
      vehicleCapacity: 35.0,
      budget: 18500.0,
      specialRequirements: 'Automatic tarpaulin cover required to prevent spillage during highway transit',
      status: 'OPEN',
      isPublic: true,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const load2: LoadRequest = {
      id: 'load-req-002',
      tenantId,
      requestNumber: 'LR-2026-00102',
      customerId: 'cust-harbor-dev',
      customerName: 'Harbor Developers & Builders',
      materialId: 'mat-aggregate-20mm',
      materialName: '20mm Aggregate Stone',
      source: 'Crusher Unit Beta, Industrial Hub',
      destination: 'Port Commercial Complex, Panambur',
      requiredDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      requiredTime: '09:00 AM',
      quantity: 28.0,
      unit: 'TONS',
      vehicleType: 'Tipper',
      vehicleCapacity: 28.0,
      budget: 14200.0,
      specialRequirements: 'Weighbridge slip copy mandatory upon arrival',
      status: 'MATCHED',
      isPublic: true,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.loadRequests.set(load1.id, load1);
    this.loadRequests.set(load2.id, load2);

    // 4. Load Matches for Load 2
    const match1: LoadMatch = {
      id: 'lm-match-001',
      tenantId,
      loadId: load2.id,
      vehicleId: 'veh-ka19-4491',
      driverId: 'drv-suresh-001',
      transporterId: transp1.id,
      distance: 24.5,
      estimatedTime: '45 mins',
      estimatedCost: 12850.00,
      offeredPrice: 13500.00,
      matchScore: 94,
      availability: 'AVAILABLE',
      reasonCodes: ['HIGH_CAPACITY_MATCH', 'NEAR_SOURCE', 'AVAILABLE_NOW', 'GOOD_COMPLETION_HISTORY'],
      createdAt: now
    };
    this.loadMatches.set(match1.id, match1);

    // 5. Load Offer for Load 2
    const offer1: LoadOffer = {
      id: 'offer-001',
      tenantId,
      offerNumber: 'LO-2026-00081',
      loadId: load2.id,
      transporterId: transp1.id,
      vehicleId: 'veh-ka19-4491',
      driverId: 'drv-suresh-001',
      quotedPrice: 13500.00,
      estimatedPickup: new Date(Date.now() + 172800000).toISOString(),
      estimatedDelivery: new Date(Date.now() + 172800000 + 7200000).toISOString(),
      remarks: 'Heavy duty 10-wheeler BharatBenz ready for immediate dispatch',
      status: 'SUBMITTED',
      createdAt: now,
      updatedAt: now
    };
    this.loadOffers.set(offer1.id, offer1);

    this.seedCrmDataOnly();
    this.seedFinanceDataOnly();
    this.seedHrDataOnly();
  }

  public seedCrmDataOnly() {
    const now = new Date().toISOString();
    const tenantId = 'tenant-rz-global-001';

    // 1. Customers Master
    const cust1: CrmCustomer = {
      id: 'cust-harbor-dev',
      tenantId,
      customerType: 'BUSINESS',
      businessId: 'biz-harbor-001',
      displayName: 'Harbor Developers & Builders Ltd',
      legalName: 'Harbor Developers Private Limited',
      customerCode: 'CUST-2026-001',
      phone: '+91-98801-11223',
      email: 'procurement@harborbuilders.com',
      address: 'Plot 42, Marine View Towers, Bunder',
      city: 'Mangalore',
      district: 'Dakshina Kannada',
      state: 'Karnataka',
      country: 'India',
      taxIdentifier: '29AAACH1234F1Z8',
      creditLimit: 2500000.00,
      creditDays: 45,
      status: 'ACTIVE',
      source: 'Direct Corporate Outreach',
      assignedSalesUser: 'usr-admin-001',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    const cust2: CrmCustomer = {
      id: 'cust-apex-infra',
      tenantId,
      customerType: 'CONTRACTOR',
      businessId: 'biz-apex-002',
      displayName: 'Apex Infrastructure & Highway Corp',
      legalName: 'Apex Infrastructure Private Limited',
      customerCode: 'CUST-2026-002',
      phone: '+91-98450-99887',
      email: 'projects@apexinfra.in',
      address: 'NH-66 Bypass Road, Surathkal',
      city: 'Mangalore',
      district: 'Dakshina Kannada',
      state: 'Karnataka',
      country: 'India',
      taxIdentifier: '29AABCA9876E1Z2',
      creditLimit: 5000000.00,
      creditDays: 60,
      status: 'ACTIVE',
      source: 'Government Tender',
      assignedSalesUser: 'usr-admin-001',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    const cust3: CrmCustomer = {
      id: 'cust-karnataka-readymix',
      tenantId,
      customerType: 'DEALER',
      businessId: 'biz-rmc-003',
      displayName: 'Karnataka Concrete & ReadyMix Co',
      legalName: 'Karnataka Concrete Pvt Ltd',
      customerCode: 'CUST-2026-003',
      phone: '+91-97411-22334',
      email: 'supply@karnatakarmc.com',
      address: 'Baikampady Industrial Estate, Stage II',
      city: 'Mangalore',
      district: 'Dakshina Kannada',
      state: 'Karnataka',
      country: 'India',
      taxIdentifier: '29AABCK5432D1Z4',
      creditLimit: 1500000.00,
      creditDays: 30,
      status: 'ACTIVE',
      source: 'Referral',
      assignedSalesUser: 'usr-admin-001',
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    this.crmCustomers.set(cust1.id, cust1);
    this.crmCustomers.set(cust2.id, cust2);
    this.crmCustomers.set(cust3.id, cust3);

    // 2. Contacts
    const contact1: CrmContact = {
      id: 'cnt-001',
      tenantId,
      customerId: cust1.id,
      name: 'Rajesh Hegde',
      designation: 'VP Procurement & Materials',
      phone: '+91-98801-11223',
      email: 'r.hegde@harborbuilders.com',
      whatsapp: '+91-98801-11223',
      isPrimary: true,
      preferredLanguage: 'English / Kannada',
      notes: 'Key decision maker for quarry aggregate orders above 500 tons',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    const contact2: CrmContact = {
      id: 'cnt-002',
      tenantId,
      customerId: cust2.id,
      name: 'Anand Kumar',
      designation: 'Project Director - Highway Package 3',
      phone: '+91-98450-99887',
      email: 'a.kumar@apexinfra.in',
      whatsapp: '+91-98450-99887',
      isPrimary: true,
      preferredLanguage: 'English',
      notes: 'Requires daily delivery schedules and weighbridge slips',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    this.crmContacts.set(contact1.id, contact1);
    this.crmContacts.set(contact2.id, contact2);

    // 3. Leads
    const lead1: CrmLead = {
      id: 'lead-2026-001',
      tenantId,
      customerId: cust1.id,
      customerName: 'Harbor Developers & Builders Ltd',
      phone: '+91-98801-11223',
      email: 'procurement@harborbuilders.com',
      source: 'Marketplace',
      campaign: 'Q3 Construction Material Drive',
      productService: '20mm Aggregate Stone & M-Sand Supply',
      estimatedValue: 1250000.00,
      probability: 80,
      expectedCloseDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
      assignedUser: 'usr-admin-001',
      notes: 'High volume requirement for ongoing port complex commercial tower foundation',
      status: 'PROPOSAL',
      leadScore: 88,
      priority: 'HOT',
      reasonCodes: ['HIGH_ESTIMATED_VALUE', 'EXISTING_CUSTOMER_LINK', 'PROPOSAL_SUBMITTED'],
      createdAt: now,
      updatedAt: now
    };

    const lead2: CrmLead = {
      id: 'lead-2026-002',
      tenantId,
      customerName: 'Coastal Housing Society Phase 4',
      phone: '+91-99001-88221',
      email: 'admin@coastalhousing.org',
      source: 'Website',
      campaign: 'Direct Inbound Form',
      productService: 'GSB (Granular Sub-Base) & Crusher Dust',
      estimatedValue: 450000.00,
      probability: 50,
      expectedCloseDate: new Date(Date.now() + 1209600000).toISOString().split('T')[0],
      assignedUser: 'usr-admin-001',
      notes: 'Road base construction requirement for housing layout streets',
      status: 'QUALIFIED',
      leadScore: 65,
      priority: 'MEDIUM',
      reasonCodes: ['INBOUND_WEBSITE_LEAD', 'VALID_PHONE_AND_EMAIL'],
      createdAt: now,
      updatedAt: now
    };

    this.crmLeads.set(lead1.id, lead1);
    this.crmLeads.set(lead2.id, lead2);

    // 4. Opportunities
    const opp1: CrmOpportunity = {
      id: 'opp-2026-001',
      tenantId,
      customerId: cust1.id,
      leadId: lead1.id,
      title: 'Port Complex Aggregate & Sand Annual Supply Agreement',
      value: 1250000.00,
      probability: 80,
      stage: 'PROPOSAL',
      expectedCloseDate: new Date(Date.now() + 604800000).toISOString().split('T')[0],
      salesOwner: 'usr-admin-001',
      productsServices: ['20mm Aggregate Stone', 'M-Sand (Manufactured Sand)', 'GSB'],
      competitors: 'Deccan Crushing Ltd',
      nextAction: 'Finalize payment terms and sign contract agreement',
      notes: 'Quotation sent. Customer requested 45-day credit terms.',
      status: 'OPEN',
      createdAt: now,
      updatedAt: now
    };

    this.crmOpportunities.set(opp1.id, opp1);

    // 5. Sales Activities
    const act1: CrmSalesActivity = {
      id: 'act-2026-001',
      tenantId,
      activityType: 'Meeting',
      subject: 'Contract Terms Review with VP Rajesh Hegde',
      customerId: cust1.id,
      leadId: lead1.id,
      opportunityId: opp1.id,
      assignedUser: 'usr-admin-001',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'PENDING',
      priority: 'HIGH',
      notes: 'Discuss delivery schedule guarantees and price escalations',
      createdAt: now,
      updatedAt: now
    };

    this.crmSalesActivities.set(act1.id, act1);

    // 6. Quotations
    const q1: CrmQuotation = {
      id: 'quote-2026-001',
      tenantId,
      quoteNumber: 'QT-2026-0001',
      customerId: cust1.id,
      opportunityId: opp1.id,
      subtotal: 1050000.00,
      discountAmount: 25000.00,
      taxAmount: 184500.00,
      totalAmount: 1209500.00,
      validityDate: new Date(Date.now() + 2592000000).toISOString().split('T')[0],
      termsAndConditions: 'Standard RZ® Quarry Supply terms. Payment due in 45 days.',
      notes: 'Custom rate applied for bulk order exceeding 1,000 tons.',
      status: 'SENT',
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    const qItem1: CrmQuotationItem = {
      id: 'qi-001',
      tenantId,
      quotationId: q1.id,
      itemDescription: '20mm Blue Granite Aggregate Stone',
      materialId: 'mat-aggregate-20mm',
      quantity: 800,
      unitPrice: 750.00,
      taxPercent: 18.00,
      totalPrice: 600000.00,
      createdAt: now
    };

    const qItem2: CrmQuotationItem = {
      id: 'qi-002',
      tenantId,
      quotationId: q1.id,
      itemDescription: 'Manufactured Concrete Sand (M-Sand)',
      materialId: 'mat-msand-001',
      quantity: 500,
      unitPrice: 850.00,
      taxPercent: 18.00,
      totalPrice: 425000.00,
      createdAt: now
    };

    q1.items = [qItem1, qItem2];
    this.crmQuotations.set(q1.id, q1);
    this.crmQuotationItems.set(qItem1.id, qItem1);
    this.crmQuotationItems.set(qItem2.id, qItem2);

    // 7. Customer Credit
    const credit1: CrmCustomerCredit = {
      id: 'cred-001',
      tenantId,
      customerId: cust1.id,
      creditLimit: 2500000.00,
      creditDays: 45,
      outstandingBalance: 650000.00,
      availableCredit: 1850000.00,
      overdueAmount: 0.00,
      creditStatus: 'GOOD',
      lastReviewedAt: now,
      createdAt: now,
      updatedAt: now
    };

    const credit2: CrmCustomerCredit = {
      id: 'cred-002',
      tenantId,
      customerId: cust2.id,
      creditLimit: 5000000.00,
      creditDays: 60,
      outstandingBalance: 1200000.00,
      availableCredit: 3800000.00,
      overdueAmount: 0.00,
      creditStatus: 'GOOD',
      lastReviewedAt: now,
      createdAt: now,
      updatedAt: now
    };

    this.crmCustomerCredit.set(credit1.id, credit1);
    this.crmCustomerCredit.set(credit2.id, credit2);

    // 8. Documents
    const doc1: CrmCustomerDocument = {
      id: 'doc-001',
      tenantId,
      customerId: cust1.id,
      documentType: 'GST_TAX',
      title: 'GST Registration Certificate - Harbor Builders',
      storageRef: '/documents/tenant-rz-global-001/cust-harbor-dev/gst_certificate.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 1048576,
      uploadedBy: 'usr-admin-001',
      createdAt: now
    };

    this.crmCustomerDocuments.set(doc1.id, doc1);

    // 9. Support Tickets
    const ticket1: CrmSupportTicket = {
      id: 'ticket-2026-001',
      tenantId,
      ticketNumber: 'TKT-2026-0001',
      customerId: cust1.id,
      subject: 'Inquiry on Weighbridge slip digital copy verification',
      description: 'Customer requested automated SMS delivery of weighbridge receipt upon truck dispatch',
      priority: 'MEDIUM',
      category: 'SERVICE',
      assignedUser: 'usr-admin-001',
      status: 'RESOLVED',
      resolvedAt: now,
      createdAt: now,
      updatedAt: now
    };

    this.crmSupportTickets.set(ticket1.id, ticket1);

    // 10. Customer Segments
    const seg1: CrmCustomerSegment = {
      id: 'seg-001',
      tenantId,
      code: 'HIGH_VALUE_KEY_ACCOUNTS',
      name: 'High Value Key Accounts (> ₹25L Credit)',
      description: 'Enterprise corporate buyers with high order volume and long credit terms',
      criteriaJson: JSON.stringify({ minCreditLimit: 2500000, status: 'ACTIVE' }),
      createdAt: now,
      updatedAt: now
    };

    this.crmCustomerSegments.set(seg1.id, seg1);

    // 11. Customer Health
    const health1: CrmCustomerHealth = {
      id: 'health-001',
      tenantId,
      customerId: cust1.id,
      healthScore: 92,
      healthStatus: 'EXCELLENT',
      riskFlags: [],
      factorsJson: JSON.stringify({ purchaseFrequency: 'HIGH', paymentPunctuality: 'ON_TIME', disputeCount: 0 }),
      calculatedAt: now
    };

    this.crmCustomerHealth.set(health1.id, health1);

    // 12. Customer Notes
    const note1: CrmCustomerNote = {
      id: 'note-001',
      tenantId,
      customerId: cust1.id,
      authorUserId: 'usr-admin-001',
      noteText: 'Customer requested priority dispatch during monsoon season for port construction site.',
      isPrivate: false,
      createdAt: now
    };

    this.crmCustomerNotes.set(note1.id, note1);
  }

  public seedFinanceDataOnly() {
    const now = new Date().toISOString();
    const tenantId = 'tenant-rz-global-001';

    // 1. Chart of Accounts
    const coaList: ChartOfAccount[] = [
      { id: 'acc-1000', tenantId, accountCode: '1000', accountName: 'Assets Control', accountType: 'ASSET', currency: 'INR', isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-1010', tenantId, accountCode: '1010', accountName: 'HDFC Enterprise Current Account', accountType: 'ASSET', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-1020', tenantId, accountCode: '1020', accountName: 'Petty Cash Account', accountType: 'ASSET', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-1100', tenantId, accountCode: '1100', accountName: 'Accounts Receivable (AR)', accountType: 'ASSET', currency: 'INR', isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-1200', tenantId, accountCode: '1200', accountName: 'Quarry Material Inventory', accountType: 'ASSET', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-1300', tenantId, accountCode: '1300', accountName: 'GST Input Tax Credit', accountType: 'ASSET', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-2000', tenantId, accountCode: '2000', accountName: 'Liabilities Control', accountType: 'LIABILITY', currency: 'INR', isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-2100', tenantId, accountCode: '2100', accountName: 'Accounts Payable (AP)', accountType: 'LIABILITY', currency: 'INR', isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-2200', tenantId, accountCode: '2200', accountName: 'GST Output Tax Payable', accountType: 'LIABILITY', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-3000', tenantId, accountCode: '3000', accountName: 'Shareholders Equity', accountType: 'EQUITY', currency: 'INR', isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-3100', tenantId, accountCode: '3100', accountName: 'Retained Earnings', accountType: 'EQUITY', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-4000', tenantId, accountCode: '4000', accountName: 'Quarry Aggregate Sales Revenue', accountType: 'REVENUE', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-4100', tenantId, accountCode: '4100', accountName: 'Fleet Transport Freight Revenue', accountType: 'REVENUE', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-4200', tenantId, accountCode: '4200', accountName: 'Marketplace Commission Revenue', accountType: 'REVENUE', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-5000', tenantId, accountCode: '5000', accountName: 'Direct Cost of Sales - Quarrying', accountType: 'EXPENSE', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-5100', tenantId, accountCode: '5100', accountName: 'Fleet Fuel & Diesel Expenses', accountType: 'EXPENSE', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-5200', tenantId, accountCode: '5200', accountName: 'Fleet Maintenance & Repairs', accountType: 'EXPENSE', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-5300', tenantId, accountCode: '5300', accountName: 'Mining Equipment Operating Expenses', accountType: 'EXPENSE', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: 'acc-5400', tenantId, accountCode: '5400', accountName: 'Administrative & General Expenses', accountType: 'EXPENSE', currency: 'INR', isControlAccount: false, isActive: true, createdAt: now, updatedAt: now }
    ];
    coaList.forEach(c => this.chartOfAccounts.set(c.id, c));

    // 2. Fiscal Year & Periods
    const fy2026: FiscalYear = {
      id: 'fy-2026-2027',
      tenantId,
      yearCode: 'FY2026-27',
      yearName: 'Financial Year 2026 - 2027',
      startDate: '2026-04-01',
      endDate: '2027-03-31',
      status: 'OPEN',
      createdAt: now,
      updatedAt: now
    };
    this.fiscalYears.set(fy2026.id, fy2026);

    for (let month = 1; month <= 12; month++) {
      const pNum = month;
      const periodId = `fp-2026-${pNum.toString().padStart(2, '0')}`;
      const mDate = new Date(2026, month - 1, 1);
      const startStr = mDate.toISOString().split('T')[0];
      const endM = new Date(2026, month, 0);
      const endStr = endM.toISOString().split('T')[0];
      const fp: FiscalPeriod = {
        id: periodId,
        tenantId,
        fiscalYearId: fy2026.id,
        periodNumber: pNum,
        periodName: `Period ${pNum} (${mDate.toLocaleString('default', { month: 'short' })} 2026)`,
        startDate: startStr,
        endDate: endStr,
        status: pNum <= 5 ? 'LOCKED' : 'OPEN',
        createdAt: now,
        updatedAt: now
      };
      this.fiscalPeriods.set(fp.id, fp);
    }

    // 3. Cost Centers
    const costCenters: CostCenter[] = [
      { id: 'cc-mining', tenantId, code: 'CC-MINING', name: 'Quarrying & Mining Ops', category: 'OPERATIONS', status: 'ACTIVE', createdAt: now },
      { id: 'cc-fleet', tenantId, code: 'CC-FLEET', name: 'Fleet & Logistics Division', category: 'LOGISTICS', status: 'ACTIVE', createdAt: now },
      { id: 'cc-mkt', tenantId, code: 'CC-MKT', name: 'Load Exchange Marketplace', category: 'DIGITAL', status: 'ACTIVE', createdAt: now },
      { id: 'cc-admin', tenantId, code: 'CC-ADMIN', name: 'Corporate Administration', category: 'OVERHEAD', status: 'ACTIVE', createdAt: now },
      { id: 'cc-crm', tenantId, code: 'CC-CRM', name: 'Sales & Customer Management', category: 'COMMERCIAL', status: 'ACTIVE', createdAt: now }
    ];
    costCenters.forEach(cc => this.costCenters.set(cc.id, cc));

    // 4. Projects
    const prj1: FinanceProject = {
      id: 'prj-harbor-01',
      tenantId,
      projectCode: 'PRJ-HARBOR-01',
      projectName: 'Harbor Infra Quarry Aggregate Supply Project',
      budget: 15000000.00,
      actualCost: 6500000.00,
      actualRevenue: 9800000.00,
      status: 'IN_PROGRESS',
      createdAt: now,
      updatedAt: now
    };
    this.financeProjects.set(prj1.id, prj1);

    // 5. Tax Codes
    const taxCodes: TaxCode[] = [
      { id: 'tax-gst-18', tenantId, taxCode: 'GST18', taxName: 'GST 18% Standard', rate: 18.0, taxType: 'GST', effectiveDate: '2026-04-01', status: 'ACTIVE', createdAt: now },
      { id: 'tax-gst-12', tenantId, taxCode: 'GST12', taxName: 'GST 12% Reduced', rate: 12.0, taxType: 'GST', effectiveDate: '2026-04-01', status: 'ACTIVE', createdAt: now },
      { id: 'tax-gst-5', tenantId, taxCode: 'GST5', taxName: 'GST 5% Lower Rate', rate: 5.0, taxType: 'GST', effectiveDate: '2026-04-01', status: 'ACTIVE', createdAt: now },
      { id: 'tax-gst-0', tenantId, taxCode: 'GST0', taxName: 'Exempt / Zero Rated', rate: 0.0, taxType: 'GST', effectiveDate: '2026-04-01', status: 'ACTIVE', createdAt: now }
    ];
    taxCodes.forEach(tc => this.taxCodes.set(tc.id, tc));

    // 6. Bank Accounts
    const bank1: BankAccount = {
      id: 'bank-hdfc-001',
      tenantId,
      accountName: 'HDFC Bank - Main Operating Current Account',
      accountNumberMasked: 'XXXX-XXXX-9821',
      bankName: 'HDFC Bank Ltd',
      ifscCode: 'HDFC0000123',
      openingBalance: 5000000.00,
      currentBalance: 4500000.00,
      currency: 'INR',
      accountType: 'CURRENT',
      status: 'ACTIVE',
      glAccountId: 'acc-1010',
      createdAt: now,
      updatedAt: now
    };
    this.bankAccounts.set(bank1.id, bank1);

    // 7. Customer Invoice & Items
    const inv1: CustomerInvoice = {
      id: 'inv-2026-0001',
      tenantId,
      invoiceNumber: 'INV-2026-0001',
      customerId: 'cust-harbor-dev',
      invoiceDate: '2026-08-01',
      dueDate: '2026-08-31',
      creditTermsDays: 30,
      subtotal: 100000.00,
      taxAmount: 18000.00,
      discountAmount: 0.00,
      totalAmount: 118000.00,
      outstandingAmount: 0.00,
      status: 'PAID',
      notes: 'Supply of 40mm Granite Aggregates for Harbor Site',
      createdAt: now,
      updatedAt: now
    };
    const invItem1: InvoiceItem = {
      id: 'inv-item-001',
      tenantId,
      invoiceId: inv1.id,
      itemDescription: '40mm Granite Aggregate (High Density)',
      quantity: 100,
      unitPrice: 1000.00,
      taxCodeId: 'tax-gst-18',
      taxRate: 18.0,
      taxAmount: 18000.00,
      totalPrice: 118000.00
    };
    inv1.items = [invItem1];
    this.customerInvoices.set(inv1.id, inv1);
    this.invoiceItems.set(invItem1.id, invItem1);

    // 8. Customer Payment & Allocation
    const pay1: CustomerPayment = {
      id: 'pay-2026-0001',
      tenantId,
      paymentNumber: 'PAY-2026-0001',
      customerId: 'cust-harbor-dev',
      paymentDate: '2026-08-05',
      amount: 118000.00,
      currency: 'INR',
      paymentMethod: 'TRANSFER',
      bankAccountId: bank1.id,
      referenceNumber: 'NEFT-HDFC-9928101',
      unallocatedAmount: 0.00,
      status: 'POSTED',
      createdAt: now,
      updatedAt: now
    };
    const alloc1: PaymentAllocation = {
      id: 'alloc-001',
      tenantId,
      paymentId: pay1.id,
      invoiceId: inv1.id,
      allocatedAmount: 118000.00,
      allocatedAt: now
    };
    this.customerPayments.set(pay1.id, pay1);
    this.paymentAllocations.set(alloc1.id, alloc1);

    // 9. Supplier Bill & Item
    const bill1: SupplierBill = {
      id: 'bill-2026-0001',
      tenantId,
      billNumber: 'BILL-2026-0001',
      supplierName: 'Indian Oil Corporation Ltd (Fuel Logistics)',
      billDate: '2026-08-02',
      dueDate: '2026-08-17',
      subtotal: 50000.00,
      taxAmount: 9000.00,
      discountAmount: 0.00,
      totalAmount: 59000.00,
      outstandingAmount: 59000.00,
      status: 'APPROVED',
      createdAt: now,
      updatedAt: now
    };
    const billItem1: SupplierBillItem = {
      id: 'bill-item-001',
      tenantId,
      billId: bill1.id,
      itemDescription: 'High Speed Diesel (HSD) for Fleet Operations',
      quantity: 500,
      unitPrice: 100.00,
      taxAmount: 9000.00,
      totalPrice: 59000.00,
      costCenterId: 'cc-fleet'
    };
    bill1.items = [billItem1];
    this.supplierBills.set(bill1.id, bill1);
    this.supplierBillItems.set(billItem1.id, billItem1);

    // 10. Finance Expense
    const exp1: FinanceExpense = {
      id: 'exp-2026-0001',
      tenantId,
      expenseNumber: 'EXP-2026-0001',
      category: 'Fuel',
      amount: 15000.00,
      expenseDate: '2026-08-03',
      paymentMethod: 'CARD',
      costCenterId: 'cc-fleet',
      vehicleId: 'veh-ka19-4491',
      description: 'Emergency diesel refill during inter-city transport',
      status: 'APPROVED',
      createdAt: now,
      updatedAt: now
    };
    this.financeExpenses.set(exp1.id, exp1);

    // 11. Journal & Balanced Lines
    const jnl1: Journal = {
      id: 'jnl-2026-0001',
      tenantId,
      journalNumber: 'JNL-2026-0001',
      journalDate: '2026-08-01',
      referenceType: 'INVOICE',
      referenceId: inv1.id,
      description: 'Posting for Customer Invoice INV-2026-0001',
      status: 'POSTED',
      createdBy: 'usr-admin-001',
      postedBy: 'usr-admin-001',
      totalDebit: 118000.00,
      totalCredit: 118000.00,
      createdAt: now,
      postedAt: now,
      updatedAt: now
    };
    const jl1: JournalLine = {
      id: 'jl-001',
      tenantId,
      journalId: jnl1.id,
      accountId: 'acc-1100', // Accounts Receivable
      debit: 118000.00,
      credit: 0.00,
      customerId: 'cust-harbor-dev',
      description: 'Debit AR for Customer Invoice INV-2026-0001'
    };
    const jl2: JournalLine = {
      id: 'jl-002',
      tenantId,
      journalId: jnl1.id,
      accountId: 'acc-4000', // Quarry Sales Revenue
      debit: 0.00,
      credit: 100000.00,
      costCenterId: 'cc-mining',
      description: 'Credit Quarry Aggregate Revenue'
    };
    const jl3: JournalLine = {
      id: 'jl-003',
      tenantId,
      journalId: jnl1.id,
      accountId: 'acc-2200', // GST Payable
      debit: 0.00,
      credit: 18000.00,
      description: 'Credit GST Payable 18%'
    };
    this.journals.set(jnl1.id, jnl1);
    this.journalLines.set(jl1.id, jl1);
    this.journalLines.set(jl2.id, jl2);
    this.journalLines.set(jl3.id, jl3);

    // 12. Bank Transaction
    const btx1: BankTransaction = {
      id: 'btx-2026-0001',
      tenantId,
      bankAccountId: bank1.id,
      transactionDate: '2026-08-05',
      valueDate: '2026-08-05',
      description: 'NEFT Inward - Harbor Infrastructure Dev',
      reference: 'NEFT-HDFC-9928101',
      amount: 118000.00,
      transactionType: 'CREDIT',
      reconciliationStatus: 'MATCHED',
      matchedReferenceId: pay1.id,
      createdAt: now
    };
    this.bankTransactions.set(btx1.id, btx1);
  }

  public seedHrDataOnly() {
    const now = new Date().toISOString();
    const tenantId = 'tenant-rz-global-001';

    // 1. Departments
    const dept1: HrDepartment = {
      id: 'hr-dept-executive',
      tenantId,
      code: 'EXEC',
      name: 'Executive & Management',
      description: 'Executive Leadership & Governance',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    const dept2: HrDepartment = {
      id: 'hr-dept-mining',
      tenantId,
      code: 'MINING',
      name: 'Mining & Quarry Operations',
      description: 'Site operations, heavy equipment, quarrying',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    const dept3: HrDepartment = {
      id: 'hr-dept-hr',
      tenantId,
      code: 'HR',
      name: 'Human Resources & Talent',
      description: 'HR Management, Workforce, Payroll, Recruitment',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    const dept4: HrDepartment = {
      id: 'hr-dept-finance',
      tenantId,
      code: 'FINANCE',
      name: 'Finance & Accounting',
      description: 'Financial management and accounting',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    this.hrDepartments.set(dept1.id, dept1);
    this.hrDepartments.set(dept2.id, dept2);
    this.hrDepartments.set(dept3.id, dept3);
    this.hrDepartments.set(dept4.id, dept4);

    // 2. Designations
    const desig1: HrDesignation = {
      id: 'hr-desig-hr-director',
      tenantId,
      code: 'HR-DIR',
      title: 'Human Resources Director',
      departmentId: dept3.id,
      gradeLevel: 'E1',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    const desig2: HrDesignation = {
      id: 'hr-desig-ops-mgr',
      tenantId,
      code: 'OPS-MGR',
      title: 'Mining Operations Manager',
      departmentId: dept2.id,
      gradeLevel: 'M2',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    const desig3: HrDesignation = {
      id: 'hr-desig-operator',
      tenantId,
      code: 'EQUIP-OP',
      title: 'Heavy Equipment Specialist',
      departmentId: dept2.id,
      gradeLevel: 'O1',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    this.hrDesignations.set(desig1.id, desig1);
    this.hrDesignations.set(desig2.id, desig2);
    this.hrDesignations.set(desig3.id, desig3);

    // 3. Employees
    const emp1: HrEmployee = {
      id: 'hr-emp-001',
      tenantId,
      employeeCode: 'EMP-001',
      firstName: 'Sarah',
      middleName: 'M.',
      lastName: 'Jenkins',
      displayName: 'Sarah Jenkins',
      gender: 'FEMALE',
      dateOfBirth: '1988-04-12',
      phone: '+1 (555) 234-5678',
      email: 's.jenkins@racezoneventures.com',
      address: '450 Enterprise Ave, Suite 300, Houston TX',
      joiningDate: '2022-01-15',
      employmentType: 'FULL_TIME',
      employmentStatus: 'ACTIVE',
      departmentId: dept3.id,
      designationId: desig1.id,
      workLocation: 'Corporate HQ',
      bankAccountMasked: '****8812',
      emergencyContact: 'John Jenkins (+1 555-998-1122)',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    const emp2: HrEmployee = {
      id: 'hr-emp-002',
      tenantId,
      employeeCode: 'EMP-002',
      firstName: 'Marcus',
      middleName: 'R.',
      lastName: 'Vance',
      displayName: 'Marcus Vance',
      gender: 'MALE',
      dateOfBirth: '1985-09-24',
      phone: '+1 (555) 345-6789',
      email: 'm.vance@racezoneventures.com',
      address: '12 Quarry View Rd, Mine Site Alpha TX',
      joiningDate: '2021-06-01',
      employmentType: 'FULL_TIME',
      employmentStatus: 'ACTIVE',
      departmentId: dept2.id,
      designationId: desig2.id,
      workLocation: 'Quarry Site Alpha',
      bankAccountMasked: '****4419',
      emergencyContact: 'Laura Vance (+1 555-882-3344)',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    const emp3: HrEmployee = {
      id: 'hr-emp-003',
      tenantId,
      employeeCode: 'EMP-003',
      firstName: 'David',
      middleName: 'A.',
      lastName: 'Rodriguez',
      displayName: 'David Rodriguez',
      gender: 'MALE',
      dateOfBirth: '1992-11-05',
      phone: '+1 (555) 456-7890',
      email: 'd.rodriguez@racezoneventures.com',
      address: '88 Haulage Loop, Mine Site Alpha TX',
      joiningDate: '2023-03-10',
      employmentType: 'FULL_TIME',
      employmentStatus: 'ACTIVE',
      departmentId: dept2.id,
      designationId: desig3.id,
      managerId: emp2.id,
      workLocation: 'Quarry Site Alpha',
      bankAccountMasked: '****9931',
      emergencyContact: 'Carlos Rodriguez (+1 555-771-4455)',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };

    this.hrEmployees.set(emp1.id, emp1);
    this.hrEmployees.set(emp2.id, emp2);
    this.hrEmployees.set(emp3.id, emp3);

    // 4. Employee User Link
    const eu1: HrEmployeeUser = {
      id: 'hr-eu-001',
      tenantId,
      employeeId: emp1.id,
      userId: 'usr-admin-001',
      createdAt: now,
      updatedAt: now
    };
    this.hrEmployeeUsers.set(eu1.id, eu1);

    // 5. Shifts
    const shift1: HrShift = {
      id: 'hr-shift-gen',
      tenantId,
      shiftCode: 'SHIFT-GEN',
      shiftName: 'Corporate General Shift',
      startTime: '09:00',
      endTime: '17:00',
      graceMinutes: 15,
      breakMinutes: 60,
      overtimeAfterMinutes: 480,
      shiftType: 'DAY',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    const shift2: HrShift = {
      id: 'hr-shift-mine',
      tenantId,
      shiftCode: 'SHIFT-MINE',
      shiftName: 'Quarry Operations Day Shift',
      startTime: '07:00',
      endTime: '16:00',
      graceMinutes: 10,
      breakMinutes: 60,
      overtimeAfterMinutes: 480,
      shiftType: 'DAY',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    this.hrShifts.set(shift1.id, shift1);
    this.hrShifts.set(shift2.id, shift2);

    // 6. Leave Types
    const lt1: HrLeaveType = {
      id: 'hr-lt-annual',
      tenantId,
      code: 'ANNUAL',
      name: 'Paid Annual Leave',
      daysAllowed: 18,
      isPaid: true,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    const lt2: HrLeaveType = {
      id: 'hr-lt-sick',
      tenantId,
      code: 'SICK',
      name: 'Sick & Medical Leave',
      daysAllowed: 12,
      isPaid: true,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    this.hrLeaveTypes.set(lt1.id, lt1);
    this.hrLeaveTypes.set(lt2.id, lt2);

    // Leave Balances for 2026
    const lb1: HrLeaveBalance = {
      id: 'hr-lb-emp1-ann',
      tenantId,
      employeeId: emp1.id,
      leaveTypeId: lt1.id,
      year: 2026,
      totalAllocated: 18,
      used: 2,
      pending: 0,
      remaining: 16,
      createdAt: now,
      updatedAt: now
    };
    this.hrLeaveBalances.set(lb1.id, lb1);

    // 7. Payroll Years & Periods
    const py2026: HrPayrollYear = {
      id: 'hr-py-2026',
      tenantId,
      yearCode: 'PY-2026',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      status: 'ACTIVE',
      createdAt: now
    };
    this.hrPayrollYears.set(py2026.id, py2026);

    const ppAug: HrPayrollPeriod = {
      id: 'hr-pp-2026-08',
      tenantId,
      yearId: py2026.id,
      periodName: 'August 2026 Payroll Period',
      month: 8,
      year: 2026,
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      status: 'OPEN',
      createdAt: now,
      updatedAt: now
    };
    this.hrPayrollPeriods.set(ppAug.id, ppAug);

    // 8. Salary Structures
    const ss1: HrSalaryStructure = {
      id: 'hr-ss-emp1',
      tenantId,
      employeeId: emp1.id,
      effectiveDate: '2026-01-01',
      baseSalary: 8500.00,
      payFrequency: 'MONTHLY',
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    this.hrSalaryStructures.set(ss1.id, ss1);

    // 9. Recruitment Job Requisitions
    const jr1: HrJobRequisition = {
      id: 'hr-jr-001',
      tenantId,
      title: 'Heavy Haulage Driver & Equipment Operator',
      departmentId: dept2.id,
      designationId: desig3.id,
      openings: 3,
      status: 'OPEN',
      createdAt: now,
      updatedAt: now
    };
    this.hrJobRequisitions.set(jr1.id, jr1);
  }

  public seedQuarryDataOnly() {
    const now = new Date().toISOString();
    const tenantId = 'tenant-rz-global-001';
    const companyId = 'comp-101';
    const branchId = 'br-quarry-alpha';

    // 1. Quarry Masters (1 Laterite, 1 Hard Rock)
    const qmLaterite: QuarryMaster = {
      id: 'qm-laterite-001',
      tenantId,
      companyId,
      branchId,
      name: 'Bantwal Laterite Quarry Site #1',
      quarryType: 'LATERITE',
      status: 'ACTIVE',
      location: 'Bantwal Mining Zone, Dakshina Kannada',
      address: 'Survey No. 44/2A, Bantwal Taluk',
      ownerId: 'usr-quarry-mgr-002',
      leaseReference: 'LEASE-LAT-2024-08',
      createdAt: now,
      updatedAt: now,
      createdBy: 'usr-admin-001',
      version: 1
    };

    const qmHardRock: QuarryMaster = {
      id: 'qm-hardrock-002',
      tenantId,
      companyId,
      branchId,
      name: 'Rock Ridge Hard Rock Quarry Site #2',
      quarryType: 'HARD_ROCK',
      status: 'ACTIVE',
      location: 'Rock Ridge Mining Corridor, Sector 14',
      address: 'Plot 10B, Industrial Mineral Zone',
      ownerId: 'usr-quarry-mgr-002',
      leaseReference: 'LEASE-HR-2023-01',
      createdAt: now,
      updatedAt: now,
      createdBy: 'usr-admin-001',
      version: 1
    };

    this.quarryMasters.set(qmLaterite.id, qmLaterite);
    this.quarryMasters.set(qmHardRock.id, qmHardRock);

    // 2. Stone Products (1 Laterite, 1 Hard Rock)
    const prodLaterite: StoneProduct = {
      id: 'prod-lat-std-01',
      tenantId,
      quarryId: qmLaterite.id,
      productCode: 'LAT-STD-30-20-15',
      name: 'Standard Laterite Building Stone (30x20x15 cm)',
      mineralType: 'LATERITE',
      dimensions: '30x20x15 cm',
      unit: 'PIECE',
      defaultPrice: 42.00,
      gstRate: 5,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      createdBy: 'usr-quarry-mgr-002'
    };

    const prodHardRock: StoneProduct = {
      id: 'prod-hr-boulder-01',
      tenantId,
      quarryId: qmHardRock.id,
      productCode: 'HR-RAW-BOULDER',
      name: 'Hard Rock Granite Raw Extraction Boulder',
      mineralType: 'HARD_ROCK',
      unit: 'TON',
      defaultPrice: 380.00,
      gstRate: 5,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
      createdBy: 'usr-quarry-mgr-002'
    };

    this.stoneProducts.set(prodLaterite.id, prodLaterite);
    this.stoneProducts.set(prodHardRock.id, prodHardRock);

    // 3. Quarry Land Lease
    const leaseLaterite: QuarryLandLease = {
      id: 'lease-lat-001',
      tenantId,
      quarryId: qmLaterite.id,
      ownerName: 'Ramesh Hegde',
      surveyNumber: '44/2A',
      village: 'Bantwal Rural',
      taluk: 'Bantwal',
      area: 4.5,
      leaseType: 'LEASED',
      royaltyType: 'PER_PIECE',
      royaltyRate: 3.50,
      startDate: '2024-01-01',
      expiryDate: '2029-12-31',
      status: 'ACTIVE',
      documentReference: 'DOC-LEASE-HEGDE-2024',
      createdAt: now,
      updatedAt: now
    };
    this.quarryLandLeases.set(leaseLaterite.id, leaseLaterite);

    // 4. Initial Immutable Stock Ledger Entries
    const stockLateriteOpen: QuarryStock = {
      id: 'stk-lat-open-001',
      tenantId,
      quarryId: qmLaterite.id,
      productId: prodLaterite.id,
      transactionType: 'STOCK_IN',
      referenceType: 'OPENING_BALANCE',
      referenceId: 'INIT-BALANCE-2026',
      quantityIn: 5000,
      quantityOut: 0,
      balanceQuantity: 5000,
      transactionDate: '2026-08-01',
      createdBy: 'usr-quarry-mgr-002',
      createdAt: now
    };

    const stockHardRockOpen: QuarryStock = {
      id: 'stk-hr-open-001',
      tenantId,
      quarryId: qmHardRock.id,
      productId: prodHardRock.id,
      transactionType: 'STOCK_IN',
      referenceType: 'OPENING_BALANCE',
      referenceId: 'INIT-BALANCE-2026',
      quantityIn: 1200,
      quantityOut: 0,
      balanceQuantity: 1200,
      transactionDate: '2026-08-01',
      createdBy: 'usr-quarry-mgr-002',
      createdAt: now
    };

    this.quarryStocks.set(stockLateriteOpen.id, stockLateriteOpen);
    this.quarryStocks.set(stockHardRockOpen.id, stockHardRockOpen);

    // 5. Initial Production Record
    const prodRecord1: QuarryProduction = {
      id: 'prod-rec-001',
      tenantId,
      quarryId: qmLaterite.id,
      productId: prodLaterite.id,
      productionType: 'LATERITE_CUTTING',
      productionDate: '2026-08-15',
      shift: 'DAY',
      quantity: 450,
      unit: 'PIECE',
      operatorId: 'usr-quarry-mgr-002',
      remarks: 'Bench 2 standard cutting execution',
      createdAt: now,
      updatedAt: now,
      createdBy: 'usr-quarry-mgr-002'
    };
    this.quarryProductions.set(prodRecord1.id, prodRecord1);

    // 6. Initial GatePass
    const gp1: GatePass = {
      id: 'gp-001',
      tenantId,
      quarryId: qmLaterite.id,
      passNumber: 'GP-Q1-2026-00001',
      customerId: 'crm-cust-001',
      productId: prodLaterite.id,
      quantity: 300,
      unit: 'PIECE',
      vehicleNo: 'KA-19-ME-4491',
      driverName: 'Manjunath Gowda',
      grossWeight: 4200,
      tareWeight: 1200,
      netWeight: 3000,
      status: 'ISSUED',
      salesReference: 'SO-2026-0881',
      createdBy: 'usr-quarry-mgr-002',
      createdAt: now,
      updatedAt: now
    };
    this.gatePasses.set(gp1.id, gp1);
  }

  public seedQuarryRbacData() {
    const now = new Date().toISOString();
    const tenant1 = this.tenants.get('tenant-rz-global-001') || Array.from(this.tenants.values())[0];
    if (!tenant1) return;
    const company1 = Array.from(this.companies.values()).find(c => c.tenantId === tenant1.id) || Array.from(this.companies.values())[0];
    const branch1 = Array.from(this.branches.values()).find(b => b.tenantId === tenant1.id);

    // 1. Quarry Permissions
    const quarryPerms: Permission[] = [
      { id: 'p101', code: 'QUARRY_VIEW', module: 'Quarry Management', action: 'quarry_view', description: 'View Quarry Master' },
      { id: 'p102', code: 'QUARRY_CREATE', module: 'Quarry Management', action: 'quarry_create', description: 'Create Quarry Master' },
      { id: 'p103', code: 'QUARRY_EDIT', module: 'Quarry Management', action: 'quarry_edit', description: 'Edit Quarry Master' },
      { id: 'p104', code: 'QUARRY_DEACTIVATE', module: 'Quarry Management', action: 'quarry_deactivate', description: 'Deactivate Quarry Master' },

      { id: 'p105', code: 'PRODUCT_VIEW', module: 'Quarry Management', action: 'product_view', description: 'View Stone Products' },
      { id: 'p106', code: 'PRODUCT_CREATE', module: 'Quarry Management', action: 'product_create', description: 'Create Stone Product' },
      { id: 'p107', code: 'PRODUCT_EDIT', module: 'Quarry Management', action: 'product_edit', description: 'Edit Stone Product' },
      { id: 'p108', code: 'PRODUCT_DEACTIVATE', module: 'Quarry Management', action: 'product_deactivate', description: 'Deactivate Stone Product' },

      { id: 'p109', code: 'PRODUCTION_VIEW', module: 'Quarry Management', action: 'production_view', description: 'View Quarry Production' },
      { id: 'p110', code: 'PRODUCTION_CREATE', module: 'Quarry Management', action: 'production_create', description: 'Record Quarry Production' },
      { id: 'p111', code: 'PRODUCTION_EDIT', module: 'Quarry Management', action: 'production_edit', description: 'Edit Quarry Production' },

      { id: 'p112', code: 'STOCK_VIEW', module: 'Quarry Management', action: 'stock_view', description: 'View Quarry Stock Ledger & Balances' },
      { id: 'p113', code: 'STOCK_ADJUST', module: 'Quarry Management', action: 'stock_adjust', description: 'Perform Quarry Stock Adjustments' },

      { id: 'p114', code: 'GATE_PASS_VIEW', module: 'Quarry Management', action: 'gate_pass_view', description: 'View Gate Passes' },
      { id: 'p115', code: 'GATE_PASS_CREATE', module: 'Quarry Management', action: 'gate_pass_create', description: 'Create Gate Pass' },
      { id: 'p116', code: 'GATE_PASS_VERIFY', module: 'Quarry Management', action: 'gate_pass_verify', description: 'Verify Gate Pass' },
      { id: 'p117', code: 'GATE_PASS_DISPATCH', module: 'Quarry Management', action: 'gate_pass_dispatch', description: 'Dispatch Gate Pass' },
      { id: 'p118', code: 'GATE_PASS_CANCEL', module: 'Quarry Management', action: 'gate_pass_cancel', description: 'Cancel Gate Pass' },

      { id: 'p119', code: 'LAND_VIEW', module: 'Quarry Management', action: 'land_view', description: 'View Land Leases' },
      { id: 'p120', code: 'LAND_CREATE', module: 'Quarry Management', action: 'land_create', description: 'Create Land Lease' },
      { id: 'p121', code: 'LAND_EDIT', module: 'Quarry Management', action: 'land_edit', description: 'Edit Land Lease' },
      { id: 'p122', code: 'LAND_DEACTIVATE', module: 'Quarry Management', action: 'land_deactivate', description: 'Deactivate Land Lease' },

      { id: 'p123', code: 'SETTLEMENT_VIEW', module: 'Quarry Management', action: 'settlement_view', description: 'View Landowner Settlements' },
      { id: 'p124', code: 'SETTLEMENT_CREATE', module: 'Quarry Management', action: 'settlement_create', description: 'Create Landowner Settlement' },
      { id: 'p125', code: 'SETTLEMENT_APPROVE', module: 'Quarry Management', action: 'settlement_approve', description: 'Approve Landowner Settlement' }
    ];

    quarryPerms.forEach(p => this.permissions.set(p.id, p));

    // 2. Roles
    const rolesToAdd: Role[] = [
      {
        id: 'role-developer',
        tenantId: tenant1.id,
        code: 'DEVELOPER',
        name: 'Lead Core Developer',
        description: 'Full developer access to system and all platform features',
        isSystemRole: true,
        createdAt: now,
        updatedAt: now,
        version: 1
      },
      {
        id: 'role-corporate-admin',
        tenantId: tenant1.id,
        code: 'CORPORATE_ADMIN',
        name: 'Corporate Enterprise Admin',
        description: 'Full administrative rights across corporate operations and quarry platform',
        isSystemRole: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      },
      {
        id: 'role-quarry-owner',
        tenantId: tenant1.id,
        code: 'QUARRY_OWNER',
        name: 'Quarry Owner / Executive',
        description: 'Complete operational and financial control over Quarry facilities',
        isSystemRole: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      },
      {
        id: 'role-quarry-mgr',
        tenantId: tenant1.id,
        code: 'QUARRY_MANAGER',
        name: 'Quarry Site Manager',
        description: 'Operational manager with site production, gate pass dispatch and stock control',
        isSystemRole: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      },
      {
        id: 'role-quarry-staff',
        tenantId: tenant1.id,
        code: 'QUARRY_STAFF',
        name: 'Quarry Floor Staff / Scale Operator',
        description: 'Site staff with production logging and initial gate pass generation',
        isSystemRole: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      }
    ];

    rolesToAdd.forEach(r => {
      if (!this.roles.has(r.id)) {
        this.roles.set(r.id, r);
      }
    });

    // 3. Role Permissions mapping
    const managerPermCodes = [
      'QUARRY_VIEW', 'QUARRY_EDIT',
      'PRODUCT_VIEW', 'PRODUCT_CREATE', 'PRODUCT_EDIT',
      'PRODUCTION_VIEW', 'PRODUCTION_CREATE', 'PRODUCTION_EDIT',
      'STOCK_VIEW', 'STOCK_ADJUST',
      'GATE_PASS_VIEW', 'GATE_PASS_CREATE', 'GATE_PASS_VERIFY', 'GATE_PASS_DISPATCH', 'GATE_PASS_CANCEL',
      'LAND_VIEW', 'LAND_CREATE', 'LAND_EDIT',
      'SETTLEMENT_VIEW', 'SETTLEMENT_CREATE'
    ];

    const staffPermCodes = [
      'QUARRY_VIEW',
      'PRODUCT_VIEW',
      'PRODUCTION_VIEW', 'PRODUCTION_CREATE',
      'STOCK_VIEW',
      'GATE_PASS_VIEW', 'GATE_PASS_CREATE',
      'LAND_VIEW'
    ];

    const allQuarryPermCodes = quarryPerms.map(p => p.code);

    const assignPermsToRole = (roleId: string, codes: string[]) => {
      codes.forEach(code => {
        const perm = quarryPerms.find(p => p.code === code);
        if (!perm) return;
        const exists = Array.from(this.rolePermissions.values()).some(
          rp => rp.roleId === roleId && rp.permissionCode === code
        );
        if (!exists) {
          const rpId = generateUuidV7();
          this.rolePermissions.set(rpId, {
            id: rpId,
            roleId,
            permissionId: perm.id,
            permissionCode: code
          });
        }
      });
    };

    assignPermsToRole('role-super-admin', allQuarryPermCodes);
    assignPermsToRole('role-developer', allQuarryPermCodes);
    assignPermsToRole('role-corporate-admin', allQuarryPermCodes);
    assignPermsToRole('role-quarry-owner', allQuarryPermCodes);
    assignPermsToRole('role-quarry-mgr', managerPermCodes);
    assignPermsToRole('role-quarry-staff', staffPermCodes);

    // 4. Users
    const ownerPass = hashPassword('OwnerPass2026!');
    const staffPass = hashPassword('StaffPass2026!');

    const userOwner: User = {
      id: 'usr-quarry-owner-001',
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1?.id,
      email: 'quarry.owner@racezoneventures.com',
      passwordHash: ownerPass.hash,
      salt: ownerPass.salt,
      fullName: 'Rajesh Hegde (Quarry Owner)',
      phone: '+1-800-QOWNER',
      department: 'Executive Board',
      designation: 'Quarry Owner & Principal',
      status: 'ACTIVE',
      isMfaEnabled: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    const userStaff: User = {
      id: 'usr-quarry-staff-001',
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1?.id,
      email: 'quarry.staff@racezoneventures.com',
      passwordHash: staffPass.hash,
      salt: staffPass.salt,
      fullName: 'Suresh Kumar (Weighbridge Staff)',
      phone: '+1-800-QSTAFF',
      department: 'Mining Operations',
      designation: 'Weighbridge Clerk',
      status: 'ACTIVE',
      isMfaEnabled: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    if (!this.users.has(userOwner.id)) this.users.set(userOwner.id, userOwner);
    if (!this.users.has(userStaff.id)) this.users.set(userStaff.id, userStaff);

    // User Roles assignments
    const assignUserRole = (id: string, userId: string, roleId: string, tenantIdStr: string) => {
      const exists = Array.from(this.userRoles.values()).some(ur => ur.userId === userId && ur.roleId === roleId);
      if (!exists) {
        this.userRoles.set(id, {
          id,
          userId,
          roleId,
          tenantId: tenantIdStr,
          assignedAt: now,
          assignedBy: 'SYSTEM'
        });
      }
    };

    assignUserRole('ur-quarry-owner-1', 'usr-quarry-owner-001', 'role-quarry-owner', tenant1.id);
    assignUserRole('ur-quarry-mgr-1', 'usr-quarry-mgr-002', 'role-quarry-mgr', tenant1.id);
    assignUserRole('ur-quarry-staff-1', 'usr-quarry-staff-001', 'role-quarry-staff', tenant1.id);
    assignUserRole('ur-dev-1', 'usr-admin-001', 'role-developer', tenant1.id);
    assignUserRole('ur-corp-1', 'usr-admin-001', 'role-corporate-admin', tenant1.id);
  }
}

// Global Singleton DB Instance
export const db = new DatabaseStore();

export function isLivePostgresConnected(): boolean {
  return db.persistenceAdapter.isLivePostgresConnected();
}

export async function initializeDatabase(): Promise<void> {
  await db.initialize();
}
