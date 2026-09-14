import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  PRODUCER_EDITABLE_FIELDS,
  PRODUCER_STANDARD_EDITABLE_FIELDS,
  PRODUCER_PREMIUM_EDITABLE_FIELDS,
} from "../lib/accounts/producer-fields";
import {
  DESCRIPTION_SOURCE_LOCALES,
  SUPPORTED_LOCALES,
} from "../lib/i18n/locales";
import { loadMessages } from "../lib/i18n/messages";
import {
  formatDescriptionLocale,
  formatProducerFieldLabel,
  formatProducerFieldValue,
  getDescriptionLocaleOptions,
  isPublicProducerField,
  presentProducerField,
  presentPublicProducerFields,
  presentProducerVerification,
} from "../lib/i18n/producer-fields";

test("account presentation messages cover both account action surfaces in every locale", async () => {
  const dictionaries = await Promise.all(SUPPORTED_LOCALES.map(loadMessages));
  const establishedDescriptionLocales = [
    "en", "es", "ca", "de", "ja", "fr", "it", "nl", "pt", "gl", "eu",
  ] as const;
  const expectedLanguageNames = {
    en: [
      "English", "Spanish", "Catalan", "German", "Japanese", "French",
      "Italian", "Dutch", "Portuguese", "Galician", "Basque",
    ],
    es: [
      "Inglés", "Español", "Catalán", "Alemán", "Japonés", "Francés",
      "Italiano", "Neerlandés", "Portugués", "Gallego", "Euskera",
    ],
    ca: [
      "Anglès", "Espanyol", "Català", "Alemany", "Japonès", "Francès",
      "Italià", "Neerlandès", "Portuguès", "Gallec", "Basc",
    ],
    de: [
      "Englisch", "Spanisch", "Katalanisch", "Deutsch", "Japanisch",
      "Französisch", "Italienisch", "Niederländisch", "Portugiesisch",
      "Galicisch", "Baskisch",
    ],
    ja: [
      "英語", "スペイン語", "カタルーニャ語", "ドイツ語", "日本語",
      "フランス語", "イタリア語", "オランダ語", "ポルトガル語",
      "ガリシア語", "バスク語",
    ],
    fr: [
      "Anglais", "Espagnol", "Catalan", "Allemand", "Japonais",
      "Français", "Italien", "Néerlandais", "Portugais", "Galicien",
      "Basque",
    ],
    it: [
      "Inglese", "Spagnolo", "Catalano", "Tedesco", "Giapponese",
      "Francese", "Italiano", "Olandese", "Portoghese", "Galiziano",
      "Basco",
    ],
    nl: [
      "Engels", "Spaans", "Catalaans", "Duits", "Japans", "Frans",
      "Italiaans", "Nederlands", "Portugees", "Galicisch", "Baskisch",
    ],
    pt: [
      "Inglês", "Espanhol", "Catalão", "Alemão", "Japonês", "Francês",
      "Italiano", "Neerlandês", "Português", "Galego", "Basco",
    ],
  } as const;
  const expectedTaglines = {
    en: "Connecting local food.",
    es: "Conectando la alimentación local.",
    ca: "Connectant l’alimentació local.",
    de: "Lokale Lebensmittel verbinden.",
    ja: "地域の食をつなぐ。",
    fr: "Connecter l’alimentation locale.",
    it: "Connettere il cibo locale.",
    nl: "Lokaal eten, verbonden",
    pt: "Comida local, num só lugar",
  } as const;

  for (const [index, messages] of dictionaries.entries()) {
    const locale = SUPPORTED_LOCALES[index];
    if (locale in expectedTaglines) {
      assert.equal(
        messages.siteHeader.tagline,
        expectedTaglines[locale as keyof typeof expectedTaglines],
      );
    } else {
      assert.ok(messages.siteHeader.tagline.length > 0);
    }
    assert.ok(Object.values(messages.siteHeader).every((value) => value.length > 0));
    assert.match(messages.siteHeader.greeting, /\{name\}/);
    assert.ok(Object.values(messages.siteFooter).every((value) => value.length > 0));
    const accountText = Object.entries(messages.accountActions)
      .filter(([key]) => key !== "descriptionLanguage")
      .map(([, value]) => value);
    assert.ok(accountText.every((value) => typeof value === "string" && value.length > 0));
    assert.ok(messages.accountActions.descriptionLanguage.none.length > 0);
    const options = getDescriptionLocaleOptions(messages, locale);
    assert.deepEqual(
      options.map(({ value }) => value),
      ["", ...DESCRIPTION_SOURCE_LOCALES],
    );
    assert.ok(options.every(({ label }) => label.length > 0));
    if (locale in expectedLanguageNames) {
      assert.deepEqual(
        establishedDescriptionLocales.map((sourceLocale) =>
          formatDescriptionLocale(sourceLocale, messages, locale),
        ),
        expectedLanguageNames[locale as keyof typeof expectedLanguageNames],
      );
    }
  }

  assert.equal(
    dictionaries[1].accountActions.descriptionLanguage.none,
    "Sin idioma de descripción",
  );
});

