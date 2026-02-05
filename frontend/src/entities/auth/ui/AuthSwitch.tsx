import { type ReactNode } from "react";
import { useAuthStore } from "@entities/auth";

type AuthSwitchProps = {
  authenticated: ReactNode;
  unauthenticated: ReactNode;
};

export function AuthSwitch({ authenticated, unauthenticated }: AuthSwitchProps) {
  const authStore = useAuthStore();

  if (!authStore.isAuthResolved) {
    return null;
  }

  return authStore.isAuthenticated ? authenticated : unauthenticated;
}
