import "@testing-library/jest-dom/jest-globals";
import { useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import { AuthStoreContext, type AuthContextValue } from "@entities/auth";
import { useProfileStore } from "@pages/profile/model/useProfileStore";

const mockUpdateProfileMutation = jest.fn();
const mockUploadProfilePhotoMutation = jest.fn();
const mockDeleteProfilePhotoMutation = jest.fn();

jest.mock("@shared/api/graphql", () => ({
  useUpdateProfileMutation: () => [mockUpdateProfileMutation],
  useUploadProfilePhotoMutation: () => [mockUploadProfilePhotoMutation],
  useDeleteProfilePhotoMutation: () => [mockDeleteProfilePhotoMutation],
}));

function ProfileProbe({
  action,
}: {
  action: "save" | "upload" | "delete";
}) {
  const { saveProfile, uploadPhoto, deletePhoto } = useProfileStore();

  useEffect(() => {
    const run = async () => {
      if (action === "save") {
        await saveProfile({ firstName: "Ivan" });
      }
      if (action === "upload") {
        await uploadPhoto(new File(["x"], "photo.png", { type: "image/png" }));
      }
      if (action === "delete") {
        await deletePhoto();
      }
    };

    run().catch(() => undefined);
  }, [action, saveProfile, uploadPhoto, deletePhoto]);

  return null;
}

describe("useProfileStore", () => {
  const setUser = jest.fn();
  const authValue: AuthContextValue = {
    user: null,
    isAuthenticated: true,
    isAuthResolved: true,
    setUser,
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  };

  beforeEach(() => {
    setUser.mockClear();
    mockUpdateProfileMutation.mockResolvedValue({
      data: { updateProfile: { user: { id: "1", email: "demo@demo.com", createdAt: "now" } } },
    });
    mockUploadProfilePhotoMutation.mockResolvedValue({
      data: {
        uploadProfilePhoto: { user: { id: "1", email: "demo@demo.com", createdAt: "now" } },
      },
    });
    mockDeleteProfilePhotoMutation.mockResolvedValue({
      data: {
        deleteProfilePhoto: { user: { id: "1", email: "demo@demo.com", createdAt: "now" } },
      },
    });
  });

  test("saveProfile posts profile and updates user", async () => {
    render(
      <AuthStoreContext.Provider value={authValue}>
        <ProfileProbe action="save" />
      </AuthStoreContext.Provider>
    );

    await waitFor(() => {
      expect(mockUpdateProfileMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { input: { firstName: "Ivan" } },
        })
      );
      expect(setUser).toHaveBeenCalled();
    });
  });

  test("uploadPhoto posts photo and updates user", async () => {
    render(
      <AuthStoreContext.Provider value={authValue}>
        <ProfileProbe action="upload" />
      </AuthStoreContext.Provider>
    );

    await waitFor(() => {
      expect(mockUploadProfilePhotoMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: {
            input: expect.objectContaining({ fileName: "photo.png", base64: expect.any(String) }),
          },
        })
      );
      expect(setUser).toHaveBeenCalled();
    });
  });

  test("deletePhoto deletes photo and updates user", async () => {
    render(
      <AuthStoreContext.Provider value={authValue}>
        <ProfileProbe action="delete" />
      </AuthStoreContext.Provider>
    );

    await waitFor(() => {
      expect(mockDeleteProfilePhotoMutation).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalled();
    });
  });

});
