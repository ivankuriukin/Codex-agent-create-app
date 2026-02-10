import { theme } from 'antd';

export type ThemeMode = 'light' | 'dark';

export const layoutTokens = {
  padding: 16,
} as const;

export const appFontFamily =
  '"Inter","PT Root UI",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

const lightTokens = {
  colorPrimary: '#2F5E44',
  colorInfo: '#4F7F63',
  colorSuccess: '#2F5E44',
  colorWarning: '#C9A24D',
  colorError: '#d26b6b',
  colorBgBase: '#F6F3EE',
  colorBgContainer: '#FFFFFF',
  colorBgElevated: '#FFFFFF',
  colorTextBase: '#243128',
  colorTextSecondary: '#6F7F73',
  colorBorder: '#D8D2C8',
};

const darkTokens = {
  colorPrimary: '#22d3ee',
  colorInfo: '#38bdf8',
  colorSuccess: '#34d399',
  colorWarning: '#fbbf24',
  colorError: '#f87171',
  colorBgBase: '#0b0f14',
  colorBgContainer: '#111827',
  colorBgElevated: '#0f172a',
  colorTextBase: '#e5e7eb',
  colorTextSecondary: '#94a3b8',
  colorBorder: '#1f2937',
};

export const getAppTheme = (mode: ThemeMode) => ({
  algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    ...(mode === 'dark' ? darkTokens : lightTokens),
    fontFamily: appFontFamily,
    padding: layoutTokens.padding,
    paddingLG: layoutTokens.padding,
    paddingSM: layoutTokens.padding,
  },
});
