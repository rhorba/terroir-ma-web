#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_OPENAPI="$REPO_ROOT/../terroir-ma/docs/api/openapi.json"
TARGET="$REPO_ROOT/packages/api-client/openapi.json"

if [ ! -f "$BACKEND_OPENAPI" ]; then
  echo "ERROR: openapi.json not found at $BACKEND_OPENAPI"
  echo "Run 'npm run export:openapi' in terroir-ma first."
  exit 1
fi

echo "Copying openapi.json from terroir-ma..."
cp "$BACKEND_OPENAPI" "$TARGET"

echo "Running openapi-ts codegen..."
pnpm --filter @terroir/api-client generate

echo "Done. Types generated in packages/api-client/src/generated/"
