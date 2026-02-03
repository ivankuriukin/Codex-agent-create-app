import { createStyles } from "antd-style";

export const useAppLayoutStyles = createStyles(({ token }) => ({
  root: {
    height: "100vh",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    padding: token.padding,
  },
  sider: {
    padding: token.padding,
    margin: token.padding,
    borderRadius: token.borderRadiusLG,
    overflow: "hidden",
  },
  nav: {
    background: "transparent",
    borderInlineEnd: 0,
    "&.ant-menu-inline": {
      borderInlineEnd: 0,
    },
    "&.ant-menu": {
      borderInlineEnd: 0,
      "--ant-menu-active-bar-border-width": "0px",
    },
    "& .ant-menu-item::after": {
      borderInlineEnd: 0,
    },
  },
  content: {
    padding: token.padding,
    overflow: "auto",
  },
  footer: {
    padding: token.padding,
  },
}));