test("producer field presentation localizes display values while retaining CSV tokens", async () => {
  const [german, spanish] = await Promise.all([loadMessages("de"), loadMessages("es")]);

  assert.equal(formatProducerFieldValue("categoria", "Aceite", "de", german), "Öl");
  assert.equal(
    formatProducerFieldValue(
      "categorias adicionales",
      "Aceite|Miel",
      "de",
      german,
    ),
    "Öl und Honig",
  );
  assert.equal(
    formatProducerFieldValue("verificacion", "pendiente", "de", german),
    "Ausstehend",
  );
  assert.equal(formatProducerFieldValue("Venta online", "sí", "de", german), "Ja");
  assert.equal(
    formatProducerFieldValue(
      "Canal de venta",
      "ecommerce|telefono",
      "de",
      german,
    ),
    "Onlineshop und Telefon",
  );
  assert.equal(
    formatProducerFieldValue("descripcion_locale", "ja", "es", spanish),
    "Japonés",
  );
  assert.equal(
    formatDescriptionLocale("", spanish),
    "Sin idioma de descripción",
  );
  assert.equal(formatDescriptionLocale("future", spanish), "future");
  assert.equal(
    formatProducerFieldLabel("descripcion_locale", "es", spanish),
    "Idioma de la descripción",
  );
  assert.equal(
    formatProducerFieldLabel("quien hay detras", "es", spanish),
    "Quién hay detrás",
  );
  assert.equal(
    formatProducerFieldLabel("fecha ultimo cambio", "es", spanish),
    "Último cambio aprobado del productor",
  );
  assert.equal(
    formatProducerFieldValue("fecha ultimo cambio", "2026-09-02", "es", spanish),
    "2 de septiembre de 2026",
  );

  assert.deepEqual(
    presentProducerField("Venta online", "sí", "de", german),
    {
      key: "Venta online",
      value: "sí",
      label: "Onlineverkauf",
      displayValue: "Ja",
    },
  );
});

test("owner description-language options are stable, localized and include the empty state", async () => {
  const japanese = await loadMessages("ja");
  const options = getDescriptionLocaleOptions(japanese, "ja");
  assert.deepEqual(
    options.map(({ value }) => value),
    ["", ...DESCRIPTION_SOURCE_LOCALES],
  );
  const labels = new Map(options.map(({ value, label }) => [value, label]));
  assert.equal(labels.get(""), "説明文の言語なし");
  assert.equal(labels.get("en"), "英語");
  assert.equal(labels.get("ja"), "日本語");
  assert.equal(labels.get("gl"), "ガリシア語");
  assert.equal(labels.get("eu"), "バスク語");
  assert.match(labels.get("hi") ?? "", /[ぁ-龯]/u);
  assert.ok(options.every(({ label }) => label.length > 0));
});

