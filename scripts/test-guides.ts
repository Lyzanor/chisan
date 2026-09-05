import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { parseGuideMarkdown } from "../lib/guides/markdown";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GuideMarkdown } from "../components/guides/guide-markdown";
import {
  readGuides,
  listPublishedGuides,
  isGuidePublished,
  loadGuide,
  resolveGuideProducers,
  guidePath,
  listGuidesForProducer,
} from "../lib/guides/catalog";
import { guideSchema } from "../lib/guides/schema";
import {
  buildGuideMetadata,
  buildGuideStructuredData,
  listGuideSitemapEntries,
} from "../lib/guides/metadata";
import { serializeStructuredData } from "../lib/site-structured-data";
import { hasProducerSelectionCoordinates } from "../lib/producer-selections";

test("guide content has valid structure, stable related links and publication dates", () => {
  const guides = readGuides();
  assert.ok(guides.length >= 31);
  for (const guide of guides) assert.ok(guideSchema.safeParse(guide).success);
  const guide = guides[0];
  assert.equal(
    guideSchema.safeParse({ ...guide, unexpectedHtml: "<script>" }).success,
    false,
  );
  assert.equal(
    guideSchema.safeParse({ ...guide, updatedAt: "2020-01-01" }).success,
    false,
  );
  assert.equal(
    guideSchema.safeParse({ ...guide, related: [guide.slug] }).success,
    false,
  );
  assert.equal(
    guideSchema.safeParse({
      ...guide,
      sections: [guide.sections[0], guide.sections[0]],
    }).success,
    false,
  );
  assert.equal(
    guideSchema.safeParse({
      ...guide,
      sources: [{ ...guide.sources[0], url: "javascript:alert(1)" }],
    }).success,
    false,
  );
  const prose = guide.sections.find((section) => section.type === "prose")!;
  assert.equal(
    guideSchema.safeParse({
      ...guide,
      sections: [{ ...prose, markdown: "" }],
    }).success,
    false,
  );
});

test("draft and unknown guides are excluded from public resolution", async () => {
  const guide = readGuides()[0];
  assert.equal(isGuidePublished({ ...guide, status: "draft" }), false);
  assert.equal(
    isGuidePublished({ ...guide, country: "ar" } as unknown as typeof guide),
    false,
  );
  assert.equal(await loadGuide("not-a-guide"), null);
  assert.ok(listPublishedGuides().every(isGuidePublished));
});

test("selections resolve current CSV identity, route and editorial order, retaining unmapped producers", async () => {
  const page = await loadGuide("vinos-de-espana-denominaciones-origen");
  assert.ok(page);
  assert.deepEqual(
    page.producers.map((producer) => producer.producerId),
    page.guide.sections.flatMap((section) =>
      section.type === "producers"
        ? section.items.map((item) => item.producerId)
        : [],
    ),
  );
  assert.equal(
    new Set(page.producers.map((producer) => producer.key)).size,
    page.producers.length,
  );
  for (const producer of page.producers) {
    assert.equal(producer.href, `/es/${producer.area}/${producer.slug}`);
    assert.ok(producer.name && producer.focus && producer.areaLabel);
  }
  const unmapped = { ...page.producers[0], latitude: null, longitude: null };
  assert.equal(hasProducerSelectionCoordinates(unmapped), false);
  assert.ok(unmapped.href);
  const section = page.guide.sections.find(
    (entry) => entry.type === "producers",
  )!;
  await assert.rejects(
    resolveGuideProducers({
      ...page.guide,
      sections: [
        {
          ...section,
          items: [
            { country: "es", producerId: 99999999, focus: "Missing fixture" },
          ],
        },
      ],
    }),
    /missing producer/,
  );
});

test("profile reverse links follow exact published producer references", () => {
  for (const guide of listPublishedGuides()) {
    for (const section of guide.sections) {
      if (section.type !== "producers") continue;
      for (const identity of section.items) {
        assert.ok(
          listGuidesForProducer(identity).some(
            (entry) => entry.slug === guide.slug,
          ),
        );
        assert.deepEqual(
          listGuidesForProducer({ ...identity, country: "ar" }),
          [],
        );
      }
    }
  }
  assert.deepEqual(
    listGuidesForProducer({ country: "es", producerId: 99999999 }),
    [],
  );
});

test("article metadata, dates and sitemap agree; structured data is safely serialized", () => {
  const entries = listGuideSitemapEntries();
  const guides = listPublishedGuides();
  assert.equal(entries.length, guides.length + 1);
  assert.ok(entries.some((entry) => entry.url === "https://chisan.app/guias"));
  for (const guide of guides) {
    const url = `https://chisan.app${guidePath(guide.slug)}`;
    const metadata = buildGuideMetadata(guide);
    const entry = entries.find((entry) => entry.url === url);
    assert.equal(metadata.alternates?.canonical, url);
    assert.deepEqual(entry?.alternates?.languages, { es: url });
    assert.equal(entry?.lastModified, guide.updatedAt);
    const data = buildGuideStructuredData(guide);
    assert.equal(data["@graph"][0].dateModified, guide.updatedAt);
    assert.equal(data["@graph"][0].headline, guide.title);
    assert.equal(data["@graph"][0].inLanguage, "es");
    assert.ok(!JSON.stringify(data).includes("AggregateRating"));
  }
  const malicious = buildGuideStructuredData({
    ...guides[0],
    title: "</script><script>alert(1)</script>",
  });
  const serialized = serializeStructuredData(malicious);
  assert.ok(!serialized.includes("</script>"));
  assert.deepEqual(JSON.parse(serialized), malicious);
});


test("Markdown is the sole authored body and keeps formatting and exact producer references", () => {
  const text = readFileSync("data/guides/es/quesos-de-espana.md", "utf8");
  const guide = parseGuideMarkdown(text);
  assert.ok(guide.introduction.includes("Un queso"));
  const selection = guide.sections.find((section) => section.type === "producers")!;
  assert.deepEqual(selection.items.map((item) => item.producerId), [10716, 10555, 10528]);
  assert.equal(selection.showMap, true);
  const edited = parseGuideMarkdown(text.replace("Un queso cuenta", "Un **queso** cuenta"));
  const html = renderToStaticMarkup(createElement(GuideMarkdown, null, edited.introduction));
  assert.ok(html.includes("<strong>queso</strong>"));
  assert.throws(() => parseGuideMarkdown(text.replace("schemaVersion: 1", "schemaVersion: 1\nsections: []")), /belongs in the Markdown body/);
  assert.throws(() => parseGuideMarkdown(text.replace("schemaVersion: 1", "schemaVersion: 1\nschemaVersion: 2")));
  assert.throws(() => parseGuideMarkdown(text.replace("<!-- mapa -->", "<script>alert(1)</script>")), /Raw HTML/);
  assert.throws(() => parseGuideMarkdown(text.replace("producer:es:10716", "producer:es:missing")), /Producer references/);
  assert.throws(() => parseGuideMarkdown(text.replace("producer:es:10555", "producer:es:10716")), /Repeated producer/);
  assert.throws(() => parseGuideMarkdown(text.replace("## Nuestro criterio editorial {#criterio-editorial}", "## A different section")));
  const safe = renderToStaticMarkup(createElement(GuideMarkdown, null, "[bad](javascript:alert%281%29)\n\n<script>bad</script>"));
  assert.ok(!safe.includes("javascript:") && !safe.includes("<script>"));
});
