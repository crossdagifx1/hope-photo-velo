const fs = require('fs');
const path = require('path');

const mainJsx = fs.readFileSync('src/main.jsx', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const stylesCss = fs.readFileSync('src/styles.css', 'utf8');

const allText = mainJsx + '\n' + indexHtml + '\n' + stylesCss;

// Find all filenames under public/assets
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allAssetFiles = getAllFiles('public/assets');

const usedFiles = [];
const unusedFiles = [];

for (const filePath of allAssetFiles) {
  const baseName = path.basename(filePath);
  const relPath = path.relative('public', filePath).replace(/\\/g, '/');
  
  if (allText.includes(baseName) || allText.includes(relPath)) {
    usedFiles.push({ fullPath: filePath, relPath, baseName, size: fs.statSync(filePath).size });
  } else {
    unusedFiles.push({ fullPath: filePath, relPath, baseName, size: fs.statSync(filePath).size });
  }
}

console.log('--- USED ASSETS (' + usedFiles.length + ') ---');
usedFiles.forEach(f => console.log(`[USED] ${f.relPath} (${(f.size/1024).toFixed(1)} KB)`));

console.log('\n--- UNUSED ASSETS (' + unusedFiles.length + ') ---');
unusedFiles.forEach(f => console.log(`[UNUSED] ${f.relPath} (${(f.size/1024).toFixed(1)} KB)`));
