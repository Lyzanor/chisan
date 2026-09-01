import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import { getProfileQrLabels } from "../lib/i18n/profile-qr-labels";
import { SUPPORTED_LOCALES } from "../lib/i18n/locales";
import {
  buildProfileQrFilename,
  buildProfileQrUrl,
  isProfileQrEnabled,
  PROFILE_QR_LABEL_HEIGHT,
  PROFILE_QR_LABEL_WIDTH,
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
  assert.equal(PROFILE_QR_LABEL_WIDTH, 1200);
  assert.equal(PROFILE_QR_LABEL_HEIGHT, 1600);
  assert.equal(
    buildProfileQrFilename("producer", "Formatgeria L'Àvia"),
    "chisan-productor-formatgeria-l-avia.png",
  );
  assert.equal(
    buildProfileQrFilename("selection", "東京の店"),
    "chisan-seleccion-perfil.png",
  );
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
  const styles = fs.readFileSync(path.join(ROOT, "app/globals.css"), "utf8");
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
  const producerQrGate = fs.readFileSync(
    path.join(ROOT, "components/producer-profile-qr-label.tsx"),
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
    path.join(ROOT, "app/(application)/cuenta/actions.ts"),
    "utf8",
  );

  assert.match(component, /level="H"/);
  assert.match(component, /marginSize=\{4\}/);
  assert.doesNotMatch(component, /imageSettings=/);
  assert.match(styles, /\.profile-qr--producer[\s\S]*--chisan-color-moss/);
  assert.match(styles, /--profile-qr-accent: var\(--chisan-color-ink\)/);
  assert.match(producerPage, /<ProducerProfileQrLabel/);
  assert.match(producerQrGate, /isProducerProfileQrEnabled/);
  assert.match(producerQrGate, /return null/);
  assert.match(publicProfilePage, /profile\.profileQrEnabled/);
  assert.match(publicProfilePage, /kind: "selection"/);
  assert.match(publicProfiles, /isPublicUserProfileQrEnabled/);
  assert.match(accountProfilePage, /publicProfilePremiumEntitlement/);
  assert.match(accountProfilePage, /updatePublicProfileQrAction/);
  assert.match(accountProfilePage, /defaultChecked=\{profileQrEnabled\}/);
  assert.match(producerAccountPage, /premiumActive && owner/);
  assert.match(producerAccountPage, /updateProducerProfileQrAction/);
  assert.match(producerAccountPage, /defaultChecked=\{enabled\}/);
  assert.match(
    qrEntitlements,
    /USER_PROFILE_PREMIUM_ENTITLEMENT_KEY = "user\.profile\.premium"/,
  );
  assert.match(qrEntitlements, /PROFILE_QR_ENABLED_METADATA_KEY/);
  assert.match(qrEntitlements, /activeProducerPremiumEntitlementCondition/);
  assert.match(qrEntitlements, /eq\(producerMemberships\.role, "owner"\)/);
  assert.match(accountActions, /updateUserProfileQrPreference/);
  assert.match(accountActions, /updateProducerProfileQrPreference/);
});
