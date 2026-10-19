/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { studioStore } from '../web/src/lib/supabaseClient.js';
import { generateContent, promptCopilotChat, POPULAR_AI_SHOWCASE } from '../web/src/lib/studioEngine.js';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');

describe('11AICreate — Studio & 1-Trial Paywall Verification', () => {
  beforeEach(() => {
    // Reset wallet state
    studioStore.wallet = {
      freeTrialAvailable: true,
      freeTrialUsed: false,
      paidCredits: 0,
      subscriptionTier: 'free'
    };
    studioStore.userGenerations = [];
  });

  test('should allow exactly 1 free trial generation before gating paywall', async () => {
    // Generation 1: Free Trial
    const check1 = studioStore.canGenerate();
    assert.equal(check1.allowed, true, 'First generation must be allowed under free trial');
    assert.equal(check1.reason, 'free_trial');

    const res1 = await generateContent({ prompt: 'Cyberpunk Tokyo flying cars at night' });
    assert.equal(res1.success, true, 'First generation must succeed');
    assert.equal(studioStore.wallet.freeTrialUsed, true, 'Free trial must be marked used');

    // Generation 2: Must be blocked by paywall
    const check2 = studioStore.canGenerate();
    assert.equal(check2.allowed, false, 'Second generation must be blocked by paywall');
    assert.equal(check2.reason, 'paywall_required');

    const res2 = await generateContent({ prompt: 'Another futuristic prompt' });
    assert.equal(res2.success, false, 'Unpaid generation must fail');
    assert.equal(res2.error, 'PAYWALL_TRIGGERED');
    assert.equal(res2.requiresUpgrade, true);
  });

  test('should unlock generations when subscribing to a plan', async () => {
    // Use free trial first
    studioStore.consumeGenerationCredit();
    assert.equal(studioStore.canGenerate().allowed, false);

    // Purchase Pro Studio plan ($49/mo)
    studioStore.purchasePlan('plan_pro');
    assert.equal(studioStore.wallet.paidCredits, 450, 'Pro plan must credit 450 generations');
    assert.equal(studioStore.wallet.subscriptionTier, 'pro');

    // Now generation must be allowed
    const check = studioStore.canGenerate();
    assert.equal(check.allowed, true);
    assert.equal(check.reason, 'paid_credits');

    const res = await generateContent({ prompt: 'Deep ocean glowing jellyfishes' });
    assert.equal(res.success, true);
    assert.equal(studioStore.wallet.paidCredits, 449, 'Credit should decrement from 450 to 449');
  });

  test('should verify AI Copilot prompt enhancer provides cinematic feedback', () => {
    const feedback = promptCopilotChat('A drone video in neon city');
    assert.ok(feedback.includes('Director Advice') || feedback.includes('camera'), 'Copilot must offer cinematography guidance');
  });

  test('should verify popular viral AI video showcase catalog is populated with moving videos on all items', () => {
    assert.ok(POPULAR_AI_SHOWCASE.length >= 8, 'Must feature at least 8 popular showcase video entries');
    for (const item of POPULAR_AI_SHOWCASE) {
      assert.equal(item.type, 'video', `Every showcase item must be a video: ${item.id}`);
      assert.ok(item.videoUrl, `Showcase item ${item.id} must contain video URL`);
      assert.ok(item.thumbnail, `Showcase item ${item.id} must contain thumbnail`);
      assert.ok(item.prompt, `Showcase item ${item.id} must have prompt directive`);

      const localVideoPath = path.join(ROOT_DIR, 'public', item.videoUrl);
      assert.ok(fs.existsSync(localVideoPath), `Local video file must exist: ${localVideoPath}`);
      assert.ok(fs.statSync(localVideoPath).size > 10000, `Video file ${item.videoUrl} must not be empty`);
    }
  });

  test('should verify cross-platform native codebase integrity (iOS & Android)', () => {
    const iosApp = path.join(ROOT_DIR, 'ios', 'ElevenAICreate', 'Sources', 'ElevenAICreateApp.swift');
    const iosContent = path.join(ROOT_DIR, 'ios', 'ElevenAICreate', 'Sources', 'ContentView.swift');
    const androidApp = path.join(ROOT_DIR, 'android', 'app', 'src', 'main', 'java', 'com', 'elevenaicreate', 'app', 'ElevenAICreateApp.kt');
    const androidTheme = path.join(ROOT_DIR, 'android', 'app', 'src', 'main', 'java', 'com', 'elevenaicreate', 'app', 'Theme.kt');

    assert.ok(fs.existsSync(iosApp), 'iOS ElevenAICreateApp.swift must exist');
    assert.ok(fs.existsSync(iosContent), 'iOS ContentView.swift must exist');
    assert.ok(fs.existsSync(androidApp), 'Android ElevenAICreateApp.kt must exist');
    assert.ok(fs.existsSync(androidTheme), 'Android Theme.kt must exist');
  });
});
