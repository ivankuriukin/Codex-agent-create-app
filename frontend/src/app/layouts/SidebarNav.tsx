import { Menu } from "antd";
import { DashboardOutlined } from "@ant-design/icons";

type SidebarNavProps = {
  isCollapsed: boolean;
  pathname: string;
  onNavigate: (to: string) => void;
};

export function SidebarNav({ isCollapsed, pathname, onNavigate }: SidebarNavProps) {
  const items = [
    {
      key: "/",
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[pathname]}
      inlineCollapsed={isCollapsed}
      items={items}
      onClick={({ key }) => onNavigate(String(key))}
    />
  );
}
