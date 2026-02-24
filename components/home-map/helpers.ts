import { useEffect, useState } from "react";

type CategoryGlyphRule = {
  pattern: RegExp;
  glyph: string;
};

const CATEGORY_GLYPHS: CategoryGlyphRule[] = [
  { pattern: /vino|bodega/i, glyph: "🍷" },
  { pattern: /ques/i, glyph: "🧀" },
  { pattern: /pan|boll|horno|pastel/i, glyph: "🥖" },
  { pattern: /miel/i, glyph: "🍯" },
  { pattern: /cerve/i, glyph: "🍺" },
  { pattern: /fruta|verdura|hort|agric/i, glyph: "🥕" },
  { pattern: /aceite|oliva/i, glyph: "🫒" },
  { pattern: /charcut|carne|embut/i, glyph: "🥩" },
  { pattern: /pescado|marisc/i, glyph: "🐟" },
  { pattern: /cafe|té|te/i, glyph: "☕" },
];

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [delayMs, value]);

  return debouncedValue;
}

export function normalizeLookup(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

export function inferExactMatch(query: string, collection: Array<{ value: string }>): string {
  const normalizedQuery = normalizeLookup(query);
  if (!normalizedQuery) return "";

  const found = collection.find((item) => normalizeLookup(item.value) === normalizedQuery);
  return found?.value ?? "";
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function getCategoryGlyph(value: string | null | undefined): string {
  if (!value) {
    return "🧺";
  }

  for (const rule of CATEGORY_GLYPHS) {
    if (rule.pattern.test(value)) {
      return rule.glyph;
    }
  }

  return "🧺";
}
