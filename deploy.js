const fs = require('fs');

const projectId = 'qwmtopylhkqcbezcnhws';
const functionCode = fs.readFileSync('./supabase/functions/generate-image/index.ts', 'utf8');

// Deploy via Supabase Management API
const deployUrl = `https://api.supabase.io/v1/projects/${projectId}/functions`;

// Using the service role key as Bearer token
const headers = {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bXRvcHlsaGtxY2JlemNuaHdzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Njk3NTM2NywiZXhwIjoyMDkyNTUxMzY3fQ.1RO0RuPL5HWQNDXlW9L8X_t0g2Aw-dGV3DU7r8g3T7c',
  'Content-Type': 'application/json'
};

const payload = {
  name: 'generate-image',
  slug: 'generate-image',
  verify_jwt: false,
  body: functionCode
};

console.log('Deploying generate-image function...');
console.log('URL:', deployUrl);

// Try using built-in Node fetch
fetch(deployUrl, {
  method: 'POST',
  headers,
  body: JSON.stringify(payload)
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(data => {
  console.log('Response:', JSON.stringify(data, null, 2));
})
.catch(err => console.error('Error:', err));
