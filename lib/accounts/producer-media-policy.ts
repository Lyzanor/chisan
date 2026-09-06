// Shared browser/server limits for the private proposal inbox, not the public catalog.
export const PRODUCER_MEDIA_LIMITS = {
  inputBytes: 3 * 1024 * 1024,
  preparedBytes: 512 * 1024,
  pixels: 24_000_000,
  edge: 1600,
  images: 20,
  inbox: 60,
  uploadsPerDay: 30,
} as const;

export type PreparedMediaReference = {
  uploadId: string;
  sha256: string;
  width: number;
  height: number;
};

export function preparedMediaSrc(
  country: string,
  producerId: number,
  sha256: string,
) {
  return `/productores/${country}/content/${producerId}/${sha256}.webp`;
}

export function privateMediaSrc(uploadId: string) {
  return `/api/producer-media/${uploadId}`;
}
