// This script intercepts `node_modules/.bin/next` to enforce --webpack flag.
// Rename the real next binary entry, this file sits before it in resolution.
// Usage: DO NOT call `next dev` directly — always use `npm run dev`.
const { execSync } = require('child_process');
const args = process.argv.slice(2);

if (args[0] === 'dev' && !args.includes('--webpack') && !args.includes('--turbopack')) {
  console.error('\n\x1b[33m⚠  Intercepted bare `next dev` — forcing --webpack to prevent Turbopack panics.\x1b[0m\n');
  args.push('--webpack');
}

const nextBin = require.resolve('next/dist/bin/next');
require(nextBin);
