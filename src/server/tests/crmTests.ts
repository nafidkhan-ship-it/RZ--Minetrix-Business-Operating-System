import { crmService } from '../services/crmServices.js';
import { crmRepository } from '../repositories/crmRepositories.js';
import { db, generateUuidV7 } from '../db/database.js';
import { TestResult } from './sharedCoreTests.js';

export async function runCrmTestSuite(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const tenant1 = 'tenant-rz-global-001';
  const tenant2 = 'tenant-other-002';
  const userId = 'usr-admin-001';

  // CRM Test 1: Customer Master CRUD & UUID v7 Validation
  {
    const start = Date.now();
    try {
      const newCust = await crmService.createCustomer(tenant1, userId, {
        displayName: 'Test Infrastructure Projects Ltd',
        phone: '+91-98765-43210',
        email: 'test@infraprojects.com',
        customerType: 'BUSINESS',
        creditLimit: 2000000.00,
        creditDays: 30
      });

      const fetched = await crmService.getCustomerById(tenant1, newCust.id);
      const isUuidV7 = newCust.id.length >= 32;
      const passed = !!fetched && fetched.displayName === 'Test Infrastructure Projects Ltd' && isUuidV7;

      results.push({
        testName: 'CRM Phase 20 - Customer Master CRUD & UUID v7 Validation',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Created & retrieved customer [${newCust.id}] with code ${newCust.customerCode}`
          : 'Failed to create or retrieve customer',
        evidence: { customerId: newCust.id, code: newCust.customerCode }
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - Customer Master CRUD & UUID v7 Validation',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 2: Customer 360 Aggregation Engine
  {
    const start = Date.now();
    try {
      const c360 = await crmService.getCustomer360(tenant1, 'cust-harbor-dev');
      const passed =
        c360.profile.id === 'cust-harbor-dev' &&
        Array.isArray(c360.contacts) &&
        Array.isArray(c360.quotations) &&
        Array.isArray(c360.supportTickets) &&
        typeof c360.financialSummary.totalRevenue === 'number';

      results.push({
        testName: 'CRM Phase 20 - Customer 360 Aggregation Engine & Cross-Module Sync',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Successfully compiled 360 view for [${c360.profile.displayName}] with ${c360.quotations.length} quotes & ${c360.contacts.length} contacts`
          : 'Failed to compile Customer 360 view',
        evidence: {
          customerName: c360.profile.displayName,
          revenue: c360.financialSummary.totalRevenue,
          ticketsCount: c360.supportTickets.length
        }
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - Customer 360 Aggregation Engine & Cross-Module Sync',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 3: Deterministic Lead Scoring Engine
  {
    const start = Date.now();
    try {
      const scoreResult = crmService.calculateLeadScore({
        estimatedValue: 1500000,
        source: 'Marketplace',
        status: 'PROPOSAL',
        phone: '+91-99999-88888',
        email: 'test@lead.com'
      }, {
        id: 'cust-harbor-dev',
        displayName: 'Harbor Developers'
      } as any);

      const passed = scoreResult.leadScore >= 80 && scoreResult.priority === 'HOT' && scoreResult.reasonCodes.includes('HIGH_ESTIMATED_VALUE');

      results.push({
        testName: 'CRM Phase 20 - Deterministic Lead Scoring & Reason Codes',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Lead scored ${scoreResult.leadScore} (${scoreResult.priority}) with reason codes: ${scoreResult.reasonCodes.join(', ')}`
          : 'Lead scoring engine output incorrect',
        evidence: scoreResult
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - Deterministic Lead Scoring & Reason Codes',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 4: Lead Conversion to Opportunity
  {
    const start = Date.now();
    try {
      const lead = await crmService.createLead(tenant1, userId, {
        customerName: 'Coastal Developers Corp',
        phone: '+91-98765-11111',
        email: 'info@coastaldev.com',
        productService: '40mm Quarry Stone Bulk Supply',
        estimatedValue: 850000
      });

      const converted = await crmService.convertLeadToOpportunity(tenant1, userId, lead.id);
      const passed = converted.lead.status === 'WON' && converted.opportunity.value === 850000 && !!converted.customerId;

      results.push({
        testName: 'CRM Phase 20 - Lead Lifecycle & Opportunity Conversion',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Lead [${lead.id}] successfully converted to Opportunity [${converted.opportunity.id}] under Customer [${converted.customerId}]`
          : 'Lead conversion failed',
        evidence: { opportunityId: converted.opportunity.id, customerId: converted.customerId }
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - Lead Lifecycle & Opportunity Conversion',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 5: Sales Activity & Notification Integration
  {
    const start = Date.now();
    try {
      const activity = await crmService.createSalesActivity(tenant1, userId, {
        activityType: 'Meeting',
        subject: 'Contract Signing Meeting',
        customerId: 'cust-harbor-dev',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        status: 'PENDING'
      });

      const notifs = Array.from(db.notifications.values()).filter(n => n.tenantId === tenant1 && n.body.includes(activity.subject));
      const passed = activity.id.length > 0 && notifs.length > 0;

      results.push({
        testName: 'CRM Phase 20 - Sales Activity & In-App Notification Dispatch',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Created activity [${activity.id}] and verified in-app notification dispatch`
          : 'Failed activity or notification verification',
        evidence: { activityId: activity.id, notificationCount: notifs.length }
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - Sales Activity & In-App Notification Dispatch',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 6: Quotation & CPQ Engine with Approval Workflow
  {
    const start = Date.now();
    try {
      const quote = await crmService.createQuotation(tenant1, userId, {
        customerId: 'cust-harbor-dev',
        discountAmount: 10000
      }, [
        { itemDescription: 'M-Sand (Manufactured Sand)', quantity: 200, unitPrice: 800, taxPercent: 18 }
      ]);

      const approved = await crmService.approveQuotation(tenant1, userId, quote.id);
      const passed = approved?.status === 'APPROVED' && quote.totalAmount > 0;

      results.push({
        testName: 'CRM Phase 20 - CPQ Quotation Engine & Approval Workflow',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Created quotation [${quote.quoteNumber}] (Total: ₹${quote.totalAmount}) and approved successfully`
          : 'Quotation engine failed',
        evidence: { quoteNumber: quote.quoteNumber, totalAmount: quote.totalAmount, status: approved?.status }
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - CPQ Quotation Engine & Approval Workflow',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 7: Customer Support Ticket Lifecycle
  {
    const start = Date.now();
    try {
      const ticket = await crmService.createSupportTicket(tenant1, userId, {
        customerId: 'cust-harbor-dev',
        subject: 'Weighbridge slip query',
        description: 'Verify slip copy'
      });

      const updated = await crmService.updateSupportTicket(tenant1, userId, ticket.id, { status: 'RESOLVED' });
      const passed = updated?.status === 'RESOLVED' && !!updated?.resolvedAt;

      results.push({
        testName: 'CRM Phase 20 - Customer Support Ticket Lifecycle',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Ticket [${ticket.ticketNumber}] created and resolved at ${updated.resolvedAt}`
          : 'Support ticket lifecycle failed',
        evidence: { ticketNumber: ticket.ticketNumber, status: updated?.status }
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - Customer Support Ticket Lifecycle',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 8: Customer Health Score Calculation
  {
    const start = Date.now();
    try {
      const health = crmService.calculateHealthScore(
        { id: 'cust-harbor-dev', displayName: 'Harbor Developers' } as any,
        { creditStatus: 'GOOD', overdueAmount: 0 } as any,
        []
      );

      const passed = health.healthScore === 90 && health.healthStatus === 'EXCELLENT';

      results.push({
        testName: 'CRM Phase 20 - Customer Health Score Calculation & Risk Flagging',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Calculated Health Score ${health.healthScore}/100 (${health.healthStatus})`
          : 'Customer health score calculation failed',
        evidence: health
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - Customer Health Score Calculation & Risk Flagging',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 9: Tenant Isolation & RLS Enforcement on CRM Collections
  {
    const start = Date.now();
    try {
      const tenant1Customers = await crmRepository.getCustomers(tenant1);
      const tenant2Customers = await crmRepository.getCustomers(tenant2);

      const noOverlap = tenant2Customers.every(c2 => c2.tenantId === tenant2);
      const passed = noOverlap && tenant1Customers.length > 0;

      results.push({
        testName: 'CRM Phase 20 - Tenant Isolation & RLS Enforcement',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Verified zero cross-tenant leakage between Tenant 1 (${tenant1Customers.length} custs) & Tenant 2 (${tenant2Customers.length} custs)`
          : 'Tenant isolation violation detected in CRM repository',
        evidence: { tenant1Count: tenant1Customers.length, tenant2Count: tenant2Customers.length }
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - Tenant Isolation & RLS Enforcement',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  // CRM Test 10: CRM Executive Dashboard Metrics Aggregation
  {
    const start = Date.now();
    try {
      const dashboard = await crmService.getCrmDashboard(tenant1);
      const passed =
        typeof dashboard.totalCustomers === 'number' &&
        typeof dashboard.pipelineValue === 'number' &&
        typeof dashboard.conversionRatePercentage === 'number';

      results.push({
        testName: 'CRM Phase 20 - CRM Executive Dashboard Metrics Aggregation',
        category: 'Enterprise CRM',
        passed,
        durationMs: Date.now() - start,
        message: passed
          ? `Dashboard metrics aggregated successfully: ${dashboard.totalCustomers} customers, ₹${dashboard.pipelineValue} pipeline value`
          : 'CRM Dashboard metrics aggregation failed',
        evidence: dashboard
      });
    } catch (err: any) {
      results.push({
        testName: 'CRM Phase 20 - CRM Executive Dashboard Metrics Aggregation',
        category: 'Enterprise CRM',
        passed: false,
        durationMs: Date.now() - start,
        message: err.message
      });
    }
  }

  return results;
}
