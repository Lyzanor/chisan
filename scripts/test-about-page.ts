import assert from "node:assert/strict";
import test from "node:test";

import { getAboutCopy } from "../lib/i18n/public-pages";

test("About Chisan provides complete copy in English and Spanish", () => {
  for (const locale of ["en", "es"] as const) {
    const copy = getAboutCopy(locale);
    assert.equal(copy.locale, locale);
    assert.ok(copy.title.length > 0);
    assert.ok(copy.description.length > 0);
    assert.ok(copy.heroLead.length > 0);
    assert.ok(copy.heroParagraphs.length >= 2);
    assert.ok(copy.founderLead.includes("Enrique Pérez"));
    assert.ok(copy.founderParagraphs.length >= 2);
    assert.ok(copy.travelParagraphs.length >= 2);
    assert.ok(copy.technologyParagraphs.length >= 2);
    assert.ok(copy.principles.length >= 3);
    for (const principle of copy.principles) {
      assert.ok(principle.title.length > 0);
      assert.ok(principle.description.length > 0);
    }
    assert.ok(copy.futureParagraphs.length >= 2);
    assert.ok(copy.closing.length > 0);
    assert.ok(copy.exploreCatalog.length > 0);
    assert.ok(copy.howWeWorkLink.length > 0);
    assert.ok(copy.contactLink.length > 0);

    const linkedInUrl = new URL(copy.linkedInUrl);
    assert.equal(linkedInUrl.protocol, "https:");
    assert.equal(linkedInUrl.hostname, "www.linkedin.com");
  }
});
