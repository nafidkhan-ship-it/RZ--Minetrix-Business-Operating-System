import { crmRepository } from '../repositories/crmRepositories.ts';
import { db, generateUuidV7 } from '../db/database.ts';
import {
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
  AuditLog,
  Notification
} from '../db/schema.ts';

export class CrmService {

  // ==========================================
  // AUDIT LOGGING HELPER
  // ==========================================
  private logAudit(tenantId: string, userId: string, action: string, resource: string, resourceId: string, details: any) {
    const audit: AuditLog = {
      id: generateUuidV7(),
      tenantId,
      actorUserId: userId,
      actorEmail: 'sales.user@racezoneventures.com',
      action,
      module: 'CRM',
      resource,
      resourceId,
      ipAddress: '127.0.0.1',
      correlationId: `corr-${generateUuidV7().slice(0, 8)}`,
      status: 'SUCCESS',
      afterStateJson: JSON.stringify(details),
      createdAt: new Date().toISOString()
    };
    db.auditLogs.set(audit.id, audit);
  }

  // ==========================================
  // NOTIFICATION HELPER
  // ==========================================
  private sendNotification(tenantId: string, recipientUserId: string, title: string, message: string, channel: 'IN_APP' | 'EMAIL' | 'WHATSAPP' | 'PUSH' = 'IN_APP') {
    const notif: Notification = {
      id: generateUuidV7(),
      tenantId,
      recipientUserId,
      channel,
      title,
      body: message,
      type: 'INFO',
      isRead: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.set(notif.id, notif);
  }

  // ==========================================
  // CUSTOMER MASTER CRUD
  // ==========================================
  public async getCustomers(tenantId: string, filters?: { status?: string; search?: string; customerType?: string }) {
    return crmRepository.getCustomers(tenantId, filters);
  }

  public async getCustomerById(tenantId: string, id: string) {
    return crmRepository.getCustomerById(tenantId, id);
  }

  public async createCustomer(tenantId: string, userId: string, customerData: Partial<CrmCustomer>) {
    const customer = await crmRepository.createCustomer(tenantId, customerData);
    this.logAudit(tenantId, userId, 'CRM_CUSTOMER_CREATED', 'CRM_CUSTOMER', customer.id, { customerCode: customer.customerCode, name: customer.displayName });
    return customer;
  }

  public async updateCustomer(tenantId: string, userId: string, id: string, updates: Partial<CrmCustomer>) {
    const updated = await crmRepository.updateCustomer(tenantId, id, updates);
    if (updated) {
      this.logAudit(tenantId, userId, 'CRM_CUSTOMER_UPDATED', 'CRM_CUSTOMER', updated.id, updates);
    }
    return updated;
  }

  public async deleteCustomer(tenantId: string, userId: string, id: string) {
    const success = await crmRepository.deleteCustomer(tenantId, id);
    if (success) {
      this.logAudit(tenantId, userId, 'CRM_CUSTOMER_DELETED', 'CRM_CUSTOMER', id, { deletedId: id });
    }
    return success;
  }

  // ==========================================
  // CUSTOMER 360 AGGREGATION ENGINE
  // ==========================================
  public async getCustomer360(tenantId: string, customerId: string) {
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

    // Cross-module integration with Marketplace Loads
    const marketplaceLoads = Array.from(db.loadRequests.values()).filter(l => l.tenantId === tenantId && (l.customerId === customerId || l.customerName.toLowerCase().includes(customer.displayName.toLowerCase())));
    const marketplaceBookings = Array.from(db.loadBookings.values()).filter(b => b.tenantId === tenantId && marketplaceLoads.some(l => l.id === b.loadId));

    // Cross-module integration with Fleet Deliveries
    const fleetTrips = Array.from(db.fleetTrips.values()).filter(t => t.tenantId === tenantId);

    // Cross-module integration with Audit Logs
    const auditHistory = Array.from(db.auditLogs.values()).filter(a => a.tenantId === tenantId && (a.resourceId === customerId || a.afterStateJson?.includes(customerId)));

    // Cross-module integration with RZ Chat History references
    const rzChatReferences = Array.from(db.notifications.values()).filter(n => n.tenantId === tenantId && n.body.toLowerCase().includes(customer.displayName.toLowerCase()));

    const totalRevenue = quotations.filter(q => q.status === 'ACCEPTED' || q.status === 'APPROVED').reduce((acc, q) => acc + q.totalAmount, 0);

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
        creditStatus: 'GOOD'
      },
      documents,
      supportTickets,
      activities,
      health: health || {
        healthScore: 88,
        healthStatus: 'EXCELLENT',
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
        totalTripsDelivered: fleetTrips.filter(t => t.status === 'COMPLETED').length,
        trips: fleetTrips.slice(0, 5)
      },
      financialSummary: {
        totalRevenue,
        outstandingBalance: credit?.outstandingBalance || 0,
        availableCredit: credit?.availableCredit || customer.creditLimit,
        creditStatus: credit?.creditStatus || 'GOOD'
      },
      rzChatReferences,
      auditHistory: auditHistory.slice(0, 10)
    };
  }

  // ==========================================
  // DETERMINISTIC LEAD SCORING & LIFECYCLE
  // ==========================================
  public calculateLeadScore(lead: Partial<CrmLead>, customerProfile?: CrmCustomer | null) {
    let score = 50;
    const reasonCodes: string[] = ['BASE_SCORE_ASSIGNED'];

    if (customerProfile) {
      score += 15;
      reasonCodes.push('EXISTING_REGISTERED_CUSTOMER');
    }

    if ((lead.estimatedValue || 0) >= 1000000) {
      score += 20;
      reasonCodes.push('HIGH_ESTIMATED_VALUE');
    } else if ((lead.estimatedValue || 0) >= 500000) {
      score += 10;
      reasonCodes.push('MEDIUM_ESTIMATED_VALUE');
    }

    if (lead.source === 'Marketplace' || lead.source === 'Referral') {
      score += 15;
      reasonCodes.push('HIGH_INTENT_SOURCE');
    } else if (lead.source === 'Website') {
      score += 10;
      reasonCodes.push('INBOUND_WEBSITE_LEAD');
    }

    if (lead.phone && lead.email) {
      score += 10;
      reasonCodes.push('COMPLETE_CONTACT_DETAILS');
    }

    if (lead.status === 'PROPOSAL' || lead.status === 'NEGOTIATION') {
      score += 15;
      reasonCodes.push('ADVANCED_PIPELINE_STAGE');
    }

    const leadScore = Math.min(100, Math.max(0, score));
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'HOT' = 'MEDIUM';
    if (leadScore >= 85) priority = 'HOT';
    else if (leadScore >= 70) priority = 'HIGH';
    else if (leadScore >= 50) priority = 'MEDIUM';
    else priority = 'LOW';

    return { leadScore, priority, reasonCodes };
  }

  public async createLead(tenantId: string, userId: string, leadData: Partial<CrmLead>) {
    let customer: CrmCustomer | null = null;
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

    this.logAudit(tenantId, userId, 'CRM_LEAD_CREATED', 'CRM_LEAD', lead.id, { customerName: lead.customerName, score: leadScore });
    this.sendNotification(tenantId, userId, 'New Lead Captured', `Lead [${lead.customerName}] assigned with score ${leadScore} (${priority})`);
    return lead;
  }

  public async convertLeadToOpportunity(tenantId: string, userId: string, leadId: string) {
    const lead = await crmRepository.getLeadById(tenantId, leadId);
    if (!lead) throw new Error(`Lead [${leadId}] not found`);

    let customerId = lead.customerId;
    if (!customerId) {
      const newCust = await crmRepository.createCustomer(tenantId, {
        displayName: lead.customerName,
        phone: lead.phone,
        email: lead.email || `contact@${lead.customerName.toLowerCase().replace(/\s+/g, '')}.com`,
        status: 'ACTIVE',
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
      stage: 'QUALIFIED',
      expectedCloseDate: lead.expectedCloseDate,
      salesOwner: userId || lead.assignedUser,
      productsServices: [lead.productService],
      notes: `Converted from Lead [${lead.id}]`
    });

    const updatedLead = await crmRepository.updateLead(tenantId, leadId, {
      status: 'WON',
      customerId
    });

    this.logAudit(tenantId, userId, 'CRM_LEAD_CONVERTED', 'CRM_LEAD', leadId, { opportunityId: opportunity.id, customerId });
    return { lead: updatedLead || { ...lead, status: 'WON', customerId }, opportunity, customerId };
  }

  // ==========================================
  // OPPORTUNITIES & ACTIVITIES
  // ==========================================
  public async getOpportunities(tenantId: string, filters?: { stage?: string; customerId?: string }) {
    return crmRepository.getOpportunities(tenantId, filters);
  }

  public async createOpportunity(tenantId: string, userId: string, oppData: Partial<CrmOpportunity>) {
    const opp = await crmRepository.createOpportunity(tenantId, oppData);
    this.logAudit(tenantId, userId, 'CRM_OPPORTUNITY_CREATED', 'CRM_OPPORTUNITY', opp.id, { title: opp.title, value: opp.value });
    return opp;
  }

  public async updateOpportunity(tenantId: string, userId: string, id: string, updates: Partial<CrmOpportunity>) {
    const updated = await crmRepository.updateOpportunity(tenantId, id, updates);
    if (updated) {
      this.logAudit(tenantId, userId, 'CRM_OPPORTUNITY_UPDATED', 'CRM_OPPORTUNITY', id, updates);
    }
    return updated;
  }

  public async createSalesActivity(tenantId: string, userId: string, activityData: Partial<CrmSalesActivity>) {
    const activity = await crmRepository.createSalesActivity(tenantId, activityData);
    this.logAudit(tenantId, userId, 'CRM_ACTIVITY_CREATED', 'CRM_ACTIVITY', activity.id, { subject: activity.subject });

    if (activity.dueDate) {
      this.sendNotification(tenantId, userId, 'Sales Follow-up Scheduled', `Follow-up [${activity.subject}] scheduled for ${activity.dueDate}`);
    }
    return activity;
  }

  // ==========================================
  // QUOTATIONS & CUSTOMER ORDERS
  // ==========================================
  public async getQuotations(tenantId: string, filters?: { customerId?: string; status?: string }) {
    return crmRepository.getQuotations(tenantId, filters);
  }

  public async createQuotation(tenantId: string, userId: string, quoteData: Partial<CrmQuotation>, itemsData?: Array<Partial<CrmQuotationItem>>) {
    // Credit Limit Check
    if (quoteData.customerId) {
      const credit = await crmRepository.getCustomerCredit(tenantId, quoteData.customerId);
      if (credit && credit.creditStatus === 'BLOCKED') {
        throw new Error(`Customer [${quoteData.customerId}] is BLOCKED for credit. Quotation cannot be issued without override.`);
      }
    }

    const quotation = await crmRepository.createQuotation(tenantId, quoteData, itemsData);
    this.logAudit(tenantId, userId, 'CRM_QUOTATION_CREATED', 'CRM_QUOTATION', quotation.id, { quoteNumber: quotation.quoteNumber, total: quotation.totalAmount });
    return quotation;
  }

  public async approveQuotation(tenantId: string, userId: string, quoteId: string) {
    const quote = await crmRepository.getQuotationById(tenantId, quoteId);
    if (!quote) throw new Error(`Quotation [${quoteId}] not found`);

    const updated = await crmRepository.updateQuotation(tenantId, quoteId, {
      status: 'APPROVED'
    });

    this.logAudit(tenantId, userId, 'CRM_QUOTATION_APPROVED', 'CRM_QUOTATION', quoteId, { quoteNumber: quote.quoteNumber });
    this.sendNotification(tenantId, userId, 'Quotation Approved', `Quotation [${quote.quoteNumber}] has been approved successfully.`);
    return updated;
  }

  // ==========================================
  // SUPPORT TICKETS
  // ==========================================
  public async getSupportTickets(tenantId: string, filters?: { customerId?: string; status?: string }) {
    return crmRepository.getSupportTickets(tenantId, filters);
  }

  public async createSupportTicket(tenantId: string, userId: string, ticketData: Partial<CrmSupportTicket>) {
    const ticket = await crmRepository.createSupportTicket(tenantId, ticketData);
    this.logAudit(tenantId, userId, 'CRM_TICKET_CREATED', 'CRM_TICKET', ticket.id, { ticketNumber: ticket.ticketNumber });
    return ticket;
  }

  public async updateSupportTicket(tenantId: string, userId: string, id: string, updates: Partial<CrmSupportTicket>) {
    const updated = await crmRepository.updateSupportTicket(tenantId, id, updates);
    if (updated) {
      this.logAudit(tenantId, userId, 'CRM_TICKET_UPDATED', 'CRM_TICKET', id, updates);
    }
    return updated;
  }

  // ==========================================
  // CUSTOMER HEALTH SCORE CALCULATION
  // ==========================================
  public calculateHealthScore(customer: CrmCustomer, credit?: CrmCustomerCredit | null, tickets?: CrmSupportTicket[]) {
    let score = 90;
    const riskFlags: string[] = [];

    if (credit) {
      if (credit.creditStatus === 'BLOCKED') {
        score -= 40;
        riskFlags.push('CREDIT_BLOCKED');
      } else if (credit.creditStatus === 'WARNING') {
        score -= 20;
        riskFlags.push('CREDIT_WARNING');
      }

      if (credit.overdueAmount > 0) {
        score -= 15;
        riskFlags.push('OVERDUE_PAYMENTS');
      }
    }

    if (tickets && tickets.length > 0) {
      const openTickets = tickets.filter(t => t.status !== 'RESOLVED' && t.status !== 'CLOSED');
      if (openTickets.length >= 3) {
        score -= 20;
        riskFlags.push('MULTIPLE_UNRESOLVED_TICKETS');
      }
    }

    const healthScore = Math.min(100, Math.max(0, score));
    let healthStatus: 'EXCELLENT' | 'GOOD' | 'NEUTRAL' | 'AT_RISK' | 'CRITICAL' = 'EXCELLENT';
    if (healthScore >= 85) healthStatus = 'EXCELLENT';
    else if (healthScore >= 70) healthStatus = 'GOOD';
    else if (healthScore >= 50) healthStatus = 'NEUTRAL';
    else if (healthScore >= 30) healthStatus = 'AT_RISK';
    else healthStatus = 'CRITICAL';

    return { healthScore, healthStatus, riskFlags };
  }

  // ==========================================
  // CRM DASHBOARD METRICS
  // ==========================================
  public async getCrmDashboard(tenantId: string) {
    const customers = await crmRepository.getCustomers(tenantId);
    const leads = await crmRepository.getLeads(tenantId);
    const opportunities = await crmRepository.getOpportunities(tenantId);
    const quotations = await crmRepository.getQuotations(tenantId);
    const activities = await crmRepository.getSalesActivities(tenantId);
    const supportTickets = await crmRepository.getSupportTickets(tenantId);

    const activeCustomers = customers.filter(c => c.status === 'ACTIVE').length;
    const newCustomers = customers.filter(c => new Date(c.createdAt).getTime() > Date.now() - 30 * 86400000).length;

    const openOpportunities = opportunities.filter(o => o.status === 'OPEN');
    const pipelineValue = openOpportunities.reduce((acc, o) => acc + o.value, 0);
    const wonRevenue = opportunities.filter(o => o.stage === 'WON' || o.status === 'WON').reduce((acc, o) => acc + o.value, 0);

    const pendingFollowups = activities.filter(a => a.status === 'PENDING').length;
    const overdueFollowups = activities.filter(a => a.status === 'PENDING' && a.dueDate && new Date(a.dueDate).getTime() < Date.now()).length;

    const conversionRate = leads.length > 0 ? Math.round((leads.filter(l => l.status === 'WON').length / leads.length) * 100) : 0;

    const totalOutstanding = Array.from(db.crmCustomerCredit.values())
      .filter(c => c.tenantId === tenantId)
      .reduce((acc, c) => acc + c.outstandingBalance, 0);

    return {
      totalCustomers: customers.length,
      activeCustomers,
      newCustomers,
      totalLeads: leads.length,
      qualifiedLeads: leads.filter(l => l.status === 'QUALIFIED' || l.status === 'PROPOSAL').length,
      openOpportunitiesCount: openOpportunities.length,
      pipelineValue,
      wonRevenue,
      conversionRatePercentage: conversionRate,
      pendingFollowupsCount: pendingFollowups,
      overdueFollowupsCount: overdueFollowups,
      totalCustomerOutstanding: totalOutstanding,
      openSupportTicketsCount: supportTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length,
      pipelineDistribution: {
        lead: opportunities.filter(o => o.stage === 'LEAD').length,
        qualified: opportunities.filter(o => o.stage === 'QUALIFIED').length,
        discovery: opportunities.filter(o => o.stage === 'DISCOVERY').length,
        proposal: opportunities.filter(o => o.stage === 'PROPOSAL').length,
        negotiation: opportunities.filter(o => o.stage === 'NEGOTIATION').length,
        won: opportunities.filter(o => o.stage === 'WON').length,
        lost: opportunities.filter(o => o.stage === 'LOST').length
      }
    };
  }
}

export const crmService = new CrmService();
