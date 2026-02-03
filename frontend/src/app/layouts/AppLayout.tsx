import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Layout, Button, Typography, Tooltip, Flex, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { SidebarNav } from "@app/layouts/SidebarNav";
import { useAppLayoutStyles } from "@app/layouts/app-layout.styles";

const { Header, Sider, Content, Footer } = Layout;

export function AppLayout() {
  const { styles } = useAppLayoutStyles();
  const navigate = useNavigate();
  const location = useRouterState({
    select: (state) => state.location,
  });
  const pathname = location.pathname;

  return (
    <Layout className={styles.root}>
      <Header className={styles.header}>
        <Flex align="center" justify="space-between" gap="large">
          <Flex align="center" gap="middle">
            <Avatar shape="square" size={36}>E</Avatar>
            <Typography.Text strong>EMBER UI</Typography.Text>
          </Flex>
          <Tooltip title="Profile">
            <Button
              type="text"
              icon={<UserOutlined />}
              onClick={() => navigate({ to: "/profile" })}
            >
              Profile
            </Button>
          </Tooltip>
        </Flex>
      </Header>

      <Layout className={styles.main}>
        <Sider width={240} className={styles.sider}>
          <SidebarNav pathname={pathname} onNavigate={(to) => navigate({ to })} />
        </Sider>

        <Content className={styles.content}>
          <Flex vertical gap="large">
            <Outlet />
          </Flex>
        </Content>
      </Layout>

      <Footer className={styles.footer}>
        <Flex align="center" justify="space-between">
          <Typography.Text>Midnight Studio</Typography.Text>
          <Typography.Text type="secondary">© 2026</Typography.Text>
        </Flex>
      </Footer>
    </Layout>
  );
}
