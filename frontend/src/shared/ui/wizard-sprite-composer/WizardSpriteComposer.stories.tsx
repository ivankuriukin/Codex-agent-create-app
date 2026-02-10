import type { Meta, StoryObj } from '@storybook/react-vite';

import { WizardSpriteComposer } from './WizardSpriteComposer';

const meta: Meta<typeof WizardSpriteComposer> = {
  title: 'UI/WizardSpriteComposer',
  component: WizardSpriteComposer,
};

export default meta;

type Story = StoryObj<typeof WizardSpriteComposer>;

export const Default: Story = {};
