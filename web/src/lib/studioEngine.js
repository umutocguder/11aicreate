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
    videoUrl: '/videos/cyberpunk-tokyo.mp4',
    thumbnail: '/videos/thumbnails/cyberpunk-tokyo.jpg',
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
    videoUrl: '/videos/quantum-abyss.mp4',
    thumbnail: '/videos/thumbnails/quantum-abyss.jpg',
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
    videoUrl: '/videos/solarpunk-forest.mp4',
    thumbnail: '/videos/thumbnails/solarpunk-forest.jpg',
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
    videoUrl: '/videos/desert-hypercar.mp4',
    thumbnail: '/videos/thumbnails/desert-hypercar.jpg',
    aspectRatio: '16:9',
    views: '51.8K',
    likes: '9.3K',
    tag: 'Motion VFX'
  },
  {
    id: 'vid-05',
    type: 'video',
    title: 'Obsidian Oracle Awakening',
    prompt: 'Hyper-realistic cybernetic oracle sculpted from obsidian and radiant gold filigree, glowing neon eyes awakening, dynamic cinematic dolly push, 8k',
    model: '11Runway-Gen3-Alpha',
    videoUrl: '/videos/obsidian-oracle.mp4',
    thumbnail: '/videos/thumbnails/obsidian-oracle.jpg',
    aspectRatio: '16:9',
    views: '71.5K',
    likes: '18.9K',
    tag: 'AI Character Motion'
  },
  {
    id: 'vid-06',
    type: 'video',
    title: 'Quantum Neural Synapse',
    prompt: 'Macro camera fly-through inside quantum neural processor, pulsing violet and emerald synapses, data streams flowing at speed of light, cinematic motion',
    model: '11FLUX-Motion-Pro',
    videoUrl: '/videos/neon-synapse.mp4',
    thumbnail: '/videos/thumbnails/neon-synapse.jpg',
    aspectRatio: '16:9',
    views: '39.0K',
    likes: '7.8K',
    tag: 'Quantum VFX'
  },
  {
    id: 'vid-07',
    type: 'video',
    title: 'Cosmic Horizon Singularity',
    prompt: 'Interstellar accretion disk spinning around supermassive black hole, gravitational lensing bending starlight, epic cinematic slow motion 60fps',
    model: '11Hailuo-MiniMax',
    videoUrl: '/videos/cosmic-blackhole.mp4',
    thumbnail: '/videos/thumbnails/cosmic-blackhole.jpg',
    aspectRatio: '16:9',
    views: '84.1K',
    likes: '22.3K',
    tag: 'Sci-Fi Epic'
  },
  {
    id: 'vid-08',
    type: 'video',
    title: 'Cyber Samurai Neon Duel',
    prompt: 'Cyber samurai with energized plasma katana in torrential rain, neon reflections on wet asphalt, dramatic low-angle camera roll',
    model: '11Pika-Cinematic-v2',
    videoUrl: '/videos/cyber-samurai.mp4',
    thumbnail: '/videos/thumbnails/cyber-samurai.jpg',
    aspectRatio: '16:9',
    views: '56.7K',
    likes: '12.8K',
    tag: 'Action Motion'
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

  // 4. Synthesize result
  let outputUrl = '';
  let thumbnail = '';

  if (type === 'video') {
    const videoPool = [
      { videoUrl: '/videos/cyberpunk-tokyo.mp4', thumbnail: '/videos/thumbnails/cyberpunk-tokyo.jpg' },
      { videoUrl: '/videos/quantum-abyss.mp4', thumbnail: '/videos/thumbnails/quantum-abyss.jpg' },
      { videoUrl: '/videos/solarpunk-forest.mp4', thumbnail: '/videos/thumbnails/solarpunk-forest.jpg' },
      { videoUrl: '/videos/desert-hypercar.mp4', thumbnail: '/videos/thumbnails/desert-hypercar.jpg' },
      { videoUrl: '/videos/obsidian-oracle.mp4', thumbnail: '/videos/thumbnails/obsidian-oracle.jpg' },
      { videoUrl: '/videos/neon-synapse.mp4', thumbnail: '/videos/thumbnails/neon-synapse.jpg' },
      { videoUrl: '/videos/cosmic-blackhole.mp4', thumbnail: '/videos/thumbnails/cosmic-blackhole.jpg' },
      { videoUrl: '/videos/cyber-samurai.mp4', thumbnail: '/videos/thumbnails/cyber-samurai.jpg' }
    ];
    const picked = videoPool[Math.floor(Math.random() * videoPool.length)];
    outputUrl = picked.videoUrl;
    thumbnail = picked.thumbnail;
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
