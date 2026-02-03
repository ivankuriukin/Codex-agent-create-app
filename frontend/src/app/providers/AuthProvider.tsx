import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthStoreContext, type AuthUser } from "@entities/auth";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useMeQuery,
  useRefreshMutation,
} from "@shared/api/graphql";
import { apiBaseUrl } from "@config/env";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const isAuthenticated = Boolean(user);
  const { data: meData, loading: meLoading } = useMeQuery({ fetchPolicy: "no-cache" });
  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
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

  const register = useCallback(
    async ({ email, password, name }: { email: string; password: string; name?: string }) => {
      const result = await registerMutation({
        variables: { email, password, name },
        fetchPolicy: "no-cache",
      });

      const nextUser = result.data?.register?.user ?? null;
      if (!nextUser) {
        throw new Error("Registration failed");
      }

      setUser(nextUser);
    },
    [registerMutation]
  );

  const updateProfile = useCallback(
    async (payload: {
      firstName?: string;
      lastName?: string;
      middleName?: string;
      description?: string;
      birthDate?: string | null;
      photoFile?: File | null;
    }) => {
      const { photoFile, ...profile } = payload;
      let nextUser: AuthUser | null = null;

      const profileResponse = await fetch(`${apiBaseUrl}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(profile),
      });

      if (profileResponse.ok) {
        const data = (await profileResponse.json()) as { user: AuthUser };
        nextUser = data.user;
      } else {
        throw new Error("Profile update failed");
      }

      if (photoFile) {
        const formData = new FormData();
        formData.append("photo", photoFile);

        const photoResponse = await fetch(`${apiBaseUrl}/profile/photo`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!photoResponse.ok) {
          throw new Error("Photo upload failed");
        }

        const data = (await photoResponse.json()) as { user: AuthUser };
        nextUser = data.user;
      }

      setUser(nextUser);
    },
    []
  );

  const deleteProfilePhoto = useCallback(async () => {
    const response = await fetch(`${apiBaseUrl}/profile/photo`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Photo delete failed");
    }

    const data = (await response.json()) as { user: AuthUser };
    setUser(data.user);
  }, []);

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

  useEffect(() => {
    if (!meLoading) {
      setIsAuthResolved(true);
    }
  }, [meLoading]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isAuthResolved,
      login,
      register,
      updateProfile,
      deleteProfilePhoto,
      logout,
      refresh,
    }),
    [
      user,
      isAuthenticated,
      isAuthResolved,
      login,
      register,
      updateProfile,
      deleteProfilePhoto,
      logout,
      refresh,
    ]
  );

  return <AuthStoreContext.Provider value={value}>{children}</AuthStoreContext.Provider>;
}
