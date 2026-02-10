import type { Meta, StoryObj } from '@storybook/react-vite';
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

const variants = [
  'default',
  'primary',
  'secondary',
  'ghost',
  'text',
  'link',
] as const;

export const Primary: Story = {};

export const Disabled: Story = {
  args: {
    isDisabled: true,
  },
};

export const States: Story = {
  render: () => (
    <div>
      <style>
        {`
          .sb-section { margin-bottom: 24px; }
          .sb-title { font-size: 18px; font-weight: 600; margin: 0 0 6px; }
          .sb-desc { margin: 0 0 12px; color: #4b5563; }
          .sb-row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
          .sb-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
          .sb-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
          .btn-table { border-collapse: collapse; width: 100%; }
          .btn-table th, .btn-table td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
          .btn-sim { padding: 6px 10px; border: 1px solid #d1d5db; background: #f9fafb; }
          .btn-hover { background: #f3f4f6; }
          .btn-active { background: #e5e7eb; }
          .btn-focus { outline: 2px solid #9ca3af; outline-offset: 2px; }
          .btn-disabled { opacity: 0.5; }
          .sb-block { width: 280px; border: 1px dashed #d1d5db; padding: 8px; }
        `}
      </style>
      <section className="sb-section">
        <h3 className="sb-title">Variants</h3>
        <p className="sb-desc">Visual styles and the danger flag.</p>
        <div className="sb-row">
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

      <section className="sb-section">
        <h3 className="sb-title">Sizes</h3>
        <p className="sb-desc">Tailwind-like sizes with and without icons.</p>
        <div className="sb-grid">
          {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map((size) => (
            <div key={size} className="sb-card">
              <div className="sb-row">
                <Button size={size}>Size {size}</Button>
                <Button size={size} icon={<FiArrowRight />} iconPlacement="end">
                  With Icon
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="sb-section">
        <h3 className="sb-title">Shapes</h3>
        <p className="sb-desc">Default, rounded, and circle shapes.</p>
        <div className="sb-row">
          <Button shape="default">Default</Button>
          <Button shape="round">Round</Button>
          <Button shape="circle" icon={<FiPlus />} aria-label="Add" />
        </div>
      </section>

      <section className="sb-section">
        <h3 className="sb-title">Icons</h3>
        <p className="sb-desc">Start/end icons and iconPlacement.</p>
        <div className="sb-row">
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

      <section className="sb-section">
        <h3 className="sb-title">Block</h3>
        <p className="sb-desc">Stretch button to full container width.</p>
        <div className="sb-block">
          <Button block>Block Button</Button>
        </div>
      </section>

      <section className="sb-section">
        <h3 className="sb-title">States Table</h3>
        <p className="sb-desc">Simulated visual states by className.</p>
        <table className="btn-table">
          <thead>
            <tr>
              <th>Variant</th>
              <th>Normal</th>
              <th>Hover</th>
              <th>Active</th>
              <th>Focus</th>
              <th>Disabled</th>
              <th>Loading</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((variant) => (
              <tr key={variant}>
                <td>{variant}</td>
                <td>
                  <Button
                    className="btn-sim"
                    variant={variant}
                    href={
                      variant === 'link' ? 'https://example.com' : undefined
                    }
                  >
                    Button
                  </Button>
                </td>
                <td>
                  <Button
                    className="btn-sim btn-hover"
                    variant={variant}
                    href={
                      variant === 'link' ? 'https://example.com' : undefined
                    }
                  >
                    Button
                  </Button>
                </td>
                <td>
                  <Button
                    className="btn-sim btn-active"
                    variant={variant}
                    href={
                      variant === 'link' ? 'https://example.com' : undefined
                    }
                  >
                    Button
                  </Button>
                </td>
                <td>
                  <Button
                    className="btn-sim btn-focus"
                    variant={variant}
                    href={
                      variant === 'link' ? 'https://example.com' : undefined
                    }
                  >
                    Button
                  </Button>
                </td>
                <td>
                  <Button
                    className="btn-sim btn-disabled"
                    variant={variant}
                    href={
                      variant === 'link' ? 'https://example.com' : undefined
                    }
                    isDisabled
                  >
                    Button
                  </Button>
                </td>
                <td>
                  <Button
                    className="btn-sim"
                    variant={variant}
                    href={
                      variant === 'link' ? 'https://example.com' : undefined
                    }
                    loading
                  >
                    Button
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  ),
};
