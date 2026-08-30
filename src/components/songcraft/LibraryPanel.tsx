import { ListMusic } from "lucide-react";
import type { Song } from "@/types/song";
import { SongCard } from "./SongCard";

export function LibraryPanel({
  songs,
  loading,
  currentSongId,
  onPlay,
  onDelete,
}: {
  songs: Song[];
  loading: boolean;
  currentSongId: string | null;
  onPlay: (song: Song) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3 h-full animate-fade-in-up" style={{ animationDelay: "80ms" }}>
      <div className="flex items-center gap-2">
        <ListMusic size={16} className="text-primary" />
        <p className="font-mono-ui text-[11px] tracking-[0.18em] uppercase text-muted-foreground">Library</p>
      </div>
      <h2 className="font-display font-semibold text-lg -mt-2">Your songs</h2>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!loading && songs.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center gap-2 py-12">
          <p className="text-sm text-muted-foreground max-w-[32ch]">
            Nothing here yet — describe a song on the left and it'll show up here while it renders.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {songs.map((song, i) => (
          <div
            key={song.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}
          >
            <SongCard
              song={song}
              isPlaying={song.id === currentSongId}
              onPlay={onPlay}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
