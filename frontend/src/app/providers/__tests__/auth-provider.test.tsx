import '@testing-library/jest-dom/jest-globals';

import { AuthProvider } from '@app/providers/AuthProvider';
import { type AuthUser, useAuthStore } from '@entities/auth';
import { describe, expect, jest, test } from '@jest/globals';
import type {
  LoginMutationFn,
  LogoutMutationFn,
  RefreshMutationFn,
} from '@shared/api/graphql';
import { AUTH_UNAUTHORIZED_EVENT } from '@shared/lib/auth-events';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

const mockLogin = jest.fn() as jest.MockedFunction<LoginMutationFn>;
const mockRefresh = jest.fn() as jest.MockedFunction<RefreshMutationFn>;
const mockLogout = jest.fn() as jest.MockedFunction<LogoutMutationFn>;

jest.mock('@shared/api/graphql', () => ({
  useMeQuery: () => ({ data: { me: null }, loading: false }),
  useLoginMutation: () => [mockLogin],
  useRefreshMutation: () => [mockRefresh],
  useLogoutMutation: () => [mockLogout],
}));

function TestComponent() {
  const auth = useAuthStore();
  return (
    <div>
      <span data-testid="status">{auth.isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="email">{auth.user?.email ?? ''}</span>
      <button
        onClick={() => auth.login({ email: 'demo@demo.com', password: 'demo' })}
      >
        login
      </button>
      <button onClick={() => auth.logout()}>logout</button>
    </div>
  );
}

describe('AuthProvider', () => {
  test('login updates user and authenticated state', async () => {
    const user: AuthUser = {
      id: '1',
      email: 'demo@demo.com',
      name: null,
      createdAt: new Date().toISOString(),
    };
    const loginResult: Awaited<ReturnType<LoginMutationFn>> = {
      data: {
        login: { user },
      },
    };
    mockLogin.mockResolvedValueOnce(loginResult);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText('login'));

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('yes');
      expect(screen.getByTestId('email')).toHaveTextContent('demo@demo.com');
    });
  });

  test('logout clears user state', async () => {
    const user: AuthUser = {
      id: '1',
      email: 'demo@demo.com',
      name: null,
      createdAt: new Date().toISOString(),
    };
    const loginResult: Awaited<ReturnType<LoginMutationFn>> = {
      data: {
        login: { user },
      },
    };
    mockLogin.mockResolvedValueOnce(loginResult);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText('login'));
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('yes'),
    );

    fireEvent.click(screen.getByText('logout'));
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('no'),
    );
  });

  test('unauthorized event clears user state', async () => {
    const user: AuthUser = {
      id: '1',
      email: 'demo@demo.com',
      name: null,
      createdAt: new Date().toISOString(),
    };
    const loginResult: Awaited<ReturnType<LoginMutationFn>> = {
      data: {
        login: { user },
      },
    };
    mockLogin.mockResolvedValueOnce(loginResult);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText('login'));
    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('yes'),
    );

    act(() => {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    });

    await waitFor(() =>
      expect(screen.getByTestId('status')).toHaveTextContent('no'),
    );
  });
});
