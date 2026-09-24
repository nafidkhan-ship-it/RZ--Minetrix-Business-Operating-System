/**
 * RZ® Minetrix BOS - AI Load Exchange & Transport Marketplace REST API Router (Phase 19)
 * Endpoints for Load Requests, AI Matching, Offers, Bookings, Deliveries, Ratings, Disputes, Transporters & Pricing.
 */

import { Router, Request, Response } from 'express';
import { marketplaceService } from '../services/marketplaceServices.js';

export const marketplaceRouter = Router();

// Helper functions for tenant and user context
function getTenantId(req: Request): string {
  return (req as any).tenantContext?.tenantId || (req as any).user?.tenantId || 'tenant-rz-global-001';
}

function getUserId(req: Request): string {
  return (req as any).user?.id || 'usr-admin-001';
}

// 1. Marketplace Dashboard Metrics
marketplaceRouter.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const metrics = await marketplaceService.getDashboardMetrics(tenantId);
    res.json({ success: true, data: metrics });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Load Requests CRUD & Public Posting
marketplaceRouter.get('/loads', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const search = req.query.search as string;
    const isPublic = req.query.isPublic !== undefined ? req.query.isPublic === 'true' : undefined;
    const loads = await marketplaceService.getLoadRequests(tenantId, { status, search, isPublic });
    res.json({ success: true, data: loads });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.get('/loads/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const load = await marketplaceService.getLoadRequestById(tenantId, req.params.id);
    if (!load) return res.status(404).json({ success: false, error: 'Load Request not found' });
    res.json({ success: true, data: load });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/loads', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const newLoad = await marketplaceService.createLoadRequest(tenantId, req.body, userId);
    res.status(201).json({ success: true, data: newLoad });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/public/loads', async (req: Request, res: Response) => {
  try {
    const newLoad = await marketplaceService.createPublicLoadRequest(req.body);
    res.status(201).json({ success: true, data: newLoad, message: 'Public transport load request submitted successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 3. AI Load Matching Endpoints
marketplaceRouter.post('/loads/:id/matches', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const matches = await marketplaceService.triggerLoadMatching(tenantId, req.params.id);
    res.json({ success: true, data: matches });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

marketplaceRouter.get('/loads/:id/matches', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const matches = await marketplaceService.getLoadMatches(tenantId, req.params.id);
    res.json({ success: true, data: matches });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Load Offers
marketplaceRouter.get('/offers', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const loadId = req.query.loadId as string;
    const offers = await marketplaceService.getOffers(tenantId, loadId);
    res.json({ success: true, data: offers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/offers', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const offer = await marketplaceService.submitOffer(tenantId, req.body, userId);
    res.status(201).json({ success: true, data: offer });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/offers/:id/accept', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const booking = await marketplaceService.acceptOffer(tenantId, req.params.id, userId);
    res.json({ success: true, data: booking, message: 'Offer accepted. Booking confirmed and Fleet Trip dispatched.' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/offers/:id/reject', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const offer = await marketplaceService.rejectOffer(tenantId, req.params.id, userId);
    res.json({ success: true, data: offer });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 5. Bookings
marketplaceRouter.get('/bookings', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const search = req.query.search as string;
    const bookings = await marketplaceService.getBookings(tenantId, { status, search });
    res.json({ success: true, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.get('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const booking = await marketplaceService.getBookingById(tenantId, req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/bookings/:id/cancel', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const reason = req.body.reason || 'Customer requested cancellation';
    const booking = await marketplaceService.cancelBooking(tenantId, req.params.id, reason, userId);
    res.json({ success: true, data: booking });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 6. Deliveries
marketplaceRouter.get('/deliveries', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const bookingId = req.query.bookingId as string;
    const deliveries = await marketplaceService.getDeliveries(tenantId, bookingId);
    res.json({ success: true, data: deliveries });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/deliveries/:id/confirm', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const delivery = await marketplaceService.confirmDelivery(tenantId, req.params.id, req.body, userId);
    res.json({ success: true, data: delivery, message: 'Delivery confirmed successfully' });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 7. Ratings & Disputes
marketplaceRouter.get('/ratings', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const transporterId = req.query.transporterId as string;
    const ratings = await marketplaceService.getTransporters(tenantId);
    res.json({ success: true, data: ratings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/ratings', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const rating = await marketplaceService.createRating(tenantId, req.body, userId);
    res.status(201).json({ success: true, data: rating });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

marketplaceRouter.get('/disputes', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const disputes = await marketplaceService.getDisputes(tenantId, { status });
    res.json({ success: true, data: disputes });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/disputes', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const userId = getUserId(req);
    const dispute = await marketplaceService.createDispute(tenantId, req.body, userId);
    res.status(201).json({ success: true, data: dispute });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 8. Transporters & Smart Pricing
marketplaceRouter.get('/transporters', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const status = req.query.status as string;
    const search = req.query.search as string;
    const transporters = await marketplaceService.getTransporters(tenantId, { status, search });
    res.json({ success: true, data: transporters });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

marketplaceRouter.post('/transporters', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const transporter = await marketplaceService.createTransporter(tenantId, req.body);
    res.status(201).json({ success: true, data: transporter });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

marketplaceRouter.get('/pricing-estimate', async (req: Request, res: Response) => {
  try {
    const tenantId = getTenantId(req);
    const materialId = (req.query.materialId as string) || 'mat-m-sand-01';
    const quantity = Number(req.query.quantity) || 30;
    const source = (req.query.source as string) || 'Quarry Pit Alpha';
    const destination = (req.query.destination as string) || 'Panambur Port';
    const vehicleType = (req.query.vehicleType as string) || 'Tipper';

    const estimate = marketplaceService.getPricingEstimate(tenantId, materialId, quantity, source, destination, vehicleType);
    res.json({ success: true, data: estimate });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});
