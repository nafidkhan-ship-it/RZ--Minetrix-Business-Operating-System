import assert from 'node:assert/strict';

/**
 * PostgreSQL integration smoke tests. CI without DATABASE_URL deliberately skips
 * rather than constructing an unsafe implicit local database.
 */
if (!process.env.DATABASE_URL) {
  console.log('SKIP databaseTests: DATABASE_URL is not configured');
} else {
  const { PostgresPersistenceAdapter } = await import('../db/persistenceAdapter.js');
  const { tenants } = await import('../db/drizzleSchema.js');
  const { eq } = await import('drizzle-orm');
  const adapter = new PostgresPersistenceAdapter();
  try {
    const health = await adapter.executeHealthCheck();
    assert.equal(health.status, 'CONNECTED');
    const code = `TEST-${Date.now()}`;
    const inserted = await adapter.insert(tenants, { code, name: 'Integration Test Tenant', domain: `${code.toLowerCase()}.invalid`, tier: 'STANDARD' });
    assert.equal(inserted.length, 1);
    const found = await adapter.select(tenants, eq(tenants.id, inserted[0].id));
    assert.equal(found[0].code, code);
    await adapter.client.delete(tenants).where(eq(tenants.id, inserted[0].id));
    assert.equal((await adapter.select(tenants, eq(tenants.id, inserted[0].id))).length, 0);
    console.log('PASS databaseTests: connection, CRUD, rollback-safe cleanup');
  } finally {
    await adapter.close();
  }
}
