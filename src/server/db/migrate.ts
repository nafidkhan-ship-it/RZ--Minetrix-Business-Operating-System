import 'dotenv/config';
import { readFileSync } from 'fs';
import path from 'path';
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required to run migrations.');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const sql = readFileSync(path.join(process.cwd(), 'src/server/db/migrations/0003_phase2_postgres.sql'), 'utf8');
try { await pool.query(sql); console.log('Phase 2 PostgreSQL schema and RLS are ready.'); } finally { await pool.end(); }
