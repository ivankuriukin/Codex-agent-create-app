import { Button } from "antd";
import { apiBaseUrl, telegramBotId } from "@config/env";
import { TelegramIcon } from "./TelegramIcon";
import { getOrigin } from "@shared/lib/get-origin";

type TelegramLoginButtonProps = {
  redirectPath: string;
};

export function TelegramLoginButton({ redirectPath }: TelegramLoginButtonProps) {
  const origin = getOrigin();
  const returnTo = `${apiBaseUrl}/auth/telegram/callback?redirect=${encodeURIComponent(
    redirectPath
  )}`;
  const url = `https://oauth.telegram.org/auth?bot_id=${encodeURIComponent(
    telegramBotId
  )}&origin=${encodeURIComponent(origin)}&return_to=${encodeURIComponent(returnTo)}&request_access=write`;

  return (
    <Button type="primary" icon={<TelegramIcon />} href={url}>
      Login with Telegram
    </Button>
  );
}
