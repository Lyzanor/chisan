import { encode } from "uqr";

import { PROFILE_QR_MARK_SIZE } from "@/lib/brand";

/** The supplied C covers the same share of the code as in earlier labels. */
export const BRAND_QR_MARK_RATIO = PROFILE_QR_MARK_SIZE / 880;

const FINDER_SIZE = 7;
/** Space between the finder's C and its detached square, in modules. */
const FINDER_GAP = 0.28;

export type BrandQr = Readonly<{
  /** Modules per side, without a quiet zone; the caller supplies the margin. */
  size: number;
  /** Data modules as square cells in one path, for SVG `d` or `Path2D`. */
  modulesPath: string;
  /** The three finder patterns drawn as the Chisan C with its detached square. */
  findersPath: string;
  /** Excavated centre where the supplied C is painted. */
  mark: Readonly<{ offset: number; size: number }>;
}>;

function roundedSquare(x: number, y: number, size: number, radius: number): string {
  const end = x + size;
  const bottom = y + size;
  return [
    `M${x + radius} ${y}H${end - radius}`,
    `A${radius} ${radius} 0 0 1 ${end} ${y + radius}V${bottom - radius}`,
    `A${radius} ${radius} 0 0 1 ${end - radius} ${bottom}H${x + radius}`,
    `A${radius} ${radius} 0 0 1 ${x} ${bottom - radius}V${y + radius}`,
    `A${radius} ${radius} 0 0 1 ${x + radius} ${y}Z`,
  ].join("");
}

/**
 * One 7×7 finder: a one-module ring opened at the upper right like the logo's
 * C, the detached square in that opening and the 3×3 centre. Scanners read the
 * same dark/light proportions as a standard finder.
 */
function finderPath(x: number, y: number): string {
  const outer = 1.4;
  const inner = 0.5;
  const ring = [
    `M${x + outer} ${y}H${x + 5 - FINDER_GAP}V${y + 1}H${x + 1 + inner}`,
    `A${inner} ${inner} 0 0 0 ${x + 1} ${y + 1 + inner}V${y + 6 - inner}`,
    `A${inner} ${inner} 0 0 0 ${x + 1 + inner} ${y + 6}H${x + 6 - inner}`,
    `A${inner} ${inner} 0 0 0 ${x + 6} ${y + 6 - inner}V${y + 2 + FINDER_GAP}H${x + 7}`,
    `V${y + 7 - outer}A${outer} ${outer} 0 0 1 ${x + 7 - outer} ${y + 7}H${x + outer}`,
    `A${outer} ${outer} 0 0 1 ${x} ${y + 7 - outer}V${y + outer}`,
    `A${outer} ${outer} 0 0 1 ${x + outer} ${y}Z`,
  ].join("");
  return ring + roundedSquare(x + 5, y, 2, 0.45) + roundedSquare(x + 2, y + 2, 3, 0.6);
}

function inFinder(x: number, y: number, size: number): boolean {
  const left = x < FINDER_SIZE;
  const top = y < FINDER_SIZE;
  return (left && top) || (x >= size - FINDER_SIZE && top) || (left && y >= size - FINDER_SIZE);
}

/** High error correction leaves room for the centre mark and the C finders. */
export function buildBrandQr(value: string): BrandQr {
  const { data, size } = encode(value, { ecc: "H", border: 0 });
  const markSize = size * BRAND_QR_MARK_RATIO;
  const markOffset = (size - markSize) / 2;
  const clearFrom = Math.floor(markOffset);
  const clearTo = Math.ceil(markOffset + markSize);
  const cells: string[] = [];

  data.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (!dark || inFinder(x, y, size)) return;
      if (x >= clearFrom && x < clearTo && y >= clearFrom && y < clearTo) return;
      cells.push(`M${x} ${y}h1v1h-1z`);
    });
  });

  return {
    size,
    modulesPath: cells.join(""),
    findersPath: [
      finderPath(0, 0),
      finderPath(size - FINDER_SIZE, 0),
      finderPath(0, size - FINDER_SIZE),
    ].join(""),
    mark: { offset: markOffset, size: markSize },
  };
}
