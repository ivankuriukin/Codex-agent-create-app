import {
  type AuthContextValue,
  AuthStoreContext,
  type AuthUser,
} from '@entities/auth';
import {
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
  useRefreshMutation,
} from '@shared/api/graphql';
import { AUTH_UNAUTHORIZED_EVENT } from '@shared/lib/auth-events';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const isAuthenticated = Boolean(user);
  const { data: meData, loading: meLoading } = useMeQuery({
    fetchPolicy: 'no-cache',
  });
  const [loginMutation] = useLoginMutation();
  const [refreshMutation] = useRefreshMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      const result = await loginMutation({
        variables: { email, password },
        fetchPolicy: 'no-cache',
      });

      const nextUser = result.data?.login?.user ?? null;
      if (!nextUser) {
        throw new Error('Login failed');
      }

      setUser(nextUser);
    },
    [loginMutation],
  );

  const setAuthUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const result = await refreshMutation({ fetchPolicy: 'no-cache' });
      const nextUser = result.data?.refresh?.user ?? null;
      setUser(nextUser);
    } catch {
      setUser(null);
    }
  }, [refreshMutation]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation({ fetchPolicy: 'no-cache' });
    } catch {
      // Ignore logout errors to keep client state consistent.
    }
    setUser(null);
  }, [logoutMutation]);

  useEffect(() => {
    setUser(meData?.me ?? null);
  }, [meData]);

  useEffect(() => {
    if (!meLoading) {
      setIsAuthResolved(true);
    }
  }, [meLoading]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    if (typeof window === 'undefined') return;
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAuthResolved,
      setUser: setAuthUser,
      login,
      logout,
      refresh,
    }),
    [
      user,
      isAuthenticated,
      isAuthResolved,
      setAuthUser,
      login,
      logout,
      refresh,
    ],
  );

  return (
    <AuthStoreContext.Provider value={value}>
      {children}
    </AuthStoreContext.Provider>
  );
}
