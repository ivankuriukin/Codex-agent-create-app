import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  args: {
    header: 'Card header',
    children: 'Card content',
    footer: 'Card footer',
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {};
