import fs from 'fs';
import path from 'path';
import pg from 'pg';

const MIGRATIONS_DIR = path.join(process.cwd(), 'src', 'server', 'db', 'migrations');
const MIGRATION_LOCK_KEY = 724501;

export interface MigrationReport {
  success: boolean;
  executed: string[];
  skipped: string[];
  totalAvailable: number;
  durationMs: number;
  error?: string;
}

export async function runPendingMigrations(pool: pg.Pool): Promise<MigrationReport> {
  const start = Date.now();
  const executed: string[] = [];
  const skipped: string[] = [];
  const client = await pool.connect();
  let totalAvailable = 0;

  try {
    await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_KEY]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS core_schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const appliedResult = await client.query<{ version: string }>(
      'SELECT version FROM schema_migrations'
    );
    const applied = new Set(appliedResult.rows.map((row) => row.version));
    const coreAppliedResult = await client.query<{ filename: string }>(
      'SELECT filename FROM core_schema_migrations'
    );
    for (const row of coreAppliedResult.rows) {
      applied.add(row.filename.replace(/\.sql$/, ''));
    }
    const files = fs.existsSync(MIGRATIONS_DIR)
      ? fs.readdirSync(MIGRATIONS_DIR).filter((file) => file.endsWith('.sql')).sort()
      : [];
    totalAvailable = files.length;

    for (const file of files) {
      const version = file.replace(/\.sql$/, '');
      if (applied.has(version)) {
        await client.query(
          'INSERT INTO schema_migrations (version, name) VALUES ($1, $2) ON CONFLICT (version) DO NOTHING',
          [version, file]
        );
        await client.query(
          'INSERT INTO core_schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
          [file]
        );
        skipped.push(file);
        continue;
      }

      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version, name) VALUES ($1, $2)',
          [version, file]
        );
        await client.query(
          'INSERT INTO core_schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
          [file]
        );
        await client.query('COMMIT');
        executed.push(file);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    return {
      success: true,
      executed,
      skipped,
      totalAvailable,
      durationMs: Date.now() - start
    };
  } catch (error) {
    return {
      success: false,
      executed,
      skipped,
      totalAvailable,
      durationMs: Date.now() - start,
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    try {
      await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_KEY]);
    } catch (error) {
      console.warn('[MigrationRunner] Could not release advisory lock; closing connection will release it.', error);
    }
    client.release();
  }
}

export async function runDatabaseMigrations(connectionUrl: string): Promise<string[]> {
  const pool = new pg.Pool({ connectionString: connectionUrl });
  try {
    const report = await runPendingMigrations(pool);
    if (!report.success) {
      throw new Error(report.error || 'Migration runner failed.');
    }
    return report.executed;
  } finally {
    await pool.end();
  }
}
