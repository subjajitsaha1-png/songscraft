import { LogOut } from "lucide-react";
import { AppMark } from "./AppMark";

export function Header({
  email,
  onSignOut,
}: {
  email?: string | undefined;
  onSignOut: () => void;
}) {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center">
          <AppMark className="text-base" />
        </div>
        <span className="font-display font-semibold text-lg tracking-tight">Songcraft</span>
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
