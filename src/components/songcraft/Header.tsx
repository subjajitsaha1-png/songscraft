import { LogOut, Music2 } from "lucide-react";

export function Header({
  email,
  onSignOut,
}: {
  email?: string | undefined;
  onSignOut: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-gradient flex items-center justify-center">
          <Music2 size={18} className="text-primary-foreground" />
        </div>
        <span className="font-bold text-lg tracking-tight">Songcraft</span>
      </div>
      {email && (
        <button
          onClick={onSignOut}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut size={14} />
          {email}
        </button>
      )}
    </header>
  );
}
