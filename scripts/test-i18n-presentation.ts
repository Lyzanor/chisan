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
  presentProducerField,
  presentPublicProducerFields,
} from "../lib/i18n/producer-fields";

test("account presentation messages cover both account action surfaces in every locale", async () => {
  const dictionaries = await Promise.all(SUPPORTED_LOCALES.map(loadMessages));
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
  const expectedTaglines = [
    "Local food, unified",
    "Alimentación local, unificada",
    "Alimentació local, unificada",
    "Lokale Lebensmittel, vereint",
    "地域の食を、ひとつに",
    "L’alimentation locale, réunie",
    "Cibo locale, insieme",
    "Lokaal eten, verbonden",
    "Comida local, num só lugar",
  ] as const;

  for (const [index, messages] of dictionaries.entries()) {
    assert.equal(messages.siteHeader.tagline, expectedTaglines[index]);
    assert.ok(Object.values(messages.siteHeader).every((value) => value.length > 0));
    assert.ok(Object.values(messages.siteFooter).every((value) => value.length > 0));
    const accountText = Object.entries(messages.accountActions)
      .filter(([key]) => key !== "descriptionLanguage")
      .map(([, value]) => value);
    assert.ok(accountText.every((value) => typeof value === "string" && value.length > 0));
    assert.ok(messages.accountActions.descriptionLanguage.none.length > 0);
    assert.deepEqual(
      DESCRIPTION_SOURCE_LOCALES.map(
        (locale) => messages.accountActions.descriptionLanguage.names[locale],
      ),
      expectedLanguageNames[SUPPORTED_LOCALES[index]],
    );
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
    formatProducerFieldValue("verificacion", "verificado", "de", german),
    "Verifiziert",
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
  assert.deepEqual(getDescriptionLocaleOptions(japanese), [
    { value: "", label: "説明文の言語なし" },
    { value: "en", label: "英語" },
    { value: "es", label: "スペイン語" },
    { value: "ca", label: "カタルーニャ語" },
    { value: "de", label: "ドイツ語" },
    { value: "ja", label: "日本語" },
    { value: "fr", label: "フランス語" },
    { value: "it", label: "イタリア語" },
    { value: "nl", label: "オランダ語" },
    { value: "pt", label: "ポルトガル語" },
    { value: "gl", label: "ガリシア語" },
    { value: "eu", label: "バスク語" },
  ]);
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

test("public field presentation hides description source locale without changing raw values", async () => {
  const spanish = await loadMessages("es");
  const fields = presentPublicProducerFields(
    {
      categoria: "Aceite",
      descripcion: "Cultiva olivos.",
      descripcion_locale: "es",
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
});
