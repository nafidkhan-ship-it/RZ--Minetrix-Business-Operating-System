import { db, generateUuidV7 } from '../db/database.js';
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
  CrmCustomerNote
} from '../db/schema.js';

export class CrmRepository {
  // CUSTOMERS
  public async getCustomers(tenantId: string, filters?: { status?: string; search?: string; customerType?: string }): Promise<CrmCustomer[]> {
    let list = Array.from(db.crmCustomers.values()).filter(c => c.tenantId === tenantId);
    if (filters?.status) {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters?.customerType) {
      list = list.filter(c => c.customerType === filters.customerType);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(c =>
        c.displayName.toLowerCase().includes(q) ||
        c.customerCode.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public async getCustomerById(tenantId: string, id: string): Promise<CrmCustomer | null> {
    const cust = db.crmCustomers.get(id);
    if (cust && cust.tenantId === tenantId) return cust;
    return null;
  }

  public async createCustomer(tenantId: string, data: Partial<CrmCustomer>): Promise<CrmCustomer> {
    const now = new Date().toISOString();
    const count = db.crmCustomers.size + 1;
    const customerCode = data.customerCode || `CUST-2026-${String(count).padStart(3, '0')}`;
    const id = generateUuidV7();

    const customer: CrmCustomer = {
      id,
      tenantId,
      customerType: data.customerType || 'BUSINESS',
      businessId: data.businessId,
      displayName: data.displayName || 'Unnamed Enterprise Customer',
      legalName: data.legalName || data.displayName,
      customerCode,
      phone: data.phone || '+91-00000-00000',
      email: data.email || 'contact@customer.com',
      address: data.address || 'Address Not Provided',
      city: data.city || 'Mangalore',
      district: data.district,
      state: data.state || 'Karnataka',
      country: data.country || 'India',
      taxIdentifier: data.taxIdentifier,
      creditLimit: data.creditLimit ?? 500000.00,
      creditDays: data.creditDays ?? 30,
      status: data.status || 'ACTIVE',
      source: data.source || 'Direct',
      assignedSalesUser: data.assignedSalesUser,
      createdAt: now,
      updatedAt: now,
      version: 1
    };

    db.crmCustomers.set(id, customer);

    // Initialize Default Credit Control
    const credit: CrmCustomerCredit = {
      id: generateUuidV7(),
      tenantId,
      customerId: id,
      creditLimit: customer.creditLimit,
      creditDays: customer.creditDays,
      outstandingBalance: 0.00,
      availableCredit: customer.creditLimit,
      overdueAmount: 0.00,
      creditStatus: 'GOOD',
      lastReviewedAt: now,
      createdAt: now,
      updatedAt: now
    };
    db.crmCustomerCredit.set(credit.id, credit);

    // Initialize Default Health Control
    const health: CrmCustomerHealth = {
      id: generateUuidV7(),
      tenantId,
      customerId: id,
      healthScore: 85,
      healthStatus: 'GOOD',
      riskFlags: [],
      factorsJson: JSON.stringify({ onboardingStatus: 'NEW_CUSTOMER' }),
      calculatedAt: now
    };
    db.crmCustomerHealth.set(health.id, health);

    db.persistToDisk();
    return customer;
  }

  public async updateCustomer(tenantId: string, id: string, updates: Partial<CrmCustomer>): Promise<CrmCustomer | null> {
    const existing = await this.getCustomerById(tenantId, id);
    if (!existing) return null;

    const updated: CrmCustomer = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: (existing.version || 1) + 1
    };
    db.crmCustomers.set(id, updated);
    db.persistToDisk();
    return updated;
  }

  public async deleteCustomer(tenantId: string, id: string): Promise<boolean> {
    const existing = await this.getCustomerById(tenantId, id);
    if (!existing) return false;
    db.crmCustomers.delete(id);
    db.persistToDisk();
    return true;
  }

  // CONTACTS
  public async getContacts(tenantId: string, customerId: string): Promise<CrmContact[]> {
    return Array.from(db.crmContacts.values()).filter(c => c.tenantId === tenantId && c.customerId === customerId);
  }

  public async createContact(tenantId: string, data: Partial<CrmContact>): Promise<CrmContact> {
    const now = new Date().toISOString();
    const id = generateUuidV7();
    const contact: CrmContact = {
      id,
      tenantId,
      customerId: data.customerId || '',
      businessId: data.businessId,
      name: data.name || 'Unnamed Contact',
      designation: data.designation || 'Representative',
      phone: data.phone || '+91-00000-00000',
      email: data.email || 'contact@domain.com',
      whatsapp: data.whatsapp || data.phone,
      isPrimary: data.isPrimary ?? false,
      preferredLanguage: data.preferredLanguage || 'English',
      notes: data.notes,
      status: data.status || 'ACTIVE',
      createdAt: now,
      updatedAt: now
    };
    db.crmContacts.set(id, contact);
    db.persistToDisk();
    return contact;
  }

  public async updateContact(tenantId: string, id: string, updates: Partial<CrmContact>): Promise<CrmContact | null> {
    const existing = db.crmContacts.get(id);
    if (!existing || existing.tenantId !== tenantId) return null;
    const updated: CrmContact = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    db.crmContacts.set(id, updated);
    db.persistToDisk();
    return updated;
  }

  // LEADS
  public async getLeads(tenantId: string, filters?: { status?: string; source?: string; search?: string }): Promise<CrmLead[]> {
    let list = Array.from(db.crmLeads.values()).filter(l => l.tenantId === tenantId);
    if (filters?.status) list = list.filter(l => l.status === filters.status);
    if (filters?.source) list = list.filter(l => l.source === filters.source as any);
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(l => l.customerName.toLowerCase().includes(q) || l.productService.toLowerCase().includes(q) || l.phone.includes(q));
    }
    return list;
  }

  public async getLeadById(tenantId: string, id: string): Promise<CrmLead | null> {
    const lead = db.crmLeads.get(id);
    if (lead && lead.tenantId === tenantId) return lead;
    return null;
  }

  public async createLead(tenantId: string, data: Partial<CrmLead>): Promise<CrmLead> {
    const now = new Date().toISOString();
    const id = generateUuidV7();
    const lead: CrmLead = {
      id,
      tenantId,
      customerId: data.customerId,
      customerName: data.customerName || 'Prospect Buyer',
      phone: data.phone || '+91-00000-00000',
      email: data.email,
      source: data.source || 'Website',
      campaign: data.campaign,
      productService: data.productService || 'Construction Material Supply',
      estimatedValue: data.estimatedValue ?? 100000.00,
      probability: data.probability ?? 20,
      expectedCloseDate: data.expectedCloseDate || new Date(Date.now() + 604800000).toISOString().split('T')[0],
      assignedUser: data.assignedUser,
      notes: data.notes,
      status: data.status || 'NEW',
      leadScore: data.leadScore ?? 50,
      priority: data.priority || 'MEDIUM',
      reasonCodes: data.reasonCodes || ['INBOUND_LEAD_CREATED'],
      createdAt: now,
      updatedAt: now
    };
    db.crmLeads.set(id, lead);
    db.persistToDisk();
    return lead;
  }

  public async updateLead(tenantId: string, id: string, updates: Partial<CrmLead>): Promise<CrmLead | null> {
    const existing = await this.getLeadById(tenantId, id);
    if (!existing) return null;
    const updated: CrmLead = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    db.crmLeads.set(id, updated);
    db.persistToDisk();
    return updated;
  }

  // OPPORTUNITIES
  public async getOpportunities(tenantId: string, filters?: { stage?: string; customerId?: string }): Promise<CrmOpportunity[]> {
    let list = Array.from(db.crmOpportunities.values()).filter(o => o.tenantId === tenantId);
    if (filters?.stage) list = list.filter(o => o.stage === filters.stage as any);
    if (filters?.customerId) list = list.filter(o => o.customerId === filters.customerId);
    return list;
  }

  public async getOpportunityById(tenantId: string, id: string): Promise<CrmOpportunity | null> {
    const opp = db.crmOpportunities.get(id);
    if (opp && opp.tenantId === tenantId) return opp;
    return null;
  }

  public async createOpportunity(tenantId: string, data: Partial<CrmOpportunity>): Promise<CrmOpportunity> {
    const now = new Date().toISOString();
    const id = generateUuidV7();
    const opp: CrmOpportunity = {
      id,
      tenantId,
      customerId: data.customerId || '',
      leadId: data.leadId,
      title: data.title || 'New Material Deal Opportunity',
      value: data.value ?? 500000.00,
      probability: data.probability ?? 50,
      stage: data.stage || 'DISCOVERY',
      expectedCloseDate: data.expectedCloseDate || new Date(Date.now() + 1209600000).toISOString().split('T')[0],
      salesOwner: data.salesOwner,
      productsServices: data.productsServices || ['20mm Aggregate Stone'],
      competitors: data.competitors,
      nextAction: data.nextAction,
      notes: data.notes,
      status: data.status || 'OPEN',
      createdAt: now,
      updatedAt: now
    };
    db.crmOpportunities.set(id, opp);
    db.persistToDisk();
    return opp;
  }

  public async updateOpportunity(tenantId: string, id: string, updates: Partial<CrmOpportunity>): Promise<CrmOpportunity | null> {
    const existing = await this.getOpportunityById(tenantId, id);
    if (!existing) return null;
    const updated: CrmOpportunity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    db.crmOpportunities.set(id, updated);
    db.persistToDisk();
    return updated;
  }

  // SALES ACTIVITIES
  public async getSalesActivities(tenantId: string, filters?: { customerId?: string; leadId?: string; status?: string }): Promise<CrmSalesActivity[]> {
    let list = Array.from(db.crmSalesActivities.values()).filter(a => a.tenantId === tenantId);
    if (filters?.customerId) list = list.filter(a => a.customerId === filters.customerId);
    if (filters?.leadId) list = list.filter(a => a.leadId === filters.leadId);
    if (filters?.status) list = list.filter(a => a.status === filters.status as any);
    return list;
  }

  public async createSalesActivity(tenantId: string, data: Partial<CrmSalesActivity>): Promise<CrmSalesActivity> {
    const now = new Date().toISOString();
    const id = generateUuidV7();
    const activity: CrmSalesActivity = {
      id,
      tenantId,
      activityType: data.activityType || 'Call',
      subject: data.subject || 'Client Follow-Up',
      customerId: data.customerId,
      leadId: data.leadId,
      opportunityId: data.opportunityId,
      assignedUser: data.assignedUser,
      dueDate: data.dueDate,
      completedAt: data.completedAt,
      status: data.status || 'PENDING',
      priority: data.priority || 'MEDIUM',
      notes: data.notes,
      createdAt: now,
      updatedAt: now
    };
    db.crmSalesActivities.set(id, activity);
    db.persistToDisk();
    return activity;
  }

  public async updateSalesActivity(tenantId: string, id: string, updates: Partial<CrmSalesActivity>): Promise<CrmSalesActivity | null> {
    const existing = db.crmSalesActivities.get(id);
    if (!existing || existing.tenantId !== tenantId) return null;
    const updated: CrmSalesActivity = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    db.crmSalesActivities.set(id, updated);
    db.persistToDisk();
    return updated;
  }

  // QUOTATIONS
  public async getQuotations(tenantId: string, filters?: { customerId?: string; status?: string }): Promise<CrmQuotation[]> {
    let list = Array.from(db.crmQuotations.values()).filter(q => q.tenantId === tenantId);
    if (filters?.customerId) list = list.filter(q => q.customerId === filters.customerId);
    if (filters?.status) list = list.filter(q => q.status === filters.status as any);
    return list;
  }

  public async getQuotationById(tenantId: string, id: string): Promise<CrmQuotation | null> {
    const quote = db.crmQuotations.get(id);
    if (quote && quote.tenantId === tenantId) return quote;
    return null;
  }

  public async createQuotation(tenantId: string, data: Partial<CrmQuotation>, itemsData?: Array<Partial<CrmQuotationItem>>): Promise<CrmQuotation> {
    const now = new Date().toISOString();
    const id = generateUuidV7();
    const count = db.crmQuotations.size + 1;
    const quoteNumber = data.quoteNumber || `QT-2026-${String(count).padStart(4, '0')}`;

    const items: CrmQuotationItem[] = (itemsData || []).map(item => ({
      id: generateUuidV7(),
      tenantId,
      quotationId: id,
      itemDescription: item.itemDescription || 'Material Supply',
      materialId: item.materialId,
      quantity: item.quantity ?? 100,
      unitPrice: item.unitPrice ?? 800,
      taxPercent: item.taxPercent ?? 18,
      totalPrice: (item.quantity ?? 100) * (item.unitPrice ?? 800) * (1 + (item.taxPercent ?? 18) / 100),
      createdAt: now
    }));

    const subtotal = items.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0);
    const discountAmount = data.discountAmount ?? 0;
    const taxAmount = items.reduce((acc, i) => acc + (i.quantity * i.unitPrice * (i.taxPercent / 100)), 0);
    const totalAmount = subtotal - discountAmount + taxAmount;

    const quote: CrmQuotation = {
      id,
      tenantId,
      quoteNumber,
      customerId: data.customerId || '',
      opportunityId: data.opportunityId,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      validityDate: data.validityDate || new Date(Date.now() + 2592000000).toISOString().split('T')[0],
      termsAndConditions: data.termsAndConditions || 'Standard RZ® Minetrix Supply Terms',
      notes: data.notes,
      status: data.status || 'DRAFT',
      version: 1,
      items,
      createdAt: now,
      updatedAt: now
    };

    db.crmQuotations.set(id, quote);
    items.forEach(it => db.crmQuotationItems.set(it.id, it));
    db.persistToDisk();
    return quote;
  }

