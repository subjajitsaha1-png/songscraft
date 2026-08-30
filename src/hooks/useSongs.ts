import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startGeneration } from "@/lib/songs.functions";
import type { CreateSongInput, Song } from "@/types/song";

export function useSongs(userId: string | null) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) setSongs(data as unknown as Song[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
    if (!userId) return;

    const channel = supabase
      .channel("songs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "songs", filter: `user_id=eq.${userId}` },
        () => refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, refresh]);

  const createSong = useCallback(
    async (input: CreateSongInput) => {
      if (!userId) throw new Error("Not signed in");

      const { data: inserted, error: insertError } = await supabase
        .from("songs")
        .insert({
          user_id: userId,
          title: input.title || "Untitled",
          prompt: input.prompt,
          lyrics: input.lyrics || null,
          style_tags: input.styleTags,
          instrumental: input.instrumental,
          duration_seconds: input.durationSeconds,
          status: "pending",
        })
        .select()
        .single();

      if (insertError || !inserted) throw insertError;

      try {
        await startGeneration({ data: { songId: inserted.id } });
      } catch (e) {
        await supabase
          .from("songs")
          .update({ status: "failed", error_message: (e as Error).message })
          .eq("id", inserted.id);
      }

      await refresh();
      return inserted as unknown as Song;
    },
    [userId, refresh],
  );

  const deleteSong = useCallback(
    async (id: string) => {
      await supabase.from("songs").delete().eq("id", id);
      await refresh();
    },
    [refresh],
  );

  return { songs, loading, createSong, deleteSong, refresh };
}
