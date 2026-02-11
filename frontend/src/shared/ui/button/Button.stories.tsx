import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { FiArrowRight, FiPlus, FiX } from 'react-icons/fi';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Button',
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const Variants: Story = {
  render: () => (
    <div>
      <section className="mb-6">
        <h3 className="text-lg font-semibold">Variants</h3>
        <p className="mb-3 text-content-secondary">
          Visual styles and the danger flag.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="text">Text</Button>
          <Button variant="primary" danger>
            Danger
          </Button>
          <Button variant="link" href="https://example.com">
            Link
          </Button>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <p className="mb-3 text-content-secondary">
          Tailwind-like sizes with and without icons.
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
            <div
              key={size}
              className="rounded-lg border border-surface-border p-3"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Button size={size}>Size {size}</Button>
                <Button size={size} icon={<FiArrowRight />} iconPlacement="end">
                  With Icon
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold">Shapes</h3>
        <p className="mb-3 text-content-secondary">
          Default, rounded, and circle shapes.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button shape="default">Default</Button>
          <Button shape="round">Round</Button>
          <Button shape="circle" icon={<FiPlus />} aria-label="Add" />
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold">Icons</h3>
        <p className="mb-3 text-content-secondary">
          Start/end icons and iconPlacement.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button icon={<FiPlus />} iconPlacement="start">
            Start
          </Button>
          <Button icon={<FiArrowRight />} iconPlacement="end">
            End
          </Button>
          <Button startIcon={<FiPlus />} endIcon={<FiX />}>
            Both
          </Button>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold">Block</h3>
        <p className="mb-3 text-content-secondary">
          Stretch button to full container width.
        </p>
        <div className="w-[280px] border border-dashed border-surface-border p-2">
          <Button block>Block Button</Button>
        </div>
      </section>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => {
    const [state, setState] = useState<
      'idle' | 'loading' | 'success' | 'error'
    >('idle');

    useEffect(() => {
      if (state === 'success' || state === 'error') {
        const timeout = setTimeout(() => setState('idle'), 5000);
        return () => clearTimeout(timeout);
      }

      return undefined;
    }, [state]);

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-surface-border px-3 py-1 text-sm"
            onClick={() => setState('idle')}
          >
            Idle
          </button>
          <button
            type="button"
            className="rounded-md border border-surface-border px-3 py-1 text-sm"
            onClick={() => setState('loading')}
          >
            Loading
          </button>
          <button
            type="button"
            className="rounded-md border border-surface-border px-3 py-1 text-sm"
            onClick={() => setState('success')}
          >
            Success
          </button>
          <button
            type="button"
            className="rounded-md border border-surface-border px-3 py-1 text-sm"
            onClick={() => setState('error')}
          >
            Error
          </button>
        </div>

        <Button
          loadingState={state}
          loadingText="Saving..."
          successText="Saved"
          errorText="Failed"
        >
          Save changes
        </Button>
      </div>
    );
  },
};
