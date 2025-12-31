const fs = require('fs');
const path = require('path');
const https = require('https');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
let appId = '';
let appKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_ADZUNA_APP_ID=')) {
      appId = line.split('=')[1].trim().replace(/"/g, '');
    }
    if (line.startsWith('ADZUNA_APP_KEY=')) {
      appKey = line.split('=')[1].trim().replace(/"/g, '');
    }
  });
} catch (e) {
  console.error('Could not read .env.local');
  process.exit(1);
}

if (!appId || !appKey) {
  console.error('Credentials not found in .env.local');
  process.exit(1);
}

const url = `https://api.adzuna.com/v1/api/jobs/gb/history?app_id=${appId}&app_key=${appKey}&location0=UK&location1=London&category=it-jobs&content-type=application/json`;

console.log('Fetching:', url.replace(appId, 'HIDDEN').replace(appKey, 'HIDDEN'));

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Response Keys:', Object.keys(json));
      if (json.history) {
        console.log('History Keys Sample:', Object.keys(json.history).slice(0, 5));
        console.log('History First Item:', json.history[Object.keys(json.history)[0]]);
      }
      console.log('Full Response Preview:', JSON.stringify(json, null, 2).substring(0, 500) + '...');
    } catch (e) {
      console.error('Error parsing JSON:', e.message);
      console.log('Raw Data:', data);
    }
  });
}).on('error', (e) => {
  console.error('Request Error:', e);
});
