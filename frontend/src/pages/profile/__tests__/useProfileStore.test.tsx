import "@testing-library/jest-dom/jest-globals";
import { useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import { AuthStoreContext, type AuthContextValue } from "@entities/auth";
import { useProfileStore } from "@pages/profile/model/useProfileStore";

function ProfileProbe({
  action,
}: {
  action: "save" | "upload" | "delete";
}) {
  const { saveProfile, uploadPhoto, deletePhoto } = useProfileStore();

  useEffect(() => {
    if (action === "save") {
      saveProfile({ firstName: "Ivan" });
    }
    if (action === "upload") {
      uploadPhoto(new File(["x"], "photo.png", { type: "image/png" }));
    }
    if (action === "delete") {
      deletePhoto();
    }
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
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: "1", email: "demo@demo.com", createdAt: "now" } }),
    }) as jest.Mock;
  });

  test("saveProfile posts profile and updates user", async () => {
    render(
      <AuthStoreContext.Provider value={authValue}>
        <ProfileProbe action="save" />
      </AuthStoreContext.Provider>
    );

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/profile"),
        expect.objectContaining({ method: "POST" })
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
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/profile/photo"),
        expect.objectContaining({ method: "POST" })
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
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/profile/photo"),
        expect.objectContaining({ method: "DELETE" })
      );
      expect(setUser).toHaveBeenCalled();
    });
  });
});
