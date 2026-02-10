import {
  fetchUserSettings,
  type ThemeMode,
  updateUserSettings,
} from '@shared/api/settings';
import { getAppTheme } from '@shared/theme/tokens';
import { ConfigProvider } from 'antd';
import { StyleProvider } from 'antd-style';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type ThemeContextValue = {
  mode: ThemeMode;
  loading: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [loading, setLoading] = useState(true);
  const themeConfig = useMemo(() => getAppTheme(mode), [mode]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const settings = await fetchUserSettings();
        if (!active) {
          return;
        }
        setModeState(settings?.theme ?? 'light');
      } catch {
        if (active) {
          setModeState('light');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [mode]);

  const setMode = useCallback(async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    try {
      await updateUserSettings({ theme: nextMode });
    } catch {
      // ignore network errors to keep UI responsive
    }
  }, []);

  const value = useMemo(
    () => ({
      mode,
      loading,
      setMode,
    }),
    [mode, loading, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <StyleProvider>
        <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>
      </StyleProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
