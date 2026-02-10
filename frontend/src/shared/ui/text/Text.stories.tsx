import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'UI/Text',
  component: Text,
  args: {
    children: 'Sample text',
  },
};

export default meta;

type Story = StoryObj<typeof Text>;

export const Default: Story = {};
