import request from 'supertest';
import { createCoreApp } from '../app.js';
import { notFoundHandler, errorHandler } from '../middleware/errorHandler.js';
import { initializeDatabase } from '../db/database.js';
import {
  getCorsAllowedOrigins,
  isTestSuiteEnabled,
  validateJwtSecurityConfig,
  validateSignedUrlSecurityConfig,
  verifySignedUrlSignature
} from '../config/securityConfig.js';
import { SECURITY_HEADER_NAMES } from '../middleware/securityHeaders.js';
import { LocalStorageProvider } from '../providers/storageProvider.js';

export interface SecurityTestResult {
  testName: string;
  category: string;
  passed: boolean;
  message: string;
}

export async function runSecurityTests(): Promise<{
  executedAt: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  results: SecurityTestResult[];
}> {
  await initializeDatabase();

  const results: SecurityTestResult[] = [];
  const app = createCoreApp();
  app.use(notFoundHandler);
  app.use(errorHandler);

  function record(category: string, testName: string, passed: boolean, message: string) {
    results.push({ category, testName, passed, message });
  }

  const allowedOrigin = getCorsAllowedOrigins()[0] || 'http://localhost:3000';
  const blockedOrigin = 'https://evil.example.com';

  const corsAllowed = await request(app)
    .get('/health/liveness')
    .set('Origin', allowedOrigin);
  record(
    'CORS',
    'Allows configured development origin',
    corsAllowed.status === 200 && corsAllowed.headers['access-control-allow-origin'] === allowedOrigin,
    `status=${corsAllowed.status}, allow-origin=${corsAllowed.headers['access-control-allow-origin']}`
  );

  const corsBlocked = await request(app)
    .get('/health/liveness')
    .set('Origin', blockedOrigin);
  record(
    'CORS',
    'Rejects unauthorized origin',
    corsBlocked.status === 403,
    `status=${corsBlocked.status}`
  );

  const headersResponse = await request(app).get('/health/liveness');
  const hasSecurityHeaders = SECURITY_HEADER_NAMES.every((header) =>
    Boolean(headersResponse.headers[header])
  );
  record(
    'Security Headers',
    'Helmet security headers present',
    hasSecurityHeaders,
    SECURITY_HEADER_NAMES.map((header) => `${header}=${headersResponse.headers[header]}`).join(', ')
  );

  const jwtValidation = validateJwtSecurityConfig();
  record(
    'JWT',
    'Development JWT configuration is valid',
    jwtValidation.ok,
    jwtValidation.status
  );

  const productionJwtCheck = (() => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.RSA_PRIVATE_KEY;
    delete process.env.RSA_PUBLIC_KEY;
    const result = validateJwtSecurityConfig();
    process.env.NODE_ENV = previousNodeEnv;
    return result;
  })();
  record(
    'JWT',
    'Production requires configured RSA keys',
    !productionJwtCheck.ok && productionJwtCheck.status === 'PRODUCTION_KEYS_REQUIRED',
    productionJwtCheck.status
  );

  const productionSignedUrlCheck = (() => {
    const previousNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    delete process.env.SIGNED_URL_HMAC_SECRET;
    const result = validateSignedUrlSecurityConfig();
    process.env.NODE_ENV = previousNodeEnv;
    return result;
  })();
  record(
    'Signed URL Secret',
    'Production requires configured signed URL HMAC secret',
    !productionSignedUrlCheck.ok && productionSignedUrlCheck.status === 'PRODUCTION_SECRET_REQUIRED',
    productionSignedUrlCheck.status
  );

  const storageProvider = new LocalStorageProvider();
  const signedUrl = await storageProvider.getSignedUrl({
    storageKey: 'tenant-rz-global-001/doc_test.pdf',
    tenantId: 'tenant-rz-global-001'
  });
  const signedUrlParams = new URL(signedUrl, 'http://localhost');
  const storageKey = signedUrlParams.searchParams.get('key') || '';
  const expiresAt = Number(signedUrlParams.searchParams.get('exp'));
  const signature = signedUrlParams.searchParams.get('sig') || '';
  record(
    'Signed URL Secret',
    'Signed URL generation and verification works with configured secret',
    verifySignedUrlSignature(storageKey, expiresAt, signature),
    signedUrl
  );
  record(
    'Signed URL Secret',
    'Signed URL response does not expose secret material',
    !signedUrl.includes('secret') && !signedUrl.includes(process.env.SIGNED_URL_HMAC_SECRET || '__none__'),
    'signed URL path only'
  );

  const testSuiteDisabled = (() => {
    const previousEnabled = process.env.SHARED_CORE_TEST_SUITE_ENABLED;
    process.env.SHARED_CORE_TEST_SUITE_ENABLED = 'false';
    const enabled = isTestSuiteEnabled();
    process.env.SHARED_CORE_TEST_SUITE_ENABLED = previousEnabled;
    return enabled;
  })();
  record(
    'Test Secret',
    'Test suite can be explicitly disabled',
    testSuiteDisabled === false,
    `enabled=${testSuiteDisabled}`
  );

  process.env.SHARED_CORE_TEST_SUITE_ENABLED = 'false';
  const testSuiteBlocked = await request(app).get('/api/v1/test/run-suite');
  delete process.env.SHARED_CORE_TEST_SUITE_ENABLED;
  record(
    'Test Secret',
    'Test suite blocked when disabled',
    testSuiteBlocked.status === 404,
    `status=${testSuiteBlocked.status}`
  );

  process.env.SHARED_CORE_TEST_SUITE_ENABLED = 'true';
  process.env.SHARED_CORE_TEST_SUITE_SECRET = 'test_suite_secret_for_ci_only';
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  const productionSuiteNoKey = await request(app).get('/api/v1/test/run-suite');
  record(
    'Test Secret',
    'Production test suite requires authorization key',
    productionSuiteNoKey.status === 403,
    `status=${productionSuiteNoKey.status}`
  );

  const productionSuiteWithKey = await request(app)
    .get('/api/v1/test/run-suite')
    .query({ key: 'test_suite_secret_for_ci_only' });
  record(
    'Test Secret',
    'Production test suite accepts configured secret',
    productionSuiteWithKey.status === 200 && productionSuiteWithKey.body?.success === true,
    `status=${productionSuiteWithKey.status}`
  );

  process.env.NODE_ENV = previousNodeEnv;
  delete process.env.SHARED_CORE_TEST_SUITE_SECRET;
  delete process.env.SHARED_CORE_TEST_SUITE_ENABLED;

  const invalidLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'not-an-email', password: 'short' });
  record(
    'Input Validation',
    'Login rejects invalid email and short password',
    invalidLogin.status === 400,
    `status=${invalidLogin.status}`
  );

  const readiness = await request(app).get('/health/readiness');
  record(
    'Readiness',
    'Readiness reports JWT and security configuration',
    readiness.status === 200 &&
      readiness.body?.checks?.jwtKeyStatus &&
      readiness.body?.checks?.securityHeaders === 'HELMET_ENABLED',
    `status=${readiness.status}, jwt=${readiness.body?.checks?.jwtKeyStatus}`
  );

  const errorResponse = await request(app).get('/api/v1/does-not-exist');
  record(
    'Error Handling',
    'Unknown routes return JSON error without stack trace',
    errorResponse.status === 404 &&
      errorResponse.body?.success === false &&
      !JSON.stringify(errorResponse.body).includes('stack'),
    `status=${errorResponse.status}`
  );

  const passedCount = results.filter((result) => result.passed).length;
  return {
    executedAt: new Date().toISOString(),
    totalTests: results.length,
    passedCount,
    failedCount: results.length - passedCount,
    results
  };
}
