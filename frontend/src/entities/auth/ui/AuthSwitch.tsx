import { useAuthStore } from '@entities/auth';
import { type ReactNode } from 'react';

type AuthSwitchProps = {
  authenticated: ReactNode;
  unauthenticated: ReactNode;
};

export function AuthSwitch({
  authenticated,
  unauthenticated,
}: AuthSwitchProps) {
  const authStore = useAuthStore();

  if (!authStore.isAuthResolved) {
    return null;
  }

  return authStore.isAuthenticated ? authenticated : unauthenticated;
}
