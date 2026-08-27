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

  public async createOrderGatePass(orderId: string, payload: { gatePassNumber: string; vehicleNumber: string; driverName: string; destination?: string }): Promise<ApiResponse> {
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
}

export const apiClient = new SharedCoreApiClient();
