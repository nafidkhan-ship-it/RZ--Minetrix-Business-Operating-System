import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { signSignedUrlPayload } from '../config/securityConfig.js';

export interface StorageObjectMetadata {
  key: string;
  tenantId: string;
  originalName: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: string;
}

export interface IStorageProvider {
  providerName: 'LOCAL_DISK' | 'S3_GCS_ADAPTER';
  upload(params: {
    tenantId: string;
    fileName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<{ storageKey: string; sizeBytes: number; mimeType: string }>;

  getSignedUrl(params: { storageKey: string; tenantId: string; expiresInSeconds?: number }): Promise<string>;
  delete(storageKey: string, tenantId: string): Promise<boolean>;
  validateFile(params: { mimeType: string; sizeBytes: number }): { valid: boolean; error?: string };
}

export class LocalStorageProvider implements IStorageProvider {
  public providerName: 'LOCAL_DISK' = 'LOCAL_DISK';
  private baseDir: string;
  private allowedMimeTypes = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'application/json',
    'text/csv',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  private maxSizeBytes = 25 * 1024 * 1024; // 25 MB

  constructor(customDir?: string) {
    this.baseDir = customDir || path.join(process.cwd(), 'uploads');
  }

  public validateFile(params: { mimeType: string; sizeBytes: number }): { valid: boolean; error?: string } {
    if (params.sizeBytes > this.maxSizeBytes) {
      return { valid: false, error: `File size exceeds max limit of 25MB (Attempted: ${(params.sizeBytes / 1024 / 1024).toFixed(2)}MB)` };
    }
    if (!this.allowedMimeTypes.includes(params.mimeType)) {
      return { valid: false, error: `Invalid MIME type [${params.mimeType}]. Allowed: PDF, PNG, JPG, WEBP, JSON, CSV, XLSX.` };
    }
    return { valid: true };
  }

  public async upload(params: {
    tenantId: string;
    fileName: string;
    mimeType: string;
    buffer: Buffer;
  }): Promise<{ storageKey: string; sizeBytes: number; mimeType: string }> {
    const validation = this.validateFile({ mimeType: params.mimeType, sizeBytes: params.buffer.length });
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const tenantDir = path.join(this.baseDir, params.tenantId);
    if (!fs.existsSync(tenantDir)) {
      fs.mkdirSync(tenantDir, { recursive: true });
    }

    const fileHash = crypto.randomBytes(8).toString('hex');
    const safeName = params.fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
    const storageKey = `${params.tenantId}/${Date.now()}_${fileHash}_${safeName}`;
    const fullPath = path.join(this.baseDir, storageKey);

    fs.writeFileSync(fullPath, params.buffer);

    return {
      storageKey,
      sizeBytes: params.buffer.length,
      mimeType: params.mimeType
    };
  }

  public async getSignedUrl(params: { storageKey: string; tenantId: string; expiresInSeconds?: number }): Promise<string> {
    if (!params.storageKey.startsWith(params.tenantId)) {
      throw new Error(`Tenant Security Access Denied: Storage key [${params.storageKey}] does not belong to tenant [${params.tenantId}]`);
    }
    const expiresAt = Math.floor(Date.now() / 1000) + (params.expiresInSeconds || 3600);
    const signature = signSignedUrlPayload(params.storageKey, expiresAt);
    return `/api/v1/documents/download?key=${encodeURIComponent(params.storageKey)}&exp=${expiresAt}&sig=${signature}`;
  }

  public async delete(storageKey: string, tenantId: string): Promise<boolean> {
    if (!storageKey.startsWith(tenantId)) {
      throw new Error('Tenant Security Access Denied');
    }
    const fullPath = path.join(this.baseDir, storageKey);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
    return false;
  }
}

export class S3GcsStorageProviderAdapter implements IStorageProvider {
  public providerName: 'S3_GCS_ADAPTER' = 'S3_GCS_ADAPTER';
  private bucketName?: string;

  constructor() {
    this.bucketName = process.env.STORAGE_BUCKET_NAME || process.env.AWS_S3_BUCKET;
  }

  public validateFile(params: { mimeType: string; sizeBytes: number }): { valid: boolean; error?: string } {
    if (params.sizeBytes > 25 * 1024 * 1024) {
      return { valid: false, error: 'File size exceeds max 25MB limit' };
    }
    return { valid: true };
  }

  public async upload(_params: { tenantId: string; fileName: string; mimeType: string; buffer: Buffer }): Promise<{ storageKey: string; sizeBytes: number; mimeType: string }> {
    if (!this.bucketName) {
      throw new Error('Cloud Storage Bucket configuration missing. Set STORAGE_BUCKET_NAME env var.');
    }
    throw new Error('Cloud Storage Provider Adapter ready; external cloud bucket credentials required.');
  }

  public async getSignedUrl(params: { storageKey: string; tenantId: string; expiresInSeconds?: number }): Promise<string> {
    if (!params.storageKey.startsWith(params.tenantId)) {
      throw new Error('Tenant Security Access Denied');
    }
    return `https://${this.bucketName || 'storage'}.s3.amazonaws.com/${params.storageKey}?X-Amz-Signature=signed_placeholder`;
  }

  public async delete(_storageKey: string, _tenantId: string): Promise<boolean> {
    return true;
  }
}
