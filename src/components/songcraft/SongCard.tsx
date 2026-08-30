import { AlertCircle, Play, Trash2 } from "lucide-react";
import type { Song } from "@/types/song";
import { AppMark } from "./AppMark";

export function SongCard({
  song,
  isPlaying,
  onPlay,
  onDelete,
}: {
  song: Song;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={`card card-interactive p-3 flex items-center gap-3 group ${
        isPlaying ? "border-accent" : ""
      }`}
    >
      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden shrink-0">
        {song.cover_url ? (
          <img src={song.cover_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <AppMark live={isPlaying || song.status === "processing"} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{song.title}</p>
        <p className="text-xs text-muted-foreground truncate font-mono-ui">
          {song.style_tags.join(", ") || song.prompt}
        </p>
      </div>

      {song.status === "completed" && song.audio_url && (
        <button
          onClick={() => onPlay(song)}
          className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shrink-0 transition-transform hover:scale-105 active:scale-95"
        >
          <Play size={14} className="text-[#17111f]" fill="currentColor" />
        </button>
      )}

      {(song.status === "pending" || song.status === "processing") && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0 font-mono-ui">
          <AppMark live={song.status === "processing"} className="text-sm" />
          {song.status === "pending" ? "Queued" : "Generating"}
        </div>
      )}

      {song.status === "failed" && (
        <div
          className="flex items-center gap-1.5 text-xs text-destructive shrink-0 font-mono-ui"
          title={song.error_message ?? ""}
        >
          <AlertCircle size={14} />
          Failed
        </div>
      )}

      <button
        onClick={() => onDelete(song.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
