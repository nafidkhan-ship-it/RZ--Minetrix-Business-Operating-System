import { db, generateUuidV7 } from '../db/database.js';
import {
  quarryMasterService,
  stoneProductService,
  productionService,
  stockService,
  gatePassService,
  landLeaseService,
  landownerSettlementService,
  QuarryDomainError,
  SecurityContext
} from '../services/quarryServices.js';
import { QuarryRepository } from '../repositories/quarryRepositories.js';

export interface TestResult {
  testName: string;
  category: string;
  passed: boolean;
  durationMs: number;
  message: string;
  evidence?: any;
}

export async function runQuarryTestSuite(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const repo = new QuarryRepository();

  const tenantA = 'tenant-rz-global-001';
  const tenantB = 'tenant-cross-test-999';

  const ctxA: SecurityContext = {
    tenantId: tenantA,
    userId: 'usr-quarry-mgr-002',
    userEmail: 'quarry.manager@racezoneventures.com',
    ipAddress: '192.168.1.100'
  };

  const ctxB: SecurityContext = {
    tenantId: tenantB,
    userId: 'usr-unauthorized-001',
    userEmail: 'intruder@otherorg.com',
    ipAddress: '10.0.0.1'
  };

  // State variables across sequential lifecycle tests
  let testQuarryId = '';
  let lateriteProdId = '';
  let hardRockProdId = '';
  let testGatePassId = '';
  let testLeaseId = '';

  // --------------------------------------------------------------------------
  // Test 1: Create Quarry Master
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const q = await quarryMasterService.createQuarry({
        companyId: 'comp-101',
        branchId: 'br-quarry-alpha',
        name: `Test Laterite Site ${Date.now()}`,
        quarryType: 'LATERITE',
        location: 'Belthangady Zone 4',
        address: 'Sy No 89/1, Belthangady'
      }, ctxA);

      testQuarryId = q.id;
      const passed = q.status === 'ACTIVE' && q.quarryType === 'LATERITE' && q.tenantId === tenantA;
      results.push({
        testName: '1. Create Quarry Master (LATERITE)',
        category: 'Quarry Master',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Quarry '${q.name}' created with ID ${q.id}.` : 'Failed to create quarry.',
        evidence: { quarryId: q.id, name: q.name, status: q.status }
      });
    } catch (err: any) {
      results.push({
        testName: '1. Create Quarry Master (LATERITE)',
        category: 'Quarry Master',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 2: Tenant Isolation on Quarry Access
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      let threw = false;
      try {
        await quarryMasterService.getQuarry(testQuarryId, ctxB);
      } catch (e: any) {
        threw = e instanceof QuarryDomainError || e.message.includes('not found') || e.code === 'QUARRY_NOT_FOUND' || e.code === 'TENANT_ACCESS_DENIED';
      }

      results.push({
        testName: '2. Tenant Isolation - Cross-Tenant Quarry Read Blocked',
        category: 'Security & Isolation',
        passed: threw,
        durationMs: Date.now() - start,
        message: threw ? 'Cross-tenant quarry access blocked with domain error.' : 'Failed: Tenant B accessed Tenant A quarry!'
      });
    } catch (err: any) {
      results.push({
        testName: '2. Tenant Isolation - Cross-Tenant Quarry Read Blocked',
        category: 'Security & Isolation',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 3: Create Laterite Stone Product
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const prod = await stoneProductService.createStoneProduct({
        quarryId: testQuarryId,
        productCode: `LAT-PRD-${Date.now().toString().slice(-4)}`,
        name: 'Laterite Dressed Stone 30x20x15',
        mineralType: 'LATERITE',
        dimensions: '30x20x15 cm',
        unit: 'PIECE',
        defaultPrice: 45.0,
        gstRate: 5
      }, ctxA);

      lateriteProdId = prod.id;
      const passed = prod.mineralType === 'LATERITE' && prod.unit === 'PIECE' && prod.defaultPrice === 45.0;
      results.push({
        testName: '3. Create Laterite Stone Product',
        category: 'Stone Product',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Created product '${prod.name}' with code ${prod.productCode}.` : 'Failed creating laterite product.',
        evidence: { productId: prod.id, code: prod.productCode }
      });
    } catch (err: any) {
      results.push({
        testName: '3. Create Laterite Stone Product',
        category: 'Stone Product',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 4: Create Hard Rock Stone Product
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const prod = await stoneProductService.createStoneProduct({
        quarryId: 'qm-hardrock-002',
        productCode: `HR-GSB-${Date.now().toString().slice(-4)}`,
        name: 'Granite GSB Sub-Base Material',
        mineralType: 'HARD_ROCK',
        unit: 'TON',
        defaultPrice: 320.0,
        gstRate: 5
      }, ctxA);

      hardRockProdId = prod.id;
      const passed = prod.mineralType === 'HARD_ROCK' && prod.unit === 'TON';
      results.push({
        testName: '4. Create Hard Rock Stone Product',
        category: 'Stone Product',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Created Hard Rock product '${prod.name}'.` : 'Failed creating hard rock product.',
        evidence: { productId: prod.id, code: prod.productCode }
      });
    } catch (err: any) {
      results.push({
        testName: '4. Create Hard Rock Stone Product',
        category: 'Stone Product',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 5: Record Laterite Production
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const res = await productionService.recordProduction({
        quarryId: testQuarryId,
        productId: lateriteProdId,
        productionType: 'LATERITE_CUTTING',
        shift: 'DAY',
        quantity: 1000,
        operatorId: 'usr-quarry-mgr-002',
        remarks: 'Bench 1 high-yield cutting'
      }, ctxA);

      const passed = res.production.quantity === 1000 &&
                     res.production.unit === 'PIECE' &&
                     res.newBalance === 1000;
      results.push({
        testName: '5. Record Laterite Production (LATERITE_CUTTING)',
        category: 'Production',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Recorded cutting of 1000 PIECES. Balance: ${res.newBalance}.` : 'Failed recording laterite production.',
        evidence: { productionId: res.production.id, quantity: res.production.quantity }
      });
    } catch (err: any) {
      results.push({
        testName: '5. Record Laterite Production (LATERITE_CUTTING)',
        category: 'Production',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 6: Record Hard Rock Production
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const initialBalance = await stockService.getStockBalance('qm-hardrock-002', hardRockProdId, ctxA);
      const res = await productionService.recordProduction({
        quarryId: 'qm-hardrock-002',
        productId: hardRockProdId,
        productionType: 'HARD_ROCK_EXTRACTION',
        shift: 'DAY',
        quantity: 250,
        operatorId: 'usr-quarry-mgr-002',
        remarks: 'Primary boulder blasting excavation'
      }, ctxA);

      const passed = res.production.quantity === 250 &&
                     res.production.unit === 'TON' &&
                     res.newBalance === initialBalance + 250;
      results.push({
        testName: '6. Record Hard Rock Production (HARD_ROCK_EXTRACTION)',
        category: 'Production',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Recorded 250 TONS extraction. Balance: ${res.newBalance} TONS.` : 'Failed recording hard rock production.',
        evidence: { productionId: res.production.id, newBalance: res.newBalance }
      });
    } catch (err: any) {
      results.push({
        testName: '6. Record Hard Rock Production (HARD_ROCK_EXTRACTION)',
        category: 'Production',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 7: Production Creates Exactly ONE STOCK_IN
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const uniqueProdId = generateUuidV7();
      await productionService.recordProduction({
        id: uniqueProdId,
        quarryId: testQuarryId,
        productId: lateriteProdId,
        quantity: 300,
        operatorId: 'usr-quarry-mgr-002'
      }, ctxA);

      // Verify exact count of STOCK_IN entries linked to this production
      const stockEntries = Array.from(db.quarryStocks.values()).filter(
        s => s.tenantId === tenantA && s.referenceId === uniqueProdId && s.referenceType === 'PRODUCTION' && s.transactionType === 'STOCK_IN'
      );

      const passed = stockEntries.length === 1 && stockEntries[0].quantityIn === 300;
      results.push({
        testName: '7. Production Creates Exactly ONE STOCK_IN Ledger Transaction',
        category: 'Stock Integrity',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Verified exactly 1 immutable STOCK_IN entry created with matching quantity.' : `Expected 1 stock entry, found ${stockEntries.length}`,
        evidence: { stockEntriesCount: stockEntries.length, stockId: stockEntries[0]?.id }
      });
    } catch (err: any) {
      results.push({
        testName: '7. Production Creates Exactly ONE STOCK_IN Ledger Transaction',
        category: 'Stock Integrity',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 8: Stock Balance Calculation Formula
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      // Balance should be 1000 + 300 = 1300
      const currentBalance = await stockService.getStockBalance(testQuarryId, lateriteProdId, ctxA);
      
      // Perform adjustment in
      await stockService.recordStockAdjustment({
        quarryId: testQuarryId,
        productId: lateriteProdId,
        adjustmentType: 'ADJUSTMENT_IN',
        quantity: 100,
        reason: 'Stock audit count physical reconciliation'
      }, ctxA);

      const balanceAfterAdjustment = await stockService.getStockBalance(testQuarryId, lateriteProdId, ctxA);
      const passed = balanceAfterAdjustment === currentBalance + 100;

      results.push({
        testName: '8. Stock Balance Derived Calculation (STOCK_IN + ADJUSTMENT_IN)',
        category: 'Stock Services',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Calculated balance correctly: ${currentBalance} + 100 = ${balanceAfterAdjustment}.` : 'Stock balance calculation mismatch.',
        evidence: { previous: currentBalance, updated: balanceAfterAdjustment }
      });
    } catch (err: any) {
      results.push({
        testName: '8. Stock Balance Derived Calculation',
        category: 'Stock Services',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 9: Insufficient Stock Protection on Adjustment & Gate Pass
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      let threwOnAdjustment = false;
      try {
        await stockService.recordStockAdjustment({
          quarryId: testQuarryId,
          productId: lateriteProdId,
          adjustmentType: 'ADJUSTMENT_OUT',
          quantity: 999999, // Exceeds available stock
          reason: 'Excessive adjustment test'
        }, ctxA);
      } catch (e: any) {
        threwOnAdjustment = e.code === 'INSUFFICIENT_STOCK' || e.message.includes('Insufficient');
      }

      let threwOnGatePass = false;
      try {
        await gatePassService.createGatePass({
          quarryId: testQuarryId,
          customerId: 'crm-cust-001',
          productId: lateriteProdId,
          quantity: 999999
        }, ctxA);
      } catch (e: any) {
        threwOnGatePass = e.code === 'INSUFFICIENT_STOCK' || e.message.includes('Insufficient');
      }

      const passed = threwOnAdjustment && threwOnGatePass;
      results.push({
        testName: '9. Insufficient Stock Protection (Adjustment & GatePass)',
        category: 'Stock Integrity',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Both oversized adjustment and oversized gate pass were safely rejected.' : 'Failed: Oversized stock removal permitted!'
      });
    } catch (err: any) {
      results.push({
        testName: '9. Insufficient Stock Protection',
        category: 'Stock Integrity',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 10: Gate Pass Creation
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const gp = await gatePassService.createGatePass({
        quarryId: testQuarryId,
        customerId: 'crm-cust-001',
        productId: lateriteProdId,
        quantity: 400,
        vehicleNo: 'KA-19-ME-8844',
        driverName: 'Ramesh Shetty',
        grossWeight: 5200,
        tareWeight: 1200,
        salesReference: 'SO-TEST-2026-001'
      }, ctxA);

      testGatePassId = gp.id;
      const passed = gp.status === 'ISSUED' &&
                     gp.quantity === 400 &&
                     gp.netWeight === 4000; // 5200 - 1200

      results.push({
        testName: '10. Gate Pass Creation & Net Weight Calculation',
        category: 'Gate Pass',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Gate pass '${gp.passNumber}' created with net weight 4000 kg.` : 'Failed creating gate pass.',
        evidence: { passNumber: gp.passNumber, netWeight: gp.netWeight, status: gp.status }
      });
    } catch (err: any) {
      results.push({
        testName: '10. Gate Pass Creation & Net Weight Calculation',
        category: 'Gate Pass',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 11: Gate Pass Sequential Numbering Format
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const gp = await gatePassService.getGatePass(testGatePassId, ctxA);
      const year = new Date().getFullYear();
      const regex = new RegExp(`^GP-[A-Z0-9]+-${year}-\\d{5}$`);
      const passed = regex.test(gp.passNumber);

      results.push({
        testName: '11. Gate Pass Sequential Numbering Format (GP-PREFIX-YYYY-SEQ)',
        category: 'Gate Pass',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Pass number '${gp.passNumber}' matches sequential pattern.` : `Invalid pass number format '${gp.passNumber}'.`,
        evidence: { passNumber: gp.passNumber }
      });
    } catch (err: any) {
      results.push({
        testName: '11. Gate Pass Sequential Numbering Format',
        category: 'Gate Pass',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 12: Gate Pass Verification Step
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const verified = await gatePassService.verifyGatePass(testGatePassId, ctxA);
      const passed = verified.status === 'VERIFIED' && verified.approvedBy === ctxA.userId;

      results.push({
        testName: '12. Gate Pass Verification Transition (ISSUED -> VERIFIED)',
        category: 'Gate Pass',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Gate pass '${verified.passNumber}' successfully verified.` : 'Failed verifying gate pass.',
        evidence: { status: verified.status, approvedBy: verified.approvedBy }
      });
    } catch (err: any) {
      results.push({
        testName: '12. Gate Pass Verification Transition',
        category: 'Gate Pass',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 13: Gate Pass Dispatch Lifecycle
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const initialStock = await stockService.getStockBalance(testQuarryId, lateriteProdId, ctxA);
      const res = await gatePassService.dispatchGatePass(testGatePassId, ctxA);

      const passed = res.gatePass.status === 'DISPATCHED' &&
                     res.remainingStock === initialStock - 400;

      results.push({
        testName: '13. Gate Pass Dispatch Transition (VERIFIED -> DISPATCHED)',
        category: 'Gate Pass',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Gate pass dispatched. Stock reduced from ${initialStock} to ${res.remainingStock}.` : 'Failed gate pass dispatch.',
        evidence: { status: res.gatePass.status, remainingStock: res.remainingStock }
      });
    } catch (err: any) {
      results.push({
        testName: '13. Gate Pass Dispatch Transition',
        category: 'Gate Pass',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 14: Dispatch Creates Exactly ONE STOCK_OUT
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const stockOutEntries = Array.from(db.quarryStocks.values()).filter(
        s => s.tenantId === tenantA && s.referenceId === testGatePassId && s.referenceType === 'GATE_PASS' && s.transactionType === 'STOCK_OUT'
      );

      const passed = stockOutEntries.length === 1 && stockOutEntries[0].quantityOut === 400;
      results.push({
        testName: '14. Dispatch Creates Exactly ONE STOCK_OUT Ledger Transaction',
        category: 'Stock Integrity',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Verified exactly 1 STOCK_OUT ledger entry created upon gate pass dispatch.' : `Expected 1 STOCK_OUT entry, found ${stockOutEntries.length}`,
        evidence: { stockEntriesCount: stockOutEntries.length, stockId: stockOutEntries[0]?.id }
      });
    } catch (err: any) {
      results.push({
        testName: '14. Dispatch Creates Exactly ONE STOCK_OUT Ledger Transaction',
        category: 'Stock Integrity',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 15: Duplicate Dispatch Prevention
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      let threw = false;
      try {
        await gatePassService.dispatchGatePass(testGatePassId, ctxA);
      } catch (e: any) {
        threw = e.code === 'GATE_PASS_ALREADY_DISPATCHED' || e.message.includes('already been dispatched');
      }

      results.push({
        testName: '15. Duplicate Dispatch Prevention Guard',
        category: 'Gate Pass',
        passed: threw,
        durationMs: Date.now() - start,
        message: threw ? 'Correctly rejected duplicate dispatch attempt on already-dispatched pass.' : 'Failed: Duplicate dispatch allowed!'
      });
    } catch (err: any) {
      results.push({
        testName: '15. Duplicate Dispatch Prevention Guard',
        category: 'Gate Pass',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 16: Gate Pass Cancellation Rules (Disallowed after Dispatch)
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      let threwOnDispatched = false;
      try {
        await gatePassService.cancelGatePass(testGatePassId, 'Late cancellation attempt', ctxA);
      } catch (e: any) {
        threwOnDispatched = e.code === 'INVALID_GATE_PASS_STATE' || e.message.includes('cannot be cancelled');
      }

      // Create a fresh draft/issued pass and cancel it successfully
      const freshPass = await gatePassService.createGatePass({
        quarryId: testQuarryId,
        customerId: 'crm-cust-001',
        productId: lateriteProdId,
        quantity: 50
      }, ctxA);

      const cancelledPass = await gatePassService.cancelGatePass(freshPass.id, 'Customer changed order', ctxA);
      const passed = threwOnDispatched && cancelledPass.status === 'CANCELLED';

      results.push({
        testName: '16. Gate Pass Cancellation Rules (Disallow post-dispatch, allow pre-dispatch)',
        category: 'Gate Pass',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'Successfully enforced cancellation rules before and after physical dispatch.' : 'Cancellation rules failed.',
        evidence: { cancelledPassStatus: cancelledPass.status }
      });
    } catch (err: any) {
      results.push({
        testName: '16. Gate Pass Cancellation Rules',
        category: 'Gate Pass',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 17: Tenant Cross-Access Rejection on Products & Gate Passes
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      let threwOnProduct = false;
      try {
        await stoneProductService.getStoneProduct(lateriteProdId, ctxB);
      } catch (e: any) {
        threwOnProduct = true;
      }

      let threwOnGatePass = false;
      try {
        await gatePassService.getGatePass(testGatePassId, ctxB);
      } catch (e: any) {
        threwOnGatePass = true;
      }

      const passed = threwOnProduct && threwOnGatePass;
      results.push({
        testName: '17. Tenant Cross-Access Rejection (Products & Gate Passes)',
        category: 'Security & Isolation',
        passed,
        durationMs: Date.now() - start,
        message: passed ? 'All cross-tenant access attempts strictly rejected.' : 'Failed: Cross-tenant data leakage detected!'
      });
    } catch (err: any) {
      results.push({
        testName: '17. Tenant Cross-Access Rejection',
        category: 'Security & Isolation',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 18: Quarry Land Lease Creation & Royalty Configuration
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const lease = await landLeaseService.createLease({
        quarryId: testQuarryId,
        ownerName: 'Venkatesh Rao',
        surveyNumber: '112/4B',
        village: 'Belthangady East',
        taluk: 'Belthangady',
        area: 6.5,
        leaseType: 'LEASED',
        royaltyType: 'PER_PIECE',
        royaltyRate: 4.0, // Rs 4 per cut piece
        startDate: '2025-01-01',
        expiryDate: '2030-12-31',
        documentReference: 'REG-AGR-2025-112'
      }, ctxA);

      testLeaseId = lease.id;
      const passed = lease.status === 'ACTIVE' &&
                     lease.royaltyType === 'PER_PIECE' &&
                     lease.royaltyRate === 4.0 &&
                     lease.area === 6.5;

      results.push({
        testName: '18. Quarry Land Lease Creation & Royalty Configuration',
        category: 'Land Lease',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Lease created for landowner '${lease.ownerName}' (Rate: Rs ${lease.royaltyRate}/piece).` : 'Failed creating land lease.',
        evidence: { leaseId: lease.id, owner: lease.ownerName, rate: lease.royaltyRate }
      });
    } catch (err: any) {
      results.push({
        testName: '18. Quarry Land Lease Creation & Royalty Configuration',
        category: 'Land Lease',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 19: Landowner Settlement Transparent Calculation & Approval
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      // 10,000 pieces at Rs 4.00 = Rs 40,000.00
      const settlement = await landownerSettlementService.createSettlement({
        leaseId: testLeaseId,
        periodStart: '2026-07-01',
        periodEnd: '2026-07-31',
        basisQuantity: 10000
      }, ctxA);

      const calculatedCorrectly = settlement.calculatedAmount === 40000.00;
      const approved = await landownerSettlementService.approveSettlement(settlement.id, ctxA);
      const passed = calculatedCorrectly &&
                     approved.status === 'APPROVED' &&
                     !!approved.financeBillId;

      results.push({
        testName: '19. Landowner Settlement Transparent Calculation & Approval',
        category: 'Land Lease & Settlement',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Calculated royalty: Rs ${settlement.calculatedAmount}. Approved with integration ref '${approved.financeBillId}'.` : 'Settlement calculation mismatch.',
        evidence: { amount: settlement.calculatedAmount, financeBillId: approved.financeBillId }
      });
    } catch (err: any) {
      results.push({
        testName: '19. Landowner Settlement Transparent Calculation & Approval',
        category: 'Land Lease & Settlement',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // --------------------------------------------------------------------------
  // Test 20: Full Audit Trail Verification for Quarry Mutations
  // --------------------------------------------------------------------------
  {
    const start = Date.now();
    try {
      const quarryAuditLogs = Array.from(db.auditLogs.values()).filter(
        a => a.tenantId === tenantA && a.module === 'Quarry Management'
      );

      const hasProductionAudit = quarryAuditLogs.some(a => a.action === 'QUARRY_PRODUCTION_RECORD');
      const hasDispatchAudit = quarryAuditLogs.some(a => a.action === 'GATE_PASS_DISPATCH');
      const hasStockAdjustmentAudit = quarryAuditLogs.some(a => a.action === 'STOCK_ADJUSTMENT_RECORD');
      const hasLeaseAudit = quarryAuditLogs.some(a => a.action === 'LAND_LEASE_CREATE');

      const passed = quarryAuditLogs.length >= 4 &&
                     hasProductionAudit &&
                     hasDispatchAudit &&
                     hasStockAdjustmentAudit &&
                     hasLeaseAudit;

      results.push({
        testName: '20. Shared Core Audit Trail Verification for Quarry Mutations',
        category: 'Audit & Compliance',
        passed,
        durationMs: Date.now() - start,
        message: passed ? `Verified ${quarryAuditLogs.length} structured audit entries generated across all quarry modules.` : 'Missing expected audit log records.',
        evidence: { totalAuditEntries: quarryAuditLogs.length }
      });
    } catch (err: any) {
      results.push({
        testName: '20. Shared Core Audit Trail Verification for Quarry Mutations',
        category: 'Audit & Compliance',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  return results;
}
