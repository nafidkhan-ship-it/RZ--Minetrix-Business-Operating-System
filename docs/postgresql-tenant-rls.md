# PostgreSQL Tenant Context & RLS

## Overview

When `DATABASE_URL` is set, the Shared Core backend persists state to PostgreSQL and
enforces tenant isolation at the database layer using Row-Level Security (RLS).

Application-level tenant checks (`enforceTenantContext` middleware) remain in place.
PostgreSQL RLS provides an independent enforcement boundary.

## Tenant context establishment

1. **Authentication** — `authenticateJwt` validates the JWT and loads the user from
   the authenticated server-side user record (`req.user.tenantId`).
2. **Authorization** — `enforceTenantContext` rejects client-supplied `x-tenant-id` or
   body `tenantId` values that do not match `req.user.tenantId`.
3. **Request scope** — `runWithRequestTenant()` binds the tenant ID to the current
   async request via `AsyncLocalStorage` (not a global variable).
4. **Database transaction** — `withTenantTransaction(tenantId, fn)` runs:
   ```sql
   BEGIN;
   SELECT set_config('app.current_tenant_id', $1, true);  -- transaction-local (SET LOCAL)
   -- queries ...
   COMMIT;
   ```
   The third argument `true` makes the setting local to the transaction. It is cleared
   on `COMMIT` or `ROLLBACK`, preventing pool connection leakage.

## RLS-protected tables

Migration `0002_row_level_security.sql` enables RLS on:

- `core_companies`
- `core_branches`
- `core_users`
- `core_audit_logs`

Migration `0004_rls_text_tenant_context.sql` adds `WITH CHECK` policies and
`FORCE ROW LEVEL SECURITY` so inserts/updates cannot bypass tenant boundaries.

Policies compare:
```sql
tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')
```

## Running migrations

```bash
export DATABASE_URL="postgresql://user:pass@host:5432/dbname"
npm run db:migrate
```

## Running PostgreSQL RLS integration tests

Requires a live PostgreSQL instance and `DATABASE_URL`:

```bash
export DATABASE_URL="postgresql://user:pass@localhost:5432/rz_minetrix_dev"
npm run test:postgres-rls
```

Verify RLS database state (read-only):

```bash
npm run verify:rls-state
```

Tests are skipped (exit 0) when `DATABASE_URL` is not set.

## Health endpoint

`GET /health/readiness` reports:

| `persistenceAdapter` | Meaning |
|---|---|
| `POSTGRESQL_CONNECTED` | `DATABASE_URL` set and PostgreSQL reachable |
| `FALLBACK_JSON` | No `DATABASE_URL`; using local JSON file |
| `NOT_CONNECTED` | `DATABASE_URL` set but connection failed |

## Required environment

See `.env.example` for `DATABASE_URL`, `RSA_PRIVATE_KEY`, and `RSA_PUBLIC_KEY`.

Never commit credentials. In GCP, bind `rz-minetrix-database-url` from Secret Manager.
