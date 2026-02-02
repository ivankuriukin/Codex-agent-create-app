import { useCallback, useMemo, useState } from "react";

type AppLayoutStore = {
  isCollapsed: boolean;
  toggleSidebar: () => void;
};

export function useAppLayoutStore(): AppLayoutStore {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((value) => !value);
  }, []);

  return useMemo(
    () => ({
      isCollapsed,
      toggleSidebar,
    }),
    [isCollapsed, toggleSidebar]
  );
}
