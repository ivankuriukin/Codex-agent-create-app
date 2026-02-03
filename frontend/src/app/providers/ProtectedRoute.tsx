import { type ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { useAuthStore } from "@entities/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const authStore = useAuthStore();
  const location = useRouterState({ select: (state) => state.location });

  if (!authStore.isAuthResolved) {
    return null;
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/auth" search={{ redirect: location.pathname }} />;
  }

  return children;
}
