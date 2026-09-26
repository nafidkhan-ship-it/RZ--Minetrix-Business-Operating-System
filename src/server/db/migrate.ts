import 'dotenv/config';
import { Pool } from 'pg';
import { runPendingMigrations } from './migrationRunner.js';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required to run migrations.');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  const report = await runPendingMigrations(pool);
  if (!report.success) {
    throw new Error(report.error || 'Migration runner failed.');
  }
  console.log(
    `Migrations complete: ${report.executed.length} executed, ` +
    `${report.skipped.length} already applied.`
  );
} finally {
  await pool.end();
}
