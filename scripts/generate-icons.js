import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Clean standalone icon SVG suitable for App Icon (centered, crisp, works on any background)
const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c1324" />
      <stop offset="100%" stop-color="#060913" />
    </linearGradient>

    <radialGradient id="ambientGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00C853" stop-opacity="0.25" />
      <stop offset="60%" stop-color="#0084FF" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Camera Body Gradient: Green to Blue -->
    <linearGradient id="camGrad" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#00D26A" />
      <stop offset="45%" stop-color="#00C49F" />
      <stop offset="100%" stop-color="#007BFF" />
    </linearGradient>

    <!-- Top Right Corner Gradient -->
    <linearGradient id="topRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0091FF" />
      <stop offset="100%" stop-color="#0070F3" />
    </linearGradient>

    <!-- Bottom Right Corner Gradient -->
    <linearGradient id="bottomRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9E00" />
      <stop offset="100%" stop-color="#FF6200" />
    </linearGradient>

    <!-- Fork Gradient: Golden Orange to Bright Red -->
    <linearGradient id="forkGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#FFB300" />
      <stop offset="50%" stop-color="#FF6D00" />
      <stop offset="100%" stop-color="#FF2E36" />
    </linearGradient>

    <!-- Leaf Gradient -->
    <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00C853" />
      <stop offset="100%" stop-color="#43A047" />
    </linearGradient>

    <filter id="cuteGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="115" fill="url(#bgGrad)" />
  <circle cx="256" cy="256" r="240" fill="url(#ambientGlow)" />
  <rect width="508" height="508" x="2" y="2" rx="113" fill="none" stroke="#1e293b" stroke-width="4" opacity="0.8" />

  <!-- Centered Scaled Logo Mark inside safe zone -->
  <g transform="translate(68, 68) scale(0.75)" filter="url(#cuteGlow)">
    <!-- VIEW FINDER BRACKETS -->
    <path d="M 160 102 H 142 C 128.745 102 118 112.745 118 126 V 144" stroke="#00D068" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 338 102 H 356 C 369.255 102 380 112.745 380 126 V 144" stroke="url(#topRightGrad)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 118 280 V 298 C 118 311.255 128.745 322 142 322 H 160" stroke="#00D068" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 380 280 V 298 C 380 311.255 369.255 322 356 322 H 338" stroke="url(#bottomRightGrad)" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" />

    <!-- CAMERA BODY -->
    <path d="
      M 198 128 
      C 203 115 215 107 229 107 
      H 271 
      C 285 107 297 115 302 128 
      H 326 
      C 346.987 128 364 145.013 364 166 
      V 264 
      C 364 284.987 346.987 302 326 302 
      H 174 
      C 153.013 302 136 284.987 136 264 
      V 166 
      C 136 145.013 153.013 128 174 128 
      Z" 
      fill="url(#camGrad)" />

    <!-- Flash Lens Dot -->
    <circle cx="330" cy="162" r="12" fill="#FFFFFF" opacity="0.95" />

    <!-- PLATE LENS -->
    <circle cx="249" cy="223" r="82" fill="#FFFFFF" />
    <circle cx="249" cy="223" r="72" fill="#0c1220" stroke="#1e293b" stroke-width="3" />

    <!-- LEAVES -->
    <path d="M 244 160 C 274 158 290 190 288 220 C 260 216 244 186 244 160 Z" fill="url(#leafGrad)" />
    <path d="M 247 163 Q 268 186 287 218" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
    <path d="M 290 196 C 314 196 322 222 314 238 C 298 234 290 212 290 196 Z" fill="url(#leafGrad)" />

    <!-- FORK -->
    <g transform="translate(208, 200)">
      <rect x="0" y="0" width="13" height="40" rx="6.5" fill="#FFA000" />
      <rect x="18" y="0" width="13" height="40" rx="6.5" fill="#FF8F00" />
      <rect x="36" y="0" width="13" height="40" rx="6.5" fill="#FF7D00" />
      <path d="
        M 0 24 
        C 0 46 8 52 18 54 
        V 96 
        C 18 104 31 104 31 96 
        V 54 
        C 41 52 49 46 49 24 
        Z" 
        fill="url(#forkGrad)" />
    </g>
  </g>
</svg>
`;

// Maskable icon with full bleed and safe-zone 80% (Android Adaptive Icon compliant)
const maskableSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="maskBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c1324" />
      <stop offset="100%" stop-color="#060913" />
    </linearGradient>

    <!-- Camera Body Gradient: Green to Blue -->
    <linearGradient id="camGrad2" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%" stop-color="#00D26A" />
      <stop offset="45%" stop-color="#00C49F" />
      <stop offset="100%" stop-color="#007BFF" />
    </linearGradient>

    <linearGradient id="topRightGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0091FF" />
      <stop offset="100%" stop-color="#0070F3" />
    </linearGradient>

    <linearGradient id="bottomRightGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF9E00" />
      <stop offset="100%" stop-color="#FF6200" />
    </linearGradient>

    <linearGradient id="forkGrad2" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#FFB300" />
      <stop offset="50%" stop-color="#FF6D00" />
      <stop offset="100%" stop-color="#FF2E36" />
    </linearGradient>

    <linearGradient id="leafGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00C853" />
      <stop offset="100%" stop-color="#43A047" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect width="512" height="512" fill="url(#maskBg)" />

  <!-- Centered strictly within 80% safe circle -->
  <g transform="translate(102, 102) scale(0.61)">
    <!-- Brackets -->
    <path d="M 160 102 H 142 C 128.745 102 118 112.745 118 126 V 144" stroke="#00D068" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 338 102 H 356 C 369.255 102 380 112.745 380 126 V 144" stroke="url(#topRightGrad2)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 118 280 V 298 C 118 311.255 128.745 322 142 322 H 160" stroke="#00D068" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M 380 280 V 298 C 380 311.255 369.255 322 356 322 H 338" stroke="url(#bottomRightGrad2)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" />

    <!-- Camera Body -->
    <path d="
      M 198 128 
      C 203 115 215 107 229 107 
      H 271 
      C 285 107 297 115 302 128 
      H 326 
      C 346.987 128 364 145.013 364 166 
      V 264 
      C 364 284.987 346.987 302 326 302 
      H 174 
      C 153.013 302 136 284.987 136 264 
      V 166 
      C 136 145.013 153.013 128 174 128 
      Z" 
      fill="url(#camGrad2)" />

    <circle cx="330" cy="162" r="12" fill="#FFFFFF" opacity="0.95" />
    <circle cx="249" cy="223" r="82" fill="#FFFFFF" />
    <circle cx="249" cy="223" r="72" fill="#0c1220" stroke="#1e293b" stroke-width="3" />

    <path d="M 244 160 C 274 158 290 190 288 220 C 260 216 244 186 244 160 Z" fill="url(#leafGrad2)" />
    <path d="M 247 163 Q 268 186 287 218" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.6" />
    <path d="M 290 196 C 314 196 322 222 314 238 C 298 234 290 212 290 196 Z" fill="url(#leafGrad2)" />

    <g transform="translate(208, 200)">
      <rect x="0" y="0" width="13" height="40" rx="6.5" fill="#FFA000" />
      <rect x="18" y="0" width="13" height="40" rx="6.5" fill="#FF8F00" />
      <rect x="36" y="0" width="13" height="40" rx="6.5" fill="#FF7D00" />
      <path d="
        M 0 24 
        C 0 46 8 52 18 54 
        V 96 
        C 18 104 31 104 31 96 
        V 54 
        C 41 52 49 46 49 24 
        Z" 
        fill="url(#forkGrad2)" />
    </g>
  </g>
</svg>
`;

async function run() {
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Generate 512x512 standard
  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // Generate 192x192 standard
  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // Generate 512x512 maskable
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // Generate 180x180 apple-touch-icon
  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // Generate 64x64 favicon
  await sharp(Buffer.from(iconSvg))
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('Generated favicon.png');

  // Also save the clean icon.svg
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg.trim());
  console.log('Saved icon.svg');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
