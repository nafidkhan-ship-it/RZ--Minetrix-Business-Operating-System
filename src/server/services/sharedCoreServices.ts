import { hashPassword } from '../db/database.js';
import { signToken } from '../middleware/authMiddleware.js';
import {
  UserRepository,
  TenantRepository,
  OrganizationRepository,
  RolePermissionRepository,
  AuditRepository,
  NotificationRepository,
  DocumentRepository,
  WorkflowRepository
} from '../repositories/sharedCoreRepositories.js';

const userRepo = new UserRepository();
const tenantRepo = new TenantRepository();
const orgRepo = new OrganizationRepository();
const rolePermRepo = new RolePermissionRepository();
const auditRepo = new AuditRepository();
const notifRepo = new NotificationRepository();
const docRepo = new DocumentRepository();
const wfRepo = new WorkflowRepository();

export class AuthService {
  async login(email: string, passwordAttempt: string, ipAddress: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return { success: false, error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' };
    }

    const { hash } = hashPassword(passwordAttempt, user.salt);
    if (hash !== user.passwordHash) {
      await auditRepo.log({
        tenantId: user.tenantId,
        actorUserId: user.id,
        actorEmail: user.email,
        action: 'AUTH_LOGIN_FAILED',
        module: 'Shared Core Auth',
        resource: 'LoginEndpoint',
        ipAddress,
        correlationId: 'login-attempt',
        status: 'FAILURE'
      });
      return { success: false, error: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' };
    }

    const permissions = await rolePermRepo.findPermissionsByUser(user.id);
    const token = signToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      tenantId: user.tenantId,
      companyId: user.companyId,
      roles: ['USER']
    });

    await auditRepo.log({
      tenantId: user.tenantId,
      actorUserId: user.id,
      actorEmail: user.email,
      action: 'AUTH_LOGIN_SUCCESS',
      module: 'Shared Core Auth',
      resource: 'LoginEndpoint',
      ipAddress,
      correlationId: 'login-success',
      status: 'SUCCESS'
    });

    return {
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          tenantId: user.tenantId,
          companyId: user.companyId,
          department: user.department,
          designation: user.designation,
          isMfaEnabled: user.isMfaEnabled
        },
        permissions
      }
    };
  }
}

export class TenantService {
  async getTenantContext(tenantId: string) {
    const tenant = await tenantRepo.findById(tenantId);
    if (!tenant) return { success: false, message: 'Tenant not found' };
    const companies = await orgRepo.findCompaniesByTenant(tenantId);
    return { success: true, data: { tenant, companies } };
  }

  async getAllTenants() {
    const tenants = await tenantRepo.findAll();
    return { success: true, data: tenants };
  }
}

export class UserService {
  async getUsersInTenant(tenantId: string) {
    const users = await userRepo.findByTenant(tenantId);
    return { success: true, data: users.map(u => ({ id: u.id, fullName: u.fullName, email: u.email, department: u.department, designation: u.designation, status: u.status })) };
  }

  async linkOperationalAccount(userId: string, tenantId: string, linkage: { employeeId?: string; driverId?: string; operatorId?: string }) {
    const updated = await userRepo.updateProfile(userId, tenantId, {
      linkedEmployeeId: linkage.employeeId,
      linkedDriverId: linkage.driverId,
      linkedOperatorId: linkage.operatorId
    });
    return { success: true, data: updated };
  }
}

export class NotificationService {
  async getUserNotifications(userId: string, tenantId: string) {
    const notifs = await notifRepo.findByRecipient(userId, tenantId);
    const unreadCount = notifs.filter(n => !n.isRead).length;
    return { success: true, data: { notifications: notifs, unreadCount } };
  }

  async createNotification(tenantId: string, recipientUserId: string, title: string, body: string, type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS') {
    const notif = await notifRepo.create({ tenantId, recipientUserId, title, body, type, channel: 'IN_APP' });
    return { success: true, data: notif };
  }
}

export class AuditService {
  async getAuditLogs(tenantId: string, limit: number = 50) {
    const logs = await auditRepo.search(tenantId, limit);
    return { success: true, data: logs };
  }
}

export class WorkflowService {
  async initiateWorkflow(tenantId: string, workflowCode: string, entityType: string, entityId: string, userId: string) {
    const wfDef = await wfRepo.findDefinitionByCode(tenantId, workflowCode);
    if (!wfDef) return { success: false, message: `Workflow definition [${workflowCode}] not found for tenant` };

    const instance = await wfRepo.createInstance({
      tenantId,
      workflowDefinitionId: wfDef.id,
      entityType,
      entityId,
      currentState: wfDef.initialState,
      initiatedByUserId: userId
    });

    return { success: true, data: instance };
  }
}
