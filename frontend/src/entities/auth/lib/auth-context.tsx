import { createContext, useContext } from "react";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  description?: string | null;
  photoUrl?: string | null;
  birthDate?: string | null;
  createdAt: string;
};

export type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthResolved: boolean;
  setUser: (user: AuthUser | null) => void;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const AuthStoreContext = createContext<AuthContextValue | null>(null);

export function useAuthStore() {
  const store = useContext(AuthStoreContext);

  if (!store) {
    throw new Error("useAuthStore must be used within AuthProvider");
  }

  return store;
}
