/**
 * RZ® Minetrix BOS - Shared Core API Gateway Client (Phase 16)
 * Handles HTTP requests to the backend Express server at /api/v1/*
 */

import { mobileService } from './mobileService';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
  tenantId?: string;
  companyId?: string;
  branchId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class SharedCoreApiClient {
  private token: string | null = null;
  private user: AuthUser | null = null;
  private tenantId: string | null = null;

  constructor() {
    // Load initial stored token and user if available in browser
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('rz_auth_token');
      const storedUser = localStorage.getItem('rz_auth_user');
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser);
          this.tenantId = this.user?.tenantId || null;
        } catch {
          this.user = null;
        }
      }
    }
    // Also load from native secure storage in background
    this.initSecureStorage();
  }

  private async initSecureStorage() {
    try {
      const secureToken = await mobileService.getSecureItem('rz_auth_token');
      if (secureToken && !this.token) {
        this.token = secureToken;
      }
      const secureUser = await mobileService.getSecureItem('rz_auth_user');
      if (secureUser && !this.user) {
        this.user = JSON.parse(secureUser);
        this.tenantId = this.user?.tenantId || null;
      }
    } catch {
      // Non-blocking
    }
  }

  public setAuthSession(token: string, user?: AuthUser) {
    this.token = token;
    this.user = user || null;
    this.tenantId = user?.tenantId || null;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rz_auth_token', token);
      if (user) {
        localStorage.setItem('rz_auth_user', JSON.stringify(user));
      }
    }
    mobileService.setSecureItem('rz_auth_token', token);
    if (user) {
      mobileService.setSecureItem('rz_auth_user', JSON.stringify(user));
    }
  }

  public setAuthToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('rz_auth_token', token);
    }
    mobileService.setSecureItem('rz_auth_token', token);
  }

  public clearAuth() {
    this.token = null;
    this.user = null;
    this.tenantId = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rz_auth_token');
      localStorage.removeItem('rz_auth_user');
    }
    mobileService.removeSecureItem('rz_auth_token');
    mobileService.removeSecureItem('rz_auth_user');
  }

  public getAuthToken(): string | null {
    return this.token;
  }

  public getAuthUser(): AuthUser | null {
    return this.user;
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public hasPermission(permission: string): boolean {
    if (!this.user) return false;
    if (this.user.roles.includes('SUPER_ADMIN')) return true;
    return this.user.permissions.includes(permission);
  }

  public setTenantContext(tenantId: string) {
    this.tenantId = tenantId;
  }

  public getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (this.tenantId) {
      headers['x-tenant-id'] = this.tenantId;
    }
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  public async request<T = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    path: string,
    body?: any
  ): Promise<ApiResponse<T>> {
    try {
      if (!mobileService.getIsOnline()) {
        return {
          success: false,
          error: 'OFFLINE_MODE',
          message: 'Device is offline. Transaction aborted to protect ledger and stock consistency.'
        };
      }

      const baseUrl = mobileService.getApiBaseUrl();
      const resolvedUrl = baseUrl ? `${baseUrl}${path.startsWith('/') ? path : '/' + path}` : path;

      const options: RequestInit = {
        method,
        headers: this.getHeaders()
      };
      if (body !== undefined && method !== 'GET') {
        options.body = JSON.stringify(body);
      }
      const res = await fetch(resolvedUrl, options);
      const data = await res.json();
      return data;
    } catch (err: any) {
      return {
        success: false,
        error: 'NETWORK_ERROR',
        message: err.message || 'Unable to connect to RZ® Minetrix BOS server'
      };
    }
  }

  public async getHealthLiveness(): Promise<ApiResponse> {
    return this.request('GET', '/health/liveness');
  }

  public async getHealthReadiness(): Promise<ApiResponse> {
    return this.request('GET', '/health/readiness');
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
        this.setAuthSession(data.data.token, data.data.user);
      }
      return data;
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getSession(): Promise<ApiResponse> {
    const res = await this.request('GET', '/api/v1/auth/session');
    if (res.success && res.data?.user) {
      this.user = res.data.user;
      this.tenantId = res.data.user.tenantId || null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('rz_auth_user', JSON.stringify(this.user));
      }
    }
    return res;
  }

  public async getTenantContext(): Promise<ApiResponse> {
    return this.request('GET', '/api/v1/tenants/context');
  }

  public async getUsers(): Promise<ApiResponse> {
    return this.request('GET', '/api/v1/users');
  }

  public async getNotifications(): Promise<ApiResponse> {
    return this.request('GET', '/api/v1/notifications');
  }

  public async getAuditLogs(): Promise<ApiResponse> {
    return this.request('GET', '/api/v1/audit/search');
  }

  public async runAutomatedTestSuite(): Promise<ApiResponse> {
    return this.request('GET', '/api/v1/test/run-suite');
  }
}

export const apiClient = new SharedCoreApiClient();
