#!/usr/bin/env bash
# Stage 5A — read-only GCP live verification (Cloud Run / Cloud SQL / Secret Manager)
set -euo pipefail

cd "$(dirname "$0")/.."

export PATH="/home/ubuntu/google-cloud-sdk/google-cloud-sdk/bin:${PATH}"

GCP_PROJECT="${GCP_PROJECT:-rz-mintrix-bos}"
GCP_REGION="${GCP_REGION:-us-central1}"
CLOUD_RUN_SERVICE="${CLOUD_RUN_SERVICE:-rz-minetrix}"
CLOUD_SQL_INSTANCE="${CLOUD_SQL_INSTANCE:-rz-minetrix-db}"
SECRET_DATABASE_URL="${SECRET_DATABASE_URL:-rz-minetrix-database-url}"

PASS=0
FAIL=0
SKIP=0

log_pass() { echo "PASS $1"; PASS=$((PASS + 1)); }
log_fail() { echo "FAIL $1"; echo "      -> $2"; FAIL=$((FAIL + 1)); }
log_skip() { echo "SKIP $1"; echo "      -> $2"; SKIP=$((SKIP + 1)); }

echo "=== Stage 5A Live Verification ==="
echo "project=${GCP_PROJECT} region=${GCP_REGION} service=${CLOUD_RUN_SERVICE} sql=${CLOUD_SQL_INSTANCE}"
echo

