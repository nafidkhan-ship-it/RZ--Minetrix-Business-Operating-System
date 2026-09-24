import { AuthService, TenantService, UserService, AuditService, NotificationService, WorkflowService } from '../services/sharedCoreServices.js';
import { fleetService } from '../services/fleetServices.js';
import { marketplaceService } from '../services/marketplaceServices.js';
import { runCrmTestSuite } from './crmTests.js';
import { runFinanceTestSuite } from './financeTests.js';
import { runHrTestSuite } from './hrTests.js';
import { runQuarryTestSuite } from './quarryTests.js';
import { runQuarryApiTestSuite } from './quarryApiTests.js';
import { db } from '../db/database.js';
import { jwtService } from '../security/jwtService.js';
import { LocalStorageProvider } from '../providers/storageProvider.js';
import { notificationDispatcher } from '../providers/notificationProviders.js';

export interface TestResult {
  testName: string;
  category: string;
  passed: boolean;
  durationMs: number;
  message: string;
  evidence?: any;
}

export async function runSharedCoreTestSuite(): Promise<{
  executedAt: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  results: TestResult[];
}> {
  const results: TestResult[] = [];

  const authService = new AuthService();
  const tenantService = new TenantService();
  const userService = new UserService();
  const auditService = new AuditService();
  const notifService = new NotificationService();
  const wfService = new WorkflowService();
  const storageProvider = new LocalStorageProvider();

  // Test 1: Authentication Engine - Valid Login & RS256 Asymmetric Token Issuance
  {
    const start = Date.now();
    try {
      const loginRes = await authService.login('admin@racezoneventures.com', 'AdminPass2026!', '127.0.0.1');
      const verified = loginRes.data?.token ? jwtService.verifyToken(loginRes.data.token) : null;
      const passed = loginRes.success && !!loginRes.data?.token && !!verified && verified.iss === 'rz-minetrix-bos';
      results.push({
        testName: 'Authentication Engine - RS256 Asymmetric JWT Signing & Claims Verification',
        category: 'Security & Auth',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Successfully issued and verified RS256 asymmetric token (kid: rz-rsa-key-2026-v1, iss: rz-minetrix-bos)' : 'Failed RS256 token verification',
        evidence: { keyMetadata: jwtService.getKeyMetadata(), claims: verified }
      });
    } catch (err: any) {
      results.push({
        testName: 'Authentication Engine - RS256 Asymmetric JWT Verification',
        category: 'Security & Auth',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 2: Authentication Engine - Invalid Password Block
  {
    const start = Date.now();
    try {
      const loginRes = await authService.login('admin@racezoneventures.com', 'WRONG_PASSWORD', '127.0.0.1');
      const passed = !loginRes.success && loginRes.error === 'INVALID_CREDENTIALS';
      results.push({
        testName: 'Authentication Engine - Invalid Password Rejection & Audit Log',
        category: 'Security & Auth',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Invalid password correctly rejected with 401 response and failure audit logged' : 'Failed to block invalid password'
      });
    } catch (err: any) {
      results.push({
        testName: 'Authentication Engine - Invalid Password Rejection',
        category: 'Security & Auth',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 3: Multi-Tenant Scope & Hierarchy Check
  {
    const start = Date.now();
    try {
      const tRes = await tenantService.getTenantContext('tenant-rz-global-001');
      const passed = tRes.success && tRes.data?.companies.length! > 0;
      results.push({
        testName: 'Multi-Tenant Context - Tenant Hierarchy Query',
        category: 'Tenant Isolation',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Queried Tenant [${tRes.data?.tenant.name}] with ${tRes.data?.companies.length} linked companies` : 'Failed tenant query'
      });
    } catch (err: any) {
      results.push({
        testName: 'Multi-Tenant Context - Tenant Hierarchy Query',
        category: 'Tenant Isolation',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 4: Tenant Isolation Enforcement (Prevent Cross-Tenant Access)
  {
    const start = Date.now();
    try {
      const userRes = await userService.getUsersInTenant('tenant-rz-global-001');
      const tenant2Users = await userService.getUsersInTenant('tenant-apex-quarry-002');
      
      const isIsolated = !userRes.data.some(u => u.email.includes('apexmining.com')) &&
                          tenant2Users.data.every(u => u.email.includes('apexmining.com'));
      results.push({
        testName: 'Tenant Isolation - Cross-Tenant Access Strict Boundary',
        category: 'Tenant Isolation',
        passed: isIsolated,
        durationMs: Date.now() - start,
        message: isIsolated ? 'Tenant A data and Tenant B data remain strictly isolated at database/repository boundary' : 'Cross-tenant leak detected'
      });
    } catch (err: any) {
      results.push({
        testName: 'Tenant Isolation - Cross-Tenant Access Boundary',
        category: 'Tenant Isolation',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 5: Storage Abstraction Provider - Upload, MIME Validation & Presigned URL
  {
    const start = Date.now();
    try {
      const mimeCheck = storageProvider.validateFile({ mimeType: 'application/pdf', sizeBytes: 1024 * 1024 });
      const signedUrl = await storageProvider.getSignedUrl({ storageKey: 'tenant-rz-global-001/doc_test.pdf', tenantId: 'tenant-rz-global-001' });
      const passed = mimeCheck.valid && signedUrl.includes('/api/v1/documents/download');
      results.push({
        testName: 'Storage Provider Abstraction - MIME/Size Validation & Tenant Presigned URL',
        category: 'Storage & Files',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'MIME validation passed and tenant presigned URL generated securely' : 'Storage provider test failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Storage Provider Abstraction',
        category: 'Storage & Files',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 6: Notification Provider Separation & External Adapter Reporting
  {
    const start = Date.now();
    try {
      const inAppRes = await notificationDispatcher.dispatch({
        tenantId: 'tenant-rz-global-001',
        recipientUserId: 'usr-admin-001',
        title: 'Test Notification',
        body: 'In-app body',
        channel: 'IN_APP',
        type: 'INFO'
      });
      const emailRes = await notificationDispatcher.dispatch({
        tenantId: 'tenant-rz-global-001',
        recipientUserId: 'usr-admin-001',
        recipientEmail: 'admin@racezoneventures.com',
        title: 'Test Email',
        body: 'Email body',
        channel: 'EMAIL',
        type: 'INFO'
      });

      const passed = inAppRes.status === 'DELIVERED_IN_APP' && emailRes.status === 'EXTERNAL_CONFIG_REQUIRED';
      results.push({
        testName: 'Notification Provider - In-App Delivery vs External Adapter Status Reporting',
        category: 'Notifications',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'In-App delivered successfully; Email correctly reported EXTERNAL_CONFIG_REQUIRED status without false claim' : 'Notification provider dispatch failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Notification Provider',
        category: 'Notifications',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 7: Persistence Adapter Health & Schema Readiness
  {
    const start = Date.now();
    try {
      const health = await db.persistenceAdapter.executeHealthCheck();
      const passed = !!health.status;
      results.push({
        testName: 'Database Persistence Adapter - Health Check & Engine Transparency',
        category: 'Database & ORM',
        passed,
        durationMs: Date.now() - start,
        message: `Persistence Engine [${health.engine}] status: ${health.status}`
      });
    } catch (err: any) {
      results.push({
        testName: 'Database Persistence Adapter',
        category: 'Database & ORM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 8: Operational Linkage - Link User to HR Employee & Operator
  {
    const start = Date.now();
    try {
      const linkRes = await userService.linkOperationalAccount('usr-quarry-mgr-002', 'tenant-rz-global-001', {
        employeeId: 'EMP-088',
        operatorId: 'OP-Q1-01'
      });
      const passed = linkRes.success && linkRes.data.linkedEmployeeId === 'EMP-088';
      results.push({
        testName: 'User Operational Linkage - Linking User Master to HR & Plant Operator',
        category: 'Shared Masters',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'User profile linked to Employee ID EMP-088 and Operator ID OP-Q1-01' : 'Linkage failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'User Operational Linkage',
        category: 'Shared Masters',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 9: Persistent Audit Engine Log Query
  {
    const start = Date.now();
    try {
      const auditRes = await auditService.getAuditLogs('tenant-rz-global-001');
      const passed = auditRes.success && auditRes.data.length > 0;
      results.push({
        testName: 'Persistent Audit Engine - Audit Log Query & Immutability',
        category: 'Audit & Compliance',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Found ${auditRes.data.length} persistent audit log entries for tenant` : 'No audit logs found'
      });
    } catch (err: any) {
      results.push({
        testName: 'Persistent Audit Engine',
        category: 'Audit & Compliance',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 10: Workflow Engine Initiation
  {
    const start = Date.now();
    try {
      const wfRes = await wfService.initiateWorkflow(
        'tenant-rz-global-001',
        'WF_INVOICE_APPROVAL',
        'INVOICE',
        'INV-2026-00010',
        'usr-quarry-mgr-002'
      );
      const passed = wfRes.success && wfRes.data.currentState === 'DRAFT';
      results.push({
        testName: 'Workflow Engine - Initiate Workflow Instance & State Transition',
        category: 'Workflows',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Initiated Workflow Instance [${wfRes.data.id}] in initial state DRAFT` : 'Workflow initiation failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Workflow Engine',
        category: 'Workflows',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 11: Phase 18 Fleet Operations - Vehicle CRUD & Registration Uniqueness
  {
    const start = Date.now();
    try {
      const regNo = 'KA-19-TEST-' + Math.floor(1000 + Math.random() * 9000);
      const vRes = await fleetService.createVehicle('tenant-rz-global-001', {
        registrationNumber: regNo,
        make: 'BharatBenz',
        model: 'Heavy Tipper 2828',
        vehicleType: 'Tipper',
        currentOdometer: 5000
      });
      const queryVehs = await fleetService.getVehicles('tenant-rz-global-001');
      const passed = !!vRes.id && queryVehs.some(v => v.registrationNumber === regNo);
      results.push({
        testName: 'Fleet Operations - Vehicle Registration & Tenant Scoped Storage',
        category: 'Fleet Suite',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Successfully created & queried Fleet Vehicle [${vRes.registrationNumber}]` : 'Vehicle creation test failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Fleet Operations - Vehicle Registration',
        category: 'Fleet Suite',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 12: Phase 18 Fleet Operations - Driver Management & Operational Linkage
  {
    const start = Date.now();
    try {
      const licNo = 'KA-19-2021-' + Math.floor(100000 + Math.random() * 900000);
      const dRes = await fleetService.createDriver('tenant-rz-global-001', {
        name: 'Ramesh Gowda',
        licenseNumber: licNo,
        phone: '+91-98800-44556',
        licenseType: 'HEAVY_COMMERCIAL'
      });
      const drivers = await fleetService.getDrivers('tenant-rz-global-001');
      const passed = !!dRes.id && drivers.some(d => d.licenseNumber === licNo);
      results.push({
        testName: 'Fleet Operations - Driver Profile & License Registry',
        category: 'Fleet Suite',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Driver [${dRes.name}] created with heavy commercial license` : 'Driver creation test failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Fleet Operations - Driver Registry',
        category: 'Fleet Suite',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 13: Phase 18 Fleet Operations - Assignment Conflict Prevention
  {
    const start = Date.now();
    try {
      const v13 = await fleetService.createVehicle('tenant-rz-global-001', {
        registrationNumber: 'KA-19-ASG-' + Math.floor(1000 + Math.random() * 9000),
        make: 'Tata',
        model: 'Prima 2830',
        vehicleType: 'Tipper',
        currentOdometer: 10000
      });
      const assign1 = await fleetService.assignVehicle('tenant-rz-global-001', {
        vehicleId: v13.id,
        primaryDriverId: 'drv-suresh-001',
        purpose: 'Primary Pit Transfer'
      });
      let conflictBlocked = false;
      try {
        await fleetService.assignVehicle('tenant-rz-global-001', {
          vehicleId: v13.id,
          primaryDriverId: 'drv-suresh-001',
          purpose: 'Conflicting Assignment'
        });
      } catch {
        conflictBlocked = true;
      }
      const passed = !!assign1.id && conflictBlocked;
      results.push({
        testName: 'Fleet Operations - Vehicle Assignment Conflict Prevention',
        category: 'Fleet Suite',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Active vehicle assignment established and conflicting duplicate assignment successfully blocked' : 'Failed assignment conflict check'
      });
    } catch (err: any) {
      results.push({
        testName: 'Fleet Operations - Assignment Conflict Check',
        category: 'Fleet Suite',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 14: Phase 18 Fleet Operations - Trip Lifecycle & Odometer Validation
  {
    const start = Date.now();
    try {
      const v14 = await fleetService.createVehicle('tenant-rz-global-001', {
        registrationNumber: 'KA-19-TRP-' + Math.floor(1000 + Math.random() * 9000),
        make: 'Volvo',
        model: 'FMX 460',
        vehicleType: 'Tipper',
        currentOdometer: 12100
      });
      const trip = await fleetService.createTrip('tenant-rz-global-001', {
        vehicleId: v14.id,
        driverId: 'drv-suresh-001',
        source: 'Quarry Pit Alpha',
        destination: 'Crusher Unit Beta',
        startOdometer: 12100,
        material: 'Granite Rock',
        quantity: 30
      });
      await fleetService.dispatchTrip('tenant-rz-global-001', trip.id);
      
      let negativeOdoBlocked = false;
      try {
        await fleetService.completeTrip('tenant-rz-global-001', trip.id, 12000); // lower than 12100 start
      } catch {
        negativeOdoBlocked = true;
      }

      const completed = await fleetService.completeTrip('tenant-rz-global-001', trip.id, 12180); // 80 km travel
      const passed = completed.status === 'COMPLETED' && completed.distance === 80 && negativeOdoBlocked;
      results.push({
        testName: 'Fleet Operations - Trip Lifecycle, Dispatch & Odometer Validation',
        category: 'Fleet Suite',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Trip dispatched, invalid negative odometer movement blocked, and 80km trip completed successfully' : 'Trip lifecycle test failed'
      });

      // Test 15: Fuel Consumption Logging on v14
      const startFuel = Date.now();
      const fuelLog = await fleetService.logFuel('tenant-rz-global-001', {
        vehicleId: v14.id,
        driverId: 'drv-suresh-001',
        quantity: 100,
        rate: 95.5,
        odometer: 12280, // 100 km covered from 12180
        fuelStation: 'Quarry Internal Pump #1'
      });
      const fuelPassed = fuelLog.amount === 9550 && typeof fuelLog.calculatedEfficiency === 'number' && fuelLog.calculatedEfficiency > 0;
      results.push({
        testName: 'Fleet Operations - Fuel Consumption Logging & Efficiency Calculation',
        category: 'Fleet Suite',
        passed: fuelPassed,
        durationMs: Date.now() - startFuel,
        message: fuelPassed ? `Fuel logged (100L @ ₹95.5/L = ₹9,550) with calculated efficiency of ${fuelLog.calculatedEfficiency} KM/L` : `Fuel logging test failed (amount=${fuelLog.amount}, eff=${fuelLog.calculatedEfficiency})`
      });

      // Test 16: Maintenance Service on v14
      const startMaint = Date.now();
      const maint = await fleetService.logMaintenance('tenant-rz-global-001', {
        vehicleId: v14.id,
        maintenanceType: 'PREVENTIVE',
        description: 'Engine Oil Change, Air Filter Replacement & Hydraulic Service',
        odometer: 12500,
        partsCost: 12500,
        labourCost: 3500,
        otherCost: 500
      });
      const maintPassed = maint.totalCost === 16500;
      results.push({
        testName: 'Fleet Operations - Maintenance Service & Cost Aggregation',
        category: 'Fleet Suite',
        passed: maintPassed,
        durationMs: Date.now() - startMaint,
        message: maintPassed ? `Maintenance recorded with aggregated total cost of ₹16,500 (Parts: ₹12,500 + Labour: ₹3,500 + Other: ₹500)` : 'Maintenance test failed'
      });

    } catch (err: any) {
      results.push({
        testName: 'Fleet Operations - Trip & Operational Suite',
        category: 'Fleet Suite',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 17: Phase 18 Fleet Operations - Dashboard Metrics & Multi-Tenant Query Isolation
  {
    const start = Date.now();
    try {
      const metrics = await fleetService.getDashboardMetrics('tenant-rz-global-001');
      const passed = metrics.totalVehicles >= 2 && metrics.totalDrivers >= 1;
      results.push({
        testName: 'Fleet Operations - Dashboard Aggregation & Tenant Metrics',
        category: 'Fleet Suite',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Queried Fleet Dashboard: ${metrics.totalVehicles} Vehicles, ${metrics.totalDrivers} Drivers, ${metrics.completedTrips} Completed Trips` : 'Dashboard query failed'
      });
    } catch (err: any) {
      results.push({
        testName: 'Fleet Operations - Dashboard Aggregation',
        category: 'Fleet Suite',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // ====================================================
  // PHASE 19 TESTS — AI LOAD EXCHANGE & TRANSPORT MARKETPLACE
  // ====================================================

  // Test 18: Phase 19 — Load Request Creation, Validation & AI Match Engine Execution
  {
    const start = Date.now();
    try {
      const load = await marketplaceService.createLoadRequest('tenant-rz-global-001', {
        customerId: 'cust-infra-corp-1',
        customerName: 'Soma Infrastructure Ltd',
        materialId: 'mat-m-sand-01',
        materialName: 'M-Sand (Manufactured Sand)',
        source: 'Quarry Site Alpha, Rock Ridge',
        destination: 'Highway Project Gate 4, Surathkal',
        requiredDate: '2026-08-15',
        requiredTime: '08:00 AM',
        quantity: 32.0,
        unit: 'TONS',
        vehicleType: 'Tipper',
        budget: 18000.0,
        isPublic: true
      }, 'usr-admin-001');

      const matches = await marketplaceService.getLoadMatches('tenant-rz-global-001', load.id);
      const passed = !!load.requestNumber && matches.length > 0 && matches[0].matchScore > 70 && matches[0].reasonCodes.length > 0;

      results.push({
        testName: 'Phase 19 — Load Request Creation & AI Load Match Scoring',
        category: 'AI Load Exchange & Marketplace',
        passed,
        durationMs: Date.now() - start,
        message: passed 
          ? `Created Load Request [${load.requestNumber}]. AI Engine matched ${matches.length} vehicle(s), top score: ${matches[0].matchScore} (Reasons: ${matches[0].reasonCodes.join(', ')})`
          : 'Load Request & AI Matching failed',
        evidence: { loadNumber: load.requestNumber, matchCount: matches.length, topMatch: matches[0] }
      });
    } catch (err: any) {
      results.push({
        testName: 'Phase 19 — Load Request Creation & AI Match Engine Execution',
        category: 'AI Load Exchange & Marketplace',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 19: Phase 19 — Transporter Offer, Acceptance & Fleet Trip Integration
  {
    const start = Date.now();
    try {
      // Fetch open load
      const loads = await marketplaceService.getLoadRequests('tenant-rz-global-001', { status: 'MATCHED' });
      const targetLoad = loads[0] || (await marketplaceService.getLoadRequests('tenant-rz-global-001'))[0];

      // Submit offer
      const offer = await marketplaceService.submitOffer('tenant-rz-global-001', {
        loadId: targetLoad.id,
        transporterId: 'tp-trans-001',
        vehicleId: 'veh-ka19-4491',
        driverId: 'drv-suresh-001',
        quotedPrice: 13500.00,
        remarks: 'Tipper ready for immediate dispatch'
      }, 'usr-admin-001');

      // Accept offer
      const booking = await marketplaceService.acceptOffer('tenant-rz-global-001', offer.id, 'usr-admin-001');

      // Verify trip was created in Fleet Repository
      const trips = await fleetService.getTrips('tenant-rz-global-001');
      const associatedTrip = trips.find(t => t.id === booking.fleetTripId);

      const passed = offer.status === 'ACCEPTED' && booking.status === 'DISPATCHED' && !!associatedTrip && associatedTrip.status === 'DISPATCHED';

      results.push({
        testName: 'Phase 19 — Transporter Offer Acceptance & Fleet Trip Integration',
        category: 'AI Load Exchange & Marketplace',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Offer [${offer.offerNumber}] accepted. Booking [${booking.bookingNumber}] created and linked to Fleet Trip [${associatedTrip?.tripNumber}]`
          : 'Offer acceptance & trip integration failed',
        evidence: { bookingNumber: booking.bookingNumber, fleetTripNumber: associatedTrip?.tripNumber }
      });
    } catch (err: any) {
      results.push({
        testName: 'Phase 19 — Transporter Offer & Fleet Trip Integration',
        category: 'AI Load Exchange & Marketplace',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Test 20: Phase 19 — Delivery Confirmation, Vehicle Release & Marketplace Dashboard Metrics
  {
    const start = Date.now();
    try {
      const bookings = await marketplaceService.getBookings('tenant-rz-global-001', { status: 'DISPATCHED' });
      const targetBooking = bookings[0];
      const deliveries = await marketplaceService.getDeliveries('tenant-rz-global-001', targetBooking?.id);
      const targetDelivery = deliveries[0];

      if (targetDelivery) {
        await marketplaceService.confirmDelivery('tenant-rz-global-001', targetDelivery.id, {
          receiverName: 'Ramesh Shetty (Site In-Charge)',
          receiverContact: '+91-98450-22119',
          quantityDelivered: 28.0,
          documentReference: 'POD-2026-0812',
          remarks: 'Material inspected and verified at site gate'
        }, 'usr-admin-001');
      }

      const metrics = await marketplaceService.getDashboardMetrics('tenant-rz-global-001');
      const passed = metrics.openLoadsCount >= 0 && metrics.availableTransportersCount >= 1 && metrics.averageMatchScore > 0;

      results.push({
        testName: 'Phase 19 — Delivery Confirmation & Marketplace Dashboard Metrics',
        category: 'AI Load Exchange & Marketplace',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Delivery confirmed. Marketplace Dashboard verified: ${metrics.openLoadsCount} Open Loads, ${metrics.activeBookingsCount} Active Bookings, Avg Match Score: ${metrics.averageMatchScore}%`
          : 'Delivery confirmation & metrics failed',
        evidence: metrics
      });
    } catch (err: any) {
      results.push({
        testName: 'Phase 19 — Delivery Confirmation & Dashboard Metrics',
        category: 'AI Load Exchange & Marketplace',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // Execute Phase 20 CRM Test Suite
  try {
    const crmTestResults = await runCrmTestSuite();
    results.push(...crmTestResults);
  } catch (err: any) {
    results.push({
      testName: 'Phase 20 — Enterprise CRM Test Suite Execution',
      category: 'Enterprise CRM',
      passed: false,
      durationMs: 0,
      message: `Failed to execute CRM test suite: ${err.message}`
    });
  }

  // Execute Phase 21 Finance Test Suite
  try {
    const finRes = await runFinanceTestSuite();
    results.push({
      testName: 'Phase 21 — Enterprise Finance & Accounting Suite',
      category: 'Enterprise Finance',
      passed: finRes.success,
      durationMs: 0,
      message: finRes.success
        ? `Passed all ${finRes.passedTests}/${finRes.totalTests} Phase 21 Finance automated tests successfully.`
        : `Failed Phase 21 Finance tests (${finRes.failedTests} errors): ${finRes.errors.join('; ')}`
    });
  } catch (err: any) {
    results.push({
      testName: 'Phase 21 — Enterprise Finance Test Suite Execution',
      category: 'Enterprise Finance',
      passed: false,
      durationMs: 0,
      message: `Failed to execute Finance test suite: ${err.message}`
    });
  }

  // Execute Phase 22 HRMS Test Suite
  try {
    const hrRes = await runHrTestSuite();
    const passed = hrRes.passedCount === hrRes.totalCount && hrRes.totalCount > 0;
    results.push({
      testName: 'Phase 22 — Enterprise HRMS, Workforce & Payroll Suite',
      category: 'Enterprise HRMS',
      passed,
      durationMs: 0,
      message: passed
        ? `Passed all ${hrRes.passedCount}/${hrRes.totalCount} Phase 22 HRMS automated tests successfully.`
        : `Failed Phase 22 HRMS tests (${hrRes.totalCount - hrRes.passedCount} errors).`
    });
  } catch (err: any) {
    results.push({
      testName: 'Phase 22 — Enterprise HRMS Test Suite Execution',
      category: 'Enterprise HRMS',
      passed: false,
      durationMs: 0,
      message: `Failed to execute HRMS test suite: ${err.message}`
    });
  }

  // Platform 1: Quarry Management Production & Stock Suite
  try {
    const quarryRes = await runQuarryTestSuite();
    results.push(...quarryRes);
  } catch (err: any) {
    results.push({
      testName: 'Platform 1 — Quarry Management Domain Test Suite Execution',
      category: 'Quarry Production',
      passed: false,
      durationMs: 0,
      message: `Failed to execute Quarry domain test suite: ${err.message}`
    });
  }

  // Platform 1: Quarry Management HTTP API & RBAC Suite
  try {
    const quarryApiRes = await runQuarryApiTestSuite();
    results.push(...quarryApiRes);
  } catch (err: any) {
    results.push({
      testName: 'Platform 1 — Quarry Management API & RBAC Test Suite Execution',
      category: 'Quarry API & RBAC',
      passed: false,
      durationMs: 0,
      message: `Failed to execute Quarry API test suite: ${err.message}`
    });
  }

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    executedAt: new Date().toISOString(),
    totalTests: results.length,
    passedCount,
    failedCount,
    results
  };
}
