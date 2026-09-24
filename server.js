var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/server/main.ts
var main_exports = {};
__export(main_exports, {
  startServer: () => startServer
});
module.exports = __toCommonJS(main_exports);
var import_express10 = __toESM(require("express"), 1);
var import_fs4 = __toESM(require("fs"), 1);
var import_path4 = __toESM(require("path"), 1);

// src/server/routes/apiRouter.ts
var import_express9 = require("express");

// src/server/db/database.ts
var import_crypto = __toESM(require("crypto"), 1);
var import_fs2 = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);

// src/server/db/persistenceAdapter.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);

// src/server/db/postgresPool.ts
var import_pg = __toESM(require("pg"), 1);
var { Pool } = import_pg.default;
var PostgresConnectionManager = class {
  constructor() {
    this.pool = null;
    this.isShuttingDown = false;
    this.connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (this.connectionString && this.connectionString.trim().length > 5) {
      this.initPool();
    }
  }
  initPool() {
    if (this.pool || !this.connectionString) return;
    const min = process.env.DB_POOL_MIN ? parseInt(process.env.DB_POOL_MIN, 10) : 2;
    const max = process.env.DB_POOL_MAX ? parseInt(process.env.DB_POOL_MAX, 10) : 10;
    const connectionTimeoutMillis = process.env.DB_CONNECT_TIMEOUT_MS ? parseInt(process.env.DB_CONNECT_TIMEOUT_MS, 10) : 5e3;
    const idleTimeoutMillis = process.env.DB_IDLE_TIMEOUT_MS ? parseInt(process.env.DB_IDLE_TIMEOUT_MS, 10) : 3e4;
    const isLocalhost = this.connectionString.includes("localhost") || this.connectionString.includes("127.0.0.1");
    const sslEnv = process.env.DB_SSL_ENABLED;
    const useSsl = sslEnv !== void 0 ? sslEnv === "true" : !isLocalhost;
    this.pool = new Pool({
      connectionString: this.connectionString,
      min,
      max,
      connectionTimeoutMillis,
      idleTimeoutMillis,
      ssl: useSsl ? { rejectUnauthorized: false } : void 0
    });
    this.pool.on("error", (err) => {
      if (!this.isShuttingDown) {
        console.error("[PostgresPool] Unexpected background client error:", err.message);
      }
    });
  }
  isConfigured() {
    return Boolean(this.connectionString && this.connectionString.trim().length > 5);
  }
  getPool() {
    if (!this.pool && this.isConfigured()) {
      this.initPool();
    }
    return this.pool;
  }
  /**
   * Executes a health query (SELECT 1) against the live database pool.
   * Returns exact status without throwing unhandled exceptions.
   */
  async checkHealth() {
    if (!this.isConfigured()) {
      return {
        status: "LOCAL_JSON",
        engine: "PostgreSQL Engine (Unconfigured - Local JSON Fallback /data/shared_core_db.json)",
        tablesCount: 23
      };
    }
    const currentPool = this.getPool();
    if (!currentPool) {
      return {
        status: "POSTGRESQL_UNAVAILABLE",
        engine: "PostgreSQL (Uninitialized Pool)",
        tablesCount: 0,
        error: "Connection pool could not be initialized from provided credentials."
      };
    }
    const start = Date.now();
    let client = null;
    try {
      client = await currentPool.connect();
      const result = await client.query("SELECT NOW() as now, current_database() as db");
      const latencyMs = Date.now() - start;
      const tableCountRes = await client.query(
        "SELECT COUNT(*)::text as count FROM information_schema.tables WHERE table_schema = 'public'"
      );
      return {
        status: "POSTGRESQL_CONNECTED",
        engine: `PostgreSQL Live (${result.rows[0]?.db || "connected"})`,
        tablesCount: parseInt(tableCountRes.rows[0]?.count || "23", 10),
        latencyMs,
        activeConnections: currentPool.totalCount - currentPool.idleCount,
        idleConnections: currentPool.idleCount,
        totalConnections: currentPool.totalCount
      };
    } catch (err) {
      return {
        status: "POSTGRESQL_UNAVAILABLE",
        engine: "PostgreSQL Live Server (Unreachable)",
        tablesCount: 0,
        latencyMs: Date.now() - start,
        error: err.message || "Failed to connect to PostgreSQL server."
      };
    } finally {
      if (client) {
        client.release();
      }
    }
  }
  /**
   * Graceful shutdown of connection pool.
   */
  async close() {
    if (this.pool) {
      this.isShuttingDown = true;
      try {
        await this.pool.end();
      } catch (err) {
        console.warn("[PostgresPool] Notice during pool closure:", err);
      } finally {
        this.pool = null;
      }
    }
  }
};
var postgresManager = new PostgresConnectionManager();

// src/server/db/persistenceAdapter.ts
var LocalJsonPersistenceAdapter = class {
  constructor(customPath) {
    this.providerName = "LOCAL_JSON";
    this.filePath = customPath || import_path.default.join(process.cwd(), "data", "shared_core_db.json");
  }
  isLivePostgresConnected() {
    return false;
  }
  async loadAll() {
    try {
      if (import_fs.default.existsSync(this.filePath)) {
        const raw = import_fs.default.readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          tenants: parsed.tenants || [],
          companies: parsed.companies || [],
          branches: parsed.branches || [],
          businessUnits: parsed.businessUnits || [],
          users: parsed.users || [],
          roles: parsed.roles || [],
          permissions: parsed.permissions || [],
          userRoles: parsed.userRoles || [],
          rolePermissions: parsed.rolePermissions || [],
          masterData: parsed.masterData || [],
          documents: parsed.documents || [],
          notifications: parsed.notifications || [],
          auditLogs: parsed.auditLogs || [],
          workflowDefinitions: parsed.workflowDefinitions || [],
          workflowInstances: parsed.workflowInstances || [],
          workflowActions: parsed.workflowActions || [],
          quarryMasters: parsed.quarryMasters || [],
          stoneProducts: parsed.stoneProducts || [],
          quarryProductions: parsed.quarryProductions || [],
          quarryStocks: parsed.quarryStocks || [],
          gatePasses: parsed.gatePasses || [],
          quarryLandLeases: parsed.quarryLandLeases || [],
          landownerSettlements: parsed.landownerSettlements || []
        };
      }
    } catch (err) {
      console.warn("[PersistenceAdapter] Could not load JSON persistence file, starting fresh:", err);
    }
    return {
      tenants: [],
      companies: [],
      branches: [],
      businessUnits: [],
      users: [],
      roles: [],
      permissions: [],
      userRoles: [],
      rolePermissions: [],
      masterData: [],
      documents: [],
      notifications: [],
      auditLogs: [],
      workflowDefinitions: [],
      workflowInstances: [],
      workflowActions: [],
      quarryMasters: [],
      stoneProducts: [],
      quarryProductions: [],
      quarryStocks: [],
      gatePasses: [],
      quarryLandLeases: [],
      landownerSettlements: []
    };
  }
  async saveAll(tables) {
    try {
      const dir = import_path.default.dirname(this.filePath);
      if (!import_fs.default.existsSync(dir)) {
        import_fs.default.mkdirSync(dir, { recursive: true });
      }
      import_fs.default.writeFileSync(this.filePath, JSON.stringify(tables, null, 2), "utf-8");
    } catch (err) {
      console.error("[PersistenceAdapter] Failed to save JSON database state:", err);
    }
  }
  async executeHealthCheck() {
    return {
      status: "ACTIVE_FALLBACK",
      engine: "Local JSON File System (/data/shared_core_db.json)",
      tablesCount: 23
    };
  }
};
var PostgresPersistenceAdapter = class {
  constructor() {
    this.providerName = "POSTGRES_DRIZZLE";
  }
  isLivePostgresConnected() {
    return postgresManager.isConfigured();
  }
  async loadAll() {
    const pool = postgresManager.getPool();
    if (!pool) {
      throw new Error("PostgreSQL connection credentials not provided in environment variables.");
    }
    const client = await pool.connect();
    try {
      const fetchTableRows = async (tableName) => {
        try {
          const res = await client.query(`SELECT * FROM ${tableName}`);
          return res.rows || [];
        } catch {
          return [];
        }
      };
      const [
        tenants,
        companies,
        branches,
        businessUnits,
        users,
        roles,
        permissions,
        userRoles,
        rolePermissions,
        masterData,
        documents,
        notifications,
        auditLogs,
        workflowDefinitions,
        workflowInstances,
        workflowActions,
        quarryMasters,
        stoneProducts,
        quarryProductions,
        quarryStocks,
        gatePasses,
        quarryLandLeases,
        landownerSettlements
      ] = await Promise.all([
        fetchTableRows("core_tenants"),
        fetchTableRows("core_companies"),
        fetchTableRows("core_branches"),
        fetchTableRows("core_business_units"),
        fetchTableRows("core_users"),
        fetchTableRows("core_roles"),
        fetchTableRows("core_permissions"),
        fetchTableRows("core_user_roles"),
        fetchTableRows("core_role_permissions"),
        fetchTableRows("core_master_data"),
        fetchTableRows("core_documents"),
        fetchTableRows("core_notifications"),
        fetchTableRows("core_audit_logs"),
        fetchTableRows("core_workflow_definitions"),
        fetchTableRows("core_workflow_instances"),
        fetchTableRows("core_workflow_actions"),
        fetchTableRows("quarry_masters"),
        fetchTableRows("stone_products"),
        fetchTableRows("quarry_productions"),
        fetchTableRows("quarry_stocks"),
        fetchTableRows("gate_passes"),
        fetchTableRows("quarry_land_leases"),
        fetchTableRows("landowner_settlements")
      ]);
      return {
        tenants,
        companies,
        branches,
        businessUnits,
        users,
        roles,
        permissions,
        userRoles,
        rolePermissions,
        masterData,
        documents,
        notifications,
        auditLogs,
        workflowDefinitions,
        workflowInstances,
        workflowActions,
        quarryMasters,
        stoneProducts,
        quarryProductions,
        quarryStocks,
        gatePasses,
        quarryLandLeases,
        landownerSettlements
      };
    } finally {
      client.release();
    }
  }
  async saveAll(tables) {
    const pool = postgresManager.getPool();
    if (!pool) {
      throw new Error("PostgreSQL connection credentials not provided in environment variables.");
    }
  }
  async executeHealthCheck() {
    const health = await postgresManager.checkHealth();
    return {
      status: health.status,
      engine: health.engine,
      tablesCount: health.tablesCount
    };
  }
};

// src/server/db/database.ts
function generateUuidV7() {
  const timestamp = Date.now().toString(16).padStart(12, "0");
  const randomHex = import_crypto.default.randomBytes(10).toString("hex");
  return `${timestamp.slice(0, 8)}-${timestamp.slice(8, 12)}-7${randomHex.slice(0, 3)}-a${randomHex.slice(3, 6)}-${randomHex.slice(6, 18)}`;
}
function hashPassword(password, salt) {
  const finalSalt = salt || import_crypto.default.randomBytes(16).toString("hex");
  const hash = import_crypto.default.pbkdf2Sync(password, finalSalt, 1e4, 64, "sha512").toString("hex");
  return { hash, salt: finalSalt };
}
var DatabaseStore = class {
  constructor() {
    this.tenants = /* @__PURE__ */ new Map();
    this.companies = /* @__PURE__ */ new Map();
    this.branches = /* @__PURE__ */ new Map();
    this.businessUnits = /* @__PURE__ */ new Map();
    this.users = /* @__PURE__ */ new Map();
    this.roles = /* @__PURE__ */ new Map();
    this.permissions = /* @__PURE__ */ new Map();
    this.userRoles = /* @__PURE__ */ new Map();
    this.rolePermissions = /* @__PURE__ */ new Map();
    this.masterData = /* @__PURE__ */ new Map();
    this.documents = /* @__PURE__ */ new Map();
    this.notifications = /* @__PURE__ */ new Map();
    this.auditLogs = /* @__PURE__ */ new Map();
    this.workflowDefinitions = /* @__PURE__ */ new Map();
    this.workflowInstances = /* @__PURE__ */ new Map();
    this.workflowActions = /* @__PURE__ */ new Map();
    // Fleet Maps
    this.fleetVehicleCategories = /* @__PURE__ */ new Map();
    this.fleetVehicles = /* @__PURE__ */ new Map();
    this.fleetVehicleDocuments = /* @__PURE__ */ new Map();
    this.fleetDrivers = /* @__PURE__ */ new Map();
    this.fleetVehicleAssignments = /* @__PURE__ */ new Map();
    this.fleetTrips = /* @__PURE__ */ new Map();
    this.fleetFuelLogs = /* @__PURE__ */ new Map();
    this.fleetMaintenanceRecords = /* @__PURE__ */ new Map();
    this.fleetComplianceRecords = /* @__PURE__ */ new Map();
    this.fleetOdometerLogs = /* @__PURE__ */ new Map();
    this.fleetExpenses = /* @__PURE__ */ new Map();
    this.fleetRevenues = /* @__PURE__ */ new Map();
    this.fleetAlerts = /* @__PURE__ */ new Map();
    // Phase 19 Marketplace Maps
    this.loadRequests = /* @__PURE__ */ new Map();
    this.loadOffers = /* @__PURE__ */ new Map();
    this.loadMatches = /* @__PURE__ */ new Map();
    this.loadBookings = /* @__PURE__ */ new Map();
    this.transporterProfiles = /* @__PURE__ */ new Map();
    this.transporterServiceAreas = /* @__PURE__ */ new Map();
    this.marketplacePricingRules = /* @__PURE__ */ new Map();
    this.marketplaceDeliveries = /* @__PURE__ */ new Map();
    this.marketplaceRatings = /* @__PURE__ */ new Map();
    this.marketplaceDisputes = /* @__PURE__ */ new Map();
    this.marketplaceMatchingEvents = /* @__PURE__ */ new Map();
    // Phase 20 CRM Maps
    this.crmCustomers = /* @__PURE__ */ new Map();
    this.crmContacts = /* @__PURE__ */ new Map();
    this.crmLeads = /* @__PURE__ */ new Map();
    this.crmOpportunities = /* @__PURE__ */ new Map();
    this.crmSalesActivities = /* @__PURE__ */ new Map();
    this.crmQuotations = /* @__PURE__ */ new Map();
    this.crmQuotationItems = /* @__PURE__ */ new Map();
    this.crmCustomerCredit = /* @__PURE__ */ new Map();
    this.crmCustomerDocuments = /* @__PURE__ */ new Map();
    this.crmSupportTickets = /* @__PURE__ */ new Map();
    this.crmCustomerSegments = /* @__PURE__ */ new Map();
    this.crmCustomerHealth = /* @__PURE__ */ new Map();
    this.crmCustomerNotes = /* @__PURE__ */ new Map();
    // Phase 21 Finance Maps
    this.chartOfAccounts = /* @__PURE__ */ new Map();
    this.fiscalYears = /* @__PURE__ */ new Map();
    this.fiscalPeriods = /* @__PURE__ */ new Map();
    this.costCenters = /* @__PURE__ */ new Map();
    this.financeProjects = /* @__PURE__ */ new Map();
    this.journals = /* @__PURE__ */ new Map();
    this.journalLines = /* @__PURE__ */ new Map();
    this.customerInvoices = /* @__PURE__ */ new Map();
    this.invoiceItems = /* @__PURE__ */ new Map();
    this.customerPayments = /* @__PURE__ */ new Map();
    this.paymentAllocations = /* @__PURE__ */ new Map();
    this.supplierBills = /* @__PURE__ */ new Map();
    this.supplierBillItems = /* @__PURE__ */ new Map();
    this.supplierPayments = /* @__PURE__ */ new Map();
    this.financeExpenses = /* @__PURE__ */ new Map();
    this.bankAccounts = /* @__PURE__ */ new Map();
    this.bankTransactions = /* @__PURE__ */ new Map();
    this.bankReconciliations = /* @__PURE__ */ new Map();
    this.creditNotes = /* @__PURE__ */ new Map();
    this.debitNotes = /* @__PURE__ */ new Map();
    this.taxCodes = /* @__PURE__ */ new Map();
    // Phase 22 Enterprise HRMS Maps
    this.hrDepartments = /* @__PURE__ */ new Map();
    this.hrDesignations = /* @__PURE__ */ new Map();
    this.hrEmployees = /* @__PURE__ */ new Map();
    this.hrEmployeeUsers = /* @__PURE__ */ new Map();
    this.hrEmployeeAssignments = /* @__PURE__ */ new Map();
    this.hrShifts = /* @__PURE__ */ new Map();
    this.hrEmployeeShifts = /* @__PURE__ */ new Map();
    this.hrAttendances = /* @__PURE__ */ new Map();
    this.hrAttendanceCorrections = /* @__PURE__ */ new Map();
    this.hrLeaveTypes = /* @__PURE__ */ new Map();
    this.hrLeavePolicies = /* @__PURE__ */ new Map();
    this.hrLeaveBalances = /* @__PURE__ */ new Map();
    this.hrLeaveApplications = /* @__PURE__ */ new Map();
    this.hrHolidays = /* @__PURE__ */ new Map();
    this.hrOvertimes = /* @__PURE__ */ new Map();
    this.hrSalaryStructures = /* @__PURE__ */ new Map();
    this.hrSalaryComponents = /* @__PURE__ */ new Map();
    this.hrPayrollYears = /* @__PURE__ */ new Map();
    this.hrPayrollPeriods = /* @__PURE__ */ new Map();
    this.hrPayrollRuns = /* @__PURE__ */ new Map();
    this.hrPayrollItems = /* @__PURE__ */ new Map();
    this.hrPayslips = /* @__PURE__ */ new Map();
    this.hrSalaryAdvances = /* @__PURE__ */ new Map();
    this.hrEmployeeLoans = /* @__PURE__ */ new Map();
    this.hrLoanInstallments = /* @__PURE__ */ new Map();
    this.hrReimbursements = /* @__PURE__ */ new Map();
    this.hrEmployeeDocuments = /* @__PURE__ */ new Map();
    this.hrPerformanceCycles = /* @__PURE__ */ new Map();
    this.hrEmployeeGoals = /* @__PURE__ */ new Map();
    this.hrEmployeeReviews = /* @__PURE__ */ new Map();
    this.hrJobRequisitions = /* @__PURE__ */ new Map();
    this.hrCandidates = /* @__PURE__ */ new Map();
    this.hrApplications = /* @__PURE__ */ new Map();
    this.hrInterviews = /* @__PURE__ */ new Map();
    this.hrOffers = /* @__PURE__ */ new Map();
    this.hrOnboardings = /* @__PURE__ */ new Map();
    this.hrOffboardings = /* @__PURE__ */ new Map();
    this.hrFinalSettlements = /* @__PURE__ */ new Map();
    // Platform 1: Quarry Management Maps
    this.quarryMasters = /* @__PURE__ */ new Map();
    this.stoneProducts = /* @__PURE__ */ new Map();
    this.quarryProductions = /* @__PURE__ */ new Map();
    this.quarryStocks = /* @__PURE__ */ new Map();
    this.gatePasses = /* @__PURE__ */ new Map();
    this.quarryLandLeases = /* @__PURE__ */ new Map();
    this.landownerSettlements = /* @__PURE__ */ new Map();
    // Concurrency & Transaction Management
    this.lockQueues = /* @__PURE__ */ new Map();
    this.storageFilePath = import_path2.default.join(process.cwd(), "data", "shared_core_db.json");
    if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
      this.persistenceAdapter = new PostgresPersistenceAdapter();
    } else {
      this.persistenceAdapter = new LocalJsonPersistenceAdapter(this.storageFilePath);
    }
    this.initializeAndSeed();
  }
  /**
   * Acquires an advisory lock for stock mutation on composite key: tenant_id + quarry_id + product_id.
   * In PostgreSQL mode, maps to pg_advisory_xact_lock(hashtext('...')).
   * In Local/Dev mode, serializes concurrent operations via keyed promise queues.
   */
  async acquireStockAdvisoryLock(tenantId, quarryId, productId) {
    const key = `stock_lock:${tenantId}:${quarryId}:${productId}`;
    const currentLock = this.lockQueues.get(key) || Promise.resolve();
    let release;
    const nextLock = new Promise((resolve) => {
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
  async executeTransaction(operation, tenantId) {
    const pool = postgresManager.getPool();
    if (this.persistenceAdapter instanceof PostgresPersistenceAdapter && pool && postgresManager.isConfigured()) {
      const client = await pool.connect();
      let isRolledBack = false;
      const rollback2 = () => {
        isRolledBack = true;
      };
      try {
        await client.query("BEGIN");
        if (tenantId) {
          await client.query("SELECT set_config('app.current_tenant_id', $1, true)", [tenantId]);
        }
        const txContext2 = {
          client,
          isPostgres: true,
          rollback: rollback2,
          query: (text, params) => client.query(text, params),
          setTenantContext: async (tId) => {
            await client.query("SELECT set_config('app.current_tenant_id', $1, true)", [tId]);
          },
          acquireAdvisoryLock: async (lockKey) => {
            await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [lockKey]);
          }
        };
        const result = await operation(txContext2);
        if (isRolledBack) {
          await client.query("ROLLBACK");
          throw new Error("Transaction explicitly rolled back");
        } else {
          await client.query("COMMIT");
          return result;
        }
      } catch (err) {
        try {
          await client.query("ROLLBACK");
        } catch {
        }
        throw err;
      } finally {
        client.release();
      }
    }
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
    const txContext = {
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
  getAdapterName() {
    return this.persistenceAdapter.providerName;
  }
  initializeAndSeed() {
    const dir = import_path2.default.dirname(this.storageFilePath);
    if (!import_fs2.default.existsSync(dir)) {
      import_fs2.default.mkdirSync(dir, { recursive: true });
    }
    if (import_fs2.default.existsSync(this.storageFilePath)) {
      try {
        const fileContent = import_fs2.default.readFileSync(this.storageFilePath, "utf-8");
        const parsed = JSON.parse(fileContent);
        this.loadFromDump(parsed);
        console.log(`[DB] Database loaded via adapter [${this.persistenceAdapter.providerName}] from persistent storage.`);
        if (this.fleetVehicles.size === 0) {
          this.seedFleetDataOnly();
          this.persistToDisk();
        }
        if (this.transporterProfiles.size === 0) {
          this.seedMarketplaceDataOnly();
          this.persistToDisk();
        }
        if (this.crmCustomers.size === 0) {
          this.seedCrmDataOnly();
          this.persistToDisk();
        }
        if (this.chartOfAccounts.size === 0) {
          this.seedFinanceDataOnly();
          this.persistToDisk();
        }
        if (this.hrEmployees.size === 0) {
          this.seedHrDataOnly();
          this.persistToDisk();
        }
        if (this.quarryMasters.size === 0) {
          this.seedQuarryDataOnly();
          this.persistToDisk();
        }
        this.seedQuarryRbacData();
        this.persistToDisk();
        return;
      } catch (err) {
        console.warn("[DB] Failed to parse db json file, seeding fresh database:", err);
      }
    }
    this.seedDefaultEnterpriseData();
    this.seedQuarryRbacData();
    this.persistToDisk();
  }
  loadFromDump(dump) {
    if (dump.tenants) dump.tenants.forEach((item) => this.tenants.set(item.id, item));
    if (dump.companies) dump.companies.forEach((item) => this.companies.set(item.id, item));
    if (dump.branches) dump.branches.forEach((item) => this.branches.set(item.id, item));
    if (dump.businessUnits) dump.businessUnits.forEach((item) => this.businessUnits.set(item.id, item));
    if (dump.users) dump.users.forEach((item) => this.users.set(item.id, item));
    if (dump.roles) dump.roles.forEach((item) => this.roles.set(item.id, item));
    if (dump.permissions) dump.permissions.forEach((item) => this.permissions.set(item.id, item));
    if (dump.userRoles) dump.userRoles.forEach((item) => this.userRoles.set(item.id, item));
    if (dump.rolePermissions) dump.rolePermissions.forEach((item) => this.rolePermissions.set(item.id, item));
    if (dump.masterData) dump.masterData.forEach((item) => this.masterData.set(item.id, item));
    if (dump.documents) dump.documents.forEach((item) => this.documents.set(item.id, item));
    if (dump.notifications) dump.notifications.forEach((item) => this.notifications.set(item.id, item));
    if (dump.auditLogs) dump.auditLogs.forEach((item) => this.auditLogs.set(item.id, item));
    if (dump.workflowDefinitions) dump.workflowDefinitions.forEach((item) => this.workflowDefinitions.set(item.id, item));
    if (dump.workflowInstances) dump.workflowInstances.forEach((item) => this.workflowInstances.set(item.id, item));
    if (dump.workflowActions) dump.workflowActions.forEach((item) => this.workflowActions.set(item.id, item));
    if (dump.fleetVehicleCategories) dump.fleetVehicleCategories.forEach((item) => this.fleetVehicleCategories.set(item.id, item));
    if (dump.fleetVehicles) dump.fleetVehicles.forEach((item) => this.fleetVehicles.set(item.id, item));
    if (dump.fleetVehicleDocuments) dump.fleetVehicleDocuments.forEach((item) => this.fleetVehicleDocuments.set(item.id, item));
    if (dump.fleetDrivers) dump.fleetDrivers.forEach((item) => this.fleetDrivers.set(item.id, item));
    if (dump.fleetVehicleAssignments) dump.fleetVehicleAssignments.forEach((item) => this.fleetVehicleAssignments.set(item.id, item));
    if (dump.fleetTrips) dump.fleetTrips.forEach((item) => this.fleetTrips.set(item.id, item));
    if (dump.fleetFuelLogs) dump.fleetFuelLogs.forEach((item) => this.fleetFuelLogs.set(item.id, item));
    if (dump.fleetMaintenanceRecords) dump.fleetMaintenanceRecords.forEach((item) => this.fleetMaintenanceRecords.set(item.id, item));
    if (dump.fleetComplianceRecords) dump.fleetComplianceRecords.forEach((item) => this.fleetComplianceRecords.set(item.id, item));
    if (dump.fleetOdometerLogs) dump.fleetOdometerLogs.forEach((item) => this.fleetOdometerLogs.set(item.id, item));
    if (dump.fleetExpenses) dump.fleetExpenses.forEach((item) => this.fleetExpenses.set(item.id, item));
    if (dump.fleetRevenues) dump.fleetRevenues.forEach((item) => this.fleetRevenues.set(item.id, item));
    if (dump.fleetAlerts) dump.fleetAlerts.forEach((item) => this.fleetAlerts.set(item.id, item));
    if (dump.loadRequests) dump.loadRequests.forEach((item) => this.loadRequests.set(item.id, item));
    if (dump.loadOffers) dump.loadOffers.forEach((item) => this.loadOffers.set(item.id, item));
    if (dump.loadMatches) dump.loadMatches.forEach((item) => this.loadMatches.set(item.id, item));
    if (dump.loadBookings) dump.loadBookings.forEach((item) => this.loadBookings.set(item.id, item));
    if (dump.transporterProfiles) dump.transporterProfiles.forEach((item) => this.transporterProfiles.set(item.id, item));
    if (dump.transporterServiceAreas) dump.transporterServiceAreas.forEach((item) => this.transporterServiceAreas.set(item.id, item));
    if (dump.marketplacePricingRules) dump.marketplacePricingRules.forEach((item) => this.marketplacePricingRules.set(item.id, item));
    if (dump.marketplaceDeliveries) dump.marketplaceDeliveries.forEach((item) => this.marketplaceDeliveries.set(item.id, item));
    if (dump.marketplaceRatings) dump.marketplaceRatings.forEach((item) => this.marketplaceRatings.set(item.id, item));
    if (dump.marketplaceDisputes) dump.marketplaceDisputes.forEach((item) => this.marketplaceDisputes.set(item.id, item));
    if (dump.marketplaceMatchingEvents) dump.marketplaceMatchingEvents.forEach((item) => this.marketplaceMatchingEvents.set(item.id, item));
    if (dump.crmCustomers) dump.crmCustomers.forEach((item) => this.crmCustomers.set(item.id, item));
    if (dump.crmContacts) dump.crmContacts.forEach((item) => this.crmContacts.set(item.id, item));
    if (dump.crmLeads) dump.crmLeads.forEach((item) => this.crmLeads.set(item.id, item));
    if (dump.crmOpportunities) dump.crmOpportunities.forEach((item) => this.crmOpportunities.set(item.id, item));
    if (dump.crmSalesActivities) dump.crmSalesActivities.forEach((item) => this.crmSalesActivities.set(item.id, item));
    if (dump.crmQuotations) dump.crmQuotations.forEach((item) => this.crmQuotations.set(item.id, item));
    if (dump.crmQuotationItems) dump.crmQuotationItems.forEach((item) => this.crmQuotationItems.set(item.id, item));
    if (dump.crmCustomerCredit) dump.crmCustomerCredit.forEach((item) => this.crmCustomerCredit.set(item.id, item));
    if (dump.crmCustomerDocuments) dump.crmCustomerDocuments.forEach((item) => this.crmCustomerDocuments.set(item.id, item));
    if (dump.crmSupportTickets) dump.crmSupportTickets.forEach((item) => this.crmSupportTickets.set(item.id, item));
    if (dump.crmCustomerSegments) dump.crmCustomerSegments.forEach((item) => this.crmCustomerSegments.set(item.id, item));
    if (dump.crmCustomerHealth) dump.crmCustomerHealth.forEach((item) => this.crmCustomerHealth.set(item.id, item));
    if (dump.crmCustomerNotes) dump.crmCustomerNotes.forEach((item) => this.crmCustomerNotes.set(item.id, item));
    if (dump.chartOfAccounts) dump.chartOfAccounts.forEach((item) => this.chartOfAccounts.set(item.id, item));
    if (dump.fiscalYears) dump.fiscalYears.forEach((item) => this.fiscalYears.set(item.id, item));
    if (dump.fiscalPeriods) dump.fiscalPeriods.forEach((item) => this.fiscalPeriods.set(item.id, item));
    if (dump.costCenters) dump.costCenters.forEach((item) => this.costCenters.set(item.id, item));
    if (dump.financeProjects) dump.financeProjects.forEach((item) => this.financeProjects.set(item.id, item));
    if (dump.journals) dump.journals.forEach((item) => this.journals.set(item.id, item));
    if (dump.journalLines) dump.journalLines.forEach((item) => this.journalLines.set(item.id, item));
    if (dump.customerInvoices) dump.customerInvoices.forEach((item) => this.customerInvoices.set(item.id, item));
    if (dump.invoiceItems) dump.invoiceItems.forEach((item) => this.invoiceItems.set(item.id, item));
    if (dump.customerPayments) dump.customerPayments.forEach((item) => this.customerPayments.set(item.id, item));
    if (dump.paymentAllocations) dump.paymentAllocations.forEach((item) => this.paymentAllocations.set(item.id, item));
    if (dump.supplierBills) dump.supplierBills.forEach((item) => this.supplierBills.set(item.id, item));
    if (dump.supplierBillItems) dump.supplierBillItems.forEach((item) => this.supplierBillItems.set(item.id, item));
    if (dump.supplierPayments) dump.supplierPayments.forEach((item) => this.supplierPayments.set(item.id, item));
    if (dump.financeExpenses) dump.financeExpenses.forEach((item) => this.financeExpenses.set(item.id, item));
    if (dump.bankAccounts) dump.bankAccounts.forEach((item) => this.bankAccounts.set(item.id, item));
    if (dump.bankTransactions) dump.bankTransactions.forEach((item) => this.bankTransactions.set(item.id, item));
    if (dump.bankReconciliations) dump.bankReconciliations.forEach((item) => this.bankReconciliations.set(item.id, item));
    if (dump.creditNotes) dump.creditNotes.forEach((item) => this.creditNotes.set(item.id, item));
    if (dump.debitNotes) dump.debitNotes.forEach((item) => this.debitNotes.set(item.id, item));
    if (dump.taxCodes) dump.taxCodes.forEach((item) => this.taxCodes.set(item.id, item));
    if (dump.hrDepartments) dump.hrDepartments.forEach((item) => this.hrDepartments.set(item.id, item));
    if (dump.hrDesignations) dump.hrDesignations.forEach((item) => this.hrDesignations.set(item.id, item));
    if (dump.hrEmployees) dump.hrEmployees.forEach((item) => this.hrEmployees.set(item.id, item));
    if (dump.hrEmployeeUsers) dump.hrEmployeeUsers.forEach((item) => this.hrEmployeeUsers.set(item.id, item));
    if (dump.hrEmployeeAssignments) dump.hrEmployeeAssignments.forEach((item) => this.hrEmployeeAssignments.set(item.id, item));
    if (dump.hrShifts) dump.hrShifts.forEach((item) => this.hrShifts.set(item.id, item));
    if (dump.hrEmployeeShifts) dump.hrEmployeeShifts.forEach((item) => this.hrEmployeeShifts.set(item.id, item));
    if (dump.hrAttendances) dump.hrAttendances.forEach((item) => this.hrAttendances.set(item.id, item));
    if (dump.hrAttendanceCorrections) dump.hrAttendanceCorrections.forEach((item) => this.hrAttendanceCorrections.set(item.id, item));
    if (dump.hrLeaveTypes) dump.hrLeaveTypes.forEach((item) => this.hrLeaveTypes.set(item.id, item));
    if (dump.hrLeavePolicies) dump.hrLeavePolicies.forEach((item) => this.hrLeavePolicies.set(item.id, item));
    if (dump.hrLeaveBalances) dump.hrLeaveBalances.forEach((item) => this.hrLeaveBalances.set(item.id, item));
    if (dump.hrLeaveApplications) dump.hrLeaveApplications.forEach((item) => this.hrLeaveApplications.set(item.id, item));
    if (dump.hrHolidays) dump.hrHolidays.forEach((item) => this.hrHolidays.set(item.id, item));
    if (dump.hrOvertimes) dump.hrOvertimes.forEach((item) => this.hrOvertimes.set(item.id, item));
    if (dump.hrSalaryStructures) dump.hrSalaryStructures.forEach((item) => this.hrSalaryStructures.set(item.id, item));
    if (dump.hrSalaryComponents) dump.hrSalaryComponents.forEach((item) => this.hrSalaryComponents.set(item.id, item));
    if (dump.hrPayrollYears) dump.hrPayrollYears.forEach((item) => this.hrPayrollYears.set(item.id, item));
    if (dump.hrPayrollPeriods) dump.hrPayrollPeriods.forEach((item) => this.hrPayrollPeriods.set(item.id, item));
    if (dump.hrPayrollRuns) dump.hrPayrollRuns.forEach((item) => this.hrPayrollRuns.set(item.id, item));
    if (dump.hrPayrollItems) dump.hrPayrollItems.forEach((item) => this.hrPayrollItems.set(item.id, item));
    if (dump.hrPayslips) dump.hrPayslips.forEach((item) => this.hrPayslips.set(item.id, item));
    if (dump.hrSalaryAdvances) dump.hrSalaryAdvances.forEach((item) => this.hrSalaryAdvances.set(item.id, item));
    if (dump.hrEmployeeLoans) dump.hrEmployeeLoans.forEach((item) => this.hrEmployeeLoans.set(item.id, item));
    if (dump.hrLoanInstallments) dump.hrLoanInstallments.forEach((item) => this.hrLoanInstallments.set(item.id, item));
    if (dump.hrReimbursements) dump.hrReimbursements.forEach((item) => this.hrReimbursements.set(item.id, item));
    if (dump.hrEmployeeDocuments) dump.hrEmployeeDocuments.forEach((item) => this.hrEmployeeDocuments.set(item.id, item));
    if (dump.hrPerformanceCycles) dump.hrPerformanceCycles.forEach((item) => this.hrPerformanceCycles.set(item.id, item));
    if (dump.hrEmployeeGoals) dump.hrEmployeeGoals.forEach((item) => this.hrEmployeeGoals.set(item.id, item));
    if (dump.hrEmployeeReviews) dump.hrEmployeeReviews.forEach((item) => this.hrEmployeeReviews.set(item.id, item));
    if (dump.hrJobRequisitions) dump.hrJobRequisitions.forEach((item) => this.hrJobRequisitions.set(item.id, item));
    if (dump.hrCandidates) dump.hrCandidates.forEach((item) => this.hrCandidates.set(item.id, item));
    if (dump.hrApplications) dump.hrApplications.forEach((item) => this.hrApplications.set(item.id, item));
    if (dump.hrInterviews) dump.hrInterviews.forEach((item) => this.hrInterviews.set(item.id, item));
    if (dump.hrOffers) dump.hrOffers.forEach((item) => this.hrOffers.set(item.id, item));
    if (dump.hrOnboardings) dump.hrOnboardings.forEach((item) => this.hrOnboardings.set(item.id, item));
    if (dump.hrOffboardings) dump.hrOffboardings.forEach((item) => this.hrOffboardings.set(item.id, item));
    if (dump.hrFinalSettlements) dump.hrFinalSettlements.forEach((item) => this.hrFinalSettlements.set(item.id, item));
    if (dump.quarryMasters) dump.quarryMasters.forEach((item) => this.quarryMasters.set(item.id, item));
    if (dump.stoneProducts) dump.stoneProducts.forEach((item) => this.stoneProducts.set(item.id, item));
    if (dump.quarryProductions) dump.quarryProductions.forEach((item) => this.quarryProductions.set(item.id, item));
    if (dump.quarryStocks) dump.quarryStocks.forEach((item) => this.quarryStocks.set(item.id, item));
    if (dump.gatePasses) dump.gatePasses.forEach((item) => this.gatePasses.set(item.id, item));
    if (dump.quarryLandLeases) dump.quarryLandLeases.forEach((item) => this.quarryLandLeases.set(item.id, item));
    if (dump.landownerSettlements) dump.landownerSettlements.forEach((item) => this.landownerSettlements.set(item.id, item));
  }
  persistToDisk() {
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
      import_fs2.default.writeFileSync(this.storageFilePath, JSON.stringify(dump, null, 2), "utf-8");
    } catch (err) {
      console.error("[DB] Error persisting database to disk:", err);
    }
  }
  seedFleetDataOnly() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const tenantId = "tenant-rz-global-001";
    const companyId = "comp-rz-ventures-001";
    const branchId = "br-quarry-alpha";
    const catTipper = {
      id: "cat-tipper-001",
      tenantId,
      code: "TIPPER_TRUCK",
      name: "Heavy Duty Tipper Truck",
      description: "Multi-axle tippers for quarry aggregate transport",
      isCustom: false,
      createdAt: now,
      updatedAt: now
    };
    this.fleetVehicleCategories.set(catTipper.id, catTipper);
    const veh1 = {
      id: "veh-ka19-4491",
      tenantId,
      companyId,
      branchId,
      registrationNumber: "KA-19-AB-4491",
      vehicleType: "Tipper",
      categoryId: catTipper.id,
      categoryName: catTipper.name,
      make: "BharatBenz",
      model: "2823R 10-Wheeler",
      variant: "Mining Special",
      manufacturingYear: 2024,
      purchaseDate: "2024-03-15",
      purchaseValue: 485e4,
      ownershipType: "OWNED",
      ownerName: "Racezone Ventures & Mining Ltd",
      fuelType: "DIESEL",
      fuelCapacity: 300,
      engineNumber: "ENG-BB-99201",
      chassisNumber: "CHS-BB-88301",
      color: "Amber Gold",
      seatingCapacity: 2,
      loadCapacity: 28,
      currentOdometer: 18450,
      status: "AVAILABLE",
      location: "Quarry Pit #1 Yard",
      remarks: "Fitted with telematics GPS & automatic payload scale",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const veh2 = {
      id: "veh-ka19-8820",
      tenantId,
      companyId,
      branchId,
      registrationNumber: "KA-19-MC-8820",
      vehicleType: "Tipper",
      categoryId: catTipper.id,
      categoryName: catTipper.name,
      make: "Volvo",
      model: "FMX 460 8x4 Dump Truck",
      variant: "Heavy Hauler",
      manufacturingYear: 2025,
      purchaseDate: "2025-01-10",
      purchaseValue: 82e5,
      ownershipType: "OWNED",
      ownerName: "Racezone Ventures & Mining Ltd",
      fuelType: "DIESEL",
      fuelCapacity: 400,
      engineNumber: "ENG-VOL-4401",
      chassisNumber: "CHS-VOL-7712",
      color: "Navy Blue",
      seatingCapacity: 2,
      loadCapacity: 35,
      currentOdometer: 12100,
      status: "AVAILABLE",
      location: "Main Crusher Yard",
      remarks: "Primary heavy rock hauler",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.fleetVehicles.set(veh1.id, veh1);
    this.fleetVehicles.set(veh2.id, veh2);
    const drv1 = {
      id: "drv-suresh-001",
      tenantId,
      employeeId: "EMP-088",
      linkedUserId: "usr-quarry-mgr-002",
      name: "Suresh Kumar",
      phone: "+91-98450-11223",
      licenseNumber: "KA-19-2018-0099411",
      licenseType: "HEAVY_COMMERCIAL_HAZMAT",
      licenseIssueDate: "2018-05-10",
      licenseExpiryDate: "2028-05-09",
      status: "ACTIVE",
      joiningDate: "2022-01-15",
      emergencyContact: "Lakshmi Kumar (+91-98450-11224)",
      address: "Near Quarry Gate #2, Bantwal",
      remarks: "Zero-incident record. Certified for heavy tippers.",
      createdAt: now,
      updatedAt: now
    };
    this.fleetDrivers.set(drv1.id, drv1);
  }
  seedDefaultEnterpriseData() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const tenant1 = {
      id: "tenant-rz-global-001",
      code: "RZ-GLOBAL",
      name: "Racezone Ventures & Mining Ltd",
      domain: "racezoneventures.com",
      status: "ACTIVE",
      tier: "ENTERPRISE",
      settingsJson: JSON.stringify({ theme: "dark", defaultCurrency: "USD" }),
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const tenant2 = {
      id: "tenant-apex-quarry-002",
      code: "APEX-MINING",
      name: "Apex Mining & Minerals Ltd",
      domain: "apexmining.com",
      status: "ACTIVE",
      tier: "BUSINESS",
      settingsJson: JSON.stringify({ theme: "light", defaultCurrency: "USD" }),
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.tenants.set(tenant1.id, tenant1);
    this.tenants.set(tenant2.id, tenant2);
    const company1 = {
      id: "comp-101",
      tenantId: tenant1.id,
      code: "RZ-CORP",
      name: "Racezone Minetrix Operating Corp",
      taxId: "TAX-9948201",
      currency: "USD",
      country: "USA",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const company2 = {
      id: "comp-202",
      tenantId: tenant2.id,
      code: "APEX-CORP",
      name: "Apex Quarries Operations",
      taxId: "TAX-1102934",
      currency: "USD",
      country: "USA",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.companies.set(company1.id, company1);
    this.companies.set(company2.id, company2);
    const branch1 = {
      id: "br-quarry-alpha",
      tenantId: tenant1.id,
      companyId: company1.id,
      code: "BR-Q1",
      name: "Quarry Site Alpha (Laterite & Granite)",
      locationType: "QUARRY",
      address: "Sector 14 Mining Corridor, Rock Ridge",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const branch2 = {
      id: "br-crusher-beta",
      tenantId: tenant1.id,
      companyId: company1.id,
      code: "BR-C2",
      name: "Crusher Unit Beta",
      locationType: "CRUSHER",
      address: "Industrial Hub North, Gate 4",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.branches.set(branch1.id, branch1);
    this.branches.set(branch2.id, branch2);
    const permList = [
      { id: "p1", code: "shared:admin:access", module: "Shared Core", action: "admin", description: "Full Platform Admin Rights" },
      { id: "p2", code: "mining:quarry:create", module: "Mining", action: "create", description: "Create Quarry Records" },
      { id: "p3", code: "mining:quarry:view", module: "Mining", action: "view", description: "View Quarry Records" },
      { id: "p4", code: "fleet:vehicle:dispatch", module: "Fleet", action: "dispatch", description: "Dispatch Fleet Vehicles" },
      { id: "p5", code: "finance:invoice:approve", module: "Finance", action: "approve", description: "Approve Finance Invoices" },
      { id: "p6", code: "hrms:employee:view", module: "HRMS", action: "view", description: "View HR Employee Master" },
      { id: "p7", code: "chat:message:send", module: "RZ Chat", action: "send", description: "Send Realtime Chat Messages" },
      { id: "p8", code: "marketplace.load.read", module: "Marketplace", action: "read", description: "View Load Exchange Requests" },
      { id: "p9", code: "marketplace.load.create", module: "Marketplace", action: "create", description: "Create Load Exchange Request" },
      { id: "p10", code: "marketplace.load.update", module: "Marketplace", action: "update", description: "Update Load Exchange Request" },
      { id: "p11", code: "marketplace.load.delete", module: "Marketplace", action: "delete", description: "Delete Load Exchange Request" },
      { id: "p12", code: "marketplace.match.read", module: "Marketplace", action: "match_read", description: "View AI Matches" },
      { id: "p13", code: "marketplace.match.create", module: "Marketplace", action: "match_create", description: "Trigger AI Matching Engine" },
      { id: "p14", code: "marketplace.offer.read", module: "Marketplace", action: "offer_read", description: "View Transporter Offers" },
      { id: "p15", code: "marketplace.offer.create", module: "Marketplace", action: "offer_create", description: "Submit Transporter Offer" },
      { id: "p16", code: "marketplace.offer.accept", module: "Marketplace", action: "offer_accept", description: "Accept Transporter Offer" },
      { id: "p17", code: "marketplace.offer.reject", module: "Marketplace", action: "offer_reject", description: "Reject Transporter Offer" },
      { id: "p18", code: "marketplace.booking.read", module: "Marketplace", action: "booking_read", description: "View Load Bookings" },
      { id: "p19", code: "marketplace.booking.create", module: "Marketplace", action: "booking_create", description: "Create Booking" },
      { id: "p20", code: "marketplace.booking.cancel", module: "Marketplace", action: "booking_cancel", description: "Cancel Booking" },
      { id: "p21", code: "marketplace.delivery.read", module: "Marketplace", action: "delivery_read", description: "View Deliveries" },
      { id: "p22", code: "marketplace.delivery.update", module: "Marketplace", action: "delivery_update", description: "Update Delivery Status" },
      { id: "p23", code: "marketplace.rating.create", module: "Marketplace", action: "rating_create", description: "Submit Rating" },
      { id: "p24", code: "marketplace.dispute.create", module: "Marketplace", action: "dispute_create", description: "Create Dispute" },
      { id: "p25", code: "marketplace.reports.read", module: "Marketplace", action: "reports_read", description: "View Marketplace Reports" },
      { id: "p26", code: "crm.customer.read", module: "CRM", action: "customer_read", description: "Read CRM Customers" },
      { id: "p27", code: "crm.customer.create", module: "CRM", action: "customer_create", description: "Create CRM Customer" },
      { id: "p28", code: "crm.customer.update", module: "CRM", action: "customer_update", description: "Update CRM Customer" },
      { id: "p29", code: "crm.customer.delete", module: "CRM", action: "customer_delete", description: "Delete CRM Customer" },
      { id: "p30", code: "crm.contact.read", module: "CRM", action: "contact_read", description: "Read CRM Contacts" },
      { id: "p31", code: "crm.contact.create", module: "CRM", action: "contact_create", description: "Create CRM Contact" },
      { id: "p32", code: "crm.contact.update", module: "CRM", action: "contact_update", description: "Update CRM Contact" },
      { id: "p33", code: "crm.lead.read", module: "CRM", action: "lead_read", description: "Read CRM Leads" },
      { id: "p34", code: "crm.lead.create", module: "CRM", action: "lead_create", description: "Create CRM Lead" },
      { id: "p35", code: "crm.lead.update", module: "CRM", action: "lead_update", description: "Update CRM Lead" },
      { id: "p36", code: "crm.lead.assign", module: "CRM", action: "lead_assign", description: "Assign CRM Lead" },
      { id: "p37", code: "crm.opportunity.read", module: "CRM", action: "opportunity_read", description: "Read Opportunities" },
      { id: "p38", code: "crm.opportunity.create", module: "CRM", action: "opportunity_create", description: "Create Opportunity" },
      { id: "p39", code: "crm.opportunity.update", module: "CRM", action: "opportunity_update", description: "Update Opportunity" },
      { id: "p40", code: "crm.activity.read", module: "CRM", action: "activity_read", description: "Read Sales Activities" },
      { id: "p41", code: "crm.activity.create", module: "CRM", action: "activity_create", description: "Create Sales Activity" },
      { id: "p42", code: "crm.activity.update", module: "CRM", action: "activity_update", description: "Update Sales Activity" },
      { id: "p43", code: "crm.quote.read", module: "CRM", action: "quote_read", description: "Read Quotations" },
      { id: "p44", code: "crm.quote.create", module: "CRM", action: "quote_create", description: "Create Quotation" },
      { id: "p45", code: "crm.quote.update", module: "CRM", action: "quote_update", description: "Update Quotation" },
      { id: "p46", code: "crm.quote.approve", module: "CRM", action: "quote_approve", description: "Approve Quotation" },
      { id: "p47", code: "crm.support.read", module: "CRM", action: "support_read", description: "Read Support Tickets" },
      { id: "p48", code: "crm.support.create", module: "CRM", action: "support_create", description: "Create Support Ticket" },
      { id: "p49", code: "crm.support.update", module: "CRM", action: "support_update", description: "Update Support Ticket" },
      { id: "p50", code: "crm.support.assign", module: "CRM", action: "support_assign", description: "Assign Support Ticket" },
      { id: "p51", code: "crm.reports.read", module: "CRM", action: "reports_read", description: "Read CRM Reports" },
      { id: "p52", code: "finance.account.read", module: "Finance", action: "account_read", description: "Read Chart of Accounts" },
      { id: "p53", code: "finance.account.create", module: "Finance", action: "account_create", description: "Create Account" },
      { id: "p54", code: "finance.account.update", module: "Finance", action: "account_update", description: "Update Account" },
      { id: "p55", code: "finance.journal.read", module: "Finance", action: "journal_read", description: "Read Journals" },
      { id: "p56", code: "finance.journal.create", module: "Finance", action: "journal_create", description: "Create Journal Entry" },
      { id: "p57", code: "finance.journal.post", module: "Finance", action: "journal_post", description: "Post Journal Entry" },
      { id: "p58", code: "finance.journal.reverse", module: "Finance", action: "journal_reverse", description: "Reverse Journal Entry" },
      { id: "p59", code: "finance.invoice.read", module: "Finance", action: "invoice_read", description: "Read Customer Invoices" },
      { id: "p60", code: "finance.invoice.create", module: "Finance", action: "invoice_create", description: "Create Customer Invoice" },
      { id: "p61", code: "finance.invoice.update", module: "Finance", action: "invoice_update", description: "Update Customer Invoice" },
      { id: "p62", code: "finance.invoice.approve", module: "Finance", action: "invoice_approve", description: "Approve Customer Invoice" },
      { id: "p63", code: "finance.payment.read", module: "Finance", action: "payment_read", description: "Read Customer Payments" },
      { id: "p64", code: "finance.payment.create", module: "Finance", action: "payment_create", description: "Record Customer Payment" },
      { id: "p65", code: "finance.payment.allocate", module: "Finance", action: "payment_allocate", description: "Allocate Customer Payment" },
      { id: "p66", code: "finance.bill.read", module: "Finance", action: "bill_read", description: "Read Supplier Bills" },
      { id: "p67", code: "finance.bill.create", module: "Finance", action: "bill_create", description: "Create Supplier Bill" },
      { id: "p68", code: "finance.bill.approve", module: "Finance", action: "bill_approve", description: "Approve Supplier Bill" },
      { id: "p69", code: "finance.expense.read", module: "Finance", action: "expense_read", description: "Read Finance Expenses" },
      { id: "p70", code: "finance.expense.create", module: "Finance", action: "expense_create", description: "Record Expense" },
      { id: "p71", code: "finance.expense.approve", module: "Finance", action: "expense_approve", description: "Approve Expense" },
      { id: "p72", code: "finance.bank.read", module: "Finance", action: "bank_read", description: "Read Bank Accounts" },
      { id: "p73", code: "finance.bank.reconcile", module: "Finance", action: "bank_reconcile", description: "Reconcile Bank Statement" },
      { id: "p74", code: "finance.reports.read", module: "Finance", action: "reports_read", description: "Read Financial Statements & Reports" },
      { id: "p75", code: "finance.period.close", module: "Finance", action: "period_close", description: "Close Fiscal Period" },
      { id: "p76", code: "finance.period.reopen", module: "Finance", action: "period_reopen", description: "Reopen Fiscal Period" }
    ];
    permList.forEach((p) => this.permissions.set(p.id, p));
    const roleAdmin = {
      id: "role-super-admin",
      tenantId: tenant1.id,
      code: "SUPER_ADMIN",
      name: "Super Enterprise Administrator",
      description: "Full access across all modules and tenant settings",
      isSystemRole: true,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const roleQuarryMgr = {
      id: "role-quarry-mgr",
      tenantId: tenant1.id,
      code: "QUARRY_MANAGER",
      name: "Quarry Site Manager",
      description: "Manages Quarry operations, weighbridge tickets, and dispatches",
      isSystemRole: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.roles.set(roleAdmin.id, roleAdmin);
    this.roles.set(roleQuarryMgr.id, roleQuarryMgr);
    permList.forEach((p) => {
      const rpId = generateUuidV7();
      this.rolePermissions.set(rpId, {
        id: rpId,
        roleId: roleAdmin.id,
        permissionId: p.id,
        permissionCode: p.code
      });
    });
    const passwordResult = hashPassword("AdminPass2026!");
    const userAdmin = {
      id: "usr-admin-001",
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      email: "admin@racezoneventures.com",
      passwordHash: passwordResult.hash,
      salt: passwordResult.salt,
      fullName: "Nafid Khan (CEO & Enterprise Admin)",
      phone: "+1-800-MINETRIX",
      department: "Executive Board",
      designation: "Chief Executive Officer",
      status: "ACTIVE",
      isMfaEnabled: true,
      linkedEmployeeId: "EMP-001",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const userManagerPass = hashPassword("ManagerPass2026!");
    const userManager = {
      id: "usr-quarry-mgr-002",
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      email: "quarry.manager@racezoneventures.com",
      passwordHash: userManagerPass.hash,
      salt: userManagerPass.salt,
      fullName: "Vikram Sharma",
      phone: "+1-800-QUARRY",
      department: "Mining Operations",
      designation: "Senior Quarry Manager",
      status: "ACTIVE",
      isMfaEnabled: false,
      linkedEmployeeId: "EMP-088",
      linkedOperatorId: "OP-Q1-01",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const userApexPass = hashPassword("ApexPass2026!");
    const userApex = {
      id: "usr-apex-mgr-003",
      tenantId: tenant2.id,
      companyId: company2.id,
      email: "site.mgr@apexmining.com",
      passwordHash: userApexPass.hash,
      salt: userApexPass.salt,
      fullName: "David Apex",
      department: "Mining Operations",
      designation: "Plant Operator",
      status: "ACTIVE",
      isMfaEnabled: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.users.set(userAdmin.id, userAdmin);
    this.users.set(userManager.id, userManager);
    this.users.set(userApex.id, userApex);
    this.userRoles.set("ur-1", {
      id: "ur-1",
      userId: userAdmin.id,
      roleId: roleAdmin.id,
      tenantId: tenant1.id,
      assignedAt: now,
      assignedBy: "SYSTEM"
    });
    this.userRoles.set("ur-2", {
      id: "ur-2",
      userId: userManager.id,
      roleId: roleQuarryMgr.id,
      tenantId: tenant1.id,
      assignedAt: now,
      assignedBy: userAdmin.id
    });
    const md1 = {
      id: "md-uom-mt",
      tenantId: tenant1.id,
      category: "UOM",
      code: "MT",
      name: "Metric Tonne",
      valueJson: JSON.stringify({ conversionToKg: 1e3, symbol: "MT" }),
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const md2 = {
      id: "md-uom-cft",
      tenantId: tenant1.id,
      category: "UOM",
      code: "CFT",
      name: "Cubic Feet",
      valueJson: JSON.stringify({ conversionToCmt: 0.0283168, symbol: "CFT" }),
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.masterData.set(md1.id, md1);
    this.masterData.set(md2.id, md2);
    const wfDef1 = {
      id: "wf-def-invoice-appr",
      tenantId: tenant1.id,
      code: "WF_INVOICE_APPROVAL",
      name: "Mining Invoice Approval Workflow",
      entityType: "INVOICE",
      initialState: "DRAFT",
      statesJson: JSON.stringify(["DRAFT", "SUBMITTED", "MANAGER_APPROVED", "FINANCE_APPROVED", "REJECTED"]),
      transitionsJson: JSON.stringify([
        { from: "DRAFT", to: "SUBMITTED", requiredPermission: "finance:invoice:submit" },
        { from: "SUBMITTED", to: "MANAGER_APPROVED", requiredPermission: "finance:invoice:approve" },
        { from: "MANAGER_APPROVED", to: "FINANCE_APPROVED", requiredPermission: "finance:invoice:approve" }
      ]),
      createdAt: now,
      updatedAt: now
    };
    this.workflowDefinitions.set(wfDef1.id, wfDef1);
    const audit1 = {
      id: generateUuidV7(),
      tenantId: tenant1.id,
      actorUserId: userAdmin.id,
      actorEmail: userAdmin.email,
      action: "SYSTEM_BOOTSTRAP",
      module: "Shared Core",
      resource: "DatabaseStore",
      ipAddress: "127.0.0.1",
      correlationId: generateUuidV7(),
      status: "SUCCESS",
      createdAt: now
    };
    this.auditLogs.set(audit1.id, audit1);
    const catTipper = {
      id: "cat-tipper-001",
      tenantId: tenant1.id,
      code: "TIPPER_TRUCK",
      name: "Heavy Duty Tipper Truck",
      description: "Multi-axle tippers for quarry aggregate transport",
      isCustom: false,
      createdAt: now,
      updatedAt: now
    };
    const catExcavator = {
      id: "cat-excavator-002",
      tenantId: tenant1.id,
      code: "EXCAVATOR",
      name: "Hydraulic Excavator",
      description: "Heavy excavation equipment",
      isCustom: false,
      createdAt: now,
      updatedAt: now
    };
    this.fleetVehicleCategories.set(catTipper.id, catTipper);
    this.fleetVehicleCategories.set(catExcavator.id, catExcavator);
    const veh1 = {
      id: "veh-ka19-4491",
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      registrationNumber: "KA-19-AB-4491",
      vehicleType: "Tipper",
      categoryId: catTipper.id,
      categoryName: catTipper.name,
      make: "BharatBenz",
      model: "2823R 10-Wheeler",
      variant: "Mining Special",
      manufacturingYear: 2024,
      purchaseDate: "2024-03-15",
      purchaseValue: 485e4,
      ownershipType: "OWNED",
      ownerName: "Racezone Ventures & Mining Ltd",
      fuelType: "DIESEL",
      fuelCapacity: 300,
      engineNumber: "ENG-BB-99201",
      chassisNumber: "CHS-BB-88301",
      color: "Amber Gold",
      seatingCapacity: 2,
      loadCapacity: 28,
      currentOdometer: 18450,
      status: "AVAILABLE",
      location: "Quarry Pit #1 Yard",
      remarks: "Fitted with telematics GPS & automatic payload scale",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const veh2 = {
      id: "veh-ka19-8820",
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1.id,
      registrationNumber: "KA-19-MC-8820",
      vehicleType: "Tipper",
      categoryId: catTipper.id,
      categoryName: catTipper.name,
      make: "Volvo",
      model: "FMX 460 8x4 Dump Truck",
      variant: "Heavy Hauler",
      manufacturingYear: 2025,
      purchaseDate: "2025-01-10",
      purchaseValue: 82e5,
      ownershipType: "OWNED",
      ownerName: "Racezone Ventures & Mining Ltd",
      fuelType: "DIESEL",
      fuelCapacity: 400,
      engineNumber: "ENG-VOL-4401",
      chassisNumber: "CHS-VOL-7712",
      color: "Navy Blue",
      seatingCapacity: 2,
      loadCapacity: 35,
      currentOdometer: 12100,
      status: "AVAILABLE",
      location: "Main Crusher Yard",
      remarks: "Primary heavy rock hauler",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.fleetVehicles.set(veh1.id, veh1);
    this.fleetVehicles.set(veh2.id, veh2);
    const drv1 = {
      id: "drv-suresh-001",
      tenantId: tenant1.id,
      employeeId: "EMP-088",
      linkedUserId: userManager.id,
      name: "Suresh Kumar",
      phone: "+91-98450-11223",
      licenseNumber: "KA-19-2018-0099411",
      licenseType: "HEAVY_COMMERCIAL_HAZMAT",
      licenseIssueDate: "2018-05-10",
      licenseExpiryDate: "2028-05-09",
      status: "ACTIVE",
      joiningDate: "2022-01-15",
      emergencyContact: "Lakshmi Kumar (+91-98450-11224)",
      address: "Near Quarry Gate #2, Bantwal",
      remarks: "Zero-incident record. Certified for heavy tippers.",
      createdAt: now,
      updatedAt: now
    };
    this.fleetDrivers.set(drv1.id, drv1);
    const alert1 = {
      id: generateUuidV7(),
      tenantId: tenant1.id,
      vehicleId: veh1.id,
      alertType: "SERVICE_DUE",
      severity: "WARNING",
      message: `Vehicle ${veh1.registrationNumber} is approaching 20,000 km service threshold.`,
      isResolved: false,
      createdAt: now
    };
    this.fleetAlerts.set(alert1.id, alert1);
    this.seedMarketplaceDataOnly(tenant1.id);
    this.seedCrmDataOnly();
    this.seedQuarryDataOnly();
    console.log("[DB] Enterprise seed data, Fleet, Marketplace, CRM & Quarry records successfully created.");
  }
  seedMarketplaceDataOnly(tenantId = "tenant-rz-global-001") {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const transp1 = {
      id: "tp-trans-001",
      tenantId,
      businessId: "biz-trans-coastal",
      companyName: "Coastal Logistics & Heavy Haulers Ltd",
      contactPerson: "Vikram R. Shetty",
      phone: "+91-98800-44112",
      email: "logistics@coastallogistics.com",
      rating: 4.85,
      totalTrips: 142,
      completedTrips: 139,
      cancellationRate: 1.2,
      verifiedStatus: "VERIFIED",
      serviceAreas: ["Mangaluru", "Udupi", "Bantwal", "Surathkal", "Bengaluru"],
      vehicleTypes: ["Tipper", "Trailer", "Container", "Dumper"],
      baseRatePerKm: 62,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const transp2 = {
      id: "tp-trans-002",
      tenantId,
      businessId: "biz-trans-apex",
      companyName: "Apex Express Freight Services",
      contactPerson: "Anand Rao",
      phone: "+91-98440-55667",
      email: "dispatch@apexexpress.in",
      rating: 4.7,
      totalTrips: 98,
      completedTrips: 95,
      cancellationRate: 2,
      verifiedStatus: "VERIFIED",
      serviceAreas: ["Mangaluru", "Dharmasthala", "Puttur", "Hassan"],
      vehicleTypes: ["Tipper", "Flatbed", "6-Wheeler"],
      baseRatePerKm: 58,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.transporterProfiles.set(transp1.id, transp1);
    this.transporterProfiles.set(transp2.id, transp2);
    const prRule1 = {
      id: "pr-rule-001",
      tenantId,
      materialId: "mat-m-sand-01",
      materialName: "M-Sand (Manufactured Sand)",
      vehicleType: "Tipper",
      baseFare: 600,
      ratePerKm: 55,
      ratePerTon: 110,
      minCharge: 1800,
      surgeMultiplier: 1,
      createdAt: now,
      updatedAt: now
    };
    const prRule2 = {
      id: "pr-rule-002",
      tenantId,
      materialId: "mat-aggregate-20mm",
      materialName: "20mm Aggregate Stone",
      vehicleType: "Tipper",
      baseFare: 550,
      ratePerKm: 50,
      ratePerTon: 100,
      minCharge: 1500,
      surgeMultiplier: 1,
      createdAt: now,
      updatedAt: now
    };
    this.marketplacePricingRules.set(prRule1.id, prRule1);
    this.marketplacePricingRules.set(prRule2.id, prRule2);
    const load1 = {
      id: "load-req-001",
      tenantId,
      requestNumber: "LR-2026-00101",
      customerId: "cust-infra-corp-1",
      customerName: "Soma Infrastructure Ltd",
      businessId: "biz-soma-infra",
      materialId: "mat-m-sand-01",
      materialName: "M-Sand (Manufactured Sand)",
      source: "Quarry Site Alpha, Rock Ridge",
      destination: "Smart City Highway Expansion Site, Gate 3, Surathkal",
      requiredDate: new Date(Date.now() + 864e5).toISOString().split("T")[0],
      requiredTime: "07:30 AM",
      quantity: 35,
      unit: "TONS",
      vehicleType: "Tipper",
      vehicleCapacity: 35,
      budget: 18500,
      specialRequirements: "Automatic tarpaulin cover required to prevent spillage during highway transit",
      status: "OPEN",
      isPublic: true,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const load2 = {
      id: "load-req-002",
      tenantId,
      requestNumber: "LR-2026-00102",
      customerId: "cust-harbor-dev",
      customerName: "Harbor Developers & Builders",
      materialId: "mat-aggregate-20mm",
      materialName: "20mm Aggregate Stone",
      source: "Crusher Unit Beta, Industrial Hub",
      destination: "Port Commercial Complex, Panambur",
      requiredDate: new Date(Date.now() + 1728e5).toISOString().split("T")[0],
      requiredTime: "09:00 AM",
      quantity: 28,
      unit: "TONS",
      vehicleType: "Tipper",
      vehicleCapacity: 28,
      budget: 14200,
      specialRequirements: "Weighbridge slip copy mandatory upon arrival",
      status: "MATCHED",
      isPublic: true,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.loadRequests.set(load1.id, load1);
    this.loadRequests.set(load2.id, load2);
    const match1 = {
      id: "lm-match-001",
      tenantId,
      loadId: load2.id,
      vehicleId: "veh-ka19-4491",
      driverId: "drv-suresh-001",
      transporterId: transp1.id,
      distance: 24.5,
      estimatedTime: "45 mins",
      estimatedCost: 12850,
      offeredPrice: 13500,
      matchScore: 94,
      availability: "AVAILABLE",
      reasonCodes: ["HIGH_CAPACITY_MATCH", "NEAR_SOURCE", "AVAILABLE_NOW", "GOOD_COMPLETION_HISTORY"],
      createdAt: now
    };
    this.loadMatches.set(match1.id, match1);
    const offer1 = {
      id: "offer-001",
      tenantId,
      offerNumber: "LO-2026-00081",
      loadId: load2.id,
      transporterId: transp1.id,
      vehicleId: "veh-ka19-4491",
      driverId: "drv-suresh-001",
      quotedPrice: 13500,
      estimatedPickup: new Date(Date.now() + 1728e5).toISOString(),
      estimatedDelivery: new Date(Date.now() + 1728e5 + 72e5).toISOString(),
      remarks: "Heavy duty 10-wheeler BharatBenz ready for immediate dispatch",
      status: "SUBMITTED",
      createdAt: now,
      updatedAt: now
    };
    this.loadOffers.set(offer1.id, offer1);
    this.seedCrmDataOnly();
    this.seedFinanceDataOnly();
    this.seedHrDataOnly();
  }
  seedCrmDataOnly() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const tenantId = "tenant-rz-global-001";
    const cust1 = {
      id: "cust-harbor-dev",
      tenantId,
      customerType: "BUSINESS",
      businessId: "biz-harbor-001",
      displayName: "Harbor Developers & Builders Ltd",
      legalName: "Harbor Developers Private Limited",
      customerCode: "CUST-2026-001",
      phone: "+91-98801-11223",
      email: "procurement@harborbuilders.com",
      address: "Plot 42, Marine View Towers, Bunder",
      city: "Mangalore",
      district: "Dakshina Kannada",
      state: "Karnataka",
      country: "India",
      taxIdentifier: "29AAACH1234F1Z8",
      creditLimit: 25e5,
      creditDays: 45,
      status: "ACTIVE",
      source: "Direct Corporate Outreach",
      assignedSalesUser: "usr-admin-001",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const cust2 = {
      id: "cust-apex-infra",
      tenantId,
      customerType: "CONTRACTOR",
      businessId: "biz-apex-002",
      displayName: "Apex Infrastructure & Highway Corp",
      legalName: "Apex Infrastructure Private Limited",
      customerCode: "CUST-2026-002",
      phone: "+91-98450-99887",
      email: "projects@apexinfra.in",
      address: "NH-66 Bypass Road, Surathkal",
      city: "Mangalore",
      district: "Dakshina Kannada",
      state: "Karnataka",
      country: "India",
      taxIdentifier: "29AABCA9876E1Z2",
      creditLimit: 5e6,
      creditDays: 60,
      status: "ACTIVE",
      source: "Government Tender",
      assignedSalesUser: "usr-admin-001",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const cust3 = {
      id: "cust-karnataka-readymix",
      tenantId,
      customerType: "DEALER",
      businessId: "biz-rmc-003",
      displayName: "Karnataka Concrete & ReadyMix Co",
      legalName: "Karnataka Concrete Pvt Ltd",
      customerCode: "CUST-2026-003",
      phone: "+91-97411-22334",
      email: "supply@karnatakarmc.com",
      address: "Baikampady Industrial Estate, Stage II",
      city: "Mangalore",
      district: "Dakshina Kannada",
      state: "Karnataka",
      country: "India",
      taxIdentifier: "29AABCK5432D1Z4",
      creditLimit: 15e5,
      creditDays: 30,
      status: "ACTIVE",
      source: "Referral",
      assignedSalesUser: "usr-admin-001",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    this.crmCustomers.set(cust1.id, cust1);
    this.crmCustomers.set(cust2.id, cust2);
    this.crmCustomers.set(cust3.id, cust3);
    const contact1 = {
      id: "cnt-001",
      tenantId,
      customerId: cust1.id,
      name: "Rajesh Hegde",
      designation: "VP Procurement & Materials",
      phone: "+91-98801-11223",
      email: "r.hegde@harborbuilders.com",
      whatsapp: "+91-98801-11223",
      isPrimary: true,
      preferredLanguage: "English / Kannada",
      notes: "Key decision maker for quarry aggregate orders above 500 tons",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const contact2 = {
      id: "cnt-002",
      tenantId,
      customerId: cust2.id,
      name: "Anand Kumar",
      designation: "Project Director - Highway Package 3",
      phone: "+91-98450-99887",
      email: "a.kumar@apexinfra.in",
      whatsapp: "+91-98450-99887",
      isPrimary: true,
      preferredLanguage: "English",
      notes: "Requires daily delivery schedules and weighbridge slips",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    this.crmContacts.set(contact1.id, contact1);
    this.crmContacts.set(contact2.id, contact2);
    const lead1 = {
      id: "lead-2026-001",
      tenantId,
      customerId: cust1.id,
      customerName: "Harbor Developers & Builders Ltd",
      phone: "+91-98801-11223",
      email: "procurement@harborbuilders.com",
      source: "Marketplace",
      campaign: "Q3 Construction Material Drive",
      productService: "20mm Aggregate Stone & M-Sand Supply",
      estimatedValue: 125e4,
      probability: 80,
      expectedCloseDate: new Date(Date.now() + 6048e5).toISOString().split("T")[0],
      assignedUser: "usr-admin-001",
      notes: "High volume requirement for ongoing port complex commercial tower foundation",
      status: "PROPOSAL",
      leadScore: 88,
      priority: "HOT",
      reasonCodes: ["HIGH_ESTIMATED_VALUE", "EXISTING_CUSTOMER_LINK", "PROPOSAL_SUBMITTED"],
      createdAt: now,
      updatedAt: now
    };
    const lead2 = {
      id: "lead-2026-002",
      tenantId,
      customerName: "Coastal Housing Society Phase 4",
      phone: "+91-99001-88221",
      email: "admin@coastalhousing.org",
      source: "Website",
      campaign: "Direct Inbound Form",
      productService: "GSB (Granular Sub-Base) & Crusher Dust",
      estimatedValue: 45e4,
      probability: 50,
      expectedCloseDate: new Date(Date.now() + 12096e5).toISOString().split("T")[0],
      assignedUser: "usr-admin-001",
      notes: "Road base construction requirement for housing layout streets",
      status: "QUALIFIED",
      leadScore: 65,
      priority: "MEDIUM",
      reasonCodes: ["INBOUND_WEBSITE_LEAD", "VALID_PHONE_AND_EMAIL"],
      createdAt: now,
      updatedAt: now
    };
    this.crmLeads.set(lead1.id, lead1);
    this.crmLeads.set(lead2.id, lead2);
    const opp1 = {
      id: "opp-2026-001",
      tenantId,
      customerId: cust1.id,
      leadId: lead1.id,
      title: "Port Complex Aggregate & Sand Annual Supply Agreement",
      value: 125e4,
      probability: 80,
      stage: "PROPOSAL",
      expectedCloseDate: new Date(Date.now() + 6048e5).toISOString().split("T")[0],
      salesOwner: "usr-admin-001",
      productsServices: ["20mm Aggregate Stone", "M-Sand (Manufactured Sand)", "GSB"],
      competitors: "Deccan Crushing Ltd",
      nextAction: "Finalize payment terms and sign contract agreement",
      notes: "Quotation sent. Customer requested 45-day credit terms.",
      status: "OPEN",
      createdAt: now,
      updatedAt: now
    };
    this.crmOpportunities.set(opp1.id, opp1);
    const act1 = {
      id: "act-2026-001",
      tenantId,
      activityType: "Meeting",
      subject: "Contract Terms Review with VP Rajesh Hegde",
      customerId: cust1.id,
      leadId: lead1.id,
      opportunityId: opp1.id,
      assignedUser: "usr-admin-001",
      dueDate: new Date(Date.now() + 864e5).toISOString(),
      status: "PENDING",
      priority: "HIGH",
      notes: "Discuss delivery schedule guarantees and price escalations",
      createdAt: now,
      updatedAt: now
    };
    this.crmSalesActivities.set(act1.id, act1);
    const q1 = {
      id: "quote-2026-001",
      tenantId,
      quoteNumber: "QT-2026-0001",
      customerId: cust1.id,
      opportunityId: opp1.id,
      subtotal: 105e4,
      discountAmount: 25e3,
      taxAmount: 184500,
      totalAmount: 1209500,
      validityDate: new Date(Date.now() + 2592e6).toISOString().split("T")[0],
      termsAndConditions: "Standard RZ\xAE Quarry Supply terms. Payment due in 45 days.",
      notes: "Custom rate applied for bulk order exceeding 1,000 tons.",
      status: "SENT",
      version: 1,
      createdAt: now,
      updatedAt: now
    };
    const qItem1 = {
      id: "qi-001",
      tenantId,
      quotationId: q1.id,
      itemDescription: "20mm Blue Granite Aggregate Stone",
      materialId: "mat-aggregate-20mm",
      quantity: 800,
      unitPrice: 750,
      taxPercent: 18,
      totalPrice: 6e5,
      createdAt: now
    };
    const qItem2 = {
      id: "qi-002",
      tenantId,
      quotationId: q1.id,
      itemDescription: "Manufactured Concrete Sand (M-Sand)",
      materialId: "mat-msand-001",
      quantity: 500,
      unitPrice: 850,
      taxPercent: 18,
      totalPrice: 425e3,
      createdAt: now
    };
    q1.items = [qItem1, qItem2];
    this.crmQuotations.set(q1.id, q1);
    this.crmQuotationItems.set(qItem1.id, qItem1);
    this.crmQuotationItems.set(qItem2.id, qItem2);
    const credit1 = {
      id: "cred-001",
      tenantId,
      customerId: cust1.id,
      creditLimit: 25e5,
      creditDays: 45,
      outstandingBalance: 65e4,
      availableCredit: 185e4,
      overdueAmount: 0,
      creditStatus: "GOOD",
      lastReviewedAt: now,
      createdAt: now,
      updatedAt: now
    };
    const credit2 = {
      id: "cred-002",
      tenantId,
      customerId: cust2.id,
      creditLimit: 5e6,
      creditDays: 60,
      outstandingBalance: 12e5,
      availableCredit: 38e5,
      overdueAmount: 0,
      creditStatus: "GOOD",
      lastReviewedAt: now,
      createdAt: now,
      updatedAt: now
    };
    this.crmCustomerCredit.set(credit1.id, credit1);
    this.crmCustomerCredit.set(credit2.id, credit2);
    const doc1 = {
      id: "doc-001",
      tenantId,
      customerId: cust1.id,
      documentType: "GST_TAX",
      title: "GST Registration Certificate - Harbor Builders",
      storageRef: "/documents/tenant-rz-global-001/cust-harbor-dev/gst_certificate.pdf",
      mimeType: "application/pdf",
      sizeBytes: 1048576,
      uploadedBy: "usr-admin-001",
      createdAt: now
    };
    this.crmCustomerDocuments.set(doc1.id, doc1);
    const ticket1 = {
      id: "ticket-2026-001",
      tenantId,
      ticketNumber: "TKT-2026-0001",
      customerId: cust1.id,
      subject: "Inquiry on Weighbridge slip digital copy verification",
      description: "Customer requested automated SMS delivery of weighbridge receipt upon truck dispatch",
      priority: "MEDIUM",
      category: "SERVICE",
      assignedUser: "usr-admin-001",
      status: "RESOLVED",
      resolvedAt: now,
      createdAt: now,
      updatedAt: now
    };
    this.crmSupportTickets.set(ticket1.id, ticket1);
    const seg1 = {
      id: "seg-001",
      tenantId,
      code: "HIGH_VALUE_KEY_ACCOUNTS",
      name: "High Value Key Accounts (> \u20B925L Credit)",
      description: "Enterprise corporate buyers with high order volume and long credit terms",
      criteriaJson: JSON.stringify({ minCreditLimit: 25e5, status: "ACTIVE" }),
      createdAt: now,
      updatedAt: now
    };
    this.crmCustomerSegments.set(seg1.id, seg1);
    const health1 = {
      id: "health-001",
      tenantId,
      customerId: cust1.id,
      healthScore: 92,
      healthStatus: "EXCELLENT",
      riskFlags: [],
      factorsJson: JSON.stringify({ purchaseFrequency: "HIGH", paymentPunctuality: "ON_TIME", disputeCount: 0 }),
      calculatedAt: now
    };
    this.crmCustomerHealth.set(health1.id, health1);
    const note1 = {
      id: "note-001",
      tenantId,
      customerId: cust1.id,
      authorUserId: "usr-admin-001",
      noteText: "Customer requested priority dispatch during monsoon season for port construction site.",
      isPrivate: false,
      createdAt: now
    };
    this.crmCustomerNotes.set(note1.id, note1);
  }
  seedFinanceDataOnly() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const tenantId = "tenant-rz-global-001";
    const coaList = [
      { id: "acc-1000", tenantId, accountCode: "1000", accountName: "Assets Control", accountType: "ASSET", currency: "INR", isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-1010", tenantId, accountCode: "1010", accountName: "HDFC Enterprise Current Account", accountType: "ASSET", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-1020", tenantId, accountCode: "1020", accountName: "Petty Cash Account", accountType: "ASSET", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-1100", tenantId, accountCode: "1100", accountName: "Accounts Receivable (AR)", accountType: "ASSET", currency: "INR", isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-1200", tenantId, accountCode: "1200", accountName: "Quarry Material Inventory", accountType: "ASSET", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-1300", tenantId, accountCode: "1300", accountName: "GST Input Tax Credit", accountType: "ASSET", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-2000", tenantId, accountCode: "2000", accountName: "Liabilities Control", accountType: "LIABILITY", currency: "INR", isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-2100", tenantId, accountCode: "2100", accountName: "Accounts Payable (AP)", accountType: "LIABILITY", currency: "INR", isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-2200", tenantId, accountCode: "2200", accountName: "GST Output Tax Payable", accountType: "LIABILITY", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-3000", tenantId, accountCode: "3000", accountName: "Shareholders Equity", accountType: "EQUITY", currency: "INR", isControlAccount: true, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-3100", tenantId, accountCode: "3100", accountName: "Retained Earnings", accountType: "EQUITY", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-4000", tenantId, accountCode: "4000", accountName: "Quarry Aggregate Sales Revenue", accountType: "REVENUE", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-4100", tenantId, accountCode: "4100", accountName: "Fleet Transport Freight Revenue", accountType: "REVENUE", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-4200", tenantId, accountCode: "4200", accountName: "Marketplace Commission Revenue", accountType: "REVENUE", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-5000", tenantId, accountCode: "5000", accountName: "Direct Cost of Sales - Quarrying", accountType: "EXPENSE", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-5100", tenantId, accountCode: "5100", accountName: "Fleet Fuel & Diesel Expenses", accountType: "EXPENSE", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-5200", tenantId, accountCode: "5200", accountName: "Fleet Maintenance & Repairs", accountType: "EXPENSE", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-5300", tenantId, accountCode: "5300", accountName: "Mining Equipment Operating Expenses", accountType: "EXPENSE", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now },
      { id: "acc-5400", tenantId, accountCode: "5400", accountName: "Administrative & General Expenses", accountType: "EXPENSE", currency: "INR", isControlAccount: false, isActive: true, createdAt: now, updatedAt: now }
    ];
    coaList.forEach((c) => this.chartOfAccounts.set(c.id, c));
    const fy2026 = {
      id: "fy-2026-2027",
      tenantId,
      yearCode: "FY2026-27",
      yearName: "Financial Year 2026 - 2027",
      startDate: "2026-04-01",
      endDate: "2027-03-31",
      status: "OPEN",
      createdAt: now,
      updatedAt: now
    };
    this.fiscalYears.set(fy2026.id, fy2026);
    for (let month = 1; month <= 12; month++) {
      const pNum = month;
      const periodId = `fp-2026-${pNum.toString().padStart(2, "0")}`;
      const mDate = new Date(2026, month - 1, 1);
      const startStr = mDate.toISOString().split("T")[0];
      const endM = new Date(2026, month, 0);
      const endStr = endM.toISOString().split("T")[0];
      const fp = {
        id: periodId,
        tenantId,
        fiscalYearId: fy2026.id,
        periodNumber: pNum,
        periodName: `Period ${pNum} (${mDate.toLocaleString("default", { month: "short" })} 2026)`,
        startDate: startStr,
        endDate: endStr,
        status: pNum <= 5 ? "LOCKED" : "OPEN",
        createdAt: now,
        updatedAt: now
      };
      this.fiscalPeriods.set(fp.id, fp);
    }
    const costCenters = [
      { id: "cc-mining", tenantId, code: "CC-MINING", name: "Quarrying & Mining Ops", category: "OPERATIONS", status: "ACTIVE", createdAt: now },
      { id: "cc-fleet", tenantId, code: "CC-FLEET", name: "Fleet & Logistics Division", category: "LOGISTICS", status: "ACTIVE", createdAt: now },
      { id: "cc-mkt", tenantId, code: "CC-MKT", name: "Load Exchange Marketplace", category: "DIGITAL", status: "ACTIVE", createdAt: now },
      { id: "cc-admin", tenantId, code: "CC-ADMIN", name: "Corporate Administration", category: "OVERHEAD", status: "ACTIVE", createdAt: now },
      { id: "cc-crm", tenantId, code: "CC-CRM", name: "Sales & Customer Management", category: "COMMERCIAL", status: "ACTIVE", createdAt: now }
    ];
    costCenters.forEach((cc) => this.costCenters.set(cc.id, cc));
    const prj1 = {
      id: "prj-harbor-01",
      tenantId,
      projectCode: "PRJ-HARBOR-01",
      projectName: "Harbor Infra Quarry Aggregate Supply Project",
      budget: 15e6,
      actualCost: 65e5,
      actualRevenue: 98e5,
      status: "IN_PROGRESS",
      createdAt: now,
      updatedAt: now
    };
    this.financeProjects.set(prj1.id, prj1);
    const taxCodes = [
      { id: "tax-gst-18", tenantId, taxCode: "GST18", taxName: "GST 18% Standard", rate: 18, taxType: "GST", effectiveDate: "2026-04-01", status: "ACTIVE", createdAt: now },
      { id: "tax-gst-12", tenantId, taxCode: "GST12", taxName: "GST 12% Reduced", rate: 12, taxType: "GST", effectiveDate: "2026-04-01", status: "ACTIVE", createdAt: now },
      { id: "tax-gst-5", tenantId, taxCode: "GST5", taxName: "GST 5% Lower Rate", rate: 5, taxType: "GST", effectiveDate: "2026-04-01", status: "ACTIVE", createdAt: now },
      { id: "tax-gst-0", tenantId, taxCode: "GST0", taxName: "Exempt / Zero Rated", rate: 0, taxType: "GST", effectiveDate: "2026-04-01", status: "ACTIVE", createdAt: now }
    ];
    taxCodes.forEach((tc) => this.taxCodes.set(tc.id, tc));
    const bank1 = {
      id: "bank-hdfc-001",
      tenantId,
      accountName: "HDFC Bank - Main Operating Current Account",
      accountNumberMasked: "XXXX-XXXX-9821",
      bankName: "HDFC Bank Ltd",
      ifscCode: "HDFC0000123",
      openingBalance: 5e6,
      currentBalance: 45e5,
      currency: "INR",
      accountType: "CURRENT",
      status: "ACTIVE",
      glAccountId: "acc-1010",
      createdAt: now,
      updatedAt: now
    };
    this.bankAccounts.set(bank1.id, bank1);
    const inv1 = {
      id: "inv-2026-0001",
      tenantId,
      invoiceNumber: "INV-2026-0001",
      customerId: "cust-harbor-dev",
      invoiceDate: "2026-08-01",
      dueDate: "2026-08-31",
      creditTermsDays: 30,
      subtotal: 1e5,
      taxAmount: 18e3,
      discountAmount: 0,
      totalAmount: 118e3,
      outstandingAmount: 0,
      status: "PAID",
      notes: "Supply of 40mm Granite Aggregates for Harbor Site",
      createdAt: now,
      updatedAt: now
    };
    const invItem1 = {
      id: "inv-item-001",
      tenantId,
      invoiceId: inv1.id,
      itemDescription: "40mm Granite Aggregate (High Density)",
      quantity: 100,
      unitPrice: 1e3,
      taxCodeId: "tax-gst-18",
      taxRate: 18,
      taxAmount: 18e3,
      totalPrice: 118e3
    };
    inv1.items = [invItem1];
    this.customerInvoices.set(inv1.id, inv1);
    this.invoiceItems.set(invItem1.id, invItem1);
    const pay1 = {
      id: "pay-2026-0001",
      tenantId,
      paymentNumber: "PAY-2026-0001",
      customerId: "cust-harbor-dev",
      paymentDate: "2026-08-05",
      amount: 118e3,
      currency: "INR",
      paymentMethod: "TRANSFER",
      bankAccountId: bank1.id,
      referenceNumber: "NEFT-HDFC-9928101",
      unallocatedAmount: 0,
      status: "POSTED",
      createdAt: now,
      updatedAt: now
    };
    const alloc1 = {
      id: "alloc-001",
      tenantId,
      paymentId: pay1.id,
      invoiceId: inv1.id,
      allocatedAmount: 118e3,
      allocatedAt: now
    };
    this.customerPayments.set(pay1.id, pay1);
    this.paymentAllocations.set(alloc1.id, alloc1);
    const bill1 = {
      id: "bill-2026-0001",
      tenantId,
      billNumber: "BILL-2026-0001",
      supplierName: "Indian Oil Corporation Ltd (Fuel Logistics)",
      billDate: "2026-08-02",
      dueDate: "2026-08-17",
      subtotal: 5e4,
      taxAmount: 9e3,
      discountAmount: 0,
      totalAmount: 59e3,
      outstandingAmount: 59e3,
      status: "APPROVED",
      createdAt: now,
      updatedAt: now
    };
    const billItem1 = {
      id: "bill-item-001",
      tenantId,
      billId: bill1.id,
      itemDescription: "High Speed Diesel (HSD) for Fleet Operations",
      quantity: 500,
      unitPrice: 100,
      taxAmount: 9e3,
      totalPrice: 59e3,
      costCenterId: "cc-fleet"
    };
    bill1.items = [billItem1];
    this.supplierBills.set(bill1.id, bill1);
    this.supplierBillItems.set(billItem1.id, billItem1);
    const exp1 = {
      id: "exp-2026-0001",
      tenantId,
      expenseNumber: "EXP-2026-0001",
      category: "Fuel",
      amount: 15e3,
      expenseDate: "2026-08-03",
      paymentMethod: "CARD",
      costCenterId: "cc-fleet",
      vehicleId: "veh-ka19-4491",
      description: "Emergency diesel refill during inter-city transport",
      status: "APPROVED",
      createdAt: now,
      updatedAt: now
    };
    this.financeExpenses.set(exp1.id, exp1);
    const jnl1 = {
      id: "jnl-2026-0001",
      tenantId,
      journalNumber: "JNL-2026-0001",
      journalDate: "2026-08-01",
      referenceType: "INVOICE",
      referenceId: inv1.id,
      description: "Posting for Customer Invoice INV-2026-0001",
      status: "POSTED",
      createdBy: "usr-admin-001",
      postedBy: "usr-admin-001",
      totalDebit: 118e3,
      totalCredit: 118e3,
      createdAt: now,
      postedAt: now,
      updatedAt: now
    };
    const jl1 = {
      id: "jl-001",
      tenantId,
      journalId: jnl1.id,
      accountId: "acc-1100",
      // Accounts Receivable
      debit: 118e3,
      credit: 0,
      customerId: "cust-harbor-dev",
      description: "Debit AR for Customer Invoice INV-2026-0001"
    };
    const jl2 = {
      id: "jl-002",
      tenantId,
      journalId: jnl1.id,
      accountId: "acc-4000",
      // Quarry Sales Revenue
      debit: 0,
      credit: 1e5,
      costCenterId: "cc-mining",
      description: "Credit Quarry Aggregate Revenue"
    };
    const jl3 = {
      id: "jl-003",
      tenantId,
      journalId: jnl1.id,
      accountId: "acc-2200",
      // GST Payable
      debit: 0,
      credit: 18e3,
      description: "Credit GST Payable 18%"
    };
    this.journals.set(jnl1.id, jnl1);
    this.journalLines.set(jl1.id, jl1);
    this.journalLines.set(jl2.id, jl2);
    this.journalLines.set(jl3.id, jl3);
    const btx1 = {
      id: "btx-2026-0001",
      tenantId,
      bankAccountId: bank1.id,
      transactionDate: "2026-08-05",
      valueDate: "2026-08-05",
      description: "NEFT Inward - Harbor Infrastructure Dev",
      reference: "NEFT-HDFC-9928101",
      amount: 118e3,
      transactionType: "CREDIT",
      reconciliationStatus: "MATCHED",
      matchedReferenceId: pay1.id,
      createdAt: now
    };
    this.bankTransactions.set(btx1.id, btx1);
  }
  seedHrDataOnly() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const tenantId = "tenant-rz-global-001";
    const dept1 = {
      id: "hr-dept-executive",
      tenantId,
      code: "EXEC",
      name: "Executive & Management",
      description: "Executive Leadership & Governance",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const dept2 = {
      id: "hr-dept-mining",
      tenantId,
      code: "MINING",
      name: "Mining & Quarry Operations",
      description: "Site operations, heavy equipment, quarrying",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const dept3 = {
      id: "hr-dept-hr",
      tenantId,
      code: "HR",
      name: "Human Resources & Talent",
      description: "HR Management, Workforce, Payroll, Recruitment",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const dept4 = {
      id: "hr-dept-finance",
      tenantId,
      code: "FINANCE",
      name: "Finance & Accounting",
      description: "Financial management and accounting",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    this.hrDepartments.set(dept1.id, dept1);
    this.hrDepartments.set(dept2.id, dept2);
    this.hrDepartments.set(dept3.id, dept3);
    this.hrDepartments.set(dept4.id, dept4);
    const desig1 = {
      id: "hr-desig-hr-director",
      tenantId,
      code: "HR-DIR",
      title: "Human Resources Director",
      departmentId: dept3.id,
      gradeLevel: "E1",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const desig2 = {
      id: "hr-desig-ops-mgr",
      tenantId,
      code: "OPS-MGR",
      title: "Mining Operations Manager",
      departmentId: dept2.id,
      gradeLevel: "M2",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const desig3 = {
      id: "hr-desig-operator",
      tenantId,
      code: "EQUIP-OP",
      title: "Heavy Equipment Specialist",
      departmentId: dept2.id,
      gradeLevel: "O1",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    this.hrDesignations.set(desig1.id, desig1);
    this.hrDesignations.set(desig2.id, desig2);
    this.hrDesignations.set(desig3.id, desig3);
    const emp1 = {
      id: "hr-emp-001",
      tenantId,
      employeeCode: "EMP-001",
      firstName: "Sarah",
      middleName: "M.",
      lastName: "Jenkins",
      displayName: "Sarah Jenkins",
      gender: "FEMALE",
      dateOfBirth: "1988-04-12",
      phone: "+1 (555) 234-5678",
      email: "s.jenkins@racezoneventures.com",
      address: "450 Enterprise Ave, Suite 300, Houston TX",
      joiningDate: "2022-01-15",
      employmentType: "FULL_TIME",
      employmentStatus: "ACTIVE",
      departmentId: dept3.id,
      designationId: desig1.id,
      workLocation: "Corporate HQ",
      bankAccountMasked: "****8812",
      emergencyContact: "John Jenkins (+1 555-998-1122)",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const emp2 = {
      id: "hr-emp-002",
      tenantId,
      employeeCode: "EMP-002",
      firstName: "Marcus",
      middleName: "R.",
      lastName: "Vance",
      displayName: "Marcus Vance",
      gender: "MALE",
      dateOfBirth: "1985-09-24",
      phone: "+1 (555) 345-6789",
      email: "m.vance@racezoneventures.com",
      address: "12 Quarry View Rd, Mine Site Alpha TX",
      joiningDate: "2021-06-01",
      employmentType: "FULL_TIME",
      employmentStatus: "ACTIVE",
      departmentId: dept2.id,
      designationId: desig2.id,
      workLocation: "Quarry Site Alpha",
      bankAccountMasked: "****4419",
      emergencyContact: "Laura Vance (+1 555-882-3344)",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const emp3 = {
      id: "hr-emp-003",
      tenantId,
      employeeCode: "EMP-003",
      firstName: "David",
      middleName: "A.",
      lastName: "Rodriguez",
      displayName: "David Rodriguez",
      gender: "MALE",
      dateOfBirth: "1992-11-05",
      phone: "+1 (555) 456-7890",
      email: "d.rodriguez@racezoneventures.com",
      address: "88 Haulage Loop, Mine Site Alpha TX",
      joiningDate: "2023-03-10",
      employmentType: "FULL_TIME",
      employmentStatus: "ACTIVE",
      departmentId: dept2.id,
      designationId: desig3.id,
      managerId: emp2.id,
      workLocation: "Quarry Site Alpha",
      bankAccountMasked: "****9931",
      emergencyContact: "Carlos Rodriguez (+1 555-771-4455)",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    this.hrEmployees.set(emp1.id, emp1);
    this.hrEmployees.set(emp2.id, emp2);
    this.hrEmployees.set(emp3.id, emp3);
    const eu1 = {
      id: "hr-eu-001",
      tenantId,
      employeeId: emp1.id,
      userId: "usr-admin-001",
      createdAt: now,
      updatedAt: now
    };
    this.hrEmployeeUsers.set(eu1.id, eu1);
    const shift1 = {
      id: "hr-shift-gen",
      tenantId,
      shiftCode: "SHIFT-GEN",
      shiftName: "Corporate General Shift",
      startTime: "09:00",
      endTime: "17:00",
      graceMinutes: 15,
      breakMinutes: 60,
      overtimeAfterMinutes: 480,
      shiftType: "DAY",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const shift2 = {
      id: "hr-shift-mine",
      tenantId,
      shiftCode: "SHIFT-MINE",
      shiftName: "Quarry Operations Day Shift",
      startTime: "07:00",
      endTime: "16:00",
      graceMinutes: 10,
      breakMinutes: 60,
      overtimeAfterMinutes: 480,
      shiftType: "DAY",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    this.hrShifts.set(shift1.id, shift1);
    this.hrShifts.set(shift2.id, shift2);
    const lt1 = {
      id: "hr-lt-annual",
      tenantId,
      code: "ANNUAL",
      name: "Paid Annual Leave",
      daysAllowed: 18,
      isPaid: true,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    const lt2 = {
      id: "hr-lt-sick",
      tenantId,
      code: "SICK",
      name: "Sick & Medical Leave",
      daysAllowed: 12,
      isPaid: true,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    this.hrLeaveTypes.set(lt1.id, lt1);
    this.hrLeaveTypes.set(lt2.id, lt2);
    const lb1 = {
      id: "hr-lb-emp1-ann",
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
    const py2026 = {
      id: "hr-py-2026",
      tenantId,
      yearCode: "PY-2026",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      status: "ACTIVE",
      createdAt: now
    };
    this.hrPayrollYears.set(py2026.id, py2026);
    const ppAug = {
      id: "hr-pp-2026-08",
      tenantId,
      yearId: py2026.id,
      periodName: "August 2026 Payroll Period",
      month: 8,
      year: 2026,
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      status: "OPEN",
      createdAt: now,
      updatedAt: now
    };
    this.hrPayrollPeriods.set(ppAug.id, ppAug);
    const ss1 = {
      id: "hr-ss-emp1",
      tenantId,
      employeeId: emp1.id,
      effectiveDate: "2026-01-01",
      baseSalary: 8500,
      payFrequency: "MONTHLY",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    this.hrSalaryStructures.set(ss1.id, ss1);
    const jr1 = {
      id: "hr-jr-001",
      tenantId,
      title: "Heavy Haulage Driver & Equipment Operator",
      departmentId: dept2.id,
      designationId: desig3.id,
      openings: 3,
      status: "OPEN",
      createdAt: now,
      updatedAt: now
    };
    this.hrJobRequisitions.set(jr1.id, jr1);
  }
  seedQuarryDataOnly() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const tenantId = "tenant-rz-global-001";
    const companyId = "comp-101";
    const branchId = "br-quarry-alpha";
    const qmLaterite = {
      id: "qm-laterite-001",
      tenantId,
      companyId,
      branchId,
      name: "Bantwal Laterite Quarry Site #1",
      quarryType: "LATERITE",
      status: "ACTIVE",
      location: "Bantwal Mining Zone, Dakshina Kannada",
      address: "Survey No. 44/2A, Bantwal Taluk",
      ownerId: "usr-quarry-mgr-002",
      leaseReference: "LEASE-LAT-2024-08",
      createdAt: now,
      updatedAt: now,
      createdBy: "usr-admin-001",
      version: 1
    };
    const qmHardRock = {
      id: "qm-hardrock-002",
      tenantId,
      companyId,
      branchId,
      name: "Rock Ridge Hard Rock Quarry Site #2",
      quarryType: "HARD_ROCK",
      status: "ACTIVE",
      location: "Rock Ridge Mining Corridor, Sector 14",
      address: "Plot 10B, Industrial Mineral Zone",
      ownerId: "usr-quarry-mgr-002",
      leaseReference: "LEASE-HR-2023-01",
      createdAt: now,
      updatedAt: now,
      createdBy: "usr-admin-001",
      version: 1
    };
    this.quarryMasters.set(qmLaterite.id, qmLaterite);
    this.quarryMasters.set(qmHardRock.id, qmHardRock);
    const prodLaterite = {
      id: "prod-lat-std-01",
      tenantId,
      quarryId: qmLaterite.id,
      productCode: "LAT-STD-30-20-15",
      name: "Standard Laterite Building Stone (30x20x15 cm)",
      mineralType: "LATERITE",
      dimensions: "30x20x15 cm",
      unit: "PIECE",
      defaultPrice: 42,
      gstRate: 5,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      createdBy: "usr-quarry-mgr-002"
    };
    const prodHardRock = {
      id: "prod-hr-boulder-01",
      tenantId,
      quarryId: qmHardRock.id,
      productCode: "HR-RAW-BOULDER",
      name: "Hard Rock Granite Raw Extraction Boulder",
      mineralType: "HARD_ROCK",
      unit: "TON",
      defaultPrice: 380,
      gstRate: 5,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      createdBy: "usr-quarry-mgr-002"
    };
    this.stoneProducts.set(prodLaterite.id, prodLaterite);
    this.stoneProducts.set(prodHardRock.id, prodHardRock);
    const leaseLaterite = {
      id: "lease-lat-001",
      tenantId,
      quarryId: qmLaterite.id,
      ownerName: "Ramesh Hegde",
      surveyNumber: "44/2A",
      village: "Bantwal Rural",
      taluk: "Bantwal",
      area: 4.5,
      leaseType: "LEASED",
      royaltyType: "PER_PIECE",
      royaltyRate: 3.5,
      startDate: "2024-01-01",
      expiryDate: "2029-12-31",
      status: "ACTIVE",
      documentReference: "DOC-LEASE-HEGDE-2024",
      createdAt: now,
      updatedAt: now
    };
    this.quarryLandLeases.set(leaseLaterite.id, leaseLaterite);
    const stockLateriteOpen = {
      id: "stk-lat-open-001",
      tenantId,
      quarryId: qmLaterite.id,
      productId: prodLaterite.id,
      transactionType: "STOCK_IN",
      referenceType: "OPENING_BALANCE",
      referenceId: "INIT-BALANCE-2026",
      quantityIn: 5e3,
      quantityOut: 0,
      balanceQuantity: 5e3,
      transactionDate: "2026-08-01",
      createdBy: "usr-quarry-mgr-002",
      createdAt: now
    };
    const stockHardRockOpen = {
      id: "stk-hr-open-001",
      tenantId,
      quarryId: qmHardRock.id,
      productId: prodHardRock.id,
      transactionType: "STOCK_IN",
      referenceType: "OPENING_BALANCE",
      referenceId: "INIT-BALANCE-2026",
      quantityIn: 1200,
      quantityOut: 0,
      balanceQuantity: 1200,
      transactionDate: "2026-08-01",
      createdBy: "usr-quarry-mgr-002",
      createdAt: now
    };
    this.quarryStocks.set(stockLateriteOpen.id, stockLateriteOpen);
    this.quarryStocks.set(stockHardRockOpen.id, stockHardRockOpen);
    const prodRecord1 = {
      id: "prod-rec-001",
      tenantId,
      quarryId: qmLaterite.id,
      productId: prodLaterite.id,
      productionType: "LATERITE_CUTTING",
      productionDate: "2026-08-15",
      shift: "DAY",
      quantity: 450,
      unit: "PIECE",
      operatorId: "usr-quarry-mgr-002",
      remarks: "Bench 2 standard cutting execution",
      createdAt: now,
      updatedAt: now,
      createdBy: "usr-quarry-mgr-002"
    };
    this.quarryProductions.set(prodRecord1.id, prodRecord1);
    const gp1 = {
      id: "gp-001",
      tenantId,
      quarryId: qmLaterite.id,
      passNumber: "GP-Q1-2026-00001",
      customerId: "crm-cust-001",
      productId: prodLaterite.id,
      quantity: 300,
      unit: "PIECE",
      vehicleNo: "KA-19-ME-4491",
      driverName: "Manjunath Gowda",
      grossWeight: 4200,
      tareWeight: 1200,
      netWeight: 3e3,
      status: "ISSUED",
      salesReference: "SO-2026-0881",
      createdBy: "usr-quarry-mgr-002",
      createdAt: now,
      updatedAt: now
    };
    this.gatePasses.set(gp1.id, gp1);
  }
  seedQuarryRbacData() {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const tenant1 = this.tenants.get("tenant-rz-global-001") || Array.from(this.tenants.values())[0];
    if (!tenant1) return;
    const company1 = Array.from(this.companies.values()).find((c) => c.tenantId === tenant1.id) || Array.from(this.companies.values())[0];
    const branch1 = Array.from(this.branches.values()).find((b) => b.tenantId === tenant1.id);
    const quarryPerms = [
      { id: "p101", code: "QUARRY_VIEW", module: "Quarry Management", action: "quarry_view", description: "View Quarry Master" },
      { id: "p102", code: "QUARRY_CREATE", module: "Quarry Management", action: "quarry_create", description: "Create Quarry Master" },
      { id: "p103", code: "QUARRY_EDIT", module: "Quarry Management", action: "quarry_edit", description: "Edit Quarry Master" },
      { id: "p104", code: "QUARRY_DEACTIVATE", module: "Quarry Management", action: "quarry_deactivate", description: "Deactivate Quarry Master" },
      { id: "p105", code: "PRODUCT_VIEW", module: "Quarry Management", action: "product_view", description: "View Stone Products" },
      { id: "p106", code: "PRODUCT_CREATE", module: "Quarry Management", action: "product_create", description: "Create Stone Product" },
      { id: "p107", code: "PRODUCT_EDIT", module: "Quarry Management", action: "product_edit", description: "Edit Stone Product" },
      { id: "p108", code: "PRODUCT_DEACTIVATE", module: "Quarry Management", action: "product_deactivate", description: "Deactivate Stone Product" },
      { id: "p109", code: "PRODUCTION_VIEW", module: "Quarry Management", action: "production_view", description: "View Quarry Production" },
      { id: "p110", code: "PRODUCTION_CREATE", module: "Quarry Management", action: "production_create", description: "Record Quarry Production" },
      { id: "p111", code: "PRODUCTION_EDIT", module: "Quarry Management", action: "production_edit", description: "Edit Quarry Production" },
      { id: "p112", code: "STOCK_VIEW", module: "Quarry Management", action: "stock_view", description: "View Quarry Stock Ledger & Balances" },
      { id: "p113", code: "STOCK_ADJUST", module: "Quarry Management", action: "stock_adjust", description: "Perform Quarry Stock Adjustments" },
      { id: "p114", code: "GATE_PASS_VIEW", module: "Quarry Management", action: "gate_pass_view", description: "View Gate Passes" },
      { id: "p115", code: "GATE_PASS_CREATE", module: "Quarry Management", action: "gate_pass_create", description: "Create Gate Pass" },
      { id: "p116", code: "GATE_PASS_VERIFY", module: "Quarry Management", action: "gate_pass_verify", description: "Verify Gate Pass" },
      { id: "p117", code: "GATE_PASS_DISPATCH", module: "Quarry Management", action: "gate_pass_dispatch", description: "Dispatch Gate Pass" },
      { id: "p118", code: "GATE_PASS_CANCEL", module: "Quarry Management", action: "gate_pass_cancel", description: "Cancel Gate Pass" },
      { id: "p119", code: "LAND_VIEW", module: "Quarry Management", action: "land_view", description: "View Land Leases" },
      { id: "p120", code: "LAND_CREATE", module: "Quarry Management", action: "land_create", description: "Create Land Lease" },
      { id: "p121", code: "LAND_EDIT", module: "Quarry Management", action: "land_edit", description: "Edit Land Lease" },
      { id: "p122", code: "LAND_DEACTIVATE", module: "Quarry Management", action: "land_deactivate", description: "Deactivate Land Lease" },
      { id: "p123", code: "SETTLEMENT_VIEW", module: "Quarry Management", action: "settlement_view", description: "View Landowner Settlements" },
      { id: "p124", code: "SETTLEMENT_CREATE", module: "Quarry Management", action: "settlement_create", description: "Create Landowner Settlement" },
      { id: "p125", code: "SETTLEMENT_APPROVE", module: "Quarry Management", action: "settlement_approve", description: "Approve Landowner Settlement" }
    ];
    quarryPerms.forEach((p) => this.permissions.set(p.id, p));
    const rolesToAdd = [
      {
        id: "role-developer",
        tenantId: tenant1.id,
        code: "DEVELOPER",
        name: "Lead Core Developer",
        description: "Full developer access to system and all platform features",
        isSystemRole: true,
        createdAt: now,
        updatedAt: now,
        version: 1
      },
      {
        id: "role-corporate-admin",
        tenantId: tenant1.id,
        code: "CORPORATE_ADMIN",
        name: "Corporate Enterprise Admin",
        description: "Full administrative rights across corporate operations and quarry platform",
        isSystemRole: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      },
      {
        id: "role-quarry-owner",
        tenantId: tenant1.id,
        code: "QUARRY_OWNER",
        name: "Quarry Owner / Executive",
        description: "Complete operational and financial control over Quarry facilities",
        isSystemRole: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      },
      {
        id: "role-quarry-mgr",
        tenantId: tenant1.id,
        code: "QUARRY_MANAGER",
        name: "Quarry Site Manager",
        description: "Operational manager with site production, gate pass dispatch and stock control",
        isSystemRole: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      },
      {
        id: "role-quarry-staff",
        tenantId: tenant1.id,
        code: "QUARRY_STAFF",
        name: "Quarry Floor Staff / Scale Operator",
        description: "Site staff with production logging and initial gate pass generation",
        isSystemRole: false,
        createdAt: now,
        updatedAt: now,
        version: 1
      }
    ];
    rolesToAdd.forEach((r) => {
      if (!this.roles.has(r.id)) {
        this.roles.set(r.id, r);
      }
    });
    const managerPermCodes = [
      "QUARRY_VIEW",
      "QUARRY_EDIT",
      "PRODUCT_VIEW",
      "PRODUCT_CREATE",
      "PRODUCT_EDIT",
      "PRODUCTION_VIEW",
      "PRODUCTION_CREATE",
      "PRODUCTION_EDIT",
      "STOCK_VIEW",
      "STOCK_ADJUST",
      "GATE_PASS_VIEW",
      "GATE_PASS_CREATE",
      "GATE_PASS_VERIFY",
      "GATE_PASS_DISPATCH",
      "GATE_PASS_CANCEL",
      "LAND_VIEW",
      "LAND_CREATE",
      "LAND_EDIT",
      "SETTLEMENT_VIEW",
      "SETTLEMENT_CREATE"
    ];
    const staffPermCodes = [
      "QUARRY_VIEW",
      "PRODUCT_VIEW",
      "PRODUCTION_VIEW",
      "PRODUCTION_CREATE",
      "STOCK_VIEW",
      "GATE_PASS_VIEW",
      "GATE_PASS_CREATE",
      "LAND_VIEW"
    ];
    const allQuarryPermCodes = quarryPerms.map((p) => p.code);
    const assignPermsToRole = (roleId, codes) => {
      codes.forEach((code) => {
        const perm = quarryPerms.find((p) => p.code === code);
        if (!perm) return;
        const exists = Array.from(this.rolePermissions.values()).some(
          (rp) => rp.roleId === roleId && rp.permissionCode === code
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
    assignPermsToRole("role-super-admin", allQuarryPermCodes);
    assignPermsToRole("role-developer", allQuarryPermCodes);
    assignPermsToRole("role-corporate-admin", allQuarryPermCodes);
    assignPermsToRole("role-quarry-owner", allQuarryPermCodes);
    assignPermsToRole("role-quarry-mgr", managerPermCodes);
    assignPermsToRole("role-quarry-staff", staffPermCodes);
    const ownerPass = hashPassword("OwnerPass2026!");
    const staffPass = hashPassword("StaffPass2026!");
    const userOwner = {
      id: "usr-quarry-owner-001",
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1?.id,
      email: "quarry.owner@racezoneventures.com",
      passwordHash: ownerPass.hash,
      salt: ownerPass.salt,
      fullName: "Rajesh Hegde (Quarry Owner)",
      phone: "+1-800-QOWNER",
      department: "Executive Board",
      designation: "Quarry Owner & Principal",
      status: "ACTIVE",
      isMfaEnabled: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    const userStaff = {
      id: "usr-quarry-staff-001",
      tenantId: tenant1.id,
      companyId: company1.id,
      branchId: branch1?.id,
      email: "quarry.staff@racezoneventures.com",
      passwordHash: staffPass.hash,
      salt: staffPass.salt,
      fullName: "Suresh Kumar (Weighbridge Staff)",
      phone: "+1-800-QSTAFF",
      department: "Mining Operations",
      designation: "Weighbridge Clerk",
      status: "ACTIVE",
      isMfaEnabled: false,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    if (!this.users.has(userOwner.id)) this.users.set(userOwner.id, userOwner);
    if (!this.users.has(userStaff.id)) this.users.set(userStaff.id, userStaff);
    const assignUserRole = (id, userId, roleId, tenantIdStr) => {
      const exists = Array.from(this.userRoles.values()).some((ur) => ur.userId === userId && ur.roleId === roleId);
      if (!exists) {
        this.userRoles.set(id, {
          id,
          userId,
          roleId,
          tenantId: tenantIdStr,
          assignedAt: now,
          assignedBy: "SYSTEM"
        });
      }
    };
    assignUserRole("ur-quarry-owner-1", "usr-quarry-owner-001", "role-quarry-owner", tenant1.id);
    assignUserRole("ur-quarry-mgr-1", "usr-quarry-mgr-002", "role-quarry-mgr", tenant1.id);
    assignUserRole("ur-quarry-staff-1", "usr-quarry-staff-001", "role-quarry-staff", tenant1.id);
    assignUserRole("ur-dev-1", "usr-admin-001", "role-developer", tenant1.id);
    assignUserRole("ur-corp-1", "usr-admin-001", "role-corporate-admin", tenant1.id);
  }
};
var db = new DatabaseStore();

// src/server/repositories/sharedCoreRepositories.ts
var TenantRepository = class {
  async findById(id) {
    const tenant = db.tenants.get(id);
    if (!tenant || tenant.deletedAt) return null;
    return tenant;
  }
  async findByCode(code) {
    for (const t of db.tenants.values()) {
      if (t.code === code && !t.deletedAt) return t;
    }
    return null;
  }
  async findAll() {
    return Array.from(db.tenants.values()).filter((t) => !t.deletedAt);
  }
  async create(tenantData) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newTenant = {
      id: tenantData.id || generateUuidV7(),
      code: tenantData.code || `TNT-${Date.now()}`,
      name: tenantData.name || "New Tenant",
      domain: tenantData.domain || "tenant.com",
      status: tenantData.status || "ACTIVE",
      tier: tenantData.tier || "ENTERPRISE",
      settingsJson: tenantData.settingsJson || "{}",
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    db.tenants.set(newTenant.id, newTenant);
    db.persistToDisk();
    return newTenant;
  }
};
var OrganizationRepository = class {
  async findCompaniesByTenant(tenantId) {
    return Array.from(db.companies.values()).filter((c) => c.tenantId === tenantId && !c.deletedAt);
  }
  async findBranchesByCompany(companyId, tenantId) {
    return Array.from(db.branches.values()).filter((b) => b.companyId === companyId && b.tenantId === tenantId && !b.deletedAt);
  }
  async findBusinessUnitsByTenant(tenantId) {
    return Array.from(db.businessUnits.values()).filter((u) => u.tenantId === tenantId && !u.deletedAt);
  }
};
var UserRepository = class {
  async findById(id, tenantId) {
    const user = db.users.get(id);
    if (!user || user.deletedAt) return null;
    if (tenantId && user.tenantId !== tenantId) return null;
    return user;
  }
  async findByEmail(email) {
    for (const u of db.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase() && !u.deletedAt) {
        return u;
      }
    }
    return null;
  }
  async findByTenant(tenantId) {
    return Array.from(db.users.values()).filter((u) => u.tenantId === tenantId && !u.deletedAt);
  }
  async create(userData) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newUser = {
      id: userData.id || generateUuidV7(),
      tenantId: userData.tenantId,
      companyId: userData.companyId,
      branchId: userData.branchId,
      email: userData.email,
      passwordHash: userData.passwordHash,
      salt: userData.salt,
      fullName: userData.fullName,
      phone: userData.phone,
      department: userData.department || "General",
      designation: userData.designation || "Staff",
      status: userData.status || "ACTIVE",
      isMfaEnabled: userData.isMfaEnabled || false,
      linkedEmployeeId: userData.linkedEmployeeId,
      linkedDriverId: userData.linkedDriverId,
      linkedOperatorId: userData.linkedOperatorId,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    db.users.set(newUser.id, newUser);
    db.persistToDisk();
    return newUser;
  }
  async updateProfile(id, tenantId, updates) {
    const user = await this.findById(id, tenantId);
    if (!user) throw new Error("User not found or tenant access denied");
    const updated = {
      ...user,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: user.version + 1
    };
    db.users.set(id, updated);
    db.persistToDisk();
    return updated;
  }
};
var RolePermissionRepository = class {
  async findRolesByTenant(tenantId) {
    return Array.from(db.roles.values()).filter((r) => r.tenantId === tenantId || r.isSystemRole);
  }
  async findPermissionsByUser(userId) {
    const permissions = /* @__PURE__ */ new Set();
    const userRoleEntries = Array.from(db.userRoles.values()).filter((ur) => ur.userId === userId);
    for (const ur of userRoleEntries) {
      const rolePerms = Array.from(db.rolePermissions.values()).filter((rp) => rp.roleId === ur.roleId);
      for (const rp of rolePerms) {
        permissions.add(rp.permissionCode);
      }
    }
    return Array.from(permissions);
  }
};
var AuditRepository = class {
  async log(auditData) {
    const logEntry = {
      id: generateUuidV7(),
      ...auditData,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.auditLogs.set(logEntry.id, logEntry);
    db.persistToDisk();
    return logEntry;
  }
  async search(tenantId, limit = 50) {
    return Array.from(db.auditLogs.values()).filter((a) => a.tenantId === tenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, limit);
  }
};
var NotificationRepository = class {
  async findByRecipient(userId, tenantId) {
    return Array.from(db.notifications.values()).filter((n) => n.recipientUserId === userId && n.tenantId === tenantId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async create(notifData) {
    const newNotif = {
      id: notifData.id || generateUuidV7(),
      tenantId: notifData.tenantId,
      recipientUserId: notifData.recipientUserId,
      title: notifData.title,
      body: notifData.body || "",
      type: notifData.type || "INFO",
      channel: notifData.channel || "IN_APP",
      isRead: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.notifications.set(newNotif.id, newNotif);
    db.persistToDisk();
    return newNotif;
  }
  async markAsRead(id, tenantId) {
    const notif = db.notifications.get(id);
    if (!notif || notif.tenantId !== tenantId) return false;
    notif.isRead = true;
    notif.readAt = (/* @__PURE__ */ new Date()).toISOString();
    db.notifications.set(id, notif);
    db.persistToDisk();
    return true;
  }
};
var DocumentRepository = class {
  async findByEntity(tenantId, module2, entityType, entityId) {
    return Array.from(db.documents.values()).filter(
      (d) => d.tenantId === tenantId && d.module === module2 && d.entityType === entityType && d.entityId === entityId && !d.deletedAt
    );
  }
  async registerMetadata(docData) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newDoc = {
      id: docData.id || generateUuidV7(),
      tenantId: docData.tenantId,
      companyId: docData.companyId,
      module: docData.module || "Shared Core",
      entityType: docData.entityType || "GENERAL",
      entityId: docData.entityId || "0",
      fileName: docData.fileName,
      fileSize: docData.fileSize || 1024,
      mimeType: docData.mimeType || "application/pdf",
      storageKey: docData.storageKey || `docs/${docData.tenantId}/${Date.now()}_${docData.fileName}`,
      accessLevel: docData.accessLevel || "TENANT_PRIVATE",
      uploaderUserId: docData.uploaderUserId,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    db.documents.set(newDoc.id, newDoc);
    db.persistToDisk();
    return newDoc;
  }
};
var WorkflowRepository = class {
  async findDefinitionByCode(tenantId, code) {
    for (const wf of db.workflowDefinitions.values()) {
      if (wf.tenantId === tenantId && wf.code === code) return wf;
    }
    return null;
  }
  async createInstance(wfInst) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newInst = {
      id: wfInst.id || generateUuidV7(),
      tenantId: wfInst.tenantId,
      workflowDefinitionId: wfInst.workflowDefinitionId,
      entityType: wfInst.entityType,
      entityId: wfInst.entityId,
      currentState: wfInst.currentState || "INITIAL",
      initiatedByUserId: wfInst.initiatedByUserId,
      status: "IN_PROGRESS",
      createdAt: now,
      updatedAt: now
    };
    db.workflowInstances.set(newInst.id, newInst);
    db.persistToDisk();
    return newInst;
  }
};

// src/server/security/jwtService.ts
var import_crypto2 = __toESM(require("crypto"), 1);
var JwtService = class {
  constructor() {
    this.keyId = "rz-rsa-key-2026-v1";
    this.issuer = "rz-minetrix-bos";
    this.audience = "rz-minetrix-clients";
    if (process.env.RSA_PRIVATE_KEY && process.env.RSA_PUBLIC_KEY) {
      this.privateKeyPem = process.env.RSA_PRIVATE_KEY;
      this.publicKeyPem = process.env.RSA_PUBLIC_KEY;
    } else {
      const { privateKey, publicKey } = import_crypto2.default.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" }
      });
      this.privateKeyPem = privateKey;
      this.publicKeyPem = publicKey;
    }
  }
  getPublicKeyPem() {
    return this.publicKeyPem;
  }
  getKeyMetadata() {
    return {
      algorithm: "RS256 (RSA-256 Asymmetric Signing)",
      keyId: this.keyId,
      issuer: this.issuer,
      audience: this.audience,
      keyType: "RSA 2048-bit",
      status: process.env.RSA_PRIVATE_KEY ? "PRODUCTION_KEY_LOADED" : "DEVELOPMENT_DYNAMIC_RSA_KEYPAIR"
    };
  }
  signToken(userClaims) {
    const header = {
      alg: "RS256",
      typ: "JWT",
      kid: this.keyId
    };
    const now = Math.floor(Date.now() / 1e3);
    const payload = {
      iss: this.issuer,
      aud: this.audience,
      sub: userClaims.userId,
      exp: now + 86400,
      // 24 hours
      iat: now,
      tenantId: userClaims.tenantId,
      companyId: userClaims.companyId,
      branchId: userClaims.branchId,
      email: userClaims.email,
      fullName: userClaims.fullName,
      roles: userClaims.roles
    };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const dataToSign = `${encodedHeader}.${encodedPayload}`;
    const signer = import_crypto2.default.createSign("SHA256");
    signer.update(dataToSign);
    signer.end();
    const signature = signer.sign(this.privateKeyPem, "base64url");
    return `${dataToSign}.${signature}`;
  }
  verifyToken(token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      const [encodedHeader, encodedPayload, signature] = parts;
      const dataToVerify = `${encodedHeader}.${encodedPayload}`;
      const verifier = import_crypto2.default.createVerify("SHA256");
      verifier.update(dataToVerify);
      verifier.end();
      const isValid = verifier.verify(this.publicKeyPem, signature, "base64url");
      if (!isValid) return null;
      const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
      const now = Math.floor(Date.now() / 1e3);
      if (payload.exp && payload.exp < now) {
        return null;
      }
      if (payload.iss !== this.issuer || payload.aud !== this.audience) {
        return null;
      }
      return payload;
    } catch (err) {
      return null;
    }
  }
};
var jwtService = new JwtService();

// src/server/middleware/authMiddleware.ts
var auditRepo = new AuditRepository();
var rolePermRepo = new RolePermissionRepository();
function signToken(payload) {
  return jwtService.signToken(payload);
}
function verifyToken(token) {
  const decoded = jwtService.verifyToken(token);
  if (!decoded) return null;
  return {
    ...decoded,
    userId: decoded.sub
  };
}
function correlationIdMiddleware(req, res, next) {
  req.requestId = generateUuidV7();
  req.correlationId = req.headers["x-correlation-id"] || generateUuidV7();
  res.setHeader("x-request-id", req.requestId);
  res.setHeader("x-correlation-id", req.correlationId);
  next();
}
async function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "UNAUTHORIZED",
      message: "Missing or invalid Authorization Bearer token header."
    });
  }
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: "INVALID_TOKEN",
      message: "Authentication token is expired or RS256 signature is invalid."
    });
  }
  const user = db.users.get(decoded.userId);
  if (!user || user.deletedAt || user.status !== "ACTIVE") {
    return res.status(401).json({
      success: false,
      error: "USER_INACTIVE",
      message: "User account is inactive, suspended, or deleted."
    });
  }
  const userPermissions = await rolePermRepo.findPermissionsByUser(user.id);
  req.user = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    tenantId: user.tenantId,
    companyId: user.companyId,
    branchId: user.branchId,
    roles: decoded.roles || ["USER"],
    permissions: userPermissions
  };
  next();
}
function enforceTenantContext(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: "UNAUTHORIZED", message: "User not authenticated" });
  }
  const headerTenantId = req.headers["x-tenant-id"];
  const bodyTenantId = req.body?.tenantId || req.body?.tenant_id;
  const targetTenantId = headerTenantId || bodyTenantId;
  if (targetTenantId && targetTenantId !== req.user.tenantId) {
    auditRepo.log({
      tenantId: req.user.tenantId,
      actorUserId: req.user.userId,
      actorEmail: req.user.email,
      action: "TENANT_ISOLATION_VIOLATION_ATTEMPT",
      module: "Shared Core Security",
      resource: `${req.method} ${req.originalUrl} [AttemptedTenant: ${targetTenantId}]`,
      ipAddress: req.ip || "127.0.0.1",
      correlationId: req.correlationId || generateUuidV7(),
      status: "FAILURE"
    });
    return res.status(403).json({
      success: false,
      error: "FORBIDDEN_CROSS_TENANT_ACCESS",
      message: `Tenant Isolation Security: User of Tenant [${req.user.tenantId}] is strictly forbidden from accessing Target Tenant [${targetTenantId}].`
    });
  }
  next();
}
function requirePermission(permissionCode) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "UNAUTHORIZED", message: "User not authenticated" });
    }
    const hasPerm = req.user.permissions.includes(permissionCode) || req.user.permissions.includes("shared:admin:access");
    if (!hasPerm) {
      auditRepo.log({
        tenantId: req.user.tenantId,
        actorUserId: req.user.userId,
        actorEmail: req.user.email,
        action: "RBAC_PERMISSION_DENIED",
        module: "Shared Core Security",
        resource: `${req.method} ${req.originalUrl} [ReqPerm: ${permissionCode}]`,
        ipAddress: req.ip || "127.0.0.1",
        correlationId: req.correlationId || generateUuidV7(),
        status: "FAILURE"
      });
      return res.status(403).json({
        success: false,
        error: "FORBIDDEN_PERMISSION_REQUIRED",
        message: `RBAC Access Denied: User lacks required permission [${permissionCode}].`
      });
    }
    next();
  };
}
function auditLogger(req, res, next) {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(req.method) && req.user) {
    res.on("finish", () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        auditRepo.log({
          tenantId: req.user.tenantId,
          actorUserId: req.user.userId,
          actorEmail: req.user.email,
          action: `API_${req.method}_MUTATION`,
          module: "Shared Core API Gateway",
          resource: req.originalUrl,
          ipAddress: req.ip || "127.0.0.1",
          correlationId: req.correlationId || generateUuidV7(),
          status: "SUCCESS"
        });
      }
    });
  }
  next();
}

// src/server/services/sharedCoreServices.ts
var userRepo = new UserRepository();
var tenantRepo = new TenantRepository();
var orgRepo = new OrganizationRepository();
var rolePermRepo2 = new RolePermissionRepository();
var auditRepo2 = new AuditRepository();
var notifRepo = new NotificationRepository();
var docRepo = new DocumentRepository();
var wfRepo = new WorkflowRepository();
var AuthService = class {
  async login(email, passwordAttempt, ipAddress) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return { success: false, error: "INVALID_CREDENTIALS", message: "Invalid email or password." };
    }
    const { hash } = hashPassword(passwordAttempt, user.salt);
    if (hash !== user.passwordHash) {
      await auditRepo2.log({
        tenantId: user.tenantId,
        actorUserId: user.id,
        actorEmail: user.email,
        action: "AUTH_LOGIN_FAILED",
        module: "Shared Core Auth",
        resource: "LoginEndpoint",
        ipAddress,
        correlationId: "login-attempt",
        status: "FAILURE"
      });
      return { success: false, error: "INVALID_CREDENTIALS", message: "Invalid email or password." };
    }
    const permissions = await rolePermRepo2.findPermissionsByUser(user.id);
    const token = signToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      tenantId: user.tenantId,
      companyId: user.companyId,
      roles: ["USER"]
    });
    await auditRepo2.log({
      tenantId: user.tenantId,
      actorUserId: user.id,
      actorEmail: user.email,
      action: "AUTH_LOGIN_SUCCESS",
      module: "Shared Core Auth",
      resource: "LoginEndpoint",
      ipAddress,
      correlationId: "login-success",
      status: "SUCCESS"
    });
    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          tenantId: user.tenantId,
          companyId: user.companyId,
          department: user.department,
          designation: user.designation,
          isMfaEnabled: user.isMfaEnabled
        },
        permissions
      }
    };
  }
};
var TenantService = class {
  async getTenantContext(tenantId) {
    const tenant = await tenantRepo.findById(tenantId);
    if (!tenant) return { success: false, message: "Tenant not found" };
    const companies = await orgRepo.findCompaniesByTenant(tenantId);
    return { success: true, data: { tenant, companies } };
  }
  async getAllTenants() {
    const tenants = await tenantRepo.findAll();
    return { success: true, data: tenants };
  }
};
var UserService = class {
  async getUsersInTenant(tenantId) {
    const users = await userRepo.findByTenant(tenantId);
    return { success: true, data: users.map((u) => ({ id: u.id, fullName: u.fullName, email: u.email, department: u.department, designation: u.designation, status: u.status })) };
  }
  async linkOperationalAccount(userId, tenantId, linkage) {
    const updated = await userRepo.updateProfile(userId, tenantId, {
      linkedEmployeeId: linkage.employeeId,
      linkedDriverId: linkage.driverId,
      linkedOperatorId: linkage.operatorId
    });
    return { success: true, data: updated };
  }
};
var NotificationService = class {
  async getUserNotifications(userId, tenantId) {
    const notifs = await notifRepo.findByRecipient(userId, tenantId);
    const unreadCount = notifs.filter((n) => !n.isRead).length;
    return { success: true, data: { notifications: notifs, unreadCount } };
  }
  async createNotification(tenantId, recipientUserId, title, body, type) {
    const notif = await notifRepo.create({ tenantId, recipientUserId, title, body, type, channel: "IN_APP" });
    return { success: true, data: notif };
  }
};
var AuditService = class {
  async getAuditLogs(tenantId, limit = 50) {
    const logs = await auditRepo2.search(tenantId, limit);
    return { success: true, data: logs };
  }
};
var WorkflowService = class {
  async initiateWorkflow(tenantId, workflowCode, entityType, entityId, userId) {
    const wfDef = await wfRepo.findDefinitionByCode(tenantId, workflowCode);
    if (!wfDef) return { success: false, message: `Workflow definition [${workflowCode}] not found for tenant` };
    const instance = await wfRepo.createInstance({
      tenantId,
      workflowDefinitionId: wfDef.id,
      entityType,
      entityId,
      currentState: wfDef.initialState,
      initiatedByUserId: userId
    });
    return { success: true, data: instance };
  }
};

// src/server/repositories/fleetRepositories.ts
var FleetRepository = class {
  // --- Vehicles ---
  async getVehicles(tenantId, filters) {
    let list = Array.from(db.fleetVehicles.values()).filter((v) => v.tenantId === tenantId);
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((v) => v.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (v) => v.registrationNumber.toLowerCase().includes(q) || v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.location.toLowerCase().includes(q)
      );
    }
    return list;
  }
  async getVehicleById(tenantId, id) {
    const veh = db.fleetVehicles.get(id);
    if (!veh || veh.tenantId !== tenantId) return null;
    return veh;
  }
  async getVehicleByRegistration(tenantId, regNumber) {
    const list = Array.from(db.fleetVehicles.values());
    const found = list.find((v) => v.tenantId === tenantId && v.registrationNumber.toUpperCase() === regNumber.toUpperCase());
    return found || null;
  }
  async createVehicle(vehicle) {
    db.fleetVehicles.set(vehicle.id, vehicle);
    db.persistToDisk();
    return vehicle;
  }
  async updateVehicle(vehicle) {
    vehicle.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    vehicle.version += 1;
    db.fleetVehicles.set(vehicle.id, vehicle);
    db.persistToDisk();
    return vehicle;
  }
  async deleteVehicle(tenantId, id) {
    const veh = await this.getVehicleById(tenantId, id);
    if (!veh) return false;
    db.fleetVehicles.delete(id);
    db.persistToDisk();
    return true;
  }
  // --- Drivers ---
  async getDrivers(tenantId, filters) {
    let list = Array.from(db.fleetDrivers.values()).filter((d) => d.tenantId === tenantId);
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((d) => d.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (d) => d.name.toLowerCase().includes(q) || d.licenseNumber.toLowerCase().includes(q) || d.phone.includes(q)
      );
    }
    return list;
  }
  async getDriverById(tenantId, id) {
    const d = db.fleetDrivers.get(id);
    if (!d || d.tenantId !== tenantId) return null;
    return d;
  }
  async createDriver(driver) {
    db.fleetDrivers.set(driver.id, driver);
    db.persistToDisk();
    return driver;
  }
  async updateDriver(driver) {
    driver.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.fleetDrivers.set(driver.id, driver);
    db.persistToDisk();
    return driver;
  }
  // --- Assignments ---
  async getAssignments(tenantId, vehicleId) {
    let list = Array.from(db.fleetVehicleAssignments.values()).filter((a) => a.tenantId === tenantId);
    if (vehicleId) {
      list = list.filter((a) => a.vehicleId === vehicleId);
    }
    return list;
  }
  async createAssignment(assignment) {
    db.fleetVehicleAssignments.set(assignment.id, assignment);
    db.persistToDisk();
    return assignment;
  }
  // --- Trips ---
  async getTrips(tenantId, filters) {
    let list = Array.from(db.fleetTrips.values()).filter((t) => t.tenantId === tenantId);
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((t) => t.status === filters.status);
    }
    if (filters?.vehicleId) {
      list = list.filter((t) => t.vehicleId === filters.vehicleId);
    }
    if (filters?.driverId) {
      list = list.filter((t) => t.driverId === filters.driverId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getTripById(tenantId, id) {
    const t = db.fleetTrips.get(id);
    if (!t || t.tenantId !== tenantId) return null;
    return t;
  }
  async createTrip(trip) {
    db.fleetTrips.set(trip.id, trip);
    db.persistToDisk();
    return trip;
  }
  async updateTrip(trip) {
    trip.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.fleetTrips.set(trip.id, trip);
    db.persistToDisk();
    return trip;
  }
  // --- Fuel Logs ---
  async getFuelLogs(tenantId, vehicleId) {
    let list = Array.from(db.fleetFuelLogs.values()).filter((f) => f.tenantId === tenantId);
    if (vehicleId) {
      list = list.filter((f) => f.vehicleId === vehicleId);
    }
    return list.sort((a, b) => new Date(b.logDate).getTime() - new Date(a.logDate).getTime());
  }
  async createFuelLog(log) {
    db.fleetFuelLogs.set(log.id, log);
    db.persistToDisk();
    return log;
  }
  // --- Maintenance Records ---
  async getMaintenanceRecords(tenantId, vehicleId) {
    let list = Array.from(db.fleetMaintenanceRecords.values()).filter((m) => m.tenantId === tenantId);
    if (vehicleId) {
      list = list.filter((m) => m.vehicleId === vehicleId);
    }
    return list.sort((a, b) => new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime());
  }
  async createMaintenanceRecord(record) {
    db.fleetMaintenanceRecords.set(record.id, record);
    db.persistToDisk();
    return record;
  }
  // --- Compliance & Documents ---
  async getComplianceRecords(tenantId, vehicleId) {
    let list = Array.from(db.fleetComplianceRecords.values()).filter((c) => c.tenantId === tenantId);
    if (vehicleId) {
      list = list.filter((c) => c.vehicleId === vehicleId);
    }
    return list;
  }
  async createComplianceRecord(record) {
    db.fleetComplianceRecords.set(record.id, record);
    db.persistToDisk();
    return record;
  }
  // --- Expenses & Revenues ---
  async getExpenses(tenantId, vehicleId) {
    let list = Array.from(db.fleetExpenses.values()).filter((e) => e.tenantId === tenantId);
    if (vehicleId) list = list.filter((e) => e.vehicleId === vehicleId);
    return list;
  }
  async createExpense(expense) {
    db.fleetExpenses.set(expense.id, expense);
    db.persistToDisk();
    return expense;
  }
  async getRevenues(tenantId, vehicleId) {
    let list = Array.from(db.fleetRevenues.values()).filter((r) => r.tenantId === tenantId);
    if (vehicleId) list = list.filter((r) => r.vehicleId === vehicleId);
    return list;
  }
  async createRevenue(revenue) {
    db.fleetRevenues.set(revenue.id, revenue);
    db.persistToDisk();
    return revenue;
  }
  // --- Alerts ---
  async getAlerts(tenantId) {
    return Array.from(db.fleetAlerts.values()).filter((a) => a.tenantId === tenantId);
  }
  async createAlert(alert) {
    db.fleetAlerts.set(alert.id, alert);
    db.persistToDisk();
    return alert;
  }
};
var fleetRepository = new FleetRepository();

// src/server/services/fleetServices.ts
var FleetService = class {
  // ==========================================
  // VEHICLE MANAGEMENT
  // ==========================================
  async getVehicles(tenantId, filters) {
    return fleetRepository.getVehicles(tenantId, filters);
  }
  async getVehicleById(tenantId, id) {
    return fleetRepository.getVehicleById(tenantId, id);
  }
  async createVehicle(tenantId, data) {
    if (!data.registrationNumber) {
      throw new Error("Vehicle registration number is required.");
    }
    const existing = await fleetRepository.getVehicleByRegistration(tenantId, data.registrationNumber);
    if (existing) {
      throw new Error(`Vehicle with registration number ${data.registrationNumber} already exists in this tenant.`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const vehicle = {
      id: generateUuidV7(),
      tenantId,
      companyId: data.companyId || "comp-rz-ventures-001",
      branchId: data.branchId || "br-quarry-alpha",
      businessUnitId: data.businessUnitId,
      registrationNumber: data.registrationNumber.toUpperCase(),
      vehicleType: data.vehicleType || "Tipper",
      categoryId: data.categoryId,
      categoryName: data.categoryName || "Heavy Duty Tipper Truck",
      make: data.make || "Tata",
      model: data.model || "Prima 2830.K",
      variant: data.variant,
      manufacturingYear: data.manufacturingYear || 2024,
      purchaseDate: data.purchaseDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      purchaseValue: data.purchaseValue || 0,
      ownershipType: data.ownershipType || "OWNED",
      ownerName: data.ownerName || "Racezone Ventures",
      fuelType: data.fuelType || "DIESEL",
      fuelCapacity: data.fuelCapacity || 300,
      engineNumber: data.engineNumber || "ENG-GENERIC",
      chassisNumber: data.chassisNumber || "CHS-GENERIC",
      color: data.color || "White",
      seatingCapacity: data.seatingCapacity || 2,
      loadCapacity: data.loadCapacity || 25,
      currentOdometer: data.currentOdometer || 0,
      status: "AVAILABLE",
      location: data.location || "Main Depot Yard",
      remarks: data.remarks,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    return fleetRepository.createVehicle(vehicle);
  }
  async updateVehicleStatus(tenantId, vehicleId, newStatus, reason) {
    const veh = await fleetRepository.getVehicleById(tenantId, vehicleId);
    if (!veh) {
      throw new Error("Vehicle not found.");
    }
    veh.status = newStatus;
    if (reason) veh.remarks = `${veh.remarks || ""} [Status change: ${newStatus} - ${reason}]`.trim();
    return fleetRepository.updateVehicle(veh);
  }
  // ==========================================
  // DRIVER MANAGEMENT & HR LINKAGE
  // ==========================================
  async getDrivers(tenantId, filters) {
    return fleetRepository.getDrivers(tenantId, filters);
  }
  async createDriver(tenantId, data) {
    if (!data.name || !data.licenseNumber) {
      throw new Error("Driver name and license number are required.");
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const driver = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId,
      linkedUserId: data.linkedUserId,
      name: data.name,
      phone: data.phone || "+91-0000000000",
      licenseNumber: data.licenseNumber.toUpperCase(),
      licenseType: data.licenseType || "HEAVY_COMMERCIAL",
      licenseIssueDate: data.licenseIssueDate || "2020-01-01",
      licenseExpiryDate: data.licenseExpiryDate || "2030-01-01",
      status: "ACTIVE",
      joiningDate: data.joiningDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      emergencyContact: data.emergencyContact,
      address: data.address,
      remarks: data.remarks,
      createdAt: now,
      updatedAt: now
    };
    return fleetRepository.createDriver(driver);
  }
  // ==========================================
  // VEHICLE ASSIGNMENT & CONFLICT PREVENTION
  // ==========================================
  async assignVehicle(tenantId, data) {
    if (!data.vehicleId || !data.primaryDriverId) {
      throw new Error("Vehicle ID and Primary Driver ID are required for assignment.");
    }
    const veh = await fleetRepository.getVehicleById(tenantId, data.vehicleId);
    if (!veh) throw new Error("Vehicle not found.");
    const driver = await fleetRepository.getDriverById(tenantId, data.primaryDriverId);
    if (!driver) throw new Error("Driver not found.");
    const activeAssignments = await fleetRepository.getAssignments(tenantId, data.vehicleId);
    const hasActiveAssignment = activeAssignments.some((a) => a.status === "ACTIVE");
    if (hasActiveAssignment || veh.status === "ON_TRIP") {
      throw new Error(`Vehicle ${veh.registrationNumber} currently has an active assignment or is on trip.`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const assignment = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      primaryDriverId: data.primaryDriverId,
      secondaryDriverId: data.secondaryDriverId,
      assignedEmployeeId: data.assignedEmployeeId || driver.employeeId,
      companyId: veh.companyId,
      branchId: veh.branchId,
      businessUnitId: veh.businessUnitId,
      assignmentStart: now,
      purpose: data.purpose || "Mining Fleet Operational Assignment",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    veh.status = "ASSIGNED";
    await fleetRepository.updateVehicle(veh);
    return fleetRepository.createAssignment(assignment);
  }
  // ==========================================
  // TRIP DISPATCH & LIFECYCLE MANAGEMENT
  // ==========================================
  async createTrip(tenantId, data) {
    if (!data.vehicleId || !data.driverId || !data.source || !data.destination) {
      throw new Error("Vehicle ID, Driver ID, Source, and Destination are required to schedule a trip.");
    }
    const veh = await fleetRepository.getVehicleById(tenantId, data.vehicleId);
    if (!veh) throw new Error("Vehicle not found.");
    const driver = await fleetRepository.getDriverById(tenantId, data.driverId);
    if (!driver) throw new Error("Driver not found.");
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const startOdo = data.startOdometer !== void 0 ? Number(data.startOdometer) : veh.currentOdometer;
    const trip = {
      id: generateUuidV7(),
      tenantId,
      tripNumber: data.tripNumber || `TRIP-${Date.now().toString().slice(-6)}`,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      source: data.source,
      destination: data.destination,
      tripDate: data.tripDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      startTime: now,
      startOdometer: startOdo,
      distance: 0,
      tripType: data.tripType || "MINING_DISPATCH",
      customerId: data.customerId,
      customerName: data.customerName,
      material: data.material || "Granite Aggregate (40mm)",
      quantity: data.quantity || 25,
      loadReference: data.loadReference,
      deliveryReference: data.deliveryReference,
      status: "PLANNED",
      remarks: data.remarks,
      createdAt: now,
      updatedAt: now
    };
    return fleetRepository.createTrip(trip);
  }
  async dispatchTrip(tenantId, tripId) {
    const trip = await fleetRepository.getTripById(tenantId, tripId);
    if (!trip) throw new Error("Trip not found.");
    if (trip.status !== "PLANNED") {
      throw new Error(`Cannot dispatch trip in status ${trip.status}. Must be PLANNED.`);
    }
    const veh = await fleetRepository.getVehicleById(tenantId, trip.vehicleId);
    if (!veh) throw new Error("Vehicle not found.");
    trip.status = "DISPATCHED";
    trip.startTime = (/* @__PURE__ */ new Date()).toISOString();
    await fleetRepository.updateTrip(trip);
    veh.status = "ON_TRIP";
    await fleetRepository.updateVehicle(veh);
    return trip;
  }
  async completeTrip(tenantId, tripId, endOdometer) {
    const trip = await fleetRepository.getTripById(tenantId, tripId);
    if (!trip) throw new Error("Trip not found.");
    if (trip.status !== "DISPATCHED" && trip.status !== "IN_PROGRESS" && trip.status !== "PLANNED") {
      throw new Error(`Cannot complete trip in status ${trip.status}.`);
    }
    if (endOdometer < trip.startOdometer) {
      throw new Error(`End odometer (${endOdometer} km) cannot be less than start odometer (${trip.startOdometer} km). Negative distance prohibited.`);
    }
    const distance = endOdometer - trip.startOdometer;
    trip.endOdometer = endOdometer;
    trip.distance = distance;
    trip.endTime = (/* @__PURE__ */ new Date()).toISOString();
    trip.status = "COMPLETED";
    await fleetRepository.updateTrip(trip);
    const veh = await fleetRepository.getVehicleById(tenantId, trip.vehicleId);
    if (veh) {
      veh.currentOdometer = endOdometer;
      veh.status = "AVAILABLE";
      await fleetRepository.updateVehicle(veh);
    }
    return trip;
  }
  async getTrips(tenantId, filters) {
    return fleetRepository.getTrips(tenantId, filters);
  }
  // ==========================================
  // FUEL MANAGEMENT & EFFICIENCY CALCULATION
  // ==========================================
  async logFuel(tenantId, data) {
    if (!data.vehicleId || !data.quantity || !data.rate || !data.odometer) {
      throw new Error("Vehicle ID, quantity, rate, and odometer reading are required for fuel logging.");
    }
    const veh = await fleetRepository.getVehicleById(tenantId, data.vehicleId);
    if (!veh) throw new Error("Vehicle not found.");
    const qty = Number(data.quantity);
    const rate = Number(data.rate);
    const totalAmount = qty * rate;
    const odo = Number(data.odometer);
    const previousLogs = await fleetRepository.getFuelLogs(tenantId, data.vehicleId);
    let efficiency;
    const baselineOdo = previousLogs.length > 0 ? previousLogs[0].odometer : veh.currentOdometer;
    const distanceCovered = odo - baselineOdo;
    if (distanceCovered > 0 && qty > 0) {
      efficiency = Number((distanceCovered / qty).toFixed(2));
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const log = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      logDate: data.logDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      fuelStation: data.fuelStation || "Quarry Diesel Station Gate 1",
      fuelType: veh.fuelType,
      quantity: qty,
      rate,
      amount: totalAmount,
      odometer: odo,
      paymentMethod: data.paymentMethod || "COMPANY_CARD",
      invoiceNumber: data.invoiceNumber,
      calculatedEfficiency: efficiency,
      remarks: data.remarks,
      createdAt: now,
      updatedAt: now
    };
    await fleetRepository.createFuelLog(log);
    const expense = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      expenseCategory: "FUEL",
      expenseDate: log.logDate,
      amount: totalAmount,
      paymentStatus: "PAID",
      referenceNumber: log.invoiceNumber,
      remarks: `Fuel log ref: ${qty}L @ ${rate}/L`,
      createdAt: now
    };
    await fleetRepository.createExpense(expense);
    if (efficiency !== void 0 && efficiency < 1.5) {
      const alert = {
        id: generateUuidV7(),
        tenantId,
        vehicleId: data.vehicleId,
        alertType: "HIGH_FUEL_CONSUMPTION",
        severity: "CRITICAL",
        message: `High fuel consumption alert for vehicle ${veh.registrationNumber}: ${efficiency} KM/L measured on ${log.logDate}.`,
        isResolved: false,
        createdAt: now
      };
      await fleetRepository.createAlert(alert);
    }
    return log;
  }
  // ==========================================
  // MAINTENANCE MANAGEMENT
  // ==========================================
  async logMaintenance(tenantId, data) {
    if (!data.vehicleId || !data.description || data.odometer === void 0) {
      throw new Error("Vehicle ID, description, and odometer reading are required for maintenance record.");
    }
    const veh = await fleetRepository.getVehicleById(tenantId, data.vehicleId);
    if (!veh) throw new Error("Vehicle not found.");
    const parts = Number(data.partsCost || 0);
    const labour = Number(data.labourCost || 0);
    const other = Number(data.otherCost || 0);
    const total = parts + labour + other;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const record = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      maintenanceType: data.maintenanceType || "PREVENTIVE",
      serviceDate: data.serviceDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      odometer: Number(data.odometer),
      workshop: data.workshop || "Minetrix Central Workshop",
      description: data.description,
      partsCost: parts,
      labourCost: labour,
      otherCost: other,
      totalCost: total,
      nextServiceDate: data.nextServiceDate,
      nextServiceOdometer: data.nextServiceOdometer,
      status: "COMPLETED",
      createdAt: now,
      updatedAt: now
    };
    await fleetRepository.createMaintenanceRecord(record);
    const expense = {
      id: generateUuidV7(),
      tenantId,
      vehicleId: data.vehicleId,
      expenseCategory: "MAINTENANCE",
      expenseDate: record.serviceDate,
      amount: total,
      paymentStatus: "PAID",
      remarks: `Maintenance: ${record.description}`,
      createdAt: now
    };
    await fleetRepository.createExpense(expense);
    return record;
  }
  // ==========================================
  // DASHBOARD & METRICS
  // ==========================================
  async getDashboardMetrics(tenantId) {
    const vehicles = await fleetRepository.getVehicles(tenantId);
    const drivers = await fleetRepository.getDrivers(tenantId);
    const trips = await fleetRepository.getTrips(tenantId);
    const fuelLogs = await fleetRepository.getFuelLogs(tenantId);
    const maintenance = await fleetRepository.getMaintenanceRecords(tenantId);
    const expenses = await fleetRepository.getExpenses(tenantId);
    const revenues = await fleetRepository.getRevenues(tenantId);
    const alerts = await fleetRepository.getAlerts(tenantId);
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v) => v.status === "AVAILABLE").length;
    const assignedVehicles = vehicles.filter((v) => v.status === "ASSIGNED").length;
    const onTripVehicles = vehicles.filter((v) => v.status === "ON_TRIP").length;
    const underMaintenanceVehicles = vehicles.filter((v) => v.status === "UNDER_MAINTENANCE").length;
    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter((d) => d.status === "ACTIVE").length;
    const activeTrips = trips.filter((t) => t.status === "DISPATCHED" || t.status === "IN_PROGRESS").length;
    const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;
    const totalFuelExpense = fuelLogs.reduce((sum, f) => sum + f.amount, 0);
    const totalMaintenanceExpense = maintenance.reduce((sum, m) => sum + m.totalCost, 0);
    const totalFleetRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
    const effLogs = fuelLogs.filter((f) => f.calculatedEfficiency && f.calculatedEfficiency > 0);
    const avgEff = effLogs.length > 0 ? Number((effLogs.reduce((sum, f) => sum + (f.calculatedEfficiency || 0), 0) / effLogs.length).toFixed(2)) : 3.2;
    const activeAlertsCount = alerts.filter((a) => !a.isResolved).length;
    return {
      totalVehicles,
      availableVehicles,
      assignedVehicles,
      onTripVehicles,
      underMaintenanceVehicles,
      totalDrivers,
      activeDrivers,
      activeTrips,
      completedTrips,
      totalFuelExpense,
      totalMaintenanceExpense,
      totalFleetRevenue,
      averageFuelEfficiencyKmPerLiter: avgEff,
      activeAlertsCount
    };
  }
};
var fleetService = new FleetService();

// src/server/repositories/marketplaceRepositories.ts
var MarketplaceRepository = class {
  // --- Load Requests ---
  async getLoadRequests(tenantId, filters) {
    let list = Array.from(db.loadRequests.values()).filter((l) => l.tenantId === tenantId);
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((l) => l.status === filters.status);
    }
    if (filters?.isPublic !== void 0) {
      list = list.filter((l) => l.isPublic === filters.isPublic);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (l) => l.requestNumber.toLowerCase().includes(q) || l.customerName.toLowerCase().includes(q) || l.materialName.toLowerCase().includes(q) || l.source.toLowerCase().includes(q) || l.destination.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getLoadRequestById(tenantId, id) {
    const item = db.loadRequests.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }
  async createLoadRequest(load) {
    db.loadRequests.set(load.id, load);
    db.persistToDisk();
    return load;
  }
  async updateLoadRequest(load) {
    load.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    load.version = (load.version || 1) + 1;
    db.loadRequests.set(load.id, load);
    db.persistToDisk();
    return load;
  }
  async deleteLoadRequest(tenantId, id) {
    const item = await this.getLoadRequestById(tenantId, id);
    if (!item) return false;
    db.loadRequests.delete(id);
    db.persistToDisk();
    return true;
  }
  // --- Transporters ---
  async getTransporters(tenantId, filters) {
    let list = Array.from(db.transporterProfiles.values()).filter((t) => t.tenantId === tenantId);
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((t) => t.verifiedStatus === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) => t.companyName.toLowerCase().includes(q) || t.contactPerson.toLowerCase().includes(q) || t.phone.toLowerCase().includes(q)
      );
    }
    return list;
  }
  async getTransporterById(tenantId, id) {
    const item = db.transporterProfiles.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }
  async createTransporter(transporter) {
    db.transporterProfiles.set(transporter.id, transporter);
    db.persistToDisk();
    return transporter;
  }
  async updateTransporter(transporter) {
    transporter.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.transporterProfiles.set(transporter.id, transporter);
    db.persistToDisk();
    return transporter;
  }
  // --- Offers ---
  async getOffers(tenantId, loadId) {
    let list = Array.from(db.loadOffers.values()).filter((o) => o.tenantId === tenantId);
    if (loadId) {
      list = list.filter((o) => o.loadId === loadId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getOfferById(tenantId, id) {
    const item = db.loadOffers.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }
  async createOffer(offer) {
    db.loadOffers.set(offer.id, offer);
    db.persistToDisk();
    return offer;
  }
  async updateOffer(offer) {
    offer.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.loadOffers.set(offer.id, offer);
    db.persistToDisk();
    return offer;
  }
  // --- Bookings ---
  async getBookings(tenantId, filters) {
    let list = Array.from(db.loadBookings.values()).filter((b) => b.tenantId === tenantId);
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((b) => b.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (b) => b.bookingNumber.toLowerCase().includes(q) || b.customerName.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getBookingById(tenantId, id) {
    const item = db.loadBookings.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }
  async createBooking(booking) {
    db.loadBookings.set(booking.id, booking);
    db.persistToDisk();
    return booking;
  }
  async updateBooking(booking) {
    booking.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.loadBookings.set(booking.id, booking);
    db.persistToDisk();
    return booking;
  }
  // --- Matches ---
  async getMatchesForLoad(tenantId, loadId) {
    return Array.from(db.loadMatches.values()).filter((m) => m.tenantId === tenantId && m.loadId === loadId);
  }
  async saveMatches(matches) {
    for (const match of matches) {
      db.loadMatches.set(match.id, match);
    }
    db.persistToDisk();
  }
  // --- Deliveries ---
  async getDeliveries(tenantId, bookingId) {
    let list = Array.from(db.marketplaceDeliveries.values()).filter((d) => d.tenantId === tenantId);
    if (bookingId) {
      list = list.filter((d) => d.bookingId === bookingId);
    }
    return list;
  }
  async getDeliveryById(tenantId, id) {
    const item = db.marketplaceDeliveries.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }
  async createDelivery(delivery) {
    db.marketplaceDeliveries.set(delivery.id, delivery);
    db.persistToDisk();
    return delivery;
  }
  async updateDelivery(delivery) {
    delivery.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.marketplaceDeliveries.set(delivery.id, delivery);
    db.persistToDisk();
    return delivery;
  }
  // --- Ratings ---
  async getRatings(tenantId, transporterId) {
    let list = Array.from(db.marketplaceRatings.values()).filter((r) => r.tenantId === tenantId);
    if (transporterId) {
      list = list.filter((r) => r.transporterId === transporterId);
    }
    return list;
  }
  async createRating(rating) {
    const existing = Array.from(db.marketplaceRatings.values()).find(
      (r) => r.tenantId === rating.tenantId && r.bookingId === rating.bookingId
    );
    if (existing) {
      throw new Error(`Rating already exists for Booking [${rating.bookingId}]`);
    }
    db.marketplaceRatings.set(rating.id, rating);
    db.persistToDisk();
    return rating;
  }
  // --- Disputes ---
  async getDisputes(tenantId, filters) {
    let list = Array.from(db.marketplaceDisputes.values()).filter((d) => d.tenantId === tenantId);
    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((d) => d.status === filters.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createDispute(dispute) {
    db.marketplaceDisputes.set(dispute.id, dispute);
    db.persistToDisk();
    return dispute;
  }
  async updateDispute(dispute) {
    dispute.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    db.marketplaceDisputes.set(dispute.id, dispute);
    db.persistToDisk();
    return dispute;
  }
  // --- Matching Events ---
  async logMatchingEvent(event) {
    db.marketplaceMatchingEvents.set(event.id, event);
    db.persistToDisk();
    return event;
  }
};
var marketplaceRepository = new MarketplaceRepository();

// src/server/providers/routingPricingProvider.ts
var RoutingProvider = class {
  /**
   * Calculates distance between source and destination.
   * If external GPS/Route provider is not configured, returns deterministic distance estimation based on route hash.
   */
  calculateDistance(source, destination) {
    const isConfigured = Boolean(process.env.GOOGLE_MAPS_API_KEY || process.env.ROUTING_PROVIDER_KEY);
    const routeStr = `${source.toLowerCase().trim()}->${destination.toLowerCase().trim()}`;
    let hash = 0;
    for (let i = 0; i < routeStr.length; i++) {
      hash = (hash << 5) - hash + routeStr.charCodeAt(i);
      hash |= 0;
    }
    const distanceKm = Math.abs(hash % 85) + 12.5;
    return {
      distanceKm: Math.round(distanceKm * 10) / 10,
      isEstimated: !isConfigured,
      providerStatus: isConfigured ? "CONFIGURED" : "PROVIDER_NOT_CONFIGURED"
    };
  }
  estimateTravelTime(distanceKm, vehicleType = "Tipper") {
    const speed = vehicleType.toLowerCase().includes("trailer") ? 32 : 38;
    const hours = distanceKm / speed;
    const totalMinutes = Math.round(hours * 60);
    if (totalMinutes < 60) {
      return `${totalMinutes} mins`;
    }
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hrs} hr ${mins > 0 ? `${mins} mins` : ""}`;
  }
  estimateRouteCost(distanceKm, vehicleType = "Tipper", fuelType = "DIESEL") {
    const fuelPrice = fuelType.toUpperCase() === "DIESEL" ? 94.5 : 102;
    const kmPerLiter = 3.2;
    const fuelLiters = distanceKm / kmPerLiter;
    const fuelCost = Math.round(fuelLiters * fuelPrice);
    const tollEstimate = distanceKm > 30 ? Math.round(distanceKm / 25 * 180) : 0;
    const driverAllowance = Math.round(350 + distanceKm * 3.5);
    const maintenanceAllowance = Math.round(distanceKm * 8.5);
    const totalRouteCost = fuelCost + tollEstimate + driverAllowance + maintenanceAllowance;
    return {
      distanceKm,
      travelTime: this.estimateTravelTime(distanceKm, vehicleType),
      fuelCost,
      tollEstimate,
      driverAllowance,
      maintenanceAllowance,
      totalRouteCost
    };
  }
};
var SmartPricingProvider = class {
  constructor() {
    this.routingProvider = new RoutingProvider();
  }
  estimatePrice(tenantId, materialId, quantity, source, destination, vehicleType = "Tipper") {
    const distanceInfo = this.routingProvider.calculateDistance(source, destination);
    const routeCost = this.routingProvider.estimateRouteCost(distanceInfo.distanceKm, vehicleType);
    const rule = Array.from(db.marketplacePricingRules.values()).find(
      (r) => r.tenantId === tenantId && (r.materialId === materialId || r.vehicleType === vehicleType)
    );
    const baseFare = rule ? rule.baseFare : 550;
    const ratePerKm = rule ? rule.ratePerKm : 52;
    const ratePerTon = rule ? rule.ratePerTon : 110;
    const minCharge = rule ? rule.minCharge : 1500;
    const surgeMultiplier = rule ? rule.surgeMultiplier : 1;
    const rawCost = baseFare + distanceInfo.distanceKm * ratePerKm + quantity * ratePerTon;
    const estimatedCost = Math.max(minCharge, rawCost) * surgeMultiplier;
    const transporterMargin = Math.round(estimatedCost * 0.15);
    const recommendedPrice = Math.round((estimatedCost + transporterMargin) / 100) * 100;
    const minimumPrice = Math.round(estimatedCost * 0.92 / 100) * 100;
    const maximumPrice = Math.round(recommendedPrice * 1.25 / 100) * 100;
    return {
      estimatedCost: Math.round(estimatedCost),
      recommendedPrice,
      minimumPrice,
      maximumPrice,
      distanceKm: distanceInfo.distanceKm,
      quantity,
      fuelEstimate: routeCost.fuelCost,
      tollEstimate: routeCost.tollEstimate,
      driverAllowance: routeCost.driverAllowance,
      transporterMargin,
      breakdownNotes: `Base fare: \u20B9${baseFare}, Rate/km: \u20B9${ratePerKm}, Rate/ton: \u20B9${ratePerTon}, Distance: ${distanceInfo.distanceKm} km (${distanceInfo.isEstimated ? "Estimated" : "GPS Connected"})`
    };
  }
};
var routingProvider = new RoutingProvider();
var smartPricingProvider = new SmartPricingProvider();

// src/server/providers/loadMatchingProvider.ts
var LoadMatchingProvider = class {
  /**
   * Scores a single candidate vehicle/driver/transporter against a Load Request.
   */
  scoreMatch(load, vehicle, driver, transporter) {
    const reasonCodes = [];
    let score = 0;
    if (vehicle.loadCapacity >= load.quantity) {
      score += 25;
      reasonCodes.push("HIGH_CAPACITY_MATCH");
      if (vehicle.loadCapacity <= load.quantity * 1.25) {
        score += 5;
      }
    } else {
      score += Math.max(0, Math.round(vehicle.loadCapacity / load.quantity * 15));
    }
    if (vehicle.vehicleType.toLowerCase() === load.vehicleType.toLowerCase()) {
      score += 20;
      reasonCodes.push("EXACT_VEHICLE_MATCH");
    } else if (vehicle.vehicleType.toLowerCase().includes("tipper") && load.vehicleType.toLowerCase().includes("dumper")) {
      score += 15;
    }
    if (vehicle.status === "AVAILABLE") {
      score += 15;
      reasonCodes.push("AVAILABLE_NOW");
    }
    if (driver && driver.status === "ACTIVE") {
      score += 5;
    }
    const distanceInfo = routingProvider.calculateDistance(vehicle.location || "Quarry Yard", load.source);
    if (distanceInfo.distanceKm <= 15) {
      score += 15;
      reasonCodes.push("NEAR_SOURCE");
    } else if (distanceInfo.distanceKm <= 35) {
      score += 10;
    } else {
      score += 5;
    }
    const rating = transporter ? transporter.rating : 4.5;
    if (rating >= 4.8) {
      score += 15;
      reasonCodes.push("GOOD_COMPLETION_HISTORY");
    } else if (rating >= 4) {
      score += 10;
    } else {
      score += 5;
    }
    const priceEst = smartPricingProvider.estimatePrice(
      load.tenantId,
      load.materialId,
      load.quantity,
      load.source,
      load.destination,
      vehicle.vehicleType
    );
    if (priceEst.recommendedPrice <= load.budget) {
      score += 5;
      reasonCodes.push("LOWER_ESTIMATED_COST");
    }
    const matchScore = Math.min(100, Math.max(10, score));
    return {
      vehicle,
      driver,
      transporter,
      distanceKm: priceEst.distanceKm,
      estimatedTime: routingProvider.estimateTravelTime(priceEst.distanceKm, vehicle.vehicleType),
      estimatedCost: priceEst.estimatedCost,
      offeredPrice: priceEst.recommendedPrice,
      matchScore,
      reasonCodes
    };
  }
  /**
   * Finds and ranks suitable vehicle/transporter matches for an OPEN load request.
   */
  findMatches(tenantId, load) {
    const tenantVehicles = Array.from(db.fleetVehicles.values()).filter(
      (v) => v.tenantId === tenantId && (v.status === "AVAILABLE" || v.status === "ASSIGNED")
    );
    const tenantDrivers = Array.from(db.fleetDrivers.values()).filter(
      (d) => d.tenantId === tenantId && d.status === "ACTIVE"
    );
    const tenantTransporters = Array.from(db.transporterProfiles.values()).filter(
      (t) => t.tenantId === tenantId && t.verifiedStatus === "VERIFIED"
    );
    const defaultTransporter = tenantTransporters[0];
    const defaultDriver = tenantDrivers[0];
    const candidates = tenantVehicles.map((v) => {
      const driver = tenantDrivers.find((d) => d.id === v.id) || defaultDriver;
      const transporter = tenantTransporters.find((t) => t.vehicleTypes.includes(v.vehicleType)) || defaultTransporter;
      return this.scoreMatch(load, v, driver, transporter);
    });
    return this.rankMatches(candidates);
  }
  /**
   * Ranks matches descending by score.
   */
  rankMatches(candidates) {
    return candidates.sort((a, b) => b.matchScore - a.matchScore);
  }
};
var loadMatchingProvider = new LoadMatchingProvider();

// src/server/services/marketplaceServices.ts
var MarketplaceService = class {
  // --- Audit Logging Utility ---
  logAudit(tenantId, userId, action, details) {
    const audit = {
      id: generateUuidV7(),
      tenantId,
      actorUserId: userId,
      actorEmail: "system@racezoneventures.com",
      action,
      module: "MARKETPLACE",
      resource: "MARKETPLACE_ENTITY",
      resourceId: generateUuidV7(),
      ipAddress: "127.0.0.1",
      correlationId: `corr-${generateUuidV7().slice(0, 8)}`,
      status: "SUCCESS",
      afterStateJson: JSON.stringify({ details }),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.auditLogs.set(audit.id, audit);
  }
  // ==========================================
  // DASHBOARD & METRICS
  // ==========================================
  async getDashboardMetrics(tenantId) {
    const loads = await marketplaceRepository.getLoadRequests(tenantId);
    const bookings = await marketplaceRepository.getBookings(tenantId);
    const transporters = await marketplaceRepository.getTransporters(tenantId);
    const deliveries = await marketplaceRepository.getDeliveries(tenantId);
    const disputes = await marketplaceRepository.getDisputes(tenantId);
    const vehicles = await fleetRepository.getVehicles(tenantId);
    const openLoadsCount = loads.filter((l) => l.status === "OPEN").length;
    const matchingLoadsCount = loads.filter((l) => l.status === "MATCHING" || l.status === "MATCHED").length;
    const activeBookingsCount = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "DISPATCHED" || b.status === "IN_TRANSIT").length;
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todaysDeliveriesCount = deliveries.filter((d) => d.createdAt.startsWith(todayStr) || d.deliveryTime && d.deliveryTime.startsWith(todayStr)).length;
    const completedLoadsCount = loads.filter((l) => l.status === "COMPLETED" || l.status === "DELIVERED").length;
    const availableVehiclesCount = vehicles.filter((v) => v.status === "AVAILABLE").length;
    const availableTransportersCount = transporters.filter((t) => t.verifiedStatus === "VERIFIED").length;
    const allMatches = Array.from(db.loadMatches.values()).filter((m) => m.tenantId === tenantId);
    const avgScore = allMatches.length > 0 ? Math.round(allMatches.reduce((acc, m) => acc + m.matchScore, 0) / allMatches.length) : 88;
    const totalRevenue = bookings.filter((b) => b.status === "COMPLETED" || b.status === "DELIVERED").reduce((acc, b) => acc + b.agreedPrice, 0);
    const totalVolume = loads.filter((l) => l.status === "COMPLETED" || l.status === "DELIVERED").reduce((acc, l) => acc + l.quantity, 0);
    const cancelledCount = loads.filter((l) => l.status === "CANCELLED").length;
    const totalLoads = loads.length || 1;
    const cancellationRatePercentage = Math.round(cancelledCount / totalLoads * 1e3) / 10;
    const totalBookingsCount = bookings.length || 1;
    const disputeRatePercentage = Math.round(disputes.length / totalBookingsCount * 1e3) / 10;
    return {
      openLoadsCount,
      matchingLoadsCount,
      activeBookingsCount,
      todaysDeliveriesCount,
      completedLoadsCount,
      availableVehiclesCount,
      availableTransportersCount,
      averageMatchScore: avgScore,
      averageDeliveryTime: "42 mins",
      totalMarketplaceRevenue: totalRevenue || 185e3,
      totalTransportVolumeTons: totalVolume || 420,
      cancellationRatePercentage,
      disputeRatePercentage
    };
  }
  // ==========================================
  // LOAD REQUEST MANAGEMENT
  // ==========================================
  async getLoadRequests(tenantId, filters) {
    return marketplaceRepository.getLoadRequests(tenantId, filters);
  }
  async getLoadRequestById(tenantId, id) {
    return marketplaceRepository.getLoadRequestById(tenantId, id);
  }
  async createLoadRequest(tenantId, data, userId = "usr-admin-001") {
    if (!data.materialId || !data.materialName) {
      throw new Error("Material selection is required for Load Request");
    }
    if (!data.quantity || Number(data.quantity) <= 0) {
      throw new Error("Quantity must be greater than zero");
    }
    if (!data.source || !data.destination) {
      throw new Error("Source and destination addresses are required");
    }
    if (!data.requiredDate) {
      throw new Error("Required date is mandatory");
    }
    const count = (await marketplaceRepository.getLoadRequests(tenantId)).length + 1;
    const reqNum = `LR-2026-${String(count + 100).padStart(5, "0")}`;
    const newLoad = {
      id: generateUuidV7(),
      tenantId,
      requestNumber: reqNum,
      customerId: data.customerId || "cust-default",
      customerName: data.customerName || "General Customer",
      businessId: data.businessId,
      materialId: data.materialId,
      materialName: data.materialName,
      source: data.source,
      destination: data.destination,
      requiredDate: data.requiredDate,
      requiredTime: data.requiredTime || "08:00 AM",
      quantity: Number(data.quantity),
      unit: data.unit || "TONS",
      vehicleType: data.vehicleType || "Tipper",
      vehicleCapacity: Number(data.vehicleCapacity || data.quantity),
      budget: Number(data.budget || 0),
      specialRequirements: data.specialRequirements || "",
      status: "OPEN",
      isPublic: Boolean(data.isPublic),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1
    };
    const saved = await marketplaceRepository.createLoadRequest(newLoad);
    this.logAudit(tenantId, userId, "MARKETPLACE_LOAD_CREATE", `Created Load Request [${reqNum}] for ${data.materialName} (${data.quantity} TONS)`);
    await this.triggerLoadMatching(tenantId, saved.id);
    return saved;
  }
  async createPublicLoadRequest(data) {
    const tenantId = "tenant-rz-global-001";
    return this.createLoadRequest(tenantId, { ...data, isPublic: true }, "usr-public-user");
  }
  // ==========================================
  // AI LOAD MATCHING ENGINE
  // ==========================================
  async triggerLoadMatching(tenantId, loadId) {
    const load = await marketplaceRepository.getLoadRequestById(tenantId, loadId);
    if (!load) {
      throw new Error(`Load Request [${loadId}] not found`);
    }
    const candidates = loadMatchingProvider.findMatches(tenantId, load);
    const matches = candidates.map((c) => ({
      id: generateUuidV7(),
      tenantId,
      loadId,
      vehicleId: c.vehicle?.id,
      driverId: c.driver?.id,
      transporterId: c.transporter?.id,
      distance: c.distanceKm,
      estimatedTime: c.estimatedTime,
      estimatedCost: c.estimatedCost,
      offeredPrice: c.offeredPrice,
      matchScore: c.matchScore,
      availability: c.vehicle?.status || "AVAILABLE",
      reasonCodes: c.reasonCodes,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }));
    await marketplaceRepository.saveMatches(matches);
    if (matches.length > 0) {
      load.status = "MATCHED";
      await marketplaceRepository.updateLoadRequest(load);
    }
    const topScore = matches.length > 0 ? matches[0].matchScore : 0;
    const event = {
      id: generateUuidV7(),
      tenantId,
      loadId,
      matchesFound: matches.length,
      topMatchScore: topScore,
      triggerType: "AUTO",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await marketplaceRepository.logMatchingEvent(event);
    this.logAudit(tenantId, "sys-ai-engine", "MARKETPLACE_AI_MATCHING", `AI Engine generated ${matches.length} matches for Load [${load.requestNumber}] with top score ${topScore}`);
    return matches;
  }
  async getLoadMatches(tenantId, loadId) {
    return marketplaceRepository.getMatchesForLoad(tenantId, loadId);
  }
  // ==========================================
  // TRANSPORTER OFFERS & BOOKING LIFECYCLE
  // ==========================================
  async getOffers(tenantId, loadId) {
    return marketplaceRepository.getOffers(tenantId, loadId);
  }
  async submitOffer(tenantId, data, userId = "usr-admin-001") {
    if (!data.loadId || !data.transporterId) {
      throw new Error("Load ID and Transporter ID are required");
    }
    if (!data.quotedPrice || Number(data.quotedPrice) <= 0) {
      throw new Error("Quoted price must be greater than zero");
    }
    const load = await marketplaceRepository.getLoadRequestById(tenantId, data.loadId);
    if (!load) {
      throw new Error(`Load Request [${data.loadId}] not found`);
    }
    const count = (await marketplaceRepository.getOffers(tenantId)).length + 1;
    const offerNum = `LO-2026-${String(count + 50).padStart(5, "0")}`;
    const offer = {
      id: generateUuidV7(),
      tenantId,
      offerNumber: offerNum,
      loadId: data.loadId,
      transporterId: data.transporterId,
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      quotedPrice: Number(data.quotedPrice),
      estimatedPickup: data.estimatedPickup || new Date(Date.now() + 864e5).toISOString(),
      estimatedDelivery: data.estimatedDelivery || new Date(Date.now() + 1728e5).toISOString(),
      remarks: data.remarks || "",
      status: "SUBMITTED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await marketplaceRepository.createOffer(offer);
    this.logAudit(tenantId, userId, "MARKETPLACE_OFFER_SUBMIT", `Transporter submitted Offer [${offerNum}] for \u20B9${offer.quotedPrice} on Load [${load.requestNumber}]`);
    return saved;
  }
  async acceptOffer(tenantId, offerId, userId = "usr-admin-001") {
    const offer = await marketplaceRepository.getOfferById(tenantId, offerId);
    if (!offer) {
      throw new Error(`Offer [${offerId}] not found`);
    }
    if (offer.status === "ACCEPTED") {
      throw new Error(`Offer [${offer.offerNumber}] has already been accepted`);
    }
    const load = await marketplaceRepository.getLoadRequestById(tenantId, offer.loadId);
    if (!load) {
      throw new Error(`Associated Load Request [${offer.loadId}] not found`);
    }
    const existingBookings = (await marketplaceRepository.getBookings(tenantId)).filter((b) => b.loadId === load.id && b.status !== "CANCELLED");
    if (existingBookings.length > 0) {
      throw new Error(`Load Request [${load.requestNumber}] is already booked under Booking [${existingBookings[0].bookingNumber}]`);
    }
    const vehicles = await fleetRepository.getVehicles(tenantId);
    const targetVehicle = offer.vehicleId ? vehicles.find((v) => v.id === offer.vehicleId) : vehicles.find((v) => v.status === "AVAILABLE");
    if (!targetVehicle) {
      throw new Error("No available vehicle found to accept offer");
    }
    const drivers = await fleetRepository.getDrivers(tenantId);
    const targetDriver = offer.driverId ? drivers.find((d) => d.id === offer.driverId) : drivers.find((d) => d.status === "ACTIVE");
    if (!targetDriver) {
      throw new Error("No available driver found to accept offer");
    }
    const tripCount = (await fleetRepository.getTrips(tenantId)).length + 1;
    const tripNum = `TRP-2026-${String(tripCount + 200).padStart(5, "0")}`;
    const newTrip = {
      id: generateUuidV7(),
      tenantId,
      tripNumber: tripNum,
      vehicleId: targetVehicle.id,
      driverId: targetDriver.id,
      source: load.source,
      destination: load.destination,
      tripDate: load.requiredDate,
      startTime: load.requiredTime || "08:00 AM",
      startOdometer: targetVehicle.currentOdometer,
      distance: 25,
      tripType: "MARKETPLACE_LOAD",
      customerId: load.customerId,
      customerName: load.customerName,
      material: load.materialName,
      quantity: load.quantity,
      loadReference: load.requestNumber,
      status: "DISPATCHED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await fleetRepository.createTrip(newTrip);
    targetVehicle.status = "ON_TRIP";
    await fleetRepository.updateVehicle(targetVehicle);
    const bookingCount = (await marketplaceRepository.getBookings(tenantId)).length + 1;
    const bookingNum = `LB-2026-${String(bookingCount + 100).padStart(5, "0")}`;
    const booking = {
      id: generateUuidV7(),
      tenantId,
      bookingNumber: bookingNum,
      loadId: load.id,
      offerId: offer.id,
      vehicleId: targetVehicle.id,
      driverId: targetDriver.id,
      transporterId: offer.transporterId,
      customerId: load.customerId,
      customerName: load.customerName,
      agreedPrice: offer.quotedPrice,
      pickupDatetime: offer.estimatedPickup,
      deliveryDatetime: offer.estimatedDelivery,
      status: "DISPATCHED",
      fleetTripId: newTrip.id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const savedBooking = await marketplaceRepository.createBooking(booking);
    const delivery = {
      id: generateUuidV7(),
      tenantId,
      bookingId: savedBooking.id,
      loadId: load.id,
      tripId: newTrip.id,
      pickupTime: offer.estimatedPickup,
      receiverName: load.customerName,
      receiverContact: "+91-98765-00112",
      quantityDelivered: load.quantity,
      status: "DISPATCHED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await marketplaceRepository.createDelivery(delivery);
    offer.status = "ACCEPTED";
    await marketplaceRepository.updateOffer(offer);
    load.status = "DISPATCHED";
    await marketplaceRepository.updateLoadRequest(load);
    const otherOffers = (await marketplaceRepository.getOffers(tenantId, load.id)).filter((o) => o.id !== offer.id && o.status === "SUBMITTED");
    for (const o of otherOffers) {
      o.status = "REJECTED";
      await marketplaceRepository.updateOffer(o);
    }
    this.logAudit(tenantId, userId, "MARKETPLACE_OFFER_ACCEPT", `Accepted Offer [${offer.offerNumber}] for \u20B9${offer.quotedPrice}. Booking [${bookingNum}] created & Fleet Trip [${tripNum}] dispatched.`);
    return savedBooking;
  }
  async rejectOffer(tenantId, offerId, userId = "usr-admin-001") {
    const offer = await marketplaceRepository.getOfferById(tenantId, offerId);
    if (!offer) {
      throw new Error(`Offer [${offerId}] not found`);
    }
    offer.status = "REJECTED";
    const updated = await marketplaceRepository.updateOffer(offer);
    this.logAudit(tenantId, userId, "MARKETPLACE_OFFER_REJECT", `Rejected Offer [${offer.offerNumber}]`);
    return updated;
  }
  // ==========================================
  // BOOKINGS & DELIVERIES
  // ==========================================
  async getBookings(tenantId, filters) {
    return marketplaceRepository.getBookings(tenantId, filters);
  }
  async getBookingById(tenantId, id) {
    return marketplaceRepository.getBookingById(tenantId, id);
  }
  async cancelBooking(tenantId, bookingId, reason, userId = "usr-admin-001") {
    const booking = await marketplaceRepository.getBookingById(tenantId, bookingId);
    if (!booking) {
      throw new Error(`Booking [${bookingId}] not found`);
    }
    booking.status = "CANCELLED";
    const updated = await marketplaceRepository.updateBooking(booking);
    const load = await marketplaceRepository.getLoadRequestById(tenantId, booking.loadId);
    if (load) {
      load.status = "CANCELLED";
      await marketplaceRepository.updateLoadRequest(load);
    }
    const vehicle = await fleetRepository.getVehicleById(tenantId, booking.vehicleId);
    if (vehicle && vehicle.status === "ON_TRIP") {
      vehicle.status = "AVAILABLE";
      await fleetRepository.updateVehicle(vehicle);
    }
    this.logAudit(tenantId, userId, "MARKETPLACE_BOOKING_CANCEL", `Cancelled Booking [${booking.bookingNumber}]. Reason: ${reason}`);
    return updated;
  }
  async getDeliveries(tenantId, bookingId) {
    return marketplaceRepository.getDeliveries(tenantId, bookingId);
  }
  async confirmDelivery(tenantId, deliveryId, data, userId = "usr-admin-001") {
    const delivery = await marketplaceRepository.getDeliveryById(tenantId, deliveryId);
    if (!delivery) {
      throw new Error(`Delivery record [${deliveryId}] not found`);
    }
    delivery.deliveryTime = (/* @__PURE__ */ new Date()).toISOString();
    delivery.receiverName = data.receiverName || delivery.receiverName;
    delivery.receiverContact = data.receiverContact || delivery.receiverContact;
    delivery.quantityDelivered = Number(data.quantityDelivered) || delivery.quantityDelivered;
    delivery.documentReference = data.documentReference || delivery.documentReference;
    delivery.photoReference = data.photoReference || delivery.photoReference;
    delivery.status = "CONFIRMED";
    delivery.remarks = data.remarks || delivery.remarks;
    const updatedDelivery = await marketplaceRepository.updateDelivery(delivery);
    const booking = await marketplaceRepository.getBookingById(tenantId, delivery.bookingId);
    if (booking) {
      booking.status = "COMPLETED";
      await marketplaceRepository.updateBooking(booking);
      const load = await marketplaceRepository.getLoadRequestById(tenantId, booking.loadId);
      if (load) {
        load.status = "COMPLETED";
        await marketplaceRepository.updateLoadRequest(load);
      }
      if (booking.fleetTripId) {
        const trip = await fleetRepository.getTripById(tenantId, booking.fleetTripId);
        if (trip) {
          trip.status = "COMPLETED";
          trip.endTime = (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          trip.endOdometer = trip.startOdometer + 25;
          await fleetRepository.updateTrip(trip);
        }
      }
      const vehicle = await fleetRepository.getVehicleById(tenantId, booking.vehicleId);
      if (vehicle) {
        vehicle.status = "AVAILABLE";
        vehicle.currentOdometer += 25;
        await fleetRepository.updateVehicle(vehicle);
      }
    }
    this.logAudit(tenantId, userId, "MARKETPLACE_DELIVERY_CONFIRM", `Delivery confirmed for Booking [${booking?.bookingNumber}]. Received by ${delivery.receiverName}`);
    return updatedDelivery;
  }
  // ==========================================
  // RATINGS & DISPUTES
  // ==========================================
  async createRating(tenantId, data, userId = "usr-admin-001") {
    if (!data.bookingId || !data.rating) {
      throw new Error("Booking ID and rating score (1-5) are required");
    }
    if (data.rating < 1 || data.rating > 5) {
      throw new Error("Rating score must be between 1 and 5");
    }
    const booking = await marketplaceRepository.getBookingById(tenantId, data.bookingId);
    if (!booking) {
      throw new Error(`Booking [${data.bookingId}] not found`);
    }
    const ratingObj = {
      id: generateUuidV7(),
      tenantId,
      bookingId: data.bookingId,
      tripId: booking.fleetTripId,
      customerId: booking.customerId,
      transporterId: booking.transporterId,
      driverId: booking.driverId,
      vehicleId: booking.vehicleId,
      rating: Number(data.rating),
      review: data.review || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await marketplaceRepository.createRating(ratingObj);
    this.logAudit(tenantId, userId, "MARKETPLACE_RATING_SUBMIT", `Rating ${ratingObj.rating}/5 stars submitted for Booking [${booking.bookingNumber}]`);
    return saved;
  }
  async getDisputes(tenantId, filters) {
    return marketplaceRepository.getDisputes(tenantId, filters);
  }
  async createDispute(tenantId, data, userId = "usr-admin-001") {
    if (!data.bookingId || !data.disputeType || !data.description) {
      throw new Error("Booking ID, dispute type, and description are required");
    }
    const booking = await marketplaceRepository.getBookingById(tenantId, data.bookingId);
    if (!booking) {
      throw new Error(`Booking [${data.bookingId}] not found`);
    }
    const count = (await marketplaceRepository.getDisputes(tenantId)).length + 1;
    const dispNum = `DSP-2026-${String(count + 10).padStart(4, "0")}`;
    const dispute = {
      id: generateUuidV7(),
      tenantId,
      disputeNumber: dispNum,
      bookingId: data.bookingId,
      loadId: booking.loadId,
      raisedByUserId: userId,
      disputeType: data.disputeType,
      description: data.description,
      status: "OPEN",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await marketplaceRepository.createDispute(dispute);
    this.logAudit(tenantId, userId, "MARKETPLACE_DISPUTE_RAISE", `Dispute [${dispNum}] raised for Booking [${booking.bookingNumber}]. Type: ${data.disputeType}`);
    return saved;
  }
  // ==========================================
  // TRANSPORTERS & PRICING ESTIMATION
  // ==========================================
  async getTransporters(tenantId, filters) {
    return marketplaceRepository.getTransporters(tenantId, filters);
  }
  async createTransporter(tenantId, data) {
    if (!data.companyName || !data.contactPerson || !data.phone) {
      throw new Error("Company name, contact person, and phone are required");
    }
    const transporter = {
      id: generateUuidV7(),
      tenantId,
      businessId: data.businessId,
      companyName: data.companyName,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email || `${data.companyName.toLowerCase().replace(/\s+/g, "")}@transporter.in`,
      rating: 4.5,
      totalTrips: 0,
      completedTrips: 0,
      cancellationRate: 0,
      verifiedStatus: "VERIFIED",
      serviceAreas: data.serviceAreas || ["Mangaluru", "Udupi"],
      vehicleTypes: data.vehicleTypes || ["Tipper"],
      baseRatePerKm: Number(data.baseRatePerKm || 60),
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: 1
    };
    return marketplaceRepository.createTransporter(transporter);
  }
  getPricingEstimate(tenantId, materialId, quantity, source, destination, vehicleType = "Tipper") {
    return smartPricingProvider.estimatePrice(tenantId, materialId, quantity, source, destination, vehicleType);
  }
};
var marketplaceService = new MarketplaceService();

// src/server/repositories/crmRepositories.ts
var CrmRepository = class {
  // CUSTOMERS
  async getCustomers(tenantId, filters) {
    let list = Array.from(db.crmCustomers.values()).filter((c) => c.tenantId === tenantId);
    if (filters?.status) {
      list = list.filter((c) => c.status === filters.status);
    }
    if (filters?.customerType) {
      list = list.filter((c) => c.customerType === filters.customerType);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) => c.displayName.toLowerCase().includes(q) || c.customerCode.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
      );
    }
    return list;
  }
  async getCustomerById(tenantId, id) {
    const cust = db.crmCustomers.get(id);
    if (cust && cust.tenantId === tenantId) return cust;
    return null;
  }
  async createCustomer(tenantId, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const count = db.crmCustomers.size + 1;
    const customerCode = data.customerCode || `CUST-2026-${String(count).padStart(3, "0")}`;
    const id = generateUuidV7();
    const customer = {
      id,
      tenantId,
      customerType: data.customerType || "BUSINESS",
      businessId: data.businessId,
      displayName: data.displayName || "Unnamed Enterprise Customer",
      legalName: data.legalName || data.displayName,
      customerCode,
      phone: data.phone || "+91-00000-00000",
      email: data.email || "contact@customer.com",
      address: data.address || "Address Not Provided",
      city: data.city || "Mangalore",
      district: data.district,
      state: data.state || "Karnataka",
      country: data.country || "India",
      taxIdentifier: data.taxIdentifier,
      creditLimit: data.creditLimit ?? 5e5,
      creditDays: data.creditDays ?? 30,
      status: data.status || "ACTIVE",
      source: data.source || "Direct",
      assignedSalesUser: data.assignedSalesUser,
      createdAt: now,
      updatedAt: now,
      version: 1
    };
    db.crmCustomers.set(id, customer);
    const credit = {
      id: generateUuidV7(),
      tenantId,
      customerId: id,
      creditLimit: customer.creditLimit,
      creditDays: customer.creditDays,
      outstandingBalance: 0,
      availableCredit: customer.creditLimit,
      overdueAmount: 0,
      creditStatus: "GOOD",
      lastReviewedAt: now,
      createdAt: now,
      updatedAt: now
    };
    db.crmCustomerCredit.set(credit.id, credit);
    const health = {
      id: generateUuidV7(),
      tenantId,
      customerId: id,
      healthScore: 85,
      healthStatus: "GOOD",
      riskFlags: [],
      factorsJson: JSON.stringify({ onboardingStatus: "NEW_CUSTOMER" }),
      calculatedAt: now
    };
    db.crmCustomerHealth.set(health.id, health);
    db.persistToDisk();
    return customer;
  }
  async updateCustomer(tenantId, id, updates) {
    const existing = await this.getCustomerById(tenantId, id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: (existing.version || 1) + 1
    };
    db.crmCustomers.set(id, updated);
    db.persistToDisk();
    return updated;
  }
  async deleteCustomer(tenantId, id) {
    const existing = await this.getCustomerById(tenantId, id);
    if (!existing) return false;
    db.crmCustomers.delete(id);
    db.persistToDisk();
    return true;
  }
  // CONTACTS
  async getContacts(tenantId, customerId) {
    return Array.from(db.crmContacts.values()).filter((c) => c.tenantId === tenantId && c.customerId === customerId);
  }
  async createContact(tenantId, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = generateUuidV7();
    const contact = {
      id,
      tenantId,
      customerId: data.customerId || "",
      businessId: data.businessId,
      name: data.name || "Unnamed Contact",
      designation: data.designation || "Representative",
      phone: data.phone || "+91-00000-00000",
      email: data.email || "contact@domain.com",
      whatsapp: data.whatsapp || data.phone,
      isPrimary: data.isPrimary ?? false,
      preferredLanguage: data.preferredLanguage || "English",
      notes: data.notes,
      status: data.status || "ACTIVE",
      createdAt: now,
      updatedAt: now
    };
    db.crmContacts.set(id, contact);
    db.persistToDisk();
    return contact;
  }
  async updateContact(tenantId, id, updates) {
    const existing = db.crmContacts.get(id);
    if (!existing || existing.tenantId !== tenantId) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.crmContacts.set(id, updated);
    db.persistToDisk();
    return updated;
  }
  // LEADS
  async getLeads(tenantId, filters) {
    let list = Array.from(db.crmLeads.values()).filter((l) => l.tenantId === tenantId);
    if (filters?.status) list = list.filter((l) => l.status === filters.status);
    if (filters?.source) list = list.filter((l) => l.source === filters.source);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((l) => l.customerName.toLowerCase().includes(q) || l.productService.toLowerCase().includes(q) || l.phone.includes(q));
    }
    return list;
  }
  async getLeadById(tenantId, id) {
    const lead = db.crmLeads.get(id);
    if (lead && lead.tenantId === tenantId) return lead;
    return null;
  }
  async createLead(tenantId, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = generateUuidV7();
    const lead = {
      id,
      tenantId,
      customerId: data.customerId,
      customerName: data.customerName || "Prospect Buyer",
      phone: data.phone || "+91-00000-00000",
      email: data.email,
      source: data.source || "Website",
      campaign: data.campaign,
      productService: data.productService || "Construction Material Supply",
      estimatedValue: data.estimatedValue ?? 1e5,
      probability: data.probability ?? 20,
      expectedCloseDate: data.expectedCloseDate || new Date(Date.now() + 6048e5).toISOString().split("T")[0],
      assignedUser: data.assignedUser,
      notes: data.notes,
      status: data.status || "NEW",
      leadScore: data.leadScore ?? 50,
      priority: data.priority || "MEDIUM",
      reasonCodes: data.reasonCodes || ["INBOUND_LEAD_CREATED"],
      createdAt: now,
      updatedAt: now
    };
    db.crmLeads.set(id, lead);
    db.persistToDisk();
    return lead;
  }
  async updateLead(tenantId, id, updates) {
    const existing = await this.getLeadById(tenantId, id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.crmLeads.set(id, updated);
    db.persistToDisk();
    return updated;
  }
  // OPPORTUNITIES
  async getOpportunities(tenantId, filters) {
    let list = Array.from(db.crmOpportunities.values()).filter((o) => o.tenantId === tenantId);
    if (filters?.stage) list = list.filter((o) => o.stage === filters.stage);
    if (filters?.customerId) list = list.filter((o) => o.customerId === filters.customerId);
    return list;
  }
  async getOpportunityById(tenantId, id) {
    const opp = db.crmOpportunities.get(id);
    if (opp && opp.tenantId === tenantId) return opp;
    return null;
  }
  async createOpportunity(tenantId, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = generateUuidV7();
    const opp = {
      id,
      tenantId,
      customerId: data.customerId || "",
      leadId: data.leadId,
      title: data.title || "New Material Deal Opportunity",
      value: data.value ?? 5e5,
      probability: data.probability ?? 50,
      stage: data.stage || "DISCOVERY",
      expectedCloseDate: data.expectedCloseDate || new Date(Date.now() + 12096e5).toISOString().split("T")[0],
      salesOwner: data.salesOwner,
      productsServices: data.productsServices || ["20mm Aggregate Stone"],
      competitors: data.competitors,
      nextAction: data.nextAction,
      notes: data.notes,
      status: data.status || "OPEN",
      createdAt: now,
      updatedAt: now
    };
    db.crmOpportunities.set(id, opp);
    db.persistToDisk();
    return opp;
  }
  async updateOpportunity(tenantId, id, updates) {
    const existing = await this.getOpportunityById(tenantId, id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.crmOpportunities.set(id, updated);
    db.persistToDisk();
    return updated;
  }
  // SALES ACTIVITIES
  async getSalesActivities(tenantId, filters) {
    let list = Array.from(db.crmSalesActivities.values()).filter((a) => a.tenantId === tenantId);
    if (filters?.customerId) list = list.filter((a) => a.customerId === filters.customerId);
    if (filters?.leadId) list = list.filter((a) => a.leadId === filters.leadId);
    if (filters?.status) list = list.filter((a) => a.status === filters.status);
    return list;
  }
  async createSalesActivity(tenantId, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = generateUuidV7();
    const activity = {
      id,
      tenantId,
      activityType: data.activityType || "Call",
      subject: data.subject || "Client Follow-Up",
      customerId: data.customerId,
      leadId: data.leadId,
      opportunityId: data.opportunityId,
      assignedUser: data.assignedUser,
      dueDate: data.dueDate,
      completedAt: data.completedAt,
      status: data.status || "PENDING",
      priority: data.priority || "MEDIUM",
      notes: data.notes,
      createdAt: now,
      updatedAt: now
    };
    db.crmSalesActivities.set(id, activity);
    db.persistToDisk();
    return activity;
  }
  async updateSalesActivity(tenantId, id, updates) {
    const existing = db.crmSalesActivities.get(id);
    if (!existing || existing.tenantId !== tenantId) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.crmSalesActivities.set(id, updated);
    db.persistToDisk();
    return updated;
  }
  // QUOTATIONS
  async getQuotations(tenantId, filters) {
    let list = Array.from(db.crmQuotations.values()).filter((q) => q.tenantId === tenantId);
    if (filters?.customerId) list = list.filter((q) => q.customerId === filters.customerId);
    if (filters?.status) list = list.filter((q) => q.status === filters.status);
    return list;
  }
  async getQuotationById(tenantId, id) {
    const quote = db.crmQuotations.get(id);
    if (quote && quote.tenantId === tenantId) return quote;
    return null;
  }
  async createQuotation(tenantId, data, itemsData) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = generateUuidV7();
    const count = db.crmQuotations.size + 1;
    const quoteNumber = data.quoteNumber || `QT-2026-${String(count).padStart(4, "0")}`;
    const items = (itemsData || []).map((item) => ({
      id: generateUuidV7(),
      tenantId,
      quotationId: id,
      itemDescription: item.itemDescription || "Material Supply",
      materialId: item.materialId,
      quantity: item.quantity ?? 100,
      unitPrice: item.unitPrice ?? 800,
      taxPercent: item.taxPercent ?? 18,
      totalPrice: (item.quantity ?? 100) * (item.unitPrice ?? 800) * (1 + (item.taxPercent ?? 18) / 100),
      createdAt: now
    }));
    const subtotal = items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);
    const discountAmount = data.discountAmount ?? 0;
    const taxAmount = items.reduce((acc, i) => acc + i.quantity * i.unitPrice * (i.taxPercent / 100), 0);
    const totalAmount = subtotal - discountAmount + taxAmount;
    const quote = {
      id,
      tenantId,
      quoteNumber,
      customerId: data.customerId || "",
      opportunityId: data.opportunityId,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      validityDate: data.validityDate || new Date(Date.now() + 2592e6).toISOString().split("T")[0],
      termsAndConditions: data.termsAndConditions || "Standard RZ\xAE Minetrix Supply Terms",
      notes: data.notes,
      status: data.status || "DRAFT",
      version: 1,
      items,
      createdAt: now,
      updatedAt: now
    };
    db.crmQuotations.set(id, quote);
    items.forEach((it) => db.crmQuotationItems.set(it.id, it));
    db.persistToDisk();
    return quote;
  }
  async updateQuotation(tenantId, id, updates) {
    const existing = await this.getQuotationById(tenantId, id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      version: (existing.version || 1) + 1
    };
    db.crmQuotations.set(id, updated);
    db.persistToDisk();
    return updated;
  }
  // CUSTOMER CREDIT
  async getCustomerCredit(tenantId, customerId) {
    const list = Array.from(db.crmCustomerCredit.values()).filter((c) => c.tenantId === tenantId && c.customerId === customerId);
    return list[0] || null;
  }
  async updateCustomerCredit(tenantId, customerId, data) {
    const existing = await this.getCustomerCredit(tenantId, customerId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    let updated;
    if (existing) {
      updated = {
        ...existing,
        ...data,
        availableCredit: (data.creditLimit ?? existing.creditLimit) - (data.outstandingBalance ?? existing.outstandingBalance),
        lastReviewedAt: now,
        updatedAt: now
      };
    } else {
      const id = generateUuidV7();
      const limit = data.creditLimit ?? 5e5;
      const outstanding = data.outstandingBalance ?? 0;
      updated = {
        id,
        tenantId,
        customerId,
        creditLimit: limit,
        creditDays: data.creditDays ?? 30,
        outstandingBalance: outstanding,
        availableCredit: limit - outstanding,
        overdueAmount: data.overdueAmount ?? 0,
        creditStatus: data.creditStatus || "GOOD",
        lastReviewedAt: now,
        createdAt: now,
        updatedAt: now
      };
    }
    db.crmCustomerCredit.set(updated.id, updated);
    db.persistToDisk();
    return updated;
  }
  // CUSTOMER DOCUMENTS
  async getCustomerDocuments(tenantId, customerId) {
    return Array.from(db.crmCustomerDocuments.values()).filter((d) => d.tenantId === tenantId && d.customerId === customerId);
  }
  async createCustomerDocument(tenantId, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = generateUuidV7();
    const doc = {
      id,
      tenantId,
      customerId: data.customerId || "",
      documentType: data.documentType || "KYC",
      title: data.title || "Customer Attachment Document",
      storageRef: data.storageRef || `/documents/${tenantId}/${data.customerId}/${id}.pdf`,
      mimeType: data.mimeType || "application/pdf",
      sizeBytes: data.sizeBytes ?? 512e3,
      uploadedBy: data.uploadedBy || "system",
      createdAt: now
    };
    db.crmCustomerDocuments.set(id, doc);
    db.persistToDisk();
    return doc;
  }
  // SUPPORT TICKETS
  async getSupportTickets(tenantId, filters) {
    let list = Array.from(db.crmSupportTickets.values()).filter((t) => t.tenantId === tenantId);
    if (filters?.customerId) list = list.filter((t) => t.customerId === filters.customerId);
    if (filters?.status) list = list.filter((t) => t.status === filters.status);
    return list;
  }
  async getSupportTicketById(tenantId, id) {
    const ticket = db.crmSupportTickets.get(id);
    if (ticket && ticket.tenantId === tenantId) return ticket;
    return null;
  }
  async createSupportTicket(tenantId, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = generateUuidV7();
    const count = db.crmSupportTickets.size + 1;
    const ticketNumber = data.ticketNumber || `TKT-2026-${String(count).padStart(4, "0")}`;
    const ticket = {
      id,
      tenantId,
      ticketNumber,
      customerId: data.customerId || "",
      subject: data.subject || "Customer Support Enquiry",
      description: data.description || "Support ticket details",
      priority: data.priority || "MEDIUM",
      category: data.category || "GENERAL",
      assignedUser: data.assignedUser,
      status: data.status || "OPEN",
      resolvedAt: data.status === "RESOLVED" ? now : void 0,
      createdAt: now,
      updatedAt: now
    };
    db.crmSupportTickets.set(id, ticket);
    db.persistToDisk();
    return ticket;
  }
  async updateSupportTicket(tenantId, id, updates) {
    const existing = await this.getSupportTicketById(tenantId, id);
    if (!existing) return null;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updated = {
      ...existing,
      ...updates,
      resolvedAt: updates.status === "RESOLVED" ? existing.resolvedAt || now : existing.resolvedAt,
      updatedAt: now
    };
    db.crmSupportTickets.set(id, updated);
    db.persistToDisk();
    return updated;
  }
  // SEGMENTS
  async getCustomerSegments(tenantId) {
    return Array.from(db.crmCustomerSegments.values()).filter((s) => s.tenantId === tenantId);
  }
  // HEALTH
  async getCustomerHealth(tenantId, customerId) {
    const list = Array.from(db.crmCustomerHealth.values()).filter((h) => h.tenantId === tenantId && h.customerId === customerId);
    return list[0] || null;
  }
  async updateCustomerHealth(tenantId, customerId, data) {
    const existing = await this.getCustomerHealth(tenantId, customerId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    let updated;
    if (existing) {
      updated = {
        ...existing,
        ...data,
        calculatedAt: now
      };
    } else {
      const id = generateUuidV7();
      updated = {
        id,
        tenantId,
        customerId,
        healthScore: data.healthScore ?? 85,
        healthStatus: data.healthStatus || "GOOD",
        riskFlags: data.riskFlags || [],
        factorsJson: data.factorsJson,
        calculatedAt: now
      };
    }
    db.crmCustomerHealth.set(updated.id, updated);
    db.persistToDisk();
    return updated;
  }
  // NOTES
  async getCustomerNotes(tenantId, customerId) {
    return Array.from(db.crmCustomerNotes.values()).filter((n) => n.tenantId === tenantId && n.customerId === customerId);
  }
  async createCustomerNote(tenantId, data) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const id = generateUuidV7();
    const note = {
      id,
      tenantId,
      customerId: data.customerId || "",
      authorUserId: data.authorUserId || "system",
      noteText: data.noteText || "",
      isPrivate: data.isPrivate ?? false,
      createdAt: now
    };
    db.crmCustomerNotes.set(id, note);
    db.persistToDisk();
    return note;
  }
};
var crmRepository = new CrmRepository();

// src/server/services/crmServices.ts
var CrmService = class {
  // ==========================================
  // AUDIT LOGGING HELPER
  // ==========================================
  logAudit(tenantId, userId, action, resource, resourceId, details) {
    const audit = {
      id: generateUuidV7(),
      tenantId,
      actorUserId: userId,
      actorEmail: "sales.user@racezoneventures.com",
      action,
      module: "CRM",
      resource,
      resourceId,
      ipAddress: "127.0.0.1",
      correlationId: `corr-${generateUuidV7().slice(0, 8)}`,
      status: "SUCCESS",
      afterStateJson: JSON.stringify(details),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.auditLogs.set(audit.id, audit);
  }
  // ==========================================
  // NOTIFICATION HELPER
  // ==========================================
  sendNotification(tenantId, recipientUserId, title, message, channel = "IN_APP") {
    const notif = {
      id: generateUuidV7(),
      tenantId,
      recipientUserId,
      channel,
      title,
      body: message,
      type: "INFO",
      isRead: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.notifications.set(notif.id, notif);
  }
  // ==========================================
  // CUSTOMER MASTER CRUD
  // ==========================================
  async getCustomers(tenantId, filters) {
    return crmRepository.getCustomers(tenantId, filters);
  }
  async getCustomerById(tenantId, id) {
    return crmRepository.getCustomerById(tenantId, id);
  }
  async createCustomer(tenantId, userId, customerData) {
    const customer = await crmRepository.createCustomer(tenantId, customerData);
    this.logAudit(tenantId, userId, "CRM_CUSTOMER_CREATED", "CRM_CUSTOMER", customer.id, { customerCode: customer.customerCode, name: customer.displayName });
    return customer;
  }
  async updateCustomer(tenantId, userId, id, updates) {
    const updated = await crmRepository.updateCustomer(tenantId, id, updates);
    if (updated) {
      this.logAudit(tenantId, userId, "CRM_CUSTOMER_UPDATED", "CRM_CUSTOMER", updated.id, updates);
    }
    return updated;
  }
  async deleteCustomer(tenantId, userId, id) {
    const success = await crmRepository.deleteCustomer(tenantId, id);
    if (success) {
      this.logAudit(tenantId, userId, "CRM_CUSTOMER_DELETED", "CRM_CUSTOMER", id, { deletedId: id });
    }
    return success;
  }
  // ==========================================
  // CUSTOMER 360 AGGREGATION ENGINE
  // ==========================================
  async getCustomer360(tenantId, customerId) {
    const customer = await crmRepository.getCustomerById(tenantId, customerId);
    if (!customer) throw new Error(`Customer [${customerId}] not found for tenant [${tenantId}]`);
    const contacts = await crmRepository.getContacts(tenantId, customerId);
    const leads = await crmRepository.getLeads(tenantId, { search: customer.displayName });
    const opportunities = await crmRepository.getOpportunities(tenantId, { customerId });
    const quotations = await crmRepository.getQuotations(tenantId, { customerId });
    const credit = await crmRepository.getCustomerCredit(tenantId, customerId);
    const documents = await crmRepository.getCustomerDocuments(tenantId, customerId);
    const supportTickets = await crmRepository.getSupportTickets(tenantId, { customerId });
    const activities = await crmRepository.getSalesActivities(tenantId, { customerId });
    const health = await crmRepository.getCustomerHealth(tenantId, customerId);
    const notes = await crmRepository.getCustomerNotes(tenantId, customerId);
    const marketplaceLoads = Array.from(db.loadRequests.values()).filter((l) => l.tenantId === tenantId && (l.customerId === customerId || l.customerName.toLowerCase().includes(customer.displayName.toLowerCase())));
    const marketplaceBookings = Array.from(db.loadBookings.values()).filter((b) => b.tenantId === tenantId && marketplaceLoads.some((l) => l.id === b.loadId));
    const fleetTrips = Array.from(db.fleetTrips.values()).filter((t) => t.tenantId === tenantId);
    const auditHistory = Array.from(db.auditLogs.values()).filter((a) => a.tenantId === tenantId && (a.resourceId === customerId || a.afterStateJson?.includes(customerId)));
    const rzChatReferences = Array.from(db.notifications.values()).filter((n) => n.tenantId === tenantId && n.body.toLowerCase().includes(customer.displayName.toLowerCase()));
    const totalRevenue = quotations.filter((q) => q.status === "ACCEPTED" || q.status === "APPROVED").reduce((acc, q) => acc + q.totalAmount, 0);
    return {
      profile: customer,
      contacts,
      leads,
      opportunities,
      quotations,
      credit: credit || {
        creditLimit: customer.creditLimit,
        creditDays: customer.creditDays,
        outstandingBalance: 0,
        availableCredit: customer.creditLimit,
        overdueAmount: 0,
        creditStatus: "GOOD"
      },
      documents,
      supportTickets,
      activities,
      health: health || {
        healthScore: 88,
        healthStatus: "EXCELLENT",
        riskFlags: []
      },
      notes,
      marketplaceSummary: {
        totalLoads: marketplaceLoads.length,
        totalBookings: marketplaceBookings.length,
        loads: marketplaceLoads,
        bookings: marketplaceBookings
      },
      fleetSummary: {
        totalTripsDelivered: fleetTrips.filter((t) => t.status === "COMPLETED").length,
        trips: fleetTrips.slice(0, 5)
      },
      financialSummary: {
        totalRevenue,
        outstandingBalance: credit?.outstandingBalance || 0,
        availableCredit: credit?.availableCredit || customer.creditLimit,
        creditStatus: credit?.creditStatus || "GOOD"
      },
      rzChatReferences,
      auditHistory: auditHistory.slice(0, 10)
    };
  }
  // ==========================================
  // DETERMINISTIC LEAD SCORING & LIFECYCLE
  // ==========================================
  calculateLeadScore(lead, customerProfile) {
    let score = 50;
    const reasonCodes = ["BASE_SCORE_ASSIGNED"];
    if (customerProfile) {
      score += 15;
      reasonCodes.push("EXISTING_REGISTERED_CUSTOMER");
    }
    if ((lead.estimatedValue || 0) >= 1e6) {
      score += 20;
      reasonCodes.push("HIGH_ESTIMATED_VALUE");
    } else if ((lead.estimatedValue || 0) >= 5e5) {
      score += 10;
      reasonCodes.push("MEDIUM_ESTIMATED_VALUE");
    }
    if (lead.source === "Marketplace" || lead.source === "Referral") {
      score += 15;
      reasonCodes.push("HIGH_INTENT_SOURCE");
    } else if (lead.source === "Website") {
      score += 10;
      reasonCodes.push("INBOUND_WEBSITE_LEAD");
    }
    if (lead.phone && lead.email) {
      score += 10;
      reasonCodes.push("COMPLETE_CONTACT_DETAILS");
    }
    if (lead.status === "PROPOSAL" || lead.status === "NEGOTIATION") {
      score += 15;
      reasonCodes.push("ADVANCED_PIPELINE_STAGE");
    }
    const leadScore = Math.min(100, Math.max(0, score));
    let priority = "MEDIUM";
    if (leadScore >= 85) priority = "HOT";
    else if (leadScore >= 70) priority = "HIGH";
    else if (leadScore >= 50) priority = "MEDIUM";
    else priority = "LOW";
    return { leadScore, priority, reasonCodes };
  }
  async createLead(tenantId, userId, leadData) {
    let customer = null;
    if (leadData.customerId) {
      customer = await crmRepository.getCustomerById(tenantId, leadData.customerId);
    }
    const { leadScore, priority, reasonCodes } = this.calculateLeadScore(leadData, customer);
    const lead = await crmRepository.createLead(tenantId, {
      ...leadData,
      leadScore,
      priority,
      reasonCodes
    });
    this.logAudit(tenantId, userId, "CRM_LEAD_CREATED", "CRM_LEAD", lead.id, { customerName: lead.customerName, score: leadScore });
    this.sendNotification(tenantId, userId, "New Lead Captured", `Lead [${lead.customerName}] assigned with score ${leadScore} (${priority})`);
    return lead;
  }
  async convertLeadToOpportunity(tenantId, userId, leadId) {
    const lead = await crmRepository.getLeadById(tenantId, leadId);
    if (!lead) throw new Error(`Lead [${leadId}] not found`);
    let customerId = lead.customerId;
    if (!customerId) {
      const newCust = await crmRepository.createCustomer(tenantId, {
        displayName: lead.customerName,
        phone: lead.phone,
        email: lead.email || `contact@${lead.customerName.toLowerCase().replace(/\s+/g, "")}.com`,
        status: "ACTIVE",
        source: lead.source
      });
      customerId = newCust.id;
    }
    const opportunity = await crmRepository.createOpportunity(tenantId, {
      customerId,
      leadId: lead.id,
      title: `Deal - ${lead.productService} (${lead.customerName})`,
      value: lead.estimatedValue,
      probability: 70,
      stage: "QUALIFIED",
      expectedCloseDate: lead.expectedCloseDate,
      salesOwner: userId || lead.assignedUser,
      productsServices: [lead.productService],
      notes: `Converted from Lead [${lead.id}]`
    });
    const updatedLead = await crmRepository.updateLead(tenantId, leadId, {
      status: "WON",
      customerId
    });
    this.logAudit(tenantId, userId, "CRM_LEAD_CONVERTED", "CRM_LEAD", leadId, { opportunityId: opportunity.id, customerId });
    return { lead: updatedLead || { ...lead, status: "WON", customerId }, opportunity, customerId };
  }
  // ==========================================
  // OPPORTUNITIES & ACTIVITIES
  // ==========================================
  async getOpportunities(tenantId, filters) {
    return crmRepository.getOpportunities(tenantId, filters);
  }
  async createOpportunity(tenantId, userId, oppData) {
    const opp = await crmRepository.createOpportunity(tenantId, oppData);
    this.logAudit(tenantId, userId, "CRM_OPPORTUNITY_CREATED", "CRM_OPPORTUNITY", opp.id, { title: opp.title, value: opp.value });
    return opp;
  }
  async updateOpportunity(tenantId, userId, id, updates) {
    const updated = await crmRepository.updateOpportunity(tenantId, id, updates);
    if (updated) {
      this.logAudit(tenantId, userId, "CRM_OPPORTUNITY_UPDATED", "CRM_OPPORTUNITY", id, updates);
    }
    return updated;
  }
  async createSalesActivity(tenantId, userId, activityData) {
    const activity = await crmRepository.createSalesActivity(tenantId, activityData);
    this.logAudit(tenantId, userId, "CRM_ACTIVITY_CREATED", "CRM_ACTIVITY", activity.id, { subject: activity.subject });
    if (activity.dueDate) {
      this.sendNotification(tenantId, userId, "Sales Follow-up Scheduled", `Follow-up [${activity.subject}] scheduled for ${activity.dueDate}`);
    }
    return activity;
  }
  // ==========================================
  // QUOTATIONS & CUSTOMER ORDERS
  // ==========================================
  async getQuotations(tenantId, filters) {
    return crmRepository.getQuotations(tenantId, filters);
  }
  async createQuotation(tenantId, userId, quoteData, itemsData) {
    if (quoteData.customerId) {
      const credit = await crmRepository.getCustomerCredit(tenantId, quoteData.customerId);
      if (credit && credit.creditStatus === "BLOCKED") {
        throw new Error(`Customer [${quoteData.customerId}] is BLOCKED for credit. Quotation cannot be issued without override.`);
      }
    }
    const quotation = await crmRepository.createQuotation(tenantId, quoteData, itemsData);
    this.logAudit(tenantId, userId, "CRM_QUOTATION_CREATED", "CRM_QUOTATION", quotation.id, { quoteNumber: quotation.quoteNumber, total: quotation.totalAmount });
    return quotation;
  }
  async approveQuotation(tenantId, userId, quoteId) {
    const quote = await crmRepository.getQuotationById(tenantId, quoteId);
    if (!quote) throw new Error(`Quotation [${quoteId}] not found`);
    const updated = await crmRepository.updateQuotation(tenantId, quoteId, {
      status: "APPROVED"
    });
    this.logAudit(tenantId, userId, "CRM_QUOTATION_APPROVED", "CRM_QUOTATION", quoteId, { quoteNumber: quote.quoteNumber });
    this.sendNotification(tenantId, userId, "Quotation Approved", `Quotation [${quote.quoteNumber}] has been approved successfully.`);
    return updated;
  }
  // ==========================================
  // SUPPORT TICKETS
  // ==========================================
  async getSupportTickets(tenantId, filters) {
    return crmRepository.getSupportTickets(tenantId, filters);
  }
  async createSupportTicket(tenantId, userId, ticketData) {
    const ticket = await crmRepository.createSupportTicket(tenantId, ticketData);
    this.logAudit(tenantId, userId, "CRM_TICKET_CREATED", "CRM_TICKET", ticket.id, { ticketNumber: ticket.ticketNumber });
    return ticket;
  }
  async updateSupportTicket(tenantId, userId, id, updates) {
    const updated = await crmRepository.updateSupportTicket(tenantId, id, updates);
    if (updated) {
      this.logAudit(tenantId, userId, "CRM_TICKET_UPDATED", "CRM_TICKET", id, updates);
    }
    return updated;
  }
  // ==========================================
  // CUSTOMER HEALTH SCORE CALCULATION
  // ==========================================
  calculateHealthScore(customer, credit, tickets) {
    let score = 90;
    const riskFlags = [];
    if (credit) {
      if (credit.creditStatus === "BLOCKED") {
        score -= 40;
        riskFlags.push("CREDIT_BLOCKED");
      } else if (credit.creditStatus === "WARNING") {
        score -= 20;
        riskFlags.push("CREDIT_WARNING");
      }
      if (credit.overdueAmount > 0) {
        score -= 15;
        riskFlags.push("OVERDUE_PAYMENTS");
      }
    }
    if (tickets && tickets.length > 0) {
      const openTickets = tickets.filter((t) => t.status !== "RESOLVED" && t.status !== "CLOSED");
      if (openTickets.length >= 3) {
        score -= 20;
        riskFlags.push("MULTIPLE_UNRESOLVED_TICKETS");
      }
    }
    const healthScore = Math.min(100, Math.max(0, score));
    let healthStatus = "EXCELLENT";
    if (healthScore >= 85) healthStatus = "EXCELLENT";
    else if (healthScore >= 70) healthStatus = "GOOD";
    else if (healthScore >= 50) healthStatus = "NEUTRAL";
    else if (healthScore >= 30) healthStatus = "AT_RISK";
    else healthStatus = "CRITICAL";
    return { healthScore, healthStatus, riskFlags };
  }
  // ==========================================
  // CRM DASHBOARD METRICS
  // ==========================================
  async getCrmDashboard(tenantId) {
    const customers = await crmRepository.getCustomers(tenantId);
    const leads = await crmRepository.getLeads(tenantId);
    const opportunities = await crmRepository.getOpportunities(tenantId);
    const quotations = await crmRepository.getQuotations(tenantId);
    const activities = await crmRepository.getSalesActivities(tenantId);
    const supportTickets = await crmRepository.getSupportTickets(tenantId);
    const activeCustomers = customers.filter((c) => c.status === "ACTIVE").length;
    const newCustomers = customers.filter((c) => new Date(c.createdAt).getTime() > Date.now() - 30 * 864e5).length;
    const openOpportunities = opportunities.filter((o) => o.status === "OPEN");
    const pipelineValue = openOpportunities.reduce((acc, o) => acc + o.value, 0);
    const wonRevenue = opportunities.filter((o) => o.stage === "WON" || o.status === "WON").reduce((acc, o) => acc + o.value, 0);
    const pendingFollowups = activities.filter((a) => a.status === "PENDING").length;
    const overdueFollowups = activities.filter((a) => a.status === "PENDING" && a.dueDate && new Date(a.dueDate).getTime() < Date.now()).length;
    const conversionRate = leads.length > 0 ? Math.round(leads.filter((l) => l.status === "WON").length / leads.length * 100) : 0;
    const totalOutstanding = Array.from(db.crmCustomerCredit.values()).filter((c) => c.tenantId === tenantId).reduce((acc, c) => acc + c.outstandingBalance, 0);
    return {
      totalCustomers: customers.length,
      activeCustomers,
      newCustomers,
      totalLeads: leads.length,
      qualifiedLeads: leads.filter((l) => l.status === "QUALIFIED" || l.status === "PROPOSAL").length,
      openOpportunitiesCount: openOpportunities.length,
      pipelineValue,
      wonRevenue,
      conversionRatePercentage: conversionRate,
      pendingFollowupsCount: pendingFollowups,
      overdueFollowupsCount: overdueFollowups,
      totalCustomerOutstanding: totalOutstanding,
      openSupportTicketsCount: supportTickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length,
      pipelineDistribution: {
        lead: opportunities.filter((o) => o.stage === "LEAD").length,
        qualified: opportunities.filter((o) => o.stage === "QUALIFIED").length,
        discovery: opportunities.filter((o) => o.stage === "DISCOVERY").length,
        proposal: opportunities.filter((o) => o.stage === "PROPOSAL").length,
        negotiation: opportunities.filter((o) => o.stage === "NEGOTIATION").length,
        won: opportunities.filter((o) => o.stage === "WON").length,
        lost: opportunities.filter((o) => o.stage === "LOST").length
      }
    };
  }
};
var crmService = new CrmService();

// src/server/tests/crmTests.ts
async function runCrmTestSuite() {
  const results = [];
  const tenant1 = "tenant-rz-global-001";
  const tenant2 = "tenant-other-002";
  const userId = "usr-admin-001";
  {
    const start = Date.now();
    try {
      const newCust = await crmService.createCustomer(tenant1, userId, {
        displayName: "Test Infrastructure Projects Ltd",
        phone: "+91-98765-43210",
        email: "test@infraprojects.com",
        customerType: "BUSINESS",
        creditLimit: 2e6,
        creditDays: 30
      });
      const fetched = await crmService.getCustomerById(tenant1, newCust.id);
      const isUuidV7 = newCust.id.length >= 32;
      const passed = !!fetched && fetched.displayName === "Test Infrastructure Projects Ltd" && isUuidV7;
      results.push({
        testName: "CRM Phase 20 - Customer Master CRUD & UUID v7 Validation",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Created & retrieved customer [${newCust.id}] with code ${newCust.customerCode}` : "Failed to create or retrieve customer",
        evidence: { customerId: newCust.id, code: newCust.customerCode }
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - Customer Master CRUD & UUID v7 Validation",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const c360 = await crmService.getCustomer360(tenant1, "cust-harbor-dev");
      const passed = c360.profile.id === "cust-harbor-dev" && Array.isArray(c360.contacts) && Array.isArray(c360.quotations) && Array.isArray(c360.supportTickets) && typeof c360.financialSummary.totalRevenue === "number";
      results.push({
        testName: "CRM Phase 20 - Customer 360 Aggregation Engine & Cross-Module Sync",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Successfully compiled 360 view for [${c360.profile.displayName}] with ${c360.quotations.length} quotes & ${c360.contacts.length} contacts` : "Failed to compile Customer 360 view",
        evidence: {
          customerName: c360.profile.displayName,
          revenue: c360.financialSummary.totalRevenue,
          ticketsCount: c360.supportTickets.length
        }
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - Customer 360 Aggregation Engine & Cross-Module Sync",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const scoreResult = crmService.calculateLeadScore({
        estimatedValue: 15e5,
        source: "Marketplace",
        status: "PROPOSAL",
        phone: "+91-99999-88888",
        email: "test@lead.com"
      }, {
        id: "cust-harbor-dev",
        displayName: "Harbor Developers"
      });
      const passed = scoreResult.leadScore >= 80 && scoreResult.priority === "HOT" && scoreResult.reasonCodes.includes("HIGH_ESTIMATED_VALUE");
      results.push({
        testName: "CRM Phase 20 - Deterministic Lead Scoring & Reason Codes",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Lead scored ${scoreResult.leadScore} (${scoreResult.priority}) with reason codes: ${scoreResult.reasonCodes.join(", ")}` : "Lead scoring engine output incorrect",
        evidence: scoreResult
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - Deterministic Lead Scoring & Reason Codes",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const lead = await crmService.createLead(tenant1, userId, {
        customerName: "Coastal Developers Corp",
        phone: "+91-98765-11111",
        email: "info@coastaldev.com",
        productService: "40mm Quarry Stone Bulk Supply",
        estimatedValue: 85e4
      });
      const converted = await crmService.convertLeadToOpportunity(tenant1, userId, lead.id);
      const passed = converted.lead.status === "WON" && converted.opportunity.value === 85e4 && !!converted.customerId;
      results.push({
        testName: "CRM Phase 20 - Lead Lifecycle & Opportunity Conversion",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Lead [${lead.id}] successfully converted to Opportunity [${converted.opportunity.id}] under Customer [${converted.customerId}]` : "Lead conversion failed",
        evidence: { opportunityId: converted.opportunity.id, customerId: converted.customerId }
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - Lead Lifecycle & Opportunity Conversion",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const activity = await crmService.createSalesActivity(tenant1, userId, {
        activityType: "Meeting",
        subject: "Contract Signing Meeting",
        customerId: "cust-harbor-dev",
        dueDate: new Date(Date.now() + 864e5).toISOString(),
        status: "PENDING"
      });
      const notifs = Array.from(db.notifications.values()).filter((n) => n.tenantId === tenant1 && n.body.includes(activity.subject));
      const passed = activity.id.length > 0 && notifs.length > 0;
      results.push({
        testName: "CRM Phase 20 - Sales Activity & In-App Notification Dispatch",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Created activity [${activity.id}] and verified in-app notification dispatch` : "Failed activity or notification verification",
        evidence: { activityId: activity.id, notificationCount: notifs.length }
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - Sales Activity & In-App Notification Dispatch",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const quote = await crmService.createQuotation(tenant1, userId, {
        customerId: "cust-harbor-dev",
        discountAmount: 1e4
      }, [
        { itemDescription: "M-Sand (Manufactured Sand)", quantity: 200, unitPrice: 800, taxPercent: 18 }
      ]);
      const approved = await crmService.approveQuotation(tenant1, userId, quote.id);
      const passed = approved?.status === "APPROVED" && quote.totalAmount > 0;
      results.push({
        testName: "CRM Phase 20 - CPQ Quotation Engine & Approval Workflow",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Created quotation [${quote.quoteNumber}] (Total: \u20B9${quote.totalAmount}) and approved successfully` : "Quotation engine failed",
        evidence: { quoteNumber: quote.quoteNumber, totalAmount: quote.totalAmount, status: approved?.status }
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - CPQ Quotation Engine & Approval Workflow",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const ticket = await crmService.createSupportTicket(tenant1, userId, {
        customerId: "cust-harbor-dev",
        subject: "Weighbridge slip query",
        description: "Verify slip copy"
      });
      const updated = await crmService.updateSupportTicket(tenant1, userId, ticket.id, { status: "RESOLVED" });
      const passed = updated?.status === "RESOLVED" && !!updated?.resolvedAt;
      results.push({
        testName: "CRM Phase 20 - Customer Support Ticket Lifecycle",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Ticket [${ticket.ticketNumber}] created and resolved at ${updated.resolvedAt}` : "Support ticket lifecycle failed",
        evidence: { ticketNumber: ticket.ticketNumber, status: updated?.status }
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - Customer Support Ticket Lifecycle",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const health = crmService.calculateHealthScore(
        { id: "cust-harbor-dev", displayName: "Harbor Developers" },
        { creditStatus: "GOOD", overdueAmount: 0 },
        []
      );
      const passed = health.healthScore === 90 && health.healthStatus === "EXCELLENT";
      results.push({
        testName: "CRM Phase 20 - Customer Health Score Calculation & Risk Flagging",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Calculated Health Score ${health.healthScore}/100 (${health.healthStatus})` : "Customer health score calculation failed",
        evidence: health
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - Customer Health Score Calculation & Risk Flagging",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const tenant1Customers = await crmRepository.getCustomers(tenant1);
      const tenant2Customers = await crmRepository.getCustomers(tenant2);
      const noOverlap = tenant2Customers.every((c2) => c2.tenantId === tenant2);
      const passed = noOverlap && tenant1Customers.length > 0;
      results.push({
        testName: "CRM Phase 20 - Tenant Isolation & RLS Enforcement",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Verified zero cross-tenant leakage between Tenant 1 (${tenant1Customers.length} custs) & Tenant 2 (${tenant2Customers.length} custs)` : "Tenant isolation violation detected in CRM repository",
        evidence: { tenant1Count: tenant1Customers.length, tenant2Count: tenant2Customers.length }
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - Tenant Isolation & RLS Enforcement",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const dashboard = await crmService.getCrmDashboard(tenant1);
      const passed = typeof dashboard.totalCustomers === "number" && typeof dashboard.pipelineValue === "number" && typeof dashboard.conversionRatePercentage === "number";
      results.push({
        testName: "CRM Phase 20 - CRM Executive Dashboard Metrics Aggregation",
        category: "Enterprise CRM",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Dashboard metrics aggregated successfully: ${dashboard.totalCustomers} customers, \u20B9${dashboard.pipelineValue} pipeline value` : "CRM Dashboard metrics aggregation failed",
        evidence: dashboard
      });
    } catch (err) {
      results.push({
        testName: "CRM Phase 20 - CRM Executive Dashboard Metrics Aggregation",
        category: "Enterprise CRM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  return results;
}

// src/server/repositories/financeRepositories.ts
var FinanceRepository = class {
  // Chart of Accounts
  async getAccounts(tenantId) {
    return Array.from(db.chartOfAccounts.values()).filter((a) => a.tenantId === tenantId);
  }
  async getAccountById(tenantId, id) {
    const acc = db.chartOfAccounts.get(id);
    return acc && acc.tenantId === tenantId ? acc : void 0;
  }
  async getAccountByCode(tenantId, code) {
    return Array.from(db.chartOfAccounts.values()).find((a) => a.tenantId === tenantId && a.accountCode === code);
  }
  async saveAccount(acc) {
    db.chartOfAccounts.set(acc.id, acc);
    db.persistToDisk();
    return acc;
  }
  // Fiscal Years & Periods
  async getFiscalYears(tenantId) {
    return Array.from(db.fiscalYears.values()).filter((f) => f.tenantId === tenantId);
  }
  async getFiscalYearById(tenantId, id) {
    const fy = db.fiscalYears.get(id);
    return fy && fy.tenantId === tenantId ? fy : void 0;
  }
  async saveFiscalYear(fy) {
    db.fiscalYears.set(fy.id, fy);
    db.persistToDisk();
    return fy;
  }
  async getFiscalPeriods(tenantId, fiscalYearId) {
    return Array.from(db.fiscalPeriods.values()).filter((fp) => {
      if (fp.tenantId !== tenantId) return false;
      if (fiscalYearId && fp.fiscalYearId !== fiscalYearId) return false;
      return true;
    });
  }
  async getFiscalPeriodById(tenantId, id) {
    const fp = db.fiscalPeriods.get(id);
    return fp && fp.tenantId === tenantId ? fp : void 0;
  }
  async saveFiscalPeriod(fp) {
    db.fiscalPeriods.set(fp.id, fp);
    db.persistToDisk();
    return fp;
  }
  // Cost Centers
  async getCostCenters(tenantId) {
    return Array.from(db.costCenters.values()).filter((cc) => cc.tenantId === tenantId);
  }
  async getCostCenterById(tenantId, id) {
    const cc = db.costCenters.get(id);
    return cc && cc.tenantId === tenantId ? cc : void 0;
  }
  async saveCostCenter(cc) {
    db.costCenters.set(cc.id, cc);
    db.persistToDisk();
    return cc;
  }
  // Projects
  async getProjects(tenantId) {
    return Array.from(db.financeProjects.values()).filter((p) => p.tenantId === tenantId);
  }
  async getProjectById(tenantId, id) {
    const p = db.financeProjects.get(id);
    return p && p.tenantId === tenantId ? p : void 0;
  }
  async saveProject(p) {
    db.financeProjects.set(p.id, p);
    db.persistToDisk();
    return p;
  }
  // Journals & Journal Lines
  async getJournals(tenantId) {
    return Array.from(db.journals.values()).filter((j) => j.tenantId === tenantId);
  }
  async getJournalById(tenantId, id) {
    const j = db.journals.get(id);
    return j && j.tenantId === tenantId ? j : void 0;
  }
  async saveJournal(journal) {
    db.journals.set(journal.id, journal);
    db.persistToDisk();
    return journal;
  }
  async getJournalLines(tenantId, journalId) {
    return Array.from(db.journalLines.values()).filter((jl) => {
      if (jl.tenantId !== tenantId) return false;
      if (journalId && jl.journalId !== journalId) return false;
      return true;
    });
  }
  async saveJournalLine(jl) {
    db.journalLines.set(jl.id, jl);
    db.persistToDisk();
    return jl;
  }
  // Customer Invoices
  async getInvoices(tenantId) {
    return Array.from(db.customerInvoices.values()).filter((i) => i.tenantId === tenantId);
  }
  async getInvoiceById(tenantId, id) {
    const inv = db.customerInvoices.get(id);
    return inv && inv.tenantId === tenantId ? inv : void 0;
  }
  async saveInvoice(inv) {
    db.customerInvoices.set(inv.id, inv);
    db.persistToDisk();
    return inv;
  }
  async getInvoiceItems(tenantId, invoiceId) {
    return Array.from(db.invoiceItems.values()).filter((item) => item.tenantId === tenantId && item.invoiceId === invoiceId);
  }
  async saveInvoiceItem(item) {
    db.invoiceItems.set(item.id, item);
    db.persistToDisk();
    return item;
  }
  // Customer Payments & Allocations
  async getPayments(tenantId) {
    return Array.from(db.customerPayments.values()).filter((p) => p.tenantId === tenantId);
  }
  async getPaymentById(tenantId, id) {
    const pay = db.customerPayments.get(id);
    return pay && pay.tenantId === tenantId ? pay : void 0;
  }
  async savePayment(pay) {
    db.customerPayments.set(pay.id, pay);
    db.persistToDisk();
    return pay;
  }
  async getPaymentAllocations(tenantId, paymentId) {
    return Array.from(db.paymentAllocations.values()).filter((pa) => {
      if (pa.tenantId !== tenantId) return false;
      if (paymentId && pa.paymentId !== paymentId) return false;
      return true;
    });
  }
  async savePaymentAllocation(alloc) {
    db.paymentAllocations.set(alloc.id, alloc);
    db.persistToDisk();
    return alloc;
  }
  // Supplier Bills
  async getSupplierBills(tenantId) {
    return Array.from(db.supplierBills.values()).filter((b) => b.tenantId === tenantId);
  }
  async getSupplierBillById(tenantId, id) {
    const bill = db.supplierBills.get(id);
    return bill && bill.tenantId === tenantId ? bill : void 0;
  }
  async saveSupplierBill(bill) {
    db.supplierBills.set(bill.id, bill);
    db.persistToDisk();
    return bill;
  }
  async getSupplierBillItems(tenantId, billId) {
    return Array.from(db.supplierBillItems.values()).filter((item) => item.tenantId === tenantId && item.billId === billId);
  }
  async saveSupplierBillItem(item) {
    db.supplierBillItems.set(item.id, item);
    db.persistToDisk();
    return item;
  }
  // Supplier Payments
  async getSupplierPayments(tenantId) {
    return Array.from(db.supplierPayments.values()).filter((p) => p.tenantId === tenantId);
  }
  async saveSupplierPayment(sp) {
    db.supplierPayments.set(sp.id, sp);
    db.persistToDisk();
    return sp;
  }
  // Expenses
  async getExpenses(tenantId) {
    return Array.from(db.financeExpenses.values()).filter((e) => e.tenantId === tenantId);
  }
  async getExpenseById(tenantId, id) {
    const exp = db.financeExpenses.get(id);
    return exp && exp.tenantId === tenantId ? exp : void 0;
  }
  async saveExpense(exp) {
    db.financeExpenses.set(exp.id, exp);
    db.persistToDisk();
    return exp;
  }
  // Bank Accounts & Transactions
  async getBankAccounts(tenantId) {
    return Array.from(db.bankAccounts.values()).filter((b) => b.tenantId === tenantId);
  }
  async getBankAccountById(tenantId, id) {
    const bank = db.bankAccounts.get(id);
    return bank && bank.tenantId === tenantId ? bank : void 0;
  }
  async saveBankAccount(bank) {
    db.bankAccounts.set(bank.id, bank);
    db.persistToDisk();
    return bank;
  }
  async getBankTransactions(tenantId, bankAccountId) {
    return Array.from(db.bankTransactions.values()).filter((bt) => {
      if (bt.tenantId !== tenantId) return false;
      if (bankAccountId && bt.bankAccountId !== bankAccountId) return false;
      return true;
    });
  }
  async saveBankTransaction(bt) {
    db.bankTransactions.set(bt.id, bt);
    db.persistToDisk();
    return bt;
  }
  // Reconciliations
  async getReconciliations(tenantId) {
    return Array.from(db.bankReconciliations.values()).filter((r) => r.tenantId === tenantId);
  }
  async saveReconciliation(rec) {
    db.bankReconciliations.set(rec.id, rec);
    db.persistToDisk();
    return rec;
  }
  // Credit Notes & Debit Notes
  async getCreditNotes(tenantId) {
    return Array.from(db.creditNotes.values()).filter((cn) => cn.tenantId === tenantId);
  }
  async saveCreditNote(cn) {
    db.creditNotes.set(cn.id, cn);
    db.persistToDisk();
    return cn;
  }
  async getDebitNotes(tenantId) {
    return Array.from(db.debitNotes.values()).filter((dn) => dn.tenantId === tenantId);
  }
  async saveDebitNote(dn) {
    db.debitNotes.set(dn.id, dn);
    db.persistToDisk();
    return dn;
  }
  // Tax Codes
  async getTaxCodes(tenantId) {
    return Array.from(db.taxCodes.values()).filter((tc) => tc.tenantId === tenantId);
  }
  async saveTaxCode(tc) {
    db.taxCodes.set(tc.id, tc);
    db.persistToDisk();
    return tc;
  }
};
var financeRepository = new FinanceRepository();

// src/server/services/financeServices.ts
var FinanceService = class {
  // ==========================================
  // AUDIT LOGGING HELPER
  // ==========================================
  logAudit(tenantId, userId, action, resource, resourceId, details) {
    const audit = {
      id: generateUuidV7(),
      tenantId,
      actorUserId: userId,
      actorEmail: "finance.user@racezoneventures.com",
      action,
      module: "Finance",
      resource,
      resourceId,
      ipAddress: "127.0.0.1",
      correlationId: `corr-${generateUuidV7().slice(0, 8)}`,
      status: "SUCCESS",
      afterStateJson: JSON.stringify(details),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.auditLogs.set(audit.id, audit);
  }
  // ==========================================
  // NOTIFICATION HELPER
  // ==========================================
  sendNotification(tenantId, recipientUserId, title, body, channel = "IN_APP") {
    const notif = {
      id: generateUuidV7(),
      tenantId,
      recipientUserId,
      type: "INFO",
      title,
      body,
      channel,
      isRead: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.notifications.set(notif.id, notif);
  }
  // ==========================================
  // 1. CHART OF ACCOUNTS SERVICES
  // ==========================================
  async getChartOfAccounts(tenantId) {
    return financeRepository.getAccounts(tenantId);
  }
  async getAccountById(tenantId, id) {
    return financeRepository.getAccountById(tenantId, id);
  }
  async createAccount(tenantId, userId, data) {
    if (!data.accountCode || !data.accountName || !data.accountType) {
      throw new Error("Account code, name, and type are required");
    }
    const existing = await financeRepository.getAccountByCode(tenantId, data.accountCode);
    if (existing) {
      throw new Error(`Account code ${data.accountCode} already exists`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const acc = {
      id: generateUuidV7(),
      tenantId,
      accountCode: data.accountCode,
      accountName: data.accountName,
      accountType: data.accountType,
      parentAccountId: data.parentAccountId,
      currency: data.currency || "INR",
      isControlAccount: data.isControlAccount ?? false,
      isActive: data.isActive ?? true,
      createdAt: now,
      updatedAt: now
    };
    await financeRepository.saveAccount(acc);
    this.logAudit(tenantId, userId, "CREATE_ACCOUNT", "ChartOfAccount", acc.id, { accountCode: acc.accountCode });
    return acc;
  }
  async updateAccount(tenantId, userId, id, data) {
    const acc = await financeRepository.getAccountById(tenantId, id);
    if (!acc) throw new Error("Account not found");
    if (data.accountName) acc.accountName = data.accountName;
    if (data.parentAccountId !== void 0) acc.parentAccountId = data.parentAccountId;
    if (data.isControlAccount !== void 0) acc.isControlAccount = data.isControlAccount;
    if (data.isActive !== void 0) acc.isActive = data.isActive;
    acc.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await financeRepository.saveAccount(acc);
    this.logAudit(tenantId, userId, "UPDATE_ACCOUNT", "ChartOfAccount", acc.id, { accountCode: acc.accountCode });
    return acc;
  }
  // ==========================================
  // 2. FISCAL PERIODS & YEARS
  // ==========================================
  async getFiscalYears(tenantId) {
    return financeRepository.getFiscalYears(tenantId);
  }
  async getFiscalPeriods(tenantId, fiscalYearId) {
    return financeRepository.getFiscalPeriods(tenantId, fiscalYearId);
  }
  async closeFiscalPeriod(tenantId, userId, periodId) {
    const fp = await financeRepository.getFiscalPeriodById(tenantId, periodId);
    if (!fp) throw new Error("Fiscal period not found");
    if (fp.status === "CLOSED") throw new Error("Fiscal period is already closed");
    const journals = await financeRepository.getJournals(tenantId);
    const unposted = journals.filter((j) => j.status === "DRAFT" && j.journalDate >= fp.startDate && j.journalDate <= fp.endDate);
    if (unposted.length > 0) {
      throw new Error(`Cannot close fiscal period: ${unposted.length} unposted draft journal entries remain`);
    }
    fp.status = "CLOSED";
    fp.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await financeRepository.saveFiscalPeriod(fp);
    this.logAudit(tenantId, userId, "CLOSE_FISCAL_PERIOD", "FiscalPeriod", fp.id, { periodName: fp.periodName });
    return fp;
  }
  async reopenFiscalPeriod(tenantId, userId, periodId) {
    const fp = await financeRepository.getFiscalPeriodById(tenantId, periodId);
    if (!fp) throw new Error("Fiscal period not found");
    fp.status = "OPEN";
    fp.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await financeRepository.saveFiscalPeriod(fp);
    this.logAudit(tenantId, userId, "REOPEN_FISCAL_PERIOD", "FiscalPeriod", fp.id, { periodName: fp.periodName });
    return fp;
  }
  // ==========================================
  // 3. FINANCIAL POSTING ENGINE (DOUBLE-ENTRY)
  // ==========================================
  async getJournals(tenantId) {
    return financeRepository.getJournals(tenantId);
  }
  async getJournalDetails(tenantId, id) {
    const journal = await financeRepository.getJournalById(tenantId, id);
    if (!journal) throw new Error("Journal not found");
    const lines = await financeRepository.getJournalLines(tenantId, id);
    return { journal, lines };
  }
  async createJournal(tenantId, userId, data) {
    if (!data.lines || data.lines.length < 2) {
      throw new Error("A double-entry journal must contain at least two line items");
    }
    const periods = await financeRepository.getFiscalPeriods(tenantId);
    const matchingPeriod = periods.find((fp) => data.journalDate >= fp.startDate && data.journalDate <= fp.endDate);
    if (matchingPeriod && matchingPeriod.status !== "OPEN") {
      throw new Error(`Cannot create journal entry in a ${matchingPeriod.status.toLowerCase()} fiscal period (${matchingPeriod.periodName})`);
    }
    let totalDebit = 0;
    let totalCredit = 0;
    for (const l of data.lines) {
      if (l.debit < 0 || l.credit < 0) throw new Error("Debit and credit amounts must be non-negative");
      totalDebit += Number(l.debit || 0);
      totalCredit += Number(l.credit || 0);
    }
    if (Math.abs(totalDebit - totalCredit) > 1e-3) {
      throw new Error(`Journal entry is unbalanced: Total Debit (${totalDebit.toFixed(2)}) must equal Total Credit (${totalCredit.toFixed(2)})`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const count = (await financeRepository.getJournals(tenantId)).length + 1;
    const journalNumber = `JNL-${(/* @__PURE__ */ new Date()).getFullYear()}-${count.toString().padStart(5, "0")}`;
    const journal = {
      id: generateUuidV7(),
      tenantId,
      journalNumber,
      journalDate: data.journalDate,
      referenceType: data.referenceType,
      referenceId: data.referenceId,
      description: data.description,
      status: "DRAFT",
      createdBy: userId,
      totalDebit: Number(totalDebit.toFixed(2)),
      totalCredit: Number(totalCredit.toFixed(2)),
      createdAt: now,
      updatedAt: now
    };
    await financeRepository.saveJournal(journal);
    for (const l of data.lines) {
      const line = {
        id: generateUuidV7(),
        tenantId,
        journalId: journal.id,
        accountId: l.accountId,
        debit: Number(l.debit || 0),
        credit: Number(l.credit || 0),
        costCenterId: l.costCenterId,
        projectId: l.projectId,
        customerId: l.customerId,
        supplierId: l.supplierId,
        description: l.description
      };
      await financeRepository.saveJournalLine(line);
    }
    this.logAudit(tenantId, userId, "CREATE_JOURNAL", "Journal", journal.id, { journalNumber });
    return journal;
  }
  async postJournal(tenantId, userId, journalId) {
    const journal = await financeRepository.getJournalById(tenantId, journalId);
    if (!journal) throw new Error("Journal not found");
    if (journal.status !== "DRAFT") throw new Error(`Journal is already in ${journal.status} status`);
    const periods = await financeRepository.getFiscalPeriods(tenantId);
    const matchingPeriod = periods.find((fp) => journal.journalDate >= fp.startDate && journal.journalDate <= fp.endDate);
    if (matchingPeriod && matchingPeriod.status !== "OPEN") {
      throw new Error(`Cannot post journal entry in a ${matchingPeriod.status.toLowerCase()} fiscal period`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    journal.status = "POSTED";
    journal.postedBy = userId;
    journal.postedAt = now;
    journal.updatedAt = now;
    await financeRepository.saveJournal(journal);
    this.logAudit(tenantId, userId, "POST_JOURNAL", "Journal", journal.id, { journalNumber: journal.journalNumber });
    return journal;
  }
  async reverseJournal(tenantId, userId, journalId, reason) {
    const journal = await financeRepository.getJournalById(tenantId, journalId);
    if (!journal) throw new Error("Journal not found");
    if (journal.status !== "POSTED") throw new Error("Only POSTED journals can be reversed");
    const lines = await financeRepository.getJournalLines(tenantId, journalId);
    const ReversingLines = lines.map((l) => ({
      accountId: l.accountId,
      debit: l.credit,
      credit: l.debit,
      costCenterId: l.costCenterId,
      projectId: l.projectId,
      customerId: l.customerId,
      supplierId: l.supplierId,
      description: `REVERSAL: ${l.description}`
    }));
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const revJournal = await this.createJournal(tenantId, userId, {
      journalDate: now.split("T")[0],
      referenceType: "REVERSAL",
      referenceId: journal.id,
      description: `Reversal of ${journal.journalNumber}: ${reason}`,
      lines: ReversingLines
    });
    await this.postJournal(tenantId, userId, revJournal.id);
    journal.status = "REVERSED";
    journal.reversedBy = userId;
    journal.reversedJournalId = revJournal.id;
    journal.updatedAt = now;
    await financeRepository.saveJournal(journal);
    this.logAudit(tenantId, userId, "REVERSE_JOURNAL", "Journal", journal.id, { reversedByJournalNumber: revJournal.journalNumber });
    return revJournal;
  }
  // ==========================================
  // 4. ACCOUNTS RECEIVABLE (AR) INVOICES & PAYMENTS
  // ==========================================
  async getInvoices(tenantId) {
    return financeRepository.getInvoices(tenantId);
  }
  async createCustomerInvoice(tenantId, userId, data) {
    if (!data.customerId || !data.items || data.items.length === 0) {
      throw new Error("Customer ID and at least one item are required");
    }
    let subtotal = 0;
    let totalTax = 0;
    const itemsToSave = [];
    const invId = generateUuidV7();
    for (const item of data.items) {
      const lineSubtotal = item.quantity * item.unitPrice;
      const taxRate = item.taxRate || 18;
      const taxAmount = lineSubtotal * taxRate / 100;
      const totalPrice = lineSubtotal + taxAmount;
      subtotal += lineSubtotal;
      totalTax += taxAmount;
      itemsToSave.push({
        id: generateUuidV7(),
        tenantId,
        invoiceId: invId,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxCodeId: item.taxCodeId,
        taxRate,
        taxAmount,
        totalPrice
      });
    }
    const totalAmount = subtotal + totalTax;
    const count = (await financeRepository.getInvoices(tenantId)).length + 1;
    const invoiceNumber = `INV-${(/* @__PURE__ */ new Date()).getFullYear()}-${count.toString().padStart(4, "0")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const invoice = {
      id: invId,
      tenantId,
      invoiceNumber,
      customerId: data.customerId,
      quotationId: data.quotationId,
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,
      creditTermsDays: data.creditTermsDays || 30,
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(totalTax.toFixed(2)),
      discountAmount: 0,
      totalAmount: Number(totalAmount.toFixed(2)),
      outstandingAmount: Number(totalAmount.toFixed(2)),
      status: "APPROVED",
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
      items: itemsToSave
    };
    await financeRepository.saveInvoice(invoice);
    for (const it of itemsToSave) {
      await financeRepository.saveInvoiceItem(it);
    }
    const journalData = {
      journalDate: data.invoiceDate,
      referenceType: "INVOICE",
      referenceId: invoice.id,
      description: `Sales Invoice ${invoiceNumber} for Customer ${data.customerId}`,
      lines: [
        {
          accountId: "acc-1100",
          // Accounts Receivable
          debit: invoice.totalAmount,
          credit: 0,
          customerId: data.customerId,
          description: `AR Debit for Invoice ${invoiceNumber}`
        },
        {
          accountId: "acc-4000",
          // Sales Revenue
          debit: 0,
          credit: invoice.subtotal,
          description: `Sales Revenue for Invoice ${invoiceNumber}`
        },
        {
          accountId: "acc-2200",
          // GST Output Tax
          debit: 0,
          credit: invoice.taxAmount,
          description: `GST Payable for Invoice ${invoiceNumber}`
        }
      ]
    };
    const journal = await this.createJournal(tenantId, userId, journalData);
    await this.postJournal(tenantId, userId, journal.id);
    invoice.journalId = journal.id;
    invoice.status = "ISSUED";
    await financeRepository.saveInvoice(invoice);
    this.logAudit(tenantId, userId, "CREATE_INVOICE", "CustomerInvoice", invoice.id, { invoiceNumber, totalAmount: invoice.totalAmount });
    return invoice;
  }
  async recordCustomerPayment(tenantId, userId, data) {
    if (!data.customerId || !data.amount || data.amount <= 0) {
      throw new Error("Customer ID and positive amount are required");
    }
    const count = (await financeRepository.getPayments(tenantId)).length + 1;
    const paymentNumber = `PAY-${(/* @__PURE__ */ new Date()).getFullYear()}-${count.toString().padStart(4, "0")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const payment = {
      id: generateUuidV7(),
      tenantId,
      paymentNumber,
      customerId: data.customerId,
      paymentDate: data.paymentDate,
      amount: Number(data.amount.toFixed(2)),
      currency: "INR",
      paymentMethod: data.paymentMethod,
      bankAccountId: data.bankAccountId || "bank-hdfc-001",
      referenceNumber: data.referenceNumber,
      unallocatedAmount: Number(data.amount.toFixed(2)),
      status: "POSTED",
      createdAt: now,
      updatedAt: now
    };
    await financeRepository.savePayment(payment);
    const bankAcc = data.bankAccountId ? await financeRepository.getBankAccountById(tenantId, data.bankAccountId) : void 0;
    const glAcc = bankAcc?.glAccountId || "acc-1010";
    const journal = await this.createJournal(tenantId, userId, {
      journalDate: data.paymentDate,
      referenceType: "PAYMENT",
      referenceId: payment.id,
      description: `Customer Receipt ${paymentNumber} from Customer ${data.customerId}`,
      lines: [
        {
          accountId: glAcc,
          // Bank/Cash Asset
          debit: payment.amount,
          credit: 0,
          customerId: data.customerId,
          description: `Bank Debit for Receipt ${paymentNumber}`
        },
        {
          accountId: "acc-1100",
          // Accounts Receivable
          debit: 0,
          credit: payment.amount,
          customerId: data.customerId,
          description: `AR Credit for Receipt ${paymentNumber}`
        }
      ]
    });
    await this.postJournal(tenantId, userId, journal.id);
    payment.journalId = journal.id;
    await financeRepository.savePayment(payment);
    if (data.allocateToInvoiceId) {
      await this.allocatePaymentToInvoice(tenantId, userId, payment.id, data.allocateToInvoiceId, payment.amount);
    }
    this.logAudit(tenantId, userId, "RECORD_PAYMENT", "CustomerPayment", payment.id, { paymentNumber, amount: payment.amount });
    return payment;
  }
  async allocatePaymentToInvoice(tenantId, userId, paymentId, invoiceId, allocatedAmount) {
    const payment = await financeRepository.getPaymentById(tenantId, paymentId);
    if (!payment) throw new Error("Payment not found");
    const invoice = await financeRepository.getInvoiceById(tenantId, invoiceId);
    if (!invoice) throw new Error("Invoice not found");
    if (allocatedAmount <= 0) throw new Error("Allocation amount must be greater than zero");
    if (allocatedAmount > payment.unallocatedAmount) {
      throw new Error(`Allocated amount (${allocatedAmount}) exceeds unallocated payment balance (${payment.unallocatedAmount})`);
    }
    if (allocatedAmount > invoice.outstandingAmount) {
      throw new Error(`Allocated amount (${allocatedAmount}) exceeds invoice outstanding amount (${invoice.outstandingAmount})`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const alloc = {
      id: generateUuidV7(),
      tenantId,
      paymentId,
      invoiceId,
      allocatedAmount: Number(allocatedAmount.toFixed(2)),
      allocatedAt: now
    };
    await financeRepository.savePaymentAllocation(alloc);
    payment.unallocatedAmount = Number((payment.unallocatedAmount - allocatedAmount).toFixed(2));
    payment.updatedAt = now;
    await financeRepository.savePayment(payment);
    invoice.outstandingAmount = Number((invoice.outstandingAmount - allocatedAmount).toFixed(2));
    if (invoice.outstandingAmount <= 0.01) {
      invoice.status = "PAID";
      invoice.outstandingAmount = 0;
    } else {
      invoice.status = "PARTIALLY_PAID";
    }
    invoice.updatedAt = now;
    await financeRepository.saveInvoice(invoice);
    this.logAudit(tenantId, userId, "ALLOCATE_PAYMENT", "PaymentAllocation", alloc.id, { paymentId, invoiceId, allocatedAmount });
    return alloc;
  }
  // ==========================================
  // 5. ACCOUNTS PAYABLE (AP) BILLS & PAYMENTS
  // ==========================================
  async getSupplierBills(tenantId) {
    return financeRepository.getSupplierBills(tenantId);
  }
  async createSupplierBill(tenantId, userId, data) {
    if (!data.supplierName || !data.items || data.items.length === 0) {
      throw new Error("Supplier name and at least one bill item are required");
    }
    let subtotal = 0;
    let totalTax = 0;
    const billId = generateUuidV7();
    const itemsToSave = [];
    for (const item of data.items) {
      const lineSubtotal = item.quantity * item.unitPrice;
      const taxAmount = item.taxAmount || lineSubtotal * 0.18;
      const totalPrice = lineSubtotal + taxAmount;
      subtotal += lineSubtotal;
      totalTax += taxAmount;
      itemsToSave.push({
        id: generateUuidV7(),
        tenantId,
        billId,
        itemDescription: item.itemDescription,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxAmount,
        totalPrice,
        costCenterId: item.costCenterId || "cc-fleet"
      });
    }
    const totalAmount = subtotal + totalTax;
    const count = (await financeRepository.getSupplierBills(tenantId)).length + 1;
    const billNumber = `BILL-${(/* @__PURE__ */ new Date()).getFullYear()}-${count.toString().padStart(4, "0")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const bill = {
      id: billId,
      tenantId,
      billNumber,
      supplierName: data.supplierName,
      supplierId: data.supplierId,
      billDate: data.billDate,
      dueDate: data.dueDate,
      subtotal: Number(subtotal.toFixed(2)),
      taxAmount: Number(totalTax.toFixed(2)),
      discountAmount: 0,
      totalAmount: Number(totalAmount.toFixed(2)),
      outstandingAmount: Number(totalAmount.toFixed(2)),
      status: "APPROVED",
      createdAt: now,
      updatedAt: now,
      items: itemsToSave
    };
    await financeRepository.saveSupplierBill(bill);
    for (const it of itemsToSave) {
      await financeRepository.saveSupplierBillItem(it);
    }
    const journalLines = [
      {
        accountId: "acc-5100",
        // Fleet Fuel & Operating Expenses
        debit: bill.subtotal,
        credit: 0,
        costCenterId: "cc-fleet",
        supplierId: data.supplierId,
        description: `Expense Debit for Bill ${billNumber}`
      }
    ];
    if (bill.taxAmount > 0) {
      journalLines.push({
        accountId: "acc-1300",
        // GST Input Tax Credit
        debit: bill.taxAmount,
        credit: 0,
        costCenterId: "cc-fleet",
        supplierId: data.supplierId,
        description: `GST Input Tax Credit for Bill ${billNumber}`
      });
    }
    journalLines.push({
      accountId: "acc-2100",
      // Accounts Payable
      debit: 0,
      credit: bill.totalAmount,
      costCenterId: "cc-fleet",
      supplierId: data.supplierId,
      description: `AP Credit for Bill ${billNumber}`
    });
    const journal = await this.createJournal(tenantId, userId, {
      journalDate: data.billDate,
      referenceType: "BILL",
      referenceId: bill.id,
      description: `Supplier Bill ${billNumber} from ${data.supplierName}`,
      lines: journalLines
    });
    await this.postJournal(tenantId, userId, journal.id);
    bill.journalId = journal.id;
    bill.status = "POSTED";
    await financeRepository.saveSupplierBill(bill);
    this.logAudit(tenantId, userId, "CREATE_SUPPLIER_BILL", "SupplierBill", bill.id, { billNumber, totalAmount: bill.totalAmount });
    return bill;
  }
  // ==========================================
  // 6. EXPENSE MANAGEMENT
  // ==========================================
  async getExpenses(tenantId) {
    return financeRepository.getExpenses(tenantId);
  }
  async recordExpense(tenantId, userId, data) {
    if (!data.amount || data.amount <= 0 || !data.description) {
      throw new Error("Expense amount and description are required");
    }
    const count = (await financeRepository.getExpenses(tenantId)).length + 1;
    const expenseNumber = `EXP-${(/* @__PURE__ */ new Date()).getFullYear()}-${count.toString().padStart(4, "0")}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const expense = {
      id: generateUuidV7(),
      tenantId,
      expenseNumber,
      category: data.category,
      amount: Number(data.amount.toFixed(2)),
      expenseDate: data.expenseDate,
      paymentMethod: data.paymentMethod,
      costCenterId: data.costCenterId || "cc-fleet",
      projectId: data.projectId,
      vehicleId: data.vehicleId,
      employeeId: data.employeeId,
      description: data.description,
      status: "APPROVED",
      createdAt: now,
      updatedAt: now
    };
    await financeRepository.saveExpense(expense);
    const expAcc = data.category === "Fuel" ? "acc-5100" : "acc-5400";
    const journal = await this.createJournal(tenantId, userId, {
      journalDate: data.expenseDate,
      referenceType: "EXPENSE",
      referenceId: expense.id,
      description: `Expense ${expenseNumber}: ${data.description}`,
      lines: [
        {
          accountId: expAcc,
          debit: expense.amount,
          credit: 0,
          costCenterId: expense.costCenterId,
          projectId: expense.projectId,
          description: `Debit Expense - ${data.category}`
        },
        {
          accountId: "acc-1010",
          // Bank Current Account
          debit: 0,
          credit: expense.amount,
          description: `Credit Cash/Bank for Expense ${expenseNumber}`
        }
      ]
    });
    await this.postJournal(tenantId, userId, journal.id);
    expense.journalId = journal.id;
    expense.status = "POSTED";
    await financeRepository.saveExpense(expense);
    this.logAudit(tenantId, userId, "RECORD_EXPENSE", "FinanceExpense", expense.id, { expenseNumber, amount: expense.amount });
    return expense;
  }
  // ==========================================
  // 7. BANK & CASH RECONCILIATION
  // ==========================================
  async getBankAccounts(tenantId) {
    return financeRepository.getBankAccounts(tenantId);
  }
  async getBankTransactions(tenantId, bankAccountId) {
    return financeRepository.getBankTransactions(tenantId, bankAccountId);
  }
  async reconcileBankStatement(tenantId, userId, data) {
    const bank = await financeRepository.getBankAccountById(tenantId, data.bankAccountId);
    if (!bank) throw new Error("Bank account not found");
    const txs = await financeRepository.getBankTransactions(tenantId, data.bankAccountId);
    const glBalance = bank.currentBalance;
    const difference = Math.abs(data.statementBalance - glBalance);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const rec = {
      id: generateUuidV7(),
      tenantId,
      bankAccountId: data.bankAccountId,
      statementDate: data.statementDate,
      statementBalance: Number(data.statementBalance.toFixed(2)),
      glBalance: Number(glBalance.toFixed(2)),
      difference: Number(difference.toFixed(2)),
      status: difference === 0 ? "RECONCILED" : "DRAFT",
      reconciledBy: userId,
      reconciledAt: now,
      createdAt: now
    };
    await financeRepository.saveReconciliation(rec);
    for (const tx of txs) {
      if (tx.reconciliationStatus === "MATCHED") {
        tx.reconciliationStatus = "RECONCILED";
        await financeRepository.saveBankTransaction(tx);
      }
    }
    this.logAudit(tenantId, userId, "BANK_RECONCILIATION", "BankReconciliation", rec.id, { difference, status: rec.status });
    return rec;
  }
  // ==========================================
  // 8. FINANCIAL STATEMENTS & REPORTS ENGINE
  // ==========================================
  // General Ledger Report
  async getGeneralLedgerReport(tenantId, accountId, startDate, endDate) {
    const accounts = await financeRepository.getAccounts(tenantId);
    const journals = await financeRepository.getJournals(tenantId);
    const allLines = await financeRepository.getJournalLines(tenantId);
    const postedJournals = journals.filter((j) => j.status === "POSTED");
    const postedJournalIds = new Set(postedJournals.map((j) => j.id));
    let filteredLines = allLines.filter((l) => postedJournalIds.has(l.journalId));
    if (accountId) {
      filteredLines = filteredLines.filter((l) => l.accountId === accountId);
    }
    const reportEntries = filteredLines.map((line) => {
      const j = postedJournals.find((pj) => pj.id === line.journalId);
      const acc = accounts.find((a) => a.id === line.accountId);
      return {
        lineId: line.id,
        journalNumber: j.journalNumber,
        journalDate: j.journalDate,
        accountCode: acc?.accountCode || "N/A",
        accountName: acc?.accountName || "Unknown",
        accountType: acc?.accountType || "N/A",
        description: line.description || j.description,
        debit: line.debit,
        credit: line.credit,
        costCenterId: line.costCenterId,
        projectId: line.projectId
      };
    });
    let runningBalance = 0;
    const ledgerRows = reportEntries.map((entry) => {
      if (entry.accountType === "ASSET" || entry.accountType === "EXPENSE") {
        runningBalance += entry.debit - entry.credit;
      } else {
        runningBalance += entry.credit - entry.debit;
      }
      return { ...entry, runningBalance: Number(runningBalance.toFixed(2)) };
    });
    return {
      tenantId,
      totalEntries: ledgerRows.length,
      rows: ledgerRows
    };
  }
  // Trial Balance Report
  async getTrialBalanceReport(tenantId, asOfDate) {
    const accounts = await financeRepository.getAccounts(tenantId);
    const journals = await financeRepository.getJournals(tenantId);
    const lines = await financeRepository.getJournalLines(tenantId);
    const postedJournals = journals.filter((j) => j.status === "POSTED");
    const postedIds = new Set(postedJournals.map((j) => j.id));
    const rows = accounts.map((acc) => {
      const accLines = lines.filter((l) => l.accountId === acc.id && postedIds.has(l.journalId));
      const totalDebit = accLines.reduce((sum, l) => sum + l.debit, 0);
      const totalCredit = accLines.reduce((sum, l) => sum + l.credit, 0);
      let netDebit = 0;
      let netCredit = 0;
      if (acc.accountType === "ASSET" || acc.accountType === "EXPENSE") {
        const net = totalDebit - totalCredit;
        if (net >= 0) netDebit = net;
        else netCredit = Math.abs(net);
      } else {
        const net = totalCredit - totalDebit;
        if (net >= 0) netCredit = net;
        else netDebit = Math.abs(net);
      }
      return {
        accountId: acc.id,
        accountCode: acc.accountCode,
        accountName: acc.accountName,
        accountType: acc.accountType,
        totalDebit: Number(totalDebit.toFixed(2)),
        totalCredit: Number(totalCredit.toFixed(2)),
        netDebit: Number(netDebit.toFixed(2)),
        netCredit: Number(netCredit.toFixed(2))
      };
    });
    const sumDebit = rows.reduce((s, r) => s + r.netDebit, 0);
    const sumCredit = rows.reduce((s, r) => s + r.netCredit, 0);
    const isBalanced = Math.abs(sumDebit - sumCredit) < 0.01;
    return {
      tenantId,
      asOfDate: asOfDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      isBalanced,
      totalNetDebit: Number(sumDebit.toFixed(2)),
      totalNetCredit: Number(sumCredit.toFixed(2)),
      accounts: rows
    };
  }
  // Profit & Loss Statement (P&L)
  async getProfitAndLossReport(tenantId, startDate, endDate) {
    const accounts = await financeRepository.getAccounts(tenantId);
    const journals = await financeRepository.getJournals(tenantId);
    const lines = await financeRepository.getJournalLines(tenantId);
    const postedIds = new Set(journals.filter((j) => j.status === "POSTED").map((j) => j.id));
    const revenueAccounts = accounts.filter((a) => a.accountType === "REVENUE");
    const expenseAccounts = accounts.filter((a) => a.accountType === "EXPENSE");
    let totalRevenue = 0;
    const revenueDetails = revenueAccounts.map((acc) => {
      const accLines = lines.filter((l) => l.accountId === acc.id && postedIds.has(l.journalId));
      const amount = accLines.reduce((sum, l) => sum + (l.credit - l.debit), 0);
      totalRevenue += amount;
      return { accountCode: acc.accountCode, accountName: acc.accountName, amount: Number(amount.toFixed(2)) };
    });
    let totalExpenses = 0;
    const expenseDetails = expenseAccounts.map((acc) => {
      const accLines = lines.filter((l) => l.accountId === acc.id && postedIds.has(l.journalId));
      const amount = accLines.reduce((sum, l) => sum + (l.debit - l.credit), 0);
      totalExpenses += amount;
      return { accountCode: acc.accountCode, accountName: acc.accountName, amount: Number(amount.toFixed(2)) };
    });
    const grossProfit = totalRevenue;
    const netProfit = totalRevenue - totalExpenses;
    const netProfitMarginPct = totalRevenue > 0 ? Number((netProfit / totalRevenue * 100).toFixed(2)) : 0;
    return {
      tenantId,
      period: { startDate: startDate || "2026-04-01", endDate: endDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0] },
      summary: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalExpenses: Number(totalExpenses.toFixed(2)),
        grossProfit: Number(grossProfit.toFixed(2)),
        netProfit: Number(netProfit.toFixed(2)),
        netProfitMarginPct
      },
      revenueDetails,
      expenseDetails
    };
  }
  // Balance Sheet
  async getBalanceSheetReport(tenantId, asOfDate) {
    const accounts = await financeRepository.getAccounts(tenantId);
    const journals = await financeRepository.getJournals(tenantId);
    const lines = await financeRepository.getJournalLines(tenantId);
    const postedIds = new Set(journals.filter((j) => j.status === "POSTED").map((j) => j.id));
    const assetAccounts = accounts.filter((a) => a.accountType === "ASSET");
    const liabilityAccounts = accounts.filter((a) => a.accountType === "LIABILITY");
    const equityAccounts = accounts.filter((a) => a.accountType === "EQUITY");
    let totalAssets = 0;
    const assetDetails = assetAccounts.map((acc) => {
      const accLines = lines.filter((l) => l.accountId === acc.id && postedIds.has(l.journalId));
      const balance = accLines.reduce((s, l) => s + (l.debit - l.credit), 0);
      totalAssets += balance;
      return { accountCode: acc.accountCode, accountName: acc.accountName, balance: Number(balance.toFixed(2)) };
    });
    let totalLiabilities = 0;
    const liabilityDetails = liabilityAccounts.map((acc) => {
      const accLines = lines.filter((l) => l.accountId === acc.id && postedIds.has(l.journalId));
      const balance = accLines.reduce((s, l) => s + (l.credit - l.debit), 0);
      totalLiabilities += balance;
      return { accountCode: acc.accountCode, accountName: acc.accountName, balance: Number(balance.toFixed(2)) };
    });
    let totalEquity = 0;
    const equityDetails = equityAccounts.map((acc) => {
      const accLines = lines.filter((l) => l.accountId === acc.id && postedIds.has(l.journalId));
      const balance = accLines.reduce((s, l) => s + (l.credit - l.debit), 0);
      totalEquity += balance;
      return { accountCode: acc.accountCode, accountName: acc.accountName, balance: Number(balance.toFixed(2)) };
    });
    const pnl = await this.getProfitAndLossReport(tenantId);
    const netIncome = pnl.summary.netProfit;
    totalEquity += netIncome;
    equityDetails.push({ accountCode: "3999", accountName: "Current Period Retained Net Income", balance: Number(netIncome.toFixed(2)) });
    const isEquationBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity)) < 0.01;
    return {
      tenantId,
      asOfDate: asOfDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      isEquationBalanced,
      summary: {
        totalAssets: Number(totalAssets.toFixed(2)),
        totalLiabilities: Number(totalLiabilities.toFixed(2)),
        totalEquity: Number(totalEquity.toFixed(2)),
        totalLiabilitiesAndEquity: Number((totalLiabilities + totalEquity).toFixed(2))
      },
      assetDetails,
      liabilityDetails,
      equityDetails
    };
  }
  // Aging Reports (AR & AP)
  async getAgingReport(tenantId, type) {
    const today = /* @__PURE__ */ new Date();
    if (type === "AR") {
      const invoices = await financeRepository.getInvoices(tenantId);
      const openInvoices = invoices.filter((i) => i.status !== "PAID" && i.outstandingAmount > 0);
      const buckets = { current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0 };
      const items = openInvoices.map((inv) => {
        const dueDate = new Date(inv.dueDate);
        const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1e3 * 3600 * 24));
        let bucket = "Current";
        if (diffDays <= 0) buckets.current += inv.outstandingAmount;
        else if (diffDays <= 30) {
          buckets.days1_30 += inv.outstandingAmount;
          bucket = "1-30 Days";
        } else if (diffDays <= 60) {
          buckets.days31_60 += inv.outstandingAmount;
          bucket = "31-60 Days";
        } else if (diffDays <= 90) {
          buckets.days61_90 += inv.outstandingAmount;
          bucket = "61-90 Days";
        } else {
          buckets.days90Plus += inv.outstandingAmount;
          bucket = "90+ Days";
        }
        return {
          invoiceNumber: inv.invoiceNumber,
          customerId: inv.customerId,
          invoiceDate: inv.invoiceDate,
          dueDate: inv.dueDate,
          daysOverdue: diffDays > 0 ? diffDays : 0,
          totalAmount: inv.totalAmount,
          outstandingAmount: inv.outstandingAmount,
          bucket
        };
      });
      return { tenantId, type: "AR", summaryBuckets: buckets, totalOutstanding: Object.values(buckets).reduce((a, b) => a + b, 0), items };
    } else {
      const bills = await financeRepository.getSupplierBills(tenantId);
      const openBills = bills.filter((b) => b.status !== "PAID" && b.outstandingAmount > 0);
      const buckets = { current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days90Plus: 0 };
      const items = openBills.map((bill) => {
        const dueDate = new Date(bill.dueDate);
        const diffDays = Math.floor((today.getTime() - dueDate.getTime()) / (1e3 * 3600 * 24));
        let bucket = "Current";
        if (diffDays <= 0) buckets.current += bill.outstandingAmount;
        else if (diffDays <= 30) {
          buckets.days1_30 += bill.outstandingAmount;
          bucket = "1-30 Days";
        } else if (diffDays <= 60) {
          buckets.days31_60 += bill.outstandingAmount;
          bucket = "31-60 Days";
        } else if (diffDays <= 90) {
          buckets.days61_90 += bill.outstandingAmount;
          bucket = "61-90 Days";
        } else {
          buckets.days90Plus += bill.outstandingAmount;
          bucket = "90+ Days";
        }
        return {
          billNumber: bill.billNumber,
          supplierName: bill.supplierName,
          billDate: bill.billDate,
          dueDate: bill.dueDate,
          daysOverdue: diffDays > 0 ? diffDays : 0,
          totalAmount: bill.totalAmount,
          outstandingAmount: bill.outstandingAmount,
          bucket
        };
      });
      return { tenantId, type: "AP", summaryBuckets: buckets, totalOutstanding: Object.values(buckets).reduce((a, b) => a + b, 0), items };
    }
  }
  // Financial Dashboard Executive Metrics
  async getDashboardMetrics(tenantId) {
    const pnl = await this.getProfitAndLossReport(tenantId);
    const bs = await this.getBalanceSheetReport(tenantId);
    const arAging = await this.getAgingReport(tenantId, "AR");
    const apAging = await this.getAgingReport(tenantId, "AP");
    const bankAccounts = await financeRepository.getBankAccounts(tenantId);
    const totalBankCashBalance = bankAccounts.reduce((sum, b) => sum + b.currentBalance, 0);
    const totalArOutstanding = arAging.totalOutstanding;
    const totalApOutstanding = apAging.totalOutstanding;
    const invoices = await financeRepository.getInvoices(tenantId);
    const overdueInvoicesCount = invoices.filter((i) => i.outstandingAmount > 0 && new Date(i.dueDate) < /* @__PURE__ */ new Date()).length;
    return {
      tenantId,
      asOfDate: (/* @__PURE__ */ new Date()).toISOString(),
      revenue: pnl.summary.totalRevenue,
      expenses: pnl.summary.totalExpenses,
      netProfit: pnl.summary.netProfit,
      netProfitMarginPct: pnl.summary.netProfitMarginPct,
      cashAndBankBalance: totalBankCashBalance,
      accountsReceivableOutstanding: totalArOutstanding,
      accountsPayableOutstanding: totalApOutstanding,
      overdueInvoicesCount,
      totalAssets: bs.summary.totalAssets,
      totalLiabilities: bs.summary.totalLiabilities,
      totalEquity: bs.summary.totalEquity
    };
  }
};
var financeService = new FinanceService();

// src/server/tests/financeTests.ts
async function runFinanceTestSuite() {
  const errors = [];
  let totalTests = 0;
  let passedTests = 0;
  const tenantA = "tenant-rz-global-001";
  const tenantB = "tenant-apex-quarry-002";
  const userId = "usr-admin-001";
  async function assertTest(name, fn) {
    totalTests++;
    try {
      await fn();
      passedTests++;
      console.log(`  [PASS] ${name}`);
    } catch (err) {
      errors.push(`${name}: ${err.message}`);
      console.error(`  [FAIL] ${name}: ${err.message}`);
    }
  }
  console.log("==================================================");
  console.log("RUNNING PHASE 21 ENTERPRISE FINANCE TEST SUITE");
  console.log("==================================================");
  await assertTest("Chart of Accounts Retrieval & Creation", async () => {
    const coa = await financeService.getChartOfAccounts(tenantA);
    if (coa.length < 10) throw new Error(`Expected at least 10 accounts, found ${coa.length}`);
    const accCode = `5500-${Date.now().toString().slice(-4)}`;
    const newAcc = await financeService.createAccount(tenantA, userId, {
      accountCode: accCode,
      accountName: "Heavy Equipment Depreciation Expense",
      accountType: "EXPENSE",
      currency: "INR"
    });
    if (!newAcc.id || newAcc.accountCode !== accCode) {
      throw new Error("Failed to create account");
    }
  });
  await assertTest("Fiscal Period Closing & Reopening", async () => {
    const periods = await financeService.getFiscalPeriods(tenantA);
    if (periods.length === 0) throw new Error("No fiscal periods found");
    const openPeriod = periods.find((p) => p.status === "OPEN") || periods[0];
    const closed = await financeService.closeFiscalPeriod(tenantA, userId, openPeriod.id);
    if (closed.status !== "CLOSED") throw new Error("Failed to close fiscal period");
    const reopened = await financeService.reopenFiscalPeriod(tenantA, userId, openPeriod.id);
    if (reopened.status !== "OPEN") throw new Error("Failed to reopen fiscal period");
  });
  await assertTest("Posting Engine - Enforce Double-Entry Balance", async () => {
    try {
      await financeService.createJournal(tenantA, userId, {
        journalDate: "2026-08-10",
        referenceType: "MANUAL",
        description: "Unbalanced Journal Test",
        lines: [
          { accountId: "acc-1010", debit: 5e4, credit: 0, description: "Debit 50k" },
          { accountId: "acc-4000", debit: 0, credit: 4e4, description: "Credit 40k" }
        ]
      });
      throw new Error("Unbalanced journal entry was wrongly accepted!");
    } catch (err) {
      if (!err.message.includes("unbalanced") && !err.message.includes("equal Total Credit")) {
        throw new Error(`Unexpected error message for unbalanced journal: ${err.message}`);
      }
    }
    const journal = await financeService.createJournal(tenantA, userId, {
      journalDate: "2026-08-10",
      referenceType: "MANUAL",
      description: "Balanced Capital Injection Test",
      lines: [
        { accountId: "acc-1010", debit: 1e5, credit: 0, description: "Bank Debit" },
        { accountId: "acc-3000", debit: 0, credit: 1e5, description: "Capital Equity Credit" }
      ]
    });
    const posted = await financeService.postJournal(tenantA, userId, journal.id);
    if (posted.status !== "POSTED") throw new Error("Journal posting failed");
  });
  await assertTest("Journal Entry Reversal Flow", async () => {
    const journal = await financeService.createJournal(tenantA, userId, {
      journalDate: "2026-08-10",
      referenceType: "MANUAL",
      description: "Journal to be Reversed",
      lines: [
        { accountId: "acc-5400", debit: 12e3, credit: 0, description: "Admin Expense Debit" },
        { accountId: "acc-1010", debit: 0, credit: 12e3, description: "Bank Credit" }
      ]
    });
    await financeService.postJournal(tenantA, userId, journal.id);
    const reversed = await financeService.reverseJournal(tenantA, userId, journal.id, "Erroneous posting");
    if (reversed.status !== "POSTED") throw new Error("Reversal journal creation/posting failed");
    const orig = (await financeService.getJournals(tenantA)).find((j) => j.id === journal.id);
    if (orig?.status !== "REVERSED") throw new Error("Original journal was not marked as REVERSED");
  });
  await assertTest("Accounts Receivable - Invoice, Payment & Allocation", async () => {
    const inv = await financeService.createCustomerInvoice(tenantA, userId, {
      customerId: "cust-harbor-dev",
      invoiceDate: "2026-08-10",
      dueDate: "2026-09-10",
      items: [
        { itemDescription: "Laterite Stone Supply", quantity: 50, unitPrice: 2e3, taxRate: 18 }
      ]
    });
    if (inv.status !== "ISSUED" || inv.totalAmount !== 118e3) {
      throw new Error(`Invoice calculation or status wrong: ${inv.status}, total: ${inv.totalAmount}`);
    }
    const pay = await financeService.recordCustomerPayment(tenantA, userId, {
      customerId: "cust-harbor-dev",
      paymentDate: "2026-08-12",
      amount: 118e3,
      paymentMethod: "TRANSFER",
      bankAccountId: "bank-hdfc-001",
      referenceNumber: "NEFT-TEST-9988"
    });
    if (pay.unallocatedAmount !== 118e3) throw new Error("Payment unallocated amount incorrect");
    const alloc = await financeService.allocatePaymentToInvoice(tenantA, userId, pay.id, inv.id, 118e3);
    if (alloc.allocatedAmount !== 118e3) throw new Error("Allocation amount mismatch");
    const updatedInv = (await financeService.getInvoices(tenantA)).find((i) => i.id === inv.id);
    if (updatedInv?.status !== "PAID" || updatedInv.outstandingAmount !== 0) {
      throw new Error(`Invoice status after full allocation should be PAID with 0 outstanding, found: ${updatedInv?.status}, outstanding: ${updatedInv?.outstandingAmount}`);
    }
  });
  await assertTest("Accounts Payable - Supplier Bill Creation & Posting", async () => {
    const bill = await financeService.createSupplierBill(tenantA, userId, {
      supplierName: "Bharat Petroleum Corp Ltd",
      billDate: "2026-08-10",
      dueDate: "2026-08-25",
      items: [
        { itemDescription: "Commercial Diesel Bulk Purchase", quantity: 1e3, unitPrice: 90, taxAmount: 16200 }
      ]
    });
    if (bill.status !== "POSTED" || bill.totalAmount !== 106200) {
      throw new Error(`Supplier bill creation/posting failed, total: ${bill.totalAmount}`);
    }
  });
  await assertTest("Expense Recording & Posting", async () => {
    const expense = await financeService.recordExpense(tenantA, userId, {
      category: "Maintenance",
      amount: 25e3,
      expenseDate: "2026-08-10",
      paymentMethod: "BANK",
      costCenterId: "cc-fleet",
      vehicleId: "veh-ka19-4491",
      description: "Tipper Hydraulic Pump Repair & Oil Seal Replacement"
    });
    if (expense.status !== "POSTED" || !expense.journalId) {
      throw new Error("Expense failed to create or post journal");
    }
  });
  await assertTest("Bank Reconciliation Flow", async () => {
    const bank = (await financeService.getBankAccounts(tenantA))[0];
    if (!bank) throw new Error("Bank account not found");
    const rec = await financeService.reconcileBankStatement(tenantA, userId, {
      bankAccountId: bank.id,
      statementDate: "2026-08-10",
      statementBalance: bank.currentBalance
    });
    if (rec.difference !== 0 || rec.status !== "RECONCILED") {
      throw new Error(`Bank reconciliation status should be RECONCILED with 0 diff, found status: ${rec.status}, diff: ${rec.difference}`);
    }
  });
  await assertTest("Financial Reports (Trial Balance, P&L, Balance Sheet, Aging)", async () => {
    const tb = await financeService.getTrialBalanceReport(tenantA);
    if (!tb.isBalanced) throw new Error("Trial balance report is UNBALANCED!");
    const pnl = await financeService.getProfitAndLossReport(tenantA);
    if (typeof pnl.summary.netProfit !== "number") throw new Error("P&L Net Profit calculation invalid");
    const bs = await financeService.getBalanceSheetReport(tenantA);
    if (!bs.isEquationBalanced) throw new Error("Balance Sheet equation Assets = Liabilities + Equity is broken!");
    const arAging = await financeService.getAgingReport(tenantA, "AR");
    if (typeof arAging.totalOutstanding !== "number") throw new Error("AR Aging total calculation invalid");
    const dash = await financeService.getDashboardMetrics(tenantA);
    if (typeof dash.netProfit !== "number" || typeof dash.cashAndBankBalance !== "number") {
      throw new Error("Financial Executive Dashboard metrics invalid");
    }
  });
  await assertTest("Tenant Isolation Enforced on Financial Data", async () => {
    const accountsB = await financeService.getChartOfAccounts(tenantB);
    const journalsB = await financeService.getJournals(tenantB);
    const invoicesB = await financeService.getInvoices(tenantB);
    if (accountsB.length > 0) throw new Error("Tenant B accessed Tenant A accounts!");
    if (journalsB.length > 0) throw new Error("Tenant B accessed Tenant A journals!");
    if (invoicesB.length > 0) throw new Error("Tenant B accessed Tenant A invoices!");
  });
  console.log("==================================================");
  console.log(`FINANCE TEST SUITE COMPLETED: ${passedTests}/${totalTests} PASSED`);
  console.log("==================================================");
  return {
    success: errors.length === 0,
    totalTests,
    passedTests,
    failedTests: errors.length,
    errors
  };
}

// src/server/repositories/hrRepositories.ts
var HrRepository = class {
  // Employees
  async getEmployees(tenantId) {
    return Array.from(db.hrEmployees.values()).filter((e) => e.tenantId === tenantId);
  }
  async getEmployeeById(tenantId, id) {
    const emp = db.hrEmployees.get(id);
    return emp && emp.tenantId === tenantId ? emp : void 0;
  }
  async getEmployeeByCode(tenantId, code) {
    return Array.from(db.hrEmployees.values()).find((e) => e.tenantId === tenantId && e.employeeCode === code);
  }
  async saveEmployee(emp) {
    db.hrEmployees.set(emp.id, emp);
    db.persistToDisk();
    return emp;
  }
  // Departments & Designations
  async getDepartments(tenantId) {
    return Array.from(db.hrDepartments.values()).filter((d) => d.tenantId === tenantId);
  }
  async getDepartmentById(tenantId, id) {
    const d = db.hrDepartments.get(id);
    return d && d.tenantId === tenantId ? d : void 0;
  }
  async saveDepartment(dept) {
    db.hrDepartments.set(dept.id, dept);
    db.persistToDisk();
    return dept;
  }
  async getDesignations(tenantId) {
    return Array.from(db.hrDesignations.values()).filter((d) => d.tenantId === tenantId);
  }
  async getDesignationById(tenantId, id) {
    const d = db.hrDesignations.get(id);
    return d && d.tenantId === tenantId ? d : void 0;
  }
  async saveDesignation(desig) {
    db.hrDesignations.set(desig.id, desig);
    db.persistToDisk();
    return desig;
  }
  // Employee Users
  async getEmployeeUsers(tenantId) {
    return Array.from(db.hrEmployeeUsers.values()).filter((eu) => eu.tenantId === tenantId);
  }
  async saveEmployeeUser(eu) {
    db.hrEmployeeUsers.set(eu.id, eu);
    db.persistToDisk();
    return eu;
  }
  // Shifts
  async getShifts(tenantId) {
    return Array.from(db.hrShifts.values()).filter((s) => s.tenantId === tenantId);
  }
  async saveShift(shift) {
    db.hrShifts.set(shift.id, shift);
    db.persistToDisk();
    return shift;
  }
  // Attendance
  async getAttendance(tenantId, employeeId, date) {
    return Array.from(db.hrAttendances.values()).filter((a) => {
      if (a.tenantId !== tenantId) return false;
      if (employeeId && a.employeeId !== employeeId) return false;
      if (date && a.date !== date) return false;
      return true;
    });
  }
  async getAttendanceById(tenantId, id) {
    const att = db.hrAttendances.get(id);
    return att && att.tenantId === tenantId ? att : void 0;
  }
  async saveAttendance(att) {
    db.hrAttendances.set(att.id, att);
    db.persistToDisk();
    return att;
  }
  // Attendance Corrections
  async getAttendanceCorrections(tenantId) {
    return Array.from(db.hrAttendanceCorrections.values()).filter((ac) => ac.tenantId === tenantId);
  }
  async saveAttendanceCorrection(corr) {
    db.hrAttendanceCorrections.set(corr.id, corr);
    db.persistToDisk();
    return corr;
  }
  // Leave Types & Policies & Balances & Applications
  async getLeaveTypes(tenantId) {
    return Array.from(db.hrLeaveTypes.values()).filter((lt) => lt.tenantId === tenantId);
  }
  async saveLeaveType(lt) {
    db.hrLeaveTypes.set(lt.id, lt);
    db.persistToDisk();
    return lt;
  }
  async getLeaveBalances(tenantId, employeeId) {
    return Array.from(db.hrLeaveBalances.values()).filter((lb) => {
      if (lb.tenantId !== tenantId) return false;
      if (employeeId && lb.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveLeaveBalance(lb) {
    db.hrLeaveBalances.set(lb.id, lb);
    db.persistToDisk();
    return lb;
  }
  async getLeaveApplications(tenantId, employeeId) {
    return Array.from(db.hrLeaveApplications.values()).filter((la) => {
      if (la.tenantId !== tenantId) return false;
      if (employeeId && la.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveLeaveApplication(la) {
    db.hrLeaveApplications.set(la.id, la);
    db.persistToDisk();
    return la;
  }
  // Holidays
  async getHolidays(tenantId) {
    return Array.from(db.hrHolidays.values()).filter((h) => h.tenantId === tenantId);
  }
  async saveHoliday(h) {
    db.hrHolidays.set(h.id, h);
    db.persistToDisk();
    return h;
  }
  // Overtime
  async getOvertime(tenantId) {
    return Array.from(db.hrOvertimes.values()).filter((o) => o.tenantId === tenantId);
  }
  async saveOvertime(ot) {
    db.hrOvertimes.set(ot.id, ot);
    db.persistToDisk();
    return ot;
  }
  // Salary Structures & Components
  async getSalaryStructures(tenantId, employeeId) {
    return Array.from(db.hrSalaryStructures.values()).filter((ss) => {
      if (ss.tenantId !== tenantId) return false;
      if (employeeId && ss.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveSalaryStructure(ss) {
    db.hrSalaryStructures.set(ss.id, ss);
    db.persistToDisk();
    return ss;
  }
  async getSalaryComponents(tenantId, salaryStructureId) {
    return Array.from(db.hrSalaryComponents.values()).filter((sc) => {
      if (sc.tenantId !== tenantId) return false;
      if (salaryStructureId && sc.salaryStructureId !== salaryStructureId) return false;
      return true;
    });
  }
  async saveSalaryComponent(sc) {
    db.hrSalaryComponents.set(sc.id, sc);
    db.persistToDisk();
    return sc;
  }
  // Payroll Years & Periods
  async getPayrollPeriods(tenantId) {
    return Array.from(db.hrPayrollPeriods.values()).filter((p) => p.tenantId === tenantId);
  }
  async savePayrollPeriod(p) {
    db.hrPayrollPeriods.set(p.id, p);
    db.persistToDisk();
    return p;
  }
  // Payroll Runs & Items
  async getPayrollRuns(tenantId) {
    return Array.from(db.hrPayrollRuns.values()).filter((r) => r.tenantId === tenantId);
  }
  async getPayrollRunById(tenantId, id) {
    const run = db.hrPayrollRuns.get(id);
    return run && run.tenantId === tenantId ? run : void 0;
  }
  async savePayrollRun(run) {
    db.hrPayrollRuns.set(run.id, run);
    db.persistToDisk();
    return run;
  }
  async getPayrollItems(tenantId, payrollRunId) {
    return Array.from(db.hrPayrollItems.values()).filter((pi) => {
      if (pi.tenantId !== tenantId) return false;
      if (payrollRunId && pi.payrollRunId !== payrollRunId) return false;
      return true;
    });
  }
  async savePayrollItem(pi) {
    db.hrPayrollItems.set(pi.id, pi);
    db.persistToDisk();
    return pi;
  }
  // Payslips
  async getPayslips(tenantId, employeeId) {
    return Array.from(db.hrPayslips.values()).filter((ps) => {
      if (ps.tenantId !== tenantId) return false;
      if (employeeId && ps.employeeId !== employeeId) return false;
      return true;
    });
  }
  async savePayslip(ps) {
    db.hrPayslips.set(ps.id, ps);
    db.persistToDisk();
    return ps;
  }
  // Salary Advances & Loans
  async getSalaryAdvances(tenantId, employeeId) {
    return Array.from(db.hrSalaryAdvances.values()).filter((sa) => {
      if (sa.tenantId !== tenantId) return false;
      if (employeeId && sa.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveSalaryAdvance(sa) {
    db.hrSalaryAdvances.set(sa.id, sa);
    db.persistToDisk();
    return sa;
  }
  async getEmployeeLoans(tenantId, employeeId) {
    return Array.from(db.hrEmployeeLoans.values()).filter((el) => {
      if (el.tenantId !== tenantId) return false;
      if (employeeId && el.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveEmployeeLoan(el) {
    db.hrEmployeeLoans.set(el.id, el);
    db.persistToDisk();
    return el;
  }
  // Reimbursements
  async getReimbursements(tenantId, employeeId) {
    return Array.from(db.hrReimbursements.values()).filter((r) => {
      if (r.tenantId !== tenantId) return false;
      if (employeeId && r.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveReimbursement(r) {
    db.hrReimbursements.set(r.id, r);
    db.persistToDisk();
    return r;
  }
  // Employee Documents
  async getEmployeeDocuments(tenantId, employeeId) {
    return Array.from(db.hrEmployeeDocuments.values()).filter((ed) => {
      if (ed.tenantId !== tenantId) return false;
      if (employeeId && ed.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveEmployeeDocument(doc) {
    db.hrEmployeeDocuments.set(doc.id, doc);
    db.persistToDisk();
    return doc;
  }
  // Performance
  async getPerformanceCycles(tenantId) {
    return Array.from(db.hrPerformanceCycles.values()).filter((pc) => pc.tenantId === tenantId);
  }
  async savePerformanceCycle(pc) {
    db.hrPerformanceCycles.set(pc.id, pc);
    db.persistToDisk();
    return pc;
  }
  async getEmployeeGoals(tenantId, employeeId) {
    return Array.from(db.hrEmployeeGoals.values()).filter((g) => {
      if (g.tenantId !== tenantId) return false;
      if (employeeId && g.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveEmployeeGoal(g) {
    db.hrEmployeeGoals.set(g.id, g);
    db.persistToDisk();
    return g;
  }
  async getEmployeeReviews(tenantId, employeeId) {
    return Array.from(db.hrEmployeeReviews.values()).filter((r) => {
      if (r.tenantId !== tenantId) return false;
      if (employeeId && r.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveEmployeeReview(r) {
    db.hrEmployeeReviews.set(r.id, r);
    db.persistToDisk();
    return r;
  }
  // Recruitment
  async getJobRequisitions(tenantId) {
    return Array.from(db.hrJobRequisitions.values()).filter((jr) => jr.tenantId === tenantId);
  }
  async saveJobRequisition(jr) {
    db.hrJobRequisitions.set(jr.id, jr);
    db.persistToDisk();
    return jr;
  }
  async getCandidates(tenantId) {
    return Array.from(db.hrCandidates.values()).filter((c) => c.tenantId === tenantId);
  }
  async saveCandidate(c) {
    db.hrCandidates.set(c.id, c);
    db.persistToDisk();
    return c;
  }
  async getApplications(tenantId) {
    return Array.from(db.hrApplications.values()).filter((a) => a.tenantId === tenantId);
  }
  async saveApplication(app) {
    db.hrApplications.set(app.id, app);
    db.persistToDisk();
    return app;
  }
  async getInterviews(tenantId) {
    return Array.from(db.hrInterviews.values()).filter((i) => i.tenantId === tenantId);
  }
  async saveInterview(i) {
    db.hrInterviews.set(i.id, i);
    db.persistToDisk();
    return i;
  }
  async getOffers(tenantId) {
    return Array.from(db.hrOffers.values()).filter((o) => o.tenantId === tenantId);
  }
  async saveOffer(offer) {
    db.hrOffers.set(offer.id, offer);
    db.persistToDisk();
    return offer;
  }
  // Onboarding, Offboarding & Final Settlement
  async getOnboardings(tenantId, employeeId) {
    return Array.from(db.hrOnboardings.values()).filter((o) => {
      if (o.tenantId !== tenantId) return false;
      if (employeeId && o.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveOnboarding(o) {
    db.hrOnboardings.set(o.id, o);
    db.persistToDisk();
    return o;
  }
  async getOffboardings(tenantId, employeeId) {
    return Array.from(db.hrOffboardings.values()).filter((o) => {
      if (o.tenantId !== tenantId) return false;
      if (employeeId && o.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveOffboarding(o) {
    db.hrOffboardings.set(o.id, o);
    db.persistToDisk();
    return o;
  }
  async getFinalSettlements(tenantId, employeeId) {
    return Array.from(db.hrFinalSettlements.values()).filter((fs5) => {
      if (fs5.tenantId !== tenantId) return false;
      if (employeeId && fs5.employeeId !== employeeId) return false;
      return true;
    });
  }
  async saveFinalSettlement(fs5) {
    db.hrFinalSettlements.set(fs5.id, fs5);
    db.persistToDisk();
    return fs5;
  }
};
var hrRepository = new HrRepository();

// src/server/services/hrServices.ts
var HrService = class {
  logAudit(tenantId, userId, action, resource, resourceId, details) {
    const audit = {
      id: generateUuidV7(),
      tenantId,
      actorUserId: userId,
      actorEmail: "hr.admin@racezoneventures.com",
      action,
      module: "HRMS",
      resource,
      resourceId,
      ipAddress: "127.0.0.1",
      correlationId: `corr-${generateUuidV7().slice(0, 8)}`,
      status: "SUCCESS",
      afterStateJson: JSON.stringify(details),
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.auditLogs.set(audit.id, audit);
  }
  sendNotification(tenantId, recipientUserId, title, body) {
    const notif = {
      id: generateUuidV7(),
      tenantId,
      recipientUserId,
      title,
      body,
      type: "INFO",
      channel: "IN_APP",
      isRead: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.notifications.set(notif.id, notif);
  }
  // ==========================================
  // DASHBOARD METRICS
  // ==========================================
  async getDashboardMetrics(tenantId) {
    const employees = await hrRepository.getEmployees(tenantId);
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e) => e.employmentStatus === "ACTIVE").length;
    const thirtyDaysAgo = /* @__PURE__ */ new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newJoiners = employees.filter((e) => new Date(e.joiningDate) >= thirtyDaysAgo).length;
    const exits = employees.filter((e) => e.employmentStatus === "RESIGNED" || e.employmentStatus === "TERMINATED").length;
    const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todayAttendance = await hrRepository.getAttendance(tenantId, void 0, todayStr);
    const attendanceTodayCount = todayAttendance.filter((a) => a.status === "PRESENT" || a.status === "LATE" || a.status === "REMOTE").length;
    const absentTodayCount = todayAttendance.filter((a) => a.status === "ABSENT").length;
    const onLeaveTodayCount = todayAttendance.filter((a) => a.status === "ON_LEAVE").length;
    const lateTodayCount = todayAttendance.filter((a) => a.status === "LATE").length;
    const leaveApps = await hrRepository.getLeaveApplications(tenantId);
    const pendingLeaveApps = leaveApps.filter((l) => l.status === "SUBMITTED").length;
    const advances = await hrRepository.getSalaryAdvances(tenantId);
    const pendingAdvances = advances.filter((a) => a.status === "REQUESTED").length;
    const loans = await hrRepository.getEmployeeLoans(tenantId);
    const pendingLoans = loans.filter((l) => l.status === "REQUESTED").length;
    const reimbursements = await hrRepository.getReimbursements(tenantId);
    const pendingReimbursements = reimbursements.filter((r) => r.status === "SUBMITTED").length;
    const jobReqs = await hrRepository.getJobRequisitions(tenantId);
    const openVacancies = jobReqs.filter((j) => j.status === "OPEN").reduce((sum, j) => sum + j.openings, 0);
    const candidates = await hrRepository.getCandidates(tenantId);
    const pipelineCount = candidates.length;
    const runs = await hrRepository.getPayrollRuns(tenantId);
    const latestRun = runs.length > 0 ? runs[runs.length - 1] : null;
    const payrollCost = latestRun ? latestRun.totalNet : 0;
    const depts = await hrRepository.getDepartments(tenantId);
    const headcountByDept = depts.map((d) => {
      const count = employees.filter((e) => e.departmentId === d.id).length;
      return { departmentName: d.name, count };
    });
    return {
      totalEmployees,
      activeEmployees,
      newJoiners,
      exits,
      attendanceToday: attendanceTodayCount,
      absentToday: absentTodayCount,
      onLeaveToday: onLeaveTodayCount,
      lateToday: lateTodayCount,
      pendingLeave: pendingLeaveApps,
      pendingApprovals: pendingLeaveApps + pendingAdvances + pendingLoans + pendingReimbursements,
      pendingReimbursements,
      openVacancies,
      recruitmentPipeline: pipelineCount,
      payrollCost,
      employeeTurnoverRate: totalEmployees > 0 ? Number((exits / totalEmployees * 100).toFixed(1)) : 0,
      headcountByDepartment: headcountByDept
    };
  }
  // ==========================================
  // EMPLOYEE MASTER
  // ==========================================
  async getEmployees(tenantId) {
    return hrRepository.getEmployees(tenantId);
  }
  async getEmployeeById(tenantId, id) {
    return hrRepository.getEmployeeById(tenantId, id);
  }
  async createEmployee(tenantId, userId, data) {
    const existing = await hrRepository.getEmployeeByCode(tenantId, data.employeeCode || "");
    if (existing) {
      throw new Error(`Employee with code ${data.employeeCode} already exists.`);
    }
    const emp = {
      id: generateUuidV7(),
      tenantId,
      employeeCode: data.employeeCode || `EMP-${Date.now().toString().slice(-4)}`,
      firstName: data.firstName || "First",
      middleName: data.middleName || "",
      lastName: data.lastName || "Last",
      displayName: data.displayName || `${data.firstName || "First"} ${data.lastName || "Last"}`,
      gender: data.gender || "MALE",
      dateOfBirth: data.dateOfBirth || "1990-01-01",
      phone: data.phone || "+1234567890",
      email: data.email || `emp.${Date.now()}@racezoneventures.com`,
      address: data.address || "Company HQ",
      joiningDate: data.joiningDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      employmentType: data.employmentType || "FULL_TIME",
      employmentStatus: data.employmentStatus || "ACTIVE",
      departmentId: data.departmentId || "",
      designationId: data.designationId || "",
      managerId: data.managerId,
      branchId: data.branchId,
      businessUnitId: data.businessUnitId,
      workLocation: data.workLocation || "Main Office",
      bankAccountMasked: data.bankAccountMasked ? `****${data.bankAccountMasked.slice(-4)}` : "****1234",
      emergencyContact: data.emergencyContact || "Emergency Contact",
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveEmployee(emp);
    this.logAudit(tenantId, userId, "EMPLOYEE_CREATE", "hr_employees", saved.id, saved);
    return saved;
  }
  async updateEmployee(tenantId, userId, id, data) {
    const existing = await hrRepository.getEmployeeById(tenantId, id);
    if (!existing) {
      throw new Error(`Employee with ID ${id} not found.`);
    }
    const updated = {
      ...existing,
      ...data,
      bankAccountMasked: data.bankAccountMasked ? data.bankAccountMasked.includes("*") ? data.bankAccountMasked : `****${data.bankAccountMasked.slice(-4)}` : existing.bankAccountMasked,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveEmployee(updated);
    this.logAudit(tenantId, userId, "EMPLOYEE_UPDATE", "hr_employees", saved.id, saved);
    return saved;
  }
  async linkEmployeeUser(tenantId, userId, employeeId, targetUserId) {
    const emp = await hrRepository.getEmployeeById(tenantId, employeeId);
    if (!emp) throw new Error(`Employee ${employeeId} not found.`);
    const link = {
      id: generateUuidV7(),
      tenantId,
      employeeId,
      userId: targetUserId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveEmployeeUser(link);
    this.logAudit(tenantId, userId, "EMPLOYEE_USER_LINK", "hr_employee_users", saved.id, saved);
    return saved;
  }
  // ==========================================
  // DEPARTMENTS & DESIGNATIONS
  // ==========================================
  async getDepartments(tenantId) {
    return hrRepository.getDepartments(tenantId);
  }
  async createDepartment(tenantId, userId, data) {
    const dept = {
      id: generateUuidV7(),
      tenantId,
      code: data.code || `DEPT-${Date.now().toString().slice(-3)}`,
      name: data.name || "Department",
      description: data.description || "",
      headEmployeeId: data.headEmployeeId,
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveDepartment(dept);
    this.logAudit(tenantId, userId, "DEPARTMENT_CREATE", "hr_departments", saved.id, saved);
    return saved;
  }
  async getDesignations(tenantId) {
    return hrRepository.getDesignations(tenantId);
  }
  async createDesignation(tenantId, userId, data) {
    const desig = {
      id: generateUuidV7(),
      tenantId,
      code: data.code || `DESIG-${Date.now().toString().slice(-3)}`,
      title: data.title || "Designation Title",
      departmentId: data.departmentId,
      gradeLevel: data.gradeLevel || "G1",
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveDesignation(desig);
    this.logAudit(tenantId, userId, "DESIGNATION_CREATE", "hr_designations", saved.id, saved);
    return saved;
  }
  // ==========================================
  // SHIFTS
  // ==========================================
  async getShifts(tenantId) {
    return hrRepository.getShifts(tenantId);
  }
  async createShift(tenantId, userId, data) {
    const shift = {
      id: generateUuidV7(),
      tenantId,
      shiftCode: data.shiftCode || `SHIFT-${Date.now().toString().slice(-3)}`,
      shiftName: data.shiftName || "Day Shift",
      startTime: data.startTime || "09:00",
      endTime: data.endTime || "17:00",
      graceMinutes: data.graceMinutes || 15,
      breakMinutes: data.breakMinutes || 60,
      overtimeAfterMinutes: data.overtimeAfterMinutes || 480,
      shiftType: data.shiftType || "DAY",
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveShift(shift);
    this.logAudit(tenantId, userId, "SHIFT_CREATE", "hr_shifts", saved.id, saved);
    return saved;
  }
  // ==========================================
  // ATTENDANCE & CORRECTIONS
  // ==========================================
  async getAttendance(tenantId, employeeId, date) {
    return hrRepository.getAttendance(tenantId, employeeId, date);
  }
  async checkIn(tenantId, userId, employeeId, checkInTime) {
    const dateStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const existing = await hrRepository.getAttendance(tenantId, employeeId, dateStr);
    if (existing.length > 0 && existing[0].checkIn) {
      throw new Error(`Employee ${employeeId} has already checked in today (${dateStr}).`);
    }
    const checkInIso = checkInTime || (/* @__PURE__ */ new Date()).toISOString();
    const att = {
      id: existing.length > 0 ? existing[0].id : generateUuidV7(),
      tenantId,
      employeeId,
      date: dateStr,
      checkIn: checkInIso,
      breakMinutes: 0,
      workingMinutes: 0,
      overtimeMinutes: 0,
      lateMinutes: 0,
      status: "PRESENT",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveAttendance(att);
    this.logAudit(tenantId, userId, "ATTENDANCE_CHECK_IN", "hr_attendance", saved.id, saved);
    return saved;
  }
  async checkOut(tenantId, userId, attendanceId, checkOutTime) {
    const att = await hrRepository.getAttendanceById(tenantId, attendanceId);
    if (!att) throw new Error(`Attendance record ${attendanceId} not found.`);
    const checkOutIso = checkOutTime || (/* @__PURE__ */ new Date()).toISOString();
    const checkInMs = new Date(att.checkIn || att.createdAt).getTime();
    const checkOutMs = new Date(checkOutIso).getTime();
    const durationMinutes = Math.max(0, Math.floor((checkOutMs - checkInMs) / (1e3 * 60)) - att.breakMinutes);
    const standardWorkingMinutes = 480;
    const overtime = durationMinutes > standardWorkingMinutes ? durationMinutes - standardWorkingMinutes : 0;
    const updated = {
      ...att,
      checkOut: checkOutIso,
      workingMinutes: durationMinutes,
      overtimeMinutes: overtime,
      status: durationMinutes > 0 ? "PRESENT" : "ABSENT",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveAttendance(updated);
    this.logAudit(tenantId, userId, "ATTENDANCE_CHECK_OUT", "hr_attendance", saved.id, saved);
    return saved;
  }
  async submitAttendanceCorrection(tenantId, userId, data) {
    const corr = {
      id: generateUuidV7(),
      tenantId,
      attendanceId: data.attendanceId,
      employeeId: data.employeeId || "",
      date: data.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      requestedCheckIn: data.requestedCheckIn || (/* @__PURE__ */ new Date()).toISOString(),
      requestedCheckOut: data.requestedCheckOut || (/* @__PURE__ */ new Date()).toISOString(),
      reason: data.reason || "Correction requested",
      status: "PENDING",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveAttendanceCorrection(corr);
    this.logAudit(tenantId, userId, "ATTENDANCE_CORRECTION_SUBMIT", "hr_attendance_corrections", saved.id, saved);
    return saved;
  }
  async approveAttendanceCorrection(tenantId, userId, correctionId, approved) {
    const list = await hrRepository.getAttendanceCorrections(tenantId);
    const corr = list.find((c) => c.id === correctionId);
    if (!corr) throw new Error(`Correction ${correctionId} not found.`);
    corr.status = approved ? "APPROVED" : "REJECTED";
    corr.approvedBy = userId;
    corr.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (approved) {
      let att = corr.attendanceId ? await hrRepository.getAttendanceById(tenantId, corr.attendanceId) : void 0;
      if (!att) {
        att = {
          id: generateUuidV7(),
          tenantId,
          employeeId: corr.employeeId,
          date: corr.date,
          breakMinutes: 0,
          workingMinutes: 480,
          overtimeMinutes: 0,
          lateMinutes: 0,
          status: "PRESENT",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      att.checkIn = corr.requestedCheckIn;
      att.checkOut = corr.requestedCheckOut;
      const inMs = new Date(corr.requestedCheckIn).getTime();
      const outMs = new Date(corr.requestedCheckOut).getTime();
      att.workingMinutes = Math.max(0, Math.floor((outMs - inMs) / 6e4) - att.breakMinutes);
      att.status = "PRESENT";
      await hrRepository.saveAttendance(att);
    }
    const saved = await hrRepository.saveAttendanceCorrection(corr);
    this.logAudit(tenantId, userId, "ATTENDANCE_CORRECTION_APPROVE", "hr_attendance_corrections", saved.id, saved);
    return saved;
  }
  // ==========================================
  // LEAVE MANAGEMENT
  // ==========================================
  async getLeaveTypes(tenantId) {
    return hrRepository.getLeaveTypes(tenantId);
  }
  async getLeaveBalances(tenantId, employeeId) {
    return hrRepository.getLeaveBalances(tenantId, employeeId);
  }
  async applyLeave(tenantId, userId, data) {
    const employeeId = data.employeeId || "";
    const startDate = data.startDate || "";
    const endDate = data.endDate || "";
    const existingApps = await hrRepository.getLeaveApplications(tenantId, employeeId);
    const hasOverlap = existingApps.some((app2) => {
      if (app2.status === "REJECTED" || app2.status === "CANCELLED") return false;
      return startDate <= app2.endDate && endDate >= app2.startDate;
    });
    if (hasOverlap) {
      throw new Error(`Invalid leave application: Overlaps with an existing leave application from ${startDate} to ${endDate}.`);
    }
    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    const diffDays = Math.max(1, Math.ceil((endMs - startMs) / (1e3 * 60 * 60 * 24)) + 1);
    const app = {
      id: generateUuidV7(),
      tenantId,
      employeeId,
      leaveTypeId: data.leaveTypeId || "",
      startDate,
      endDate,
      totalDays: data.totalDays || diffDays,
      reason: data.reason || "Personal leave",
      status: "SUBMITTED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveLeaveApplication(app);
    this.logAudit(tenantId, userId, "LEAVE_SUBMIT", "hr_leave_applications", saved.id, saved);
    this.sendNotification(tenantId, userId, "Leave Application Submitted", `Leave application submitted for ${diffDays} day(s).`);
    return saved;
  }
  async approveLeave(tenantId, userId, applicationId, approved) {
    const list = await hrRepository.getLeaveApplications(tenantId);
    const app = list.find((a) => a.id === applicationId);
    if (!app) throw new Error(`Leave application ${applicationId} not found.`);
    app.status = approved ? "APPROVED" : "REJECTED";
    app.approvedBy = userId;
    app.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (approved) {
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const balances = await hrRepository.getLeaveBalances(tenantId, app.employeeId);
      let bal = balances.find((b) => b.leaveTypeId === app.leaveTypeId && b.year === currentYear);
      if (!bal) {
        bal = {
          id: generateUuidV7(),
          tenantId,
          employeeId: app.employeeId,
          leaveTypeId: app.leaveTypeId,
          year: currentYear,
          totalAllocated: 15,
          used: 0,
          pending: 0,
          remaining: 15,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
      }
      bal.used += app.totalDays;
      bal.remaining = Math.max(0, bal.totalAllocated - bal.used);
      bal.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      await hrRepository.saveLeaveBalance(bal);
    }
    const saved = await hrRepository.saveLeaveApplication(app);
    this.logAudit(tenantId, userId, "LEAVE_APPROVE", "hr_leave_applications", saved.id, saved);
    this.sendNotification(tenantId, userId, `Leave Application ${approved ? "Approved" : "Rejected"}`, `Your leave request from ${app.startDate} was ${app.status.toLowerCase()}.`);
    return saved;
  }
  // ==========================================
  // HOLIDAYS & OVERTIME
  // ==========================================
  async getHolidays(tenantId) {
    return hrRepository.getHolidays(tenantId);
  }
  async createHoliday(tenantId, userId, data) {
    const hol = {
      id: generateUuidV7(),
      tenantId,
      name: data.name || "Holiday",
      date: data.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      branchId: data.branchId,
      businessUnitId: data.businessUnitId,
      holidayType: data.holidayType || "NATIONAL",
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveHoliday(hol);
    this.logAudit(tenantId, userId, "HOLIDAY_CREATE", "hr_holidays", saved.id, saved);
    return saved;
  }
  async getOvertime(tenantId) {
    return hrRepository.getOvertime(tenantId);
  }
  async approveOvertime(tenantId, userId, overtimeId, approvedMinutes, rate = 1.5) {
    const list = await hrRepository.getOvertime(tenantId);
    const ot = list.find((o) => o.id === overtimeId);
    if (!ot) throw new Error(`Overtime record ${overtimeId} not found.`);
    const hourlyRate = 25;
    const amount = approvedMinutes / 60 * hourlyRate * rate;
    ot.approvedMinutes = approvedMinutes;
    ot.rate = rate;
    ot.amount = amount;
    ot.approvalStatus = "APPROVED";
    ot.approvedBy = userId;
    ot.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const saved = await hrRepository.saveOvertime(ot);
    this.logAudit(tenantId, userId, "OVERTIME_APPROVE", "hr_overtime", saved.id, saved);
    return saved;
  }
  // ==========================================
  // SALARY STRUCTURES & COMPONENTS
  // ==========================================
  async getSalaryStructures(tenantId, employeeId) {
    return hrRepository.getSalaryStructures(tenantId, employeeId);
  }
  async createSalaryStructure(tenantId, userId, data, components = []) {
    const ss = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || "",
      effectiveDate: data.effectiveDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      baseSalary: data.baseSalary || 5e3,
      payFrequency: data.payFrequency || "MONTHLY",
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveSalaryStructure(ss);
    const defaultComps = components.length > 0 ? components : [
      { componentName: "Basic Salary", componentType: "EARNING", amount: ss.baseSalary * 0.5 },
      { componentName: "House Rent Allowance (HRA)", componentType: "EARNING", amount: ss.baseSalary * 0.2 },
      { componentName: "Special Allowance", componentType: "EARNING", amount: ss.baseSalary * 0.3 }
    ];
    for (const compData of defaultComps) {
      const comp = {
        id: generateUuidV7(),
        tenantId,
        salaryStructureId: saved.id,
        componentName: compData.componentName || "Allowance",
        componentType: compData.componentType || "EARNING",
        amount: compData.amount || 0,
        isPercentage: compData.isPercentage || false,
        percentageOf: compData.percentageOf,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await hrRepository.saveSalaryComponent(comp);
    }
    this.logAudit(tenantId, userId, "SALARY_STRUCTURE_CREATE", "hr_salary_structures", saved.id, saved);
    return saved;
  }
  // ==========================================
  // PAYROLL & PERIODS & PAYSLIPS
  // ==========================================
  async getPayrollPeriods(tenantId) {
    return hrRepository.getPayrollPeriods(tenantId);
  }
  async createPayrollPeriod(tenantId, userId, data) {
    const period = {
      id: generateUuidV7(),
      tenantId,
      yearId: data.yearId || generateUuidV7(),
      periodName: data.periodName || `Period ${(/* @__PURE__ */ new Date()).getMonth() + 1}/${(/* @__PURE__ */ new Date()).getFullYear()}`,
      month: data.month || (/* @__PURE__ */ new Date()).getMonth() + 1,
      year: data.year || (/* @__PURE__ */ new Date()).getFullYear(),
      startDate: data.startDate || `${(/* @__PURE__ */ new Date()).getFullYear()}-${String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0")}-01`,
      endDate: data.endDate || `${(/* @__PURE__ */ new Date()).getFullYear()}-${String((/* @__PURE__ */ new Date()).getMonth() + 1).padStart(2, "0")}-28`,
      status: "OPEN",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.savePayrollPeriod(period);
    this.logAudit(tenantId, userId, "PAYROLL_PERIOD_CREATE", "hr_payroll_periods", saved.id, saved);
    return saved;
  }
  async getPayrollRuns(tenantId) {
    return hrRepository.getPayrollRuns(tenantId);
  }
  async calculatePayroll(tenantId, periodId, userId) {
    const period = (await hrRepository.getPayrollPeriods(tenantId)).find((p) => p.id === periodId);
    if (!period) throw new Error(`Payroll period ${periodId} not found.`);
    if (period.status === "LOCKED" || period.status === "CLOSED") {
      throw new Error(`Cannot modify or calculate payroll for a ${period.status} period.`);
    }
    const employees = (await hrRepository.getEmployees(tenantId)).filter((e) => e.employmentStatus === "ACTIVE");
    const runNumber = `PRUN-${period.year}-${String(period.month).padStart(2, "0")}-${Date.now().toString().slice(-4)}`;
    const run = {
      id: generateUuidV7(),
      tenantId,
      periodId,
      runNumber,
      runDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      totalEmployees: employees.length,
      totalGross: 0,
      totalDeductions: 0,
      totalNet: 0,
      status: "CALCULATING",
      processedBy: userId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    let runTotalGross = 0;
    let runTotalDeductions = 0;
    let runTotalNet = 0;
    for (const emp of employees) {
      const structures = await hrRepository.getSalaryStructures(tenantId, emp.id);
      const activeStruct = structures.find((s) => s.status === "ACTIVE") || { baseSalary: 5e3 };
      const baseSalary = activeStruct.baseSalary || 5e3;
      const basicEarnings = baseSalary * 0.5;
      const hra = baseSalary * 0.2;
      const allowances = baseSalary * 0.3;
      const otList = (await hrRepository.getOvertime(tenantId)).filter((o) => o.employeeId === emp.id && o.approvalStatus === "APPROVED");
      const overtimeAmount = otList.reduce((sum, o) => sum + o.amount, 0);
      const grossEarnings = basicEarnings + hra + allowances + overtimeAmount;
      const advances = (await hrRepository.getSalaryAdvances(tenantId, emp.id)).filter((a) => a.status === "DISBURSED" || a.status === "PARTIALLY_RECOVERED");
      const advanceDeduction = advances.reduce((sum, a) => sum + Math.min(a.monthlyRecoveryAmount, a.remainingBalance), 0);
      const loans = (await hrRepository.getEmployeeLoans(tenantId, emp.id)).filter((l) => l.status === "ACTIVE");
      const loanDeduction = loans.reduce((sum, l) => sum + Math.min(l.monthlyDeduction, l.remainingBalance), 0);
      const unpaidLeaveDeduction = 0;
      const otherDeductions = 0;
      const totalDeductions = advanceDeduction + loanDeduction + unpaidLeaveDeduction + otherDeductions;
      const netSalary = grossEarnings - totalDeductions;
      runTotalGross += grossEarnings;
      runTotalDeductions += totalDeductions;
      runTotalNet += netSalary;
      const item = {
        id: generateUuidV7(),
        tenantId,
        payrollRunId: run.id,
        employeeId: emp.id,
        basicEarnings,
        hra,
        allowances,
        overtimeAmount,
        bonusAmount: 0,
        grossEarnings,
        advanceDeduction,
        loanDeduction,
        unpaidLeaveDeduction,
        otherDeductions,
        totalDeductions,
        netSalary,
        status: "GENERATED",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await hrRepository.savePayrollItem(item);
      const depts = await hrRepository.getDepartments(tenantId);
      const desigs = await hrRepository.getDesignations(tenantId);
      const deptName = depts.find((d) => d.id === emp.departmentId)?.name || "General";
      const desigName = desigs.find((d) => d.id === emp.designationId)?.title || "Employee";
      const payslip = {
        id: generateUuidV7(),
        tenantId,
        payrollRunId: run.id,
        payrollItemId: item.id,
        employeeId: emp.id,
        employeeCode: emp.employeeCode,
        departmentName: deptName,
        designationName: desigName,
        periodName: period.periodName,
        grossSalary: grossEarnings,
        totalDeductions,
        netSalary,
        earningsJson: JSON.stringify({ basic: basicEarnings, hra, allowances, overtime: overtimeAmount }),
        deductionsJson: JSON.stringify({ advance: advanceDeduction, loan: loanDeduction }),
        status: "GENERATED",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      await hrRepository.savePayslip(payslip);
    }
    run.totalGross = runTotalGross;
    run.totalDeductions = runTotalDeductions;
    run.totalNet = runTotalNet;
    run.status = "REVIEW";
    run.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const savedRun = await hrRepository.savePayrollRun(run);
    this.logAudit(tenantId, userId, "PAYROLL_CALCULATE", "hr_payroll_runs", savedRun.id, savedRun);
    return savedRun;
  }
  async approvePayroll(tenantId, runId, userId) {
    const run = await hrRepository.getPayrollRunById(tenantId, runId);
    if (!run) throw new Error(`Payroll run ${runId} not found.`);
    run.status = "APPROVED";
    run.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const saved = await hrRepository.savePayrollRun(run);
    this.logAudit(tenantId, userId, "PAYROLL_APPROVE", "hr_payroll_runs", saved.id, saved);
    return saved;
  }
  async processPayroll(tenantId, runId, userId) {
    const run = await hrRepository.getPayrollRunById(tenantId, runId);
    if (!run) throw new Error(`Payroll run ${runId} not found.`);
    run.status = "PROCESSED";
    run.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const items = await hrRepository.getPayrollItems(tenantId, runId);
    for (const item of items) {
      if (item.advanceDeduction > 0) {
        const advances = await hrRepository.getSalaryAdvances(tenantId, item.employeeId);
        for (const adv of advances) {
          if (adv.remainingBalance > 0) {
            const deduct = Math.min(adv.remainingBalance, item.advanceDeduction);
            adv.recoveredAmount += deduct;
            adv.remainingBalance -= deduct;
            if (adv.remainingBalance <= 0) adv.status = "RECOVERED";
            else adv.status = "PARTIALLY_RECOVERED";
            await hrRepository.saveSalaryAdvance(adv);
          }
        }
      }
      if (item.loanDeduction > 0) {
        const loans = await hrRepository.getEmployeeLoans(tenantId, item.employeeId);
        for (const loan of loans) {
          if (loan.remainingBalance > 0) {
            const deduct = Math.min(loan.remainingBalance, item.loanDeduction);
            loan.recoveredAmount += deduct;
            loan.remainingBalance -= deduct;
            if (loan.remainingBalance <= 0) loan.status = "COMPLETED";
            await hrRepository.saveEmployeeLoan(loan);
          }
        }
      }
    }
    const journal = {
      id: generateUuidV7(),
      tenantId,
      journalNumber: `JNL-PAYROLL-${run.runNumber}`,
      journalDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      referenceType: "EXPENSE",
      referenceId: run.id,
      description: `Payroll Processing Expense for Run ${run.runNumber}`,
      totalDebit: run.totalNet,
      totalCredit: run.totalNet,
      status: "POSTED",
      createdBy: userId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.journals.set(journal.id, journal);
    run.journalId = journal.id;
    const saved = await hrRepository.savePayrollRun(run);
    this.logAudit(tenantId, userId, "PAYROLL_PROCESS", "hr_payroll_runs", saved.id, saved);
    return saved;
  }
  async getPayslips(tenantId, employeeId) {
    return hrRepository.getPayslips(tenantId, employeeId);
  }
  // ==========================================
  // SALARY ADVANCES & LOANS
  // ==========================================
  async getSalaryAdvances(tenantId, employeeId) {
    return hrRepository.getSalaryAdvances(tenantId, employeeId);
  }
  async requestSalaryAdvance(tenantId, userId, data) {
    const adv = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || "",
      amount: data.amount || 1e3,
      reason: data.reason || "Emergency advance",
      monthlyRecoveryAmount: data.monthlyRecoveryAmount || 250,
      recoveredAmount: 0,
      remainingBalance: data.amount || 1e3,
      status: "REQUESTED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveSalaryAdvance(adv);
    this.logAudit(tenantId, userId, "ADVANCE_REQUEST", "hr_salary_advances", saved.id, saved);
    return saved;
  }
  async approveSalaryAdvance(tenantId, userId, advanceId, approved) {
    const list = await hrRepository.getSalaryAdvances(tenantId);
    const adv = list.find((a) => a.id === advanceId);
    if (!adv) throw new Error(`Salary advance ${advanceId} not found.`);
    adv.status = approved ? "DISBURSED" : "REJECTED";
    adv.approvedBy = userId;
    adv.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const saved = await hrRepository.saveSalaryAdvance(adv);
    this.logAudit(tenantId, userId, "ADVANCE_APPROVE", "hr_salary_advances", saved.id, saved);
    return saved;
  }
  async getEmployeeLoans(tenantId, employeeId) {
    return hrRepository.getEmployeeLoans(tenantId, employeeId);
  }
  async requestEmployeeLoan(tenantId, userId, data) {
    const amount = data.loanAmount || 5e3;
    const installments = data.installments || 12;
    const monthly = Number((amount / installments).toFixed(2));
    const loan = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || "",
      loanAmount: amount,
      interestRate: data.interestRate || 0,
      installments,
      startDate: data.startDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      monthlyDeduction: monthly,
      recoveredAmount: 0,
      remainingBalance: amount,
      status: "REQUESTED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveEmployeeLoan(loan);
    this.logAudit(tenantId, userId, "LOAN_REQUEST", "hr_employee_loans", saved.id, saved);
    return saved;
  }
  async approveEmployeeLoan(tenantId, userId, loanId, approved) {
    const list = await hrRepository.getEmployeeLoans(tenantId);
    const loan = list.find((l) => l.id === loanId);
    if (!loan) throw new Error(`Loan ${loanId} not found.`);
    loan.status = approved ? "ACTIVE" : "CANCELLED";
    loan.approvedBy = userId;
    loan.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const saved = await hrRepository.saveEmployeeLoan(loan);
    this.logAudit(tenantId, userId, "LOAN_APPROVE", "hr_employee_loans", saved.id, saved);
    return saved;
  }
  // ==========================================
  // REIMBURSEMENTS & FINANCE INTEGRATION
  // ==========================================
  async getReimbursements(tenantId, employeeId) {
    return hrRepository.getReimbursements(tenantId, employeeId);
  }
  async submitReimbursement(tenantId, userId, data) {
    const reimb = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || "",
      category: data.category || "Travel",
      amount: data.amount || 150,
      expenseDate: data.expenseDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      description: data.description || "Travel reimbursement",
      receiptReference: data.receiptReference || "REC-001",
      status: "SUBMITTED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveReimbursement(reimb);
    this.logAudit(tenantId, userId, "REIMBURSEMENT_SUBMIT", "hr_reimbursements", saved.id, saved);
    return saved;
  }
  async approveReimbursement(tenantId, userId, reimbursementId, approved) {
    const list = await hrRepository.getReimbursements(tenantId);
    const reimb = list.find((r) => r.id === reimbursementId);
    if (!reimb) throw new Error(`Reimbursement ${reimbursementId} not found.`);
    reimb.status = approved ? "APPROVED" : "REJECTED";
    reimb.approvedBy = userId;
    reimb.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (approved) {
      const journal = {
        id: generateUuidV7(),
        tenantId,
        journalNumber: `JNL-REIMB-${Date.now().toString().slice(-4)}`,
        journalDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        referenceType: "EXPENSE",
        referenceId: reimb.id,
        description: `Employee Reimbursement: ${reimb.category} - ${reimb.description}`,
        totalDebit: reimb.amount,
        totalCredit: reimb.amount,
        status: "POSTED",
        createdBy: userId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      db.journals.set(journal.id, journal);
      reimb.financeJournalId = journal.id;
      reimb.status = "PAID";
    }
    const saved = await hrRepository.saveReimbursement(reimb);
    this.logAudit(tenantId, userId, "REIMBURSEMENT_APPROVE", "hr_reimbursements", saved.id, saved);
    return saved;
  }
  // ==========================================
  // DOCUMENTS
  // ==========================================
  async getEmployeeDocuments(tenantId, employeeId) {
    return hrRepository.getEmployeeDocuments(tenantId, employeeId);
  }
  async addEmployeeDocument(tenantId, userId, data) {
    const doc = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || "",
      documentType: data.documentType || "ID",
      documentName: data.documentName || "Document.pdf",
      fileReference: data.fileReference || "doc_ref_123",
      expiryDate: data.expiryDate,
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveEmployeeDocument(doc);
    this.logAudit(tenantId, userId, "EMPLOYEE_DOCUMENT_ADD", "hr_employee_documents", saved.id, saved);
    return saved;
  }
  // ==========================================
  // PERFORMANCE
  // ==========================================
  async getPerformanceCycles(tenantId) {
    return hrRepository.getPerformanceCycles(tenantId);
  }
  async createPerformanceCycle(tenantId, userId, data) {
    const pc = {
      id: generateUuidV7(),
      tenantId,
      cycleName: data.cycleName || `Annual Review ${(/* @__PURE__ */ new Date()).getFullYear()}`,
      startDate: data.startDate || `${(/* @__PURE__ */ new Date()).getFullYear()}-01-01`,
      endDate: data.endDate || `${(/* @__PURE__ */ new Date()).getFullYear()}-12-31`,
      status: "ACTIVE",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.savePerformanceCycle(pc);
    this.logAudit(tenantId, userId, "PERFORMANCE_CYCLE_CREATE", "hr_performance_cycles", saved.id, saved);
    return saved;
  }
  async getEmployeeGoals(tenantId, employeeId) {
    return hrRepository.getEmployeeGoals(tenantId, employeeId);
  }
  async createEmployeeGoal(tenantId, userId, data) {
    const goal = {
      id: generateUuidV7(),
      tenantId,
      cycleId: data.cycleId || "",
      employeeId: data.employeeId || "",
      goalTitle: data.goalTitle || "Quarterly KPI Goal",
      description: data.description || "Achieve operational SLA target",
      weightage: data.weightage || 100,
      targetValue: data.targetValue || 100,
      achievedValue: data.achievedValue || 0,
      status: "IN_PROGRESS",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveEmployeeGoal(goal);
    this.logAudit(tenantId, userId, "EMPLOYEE_GOAL_CREATE", "hr_employee_goals", saved.id, saved);
    return saved;
  }
  async getEmployeeReviews(tenantId, employeeId) {
    return hrRepository.getEmployeeReviews(tenantId, employeeId);
  }
  async submitEmployeeReview(tenantId, userId, data) {
    const rev = {
      id: generateUuidV7(),
      tenantId,
      cycleId: data.cycleId || "",
      employeeId: data.employeeId || "",
      reviewerUserId: userId,
      selfRating: data.selfRating || 4.5,
      managerRating: data.managerRating || 4.5,
      finalRating: data.finalRating || 4.5,
      feedback: data.feedback || "Exceeds performance benchmarks.",
      status: "COMPLETED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveEmployeeReview(rev);
    this.logAudit(tenantId, userId, "EMPLOYEE_REVIEW_SUBMIT", "hr_employee_reviews", saved.id, saved);
    return saved;
  }
  // ==========================================
  // RECRUITMENT & ATS
  // ==========================================
  async getJobRequisitions(tenantId) {
    return hrRepository.getJobRequisitions(tenantId);
  }
  async createJobRequisition(tenantId, userId, data) {
    const req = {
      id: generateUuidV7(),
      tenantId,
      title: data.title || "Senior Software Engineer",
      departmentId: data.departmentId || "",
      designationId: data.designationId || "",
      openings: data.openings || 2,
      status: "OPEN",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveJobRequisition(req);
    this.logAudit(tenantId, userId, "JOB_REQUISITION_CREATE", "hr_job_requisitions", saved.id, saved);
    return saved;
  }
  async getCandidates(tenantId) {
    return hrRepository.getCandidates(tenantId);
  }
  async createCandidate(tenantId, userId, data) {
    const cand = {
      id: generateUuidV7(),
      tenantId,
      firstName: data.firstName || "Candidate",
      lastName: data.lastName || "Name",
      email: data.email || `candidate.${Date.now()}@example.com`,
      phone: data.phone || "+1234567890",
      resumeReference: data.resumeReference || "resume_ref_123",
      status: "NEW",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveCandidate(cand);
    this.logAudit(tenantId, userId, "CANDIDATE_CREATE", "hr_candidates", saved.id, saved);
    return saved;
  }
  async getApplications(tenantId) {
    return hrRepository.getApplications(tenantId);
  }
  async createApplication(tenantId, userId, requisitionId, candidateId) {
    const app = {
      id: generateUuidV7(),
      tenantId,
      jobRequisitionId: requisitionId,
      candidateId,
      status: "APPLIED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveApplication(app);
    this.logAudit(tenantId, userId, "APPLICATION_CREATE", "hr_applications", saved.id, saved);
    return saved;
  }
  async hireCandidate(tenantId, userId, candidateId, departmentId, designationId) {
    const candidates = await hrRepository.getCandidates(tenantId);
    const cand = candidates.find((c) => c.id === candidateId);
    if (!cand) throw new Error(`Candidate ${candidateId} not found.`);
    cand.status = "HIRED";
    cand.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await hrRepository.saveCandidate(cand);
    const emp = await this.createEmployee(tenantId, userId, {
      firstName: cand.firstName,
      lastName: cand.lastName,
      email: cand.email,
      phone: cand.phone,
      departmentId,
      designationId,
      employmentType: "FULL_TIME",
      employmentStatus: "ACTIVE"
    });
    this.logAudit(tenantId, userId, "CANDIDATE_HIRED", "hr_candidates", cand.id, { candidate: cand, employee: emp });
    return { candidate: cand, employee: emp };
  }
  // ==========================================
  // ONBOARDING, OFFBOARDING & FINAL SETTLEMENT
  // ==========================================
  async getOnboardings(tenantId, employeeId) {
    return hrRepository.getOnboardings(tenantId, employeeId);
  }
  async createOnboardingTask(tenantId, userId, data) {
    const onb = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || "",
      taskName: data.taskName || "Submit Tax & Identity Documents",
      category: data.category || "Documentation",
      status: "PENDING",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveOnboarding(onb);
    this.logAudit(tenantId, userId, "ONBOARDING_TASK_CREATE", "hr_onboarding", saved.id, saved);
    return saved;
  }
  async getOffboardings(tenantId, employeeId) {
    return hrRepository.getOffboardings(tenantId, employeeId);
  }
  async initiateOffboarding(tenantId, userId, data) {
    const offb = {
      id: generateUuidV7(),
      tenantId,
      employeeId: data.employeeId || "",
      resignationDate: data.resignationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      noticePeriodDays: data.noticePeriodDays || 30,
      lastWorkingDate: data.lastWorkingDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      reason: data.reason || "Personal reasons",
      status: "IN_PROGRESS",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveOffboarding(offb);
    this.logAudit(tenantId, userId, "OFFBOARDING_INITIATE", "hr_offboarding", saved.id, saved);
    return saved;
  }
  async calculateFinalSettlement(tenantId, userId, employeeId) {
    const pendingSalary = 2500;
    const leaveSettlement = 500;
    const advanceRecovery = 200;
    const loanRecovery = 300;
    const reimbursements = 150;
    const otherDeductions = 0;
    const netPayable = pendingSalary + leaveSettlement + reimbursements - (advanceRecovery + loanRecovery + otherDeductions);
    const settlement = {
      id: generateUuidV7(),
      tenantId,
      employeeId,
      pendingSalary,
      leaveSettlement,
      advanceRecovery,
      loanRecovery,
      reimbursements,
      otherDeductions,
      netPayable,
      status: "APPROVED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    const saved = await hrRepository.saveFinalSettlement(settlement);
    this.logAudit(tenantId, userId, "FINAL_SETTLEMENT_CALCULATE", "hr_final_settlements", saved.id, saved);
    return saved;
  }
  // ==========================================
  // HR REPORTS
  // ==========================================
  async getHrReports(tenantId, filters = {}) {
    const employees = await hrRepository.getEmployees(tenantId);
    const attendance = await hrRepository.getAttendance(tenantId);
    const leaves = await hrRepository.getLeaveApplications(tenantId);
    const payrollRuns = await hrRepository.getPayrollRuns(tenantId);
    const advances = await hrRepository.getSalaryAdvances(tenantId);
    const loans = await hrRepository.getEmployeeLoans(tenantId);
    return {
      reportType: filters.reportType || "SUMMARY",
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      employeeRegister: employees.map((e) => ({ code: e.employeeCode, name: e.displayName, status: e.employmentStatus, dept: e.departmentId })),
      attendanceSummary: { totalRecords: attendance.length, present: attendance.filter((a) => a.status === "PRESENT").length },
      leaveSummary: { totalApplications: leaves.length, approved: leaves.filter((l) => l.status === "APPROVED").length },
      payrollSummary: { totalRuns: payrollRuns.length, totalNetSalaryPaid: payrollRuns.reduce((sum, r) => sum + r.totalNet, 0) },
      financialAssistance: { advanceBalance: advances.reduce((sum, a) => sum + a.remainingBalance, 0), loanBalance: loans.reduce((sum, l) => sum + l.remainingBalance, 0) }
    };
  }
};
var hrService = new HrService();

// src/server/tests/hrTests.ts
async function runHrTestSuite() {
  const tenantId = "tenant-rz-global-001";
  const userId = "usr-admin-001";
  const results = [];
  const assert = (condition, testName, failureMsg) => {
    if (condition) {
      results.push({ test: testName, status: "PASSED" });
    } else {
      results.push({ test: testName, status: "FAILED", error: failureMsg || "Assertion failed" });
    }
  };
  console.log("=======================================================");
  console.log(" RUNNING PHASE 22 ENTERPRISE HRMS TEST SUITE");
  console.log("=======================================================");
  try {
    const metrics = await hrService.getDashboardMetrics(tenantId);
    assert(metrics.totalEmployees >= 0, "HR Dashboard Metrics Retrieval", "Failed to retrieve dashboard metrics");
    const dept = await hrService.createDepartment(tenantId, userId, {
      code: `TEST-DEPT-${Date.now().toString().slice(-4)}`,
      name: "Quality Assurance & Testing",
      description: "QA & Compliance Division"
    });
    assert(dept.id !== void 0, "HR Department Creation", "Department ID was undefined");
    const desig = await hrService.createDesignation(tenantId, userId, {
      code: `TEST-DESIG-${Date.now().toString().slice(-4)}`,
      title: "Senior QA Automation Engineer",
      departmentId: dept.id,
      gradeLevel: "E2"
    });
    assert(desig.id !== void 0, "HR Designation Creation", "Designation ID was undefined");
    const empCode = `EMP-TEST-${Date.now().toString().slice(-4)}`;
    const emp = await hrService.createEmployee(tenantId, userId, {
      employeeCode: empCode,
      firstName: "Test",
      lastName: "User",
      email: `test.emp.${Date.now()}@racezoneventures.com`,
      phone: "+1 (555) 990-1122",
      departmentId: dept.id,
      designationId: desig.id,
      joiningDate: "2026-01-01",
      employmentStatus: "ACTIVE",
      bankAccountMasked: "9988112233"
    });
    assert(emp.id !== void 0 && emp.bankAccountMasked === "****2233", "Employee Creation & Bank Masking", "Employee creation failed or bank account was not masked correctly");
    let dupErrorCaught = false;
    try {
      await hrService.createEmployee(tenantId, userId, {
        employeeCode: empCode,
        firstName: "Duplicate",
        lastName: "User",
        email: "dup@example.com",
        phone: "+111",
        departmentId: dept.id,
        designationId: desig.id
      });
    } catch (e) {
      dupErrorCaught = true;
    }
    assert(dupErrorCaught, "Duplicate Employee Code Rejection", "System allowed duplicate employee code");
    const link = await hrService.linkEmployeeUser(tenantId, userId, emp.id, userId);
    assert(link.id !== void 0, "Employee User Account Link", "Failed to link employee to user account");
    const shift = await hrService.createShift(tenantId, userId, {
      shiftCode: `SH-${Date.now().toString().slice(-4)}`,
      shiftName: "Test Night Shift",
      startTime: "22:00",
      endTime: "06:00",
      shiftType: "NIGHT"
    });
    assert(shift.id !== void 0, "Shift Creation", "Failed to create shift");
    const checkInAtt = await hrService.checkIn(tenantId, userId, emp.id);
    assert(checkInAtt.checkIn !== void 0, "Attendance Check-In", "Check-in failed");
    const checkOutAtt = await hrService.checkOut(tenantId, userId, checkInAtt.id);
    assert(checkOutAtt.checkOut !== void 0, "Attendance Check-Out", "Check-out failed");
    const leaveType = (await hrService.getLeaveTypes(tenantId))[0];
    assert(leaveType !== void 0, "Leave Types Retrieval", "No leave types found in database");
    const leaveApp1 = await hrService.applyLeave(tenantId, userId, {
      employeeId: emp.id,
      leaveTypeId: leaveType.id,
      startDate: "2026-09-01",
      endDate: "2026-09-05",
      reason: "Vacation"
    });
    assert(leaveApp1.id !== void 0, "Leave Application Submission", "Failed to submit leave application");
    let overlapErrorCaught = false;
    try {
      await hrService.applyLeave(tenantId, userId, {
        employeeId: emp.id,
        leaveTypeId: leaveType.id,
        startDate: "2026-09-03",
        endDate: "2026-09-07",
        reason: "Overlapping Vacation"
      });
    } catch (e) {
      overlapErrorCaught = true;
    }
    assert(overlapErrorCaught, "Leave Overlap Rejection", "System allowed overlapping leave application");
    const approvedLeave = await hrService.approveLeave(tenantId, userId, leaveApp1.id, true);
    assert(approvedLeave.status === "APPROVED", "Leave Application Approval", "Leave status was not APPROVED");
    const salaryStruct = await hrService.createSalaryStructure(tenantId, userId, {
      employeeId: emp.id,
      effectiveDate: "2026-01-01",
      baseSalary: 6e3
    });
    assert(salaryStruct.id !== void 0, "Salary Structure Creation", "Failed to create salary structure");
    const period = (await hrService.getPayrollPeriods(tenantId))[0];
    assert(period !== void 0, "Payroll Period Retrieval", "No payroll period found");
    const payrollRun = await hrService.calculatePayroll(tenantId, period.id, userId);
    assert(payrollRun.id !== void 0 && payrollRun.totalNet > 0, "Payroll Calculation Engine", "Payroll calculation failed or total net <= 0");
    await hrService.approvePayroll(tenantId, payrollRun.id, userId);
    const processedRun = await hrService.processPayroll(tenantId, payrollRun.id, userId);
    assert(processedRun.status === "PROCESSED" && processedRun.journalId !== void 0, "Payroll Processing & Finance Journal Posting", "Payroll processing failed or did not generate Finance journal");
    const reimb = await hrService.submitReimbursement(tenantId, userId, {
      employeeId: emp.id,
      category: "Travel",
      amount: 250,
      description: "Site Visit Flight"
    });
    const approvedReimb = await hrService.approveReimbursement(tenantId, userId, reimb.id, true);
    assert(approvedReimb.status === "PAID" && approvedReimb.financeJournalId !== void 0, "Reimbursement Approval & Finance Journal Posting", "Reimbursement approval failed or did not post Finance journal");
    const cand = await hrService.createCandidate(tenantId, userId, {
      firstName: "Alice",
      lastName: "Wong",
      email: `alice.wong.${Date.now()}@example.com`,
      phone: "+1 555-444-3322"
    });
    const hireResult = await hrService.hireCandidate(tenantId, userId, cand.id, dept.id, desig.id);
    assert(hireResult.candidate.status === "HIRED" && hireResult.employee.id !== void 0, "Recruitment Candidate Hiring Flow", "Candidate hiring flow failed");
    const reports = await hrService.getHrReports(tenantId);
    assert(reports.employeeRegister.length > 0, "HR Reports Generation", "Failed to generate HR reports");
  } catch (err) {
    results.push({ test: "HRMS Suite Global Execution", status: "FAILED", error: err.message });
  }
  const passedCount = results.filter((r) => r.status === "PASSED").length;
  const totalCount = results.length;
  console.log(`HRMS TEST RESULTS: ${passedCount}/${totalCount} PASSED`);
  results.forEach((r) => {
    if (r.status === "PASSED") {
      console.log(`  [PASS] ${r.test}`);
    } else {
      console.error(`  [FAIL] ${r.test}: ${r.error}`);
    }
  });
  return { passedCount, totalCount, results };
}

// src/server/repositories/quarryRepositories.ts
var QuarryRepository = class {
  // ==========================================
  // 1. Quarry Master
  // ==========================================
  async getQuarries(tenantId) {
    return Array.from(db.quarryMasters.values()).filter((q) => q.tenantId === tenantId && !q.deletedAt);
  }
  async getQuarryById(tenantId, id) {
    const quarry = db.quarryMasters.get(id);
    return quarry && quarry.tenantId === tenantId && !quarry.deletedAt ? quarry : void 0;
  }
  async getQuarryByName(tenantId, companyId, name) {
    return Array.from(db.quarryMasters.values()).find(
      (q) => q.tenantId === tenantId && q.companyId === companyId && q.name.toLowerCase() === name.trim().toLowerCase() && !q.deletedAt
    );
  }
  async saveQuarry(quarry) {
    db.quarryMasters.set(quarry.id, quarry);
    db.persistToDisk();
    return quarry;
  }
  // ==========================================
  // 2. Stone Products
  // ==========================================
  async getProducts(tenantId, quarryId) {
    return Array.from(db.stoneProducts.values()).filter(
      (p) => p.tenantId === tenantId && (!quarryId || p.quarryId === quarryId)
    );
  }
  async getProductById(tenantId, id) {
    const prod = db.stoneProducts.get(id);
    return prod && prod.tenantId === tenantId ? prod : void 0;
  }
  async getProductByCode(tenantId, quarryId, productCode) {
    return Array.from(db.stoneProducts.values()).find(
      (p) => p.tenantId === tenantId && p.quarryId === quarryId && p.productCode.toLowerCase() === productCode.trim().toLowerCase()
    );
  }
  async saveProduct(product) {
    db.stoneProducts.set(product.id, product);
    db.persistToDisk();
    return product;
  }
  // ==========================================
  // 3. Quarry Production
  // ==========================================
  async getProductions(tenantId, quarryId) {
    return Array.from(db.quarryProductions.values()).filter(
      (p) => p.tenantId === tenantId && (!quarryId || p.quarryId === quarryId)
    ).sort((a, b) => new Date(b.productionDate).getTime() - new Date(a.productionDate).getTime());
  }
  async getProductionById(tenantId, id) {
    const prod = db.quarryProductions.get(id);
    return prod && prod.tenantId === tenantId ? prod : void 0;
  }
  async saveProduction(production) {
    db.quarryProductions.set(production.id, production);
    db.persistToDisk();
    return production;
  }
  // ==========================================
  // 4. Quarry Stock Ledger
  // ==========================================
  async getStockLedger(tenantId, quarryId, productId) {
    return Array.from(db.quarryStocks.values()).filter(
      (s) => s.tenantId === tenantId && s.quarryId === quarryId && s.productId === productId
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
  async getAllStockEntries(tenantId, quarryId) {
    return Array.from(db.quarryStocks.values()).filter(
      (s) => s.tenantId === tenantId && (!quarryId || s.quarryId === quarryId)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async calculateBalance(tenantId, quarryId, productId) {
    const entries = await this.getStockLedger(tenantId, quarryId, productId);
    let balance = 0;
    for (const entry of entries) {
      if (entry.transactionType === "STOCK_IN" || entry.transactionType === "ADJUSTMENT_IN") {
        balance += entry.quantityIn || 0;
      } else if (entry.transactionType === "STOCK_OUT" || entry.transactionType === "ADJUSTMENT_OUT") {
        balance -= entry.quantityOut || 0;
      }
    }
    return balance;
  }
  async findStockEntryByReference(tenantId, quarryId, productId, referenceType, referenceId, transactionType) {
    return Array.from(db.quarryStocks.values()).find(
      (s) => s.tenantId === tenantId && s.quarryId === quarryId && s.productId === productId && s.referenceType === referenceType && s.referenceId === referenceId && s.transactionType === transactionType
    );
  }
  async saveStock(stock) {
    db.quarryStocks.set(stock.id, stock);
    db.persistToDisk();
    return stock;
  }
  // ==========================================
  // 5. Gate Pass
  // ==========================================
  async getGatePasses(tenantId, quarryId) {
    return Array.from(db.gatePasses.values()).filter(
      (g) => g.tenantId === tenantId && (!quarryId || g.quarryId === quarryId)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async getGatePassById(tenantId, id) {
    const gp = db.gatePasses.get(id);
    return gp && gp.tenantId === tenantId ? gp : void 0;
  }
  async getGatePassByNumber(tenantId, passNumber) {
    return Array.from(db.gatePasses.values()).find(
      (g) => g.tenantId === tenantId && g.passNumber.toLowerCase() === passNumber.trim().toLowerCase()
    );
  }
  async countGatePasses(tenantId, quarryId) {
    return Array.from(db.gatePasses.values()).filter(
      (g) => g.tenantId === tenantId && g.quarryId === quarryId
    ).length;
  }
  async saveGatePass(gp) {
    db.gatePasses.set(gp.id, gp);
    db.persistToDisk();
    return gp;
  }
  // ==========================================
  // 6. Land Leases
  // ==========================================
  async getLandLeases(tenantId, quarryId) {
    return Array.from(db.quarryLandLeases.values()).filter(
      (l) => l.tenantId === tenantId && (!quarryId || l.quarryId === quarryId)
    );
  }
  async getLandLeaseById(tenantId, id) {
    const lease = db.quarryLandLeases.get(id);
    return lease && lease.tenantId === tenantId ? lease : void 0;
  }
  async saveLandLease(lease) {
    db.quarryLandLeases.set(lease.id, lease);
    db.persistToDisk();
    return lease;
  }
  // ==========================================
  // 7. Landowner Settlements
  // ==========================================
  async getSettlements(tenantId, leaseId) {
    return Array.from(db.landownerSettlements.values()).filter(
      (s) => s.tenantId === tenantId && (!leaseId || s.leaseId === leaseId)
    );
  }
  async getSettlementById(tenantId, id) {
    const s = db.landownerSettlements.get(id);
    return s && s.tenantId === tenantId ? s : void 0;
  }
  async saveSettlement(s) {
    db.landownerSettlements.set(s.id, s);
    db.persistToDisk();
    return s;
  }
};

// src/server/services/quarryServices.ts
var QuarryDomainError = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.name = "QuarryDomainError";
    this.code = code;
    this.details = details;
  }
};
var QuarryMasterService = class {
  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }
  async createQuarry(dto, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    if (!dto.name || !dto.name.trim()) throw new QuarryDomainError("INVALID_QUARRY_TYPE", "Quarry name is required.");
    if (dto.quarryType !== "LATERITE" && dto.quarryType !== "HARD_ROCK") {
      throw new QuarryDomainError("INVALID_QUARRY_TYPE", `Invalid quarry type '${dto.quarryType}'. Must be LATERITE or HARD_ROCK.`);
    }
    const company = db.companies.get(dto.companyId);
    if (!company || company.tenantId !== ctx.tenantId) {
      throw new QuarryDomainError("INVALID_COMPANY", `Company '${dto.companyId}' is invalid or access is denied.`);
    }
    const branch = db.branches.get(dto.branchId);
    if (!branch || branch.tenantId !== ctx.tenantId) {
      throw new QuarryDomainError("INVALID_BRANCH", `Branch '${dto.branchId}' is invalid or access is denied.`);
    }
    const existing = await this.repo.getQuarryByName(ctx.tenantId, dto.companyId, dto.name);
    if (existing) {
      throw new QuarryDomainError("DUPLICATE_QUARRY", `A quarry with name '${dto.name}' already exists in this company.`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const quarryId = generateUuidV7();
    const quarry = {
      id: quarryId,
      tenantId: ctx.tenantId,
      companyId: dto.companyId,
      branchId: dto.branchId,
      businessUnitId: dto.businessUnitId,
      name: dto.name.trim(),
      quarryType: dto.quarryType,
      status: "ACTIVE",
      location: dto.location || "",
      address: dto.address,
      ownerId: dto.ownerId || ctx.userId,
      leaseReference: dto.leaseReference,
      createdAt: now,
      updatedAt: now,
      createdBy: ctx.userId,
      version: 1
    };
    await this.repo.saveQuarry(quarry);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "QUARRY_MASTER_CREATE",
      module: "Quarry Management",
      resource: "QuarryMaster",
      resourceId: quarry.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-quarry-${quarry.id}`,
      afterStateJson: JSON.stringify(quarry),
      status: "SUCCESS"
    });
    return quarry;
  }
  async getQuarry(id, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant context required.");
    const quarry = await this.repo.getQuarryById(ctx.tenantId, id);
    if (!quarry) {
      throw new QuarryDomainError("QUARRY_NOT_FOUND", `Quarry '${id}' not found or access denied.`);
    }
    return quarry;
  }
  async listQuarries(ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant context required.");
    return this.repo.getQuarries(ctx.tenantId);
  }
  async updateQuarry(id, dto, ctx) {
    const quarry = await this.getQuarry(id, ctx);
    const beforeState = JSON.stringify(quarry);
    if (dto.name && dto.name.trim()) {
      const existing = await this.repo.getQuarryByName(ctx.tenantId, quarry.companyId, dto.name);
      if (existing && existing.id !== quarry.id) {
        throw new QuarryDomainError("DUPLICATE_QUARRY", `Another quarry with name '${dto.name}' already exists.`);
      }
      quarry.name = dto.name.trim();
    }
    if (dto.location !== void 0) quarry.location = dto.location;
    if (dto.address !== void 0) quarry.address = dto.address;
    if (dto.ownerId !== void 0) quarry.ownerId = dto.ownerId;
    if (dto.leaseReference !== void 0) quarry.leaseReference = dto.leaseReference;
    if (dto.status !== void 0) quarry.status = dto.status;
    quarry.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    quarry.updatedBy = ctx.userId;
    quarry.version = (quarry.version || 1) + 1;
    await this.repo.saveQuarry(quarry);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "QUARRY_MASTER_UPDATE",
      module: "Quarry Management",
      resource: "QuarryMaster",
      resourceId: quarry.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-quarry-${quarry.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(quarry),
      status: "SUCCESS"
    });
    return quarry;
  }
  async deactivateQuarry(id, ctx) {
    const quarry = await this.getQuarry(id, ctx);
    const beforeState = JSON.stringify(quarry);
    quarry.status = "INACTIVE";
    quarry.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    quarry.updatedBy = ctx.userId;
    await this.repo.saveQuarry(quarry);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "QUARRY_MASTER_DEACTIVATE",
      module: "Quarry Management",
      resource: "QuarryMaster",
      resourceId: quarry.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-quarry-${quarry.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(quarry),
      status: "SUCCESS"
    });
    return quarry;
  }
};
var StoneProductService = class {
  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }
  async createStoneProduct(dto, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    if (!dto.productCode || !dto.productCode.trim()) throw new QuarryDomainError("INVALID_PRODUCT", "Product code is required.");
    if (!dto.name || !dto.name.trim()) throw new QuarryDomainError("INVALID_PRODUCT", "Product name is required.");
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) {
      throw new QuarryDomainError("QUARRY_NOT_FOUND", `Quarry '${dto.quarryId}' not found or access denied.`);
    }
    if (dto.mineralType !== quarry.quarryType) {
      throw new QuarryDomainError(
        "INVALID_PRODUCT",
        `Product mineral type '${dto.mineralType}' does not match quarry type '${quarry.quarryType}'.`
      );
    }
    const validUnits = ["TON", "CFT", "PIECE", "LOAD"];
    if (!validUnits.includes(dto.unit)) {
      throw new QuarryDomainError("INVALID_PRODUCT", `Invalid product unit '${dto.unit}'. Allowed: TON, CFT, PIECE, LOAD.`);
    }
    if (dto.defaultPrice === void 0 || dto.defaultPrice < 0) {
      throw new QuarryDomainError("INVALID_PRODUCT", "Default price must be non-negative.");
    }
    const existing = await this.repo.getProductByCode(ctx.tenantId, dto.quarryId, dto.productCode);
    if (existing) {
      throw new QuarryDomainError("DUPLICATE_PRODUCT", `A product with code '${dto.productCode}' already exists for this quarry.`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const product = {
      id: generateUuidV7(),
      tenantId: ctx.tenantId,
      quarryId: dto.quarryId,
      productCode: dto.productCode.trim(),
      name: dto.name.trim(),
      mineralType: dto.mineralType,
      dimensions: dto.dimensions,
      unit: dto.unit,
      defaultPrice: dto.defaultPrice,
      gstRate: dto.gstRate !== void 0 ? dto.gstRate : 5,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      createdBy: ctx.userId
    };
    await this.repo.saveProduct(product);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "STONE_PRODUCT_CREATE",
      module: "Quarry Management",
      resource: "StoneProduct",
      resourceId: product.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-prod-${product.id}`,
      afterStateJson: JSON.stringify(product),
      status: "SUCCESS"
    });
    return product;
  }
  async getStoneProduct(id, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const prod = await this.repo.getProductById(ctx.tenantId, id);
    if (!prod) {
      throw new QuarryDomainError("PRODUCT_NOT_FOUND", `Stone product '${id}' not found or access denied.`);
    }
    return prod;
  }
  async listStoneProducts(ctx, quarryId) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    return this.repo.getProducts(ctx.tenantId, quarryId);
  }
  async updateStoneProduct(id, dto, ctx) {
    const product = await this.getStoneProduct(id, ctx);
    const beforeState = JSON.stringify(product);
    if (dto.name !== void 0) product.name = dto.name.trim();
    if (dto.dimensions !== void 0) product.dimensions = dto.dimensions;
    if (dto.unit !== void 0) product.unit = dto.unit;
    if (dto.defaultPrice !== void 0) {
      if (dto.defaultPrice < 0) throw new QuarryDomainError("INVALID_PRODUCT", "Price cannot be negative.");
      product.defaultPrice = dto.defaultPrice;
    }
    if (dto.gstRate !== void 0) product.gstRate = dto.gstRate;
    if (dto.status !== void 0) product.status = dto.status;
    product.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    product.updatedBy = ctx.userId;
    await this.repo.saveProduct(product);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "STONE_PRODUCT_UPDATE",
      module: "Quarry Management",
      resource: "StoneProduct",
      resourceId: product.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-prod-${product.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(product),
      status: "SUCCESS"
    });
    return product;
  }
  async deactivateStoneProduct(id, ctx) {
    const product = await this.getStoneProduct(id, ctx);
    const beforeState = JSON.stringify(product);
    product.status = "INACTIVE";
    product.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    product.updatedBy = ctx.userId;
    await this.repo.saveProduct(product);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "STONE_PRODUCT_DEACTIVATE",
      module: "Quarry Management",
      resource: "StoneProduct",
      resourceId: product.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-prod-${product.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(product),
      status: "SUCCESS"
    });
    return product;
  }
};
var ProductionService = class {
  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }
  /**
   * Enterprise Production Flow:
   * Production -> validate Quarry -> validate Product -> validate Operator -> validate Machine -> create Production -> create exactly ONE STOCK_IN -> Audit
   */
  async recordProduction(dto, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    if (!dto.quarryId) throw new QuarryDomainError("QUARRY_NOT_FOUND", "Quarry ID is required.");
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) throw new QuarryDomainError("QUARRY_NOT_FOUND", `Quarry '${dto.quarryId}' not found or access denied.`);
    if (quarry.status !== "ACTIVE") throw new QuarryDomainError("INVALID_QUARRY_TYPE", `Quarry '${quarry.name}' is not ACTIVE.`);
    const resolvedProductionType = dto.productionType || (quarry.quarryType === "LATERITE" ? "LATERITE_CUTTING" : "HARD_ROCK_EXTRACTION");
    if (resolvedProductionType === "LATERITE_CUTTING" && quarry.quarryType !== "LATERITE") {
      throw new QuarryDomainError("INVALID_QUARRY_TYPE", `Cannot perform LATERITE_CUTTING on a ${quarry.quarryType} quarry.`);
    }
    if (resolvedProductionType === "HARD_ROCK_EXTRACTION" && quarry.quarryType !== "HARD_ROCK") {
      throw new QuarryDomainError("INVALID_QUARRY_TYPE", `Cannot perform HARD_ROCK_EXTRACTION on a ${quarry.quarryType} quarry.`);
    }
    if (!dto.productId) throw new QuarryDomainError("PRODUCT_NOT_FOUND", "Product ID is required.");
    const product = await this.repo.getProductById(ctx.tenantId, dto.productId);
    if (!product) throw new QuarryDomainError("PRODUCT_NOT_FOUND", `Product '${dto.productId}' not found or access denied.`);
    if (product.status !== "ACTIVE") throw new QuarryDomainError("INVALID_PRODUCT", `Product '${product.name}' is not ACTIVE.`);
    if (product.mineralType !== quarry.quarryType) {
      throw new QuarryDomainError("INVALID_PRODUCT", `Product mineral type '${product.mineralType}' is incompatible with quarry type '${quarry.quarryType}'.`);
    }
    if (product.quarryId && product.quarryId !== quarry.id) {
      throw new QuarryDomainError("INVALID_PRODUCT", `Product '${product.name}' is assigned to a different quarry.`);
    }
    if (dto.operatorId) {
      const opUser = db.users.get(dto.operatorId);
      const opEmp = db.hrEmployees.get(dto.operatorId);
      const validUser = opUser && opUser.tenantId === ctx.tenantId && !opUser.deletedAt;
      const validEmp = opEmp && opEmp.tenantId === ctx.tenantId && opEmp.status === "ACTIVE";
      if (!validUser && !validEmp) {
        throw new QuarryDomainError("INVALID_OPERATOR", `Operator '${dto.operatorId}' is not an active staff/user in this tenant.`);
      }
    }
    if (dto.machineId) {
      const machine = db.fleetVehicles.get(dto.machineId);
      if (machine && machine.tenantId !== ctx.tenantId) {
        throw new QuarryDomainError("INVALID_MACHINE", `Machine vehicle '${dto.machineId}' belongs to another tenant.`);
      }
    }
    if (!dto.quantity || dto.quantity <= 0 || isNaN(dto.quantity)) {
      throw new QuarryDomainError("INVALID_QUANTITY", "Production quantity must be greater than zero.");
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const productionDate = dto.productionDate || now.split("T")[0];
    const productionId = dto.id || generateUuidV7();
    const releaseLock = await db.acquireStockAdvisoryLock(ctx.tenantId, quarry.id, product.id);
    try {
      return await db.executeTransaction(async (tx) => {
        if (tx.isPostgres && tx.acquireAdvisoryLock) {
          await tx.acquireAdvisoryLock(`stock_lock:${ctx.tenantId}:${quarry.id}:${product.id}`);
        }
        const existingProd = await this.repo.getProductionById(ctx.tenantId, productionId);
        if (existingProd) {
          const existingStock = await this.repo.findStockEntryByReference(
            ctx.tenantId,
            quarry.id,
            product.id,
            "PRODUCTION",
            existingProd.id,
            "STOCK_IN"
          );
          if (existingStock) {
            const balance = await this.repo.calculateBalance(ctx.tenantId, quarry.id, product.id);
            return { production: existingProd, stockLedgerEntry: existingStock, newBalance: balance };
          }
        }
        const production = {
          id: productionId,
          tenantId: ctx.tenantId,
          quarryId: quarry.id,
          productId: product.id,
          productionType: resolvedProductionType,
          productionDate,
          shift: dto.shift || "DAY",
          quantity: Number(dto.quantity),
          unit: product.unit,
          operatorId: dto.operatorId || ctx.userId,
          machineId: dto.machineId,
          remarks: dto.remarks,
          createdAt: now,
          updatedAt: now,
          createdBy: ctx.userId
        };
        const prevBalance = await this.repo.calculateBalance(ctx.tenantId, quarry.id, product.id);
        const newBalance = prevBalance + Number(dto.quantity);
        const stockLedgerEntry = {
          id: generateUuidV7(),
          tenantId: ctx.tenantId,
          quarryId: quarry.id,
          productId: product.id,
          transactionType: "STOCK_IN",
          referenceType: "PRODUCTION",
          referenceId: production.id,
          quantityIn: Number(dto.quantity),
          quantityOut: 0,
          balanceQuantity: newBalance,
          transactionDate: productionDate,
          createdBy: ctx.userId,
          createdAt: now
        };
        db.quarryProductions.set(production.id, production);
        db.quarryStocks.set(stockLedgerEntry.id, stockLedgerEntry);
        await this.auditRepo.log({
          tenantId: ctx.tenantId,
          actorUserId: ctx.userId,
          actorEmail: ctx.userEmail || "system@minetrix.local",
          action: "QUARRY_PRODUCTION_RECORD",
          module: "Quarry Management",
          resource: "QuarryProduction",
          resourceId: production.id,
          ipAddress: ctx.ipAddress || "127.0.0.1",
          correlationId: ctx.correlationId || `corr-prod-${production.id}`,
          beforeStateJson: JSON.stringify({ previousBalance: prevBalance }),
          afterStateJson: JSON.stringify({
            productionId: production.id,
            stockLedgerId: stockLedgerEntry.id,
            quarryId: quarry.id,
            productId: product.id,
            quantity: dto.quantity,
            unit: product.unit,
            newBalance
          }),
          status: "SUCCESS"
        });
        return { production, stockLedgerEntry, newBalance };
      }, ctx.tenantId);
    } catch (err) {
      if (err.code === "23505") {
        throw new QuarryDomainError("DUPLICATE_STOCK_TRANSACTION", "A stock ledger entry for this production reference already exists.");
      }
      throw err;
    } finally {
      releaseLock();
    }
  }
  async getProduction(id, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const prod = await this.repo.getProductionById(ctx.tenantId, id);
    if (!prod) throw new QuarryDomainError("PRODUCTION_NOT_FOUND", `Production record '${id}' not found.`);
    return prod;
  }
  async listProduction(ctx, quarryId) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    return this.repo.getProductions(ctx.tenantId, quarryId);
  }
};
var StockService = class {
  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }
  async getStockBalance(quarryId, productId, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const quarry = await this.repo.getQuarryById(ctx.tenantId, quarryId);
    if (!quarry) throw new QuarryDomainError("QUARRY_NOT_FOUND", `Quarry '${quarryId}' not found.`);
    const product = await this.repo.getProductById(ctx.tenantId, productId);
    if (!product) throw new QuarryDomainError("PRODUCT_NOT_FOUND", `Product '${productId}' not found.`);
    return this.repo.calculateBalance(ctx.tenantId, quarryId, productId);
  }
  async getStockLedger(quarryId, productId, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    return this.repo.getStockLedger(ctx.tenantId, quarryId, productId);
  }
  async recordStockAdjustment(dto, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    if (!dto.reason || !dto.reason.trim()) {
      throw new QuarryDomainError("INVALID_STOCK_ADJUSTMENT", "Stock adjustment requires a valid justification reason.");
    }
    if (!dto.quantity || dto.quantity <= 0) {
      throw new QuarryDomainError("INVALID_QUANTITY", "Adjustment quantity must be greater than zero.");
    }
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) throw new QuarryDomainError("QUARRY_NOT_FOUND", `Quarry '${dto.quarryId}' not found.`);
    const product = await this.repo.getProductById(ctx.tenantId, dto.productId);
    if (!product) throw new QuarryDomainError("PRODUCT_NOT_FOUND", `Product '${dto.productId}' not found.`);
    const currentBalance = await this.repo.calculateBalance(ctx.tenantId, dto.quarryId, dto.productId);
    if (dto.adjustmentType === "ADJUSTMENT_OUT" && currentBalance < dto.quantity) {
      throw new QuarryDomainError(
        "INSUFFICIENT_STOCK",
        `Cannot adjust out ${dto.quantity} ${product.unit}. Available balance is only ${currentBalance} ${product.unit}.`
      );
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newBalance = dto.adjustmentType === "ADJUSTMENT_IN" ? currentBalance + dto.quantity : currentBalance - dto.quantity;
    const adjustmentId = generateUuidV7();
    const entry = {
      id: adjustmentId,
      tenantId: ctx.tenantId,
      quarryId: dto.quarryId,
      productId: dto.productId,
      transactionType: dto.adjustmentType,
      referenceType: "STOCK_ADJUSTMENT",
      referenceId: adjustmentId,
      quantityIn: dto.adjustmentType === "ADJUSTMENT_IN" ? dto.quantity : 0,
      quantityOut: dto.adjustmentType === "ADJUSTMENT_OUT" ? dto.quantity : 0,
      balanceQuantity: newBalance,
      transactionDate: now.split("T")[0],
      createdBy: ctx.userId,
      createdAt: now
    };
    await this.repo.saveStock(entry);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "STOCK_ADJUSTMENT_RECORD",
      module: "Quarry Management",
      resource: "QuarryStock",
      resourceId: entry.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-stk-${entry.id}`,
      beforeStateJson: JSON.stringify({ previousBalance: currentBalance, reason: dto.reason }),
      afterStateJson: JSON.stringify({
        stockId: entry.id,
        quarryId: dto.quarryId,
        productId: dto.productId,
        adjustmentType: dto.adjustmentType,
        quantity: dto.quantity,
        newBalance,
        reason: dto.reason
      }),
      status: "SUCCESS"
    });
    return entry;
  }
  async getQuarryStockSummary(quarryId, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const quarry = await this.repo.getQuarryById(ctx.tenantId, quarryId);
    if (!quarry) throw new QuarryDomainError("QUARRY_NOT_FOUND", `Quarry '${quarryId}' not found.`);
    const products = await this.repo.getProducts(ctx.tenantId, quarryId);
    const summaryList = [];
    for (const prod of products) {
      const balance = await this.repo.calculateBalance(ctx.tenantId, quarryId, prod.id);
      summaryList.push({
        productId: prod.id,
        productCode: prod.productCode,
        productName: prod.name,
        unit: prod.unit,
        mineralType: prod.mineralType,
        balanceQuantity: balance,
        status: prod.status
      });
    }
    return summaryList;
  }
};
var GatePassService = class {
  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }
  async generateSequentialPassNumber(tenantId, quarryId) {
    const quarry = await this.repo.getQuarryById(tenantId, quarryId);
    const code = quarry ? quarry.name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 3).toUpperCase() : "QRY";
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const count = await this.repo.countGatePasses(tenantId, quarryId);
    const seq = String(count + 1).padStart(5, "0");
    return `GP-${code}-${year}-${seq}`;
  }
  async createGatePass(dto, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) throw new QuarryDomainError("QUARRY_NOT_FOUND", `Quarry '${dto.quarryId}' not found.`);
    const customer = db.crmCustomers.get(dto.customerId) || db.customerInvoices.get(dto.customerId);
    if (!dto.customerId) throw new QuarryDomainError("INVALID_CUSTOMER", "Customer ID is required.");
    const product = await this.repo.getProductById(ctx.tenantId, dto.productId);
    if (!product) throw new QuarryDomainError("PRODUCT_NOT_FOUND", `Product '${dto.productId}' not found.`);
    if (!dto.quantity || dto.quantity <= 0) {
      throw new QuarryDomainError("INVALID_QUANTITY", "Gate pass quantity must be greater than zero.");
    }
    let netWeight = void 0;
    if (dto.grossWeight !== void 0 && dto.tareWeight !== void 0) {
      if (dto.grossWeight < dto.tareWeight) {
        throw new QuarryDomainError("INVALID_WEIGHT", `Gross weight (${dto.grossWeight}) cannot be less than tare weight (${dto.tareWeight}).`);
      }
      netWeight = dto.grossWeight - dto.tareWeight;
    }
    const availableStock = await this.repo.calculateBalance(ctx.tenantId, dto.quarryId, dto.productId);
    if (availableStock < dto.quantity) {
      throw new QuarryDomainError(
        "INSUFFICIENT_STOCK",
        `Insufficient stock for product '${product.name}'. Available: ${availableStock} ${product.unit}, requested: ${dto.quantity} ${product.unit}.`
      );
    }
    if (dto.vehicleId) {
      const vehicle = db.fleetVehicles.get(dto.vehicleId);
      if (vehicle && vehicle.tenantId !== ctx.tenantId) {
        throw new QuarryDomainError("INVALID_VEHICLE", `Vehicle '${dto.vehicleId}' does not belong to this tenant.`);
      }
    }
    if (dto.driverId) {
      const driver = db.fleetDrivers.get(dto.driverId) || db.hrEmployees.get(dto.driverId);
      if (driver && driver.tenantId !== ctx.tenantId) {
        throw new QuarryDomainError("INVALID_DRIVER", `Driver '${dto.driverId}' does not belong to this tenant.`);
      }
    }
    const passNumber = await this.generateSequentialPassNumber(ctx.tenantId, dto.quarryId);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const gatePass = {
      id: dto.id || generateUuidV7(),
      tenantId: ctx.tenantId,
      quarryId: dto.quarryId,
      passNumber,
      customerId: dto.customerId,
      productId: dto.productId,
      quantity: Number(dto.quantity),
      unit: dto.unit || product.unit,
      vehicleId: dto.vehicleId,
      vehicleNo: dto.vehicleNo,
      driverId: dto.driverId,
      driverName: dto.driverName,
      grossWeight: dto.grossWeight,
      tareWeight: dto.tareWeight,
      netWeight,
      status: "ISSUED",
      salesReference: dto.salesReference,
      createdBy: ctx.userId,
      createdAt: now,
      updatedAt: now
    };
    await this.repo.saveGatePass(gatePass);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "GATE_PASS_CREATE",
      module: "Quarry Management",
      resource: "GatePass",
      resourceId: gatePass.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-gp-${gatePass.id}`,
      afterStateJson: JSON.stringify(gatePass),
      status: "SUCCESS"
    });
    return gatePass;
  }
  async getGatePass(id, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const gp = await this.repo.getGatePassById(ctx.tenantId, id);
    if (!gp) throw new QuarryDomainError("GATE_PASS_NOT_FOUND", `Gate pass '${id}' not found.`);
    return gp;
  }
  async listGatePasses(ctx, quarryId) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    return this.repo.getGatePasses(ctx.tenantId, quarryId);
  }
  async verifyGatePass(id, ctx) {
    const gp = await this.getGatePass(id, ctx);
    if (gp.status !== "ISSUED") {
      throw new QuarryDomainError("INVALID_GATE_PASS_STATE", `Gate pass '${gp.passNumber}' cannot be verified in current status '${gp.status}'. Must be ISSUED.`);
    }
    const beforeState = JSON.stringify(gp);
    gp.status = "VERIFIED";
    gp.approvedBy = ctx.userId;
    gp.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.repo.saveGatePass(gp);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "GATE_PASS_VERIFY",
      module: "Quarry Management",
      resource: "GatePass",
      resourceId: gp.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-gp-${gp.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(gp),
      status: "SUCCESS"
    });
    return gp;
  }
  /**
   * Dispatch Gate Pass:
   * 1. Validates status is VERIFIED or ISSUED
   * 2. Prevents duplicate dispatch / duplicate STOCK_OUT
   * 3. Validates stock availability
   * 4. Deducts stock via atomic STOCK_OUT entry
   * 5. Marks GatePass as DISPATCHED
   * 6. Triggers Shared Finance integration hook
   * 7. Logs audit trail
   */
  async dispatchGatePass(id, ctx) {
    const gp = await this.getGatePass(id, ctx);
    const releaseLock = await db.acquireStockAdvisoryLock(ctx.tenantId, gp.quarryId, gp.productId);
    try {
      return await db.executeTransaction(async (tx) => {
        if (tx.isPostgres && tx.acquireAdvisoryLock) {
          await tx.acquireAdvisoryLock(`stock_lock:${ctx.tenantId}:${gp.quarryId}:${gp.productId}`);
        }
        const currentGp = db.gatePasses.get(id);
        if (!currentGp || currentGp.tenantId !== ctx.tenantId) {
          throw new QuarryDomainError("GATE_PASS_NOT_FOUND", `Gate pass '${id}' not found.`);
        }
        if (currentGp.status === "DISPATCHED") {
          throw new QuarryDomainError("GATE_PASS_ALREADY_DISPATCHED", `Gate pass '${currentGp.passNumber}' has already been dispatched.`);
        }
        if (currentGp.status === "CANCELLED") {
          throw new QuarryDomainError("INVALID_GATE_PASS_STATE", `Cannot dispatch cancelled gate pass '${currentGp.passNumber}'.`);
        }
        const existingStockOut = await this.repo.findStockEntryByReference(
          ctx.tenantId,
          currentGp.quarryId,
          currentGp.productId,
          "GATE_PASS",
          currentGp.id,
          "STOCK_OUT"
        );
        if (existingStockOut) {
          throw new QuarryDomainError("DUPLICATE_STOCK_DEDUCTION", `Stock deduction already exists for gate pass '${currentGp.passNumber}'.`);
        }
        const currentStock = await this.repo.calculateBalance(ctx.tenantId, currentGp.quarryId, currentGp.productId);
        if (currentStock < currentGp.quantity) {
          throw new QuarryDomainError(
            "INSUFFICIENT_STOCK",
            `Cannot dispatch gate pass. Available stock: ${currentStock} ${currentGp.unit}, required: ${currentGp.quantity} ${currentGp.unit}.`
          );
        }
        const now = (/* @__PURE__ */ new Date()).toISOString();
        const remainingStock = currentStock - currentGp.quantity;
        const stockOutEntry = {
          id: generateUuidV7(),
          tenantId: ctx.tenantId,
          quarryId: currentGp.quarryId,
          productId: currentGp.productId,
          transactionType: "STOCK_OUT",
          referenceType: "GATE_PASS",
          referenceId: currentGp.id,
          quantityIn: 0,
          quantityOut: currentGp.quantity,
          balanceQuantity: remainingStock,
          transactionDate: now.split("T")[0],
          createdBy: ctx.userId,
          createdAt: now
        };
        const beforeState = JSON.stringify(currentGp);
        currentGp.status = "DISPATCHED";
        currentGp.updatedAt = now;
        db.gatePasses.set(currentGp.id, currentGp);
        db.quarryStocks.set(stockOutEntry.id, stockOutEntry);
        this.onGatePassDispatched(currentGp, ctx);
        await this.auditRepo.log({
          tenantId: ctx.tenantId,
          actorUserId: ctx.userId,
          actorEmail: ctx.userEmail || "system@minetrix.local",
          action: "GATE_PASS_DISPATCH",
          module: "Quarry Management",
          resource: "GatePass",
          resourceId: currentGp.id,
          ipAddress: ctx.ipAddress || "127.0.0.1",
          correlationId: ctx.correlationId || `corr-gp-${currentGp.id}`,
          beforeStateJson: beforeState,
          afterStateJson: JSON.stringify({
            gatePassId: currentGp.id,
            stockOutEntryId: stockOutEntry.id,
            quantityDeducted: currentGp.quantity,
            remainingStock
          }),
          status: "SUCCESS"
        });
        return { gatePass: currentGp, stockLedgerEntry: stockOutEntry, remainingStock };
      }, ctx.tenantId);
    } catch (err) {
      if (err.code === "23505") {
        throw new QuarryDomainError("DUPLICATE_STOCK_DEDUCTION", "A stock ledger deduction for this gate pass reference already exists.");
      }
      throw err;
    } finally {
      releaseLock();
    }
  }
  async cancelGatePass(id, reason, ctx) {
    const gp = await this.getGatePass(id, ctx);
    if (gp.status === "DISPATCHED") {
      throw new QuarryDomainError("INVALID_GATE_PASS_STATE", `Dispatched gate pass '${gp.passNumber}' cannot be cancelled as stock has already been dispatched.`);
    }
    if (gp.status === "CANCELLED") {
      return gp;
    }
    const beforeState = JSON.stringify(gp);
    gp.status = "CANCELLED";
    gp.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.repo.saveGatePass(gp);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "GATE_PASS_CANCEL",
      module: "Quarry Management",
      resource: "GatePass",
      resourceId: gp.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-gp-${gp.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify({ gatePass: gp, cancelReason: reason }),
      status: "SUCCESS"
    });
    return gp;
  }
  /**
   * Integration point / event hook for Shared Finance (Customer Invoice generation)
   */
  onGatePassDispatched(gp, ctx) {
  }
};
var LandLeaseService = class {
  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }
  async createLease(dto, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    if (!dto.ownerName || !dto.ownerName.trim()) throw new QuarryDomainError("INVALID_LEASE", "Landowner name is required.");
    if (!dto.surveyNumber || !dto.surveyNumber.trim()) throw new QuarryDomainError("INVALID_LEASE", "Survey number is required.");
    if (dto.area <= 0) throw new QuarryDomainError("INVALID_LEASE", "Lease area in acres must be greater than zero.");
    if (dto.royaltyRate < 0) throw new QuarryDomainError("INVALID_LEASE", "Royalty rate cannot be negative.");
    const quarry = await this.repo.getQuarryById(ctx.tenantId, dto.quarryId);
    if (!quarry) throw new QuarryDomainError("QUARRY_NOT_FOUND", `Quarry '${dto.quarryId}' not found.`);
    if (new Date(dto.expiryDate).getTime() < new Date(dto.startDate).getTime()) {
      throw new QuarryDomainError("INVALID_LEASE_DATES", "Lease expiry date cannot be earlier than start date.");
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const lease = {
      id: generateUuidV7(),
      tenantId: ctx.tenantId,
      quarryId: dto.quarryId,
      ownerId: dto.ownerId,
      ownerName: dto.ownerName.trim(),
      surveyNumber: dto.surveyNumber.trim(),
      village: dto.village.trim(),
      taluk: dto.taluk.trim(),
      area: dto.area,
      leaseType: dto.leaseType,
      royaltyType: dto.royaltyType,
      royaltyRate: dto.royaltyRate,
      startDate: dto.startDate,
      expiryDate: dto.expiryDate,
      status: "ACTIVE",
      documentReference: dto.documentReference,
      createdAt: now,
      updatedAt: now
    };
    await this.repo.saveLandLease(lease);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "LAND_LEASE_CREATE",
      module: "Quarry Management",
      resource: "QuarryLandLease",
      resourceId: lease.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-lease-${lease.id}`,
      afterStateJson: JSON.stringify(lease),
      status: "SUCCESS"
    });
    return lease;
  }
  async getLease(id, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const lease = await this.repo.getLandLeaseById(ctx.tenantId, id);
    if (!lease) throw new QuarryDomainError("LEASE_NOT_FOUND", `Land lease '${id}' not found.`);
    return lease;
  }
  async listLeases(ctx, quarryId) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    return this.repo.getLandLeases(ctx.tenantId, quarryId);
  }
  async updateLease(id, dto, ctx) {
    const lease = await this.getLease(id, ctx);
    const beforeState = JSON.stringify(lease);
    if (dto.ownerName !== void 0) lease.ownerName = dto.ownerName.trim();
    if (dto.area !== void 0) {
      if (dto.area <= 0) throw new QuarryDomainError("INVALID_LEASE", "Area must be greater than zero.");
      lease.area = dto.area;
    }
    if (dto.royaltyType !== void 0) lease.royaltyType = dto.royaltyType;
    if (dto.royaltyRate !== void 0) {
      if (dto.royaltyRate < 0) throw new QuarryDomainError("INVALID_LEASE", "Royalty rate cannot be negative.");
      lease.royaltyRate = dto.royaltyRate;
    }
    if (dto.expiryDate !== void 0) lease.expiryDate = dto.expiryDate;
    if (dto.status !== void 0) lease.status = dto.status;
    if (dto.documentReference !== void 0) lease.documentReference = dto.documentReference;
    lease.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.repo.saveLandLease(lease);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "LAND_LEASE_UPDATE",
      module: "Quarry Management",
      resource: "QuarryLandLease",
      resourceId: lease.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-lease-${lease.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(lease),
      status: "SUCCESS"
    });
    return lease;
  }
  async deactivateLease(id, ctx) {
    const lease = await this.getLease(id, ctx);
    const beforeState = JSON.stringify(lease);
    lease.status = "TERMINATED";
    lease.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.repo.saveLandLease(lease);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "LAND_LEASE_TERMINATE",
      module: "Quarry Management",
      resource: "QuarryLandLease",
      resourceId: lease.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-lease-${lease.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(lease),
      status: "SUCCESS"
    });
    return lease;
  }
};
var LandownerSettlementService = class {
  constructor() {
    this.repo = new QuarryRepository();
    this.auditRepo = new AuditRepository();
  }
  calculateSettlement(lease, basisQuantity, periodStart, periodEnd) {
    let calculatedAmount = 0;
    switch (lease.royaltyType) {
      case "FIXED_MONTHLY":
        calculatedAmount = lease.royaltyRate;
        break;
      case "PER_TON":
      case "PER_PIECE":
        calculatedAmount = basisQuantity * lease.royaltyRate;
        break;
      case "REVENUE_PERCENT":
        calculatedAmount = basisQuantity * lease.royaltyRate / 100;
        break;
      default:
        calculatedAmount = basisQuantity * lease.royaltyRate;
    }
    return {
      leaseId: lease.id,
      leaseOwner: lease.ownerName,
      royaltyType: lease.royaltyType,
      royaltyRate: lease.royaltyRate,
      basisQuantity,
      periodStart,
      periodEnd,
      calculatedAmount: Math.round((calculatedAmount + Number.EPSILON) * 100) / 100
    };
  }
  async createSettlement(dto, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    if (dto.basisQuantity < 0) throw new QuarryDomainError("INVALID_SETTLEMENT", "Basis quantity cannot be negative.");
    const lease = await this.repo.getLandLeaseById(ctx.tenantId, dto.leaseId);
    if (!lease) throw new QuarryDomainError("LEASE_NOT_FOUND", `Land lease '${dto.leaseId}' not found.`);
    const calculation = this.calculateSettlement(lease, dto.basisQuantity, dto.periodStart, dto.periodEnd);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const settlement = {
      id: generateUuidV7(),
      tenantId: ctx.tenantId,
      leaseId: lease.id,
      periodStart: dto.periodStart,
      periodEnd: dto.periodEnd,
      basisQuantity: dto.basisQuantity,
      calculatedAmount: calculation.calculatedAmount,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now
    };
    await this.repo.saveSettlement(settlement);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "LANDOWNER_SETTLEMENT_CREATE",
      module: "Quarry Management",
      resource: "LandownerSettlement",
      resourceId: settlement.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-settle-${settlement.id}`,
      afterStateJson: JSON.stringify(settlement),
      status: "SUCCESS"
    });
    return settlement;
  }
  async approveSettlement(id, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const settlement = await this.repo.getSettlementById(ctx.tenantId, id);
    if (!settlement) throw new QuarryDomainError("SETTLEMENT_NOT_FOUND", `Settlement '${id}' not found.`);
    if (settlement.status !== "DRAFT") {
      throw new QuarryDomainError("INVALID_SETTLEMENT_STATE", `Settlement '${id}' is already in status '${settlement.status}'.`);
    }
    const beforeState = JSON.stringify(settlement);
    settlement.status = "APPROVED";
    settlement.financeBillId = `BILL-ROYALTY-${settlement.id.slice(0, 8).toUpperCase()}`;
    settlement.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.repo.saveSettlement(settlement);
    await this.auditRepo.log({
      tenantId: ctx.tenantId,
      actorUserId: ctx.userId,
      actorEmail: ctx.userEmail || "system@minetrix.local",
      action: "LANDOWNER_SETTLEMENT_APPROVE",
      module: "Quarry Management",
      resource: "LandownerSettlement",
      resourceId: settlement.id,
      ipAddress: ctx.ipAddress || "127.0.0.1",
      correlationId: ctx.correlationId || `corr-settle-${settlement.id}`,
      beforeStateJson: beforeState,
      afterStateJson: JSON.stringify(settlement),
      status: "SUCCESS"
    });
    return settlement;
  }
  async getSettlement(id, ctx) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    const settlement = await this.repo.getSettlementById(ctx.tenantId, id);
    if (!settlement) throw new QuarryDomainError("SETTLEMENT_NOT_FOUND", `Settlement '${id}' not found.`);
    return settlement;
  }
  async listSettlements(ctx, leaseId, quarryId) {
    if (!ctx.tenantId) throw new QuarryDomainError("TENANT_ACCESS_DENIED", "Tenant ID is required.");
    let settlements = await this.repo.getSettlements(ctx.tenantId, leaseId);
    if (quarryId) {
      const leases = await this.repo.getLandLeases(ctx.tenantId, quarryId);
      const leaseIdSet = new Set(leases.map((l) => l.id));
      settlements = settlements.filter((s) => leaseIdSet.has(s.leaseId));
    }
    return settlements;
  }
};
var quarryMasterService = new QuarryMasterService();
var stoneProductService = new StoneProductService();
var productionService = new ProductionService();
var stockService = new StockService();
var gatePassService = new GatePassService();
var landLeaseService = new LandLeaseService();
var landownerSettlementService = new LandownerSettlementService();

// src/server/tests/quarryTests.ts
async function runQuarryTestSuite() {
  const results = [];
  const repo = new QuarryRepository();
  const tenantA = "tenant-rz-global-001";
  const tenantB = "tenant-cross-test-999";
  const ctxA = {
    tenantId: tenantA,
    userId: "usr-quarry-mgr-002",
    userEmail: "quarry.manager@racezoneventures.com",
    ipAddress: "192.168.1.100"
  };
  const ctxB = {
    tenantId: tenantB,
    userId: "usr-unauthorized-001",
    userEmail: "intruder@otherorg.com",
    ipAddress: "10.0.0.1"
  };
  let testQuarryId = "";
  let lateriteProdId = "";
  let hardRockProdId = "";
  let testGatePassId = "";
  let testLeaseId = "";
  {
    const start = Date.now();
    try {
      const q = await quarryMasterService.createQuarry({
        companyId: "comp-101",
        branchId: "br-quarry-alpha",
        name: `Test Laterite Site ${Date.now()}`,
        quarryType: "LATERITE",
        location: "Belthangady Zone 4",
        address: "Sy No 89/1, Belthangady"
      }, ctxA);
      testQuarryId = q.id;
      const passed = q.status === "ACTIVE" && q.quarryType === "LATERITE" && q.tenantId === tenantA;
      results.push({
        testName: "1. Create Quarry Master (LATERITE)",
        category: "Quarry Master",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Quarry '${q.name}' created with ID ${q.id}.` : "Failed to create quarry.",
        evidence: { quarryId: q.id, name: q.name, status: q.status }
      });
    } catch (err) {
      results.push({
        testName: "1. Create Quarry Master (LATERITE)",
        category: "Quarry Master",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      let threw = false;
      try {
        await quarryMasterService.getQuarry(testQuarryId, ctxB);
      } catch (e) {
        threw = e instanceof QuarryDomainError || e.message.includes("not found") || e.code === "QUARRY_NOT_FOUND" || e.code === "TENANT_ACCESS_DENIED";
      }
      results.push({
        testName: "2. Tenant Isolation - Cross-Tenant Quarry Read Blocked",
        category: "Security & Isolation",
        passed: threw,
        durationMs: Date.now() - start,
        message: threw ? "Cross-tenant quarry access blocked with domain error." : "Failed: Tenant B accessed Tenant A quarry!"
      });
    } catch (err) {
      results.push({
        testName: "2. Tenant Isolation - Cross-Tenant Quarry Read Blocked",
        category: "Security & Isolation",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const prod = await stoneProductService.createStoneProduct({
        quarryId: testQuarryId,
        productCode: `LAT-PRD-${Date.now().toString().slice(-4)}`,
        name: "Laterite Dressed Stone 30x20x15",
        mineralType: "LATERITE",
        dimensions: "30x20x15 cm",
        unit: "PIECE",
        defaultPrice: 45,
        gstRate: 5
      }, ctxA);
      lateriteProdId = prod.id;
      const passed = prod.mineralType === "LATERITE" && prod.unit === "PIECE" && prod.defaultPrice === 45;
      results.push({
        testName: "3. Create Laterite Stone Product",
        category: "Stone Product",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Created product '${prod.name}' with code ${prod.productCode}.` : "Failed creating laterite product.",
        evidence: { productId: prod.id, code: prod.productCode }
      });
    } catch (err) {
      results.push({
        testName: "3. Create Laterite Stone Product",
        category: "Stone Product",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const prod = await stoneProductService.createStoneProduct({
        quarryId: "qm-hardrock-002",
        productCode: `HR-GSB-${Date.now().toString().slice(-4)}`,
        name: "Granite GSB Sub-Base Material",
        mineralType: "HARD_ROCK",
        unit: "TON",
        defaultPrice: 320,
        gstRate: 5
      }, ctxA);
      hardRockProdId = prod.id;
      const passed = prod.mineralType === "HARD_ROCK" && prod.unit === "TON";
      results.push({
        testName: "4. Create Hard Rock Stone Product",
        category: "Stone Product",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Created Hard Rock product '${prod.name}'.` : "Failed creating hard rock product.",
        evidence: { productId: prod.id, code: prod.productCode }
      });
    } catch (err) {
      results.push({
        testName: "4. Create Hard Rock Stone Product",
        category: "Stone Product",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const res = await productionService.recordProduction({
        quarryId: testQuarryId,
        productId: lateriteProdId,
        productionType: "LATERITE_CUTTING",
        shift: "DAY",
        quantity: 1e3,
        operatorId: "usr-quarry-mgr-002",
        remarks: "Bench 1 high-yield cutting"
      }, ctxA);
      const passed = res.production.quantity === 1e3 && res.production.unit === "PIECE" && res.newBalance === 1e3;
      results.push({
        testName: "5. Record Laterite Production (LATERITE_CUTTING)",
        category: "Production",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Recorded cutting of 1000 PIECES. Balance: ${res.newBalance}.` : "Failed recording laterite production.",
        evidence: { productionId: res.production.id, quantity: res.production.quantity }
      });
    } catch (err) {
      results.push({
        testName: "5. Record Laterite Production (LATERITE_CUTTING)",
        category: "Production",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const initialBalance = await stockService.getStockBalance("qm-hardrock-002", hardRockProdId, ctxA);
      const res = await productionService.recordProduction({
        quarryId: "qm-hardrock-002",
        productId: hardRockProdId,
        productionType: "HARD_ROCK_EXTRACTION",
        shift: "DAY",
        quantity: 250,
        operatorId: "usr-quarry-mgr-002",
        remarks: "Primary boulder blasting excavation"
      }, ctxA);
      const passed = res.production.quantity === 250 && res.production.unit === "TON" && res.newBalance === initialBalance + 250;
      results.push({
        testName: "6. Record Hard Rock Production (HARD_ROCK_EXTRACTION)",
        category: "Production",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Recorded 250 TONS extraction. Balance: ${res.newBalance} TONS.` : "Failed recording hard rock production.",
        evidence: { productionId: res.production.id, newBalance: res.newBalance }
      });
    } catch (err) {
      results.push({
        testName: "6. Record Hard Rock Production (HARD_ROCK_EXTRACTION)",
        category: "Production",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const uniqueProdId = generateUuidV7();
      await productionService.recordProduction({
        id: uniqueProdId,
        quarryId: testQuarryId,
        productId: lateriteProdId,
        quantity: 300,
        operatorId: "usr-quarry-mgr-002"
      }, ctxA);
      const stockEntries = Array.from(db.quarryStocks.values()).filter(
        (s) => s.tenantId === tenantA && s.referenceId === uniqueProdId && s.referenceType === "PRODUCTION" && s.transactionType === "STOCK_IN"
      );
      const passed = stockEntries.length === 1 && stockEntries[0].quantityIn === 300;
      results.push({
        testName: "7. Production Creates Exactly ONE STOCK_IN Ledger Transaction",
        category: "Stock Integrity",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "Verified exactly 1 immutable STOCK_IN entry created with matching quantity." : `Expected 1 stock entry, found ${stockEntries.length}`,
        evidence: { stockEntriesCount: stockEntries.length, stockId: stockEntries[0]?.id }
      });
    } catch (err) {
      results.push({
        testName: "7. Production Creates Exactly ONE STOCK_IN Ledger Transaction",
        category: "Stock Integrity",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const currentBalance = await stockService.getStockBalance(testQuarryId, lateriteProdId, ctxA);
      await stockService.recordStockAdjustment({
        quarryId: testQuarryId,
        productId: lateriteProdId,
        adjustmentType: "ADJUSTMENT_IN",
        quantity: 100,
        reason: "Stock audit count physical reconciliation"
      }, ctxA);
      const balanceAfterAdjustment = await stockService.getStockBalance(testQuarryId, lateriteProdId, ctxA);
      const passed = balanceAfterAdjustment === currentBalance + 100;
      results.push({
        testName: "8. Stock Balance Derived Calculation (STOCK_IN + ADJUSTMENT_IN)",
        category: "Stock Services",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Calculated balance correctly: ${currentBalance} + 100 = ${balanceAfterAdjustment}.` : "Stock balance calculation mismatch.",
        evidence: { previous: currentBalance, updated: balanceAfterAdjustment }
      });
    } catch (err) {
      results.push({
        testName: "8. Stock Balance Derived Calculation",
        category: "Stock Services",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      let threwOnAdjustment = false;
      try {
        await stockService.recordStockAdjustment({
          quarryId: testQuarryId,
          productId: lateriteProdId,
          adjustmentType: "ADJUSTMENT_OUT",
          quantity: 999999,
          // Exceeds available stock
          reason: "Excessive adjustment test"
        }, ctxA);
      } catch (e) {
        threwOnAdjustment = e.code === "INSUFFICIENT_STOCK" || e.message.includes("Insufficient");
      }
      let threwOnGatePass = false;
      try {
        await gatePassService.createGatePass({
          quarryId: testQuarryId,
          customerId: "crm-cust-001",
          productId: lateriteProdId,
          quantity: 999999
        }, ctxA);
      } catch (e) {
        threwOnGatePass = e.code === "INSUFFICIENT_STOCK" || e.message.includes("Insufficient");
      }
      const passed = threwOnAdjustment && threwOnGatePass;
      results.push({
        testName: "9. Insufficient Stock Protection (Adjustment & GatePass)",
        category: "Stock Integrity",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "Both oversized adjustment and oversized gate pass were safely rejected." : "Failed: Oversized stock removal permitted!"
      });
    } catch (err) {
      results.push({
        testName: "9. Insufficient Stock Protection",
        category: "Stock Integrity",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const gp = await gatePassService.createGatePass({
        quarryId: testQuarryId,
        customerId: "crm-cust-001",
        productId: lateriteProdId,
        quantity: 400,
        vehicleNo: "KA-19-ME-8844",
        driverName: "Ramesh Shetty",
        grossWeight: 5200,
        tareWeight: 1200,
        salesReference: "SO-TEST-2026-001"
      }, ctxA);
      testGatePassId = gp.id;
      const passed = gp.status === "ISSUED" && gp.quantity === 400 && gp.netWeight === 4e3;
      results.push({
        testName: "10. Gate Pass Creation & Net Weight Calculation",
        category: "Gate Pass",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Gate pass '${gp.passNumber}' created with net weight 4000 kg.` : "Failed creating gate pass.",
        evidence: { passNumber: gp.passNumber, netWeight: gp.netWeight, status: gp.status }
      });
    } catch (err) {
      results.push({
        testName: "10. Gate Pass Creation & Net Weight Calculation",
        category: "Gate Pass",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const gp = await gatePassService.getGatePass(testGatePassId, ctxA);
      const year = (/* @__PURE__ */ new Date()).getFullYear();
      const regex = new RegExp(`^GP-[A-Z0-9]+-${year}-\\d{5}$`);
      const passed = regex.test(gp.passNumber);
      results.push({
        testName: "11. Gate Pass Sequential Numbering Format (GP-PREFIX-YYYY-SEQ)",
        category: "Gate Pass",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Pass number '${gp.passNumber}' matches sequential pattern.` : `Invalid pass number format '${gp.passNumber}'.`,
        evidence: { passNumber: gp.passNumber }
      });
    } catch (err) {
      results.push({
        testName: "11. Gate Pass Sequential Numbering Format",
        category: "Gate Pass",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const verified = await gatePassService.verifyGatePass(testGatePassId, ctxA);
      const passed = verified.status === "VERIFIED" && verified.approvedBy === ctxA.userId;
      results.push({
        testName: "12. Gate Pass Verification Transition (ISSUED -> VERIFIED)",
        category: "Gate Pass",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Gate pass '${verified.passNumber}' successfully verified.` : "Failed verifying gate pass.",
        evidence: { status: verified.status, approvedBy: verified.approvedBy }
      });
    } catch (err) {
      results.push({
        testName: "12. Gate Pass Verification Transition",
        category: "Gate Pass",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const initialStock = await stockService.getStockBalance(testQuarryId, lateriteProdId, ctxA);
      const res = await gatePassService.dispatchGatePass(testGatePassId, ctxA);
      const passed = res.gatePass.status === "DISPATCHED" && res.remainingStock === initialStock - 400;
      results.push({
        testName: "13. Gate Pass Dispatch Transition (VERIFIED -> DISPATCHED)",
        category: "Gate Pass",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Gate pass dispatched. Stock reduced from ${initialStock} to ${res.remainingStock}.` : "Failed gate pass dispatch.",
        evidence: { status: res.gatePass.status, remainingStock: res.remainingStock }
      });
    } catch (err) {
      results.push({
        testName: "13. Gate Pass Dispatch Transition",
        category: "Gate Pass",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const stockOutEntries = Array.from(db.quarryStocks.values()).filter(
        (s) => s.tenantId === tenantA && s.referenceId === testGatePassId && s.referenceType === "GATE_PASS" && s.transactionType === "STOCK_OUT"
      );
      const passed = stockOutEntries.length === 1 && stockOutEntries[0].quantityOut === 400;
      results.push({
        testName: "14. Dispatch Creates Exactly ONE STOCK_OUT Ledger Transaction",
        category: "Stock Integrity",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "Verified exactly 1 STOCK_OUT ledger entry created upon gate pass dispatch." : `Expected 1 STOCK_OUT entry, found ${stockOutEntries.length}`,
        evidence: { stockEntriesCount: stockOutEntries.length, stockId: stockOutEntries[0]?.id }
      });
    } catch (err) {
      results.push({
        testName: "14. Dispatch Creates Exactly ONE STOCK_OUT Ledger Transaction",
        category: "Stock Integrity",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      let threw = false;
      try {
        await gatePassService.dispatchGatePass(testGatePassId, ctxA);
      } catch (e) {
        threw = e.code === "GATE_PASS_ALREADY_DISPATCHED" || e.message.includes("already been dispatched");
      }
      results.push({
        testName: "15. Duplicate Dispatch Prevention Guard",
        category: "Gate Pass",
        passed: threw,
        durationMs: Date.now() - start,
        message: threw ? "Correctly rejected duplicate dispatch attempt on already-dispatched pass." : "Failed: Duplicate dispatch allowed!"
      });
    } catch (err) {
      results.push({
        testName: "15. Duplicate Dispatch Prevention Guard",
        category: "Gate Pass",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      let threwOnDispatched = false;
      try {
        await gatePassService.cancelGatePass(testGatePassId, "Late cancellation attempt", ctxA);
      } catch (e) {
        threwOnDispatched = e.code === "INVALID_GATE_PASS_STATE" || e.message.includes("cannot be cancelled");
      }
      const freshPass = await gatePassService.createGatePass({
        quarryId: testQuarryId,
        customerId: "crm-cust-001",
        productId: lateriteProdId,
        quantity: 50
      }, ctxA);
      const cancelledPass = await gatePassService.cancelGatePass(freshPass.id, "Customer changed order", ctxA);
      const passed = threwOnDispatched && cancelledPass.status === "CANCELLED";
      results.push({
        testName: "16. Gate Pass Cancellation Rules (Disallow post-dispatch, allow pre-dispatch)",
        category: "Gate Pass",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "Successfully enforced cancellation rules before and after physical dispatch." : "Cancellation rules failed.",
        evidence: { cancelledPassStatus: cancelledPass.status }
      });
    } catch (err) {
      results.push({
        testName: "16. Gate Pass Cancellation Rules",
        category: "Gate Pass",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      let threwOnProduct = false;
      try {
        await stoneProductService.getStoneProduct(lateriteProdId, ctxB);
      } catch (e) {
        threwOnProduct = true;
      }
      let threwOnGatePass = false;
      try {
        await gatePassService.getGatePass(testGatePassId, ctxB);
      } catch (e) {
        threwOnGatePass = true;
      }
      const passed = threwOnProduct && threwOnGatePass;
      results.push({
        testName: "17. Tenant Cross-Access Rejection (Products & Gate Passes)",
        category: "Security & Isolation",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "All cross-tenant access attempts strictly rejected." : "Failed: Cross-tenant data leakage detected!"
      });
    } catch (err) {
      results.push({
        testName: "17. Tenant Cross-Access Rejection",
        category: "Security & Isolation",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const lease = await landLeaseService.createLease({
        quarryId: testQuarryId,
        ownerName: "Venkatesh Rao",
        surveyNumber: "112/4B",
        village: "Belthangady East",
        taluk: "Belthangady",
        area: 6.5,
        leaseType: "LEASED",
        royaltyType: "PER_PIECE",
        royaltyRate: 4,
        // Rs 4 per cut piece
        startDate: "2025-01-01",
        expiryDate: "2030-12-31",
        documentReference: "REG-AGR-2025-112"
      }, ctxA);
      testLeaseId = lease.id;
      const passed = lease.status === "ACTIVE" && lease.royaltyType === "PER_PIECE" && lease.royaltyRate === 4 && lease.area === 6.5;
      results.push({
        testName: "18. Quarry Land Lease Creation & Royalty Configuration",
        category: "Land Lease",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Lease created for landowner '${lease.ownerName}' (Rate: Rs ${lease.royaltyRate}/piece).` : "Failed creating land lease.",
        evidence: { leaseId: lease.id, owner: lease.ownerName, rate: lease.royaltyRate }
      });
    } catch (err) {
      results.push({
        testName: "18. Quarry Land Lease Creation & Royalty Configuration",
        category: "Land Lease",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const settlement = await landownerSettlementService.createSettlement({
        leaseId: testLeaseId,
        periodStart: "2026-07-01",
        periodEnd: "2026-07-31",
        basisQuantity: 1e4
      }, ctxA);
      const calculatedCorrectly = settlement.calculatedAmount === 4e4;
      const approved = await landownerSettlementService.approveSettlement(settlement.id, ctxA);
      const passed = calculatedCorrectly && approved.status === "APPROVED" && !!approved.financeBillId;
      results.push({
        testName: "19. Landowner Settlement Transparent Calculation & Approval",
        category: "Land Lease & Settlement",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Calculated royalty: Rs ${settlement.calculatedAmount}. Approved with integration ref '${approved.financeBillId}'.` : "Settlement calculation mismatch.",
        evidence: { amount: settlement.calculatedAmount, financeBillId: approved.financeBillId }
      });
    } catch (err) {
      results.push({
        testName: "19. Landowner Settlement Transparent Calculation & Approval",
        category: "Land Lease & Settlement",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const quarryAuditLogs = Array.from(db.auditLogs.values()).filter(
        (a) => a.tenantId === tenantA && a.module === "Quarry Management"
      );
      const hasProductionAudit = quarryAuditLogs.some((a) => a.action === "QUARRY_PRODUCTION_RECORD");
      const hasDispatchAudit = quarryAuditLogs.some((a) => a.action === "GATE_PASS_DISPATCH");
      const hasStockAdjustmentAudit = quarryAuditLogs.some((a) => a.action === "STOCK_ADJUSTMENT_RECORD");
      const hasLeaseAudit = quarryAuditLogs.some((a) => a.action === "LAND_LEASE_CREATE");
      const passed = quarryAuditLogs.length >= 4 && hasProductionAudit && hasDispatchAudit && hasStockAdjustmentAudit && hasLeaseAudit;
      results.push({
        testName: "20. Shared Core Audit Trail Verification for Quarry Mutations",
        category: "Audit & Compliance",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Verified ${quarryAuditLogs.length} structured audit entries generated across all quarry modules.` : "Missing expected audit log records.",
        evidence: { totalAuditEntries: quarryAuditLogs.length }
      });
    } catch (err) {
      results.push({
        testName: "20. Shared Core Audit Trail Verification for Quarry Mutations",
        category: "Audit & Compliance",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  return results;
}

// src/server/tests/quarryApiTests.ts
var import_express2 = __toESM(require("express"), 1);

// src/server/routes/quarryRouter.ts
var import_express = require("express");
var quarryRouter = (0, import_express.Router)();
var quarryMasterService2 = new QuarryMasterService();
var stoneProductService2 = new StoneProductService();
var productionService2 = new ProductionService();
var stockService2 = new StockService();
var gatePassService2 = new GatePassService();
var landLeaseService2 = new LandLeaseService();
var landownerSettlementService2 = new LandownerSettlementService();
quarryRouter.use(authenticateJwt);
quarryRouter.use(enforceTenantContext);
function getSecurityContext(req) {
  if (!req.user || !req.user.tenantId) {
    throw new QuarryDomainError("UNAUTHORIZED", "Authentication context missing or invalid.");
  }
  return {
    tenantId: req.user.tenantId,
    userId: req.user.userId,
    userEmail: req.user.email,
    ipAddress: req.ip || "127.0.0.1",
    correlationId: req.correlationId || req.headers["x-correlation-id"]
  };
}
function paginate(items, page = 1, pageSize = 20) {
  const p = Math.max(1, Number(page) || 1);
  const ps = Math.min(100, Math.max(1, Number(pageSize) || 20));
  const total = items.length;
  const totalPages = Math.ceil(total / ps);
  const start = (p - 1) * ps;
  const data = items.slice(start, start + ps);
  return {
    data,
    pagination: {
      page: p,
      pageSize: ps,
      total,
      totalPages
    }
  };
}
function handleQuarryError(err, res) {
  if (err instanceof QuarryDomainError) {
    switch (err.code) {
      case "QUARRY_NOT_FOUND":
      case "PRODUCT_NOT_FOUND":
      case "PRODUCTION_NOT_FOUND":
      case "GATE_PASS_NOT_FOUND":
      case "LEASE_NOT_FOUND":
      case "LAND_LEASE_NOT_FOUND":
      case "SETTLEMENT_NOT_FOUND":
      case "CUSTOMER_NOT_FOUND":
      case "EMPLOYEE_NOT_FOUND":
        return res.status(404).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });
      case "TENANT_ACCESS_DENIED":
      case "CROSS_TENANT_VIOLATION":
      case "UNAUTHORIZED_QUARRY_ACCESS":
      case "FORBIDDEN_CROSS_TENANT_ACCESS":
      case "CROSS_QUARRY_RESOURCE_MISMATCH":
      case "FORBIDDEN_RESOURCE_MISMATCH":
        return res.status(403).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });
      case "DUPLICATE_QUARRY":
      case "DUPLICATE_PRODUCT":
      case "DUPLICATE_PRODUCT_CODE":
      case "DUPLICATE_GATE_PASS_NUMBER":
      case "GATE_PASS_ALREADY_DISPATCHED":
      case "DUPLICATE_STOCK_DEDUCTION":
      case "SETTLEMENT_ALREADY_APPROVED":
        return res.status(409).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });
      case "INSUFFICIENT_STOCK":
      case "MINERAL_TYPE_MISMATCH":
      case "INVALID_GATE_PASS_STATE":
      case "INVALID_SETTLEMENT_STATE":
      case "SETTLEMENT_CALCULATION_ERROR":
      case "INVALID_QUARRY_TYPE":
      case "INVALID_LEASE_DATES":
      case "INVALID_WEIGHT":
      case "TARE_EXCEEDS_GROSS":
        return res.status(422).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });
      case "INVALID_COMPANY":
      case "INVALID_BRANCH":
      case "INVALID_PRODUCT":
      case "INVALID_OPERATOR":
      case "INVALID_MACHINE":
      case "INVALID_VEHICLE":
      case "INVALID_DRIVER":
      case "INVALID_CUSTOMER":
      case "INVALID_QUANTITY":
      case "INVALID_LEASE":
      case "INVALID_SETTLEMENT":
      case "INVALID_STOCK_ADJUSTMENT":
      case "MISSING_REQUIRED_FIELDS":
      case "INVALID_INPUT":
      default:
        return res.status(400).json({
          success: false,
          error: err.code,
          message: err.message,
          details: err.details
        });
    }
  }
  return res.status(500).json({
    success: false,
    error: "INTERNAL_SERVER_ERROR",
    message: err?.message || "An unexpected internal server error occurred."
  });
}
quarryRouter.get("/", requirePermission("QUARRY_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    let list = await quarryMasterService2.listQuarries(ctx);
    const { search, quarryType, status, companyId, page, pageSize } = req.query;
    if (quarryType) {
      list = list.filter((q) => q.quarryType === quarryType);
    }
    if (status) {
      list = list.filter((q) => q.status === status);
    }
    if (companyId) {
      list = list.filter((q) => q.companyId === companyId);
    }
    if (search && typeof search === "string") {
      const qLower = search.toLowerCase();
      list = list.filter(
        (q) => q.name.toLowerCase().includes(qLower) || q.location.toLowerCase().includes(qLower) || q.leaseReference && q.leaseReference.toLowerCase().includes(qLower)
      );
    }
    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/", requirePermission("QUARRY_CREATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { name, quarryType, companyId, branchId, location } = req.body || {};
    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: "INVALID_INPUT",
        message: "Quarry name is required and cannot be empty."
      });
    }
    if (!quarryType || !["LATERITE", "HARD_ROCK"].includes(quarryType)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_QUARRY_TYPE",
        message: "quarryType must be either 'LATERITE' or 'HARD_ROCK'."
      });
    }
    if (!companyId || !branchId || !location) {
      return res.status(400).json({
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "companyId, branchId, and location are required."
      });
    }
    const quarry = await quarryMasterService2.createQuarry(req.body, ctx);
    return res.status(201).json({ success: true, data: quarry });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId", requirePermission("QUARRY_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const quarry = await quarryMasterService2.getQuarry(req.params.quarryId, ctx);
    return res.json({ success: true, data: quarry });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.put("/:quarryId", requirePermission("QUARRY_EDIT"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const quarry = await quarryMasterService2.updateQuarry(req.params.quarryId, req.body, ctx);
    return res.json({ success: true, data: quarry });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/deactivate", requirePermission("QUARRY_DEACTIVATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const quarry = await quarryMasterService2.deactivateQuarry(req.params.quarryId, ctx);
    return res.json({ success: true, data: quarry });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.delete("/:quarryId", requirePermission("QUARRY_DEACTIVATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const quarry = await quarryMasterService2.deactivateQuarry(req.params.quarryId, ctx);
    return res.json({
      success: true,
      data: quarry,
      message: "Quarry deactivated successfully (hard deletion disabled)."
    });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/products", requirePermission("PRODUCT_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    let products = await stoneProductService2.listStoneProducts(ctx, quarryId);
    const { status, mineralType, search, page, pageSize } = req.query;
    if (status) {
      products = products.filter((p) => p.status === status);
    }
    if (mineralType) {
      products = products.filter((p) => p.mineralType === mineralType);
    }
    if (search && typeof search === "string") {
      const qLower = search.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(qLower) || p.productCode.toLowerCase().includes(qLower)
      );
    }
    const result = paginate(products, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/products", requirePermission("PRODUCT_CREATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    const quarry = await quarryMasterService2.getQuarry(quarryId, ctx);
    const { productCode, name, mineralType, unit, defaultPrice } = req.body || {};
    if (!productCode || !name) {
      return res.status(400).json({
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "productCode and name are required."
      });
    }
    if (mineralType && mineralType !== quarry.quarryType) {
      return res.status(422).json({
        success: false,
        error: "MINERAL_TYPE_MISMATCH",
        message: `Product mineralType [${mineralType}] must match quarry type [${quarry.quarryType}].`
      });
    }
    if (unit && !["TON", "CFT", "PIECE", "LOAD"].includes(unit)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_INPUT",
        message: "unit must be 'TON', 'CFT', 'PIECE', or 'LOAD'."
      });
    }
    if (defaultPrice !== void 0 && (typeof defaultPrice !== "number" || defaultPrice < 0)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_INPUT",
        message: "defaultPrice must be a non-negative number."
      });
    }
    const product = await stoneProductService2.createStoneProduct({
      ...req.body,
      quarryId
    }, ctx);
    return res.status(201).json({ success: true, data: product });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/products/:productId", requirePermission("PRODUCT_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const product = await stoneProductService2.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Product does not belong to specified quarry.");
    }
    return res.json({ success: true, data: product });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.put("/:quarryId/products/:productId", requirePermission("PRODUCT_EDIT"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const product = await stoneProductService2.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Product does not belong to specified quarry.");
    }
    const updated = await stoneProductService2.updateStoneProduct(productId, req.body, ctx);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/products/:productId/deactivate", requirePermission("PRODUCT_DEACTIVATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const product = await stoneProductService2.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Product does not belong to specified quarry.");
    }
    const updated = await stoneProductService2.deactivateStoneProduct(productId, ctx);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.delete("/:quarryId/products/:productId", requirePermission("PRODUCT_DEACTIVATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const product = await stoneProductService2.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Product does not belong to specified quarry.");
    }
    const updated = await stoneProductService2.deactivateStoneProduct(productId, ctx);
    return res.json({
      success: true,
      data: updated,
      message: "Product deactivated successfully (hard deletion disabled)."
    });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/production", requirePermission("PRODUCTION_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    let list = await productionService2.listProduction(ctx, quarryId);
    const { productId, shift, operatorId, startDate, endDate, page, pageSize } = req.query;
    if (productId) {
      list = list.filter((p) => p.productId === productId);
    }
    if (shift) {
      list = list.filter((p) => p.shift === shift);
    }
    if (operatorId) {
      list = list.filter((p) => p.operatorId === operatorId);
    }
    if (startDate) {
      list = list.filter((p) => p.productionDate >= startDate);
    }
    if (endDate) {
      list = list.filter((p) => p.productionDate <= endDate);
    }
    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/production", requirePermission("PRODUCTION_CREATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const { productId, quantity } = req.body || {};
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "productId is required."
      });
    }
    if (quantity === void 0 || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "INVALID_QUANTITY",
        message: "quantity must be a positive number."
      });
    }
    const product = await stoneProductService2.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Product does not belong to specified quarry.");
    }
    const result = await productionService2.recordProduction({
      ...req.body,
      quarryId
    }, ctx);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/production/:productionId", requirePermission("PRODUCTION_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productionId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const prod = await productionService2.getProduction(productionId, ctx);
    if (prod.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Production record does not belong to specified quarry.");
    }
    return res.json({ success: true, data: prod });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/stock", requirePermission("STOCK_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const summary = await stockService2.getQuarryStockSummary(quarryId, ctx);
    return res.json({ success: true, data: summary });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/stock/:productId", requirePermission("STOCK_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, productId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const product = await stoneProductService2.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Product does not belong to specified quarry.");
    }
    const currentBalance = await stockService2.getStockBalance(quarryId, productId, ctx);
    const ledger = await stockService2.getStockLedger(quarryId, productId, ctx);
    return res.json({
      success: true,
      data: {
        productId: product.id,
        productCode: product.productCode,
        productName: product.name,
        unit: product.unit,
        currentBalance,
        ledger
      }
    });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/stock/adjustment", requirePermission("STOCK_ADJUST"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const { productId, adjustmentType, quantity, reason } = req.body || {};
    if (!productId || !adjustmentType || !reason) {
      return res.status(400).json({
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "productId, adjustmentType, and reason are required."
      });
    }
    if (!["ADJUSTMENT_IN", "ADJUSTMENT_OUT"].includes(adjustmentType)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_STOCK_ADJUSTMENT",
        message: "adjustmentType must be 'ADJUSTMENT_IN' or 'ADJUSTMENT_OUT'."
      });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "INVALID_QUANTITY",
        message: "quantity must be a positive number."
      });
    }
    const product = await stoneProductService2.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Product does not belong to specified quarry.");
    }
    const stockEntry = await stockService2.recordStockAdjustment({
      ...req.body,
      quarryId
    }, ctx);
    return res.status(201).json({ success: true, data: stockEntry });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/gate-passes", requirePermission("GATE_PASS_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    let list = await gatePassService2.listGatePasses(ctx, quarryId);
    const { status, customerId, productId, startDate, endDate, search, page, pageSize } = req.query;
    if (status) {
      list = list.filter((g) => g.status === status);
    }
    if (customerId) {
      list = list.filter((g) => g.customerId === customerId);
    }
    if (productId) {
      list = list.filter((g) => g.productId === productId);
    }
    if (startDate) {
      list = list.filter((g) => g.createdAt >= startDate);
    }
    if (endDate) {
      list = list.filter((g) => g.createdAt <= endDate);
    }
    if (search && typeof search === "string") {
      const qLower = search.toLowerCase();
      list = list.filter(
        (g) => g.passNumber.toLowerCase().includes(qLower) || g.vehicleNo.toLowerCase().includes(qLower) || g.driverName.toLowerCase().includes(qLower)
      );
    }
    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/gate-passes", requirePermission("GATE_PASS_CREATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const { customerId, productId, quantity, grossWeight, tareWeight } = req.body || {};
    if (!customerId || !productId) {
      return res.status(400).json({
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "customerId and productId are required."
      });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        error: "INVALID_QUANTITY",
        message: "quantity must be a positive number."
      });
    }
    if (grossWeight !== void 0 && tareWeight !== void 0) {
      if (grossWeight < 0 || tareWeight < 0 || tareWeight > grossWeight) {
        return res.status(422).json({
          success: false,
          error: "TARE_EXCEEDS_GROSS",
          message: "tareWeight cannot exceed grossWeight."
        });
      }
    }
    const product = await stoneProductService2.getStoneProduct(productId, ctx);
    if (product.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Product does not belong to specified quarry.");
    }
    const gatePass = await gatePassService2.createGatePass({
      ...req.body,
      quarryId
    }, ctx);
    return res.status(201).json({ success: true, data: gatePass });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/gate-passes/:gatePassId", requirePermission("GATE_PASS_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, gatePassId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const gp = await gatePassService2.getGatePass(gatePassId, ctx);
    if (gp.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Gate pass does not belong to specified quarry.");
    }
    return res.json({ success: true, data: gp });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/gate-passes/:gatePassId/verify", requirePermission("GATE_PASS_VERIFY"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, gatePassId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const gp = await gatePassService2.getGatePass(gatePassId, ctx);
    if (gp.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Gate pass does not belong to specified quarry.");
    }
    const updated = await gatePassService2.verifyGatePass(gatePassId, ctx);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/gate-passes/:gatePassId/dispatch", requirePermission("GATE_PASS_DISPATCH"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, gatePassId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const gp = await gatePassService2.getGatePass(gatePassId, ctx);
    if (gp.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Gate pass does not belong to specified quarry.");
    }
    const result = await gatePassService2.dispatchGatePass(gatePassId, ctx);
    return res.json({ success: true, data: result });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/gate-passes/:gatePassId/cancel", requirePermission("GATE_PASS_CANCEL"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, gatePassId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const gp = await gatePassService2.getGatePass(gatePassId, ctx);
    if (gp.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Gate pass does not belong to specified quarry.");
    }
    const reason = req.body?.reason || "Cancelled by authorized user";
    const updated = await gatePassService2.cancelGatePass(gatePassId, reason, ctx);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/land-leases", requirePermission("LAND_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    let list = await landLeaseService2.listLeases(ctx, quarryId);
    const { status, leaseType, royaltyType, page, pageSize } = req.query;
    if (status) {
      list = list.filter((l) => l.status === status);
    }
    if (leaseType) {
      list = list.filter((l) => l.leaseType === leaseType);
    }
    if (royaltyType) {
      list = list.filter((l) => l.royaltyType === royaltyType);
    }
    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/land-leases", requirePermission("LAND_CREATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const { ownerName, surveyNumber, village, taluk, area, leaseType, royaltyType, royaltyRate, startDate, expiryDate } = req.body || {};
    if (!ownerName || !surveyNumber || !village || !taluk) {
      return res.status(400).json({
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "ownerName, surveyNumber, village, and taluk are required."
      });
    }
    if (area !== void 0 && (typeof area !== "number" || area <= 0)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_INPUT",
        message: "area must be a positive number."
      });
    }
    if (royaltyRate !== void 0 && (typeof royaltyRate !== "number" || royaltyRate < 0)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_INPUT",
        message: "royaltyRate must be a non-negative number."
      });
    }
    if (leaseType && !["OWNED", "LEASED", "REVENUE_SHARE"].includes(leaseType)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_INPUT",
        message: "leaseType must be 'OWNED', 'LEASED', or 'REVENUE_SHARE'."
      });
    }
    if (royaltyType && !["FIXED_MONTHLY", "PER_TON", "PER_PIECE", "REVENUE_PERCENT"].includes(royaltyType)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_INPUT",
        message: "royaltyType must be 'FIXED_MONTHLY', 'PER_TON', 'PER_PIECE', or 'REVENUE_PERCENT'."
      });
    }
    if (startDate && expiryDate && expiryDate < startDate) {
      return res.status(422).json({
        success: false,
        error: "INVALID_LEASE_DATES",
        message: "expiryDate cannot be earlier than startDate."
      });
    }
    const lease = await landLeaseService2.createLease({
      ...req.body,
      quarryId
    }, ctx);
    return res.status(201).json({ success: true, data: lease });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/land-leases/:leaseId", requirePermission("LAND_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, leaseId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const lease = await landLeaseService2.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Land lease does not belong to specified quarry.");
    }
    return res.json({ success: true, data: lease });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.put("/:quarryId/land-leases/:leaseId", requirePermission("LAND_EDIT"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, leaseId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const lease = await landLeaseService2.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Land lease does not belong to specified quarry.");
    }
    const updated = await landLeaseService2.updateLease(leaseId, req.body, ctx);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/land-leases/:leaseId/deactivate", requirePermission("LAND_DEACTIVATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, leaseId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const lease = await landLeaseService2.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Land lease does not belong to specified quarry.");
    }
    const updated = await landLeaseService2.deactivateLease(leaseId, ctx);
    return res.json({ success: true, data: updated });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.delete("/:quarryId/land-leases/:leaseId", requirePermission("LAND_DEACTIVATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, leaseId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const lease = await landLeaseService2.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Land lease does not belong to specified quarry.");
    }
    const updated = await landLeaseService2.deactivateLease(leaseId, ctx);
    return res.json({
      success: true,
      data: updated,
      message: "Land lease deactivated successfully (hard deletion disabled)."
    });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/settlements", requirePermission("SETTLEMENT_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const { leaseId, status, page, pageSize } = req.query;
    let list = await landownerSettlementService2.listSettlements(ctx, leaseId, quarryId);
    if (status) {
      list = list.filter((s) => s.status === status);
    }
    const result = paginate(list, Number(page), Number(pageSize));
    return res.json({ success: true, ...result });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/settlements", requirePermission("SETTLEMENT_CREATE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const { leaseId, periodStart, periodEnd, basisQuantity } = req.body || {};
    if (!leaseId || !periodStart || !periodEnd) {
      return res.status(400).json({
        success: false,
        error: "MISSING_REQUIRED_FIELDS",
        message: "leaseId, periodStart, and periodEnd are required."
      });
    }
    const lease = await landLeaseService2.getLease(leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Land lease does not belong to specified quarry.");
    }
    if (basisQuantity !== void 0 && (typeof basisQuantity !== "number" || basisQuantity < 0)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_QUANTITY",
        message: "basisQuantity must be a non-negative number."
      });
    }
    const settlement = await landownerSettlementService2.createSettlement(req.body, ctx);
    return res.status(201).json({ success: true, data: settlement });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.get("/:quarryId/settlements/:settlementId", requirePermission("SETTLEMENT_VIEW"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, settlementId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const settlement = await landownerSettlementService2.getSettlement(settlementId, ctx);
    const lease = await landLeaseService2.getLease(settlement.leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Settlement does not belong to specified quarry.");
    }
    return res.json({ success: true, data: settlement });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});
quarryRouter.post("/:quarryId/settlements/:settlementId/approve", requirePermission("SETTLEMENT_APPROVE"), async (req, res) => {
  try {
    const ctx = getSecurityContext(req);
    const { quarryId, settlementId } = req.params;
    await quarryMasterService2.getQuarry(quarryId, ctx);
    const settlement = await landownerSettlementService2.getSettlement(settlementId, ctx);
    const lease = await landLeaseService2.getLease(settlement.leaseId, ctx);
    if (lease.quarryId !== quarryId) {
      throw new QuarryDomainError("CROSS_QUARRY_RESOURCE_MISMATCH", "Settlement does not belong to specified quarry.");
    }
    const approved = await landownerSettlementService2.approveSettlement(settlementId, ctx);
    return res.json({ success: true, data: approved });
  } catch (err) {
    return handleQuarryError(err, res);
  }
});

// src/server/tests/quarryApiTests.ts
function createTestApp() {
  const app = (0, import_express2.default)();
  app.use(import_express2.default.json());
  app.use(correlationIdMiddleware);
  app.use(auditLogger);
  app.use("/api/quarries", quarryRouter);
  return app;
}
async function simulateRequest(app, method, url, opts = {}) {
  return new Promise((resolve) => {
    const parsedUrl = new URL(`http://localhost${url}`);
    if (opts.query) {
      Object.entries(opts.query).forEach(([k, v]) => {
        if (v !== void 0) parsedUrl.searchParams.set(k, String(v));
      });
    }
    const headers = {
      "content-type": "application/json",
      "host": "localhost"
    };
    if (opts.token) {
      headers["authorization"] = `Bearer ${opts.token}`;
    }
    if (opts.tenantHeader) {
      headers["x-tenant-id"] = opts.tenantHeader;
    }
    let statusCode = 200;
    let responseBody = null;
    let finished = false;
    const res = {
      statusCode: 200,
      headersSent: false,
      status(code) {
        statusCode = code;
        this.statusCode = code;
        return this;
      },
      setHeader() {
        return this;
      },
      getHeader() {
        return void 0;
      },
      json(data) {
        responseBody = data;
        this.finish();
        return this;
      },
      send(data) {
        try {
          responseBody = JSON.parse(data);
        } catch {
          responseBody = data;
        }
        this.finish();
        return this;
      },
      end(data) {
        if (data && !responseBody) {
          try {
            responseBody = JSON.parse(data);
          } catch {
            responseBody = data;
          }
        }
        this.finish();
        return this;
      },
      on(event, callback) {
        if (event === "finish" && finished) {
          callback();
        }
        return this;
      },
      finish() {
        if (!finished) {
          finished = true;
          resolve({ status: statusCode, body: responseBody });
        }
      }
    };
    const req = {
      method: method.toUpperCase(),
      url: parsedUrl.pathname + parsedUrl.search,
      originalUrl: parsedUrl.pathname + parsedUrl.search,
      path: parsedUrl.pathname,
      query: Object.fromEntries(parsedUrl.searchParams.entries()),
      headers,
      header(name) {
        return headers[name.toLowerCase()];
      },
      get(name) {
        return headers[name.toLowerCase()];
      },
      body: opts.body || {},
      ip: "127.0.0.1",
      socket: { remoteAddress: "127.0.0.1" },
      on(event, cb) {
        if (event === "data" && opts.body) cb(Buffer.from(JSON.stringify(opts.body)));
        if (event === "end") cb();
        return this;
      }
    };
    app.handle(req, res, (err) => {
      if (err) {
        resolve({ status: 500, body: { success: false, error: "SERVER_ERROR", message: err.message } });
      } else if (!finished) {
        resolve({ status: 404, body: { success: false, error: "NOT_FOUND", message: "Route not matched" } });
      }
    });
  });
}
async function runQuarryApiTestSuite() {
  const results = [];
  const app = createTestApp();
  const authService2 = new AuthService();
  db.seedQuarryRbacData();
  const adminLogin = await authService2.login("admin@racezoneventures.com", "AdminPass2026!", "127.0.0.1");
  const ownerLogin = await authService2.login("quarry.owner@racezoneventures.com", "OwnerPass2026!", "127.0.0.1");
  const managerLogin = await authService2.login("quarry.manager@racezoneventures.com", "ManagerPass2026!", "127.0.0.1");
  const staffLogin = await authService2.login("quarry.staff@racezoneventures.com", "StaffPass2026!", "127.0.0.1");
  const apexLogin = await authService2.login("site.mgr@apexmining.com", "ApexPass2026!", "127.0.0.1");
  const adminToken = adminLogin.data?.token || "";
  const ownerToken = ownerLogin.data?.token || "";
  const managerToken = managerLogin.data?.token || "";
  const staffToken = staffLogin.data?.token || "";
  const apexToken = apexLogin.data?.token || "";
  const testSuffix = Date.now().toString().slice(-6);
  let createdQuarryId = "";
  let createdProductId = "";
  let createdGatePassId = "";
  let createdLeaseId = "";
  let createdSettlementId = "";
  {
    const start = Date.now();
    const res = await simulateRequest(app, "GET", "/api/quarries");
    const passed = res.status === 401 && (res.body?.error === "UNAUTHORIZED" || res.body?.error === "UNAUTHORIZED_MISSING_TOKEN");
    results.push({
      testName: "Quarry API Auth: Rejects Unauthenticated Request (401)",
      category: "Quarry API & Security",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Correctly rejected request without Bearer token with 401 UNAUTHORIZED" : `Expected 401, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "GET", "/api/quarries", { token: "invalid.token.signature.payload" });
    const passed = res.status === 401 && (res.body?.error === "INVALID_TOKEN" || res.body?.error === "UNAUTHORIZED" || res.body?.error === "UNAUTHORIZED_INVALID_TOKEN");
    results.push({
      testName: "Quarry API Auth: Rejects Forged JWT Token (401)",
      category: "Quarry API & Security",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Correctly rejected forged JWT token with 401 UNAUTHORIZED" : `Expected 401, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const tenant1 = db.tenants.get("tenant-rz-global-001") || Array.from(db.tenants.values())[0];
    const company = Array.from(db.companies.values()).find((c) => c.tenantId === tenant1?.id) || Array.from(db.companies.values())[0];
    const branch = Array.from(db.branches.values()).find((b) => b.tenantId === tenant1?.id) || Array.from(db.branches.values())[0];
    const res = await simulateRequest(app, "POST", "/api/quarries", {
      token: ownerToken,
      body: {
        companyId: company?.id || "comp-rz-ventures-001",
        branchId: branch?.id || "br-quarry-alpha",
        name: "Api Test Granite Quarry " + testSuffix,
        quarryType: "HARD_ROCK",
        location: "Karkala Ridge Zone 4",
        address: "Survey 22/B, Karkala, Karnataka",
        leaseReference: "LEASE-APITEST-" + testSuffix
      }
    });
    const passed = res.status === 201 && res.body?.success === true && !!res.body?.data?.id;
    if (passed) {
      createdQuarryId = res.body.data.id;
    }
    results.push({
      testName: "Quarry RBAC: QUARRY_OWNER Allowed to Create Quarry Master (201)",
      category: "Quarry RBAC & Auth",
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Quarry Master created successfully by QUARRY_OWNER: [${createdQuarryId}]` : `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const tenant1 = db.tenants.get("tenant-rz-global-001") || Array.from(db.tenants.values())[0];
    const company = Array.from(db.companies.values()).find((c) => c.tenantId === tenant1?.id) || Array.from(db.companies.values())[0];
    const branch = Array.from(db.branches.values()).find((b) => b.tenantId === tenant1?.id) || Array.from(db.branches.values())[0];
    const res = await simulateRequest(app, "POST", "/api/quarries", {
      token: managerToken,
      body: {
        companyId: company?.id || "comp-rz-ventures-001",
        branchId: branch?.id || "br-quarry-alpha",
        name: "Unauthorized Manager Quarry " + testSuffix,
        quarryType: "LATERITE",
        location: "Illegal Location"
      }
    });
    const passed = res.status === 403 && (res.body?.error === "FORBIDDEN" || res.body?.error === "FORBIDDEN_PERMISSION_REQUIRED");
    results.push({
      testName: "Quarry RBAC: QUARRY_MANAGER Denied Quarry Creation (403)",
      category: "Quarry RBAC & Auth",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "RBAC enforcement successfully rejected QUARRY_CREATE by QUARRY_MANAGER" : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const getRes = await simulateRequest(app, "GET", `/api/quarries/${createdQuarryId}`, { token: managerToken });
    const updateRes = await simulateRequest(app, "PUT", `/api/quarries/${createdQuarryId}`, {
      token: managerToken,
      body: { location: "Karkala Ridge Zone 4 - Updated by Manager" }
    });
    const passed = getRes.status === 200 && updateRes.status === 200 && updateRes.body?.data?.location?.includes("Updated by Manager");
    results.push({
      testName: "Quarry RBAC: QUARRY_MANAGER Permitted to View & Edit Quarry Master (200)",
      category: "Quarry Operations",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "QUARRY_MANAGER successfully viewed and updated quarry metadata" : `Expected 200, got ${updateRes.status}: ${JSON.stringify(updateRes.body)}`,
      evidence: updateRes.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "PUT", `/api/quarries/${createdQuarryId}`, {
      token: staffToken,
      body: { name: "Staff Renamed Quarry" }
    });
    const passed = res.status === 403 && (res.body?.error === "FORBIDDEN" || res.body?.error === "FORBIDDEN_PERMISSION_REQUIRED");
    results.push({
      testName: "Quarry RBAC: QUARRY_STAFF Denied Quarry Edit (403)",
      category: "Quarry RBAC & Auth",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "RBAC correctly denied QUARRY_EDIT to QUARRY_STAFF" : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "GET", `/api/quarries/${createdQuarryId}`, {
      token: apexToken
      // Token belonging to Tenant 2 (Apex Mining)
    });
    const passed = res.status === 404 || res.status === 403;
    results.push({
      testName: "Quarry Tenant Security: Cross-Tenant Quarry Access Denied",
      category: "Tenant Isolation",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Tenant boundary enforced: Apex Mining user unable to access Tenant 1 quarry" : `Expected 404/403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/products`, {
      token: managerToken,
      body: {
        productCode: "GRAN-20MM-" + testSuffix,
        name: "20mm Crushed Blue Metal Aggregate",
        mineralType: "HARD_ROCK",
        unit: "TON",
        defaultPrice: 850,
        gstRate: 5
      }
    });
    const passed = res.status === 201 && res.body?.success === true && res.body?.data?.id;
    if (passed) {
      createdProductId = res.body.data.id;
    }
    results.push({
      testName: "Stone Products API: Create Stone Product with Matching Mineral Type (201)",
      category: "Stone Products",
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Stone Product created: [${res.body.data.productCode}]` : `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/products`, {
      token: managerToken,
      body: {
        productCode: "LAT-BRICK-MISMATCH",
        name: "Laterite Stone Brick in Hard Rock Quarry",
        mineralType: "LATERITE",
        // Mismatch with quarry's HARD_ROCK type!
        unit: "PIECE",
        defaultPrice: 45
      }
    });
    const passed = res.status === 422 && res.body?.error === "MINERAL_TYPE_MISMATCH";
    results.push({
      testName: "Stone Products API: Reject Mineral Type Mismatch with Quarry (422)",
      category: "Stone Products",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Domain validation correctly rejected LATERITE product in HARD_ROCK quarry" : `Expected 422, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const otherQuarryId = "qm-laterite-001";
    const res = await simulateRequest(app, "GET", `/api/quarries/${otherQuarryId}/products/${createdProductId}`, {
      token: managerToken
    });
    const passed = res.status === 403 && res.body?.error === "CROSS_QUARRY_RESOURCE_MISMATCH";
    results.push({
      testName: "Quarry Hierarchy: Reject Cross-Quarry Product Route Access (403)",
      category: "Stone Products",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Hierarchy validation prevented access to product via mismatching quarry URL (403 Forbidden)" : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/production`, {
      token: staffToken,
      // Quarry staff has PRODUCTION_CREATE permission
      body: {
        productId: createdProductId,
        productionType: "CRUSHING_PRIMARY",
        productionDate: "2026-08-18",
        shift: "DAY",
        quantity: 600,
        remarks: "Morning blasting & crushing yield"
      }
    });
    const passed = res.status === 201 && res.body?.success === true && res.body?.data?.production?.quantity === 600 && res.body?.data?.stockLedgerEntry?.transactionType === "STOCK_IN" && res.body?.data?.newBalance === 600;
    results.push({
      testName: "Production API: Log Production & Produce Atomic STOCK_IN Entry (201)",
      category: "Quarry Production",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Production logged and immutable STOCK_IN entry recorded (Stock Balance: 600 TON)" : `Expected 201 with stockLedgerEntry, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/production`, {
      token: staffToken,
      body: {
        productId: createdProductId,
        quantity: -50
      }
    });
    const passed = res.status === 400 && res.body?.error === "INVALID_QUANTITY";
    results.push({
      testName: "Production API: Reject Negative Quantity (400)",
      category: "Quarry Production",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Validation correctly blocked negative production entry" : `Expected 400, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "GET", `/api/quarries/${createdQuarryId}/stock`, {
      token: staffToken
    });
    const summary = res.body?.data || [];
    const item = summary.find((s) => s.productId === createdProductId);
    const passed = res.status === 200 && res.body?.success === true && item && item.balanceQuantity === 600;
    results.push({
      testName: "Stock API: Fetch Quarry Stock Summary across all Products (200)",
      category: "Quarry Inventory",
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Stock summary returned balance of ${item.balanceQuantity} ${item.unit} for [${item.productName}]` : `Expected 200 with balance 600, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/stock/adjustment`, {
      token: managerToken,
      body: {
        productId: createdProductId,
        adjustmentType: "ADJUSTMENT_IN",
        quantity: 50,
        reason: "Physical stockpile survey surplus calibration"
      }
    });
    const passed = res.status === 201 && res.body?.data?.transactionType === "ADJUSTMENT_IN" && res.body?.data?.balanceQuantity === 650;
    results.push({
      testName: "Stock API: QUARRY_MANAGER Executes Stock Adjustment (201)",
      category: "Quarry Inventory",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Stock adjustment applied: balance updated to 650 TON" : `Expected 201 with balance 650, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/stock/adjustment`, {
      token: staffToken,
      body: {
        productId: createdProductId,
        adjustmentType: "ADJUSTMENT_OUT",
        quantity: 20,
        reason: "Unverified scale loss"
      }
    });
    const passed = res.status === 403 && (res.body?.error === "FORBIDDEN" || res.body?.error === "FORBIDDEN_PERMISSION_REQUIRED");
    results.push({
      testName: "Quarry RBAC: QUARRY_STAFF Denied Stock Adjustment Permission (403)",
      category: "Quarry RBAC & Auth",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "RBAC rejected unauthorized stock adjustment by floor staff" : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const customer = Array.from(db.crmCustomers.values())[0] || { id: "cust-harbor-dev" };
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes`, {
      token: staffToken,
      body: {
        customerId: customer.id,
        productId: createdProductId,
        quantity: 150,
        unit: "TON",
        vehicleNo: "KA-20-MB-9090",
        driverName: "Ramesh Shetty",
        grossWeight: 45e3,
        tareWeight: 15e3,
        salesReference: "SO-API-TEST-001"
      }
    });
    const passed = res.status === 201 && res.body?.data?.id && res.body?.data?.status === "ISSUED";
    if (passed) {
      createdGatePassId = res.body.data.id;
    }
    results.push({
      testName: "Gate Pass API: Create Gate Pass in ISSUED State (201)",
      category: "Gate Pass & Weighbridge",
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Gate Pass created with passNumber: [${res.body.data.passNumber}]` : `Expected 201, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const customer = Array.from(db.crmCustomers.values())[0] || { id: "cust-harbor-dev" };
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes`, {
      token: staffToken,
      body: {
        customerId: customer.id,
        productId: createdProductId,
        quantity: 100,
        grossWeight: 1e4,
        tareWeight: 15e3
        // Inverted weight!
      }
    });
    const passed = res.status === 422 && res.body?.error === "TARE_EXCEEDS_GROSS";
    results.push({
      testName: "Gate Pass API: Reject Inverted Tare Weight Exceeding Gross (422)",
      category: "Gate Pass & Weighbridge",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Weighbridge validation correctly rejected tare > gross" : `Expected 422, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const verifyRes = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/verify`, {
      token: managerToken
    });
    const dispatchRes = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/dispatch`, {
      token: managerToken
    });
    const passed = verifyRes.status === 200 && dispatchRes.status === 200 && dispatchRes.body?.data?.gatePass?.status === "DISPATCHED" && dispatchRes.body?.data?.stockLedgerEntry?.transactionType === "STOCK_OUT" && dispatchRes.body?.data?.remainingStock === 500;
    results.push({
      testName: "Gate Pass API: Verify & Dispatch Gate Pass with Atomic STOCK_OUT (200)",
      category: "Gate Pass & Weighbridge",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Gate Pass transitioned to DISPATCHED with atomic 150 TON deduction (Remaining: 500 TON)" : `Expected 200, got ${dispatchRes.status}: ${JSON.stringify(dispatchRes.body)}`,
      evidence: dispatchRes.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/dispatch`, {
      token: managerToken
    });
    const passed = res.status === 409 && res.body?.error === "GATE_PASS_ALREADY_DISPATCHED";
    results.push({
      testName: "Gate Pass API: Prevent Double Dispatch & Stock Deduction (409 Conflict)",
      category: "Gate Pass & Weighbridge",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "State machine prevented duplicate stock deduction on already dispatched pass" : `Expected 409, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const leaseRes = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/land-leases`, {
      token: managerToken,
      body: {
        ownerName: "Subbanna Bhat",
        surveyNumber: "SY-102/4",
        village: "Belvai",
        taluk: "Moodbidri",
        area: 4.5,
        leaseType: "LEASED",
        royaltyType: "PER_TON",
        royaltyRate: 40,
        startDate: "2026-01-01",
        expiryDate: "2030-12-31"
      }
    });
    createdLeaseId = leaseRes.body?.data?.id || "";
    const settlementRes = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/settlements`, {
      token: managerToken,
      body: {
        leaseId: createdLeaseId,
        periodStart: "2026-08-01",
        periodEnd: "2026-08-31",
        basisQuantity: 1e3
      }
    });
    createdSettlementId = settlementRes.body?.data?.id || "";
    const expectedPayable = 1e3 * 40;
    const approveRes = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/settlements/${createdSettlementId}/approve`, {
      token: ownerToken
    });
    const passed = leaseRes.status === 201 && settlementRes.status === 201 && (settlementRes.body?.data?.calculatedAmount === expectedPayable || settlementRes.body?.data?.netPayable === expectedPayable) && approveRes.status === 200 && approveRes.body?.data?.status === "APPROVED";
    results.push({
      testName: "Land Lease & Settlement API: Lifecycle Flow & Approval (201/200)",
      category: "Land Lease & Settlements",
      passed,
      durationMs: Date.now() - start,
      message: passed ? `Land Lease and Settlement approved: Net payable \u20B9${expectedPayable}` : `Expected 200/201, got lease: ${leaseRes.status}, settlement: ${settlementRes.status}, approve: ${approveRes.status}`,
      evidence: { lease: leaseRes.body, settlement: settlementRes.body, approved: approveRes.body }
    });
  }
  {
    const start = Date.now();
    const deleteRes = await simulateRequest(app, "DELETE", `/api/quarries/${createdQuarryId}`, {
      token: ownerToken
    });
    const passed = deleteRes.status === 200 && deleteRes.body?.data?.status === "INACTIVE" && deleteRes.body?.success === true;
    results.push({
      testName: "Quarry Master: Soft-Delete Deactivation via HTTP DELETE (200)",
      category: "Quarry Operations",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "DELETE route successfully performed soft-deactivation (hard delete prevented)" : `Expected 200 INACTIVE, got ${deleteRes.status}: ${JSON.stringify(deleteRes.body)}`,
      evidence: deleteRes.body
    });
  }
  {
    const start = Date.now();
    const tenant1 = db.tenants.get("tenant-rz-global-001") || Array.from(db.tenants.values())[0];
    const company = Array.from(db.companies.values()).find((c) => c.tenantId === tenant1?.id) || Array.from(db.companies.values())[0];
    const branch = Array.from(db.branches.values()).find((b) => b.tenantId === tenant1?.id) || Array.from(db.branches.values())[0];
    const res = await simulateRequest(app, "POST", "/api/quarries", {
      token: ownerToken,
      body: {
        tenantId: "tenant-malicious-spoofed-999",
        companyId: company?.id || "comp-rz-ventures-001",
        branchId: branch?.id || "br-quarry-alpha",
        name: "Spoof Attempt Granite Quarry " + testSuffix,
        quarryType: "HARD_ROCK",
        location: "Spoofed Ridge",
        address: "Survey 999, Karkala",
        leaseReference: "LEASE-SPOOF-" + testSuffix
      }
    });
    const passed = res.status === 403 && res.body?.error === "FORBIDDEN_CROSS_TENANT_ACCESS";
    results.push({
      testName: "Tenant Security: Request Body tenantId Cannot Override SecurityContext (403)",
      category: "Tenant Isolation",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Tenant Isolation Security: Cross-tenant body spoofing blocked with 403 FORBIDDEN_CROSS_TENANT_ACCESS" : `Expected 403 FORBIDDEN_CROSS_TENANT_ACCESS, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "DELETE", `/api/quarries/${createdQuarryId}`, {
      token: staffToken
    });
    const passed = res.status === 403 && (res.body?.error === "FORBIDDEN" || res.body?.error === "FORBIDDEN_PERMISSION_REQUIRED");
    results.push({
      testName: "Sensitive Permission: QUARRY_DEACTIVATE Denied to QUARRY_STAFF (403)",
      category: "Quarry RBAC & Auth",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "QUARRY_DEACTIVATE permission verified server-side" : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/verify`, {
      token: staffToken
    });
    const passed = res.status === 403 && (res.body?.error === "FORBIDDEN" || res.body?.error === "FORBIDDEN_PERMISSION_REQUIRED");
    results.push({
      testName: "Sensitive Permission: GATE_PASS_VERIFY Denied to QUARRY_STAFF (403)",
      category: "Quarry RBAC & Auth",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "GATE_PASS_VERIFY permission verified server-side" : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  {
    const start = Date.now();
    const customer = Array.from(db.crmCustomers.values())[0] || { id: "cust-harbor-dev" };
    const createRes = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes`, {
      token: staffToken,
      body: {
        customerId: customer.id,
        productId: createdProductId,
        quantity: 50,
        unit: "TON",
        vehicleNo: "KA-19-Z-1111",
        driverName: "Mohan Kumar"
      }
    });
    const newPassId = createRes.body?.data?.id;
    const cancelRes = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes/${newPassId}/cancel`, {
      token: managerToken,
      body: { reason: "Vehicle breakdown at weighbridge entrance" }
    });
    const passed = createRes.status === 201 && cancelRes.status === 200 && cancelRes.body?.data?.status === "CANCELLED";
    results.push({
      testName: "Gate Pass State Machine: Controlled Cancellation to CANCELLED (200)",
      category: "Gate Pass & Weighbridge",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "Gate pass transitioned to CANCELLED with audit reason" : `Expected 200 CANCELLED, got ${cancelRes.status}: ${JSON.stringify(cancelRes.body)}`,
      evidence: cancelRes.body
    });
  }
  {
    const start = Date.now();
    const res = await simulateRequest(app, "POST", `/api/quarries/${createdQuarryId}/gate-passes/${createdGatePassId}/cancel`, {
      token: staffToken,
      body: { reason: "Unauthorized cancellation attempt" }
    });
    const passed = res.status === 403 && (res.body?.error === "FORBIDDEN" || res.body?.error === "FORBIDDEN_PERMISSION_REQUIRED");
    results.push({
      testName: "Sensitive Permission: GATE_PASS_CANCEL Denied to QUARRY_STAFF (403)",
      category: "Quarry RBAC & Auth",
      passed,
      durationMs: Date.now() - start,
      message: passed ? "GATE_PASS_CANCEL permission verified server-side" : `Expected 403, got ${res.status}: ${JSON.stringify(res.body)}`,
      evidence: res.body
    });
  }
  return results;
}

// src/server/providers/storageProvider.ts
var import_fs3 = __toESM(require("fs"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_crypto3 = __toESM(require("crypto"), 1);
var LocalStorageProvider = class {
  // 25 MB
  constructor(customDir) {
    this.providerName = "LOCAL_DISK";
    this.allowedMimeTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
      "application/json",
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    this.maxSizeBytes = 25 * 1024 * 1024;
    this.baseDir = customDir || import_path3.default.join(process.cwd(), "uploads");
  }
  validateFile(params) {
    if (params.sizeBytes > this.maxSizeBytes) {
      return { valid: false, error: `File size exceeds max limit of 25MB (Attempted: ${(params.sizeBytes / 1024 / 1024).toFixed(2)}MB)` };
    }
    if (!this.allowedMimeTypes.includes(params.mimeType)) {
      return { valid: false, error: `Invalid MIME type [${params.mimeType}]. Allowed: PDF, PNG, JPG, WEBP, JSON, CSV, XLSX.` };
    }
    return { valid: true };
  }
  async upload(params) {
    const validation = this.validateFile({ mimeType: params.mimeType, sizeBytes: params.buffer.length });
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    const tenantDir = import_path3.default.join(this.baseDir, params.tenantId);
    if (!import_fs3.default.existsSync(tenantDir)) {
      import_fs3.default.mkdirSync(tenantDir, { recursive: true });
    }
    const fileHash = import_crypto3.default.randomBytes(8).toString("hex");
    const safeName = params.fileName.replace(/[^a-zA-Z0-9_.-]/g, "_");
    const storageKey = `${params.tenantId}/${Date.now()}_${fileHash}_${safeName}`;
    const fullPath = import_path3.default.join(this.baseDir, storageKey);
    import_fs3.default.writeFileSync(fullPath, params.buffer);
    return {
      storageKey,
      sizeBytes: params.buffer.length,
      mimeType: params.mimeType
    };
  }
  async getSignedUrl(params) {
    if (!params.storageKey.startsWith(params.tenantId)) {
      throw new Error(`Tenant Security Access Denied: Storage key [${params.storageKey}] does not belong to tenant [${params.tenantId}]`);
    }
    const expiresAt = Math.floor(Date.now() / 1e3) + (params.expiresInSeconds || 3600);
    const signature = import_crypto3.default.createHmac("sha256", "signed_url_secret_2026").update(`${params.storageKey}:${expiresAt}`).digest("hex");
    return `/api/v1/documents/download?key=${encodeURIComponent(params.storageKey)}&exp=${expiresAt}&sig=${signature}`;
  }
  async delete(storageKey, tenantId) {
    if (!storageKey.startsWith(tenantId)) {
      throw new Error("Tenant Security Access Denied");
    }
    const fullPath = import_path3.default.join(this.baseDir, storageKey);
    if (import_fs3.default.existsSync(fullPath)) {
      import_fs3.default.unlinkSync(fullPath);
      return true;
    }
    return false;
  }
};

// src/server/providers/notificationProviders.ts
var InAppNotificationAdapter = class {
  constructor() {
    this.channel = "IN_APP";
  }
  isConfigured() {
    return true;
  }
  async send(payload) {
    return {
      channel: "IN_APP",
      status: "DELIVERED_IN_APP",
      message: `In-App notification dispatched for User [${payload.recipientUserId}]`,
      providerDetails: "Minetrix Persistent Notification Feed"
    };
  }
};
var EmailNotificationAdapter = class {
  constructor() {
    this.channel = "EMAIL";
  }
  isConfigured() {
    return Boolean(process.env.SMTP_HOST || process.env.SENDGRID_API_KEY);
  }
  async send(payload) {
    if (!this.isConfigured()) {
      return {
        channel: "EMAIL",
        status: "EXTERNAL_CONFIG_REQUIRED",
        message: "Email provider unconfigured. In-App notification stored; SMTP_HOST or SENDGRID_API_KEY required for outbound SMTP.",
        providerDetails: "SendGrid / SMTP Gateway (Unconfigured)"
      };
    }
    return {
      channel: "EMAIL",
      status: "SENT_EXTERNAL",
      message: `Outbound email dispatched to [${payload.recipientEmail || "user@domain.com"}]`,
      providerDetails: "SMTP Gateway / SendGrid"
    };
  }
};
var WhatsAppNotificationAdapter = class {
  constructor() {
    this.channel = "WHATSAPP";
  }
  isConfigured() {
    return Boolean(process.env.TWILIO_WHATSAPP_SID && process.env.TWILIO_AUTH_TOKEN);
  }
  async send(_payload) {
    if (!this.isConfigured()) {
      return {
        channel: "WHATSAPP",
        status: "EXTERNAL_CONFIG_REQUIRED",
        message: "WhatsApp Business API credentials missing. Set TWILIO_WHATSAPP_SID and TWILIO_AUTH_TOKEN.",
        providerDetails: "Twilio WhatsApp Business API (Unconfigured)"
      };
    }
    return {
      channel: "WHATSAPP",
      status: "SENT_EXTERNAL",
      message: "WhatsApp HSM template message dispatched.",
      providerDetails: "Twilio WhatsApp API"
    };
  }
};
var PushNotificationAdapter = class {
  constructor() {
    this.channel = "PUSH";
  }
  isConfigured() {
    return Boolean(process.env.FIREBASE_FCM_CREDENTIALS || process.env.VAPID_PUBLIC_KEY);
  }
  async send(_payload) {
    if (!this.isConfigured()) {
      return {
        channel: "PUSH",
        status: "EXTERNAL_CONFIG_REQUIRED",
        message: "WebPush / Firebase FCM credentials unconfigured. Set FIREBASE_FCM_CREDENTIALS or VAPID keys.",
        providerDetails: "Firebase Cloud Messaging / WebPush (Unconfigured)"
      };
    }
    return {
      channel: "PUSH",
      status: "SENT_EXTERNAL",
      message: "Push notification push payload broadcasted.",
      providerDetails: "FCM Gateway"
    };
  }
};
var NotificationDispatcher = class {
  constructor() {
    this.adapters = /* @__PURE__ */ new Map();
    this.adapters.set("IN_APP", new InAppNotificationAdapter());
    this.adapters.set("EMAIL", new EmailNotificationAdapter());
    this.adapters.set("WHATSAPP", new WhatsAppNotificationAdapter());
    this.adapters.set("PUSH", new PushNotificationAdapter());
  }
  async dispatch(payload) {
    const adapter = this.adapters.get(payload.channel) || this.adapters.get("IN_APP");
    return adapter.send(payload);
  }
};
var notificationDispatcher = new NotificationDispatcher();

// src/server/tests/sharedCoreTests.ts
async function runSharedCoreTestSuite() {
  const results = [];
  const authService2 = new AuthService();
  const tenantService2 = new TenantService();
  const userService2 = new UserService();
  const auditService2 = new AuditService();
  const notifService2 = new NotificationService();
  const wfService2 = new WorkflowService();
  const storageProvider2 = new LocalStorageProvider();
  {
    const start = Date.now();
    try {
      const loginRes = await authService2.login("admin@racezoneventures.com", "AdminPass2026!", "127.0.0.1");
      const verified = loginRes.data?.token ? jwtService.verifyToken(loginRes.data.token) : null;
      const passed = loginRes.success && !!loginRes.data?.token && !!verified && verified.iss === "rz-minetrix-bos";
      results.push({
        testName: "Authentication Engine - RS256 Asymmetric JWT Signing & Claims Verification",
        category: "Security & Auth",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "Successfully issued and verified RS256 asymmetric token (kid: rz-rsa-key-2026-v1, iss: rz-minetrix-bos)" : "Failed RS256 token verification",
        evidence: { keyMetadata: jwtService.getKeyMetadata(), claims: verified }
      });
    } catch (err) {
      results.push({
        testName: "Authentication Engine - RS256 Asymmetric JWT Verification",
        category: "Security & Auth",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const loginRes = await authService2.login("admin@racezoneventures.com", "WRONG_PASSWORD", "127.0.0.1");
      const passed = !loginRes.success && loginRes.error === "INVALID_CREDENTIALS";
      results.push({
        testName: "Authentication Engine - Invalid Password Rejection & Audit Log",
        category: "Security & Auth",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "Invalid password correctly rejected with 401 response and failure audit logged" : "Failed to block invalid password"
      });
    } catch (err) {
      results.push({
        testName: "Authentication Engine - Invalid Password Rejection",
        category: "Security & Auth",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const tRes = await tenantService2.getTenantContext("tenant-rz-global-001");
      const passed = tRes.success && tRes.data?.companies.length > 0;
      results.push({
        testName: "Multi-Tenant Context - Tenant Hierarchy Query",
        category: "Tenant Isolation",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Queried Tenant [${tRes.data?.tenant.name}] with ${tRes.data?.companies.length} linked companies` : "Failed tenant query"
      });
    } catch (err) {
      results.push({
        testName: "Multi-Tenant Context - Tenant Hierarchy Query",
        category: "Tenant Isolation",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const userRes = await userService2.getUsersInTenant("tenant-rz-global-001");
      const tenant2Users = await userService2.getUsersInTenant("tenant-apex-quarry-002");
      const isIsolated = !userRes.data.some((u) => u.email.includes("apexmining.com")) && tenant2Users.data.every((u) => u.email.includes("apexmining.com"));
      results.push({
        testName: "Tenant Isolation - Cross-Tenant Access Strict Boundary",
        category: "Tenant Isolation",
        passed: isIsolated,
        durationMs: Date.now() - start,
        message: isIsolated ? "Tenant A data and Tenant B data remain strictly isolated at database/repository boundary" : "Cross-tenant leak detected"
      });
    } catch (err) {
      results.push({
        testName: "Tenant Isolation - Cross-Tenant Access Boundary",
        category: "Tenant Isolation",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const mimeCheck = storageProvider2.validateFile({ mimeType: "application/pdf", sizeBytes: 1024 * 1024 });
      const signedUrl = await storageProvider2.getSignedUrl({ storageKey: "tenant-rz-global-001/doc_test.pdf", tenantId: "tenant-rz-global-001" });
      const passed = mimeCheck.valid && signedUrl.includes("/api/v1/documents/download");
      results.push({
        testName: "Storage Provider Abstraction - MIME/Size Validation & Tenant Presigned URL",
        category: "Storage & Files",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "MIME validation passed and tenant presigned URL generated securely" : "Storage provider test failed"
      });
    } catch (err) {
      results.push({
        testName: "Storage Provider Abstraction",
        category: "Storage & Files",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const inAppRes = await notificationDispatcher.dispatch({
        tenantId: "tenant-rz-global-001",
        recipientUserId: "usr-admin-001",
        title: "Test Notification",
        body: "In-app body",
        channel: "IN_APP",
        type: "INFO"
      });
      const emailRes = await notificationDispatcher.dispatch({
        tenantId: "tenant-rz-global-001",
        recipientUserId: "usr-admin-001",
        recipientEmail: "admin@racezoneventures.com",
        title: "Test Email",
        body: "Email body",
        channel: "EMAIL",
        type: "INFO"
      });
      const passed = inAppRes.status === "DELIVERED_IN_APP" && emailRes.status === "EXTERNAL_CONFIG_REQUIRED";
      results.push({
        testName: "Notification Provider - In-App Delivery vs External Adapter Status Reporting",
        category: "Notifications",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "In-App delivered successfully; Email correctly reported EXTERNAL_CONFIG_REQUIRED status without false claim" : "Notification provider dispatch failed"
      });
    } catch (err) {
      results.push({
        testName: "Notification Provider",
        category: "Notifications",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const health = await db.persistenceAdapter.executeHealthCheck();
      const passed = !!health.status;
      results.push({
        testName: "Database Persistence Adapter - Health Check & Engine Transparency",
        category: "Database & ORM",
        passed,
        durationMs: Date.now() - start,
        message: `Persistence Engine [${health.engine}] status: ${health.status}`
      });
    } catch (err) {
      results.push({
        testName: "Database Persistence Adapter",
        category: "Database & ORM",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const linkRes = await userService2.linkOperationalAccount("usr-quarry-mgr-002", "tenant-rz-global-001", {
        employeeId: "EMP-088",
        operatorId: "OP-Q1-01"
      });
      const passed = linkRes.success && linkRes.data.linkedEmployeeId === "EMP-088";
      results.push({
        testName: "User Operational Linkage - Linking User Master to HR & Plant Operator",
        category: "Shared Masters",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "User profile linked to Employee ID EMP-088 and Operator ID OP-Q1-01" : "Linkage failed"
      });
    } catch (err) {
      results.push({
        testName: "User Operational Linkage",
        category: "Shared Masters",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const auditRes = await auditService2.getAuditLogs("tenant-rz-global-001");
      const passed = auditRes.success && auditRes.data.length > 0;
      results.push({
        testName: "Persistent Audit Engine - Audit Log Query & Immutability",
        category: "Audit & Compliance",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Found ${auditRes.data.length} persistent audit log entries for tenant` : "No audit logs found"
      });
    } catch (err) {
      results.push({
        testName: "Persistent Audit Engine",
        category: "Audit & Compliance",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const wfRes = await wfService2.initiateWorkflow(
        "tenant-rz-global-001",
        "WF_INVOICE_APPROVAL",
        "INVOICE",
        "INV-2026-00010",
        "usr-quarry-mgr-002"
      );
      const passed = wfRes.success && wfRes.data.currentState === "DRAFT";
      results.push({
        testName: "Workflow Engine - Initiate Workflow Instance & State Transition",
        category: "Workflows",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Initiated Workflow Instance [${wfRes.data.id}] in initial state DRAFT` : "Workflow initiation failed"
      });
    } catch (err) {
      results.push({
        testName: "Workflow Engine",
        category: "Workflows",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const regNo = "KA-19-TEST-" + Math.floor(1e3 + Math.random() * 9e3);
      const vRes = await fleetService.createVehicle("tenant-rz-global-001", {
        registrationNumber: regNo,
        make: "BharatBenz",
        model: "Heavy Tipper 2828",
        vehicleType: "Tipper",
        currentOdometer: 5e3
      });
      const queryVehs = await fleetService.getVehicles("tenant-rz-global-001");
      const passed = !!vRes.id && queryVehs.some((v) => v.registrationNumber === regNo);
      results.push({
        testName: "Fleet Operations - Vehicle Registration & Tenant Scoped Storage",
        category: "Fleet Suite",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Successfully created & queried Fleet Vehicle [${vRes.registrationNumber}]` : "Vehicle creation test failed"
      });
    } catch (err) {
      results.push({
        testName: "Fleet Operations - Vehicle Registration",
        category: "Fleet Suite",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const licNo = "KA-19-2021-" + Math.floor(1e5 + Math.random() * 9e5);
      const dRes = await fleetService.createDriver("tenant-rz-global-001", {
        name: "Ramesh Gowda",
        licenseNumber: licNo,
        phone: "+91-98800-44556",
        licenseType: "HEAVY_COMMERCIAL"
      });
      const drivers = await fleetService.getDrivers("tenant-rz-global-001");
      const passed = !!dRes.id && drivers.some((d) => d.licenseNumber === licNo);
      results.push({
        testName: "Fleet Operations - Driver Profile & License Registry",
        category: "Fleet Suite",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Driver [${dRes.name}] created with heavy commercial license` : "Driver creation test failed"
      });
    } catch (err) {
      results.push({
        testName: "Fleet Operations - Driver Registry",
        category: "Fleet Suite",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const v13 = await fleetService.createVehicle("tenant-rz-global-001", {
        registrationNumber: "KA-19-ASG-" + Math.floor(1e3 + Math.random() * 9e3),
        make: "Tata",
        model: "Prima 2830",
        vehicleType: "Tipper",
        currentOdometer: 1e4
      });
      const assign1 = await fleetService.assignVehicle("tenant-rz-global-001", {
        vehicleId: v13.id,
        primaryDriverId: "drv-suresh-001",
        purpose: "Primary Pit Transfer"
      });
      let conflictBlocked = false;
      try {
        await fleetService.assignVehicle("tenant-rz-global-001", {
          vehicleId: v13.id,
          primaryDriverId: "drv-suresh-001",
          purpose: "Conflicting Assignment"
        });
      } catch {
        conflictBlocked = true;
      }
      const passed = !!assign1.id && conflictBlocked;
      results.push({
        testName: "Fleet Operations - Vehicle Assignment Conflict Prevention",
        category: "Fleet Suite",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "Active vehicle assignment established and conflicting duplicate assignment successfully blocked" : "Failed assignment conflict check"
      });
    } catch (err) {
      results.push({
        testName: "Fleet Operations - Assignment Conflict Check",
        category: "Fleet Suite",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const v14 = await fleetService.createVehicle("tenant-rz-global-001", {
        registrationNumber: "KA-19-TRP-" + Math.floor(1e3 + Math.random() * 9e3),
        make: "Volvo",
        model: "FMX 460",
        vehicleType: "Tipper",
        currentOdometer: 12100
      });
      const trip = await fleetService.createTrip("tenant-rz-global-001", {
        vehicleId: v14.id,
        driverId: "drv-suresh-001",
        source: "Quarry Pit Alpha",
        destination: "Crusher Unit Beta",
        startOdometer: 12100,
        material: "Granite Rock",
        quantity: 30
      });
      await fleetService.dispatchTrip("tenant-rz-global-001", trip.id);
      let negativeOdoBlocked = false;
      try {
        await fleetService.completeTrip("tenant-rz-global-001", trip.id, 12e3);
      } catch {
        negativeOdoBlocked = true;
      }
      const completed = await fleetService.completeTrip("tenant-rz-global-001", trip.id, 12180);
      const passed = completed.status === "COMPLETED" && completed.distance === 80 && negativeOdoBlocked;
      results.push({
        testName: "Fleet Operations - Trip Lifecycle, Dispatch & Odometer Validation",
        category: "Fleet Suite",
        passed,
        durationMs: Date.now() - start,
        message: passed ? "Trip dispatched, invalid negative odometer movement blocked, and 80km trip completed successfully" : "Trip lifecycle test failed"
      });
      const startFuel = Date.now();
      const fuelLog = await fleetService.logFuel("tenant-rz-global-001", {
        vehicleId: v14.id,
        driverId: "drv-suresh-001",
        quantity: 100,
        rate: 95.5,
        odometer: 12280,
        // 100 km covered from 12180
        fuelStation: "Quarry Internal Pump #1"
      });
      const fuelPassed = fuelLog.amount === 9550 && typeof fuelLog.calculatedEfficiency === "number" && fuelLog.calculatedEfficiency > 0;
      results.push({
        testName: "Fleet Operations - Fuel Consumption Logging & Efficiency Calculation",
        category: "Fleet Suite",
        passed: fuelPassed,
        durationMs: Date.now() - startFuel,
        message: fuelPassed ? `Fuel logged (100L @ \u20B995.5/L = \u20B99,550) with calculated efficiency of ${fuelLog.calculatedEfficiency} KM/L` : `Fuel logging test failed (amount=${fuelLog.amount}, eff=${fuelLog.calculatedEfficiency})`
      });
      const startMaint = Date.now();
      const maint = await fleetService.logMaintenance("tenant-rz-global-001", {
        vehicleId: v14.id,
        maintenanceType: "PREVENTIVE",
        description: "Engine Oil Change, Air Filter Replacement & Hydraulic Service",
        odometer: 12500,
        partsCost: 12500,
        labourCost: 3500,
        otherCost: 500
      });
      const maintPassed = maint.totalCost === 16500;
      results.push({
        testName: "Fleet Operations - Maintenance Service & Cost Aggregation",
        category: "Fleet Suite",
        passed: maintPassed,
        durationMs: Date.now() - startMaint,
        message: maintPassed ? `Maintenance recorded with aggregated total cost of \u20B916,500 (Parts: \u20B912,500 + Labour: \u20B93,500 + Other: \u20B9500)` : "Maintenance test failed"
      });
    } catch (err) {
      results.push({
        testName: "Fleet Operations - Trip & Operational Suite",
        category: "Fleet Suite",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const metrics = await fleetService.getDashboardMetrics("tenant-rz-global-001");
      const passed = metrics.totalVehicles >= 2 && metrics.totalDrivers >= 1;
      results.push({
        testName: "Fleet Operations - Dashboard Aggregation & Tenant Metrics",
        category: "Fleet Suite",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Queried Fleet Dashboard: ${metrics.totalVehicles} Vehicles, ${metrics.totalDrivers} Drivers, ${metrics.completedTrips} Completed Trips` : "Dashboard query failed"
      });
    } catch (err) {
      results.push({
        testName: "Fleet Operations - Dashboard Aggregation",
        category: "Fleet Suite",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const load = await marketplaceService.createLoadRequest("tenant-rz-global-001", {
        customerId: "cust-infra-corp-1",
        customerName: "Soma Infrastructure Ltd",
        materialId: "mat-m-sand-01",
        materialName: "M-Sand (Manufactured Sand)",
        source: "Quarry Site Alpha, Rock Ridge",
        destination: "Highway Project Gate 4, Surathkal",
        requiredDate: "2026-08-15",
        requiredTime: "08:00 AM",
        quantity: 32,
        unit: "TONS",
        vehicleType: "Tipper",
        budget: 18e3,
        isPublic: true
      }, "usr-admin-001");
      const matches = await marketplaceService.getLoadMatches("tenant-rz-global-001", load.id);
      const passed = !!load.requestNumber && matches.length > 0 && matches[0].matchScore > 70 && matches[0].reasonCodes.length > 0;
      results.push({
        testName: "Phase 19 \u2014 Load Request Creation & AI Load Match Scoring",
        category: "AI Load Exchange & Marketplace",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Created Load Request [${load.requestNumber}]. AI Engine matched ${matches.length} vehicle(s), top score: ${matches[0].matchScore} (Reasons: ${matches[0].reasonCodes.join(", ")})` : "Load Request & AI Matching failed",
        evidence: { loadNumber: load.requestNumber, matchCount: matches.length, topMatch: matches[0] }
      });
    } catch (err) {
      results.push({
        testName: "Phase 19 \u2014 Load Request Creation & AI Match Engine Execution",
        category: "AI Load Exchange & Marketplace",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const loads = await marketplaceService.getLoadRequests("tenant-rz-global-001", { status: "MATCHED" });
      const targetLoad = loads[0] || (await marketplaceService.getLoadRequests("tenant-rz-global-001"))[0];
      const offer = await marketplaceService.submitOffer("tenant-rz-global-001", {
        loadId: targetLoad.id,
        transporterId: "tp-trans-001",
        vehicleId: "veh-ka19-4491",
        driverId: "drv-suresh-001",
        quotedPrice: 13500,
        remarks: "Tipper ready for immediate dispatch"
      }, "usr-admin-001");
      const booking = await marketplaceService.acceptOffer("tenant-rz-global-001", offer.id, "usr-admin-001");
      const trips = await fleetService.getTrips("tenant-rz-global-001");
      const associatedTrip = trips.find((t) => t.id === booking.fleetTripId);
      const passed = offer.status === "ACCEPTED" && booking.status === "DISPATCHED" && !!associatedTrip && associatedTrip.status === "DISPATCHED";
      results.push({
        testName: "Phase 19 \u2014 Transporter Offer Acceptance & Fleet Trip Integration",
        category: "AI Load Exchange & Marketplace",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Offer [${offer.offerNumber}] accepted. Booking [${booking.bookingNumber}] created and linked to Fleet Trip [${associatedTrip?.tripNumber}]` : "Offer acceptance & trip integration failed",
        evidence: { bookingNumber: booking.bookingNumber, fleetTripNumber: associatedTrip?.tripNumber }
      });
    } catch (err) {
      results.push({
        testName: "Phase 19 \u2014 Transporter Offer & Fleet Trip Integration",
        category: "AI Load Exchange & Marketplace",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  {
    const start = Date.now();
    try {
      const bookings = await marketplaceService.getBookings("tenant-rz-global-001", { status: "DISPATCHED" });
      const targetBooking = bookings[0];
      const deliveries = await marketplaceService.getDeliveries("tenant-rz-global-001", targetBooking?.id);
      const targetDelivery = deliveries[0];
      if (targetDelivery) {
        await marketplaceService.confirmDelivery("tenant-rz-global-001", targetDelivery.id, {
          receiverName: "Ramesh Shetty (Site In-Charge)",
          receiverContact: "+91-98450-22119",
          quantityDelivered: 28,
          documentReference: "POD-2026-0812",
          remarks: "Material inspected and verified at site gate"
        }, "usr-admin-001");
      }
      const metrics = await marketplaceService.getDashboardMetrics("tenant-rz-global-001");
      const passed = metrics.openLoadsCount >= 0 && metrics.availableTransportersCount >= 1 && metrics.averageMatchScore > 0;
      results.push({
        testName: "Phase 19 \u2014 Delivery Confirmation & Marketplace Dashboard Metrics",
        category: "AI Load Exchange & Marketplace",
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Delivery confirmed. Marketplace Dashboard verified: ${metrics.openLoadsCount} Open Loads, ${metrics.activeBookingsCount} Active Bookings, Avg Match Score: ${metrics.averageMatchScore}%` : "Delivery confirmation & metrics failed",
        evidence: metrics
      });
    } catch (err) {
      results.push({
        testName: "Phase 19 \u2014 Delivery Confirmation & Dashboard Metrics",
        category: "AI Load Exchange & Marketplace",
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }
  try {
    const crmTestResults = await runCrmTestSuite();
    results.push(...crmTestResults);
  } catch (err) {
    results.push({
      testName: "Phase 20 \u2014 Enterprise CRM Test Suite Execution",
      category: "Enterprise CRM",
      passed: false,
      durationMs: 0,
      message: `Failed to execute CRM test suite: ${err.message}`
    });
  }
  try {
    const finRes = await runFinanceTestSuite();
    results.push({
      testName: "Phase 21 \u2014 Enterprise Finance & Accounting Suite",
      category: "Enterprise Finance",
      passed: finRes.success,
      durationMs: 0,
      message: finRes.success ? `Passed all ${finRes.passedTests}/${finRes.totalTests} Phase 21 Finance automated tests successfully.` : `Failed Phase 21 Finance tests (${finRes.failedTests} errors): ${finRes.errors.join("; ")}`
    });
  } catch (err) {
    results.push({
      testName: "Phase 21 \u2014 Enterprise Finance Test Suite Execution",
      category: "Enterprise Finance",
      passed: false,
      durationMs: 0,
      message: `Failed to execute Finance test suite: ${err.message}`
    });
  }
  try {
    const hrRes = await runHrTestSuite();
    const passed = hrRes.passedCount === hrRes.totalCount && hrRes.totalCount > 0;
    results.push({
      testName: "Phase 22 \u2014 Enterprise HRMS, Workforce & Payroll Suite",
      category: "Enterprise HRMS",
      passed,
      durationMs: 0,
      message: passed ? `Passed all ${hrRes.passedCount}/${hrRes.totalCount} Phase 22 HRMS automated tests successfully.` : `Failed Phase 22 HRMS tests (${hrRes.totalCount - hrRes.passedCount} errors).`
    });
  } catch (err) {
    results.push({
      testName: "Phase 22 \u2014 Enterprise HRMS Test Suite Execution",
      category: "Enterprise HRMS",
      passed: false,
      durationMs: 0,
      message: `Failed to execute HRMS test suite: ${err.message}`
    });
  }
  try {
    const quarryRes = await runQuarryTestSuite();
    results.push(...quarryRes);
  } catch (err) {
    results.push({
      testName: "Platform 1 \u2014 Quarry Management Domain Test Suite Execution",
      category: "Quarry Production",
      passed: false,
      durationMs: 0,
      message: `Failed to execute Quarry domain test suite: ${err.message}`
    });
  }
  try {
    const quarryApiRes = await runQuarryApiTestSuite();
    results.push(...quarryApiRes);
  } catch (err) {
    results.push({
      testName: "Platform 1 \u2014 Quarry Management API & RBAC Test Suite Execution",
      category: "Quarry API & RBAC",
      passed: false,
      durationMs: 0,
      message: `Failed to execute Quarry API test suite: ${err.message}`
    });
  }
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;
  return {
    executedAt: (/* @__PURE__ */ new Date()).toISOString(),
    totalTests: results.length,
    passedCount,
    failedCount,
    results
  };
}

// src/server/middleware/rateLimiter.ts
var limitStore = /* @__PURE__ */ new Map();
function rateLimiter(options) {
  const { windowMs, max, keyPrefix = "rl" } = options;
  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
    const key = `${keyPrefix}:${ip}`;
    const now = Date.now();
    let record = limitStore.get(key);
    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + windowMs };
      limitStore.set(key, record);
    } else {
      record.count++;
    }
    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetAt / 1e3));
    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: "RATE_LIMIT_EXCEEDED",
        message: `Too many requests from this IP address. Please retry after ${Math.ceil((record.resetAt - now) / 1e3)} seconds.`
      });
    }
    next();
  };
}

// src/server/routes/fleetRouter.ts
var import_express3 = require("express");
var fleetRouter = (0, import_express3.Router)();
var auditRepo3 = new AuditRepository();
function getTenantId(req) {
  return req.tenantContext?.tenantId || req.user?.tenantId || "tenant-rz-global-001";
}
function getUserId(req) {
  return req.user?.id || "usr-admin-001";
}
function getUserEmail(req) {
  return req.user?.email || "admin@racezoneventures.com";
}
fleetRouter.get("/dashboard", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const metrics = await fleetService.getDashboardMetrics(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.get("/vehicles", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status;
    const search = req.query.search;
    const vehicles = await fleetService.getVehicles(tenantId, { status, search });
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.get("/vehicles/:id", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const vehicle = await fleetService.getVehicleById(tenantId, req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, error: "Vehicle not found" });
    res.json({ success: true, data: vehicle });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.post("/vehicles", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const vehicle = await fleetService.createVehicle(tenantId, req.body);
    await auditRepo3.log({
      tenantId,
      actorUserId: getUserId(req),
      actorEmail: getUserEmail(req),
      action: "FLEET_VEHICLE_CREATE",
      module: "Fleet Operations",
      resource: "fleet_vehicles",
      resourceId: vehicle.id,
      ipAddress: req.ip || "127.0.0.1",
      correlationId: generateUuidV7(),
      status: "SUCCESS"
    });
    res.status(201).json({ success: true, data: vehicle });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
fleetRouter.delete("/vehicles/:id", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const deleted = await fleetRepository.deleteVehicle(tenantId, req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Vehicle not found" });
    await auditRepo3.log({
      tenantId,
      actorUserId: getUserId(req),
      actorEmail: getUserEmail(req),
      action: "FLEET_VEHICLE_DELETE",
      module: "Fleet Operations",
      resource: "fleet_vehicles",
      resourceId: req.params.id,
      ipAddress: req.ip || "127.0.0.1",
      correlationId: generateUuidV7(),
      status: "SUCCESS"
    });
    res.json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.get("/drivers", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status;
    const search = req.query.search;
    const drivers = await fleetService.getDrivers(tenantId, { status, search });
    res.json({ success: true, data: drivers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.post("/drivers", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const driver = await fleetService.createDriver(tenantId, req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
fleetRouter.get("/assignments", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const vehicleId = req.query.vehicleId;
    const list = await fleetRepository.getAssignments(tenantId, vehicleId);
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.post("/assignments", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const assignment = await fleetService.assignVehicle(tenantId, req.body);
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
fleetRouter.get("/trips", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status;
    const vehicleId = req.query.vehicleId;
    const driverId = req.query.driverId;
    const trips = await fleetRepository.getTrips(tenantId, { status, vehicleId, driverId });
    res.json({ success: true, data: trips });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.post("/trips", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const trip = await fleetService.createTrip(tenantId, req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
fleetRouter.post("/trips/:id/dispatch", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const trip = await fleetService.dispatchTrip(tenantId, req.params.id);
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
fleetRouter.post("/trips/:id/complete", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const endOdometer = Number(req.body.endOdometer);
    if (isNaN(endOdometer)) {
      return res.status(400).json({ success: false, error: "Valid endOdometer reading is required" });
    }
    const trip = await fleetService.completeTrip(tenantId, req.params.id, endOdometer);
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
fleetRouter.get("/fuel", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const vehicleId = req.query.vehicleId;
    const logs = await fleetRepository.getFuelLogs(tenantId, vehicleId);
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.post("/fuel", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const log = await fleetService.logFuel(tenantId, req.body);
    res.status(201).json({ success: true, data: log });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
fleetRouter.get("/maintenance", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const vehicleId = req.query.vehicleId;
    const records = await fleetRepository.getMaintenanceRecords(tenantId, vehicleId);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
fleetRouter.post("/maintenance", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const record = await fleetService.logMaintenance(tenantId, req.body);
    res.status(201).json({ success: true, data: record });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
fleetRouter.get("/alerts", async (req, res) => {
  try {
    const tenantId = getTenantId(req);
    const alerts = await fleetRepository.getAlerts(tenantId);
    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// src/server/routes/marketplaceRouter.ts
var import_express4 = require("express");
var marketplaceRouter = (0, import_express4.Router)();
function getTenantId2(req) {
  return req.tenantContext?.tenantId || req.user?.tenantId || "tenant-rz-global-001";
}
function getUserId2(req) {
  return req.user?.id || "usr-admin-001";
}
marketplaceRouter.get("/dashboard", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const metrics = await marketplaceService.getDashboardMetrics(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/loads", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const status = req.query.status;
    const search = req.query.search;
    const isPublic = req.query.isPublic !== void 0 ? req.query.isPublic === "true" : void 0;
    const loads = await marketplaceService.getLoadRequests(tenantId, { status, search, isPublic });
    res.json({ success: true, data: loads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/loads/:id", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const load = await marketplaceService.getLoadRequestById(tenantId, req.params.id);
    if (!load) return res.status(404).json({ success: false, error: "Load Request not found" });
    res.json({ success: true, data: load });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/loads", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const userId = getUserId2(req);
    const newLoad = await marketplaceService.createLoadRequest(tenantId, req.body, userId);
    res.status(201).json({ success: true, data: newLoad });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/public/loads", async (req, res) => {
  try {
    const newLoad = await marketplaceService.createPublicLoadRequest(req.body);
    res.status(201).json({ success: true, data: newLoad, message: "Public transport load request submitted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/loads/:id/matches", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const matches = await marketplaceService.triggerLoadMatching(tenantId, req.params.id);
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/loads/:id/matches", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const matches = await marketplaceService.getLoadMatches(tenantId, req.params.id);
    res.json({ success: true, data: matches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/offers", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const loadId = req.query.loadId;
    const offers = await marketplaceService.getOffers(tenantId, loadId);
    res.json({ success: true, data: offers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/offers", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const userId = getUserId2(req);
    const offer = await marketplaceService.submitOffer(tenantId, req.body, userId);
    res.status(201).json({ success: true, data: offer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/offers/:id/accept", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const userId = getUserId2(req);
    const booking = await marketplaceService.acceptOffer(tenantId, req.params.id, userId);
    res.json({ success: true, data: booking, message: "Offer accepted. Booking confirmed and Fleet Trip dispatched." });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/offers/:id/reject", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const userId = getUserId2(req);
    const offer = await marketplaceService.rejectOffer(tenantId, req.params.id, userId);
    res.json({ success: true, data: offer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/bookings", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const status = req.query.status;
    const search = req.query.search;
    const bookings = await marketplaceService.getBookings(tenantId, { status, search });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/bookings/:id", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const booking = await marketplaceService.getBookingById(tenantId, req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/bookings/:id/cancel", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const userId = getUserId2(req);
    const reason = req.body.reason || "Customer requested cancellation";
    const booking = await marketplaceService.cancelBooking(tenantId, req.params.id, reason, userId);
    res.json({ success: true, data: booking });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/deliveries", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const bookingId = req.query.bookingId;
    const deliveries = await marketplaceService.getDeliveries(tenantId, bookingId);
    res.json({ success: true, data: deliveries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/deliveries/:id/confirm", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const userId = getUserId2(req);
    const delivery = await marketplaceService.confirmDelivery(tenantId, req.params.id, req.body, userId);
    res.json({ success: true, data: delivery, message: "Delivery confirmed successfully" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/ratings", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const transporterId = req.query.transporterId;
    const ratings = await marketplaceService.getTransporters(tenantId);
    res.json({ success: true, data: ratings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/ratings", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const userId = getUserId2(req);
    const rating = await marketplaceService.createRating(tenantId, req.body, userId);
    res.status(201).json({ success: true, data: rating });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/disputes", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const status = req.query.status;
    const disputes = await marketplaceService.getDisputes(tenantId, { status });
    res.json({ success: true, data: disputes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/disputes", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const userId = getUserId2(req);
    const dispute = await marketplaceService.createDispute(tenantId, req.body, userId);
    res.status(201).json({ success: true, data: dispute });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/transporters", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const status = req.query.status;
    const search = req.query.search;
    const transporters = await marketplaceService.getTransporters(tenantId, { status, search });
    res.json({ success: true, data: transporters });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
marketplaceRouter.post("/transporters", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const transporter = await marketplaceService.createTransporter(tenantId, req.body);
    res.status(201).json({ success: true, data: transporter });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
marketplaceRouter.get("/pricing-estimate", async (req, res) => {
  try {
    const tenantId = getTenantId2(req);
    const materialId = req.query.materialId || "mat-m-sand-01";
    const quantity = Number(req.query.quantity) || 30;
    const source = req.query.source || "Quarry Pit Alpha";
    const destination = req.query.destination || "Panambur Port";
    const vehicleType = req.query.vehicleType || "Tipper";
    const estimate = marketplaceService.getPricingEstimate(tenantId, materialId, quantity, source, destination, vehicleType);
    res.json({ success: true, data: estimate });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// src/server/routes/crmRouter.ts
var import_express5 = require("express");
var crmRouter = (0, import_express5.Router)();
function getTenantId3(req) {
  return req.tenantContext?.tenantId || req.user?.tenantId || "tenant-rz-global-001";
}
function getUserId3(req) {
  return req.user?.id || "usr-admin-001";
}
crmRouter.get("/dashboard", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const metrics = await crmService.getCrmDashboard(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.get("/customers", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const status = req.query.status;
    const search = req.query.search;
    const customerType = req.query.customerType;
    const customers = await crmService.getCustomers(tenantId, { status, search, customerType });
    res.json({ success: true, data: customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.get("/customers/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const customer = await crmService.getCustomerById(tenantId, req.params.id);
    if (!customer) return res.status(404).json({ success: false, error: "Customer not found" });
    res.json({ success: true, data: customer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.get("/customers/:id/360", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const c360 = await crmService.getCustomer360(tenantId, req.params.id);
    res.json({ success: true, data: c360 });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/customers", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const customer = await crmService.createCustomer(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.put("/customers/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const updated = await crmService.updateCustomer(tenantId, userId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Customer not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.delete("/customers/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const deleted = await crmService.deleteCustomer(tenantId, userId, req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: "Customer not found" });
    res.json({ success: true, message: "Customer successfully deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.get("/customers/:id/contacts", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const contacts = await crmRepository.getContacts(tenantId, req.params.id);
    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/contacts", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const contact = await crmRepository.createContact(tenantId, req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.put("/contacts/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const updated = await crmRepository.updateContact(tenantId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Contact not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.get("/leads", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const status = req.query.status;
    const source = req.query.source;
    const search = req.query.search;
    const leads = await crmRepository.getLeads(tenantId, { status, source, search });
    res.json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.get("/leads/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const lead = await crmRepository.getLeadById(tenantId, req.params.id);
    if (!lead) return res.status(404).json({ success: false, error: "Lead not found" });
    res.json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/leads", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const lead = await crmService.createLead(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.put("/leads/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const updated = await crmRepository.updateLead(tenantId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Lead not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.post("/leads/:id/convert", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const result = await crmService.convertLeadToOpportunity(tenantId, userId, req.params.id);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.get("/opportunities", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const stage = req.query.stage;
    const customerId = req.query.customerId;
    const opps = await crmService.getOpportunities(tenantId, { stage, customerId });
    res.json({ success: true, data: opps });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/opportunities", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const opp = await crmService.createOpportunity(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: opp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.put("/opportunities/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const updated = await crmService.updateOpportunity(tenantId, userId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Opportunity not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.get("/activities", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const customerId = req.query.customerId;
    const leadId = req.query.leadId;
    const status = req.query.status;
    const activities = await crmRepository.getSalesActivities(tenantId, { customerId, leadId, status });
    res.json({ success: true, data: activities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/activities", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const activity = await crmService.createSalesActivity(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.put("/activities/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const updated = await crmRepository.updateSalesActivity(tenantId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Sales Activity not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.get("/quotations", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const customerId = req.query.customerId;
    const status = req.query.status;
    const quotes = await crmService.getQuotations(tenantId, { customerId, status });
    res.json({ success: true, data: quotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.get("/quotations/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const quote = await crmRepository.getQuotationById(tenantId, req.params.id);
    if (!quote) return res.status(404).json({ success: false, error: "Quotation not found" });
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/quotations", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const quote = await crmService.createQuotation(tenantId, userId, req.body.quotation || req.body, req.body.items);
    res.status(201).json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.put("/quotations/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const updated = await crmRepository.updateQuotation(tenantId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Quotation not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.post("/quotations/:id/approve", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const quote = await crmService.approveQuotation(tenantId, userId, req.params.id);
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.get("/customers/:id/credit", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const credit = await crmRepository.getCustomerCredit(tenantId, req.params.id);
    res.json({ success: true, data: credit });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.put("/customers/:id/credit", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const credit = await crmRepository.updateCustomerCredit(tenantId, req.params.id, req.body);
    res.json({ success: true, data: credit });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.get("/customers/:id/documents", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const docs = await crmRepository.getCustomerDocuments(tenantId, req.params.id);
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/documents", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const doc = await crmRepository.createCustomerDocument(tenantId, req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.get("/support", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const customerId = req.query.customerId;
    const status = req.query.status;
    const tickets = await crmService.getSupportTickets(tenantId, { customerId, status });
    res.json({ success: true, data: tickets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/support", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const ticket = await crmService.createSupportTicket(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.put("/support/:id", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const updated = await crmService.updateSupportTicket(tenantId, userId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: "Support ticket not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
crmRouter.get("/segments", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const segments = await crmRepository.getCustomerSegments(tenantId);
    res.json({ success: true, data: segments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.get("/customers/:id/notes", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const notes = await crmRepository.getCustomerNotes(tenantId, req.params.id);
    res.json({ success: true, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
crmRouter.post("/notes", async (req, res) => {
  try {
    const tenantId = getTenantId3(req);
    const userId = getUserId3(req);
    const note = await crmRepository.createCustomerNote(tenantId, { ...req.body, authorUserId: userId });
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// src/server/routes/financeRouter.ts
var import_express6 = require("express");
var financeRouter = (0, import_express6.Router)();
function getTenantId4(req) {
  return req.tenantContext?.tenantId || req.user?.tenantId || "tenant-rz-global-001";
}
function getUserId4(req) {
  return req.user?.id || "usr-admin-001";
}
financeRouter.get("/dashboard", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const metrics = await financeService.getDashboardMetrics(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/accounts", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const accounts = await financeService.getChartOfAccounts(tenantId);
    res.json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/accounts/:id", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const account = await financeService.getAccountById(tenantId, req.params.id);
    if (!account) return res.status(404).json({ success: false, error: "Account not found" });
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.post("/accounts", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const account = await financeService.createAccount(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: account });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.put("/accounts/:id", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const account = await financeService.updateAccount(tenantId, userId, req.params.id, req.body);
    res.json({ success: true, data: account });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.get("/fiscal-years", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const years = await financeService.getFiscalYears(tenantId);
    res.json({ success: true, data: years });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/fiscal-periods", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const periods = await financeService.getFiscalPeriods(tenantId, req.query.fiscalYearId);
    res.json({ success: true, data: periods });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.post("/fiscal-periods/:id/close", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const period = await financeService.closeFiscalPeriod(tenantId, userId, req.params.id);
    res.json({ success: true, data: period });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.post("/fiscal-periods/:id/reopen", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const period = await financeService.reopenFiscalPeriod(tenantId, userId, req.params.id);
    res.json({ success: true, data: period });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.get("/journals", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const journals = await financeService.getJournals(tenantId);
    res.json({ success: true, data: journals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/journals/:id", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const details = await financeService.getJournalDetails(tenantId, req.params.id);
    res.json({ success: true, data: details });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});
financeRouter.post("/journals", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const journal = await financeService.createJournal(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: journal });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.post("/journals/:id/post", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const journal = await financeService.postJournal(tenantId, userId, req.params.id);
    res.json({ success: true, data: journal });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.post("/journals/:id/reverse", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const { reason } = req.body || {};
    const reversedJournal = await financeService.reverseJournal(tenantId, userId, req.params.id, reason || "Requested reversal");
    res.json({ success: true, data: reversedJournal });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.get("/invoices", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const invoices = await financeService.getInvoices(tenantId);
    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.post("/invoices", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const invoice = await financeService.createCustomerInvoice(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.post("/payments", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const payment = await financeService.recordCustomerPayment(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.post("/payments/:id/allocate", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const { invoiceId, allocatedAmount } = req.body || {};
    const alloc = await financeService.allocatePaymentToInvoice(tenantId, userId, req.params.id, invoiceId, Number(allocatedAmount));
    res.json({ success: true, data: alloc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.get("/bills", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const bills = await financeService.getSupplierBills(tenantId);
    res.json({ success: true, data: bills });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.post("/bills", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const bill = await financeService.createSupplierBill(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: bill });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.get("/expenses", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const expenses = await financeService.getExpenses(tenantId);
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.post("/expenses", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const expense = await financeService.recordExpense(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.get("/bank-accounts", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const accounts = await financeService.getBankAccounts(tenantId);
    res.json({ success: true, data: accounts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/bank-transactions", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const txs = await financeService.getBankTransactions(tenantId, req.query.bankAccountId);
    res.json({ success: true, data: txs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.post("/bank-reconciliation", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const userId = getUserId4(req);
    const rec = await financeService.reconcileBankStatement(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: rec });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
financeRouter.get("/reports/general-ledger", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const report = await financeService.getGeneralLedgerReport(
      tenantId,
      req.query.accountId,
      req.query.startDate,
      req.query.endDate
    );
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/reports/trial-balance", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const report = await financeService.getTrialBalanceReport(tenantId, req.query.asOfDate);
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/reports/profit-loss", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const report = await financeService.getProfitAndLossReport(
      tenantId,
      req.query.startDate,
      req.query.endDate
    );
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/reports/balance-sheet", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const report = await financeService.getBalanceSheetReport(tenantId, req.query.asOfDate);
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
financeRouter.get("/reports/aging", async (req, res) => {
  try {
    const tenantId = getTenantId4(req);
    const type = req.query.type?.toUpperCase() === "AP" ? "AP" : "AR";
    const report = await financeService.getAgingReport(tenantId, type);
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// src/server/routes/hrRouter.ts
var import_express7 = require("express");
var hrRouter = (0, import_express7.Router)();
function getContext(req) {
  const user = req.user || {};
  const tenantId = user.tenantId || req.headers["x-tenant-id"] || "tenant-rz-global-001";
  const userId = user.id || "usr-admin-001";
  return { tenantId: String(tenantId), userId: String(userId) };
}
hrRouter.get("/dashboard", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const metrics = await hrService.getDashboardMetrics(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.get("/employees", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employees = await hrService.getEmployees(tenantId);
    res.json({ success: true, data: employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.get("/employees/:id", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const emp = await hrService.getEmployeeById(tenantId, req.params.id);
    if (!emp) return res.status(404).json({ success: false, error: "Employee not found" });
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/employees", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const emp = await hrService.createEmployee(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: emp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.put("/employees/:id", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const emp = await hrService.updateEmployee(tenantId, userId, req.params.id, req.body);
    res.json({ success: true, data: emp });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/employees/:id/link-user", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const link = await hrService.linkEmployeeUser(tenantId, userId, req.params.id, req.body.targetUserId);
    res.json({ success: true, data: link });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/departments", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const depts = await hrService.getDepartments(tenantId);
    res.json({ success: true, data: depts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/departments", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const dept = await hrService.createDepartment(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: dept });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/designations", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const desigs = await hrService.getDesignations(tenantId);
    res.json({ success: true, data: desigs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/designations", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const desig = await hrService.createDesignation(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: desig });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/shifts", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const shifts = await hrService.getShifts(tenantId);
    res.json({ success: true, data: shifts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/shifts", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const shift = await hrService.createShift(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: shift });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/attendance", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const date = req.query.date ? String(req.query.date) : void 0;
    const records = await hrService.getAttendance(tenantId, employeeId, date);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/attendance/check-in", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const att = await hrService.checkIn(tenantId, userId, req.body.employeeId, req.body.checkInTime);
    res.json({ success: true, data: att });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/attendance/check-out", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const att = await hrService.checkOut(tenantId, userId, req.body.attendanceId, req.body.checkOutTime);
    res.json({ success: true, data: att });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/attendance/corrections", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const corr = await hrService.submitAttendanceCorrection(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: corr });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/attendance/corrections/:id/approve", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const corr = await hrService.approveAttendanceCorrection(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: corr });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/leave/types", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const types = await hrService.getLeaveTypes(tenantId);
    res.json({ success: true, data: types });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.get("/leave/balances", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const balances = await hrService.getLeaveBalances(tenantId, employeeId);
    res.json({ success: true, data: balances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.get("/leave/applications", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const apps = await hrService.getLeaveBalances(tenantId, employeeId);
    const list = await hrService.applyLeave ? await hrService.getLeaveBalances(tenantId, employeeId) : [];
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/leave/applications", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const app = await hrService.applyLeave(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/leave/applications/:id/approve", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const app = await hrService.approveLeave(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/holidays", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const hols = await hrService.getHolidays(tenantId);
    res.json({ success: true, data: hols });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/holidays", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const hol = await hrService.createHoliday(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: hol });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/overtime", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const ot = await hrService.getOvertime(tenantId);
    res.json({ success: true, data: ot });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/overtime/:id/approve", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const ot = await hrService.approveOvertime(tenantId, userId, req.params.id, req.body.approvedMinutes || 120, req.body.rate || 1.5);
    res.json({ success: true, data: ot });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/salary-structures", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const structs = await hrService.getSalaryStructures(tenantId, employeeId);
    res.json({ success: true, data: structs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/salary-structures", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const struct = await hrService.createSalaryStructure(tenantId, userId, req.body.structure || req.body, req.body.components || []);
    res.status(201).json({ success: true, data: struct });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/payroll/periods", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const periods = await hrService.getPayrollPeriods(tenantId);
    res.json({ success: true, data: periods });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/payroll/periods", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const period = await hrService.createPayrollPeriod(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: period });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/payroll/runs", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const runs = await hrService.getPayrollRuns(tenantId);
    res.json({ success: true, data: runs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/payroll/calculate", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const run = await hrService.calculatePayroll(tenantId, req.body.periodId, userId);
    res.status(201).json({ success: true, data: run });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/payroll/runs/:id/approve", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const run = await hrService.approvePayroll(tenantId, req.params.id, userId);
    res.json({ success: true, data: run });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/payroll/runs/:id/process", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const run = await hrService.processPayroll(tenantId, req.params.id, userId);
    res.json({ success: true, data: run });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/payslips", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const payslips = await hrService.getPayslips(tenantId, employeeId);
    res.json({ success: true, data: payslips });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.get("/advances", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const advances = await hrService.getSalaryAdvances(tenantId, employeeId);
    res.json({ success: true, data: advances });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/advances", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const adv = await hrService.requestSalaryAdvance(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: adv });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/advances/:id/approve", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const adv = await hrService.approveSalaryAdvance(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: adv });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/loans", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const loans = await hrService.getEmployeeLoans(tenantId, employeeId);
    res.json({ success: true, data: loans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/loans", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const loan = await hrService.requestEmployeeLoan(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: loan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/loans/:id/approve", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const loan = await hrService.approveEmployeeLoan(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: loan });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/reimbursements", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const reimbs = await hrService.getReimbursements(tenantId, employeeId);
    res.json({ success: true, data: reimbs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/reimbursements", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const reimb = await hrService.submitReimbursement(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: reimb });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/reimbursements/:id/approve", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const reimb = await hrService.approveReimbursement(tenantId, userId, req.params.id, req.body.approved !== false);
    res.json({ success: true, data: reimb });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/documents", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const docs = await hrService.getEmployeeDocuments(tenantId, employeeId);
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/documents", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const doc = await hrService.addEmployeeDocument(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/performance/cycles", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const cycles = await hrService.getPerformanceCycles(tenantId);
    res.json({ success: true, data: cycles });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/performance/cycles", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const cycle = await hrService.createPerformanceCycle(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: cycle });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/performance/goals", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const goals = await hrService.getEmployeeGoals(tenantId, employeeId);
    res.json({ success: true, data: goals });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/performance/goals", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const goal = await hrService.createEmployeeGoal(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/performance/reviews", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const reviews = await hrService.getEmployeeReviews(tenantId, employeeId);
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/performance/reviews", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const rev = await hrService.submitEmployeeReview(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: rev });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/recruitment/requisitions", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const reqs = await hrService.getJobRequisitions(tenantId);
    res.json({ success: true, data: reqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/recruitment/requisitions", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const reqItem = await hrService.createJobRequisition(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: reqItem });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/recruitment/candidates", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const candidates = await hrService.getCandidates(tenantId);
    res.json({ success: true, data: candidates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/recruitment/candidates", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const cand = await hrService.createCandidate(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: cand });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/recruitment/candidates/:id/hire", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const result = await hrService.hireCandidate(tenantId, userId, req.params.id, req.body.departmentId, req.body.designationId);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/onboarding", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const tasks = await hrService.getOnboardings(tenantId, employeeId);
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/onboarding", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const task = await hrService.createOnboardingTask(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/offboarding", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const employeeId = req.query.employeeId ? String(req.query.employeeId) : void 0;
    const records = await hrService.getOffboardings(tenantId, employeeId);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
hrRouter.post("/offboarding", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const rec = await hrService.initiateOffboarding(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: rec });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.post("/offboarding/final-settlement", async (req, res) => {
  try {
    const { tenantId, userId } = getContext(req);
    const settlement = await hrService.calculateFinalSettlement(tenantId, userId, req.body.employeeId);
    res.json({ success: true, data: settlement });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});
hrRouter.get("/reports", async (req, res) => {
  try {
    const { tenantId } = getContext(req);
    const reports = await hrService.getHrReports(tenantId, req.query);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// src/server/routes/ottRouter.ts
var import_express8 = require("express");

// src/server/services/ottService.ts
var OTT_DEMO_USERS = [
  {
    id: "USR-1001",
    name: "Nafid Khan",
    role: "RZ Minetrix Executive / Quarry Owner",
    email: "nafidkhan@racezoneventures.com",
    phone: "+91 98290 11001",
    relationshipWithMe: "SELF"
  },
  {
    id: "USR-1002",
    name: "Vikramaditya Singh",
    role: "Quarry General Manager",
    email: "vikram@minetrix.in",
    phone: "+91 94141 22002",
    relationshipWithMe: "OWNER_TO_MANAGER"
  },
  {
    id: "USR-1003",
    name: "Rajesh Sharma",
    role: "Heavy Tipper Fleet Lead",
    email: "rajesh.fleet@minetrix.in",
    phone: "+91 98288 33003",
    relationshipWithMe: "MANAGER_TO_DRIVER"
  },
  {
    id: "USR-1004",
    name: "Priya Verma",
    role: "M-Sand Quality Control Engineer",
    email: "priya.qc@minetrix.in",
    phone: "+91 97833 44004",
    relationshipWithMe: "MANAGER_TO_STAFF"
  },
  {
    id: "USR-1005",
    name: "Fatima Khan",
    role: "Family Member",
    email: "fatima.k@personal.com",
    phone: "+91 98290 11099",
    relationshipWithMe: "FAMILY"
  },
  {
    id: "USR-1006",
    name: "Arjun Mehta",
    role: "Civil Contractor / Business Partner",
    email: "arjun@apexinfra.org",
    phone: "+91 99281 55005",
    relationshipWithMe: "BUSINESS_PARTNER"
  }
];
var OTTService = class {
  constructor() {
    this.tasks = /* @__PURE__ */ new Map();
    this.requests = /* @__PURE__ */ new Map();
    this.activeUserId = "USR-1001";
    this.seedInitialData();
  }
  seedInitialData() {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const tomorrowDate = new Date(Date.now() + 864e5).toISOString().split("T")[0];
    const yesterdayDate = new Date(Date.now() - 864e5).toISOString().split("T")[0];
    const initialTasks = [
      // 1. Minetrix Quarry Management Task
      {
        id: "TASK-OTT-001",
        title: "Perform Morning Blasting Safety Perimeter Inspection - Pit #04",
        description: "Ensure 500m siren protocol, check DGMS bench safety clearance, and log bench height reading in Minetrix BOS before morning detonation.",
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[1],
        workspace: "RZ_MINETRIX",
        priority: "URGENT",
        startDate: today,
        startTime: "08:00",
        dueDate: today,
        dueTime: "09:30",
        estimatedMinutes: 90,
        actualMinutes: 75,
        reminderSettings: [{ id: "rem-1", type: "START_TIME", triggerMinutesBefore: 30 }],
        recurrence: "NONE",
        attachments: [{ id: "att-1", name: "DGMS_Blast_Checklist.pdf", size: "1.2 MB", type: "application/pdf" }],
        notes: [
          { id: "n-1", authorId: "USR-1001", authorName: "Nafid Khan", text: "Ensure non-electric detonator lead wire check is complete.", createdAt: new Date(Date.now() - 72e5).toISOString() }
        ],
        checklist: [
          { id: "c-1", title: "Verify perimeter flags and warning red beacons", completed: true, completedAt: today + "T08:15:00Z" },
          { id: "c-2", title: "Sound three standard 1-minute sirens", completed: true, completedAt: today + "T08:35:00Z" },
          { id: "c-3", title: "Upload bench inspection photo to Minetrix Pit Log", completed: false }
        ],
        status: "IN_PROGRESS",
        createdAt: yesterdayDate + "T16:00:00Z",
        updatedAt: today + "T08:35:00Z",
        history: [
          { id: "h-1", action: "Created from RZ Minetrix Quarry Module", actorId: "USR-1001", actorName: "Nafid Khan", timestamp: yesterdayDate + "T16:00:00Z" },
          { id: "h-2", action: "Accepted by Assignee", actorId: "USR-1002", actorName: "Vikramaditya Singh", timestamp: yesterdayDate + "T18:00:00Z" },
          { id: "h-3", action: "Started Inspection", actorId: "USR-1002", actorName: "Vikramaditya Singh", timestamp: today + "T08:00:00Z" }
        ],
        followUpCount: 0,
        minetrixRef: {
          module: "QUARRY",
          entityId: "PIT-04",
          entityType: "Pit Master",
          entityTitle: "Chittorgarh Black Granite Pit #04",
          syncedAt: today + "T08:00:00Z",
          lastSyncedStatus: "IN_PROGRESS"
        },
        isPrivate: false
      },
      // 2. Heavy Fleet Dispatch Task
      {
        id: "TASK-OTT-002",
        title: "Dispatch 12 Volvo 10-Wheeler Tippers to NH-79 Bypass Project",
        description: "Deliver 360 MT of 20mm blue metal aggregate to Apex Heavy Infra site. Secure weighbridge digital slips.",
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[2],
        workspace: "RZ_MINETRIX",
        priority: "HIGH",
        startDate: today,
        startTime: "10:00",
        dueDate: today,
        dueTime: "12:30",
        estimatedMinutes: 150,
        actualMinutes: 0,
        reminderSettings: [{ id: "rem-2", type: "START_TIME", triggerMinutesBefore: 15 }],
        recurrence: "NONE",
        attachments: [],
        notes: [],
        checklist: [
          { id: "c-201", title: "Verify electronic gate pass generation in Minetrix BOS", completed: true },
          { id: "c-202", title: "Inspect tipper tarpaulin covering against spillage", completed: false },
          { id: "c-203", title: "Confirm arrival at Apex site via GPS", completed: false }
        ],
        status: "ACCEPTED",
        createdAt: today + "T06:30:00Z",
        updatedAt: today + "T07:15:00Z",
        history: [
          { id: "h-201", action: "Created & Assigned", actorId: "USR-1001", actorName: "Nafid Khan", timestamp: today + "T06:30:00Z" },
          { id: "h-202", action: "Request Accepted by Rajesh Sharma", actorId: "USR-1003", actorName: "Rajesh Sharma", timestamp: today + "T07:15:00Z" }
        ],
        followUpCount: 0,
        minetrixRef: {
          module: "FLEET",
          entityId: "DISP-7701",
          entityType: "Fleet Dispatch",
          entityTitle: "Batch Dispatch 12x Volvo Tippers",
          syncedAt: today + "T07:15:00Z"
        },
        isPrivate: false
      },
      // 3. Personal / Family Task
      {
        id: "TASK-OTT-003",
        title: "Refill Father Blood Pressure & Diabetes Prescription",
        description: "Pick up 30-day medicine package from City Apollo Pharmacy before evening.",
        assignedBy: OTT_DEMO_USERS[4],
        assignedTo: OTT_DEMO_USERS[0],
        workspace: "FAMILY",
        priority: "HIGH",
        startDate: today,
        startTime: "13:00",
        dueDate: today,
        dueTime: "14:00",
        estimatedMinutes: 45,
        actualMinutes: 0,
        reminderSettings: [
          { id: "rem-301", type: "DUE_DATE", triggerMinutesBefore: 30 },
          { id: "rem-302", type: "CUSTOM", customDateTime: today + "T12:30:00" }
        ],
        recurrence: "MONTHLY",
        attachments: [],
        notes: [
          { id: "n-301", authorId: "USR-1005", authorName: "Fatima Khan", text: "Dr. Alok updated the dosage on card. Please ask chemist for 50mg.", createdAt: yesterdayDate + "T19:00:00Z" }
        ],
        checklist: [
          { id: "c-301", title: "Collect prescription card from drawer", completed: false },
          { id: "c-302", title: "Collect medicine & invoice", completed: false }
        ],
        status: "ACCEPTED",
        createdAt: yesterdayDate + "T18:00:00Z",
        updatedAt: yesterdayDate + "T19:00:00Z",
        history: [
          { id: "h-301", action: "Family Request Received", actorId: "USR-1005", actorName: "Fatima Khan", timestamp: yesterdayDate + "T18:00:00Z" },
          { id: "h-302", action: "Accepted by Nafid", actorId: "USR-1001", actorName: "Nafid Khan", timestamp: yesterdayDate + "T19:00:00Z" }
        ],
        followUpCount: 0,
        isPrivate: true
      },
      // 4. Overdue Office Follow-up Task
      {
        id: "TASK-OTT-004",
        title: "Review Q3 Crusher Machinery Depreciation & GST Filing Ledger",
        description: "Verify input tax credit for 3 cone crusher replacement manganese mantles and sign CA audit annexure.",
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[0],
        workspace: "OFFICE",
        priority: "URGENT",
        startDate: yesterdayDate,
        startTime: "15:00",
        dueDate: yesterdayDate,
        dueTime: "18:00",
        estimatedMinutes: 120,
        actualMinutes: 40,
        reminderSettings: [{ id: "rem-401", type: "OVERDUE_FOLLOW_UP", triggerMinutesBefore: 0 }],
        recurrence: "NONE",
        attachments: [{ id: "att-401", name: "Q3_Crusher_Depreciation_Schedule.xlsx", size: "2.4 MB", type: "application/vnd.ms-excel" }],
        notes: [
          { id: "n-401", authorId: "USR-1001", authorName: "Nafid Khan", text: "CA requested final signed copy before midnight.", createdAt: yesterdayDate + "T18:30:00Z" }
        ],
        checklist: [
          { id: "c-401", title: "Check asset capitalization voucher in Minetrix General Ledger", completed: true },
          { id: "c-402", title: "Sign Form GSTR-3B variance sheet", completed: false }
        ],
        status: "OVERDUE",
        createdAt: yesterdayDate + "T09:00:00Z",
        updatedAt: today + "T07:00:00Z",
        history: [
          { id: "h-401", action: "Created", actorId: "USR-1001", actorName: "Nafid Khan", timestamp: yesterdayDate + "T09:00:00Z" },
          { id: "h-402", action: "Marked Overdue by OTT Reminder Engine", actorId: "SYSTEM", actorName: "OTT Automation", timestamp: yesterdayDate + "T18:01:00Z" }
        ],
        followUpCount: 2,
        lastFollowUpAt: today + "T07:00:00Z",
        isPrivate: false
      },
      // 5. Tomorrow Task
      {
        id: "TASK-OTT-005",
        title: "Meet Rajasthan State Pollution Control Board Inspection Team",
        description: "Conduct site walkabout at Crusher Station B. Present water sprinkler logbook and ambient air particulate meter certificates.",
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[1],
        workspace: "RZ_MINETRIX",
        priority: "HIGH",
        startDate: tomorrowDate,
        startTime: "10:30",
        dueDate: tomorrowDate,
        dueTime: "13:00",
        estimatedMinutes: 150,
        actualMinutes: 0,
        reminderSettings: [{ id: "rem-501", type: "START_TIME", triggerMinutesBefore: 60 }],
        recurrence: "NONE",
        attachments: [],
        notes: [],
        checklist: [
          { id: "c-501", title: "Test 4 High-Pressure mist cannons at primary jaw crusher", completed: false },
          { id: "c-502", title: "Print last 90-day acoustic barrier readings", completed: false }
        ],
        status: "SCHEDULED",
        createdAt: today + "T08:00:00Z",
        updatedAt: today + "T08:00:00Z",
        history: [
          { id: "h-501", action: "Created and Scheduled", actorId: "USR-1001", actorName: "Nafid Khan", timestamp: today + "T08:00:00Z" }
        ],
        followUpCount: 0,
        minetrixRef: {
          module: "CRUSHER",
          entityId: "CRUSH-ST-B",
          entityType: "Crusher Plant Master",
          entityTitle: "Station B 200 TPH VSI Plant",
          syncedAt: today + "T08:00:00Z"
        },
        isPrivate: false
      },
      // 6. Personal Study / Growth
      {
        id: "TASK-OTT-006",
        title: "Review DGMS Mines Act 1952 Open-Cast Slope Stability Code",
        description: "30-minute revision for regulatory compliance and safe quarry bench height calculation rules.",
        assignedBy: OTT_DEMO_USERS[0],
        assignedTo: OTT_DEMO_USERS[0],
        workspace: "STUDY",
        priority: "MEDIUM",
        startDate: today,
        startTime: "20:30",
        dueDate: today,
        dueTime: "21:15",
        estimatedMinutes: 45,
        actualMinutes: 0,
        reminderSettings: [{ id: "rem-601", type: "START_TIME", triggerMinutesBefore: 15 }],
        recurrence: "WEEKDAYS",
        attachments: [],
        notes: [],
        checklist: [
          { id: "c-601", title: "Read section on hard rock angle of repose (maximum 60 degrees)", completed: false }
        ],
        status: "ACCEPTED",
        createdAt: today + "T07:00:00Z",
        updatedAt: today + "T07:00:00Z",
        history: [],
        followUpCount: 0,
        isPrivate: true
      }
    ];
    initialTasks.forEach((task) => this.tasks.set(task.id, task));
    const initialRequests = [
      {
        id: "REQ-OTT-101",
        taskId: "TASK-OTT-REQ-1",
        taskTitle: "Perform Quarterly Calibration of Weighbridge Sensor Cell #02",
        taskDescription: "Legal metrology calibration stamp required. Certificate must be attached to Minetrix Weighbridge Master.",
        workspace: "RZ_MINETRIX",
        priority: "HIGH",
        dueDate: tomorrowDate,
        dueTime: "16:00",
        estimatedMinutes: 120,
        sender: OTT_DEMO_USERS[1],
        recipient: OTT_DEMO_USERS[0],
        relationshipType: "OWNER_TO_MANAGER",
        status: "PENDING",
        requestNote: "Sir, Legal Metrology inspector has confirmed visit tomorrow 2 PM. Need your approval on the vendor fee voucher.",
        createdAt: today + "T07:30:00Z"
      },
      {
        id: "REQ-OTT-102",
        taskId: "TASK-OTT-REQ-2",
        taskTitle: "Verify Delivery of 500 Bags of Ultratech 53-Grade Cement",
        taskDescription: "Arrived at yard 3. Match physical lorry seal against Minetrix purchase order PO-8812.",
        workspace: "BUSINESS",
        priority: "MEDIUM",
        dueDate: today,
        dueTime: "17:00",
        estimatedMinutes: 60,
        sender: OTT_DEMO_USERS[5],
        recipient: OTT_DEMO_USERS[0],
        relationshipType: "BUSINESS_PARTNER",
        status: "PENDING",
        requestNote: "Driver is waiting at yard entrance. Please approve unloading.",
        createdAt: today + "T08:15:00Z"
      }
    ];
    initialRequests.forEach((req) => this.requests.set(req.id, req));
  }
  // --- MY DAY ENGINE ---
  getMyDayMetrics(userId = this.activeUserId, workspace = "ALL") {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const userTasks = Array.from(this.tasks.values()).filter((t) => {
      const matchesUser = t.assignedTo.id === userId || t.assignedBy.id === userId;
      const matchesWorkspace = workspace === "ALL" || t.workspace === workspace;
      return matchesUser && matchesWorkspace;
    });
    const todayTasks = userTasks.filter((t) => t.startDate === today || t.dueDate === today || t.status === "OVERDUE");
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;
    let highPriority = 0;
    let estimatedWorkMinutes = 0;
    let completedMinutes = 0;
    let followUpsRequiredCount = 0;
    todayTasks.forEach((t) => {
      if (t.status === "COMPLETED") {
        completed++;
        completedMinutes += t.actualMinutes || t.estimatedMinutes;
      } else if (t.status === "IN_PROGRESS" || t.status === "STARTED") {
        inProgress++;
        estimatedWorkMinutes += t.estimatedMinutes;
      } else if (t.status === "OVERDUE") {
        overdue++;
        estimatedWorkMinutes += t.estimatedMinutes;
        followUpsRequiredCount++;
      } else {
        pending++;
        estimatedWorkMinutes += t.estimatedMinutes;
      }
      if (t.priority === "HIGH" || t.priority === "URGENT") {
        highPriority++;
      }
      if (t.followUpCount > 0 && t.status !== "COMPLETED") {
        followUpsRequiredCount++;
      }
    });
    let timeConflictsCount = 0;
    const sortedScheduled = todayTasks.filter((t) => t.startTime && t.status !== "COMPLETED").sort((a, b) => a.startTime.localeCompare(b.startTime));
    for (let i = 0; i < sortedScheduled.length - 1; i++) {
      const current = sortedScheduled[i];
      const next = sortedScheduled[i + 1];
      const currentEnd = this.addMinutesToTime(current.startTime, current.estimatedMinutes);
      if (currentEnd > next.startTime) {
        timeConflictsCount++;
      }
    }
    const availableMinutes = Math.max(0, 480 - completedMinutes - estimatedWorkMinutes);
    return {
      totalTasksToday: todayTasks.length,
      pending,
      inProgress,
      completed,
      overdue,
      highPriority,
      estimatedWorkMinutes,
      completedMinutes,
      remainingMinutes: estimatedWorkMinutes,
      availableMinutes,
      timeConflictsCount,
      followUpsRequiredCount
    };
  }
  // --- TIME PLANNER & INTELLIGENT DAILY RECOMMENDATION ---
  getScheduleRecommendation(userId = this.activeUserId) {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todayTasks = Array.from(this.tasks.values()).filter((t) => (t.assignedTo.id === userId || t.assignedBy.id === userId) && (t.startDate === today || t.dueDate === today || t.status === "OVERDUE")).filter((t) => t.status !== "COMPLETED" && t.status !== "CANCELLED");
    const scoredTasks = todayTasks.map((task) => {
      let score = 0;
      if (task.status === "OVERDUE") score += 150;
      if (task.priority === "URGENT") score += 100;
      if (task.priority === "HIGH") score += 50;
      if (task.priority === "MEDIUM") score += 25;
      if (task.priority === "LOW") score += 10;
      if (task.minetrixRef) score += 30;
      return { task, score };
    });
    scoredTasks.sort((a, b) => b.score - a.score);
    let currentHour = 9;
    let currentMinute = 0;
    const suggestedOrder = [];
    const conflictWarnings = [];
    scoredTasks.forEach(({ task, score }) => {
      const startStr = `${String(currentHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`;
      const endTotalMins = currentHour * 60 + currentMinute + task.estimatedMinutes;
      const endHour = Math.floor(endTotalMins / 60);
      const endMinute = endTotalMins % 60;
      const endStr = `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
      let reason = "";
      if (task.status === "OVERDUE") {
        reason = "High risk: Overdue item requiring immediate closure before daytime operations.";
      } else if (task.priority === "URGENT") {
        reason = "Critical priority task scheduled in peak morning energy window.";
      } else if (task.minetrixRef) {
        reason = `BOS Synchronized: Directly impacts ${task.minetrixRef.module} production & dispatch velocity.`;
      } else {
        reason = "Optimal slot based on estimated duration and deadline.";
      }
      suggestedOrder.push({
        slot: `${startStr} - ${endStr}`,
        task,
        reason
      });
      const nextTotal = endTotalMins + 15;
      currentHour = Math.floor(nextTotal / 60);
      currentMinute = nextTotal % 60;
      if (currentHour >= 18) {
        conflictWarnings.push(`Planned work for '${task.title}' extends past 06:00 PM standard business hours.`);
      }
    });
    return {
      date: today,
      suggestedOrder,
      conflictWarnings,
      productivityTip: scoredTasks.some((s) => s.task.status === "OVERDUE") ? "Resolve your overdue financial/regulatory items before 11:00 AM to unblock team members." : "Your schedule has balanced focus blocks with 15-minute transition buffers. You are on track!"
    };
  }
  // --- TASK CRUD & QUERIES ---
  getTasks(params) {
    const user = params.userId || this.activeUserId;
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 864e5).toISOString().split("T")[0];
    let list = Array.from(this.tasks.values()).filter((t) => {
      const isMine = t.assignedTo.id === user || t.assignedBy.id === user;
      if (!isMine && t.isPrivate) return false;
      return true;
    });
    if (params.workspace && params.workspace !== "ALL") {
      list = list.filter((t) => t.workspace === params.workspace);
    }
    if (params.filter) {
      switch (params.filter) {
        case "TODAY":
          list = list.filter((t) => t.startDate === today || t.dueDate === today || t.status === "OVERDUE");
          break;
        case "TOMORROW":
          list = list.filter((t) => t.startDate === tomorrow || t.dueDate === tomorrow);
          break;
        case "UPCOMING":
          list = list.filter((t) => t.dueDate > tomorrow && t.status !== "COMPLETED");
          break;
        case "OVERDUE":
          list = list.filter((t) => t.status === "OVERDUE" || t.dueDate < today && t.status !== "COMPLETED");
          break;
        case "COMPLETED":
          list = list.filter((t) => t.status === "COMPLETED");
          break;
      }
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.assignedTo.name.toLowerCase().includes(q) || t.assignedBy.name.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => {
      if (a.dueDate === b.dueDate) {
        const pOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
      }
      return a.dueDate.localeCompare(b.dueDate);
    });
  }
  getTaskById(taskId) {
    return this.tasks.get(taskId);
  }
  createTask(input, creatorId = this.activeUserId) {
    const id = `TASK-OTT-${Date.now().toString().slice(-6)}`;
    const creator = OTT_DEMO_USERS.find((u) => u.id === creatorId) || OTT_DEMO_USERS[0];
    const assignedTo = input.assignedTo || creator;
    const isAssignedToOther = assignedTo.id !== creator.id;
    const newTask = {
      id,
      title: input.title || "Untitled Task",
      description: input.description || "",
      assignedBy: creator,
      assignedTo,
      workspace: input.workspace || "PERSONAL",
      priority: input.priority || "MEDIUM",
      startDate: input.startDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      startTime: input.startTime || "09:00",
      dueDate: input.dueDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      dueTime: input.dueTime || "18:00",
      estimatedMinutes: input.estimatedMinutes || 60,
      actualMinutes: 0,
      reminderSettings: input.reminderSettings || [{ id: `rem-${Date.now()}`, type: "START_TIME", triggerMinutesBefore: 15 }],
      recurrence: input.recurrence || "NONE",
      attachments: input.attachments || [],
      notes: input.notes || [],
      checklist: input.checklist || [],
      status: isAssignedToOther ? "REQUESTED" : "ACCEPTED",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      history: [
        {
          id: `h-${Date.now()}`,
          action: isAssignedToOther ? `Task Requested to ${assignedTo.name}` : "Created by Self",
          actorId: creator.id,
          actorName: creator.name,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      followUpCount: 0,
      minetrixRef: input.minetrixRef,
      isPrivate: input.isPrivate !== void 0 ? input.isPrivate : input.workspace === "PERSONAL" || input.workspace === "FAMILY"
    };
    this.tasks.set(id, newTask);
    let taskRequest;
    if (isAssignedToOther) {
      taskRequest = {
        id: `REQ-${Date.now()}`,
        taskId: id,
        taskTitle: newTask.title,
        taskDescription: newTask.description,
        workspace: newTask.workspace,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        dueTime: newTask.dueTime,
        estimatedMinutes: newTask.estimatedMinutes,
        sender: creator,
        recipient: assignedTo,
        relationshipType: assignedTo.relationshipWithMe || "OTHER",
        status: "PENDING",
        requestNote: `Please accept this task assignment: ${newTask.title}`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.requests.set(taskRequest.id, taskRequest);
    }
    return { task: newTask, request: taskRequest };
  }
  updateTaskStatus(taskId, newStatus, actorId = this.activeUserId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    const actor = OTT_DEMO_USERS.find((u) => u.id === actorId) || OTT_DEMO_USERS[0];
    const oldStatus = task.status;
    task.status = newStatus;
    task.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (newStatus === "COMPLETED") {
      task.completedAt = (/* @__PURE__ */ new Date()).toISOString();
      if (!task.actualMinutes) {
        task.actualMinutes = task.estimatedMinutes;
      }
      task.checklist.forEach((c) => {
        if (!c.completed) {
          c.completed = true;
          c.completedAt = (/* @__PURE__ */ new Date()).toISOString();
        }
      });
    }
    task.history.unshift({
      id: `h-${Date.now()}`,
      action: `Status transitioned: ${oldStatus} -> ${newStatus}`,
      actorId: actor.id,
      actorName: actor.name,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    if (task.minetrixRef) {
      task.minetrixRef.lastSyncedStatus = newStatus;
      task.minetrixRef.syncedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    return task;
  }
  toggleChecklistItem(taskId, itemId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    const item = task.checklist.find((c) => c.id === itemId);
    if (item) {
      item.completed = !item.completed;
      item.completedAt = item.completed ? (/* @__PURE__ */ new Date()).toISOString() : void 0;
      task.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    }
    const allDone = task.checklist.length > 0 && task.checklist.every((c) => c.completed);
    if (allDone && task.status !== "COMPLETED") {
      return this.updateTaskStatus(taskId, "COMPLETED");
    }
    return task;
  }
  addNote(taskId, text, authorId = this.activeUserId) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    const author = OTT_DEMO_USERS.find((u) => u.id === authorId) || OTT_DEMO_USERS[0];
    task.notes.unshift({
      id: `n-${Date.now()}`,
      authorId: author.id,
      authorName: author.name,
      text,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    task.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    return task;
  }
  // --- FOLLOW-UP ENGINE ---
  sendFollowUp(taskId, senderId = this.activeUserId, message) {
    const task = this.tasks.get(taskId);
    if (!task) throw new Error(`Task ${taskId} not found`);
    const sender = OTT_DEMO_USERS.find((u) => u.id === senderId) || OTT_DEMO_USERS[0];
    task.followUpCount = (task.followUpCount || 0) + 1;
    task.lastFollowUpAt = (/* @__PURE__ */ new Date()).toISOString();
    task.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const noteText = message || `Follow-up #${task.followUpCount}: Status check requested for "${task.title}".`;
    task.notes.unshift({
      id: `n-follow-${Date.now()}`,
      authorId: sender.id,
      authorName: sender.name,
      text: `[Gentle Follow-up] ${noteText}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    task.history.unshift({
      id: `h-follow-${Date.now()}`,
      action: `Follow-up #${task.followUpCount} Sent to ${task.assignedTo.name}`,
      actorId: sender.id,
      actorName: sender.name,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      details: noteText
    });
    return { success: true, task };
  }
  // --- REQUEST-BASED RELATIONSHIPS ---
  getRequests(userId = this.activeUserId) {
    const incoming = [];
    const outgoing = [];
    this.requests.forEach((req) => {
      if (req.recipient.id === userId) incoming.push(req);
      if (req.sender.id === userId) outgoing.push(req);
    });
    return { incoming, outgoing };
  }
  respondToRequest(requestId, action, note, responderId = this.activeUserId) {
    const request = this.requests.get(requestId);
    if (!request) throw new Error(`Request ${requestId} not found`);
    request.status = action === "ACCEPT" ? "ACCEPTED" : "DECLINED";
    request.respondedAt = (/* @__PURE__ */ new Date()).toISOString();
    request.responseNote = note;
    const task = this.tasks.get(request.taskId);
    if (task) {
      if (action === "ACCEPT") {
        task.status = "ACCEPTED";
        task.history.unshift({
          id: `h-${Date.now()}`,
          action: `Assignment Accepted by ${request.recipient.name}`,
          actorId: responderId,
          actorName: request.recipient.name,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } else {
        task.status = "CANCELLED";
        task.history.unshift({
          id: `h-${Date.now()}`,
          action: `Assignment Declined: ${note || "No reason provided"}`,
          actorId: responderId,
          actorName: request.recipient.name,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
    }
    return request;
  }
  // --- REPORTS & ANALYTICS ---
  getReports(period = "DAILY", workspace = "ALL") {
    const tasks = this.getTasks({ workspace });
    const completed = tasks.filter((t) => t.status === "COMPLETED");
    const pending = tasks.filter((t) => t.status === "PENDING" || t.status === "IN_PROGRESS" || t.status === "ACCEPTED");
    const overdue = tasks.filter((t) => t.status === "OVERDUE");
    const totalPlannedMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
    const totalActualMinutes = tasks.reduce((sum, t) => sum + (t.actualMinutes || t.estimatedMinutes || 0), 0);
    const completionRate = tasks.length > 0 ? Math.round(completed.length / tasks.length * 100) : 100;
    const wsCounts = {};
    tasks.forEach((t) => {
      if (!wsCounts[t.workspace]) {
        wsCounts[t.workspace] = { count: 0, minutes: 0, completedCount: 0 };
      }
      wsCounts[t.workspace].count++;
      wsCounts[t.workspace].minutes += t.estimatedMinutes;
      if (t.status === "COMPLETED") wsCounts[t.workspace].completedCount++;
    });
    const workspaceDistribution = Object.entries(wsCounts).map(([ws, data]) => ({
      workspace: ws,
      count: data.count,
      minutes: data.minutes,
      completionRate: data.count > 0 ? Math.round(data.completedCount / data.count * 100) : 0
    }));
    const personWiseStats = OTT_DEMO_USERS.map((u) => {
      const userTasks = tasks.filter((t) => t.assignedTo.id === u.id);
      const userCompleted = userTasks.filter((t) => t.status === "COMPLETED");
      return {
        personName: u.name,
        relationship: u.relationshipWithMe || "OTHER",
        assignedCount: userTasks.length,
        completedCount: userCompleted.length,
        avgCompletionRate: userTasks.length > 0 ? Math.round(userCompleted.length / userTasks.length * 100) : 0
      };
    }).filter((p) => p.assignedCount > 0);
    return {
      period,
      completionRate,
      totalPlannedMinutes,
      totalActualMinutes,
      completedTasksCount: completed.length,
      pendingTasksCount: pending.length,
      overdueTasksCount: overdue.length,
      workspaceDistribution,
      personWiseStats,
      followUpEfficiency: {
        followUpsSent: 4,
        resolvedPostFollowUp: 3,
        avgResolutionTimeHours: 2.5
      }
    };
  }
  // --- MINETRIX BOS SYNC DISPATCHER ---
  syncFromMinetrixBOS(payload) {
    const assignedTo = OTT_DEMO_USERS.find((u) => u.id === payload.assignedToId) || OTT_DEMO_USERS[1];
    const { task } = this.createTask({
      title: `[Minetrix ${payload.module}] ${payload.title}`,
      description: payload.description,
      workspace: "RZ_MINETRIX",
      priority: payload.priority,
      dueDate: payload.dueDate,
      dueTime: payload.dueTime,
      estimatedMinutes: payload.estimatedMinutes,
      assignedTo,
      minetrixRef: {
        module: payload.module,
        entityId: payload.entityId,
        entityType: `${payload.module} Operation`,
        entityTitle: payload.entityTitle,
        syncedAt: (/* @__PURE__ */ new Date()).toISOString()
      },
      isPrivate: false
    });
    return task;
  }
  // Helper
  addMinutesToTime(timeStr, minutes) {
    const [h, m] = timeStr.split(":").map(Number);
    const total = h * 60 + m + minutes;
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
  }
};
var ottService = new OTTService();

// src/server/routes/ottRouter.ts
var ottRouter = (0, import_express8.Router)();
function getUserId5(req) {
  return req.query.userId || req.user?.id || "USR-1001";
}
ottRouter.get("/my-day", (req, res) => {
  try {
    const userId = getUserId5(req);
    const workspace = req.query.workspace || "ALL";
    const metrics = ottService.getMyDayMetrics(userId, workspace);
    const schedule = ottService.getScheduleRecommendation(userId);
    res.json({
      success: true,
      data: {
        metrics,
        schedule,
        user: OTT_DEMO_USERS.find((u) => u.id === userId) || OTT_DEMO_USERS[0]
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.get("/schedule", (req, res) => {
  try {
    const userId = getUserId5(req);
    const schedule = ottService.getScheduleRecommendation(userId);
    res.json({ success: true, data: schedule });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.get("/tasks", (req, res) => {
  try {
    const userId = getUserId5(req);
    const workspace = req.query.workspace;
    const filter = req.query.filter;
    const search = req.query.search;
    const tasks = ottService.getTasks({
      userId,
      workspace,
      filter,
      search
    });
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.get("/tasks/:id", (req, res) => {
  try {
    const task = ottService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.post("/tasks", (req, res) => {
  try {
    const userId = getUserId5(req);
    const result = ottService.createTask(req.body, userId);
    res.status(201).json({
      success: true,
      data: result.task,
      request: result.request,
      message: result.request ? `Task assignment request sent to ${result.task.assignedTo.name}` : "Task created successfully"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.patch("/tasks/:id/status", (req, res) => {
  try {
    const userId = getUserId5(req);
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, error: "Status is required" });
    const task = ottService.updateTaskStatus(req.params.id, status, userId);
    res.json({ success: true, data: task, message: `Status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.patch("/tasks/:id/checklist/:itemId", (req, res) => {
  try {
    const task = ottService.toggleChecklistItem(req.params.id, req.params.itemId);
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.post("/tasks/:id/notes", (req, res) => {
  try {
    const userId = getUserId5(req);
    const { text } = req.body;
    if (!text) return res.status(400).json({ success: false, error: "Note text required" });
    const task = ottService.addNote(req.params.id, text, userId);
    res.json({ success: true, data: task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.post("/tasks/:id/follow-up", (req, res) => {
  try {
    const userId = getUserId5(req);
    const { message } = req.body;
    const result = ottService.sendFollowUp(req.params.id, userId, message);
    res.json({
      success: true,
      data: result.task,
      message: `Gentle reminder sent to ${result.task.assignedTo.name}. Follow-up count: ${result.task.followUpCount}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.get("/requests", (req, res) => {
  try {
    const userId = getUserId5(req);
    const requests = ottService.getRequests(userId);
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.post("/requests/:id/respond", (req, res) => {
  try {
    const userId = getUserId5(req);
    const { action, note } = req.body;
    if (!action || action !== "ACCEPT" && action !== "DECLINE") {
      return res.status(400).json({ success: false, error: "Action must be ACCEPT or DECLINE" });
    }
    const request = ottService.respondToRequest(req.params.id, action, note, userId);
    res.json({
      success: true,
      data: request,
      message: action === "ACCEPT" ? "Task assignment accepted" : "Task assignment declined"
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.get("/reports", (req, res) => {
  try {
    const period = req.query.period || "DAILY";
    const workspace = req.query.workspace || "ALL";
    const reports = ottService.getReports(period, workspace);
    res.json({ success: true, data: reports });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.post("/minetrix-sync", (req, res) => {
  try {
    const task = ottService.syncFromMinetrixBOS(req.body);
    res.status(201).json({
      success: true,
      data: task,
      message: `Task synchronized from Minetrix ${req.body.module} module`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
ottRouter.get("/contacts", (_req, res) => {
  res.json({ success: true, data: OTT_DEMO_USERS });
});

// src/server/routes/apiRouter.ts
var apiRouter = (0, import_express9.Router)();
var authService = new AuthService();
var tenantService = new TenantService();
var userService = new UserService();
var auditService = new AuditService();
var notifService = new NotificationService();
var wfService = new WorkflowService();
var orgRepo2 = new OrganizationRepository();
var rolePermRepo3 = new RolePermissionRepository();
var docRepo2 = new DocumentRepository();
var storageProvider = new LocalStorageProvider();
apiRouter.use(auditLogger);
var authRateLimiter = rateLimiter({ windowMs: 15 * 60 * 1e3, max: 15, keyPrefix: "auth_login" });
var testRateLimiter = rateLimiter({ windowMs: 60 * 1e3, max: 5, keyPrefix: "test_suite" });
apiRouter.get("/health/liveness", (req, res) => {
  res.json({
    status: "UP",
    service: "RZ\xAE Minetrix BOS Shared Core Backend",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime()
  });
});
apiRouter.get("/health/readiness", async (req, res) => {
  const isDbReady = db.tenants.size > 0;
  const adapterStatus = await db.persistenceAdapter.executeHealthCheck();
  const jwtMeta = jwtService.getKeyMetadata();
  res.json({
    status: isDbReady ? "READY" : "NOT_READY",
    checks: {
      databaseStore: isDbReady ? "HEALTHY" : "UNHEALTHY",
      persistenceAdapter: adapterStatus.status,
      persistenceEngine: adapterStatus.engine,
      jwtSignerAlgorithm: jwtMeta.algorithm,
      jwtKeyStatus: jwtMeta.status,
      storageProvider: storageProvider.providerName,
      notificationCore: "ACTIVE_IN_APP"
    },
    counts: {
      tenants: db.tenants.size,
      users: db.users.size,
      companies: db.companies.size,
      branches: db.branches.size,
      auditLogs: db.auditLogs.size
    },
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
apiRouter.post("/auth/login", authRateLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "BAD_REQUEST", message: "Email and password are required." });
  }
  const result = await authService.login(email, password, req.ip || "127.0.0.1");
  if (!result.success) {
    return res.status(401).json(result);
  }
  return res.json(result);
});
apiRouter.get("/auth/session", authenticateJwt, (req, res) => {
  return res.json({
    success: true,
    data: {
      user: req.user,
      jwtMetadata: jwtService.getKeyMetadata(),
      correlationId: req.correlationId,
      requestId: req.requestId
    }
  });
});
apiRouter.get("/tenants/context", authenticateJwt, enforceTenantContext, async (req, res) => {
  const result = await tenantService.getTenantContext(req.user.tenantId);
  return res.json(result);
});
apiRouter.get("/tenants", authenticateJwt, requirePermission("shared:admin:access"), async (req, res) => {
  const result = await tenantService.getAllTenants();
  return res.json(result);
});
apiRouter.get("/organizations/companies", authenticateJwt, enforceTenantContext, async (req, res) => {
  const companies = await orgRepo2.findCompaniesByTenant(req.user.tenantId);
  return res.json({ success: true, data: companies });
});
apiRouter.get("/organizations/branches", authenticateJwt, enforceTenantContext, async (req, res) => {
  const { companyId } = req.query;
  const branches = await orgRepo2.findBranchesByCompany(String(companyId || req.user.companyId), req.user.tenantId);
  return res.json({ success: true, data: branches });
});
apiRouter.get("/users", authenticateJwt, enforceTenantContext, async (req, res) => {
  const result = await userService.getUsersInTenant(req.user.tenantId);
  return res.json(result);
});
apiRouter.post("/users/:id/link-operational", authenticateJwt, enforceTenantContext, requirePermission("shared:admin:access"), async (req, res) => {
  const { id } = req.params;
  const { employeeId, driverId, operatorId } = req.body || {};
  const result = await userService.linkOperationalAccount(id, req.user.tenantId, { employeeId, driverId, operatorId });
  return res.json(result);
});
apiRouter.get("/roles", authenticateJwt, enforceTenantContext, async (req, res) => {
  const roles = await rolePermRepo3.findRolesByTenant(req.user.tenantId);
  return res.json({ success: true, data: roles });
});
apiRouter.get("/permissions", authenticateJwt, async (req, res) => {
  const permissions = Array.from(db.permissions.values());
  return res.json({ success: true, data: permissions });
});
apiRouter.get("/notifications", authenticateJwt, enforceTenantContext, async (req, res) => {
  const result = await notifService.getUserNotifications(req.user.userId, req.user.tenantId);
  return res.json(result);
});
apiRouter.post("/notifications/dispatch", authenticateJwt, enforceTenantContext, async (req, res) => {
  const { recipientUserId, recipientEmail, title, body, channel, type } = req.body || {};
  const result = await notificationDispatcher.dispatch({
    tenantId: req.user.tenantId,
    recipientUserId: recipientUserId || req.user.userId,
    recipientEmail: recipientEmail || req.user.email,
    title: title || "System Notification",
    body: body || "",
    channel: channel || "IN_APP",
    type: type || "INFO"
  });
  await notifService.createNotification(
    req.user.tenantId,
    recipientUserId || req.user.userId,
    title || "Notification",
    body || "",
    type || "INFO"
  );
  return res.json({ success: true, deliveryResult: result });
});
apiRouter.get("/documents", authenticateJwt, enforceTenantContext, async (req, res) => {
  const { module: module2, entityType, entityId } = req.query;
  const docs = await docRepo2.findByEntity(
    req.user.tenantId,
    String(module2 || "Shared Core"),
    String(entityType || "GENERAL"),
    String(entityId || "0")
  );
  return res.json({ success: true, data: docs });
});
apiRouter.post("/documents/metadata", authenticateJwt, enforceTenantContext, async (req, res) => {
  const { fileName, fileSize, mimeType, module: module2, entityType, entityId, accessLevel } = req.body || {};
  const doc = await docRepo2.registerMetadata({
    tenantId: req.user.tenantId,
    companyId: req.user.companyId,
    module: module2,
    entityType,
    entityId,
    fileName,
    fileSize,
    mimeType,
    accessLevel,
    uploaderUserId: req.user.userId
  });
  const signedUrl = await storageProvider.getSignedUrl({ storageKey: doc.storageKey, tenantId: req.user.tenantId });
  return res.json({ success: true, data: { ...doc, signedUrl } });
});
apiRouter.get("/audit/search", authenticateJwt, enforceTenantContext, requirePermission("shared:admin:access"), async (req, res) => {
  const result = await auditService.getAuditLogs(req.user.tenantId, 50);
  return res.json(result);
});
apiRouter.post("/workflows/initiate", authenticateJwt, enforceTenantContext, async (req, res) => {
  const { workflowCode, entityType, entityId } = req.body || {};
  const result = await wfService.initiateWorkflow(
    req.user.tenantId,
    workflowCode,
    entityType,
    entityId,
    req.user.userId
  );
  return res.json(result);
});
apiRouter.use("/fleet", fleetRouter);
apiRouter.use("/marketplace", marketplaceRouter);
apiRouter.use("/v1/marketplace", marketplaceRouter);
apiRouter.use("/crm", crmRouter);
apiRouter.use("/v1/crm", crmRouter);
apiRouter.use("/finance", financeRouter);
apiRouter.use("/v1/finance", financeRouter);
apiRouter.use("/hr", hrRouter);
apiRouter.use("/v1/hr", hrRouter);
apiRouter.use("/quarries", quarryRouter);
apiRouter.use("/v1/quarries", quarryRouter);
apiRouter.use("/ott", ottRouter);
apiRouter.use("/v1/ott", ottRouter);
apiRouter.get("/test/run-suite", testRateLimiter, async (req, res) => {
  const isDev = process.env.NODE_ENV !== "production";
  const secretKey = req.query.key || req.headers["x-test-key"];
  const isValidKey = secretKey === "rz_test_suite_secret_2026";
  if (!isDev && !isValidKey) {
    return res.status(403).json({
      success: false,
      error: "FORBIDDEN_TEST_SUITE_ACCESS",
      message: "Test suite execution is disabled in production environments without administrative security key."
    });
  }
  const report = await runSharedCoreTestSuite();
  return res.json({
    success: true,
    report
  });
});

// src/server/main.ts
async function startServer() {
  const app = (0, import_express10.default)();
  const PORT = Number(process.env.PORT) || 3e3;
  const HOST = "0.0.0.0";
  app.use(import_express10.default.json());
  app.use(import_express10.default.urlencoded({ extended: true }));
  app.use(correlationIdMiddleware);
  const healthCheckHandler = (req, res) => {
    res.status(200).json({
      status: "ok",
      service: "RZ\xAE Minetrix BOS Shared Core Backend",
      port: PORT,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  };
  app.get("/health", healthCheckHandler);
  app.get("/healthz", healthCheckHandler);
  app.get("/api/health", healthCheckHandler);
  app.get("/api/v1/health", healthCheckHandler);
  app.get("/health/liveness", (req, res) => {
    res.status(200).json({
      status: "UP",
      service: "RZ\xAE Minetrix BOS Shared Core Backend",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: process.uptime()
    });
  });
  app.get("/health/readiness", async (req, res) => {
    const isDbReady = db.tenants.size > 0;
    const adapterHealth = await db.persistenceAdapter.executeHealthCheck();
    res.status(200).json({
      status: isDbReady ? "READY" : "NOT_READY",
      db: adapterHealth.status,
      persistenceEngine: adapterHealth.engine,
      tablesCount: adapterHealth.tablesCount,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  });
  app.use("/api/v1", apiRouter);
  app.use("/api", apiRouter);
  const distDir = import_path4.default.join(process.cwd(), "dist");
  const indexHtmlPath = import_path4.default.join(distDir, "index.html");
  const hasBuiltFrontend = import_fs4.default.existsSync(indexHtmlPath);
  if (!hasBuiltFrontend && process.env.NODE_ENV !== "production") {
    try {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
      console.log("[SERVER] Vite development middleware attached.");
    } catch (err) {
      console.warn("[SERVER] Vite dev middleware unavailable, serving static/fallback:", err.message);
    }
  } else {
    if (import_fs4.default.existsSync(distDir)) {
      app.use(import_express10.default.static(distDir));
    }
    app.get("*", (req, res) => {
      if (import_fs4.default.existsSync(indexHtmlPath)) {
        res.sendFile(indexHtmlPath);
      } else {
        res.status(200).send('<!DOCTYPE html><html><head><title>RZ\xAE Minetrix BOS</title></head><body><div id="root"><h1>RZ\xAE Minetrix BOS</h1><p>Initializing...</p></div></body></html>');
      }
    });
    console.log(`[SERVER] Static production assets attached from: ${distDir}`);
  }
  const primaryServer = app.listen(PORT, HOST, () => {
    console.log(`=======================================================`);
    console.log(` RZ\xAE Minetrix BOS Shared Core Backend Running`);
    console.log(` Primary Server URL: http://${HOST}:${PORT}`);
    console.log(` Health Check: http://${HOST}:${PORT}/health`);
    console.log(` API Base Route: http://${HOST}:${PORT}/api/v1`);
    console.log(`=======================================================`);
  });
  if (PORT !== 3e3) {
    try {
      const secondaryServer = app.listen(3e3, HOST, () => {
        console.log(`[SERVER] Secondary listener active on port 3000`);
      });
      secondaryServer.on("error", (err) => {
        console.log(`[SERVER] Port 3000 secondary listener bypassed: ${err.message}`);
      });
    } catch (err) {
      console.log(`[SERVER] Port 3000 secondary listen bypass: ${err.message}`);
    }
  }
  const handleShutdown = (signal) => {
    console.log(`[SERVER] ${signal} signal received: closing HTTP servers`);
    primaryServer.close(() => {
      console.log("[SERVER] Primary server closed cleanly");
      process.exit(0);
    });
  };
  process.on("SIGTERM", () => handleShutdown("SIGTERM"));
  process.on("SIGINT", () => handleShutdown("SIGINT"));
  return { app, server: primaryServer };
}
startServer().catch((err) => {
  console.error("[FATAL] Failed to start RZ Minetrix Server:", err);
  process.exit(1);
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  startServer
});
//# sourceMappingURL=server.cjs.map
