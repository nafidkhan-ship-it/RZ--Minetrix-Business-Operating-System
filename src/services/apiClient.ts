/**
 * RZ® Minetrix BOS - Shared Core API Gateway Client (Phase 16)
 * Handles HTTP requests to the backend Express server at /api/v1/*
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class SharedCoreApiClient {
  private token: string | null = null;
  private tenantId: string = 'tenant-rz-global-001';

  constructor() {
    // Load stored token if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('rz_auth_token');
    }
  }

  public setAuthToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rz_auth_token', token);
    }
  }

  public getAuthToken(): string | null {
    return this.token;
  }

  public setTenantContext(tenantId: string) {
    this.tenantId = tenantId;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-tenant-id': this.tenantId
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  public async getHealthLiveness(): Promise<ApiResponse> {
    try {
      const res = await fetch('/health/liveness');
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getHealthReadiness(): Promise<ApiResponse> {
    try {
      const res = await fetch('/health/readiness');
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async login(email: string, passwordAttempt: string): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: passwordAttempt })
      });
      const data = await res.json();
      if (data.success && data.data?.token) {
        this.setAuthToken(data.data.token);
      }
      return data;
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getSession(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/auth/session', {
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getTenantContext(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/tenants/context', {
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getUsers(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/users', {
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getNotifications(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/notifications', {
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getAuditLogs(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/audit/search', {
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async runAutomatedTestSuite(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/test/run-suite');
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }
}

export const apiClient = new SharedCoreApiClient();
