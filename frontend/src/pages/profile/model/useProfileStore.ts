import { useCallback } from "react";
import { apiBaseUrl } from "@config/env";
import { useAuthStore, type AuthUser } from "@entities/auth";

type ProfilePayload = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  description?: string;
  birthDate?: string | null;
};

export function useProfileStore() {
  const { setUser } = useAuthStore();

  const saveProfile = useCallback(
    async (payload: ProfilePayload) => {
      const response = await fetch(`${apiBaseUrl}/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      const data = (await response.json()) as { user: AuthUser };
      setUser(data.user);
    },
    [setUser]
  );

  const uploadPhoto = useCallback(
    async (photoFile: File) => {
      const formData = new FormData();
      formData.append("photo", photoFile);

      const response = await fetch(`${apiBaseUrl}/profile/photo`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Photo upload failed");
      }

      const data = (await response.json()) as { user: AuthUser };
      setUser(data.user);
    },
    [setUser]
  );

  const deletePhoto = useCallback(async () => {
    const response = await fetch(`${apiBaseUrl}/profile/photo`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Photo delete failed");
    }

    const data = (await response.json()) as { user: AuthUser };
    setUser(data.user);
  }, [setUser]);

  return { saveProfile, uploadPhoto, deletePhoto };
}
