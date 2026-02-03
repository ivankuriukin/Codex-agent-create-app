import { Button, Card, Flex, Form, Input, Typography } from "antd";
import { useAuthStore } from "@entities/auth";
import { useAuthStyles } from "@pages/auth/auth.styles";
import { Navigate, useNavigate, useRouterState } from "@tanstack/react-router";

export function RegisterPage() {
  const authStore = useAuthStore();
  const { styles } = useAuthStyles();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useRouterState({ select: (state) => state.location });
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get("redirect");
  const redirectTarget = redirectParam || "/";

  if (authStore.isAuthenticated) {
    return <Navigate to={redirectTarget} />;
  }

  return (
    <Flex className={styles.center} align="center" justify="center">
      <Card title="Register" className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={async (values) => {
            await authStore.register(values);
            navigate({ to: redirectTarget });
          }}
          requiredMark="optional"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>
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
                  to: "/auth",
                  search: { redirect: redirectTarget } as { redirect?: string },
                })
              }
            >
              Back to login
            </Button>
            <Button type="primary" htmlType="submit" loading={false}>
              Create account
            </Button>
          </Flex>
        </Form>
        {authStore.user?.email && (
          <Typography.Paragraph>
            Registered as: {authStore.user.email}
          </Typography.Paragraph>
        )}
      </Card>
    </Flex>
  );
}
