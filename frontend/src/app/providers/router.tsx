import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import { AppLayout } from "@app/layouts/AppLayout";
import { HomePage } from "@pages/home";
import { AuthPage } from "@pages/auth";

const rootRoute = createRootRoute({
  component: () => <AppLayout />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => <HomePage />,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: () => <AuthPage />,
});

const routeTree = rootRoute.addChildren([indexRoute, authRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
