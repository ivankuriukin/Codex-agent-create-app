import { ApolloProvider } from "@app/providers/ApolloProvider";
import { AuthProvider } from "@app/providers/AuthProvider";
import { RouterProvider } from "@app/providers/RouterProvider";
import { ConfigProvider, theme } from "antd";

export function AppProviders() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#1f6feb",
        },
      }}
    >
      <ApolloProvider>
        <AuthProvider>
          <RouterProvider />
        </AuthProvider>
      </ApolloProvider>
    </ConfigProvider>
  );
}
