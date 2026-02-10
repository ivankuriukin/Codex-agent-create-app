import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';

import { Button } from '../button';
import { ErrorBoundary } from './ErrorBoundary';

const meta: Meta<typeof ErrorBoundary> = {
  title: 'UI/ErrorBoundary',
  component: ErrorBoundary,
};

export default meta;

type Story = StoryObj<typeof ErrorBoundary>;

function Boom() {
  throw new Error('Boom');
  return null;
}

export const Default: Story = {
  render: () => {
    const [shouldThrow, setShouldThrow] = useState(false);

    return (
      <div>
        <Button onPress={() => setShouldThrow(true)}>Trigger error</Button>
        <ErrorBoundary>{shouldThrow ? <Boom /> : 'All good'}</ErrorBoundary>
      </div>
    );
  },
};
