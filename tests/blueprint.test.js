/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');

describe('11AICreate — Project Blueprint & Brand Identity (Rule 4, 9, 13)', () => {
  test('should verify mandatory blueprint structure exists', () => {
    const requiredFiles = [
      'AGENTS.md',
      'CLAUDE.md',
      'WORKLOG.md',
      'README.md',
      '.gitignore',
      '.github/workflows/ci-cd.yml',
      'package.json',
      'vercel.json',
      'supabase/schema.sql'
    ];

    for (const file of requiredFiles) {
      const fullPath = path.join(ROOT_DIR, file);
      assert.ok(fs.existsSync(fullPath), `Missing required file: ${file}`);
      const stat = fs.statSync(fullPath);
      assert.ok(stat.size > 0, `File should not be empty: ${file}`);
    }
  });

  test('should verify 1:1 brand logo and favicon equality (Rule 13)', () => {
    const assetLogo = path.join(ROOT_DIR, 'assets', 'images', 'logo.svg');
    const publicLogo = path.join(ROOT_DIR, 'public', 'logo.svg');
    const faviconSvg = path.join(ROOT_DIR, 'public', 'favicon.svg');

    assert.ok(fs.existsSync(assetLogo), 'assets/images/logo.svg must exist');
    assert.ok(fs.existsSync(publicLogo), 'public/logo.svg must exist');
    assert.ok(fs.existsSync(faviconSvg), 'public/favicon.svg must exist');

    const assetContent = fs.readFileSync(assetLogo, 'utf-8');
    const faviconContent = fs.readFileSync(faviconSvg, 'utf-8');

    assert.ok(assetContent.includes('<svg'), 'Asset logo must be valid SVG');
    assert.equal(assetContent, faviconContent, 'Favicon must match in-site logo 1:1');
  });

  test('should verify package author is 11Hopem (Rule 9)', () => {
    const pkgPath = path.join(ROOT_DIR, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

    assert.equal(pkg.author, '11Hopem <umutocgdr@gmail.com>', 'Package author must be 11Hopem');
    assert.ok(pkg.scripts?.test, 'Package must define test script');
    assert.ok(pkg.scripts?.lint, 'Package must define lint script');
    assert.ok(pkg.scripts?.backup, 'Package must define backup script');
  });
});
