#!/usr/bin/env tsx
import 'dotenv/config';
import { getPostgresPool, isPostgresEnabled } from '../src/server/db/postgresPool.js';
import { runDatabaseMigrations } from '../src/server/db/migrationRunner.js';

async function main() {
  if (!isPostgresEnabled()) {
    console.log('DATABASE_URL not configured — skipping RLS state verification');
    process.exit(0);
  }

  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  await runDatabaseMigrations(url!);

  const pool = getPostgresPool()!;
  const client = await pool.connect();
  try {
    const tables = await client.query(
      `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`
    );
    const policies = await client.query(
      `SELECT tablename, policyname, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname`
    );
    const migrations = await client.query(
      `SELECT filename, applied_at FROM core_schema_migrations ORDER BY id`
    );

    console.log('=== Public tables ===');
    console.table(tables.rows);
    console.log('=== RLS policies ===');
    console.table(policies.rows);
    console.log('=== Applied migrations ===');
    console.table(migrations.rows);
  } finally {
    client.release();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
