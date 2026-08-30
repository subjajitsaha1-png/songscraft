import type { Song } from "@/types/song";

const LANGUAGE_LABELS: Record<string, string> = {
  hindi: "Hindi",
  punjabi: "Punjabi",
  tamil: "Tamil",
  telugu: "Telugu",
  bengali: "Bengali",
  marathi: "Marathi",
  gujarati: "Gujarati",
  kannada: "Kannada",
  malayalam: "Malayalam",
  urdu: "Urdu",
  "hinglish": "Hinglish (Hindi-English mix)",
  english: "English",
};

export function buildPrompt(
  song: Pick<Song, "prompt" | "style_tags" | "instrumental" | "language">,
) {
  const tags = song.style_tags.join(", ");
  const language = LANGUAGE_LABELS[song.language] ?? song.language;
  const parts = [
    song.prompt.trim(),
    tags && `Style: ${tags}`,
    // ACE-Step reads language mainly from the lyrics script and this cue —
    // spelling it out here measurably helps steer instrumentation and vocal
    // delivery toward the requested Indian language/style even when the
    // style tags alone wouldn't disambiguate it (e.g. "pop" in Tamil vs Hindi).
    `Sung in ${language}`,
    song.instrumental && "Instrumental only, no vocals",
  ];
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
