#!/bin/sh
set -e

if [ -f ../backend/package.json ]; then
  (cd ../backend && npm run schema:generate && cp schema.graphql ../frontend/src/shared/api/schema.graphql)
fi

npx graphql-codegen --config codegen.yml
