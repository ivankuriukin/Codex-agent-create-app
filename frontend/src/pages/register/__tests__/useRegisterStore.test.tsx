import "@testing-library/jest-dom/jest-globals";
import { useEffect } from "react";
import { render, waitFor } from "@testing-library/react";
import { AuthStoreContext, type AuthContextValue } from "@entities/auth";
import { useRegisterStore } from "@pages/register/model/useRegisterStore";

const mockRegisterMutation = jest.fn();

jest.mock("@shared/api/graphql", () => ({
  useRegisterMutation: () => [mockRegisterMutation],
}));

function RegisterProbe() {
  const { register } = useRegisterStore();

  useEffect(() => {
    register({ email: "demo@demo.com", password: "demo", name: "Demo" });
  }, [register]);

  return null;
}

describe("useRegisterStore", () => {
  test("calls register mutation and updates auth user", async () => {
    const setUser = jest.fn();
    const authValue: AuthContextValue = {
      user: null,
      isAuthenticated: false,
      isAuthResolved: true,
      setUser,
      login: jest.fn(),
      logout: jest.fn(),
      refresh: jest.fn(),
    };

    mockRegisterMutation.mockResolvedValueOnce({
      data: {
        register: {
          user: { id: "1", email: "demo@demo.com", name: null, createdAt: "now" },
        },
      },
    });

    render(
      <AuthStoreContext.Provider value={authValue}>
        <RegisterProbe />
      </AuthStoreContext.Provider>
    );

    await waitFor(() => {
      expect(mockRegisterMutation).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: "demo@demo.com" })
      );
    });
  });
});
