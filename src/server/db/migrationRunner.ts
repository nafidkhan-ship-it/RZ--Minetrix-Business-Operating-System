import fs from 'fs';
import path from 'path';
import pg from 'pg';

const MIGRATIONS_DIR = path.join(process.cwd(), 'src', 'server', 'db', 'migrations');

export async function runDatabaseMigrations(connectionUrl: string): Promise<string[]> {
  const pool = new pg.Pool({ connectionString: connectionUrl });
  const client = await pool.connect();
  const applied: string[] = [];
  const MIGRATION_LOCK_KEY = 724501;

  try {
    const lockResult = await client.query(
      'SELECT pg_try_advisory_lock($1) AS acquired',
      [MIGRATION_LOCK_KEY]
    );
    if (!lockResult.rows[0]?.acquired) {
      throw new Error('Another migration runner holds the advisory lock. Retry shortly.');
    }

    await client.query(`
      CREATE TABLE IF NOT EXISTS core_schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const filename of files) {
      const existing = await client.query(
        'SELECT 1 FROM core_schema_migrations WHERE filename = $1',
        [filename]
      );
      if (existing.rowCount && existing.rowCount > 0) {
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, filename), 'utf-8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO core_schema_migrations (filename) VALUES ($1)',
          [filename]
        );
        await client.query('COMMIT');
        applied.push(filename);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    try {
      await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_KEY]);
    } catch {
      // Lock is released automatically when the session ends.
    }
    client.release();
    await pool.end();
  }

  return applied;
}
