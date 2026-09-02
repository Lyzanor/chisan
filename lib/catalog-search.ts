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
