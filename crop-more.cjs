// Crop bottom 16% to thoroughly remove TikTok watermark text and icon
const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const dirs = ['public/assets/gallery', 'public/assets'];

async function processAll() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));

    for (const file of files) {
      if (file.includes('logo')) continue; // Skip logo files
      const filePath = path.join(dir, file);
      try {
        const image = await Jimp.read(filePath);
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Crop 15% off the bottom (keep top 85%) to ensure watermark is completely gone
        const newHeight = Math.floor(height * 0.85);

        image.crop({ x: 0, y: 0, w: width, h: newHeight });
        await image.write(filePath);
        console.log(`Cropped 15% from ${file}: ${width}x${height} -> ${width}x${newHeight}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

processAll();