  public async updateQuotation(tenantId: string, id: string, updates: Partial<CrmQuotation>): Promise<CrmQuotation | null> {
    const existing = await this.getQuotationById(tenantId, id);
    if (!existing) return null;
    const updated: CrmQuotation = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: (existing.version || 1) + 1
    };
    db.crmQuotations.set(id, updated);
    db.persistToDisk();
    return updated;
  }

  // CUSTOMER CREDIT
  public async getCustomerCredit(tenantId: string, customerId: string): Promise<CrmCustomerCredit | null> {
    const list = Array.from(db.crmCustomerCredit.values()).filter(c => c.tenantId === tenantId && c.customerId === customerId);
    return list[0] || null;
  }

  public async updateCustomerCredit(tenantId: string, customerId: string, data: Partial<CrmCustomerCredit>): Promise<CrmCustomerCredit> {
    const existing = await this.getCustomerCredit(tenantId, customerId);
    const now = new Date().toISOString();
    let updated: CrmCustomerCredit;
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
      const limit = data.creditLimit ?? 500000;
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
        creditStatus: data.creditStatus || 'GOOD',
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
  public async getCustomerDocuments(tenantId: string, customerId: string): Promise<CrmCustomerDocument[]> {
    return Array.from(db.crmCustomerDocuments.values()).filter(d => d.tenantId === tenantId && d.customerId === customerId);
  }

  public async createCustomerDocument(tenantId: string, data: Partial<CrmCustomerDocument>): Promise<CrmCustomerDocument> {
    const now = new Date().toISOString();
    const id = generateUuidV7();
    const doc: CrmCustomerDocument = {
      id,
      tenantId,
      customerId: data.customerId || '',
      documentType: data.documentType || 'KYC',
      title: data.title || 'Customer Attachment Document',
      storageRef: data.storageRef || `/documents/${tenantId}/${data.customerId}/${id}.pdf`,
      mimeType: data.mimeType || 'application/pdf',
      sizeBytes: data.sizeBytes ?? 512000,
      uploadedBy: data.uploadedBy || 'system',
      createdAt: now
    };
    db.crmCustomerDocuments.set(id, doc);
    db.persistToDisk();
    return doc;
  }

  // SUPPORT TICKETS
  public async getSupportTickets(tenantId: string, filters?: { customerId?: string; status?: string }): Promise<CrmSupportTicket[]> {
    let list = Array.from(db.crmSupportTickets.values()).filter(t => t.tenantId === tenantId);
    if (filters?.customerId) list = list.filter(t => t.customerId === filters.customerId);
    if (filters?.status) list = list.filter(t => t.status === filters.status as any);
    return list;
  }

  public async getSupportTicketById(tenantId: string, id: string): Promise<CrmSupportTicket | null> {
    const ticket = db.crmSupportTickets.get(id);
    if (ticket && ticket.tenantId === tenantId) return ticket;
    return null;
  }

  public async createSupportTicket(tenantId: string, data: Partial<CrmSupportTicket>): Promise<CrmSupportTicket> {
    const now = new Date().toISOString();
    const id = generateUuidV7();
    const count = db.crmSupportTickets.size + 1;
    const ticketNumber = data.ticketNumber || `TKT-2026-${String(count).padStart(4, '0')}`;

    const ticket: CrmSupportTicket = {
      id,
      tenantId,
      ticketNumber,
      customerId: data.customerId || '',
      subject: data.subject || 'Customer Support Enquiry',
      description: data.description || 'Support ticket details',
      priority: data.priority || 'MEDIUM',
      category: data.category || 'GENERAL',
      assignedUser: data.assignedUser,
      status: data.status || 'OPEN',
      resolvedAt: data.status === 'RESOLVED' ? now : undefined,
      createdAt: now,
      updatedAt: now
    };

    db.crmSupportTickets.set(id, ticket);
    db.persistToDisk();
    return ticket;
  }

  public async updateSupportTicket(tenantId: string, id: string, updates: Partial<CrmSupportTicket>): Promise<CrmSupportTicket | null> {
    const existing = await this.getSupportTicketById(tenantId, id);
    if (!existing) return null;
    const now = new Date().toISOString();
    const updated: CrmSupportTicket = {
      ...existing,
      ...updates,
      resolvedAt: updates.status === 'RESOLVED' ? (existing.resolvedAt || now) : existing.resolvedAt,
      updatedAt: now
    };
    db.crmSupportTickets.set(id, updated);
    db.persistToDisk();
    return updated;
  }

  // SEGMENTS
  public async getCustomerSegments(tenantId: string): Promise<CrmCustomerSegment[]> {
    return Array.from(db.crmCustomerSegments.values()).filter(s => s.tenantId === tenantId);
  }

  // HEALTH
  public async getCustomerHealth(tenantId: string, customerId: string): Promise<CrmCustomerHealth | null> {
    const list = Array.from(db.crmCustomerHealth.values()).filter(h => h.tenantId === tenantId && h.customerId === customerId);
    return list[0] || null;
  }

  public async updateCustomerHealth(tenantId: string, customerId: string, data: Partial<CrmCustomerHealth>): Promise<CrmCustomerHealth> {
    const existing = await this.getCustomerHealth(tenantId, customerId);
    const now = new Date().toISOString();
    let updated: CrmCustomerHealth;
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
        healthStatus: data.healthStatus || 'GOOD',
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
  public async getCustomerNotes(tenantId: string, customerId: string): Promise<CrmCustomerNote[]> {
    return Array.from(db.crmCustomerNotes.values()).filter(n => n.tenantId === tenantId && n.customerId === customerId);
  }

  public async createCustomerNote(tenantId: string, data: Partial<CrmCustomerNote>): Promise<CrmCustomerNote> {
    const now = new Date().toISOString();
    const id = generateUuidV7();
    const note: CrmCustomerNote = {
      id,
      tenantId,
      customerId: data.customerId || '',
      authorUserId: data.authorUserId || 'system',
      noteText: data.noteText || '',
      isPrivate: data.isPrivate ?? false,
      createdAt: now
    };
    db.crmCustomerNotes.set(id, note);
    db.persistToDisk();
    return note;
  }
}

export const crmRepository = new CrmRepository();
