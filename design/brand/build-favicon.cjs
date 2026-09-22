/* eslint-disable @typescript-eslint/no-require-imports -- Standalone asset generator. */
// Deterministic exports from the user-supplied identity sheet. No redrawn glyphs.
// Run with `node design/brand/build-favicon.cjs` from the repository root.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..', '..');
const reference = path.join(__dirname, 'chisan-reference.png');
const FOREST = '#00563F';
const NEUTRAL_INK = '#18221C';
// The app icon matches the site surface: forest ink on rice paper, never reversed.
const RICE_PAPER = '#FFFFFF';
const CANVAS = 512;
const ICO_SIZES = [16, 32, 48, 256];

// The sheet supplies the wordmark alone on opaque paper. Boxes are the measured
// ink bounds; the initial C carries one detached square in its upper-right opening.
const SHEET = { width: 2172, height: 724 };
const WORDMARK = { left: 344, top: 197, width: 1485, height: 339 };
const MARK = { left: 344, top: 197, width: 353, height: 334 };

// Flat forest ink on flat paper: red alone separates them. Inset endpoints keep
// clean plateaus while the ramp between them preserves the antialiased edge.
const PAPER = 250;
const INK = 8;

// No favicon artwork is supplied, so the app icon keeps the ratios measured from
// the earlier supplied icon: a full-bleed rounded square holding the same C.
const ICON_RADIUS_RATIO = 0.1924;
const ICON_GLYPH_RATIO = 0.6487;

async function inkMask(bounds) {
  const { data, info } = await sharp(reference)
    .flatten({ background: '#FFFFFF' })
    .extract(bounds)
    .extractChannel('red')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const alpha = Buffer.allocUnsafe(info.width * info.height);
  for (let index = 0; index < alpha.length; index += 1) {
    const coverage = ((PAPER - data[index]) * 255) / (PAPER - INK);
    alpha[index] = Math.max(0, Math.min(255, Math.round(coverage)));
  }
  return { alpha, width: info.width, height: info.height };
}

async function silhouette(bounds, color) {
  const { alpha, width, height } = await inkMask(bounds);
  return sharp({ create: { width, height, channels: 3, background: color } })
    .joinChannel(alpha, { raw: { width, height, channels: 1 } })
    .png({ compressionLevel: 9 }).toBuffer();
}

async function appIcon() {
  const radius = Math.round(CANVAS * ICON_RADIUS_RATIO);
  const square = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS}" height="${CANVAS}">` +
      `<rect width="${CANVAS}" height="${CANVAS}" rx="${radius}" ry="${radius}" fill="${RICE_PAPER}"/></svg>`,
  );
  const glyph = Math.round(CANVAS * ICON_GLYPH_RATIO);
  const inkMark = await sharp(await silhouette(MARK, FOREST))
    .resize(glyph, glyph, { fit: 'contain', background: '#00000000' })
    .toBuffer();
  return sharp(square)
    .composite([{ input: inkMark, gravity: 'centre' }])
    .png({ compressionLevel: 9 }).toBuffer();
}

function svgImage(png, width, height, title) {
  // Preserve the existing public SVG URLs as lossless wrappers for the approved pixels.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img"><title>${title}</title><image width="${width}" height="${height}" href="data:image/png;base64,${png.toString('base64')}"/></svg>\n`;
}

function packIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = 6 + frames.length * 16;
  const directory = frames.map((frame, index) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(ICO_SIZES[index] % 256, 0);
    entry.writeUInt8(ICO_SIZES[index] % 256, 1);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(frame.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += frame.length;
    return entry;
  });
  return Buffer.concat([header, ...directory, ...frames]);
}

(async () => {
  const sheet = await sharp(reference).metadata();
  if (sheet.width !== SHEET.width || sheet.height !== SHEET.height) {
    throw new Error(
      `chisan-reference.png is ${sheet.width}x${sheet.height}; the crop boxes expect ${SHEET.width}x${SHEET.height}. Re-measure the ink bounds before exporting.`,
    );
  }

  const written = [];
  const write = (relativePath, data) => {
    fs.writeFileSync(path.join(root, relativePath), data);
    written.push(relativePath);
  };
  const wordmark = await silhouette(WORDMARK, FOREST);
  const wordmarkInk = await silhouette(WORDMARK, NEUTRAL_INK);
  const reverseWordmark = await silhouette(WORDMARK, '#FFFFFF');
  const mark = await sharp(await silhouette(MARK, FOREST))
    .resize(416, 416, { fit: 'contain', background: '#00000000' })
    .extend({ top: 48, bottom: 48, left: 48, right: 48, background: '#00000000' })
    .png({ compressionLevel: 9 }).toBuffer();
  const markInk = await sharp(await silhouette(MARK, NEUTRAL_INK))
    .resize(416, 416, { fit: 'contain', background: '#00000000' })
    .extend({ top: 48, bottom: 48, left: 48, right: 48, background: '#00000000' })
    .png({ compressionLevel: 9 }).toBuffer();
  const favicon = await appIcon();

  write('public/brand/chisan-wordmark.svg', svgImage(wordmark, WORDMARK.width, WORDMARK.height, 'Chisan'));
  write('public/brand/chisan-wordmark-ink.svg', svgImage(wordmarkInk, WORDMARK.width, WORDMARK.height, 'Chisan in neutral ink'));
  write('public/brand/chisan-mark.svg', svgImage(mark, CANVAS, CANVAS, 'Chisan C with one detached square'));
  write('public/brand/chisan-mark-ink.svg', svgImage(markInk, CANVAS, CANVAS, 'Chisan C with one detached square in neutral ink'));
  write('design/brand/assets/chisan-wordmark-ink.png', wordmark);
  write('design/brand/assets/chisan-wordmark-reverse.png', reverseWordmark);
  write('design/brand/assets/chisan-mark-ink.png', await sharp(mark).flatten({ background: '#FFFFFF' }).png().toBuffer());
  write('design/brand/assets/chisan-icon-light.png', favicon);
  write('design/brand/assets/chisan-icon-apple.png', await sharp(favicon).flatten({ background: RICE_PAPER }).resize(180, 180).png().toBuffer());
  write('app/favicon.ico', packIco(await Promise.all(ICO_SIZES.map((size) => sharp(favicon).resize(size, size).png().toBuffer()))));
  console.log(`Wrote ${written.join(', ')}.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
