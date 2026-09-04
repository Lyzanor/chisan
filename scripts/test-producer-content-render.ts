import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { emptyProducerContent } from "../lib/catalog/content-schema";
import { SUPPORTED_LOCALES } from "../lib/i18n/locales";
import { getProducerContentLabels } from "../lib/i18n/producer-content";

test("related content renders semantic, localized and escaped public records", async () => {
  // Node checks HTML semantics; browser QA exercises the real CSS module.
  const hooks = registerHooks({
    load(url, context, nextLoad) {
      if (new URL(url).pathname.endsWith("/producer-content.module.css")) {
        return {
          format: "module",
          source: "export default {};",
          shortCircuit: true,
        };
      }
      return nextLoad(url, context);
    },
  });
  try {
    const { ProducerContent } = await import("../components/producer-content");
    const content = emptyProducerContent("es", 1);
    content.products.push({
      id: "example",
      name: "Example & Co",
      description: "<script>literal</script>",
      locale: "en",
      media_ids: ["image"],
      link_ids: ["details"],
    });
    content.gallery.push({
      id: "image",
      src: "/productores/es/content/1/image.webp",
      alt: "Reviewed image",
      caption: "Source caption",
      locale: "en",
      width: 800,
      height: 600,
      credit: "Example",
    });
    content.links.push({
      id: "details",
      label: "Detalles",
      url: "https://example.org/details",
      locale: "es",
    });
    const html = renderToStaticMarkup(
      createElement(ProducerContent, { content, locale: "es" }),
    );
    for (const label of ["Productos", "Galería", "Enlaces"])
      assert.ok(html.includes(label));
    assert.match(html, /lang="en">Example &amp; Co/);
    assert.match(html, /&lt;script&gt;literal&lt;\/script&gt;/);
    assert.match(html, /alt="Reviewed image"/);
    assert.match(html, /loading="lazy"/);
    assert.match(
      html,
      /<figcaption[^>]*>Source caption · Example<\/figcaption>/,
    );
    assert.match(html, /href="https:\/\/example.org\/details"/);
    assert.doesNotMatch(html, /application\/ld\+json|<script>/);
    const empty = renderToStaticMarkup(
      createElement(ProducerContent, {
        content: emptyProducerContent("es", 1),
        locale: "es",
      }),
    );
    assert.doesNotMatch(empty, /<section|<h3|<img|<a\b/);
    for (const locale of SUPPORTED_LOCALES) {
      assert.ok(
        Object.values(getProducerContentLabels(locale)).every((label) =>
          label.trim(),
        ),
      );
    }
  } finally {
    hooks.deregister();
  }
});