# Gate 1 — GCP authentication (read-only)
if [[ -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" && -f "${GOOGLE_APPLICATION_CREDENTIALS}" ]]; then
  export CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE="${GOOGLE_APPLICATION_CREDENTIALS}"
  log_pass "GOOGLE_APPLICATION_CREDENTIALS file present"
elif gcloud auth list --filter=status:ACTIVE --format='value(account)' 2>/dev/null | grep -q .; then
  log_pass "gcloud active account configured"
else
  log_fail "GCP authentication" "No GOOGLE_APPLICATION_CREDENTIALS file and no active gcloud account"
fi

if gcloud config set project "${GCP_PROJECT}" >/dev/null 2>&1; then
  ACTIVE_PROJECT="$(gcloud config get-value project 2>/dev/null || true)"
  if [[ "${ACTIVE_PROJECT}" == "${GCP_PROJECT}" ]]; then
    log_pass "gcloud project set to ${GCP_PROJECT}"
  else
    log_fail "gcloud project" "expected ${GCP_PROJECT}, got ${ACTIVE_PROJECT:-unset}"
  fi
else
  log_fail "gcloud project" "unable to set project ${GCP_PROJECT}"
fi

# Gate 2 — Cloud Run (read-only describe)
if gcloud run services describe "${CLOUD_RUN_SERVICE}" \
  --region="${GCP_REGION}" \
  --project="${GCP_PROJECT}" \
  --format='value(status.url)' >/tmp/stage5a_run_url.txt 2>/tmp/stage5a_run_err.txt; then
  RUN_URL="$(tr -d '\n' </tmp/stage5a_run_url.txt)"
  if [[ -n "${RUN_URL}" ]]; then
    log_pass "Cloud Run service ${CLOUD_RUN_SERVICE} exists (${RUN_URL})"
  else
    log_fail "Cloud Run service ${CLOUD_RUN_SERVICE}" "describe succeeded but URL empty"
  fi
else
  log_fail "Cloud Run service ${CLOUD_RUN_SERVICE}" "$(head -1 /tmp/stage5a_run_err.txt)"
  RUN_URL="${CLOUD_RUN_SERVICE_URL:-}"
fi

if [[ -z "${RUN_URL:-}" && -n "${CLOUD_RUN_SERVICE_URL:-}" ]]; then
  RUN_URL="${CLOUD_RUN_SERVICE_URL}"
fi

# Gate 3 — Cloud SQL (read-only describe)
if gcloud sql instances describe "${CLOUD_SQL_INSTANCE}" \
  --project="${GCP_PROJECT}" \
  --format='value(state)' >/tmp/stage5a_sql_state.txt 2>/tmp/stage5a_sql_err.txt; then
  SQL_STATE="$(tr -d '\n' </tmp/stage5a_sql_state.txt)"
  log_pass "Cloud SQL instance ${CLOUD_SQL_INSTANCE} state=${SQL_STATE}"
else
  log_fail "Cloud SQL instance ${CLOUD_SQL_INSTANCE}" "$(head -1 /tmp/stage5a_sql_err.txt)"
fi

# Gate 4 — Secret Manager (read-only metadata)
if gcloud secrets describe "${SECRET_DATABASE_URL}" \
  --project="${GCP_PROJECT}" \
  --format='value(name)' >/tmp/stage5a_secret.txt 2>/tmp/stage5a_secret_err.txt; then
  log_pass "Secret Manager secret ${SECRET_DATABASE_URL} exists"
else
  log_fail "Secret Manager secret ${SECRET_DATABASE_URL}" "$(head -1 /tmp/stage5a_secret_err.txt)"
fi

# Gate 5 — Deployed readiness (HTTP, read-only)
if [[ -n "${RUN_URL:-}" ]]; then
  LIVENESS_CODE="$(curl -sS -o /tmp/stage5a_liveness.json -w '%{http_code}' "${RUN_URL}/health/liveness" || true)"
  READINESS_CODE="$(curl -sS -o /tmp/stage5a_readiness.json -w '%{http_code}' "${RUN_URL}/health/readiness" || true)"

  if [[ "${LIVENESS_CODE}" == "200" ]]; then
    log_pass "Deployed /health/liveness returns 200"
  else
    log_fail "Deployed /health/liveness" "HTTP ${LIVENESS_CODE}"
  fi

  if [[ "${READINESS_CODE}" == "200" ]]; then
    if node -e "
      const fs=require('fs');
      const body=JSON.parse(fs.readFileSync('/tmp/stage5a_readiness.json','utf8'));
      const adapter=body?.checks?.persistenceAdapter;
      const mode=body?.checks?.persistenceMode;
      const ok=adapter==='POSTGRESQL_CONNECTED' && mode==='POSTGRESQL';
      if(!ok){ console.error('adapter='+adapter+' mode='+mode); process.exit(1);}
    " 2>/tmp/stage5a_readiness_err.txt; then
      log_pass "Deployed /health/readiness reports POSTGRESQL_CONNECTED"
    else
      log_fail "Deployed /health/readiness persistence" "$(cat /tmp/stage5a_readiness_err.txt)"
    fi
  else
    log_fail "Deployed /health/readiness" "HTTP ${READINESS_CODE}"
  fi
else
  log_skip "Deployed health endpoints" "Cloud Run URL unavailable"
fi

# Gate 6 — Cloud SQL migrations 0001–0005
CLOUD_DATABASE_URL="${STAGE5A_DATABASE_URL:-${DATABASE_URL:-}}"
if [[ -n "${CLOUD_DATABASE_URL}" ]]; then
  DB_HOST="$(node -e "try{console.log(new URL(process.argv[1].replace(/^postgresql:/,'postgres:')).hostname)}catch{}" "${CLOUD_DATABASE_URL}")"
  if [[ "${DB_HOST}" == "localhost" || "${DB_HOST}" == "127.0.0.1" ]]; then
    log_fail "Cloud SQL DATABASE_URL" "DATABASE_URL points to ${DB_HOST}, not Cloud SQL"
  else
  EXPECTED_MIGRATIONS=(0001_shared_core_init.sql 0002_row_level_security.sql 0003_platform_snapshot.sql 0004_rls_text_tenant_context.sql 0005_erp_quarry_foundation.sql)
  if node -e "
    const pg=require('pg');
    const url=process.env.DATABASE_URL;
    (async()=>{
      const client=new pg.Client({ connectionString:url, ssl: process.env.PGSSLMODE ? { rejectUnauthorized:false } : undefined });
      await client.connect();
      const res=await client.query('SELECT filename FROM core_schema_migrations ORDER BY filename');
      const applied=new Set(res.rows.map(r=>r.filename));
      const expected=process.argv.slice(1);
      const missing=expected.filter(m=>!applied.has(m));
      if(missing.length){ console.error('missing: '+missing.join(', ')); process.exit(1);}
      await client.end();
    })().catch(e=>{ console.error(e.message); process.exit(1); });
  " "${EXPECTED_MIGRATIONS[@]}"; then
    log_pass "Migrations 0001–0005 applied on Cloud SQL"
  else
    log_fail "Migrations 0001–0005 on Cloud SQL" "see error above"
  fi
  fi
else
  log_fail "Cloud SQL DATABASE_URL" "DATABASE_URL not set"
fi

# Gate 7 — Live RLS integration tests against Cloud SQL
if [[ -n "${CLOUD_DATABASE_URL}" ]]; then
  DB_HOST="$(node -e "try{console.log(new URL(process.argv[1].replace(/^postgresql:/,'postgres:')).hostname)}catch{}" "${CLOUD_DATABASE_URL}")"
  if [[ "${DB_HOST}" != "localhost" && "${DB_HOST}" != "127.0.0.1" ]]; then
    if DATABASE_URL="${CLOUD_DATABASE_URL}" npm run test:postgres-rls >/tmp/stage5a_rls.out 2>&1; then
      if grep -q '9/9 passed' /tmp/stage5a_rls.out; then
        log_pass "PostgreSQL RLS integration tests on Cloud SQL (9/9)"
      else
        log_fail "PostgreSQL RLS integration tests" "$(tail -3 /tmp/stage5a_rls.out)"
      fi
    else
      log_fail "PostgreSQL RLS integration tests" "$(tail -3 /tmp/stage5a_rls.out)"
    fi
  fi
fi

echo
echo "Stage 5A summary: ${PASS} passed, ${FAIL} failed, ${SKIP} skipped"
if [[ "${FAIL}" -eq 0 && "${SKIP}" -eq 0 ]]; then
  echo "STAGE_5A_STATUS=LIVE_VERIFIED"
  exit 0
fi

echo "STAGE_5A_STATUS=BLOCKED"
exit 1
