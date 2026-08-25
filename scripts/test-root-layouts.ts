import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import path from "node:path";

import { parseCatalogScope } from "../lib/i18n/catalog-scope";

const repositoryRoot = process.cwd();

function repositoryPath(relativePath: string): string {
  return path.join(repositoryRoot, relativePath);
}

function readRepositoryFile(relativePath: string): string {
  return readFileSync(repositoryPath(relativePath), "utf8");
}

test("application and catalog routes live under separate root layout groups", () => {
  assert.equal(existsSync(repositoryPath("app/layout.tsx")), false);

  const expectedFiles = [
    "app/(application)/layout.tsx",
    "app/(application)/page.tsx",
    "app/(application)/our-purpose/page.tsx",
    "app/(application)/acceso/[[...sign-in]]/page.tsx",
    "app/(application)/registro/[[...sign-up]]/page.tsx",
    "app/(application)/cuenta/layout.tsx",
    "app/(application)/admin/layout.tsx",
    "app/(application)/api/webhooks/clerk/route.ts",
    "app/(catalog)/[catalog]/layout.tsx",
    "app/(catalog)/[catalog]/page.tsx",
    "app/(catalog)/[catalog]/[area]/page.tsx",
    "app/(catalog)/[catalog]/[area]/[segment]/page.tsx",
    "app/favicon.ico",
    "app/globals.css",
    "app/robots.ts",
    "app/sitemap.ts",
  ];

  for (const relativePath of expectedFiles) {
    assert.equal(existsSync(repositoryPath(relativePath)), true, relativePath);
  }

  const retiredRouteFiles = [
    "app/page.tsx",
    "app/acceso/[[...sign-in]]/page.tsx",
    "app/registro/[[...sign-up]]/page.tsx",
    "app/cuenta/page.tsx",
    "app/admin/page.tsx",
    "app/api/webhooks/clerk/route.ts",
    "app/[catalog]/page.tsx",
    "app/[catalog]/[area]/page.tsx",
    "app/[catalog]/[area]/[segment]/page.tsx",
  ];

  for (const relativePath of retiredRouteFiles) {
    assert.equal(existsSync(repositoryPath(relativePath)), false, relativePath);
  }
});

test("the shared server shell owns fonts, Clerk, the header and the footer once", () => {
  const shell = readRepositoryFile("app/_components/site-root-shell.tsx");
  const applicationRoot = readRepositoryFile("app/(application)/layout.tsx");
  const catalogRoot = readRepositoryFile("app/(catalog)/[catalog]/layout.tsx");

  assert.match(shell, /<html lang=\{htmlLang\}/);
  assert.match(shell, /ClerkProvider/);
  assert.match(shell, /Fraunces/);
  assert.match(shell, /Roboto/);
  assert.match(shell, /className="site-header"/);
  assert.match(shell, /className="site-footer"/);
  assert.match(shell, /aria-label=\{footerMessages\.navigation\}/);
  assert.match(
    shell,
    /href="\/our-purpose">\{footerMessages\.aboutLink\}<\/Link>/,
  );
  assert.match(shell, /\{footerMessages\.catalogLink\}/);
  assert.match(shell, /\{footerMessages\.contactLink\}/);
  assert.doesNotMatch(shell, /site-footer__copyright/);
  assert.match(shell, /const localizedTagline = headerMessages\.tagline/);
  assert.match(shell, /site-header__tagline">\{localizedTagline\}/);
  assert.match(shell, /import "\.\.\/globals\.css"/);

  for (const rootLayout of [applicationRoot, catalogRoot]) {
    assert.doesNotMatch(
      rootLayout,
      /ClerkProvider|next\/font|className="site-(?:header|footer)"/,
    );
    assert.match(rootLayout, /footerMessages=\{messages\.siteFooter\}/);
  }

  assert.match(applicationRoot, /htmlLang="en"/);
});

test("the catalog root derives document language only from the async URL scope", () => {
  const catalogRoot = readRepositoryFile("app/(catalog)/[catalog]/layout.tsx");

  assert.match(catalogRoot, /params: Promise<\{ catalog: string \}>/);
  assert.match(catalogRoot, /const \{ catalog \} = await params/);
  assert.match(catalogRoot, /parseCatalogScope\(catalog, listCountries\(\)\)/);
  assert.match(catalogRoot, /scope\?\.htmlLang \?\? "en"/);
  assert.doesNotMatch(
    catalogRoot,
    /accept-language|Accept-Language|cookies\(|headers\(|EXPLICIT_LOCALE_COOKIE/,
  );

  const countries = [
    { slug: "es", defaultLocale: "es" as const },
    { slug: "de", defaultLocale: "de" as const },
    { slug: "jp", defaultLocale: "ja" as const },
  ];
  const samples = [
    ["es", "es"],
    ["ca-es", "ca"],
    ["en-es", "en"],
    ["de", "de"],
    ["ja-jp", "ja"],
  ] as const;

  for (const [segment, expectedHtmlLang] of samples) {
    assert.equal(parseCatalogScope(segment, countries)?.htmlLang, expectedHtmlLang);
  }

  assert.equal(parseCatalogScope("xx-es", countries), null);
  assert.equal(parseCatalogScope("es-zz", countries), null);
});
