import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { mkdtemp, mkdir, writeFile, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  contentSourceHash, emptyProducerContent, hasProducerContent,
  localizeProducerContent, producerContentSchema, standaloneProducerGallery,
  localizedContentPersonSchema,
} from "../lib/catalog/content-schema";
import {
  hashProducerContent, proposeProducerProducts, proposeProducerMedia,
  resolveProducerContentChange, isFreeProducerGalleryChange,
} from "../lib/accounts/producer-content-change";
import { validateContentAssets } from "../lib/editorial/content-assets";
import { buildProductStructuredData } from "../lib/catalog/product-structured-data";

const person = {
  id: "ana", name: "Ana Soler", role: "Responsable del obrador",
  description: "Elabora y hornea el pan.", locale: "es" as const,
};
const portrait = {
  src: "/productores/es/content/42/ana.png", alt: "Ana en el obrador",
  caption: "En el obrador", credit: "Fotografía cedida", locale: "es" as const,
  width: 400, height: 300,
};
function sample() {
  return producerContentSchema.parse({
    ...emptyProducerContent("es", 42), people: [{ ...person, photo: portrait }],
    translations: [{ collection: "people", item_id: "ana", locale: "en",
      source_hash: contentSourceHash("people", person),
      values: { role: "Head baker", description: "Makes and bakes the bread." } }],
  });
}

test("people are at most three distinct named records with roles and optional own portraits", () => {
  const base = emptyProducerContent("es", 42);
  const valid = { ...base, people: [person, { ...person, id: "pau", name: "Pau" }, { ...person, id: "joan", name: "Joan" }] };
  assert.ok(producerContentSchema.safeParse(valid).success);
  for (const people of [
    [...valid.people, { ...person, id: "fourth" }], [person, person],
    [{ ...person, name: " " }], [{ ...person, role: " " }],
    [{ ...person, description: "x".repeat(501) }], [{ ...person, price: "10" }],
    [{ ...person, photo: { ...portrait, src: "/productores/es/content/43/ana.png" } }],
    [{ ...person, photo: { ...portrait, src: "https://example.org/ana.png" } }],
  ]) assert.equal(producerContentSchema.safeParse({ ...base, people }).success, false);
  const content = sample();
  assert.ok(hasProducerContent(content));
  assert.deepEqual(standaloneProducerGallery(content), []);
  assert.equal(buildProductStructuredData(content, "https://example.org/producer"), null);
  assert.equal("photo" in producerContentSchema.parse({ ...base, people: [person] }).people![0], false);
});

test("person translations preserve names and portrait language, rejecting field injection and stale biography", () => {
  const content = sample();
  const localized = localizeProducerContent(content, "en").people![0];
  assert.equal(localized.name, person.name);
  assert.equal(localized.role, "Head baker");
  assert.equal(localized.locale, "en");
  assert.equal(localized.photo?.locale, "es");
  assert.deepEqual(localized.photo, portrait);
  for (const change of [{ name: "Ana Serra" }, { role: "Fundadora" }, { description: "Otra biografía." }]) {
    const edited = structuredClone(content);
    Object.assign(edited.people![0], change);
    assert.equal(localizeProducerContent(edited, "en").people![0].locale, "es");
  }
  content.people![0].photo!.credit = "Nueva atribución";
  assert.equal(localizeProducerContent(content, "en").people![0].locale, "en");
  const expandedTranslation = structuredClone(content);
  expandedTranslation.translations[0].values = { role: "r".repeat(150), description: "d".repeat(625) };
  assert.ok(producerContentSchema.safeParse(expandedTranslation).success);
  assert.ok(localizedContentPersonSchema.safeParse(localizeProducerContent(expandedTranslation, "en").people![0]).success);
  for (const patch of [{ name: "Invented name" }, { role: "x".repeat(151) }, { description: "x".repeat(626) }]) {
    const edited = structuredClone(content);
    Object.assign(edited.translations[0].values, patch);
    assert.equal(producerContentSchema.safeParse(edited).success, false);
  }
});

