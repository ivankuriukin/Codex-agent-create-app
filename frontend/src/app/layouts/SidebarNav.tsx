import {
  DashboardOutlined,
  LoginOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAppLayoutStyles } from '@app/layouts/app-layout.styles';
import { Menu } from 'antd';

type SidebarNavProps = {
  pathname: string;
  onNavigate: (to: string) => void;
};

export function SidebarNav({ pathname, onNavigate }: SidebarNavProps) {
  const { styles } = useAppLayoutStyles();
  const items = [
    {
      key: '/',
      label: 'Dashboard',
      icon: <DashboardOutlined />,
    },
  ];

  return (
    <Menu
      className={styles.nav}
      mode="inline"
      selectedKeys={[pathname]}
      items={items}
      onClick={({ key }) => onNavigate(String(key))}
    />
  );
}

type SidebarAuthMenuProps = {
  pathname: string;
  isAuthenticated: boolean;
  onNavigate: (to: string) => void;
};

export function SidebarAuthMenu({
  pathname,
  isAuthenticated,
  onNavigate,
}: SidebarAuthMenuProps) {
  const { styles } = useAppLayoutStyles();
  const items = isAuthenticated
    ? [
        {
          key: '/profile',
          label: 'Profile',
          icon: <UserOutlined />,
        },
      ]
    : [
        {
          key: '/auth',
          label: 'Sign in',
          icon: <LoginOutlined />,
        },
      ];

  return (
    <Menu
      className={styles.authMenu}
      mode="inline"
      selectedKeys={[pathname]}
      items={items}
      onClick={({ key }) => onNavigate(String(key))}
    />
  );
}
