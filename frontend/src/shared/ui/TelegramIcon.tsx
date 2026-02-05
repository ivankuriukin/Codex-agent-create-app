import Icon from "@ant-design/icons";
import type { ComponentProps } from "react";

const TelegramSvg = () => (
  <svg viewBox="0 0 240 240" aria-hidden="true">
    <path
      d="M120 0c66.27 0 120 53.73 120 120s-53.73 120-120 120S0 186.27 0 120 53.73 0 120 0zm58.01 73.68c.98-3.2-.7-4.45-3.09-3.6L48.83 118.12c-3.38 1.32-3.34 3.2-.64 4.04l32.38 10.1 12.38 38.64c1.4 3.84 2.9 5.33 5.9 5.33 2.3 0 3.3-.8 4.64-2.1l15.64-15.16 32.55 24.03c5.96 3.28 10.3 1.54 11.73-5.52l18.77-103.8zM93.6 130.82l69.96-44.06c1.27-.8 2.43-.37 1.47.49l-57.7 52.05-2.23 25.22-11.5-36.1z"
      fill="currentColor"
    />
  </svg>
);

export function TelegramIcon(props: ComponentProps<typeof Icon>) {
  return <Icon component={TelegramSvg} {...props} />;
}