test("owner field help is complete and localized without changing staff definitions", async () => {
  const [english, spanish, japanese] = await Promise.all([
    loadMessages("en"),
    loadMessages("es"),
    loadMessages("ja"),
  ]);
  const fieldKeys = PRODUCER_EDITABLE_FIELDS.map(({ key }) => key).sort();

  for (const messages of [english, spanish, japanese]) {
    assert.deepEqual(Object.keys(messages.ownerProducerFieldHelp).sort(), fieldKeys);
    assert.ok(Object.values(messages.ownerProducerFieldHelp).every((help) => help.length > 0));
  }
  for (const field of PRODUCER_EDITABLE_FIELDS) {
    assert.equal(english.ownerProducerFieldHelp[field.key], field.help);
  }
  assert.equal(
    spanish.ownerProducerFieldHelp.descripcion_locale,
    "El idioma de origen de la descripción canónica; déjalo vacío solo si la descripción está vacía.",
  );
  assert.equal(japanese.ownerProducerFieldHelp["Venta online"], "現在の注文手段が確認済みかどうか。");
});

test("public field presentation hides internal, locale and expanded-profile fields", async () => {
  const spanish = await loadMessages("es");
  const hiddenFields = {
    slug: "productor-interno",
    imagen: "/productores/es/productor-interno.webp",
    producer_id: "123",
    country: "es",
    region: "catalunya",
    area: "barcelona",
    verificacion: "pendiente",
    descripcion_locale: "es",
    "visitas guiadas": "sí",
    "mensaje a la comunidad": "Mensaje reservado al bloque ampliado.",
    mensaje_comunidad_locale: "es",
    video: "https://youtu.be/dQw4w9WgXcQ",
    "quien hay detras": "Ana y Luis.",
    quien_hay_detras_locale: "es",
    historia: "Comenzó en 1987.",
    historia_locale: "es",
    "fecha ultimo cambio": "2026-09-02",
    "enlace destacado 1": "https://example.com/uno",
    "enlace destacado 2": "https://example.com/dos",
  };
  const fields = presentPublicProducerFields(
    {
      categoria: "Aceite",
      descripcion: "Cultiva olivos.",
      ...hiddenFields,
      "Venta online": "sí",
    },
    "es",
    spanish,
  );

  assert.deepEqual(
    fields.map(({ key, value, displayValue }) => ({ key, value, displayValue })),
    [
      { key: "categoria", value: "Aceite", displayValue: "Aceite" },
      {
        key: "descripcion",
        value: "Cultiva olivos.",
        displayValue: "Cultiva olivos.",
      },
      { key: "Venta online", value: "sí", displayValue: "Sí" },
    ],
  );
  for (const key of Object.keys(hiddenFields)) {
    assert.equal(isPublicProducerField(key), false, `${key} must stay hidden`);
  }
});

test("verification presentation shows only pending or verified producer ownership", async () => {
  const spanish = await loadMessages("es");

  assert.deepEqual(
    presentProducerVerification("pendiente", false, "es", spanish),
    {
      key: "verificacion",
      value: "pendiente",
      label: "Verificación",
      displayValue: "Pendiente",
    },
  );
  assert.equal(presentProducerVerification("", false, "es", spanish), null);
  assert.equal(
    presentProducerVerification("", true, "es", spanish)?.displayValue,
    "Titularidad verificada",
  );
  assert.equal(
    presentProducerVerification("pendiente", true, "es", spanish)?.displayValue,
    "Titularidad verificada",
  );
});

