import { createStyles } from 'antd-style';

export const useAppLayoutStyles = createStyles(({ token }) => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    minHeight: 0,
  },
  header: {
    padding: token.padding,
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
  },
  sider: {
    padding: token.padding,
    margin: token.padding,
    borderRadius: token.borderRadiusLG,
    overflow: 'hidden',
  },
  siderContent: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  nav: {
    background: 'transparent',
    borderInlineEnd: 0,
    '&.ant-menu-inline': {
      borderInlineEnd: 0,
    },
    '&.ant-menu': {
      borderInlineEnd: 0,
      '--ant-menu-active-bar-border-width': '0px',
    },
    '& .ant-menu-item::after': {
      borderInlineEnd: 0,
    },
  },
  authMenu: {
    background: 'transparent',
    borderInlineEnd: 0,
    '&.ant-menu-inline': {
      borderInlineEnd: 0,
    },
  },
  content: {
    padding: token.padding,
    overflow: 'auto',
  },
  contentInner: {
    minHeight: '100%',
  },
  footer: {
    padding: token.padding,
  },
  drawerBody: {
    padding: token.padding,
    display: 'flex',
    flexDirection: 'column',
    gap: token.marginSM,
  },
  drawer: {
    '& .ant-drawer-body': {
      padding: 0,
    },
  },
}));
