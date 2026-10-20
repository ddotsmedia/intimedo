#!/usr/bin/env bash
# Restores a dump into a scratch database and checks table counts match the source.
# Usage: DATABASE_URL=... scripts/restore-test.sh <dump-file>
set -euo pipefail
: "${DATABASE_URL:?set DATABASE_URL}"
dump="${1:?dump file}"
scratch_url="${DATABASE_URL%/*}/intimedo_restore_test"
admin_url="${DATABASE_URL%/*}/postgres"

psql "$admin_url" -qc "DROP DATABASE IF EXISTS intimedo_restore_test" -c "CREATE DATABASE intimedo_restore_test"
trap 'psql "$admin_url" -qc "DROP DATABASE IF EXISTS intimedo_restore_test"' EXIT

pg_restore --no-owner --no-privileges --dbname="$scratch_url" "$dump"

count() { psql "$1" -tAc "select count(*) from information_schema.tables where table_schema='public'"; }
src=$(count "$DATABASE_URL"); dst=$(count "$scratch_url")
echo "source tables: $src, restored tables: $dst"
[ "$src" = "$dst" ] || { echo "restore mismatch"; exit 1; }
echo "RESTORE_OK"
