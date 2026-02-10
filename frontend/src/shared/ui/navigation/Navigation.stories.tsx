import type { Meta, StoryObj } from '@storybook/react-vite';

import { Navigation } from './Navigation';

const meta: Meta<typeof Navigation> = {
  title: 'UI/Navigation',
  component: Navigation,
};

export default meta;

type Story = StoryObj<typeof Navigation>;

export const Default: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'about', label: 'About', href: '#' },
      { id: 'contact', label: 'Contact', href: '#' },
    ],
  },
};
