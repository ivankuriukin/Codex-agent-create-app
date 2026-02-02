import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Layout, Button, Card, Typography, Tooltip, Space, Avatar, Divider } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from "@ant-design/icons";
import { SidebarNav } from "@app/layouts/SidebarNav";
import { useAppLayoutStore } from "@app/layouts/app-layout-store";

const { Sider, Header, Content } = Layout;

export function AppLayout() {
  const store = useAppLayoutStore();
  const navigate = useNavigate();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <Layout>
      <Sider width={256} collapsedWidth={80} collapsed={store.isCollapsed} trigger={null}>
        <Space direction="vertical" size="middle">
          <Space align="center" size="middle">
            <Avatar shape="square" size={36}>E</Avatar>
            {!store.isCollapsed && (
              <Typography.Text strong>EMBER UI</Typography.Text>
            )}
          </Space>
          <Button
            type="text"
            aria-label="Toggle navigation"
            icon={store.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={store.toggleSidebar}
          />
        </Space>

        <Divider />

        <SidebarNav
          isCollapsed={store.isCollapsed}
          pathname={pathname}
          onNavigate={(to) => navigate({ to })}
        />

        <Space direction="vertical" size="middle">
          {store.isCollapsed ? (
            <Tooltip title="Auth">
              <Button
                type="primary"
                shape="circle"
                icon={<UserOutlined />}
                aria-label="Auth"
                onClick={() => navigate({ to: "/auth" })}
              />
            </Tooltip>
          ) : (
            <Button
              type="primary"
              icon={<UserOutlined />}
              onClick={() => navigate({ to: "/auth" })}
            >
              Auth
            </Button>
          )}

          <Card title="Current space">
            <Typography.Text>Midnight Studio</Typography.Text>
          </Card>
        </Space>
      </Sider>

      <Layout>
        <Header>
          <Space align="baseline">
            <Typography.Title level={4}>Dashboard</Typography.Title>
            <Typography.Text type="secondary">Overview</Typography.Text>
          </Space>
        </Header>

        <Content>
          <Space direction="vertical" size="large">
            <Outlet />
          </Space>
        </Content>
      </Layout>
    </Layout>
  );
}
