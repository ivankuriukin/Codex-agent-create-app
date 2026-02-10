import { router } from '@app/router';
import { RouterProvider as TanStackRouterProvider } from '@tanstack/react-router';

export function RouterProvider() {
  return <TanStackRouterProvider router={router} />;
}
