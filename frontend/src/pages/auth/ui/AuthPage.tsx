import { Button, Card, Typography, Flex, Form, Input, App } from "antd";
import { useAuthStore } from "@entities/auth";
import { useAuthStyles } from "@pages/auth/auth.styles";
import { Navigate, useNavigate, useRouterState } from "@tanstack/react-router";
import { TelegramLoginButton } from "@shared/ui";
import { telegramBotId } from "@config/env";

export function AuthPage() {
  const authStore = useAuthStore();
  const { styles } = useAuthStyles();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const location = useRouterState({ select: (state) => state.location });
  const searchValue =
    typeof location.search === "string"
      ? location.search
      : new URLSearchParams(location.search as Record<string, string>).toString();
  const searchParams = new URLSearchParams(searchValue);
  const redirectParam = searchParams.get("redirect");
  const redirectTarget = redirectParam || "/";

  if (authStore.isAuthenticated) {
    return <Navigate to={redirectTarget} />;
  }

  return (
    <Flex align="center" justify="center" className={styles.center}>
      <Card title="Login" className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            try {
              await authStore.login(values);
              navigate({ to: redirectTarget });
            } catch {
              message.error("Invalid credentials.");
            }
          }}
          requiredMark="optional"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input placeholder="demo@demo.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password placeholder="••••••" />
          </Form.Item>
          <Flex justify="space-between" align="center">
            <Button
              type="link"
              onClick={() =>
                navigate({
                  to: "/register",
                  search: { redirect: redirectTarget } as { redirect?: string },
                })
              }
            >
              Create account
            </Button>
            <Button type="primary" htmlType="submit" loading={false}>
              Login
            </Button>
          </Flex>
        </Form>
        {authStore.user?.email && (
          <Typography.Paragraph>
            Logged in as: {authStore.user.email}
          </Typography.Paragraph>
        )}
        {telegramBotId ? (
          <Flex vertical gap="small">
            <Typography.Text type="secondary">Or sign in with Telegram</Typography.Text>
            <TelegramLoginButton redirectPath={redirectTarget} />
          </Flex>
        ) : null}
      </Card>
    </Flex>
  );
}
