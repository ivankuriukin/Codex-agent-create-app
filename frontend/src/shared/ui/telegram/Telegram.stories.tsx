import type { Meta, StoryObj } from '@storybook/react-vite';

import { TelegramIcon } from './TelegramIcon';
import { TelegramLoginButton } from './TelegramLoginButton';
import { TelegramLoginWidget } from './TelegramLoginWidget';

const meta: Meta = {
  title: 'UI/Telegram',
};

export default meta;

type Story = StoryObj;

export const Icon: Story = {
  render: () => <TelegramIcon />,
};

export const LoginButton: Story = {
  render: () => <TelegramLoginButton redirectPath="/" />,
};

export const LoginWidget: Story = {
  render: () => <TelegramLoginWidget redirectPath="/" />,
};
