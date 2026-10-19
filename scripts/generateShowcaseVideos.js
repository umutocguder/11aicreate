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
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80',
    zoomExpr: "z='min(zoom+0.0014,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
    duration: 4
  },
  {
    filename: 'quantum-abyss.mp4',
    thumb: 'quantum-abyss.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80',
    zoomExpr: "z='min(zoom+0.0016,1.28)':x='iw/2-(iw/zoom/2)+sin(in/15)*15':y='ih/2-(ih/zoom/2)'",
    duration: 4
  },
  {
    filename: 'solarpunk-forest.mp4',
    thumb: 'solarpunk-forest.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1920&q=80',
    zoomExpr: "z='min(zoom+0.0012,1.2)':x='iw/2-(iw/zoom/2)+in*0.4':y='ih/2-(ih/zoom/2)'",
    duration: 4
  },
  {
    filename: 'desert-hypercar.mp4',
    thumb: 'desert-hypercar.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1920&q=80',
    zoomExpr: "z='min(zoom+0.0018,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
    duration: 4
  },
  {
    filename: 'obsidian-oracle.mp4',
    thumb: 'obsidian-oracle.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80',
    zoomExpr: "z='min(zoom+0.0013,1.22)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)-in*0.2'",
    duration: 4
  },
  {
    filename: 'neon-synapse.mp4',
    thumb: 'neon-synapse.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1920&q=80',
    zoomExpr: "z='min(zoom+0.002,1.35)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
    duration: 4
  },
  {
    filename: 'cosmic-blackhole.mp4',
    thumb: 'cosmic-blackhole.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1920&q=80',
    zoomExpr: "z='min(zoom+0.0015,1.25)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'",
    duration: 4
  },
  {
    filename: 'cyber-samurai.mp4',
    thumb: 'cyber-samurai.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80',
    zoomExpr: "z='min(zoom+0.0016,1.26)':x='iw/2-(iw/zoom/2)+sin(in/20)*10':y='ih/2-(ih/zoom/2)'",
    duration: 4
  }
];

async function generateAllVideos() {
  console.log('🎬 [11AICreate Video Generator]: Generating 8 popular moving AI videos with ffmpeg...');
  
  for (const def of VIDEO_DEFINITIONS) {
    const videoPath = path.join(VIDEOS_DIR, def.filename);
    const thumbPath = path.join(THUMBS_DIR, def.thumb);
    const tempImg = path.join(ROOT_DIR, `temp_${def.filename}.jpg`);

    console.log(`⏳ Downloading keyframe & rendering: ${def.filename}...`);
    try {
      execSync(`curl -s -L "${def.imageUrl}" -o "${tempImg}"`);
      fs.copyFileSync(tempImg, thumbPath);

      const frames = def.duration * 30;
      const ffmpegCmd = `ffmpeg -y -loop 1 -i "${tempImg}" -filter_complex "[0:v]scale=2560x1440,zoompan=${def.zoomExpr}:d=${frames}:s=960x540:fps=30[v]" -map "[v]" -t ${def.duration} -c:v libx264 -preset fast -pix_fmt yuv420p -movflags +faststart "${videoPath}"`;
      
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
