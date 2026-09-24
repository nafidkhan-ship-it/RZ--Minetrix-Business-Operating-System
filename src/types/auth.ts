/**
 * RZ® MINETRIX BOS - Authentication, Identity & Session Architecture
 */

export type UserRole =
  | 'SUPER_ADMIN'
  | 'OWNER'
  | 'DIRECTOR'
  | 'ADMIN'
  | 'GENERAL_MANAGER'
  | 'MANAGER'
  | 'ACCOUNTANT'
  | 'HR'
  | 'SUPERVISOR'
  | 'OPERATOR'
  | 'DRIVER'
  | 'STAFF'
  | 'SALES'
  | 'PURCHASE'
  | 'STORE'
  | 'DISPATCH'
  | 'MARKETING'
  | 'CONTRACTOR'
  | 'CUSTOMER'
  | 'SUPPLIER'
  | 'SELLER'
  | 'BUYER'
  | 'LAND_OWNER'
  | 'SERVICE_PROVIDER'
  // Compatibility aliases
  | 'ORGANIZATION_ADMIN'
  | 'PUBLIC_USER';

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET';
  browser: string;
  os: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecuritySettings {
  isMfaEnabled: boolean;
  mfaMethod: 'AUTHENTICATOR_APP' | 'SMS_OTP' | 'WHATSAPP_OTP' | 'EMAIL_OTP';
  isPinEnabled: boolean;
  pinHash?: string;
  isBiometricsEnabled: boolean;
  biometricType?: 'TOUCH_ID' | 'FACE_ID' | 'WEBAUTHN';
  passwordLastChanged: string;
  sessionTimeoutMinutes: number;
}

export interface AuthProfile {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  roles: UserRole[];
  permissions: string[];
  tenantId: string;
  tenantName: string;
  companyId?: string;
  companyName?: string;
  branchId?: string;
  branchName?: string;
  department?: string;
  designation?: string;
  linkedEmployeeId?: string;
  linkedDriverId?: string;
  linkedOperatorId?: string;
  accountCategory: 'ENTERPRISE_OPERATOR' | 'BUSINESS_OWNER' | 'TRANSPORTER' | 'PUBLIC_USER' | 'CANDIDATE';
  createdAt: string;
  lastLoginAt: string;
  securitySettings: SecuritySettings;
}
