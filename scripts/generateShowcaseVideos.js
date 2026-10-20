/**
 * Created by 11Hopem
 * Copyright (c) 2026 11Hopem. All rights reserved.
 * Licensed under 11Hopem Proprietary License.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = path.resolve(import.meta.dirname, '..');
const VIDEOS_DIR = path.join(ROOT_DIR, 'public', 'videos');
const THUMBS_DIR = path.join(VIDEOS_DIR, 'thumbnails');

if (!fs.existsSync(VIDEOS_DIR)) {
  fs.mkdirSync(VIDEOS_DIR, { recursive: true });
}
if (!fs.existsSync(THUMBS_DIR)) {
  fs.mkdirSync(THUMBS_DIR, { recursive: true });
}

const VIDEO_DEFINITIONS = [
  {
    filename: 'cyberpunk-tokyo.mp4',
    thumb: 'cyberpunk-tokyo.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0015,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'quantum-abyss.mp4',
    thumb: 'quantum-abyss.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0016,1.26)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'solarpunk-forest.mp4',
    thumb: 'solarpunk-forest.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0014,1.22)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'desert-hypercar.mp4',
    thumb: 'desert-hypercar.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0018,1.28)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'obsidian-oracle.mp4',
    thumb: 'obsidian-oracle.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0013,1.2)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'neon-synapse.mp4',
    thumb: 'neon-synapse.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.002,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'cosmic-blackhole.mp4',
    thumb: 'cosmic-blackhole.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0015,1.24)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'cyber-samurai.mp4',
    thumb: 'cyber-samurai.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0016,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'pixar-dragon.mp4',
    thumb: 'pixar-dragon.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0017,1.28)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'neon-tiger.mp4',
    thumb: 'neon-tiger.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0015,1.24)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'crystal-islands.mp4',
    thumb: 'crystal-islands.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0014,1.22)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'fashion-silk.mp4',
    thumb: 'fashion-silk.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0016,1.26)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'steampunk-armada.mp4',
    thumb: 'steampunk-armada.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0015,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'cyber-mecha.mp4',
    thumb: 'cyber-mecha.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0018,1.27)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'liquid-gold-morph.mp4',
    thumb: 'liquid-gold-morph.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.002,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  },
  {
    filename: 'cyberpunk-geisha.mp4',
    thumb: 'cyberpunk-geisha.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1280&q=80',
    zoomExpr: "z='min(zoom+0.0015,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
  }
];

async function generateAllVideos() {
  console.log('🎬 [11AICreate Video Generator]: Generating 16 popular moving AI videos with ffmpeg...');
  
  for (const def of VIDEO_DEFINITIONS) {
    const videoPath = path.join(VIDEOS_DIR, def.filename);
    const thumbPath = path.join(THUMBS_DIR, def.thumb);
    const tempImg = path.join(ROOT_DIR, `temp_${def.filename}.jpg`);

    if (fs.existsSync(videoPath) && fs.existsSync(thumbPath)) {
      console.log(`⚡ [Cached]: ${def.filename} already rendered.`);
      continue;
    }

    console.log(`⏳ Downloading keyframe & rendering: ${def.filename}...`);
    try {
      execSync(`curl -s -L "${def.imageUrl}" -o "${tempImg}"`);
      fs.copyFileSync(tempImg, thumbPath);

      const ffmpegCmd = `ffmpeg -y -loop 1 -i "${tempImg}" -filter_complex "[0:v]scale=1280:720,zoompan=${def.zoomExpr}:d=90:s=960x540:fps=30[v]" -map "[v]" -t 3 -c:v libx264 -preset veryfast -pix_fmt yuv420p -movflags +faststart "${videoPath}"`;
      
      execSync(ffmpegCmd, { stdio: 'ignore' });
      
      if (fs.existsSync(tempImg)) {
        fs.unlinkSync(tempImg);
      }
      
      const stats = fs.statSync(videoPath);
      console.log(`✅ [Rendered]: ${def.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`❌ Failed to render ${def.filename}:`, err.message);
      if (fs.existsSync(tempImg)) fs.unlinkSync(tempImg);
    }
  }

  console.log('🚀 [11AICreate Video Generator]: All 8 moving AI videos generated successfully in public/videos/');
}

generateAllVideos();
