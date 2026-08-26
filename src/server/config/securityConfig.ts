/**
 * Central security configuration derived from environment variables.
 * Never log secret values from this module.
 */

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function getCorsAllowedOrigins(): string[] {
  const raw = process.env.CORS_ALLOWED_ORIGINS?.trim();
  if (raw) {
    return raw.split(',').map((o) => o.trim()).filter(Boolean);
  }
  if (!isProduction()) {
    return [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173'
    ];
  }
  return [];
}

export function isOriginAllowed(origin: string | undefined): boolean {
  // Non-browser clients (curl, service-to-service) do not send Origin.
  if (!origin) {
    return true;
  }
  const allowed = getCorsAllowedOrigins();
  return allowed.includes(origin);
}

export function hasProductionJwtKeys(): boolean {
  return Boolean(
    process.env.RSA_PRIVATE_KEY?.trim() && process.env.RSA_PUBLIC_KEY?.trim()
  );
}

export function validateJwtSecurityConfig(): { ok: boolean; status: string; message?: string } {
  if (isProduction()) {
    if (!hasProductionJwtKeys()) {
      return {
        ok: false,
        status: 'PRODUCTION_KEYS_REQUIRED',
        message: 'NODE_ENV=production requires RSA_PRIVATE_KEY and RSA_PUBLIC_KEY.'
      };
    }
    return { ok: true, status: 'PRODUCTION_KEY_LOADED' };
  }

  if (hasProductionJwtKeys()) {
    return { ok: true, status: 'PRODUCTION_KEY_LOADED' };
  }

  if (process.env.ALLOW_EPHEMERAL_JWT_KEYS === 'true' || process.env.ALLOW_EPHEMERAL_JWT_KEYS !== 'false') {
    return { ok: true, status: 'DEVELOPMENT_EPHEMERAL_ALLOWED' };
  }

  return {
    ok: false,
    status: 'EPHEMERAL_KEYS_DISABLED',
    message: 'Set RSA_PRIVATE_KEY/RSA_PUBLIC_KEY or ALLOW_EPHEMERAL_JWT_KEYS=true for development.'
  };
}

export function getTestSuiteSecret(): string | undefined {
  const secret = process.env.SHARED_CORE_TEST_SUITE_SECRET?.trim();
  return secret && secret.length >= 16 ? secret : undefined;
}

export function isTestSuiteEnabled(): boolean {
  if (process.env.SHARED_CORE_TEST_SUITE_ENABLED === 'false') {
    return false;
  }

  const secret = getTestSuiteSecret();
  if (isProduction()) {
    return process.env.SHARED_CORE_TEST_SUITE_ENABLED === 'true' && Boolean(secret);
  }

  return true;
}

export function isTestSuiteAuthorized(providedSecret: unknown): boolean {
  if (!isTestSuiteEnabled()) {
    return false;
  }

  if (!isProduction()) {
    return true;
  }

  const expected = getTestSuiteSecret();
  if (!expected) {
    return false;
  }

  return typeof providedSecret === 'string' && providedSecret === expected;
}

export function getJwtReadinessStatus(): string {
  return validateJwtSecurityConfig().status;
}

export function isSecurityReadyForProduction(): boolean {
  const jwt = validateJwtSecurityConfig();
  if (isProduction() && !jwt.ok) {
    return false;
  }
  if (isProduction() && getCorsAllowedOrigins().length === 0) {
    return false;
  }
  return true;
}
