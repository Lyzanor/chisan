import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { PRODUCER_EDITABLE_FIELDS } from "../lib/accounts/producer-fields";
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

  const ownerPage = readFileSync(
    path.resolve(
      process.cwd(),
      "app/(application)/cuenta/productores/[country]/[producerId]/editar/page.tsx",
    ),
    "utf8",
  );
  assert.match(ownerPage, /messages\.ownerProducerFieldHelp\[field\.key\]/);
  assert.doesNotMatch(ownerPage, /<small>\{field\.help\}<\/small>/);
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
    "Verificado por el productor",
  );
  assert.equal(
    presentProducerVerification("pendiente", true, "es", spanish)?.displayValue,
    "Verificado por el productor",
  );
});

test("expanded profile source keeps every public entitlement check fail-closed", () => {
  const source = readFileSync(
    path.resolve(process.cwd(), "components/expanded-producer-profile.tsx"),
    "utf8",
  );

  assert.match(
    source,
    /if \(!getAccountSystemConfiguration\(\)\.databaseConfigured\) return null;/,
  );
  assert.match(
    source,
    /if \(!\(await hasActiveProducerPremiumEntitlement\(country, producerId\)\)\) return null;/,
  );
  assert.match(source, /catch \(error\) \{[\s\S]*?return null;\n  \}/);
});

test("premium admin gifts require exact admin access and remain Stripe-independent", () => {
  const adminPage = readFileSync(
    path.resolve(process.cwd(), "app/(application)/admin/premium/page.tsx"),
    "utf8",
  );
  const adminActions = readFileSync(
    path.resolve(process.cwd(), "app/(application)/admin/actions.ts"),
    "utf8",
  );
  const giftService = readFileSync(
    path.resolve(process.cwd(), "lib/accounts/producer-profile-gifts.ts"),
    "utf8",
  );

  assert.match(adminPage, /requireAdminAccount\("\/admin\/premium"\)/);
  assert.match(
    adminActions,
    /grantProducerPremiumGiftAction[\s\S]*?requireAdminAccount\("\/admin\/premium"\)/,
  );
  assert.match(
    adminActions,
    /revokeProducerPremiumGiftAction[\s\S]*?requireAdminAccount\("\/admin\/premium"\)/,
  );
  assert.doesNotMatch(giftService, /getStripeClient|STRIPE_SECRET_KEY/);
  assert.match(giftService, /PRODUCER_PROFILE_UPGRADE_ADMIN_GIFT_ENTITLEMENT_SOURCE/);
  assert.match(giftService, /PRODUCER_PROFILE_UPGRADE_OPEN_STATUSES/);
  assert.match(giftService, /eq\(staffGrants\.role, "admin"\)/);
  assert.match(giftService, /eq\(users\.status, "active"\)/);
  assert.match(giftService, /lockActiveAdmin\(transaction, input\.adminUserId, now\)/g);
  assert.match(giftService, /\.for\("update"\)/);
  assert.match(
    giftService,
    /grantProducerPremiumGift[\s\S]*?pg_advisory_xact_lock[\s\S]*?lockActiveAdmin\(transaction, input\.adminUserId, now\)/,
  );
  assert.match(
    giftService,
    /const country = candidate\.country;[\s\S]*?pg_advisory_xact_lock[\s\S]*?lockActiveAdmin\(transaction, input\.adminUserId, now\)/,
  );
});
