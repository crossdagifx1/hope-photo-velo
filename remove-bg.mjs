// Remove white background using Jimp v1 API
import Jimp from 'jimp';

const src = 'public/assets/hope-logo.png';
const WHITE_THRESHOLD = 230;

const image = await Jimp.read(src);
const { width, height, data } = image.bitmap;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Make near-white pixels fully transparent
    if (r > WHITE_THRESHOLD && g > WHITE_THRESHOLD && b > WHITE_THRESHOLD) {
      data[idx + 3] = 0;
    }
  }
}

await image.write(src);
console.log('✅ White background removed and saved to', src);
