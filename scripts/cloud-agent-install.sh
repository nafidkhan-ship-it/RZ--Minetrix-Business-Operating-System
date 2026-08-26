#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

echo "[cloud-agent-install] Installing Node dependencies..."
if [[ -f package-lock.json ]]; then
  npm ci
else
  npm install
fi

echo "[cloud-agent-install] Ensuring PostgreSQL client tools are available..."
if ! command -v psql >/dev/null 2>&1; then
  sudo apt-get update
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y postgresql postgresql-client
fi

echo "[cloud-agent-install] Starting PostgreSQL if needed..."
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  sudo service postgresql start 2>/dev/null || sudo pg_ctlcluster "$(ls /etc/postgresql | head -1)" main start
fi

LOCAL_DATABASE_URL="postgresql://rzminetrix:rz_dev_local@localhost:5432/rz_minetrix_dev"

echo "[cloud-agent-install] Provisioning local development database..."
if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='rzminetrix'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE USER rzminetrix WITH PASSWORD 'rz_dev_local';"
fi

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='rz_minetrix_dev'" | grep -q 1; then
  sudo -u postgres psql -c "CREATE DATABASE rz_minetrix_dev OWNER rzminetrix;"
fi

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE rz_minetrix_dev TO rzminetrix;" >/dev/null 2>&1 || true

if [[ ! -f .env ]]; then
  cp .env.example .env
fi

if ! grep -q '^DATABASE_URL=.' .env || grep -q '^DATABASE_URL=""' .env; then
  if grep -q '^DATABASE_URL=' .env; then
    sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${LOCAL_DATABASE_URL}\"|" .env
  else
    printf '\nDATABASE_URL="%s"\n' "${LOCAL_DATABASE_URL}" >> .env
  fi
fi

echo "[cloud-agent-install] Install complete."
