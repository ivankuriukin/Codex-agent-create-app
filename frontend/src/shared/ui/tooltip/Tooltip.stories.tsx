import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tooltip, TooltipTrigger } from './Tooltip';

const meta: Meta = {
  title: 'UI/Tooltip',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <TooltipTrigger tooltip={<Tooltip>Tooltip content</Tooltip>}>
      <button type="button">Hover me</button>
    </TooltipTrigger>
  ),
};
