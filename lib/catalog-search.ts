const SEARCH_CHARACTER = /[\p{L}\p{N}]/u;
const DIACRITIC = /\p{Diacritic}/gu;

export type CatalogSearchMatch = Readonly<{
  start: number;
  end: number;
}>;

type NormalizedCatalogText = Readonly<{
  value: string;
  starts: number[];
  ends: number[];
}>;

function normalizeCatalogTextWithOffsets(value: string): NormalizedCatalogText {
  const characters: string[] = [];
  const starts: number[] = [];
  const ends: number[] = [];
  let previousWasSeparator = true;

  for (let start = 0; start < value.length; ) {
    const codePoint = value.codePointAt(start);
    if (codePoint === undefined) break;

    const sourceCharacter = String.fromCodePoint(codePoint);
    const end = start + sourceCharacter.length;
    const folded = sourceCharacter
      .normalize("NFD")
      .replace(DIACRITIC, "")
      .toLocaleLowerCase();

    if (!folded && /\p{Diacritic}/u.test(sourceCharacter) && ends.length) {
      ends[ends.length - 1] = end;
    }

    for (const character of folded) {
      if (SEARCH_CHARACTER.test(character)) {
        characters.push(character);
        starts.push(start);
        ends.push(end);
        previousWasSeparator = false;
      } else if (!previousWasSeparator) {
        characters.push(" ");
        starts.push(start);
        ends.push(end);
        previousWasSeparator = true;
      }
    }

    start = end;
  }

  if (characters.at(-1) === " ") {
    characters.pop();
    starts.pop();
    ends.pop();
  }

  return { value: characters.join(""), starts, ends };
}

export function normalizeCatalogSearch(value: string): string {
  return normalizeCatalogTextWithOffsets(value).value;
}

export function findCatalogSearchMatch(
  text: string,
  query: string,
): CatalogSearchMatch | null {
  const normalizedQuery = normalizeCatalogSearch(query);
  if (!normalizedQuery) return null;

  const normalizedText = normalizeCatalogTextWithOffsets(text);
  const matchStart = normalizedText.value.indexOf(normalizedQuery);
  if (matchStart < 0) return null;

  const matchEnd = matchStart + normalizedQuery.length - 1;
  const start = normalizedText.starts[matchStart];
  const end = normalizedText.ends[matchEnd];
  return start === undefined || end === undefined ? null : { start, end };
}

/** Only approved public base text; no expanded products or private fields. */
export type CatalogSearchFields = {
  name: string;
  municipality: string;
  categories: readonly string[];
  featuredProducts: string;
  description: string;
};

export function buildCatalogSearchDocument(fields: CatalogSearchFields) {
  return [
    { text: fields.name, weight: 8 },
    { text: fields.featuredProducts, weight: 6 },
    { text: fields.municipality, weight: 4 },
    ...fields.categories.map((text) => ({ text, weight: 4 })),
    { text: fields.description, weight: 1 },
  ].map(({ text, weight }) => ({ text: normalizeCatalogSearch(text), weight }));
}

export type CatalogSearchDocument = ReturnType<typeof buildCatalogSearchDocument>;

/** Literal, accent-insensitive terms. No stemming, synonyms or fuzzy matching. */
export function rankCatalogEntries<T extends {
  country: string;
  producerId: number;
  search: CatalogSearchDocument;
}>(entries: readonly T[], query: string): T[] {
  const phrase = normalizeCatalogSearch(query);
  if (!phrase) return query.trim() ? [] : [...entries];
  const terms = [...new Set(phrase.split(" "))];
  return entries.flatMap((entry) => {
    let score = 0;
    for (const term of terms) {
      const weight = Math.max(0, ...entry.search.map((field) =>
        field.text.includes(term) ? field.weight : 0,
      ));
      if (!weight) return [];
      score += weight;
    }
    // Reward a complete phrase, particularly an exact producer name.
    score += Math.max(0, ...entry.search.map((field) =>
      field.text === phrase ? field.weight * 4 : field.text.includes(phrase) ? field.weight * 2 : 0,
    ));
    return [{ entry, score }];
  }).sort((a, b) => b.score - a.score ||
    a.entry.country.localeCompare(b.entry.country) || a.entry.producerId - b.entry.producerId,
  ).map(({ entry }) => entry);
}

export function catalogDescriptionPreview(text: string, query = "", limit = 120): string {
  const firstMatch = query.split(/\s+/u).map((term) => findCatalogSearchMatch(text, term))
    .find((match) => match !== null);
  const start = firstMatch && firstMatch.start >= limit ? Math.max(0, firstMatch.start - 30) : 0;
  const characters = Array.from(text.slice(start));
  return `${start ? "…" : ""}${characters.slice(0, limit).join("").trim()}${characters.length > limit ? "…" : ""}`;
}
