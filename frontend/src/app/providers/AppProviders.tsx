import { ApolloProvider } from "@app/providers/ApolloProvider";
import { AuthProvider } from "@app/providers/AuthProvider";
import { RouterProvider } from "@app/providers/RouterProvider";
import { App as AntApp, ConfigProvider, Result } from "antd";
import { StyleProvider } from "antd-style";
import { appTheme } from "@shared/theme/tokens";
import { ErrorBoundary } from "@shared/ui";

export function AppProviders() {
  return (
    <StyleProvider>
      <ConfigProvider theme={appTheme}>
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
      </ConfigProvider>
    </StyleProvider>
  );
}
