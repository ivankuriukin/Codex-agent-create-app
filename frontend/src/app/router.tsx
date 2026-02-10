import { AppLayout } from '@app/layouts/AppLayout';
import { ProtectedRoute } from '@app/providers/ProtectedRoute';
import { AuthPage } from '@pages/auth';
import { HomePage } from '@pages/home';
import { ProfilePage } from '@pages/profile';
import { RegisterPage } from '@pages/register';
import { RootRoute, Route, Router } from '@tanstack/react-router';

const rootRoute = new RootRoute({
  component: () => <AppLayout />,
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <HomePage />,
});

const authRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: () => <AuthPage />,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => <RegisterPage />,
});

const profileRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  registerRoute,
  profileRoute,
]);

export const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
