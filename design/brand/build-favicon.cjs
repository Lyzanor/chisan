/* eslint-disable @typescript-eslint/no-require-imports -- Standalone asset generator. */
// Deterministic exports from the user-supplied identity sheet. No redrawn glyphs.
// Run with `node design/brand/build-favicon.cjs` from the repository root.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const root = path.resolve(__dirname, '..', '..');
const reference = path.join(__dirname, 'chisan-reference.png');
const FOREST = '#00563F';
const CANVAS = 512;
const ICO_SIZES = [16, 32, 48, 256];

// The sheet places the wordmark on the left and a separate favicon on the right.
// Keep both detached squares of the initial C. The favicon never joins the wordmark.
const WORDMARK = { left: 107, top: 154, width: 1494, height: 397 };
const MARK = { left: 107, top: 154, width: 430, height: 394 };
const FAVICON = { left: 1703, top: 189, width: 362, height: 355 };

async function silhouette(bounds, color) {
  const alpha = await sharp(reference).extract(bounds).ensureAlpha().extractChannel(3).toBuffer();
  return sharp({ create: { width: bounds.width, height: bounds.height, channels: 3, background: color } })
    .joinChannel(alpha).png({ compressionLevel: 9 }).toBuffer();
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
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(frame.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += frame.length;
    return entry;
  });
  return Buffer.concat([header, ...directory, ...frames]);
}

(async () => {
  const written = [];
  const write = (relativePath, data) => {
    fs.writeFileSync(path.join(root, relativePath), data);
    written.push(relativePath);
  };
  const wordmark = await silhouette(WORDMARK, FOREST);
  const reverseWordmark = await silhouette(WORDMARK, '#FFFFFF');
  const mark = await sharp(await silhouette(MARK, FOREST))
    .resize(416, 416, { fit: 'contain', background: '#00000000' })
    .extend({ top: 48, bottom: 48, left: 48, right: 48, background: '#00000000' })
    .png({ compressionLevel: 9 }).toBuffer();
  const favicon = await sharp(reference).extract(FAVICON)
    .resize(CANVAS, CANVAS, { fit: 'contain', background: '#00000000' })
    .png({ compressionLevel: 9 }).toBuffer();

  write('public/brand/chisan-wordmark.svg', svgImage(wordmark, WORDMARK.width, WORDMARK.height, 'Chisan'));
  write('public/brand/chisan-mark.svg', svgImage(mark, CANVAS, CANVAS, 'Chisan C with two detached squares'));
  write('design/brand/assets/chisan-wordmark-ink.png', wordmark);
  write('design/brand/assets/chisan-wordmark-reverse.png', reverseWordmark);
  write('design/brand/assets/chisan-mark-ink.png', await sharp(mark).flatten({ background: '#FFFFFF' }).png().toBuffer());
  write('design/brand/assets/chisan-icon-light.png', favicon);
  write('design/brand/assets/chisan-icon-apple.png', await sharp(favicon).flatten({ background: FOREST }).resize(180, 180).png().toBuffer());
  write('app/favicon.ico', packIco(await Promise.all(ICO_SIZES.map((size) => sharp(favicon).resize(size, size).png().toBuffer()))));
  console.log(`Wrote ${written.join(', ')}.`);
})().catch((error) => { console.error(error); process.exitCode = 1; });
