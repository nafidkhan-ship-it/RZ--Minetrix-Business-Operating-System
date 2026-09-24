import { db, generateUuidV7 } from '../db/database.js';
import {
  QuarryMaster,
  StoneProduct,
  QuarryProduction,
  QuarryStock,
  GatePass,
  QuarryLandLease,
  LandownerSettlement
} from '../db/schema.js';

export class QuarryRepository {
  // ==========================================
  // 1. Quarry Master
  // ==========================================
  public async getQuarries(tenantId: string): Promise<QuarryMaster[]> {
    return Array.from(db.quarryMasters.values()).filter(q => q.tenantId === tenantId && !q.deletedAt);
  }

  public async getQuarryById(tenantId: string, id: string): Promise<QuarryMaster | undefined> {
    const quarry = db.quarryMasters.get(id);
    return quarry && quarry.tenantId === tenantId && !quarry.deletedAt ? quarry : undefined;
  }

  public async getQuarryByName(tenantId: string, companyId: string, name: string): Promise<QuarryMaster | undefined> {
    return Array.from(db.quarryMasters.values()).find(
      q => q.tenantId === tenantId && q.companyId === companyId && q.name.toLowerCase() === name.trim().toLowerCase() && !q.deletedAt
    );
  }

  public async saveQuarry(quarry: QuarryMaster): Promise<QuarryMaster> {
    db.quarryMasters.set(quarry.id, quarry);
    db.persistToDisk();
    return quarry;
  }

  // ==========================================
  // 2. Stone Products
  // ==========================================
  public async getProducts(tenantId: string, quarryId?: string): Promise<StoneProduct[]> {
    return Array.from(db.stoneProducts.values()).filter(p => 
      p.tenantId === tenantId && (!quarryId || p.quarryId === quarryId)
    );
  }

  public async getProductById(tenantId: string, id: string): Promise<StoneProduct | undefined> {
    const prod = db.stoneProducts.get(id);
    return prod && prod.tenantId === tenantId ? prod : undefined;
  }

  public async getProductByCode(tenantId: string, quarryId: string, productCode: string): Promise<StoneProduct | undefined> {
    return Array.from(db.stoneProducts.values()).find(
      p => p.tenantId === tenantId && p.quarryId === quarryId && p.productCode.toLowerCase() === productCode.trim().toLowerCase()
    );
  }

  public async saveProduct(product: StoneProduct): Promise<StoneProduct> {
    db.stoneProducts.set(product.id, product);
    db.persistToDisk();
    return product;
  }

  // ==========================================
  // 3. Quarry Production
  // ==========================================
  public async getProductions(tenantId: string, quarryId?: string): Promise<QuarryProduction[]> {
    return Array.from(db.quarryProductions.values()).filter(p =>
      p.tenantId === tenantId && (!quarryId || p.quarryId === quarryId)
    ).sort((a, b) => new Date(b.productionDate).getTime() - new Date(a.productionDate).getTime());
  }

  public async getProductionById(tenantId: string, id: string): Promise<QuarryProduction | undefined> {
    const prod = db.quarryProductions.get(id);
    return prod && prod.tenantId === tenantId ? prod : undefined;
  }

  public async saveProduction(production: QuarryProduction): Promise<QuarryProduction> {
    db.quarryProductions.set(production.id, production);
    db.persistToDisk();
    return production;
  }

