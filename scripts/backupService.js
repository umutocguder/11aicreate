/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const BACKUP_DIR = path.join(ROOT_DIR, 'data', 'backups');
const BACKUP_FILE = path.join(BACKUP_DIR, '11aicreate_latest_backup.json');
const CHECKSUM_FILE = path.join(BACKUP_DIR, '11aicreate_checksums.json');

export function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const payload = {
    app: '11aicreate',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    creator: '11Hopem',
    platforms: ['web', 'ios', 'android'],
    pricingTiers: [
      { id: 'plan_starter', price: 19, credits: 120 },
      { id: 'plan_pro', price: 49, credits: 450 },
      { id: 'plan_enterprise', price: 149, credits: 1800 }
    ],
    rules: {
      freeTrialLimit: 1,
      paywallEnforced: true,
      backend: 'Supabase PostgreSQL RLS'
    }
  };

  const jsonString = JSON.stringify(payload, null, 2);
  const hash = crypto.createHash('sha256').update(jsonString).digest('hex');

  fs.writeFileSync(BACKUP_FILE, jsonString, 'utf-8');

  let checksums = [];
  if (fs.existsSync(CHECKSUM_FILE)) {
    try {
      checksums = JSON.parse(fs.readFileSync(CHECKSUM_FILE, 'utf-8'));
    } catch (e) {
      checksums = [];
    }
  }

  checksums.unshift({
    timestamp: payload.timestamp,
    sha256: hash,
    file: '11aicreate_latest_backup.json'
  });

  if (checksums.length > 30) checksums = checksums.slice(0, 30);
  fs.writeFileSync(CHECKSUM_FILE, JSON.stringify(checksums, null, 2), 'utf-8');

  console.log(`✅ [Rule 17 Backup]: Snapshot created. SHA-256: ${hash.substring(0, 16)}...`);
  return { hash, file: BACKUP_FILE };
}

// Direct execution
if (process.argv[1] && process.argv[1].endsWith('backupService.js')) {
  createBackup();
}
