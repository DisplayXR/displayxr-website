import type { Channel } from "./types";

const URL_RE = /\bhttps?:\/\/[^\s]+|\b(?:[a-z0-9-]+\.)+(?:com|org|net|io|dev|ai|co|app|gg|xyz)(?:\/[^\s]*)?/gi;

// Grapheme count (emoji and accents count once), with X's rule that every link
// counts as 23 characters. Close to, not identical to, each platform's counter.
export function countFor(channel: Channel, text: string): number {
  const seg = typeof Intl !== "undefined" && "Segmenter" in Intl
    ? (s: string) => [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(s)].length
    : (s: string) => [...s].length;
  if (channel !== "x") return seg(text);
  let urls = 0;
  const stripped = text.replace(URL_RE, () => { urls++; return ""; });
  return seg(stripped) + urls * 23;
}
