#!/bin/bash

PROJECT_ID="qwmtopylhkqcbezcnhws"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bXRvcHlsaGtxY2JlemNuaHdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk3NTM2NywiZXhwIjoyMDkyNTUxMzY3fQ.1RO0RuPL5HWQNDXlW9L8X_t0g2Aw-dGV3DU7r8g3T7c"
FUNCTION_NAME="generate-image"

# Create function dir
mkdir -p supabase/functions/$FUNCTION_NAME

# Read function file
FUNCTION_CODE=$(cat supabase/functions/$FUNCTION_NAME/index.ts)

echo "Deploying $FUNCTION_NAME to $PROJECT_ID..."

# Use Supabase API to deploy
curl -X POST \
  "https://api.supabase.io/v1/projects/$PROJECT_ID/functions" \
  -H "Authorization: Bearer $SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d @- << PAYLOAD
{
  "name": "$FUNCTION_NAME",
  "slug": "$FUNCTION_NAME",
  "verify_jwt": false,
  "body": $(jq -Rs . < supabase/functions/$FUNCTION_NAME/index.ts)
}
PAYLOAD

