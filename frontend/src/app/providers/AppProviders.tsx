import { ApolloProvider } from '@app/providers/ApolloProvider';
import { AuthProvider } from '@app/providers/AuthProvider';
import { RouterProvider } from '@app/providers/RouterProvider';
import { ThemeProvider } from '@app/providers/ThemeProvider';
import { ErrorBoundary } from '@shared/ui';
import { App as AntApp, Result } from 'antd';

export function AppProviders() {
  return (
    <ThemeProvider>
      <AntApp>
        <ErrorBoundary
          fallback={
            <Result
              status="error"
              title="Something went wrong"
              subTitle="Please refresh the page and try again."
            />
          }
        >
          <ApolloProvider>
            <AuthProvider>
              <RouterProvider />
            </AuthProvider>
          </ApolloProvider>
        </ErrorBoundary>
      </AntApp>
    </ThemeProvider>
  );
}
