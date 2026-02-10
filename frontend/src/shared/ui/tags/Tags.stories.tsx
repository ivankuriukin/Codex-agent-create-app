import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tag, Tags } from './Tags';

const meta: Meta = {
  title: 'UI/Tags',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <Tags>
      <Tag>One</Tag>
      <Tag>Two</Tag>
      <Tag>Three</Tag>
    </Tags>
  ),
};
