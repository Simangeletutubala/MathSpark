import fs from 'node:fs';
import zlib from 'node:zlib';

function createPng(width, height, getPixel) {
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }

  function crc32(buf) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    header,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', deflated),
    makeChunk('IEND', Buffer.alloc(0))
  ]);
}

// Distance to 5-pointed star signed distance function
function starSDF(px, py, r, numPoints = 5, m = 0.5) {
  const angle = Math.atan2(py, px) + Math.PI / 2;
  const dist = Math.hypot(px, py);
  const an = Math.PI / numPoints;
  const segment = (angle % (2 * an) + 2 * an) % (2 * an) - an;
  // Approximate star boundary
  const targetR = r * (0.6 + 0.4 * Math.cos(numPoints * segment));
  return dist - targetR;
}

function renderMathSparkIcon(width, height, isMaskable = false) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2;
  const starRadius = isMaskable ? radius * 0.48 : radius * 0.65;
  const cornerRadius = isMaskable ? 0 : width * 0.22;

  return (x, y) => {
    // Check rounded rect boundary if not maskable
    if (!isMaskable && cornerRadius > 0) {
      const qx = Math.max(0, Math.abs(x - cx) - (cx - cornerRadius));
      const qy = Math.max(0, Math.abs(y - cy) - (cy - cornerRadius));
      if (Math.hypot(qx, qy) > cornerRadius) {
        return [0, 0, 0, 0];
      }
    }

    // Background gradient: Indigo (#4F46E5: 79, 70, 229) to Purple (#7C3AED: 124, 58, 237)
    const t = (x + y) / (width + height);
    let bgR = Math.round(79 + (124 - 79) * t);
    let bgG = Math.round(70 + (58 - 70) * t);
    let bgB = Math.round(229 + (237 - 229) * t);

    // Subtle radial highlight at top-left
    const hlDist = Math.hypot(x - width * 0.25, y - height * 0.25);
    if (hlDist < radius) {
      const hlFactor = (1 - hlDist / radius) * 0.18;
      bgR = Math.min(255, bgR + Math.round(255 * hlFactor));
      bgG = Math.min(255, bgG + Math.round(255 * hlFactor));
      bgB = Math.min(255, bgB + Math.round(255 * hlFactor));
    }

    // Star Mascot
    const dx = x - cx;
    const dy = y - (cy + (isMaskable ? 0 : height * 0.02));
    const distStar = starSDF(dx, dy, starRadius);

    if (distStar < 0) {
      // Inside star: Golden yellow (#FFD700 -> #FFA500)
      const starT = (dy + starRadius) / (starRadius * 2);
      let sR = Math.round(255);
      let sG = Math.round(215 - (215 - 165) * starT);
      let sB = 0;

      // Eyes
      const eyeY = cy - starRadius * 0.1;
      const eyeLeftX = cx - starRadius * 0.22;
      const eyeRightX = cx + starRadius * 0.22;
      const eyeDistLeft = Math.hypot(x - eyeLeftX, y - eyeY);
      const eyeDistRight = Math.hypot(x - eyeRightX, y - eyeY);
      const eyeRadius = starRadius * 0.08;

      if (eyeDistLeft < eyeRadius || eyeDistRight < eyeRadius) {
        return [30, 27, 75, 255]; // Deep navy eyes
      }

      // Mouth smile
      const mouthY = cy + starRadius * 0.12;
      const mouthDist = Math.hypot(dx, y - mouthY);
      if (mouthDist < starRadius * 0.22 && mouthDist > starRadius * 0.16 && y > mouthY) {
        return [30, 27, 75, 255];
      }

      // Soft anti-aliasing edge
      if (distStar > -2) {
        const edgeAlpha = (-distStar) / 2;
        return [
          Math.round(sR * edgeAlpha + bgR * (1 - edgeAlpha)),
          Math.round(sG * edgeAlpha + bgG * (1 - edgeAlpha)),
          Math.round(sB * edgeAlpha + bgB * (1 - edgeAlpha)),
          255
        ];
      }

      return [sR, sG, sB, 255];
    }

    // Corner Sparkles (small 4-point diamonds)
    const checkSparkle = (sx, sy, sr) => {
      return (Math.abs(x - sx) + Math.abs(y - sy)) < sr;
    };
    if (
      checkSparkle(width * 0.82, height * 0.2, starRadius * 0.22) ||
      checkSparkle(width * 0.18, height * 0.78, starRadius * 0.16)
    ) {
      return [255, 240, 150, 240];
    }

    return [bgR, bgG, bgB, 255];
  };
}

const icons = [
  { path: 'public/pwa-192x192.png', size: 192, maskable: false },
  { path: 'public/pwa-512x512.png', size: 512, maskable: false },
  { path: 'public/pwa-maskable-512x512.png', size: 512, maskable: true },
  { path: 'public/apple-touch-icon.png', size: 180, maskable: false },
];

for (const icon of icons) {
  const png = createPng(icon.size, icon.size, renderMathSparkIcon(icon.size, icon.size, icon.maskable));
  fs.writeFileSync(icon.path, png);
  console.log(`Generated ${icon.path} (${icon.size}x${icon.size}, ${png.length} bytes)`);
}
