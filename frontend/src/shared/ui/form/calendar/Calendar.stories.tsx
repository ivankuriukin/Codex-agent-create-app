import type { Meta, StoryObj } from '@storybook/react-vite';

import { Calendar } from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'UI/Form/Calendar',
  component: Calendar,
};

export default meta;

type Story = StoryObj<typeof Calendar>;

export const Default: Story = {};
