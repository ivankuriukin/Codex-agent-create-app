import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'UI/Form/TextField',
  component: TextField,
  args: {
    label: 'Email',
    placeholder: 'hello@example.com',
  },
};

export default meta;

type Story = StoryObj<typeof TextField>;

export const Default: Story = {};
