import { Menu } from "antd";
import { DashboardOutlined } from "@ant-design/icons";
import { useAppLayoutStyles } from "@app/layouts/app-layout.styles";

type SidebarNavProps = {
  pathname: string;
  onNavigate: (to: string) => void;
};

export function SidebarNav({ pathname, onNavigate }: SidebarNavProps) {
  const { styles } = useAppLayoutStyles();
  const items = [
    {
      key: "/",
      label: "Dashboard",
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
