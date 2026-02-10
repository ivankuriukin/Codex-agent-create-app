import type { Meta, StoryObj } from '@storybook/react-vite';

import { Group } from './Group';

const meta: Meta<typeof Group> = {
  title: 'UI/Group',
  component: Group,
  args: {
    children: 'Grouped content',
    label: 'Group',
  },
};

export default meta;

type Story = StoryObj<typeof Group>;

export const Default: Story = {};
