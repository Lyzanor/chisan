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
      price: { amount: "3.50", currency: "EUR" },
      purchase_url: "https://shop.example.org/product",
      updated_on: "2026-09-06",
      format: "botella 750 ml",
      season_months: [8, 9],
      seasonal_special: true,
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
    content.gallery.push({ ...content.gallery[0], id: "gallery-only", src: "/productores/es/content/1/gallery.webp", alt: "Standalone photo" });
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
    assert.equal((html.match(/alt="Reviewed image"/g) ?? []).length, 1, "product photo is not repeated in the gallery");
    assert.match(html, /alt="Standalone photo"/);
    assert.match(html, /loading="lazy"/);
    assert.match(
      html,
      /<figcaption[^>]*>Source caption · Example<\/figcaption>/,
    );
    assert.match(html, /3,50/);
    assert.match(html, /Ver en la tienda/);
    assert.match(html, /shop.example.org/);
    assert.match(html, /dateTime="2026-09-06"/);
    assert.match(html, /aria-label="Actualizado el 6 de septiembre de 2026"/);
    content.producer_id = 12439;
    const demo = renderToStaticMarkup(createElement(ProducerContent, { content, locale: "es" }));
    assert.match(demo, /Probar enlace de ejemplo/);
    assert.match(demo, /precio y enlace ficticios/);
    assert.doesNotMatch(demo, /Ver en la tienda/);
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

test("commercial sections show certification scope and professional contact without inventing channels", async () => {
  const { ProducerCommercialDetails } = await import("../components/producer-commercial-details");
  const { loadMessages } = await import("../lib/i18n/messages");
  const messages = await loadMessages("es");
  const fields = { certificaciones: "ecologico", certificaciones_detalle: "Hortalizas; emisor y código revisados.", venta_profesionales: "bajo consulta", correo: "demo@example.org", telefono: "+34600112233", visita_cita_previa: "cita previa obligatoria", pedido_minimo: "Caja 5 kg", condiciones_envio: "Recogida local" };
  const render = (patch = {}) => renderToStaticMarkup(createElement(ProducerCommercialDetails, { fields: { ...fields, ...patch }, locale: "es", messages, country: "es", producerId: 12439 }));
  assert.match(render(), /Sin certificación real/);
  assert.match(render(), /Hortalizas; emisor y código revisados/);
  assert.match(render(), /mailto:demo@example.org\?subject=Consulta/);
  assert.match(render({ correo: "" }), /tel:\+34600112233/);
  assert.doesNotMatch(render({ correo: "", telefono: "" }), /href=/);
  assert.doesNotMatch(render({ venta_profesionales: "no" }), /href=/);
});
