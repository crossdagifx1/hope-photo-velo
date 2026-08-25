const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Used assets as identified
const usedAssets = [
  'public/assets/bg.jpg',
  'public/assets/gallery/photo_2026-07-03_14-14-17_7668160799898782720.jpg',
  'public/assets/gallery/photo_2026-07-03_14-14-17_7668160832798825472.jpg',
  'public/assets/gallery/photo_2026-07-03_14-14-18_7668160851399477248.jpg',
  'public/assets/gallery/photo_2026-07-03_14-14-18_7668160860798849024.jpg',
  'public/assets/gallery/photo_2026-07-03_14-14-18_7668160879386824704.jpg',
  'public/assets/gallery/photo_2026-07-03_14-14-19_7668160870092520448.jpg',
  'public/assets/gallery/photo_2026-07-03_20-31-18_7668160944615066624.jpg',
  'public/assets/gallery/photo_2026-07-03_20-31-22_7668160935271833600.jpg',
  'public/assets/gallery/photo_2026-07-03_20-34-45_7668160982247493632.jpg',
  'public/assets/gallery/photo_2026-07-03_20-34-57_7668161010354493440.jpg',
  'public/assets/gallery/photo_2026-07-03_20-35-00_7668161019770662912.jpg',
  'public/assets/gallery/photo_2026-07-03_20-35-01_7668161048338929664.jpg',
  'public/assets/gallery/photo_2026-07-03_20-37-48_7668161057622723584.jpg',
  'public/assets/gallery/photo_2026-07-03_20-37-55_7668161085785812992.jpg',
  'public/assets/gallery/photo_2026-07-03_20-37-56_7668161066939796480.jpg',
  'public/assets/hero-card-1.jpg',
  'public/assets/hero-card-2.jpg',
  'public/assets/hero-card-3.jpg',
  'public/assets/hero-h1-avatar.jpg',
  'public/assets/hero_mobile_bg.jpg',
  'public/assets/hope-logo.png',
  'public/assets/weee.jpg',
];

// Create staging directory
if (fs.existsSync('zip_stage')) {
  fs.rmSync('zip_stage', { recursive: true });
}

fs.mkdirSync('zip_stage/assets/gallery', { recursive: true });

for (const src of usedAssets) {
  const dest = src.replace('public/', 'zip_stage/');
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('Copied: ' + src);
}

console.log('\nDone! Ready to zip zip_stage/assets/');
