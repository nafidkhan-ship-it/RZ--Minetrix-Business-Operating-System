/**
 * RZ® Minetrix BOS - Enterprise CRM, Customer 360 & Sales Management Router (Phase 20)
 */

import { Router, Request, Response } from 'express';
import { crmService } from '../services/crmServices.js';
import { crmRepository } from '../repositories/crmRepositories.js';

export const crmRouter = Router();

function getTenantId(req: Request): string {
  return (req as any).tenantContext?.tenantId || (req as any).user?.tenantId || 'tenant-rz-global-001';
}

function getUserId(req: Request): string {
  return (req as any).user?.id || 'usr-admin-001';
}

// 1. Dashboard Metrics
crmRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const metrics = await crmService.getCrmDashboard(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Customer Master CRUD & 360 View
crmRouter.get('/customers', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const search = req.query.search as string;
    const customerType = req.query.customerType as string;
    const customers = await crmService.getCustomers(tenantId, { status, search, customerType });
    res.json({ success: true, data: customers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.get('/customers/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const customer = await crmService.getCustomerById(tenantId, req.params.id);
    if (!customer) return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, data: customer });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.get('/customers/:id/360', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const c360 = await crmService.getCustomer360(tenantId, req.params.id);
    res.json({ success: true, data: c360 });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/customers', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const customer = await crmService.createCustomer(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: customer });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.put('/customers/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const updated = await crmService.updateCustomer(tenantId, userId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.delete('/customers/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const deleted = await crmService.deleteCustomer(tenantId, userId, req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Customer not found' });
    res.json({ success: true, message: 'Customer successfully deleted' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Contacts
crmRouter.get('/customers/:id/contacts', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const contacts = await crmRepository.getContacts(tenantId, req.params.id);
    res.json({ success: true, data: contacts });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/contacts', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const contact = await crmRepository.createContact(tenantId, req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.put('/contacts/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const updated = await crmRepository.updateContact(tenantId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Contact not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. Leads & Lifecycle
crmRouter.get('/leads', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const source = req.query.source as string;
    const search = req.query.search as string;
    const leads = await crmRepository.getLeads(tenantId, { status, source, search });
    res.json({ success: true, data: leads });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.get('/leads/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const lead = await crmRepository.getLeadById(tenantId, req.params.id);
    if (!lead) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/leads', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const lead = await crmService.createLead(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.put('/leads/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const updated = await crmRepository.updateLead(tenantId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Lead not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.post('/leads/:id/convert', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const result = await crmService.convertLeadToOpportunity(tenantId, userId, req.params.id);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. Opportunities / Pipeline
crmRouter.get('/opportunities', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const stage = req.query.stage as string;
    const customerId = req.query.customerId as string;
    const opps = await crmService.getOpportunities(tenantId, { stage, customerId });
    res.json({ success: true, data: opps });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/opportunities', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const opp = await crmService.createOpportunity(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: opp });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.put('/opportunities/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const updated = await crmService.updateOpportunity(tenantId, userId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Opportunity not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Sales Activities
crmRouter.get('/activities', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const customerId = req.query.customerId as string;
    const leadId = req.query.leadId as string;
    const status = req.query.status as string;
    const activities = await crmRepository.getSalesActivities(tenantId, { customerId, leadId, status });
    res.json({ success: true, data: activities });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/activities', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const activity = await crmService.createSalesActivity(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: activity });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.put('/activities/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const updated = await crmRepository.updateSalesActivity(tenantId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Sales Activity not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Quotations
crmRouter.get('/quotations', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const customerId = req.query.customerId as string;
    const status = req.query.status as string;
    const quotes = await crmService.getQuotations(tenantId, { customerId, status });
    res.json({ success: true, data: quotes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.get('/quotations/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const quote = await crmRepository.getQuotationById(tenantId, req.params.id);
    if (!quote) return res.status(404).json({ success: false, error: 'Quotation not found' });
    res.json({ success: true, data: quote });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/quotations', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const quote = await crmService.createQuotation(tenantId, userId, req.body.quotation || req.body, req.body.items);
    res.status(201).json({ success: true, data: quote });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.put('/quotations/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const updated = await crmRepository.updateQuotation(tenantId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Quotation not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.post('/quotations/:id/approve', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const quote = await crmService.approveQuotation(tenantId, userId, req.params.id);
    res.json({ success: true, data: quote });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 8. Credit Control
crmRouter.get('/customers/:id/credit', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const credit = await crmRepository.getCustomerCredit(tenantId, req.params.id);
    res.json({ success: true, data: credit });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.put('/customers/:id/credit', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const credit = await crmRepository.updateCustomerCredit(tenantId, req.params.id, req.body);
    res.json({ success: true, data: credit });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 9. Documents
crmRouter.get('/customers/:id/documents', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const docs = await crmRepository.getCustomerDocuments(tenantId, req.params.id);
    res.json({ success: true, data: docs });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/documents', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const doc = await crmRepository.createCustomerDocument(tenantId, req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 10. Support Tickets
crmRouter.get('/support', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const customerId = req.query.customerId as string;
    const status = req.query.status as string;
    const tickets = await crmService.getSupportTickets(tenantId, { customerId, status });
    res.json({ success: true, data: tickets });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/support', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const ticket = await crmService.createSupportTicket(tenantId, userId, req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

crmRouter.put('/support/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const updated = await crmService.updateSupportTicket(tenantId, userId, req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, error: 'Support ticket not found' });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 11. Segments
crmRouter.get('/segments', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const segments = await crmRepository.getCustomerSegments(tenantId);
    res.json({ success: true, data: segments });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Notes
crmRouter.get('/customers/:id/notes', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const notes = await crmRepository.getCustomerNotes(tenantId, req.params.id);
    res.json({ success: true, data: notes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

crmRouter.post('/notes', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const note = await crmRepository.createCustomerNote(tenantId, { ...req.body, authorUserId: userId });
    res.status(201).json({ success: true, data: note });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});
