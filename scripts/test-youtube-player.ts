import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { YoutubePlayer } from "../components/youtube-player";
import {
  youtubePrivacyEmbedUrl,
  youtubeThumbnailUrl,
} from "../lib/youtube";

test("YouTube embeds use a reviewed ID and discard source query data", () => {
  assert.equal(
    youtubePrivacyEmbedUrl(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=test&t=42",
    ),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&playsinline=1",
  );
  assert.equal(
    youtubePrivacyEmbedUrl("https://youtu.be/dQw4w9WgXcQ?si=secret"),
    "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&playsinline=1",
  );
  assert.equal(
    youtubePrivacyEmbedUrl("https://example.org/watch?v=dQw4w9WgXcQ"),
    null,
  );
});

test("YouTube thumbnails use only the reviewed video ID", () => {
  assert.equal(
    youtubeThumbnailUrl(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ&utm_source=test&t=42",
    ),
    "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  );
  assert.equal(
    youtubeThumbnailUrl(
      "https://youtu.be/dQw4w9WgXcQ?si=secret",
      "hqdefault",
    ),
    "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
  );
});

test("the server-rendered player includes a thumbnail but no iframe", () => {
  const html = renderToStaticMarkup(
    createElement(YoutubePlayer, {
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      label: "Vídeo",
      locale: "es",
    }),
  );
  assert.match(html, /Reproducir vídeo/);
  assert.match(html, /La miniatura procede de YouTube/);
  assert.match(
    html,
    /https:\/\/i\.ytimg\.com\/vi\/dQw4w9WgXcQ\/maxresdefault\.jpg/,
  );
  assert.match(
    html,
    /href="https:\/\/www\.youtube\.com\/watch\?v=dQw4w9WgXcQ"/,
  );
  assert.doesNotMatch(html, /<iframe|youtube-nocookie|utm_source/);
  assert.match(html, /aria-label="Reproducir vídeo: Vídeo"/);
});
