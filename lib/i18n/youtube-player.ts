import type { Locale } from "./locales";

const en = {
  play: "Play video",
  notice:
    "The thumbnail comes from YouTube. The player loads only after you press play.",
  external: "Open on YouTube",
};

type Labels = typeof en;

const es: Labels = {
  play: "Reproducir vídeo",
  notice:
    "La miniatura procede de YouTube. El reproductor solo se carga al pulsar reproducir.",
  external: "Abrir en YouTube",
};

const ca: Labels = {
  play: "Reproduir vídeo",
  notice:
    "La miniatura prové de YouTube. El reproductor només es carrega en prémer reproduir.",
  external: "Obrir a YouTube",
};

export function getYoutubePlayerLabels(locale: Locale): Labels {
  return locale === "es" ? es : locale === "ca" ? ca : en;
}
