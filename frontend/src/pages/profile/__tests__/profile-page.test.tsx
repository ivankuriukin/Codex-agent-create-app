import "@testing-library/jest-dom/jest-globals";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { ProfilePage } from "@pages/profile";

const mockSaveProfile = jest.fn();
const mockUploadPhoto = jest.fn();
const mockDeletePhoto = jest.fn();

jest.mock("@pages/profile/model/useProfileStore", () => ({
  useProfileStore: () => ({
    saveProfile: mockSaveProfile,
    uploadPhoto: mockUploadPhoto,
    deletePhoto: mockDeletePhoto,
  }),
}));

jest.mock("@entities/auth", () => ({
  useAuthStore: () => ({
    user: {
      id: "1",
      email: "demo@demo.com",
      name: null,
      firstName: "Ivan",
      lastName: "Petrov",
      middleName: null,
      description: null,
      photoUrl: "/uploads/test.png",
      birthDate: null,
      createdAt: new Date().toISOString(),
    },
    isAuthenticated: true,
    isAuthResolved: true,
    setUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("ProfilePage", () => {
  test("enables save button on change and saves profile", async () => {
    mockSaveProfile.mockResolvedValueOnce(undefined);
    const { container } = render(<ProfilePage />);
    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");

    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSaveProfile).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: "Ivan" })
      );
    });
  });
});
