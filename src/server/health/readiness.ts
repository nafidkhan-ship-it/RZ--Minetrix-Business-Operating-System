import { db } from '../db/database.js';
import { jwtService } from '../security/jwtService.js';
import { LocalStorageProvider } from '../providers/storageProvider.ts';

const storageProvider = new LocalStorageProvider();

export async function getReadinessPayload() {
  const isDbReady = db.tenants.size > 0;
  const adapterStatus = await db.persistenceAdapter.executeHealthCheck();
  const jwtMeta = jwtService.getKeyMetadata();

  return {
    status: isDbReady && adapterStatus.status !== 'UNHEALTHY' ? 'READY' : 'NOT_READY',
    checks: {
      databaseStore: isDbReady ? 'HEALTHY' : 'UNHEALTHY',
      persistenceAdapter: adapterStatus.status,
      persistenceEngine: adapterStatus.engine,
      jwtSignerAlgorithm: jwtMeta.algorithm,
      jwtKeyStatus: jwtMeta.status,
      storageProvider: storageProvider.providerName,
      notificationCore: 'ACTIVE_IN_APP'
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
