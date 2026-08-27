#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export DATABASE_URL="${DATABASE_URL:-postgresql://rzminetrix:rz_dev_local@localhost:5432/rz_minetrix_dev}"

echo "[cloud-agent-start] Ensuring PostgreSQL is ready..."
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  sudo service postgresql start 2>/dev/null || sudo pg_ctlcluster "$(ls /etc/postgresql | head -1)" main start
fi

until pg_isready -h localhost -p 5432 >/dev/null 2>&1; do
  sleep 1
done

echo "[cloud-agent-start] Applying database migrations..."
npm run db:migrate

echo "[cloud-agent-start] Starting development server on port ${PORT:-3000}..."
npm run dev
