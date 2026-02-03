import { ApolloProvider } from "@app/providers/ApolloProvider";
import { AuthProvider } from "@app/providers/AuthProvider";
import { RouterProvider } from "@app/providers/RouterProvider";
import { App as AntApp, ConfigProvider } from "antd";
import { StyleProvider } from "antd-style";
import { appTheme } from "@shared/theme/tokens";

export function AppProviders() {
  return (
    <StyleProvider>
      <ConfigProvider theme={appTheme}>
        <AntApp>
          <ApolloProvider>
            <AuthProvider>
              <RouterProvider />
            </AuthProvider>
          </ApolloProvider>
        </AntApp>
      </ConfigProvider>
    </StyleProvider>
  );
}