test("account pages render localized help and enforce gift entry-point permissions", async (t) => {
  // Exercise the real pages, form and actions with isolated infrastructure.
  // Gift transactions and races are exercised against PGlite in test-profile-gifts-service.ts.
  const fixture = {
    presentation: {
      locale: "es",
      explicitLocale: null,
      messages: await loadMessages("es"),
    },
    premium: true,
    admin: false,
    databaseReads: 0,
    adminPaths: [] as string[],
    giftCalls: [] as Array<{ operation: string; input: unknown }>,
  };
  const fixtureGlobal = "__chisanAccountPresentationTest";
  Object.assign(globalThis, { [fixtureGlobal]: fixture });
  const fixtureSource = `const fixture = globalThis.${fixtureGlobal};\n`;
  const unexpected = "() => { throw new Error('Unexpected infrastructure call'); }";
  const stubs: Record<string, string> = {
    "server-only": "export {};",
    "next/navigation": "export function redirect(url) { throw new Error('Redirect: ' + url); } export function notFound() { throw new Error('Not found'); }",
    "@/lib/accounts/auth": `
      export async function requireCurrentAccount() { return { id: 'owner' }; }
      export async function hasProducerAccess() { return true; }
      export async function hasProducerOwnerAccess() { return false; }
      export async function requireAdminAccount(path) {
        fixture.adminPaths.push(path);
        if (!fixture.admin) throw new Error('Admin access denied');
        return { id: 'admin' };
      }
      export const requireStaffAccount = ${unexpected};`,
    "@/lib/i18n/application-presentation.server": "export async function loadApplicationPresentation() { return fixture.presentation; }",
    "@/lib/db": `export function getDatabase() {
      fixture.databaseReads++;
      const query = { select: () => query, from: () => query, where: () => query,
        orderBy: () => query, limit: async () => [] };
      return query;
    }`,
    "@/lib/csv-catalog": `export async function findProducerById() {
      return { country: 'es', area: 'barcelona', producerId: 1, slug: 'fixture',
        name: 'Fixture producer', city: 'Barcelona', fields: { categoria: 'Aceite' } };
    }`,
    "@/lib/accounts/catalog-links": "export const buildAccountProducerHref = () => '/es/barcelona/fixture';",
    "@/lib/accounts/config": "export const isProducerChangeSubmissionEnabled = () => true;",
    "@/lib/accounts/producer-premium-entitlements": "export async function getActiveProducerPremiumEntitlement() { return fixture.premium ? { metadata: {} } : null; }",
    "@/lib/accounts/producer-media": `export const listProducerMediaUploads = ${unexpected};`,
    "@/lib/catalog/content": "export async function loadProducerContent() { return null; }",
    "@/lib/payments/stripe-profile-upgrade-config": "export const getStripeProfileUpgradeConfiguration = () => ({ checkoutReady: false });",
    "@/app/(application)/cuenta/actions": `export const submitProducerChangeAction = ${unexpected}; export const updateProducerProfileQrAction = ${unexpected};`,
    "@/lib/admin/review-producer-change": `export const createProducerChangeReviewService = ${unexpected};`,
    "@/lib/admin/review-producer-suggestion": `export const createProducerSuggestionReviewService = ${unexpected};`,
    "@/lib/payments/stripe-profile-upgrades": `export const fulfillProducerProfileUpgradeCheckout = ${unexpected};`,
    "@/lib/admin/producer-profile-access": `export const queryAdminProfileAccess = ${unexpected}; export const queryAdminProfileGiftCandidates = ${unexpected};`,
    "@/lib/accounts/producer-profile-gifts": `
      export async function grantProducerPremiumGift(input) {
        fixture.giftCalls.push({ operation: 'grant', input });
        return { kind: 'granted' };
      }
      export async function revokeProducerPremiumGift(input) {
        fixture.giftCalls.push({ operation: 'revoke', input });
        return { kind: 'revoked' };
      }`,
  };
  const hooks = registerHooks({
    resolve(specifier, context, nextResolve) {
      if (Object.hasOwn(stubs, specifier)) {
        return {
          url: `data:text/javascript,${encodeURIComponent(fixtureSource + stubs[specifier])}`,
          format: "module",
          shortCircuit: true,
        };
      }
      return nextResolve(specifier, context);
    },
    load(url, context, nextLoad) {
      if (url.startsWith("data:text/javascript,")) {
        return {
          format: "module",
          source: decodeURIComponent(url.slice("data:text/javascript,".length)),
          shortCircuit: true,
        };
      }
      if (url.endsWith(".css")) {
        return { format: "module", source: "export default {};", shortCircuit: true };
      }
      return nextLoad(url, context);
    },
  });
  try {
    await t.test("the rendered producer editor uses translated help and respects premium visibility", async () => {
      const { default: EditProducerPage } = await import(
        "../app/(application)/cuenta/productores/[country]/[producerId]/editar/page"
      );
      for (const locale of ["es", "ja"] as const) {
        fixture.presentation = {
          locale,
          explicitLocale: null,
          messages: await loadMessages(locale),
        };
        for (const premium of [true, false]) {
          fixture.premium = premium;
          const page = await EditProducerPage({
            params: Promise.resolve({ country: "es", producerId: "1" }),
            searchParams: Promise.resolve({}),
          });
          const html = renderToStaticMarkup(page);
          const help = [...html.matchAll(/<small\b[^>]*>([\s\S]*?)<\/small>/g)]
            .map((match) => match[1]);
          const escaped = (text: string) =>
            renderToStaticMarkup(createElement(Fragment, null, text));
          const helpMessages = fixture.presentation.messages.ownerProducerFieldHelp;
          for (const field of PRODUCER_STANDARD_EDITABLE_FIELDS) {
            assert.ok(
              help.includes(escaped(helpMessages[field.key])),
              `${locale}: ${field.key}`,
            );
          }
          for (const field of PRODUCER_PREMIUM_EDITABLE_FIELDS) {
            const fieldHelp = helpMessages[field.key];
            assert.ok(fieldHelp, `${locale}: ${field.key} must have translated help`);
            assert.equal(
              help.includes(escaped(fieldHelp)),
              premium,
              `${locale}: ${field.key} premium visibility`,
            );
          }
          const staffHelp = PRODUCER_EDITABLE_FIELDS.find(
            (field) => field.key === "descripcion_locale",
          )!.help;
          assert.ok(
            !help.includes(escaped(staffHelp)),
            "staff English help must not leak into the translated editor",
          );
        }
      }
    });

    await t.test("gift pages and actions reject unauthorized access before reading or mutating", async () => {
      const { default: AdminPremiumProfilesPage } = await import(
        "../app/(admin)/admin/premium/page"
      );
      const { grantProducerPremiumGiftAction, revokeProducerPremiumGiftAction } =
        await import("../app/(admin)/admin/actions");
      const grant = new FormData();
      grant.set("country", "es");
      grant.set("producerId", "1");
      grant.set("reason", "A reviewed administrative gift for this test producer.");
      grant.set("adminUserId", "forged-admin");
      const revoke = new FormData();
      revoke.set("entitlementId", "10000000-0000-4000-8000-000000000001");
      revoke.set("reason", "The reviewed administrative gift has ended.");
      revoke.set("confirmation", "revoke");
      revoke.set("adminUserId", "forged-admin");
      fixture.databaseReads = 0;
      await assert.rejects(
        AdminPremiumProfilesPage({ searchParams: Promise.resolve({}) }),
        /Admin access denied/,
      );
      await assert.rejects(grantProducerPremiumGiftAction(grant), /Admin access denied/);
      await assert.rejects(revokeProducerPremiumGiftAction(revoke), /Admin access denied/);
      assert.equal(fixture.databaseReads, 0);
      assert.deepEqual(fixture.giftCalls, []);
      assert.deepEqual(fixture.adminPaths, Array(3).fill("/admin/premium"));

      fixture.admin = true;
      await assert.rejects(
        grantProducerPremiumGiftAction(grant),
        /Redirect: \/admin\/premium\?result=granted/,
      );
      await assert.rejects(
        revokeProducerPremiumGiftAction(revoke),
        /Redirect: \/admin\/premium\?result=revoked/,
      );
      assert.deepEqual(fixture.giftCalls, [
        {
          operation: "grant",
          input: { adminUserId: "admin", country: "es", producerId: 1, reason: grant.get("reason") },
        },
        {
          operation: "revoke",
          input: { adminUserId: "admin", entitlementId: revoke.get("entitlementId"), reason: revoke.get("reason") },
        },
      ]);
    });
  } finally {
    hooks.deregister();
    Reflect.deleteProperty(globalThis, fixtureGlobal);
  }
});
