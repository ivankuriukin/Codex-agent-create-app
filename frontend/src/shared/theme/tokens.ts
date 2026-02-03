import { theme } from "antd";

export const layoutTokens = {
  padding: 16,
} as const;

export const appTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#1f6feb",
    padding: layoutTokens.padding,
    paddingLG: layoutTokens.padding,
    paddingSM: layoutTokens.padding,
  },
} as const;
