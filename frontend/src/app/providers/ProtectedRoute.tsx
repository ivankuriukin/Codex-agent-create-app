import { useAuthStore } from '@entities/auth';
import { Navigate, useRouterState } from '@tanstack/react-router';
import { type ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authStore = useAuthStore();
  const location = useRouterState({ select: (state) => state.location });
  const searchValue =
    typeof location.search === 'string'
      ? location.search
      : new URLSearchParams(
          location.search as Record<string, string>,
        ).toString();
  const redirectPath = `${location.pathname}${searchValue ? `?${searchValue}` : ''}`;

  if (!authStore.isAuthResolved) {
    return null;
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/auth" search={{ redirect: redirectPath }} />;
  }

  return children;
}
