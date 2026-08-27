import pg from 'pg';

let sharedPool: pg.Pool | null = null;

export function isPostgresEnabled(): boolean {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  return Boolean(url && url.length > 5);
}

export function getPostgresPool(): pg.Pool | null {
  if (!isPostgresEnabled()) {
    return null;
  }

  if (!sharedPool) {
    sharedPool = new pg.Pool({
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
  }

  return sharedPool;
}

export async function closePostgresPool(): Promise<void> {
  if (sharedPool) {
    await sharedPool.end();
    sharedPool = null;
  }
}
