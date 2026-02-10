import type { Meta, StoryObj } from '@storybook/react-vite';

import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'UI/Form/Switch',
  component: Switch,
  args: {
    children: 'Enable notifications',
  },
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {};
