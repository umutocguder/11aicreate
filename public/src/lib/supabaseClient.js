/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

// Supabase Unified Client & Resilient Local Fallback Engine
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.mock_key';

// In-Memory / Local Storage state for seamless zero-config operation
class LocalSupabaseStore {
  constructor() {
    this.currentUser = null;
    this.wallet = {
      freeTrialAvailable: true,
      freeTrialUsed: false,
      paidCredits: 0,
      subscriptionTier: 'free'
    };
    this.userGenerations = [];
    this.loadState();
  }

  loadState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedUser = localStorage.getItem('11aicreate_user');
        const storedWallet = localStorage.getItem('11aicreate_wallet');
        const storedGenerations = localStorage.getItem('11aicreate_generations');
        if (storedUser) this.currentUser = JSON.parse(storedUser);
        if (storedWallet) this.wallet = JSON.parse(storedWallet);
        if (storedGenerations) this.userGenerations = JSON.parse(storedGenerations);
      } catch (e) {
        // Fallback to in-memory
      }
    }
  }

  saveState() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        if (this.currentUser) localStorage.setItem('11aicreate_user', JSON.stringify(this.currentUser));
        localStorage.setItem('11aicreate_wallet', JSON.stringify(this.wallet));
        localStorage.setItem('11aicreate_generations', JSON.stringify(this.userGenerations));
      } catch (e) {
        // Fallback silently
      }
    }
  }

  login(email, fullName = 'AI Director') {
    this.currentUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      fullName,
      createdAt: new Date().toISOString()
    };
    this.saveState();
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('11aicreate_user');
    }
  }

  canGenerate() {
    // 1 Free Trial rule: Allowed if trial hasn't been used yet OR user has paid credits
    if (this.wallet.freeTrialAvailable && !this.wallet.freeTrialUsed) {
      return { allowed: true, reason: 'free_trial', remainingFree: 1 };
    }
    if (this.wallet.paidCredits > 0) {
      return { allowed: true, reason: 'paid_credits', credits: this.wallet.paidCredits };
    }
    return { allowed: false, reason: 'paywall_required', requiresUpgrade: true };
  }

  consumeGenerationCredit() {
    const check = this.canGenerate();
    if (!check.allowed) {
      return false;
    }
    if (check.reason === 'free_trial') {
      this.wallet.freeTrialUsed = true;
      this.wallet.freeTrialAvailable = false;
    } else if (check.reason === 'paid_credits') {
      this.wallet.paidCredits = Math.max(0, this.wallet.paidCredits - 1);
    }
    this.saveState();
    return true;
  }

  purchasePlan(planId) {
    const creditsMap = {
      plan_starter: 120,
      plan_pro: 450,
      plan_enterprise: 1800
    };
    const credits = creditsMap[planId] || 100;
    this.wallet.paidCredits += credits;
    this.wallet.subscriptionTier = planId.replace('plan_', '');
    this.saveState();
    return this.wallet;
  }

  recordGeneration(gen) {
    const newGen = {
      id: 'gen_' + Date.now(),
      timestamp: new Date().toISOString(),
      ...gen
    };
    this.userGenerations.unshift(newGen);
    this.saveState();
    return newGen;
  }
}

export const studioStore = new LocalSupabaseStore();