  // ==========================================
  // 4. Quarry Stock Ledger
  // ==========================================
  public async getStockLedger(tenantId: string, quarryId: string, productId: string): Promise<QuarryStock[]> {
    return Array.from(db.quarryStocks.values()).filter(s =>
      s.tenantId === tenantId && s.quarryId === quarryId && s.productId === productId
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public async getAllStockEntries(tenantId: string, quarryId?: string): Promise<QuarryStock[]> {
    return Array.from(db.quarryStocks.values()).filter(s =>
      s.tenantId === tenantId && (!quarryId || s.quarryId === quarryId)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async calculateBalance(tenantId: string, quarryId: string, productId: string): Promise<number> {
    const entries = await this.getStockLedger(tenantId, quarryId, productId);
    let balance = 0;
    for (const entry of entries) {
      if (entry.transactionType === 'STOCK_IN' || entry.transactionType === 'ADJUSTMENT_IN') {
        balance += (entry.quantityIn || 0);
      } else if (entry.transactionType === 'STOCK_OUT' || entry.transactionType === 'ADJUSTMENT_OUT') {
        balance -= (entry.quantityOut || 0);
      }
    }
    return balance;
  }

  public async findStockEntryByReference(
    tenantId: string,
    quarryId: string,
    productId: string,
    referenceType: 'PRODUCTION' | 'GATE_PASS' | 'STOCK_ADJUSTMENT' | 'OPENING_BALANCE',
    referenceId: string,
    transactionType: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT_IN' | 'ADJUSTMENT_OUT'
  ): Promise<QuarryStock | undefined> {
    return Array.from(db.quarryStocks.values()).find(
      s => s.tenantId === tenantId &&
           s.quarryId === quarryId &&
           s.productId === productId &&
           s.referenceType === referenceType &&
           s.referenceId === referenceId &&
           s.transactionType === transactionType
    );
  }

  public async saveStock(stock: QuarryStock): Promise<QuarryStock> {
    db.quarryStocks.set(stock.id, stock);
    db.persistToDisk();
    return stock;
  }

  // ==========================================
  // 5. Gate Pass
  // ==========================================
  public async getGatePasses(tenantId: string, quarryId?: string): Promise<GatePass[]> {
    return Array.from(db.gatePasses.values()).filter(g =>
      g.tenantId === tenantId && (!quarryId || g.quarryId === quarryId)
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getGatePassById(tenantId: string, id: string): Promise<GatePass | undefined> {
    const gp = db.gatePasses.get(id);
    return gp && gp.tenantId === tenantId ? gp : undefined;
  }

  public async getGatePassByNumber(tenantId: string, passNumber: string): Promise<GatePass | undefined> {
    return Array.from(db.gatePasses.values()).find(
      g => g.tenantId === tenantId && g.passNumber.toLowerCase() === passNumber.trim().toLowerCase()
    );
  }

  public async countGatePasses(tenantId: string, quarryId: string): Promise<number> {
    return Array.from(db.gatePasses.values()).filter(
      g => g.tenantId === tenantId && g.quarryId === quarryId
    ).length;
  }

  public async saveGatePass(gp: GatePass): Promise<GatePass> {
    db.gatePasses.set(gp.id, gp);
    db.persistToDisk();
    return gp;
  }

  // ==========================================
  // 6. Land Leases
  // ==========================================
  public async getLandLeases(tenantId: string, quarryId?: string): Promise<QuarryLandLease[]> {
    return Array.from(db.quarryLandLeases.values()).filter(l =>
      l.tenantId === tenantId && (!quarryId || l.quarryId === quarryId)
    );
  }

  public async getLandLeaseById(tenantId: string, id: string): Promise<QuarryLandLease | undefined> {
    const lease = db.quarryLandLeases.get(id);
    return lease && lease.tenantId === tenantId ? lease : undefined;
  }

  public async saveLandLease(lease: QuarryLandLease): Promise<QuarryLandLease> {
    db.quarryLandLeases.set(lease.id, lease);
    db.persistToDisk();
    return lease;
  }

  // ==========================================
  // 7. Landowner Settlements
  // ==========================================
  public async getSettlements(tenantId: string, leaseId?: string): Promise<LandownerSettlement[]> {
    return Array.from(db.landownerSettlements.values()).filter(s =>
      s.tenantId === tenantId && (!leaseId || s.leaseId === leaseId)
    );
  }

  public async getSettlementById(tenantId: string, id: string): Promise<LandownerSettlement | undefined> {
    const s = db.landownerSettlements.get(id);
    return s && s.tenantId === tenantId ? s : undefined;
  }

  public async saveSettlement(s: LandownerSettlement): Promise<LandownerSettlement> {
    db.landownerSettlements.set(s.id, s);
    db.persistToDisk();
    return s;
  }
}
