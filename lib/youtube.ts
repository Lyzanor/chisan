const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

function matchesYouTubeHost(hostname: string, expected: string): boolean {
  const normalized = hostname.toLowerCase().replace(/\.$/, "");
  return normalized === expected || normalized.endsWith(`.${expected}`);
}

export function youtubeVideoId(value: string): string | null {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;

  let candidate = "";
  if (matchesYouTubeHost(url.hostname, "youtu.be")) {
    candidate = url.pathname.split("/").filter(Boolean)[0] ?? "";
  } else if (
    matchesYouTubeHost(url.hostname, "youtube.com") ||
    matchesYouTubeHost(url.hostname, "youtube-nocookie.com")
  ) {
    const segments = url.pathname.split("/").filter(Boolean);
    if (url.pathname === "/watch") candidate = url.searchParams.get("v") ?? "";
    else if (["embed", "live", "shorts"].includes(segments[0] ?? "")) {
      candidate = segments[1] ?? "";
    }
  }

  return YOUTUBE_VIDEO_ID_PATTERN.test(candidate) ? candidate : null;
}

export function isYouTubeVideoUrl(value: string): boolean {
  return youtubeVideoId(value) !== null;
}
