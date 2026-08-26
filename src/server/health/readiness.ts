import { db } from '../db/database.js';
import { jwtService } from '../security/jwtService.js';
import { LocalStorageProvider } from '../providers/storageProvider.ts';
import { isPostgresEnabled } from '../db/postgresPool.js';

const storageProvider = new LocalStorageProvider();

export async function getReadinessPayload() {
  const isDbReady = db.tenants.size > 0;
  const adapterStatus = await db.persistenceAdapter.executeHealthCheck();
  const jwtMeta = jwtService.getKeyMetadata();

  const persistenceMode = adapterStatus.status === 'POSTGRESQL_CONNECTED'
    ? 'POSTGRESQL'
    : adapterStatus.status === 'FALLBACK_JSON'
      ? 'FALLBACK_JSON'
      : 'NOT_CONNECTED';

  const isPersistenceHealthy =
    adapterStatus.status === 'POSTGRESQL_CONNECTED' || adapterStatus.status === 'FALLBACK_JSON';

  return {
    status: isDbReady && isPersistenceHealthy ? 'READY' : 'NOT_READY',
    checks: {
      databaseStore: isDbReady ? 'HEALTHY' : 'UNHEALTHY',
      persistenceAdapter: adapterStatus.status,
      persistenceMode,
      persistenceEngine: adapterStatus.engine,
      jwtSignerAlgorithm: jwtMeta.algorithm,
      jwtKeyStatus: jwtMeta.status,
      storageProvider: storageProvider.providerName,
      notificationCore: 'ACTIVE_IN_APP',
      postgresConfigured: isPostgresEnabled()
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
