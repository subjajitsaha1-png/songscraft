import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/replicate-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { extractAudioUrl } = await import("@/lib/songs.server");
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const payload = (await request.json()) as {
          id?: string;
          status?: string;
          output?: unknown;
          error?: string;
        };

        if (!payload.id) return Response.json({ ok: true });

        const { data: song } = await supabaseAdmin
          .from("songs")
          .select("*")
          .eq("provider_job_id", payload.id)
          .single();

        if (!song) return Response.json({ ok: true });

        if (payload.status === "failed" || payload.status === "canceled") {
          await supabaseAdmin
            .from("songs")
            .update({ status: "failed", error_message: payload.error ?? "Generation failed" })
            .eq("id", song.id);
          return Response.json({ ok: true });
        }

        if (payload.status !== "succeeded") return Response.json({ ok: true });

        const audioUrl = extractAudioUrl(payload.output);
        if (!audioUrl) {
          await supabaseAdmin
            .from("songs")
            .update({ status: "failed", error_message: "No audio in provider output" })
            .eq("id", song.id);
          return Response.json({ ok: true });
        }

        const audio = await fetch(audioUrl).then((r) => r.arrayBuffer());
        const path = `${song.user_id}/${song.id}.mp3`;
        await supabaseAdmin.storage
          .from("songs")
          .upload(path, audio, { contentType: "audio/mpeg", upsert: true });

        await supabaseAdmin
          .from("songs")
          .update({ status: "completed", audio_url: path })
          .eq("id", song.id);

        return Response.json({ ok: true });
      },
    },
  },
});
