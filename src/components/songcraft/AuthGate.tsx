import { useState } from "react";
import { Music2 } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-sm p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-brand-gradient flex items-center justify-center mx-auto mb-4">
          <Music2 size={24} className="text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold mb-1">Songcraft</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Turn ideas into songs. Sign in to start creating.
        </p>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field w-full"
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field w-full"
          />
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button onClick={() => onGoogle()} className="btn-ghost w-full mt-3">
          Continue with Google
        </button>

        <button
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="text-xs text-muted-foreground hover:text-foreground mt-4"
        >
          {mode === "signin" ? "No account? Sign up" : "Already have an account? Sign in"}
        </button>

        {error && <p className="text-xs text-destructive mt-3">{error}</p>}
        {notice && <p className="text-xs text-muted-foreground mt-3">{notice}</p>}
      </div>
    </div>
  );
}
