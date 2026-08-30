import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const startGeneration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ songId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const { buildPrompt } = await import("./songs.server");
    const token = process.env["REPLICATE_API_TOKEN"];
    const version = process.env["REPLICATE_MODEL_VERSION"];
    const webhookBase = process.env["PUBLIC_APP_URL"];

    const { data: song, error } = await context.supabase
      .from("songs")
      .select("*")
      .eq("id", data.songId)
      .single();

    if (error || !song) throw new Error("Song not found");

    if (!token || !version) {
      await context.supabase
        .from("songs")
        .update({
          status: "failed",
          error_message:
            "Music generation isn't connected yet. Add a Replicate API token and model version to enable it.",
        })
        .eq("id", song.id);
      return { started: false as const };
    }

    const body: Record<string, unknown> = {
      version,
      input: {
        prompt: buildPrompt(song),
        lyrics: song.lyrics ?? "",
        duration: song.duration_seconds ?? 120,
      },
    };
    if (webhookBase) {
      body["webhook"] = `${webhookBase.replace(/\/$/, "")}/api/public/replicate-webhook`;
      body["webhook_events_filter"] = ["completed"];
    }

    const res = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload = (await res.json()) as { id?: string; detail?: string };

    if (!res.ok || !payload.id) {
      await context.supabase
        .from("songs")
        .update({ status: "failed", error_message: payload.detail ?? "Provider rejected the request" })
        .eq("id", song.id);
      return { started: false as const };
    }

    await context.supabase
      .from("songs")
      .update({ status: "processing", provider_job_id: payload.id })
      .eq("id", song.id);

    return { started: true as const };
  });
