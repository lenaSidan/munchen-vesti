const fs = require('fs');
const path = require('path');

const now = new Date();
const version = now.toISOString().replace(/[:.]/g, '-');

fs.writeFileSync(
  path.join(__dirname, '../public/version.txt'),
  version
);

console.log('✅ version.txt обновлён:', version);
