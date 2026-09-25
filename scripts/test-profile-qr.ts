import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { encode } from "uqr";

import { buildBrandQr } from "../lib/brand-qr";
import { getProfileQrLabels } from "../lib/i18n/profile-qr-labels";
import { SUPPORTED_LOCALES } from "../lib/i18n/locales";
import {
  buildProfileQrFilename,
  buildProfileQrUrl,
  estimateProfileQrLabelFontSize,
  isProfileQrEnabled,
  PROFILE_QR_LABEL_HEIGHT,
  PROFILE_QR_LABEL_WIDTH,
  PROFILE_QR_STICKER,
} from "../lib/profile-qr";

const ROOT = path.join(import.meta.dirname, "..");

test("profile QR URLs keep only the canonical Chisan profile path", () => {
  assert.equal(
    buildProfileQrUrl("/es/barcelona/productor-ejemplo?category=Vino#mapa"),
    "https://chisan.app/es/barcelona/productor-ejemplo",
  );
  assert.equal(
    buildProfileQrUrl("/u/restaurant-example"),
    "https://chisan.app/u/restaurant-example",
  );
  assert.throws(
    () => buildProfileQrUrl("https://example.com/u/restaurant-example"),
    /canonical Chisan origin/,
  );
});

test("profile QR labels have stable print dimensions and safe filenames", () => {
  assert.equal(PROFILE_QR_STICKER.width, 860);
  assert.equal(PROFILE_QR_STICKER.height, 1100);
  assert.equal(PROFILE_QR_LABEL_WIDTH, 2150);
  assert.equal(PROFILE_QR_LABEL_HEIGHT, 2750);
  assert.equal(
    buildProfileQrFilename("producer", "Formatgeria L'Àvia"),
    "chisan-productor-formatgeria-l-avia.png",
  );
  assert.equal(
    buildProfileQrFilename("selection", "東京の店"),
    "chisan-seleccion-perfil.png",
  );
});

test("brand QR keeps every data module outside the C finders and centre mark", () => {
  const value = "https://chisan.app/es/barcelona/chisan";
  const qr = buildBrandQr(value);
  const { data, size } = encode(value, { ecc: "H", border: 0 });
  const cells = new Set(
    Array.from(qr.modulesPath.matchAll(/M(\d+) (\d+)h1v1h-1z/g), ([, x, y]) => `${x},${y}`),
  );
  const clearFrom = Math.floor(qr.mark.offset);
  const clearTo = Math.ceil(qr.mark.offset + qr.mark.size);

  assert.equal(qr.size, size);
  assert.deepEqual(buildBrandQr(value), qr);
  assert.equal((qr.findersPath.match(/M/g) ?? []).length, 9);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const finder = (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);
      const centre = x >= clearFrom && x < clearTo && y >= clearFrom && y < clearTo;
      assert.equal(cells.has(`${x},${y}`), data[y][x] && !finder && !centre, `module ${x},${y}`);
    }
  }
  assert.ok(qr.mark.size / size < 0.2, "the centre mark stays within high error correction");
});

test("sticker band labels shrink only when they would not fit", () => {
  assert.equal(estimateProfileQrLabelFontSize("PRODUCTOR LOCAL"), 56);
  assert.ok(estimateProfileQrLabelFontSize("NUESTROS PRODUCTORES") < 56);
  assert.ok(estimateProfileQrLabelFontSize("ELS NOSTRES PRODUCTORS") < 56);
});

test("profile QR preferences are opt-in and accept only an explicit boolean true", () => {
  assert.equal(isProfileQrEnabled(undefined), false);
  assert.equal(isProfileQrEnabled({}), false);
  assert.equal(isProfileQrEnabled({ profileQrEnabled: "true" }), false);
  assert.equal(isProfileQrEnabled({ profileQrEnabled: true }), true);
});

test("every published interface locale owns complete profile QR copy", () => {
  for (const locale of SUPPORTED_LOCALES) {
    const labels = getProfileQrLabels(locale);
    for (const [key, value] of Object.entries(labels)) {
      assert.ok(value.trim(), `${locale}.${key} must not be empty`);
    }
  }
});

