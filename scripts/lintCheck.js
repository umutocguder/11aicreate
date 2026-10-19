/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const IGNORED = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.gradle']);
const EXTENSIONS = new Set(['.js', '.ts', '.jsx', '.tsx', '.mjs', '.swift', '.kt', '.html', '.css']);

let totalChecked = 0;
let errors = 0;

function checkFile(filePath) {
  totalChecked++;
  const content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(ROOT_DIR, filePath);

  if (!content.includes('Created by 11Hopem')) {
    console.error(`❌ [Lint Error]: Missing 'Created by 11Hopem' header in: ${relPath}`);
    errors++;
  }
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED.has(entry.name)) {
        scanDir(path.join(dir, entry.name));
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (EXTENSIONS.has(ext)) {
        checkFile(path.join(dir, entry.name));
      }
    }
  }
}

console.log('🔍 [Rule 20 Linting]: Starting static analysis for 11aicreate...');
scanDir(ROOT_DIR);

if (errors > 0) {
  console.error(`❌ [Rule 20 Failed]: ${errors} error(s) found in ${totalChecked} files.`);
  process.exit(1);
} else {
  console.log(`✅ [Rule 20 All Passed]: ${totalChecked} files checked, zero lint errors.`);
}
