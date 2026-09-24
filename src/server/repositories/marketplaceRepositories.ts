/**
 * RZ® Minetrix BOS - Marketplace Repositories Layer (Phase 19)
 * Tenant-scoped CRUD and query handling for AI Load Exchange & Transport Marketplace
 */

import { db } from '../db/database.js';
import {
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
  MarketplaceMatchingEvent
} from '../db/schema.js';

export class MarketplaceRepository {
  // --- Load Requests ---
  public async getLoadRequests(tenantId: string, filters?: { status?: string; search?: string; isPublic?: boolean }): Promise<LoadRequest[]> {
    let list = Array.from(db.loadRequests.values()).filter(l => l.tenantId === tenantId);
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(l => l.status === filters.status);
    }
    if (filters?.isPublic !== undefined) {
      list = list.filter(l => l.isPublic === filters.isPublic);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(l =>
        l.requestNumber.toLowerCase().includes(q) ||
        l.customerName.toLowerCase().includes(q) ||
        l.materialName.toLowerCase().includes(q) ||
        l.source.toLowerCase().includes(q) ||
        l.destination.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getLoadRequestById(tenantId: string, id: string): Promise<LoadRequest | null> {
    const item = db.loadRequests.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }

  public async createLoadRequest(load: LoadRequest): Promise<LoadRequest> {
    db.loadRequests.set(load.id, load);
    db.persistToDisk();
    return load;
  }

  public async updateLoadRequest(load: LoadRequest): Promise<LoadRequest> {
    load.updatedAt = new Date().toISOString();
    load.version = (load.version || 1) + 1;
    db.loadRequests.set(load.id, load);
    db.persistToDisk();
    return load;
  }

  public async deleteLoadRequest(tenantId: string, id: string): Promise<boolean> {
    const item = await this.getLoadRequestById(tenantId, id);
    if (!item) return false;
    db.loadRequests.delete(id);
    db.persistToDisk();
    return true;
  }

  // --- Transporters ---
  public async getTransporters(tenantId: string, filters?: { status?: string; search?: string }): Promise<TransporterProfile[]> {
    let list = Array.from(db.transporterProfiles.values()).filter(t => t.tenantId === tenantId);
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(t => t.verifiedStatus === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(t =>
        t.companyName.toLowerCase().includes(q) ||
        t.contactPerson.toLowerCase().includes(q) ||
        t.phone.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public async getTransporterById(tenantId: string, id: string): Promise<TransporterProfile | null> {
    const item = db.transporterProfiles.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }

  public async createTransporter(transporter: TransporterProfile): Promise<TransporterProfile> {
    db.transporterProfiles.set(transporter.id, transporter);
    db.persistToDisk();
    return transporter;
  }

  public async updateTransporter(transporter: TransporterProfile): Promise<TransporterProfile> {
    transporter.updatedAt = new Date().toISOString();
    db.transporterProfiles.set(transporter.id, transporter);
    db.persistToDisk();
    return transporter;
  }

  // --- Offers ---
  public async getOffers(tenantId: string, loadId?: string): Promise<LoadOffer[]> {
    let list = Array.from(db.loadOffers.values()).filter(o => o.tenantId === tenantId);
    if (loadId) {
      list = list.filter(o => o.loadId === loadId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getOfferById(tenantId: string, id: string): Promise<LoadOffer | null> {
    const item = db.loadOffers.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }

  public async createOffer(offer: LoadOffer): Promise<LoadOffer> {
    db.loadOffers.set(offer.id, offer);
    db.persistToDisk();
    return offer;
  }

  public async updateOffer(offer: LoadOffer): Promise<LoadOffer> {
    offer.updatedAt = new Date().toISOString();
    db.loadOffers.set(offer.id, offer);
    db.persistToDisk();
    return offer;
  }

  // --- Bookings ---
  public async getBookings(tenantId: string, filters?: { status?: string; search?: string }): Promise<LoadBooking[]> {
    let list = Array.from(db.loadBookings.values()).filter(b => b.tenantId === tenantId);
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(b => b.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(b =>
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getBookingById(tenantId: string, id: string): Promise<LoadBooking | null> {
    const item = db.loadBookings.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }

  public async createBooking(booking: LoadBooking): Promise<LoadBooking> {
    db.loadBookings.set(booking.id, booking);
    db.persistToDisk();
    return booking;
  }

  public async updateBooking(booking: LoadBooking): Promise<LoadBooking> {
    booking.updatedAt = new Date().toISOString();
    db.loadBookings.set(booking.id, booking);
    db.persistToDisk();
    return booking;
  }

  // --- Matches ---
  public async getMatchesForLoad(tenantId: string, loadId: string): Promise<LoadMatch[]> {
    return Array.from(db.loadMatches.values()).filter(m => m.tenantId === tenantId && m.loadId === loadId);
  }

  public async saveMatches(matches: LoadMatch[]): Promise<void> {
    for (const match of matches) {
      db.loadMatches.set(match.id, match);
    }
    db.persistToDisk();
  }

  // --- Deliveries ---
  public async getDeliveries(tenantId: string, bookingId?: string): Promise<MarketplaceDelivery[]> {
    let list = Array.from(db.marketplaceDeliveries.values()).filter(d => d.tenantId === tenantId);
    if (bookingId) {
      list = list.filter(d => d.bookingId === bookingId);
    }
    return list;
  }

  public async getDeliveryById(tenantId: string, id: string): Promise<MarketplaceDelivery | null> {
    const item = db.marketplaceDeliveries.get(id);
    if (!item || item.tenantId !== tenantId) return null;
    return item;
  }

  public async createDelivery(delivery: MarketplaceDelivery): Promise<MarketplaceDelivery> {
    db.marketplaceDeliveries.set(delivery.id, delivery);
    db.persistToDisk();
    return delivery;
  }

  public async updateDelivery(delivery: MarketplaceDelivery): Promise<MarketplaceDelivery> {
    delivery.updatedAt = new Date().toISOString();
    db.marketplaceDeliveries.set(delivery.id, delivery);
    db.persistToDisk();
    return delivery;
  }

  // --- Ratings ---
  public async getRatings(tenantId: string, transporterId?: string): Promise<MarketplaceRating[]> {
    let list = Array.from(db.marketplaceRatings.values()).filter(r => r.tenantId === tenantId);
    if (transporterId) {
      list = list.filter(r => r.transporterId === transporterId);
    }
    return list;
  }

  public async createRating(rating: MarketplaceRating): Promise<MarketplaceRating> {
    // Check if rating for booking already exists
    const existing = Array.from(db.marketplaceRatings.values()).find(
      r => r.tenantId === rating.tenantId && r.bookingId === rating.bookingId
    );
    if (existing) {
      throw new Error(`Rating already exists for Booking [${rating.bookingId}]`);
    }
    db.marketplaceRatings.set(rating.id, rating);
    db.persistToDisk();
    return rating;
  }

  // --- Disputes ---
  public async getDisputes(tenantId: string, filters?: { status?: string }): Promise<MarketplaceDispute[]> {
    let list = Array.from(db.marketplaceDisputes.values()).filter(d => d.tenantId === tenantId);
    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter(d => d.status === filters.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async createDispute(dispute: MarketplaceDispute): Promise<MarketplaceDispute> {
    db.marketplaceDisputes.set(dispute.id, dispute);
    db.persistToDisk();
    return dispute;
  }

  public async updateDispute(dispute: MarketplaceDispute): Promise<MarketplaceDispute> {
    dispute.updatedAt = new Date().toISOString();
    db.marketplaceDisputes.set(dispute.id, dispute);
    db.persistToDisk();
    return dispute;
  }

  // --- Matching Events ---
  public async logMatchingEvent(event: MarketplaceMatchingEvent): Promise<MarketplaceMatchingEvent> {
    db.marketplaceMatchingEvents.set(event.id, event);
    db.persistToDisk();
    return event;
  }
}

export const marketplaceRepository = new MarketplaceRepository();
