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
    <div className="card p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center gap-2">
        <ListMusic size={16} className="text-accent" />
        <h2 className="font-semibold">Your library</h2>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!loading && songs.length === 0 && (
        <p className="text-sm text-muted-foreground">No songs yet — create your first one.</p>
      )}

      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            isPlaying={song.id === currentSongId}
            onPlay={onPlay}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
