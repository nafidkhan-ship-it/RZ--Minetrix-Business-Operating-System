#!/usr/bin/env tsx
import 'dotenv/config';
import { runDatabaseMigrations } from '../src/server/db/migrationRunner.js';

const connectionUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionUrl) {
  console.error('DATABASE_URL or POSTGRES_URL is required to run migrations.');
  process.exit(1);
}

runDatabaseMigrations(connectionUrl)
  .then((applied) => {
    if (applied.length === 0) {
      console.log('No new migrations to apply.');
    } else {
      console.log(`Applied migrations: ${applied.join(', ')}`);
    }
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
