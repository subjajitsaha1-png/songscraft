export type SongStatus = "pending" | "processing" | "completed" | "failed";

export interface Song {
  id: string;
  user_id: string;
  title: string;
  prompt: string;
  lyrics: string | null;
  style_tags: string[];
  instrumental: boolean;
  duration_seconds: number | null;
  status: SongStatus;
  audio_url: string | null;
  cover_url: string | null;
  provider_job_id: string | null;
  error_message: string | null;
  created_at: string;
}

export interface CreateSongInput {
  title: string;
  prompt: string;
  lyrics: string;
  styleTags: string[];
  instrumental: boolean;
  durationSeconds: number;
}
