import assert from 'node:assert/strict';
import { PostgresPersistenceAdapter } from '../db/persistenceAdapter.js';

/**
 * Persistence smoke test. CI without DATABASE_URL deliberately skips rather
 * than constructing an unsafe implicit local database.
 */
if (!process.env.DATABASE_URL) {
  console.log('SKIP databaseTests: DATABASE_URL is not configured');
} else {
  const adapter = new PostgresPersistenceAdapter();
  const health = await adapter.executeHealthCheck();

  assert.equal(health.status, 'POSTGRESQL_CONNECTED');
  const tables = await adapter.loadAll();
  assert.ok(Array.isArray(tables.tenants));

  console.log('PASS databaseTests: connection and persistence read path');
}
