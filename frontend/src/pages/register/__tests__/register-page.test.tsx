import '@testing-library/jest-dom/jest-globals';

import { RegisterPage } from '@pages/register';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockNavigate = jest.fn();
const mockRegister = jest.fn();

jest.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useRouterState: () => ({ location: { search: 'redirect=/profile' } }),
  Navigate: ({ to }: { to: string }) => (
    <div data-testid="navigate" data-to={to} />
  ),
}));

jest.mock('@entities/auth', () => ({
  useAuthStore: () => ({
    user: null,
    isAuthenticated: false,
    isAuthResolved: true,
    setUser: jest.fn(),
    login: jest.fn(),
    logout: jest.fn(),
    refresh: jest.fn(),
  }),
}));

jest.mock('@pages/register/model/useRegisterStore', () => ({
  useRegisterStore: () => ({ register: mockRegister }),
}));

describe('RegisterPage', () => {
  test('submits registration and redirects', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'demo@demo.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'demo' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'demo@demo.com',
        password: 'demo',
      });
      expect(mockNavigate).toHaveBeenCalled();
    });
  });
});
