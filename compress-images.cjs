const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function compressFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (stat.size < 100000) return;
    const tmpPath = filePath + '.opt.jpg';
    await sharp(filePath)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(tmpPath);
    const newStat = fs.statSync(tmpPath);
    if (newStat.size < stat.size) {
      fs.unlinkSync(filePath);
      fs.renameSync(tmpPath, filePath);
      console.log(`Compressed ${path.basename(filePath)}: ${(stat.size/1024).toFixed(0)}KB -> ${(newStat.size/1024).toFixed(0)}KB`);
    } else {
      fs.unlinkSync(tmpPath);
    }
  } catch (e) {
    console.error('Err:', e.message);
  }
}

async function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) continue;
    if (file.match(/\.(jpg|jpeg)$/i)) {
      await compressFile(fullPath);
    }
  }
}

async function run() {
  console.log('Starting fast sharp compression...');
  await processDir('public/assets');
  await processDir('public/assets/gallery');
  console.log('Finished fast image compression!');
}

run();
