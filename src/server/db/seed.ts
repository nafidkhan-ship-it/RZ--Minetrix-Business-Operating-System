import 'dotenv/config';
import { Pool } from 'pg';

if (process.env.NODE_ENV === 'production') throw new Error('Database seeding is disabled in production.');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for the development seed.');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
try {
  await pool.query(`INSERT INTO tenants (code, name, domain, tier) VALUES ('DEV', 'Development Tenant', 'dev.invalid', 'STANDARD') ON CONFLICT (code) DO NOTHING`);
  console.log('Development tenant seed complete (no credentials or personal data).');
} finally { await pool.end(); }
