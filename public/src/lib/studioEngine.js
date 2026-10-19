/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import { studioStore } from './supabaseClient.js';

export const POPULAR_AI_SHOWCASE = [
  {
    id: 'vid-01',
    type: 'video',
    title: 'Cyberpunk Neo-Tokyo Rain',
    prompt: 'Cinematic hyper-detailed neo-Tokyo cyberpunk alley at night, torrential neon rain, holographic dragons swimming through skyscrapers, 8k raw footage, 35mm anamorphic',
    model: '11Cinema-Ultra-v2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-bright-lights-41551-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    views: '48.2K',
    likes: '8.4K',
    tag: 'Trending AI Cinema'
  },
  {
    id: 'vid-02',
    type: 'video',
    title: 'Quantum Abyss Leviathan',
    prompt: 'Bioluminescent colossal whale navigating through liquid crystalline starlight in deep space, glowing tentacles, slow motion ethereal cinematic lighting',
    model: '11Luma-Diffusion-X',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-color-powder-explosion-in-water-43331-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    views: '62.9K',
    likes: '14.1K',
    tag: 'Editor Choice'
  },
  {
    id: 'vid-03',
    type: 'video',
    title: 'Solarpunk Titan Forest',
    prompt: 'Towering biomechanical glass redwood trees absorbing sunlight, solar particles shimmering in mist, drone tracking shot at golden hour',
    model: '11Sora-Gen-Prime',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    views: '33.4K',
    likes: '6.7K',
    tag: 'Photorealistic'
  },
  {
    id: 'vid-04',
    type: 'video',
    title: 'Desert Mirage Hypercar',
    prompt: 'Liquid mercury hypercar cruising across obsidian desert at twilight, heat distortion, trailing cyan lasers, 24fps cinema pan',
    model: '11Kling-Motion-Studio',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-car-headlights-in-the-dark-42407-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80',
    aspectRatio: '16:9',
    views: '51.8K',
    likes: '9.3K',
    tag: 'Motion VFX'
  },
  {
    id: 'img-01',
    type: 'photo',
    title: 'Obsidian Oracle Goddess',
    prompt: 'Photorealistic portrait of a futuristic android oracle sculpted from black obsidian and radiant gold filigree, studio lighting, Hasselblad 100c',
    model: '11FLUX-Master-1.1',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    aspectRatio: '1:1',
    views: '71.5K',
    likes: '18.9K',
    tag: 'Portrait Master'
  },
  {
    id: 'img-02',
    type: 'photo',
    title: 'Neon Synapse Brain Circuit',
    prompt: 'Macro photography of quantum computer neural processor, glowing violet and emerald light pulses, liquid nitrogen vapors',
    model: '11FLUX-Master-1.1',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
    aspectRatio: '16:9',
    views: '39.0K',
    likes: '7.8K',
    tag: 'Macro Tech'
  }
];

export async function generateContent({ prompt, type = 'video', model = '11Cinema-Ultra-v2', aspectRatio = '16:9' }) {
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
    throw new Error('Prompt cannot be empty');
  }

  // 1. AI Director Copilot provides free creative consultation & prompt engineering
  if (type === 'chat') {
    const copilotAdvice = promptCopilotChat(prompt);
    const record = studioStore.recordGeneration({
      prompt,
      type: 'chat',
      model: model || '11Director-Copilot-v2',
      aspectRatio: 'N/A',
      outputUrl: copilotAdvice,
      thumbnail: '',
      status: 'completed'
    });
    return {
      success: true,
      data: record,
      remainingWallet: studioStore.wallet
    };
  }

  // 2. Verify Credit / Free Trial allowance for Video & Photo Generative synthesis
  const permission = studioStore.canGenerate();
  if (!permission.allowed) {
    return {
      success: false,
      error: 'PAYWALL_TRIGGERED',
      message: 'You have consumed your 1 free generation. Please choose a creator subscription plan to continue creating.',
      requiresUpgrade: true
    };
  }

  // 3. Consume generation credit (free trial or paid)
  studioStore.consumeGenerationCredit();

  // 3. Synthesize result
  let outputUrl = '';
  let thumbnail = '';

  if (type === 'video') {
    const videoPool = [
      'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-with-flying-cars-and-bright-lights-41551-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-color-powder-explosion-in-water-43331-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-car-headlights-in-the-dark-42407-large.mp4'
    ];
    outputUrl = videoPool[Math.floor(Math.random() * videoPool.length)];
    thumbnail = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80';
  } else if (type === 'photo') {
    const photoPool = [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ];
    outputUrl = photoPool[Math.floor(Math.random() * photoPool.length)];
    thumbnail = outputUrl;
  } else {
    // Chat response
    outputUrl = `AI Director Analysis: For the prompt "${prompt}", we recommend 35mm anamorphic framing with high key cyber lighting and volumetric mist.`;
  }

  const record = studioStore.recordGeneration({
    prompt,
    type,
    model,
    aspectRatio,
    outputUrl,
    thumbnail,
    status: 'completed'
  });

  return {
    success: true,
    data: record,
    remainingWallet: studioStore.wallet
  };
}

export function promptCopilotChat(userQuery) {
  const queryLower = userQuery.toLowerCase();
  if (queryLower.includes('video') || queryLower.includes('camera')) {
    return '🎬 **Director Advice:** Use camera movement keywords like "slow-push dolly", "anamorphic 35mm f/1.4", "volumetric volumetric shafts of light" to get cinematic motion in your AI video.';
  }
  if (queryLower.includes('photo') || queryLower.includes('midjourney') || queryLower.includes('portrait')) {
    return '📸 **Lighting Tip:** For award-winning portraits, specify "Rembrandt lighting, 8k octane render, Hasselblad 100mm f/2.8, skin pore detail, subtle rim lighting".';
  }
  return `✨ **11AICreate Prompt Enhancer:** Refined prompt: "${userQuery}, ultra-high fidelity, photorealistic textures, dynamic atmospheric haze, award-winning lighting, 8k master edition".`;
}
