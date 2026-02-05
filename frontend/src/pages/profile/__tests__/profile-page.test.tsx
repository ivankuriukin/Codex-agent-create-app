import "@testing-library/jest-dom/jest-globals";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { ProfilePage } from "@pages/profile";
import type { ReactNode } from "react";

const mockSaveProfile = jest.fn();
const mockUploadPhoto = jest.fn();
const mockDeletePhoto = jest.fn();
const mockLogout = jest.fn();
let mockUser: null | {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  description: string | null;
  photoUrl: string | null;
  birthDate: string | null;
  createdAt: string;
};

jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  return {
    ...actual,
    Upload: ({
      beforeUpload,
      children,
    }: {
      beforeUpload?: (file: File) => void;
      children: ReactNode;
    }) => (
      <div>
        <input
          data-testid="upload-input"
          type="file"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file && beforeUpload) beforeUpload(file);
          }}
        />
        {children}
      </div>
    ),
  };
});

jest.mock("@pages/profile/model/useProfileStore", () => ({
  useProfileStore: () => ({
    saveProfile: mockSaveProfile,
    uploadPhoto: mockUploadPhoto,
    deletePhoto: mockDeletePhoto,
  }),
}));

jest.mock("@entities/auth", () => ({
  useAuthStore: () => ({
    user: mockUser,
    isAuthenticated: true,
    isAuthResolved: true,
    setUser: jest.fn(),
    login: jest.fn(),
    logout: mockLogout,
    refresh: jest.fn(),
  }),
}));

describe("ProfilePage", () => {
  beforeEach(() => {
    mockSaveProfile.mockReset();
    mockUploadPhoto.mockReset();
    mockDeletePhoto.mockReset();
    mockLogout.mockReset();
    mockUser = {
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
    };
  });

  test("renders profile header with photo and email", () => {
    const { container } = render(<ProfilePage />);

    expect(screen.getByText("Petrov Ivan")).toBeInTheDocument();
    expect(screen.getByText("demo@demo.com")).toBeInTheDocument();

    const photo = container.querySelector("img");
    expect(photo).toHaveAttribute("src", "http://localhost:4000/uploads/test.png");
  });

  test("renders nothing when user is missing", () => {
    mockUser = null;
    const { container } = render(<ProfilePage />);
    expect(container.firstChild).toBeNull();
  });

  test("enables save button on change and saves profile", async () => {
    mockSaveProfile.mockResolvedValueOnce(undefined);
    render(<ProfilePage />);

    const saveButton = screen.getByRole("button", { name: /save/i });
    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/first name/i), {
      target: { value: "Ivana" },
    });

    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "Ivana",
          lastName: "Petrov",
          birthDate: null,
        })
      );
    });
  });

  test("uploads and deletes photo", async () => {
    render(<ProfilePage />);

    const file = new File(["photo"], "photo.png", { type: "image/png" });
    fireEvent.change(screen.getByTestId("upload-input"), {
      target: { files: [file] },
    });

    await waitFor(() => {
      expect(mockUploadPhoto).toHaveBeenCalledWith(file);
    });

    const deleteIcon = document.querySelector('span[aria-label="delete"]');
    if (!deleteIcon) throw new Error("Delete icon not found");
    const deleteButton = deleteIcon.closest("button");
    if (!deleteButton) throw new Error("Delete button not found");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockDeletePhoto).toHaveBeenCalled();
    });
  });

  test("logs out from the profile page", async () => {
    render(<ProfilePage />);

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