test("product and free-gallery proposals preserve people, portraits and translations", () => {
  const base = sample();
  base.gallery = [{ ...portrait, id: "gallery", src: "/productores/es/content/42/gallery.png" }];
  const products = [{ id: "bread", name: "Pan", description: "", locale: "es", media_ids: [], link_ids: [] }];
  const productChange = proposeProducerProducts(base, products)!;
  const galleryChange = proposeProducerMedia(base, [], [{ ...base.gallery[0], caption: "Vista del obrador" }], [])!;
  assert.ok(isFreeProducerGalleryChange(galleryChange));
  for (const proposal of [productChange, galleryChange]) {
    const { requested } = resolveProducerContentChange(proposal, "es", 42);
    assert.deepEqual(requested.people, base.people);
    assert.deepEqual(requested.translations, base.translations);
    const tampered = structuredClone(proposal);
    tampered.base.people![0].name = "Someone else";
    assert.throws(() => resolveProducerContentChange(tampered, "es", 42), /snapshots/);
  }
  const changed = structuredClone(base);
  changed.people![0].description = "Nueva presentación editorial.";
  assert.notEqual(hashProducerContent(changed), productChange.baseHash);
});

test("legacy content keeps its historical semantic hash without a people default", () => {
  const legacy = emptyProducerContent("es", 42);
  assert.equal("people" in legacy, false);
  assert.equal("people" in localizeProducerContent(legacy, "en"), false);
  assert.equal(hashProducerContent(legacy), "e86cbc609250870af556e8c5edf0a27dd2637e0264bc2992aa4e63d33f006af4");
});

test("portraits receive real asset metadata, missing-file and containment checks", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "chisan-people-assets-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const directory = path.join(root, "public/productores/es/content/42");
  await mkdir(directory, { recursive: true });
  const png = Buffer.alloc(24);
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).copy(png);
  png.writeUInt32BE(400, 16); png.writeUInt32BE(300, 20);
  await writeFile(path.join(directory, "ana.png"), png);
  const content = sample();
  await validateContentAssets(content, root);
  content.people![0].photo!.width = 500;
  await assert.rejects(validateContentAssets(content, root), /dimensions/);
  content.people![0].photo!.src = "/productores/es/content/42/missing.png";
  await assert.rejects(validateContentAssets(content, root));
  await writeFile(path.join(root, "private.png"), png);
  await symlink(path.join(root, "private.png"), path.join(directory, "escape.png"));
  content.people![0].photo!.src = "/productores/es/content/42/escape.png";
  await assert.rejects(validateContentAssets(content, root), /escapes/);
});

test("people render separately, with accessible portraits, safe prose and no empty placeholders", async () => {
  const hooks = registerHooks({ load(url, context, nextLoad) {
    if (new URL(url).pathname.endsWith("/producer-people.module.css"))
      return { format: "module", source: "export default {};", shortCircuit: true };
    return nextLoad(url, context);
  } });
  try {
    const { ProducerPeople } = await import("../components/producer-people");
    const content = sample();
    content.people!.push({ ...person, id: "pau", name: "Pau & Co", description: "<script>literal</script>" });
    const render = (props = {}) => renderToStaticMarkup(createElement(ProducerPeople, { title: "Quién hay detrás", people: content.people, ...props }));
    const html = render();
    assert.match(html, /aria-labelledby="producer-people-title"/);
    assert.match(html, /alt="Ana en el obrador"/);
    assert.match(html, /loading="lazy"/);
    assert.match(html, /En el obrador · Fotografía cedida/);
    assert.match(html, /Pau &amp; Co/);
    assert.match(html, /&lt;script&gt;literal&lt;\/script&gt;/);
    assert.equal((html.match(/<img /g) ?? []).length, 1);
    assert.doesNotMatch(html, /application\/ld\+json|<script>/);
    assert.equal(render({ people: [] }), "");
    assert.match(render({ people: [], introduction: "Equipo familiar", introductionLocale: "es" }), /lang="es">Equipo familiar/);
  } finally { hooks.deregister(); }
});
