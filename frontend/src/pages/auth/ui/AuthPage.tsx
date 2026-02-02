import { Button, Card, Typography, Space } from "antd";
import { useAuthStore } from "@entities/auth";

export function AuthPage() {
  const authStore = useAuthStore();

  return (
    <Card title="Auth">
      <Space direction="vertical" size="middle">
        <Typography.Text type="secondary">Access</Typography.Text>
        <Typography.Text>
          Authenticated: {authStore.isAuthenticated ? "yes" : "no"}
        </Typography.Text>
        {authStore.user?.email && (
          <Typography.Text>User: {authStore.user.email}</Typography.Text>
        )}
        <Space>
          <Button
            type="primary"
            onClick={() =>
              authStore.login({
                email: "demo@demo.com",
                password: "demo",
              })
            }
          >
            Login
          </Button>
          <Button onClick={() => authStore.logout()}>Logout</Button>
        </Space>
      </Space>
    </Card>
  );
}
