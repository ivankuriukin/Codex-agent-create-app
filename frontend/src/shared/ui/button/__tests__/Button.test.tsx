import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button } from '../Button';

describe('Button', () => {
  it('renders default state', () => {
    render(<Button>Click</Button>);
    const button = screen.getByRole('button', { name: 'Click' });
    expect(button).toHaveAttribute('data-pressed', 'false');
    expect(button).toHaveAttribute('data-focus-visible', 'false');
    expect(button).toHaveAttribute('data-hovered', 'false');
    expect(button).toHaveAttribute('data-disabled', 'false');
    expect(button).toHaveAttribute('data-loading', 'false');
  });

  it('sets hover state', async () => {
    const user = userEvent.setup();
    render(<Button>Hover</Button>);
    const button = screen.getByRole('button', { name: 'Hover' });
    await user.hover(button);
    expect(button).toHaveAttribute('data-hovered', 'true');
  });

  it('sets pressed state on pointer down', async () => {
    const user = userEvent.setup();
    render(<Button>Press</Button>);
    const button = screen.getByRole('button', { name: 'Press' });
    await user.pointer([{ target: button, keys: '[MouseLeft>]' }]);
    expect(button).toHaveAttribute('data-pressed', 'true');
    await user.pointer([{ target: button, keys: '[/MouseLeft]' }]);
    expect(button).toHaveAttribute('data-pressed', 'false');
  });

  it('sets focus-visible on keyboard focus', async () => {
    const user = userEvent.setup();
    render(<Button>Focus</Button>);
    await user.tab();
    const button = screen.getByRole('button', { name: 'Focus' });
    expect(button).toHaveAttribute('data-focus-visible', 'true');
  });

  it('marks disabled state', () => {
    render(<Button isDisabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: 'Disabled' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled', 'true');
  });

  it('marks loading state', () => {
    render(<Button loading>Load</Button>);
    const button = screen.getByText('Load').closest('button');
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button).toHaveAttribute('data-disabled', 'true');
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders icon placement', () => {
    render(
      <Button icon={<span>Icon</span>} iconPlacement="end">
        Label
      </Button>,
    );
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('renders link variant as anchor', () => {
    render(
      <Button variant="link" href="https://example.com">
        Link
      </Button>,
    );
    const link = screen.getByText('Link').closest('a');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });
});
