/**
 * RZ® MINETRIX BOS - Centralized Authentication, Identity & Session Service
 * Full 24 Demo Roles, Multi-Tenant Session Context, and RBAC Persona Management.
 */

import { AuthProfile, UserRole, DeviceSession, SecuritySettings } from '../types/auth';
import { ALL_DEMO_ROLES, getRoleDefinition } from '../types/rbac';

const STORAGE_KEY = 'rz_bos_active_auth_profile';
const SESSIONS_KEY = 'rz_bos_device_sessions';

// 24 Preconfigured Demo Personas
export const PRECONFIGURED_PERSONAS: AuthProfile[] = ALL_DEMO_ROLES.map((roleDef, index) => {
  const p = roleDef.samplePersona;
  return {
    id: `USR-${roleDef.role}-${index + 1}`.slice(0, 16),
    email: p.email,
    phone: p.phone,
    fullName: p.name,
    role: roleDef.role,
    roles: [roleDef.role],
    permissions: roleDef.permissions,
    tenantId: 'RZ-TENANT-GLOBAL-01',
    tenantName: 'Racezone Ventures Global Mining & BOS Operations',
    companyId: 'COMP-01',
    companyName: 'RZ Mining & Crusher Concessions India',
    branchId: 'BR-KL-01',
    branchName: p.unit,
    department: roleDef.category,
    designation: p.designation,
    accountCategory:
      roleDef.category === 'EXECUTIVE'
        ? 'BUSINESS_OWNER'
        : roleDef.category === 'EXTERNAL_PARTNER'
        ? 'PUBLIC_USER'
        : 'ENTERPRISE_OPERATOR',
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: new Date().toISOString(),
    securitySettings: {
      isMfaEnabled: roleDef.role === 'SUPER_ADMIN' || roleDef.role === 'OWNER',
      mfaMethod: 'AUTHENTICATOR_APP',
      isPinEnabled: true,
      pinHash: '1234',
      isBiometricsEnabled: roleDef.role === 'SUPER_ADMIN' || roleDef.role === 'OWNER',
      biometricType: 'TOUCH_ID',
      passwordLastChanged: '2026-08-15T10:30:00Z',
      sessionTimeoutMinutes: 480
    }
  };
});

export const MOCK_DEVICE_SESSIONS: DeviceSession[] = [
  {
    id: 'SESS-01-WEB',
    deviceName: 'MacBook Pro 16" (Sonoma)',
    deviceType: 'DESKTOP',
    browser: 'Chrome 128.0',
    os: 'macOS',
    ipAddress: '122.174.192.48',
    location: 'Calicut, Kerala, IN',
    lastActive: 'Just now',
    isCurrent: true
  },
  {
    id: 'SESS-02-MOB',
    deviceName: 'iPhone 15 Pro Max',
    deviceType: 'MOBILE',
    browser: 'RZ Minetrix App / Safari WebKit',
    os: 'iOS 18.2',
    ipAddress: '49.37.199.12',
    location: 'Kochi, Kerala, IN',
    lastActive: '2 hours ago',
    isCurrent: false
  },
  {
    id: 'SESS-03-TAB',
    deviceName: 'Samsung Galaxy Tab S9 (Site Office)',
    deviceType: 'TABLET',
    browser: 'Chrome Mobile',
    os: 'Android 14',
    ipAddress: '157.48.21.90',
    location: 'Kasaragod Site, Kerala, IN',
    lastActive: 'Yesterday',
    isCurrent: false
  }
];

