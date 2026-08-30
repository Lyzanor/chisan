import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readRepositoryFile(path: string) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("catalog views register their language routes only in the account menu", () => {
  const accountMenu = readRepositoryFile(
    "components/account/site-account-nav.tsx",
  );
  const registration = readRepositoryFile(
    "components/language-menu-registration.tsx",
  );
  const area = readRepositoryFile("components/area-explorer.tsx");
  const country = readRepositoryFile("app/(catalog)/[catalog]/page.tsx");
  const producer = readRepositoryFile(
    "app/(catalog)/[catalog]/[area]/[segment]/page.tsx",
  );
  const styles = readRepositoryFile("app/globals.css");

  assert.match(accountMenu, /useLanguageMenu\(\)/);
  assert.match(accountMenu, /rememberExplicitLocale\(locale\)/);
  assert.match(accountMenu, /<select/);
  assert.match(registration, /useRegisterLanguageMenu/);

  for (const view of [area, country, producer]) {
    assert.match(view, /<LanguageMenuRegistration/);
    assert.doesNotMatch(view, /LanguageSwitcher|language-switcher/);
  }

  assert.doesNotMatch(styles, /\.language-switcher/);
});
