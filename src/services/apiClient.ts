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

  public async listQuarries(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/quarries', {
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createQuarry(payload: {
    code: string;
    name: string;
    mineralType?: string;
    operationalStatus?: string;
    capacityTons?: number;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/quarries', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async updateQuarry(
    quarryId: string,
    payload: {
      name?: string;
      mineralType?: string;
      operationalStatus?: string;
      capacityTons?: number;
    }
  ): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/erp/quarries/${quarryId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async archiveQuarry(quarryId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/erp/quarries/${quarryId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listProducts(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/products', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createProduct(payload: {
    code: string;
    name: string;
    category: string;
    defaultUom?: string;
    gstPercent?: number;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/products', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listLandParcels(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/land-parcels', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createLandParcel(payload: {
    surveyNumber: string;
    villageTaluk?: string;
    acreage?: number;
    ownerName: string;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/land-parcels', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listProductionBatches(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/production/batches', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createProductionBatch(payload: {
    quarryId: string;
    batchNumber: string;
    productionDate: string;
    shiftName?: string;
    postImmediately?: boolean;
    lines: Array<{ productId: string; quantity: number; quantityUom?: string }>;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/production/batches', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listStockBalances(quarryId?: string): Promise<ApiResponse> {
    try {
      const query = quarryId ? `?quarryId=${encodeURIComponent(quarryId)}` : '';
      const res = await fetch(`/api/v1/erp/stock/balances${query}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listCustomers(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/customers', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createCustomer(payload: {
    code: string;
    name: string;
    destination?: string;
    phone?: string;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/customers', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createGatePass(payload: {
    gatePassNumber: string;
    quarryId: string;
    customerId: string;
    vehicleNumber: string;
    driverName: string;
    destination?: string;
    lines: Array<{ productId: string; quantity: number; quantityUom?: string }>;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/gate-passes', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async transitionGatePass(gatePassId: string, action: 'approve' | 'issue' | 'cancel'): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/erp/gate-passes/${gatePassId}/${action}`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createDispatch(payload: { dispatchNumber: string; gatePassId: string }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/dispatches', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listDispatches(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/dispatches', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listGatePasses(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/gate-passes', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createSettlementRate(payload: {
    landParcelId: string;
    quarryId?: string;
    ratePerUom: number;
    quantityUom?: string;
    effectiveFrom: string;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/settlement-rates', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createSettlement(payload: {
    settlementNumber: string;
    landParcelId: string;
    quarryId: string;
    basis: 'PRODUCTION' | 'DISPATCH';
    productionBatchId?: string;
    dispatchId?: string;
    deductions?: number;
    statementRef?: string;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/settlements', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listSettlements(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/settlements', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createContact(payload: { customerId: string; fullName: string; roleTitle?: string; phone?: string; email?: string }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/contacts', { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(payload) });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createLead(payload: { code: string; companyName: string; contactName?: string; phone?: string; source?: string }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/leads', { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(payload) });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async convertLead(leadId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/erp/leads/${leadId}/convert`, { method: 'POST', headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getCustomer(customerId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/erp/customers/${customerId}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getCustomerHistory(customerId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/erp/customers/${customerId}/history`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createOrder(payload: {
    orderNumber: string;
    customerId: string;
    quarryId: string;
    taxAmount?: number;
    lines: Array<{ productId: string; quantity: number; unitPrice: number; quantityUom?: string }>;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/orders', { method: 'POST', headers: this.getHeaders(), body: JSON.stringify(payload) });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listOrders(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/erp/orders', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async confirmOrder(orderId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/erp/orders/${orderId}/confirm`, { method: 'POST', headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createOrderGatePass(orderId: string, payload: { gatePassNumber: string; vehicleId: string; driverId: string; destination?: string }): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/erp/orders/${orderId}/gate-pass`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listHrmsPayStructures(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/hrms/pay-structures', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createHrmsPayStructure(payload: {
    code: string;
    name: string;
    basicSalary: number;
    allowanceAmount?: number;
    pfPercent?: number;
    otherDeductionAmount?: number;
    overtimeRatePerHour?: number;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/hrms/pay-structures', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listHrmsEmployees(search?: string): Promise<ApiResponse> {
    try {
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/api/v1/hrms/employees${query}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createHrmsEmployee(payload: {
    code: string;
    fullName: string;
    phone?: string;
    email?: string;
    address?: string;
    joiningDate: string;
    department: string;
    designation: string;
    payStructureId?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/hrms/employees', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listHrmsAttendance(employeeId?: string): Promise<ApiResponse> {
    try {
      const query = employeeId ? `?employeeId=${encodeURIComponent(employeeId)}` : '';
      const res = await fetch(`/api/v1/hrms/attendance${query}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createHrmsAttendance(payload: {
    employeeId: string;
    workDate: string;
    status: string;
    checkIn?: string;
    checkOut?: string;
    overtimeHours?: number;
    remarks?: string;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/hrms/attendance', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listHrmsLeaveRequests(employeeId?: string): Promise<ApiResponse> {
    try {
      const query = employeeId ? `?employeeId=${encodeURIComponent(employeeId)}` : '';
      const res = await fetch(`/api/v1/hrms/leave-requests${query}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createHrmsLeaveRequest(payload: {
    employeeId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason?: string;
  }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/hrms/leave-requests', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async approveHrmsLeave(leaveId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/hrms/leave-requests/${leaveId}/approve`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async rejectHrmsLeave(leaveId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/hrms/leave-requests/${leaveId}/reject`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listHrmsPayroll(employeeId?: string): Promise<ApiResponse> {
    try {
      const query = employeeId ? `?employeeId=${encodeURIComponent(employeeId)}` : '';
      const res = await fetch(`/api/v1/hrms/payroll${query}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createHrmsPayroll(payload: { employeeId: string; periodYear: number; periodMonth: number }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/hrms/payroll', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFleetVehicles(params?: { search?: string; status?: string; vehicleType?: string }): Promise<ApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.status) query.set('status', params.status);
      if (params?.vehicleType) query.set('vehicleType', params.vehicleType);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`/api/v1/fleet/vehicles${suffix}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getFleetVehicle(vehicleId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/vehicles/${vehicleId}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createFleetVehicle(payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/fleet/vehicles', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async updateFleetVehicle(vehicleId: string, payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async archiveFleetVehicle(vehicleId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/vehicles/${vehicleId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFleetDrivers(params?: { search?: string; status?: string; licenseClass?: string }): Promise<ApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.status) query.set('status', params.status);
      if (params?.licenseClass) query.set('licenseClass', params.licenseClass);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`/api/v1/fleet/drivers${suffix}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getFleetDriver(driverId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/drivers/${driverId}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createFleetDriver(payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/fleet/drivers', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async updateFleetDriver(driverId: string, payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/drivers/${driverId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async archiveFleetDriver(driverId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/drivers/${driverId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFleetVehicleDocuments(params?: { vehicleId?: string; documentType?: string; status?: string; search?: string }): Promise<ApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.vehicleId) query.set('vehicleId', params.vehicleId);
      if (params?.documentType) query.set('documentType', params.documentType);
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`/api/v1/fleet/vehicle-documents${suffix}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createFleetVehicleDocument(payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/fleet/vehicle-documents', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async updateFleetVehicleDocument(documentId: string, payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/vehicle-documents/${documentId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async archiveFleetVehicleDocument(documentId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/vehicle-documents/${documentId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFleetMaintenance(params?: { vehicleId?: string; status?: string; search?: string }): Promise<ApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.vehicleId) query.set('vehicleId', params.vehicleId);
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`/api/v1/fleet/maintenance${suffix}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createFleetMaintenance(payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/fleet/maintenance', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async updateFleetMaintenance(maintenanceId: string, payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/maintenance/${maintenanceId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async archiveFleetMaintenance(maintenanceId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/maintenance/${maintenanceId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFleetFuel(params?: { vehicleId?: string; fuelType?: string; search?: string }): Promise<ApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.vehicleId) query.set('vehicleId', params.vehicleId);
      if (params?.fuelType) query.set('fuelType', params.fuelType);
      if (params?.search) query.set('search', params.search);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`/api/v1/fleet/fuel${suffix}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createFleetFuel(payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/fleet/fuel', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async updateFleetFuel(fuelId: string, payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/fuel/${fuelId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async archiveFleetFuel(fuelId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/fuel/${fuelId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFleetOperations(params?: { vehicleId?: string; driverId?: string; status?: string; search?: string }): Promise<ApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.vehicleId) query.set('vehicleId', params.vehicleId);
      if (params?.driverId) query.set('driverId', params.driverId);
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`/api/v1/fleet/operations${suffix}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createFleetOperation(payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/fleet/operations', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async updateFleetOperation(operationId: string, payload: Record<string, unknown>): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/operations/${operationId}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async archiveFleetOperation(operationId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/fleet/operations/${operationId}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFinanceAccounts(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/finance/accounts', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFinanceTransactions(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/finance/transactions', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFinanceInvoices(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/finance/invoices', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFinancePayments(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/finance/payments', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async listFinanceExpenses(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/finance/expenses', { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async getFinanceReport(
    report: 'sales-summary' | 'invoice-summary' | 'receivables' | 'payments-summary' | 'outstanding-balances' | 'expenses-summary' | 'income-expense-summary' | 'cash-flow' | 'transaction-summary' | 'settlement-summary',
    params?: { fromDate?: string; toDate?: string }
  ): Promise<ApiResponse> {
    try {
      const query = new URLSearchParams();
      if (params?.fromDate) query.set('fromDate', params.fromDate);
      if (params?.toDate) query.set('toDate', params.toDate);
      const suffix = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`/api/v1/finance/reports/${report}${suffix}`, { headers: this.getHeaders() });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async createNotification(payload: { title: string; body?: string; type?: string; relatedModule?: string; relatedRecordType?: string; relatedRecordId?: string }): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/notifications', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async markNotificationRead(notificationId: string): Promise<ApiResponse> {
    try {
      const res = await fetch(`/api/v1/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }

  public async markAllNotificationsRead(): Promise<ApiResponse> {
    try {
      const res = await fetch('/api/v1/notifications/read-all', {
        method: 'POST',
        headers: this.getHeaders()
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: 'NETWORK_ERROR', message: err.message };
    }
  }
}

export const apiClient = new SharedCoreApiClient();
