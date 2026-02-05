import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Layout, Button, Typography, Tooltip, Flex, Avatar, Drawer, Grid } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { SidebarNav } from "@app/layouts/SidebarNav";
import { useAppLayoutStyles } from "@app/layouts/app-layout.styles";
import { AuthSwitch } from "@entities/auth";
import { useState } from "react";

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export function AppLayout() {
  const { styles } = useAppLayoutStyles();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
          <div className={styles.headerActions}>
            {isMobile ? (
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setIsDrawerOpen(true)}
              />
            ) : (
              <AuthSwitch
                authenticated={
                  <Tooltip title="Profile">
                    <Button
                      type="text"
                      icon={<UserOutlined />}
                      onClick={() => navigate({ to: "/profile" })}
                    >
                      Profile
                    </Button>
                  </Tooltip>
                }
                unauthenticated={
                  <Tooltip title="Sign in">
                    <Button
                      type="primary"
                      icon={<UserOutlined />}
                      onClick={() => navigate({ to: "/auth", search: { redirect: "/profile" } })}
                    >
                      Sign in
                    </Button>
                  </Tooltip>
                }
              />
            )}
          </div>
        </Flex>
      </Header>

      <Layout className={styles.main}>
        {!isMobile && (
          <Sider width={240} className={styles.sider}>
            <SidebarNav pathname={pathname} onNavigate={(to) => navigate({ to })} />
          </Sider>
        )}

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

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        placement="right"
        width={280}
        title="Menu"
        className={styles.drawer}
      >
        <div className={styles.drawerBody}>
          <SidebarNav
            pathname={pathname}
            onNavigate={(to) => {
              setIsDrawerOpen(false);
              navigate({ to });
            }}
          />
          <AuthSwitch
            authenticated={
              <Button
                type="text"
                icon={<UserOutlined />}
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate({ to: "/profile" });
                }}
              >
                Profile
              </Button>
            }
            unauthenticated={
              <Button
                type="primary"
                icon={<UserOutlined />}
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate({ to: "/auth", search: { redirect: pathname } });
                }}
              >
                Sign in
              </Button>
            }
          />
        </div>
      </Drawer>
    </Layout>
  );
}
