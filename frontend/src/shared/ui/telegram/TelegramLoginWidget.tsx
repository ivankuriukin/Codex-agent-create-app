import { useEffect, useRef } from "react";
import { apiBaseUrl, telegramBotName } from "@config/env";

type TelegramLoginWidgetProps = {
  redirectPath: string;
};

export function TelegramLoginWidget({ redirectPath }: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!telegramBotName) return;
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", telegramBotName);
    script.setAttribute("data-size", "large");
    script.setAttribute(
      "data-auth-url",
      `${apiBaseUrl}/auth/telegram/callback?redirect=${encodeURIComponent(redirectPath)}`
    );
    script.setAttribute("data-request-access", "write");

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [redirectPath]);

  if (!telegramBotName) {
    return null;
  }

  return <div ref={containerRef} />;
}
