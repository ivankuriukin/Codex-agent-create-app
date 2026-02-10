import type { Meta, StoryObj } from '@storybook/react-vite';

import { Collapser } from './Collapser';

const meta: Meta<typeof Collapser> = {
  title: 'UI/Collapser',
  component: Collapser,
  args: {
    title: 'Toggle',
    children: 'Hidden content',
  },
};

export default meta;

type Story = StoryObj<typeof Collapser>;

export const Default: Story = {};
