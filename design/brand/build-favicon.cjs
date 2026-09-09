// Regenerates the shipped browser icons from the canonical mark master.
// Run with `node design/brand/build-favicon.cjs` from the repository root.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..', '..');
const master = fs.readFileSync(path.join(root, 'public/brand/chisan-mark.svg'), 'utf8');

// The mark master draws its 128-unit geometry inside a -8/144 padded viewBox. The
// browser icons keep that geometry and set it on the white page field instead of a
// transparent ground, so the forest mark stays legible on dark browser chrome and on
// the black that iOS composites behind a transparent home-screen icon.
const CANVAS = 512;
const INSET = 56; // Equal margin on every side; the 128-unit mark renders at 400 px.
const MARK_SCALE = (CANVAS - 2 * INSET) / 128;
const PLATE_RADIUS = INSET + 20 * MARK_SCALE; // Concentric with the mark's own 20-unit corners.
const shapes = master.replace(/^.*<\/title>/s, '').replace('</svg>', '');

// Tab and address-bar icons sit on the browser's own chrome, so the plate is a rounded
// field. Apple home-screen icons are masked by the system, so that export is full bleed.
const icon = (radius) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${CANVAS}" height="${CANVAS}">`
  + `<title>Chisan — C with central dot on the white page field</title>`
  + `<rect width="${CANVAS}" height="${CANVAS}" rx="${radius}" fill="#FFFFFF"/>`
  + `<g fill="#00563F" transform="translate(${INSET} ${INSET}) scale(${MARK_SCALE})">${shapes}</g></svg>`;

const render = (svg, size) =>
  sharp(Buffer.from(svg), { density: (72 * size) / CANVAS })
    .resize(size, size)
    .png({ compressionLevel: 9 });

// PNG-framed ICO: 6-byte directory header, one 16-byte entry per frame, then payloads.
const ICO_SIZES = [16, 32, 48, 256];

function packIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(frames.length, 4);
  let offset = 6 + frames.length * 16;
  const directory = frames.map((frame, index) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(ICO_SIZES[index] % 256, 0); // 256 is stored as 0.
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

  write('app/favicon.ico', packIco(await Promise.all(ICO_SIZES.map((size) => render(icon(PLATE_RADIUS), size).toBuffer()))));
  write('design/brand/assets/chisan-icon-light.png', await render(icon(PLATE_RADIUS), CANVAS).toBuffer());
  write('design/brand/assets/chisan-icon-apple.png', await render(icon(0), 180).toBuffer());

  console.log(`Wrote ${written.join(', ')}.`);
})();
