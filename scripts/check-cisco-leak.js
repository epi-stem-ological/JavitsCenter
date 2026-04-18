#!/usr/bin/env node
/**
 * Fails if a Cisco SDK or Cisco-branded module is IMPORTED outside of the
 * allowed integration-seam directories.
 *
 * Goal: enforce that Cisco-specific CODE (SDK calls, native bridges, adapter
 * types) never leaks into screens, domain types, or mock providers. Prose
 * that *mentions* Cisco (product docs, disclaimers, JSDoc explaining the
 * future integration seam) is fine and expected.
 *
 * Allowed locations for Cisco imports:
 *   - packages/providers/src/production/**    (stubs today, real code later)
 *   - apps/mobile/plugins/**                   (future config plugin path)
 *   - scripts/check-cisco-leak.js              (this file)
 */
const { execSync } = require('node:child_process');

const ALLOW = [
  /^packages\/providers\/src\/production\//,
  /^apps\/mobile\/plugins\//,
  /^scripts\/check-cisco-leak\.js$/,
];

// Match `import … from 'cisco-*'` / `from '@cisco/…'` / `require('cisco-…')`.
const PATTERN =
  "^\\s*(import [^;]* from |const [^=]*=\\s*require\\()['\"](@?cisco[^'\"]+|cisco-spaces[^'\"]*)['\"]";

let raw = '';
try {
  raw = execSync(`git grep -InE "${PATTERN}" -- . ':!node_modules'`, { encoding: 'utf8' });
} catch (e) {
  if (e.status === 1) {
    console.log('No Cisco imports found. Clean.');
    process.exit(0);
  }
  throw e;
}

const offenders = raw
  .split('\n')
  .filter(Boolean)
  .filter((line) => {
    const file = line.split(':', 1)[0];
    return !ALLOW.some((re) => re.test(file));
  });

if (offenders.length > 0) {
  console.error('Cisco SDK import leak detected in non-allowed files:');
  offenders.forEach((l) => console.error('  ' + l));
  process.exit(1);
}

console.log('No Cisco SDK imports outside allowed paths.');
