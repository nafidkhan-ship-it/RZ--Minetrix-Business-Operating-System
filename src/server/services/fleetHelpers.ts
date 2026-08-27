import { VehicleDocumentStatus } from '../db/fleet/fleetTypes.js';

const EXPIRING_SOON_DAYS = 30;

export function computeVehicleDocumentStatus(
  expiryDate?: string | null,
  storedStatus?: string | null
): VehicleDocumentStatus {
  if (storedStatus === 'ARCHIVED') return 'ARCHIVED';
  if (!expiryDate) return (storedStatus as VehicleDocumentStatus) || 'PENDING';
  const today = new Date().toISOString().slice(0, 10);
  if (expiryDate < today) return 'EXPIRED';
  const soon = new Date();
  soon.setUTCDate(soon.getUTCDate() + EXPIRING_SOON_DAYS);
  if (expiryDate <= soon.toISOString().slice(0, 10)) return 'EXPIRING_SOON';
  return 'VALID';
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeFuelTotal(quantity: number, rate: number): number {
  return roundCurrency(quantity * rate);
}
