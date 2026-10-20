#!/usr/bin/env bash
# Usage: DATABASE_URL=... scripts/backup.sh <output-dir>
set -euo pipefail
: "${DATABASE_URL:?set DATABASE_URL}"
out="${1:?output directory}"
mkdir -p "$out"
file="$out/intimedo-$(date -u +%Y%m%dT%H%M%SZ).dump"
pg_dump --format=custom --no-owner --no-privileges --file="$file" "$DATABASE_URL"
echo "$file"
