import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Layout, Button, Typography, Flex, Avatar, Drawer, Grid } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { SidebarAuthMenu, SidebarNav } from "@app/layouts/SidebarNav";
import { useAppLayoutStyles } from "@app/layouts/app-layout.styles";
import { AuthSwitch, useAuthStore } from "@entities/auth";
import { useEffect, useRef, useState } from "react";

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

export function AppLayout() {
  const { styles } = useAppLayoutStyles();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const authStore = useAuthStore();
  const wasAuthenticated = useRef(false);
  const location = useRouterState({
    select: (state) => state.location,
  });
  const pathname = location.pathname;
  const searchValue =
    typeof location.search === "string"
      ? location.search
      : new URLSearchParams(location.search as Record<string, string>).toString();
  const redirectPath = `${pathname}${searchValue ? `?${searchValue}` : ""}`;

  useEffect(() => {
    if (!authStore.isAuthResolved) {
      return;
    }

    if (wasAuthenticated.current && !authStore.isAuthenticated && pathname !== "/auth") {
      navigate({ to: "/auth", search: { redirect: redirectPath } });
    }

    wasAuthenticated.current = authStore.isAuthenticated;
  }, [authStore.isAuthResolved, authStore.isAuthenticated, navigate, pathname, redirectPath]);

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
            ) : null}
          </div>
        </Flex>
      </Header>

      <Layout className={styles.main}>
        {!isMobile && (
          <Sider width={240} className={styles.sider}>
            <Flex vertical className={styles.siderContent}>
              <SidebarNav pathname={pathname} onNavigate={(to) => navigate({ to })} />
              <SidebarAuthMenu
                pathname={pathname}
                isAuthenticated={authStore.isAuthenticated}
                onNavigate={(to) => {
                  if (to === "/auth") {
                    navigate({ to, search: { redirect: redirectPath } });
                    return;
                  }
                  navigate({ to });
                }}
              />
            </Flex>
          </Sider>
        )}

        <Content className={styles.content}>
          <Flex vertical gap="large" className={styles.contentInner}>
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
                  navigate({ to: "/auth", search: { redirect: redirectPath } });
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
