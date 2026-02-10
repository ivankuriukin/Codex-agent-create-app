import type { Meta, StoryObj } from '@storybook/react-vite';

import { TimePicker } from './TimePicker';

const meta: Meta<typeof TimePicker> = {
  title: 'UI/Form/TimePicker',
  component: TimePicker,
  args: {
    label: 'Pick a time',
  },
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {};
