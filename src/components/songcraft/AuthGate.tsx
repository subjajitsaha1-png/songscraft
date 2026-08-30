import { useState } from "react";
import { AppMark } from "./AppMark";

export function AuthGate({
  onSignIn,
  onSignUp,
  onGoogle,
}: {
  onSignIn: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: { message: string } | null }>;
  onGoogle: () => Promise<unknown>;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    const { error } = mode === "signin" ? await onSignIn(email, password) : await onSignUp(email, password);
    setBusy(false);
    if (error) setError(error.message);
    else if (mode === "signup") setNotice("Account created. You can start creating now.");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="bg-ambient" />

      <div className="relative z-10 w-full max-w-sm animate-fade-in-up">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-secondary border border-border flex items-center justify-center mb-4">
            <AppMark className="text-2xl" live />
          </div>
          <p className="font-mono-ui text-[11px] tracking-[0.2em] uppercase text-accent mb-2">
            AI music studio
          </p>
          <h1 className="font-display text-2xl font-bold mb-1">Songcraft</h1>
          <p className="text-muted-foreground text-sm max-w-[26ch]">
            Turn a prompt into a full song. Sign in to start creating.
          </p>
        </div>

        <div className="card p-6">
          <div className="flex bg-secondary rounded-full p-1 text-sm mb-5 relative">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setNotice(null);
                }}
                className={`relative z-10 flex-1 px-4 py-1.5 rounded-full font-medium transition-colors duration-200 ${
                  mode === m ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {mode === m && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-brand-gradient animate-scale-in" />
                )}
                {m === "signin" ? "Sign in" : "Sign up"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
            />
            <button type="submit" disabled={busy} className="btn-primary w-full">
              {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <button onClick={() => onGoogle()} className="btn-ghost w-full">
            Continue with Google
          </button>

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-4 w-full text-center"
          >
            {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
          </button>

          {error && <p className="text-xs text-destructive mt-3 text-center">{error}</p>}
          {notice && <p className="text-xs text-muted-foreground mt-3 text-center">{notice}</p>}
        </div>
      </div>
    </div>
  );
}
