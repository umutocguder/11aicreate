/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
const WEB_SRC_DIR = path.join(ROOT_DIR, 'web', 'src');
const TARGET_SRC_DIR = path.join(PUBLIC_DIR, 'src');

console.log('⚡ [11AICreate Web Build]: Syncing assets to public directory...');

if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

if (fs.existsSync(WEB_SRC_DIR)) {
  fs.cpSync(WEB_SRC_DIR, TARGET_SRC_DIR, { recursive: true });
}

console.log('✅ [11AICreate Web Build]: Static bundle ready in public/.');
process.exit(0);
