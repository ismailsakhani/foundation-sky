import { useState, useEffect, useCallback } from "react";
import { authService } from "@/services/authService";
import type { User } from "@/types/domain";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auto-login: restore from storage or create anonymous
  useEffect(() => {
    const existing = authService.getCurrentUser();
    if (existing) {
      setUser(existing);
    } else {
      setUser(authService.loginAnonymous());
    }
    setIsLoading(false);
  }, []);

  const loginWithGoogle = useCallback((credential: string) => {
    try {
      const googleUser = authService.loginWithGoogle(credential);
      setUser(googleUser);
    } catch (err) {
      console.error("[Auth] Google login failed:", err);
    }
  }, []);

  const logout = useCallback(() => {
    const anonUser = authService.logout();
    setUser(anonUser);
  }, []);

  return {
    user,
    isLoading,
    isAnonymous: !user || user.provider === "anonymous",
    loginWithGoogle,
    logout,
  };
}
