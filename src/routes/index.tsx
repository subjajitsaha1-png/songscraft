import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useSongs } from "@/hooks/useSongs";
import { AuthGate } from "@/components/songcraft/AuthGate";
import { Header } from "@/components/songcraft/Header";
import { CreatePanel } from "@/components/songcraft/CreatePanel";
import { LibraryPanel } from "@/components/songcraft/LibraryPanel";
import { PlaybackBar } from "@/components/songcraft/PlaybackBar";
import type { Song } from "@/types/song";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Songcraft — Turn ideas into songs" },
      {
        name: "description",
        content:
          "Songcraft turns a prompt or your own lyrics into full songs, with a personal library and instant playback.",
      },
      { property: "og:title", content: "Songcraft — Turn ideas into songs" },
      {
        property: "og:description",
        content: "Describe a vibe, pick a style, and generate a song you can play and keep.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, ready, signIn, signUp, signInWithGoogle, signOut } = useAuth();
  const { songs, loading, createSong, deleteSong } = useSongs(user?.id ?? null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);

  if (!ready) return null;

  if (!user) {
    return <AuthGate onSignIn={signIn} onSignUp={signUp} onGoogle={signInWithGoogle} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header email={user.email ?? undefined} onSignOut={signOut} />

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 p-4 overflow-hidden">
        <CreatePanel onCreate={createSong} />
        <LibraryPanel
          songs={songs}
          loading={loading}
          currentSongId={currentSong?.id ?? null}
          onPlay={setCurrentSong}
          onDelete={deleteSong}
        />
      </main>

      <PlaybackBar song={currentSong} />
    </div>
  );
}
