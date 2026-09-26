/**
 * RZ® MINETRIX BOS — Version-Controlled PostgreSQL Migration Runner
 * Guarantees every migration file executes strictly once in lexical order,
 * with distributed advisory lock protection against Cloud Run concurrent startups.
 */

import fs from 'fs';
import path from 'path';
import pg from 'pg';

export interface MigrationReport {
  success: boolean;
  executed: string[];
  skipped: string[];
  totalAvailable: number;
  durationMs: number;
  error?: string;
}

const MIGRATION_LOCK_ID = 987654321; // Dedicated integer ID for global schema migration lock

export async function runPendingMigrations(pool: pg.Pool): Promise<MigrationReport> {
  const start = Date.now();
  const executed: string[] = [];
  const skipped: string[] = [];

  const client = await pool.connect();
  try {
    // 1. Acquire Distributed Advisory Lock
    await client.query('SELECT pg_advisory_lock($1)', [MIGRATION_LOCK_ID]);

    // 2. Ensure schema_migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 3. Query existing applied migrations
    const appliedResult = await client.query<{ version: string }>(
      'SELECT version FROM schema_migrations ORDER BY version ASC'
    );
    const appliedSet = new Set(appliedResult.rows.map(r => r.version));

    // 4. Locate migration SQL files
    const migrationsDir = path.join(process.cwd(), 'src', 'server', 'db', 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      return {
        success: true,
        executed: [],
        skipped: [],
        totalAvailable: 0,
        durationMs: Date.now() - start
      };
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    for (const file of files) {
      // Use the complete filename stem as the version. Prefix-only versions
      // collide for files such as 0003_fleet_operations.sql and
      // 0003_phase2_postgres.sql.
      const version = file.replace(/\.sql$/, '');
      if (appliedSet.has(version)) {
        skipped.push(file);
        continue;
      }

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      // Execute migration inside a single atomic transaction
      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO schema_migrations (version, name, executed_at) VALUES ($1, $2, NOW())',
          [version, file]
        );
        await client.query('COMMIT');
        executed.push(file);
        console.log(`[MigrationRunner] Successfully applied migration: ${file}`);
      } catch (migErr: any) {
        await client.query('ROLLBACK');
        console.error(`[MigrationRunner] Failed executing migration ${file}:`, migErr.message);
        throw new Error(`Migration '${file}' failed: ${migErr.message}`);
      }
    }

    return {
      success: true,
      executed,
      skipped,
      totalAvailable: files.length,
      durationMs: Date.now() - start
    };
  } catch (err: any) {
    return {
      success: false,
      executed,
      skipped,
      totalAvailable: 0,
      durationMs: Date.now() - start,
      error: err.message
    };
  } finally {
    try {
      // Release distributed advisory lock
      await client.query('SELECT pg_advisory_unlock($1)', [MIGRATION_LOCK_ID]);
    } catch (unlockErr) {
      console.warn('[MigrationRunner] Notice releasing migration advisory lock:', unlockErr);
    }
    client.release();
  }
}