class AuthServiceManager {
  // Default to OWNER persona
  private currentProfile: AuthProfile = PRECONFIGURED_PERSONAS[1] || PRECONFIGURED_PERSONAS[0];
  private deviceSessions: DeviceSession[] = [...MOCK_DEVICE_SESSIONS];
  private listeners: ((profile: AuthProfile) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.currentProfile = JSON.parse(stored);
        }
        const sessionsStored = localStorage.getItem(SESSIONS_KEY);
        if (sessionsStored) {
          this.deviceSessions = JSON.parse(sessionsStored);
        }
      } catch {
        // Fallback to default
      }
    }
  }

  public getProfile(): AuthProfile {
    return this.currentProfile;
  }

  public getCurrentProfile(): AuthProfile {
    return this.currentProfile;
  }

  public isSuperAdmin(): boolean {
    return this.currentProfile.role === 'SUPER_ADMIN' || this.currentProfile.roles.includes('SUPER_ADMIN');
  }

  public subscribe(callback: (profile: AuthProfile) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentProfile));
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(this.deviceSessions));
      } catch {}
    }
    this.listeners.forEach((cb) => cb(this.currentProfile));
  }

  public switchPersona(personaId: string): AuthProfile {
    const found = PRECONFIGURED_PERSONAS.find((p) => p.id === personaId);
    if (found) {
      this.currentProfile = { ...found, lastLoginAt: new Date().toISOString() };
      this.notify();
      return this.currentProfile;
    }
    return this.currentProfile;
  }

  public switchRole(role: UserRole): AuthProfile {
    const found = PRECONFIGURED_PERSONAS.find((p) => p.role === role);
    if (found) {
      this.currentProfile = { ...found, lastLoginAt: new Date().toISOString() };
      this.notify();
      return this.currentProfile;
    }
    // If not found in array, build dynamically
    const def = getRoleDefinition(role);
    const dynamicProfile: AuthProfile = {
      id: `USR-${role}`,
      email: def.samplePersona.email,
      phone: def.samplePersona.phone,
      fullName: def.samplePersona.name,
      role: role,
      roles: [role],
      permissions: def.permissions,
      tenantId: 'RZ-TENANT-GLOBAL-01',
      tenantName: 'Racezone Ventures Global Operations',
      department: def.category,
      designation: def.samplePersona.designation,
      accountCategory: 'ENTERPRISE_OPERATOR',
      createdAt: '2025-01-01T00:00:00Z',
      lastLoginAt: new Date().toISOString(),
      securitySettings: {
        isMfaEnabled: false,
        mfaMethod: 'SMS_OTP',
        isPinEnabled: true,
        pinHash: '1234',
        isBiometricsEnabled: false,
        passwordLastChanged: new Date().toISOString(),
        sessionTimeoutMinutes: 480
      }
    };
    this.currentProfile = dynamicProfile;
    this.notify();
    return this.currentProfile;
  }

  public loginWithCredentials(
    identifier: string,
    passwordAttempt: string,
    rememberDevice: boolean = true
  ): { success: boolean; message?: string } {
    const normalized = identifier.trim().toLowerCase();
    const found = PRECONFIGURED_PERSONAS.find(
      (p) => p.email.toLowerCase() === normalized || p.phone.replace(/\s+/g, '') === normalized.replace(/\s+/g, '')
    );

    if (found) {
      this.currentProfile = { ...found, lastLoginAt: new Date().toISOString() };
      this.notify();
      return { success: true };
    }

    // Generic successful login for any new valid identifier
    if (identifier.length >= 3 && passwordAttempt.length >= 4) {
      const isPhone = /^[0-9+]+$/.test(identifier.replace(/\s+/g, ''));
      const newProfile: AuthProfile = {
        id: `USR-ID-${Date.now().toString().slice(-6)}`,
        email: isPhone ? `${identifier.replace(/[^0-9]/g, '')}@rzminetrix.com` : identifier,
        phone: isPhone ? identifier : '+91 98000 00000',
        fullName: identifier.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
        role: 'CUSTOMER',
        roles: ['CUSTOMER'],
        permissions: ['ORDER.VIEW', 'ORDER.CREATE', 'LATERITE.ORDER', 'CHAT.VIEW', 'CHAT.SEND', 'OTT.VIEW', 'OTT.CREATE'],
        tenantId: 'RZ-TENANT-PUBLIC',
        tenantName: 'RZ® Public Portal Access',
        accountCategory: 'PUBLIC_USER',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        securitySettings: {
          isMfaEnabled: false,
          mfaMethod: 'SMS_OTP',
          isPinEnabled: false,
          isBiometricsEnabled: false,
          passwordLastChanged: new Date().toISOString(),
          sessionTimeoutMinutes: 720
        }
      };
      this.currentProfile = newProfile;
      this.notify();
      return { success: true };
    }

    return { success: false, message: 'Please provide a valid email/phone and password (min 4 chars).' };
  }

  public loginWithPin(pin: string): { success: boolean; message?: string } {
    if (pin.length === 4 || pin.length === 6) {
      const found = PRECONFIGURED_PERSONAS.find((p) => p.securitySettings.pinHash === pin);
      if (found) {
        this.currentProfile = { ...found, lastLoginAt: new Date().toISOString() };
      } else {
        this.currentProfile = { ...this.currentProfile, lastLoginAt: new Date().toISOString() };
      }
      this.notify();
      return { success: true };
    }
    return { success: false, message: 'Invalid 4-digit or 6-digit PIN.' };
  }

  public register(params: {
    fullName: string;
    email: string;
    phone: string;
    accountCategory: any;
    password?: string;
  }): { success: boolean; message?: string } {
    const newProfile: AuthProfile = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      email: params.email,
      phone: params.phone,
      fullName: params.fullName,
      role: 'CUSTOMER',
      roles: ['CUSTOMER'],
      permissions: ['ORDER.VIEW', 'ORDER.CREATE', 'LATERITE.ORDER', 'CHAT.VIEW', 'CHAT.SEND', 'OTT.VIEW', 'OTT.CREATE'],
      tenantId: 'RZ-TENANT-PUBLIC',
      tenantName: 'RZ® Public Portal Access',
      accountCategory: params.accountCategory || 'PUBLIC_USER',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      securitySettings: {
        isMfaEnabled: false,
        mfaMethod: 'SMS_OTP',
        isPinEnabled: false,
        isBiometricsEnabled: false,
        passwordLastChanged: new Date().toISOString(),
        sessionTimeoutMinutes: 720
      }
    };
    this.currentProfile = newProfile;
    this.notify();
    return { success: true };
  }

  public updateSecuritySettings(newSettings: Partial<SecuritySettings>) {
    this.currentProfile.securitySettings = {
      ...this.currentProfile.securitySettings,
      ...newSettings
    };
    this.notify();
  }

  public getDeviceSessions(): DeviceSession[] {
    return this.deviceSessions;
  }

  public revokeDeviceSession(sessionId: string) {
    this.deviceSessions = this.deviceSessions.filter((s) => s.id !== sessionId);
    this.notify();
  }

  public logout() {
    // Switch to public Customer persona
    const customer = PRECONFIGURED_PERSONAS.find((p) => p.role === 'CUSTOMER') || PRECONFIGURED_PERSONAS[0];
    this.currentProfile = { ...customer, fullName: 'Guest User', email: 'guest@rzminetrix.com' };
    this.notify();
  }
}

export const authService = new AuthServiceManager();
