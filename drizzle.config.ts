import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!databaseUrl || !databaseUrl.trim()) {
  throw new Error('DATABASE_URL or POSTGRES_URL must be configured before running Drizzle migrations. Local JSON fallback is disabled.');
}

export default defineConfig({
  schema: './src/server/db/drizzleSchema.ts',
  out: './src/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true
});
