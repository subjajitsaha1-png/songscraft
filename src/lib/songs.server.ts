import type { Song } from "@/types/song";

export function buildPrompt(song: Pick<Song, "prompt" | "style_tags" | "instrumental">) {
  const tags = song.style_tags.join(", ");
  const parts = [song.prompt.trim(), tags && `Style: ${tags}`, song.instrumental && "Instrumental only, no vocals"];
  return parts.filter(Boolean).join(". ");
}

export function extractAudioUrl(output: unknown): string | null {
  if (typeof output === "string") return output;
  if (Array.isArray(output)) return typeof output[0] === "string" ? output[0] : null;
  if (output && typeof output === "object") {
    const o = output as Record<string, unknown>;
    const candidate = o["audio"] ?? o["audio_url"];
    return typeof candidate === "string" ? candidate : null;
  }
  return null;
}
