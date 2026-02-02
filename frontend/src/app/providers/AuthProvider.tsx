import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthStoreContext, type AuthUser } from "@entities/auth";
import {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useRefreshMutation,
} from "@shared/api/graphql";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const isAuthenticated = Boolean(user);
  const { data: meData } = useMeQuery({ fetchPolicy: "no-cache" });
  const [loginMutation] = useLoginMutation();
  const [refreshMutation] = useRefreshMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const result = await loginMutation({
      variables: { email, password },
      fetchPolicy: "no-cache",
    });

    const nextUser = result.data?.login?.user ?? null;
    if (!nextUser) {
      throw new Error("Login failed");
    }

    setUser(nextUser);
  }, [loginMutation]);

  const refresh = useCallback(async () => {
    try {
      const result = await refreshMutation({ fetchPolicy: "no-cache" });
      const nextUser = result.data?.refresh?.user ?? null;
      setUser(nextUser);
    } catch {
      setUser(null);
    }
  }, [refreshMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation({ fetchPolicy: "no-cache" });
    } catch {
      // Ignore logout errors to keep client state consistent.
    }
    setUser(null);
  }, [logoutMutation]);

  useEffect(() => {
    setUser(meData?.me ?? null);
  }, [meData]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      refresh,
    }),
    [user, isAuthenticated, login, logout, refresh]
  );
  console.log(value);
  return <AuthStoreContext.Provider value={value}>{children}</AuthStoreContext.Provider>;
}
