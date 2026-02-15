import type { User } from "@/types/domain";

const STORAGE_KEY = "flightops_user";

function generateAnonId(): string {
  return `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function generateAnonEmail(): string {
  return `anonymous_${Math.random().toString(36).slice(2, 10)}@flightops.local`;
}

export const authService = {
  /** Get current user from localStorage, or null. */
  getCurrentUser(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },

  /** Persist user to localStorage. */
  saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },

  /** Create and persist an anonymous user instantly. */
  loginAnonymous(): User {
    const user: User = {
      id: generateAnonId(),
      email: generateAnonEmail(),
      provider: "anonymous",
      loginTime: new Date().toISOString(),
    };
    authService.saveUser(user);
    return user;
  },

  /** Authenticate with Google credential (JWT). */
  loginWithGoogle(credential: string): User {
    // Decode the JWT payload (base64url)
    const payload = JSON.parse(atob(credential.split(".")[1]));
    const user: User = {
      id: payload.sub,
      email: payload.email,
      provider: "google",
      loginTime: new Date().toISOString(),
      displayName: payload.name,
      avatarUrl: payload.picture,
    };
    authService.saveUser(user);
    return user;
  },

  /** Clear user and return a fresh anonymous user. */
  logout(): User {
    localStorage.removeItem(STORAGE_KEY);
    return authService.loginAnonymous();
  },

  /** Get the user's email for API tracking. */
  getUserEmail(): string {
    const user = authService.getCurrentUser();
    return user?.email ?? "anonymous@flightops.local";
  },

  /** True if user has a real (non-anonymous) account. */
  isLoggedIn(): boolean {
    const user = authService.getCurrentUser();
    return !!user && user.provider !== "anonymous";
  },

  /** True if user is anonymous. */
  isAnonymous(): boolean {
    const user = authService.getCurrentUser();
    return !user || user.provider === "anonymous";
  },
};
