import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import type { CreateSongInput } from "@/types/song";

const SUGGESTED_TAGS = [
  "pop", "lo-fi", "hip hop", "acoustic", "cinematic", "synthwave",
  "rock", "ballad", "edm", "jazz", "orchestral", "indie",
];

export function CreatePanel({ onCreate }: { onCreate: (input: CreateSongInput) => Promise<unknown> }) {
  const [mode, setMode] = useState<"simple" | "custom">("simple");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [instrumental, setInstrumental] = useState(false);
  const [duration, setDuration] = useState(120);
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) =>
    setTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));

  const submit = async () => {
    if (!prompt.trim() && !tags.length) {
      setError("Describe the song or pick a style tag first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onCreate({
        title,
        prompt,
        lyrics: mode === "custom" ? lyrics : "",
        styleTags: tags,
        instrumental,
        durationSeconds: duration,
      });
      setTitle("");
      setPrompt("");
      setLyrics("");
    } catch (e) {
      setError((e as Error)?.message ?? "Something went wrong starting generation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card card-interactive p-5 flex flex-col gap-4 animate-fade-in-up">
      <span className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-brand-gradient" />

      <div className="flex items-center gap-2 pl-1">
        <Sparkles size={16} className="text-primary" />
        <p className="font-mono-ui text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Create</p>
      </div>
      <h2 className="font-display font-semibold text-lg -mt-2 pl-1">Write your next track</h2>

      <div className="flex bg-secondary rounded-full p-1 text-sm w-fit relative">
        {(["simple", "custom"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`relative z-10 px-4 py-1.5 rounded-full font-medium transition-colors duration-200 ${
              mode === m ? "text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {mode === m && (
              <span className="absolute inset-0 -z-10 rounded-full bg-brand-gradient animate-scale-in" />
            )}
            {m === "simple" ? "Simple" : "Custom lyrics"}
          </button>
        ))}
      </div>

      <input
        placeholder="Song title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="field"
      />

      <textarea
        placeholder="Describe the vibe: e.g. upbeat summer pop song about road trips with friends"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        className="field resize-none"
      />

      {mode === "custom" && (
        <textarea
          placeholder={"Write your own lyrics here...\n[Verse 1]\n...\n[Chorus]\n..."}
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          rows={6}
          className="field resize-none font-mono-ui animate-fade-in-up"
        />
      )}

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`pill text-xs px-3 py-1 border ${
              tags.includes(tag)
                ? "bg-accent/20 border-accent text-foreground"
                : "border-border text-muted-foreground hover:border-accent/50"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={instrumental}
            onChange={(e) => setInstrumental(e.target.checked)}
            className="accent-accent"
          />
          Instrumental only
        </label>
        <label className="flex items-center gap-2 text-muted-foreground">
          <span className="font-mono-ui text-xs">Duration</span>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="field w-auto px-2 py-1 font-mono-ui"
          >
            <option value={60}>1:00</option>
            <option value={120}>2:00</option>
            <option value={180}>3:00</option>
            <option value={240}>4:00</option>
          </select>
        </label>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button
        onClick={submit}
        disabled={submitting}
        className="btn-primary flex items-center justify-center gap-2"
      >
        <Wand2 size={16} className={submitting ? "animate-spin-slow" : ""} />
        {submitting ? "Starting generation..." : "Create song"}
      </button>
    </div>
  );
}
