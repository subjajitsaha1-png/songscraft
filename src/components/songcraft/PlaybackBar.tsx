import { useEffect, useRef, useState } from "react";
import { Pause, Play, Music2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Song } from "@/types/song";

export function PlaybackBar({ song }: { song: Song | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      if (!song?.audio_url) return setSrc(undefined);
      if (/^https?:\/\//.test(song.audio_url)) return setSrc(song.audio_url);
      const { data } = await supabase.storage.from("songs").createSignedUrl(song.audio_url, 3600);
      if (!cancelled) setSrc(data?.signedUrl);
    };
    resolve();
    return () => {
      cancelled = true;
    };
  }, [song?.id, song?.audio_url]);

  useEffect(() => {
    if (!audioRef.current || !src) return;
    audioRef.current.play().catch(() => {});
    setPlaying(true);
  }, [src]);

  if (!song) {
    return (
      <div className="border-t border-border px-6 py-3 flex items-center gap-3 text-muted-foreground text-sm">
        <Music2 size={16} />
        Nothing playing yet
      </div>
    );
  }

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying(!playing);
  };

  return (
    <div className="border-t border-border px-6 py-3 flex items-center gap-4">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          setProgress(el.duration ? (el.currentTime / el.duration) * 100 : 0);
        }}
        onEnded={() => setPlaying(false)}
      />
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center shrink-0"
      >
        {playing ? (
          <Pause size={14} className="text-primary-foreground" fill="currentColor" />
        ) : (
          <Play size={14} className="text-primary-foreground" fill="currentColor" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{song.title}</p>
        <div className="w-full h-1 bg-secondary rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-brand-gradient" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
