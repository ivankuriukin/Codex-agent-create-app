import { useCallback } from "react";
import { useAuthStore } from "@entities/auth";
import {
  useDeleteProfilePhotoMutation,
  useUpdateProfileMutation,
  useUploadProfilePhotoMutation,
} from "@shared/api/graphql";

type ProfilePayload = {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  description?: string;
  birthDate?: string | null;
};

export function useProfileStore() {
  const { setUser } = useAuthStore();
  const [updateProfileMutation] = useUpdateProfileMutation();
  const [uploadProfilePhotoMutation] = useUploadProfilePhotoMutation();
  const [deleteProfilePhotoMutation] = useDeleteProfilePhotoMutation();

  const readFileAsBase64 = useCallback((file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Failed to read file"));
          return;
        }
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const saveProfile = useCallback(
    async (payload: ProfilePayload) => {
      const result = await updateProfileMutation({
        variables: { input: payload },
        fetchPolicy: "no-cache",
      });

      const nextUser = result.data?.updateProfile?.user ?? null;
      if (!nextUser) {
        throw new Error("Profile update failed");
      }

      setUser(nextUser);
    },
    [setUser, updateProfileMutation]
  );

  const uploadPhoto = useCallback(
    async (photoFile: File) => {
      const base64 = await readFileAsBase64(photoFile);
      const result = await uploadProfilePhotoMutation({
        variables: { input: { fileName: photoFile.name, base64 } },
        fetchPolicy: "no-cache",
      });

      const nextUser = result.data?.uploadProfilePhoto?.user ?? null;
      if (!nextUser) {
        throw new Error("Photo upload failed");
      }

      setUser(nextUser);
    },
    [readFileAsBase64, setUser, uploadProfilePhotoMutation]
  );

  const deletePhoto = useCallback(async () => {
    const result = await deleteProfilePhotoMutation({
      fetchPolicy: "no-cache",
    });

    const nextUser = result.data?.deleteProfilePhoto?.user ?? null;
    if (!nextUser) {
      throw new Error("Photo delete failed");
    }

    setUser(nextUser);
  }, [deleteProfilePhotoMutation, setUser]);

  return { saveProfile, uploadPhoto, deletePhoto };
}
