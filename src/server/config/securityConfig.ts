import crypto from 'crypto';

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

export function validateDatabaseConfig(): { ok: boolean; status: string; message?: string } {
  const hasDatabaseUrl = Boolean(
    process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim()
  );

  if (isProduction()) {
    if (!hasDatabaseUrl) {
      return {
        ok: false,
        status: 'PRODUCTION_DATABASE_URL_REQUIRED',
        message: 'NODE_ENV=production requires DATABASE_URL (PostgreSQL). JSON fallback is not permitted.'
      };
    }
    return { ok: true, status: 'POSTGRESQL_CONFIGURED' };
  }

  return {
    ok: true,
    status: hasDatabaseUrl ? 'POSTGRESQL_CONFIGURED' : 'DEVELOPMENT_JSON_FALLBACK'
  };
}

export function isSecurityReadyForProduction(): boolean {
  const jwt = validateJwtSecurityConfig();
  const signedUrl = validateSignedUrlSecurityConfig();
  const database = validateDatabaseConfig();
  if (isProduction() && !jwt.ok) {
    return false;
  }
  if (isProduction() && !signedUrl.ok) {
    return false;
  }
  if (isProduction() && !database.ok) {
    return false;
  }
  if (isProduction() && getCorsAllowedOrigins().length === 0) {
    return false;
  }
  return true;
}

const MIN_SIGNED_URL_SECRET_LENGTH = 32;
let cachedDevSignedUrlSecret: string | null = null;

export function hasConfiguredSignedUrlSecret(): boolean {
  const secret = process.env.SIGNED_URL_HMAC_SECRET?.trim();
  return Boolean(secret && secret.length >= MIN_SIGNED_URL_SECRET_LENGTH);
}

export function validateSignedUrlSecurityConfig(): {
  ok: boolean;
  status: string;
  message?: string;
  source?: 'env' | 'ephemeral';
} {
  if (hasConfiguredSignedUrlSecret()) {
    return { ok: true, status: 'PRODUCTION_SECRET_LOADED', source: 'env' };
  }

  if (isProduction()) {
    return {
      ok: false,
      status: 'PRODUCTION_SECRET_REQUIRED',
      message: 'NODE_ENV=production requires SIGNED_URL_HMAC_SECRET (min 32 characters).'
    };
  }

  if (
    process.env.ALLOW_EPHEMERAL_SIGNED_URL_SECRET === 'true' ||
    process.env.ALLOW_EPHEMERAL_SIGNED_URL_SECRET !== 'false'
  ) {
    return { ok: true, status: 'DEVELOPMENT_EPHEMERAL_ALLOWED', source: 'ephemeral' };
  }

  return {
    ok: false,
    status: 'EPHEMERAL_SECRET_DISABLED',
    message: 'Set SIGNED_URL_HMAC_SECRET or ALLOW_EPHEMERAL_SIGNED_URL_SECRET=true for development.'
  };
}

export function getSignedUrlHmacSecret(): string {
  const configured = process.env.SIGNED_URL_HMAC_SECRET?.trim();
  if (configured) {
    if (configured.length < MIN_SIGNED_URL_SECRET_LENGTH) {
      throw new Error(`SIGNED_URL_HMAC_SECRET must be at least ${MIN_SIGNED_URL_SECRET_LENGTH} characters.`);
    }
    return configured;
  }

  if (isProduction()) {
    throw new Error('Production requires SIGNED_URL_HMAC_SECRET environment variable.');
  }

  const validation = validateSignedUrlSecurityConfig();
  if (!validation.ok) {
    throw new Error(validation.message || 'Signed URL HMAC secret is not configured.');
  }

  if (!cachedDevSignedUrlSecret) {
    cachedDevSignedUrlSecret = crypto.randomBytes(32).toString('hex');
    console.warn('[Storage] Using ephemeral signed-URL HMAC secret for development.');
  }

  return cachedDevSignedUrlSecret;
}

export function signSignedUrlPayload(storageKey: string, expiresAt: number): string {
  const secret = getSignedUrlHmacSecret();
  return crypto.createHmac('sha256', secret).update(`${storageKey}:${expiresAt}`).digest('hex');
}

export function verifySignedUrlSignature(
  storageKey: string,
  expiresAt: number,
  signature: string
): boolean {
  if (!signature || !Number.isFinite(expiresAt)) {
    return false;
  }

  const expected = signSignedUrlPayload(storageKey, expiresAt);
  const provided = Buffer.from(signature, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');

  if (provided.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(provided, expectedBuffer);
}
