/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { studioStore } from './src/lib/supabaseClient.js';
import { POPULAR_AI_SHOWCASE, generateContent, promptCopilotChat } from './src/lib/studioEngine.js';
import { logTelemetry } from './src/telemetry/firebaseLogger.js';

let currentMode = 'video';

document.addEventListener('DOMContentLoaded', () => {
  initShowcaseMarquee();
  initTrendingGallery();
  initTheaterModal();
  initModeTabs();
  initStudioActions();
  initAuthUI();
  initPaywallUI();
  updateCreditDisplay();
  logTelemetry('page_view_home', { referrer: document.referrer });
});

// 1. Showcase Video Dual Marquee
function initShowcaseMarquee() {
  const track1 = document.getElementById('marqueeTrack1');
  const track2 = document.getElementById('marqueeTrack2');
  const legacyTrack = document.getElementById('marqueeTrack');

  // Split into two diverse groups of 8 items
  const group1 = POPULAR_AI_SHOWCASE.slice(0, 8);
  const group2 = POPULAR_AI_SHOWCASE.slice(8, 16);

  function renderMarqueeRow(container, items) {
    if (!container) return;
    // Duplicate for seamless 360 loop
    const looped = [...items, ...items];
    container.innerHTML = looped.map(item => `
      <div class="video-card" data-id="${item.id}" data-prompt="${encodeURIComponent(item.prompt)}" data-model="${item.model || ''}" data-ratio="${item.aspectRatio || '16:9'}">
        <div class="video-live-badge"><span class="pulse-dot"></span> LIVE AI VIDEO</div>
        <video src="${item.videoUrl}" autoplay loop muted playsinline preload="auto" poster="${item.thumbnail}"></video>
        <div class="video-card-overlay">
          <span class="video-card-tag">${item.tag || item.categoryLabel}</span>
          <div class="video-card-title">${item.title}</div>
          <div style="font-size:11px; color:#cbd5e1; margin-top:2px;">👁️ ${item.views} &nbsp; ❤️ ${item.likes}</div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('video').forEach(video => {
      video.play().catch(() => {});
    });

    container.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const prompt = decodeURIComponent(card.dataset.prompt);
        usePromptInStudio(prompt, card.dataset.model, card.dataset.ratio);
      });
    });
  }

  if (track1 && track2) {
    renderMarqueeRow(track1, group1);
    renderMarqueeRow(track2, group2);
  } else if (legacyTrack) {
    renderMarqueeRow(legacyTrack, POPULAR_AI_SHOWCASE);
  }
}

// 2. Mode Tabs
function initModeTabs() {
  const tabs = document.querySelectorAll('.mode-tab');
  const promptBox = document.getElementById('promptInput');
  const controlSelectors = document.querySelector('.control-selectors');
  const modelSelect = document.getElementById('modelSelect');
  const ratioSelect = document.getElementById('ratioSelect');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentMode = tab.dataset.mode;
      
      if (currentMode === 'video') {
        promptBox.placeholder = 'Describe your AI video: e.g. An astronaut exploring glowing purple caves on Europa, cinematic 35mm, slow dolly in...';
        if (controlSelectors) controlSelectors.style.display = 'flex';
        if (modelSelect) modelSelect.value = '11Cinema-Ultra-v2';
        if (ratioSelect) ratioSelect.value = '16:9';
      } else if (currentMode === 'photo') {
        promptBox.placeholder = 'Describe your AI photo: e.g. Cyberpunk samurai portrait, intricate gold leaf katana, neon reflections, 8K Hasselblad...';
        if (controlSelectors) controlSelectors.style.display = 'flex';
        if (modelSelect) modelSelect.value = '11FLUX-Master-1.1';
        if (ratioSelect) ratioSelect.value = '1:1';
      } else {
        promptBox.placeholder = 'Ask your AI Director Copilot: e.g. How do I prompt camera moves in Sora? Enhance my cyberpunk scene prompt...';
        if (controlSelectors) controlSelectors.style.display = 'none';
      }

      updateCreditDisplay();
    });
  });
}

// 3. Studio Generation & 1-Trial Paywall Gate
function initStudioActions() {
  const btn = document.getElementById('btnGenerate');
  const promptBox = document.getElementById('promptInput');
  const resultArea = document.getElementById('resultArea');
  const resultContent = document.getElementById('resultContent');

  if (!btn) return;

  btn.addEventListener('click', async () => {
    const prompt = promptBox.value.trim();
    if (!prompt) {
      alert('Please enter a creative prompt to generate!');
      promptBox.focus();
      return;
    }

    // Check paywall (only for generative video & photo, chat copilot is free)
    if (currentMode !== 'chat') {
      const check = studioStore.canGenerate();
      if (!check.allowed) {
        logTelemetry('paywall_triggered_generation_attempt', { prompt: prompt.substring(0, 50), mode: currentMode });
        openPaywallModal();
        return;
      }
    }

    btn.disabled = true;
    if (currentMode === 'video') {
      btn.innerHTML = '<span>🎬 Synthesizing AI Cinema...</span>';
    } else if (currentMode === 'photo') {
      btn.innerHTML = '<span>📸 Rendering 8K Masterpiece...</span>';
    } else {
      btn.innerHTML = '<span>🤖 Analyzing Directorial Concept...</span>';
    }

    try {
      const res = await generateContent({
        prompt,
        type: currentMode,
        model: document.getElementById('modelSelect')?.value || '11Cinema-Ultra-v2',
        aspectRatio: document.getElementById('ratioSelect')?.value || '16:9'
      });

      if (res.success) {
        logTelemetry('generation_success', { type: currentMode, model: res.data.model });
        resultArea.classList.add('active');
        
        if (currentMode === 'video') {
          resultContent.innerHTML = `
            <div class="result-video-wrapper">
              <video src="${res.data.outputUrl}" autoplay loop controls playsinline></video>
            </div>
            <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:13px; color:var(--accent-cyan); font-weight:600;">✨ 11AICreate Video Generation Completed</span>
              <a href="${res.data.outputUrl}" download="11aicreate_video.mp4" class="btn-secondary" style="font-size:12px; padding:6px 12px; text-decoration:none;">Download 4K Video</a>
            </div>
          `;
        } else if (currentMode === 'photo') {
          resultContent.innerHTML = `
            <div class="result-video-wrapper">
              <img src="${res.data.outputUrl}" alt="Generated AI Photo" />
            </div>
            <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:13px; color:var(--accent-purple); font-weight:600;">✨ 8K Master Render Completed</span>
              <a href="${res.data.outputUrl}" target="_blank" class="btn-secondary" style="font-size:12px; padding:6px 12px; text-decoration:none;">View Full Resolution</a>
            </div>
          `;
        } else {
          resultContent.innerHTML = `
            <div style="background:rgba(5,5,8,0.9); padding:20px; border-radius:16px; border:1px solid var(--border-color); text-align:left;">
              <div style="color:var(--accent-cyan); font-weight:700; margin-bottom:8px;">🤖 AI Director Copilot:</div>
              <p style="color:#e2e8f0; font-size:15px; line-height:1.6;">${promptCopilotChat(prompt)}</p>
            </div>
          `;
        }

        resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        openPaywallModal();
      }
    } catch (err) {
      alert('Generation error: ' + err.message);
    } finally {
      btn.disabled = false;
      updateCreditDisplay();
    }
  });
}

function updateCreditDisplay() {
  const check = studioStore.canGenerate();
  const pill = document.getElementById('creditPill');
  const btn = document.getElementById('btnGenerate');

  if (currentMode === 'chat') {
    if (btn) btn.innerHTML = '<span>💬 Ask Director Copilot (Free)</span>';
    return;
  }

  const modeName = currentMode === 'photo' ? 'Photo' : 'Video';

  if (check.allowed) {
    if (check.reason === 'free_trial') {
      if (pill) pill.textContent = '✨ 1 Free Trial Active';
      if (btn) btn.innerHTML = `<span>Generate ${modeName} (1 Free Trial Left)</span>`;
    } else {
      if (pill) pill.textContent = `⚡ ${studioStore.wallet.paidCredits} Credits`;
      if (btn) btn.innerHTML = `<span>Generate ${modeName} (1 Credit)</span>`;
    }
  } else {
    if (pill) {
      pill.textContent = '🔒 Free Trial Used (Upgrade)';
      pill.style.borderColor = 'var(--accent-pink)';
      pill.style.color = 'var(--accent-pink)';
    }
    if (btn) {
      btn.innerHTML = `<span>🔒 Upgrade to Create ${modeName} (Trial Used)</span>`;
    }
  }
}

// 4. Paywall Modal Management
function initPaywallUI() {
  const modal = document.getElementById('paywallModal');
  const closeBtn = document.getElementById('closePaywall');
  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('open'));

  document.querySelectorAll('.btn-subscribe').forEach(subBtn => {
    subBtn.addEventListener('click', (e) => {
      const planId = e.currentTarget.dataset.plan;
      studioStore.purchasePlan(planId);
      logTelemetry('subscription_purchased', { planId });
      alert(`🎉 Congratulations! Your plan was activated. Added credits to your 11AICreate studio wallet.`);
      modal.classList.remove('open');
      updateCreditDisplay();
    });
  });
}

function openPaywallModal() {
  const modal = document.getElementById('paywallModal');
  if (modal) modal.classList.add('open');
}

// 5. Auth Modal Management
function initAuthUI() {
  const authModal = document.getElementById('authModal');
  const openAuthBtn = document.getElementById('btnOpenAuth');
  const closeAuthBtn = document.getElementById('closeAuth');
  const authForm = document.getElementById('authForm');
  const authUserPill = document.getElementById('userProfilePill');

  if (openAuthBtn) {
    openAuthBtn.addEventListener('click', () => authModal.classList.add('open'));
  }
  if (closeAuthBtn) {
    closeAuthBtn.addEventListener('click', () => authModal.classList.remove('open'));
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('authEmail').value;
      const user = studioStore.login(email);
      logTelemetry('user_login_success', { email });
      authModal.classList.remove('open');
      renderAuthUser(user);
    });
  }

  if (studioStore.currentUser) {
    renderAuthUser(studioStore.currentUser);
  }
}

function renderAuthUser(user) {
  const openAuthBtn = document.getElementById('btnOpenAuth');
  const userPill = document.getElementById('userProfilePill');
  if (openAuthBtn) openAuthBtn.style.display = 'none';
  if (userPill) {
    userPill.style.display = 'flex';
    userPill.innerHTML = `
      <span style="font-size:13px; font-weight:600; color:#fff;">👤 ${user.email.split('@')[0]}</span>
      <button id="btnLogout" style="background:transparent; border:none; color:var(--text-muted); cursor:pointer; font-size:12px;">(Logout)</button>
    `;
    document.getElementById('btnLogout')?.addEventListener('click', () => {
      studioStore.logout();
      window.location.reload();
    });
  }
}

export { openPaywallModal };
