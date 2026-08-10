import { Request, Response, NextFunction } from 'express';
import { db, generateUuidV7 } from '../db/database.js';
import { AuditRepository, RolePermissionRepository } from '../repositories/sharedCoreRepositories.js';
import { jwtService } from '../security/jwtService.js';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  fullName: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  roles: string[];
  permissions: string[];
}

export interface CustomRequest extends Request {
  user?: AuthenticatedUser;
  correlationId?: string;
  requestId?: string;
}

const auditRepo = new AuditRepository();
const rolePermRepo = new RolePermissionRepository();

// RS256 Asymmetric JWT Helper Wrappers
export function signToken(payload: {
  userId: string;
  email: string;
  fullName: string;
  tenantId: string;
  companyId: string;
  branchId?: string;
  roles: string[];
}): string {
  return jwtService.signToken(payload);
}

export function verifyToken(token: string): any {
  const decoded = jwtService.verifyToken(token);
  if (!decoded) return null;
  return {
    ...decoded,
    userId: decoded.sub
  };
}

// 1. Correlation & Request ID Middleware
export function correlationIdMiddleware(req: CustomRequest, res: Response, next: NextFunction) {
  req.requestId = generateUuidV7();
  req.correlationId = (req.headers['x-correlation-id'] as string) || generateUuidV7();
  res.setHeader('x-request-id', req.requestId);
  res.setHeader('x-correlation-id', req.correlationId);
  next();
}

// 2. JWT Authentication Middleware (RS256 Asymmetric Verification)
export async function authenticateJwt(req: CustomRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid Authorization Bearer token header.'
    });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Authentication token is expired or RS256 signature is invalid.'
    });
  }

  const user = db.users.get(decoded.userId);
  if (!user || user.deletedAt || user.status !== 'ACTIVE') {
    return res.status(401).json({
      success: false,
      error: 'USER_INACTIVE',
      message: 'User account is inactive, suspended, or deleted.'
    });
  }

  const userPermissions = await rolePermRepo.findPermissionsByUser(user.id);

  req.user = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    tenantId: user.tenantId,
    companyId: user.companyId,
    branchId: user.branchId,
    roles: decoded.roles || ['USER'],
    permissions: userPermissions
  };

  next();
}

// 3. Multi-Tenant Context Enforcement Middleware
export function enforceTenantContext(req: CustomRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'User not authenticated' });
  }

  // Tenant header & body context validation against authenticated server-side identity
  const headerTenantId = req.headers['x-tenant-id'] as string;
  const bodyTenantId = req.body?.tenantId || req.body?.tenant_id;
  
  const targetTenantId = headerTenantId || bodyTenantId;

  if (targetTenantId && targetTenantId !== req.user.tenantId) {
    // Audit violation attempt
    auditRepo.log({
      tenantId: req.user.tenantId,
      actorUserId: req.user.userId,
      actorEmail: req.user.email,
      action: 'TENANT_ISOLATION_VIOLATION_ATTEMPT',
      module: 'Shared Core Security',
      resource: `${req.method} ${req.originalUrl} [AttemptedTenant: ${targetTenantId}]`,
      ipAddress: req.ip || '127.0.0.1',
      correlationId: req.correlationId || generateUuidV7(),
      status: 'FAILURE'
    });

    return res.status(403).json({
      success: false,
      error: 'FORBIDDEN_CROSS_TENANT_ACCESS',
      message: `Tenant Isolation Security: User of Tenant [${req.user.tenantId}] is strictly forbidden from accessing Target Tenant [${targetTenantId}].`
    });
  }

  next();
}

// 4. RBAC Permission Middleware
export function requirePermission(permissionCode: string) {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'User not authenticated' });
    }

    const hasPerm = req.user.permissions.includes(permissionCode) || req.user.permissions.includes('shared:admin:access');
    
    if (!hasPerm) {
      auditRepo.log({
        tenantId: req.user.tenantId,
        actorUserId: req.user.userId,
        actorEmail: req.user.email,
        action: 'RBAC_PERMISSION_DENIED',
        module: 'Shared Core Security',
        resource: `${req.method} ${req.originalUrl} [ReqPerm: ${permissionCode}]`,
        ipAddress: req.ip || '127.0.0.1',
        correlationId: req.correlationId || generateUuidV7(),
        status: 'FAILURE'
      });

      return res.status(403).json({
        success: false,
        error: 'FORBIDDEN_PERMISSION_REQUIRED',
        message: `RBAC Access Denied: User lacks required permission [${permissionCode}].`
      });
    }

    next();
  };
}

// 5. Automatic State Mutation Audit Logger Middleware
export function auditLogger(req: CustomRequest, res: Response, next: NextFunction) {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method) && req.user) {
    res.on('finish', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        auditRepo.log({
          tenantId: req.user!.tenantId,
          actorUserId: req.user!.userId,
          actorEmail: req.user!.email,
          action: `API_${req.method}_MUTATION`,
          module: 'Shared Core API Gateway',
          resource: req.originalUrl,
          ipAddress: req.ip || '127.0.0.1',
          correlationId: req.correlationId || generateUuidV7(),
          status: 'SUCCESS'
        });
      }
    });
  }
  next();
}
