import assert from "node:assert/strict";
import test from "node:test";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { LanguageSwitcher } from "../components/language-switcher";

type ElementProps = Record<string, unknown> & { children?: ReactNode };

function collectInteractiveLinks(node: ReactNode): ReactElement<ElementProps>[] {
  if (!isValidElement<ElementProps>(node)) return [];

  const own =
    typeof node.props.href === "string" && typeof node.props.onClick === "function"
      ? [node]
      : [];
  return [
    ...own,
    ...Children.toArray(node.props.children).flatMap(collectInteractiveLinks),
  ];
}

function restoreGlobal(name: "window" | "document", descriptor?: PropertyDescriptor) {
  if (descriptor) {
    Object.defineProperty(globalThis, name, descriptor);
  } else {
    Reflect.deleteProperty(globalThis, name);
  }
}

test("language switcher uses territorial hreflang and stores an explicit click preference", () => {
  const rendered = LanguageSwitcher({
    currentLocale: "es",
    label: "Idioma",
    options: [
      {
        locale: "es",
        label: "Español",
        href: "/es/barcelona?category=Aceite&highlight=productor",
      },
      {
        locale: "ca",
        label: "Català",
        href: "/ca-es/barcelona?category=Aceite&highlight=productor",
      },
    ],
  });
  const links = collectInteractiveLinks(rendered);
  assert.equal(links.length, 2);

  const spanish = links.find(
    ({ props }) => props.href === "/es/barcelona?category=Aceite&highlight=productor",
  );
  const catalan = links.find(
    ({ props }) => props.href === "/ca-es/barcelona?category=Aceite&highlight=productor",
  );
  assert.ok(spanish);
  assert.ok(catalan);
  assert.equal(spanish.props.hrefLang, "es-ES");
  assert.equal(spanish.props.lang, "es");
  assert.equal(spanish.props["aria-current"], "page");
  assert.equal(catalan.props.hrefLang, "ca-ES");
  assert.equal(catalan.props.lang, "ca");
  assert.equal(catalan.props["aria-current"], undefined);

  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const previousDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
  let cookie = "";
  const fakeDocument = {};
  Object.defineProperty(fakeDocument, "cookie", {
    configurable: true,
    get: () => cookie,
    set: (value: string) => {
      cookie = value;
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { location: { protocol: "https:" } },
  });
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: fakeDocument,
  });

  try {
    const onClick = catalan.props.onClick;
    assert.equal(typeof onClick, "function");
    (onClick as () => void)();
    assert.equal(
      cookie,
      "chisan_locale=ca; Path=/; Max-Age=31536000; SameSite=Lax; Secure",
    );
  } finally {
    restoreGlobal("window", previousWindow);
    restoreGlobal("document", previousDocument);
  }
});

test("language switcher stays absent when there is no alternate", () => {
  assert.equal(
    LanguageSwitcher({
      currentLocale: "es",
      label: "Idioma",
      options: [{ locale: "es", label: "Español", href: "/es" }],
    }),
    null,
  );
});