test("producer and selection profiles expose distinct, robust QR labels", () => {
  const component = fs.readFileSync(
    path.join(ROOT, "components/profile-qr-label.tsx"),
    "utf8",
  );
  const styles = fs.readFileSync(
    path.join(ROOT, "design/adapters/profile-qr.css"),
    "utf8",
  );
  const producerPage = fs.readFileSync(
    path.join(ROOT, "app/(catalog)/[catalog]/[area]/[segment]/page.tsx"),
    "utf8",
  );
  const publicProfilePage = fs.readFileSync(
    path.join(ROOT, "app/(application)/u/[handle]/page.tsx"),
    "utf8",
  );
  const accountProfilePage = fs.readFileSync(
    path.join(ROOT, "app/(application)/cuenta/perfil/page.tsx"),
    "utf8",
  );
  const producerAccountPage = fs.readFileSync(
    path.join(
      ROOT,
      "app/(application)/cuenta/productores/[country]/[producerId]/editar/page.tsx",
    ),
    "utf8",
  );
  const publicProfiles = fs.readFileSync(
    path.join(ROOT, "lib/accounts/public-profiles.ts"),
    "utf8",
  );
  const qrEntitlements = fs.readFileSync(
    path.join(ROOT, "lib/accounts/profile-qr-entitlements.ts"),
    "utf8",
  );
  const accountActions = fs.readFileSync(
    path.join(ROOT, "app/(application)/cuenta/actions/qr.ts"),
    "utf8",
  );

  const qrCode = fs.readFileSync(path.join(ROOT, "components/brand/chisan-qr-code.tsx"), "utf8");
  const brandQr = fs.readFileSync(path.join(ROOT, "lib/brand-qr.ts"), "utf8");
  const sticker = fs.readFileSync(path.join(ROOT, "components/profile-qr-sticker.tsx"), "utf8");
  assert.match(qrCode, /buildBrandQr/);
  assert.match(brandQr, /ecc: "H"/);
  assert.match(sticker, /ChisanQrCodeMarks/);
  assert.match(sticker, /PROFILE_QR_STICKER/);
  // The downloaded PNG paints the same shared layout as the on-screen sticker.
  assert.match(component, /<ProfileQrSticker/);
  assert.match(component, /drawProfileQrSticker/);
  assert.match(component, /COPY_FEEDBACK_DURATION_MS = 1_500/);
  assert.match(component, /copyFeedbackGenerationRef/);
  assert.match(component, /downloadFeedbackGeneration/);
  assert.match(
    component,
    /isProducer \? CHISAN_MARK_SRC : CHISAN_MARK_INK_SRC/,
  );
  assert.match(
    component,
    /isProducer \? CHISAN_WORDMARK_SRC : CHISAN_WORDMARK_INK_SRC/,
  );
  assert.match(component, /aria-label=\{labels\.copy\}/);
  assert.match(component, /isCopied \? "is-visible" : undefined/);
  assert.match(component, /role="status"/);
  assert.match(component, /aria-atomic="true"/);
  assert.match(styles, /\.profile-qr__copy-label > span\.is-visible/);
  assert.match(styles, /\.profile-qr--producer[\s\S]*--chisan-color-moss/);
  assert.match(styles, /--profile-qr-accent: var\(--chisan-color-ink\)/);
  // Producer stickers are an owner download, never part of the public profile.
  assert.doesNotMatch(producerPage, /ProfileQr/);
  assert.equal(
    fs.existsSync(path.join(ROOT, "components/producer-profile-qr-label.tsx")),
    false,
  );
  assert.match(producerAccountPage, /premiumActive && owner/);
  assert.match(producerAccountPage, /<ProfileQrLabel kind="producer"/);
  assert.doesNotMatch(producerAccountPage, /updateProducerProfileQrAction/);
  assert.match(publicProfilePage, /profile\.profileQrEnabled/);
  assert.match(publicProfilePage, /kind: "selection"/);
  assert.match(publicProfiles, /isPublicUserProfileQrEnabled/);
  assert.match(accountProfilePage, /publicProfilePremiumEntitlement/);
  assert.match(accountProfilePage, /updatePublicProfileQrAction/);
  assert.match(accountProfilePage, /cuenta\/seleccion/);
  assert.match(
    qrEntitlements,
    /USER_PROFILE_PREMIUM_ENTITLEMENT_KEY = "user\.profile\.premium"/,
  );
  assert.match(qrEntitlements, /PROFILE_QR_ENABLED_METADATA_KEY/);
  assert.doesNotMatch(qrEntitlements, /isProducerProfileQrEnabled|updateProducerProfileQrPreference/);
  assert.match(accountActions, /updateUserProfileQrPreference/);
  assert.doesNotMatch(accountActions, /updateProducerProfileQrPreference/);
});
