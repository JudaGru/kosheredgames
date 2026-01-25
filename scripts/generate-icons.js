const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgPath = path.join(__dirname, '../assets/images/favicon.svg');
const outputDir = path.join(__dirname, '../assets/images');
const publicDir = path.join(__dirname, '../public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  console.log('Generating icons from SVG...');

  // favicon.png - 48x48 for web favicon
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile(path.join(outputDir, 'favicon.png'));
  console.log('Created favicon.png (48x48)');

  // icon.png - 1024x1024 for app store
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(outputDir, 'icon.png'));
  console.log('Created icon.png (1024x1024)');

  // adaptive-icon.png - 1024x1024 for Android adaptive icon
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(outputDir, 'adaptive-icon.png'));
  console.log('Created adaptive-icon.png (1024x1024)');

  // splash-icon.png - 1024x1024 for splash screen
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(path.join(outputDir, 'splash-icon.png'));
  console.log('Created splash-icon.png (1024x1024)');

  // Web manifest icons in public folder
  // favicon-16x16.png
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
  console.log('Created public/favicon-16x16.png');

  // favicon-32x32.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log('Created public/favicon-32x32.png');

  // apple-touch-icon.png - 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Created public/apple-touch-icon.png');

  // android-chrome-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  console.log('Created public/android-chrome-192x192.png');

  // android-chrome-512x512.png
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  console.log('Created public/android-chrome-512x512.png');

  // Copy favicon.svg to public as well
  fs.copyFileSync(svgPath, path.join(publicDir, 'favicon.svg'));
  console.log('Copied favicon.svg to public/');

  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
