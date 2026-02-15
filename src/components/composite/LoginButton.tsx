import { LogIn, LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/domain";

interface LoginButtonProps {
  user: User | null;
  isAnonymous: boolean;
  onGoogleLogin: () => void;
  onLogout: () => void;
}

export function LoginButton({ user, isAnonymous, onGoogleLogin, onLogout }: LoginButtonProps) {
  if (!user) return null;

  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
          aria-label="User menu"
        >
          {isAnonymous ? (
            <>
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Anonymous</span>
            </>
          ) : (
            <>
              <Avatar className="h-5 w-5">
                {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.displayName ?? "User"} />}
                <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline max-w-[120px] truncate">
                {user.displayName ?? user.email}
              </span>
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-3 py-2">
          <p className="text-xs font-medium text-foreground">
            {isAnonymous ? "Anonymous User" : user.displayName ?? "User"}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator />

        {isAnonymous ? (
          <DropdownMenuItem onClick={onGoogleLogin} className="cursor-pointer">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
