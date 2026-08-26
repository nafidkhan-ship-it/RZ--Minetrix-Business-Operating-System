import { db } from '../db/database.js';
import { jwtService } from '../security/jwtService.js';
import { LocalStorageProvider } from '../providers/storageProvider.ts';
import { isPostgresEnabled } from '../db/postgresPool.js';
import {
  getCorsAllowedOrigins,
  isSecurityReadyForProduction,
  isTestSuiteEnabled,
  validateJwtSecurityConfig,
  validateSignedUrlSecurityConfig
} from '../config/securityConfig.js';

const storageProvider = new LocalStorageProvider();

export async function getReadinessPayload() {
  const isDbReady = db.tenants.size > 0;
  const adapterStatus = await db.persistenceAdapter.executeHealthCheck();
  const jwtMeta = jwtService.getKeyMetadata();
  const jwtValidation = validateJwtSecurityConfig();
  const signedUrlValidation = validateSignedUrlSecurityConfig();

  const persistenceMode = adapterStatus.status === 'POSTGRESQL_CONNECTED'
    ? 'POSTGRESQL'
    : adapterStatus.status === 'FALLBACK_JSON'
      ? 'FALLBACK_JSON'
      : 'NOT_CONNECTED';

  const isPersistenceHealthy =
    adapterStatus.status === 'POSTGRESQL_CONNECTED' || adapterStatus.status === 'FALLBACK_JSON';

  const securityReady = isSecurityReadyForProduction();
  const corsOrigins = getCorsAllowedOrigins();

  return {
    status: isDbReady && isPersistenceHealthy && jwtValidation.ok && signedUrlValidation.ok && securityReady ? 'READY' : 'NOT_READY',
    checks: {
      databaseStore: isDbReady ? 'HEALTHY' : 'UNHEALTHY',
      persistenceAdapter: adapterStatus.status,
      persistenceMode,
      persistenceEngine: adapterStatus.engine,
      jwtSignerAlgorithm: jwtMeta.algorithm,
      jwtKeyStatus: jwtMeta.status,
      jwtKeySource: jwtMeta.keySource,
      signedUrlSecretStatus: signedUrlValidation.status,
      signedUrlSecretSource: signedUrlValidation.source || 'unknown',
      storageProvider: storageProvider.providerName,
      notificationCore: 'ACTIVE_IN_APP',
      postgresConfigured: isPostgresEnabled(),
      corsConfigured: corsOrigins.length > 0 ? 'CONFIGURED' : 'NOT_CONFIGURED',
      securityHeaders: 'HELMET_ENABLED',
      testSuiteEnabled: isTestSuiteEnabled(),
      securityProductionReady: securityReady
    },
    security: {
      corsAllowedOriginsCount: corsOrigins.length,
      jwt: {
        status: jwtValidation.status,
        ok: jwtValidation.ok,
        keySource: jwtMeta.keySource
      },
      signedUrl: {
        status: signedUrlValidation.status,
        ok: signedUrlValidation.ok,
        source: signedUrlValidation.source || 'unknown'
      },
      testSuite: {
        enabled: isTestSuiteEnabled()
      }
    },
    counts: {
      tenants: db.tenants.size,
      users: db.users.size,
      companies: db.companies.size,
      branches: db.branches.size,
      auditLogs: db.auditLogs.size
    },
    timestamp: new Date().toISOString()
  };
}
