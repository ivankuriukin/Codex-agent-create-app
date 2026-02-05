import { theme } from "antd";

export const layoutTokens = {
  padding: 16,
} as const;

export const appTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: "#22d3ee",
    colorInfo: "#38bdf8",
    colorSuccess: "#34d399",
    colorWarning: "#fbbf24",
    colorError: "#f87171",
    colorBgBase: "#0b0f14",
    colorBgContainer: "#111827",
    colorBgElevated: "#0f172a",
    colorTextBase: "#e5e7eb",
    colorTextSecondary: "#94a3b8",
    colorBorder: "#1f2937",
    padding: layoutTokens.padding,
    paddingLG: layoutTokens.padding,
    paddingSM: layoutTokens.padding,
  },
} as const;
